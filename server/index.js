console.log('=== SERVER SCRIPT STARTING ===');

// ============================================
// Recruiter vs CV — Multiplayer Server
// Express + Socket.io
// ============================================

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION:', err.stack || err);
  process.exit(1);
});
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION:', err.stack || err);
  process.exit(1);
});

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

// Debug: log resolved paths on startup
const staticRoot = path.join(__dirname, '..');
const fs = require('fs');
console.log('__dirname:', __dirname);
console.log('Static root:', staticRoot);
try {
  console.log('Static root contents:', fs.readdirSync(staticRoot).join(', '));
} catch (e) {
  console.log('ERROR reading static root:', e.message);
}

// Health check
app.get('/health', (req, res) => res.send('ok'));

// Log all incoming requests for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Serve static files from the project root (parent directory)
app.use(express.static(staticRoot));

const PORT = process.env.PORT || 3000;

// ============================================
// Room state
// ============================================
const rooms = {};

function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no ambiguous chars
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  // Ensure unique
  if (rooms[code]) return generateRoomCode();
  return code;
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Build playerHps map for broadcast
function buildPlayerHps(room) {
  const playerHps = {};
  room.players.forEach(p => {
    playerHps[p.id] = { hp: p.hp, name: p.name, knockedOut: p.knockedOut };
  });
  return playerHps;
}

// ============================================
// Socket.io event handling
// ============================================
io.on('connection', (socket) => {
  console.log(`Connected: ${socket.id}`);

  // --- HOST: Create a room ---
  socket.on('create-room', () => {
    const code = generateRoomCode();
    rooms[code] = {
      host: socket.id,
      players: [],
      christosDeck: [],
      goldDeck: [],
      christosHP: 1,
      playerStartHP: 10,
      round: 0,
      phase: 'LOBBY',
      currentPicks: {},
      totalCards: 0,
      cardQueue: [],
      resolvedCount: 0
    };
    socket.join(code);
    socket.roomCode = code;
    socket.isHost = true;
    socket.emit('room-created', { code });
    console.log(`Room ${code} created by ${socket.id}`);
  });

  // --- PLAYER: Join a room ---
  socket.on('join-room', ({ code, name }) => {
    const upperCode = (code || '').toUpperCase();
    const room = rooms[upperCode];
    if (!room) {
      socket.emit('join-error', { message: 'Room not found. Check the code and try again.' });
      return;
    }
    if (room.phase !== 'LOBBY') {
      socket.emit('join-error', { message: 'Game already in progress.' });
      return;
    }
    if (room.players.length >= 4) {
      socket.emit('join-error', { message: 'Room is full (max 4 players).' });
      return;
    }

    const player = {
      id: socket.id,
      name: name || `Player ${room.players.length + 1}`,
      hand: [],
      hp: 0,          // set when game starts
      knockedOut: false,
      connected: true
    };
    room.players.push(player);

    socket.join(upperCode);
    socket.roomCode = upperCode;
    socket.isHost = false;
    socket.playerName = player.name;

    // Include playerId so the phone knows its own server ID
    socket.emit('joined', { playerIndex: room.players.length - 1, name: player.name, playerId: socket.id });

    // Notify host
    io.to(room.host).emit('player-joined', {
      name: player.name,
      playerCount: room.players.length,
      players: room.players.map(p => ({ id: p.id, name: p.name, connected: p.connected }))
    });

    console.log(`${player.name} joined room ${upperCode} (${room.players.length} players)`);
  });

  // --- HOST: Start the game ---
  socket.on('start-game', () => {
    const room = rooms[socket.roomCode];
    if (!room || room.host !== socket.id) return;
    if (room.players.length === 0) return;

    room.phase = 'DEALING';
    io.to(socket.roomCode).emit('game-starting');
  });

  // Host sends card data for dealing
  socket.on('deal-cards', ({ objectionCards, counterCards, playerHP }) => {
    const room = rooms[socket.roomCode];
    if (!room || room.host !== socket.id) return;

    const startHP = playerHP || room.playerStartHP;
    room.playerStartHP = startHP;

    // Shuffle objection cards and deal evenly
    const shuffled = shuffleArray(objectionCards);
    const playerCount = room.players.length;
    room.totalCards = shuffled.length;

    // Initialise each player's hand and HP
    room.players.forEach(p => {
      p.hand = [];
      p.hp = startHP;
      p.knockedOut = false;
    });

    shuffled.forEach((card, i) => {
      room.players[i % playerCount].hand.push(card);
    });

    // Store counter decks on server
    room.christosDeck = counterCards.filter(c => !c.isGold);
    room.goldDeck = counterCards.filter(c => c.isGold);
    room.christosHP = 1;
    room.round = 0;
    room.phase = 'PICKING';

    // Send each player their hand + own HP + own ID
    room.players.forEach(p => {
      io.to(p.id).emit('game-started', {
        hand: p.hand,
        totalPlayers: playerCount,
        myHP: startHP,
        myPlayerId: p.id
      });
    });

    // Tell host to start first picking phase
    io.to(room.host).emit('round-start', {
      roundNumber: 1,
      playerCount: room.players.filter(p => p.connected).length,
      players: room.players.map(p => ({
        id: p.id, name: p.name, connected: p.connected,
        cardsLeft: p.hand.length, hp: p.hp, knockedOut: p.knockedOut
      }))
    });

    startPickingPhase(socket.roomCode);
    console.log(`Game started in room ${socket.roomCode} with ${playerCount} players, ${startHP} HP each`);
  });

  // --- PLAYER: Pick a card ---
  socket.on('pick-card', ({ cardId }) => {
    const room = rooms[socket.roomCode];
    if (!room || room.phase !== 'PICKING') return;

    const player = room.players.find(p => p.id === socket.id);
    if (!player || player.knockedOut) return;

    // Validate the card is in player's hand
    const cardIdx = player.hand.findIndex(c => c.id === cardId);
    if (cardIdx === -1) return;

    const cardData = player.hand[cardIdx];
    room.currentPicks[socket.id] = { playerName: player.name, playerId: socket.id, cardData };

    // Remove from hand
    player.hand.splice(cardIdx, 1);

    socket.emit('pick-confirmed', { cardId });

    // Notify host about this pick
    io.to(room.host).emit('player-picked', {
      playerName: player.name,
      pickedCount: Object.keys(room.currentPicks).length,
      totalPlayers: room.players.filter(p => p.connected && !p.knockedOut).length,
      players: room.players.map(p => ({
        id: p.id, name: p.name,
        picked: !!room.currentPicks[p.id],
        connected: p.connected, hp: p.hp, knockedOut: p.knockedOut
      }))
    });

    // Check if all connected, non-KO players with cards have picked
    checkAllPicked(socket.roomCode);
  });

  // --- HOST: Finished animating one card ---
  socket.on('card-resolved', ({ playerId, playerHpLost, christosHpLost }) => {
    const room = rooms[socket.roomCode];
    if (!room) return;

    // Apply Christos HP damage
    room.christosHP = Math.max(0, room.christosHP - (christosHpLost || 0));

    // Apply damage to the specific player who played the card
    if (playerId && playerHpLost > 0) {
      const player = room.players.find(p => p.id === playerId);
      if (player && !player.knockedOut) {
        player.hp = Math.max(0, player.hp - playerHpLost);
        if (player.hp <= 0) {
          player.knockedOut = true;
          io.to(player.id).emit('knocked-out', { name: player.name });
          io.to(room.host).emit('player-knocked-out', { name: player.name });
          console.log(`${player.name} knocked out in room ${socket.roomCode}`);
        }
      }
    }

    room.resolvedCount++;

    // Build updated HP map and notify everyone
    const playerHps = buildPlayerHps(room);
    room.players.forEach(p => {
      if (p.connected) {
        io.to(p.id).emit('round-result', { playerHps, christosHP: room.christosHP });
      }
    });

    // Check game-over conditions
    const connectedPlayers = room.players.filter(p => p.connected);
    const allKnockedOut = connectedPlayers.length > 0 && connectedPlayers.every(p => p.knockedOut);
    if (allKnockedOut || room.christosHP <= 0) {
      endGame(socket.roomCode, room.christosHP);
      return;
    }

    // Send next card in queue
    if (room.cardQueue.length > 0) {
      const next = room.cardQueue.shift();
      io.to(room.host).emit('play-card', next);
    } else {
      // All cards resolved for this round
      io.to(room.host).emit('all-resolved');

      // Check if any active players still have cards
      const anyCardsLeft = room.players.some(p => p.connected && !p.knockedOut && p.hand.length > 0);
      if (!anyCardsLeft) {
        endGame(socket.roomCode, room.christosHP);
        return;
      }

      // Start next round
      room.round++;
      room.phase = 'PICKING';
      room.currentPicks = {};
      room.resolvedCount = 0;

      io.to(room.host).emit('round-start', {
        roundNumber: room.round + 1,
        playerCount: room.players.filter(p => p.connected && !p.knockedOut).length,
        players: room.players.map(p => ({
          id: p.id, name: p.name, connected: p.connected,
          cardsLeft: p.hand.length, hp: p.hp, knockedOut: p.knockedOut
        }))
      });

      startPickingPhase(socket.roomCode);
    }
  });

  // --- Disconnect handling ---
  socket.on('disconnect', () => {
    console.log(`Disconnected: ${socket.id}`);
    const code = socket.roomCode;
    if (!code || !rooms[code]) return;
    const room = rooms[code];

    if (socket.isHost) {
      // Host disconnected — end the game
      room.players.forEach(p => {
        io.to(p.id).emit('host-disconnected');
      });
      delete rooms[code];
      console.log(`Room ${code} closed (host left)`);
      return;
    }

    // Player disconnected
    const player = room.players.find(p => p.id === socket.id);
    if (player) {
      player.connected = false;
      console.log(`${player.name} disconnected from room ${code}`);

      // Notify host
      io.to(room.host).emit('player-left', {
        name: player.name,
        playerCount: room.players.filter(p => p.connected).length,
        players: room.players.map(p => ({
          id: p.id, name: p.name, connected: p.connected, hp: p.hp, knockedOut: p.knockedOut
        }))
      });

      // If in picking phase, check if remaining players have all picked
      if (room.phase === 'PICKING') {
        delete room.currentPicks[socket.id];
        checkAllPicked(code);
      }
    }
  });
});

// ============================================
// Game phase helpers
// ============================================
function startPickingPhase(code) {
  const room = rooms[code];
  if (!room) return;

  room.currentPicks = {};
  room.cardQueue = [];
  room.resolvedCount = 0;

  // Tell eligible players to pick (skip knocked-out)
  let anyCanPick = false;
  room.players.forEach(p => {
    if (!p.connected || p.knockedOut) return;
    if (p.hand.length > 0) {
      anyCanPick = true;
      io.to(p.id).emit('pick-phase', {
        timeLimit: 15,
        hand: p.hand,
        cardsLeft: p.hand.length
      });
    } else {
      io.to(p.id).emit('no-cards-left');
    }
  });

  if (!anyCanPick) {
    endGame(code, room.christosHP);
    return;
  }

  // Start countdown timer
  if (room.pickTimer) clearTimeout(room.pickTimer);
  room.pickTimer = setTimeout(() => {
    if (room.phase === 'PICKING') {
      forceResolvePicks(code);
    }
  }, 17000); // 15s + 2s buffer
}

function checkAllPicked(code) {
  const room = rooms[code];
  if (!room || room.phase !== 'PICKING') return;

  // Only count connected, non-knocked-out players
  const eligiblePlayers = room.players.filter(p => p.connected && !p.knockedOut);
  const allPicked = eligiblePlayers.every(p =>
    room.currentPicks[p.id] || p.hand.length === 0
  );

  if (allPicked && Object.keys(room.currentPicks).length > 0) {
    if (room.pickTimer) clearTimeout(room.pickTimer);
    startResolvingPhase(code);
  }
}

function forceResolvePicks(code) {
  const room = rooms[code];
  if (!room || room.phase !== 'PICKING') return;

  // Auto-pick for eligible players who haven't picked yet
  room.players.forEach(p => {
    if (p.connected && !p.knockedOut && !room.currentPicks[p.id] && p.hand.length > 0) {
      const randomIdx = Math.floor(Math.random() * p.hand.length);
      const card = p.hand[randomIdx];
      room.currentPicks[p.id] = { playerName: p.name, playerId: p.id, cardData: card };
      p.hand.splice(randomIdx, 1);
      io.to(p.id).emit('pick-confirmed', { cardId: card.id, auto: true });
    }
  });

  if (Object.keys(room.currentPicks).length > 0) {
    startResolvingPhase(code);
  } else {
    endGame(code, room.christosHP);
  }
}

function startResolvingPhase(code) {
  const room = rooms[code];
  if (!room) return;
  room.phase = 'RESOLVING';

  // Build the queue of cards to resolve (each pick includes playerId)
  const picks = Object.values(room.currentPicks);
  room.cardQueue = picks.slice(1);

  // Notify players about resolving
  const pickSummary = picks.map(p => ({ playerName: p.playerName, cardTitle: p.cardData.title }));
  room.players.forEach(p => {
    if (p.connected) {
      io.to(p.id).emit('resolving', { picks: pickSummary });
    }
  });

  // Send first card to host (includes playerId for damage routing)
  if (picks.length > 0) {
    io.to(room.host).emit('play-card', picks[0]);
  }
}

function endGame(code, christosHP) {
  const room = rooms[code];
  if (!room) return;
  room.phase = 'VICTORY';

  const playerHps = buildPlayerHps(room);
  const result = { christosHP, playerHps, rounds: room.round + 1 };

  io.to(room.host).emit('game-over', result);
  room.players.forEach(p => {
    if (p.connected) {
      io.to(p.id).emit('game-over', result);
    }
  });

  // Clean up timer
  if (room.pickTimer) clearTimeout(room.pickTimer);

  // Don't delete room immediately — let players see results
  setTimeout(() => {
    delete rooms[code];
    console.log(`Room ${code} cleaned up`);
  }, 60000);
}

// ============================================
// Start server
// ============================================
server.listen(PORT, () => {
  console.log(`CV Game Server running on port ${PORT}`);
  console.log('=== SERVER READY TO ACCEPT CONNECTIONS ===');
});
