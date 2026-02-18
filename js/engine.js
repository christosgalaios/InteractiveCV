// ============================================
// RECRUITER vs CV — Game Engine
// Features: HP system, Drag & Drop, Gold cards
// ============================================

const Game = (() => {
    // State
    let state = 'TITLE'; // TITLE | BATTLE | VICTORY
    let recruiterHand = [];
    let christosDeck = [];
    let goldDeck = [];
    let round = 0;
    let christosHP = 0;
    let recruiterHP = 0;
    let isAnimating = false;
    let battleObjCard = null;
    let battleCtrCard = null;
    let totalCards = 0;

    // Drag state
    let dragCard = null;
    let dragData = null;
    let dragClone = null;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    let isDragging = false;

    // DOM references
    const $ = id => document.getElementById(id);

    function init() {
        // Init subsystems
        Effects.init();

        // Bind title buttons
        $('btn-start-game').addEventListener('click', () => {
            AudioManager.init();
            AudioManager.click();
            AudioManager.ambient();
            startBattle();
        });

        $('btn-view-decks').addEventListener('click', () => {
            AudioManager.init();
            AudioManager.click();
            openDeckModal('recruiter-tab');
        });

        $('btn-linkedin').addEventListener('click', () => {
            AudioManager.init();
            AudioManager.click();
        });

        // Battle buttons
        $('btn-back-title').addEventListener('click', () => {
            AudioManager.click();
            switchScreen('title-screen');
            state = 'TITLE';
        });

        // Surrender button
        $('btn-surrender').addEventListener('click', () => {
            if (isAnimating) return;
            AudioManager.click();
            surrender();
        });

        // Victory buttons
        $('btn-play-again').addEventListener('click', () => {
            AudioManager.click();
            startBattle();
        });

        // Modal
        $('btn-close-modal').addEventListener('click', closeModal);
        $('deck-modal').addEventListener('click', (e) => {
            if (e.target === $('deck-modal')) closeModal();
        });

        // Modal tabs
        document.querySelectorAll('.modal-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                AudioManager.click();
                document.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                Cards.renderDeckPreview($('modal-body'), tab.dataset.tab);
            });
        });

        // Keyboard support
        document.addEventListener('keydown', handleKeydown);

        // Drag & drop global listeners
        document.addEventListener('mousemove', handleDragMove);
        document.addEventListener('mouseup', handleDragEnd);
        document.addEventListener('touchmove', handleTouchDragMove, { passive: false });
        document.addEventListener('touchend', handleTouchDragEnd);

        // Global click to hide preview if clicking outside cards
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.game-card') && !e.target.closest('.card-preview')) {
                Cards.hidePreview();
            }
        });
    }

    function handleKeydown(e) {
        if (state === 'TITLE' && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            AudioManager.init();
            AudioManager.click();
            AudioManager.ambient();
            startBattle();
        }
        // Escape to go back
        if (e.key === 'Escape') {
            if ($('deck-modal').classList.contains('active')) {
                closeModal();
            } else if (state === 'BATTLE') {
                AudioManager.click();
                switchScreen('title-screen');
                state = 'TITLE';
            }
        }
    }

    // ================================
    // Screen management
    // ================================
    function switchScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        $(screenId).classList.add('active');
    }

    // ================================
    // HP display
    // ================================
    function renderHP() {
        const christosHPEl = $('christos-hp');
        const recruiterHPEl = $('recruiter-hp');

        if (!christosHPEl || !recruiterHPEl) return;

        // Christos HP (golden hearts)
        let christosHTML = '';
        for (let i = 0; i < HP_CONFIG.christos; i++) {
            christosHTML += `<span class="heart ${i < christosHP ? 'heart-full' : 'heart-empty'}">♥</span>`;
        }
        christosHPEl.innerHTML = christosHTML;

        // Recruiter HP (red hearts)
        let recruiterHTML = '';
        for (let i = 0; i < HP_CONFIG.recruiter; i++) {
            recruiterHTML += `<span class="heart recruiter-heart ${i < recruiterHP ? 'heart-full' : 'heart-empty'}">♥</span>`;
        }
        recruiterHPEl.innerHTML = recruiterHTML;
    }

    // ================================
    // Battle setup
    // ================================
    function startBattle() {
        state = 'BATTLE';
        round = 0;
        christosHP = HP_CONFIG.christos;
        recruiterHP = HP_CONFIG.recruiter;
        isAnimating = false;

        // Shuffle and deal — split counter cards into regular and gold
        recruiterHand = shuffleArray([...OBJECTION_CARDS]);
        christosDeck = shuffleArray([...COUNTER_CARDS.filter(c => !c.isGold)]);
        goldDeck = shuffleArray([...COUNTER_CARDS.filter(c => c.isGold)]);
        totalCards = recruiterHand.length;

        switchScreen('battle-screen');
        updateScoreboard();
        updateDeckCounts();
        renderHP();
        clearBattleZone();
        dealHand();

        narratorTypewrite(NARRATOR_LINES.intro[0], () => {
            setTimeout(() => {
                narratorTypewrite(NARRATOR_LINES.intro[2]);
            }, 1500);
        });
    }

    function shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    // ================================
    // Hand management with Drag & Drop
    // ================================
    function dealHand() {
        const hand = $('recruiter-hand');
        hand.innerHTML = '';

        recruiterHand.forEach((cardData, idx) => {
            const cardEl = Cards.createObjectionCard(cardData, { animate: true });
            cardEl.style.animationDelay = `${idx * 0.08}s`;

            // Click to play (desktop: instant if hovered; mobile: tap to preview, tap again to play)
            cardEl.addEventListener('click', (e) => {
                if (isDragging) return;

                // Check if card is currently receiving focus/preview
                if (!Cards.isCardPreviewActive(cardEl)) {
                    Cards.showPreview(cardData, 'objection', cardEl);
                    e.stopPropagation();
                    return;
                }

                playObjection(cardData, cardEl);
            });
            cardEl.addEventListener('mouseenter', () => AudioManager.hover());

            // Drag start (mouse)
            cardEl.addEventListener('mousedown', (e) => {
                if (isAnimating) return;
                startDrag(e, cardData, cardEl);
            });

            // Drag start (touch)
            cardEl.addEventListener('touchstart', (e) => {
                if (isAnimating) return;
                const touch = e.touches[0];
                startDrag(touch, cardData, cardEl);
            }, { passive: false });

            hand.appendChild(cardEl);
        });
    }

    // ================================
    // Drag & Drop — Hearthstone-style
    // ================================
    function startDrag(e, cardData, cardEl) {
        if (isAnimating) return;
        dragCard = cardEl;
        dragData = cardData;
        isDragging = false;

        const rect = cardEl.getBoundingClientRect();
        dragOffsetX = e.clientX - rect.left;
        dragOffsetY = e.clientY - rect.top;

        // We delay creating the clone until we've moved a bit (to distinguish from click)
        dragCard._startX = e.clientX;
        dragCard._startY = e.clientY;
    }

    function handleDragMove(e) {
        if (!dragCard) return;

        const dx = e.clientX - (dragCard._startX || 0);
        const dy = e.clientY - (dragCard._startY || 0);
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 8 && !isDragging) {
            isDragging = true;
            // Create floating clone
            dragClone = dragCard.cloneNode(true);
            dragClone.classList.add('drag-clone');
            dragClone.style.width = dragCard.offsetWidth + 'px';
            dragClone.style.height = dragCard.offsetHeight + 'px';
            document.body.appendChild(dragClone);
            dragCard.classList.add('drag-origin');

            // Show drop zone highlight
            $('slot-objection').classList.add('drop-target-active');
        }

        if (isDragging && dragClone) {
            dragClone.style.left = (e.clientX - dragOffsetX) + 'px';
            dragClone.style.top = (e.clientY - dragOffsetY) + 'px';

            // Check proximity to drop zone
            const dropZone = $('slot-objection');
            const dropRect = dropZone.getBoundingClientRect();
            const cloneRect = dragClone.getBoundingClientRect();
            const isOver = !(cloneRect.right < dropRect.left || cloneRect.left > dropRect.right || cloneRect.bottom < dropRect.top || cloneRect.top > dropRect.bottom);

            dropZone.classList.toggle('drop-target-hover', isOver);
        }
    }

    function handleTouchDragMove(e) {
        if (!dragCard) return;
        e.preventDefault();
        const touch = e.touches[0];
        handleDragMove({ clientX: touch.clientX, clientY: touch.clientY });
    }

    function handleDragEnd(e) {
        if (!dragCard) return;

        if (isDragging && dragClone) {
            // Check if dropped on the battle zone
            const dropZone = $('slot-objection');
            const dropRect = dropZone.getBoundingClientRect();
            const cloneRect = dragClone.getBoundingClientRect();
            const isOver = !(cloneRect.right < dropRect.left || cloneRect.left > dropRect.right || cloneRect.bottom < dropRect.top || cloneRect.top > dropRect.bottom);

            // Cleanup
            dragClone.remove();
            dragClone = null;
            dragCard.classList.remove('drag-origin');
            dropZone.classList.remove('drop-target-active', 'drop-target-hover');

            if (isOver) {
                playObjection(dragData, dragCard);
            }
        }

        dragCard = null;
        dragData = null;
        // Reset isDragging after a short delay so the click handler can check it
        setTimeout(() => { isDragging = false; }, 50);
    }

    function handleTouchDragEnd(e) {
        handleDragEnd(e);
    }

    // ================================
    // Battle logic
    // ================================
    function playObjection(cardData, cardEl) {
        if (isAnimating) return;
        isAnimating = true;
        round++;

        AudioManager.cardSlam();

        // Remove card from hand
        const idx = recruiterHand.findIndex(c => c.id === cardData.id);
        if (idx > -1) recruiterHand.splice(idx, 1);

        // Animate card to battle zone
        const slotObj = $('slot-objection');

        // Remove the card from hand with animation
        cardEl.style.transition = 'opacity 0.3s, transform 0.3s';
        cardEl.style.opacity = '0';
        cardEl.style.transform = 'translateY(-40px) scale(0.8)';

        setTimeout(() => {
            cardEl.remove();

            // Place battle-sized objection card in slot
            clearBattleZone();
            battleObjCard = Cards.createObjectionCard(cardData, { battleSize: true });
            battleObjCard.classList.add('card-counter-anim');
            battleObjCard.style.cursor = 'default';
            slotObj.appendChild(battleObjCard);
            slotObj.querySelector('.slot-outline').style.display = 'none';

            AudioManager.cardSlam();
            Effects.screenShake();

            // Narrator
            narratorTypewrite(`The recruiter plays: "${cardData.title}"...`);

            // After a beat, counter
            setTimeout(() => counterWithCard(cardData), 1500);

        }, 350);

        updateDeckCounts();
        updateScoreboard();
    }

    function counterWithCard(objectionData) {
        // Find matching counter — check regular deck first, then gold deck
        let counter = christosDeck.find(c => c.counters === objectionData.id);
        let isGoldCounter = false;

        if (!counter) {
            // Check gold deck for a matching counter
            counter = goldDeck.find(c => c.counters === objectionData.id);
            if (counter) {
                isGoldCounter = true;
            }
        }

        if (!counter) {
            // No specific counter — play a random gold card as bonus if available
            if (goldDeck.length > 0) {
                counter = goldDeck[0];
                isGoldCounter = true;
            }
        }

        if (!counter) {
            // No counter found — recruiter wins this round, Christos loses 1 HP
            christosHP = Math.max(0, christosHP - 1);
            updateScoreboard();
            renderHP();
            narratorTypewrite("No answer found... The recruiter's objection lands!");

            if (christosHP <= 0) {
                setTimeout(() => endGame(false, true), 2000); // christos loses
                return;
            }

            setTimeout(() => finishRound(), 2000);
            return;
        }

        // Remove from appropriate deck
        if (isGoldCounter) {
            const idx = goldDeck.findIndex(c => c.id === counter.id);
            if (idx > -1) goldDeck.splice(idx, 1);
        } else {
            const idx = christosDeck.findIndex(c => c.id === counter.id);
            if (idx > -1) christosDeck.splice(idx, 1);
        }

        // Narrator for gold cards
        if (isGoldCounter) {
            const goldLine = NARRATOR_LINES.goldCard[Math.floor(Math.random() * NARRATOR_LINES.goldCard.length)];
            narratorTypewrite(goldLine);
        }

        // Place face-down card, then flip
        const slotCtr = $('slot-counter');
        battleCtrCard = Cards.createCounterCard(counter, { battleSize: true, faceDown: true });
        battleCtrCard.classList.add('card-counter-anim');
        battleCtrCard.style.cursor = 'default';
        slotCtr.appendChild(battleCtrCard);
        slotCtr.querySelector('.slot-outline').style.display = 'none';

        AudioManager.cardFlip();

        // Flip after short delay
        setTimeout(() => {
            Cards.flipCard(battleCtrCard);
            AudioManager.cardFlip();

            // Clash after flip completes
            setTimeout(() => resolveClash(objectionData, counter), 800);
        }, 600);

        updateDeckCounts();
    }

    function resolveClash(objection, counter) {
        // Show clash effect
        const overlay = $('clash-overlay');
        const resultText = $('clash-result-text');

        // Counter always wins if power >= objection power
        const counterWins = counter.power >= objection.power;

        if (counterWins) {
            // Recruiter loses HP based on power difference
            const dmg = Math.max(1, counter.power - objection.power);
            recruiterHP = Math.max(0, recruiterHP - dmg);
            resultText.textContent = counter.isGold ? '✦ GOLD COUNTER' : 'COUNTERED';
            resultText.style.color = counter.isGold ? '#ffd700' : '#f5d98a';
        } else {
            christosHP = Math.max(0, christosHP - 1);
            resultText.textContent = 'RESISTED';
            resultText.style.color = '#f06050';
        }

        // Effects
        AudioManager.clash();
        Effects.screenShake();

        const battleZone = $('battle-zone');
        const center = Effects.getCenter(battleZone);
        const burstColor = counter.isGold ? '#ffd700' : (counterWins ? '#e0b44a' : '#d44030');
        const sparkColor = counter.isGold ? '#fff4b3' : (counterWins ? '#f5d98a' : '#ff8a80');
        Effects.spawnBurst(center.x, center.y, 45, burstColor);
        Effects.spawnSparks(center.x, center.y, 25, sparkColor);

        // Show overlay
        overlay.classList.add('active');
        setTimeout(() => overlay.classList.remove('active'), 1200);

        updateScoreboard();
        renderHP();

        // Narrator explains
        const narratorMsg = counterWins
            ? `${counter.title}: "${counter.description}"`
            : `The objection holds... but barely.`;

        setTimeout(() => {
            narratorTypewrite(narratorMsg);

            // Destroy the losing card
            setTimeout(() => {
                if (counterWins && battleObjCard) {
                    const pos = Effects.getCenter(battleObjCard);
                    battleObjCard.classList.add('card-destroyed');
                    Effects.spawnCardDust(pos.x, pos.y, '#d44030');
                    AudioManager.cardDestroy();
                }
                if (!counterWins && battleCtrCard) {
                    const pos = Effects.getCenter(battleCtrCard);
                    battleCtrCard.classList.add('card-destroyed');
                    Effects.spawnCardDust(pos.x, pos.y, '#30b868');
                    AudioManager.cardDestroy();
                }

                // Victory card glows
                if (counterWins && battleCtrCard) {
                    battleCtrCard.classList.add('card-victory-anim');
                }
                if (!counterWins && battleObjCard) {
                    battleObjCard.classList.add('card-victory-anim');
                }

                // Check for HP-based game end
                if (recruiterHP <= 0) {
                    setTimeout(() => endGame(false, false), 1200);
                    return;
                }
                if (christosHP <= 0) {
                    setTimeout(() => endGame(false, true), 1200);
                    return;
                }

                setTimeout(() => finishRound(), 1800);
            }, 1500);
        }, 200);
    }

    function finishRound() {
        $('round-display').textContent = `Round ${Math.min(round + 1, totalCards)} / ${totalCards}`;

        // Check for game end — out of cards
        if (recruiterHand.length === 0) {
            setTimeout(() => endGame(false, false), 800);
            return;
        }

        // Low HP narrator
        if (recruiterHP <= 3 && recruiterHP > 0) {
            const line = NARRATOR_LINES.lowHP[Math.min(3 - recruiterHP, NARRATOR_LINES.lowHP.length - 1)];
            narratorTypewrite(line);
        } else if (recruiterHand.length <= 3 && recruiterHand.length > 0) {
            const line = NARRATOR_LINES.lowCards[Math.min(3 - recruiterHand.length, NARRATOR_LINES.lowCards.length - 1)];
            narratorTypewrite(line);
        }

        // Clear battle zone and allow next play
        setTimeout(() => {
            clearBattleZone();
            isAnimating = false;
        }, 500);
    }

    // ================================
    // Surrender
    // ================================
    function surrender() {
        isAnimating = true;

        // Recruiter HP drops to 0
        recruiterHP = 0;
        recruiterHand = [];

        renderHP();

        narratorTypewrite(NARRATOR_LINES.surrender[0], () => {
            setTimeout(() => {
                narratorTypewrite(NARRATOR_LINES.surrender[2], () => {
                    setTimeout(() => endGame(true, false), 1200);
                });
            }, 1200);
        });

        updateScoreboard();
        updateDeckCounts();
    }

    // ================================
    // End game
    // ================================
    function endGame(wasSurrender, christosLost) {
        state = 'VICTORY';

        let titleText, subtitleText;
        if (christosLost) {
            titleText = 'CV DEFEATED';
            subtitleText = 'A rare defeat... but the CV will return stronger.';
        } else if (wasSurrender) {
            titleText = 'RECRUITER SURRENDERS';
            subtitleText = 'Convinced. No further objections needed.';
        } else if (recruiterHP <= 0) {
            titleText = 'RECRUITER HP DEPLETED';
            subtitleText = 'Every objection countered. Every doubt dismantled.';
        } else {
            titleText = 'OBJECTIONS EXHAUSTED';
            subtitleText = 'The recruiter ran out of objections.';
        }

        // Update victory screen content
        document.querySelector('.victory-title').textContent = titleText;
        document.querySelector('.victory-subtitle').textContent = subtitleText;

        $('v-christos-score').textContent = christosHP;
        $('v-recruiter-score').textContent = recruiterHP;
        $('v-rounds').textContent = round;

        // Update victory stat labels
        const statLabels = document.querySelectorAll('.v-stat-label');
        if (statLabels.length >= 2) {
            statLabels[0].textContent = 'Christos HP';
            statLabels[1].textContent = 'Recruiter HP';
        }

        AudioManager.victory();
        switchScreen('victory-screen');

        // Big particle burst
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        if (!christosLost) {
            Effects.spawnBurst(cx, cy, 60, '#e0b44a');
            Effects.spawnBurst(cx, cy, 40, '#f5d98a');
            Effects.spawnSparks(cx, cy, 35, '#ffbe0b');
        } else {
            Effects.spawnBurst(cx, cy, 40, '#d44030');
            Effects.spawnSparks(cx, cy, 25, '#ff8a80');
        }
    }

    // ================================
    // UI helpers
    // ================================
    function clearBattleZone() {
        const slotObj = $('slot-objection');
        const slotCtr = $('slot-counter');

        slotObj.querySelectorAll('.game-card').forEach(c => c.remove());
        slotCtr.querySelectorAll('.game-card').forEach(c => c.remove());

        slotObj.querySelector('.slot-outline').style.display = '';
        slotCtr.querySelector('.slot-outline').style.display = '';

        battleObjCard = null;
        battleCtrCard = null;
    }

    function updateScoreboard() {
        $('christos-score').textContent = christosHP;
        $('recruiter-score').textContent = recruiterHP;
        $('round-display').textContent = `Round ${round} / ${totalCards}`;
    }

    function updateDeckCounts() {
        $('christos-deck-count').textContent = christosDeck.length + goldDeck.length;
        $('recruiter-deck-count').textContent = recruiterHand.length;
    }

    // ================================
    // Narrator typewriter
    // ================================
    let narratorTimeout = null;

    function narratorTypewrite(text, callback) {
        const el = $('narrator-text');
        if (narratorTimeout) {
            clearTimeout(narratorTimeout);
            narratorTimeout = null;
        }
        el.innerHTML = '';

        let i = 0;
        function type() {
            if (i < text.length) {
                el.textContent = text.substring(0, i + 1);
                el.innerHTML += '<span class="narrator-cursor"></span>';
                AudioManager.narrator();
                i++;
                narratorTimeout = setTimeout(type, 22 + Math.random() * 12);
            } else {
                el.textContent = text;
                if (callback) callback();
            }
        }
        type();
    }

    // ================================
    // Modal
    // ================================
    function openDeckModal(tab) {
        $('deck-modal').classList.add('active');
        document.querySelectorAll('.modal-tab').forEach(t => {
            t.classList.toggle('active', t.dataset.tab === tab);
        });
        Cards.renderDeckPreview($('modal-body'), tab);
    }

    function closeModal() {
        AudioManager.click();
        $('deck-modal').classList.remove('active');
    }

    return { init };
})();

// ============================================
// Boot
// ============================================
document.addEventListener('DOMContentLoaded', Game.init);
