// ============================================
// RECRUITER vs CV — Game Engine (Updated)
// ============================================

const Game = (() => {
    // State
    let state = 'TITLE'; // TITLE | BATTLE | VICTORY
    let recruiterHand = [];
    let christosDeck = [];
    let round = 0;
    let christosScore = 0;
    let recruiterScore = 0;
    let isAnimating = false;
    let battleObjCard = null;
    let battleCtrCard = null;
    let totalCards = 0;

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
    // Battle setup
    // ================================
    function startBattle() {
        state = 'BATTLE';
        round = 0;
        christosScore = 0;
        recruiterScore = 0;
        isAnimating = false;

        // Shuffle and deal
        recruiterHand = shuffleArray([...OBJECTION_CARDS]);
        christosDeck = [...COUNTER_CARDS];
        totalCards = recruiterHand.length;

        switchScreen('battle-screen');
        updateScoreboard();
        updateDeckCounts();
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
    // Hand management
    // ================================
    function dealHand() {
        const hand = $('recruiter-hand');
        hand.innerHTML = '';

        recruiterHand.forEach((cardData, idx) => {
            const cardEl = Cards.createObjectionCard(cardData, { animate: true });
            cardEl.style.animationDelay = `${idx * 0.08}s`;

            cardEl.addEventListener('click', () => playObjection(cardData, cardEl));
            cardEl.addEventListener('mouseenter', () => AudioManager.hover());

            hand.appendChild(cardEl);
        });
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
        // Find matching counter
        const counter = christosDeck.find(c => c.counters === objectionData.id);
        if (!counter) {
            // No counter found — recruiter wins this round
            recruiterScore++;
            updateScoreboard();
            narratorTypewrite("No answer found... The recruiter scores a point.");
            setTimeout(() => finishRound(), 2000);
            return;
        }

        // Remove from Christos' deck
        const idx = christosDeck.findIndex(c => c.id === counter.id);
        if (idx > -1) christosDeck.splice(idx, 1);

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

        // Counter always wins (CV is strong!)
        const counterWins = counter.power >= objection.power;

        if (counterWins) {
            christosScore++;
            resultText.textContent = 'COUNTERED';
            resultText.style.color = '#f5d98a';
        } else {
            recruiterScore++;
            resultText.textContent = 'RESISTED';
            resultText.style.color = '#f06050';
        }

        // Effects
        AudioManager.clash();
        Effects.screenShake();

        const battleZone = $('battle-zone');
        const center = Effects.getCenter(battleZone);
        Effects.spawnBurst(center.x, center.y, 45, counterWins ? '#e0b44a' : '#d44030');
        Effects.spawnSparks(center.x, center.y, 25, counterWins ? '#f5d98a' : '#ff8a80');

        // Show overlay
        overlay.classList.add('active');
        setTimeout(() => overlay.classList.remove('active'), 1200);

        updateScoreboard();

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

                setTimeout(() => finishRound(), 1800);
            }, 1500);
        }, 200);
    }

    function finishRound() {
        $('round-display').textContent = `Round ${Math.min(round + 1, totalCards)} / ${totalCards}`;

        // Check for game end
        if (recruiterHand.length === 0) {
            setTimeout(() => endGame(false), 800);
            return;
        }

        // Low card narrator
        if (recruiterHand.length <= 3 && recruiterHand.length > 0) {
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

        // Award remaining rounds to Christos
        christosScore += recruiterHand.length;
        recruiterHand = [];

        narratorTypewrite(NARRATOR_LINES.surrender[0], () => {
            setTimeout(() => {
                narratorTypewrite(NARRATOR_LINES.surrender[2], () => {
                    setTimeout(() => endGame(true), 1200);
                });
            }, 1200);
        });

        updateScoreboard();
        updateDeckCounts();
    }

    // ================================
    // End game
    // ================================
    function endGame(wasSurrender) {
        state = 'VICTORY';

        const titleText = wasSurrender ? 'RECRUITER SURRENDERS' : 'OBJECTIONS EXHAUSTED';
        const subtitleText = wasSurrender
            ? 'Convinced. No further objections needed.'
            : 'Every doubt answered. Every objection countered.';

        // Update victory screen content
        document.querySelector('.victory-title').textContent = titleText;
        document.querySelector('.victory-subtitle').textContent = subtitleText;

        $('v-christos-score').textContent = christosScore;
        $('v-recruiter-score').textContent = recruiterScore;
        $('v-rounds').textContent = round;

        AudioManager.victory();
        switchScreen('victory-screen');

        // Big particle burst
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        Effects.spawnBurst(cx, cy, 60, '#e0b44a');
        Effects.spawnBurst(cx, cy, 40, '#f5d98a');
        Effects.spawnSparks(cx, cy, 35, '#ffbe0b');
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
        $('christos-score').textContent = christosScore;
        $('recruiter-score').textContent = recruiterScore;
        $('round-display').textContent = `Round ${round} / ${totalCards}`;
    }

    function updateDeckCounts() {
        $('christos-deck-count').textContent = christosDeck.length;
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
