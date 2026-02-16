// ============================================
// RECRUITER vs CV — Card Components
// ============================================

const Cards = (() => {

    /**
     * Create an objection card element (recruiter's red card)
     */
    function createObjectionCard(data, opts = {}) {
        const card = document.createElement('div');
        card.className = 'game-card objection-card' + (opts.battleSize ? ' battle-card' : '');
        card.dataset.cardId = data.id;
        if (opts.animate) card.classList.add('card-enter-hand');

        card.innerHTML = `
      <div class="card-inner">
        <div class="card-header">
          <div class="card-icon-badge">${data.icon}</div>
          <div class="card-power">${data.power}</div>
        </div>
        <div class="card-art">${data.icon}</div>
        <div class="card-title">${data.title}</div>
        <div class="card-desc">${data.description}</div>
        <div class="card-footer">
          <span class="card-type-badge">Objection</span>
          <span class="card-source">${data.category}</span>
        </div>
      </div>
    `;

        // 3D tilt on hover
        if (!opts.noTilt) {
            card.addEventListener('mousemove', (e) => handleTilt(e, card));
            card.addEventListener('mouseleave', () => resetTilt(card));
        }

        return card;
    }

    /**
     * Create a counter card element (Christos' green/gold card)
     */
    function createCounterCard(data, opts = {}) {
        const card = document.createElement('div');
        card.className = 'game-card counter-card' + (opts.battleSize ? ' battle-card' : '');
        card.dataset.cardId = data.id;

        if (opts.faceDown) {
            // Create flippable card
            card.innerHTML = `
        <div class="card-flipper">
          <div class="card-face card-face-back"></div>
          <div class="card-face card-face-front">
            <div class="card-inner">
              <div class="card-header">
                <div class="card-icon-badge">${data.icon}</div>
                <div class="card-power">${data.power}</div>
              </div>
              <div class="card-art">${data.icon}</div>
              <div class="card-title">${data.title}</div>
              <div class="card-desc">${data.description}</div>
              <div class="card-footer">
                <span class="card-type-badge">Counter</span>
                <span class="card-source">${data.source}</span>
              </div>
            </div>
          </div>
        </div>
      `;
        } else {
            card.innerHTML = `
        <div class="card-inner">
          <div class="card-header">
            <div class="card-icon-badge">${data.icon}</div>
            <div class="card-power">${data.power}</div>
          </div>
          <div class="card-art">${data.icon}</div>
          <div class="card-title">${data.title}</div>
          <div class="card-desc">${data.description}</div>
          <div class="card-footer">
            <span class="card-type-badge">Counter</span>
            <span class="card-source">${data.source}</span>
          </div>
        </div>
      `;
        }

        if (!opts.noTilt) {
            card.addEventListener('mousemove', (e) => handleTilt(e, card));
            card.addEventListener('mouseleave', () => resetTilt(card));
        }

        return card;
    }

    /**
     * Flip a face-down card to reveal front
     */
    function flipCard(cardEl) {
        const flipper = cardEl.querySelector('.card-flipper');
        if (flipper) {
            flipper.classList.add('flipped');
        }
    }

    /**
     * 3D tilt effect on mousemove
     */
    function handleTilt(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;

        const inner = card.querySelector('.card-inner') || card.querySelector('.card-flipper');
        if (inner) {
            inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        }
    }

    function resetTilt(card) {
        const inner = card.querySelector('.card-inner') || card.querySelector('.card-flipper');
        if (inner) {
            inner.style.transform = '';
        }
    }

    /**
     * Populate deck preview modal
     */
    function renderDeckPreview(container, type) {
        container.innerHTML = '';

        if (type === 'recruiter-tab') {
            const grid = document.createElement('div');
            grid.className = 'deck-grid';
            OBJECTION_CARDS.forEach(card => {
                grid.appendChild(createObjectionCard(card, { noTilt: false }));
            });
            container.appendChild(grid);
        } else if (type === 'christos-tab') {
            const grid = document.createElement('div');
            grid.className = 'deck-grid';
            COUNTER_CARDS.forEach(card => {
                grid.appendChild(createCounterCard(card, { noTilt: false }));
            });
            container.appendChild(grid);
        } else if (type === 'cv-tab') {
            renderCVViewer(container);
        }
    }

    function renderCVViewer(container) {
        // Summary
        let html = `
      <div class="cv-section">
        <h3 class="cv-section-title">Professional Summary</h3>
        <p style="font-family: var(--font-body); font-size: 15px; color: var(--text-secondary); line-height: 1.8; font-style: italic;">
          ${CV_DATA.personal.summary}
        </p>
      </div>
    `;

        // Experience
        html += `<div class="cv-section"><h3 class="cv-section-title">Professional Experience</h3>`;
        CV_FULL_EXPERIENCE.forEach(role => {
            html += `
        <div class="cv-role">
          <div class="cv-role-header">
            <span class="cv-role-title">${role.role}</span>
            <span class="cv-role-dates">${role.dates}</span>
          </div>
          <div class="cv-role-company">${role.company} — ${role.platform}</div>
          <ul class="cv-achievements-list">
            ${role.achievements.map(a => `<li>${a}</li>`).join('')}
          </ul>
        </div>
      `;
        });
        html += `</div>`;

        // Education
        html += `
      <div class="cv-section">
        <h3 class="cv-section-title">Education</h3>
        <div class="cv-role">
          <div class="cv-role-header">
            <span class="cv-role-title">BSc (Hons) Computer Games Programming — First Class Honours</span>
          </div>
          <div class="cv-role-company">Middlesex University, London</div>
          <ul class="cv-achievements-list">
            <li>Thesis: Developing an educational programming game for children with ADHD (IEEE Published)</li>
            <li>Key Project: Combat AI using Behaviour Trees and Finite State Machines (FSM)</li>
          </ul>
        </div>
      </div>
    `;

        container.innerHTML = html;
    }

    return {
        createObjectionCard,
        createCounterCard,
        flipCard,
        renderDeckPreview
    };
})();
