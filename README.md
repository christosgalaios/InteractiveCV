# Recruiter vs CV — Interactive Card Battle CV

A Hand of Fate and Hearthstone-inspired trading card battle game where recruiters play "objection" cards and the CV auto-counters them with "achievement" cards.

## Live Demo
**[Play the Duel here](https://christosgalaios.github.io/InteractiveCV/)**

## Concept
This project transforms a standard Senior Gameplay Programmer CV into an interactive experience. The goal is to dismantle every recruiter objection with proven technical achievements — framed as a card game.

## How It Works (No Unity Required)

This is a fully browser-native game — no Unity, no WebGL, no game engine. Everything runs on vanilla web technologies:

- **Cards are HTML elements**, styled with CSS and animated with CSS 3D transforms (`perspective`, `rotateX`, `rotateY`). The 3D tilt-on-hover and card flip effects are all CSS `transform-style: preserve-3d` — no WebGL needed.
- **Particle effects** (embers, clash bursts, card dust) run on a **2D Canvas** overlay, driven by a lightweight custom particle system with velocity, decay, and gravity.
- **Sound effects are procedurally synthesised** at runtime using the **Web Audio API** — oscillators, noise buffers, and gain envelopes. There are zero audio files in the project.
- **Drag-and-drop** card play uses vanilla JS pointer events with a ghost-clone for visual feedback.
- **Game state** is managed through a single JS module (`engine.js`) with closure-scoped state — no frameworks, no Redux, just clean vanilla JavaScript.

The result is a full card-battle experience that loads instantly in any modern browser with no plugins or installs.

## Multiplayer

Multiplayer is powered by **Socket.io** running on an **Express.js** server (hosted on Railway).

**How it works:**
1. The **host** opens the game on a screen (TV, laptop, projector) and creates a room — a 4-character room code is generated along with a QR code.
2. **Players** (up to 4) scan the QR code on their phones, which opens a lightweight mobile UI (`player.html`) and connects them to the room via WebSocket.
3. The server deals objection cards round-robin to each player's phone.
4. Each round has a **15-second picking phase** — players simultaneously choose a card on their phone.
5. The host screen then **resolves each card sequentially** with full animations: card flip, clash, damage, particles, and sound.
6. Each player has their own HP pool tracked server-side. Players get knocked out individually. The game ends when all players are eliminated or the CV runs out of counters.

All room state lives in-memory on the server — no database, no persistence. It's a real-time session-based experience.

## Features
- **Dark Fantasy Aesthetic** — Candlelight ambience, ornate card designs, dramatic lighting.
- **3D Card Interactions** — Perspective-based tilt on hover and smooth flip transitions.
- **Procedural FX** — Particle bursts, screen shake, and ambient embers via Canvas API.
- **Web Audio SFX** — Synthesised sound effects with no external audio files.
- **Gold Cards** — Special counter cards sourced from a real reference letter, with a golden glow effect.
- **Deck Viewer** — Browse the full recruiter deck, counter deck, and complete CV in a modal.
- **Surrender Mechanic** — Recruiters can surrender once they're convinced.
- **Narrator** — Typewriter-style commentary that reacts to game events.

## Tech Stack
- **HTML5 / CSS3** — Vanilla implementation with CSS variables, 3D transforms, and keyframe animations.
- **JavaScript (ES6+)** — Pure vanilla JS, no frameworks or libraries.
- **Canvas API** — Custom 2D particle system for visual effects.
- **Web Audio API** — Real-time procedural sound synthesis.
- **Socket.io** — WebSocket-based real-time multiplayer.
- **Express.js** — Lightweight Node server for static files and multiplayer rooms.
- **Railway** — Server hosting and deployment.

## How to Play
Open this link in any modern browser (recommended: Chrome):
[https://christosgalaios.github.io/InteractiveCV/](https://christosgalaios.github.io/InteractiveCV/)

---
*Created by Christos Galaios — Senior Gameplay Programmer.*
