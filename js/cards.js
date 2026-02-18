// ============================================
// RECRUITER vs CV — Card Components
// Supports: Gold cards, Hearthstone hover preview,
// drag & drop
// ============================================

const Cards = (() => {

  // Preview system
  let previewEl = null;
  let previewTimer = null;
  let activePreviewCard = null;

  function getPreviewContainer() {
    if (!previewEl) {
      previewEl = document.getElementById('card-preview');
    }
    return previewEl;
  }

  function isCardPreviewActive(cardEl) {
    return activePreviewCard === cardEl;
  }

  /**
   * Build the inner HTML for a card (shared between small and preview)
   */
  function buildCardInnerHTML(data, type, opts = {}) {
    const isGold = data.isGold === true;
    const typeBadgeText = type === 'objection'
      ? 'Objection'
      : (isGold ? '✦ Reference Letter' : 'Counter');
    const sourceText = type === 'objection' ? data.category : (data.source || '');

    return `
      <div class="card-header">
        <div class="card-icon-badge">${data.icon}</div>
        <div class="card-power">${data.power}</div>
      </div>
      <div class="card-art">${data.icon}</div>
      <div class="card-title">${data.title}</div>
      <div class="card-desc">${data.description}</div>
      <div class="card-footer">
        <span class="card-type-badge">${typeBadgeText}</span>
        <span class="card-source">${sourceText}</span>
      </div>
    `;
  }

  /**
   * Show a large preview card on hover (Hearthstone-style)
   */
  function showPreview(data, type, sourceCard) {
    const container = getPreviewContainer();
    if (!container || activePreviewCard === sourceCard) return;

    activePreviewCard = sourceCard;

    // Clear previous
    clearTimeout(previewTimer);

    const isGold = data.isGold === true;

    // Build preview class
    let cls = 'card-preview active preview-card';
    if (type === 'objection') {
      cls += ' objection-card';
    } else {
      cls += ' counter-card';
      if (isGold) cls += ' gold-card';
    }
    container.className = cls;

    // Build preview content — full text, no clamping
    container.innerHTML = `
      <div class="card-inner preview-inner">
        ${buildCardInnerHTML(data, type)}
      </div>
    `;

    // Position the preview: above the hovered card, centered
    positionPreview(sourceCard, container);
  }

  function positionPreview(sourceCard, container) {
    const cardRect = sourceCard.getBoundingClientRect();
    const previewW = 260;
    const previewH = 370;

    // Center horizontally over the card
    let left = cardRect.left + (cardRect.width / 2) - (previewW / 2);

    // Place above the card with some gap
    let top = cardRect.top - previewH - 16;

    // If it would go off the top, place it to the side instead
    if (top < 10) {
      top = cardRect.top;
      // Place to the right of the card
      left = cardRect.right + 16;
      // If that goes off-screen right, place to the left
      if (left + previewW > window.innerWidth - 10) {
        left = cardRect.left - previewW - 16;
      }
    }

    // Clamp to screen bounds
    left = Math.max(10, Math.min(left, window.innerWidth - previewW - 10));
    top = Math.max(10, Math.min(top, window.innerHeight - previewH - 10));

    container.style.left = left + 'px';
    container.style.top = top + 'px';
    // Width is handled by CSS to maintain aspect ratio
  }

  function hidePreview() {
    activePreviewCard = null;
    const container = getPreviewContainer();
    if (container) {
      container.className = 'card-preview';
      container.innerHTML = '';
    }
  }

  /**
   * Attach hover preview to a card element
   */
  function attachPreview(cardEl, data, type) {
    cardEl.addEventListener('mouseenter', () => {
      // Don't show preview if dragging
      if (document.querySelector('.drag-clone')) return;
      previewTimer = setTimeout(() => {
        showPreview(data, type, cardEl);
      }, 120); // Small delay to prevent flicker
    });

    cardEl.addEventListener('mouseleave', () => {
      clearTimeout(previewTimer);
      hidePreview();
    });

    // Also hide on mousedown (drag start)
    cardEl.addEventListener('mousedown', () => {
      clearTimeout(previewTimer);
      hidePreview();
    });
  }

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
        ${buildCardInnerHTML(data, 'objection')}
      </div>
    `;

    // 3D tilt on hover
    if (!opts.noTilt) {
      card.addEventListener('mousemove', (e) => handleTilt(e, card));
      card.addEventListener('mouseleave', () => resetTilt(card));
    }

    // Hover preview — only for hand cards & deck grid (not battle-size)
    if (!opts.battleSize) {
      attachPreview(card, data, 'objection');
    }

    return card;
  }

  /**
   * Create a counter card element (Christos' green/gold card)
   */
  function createCounterCard(data, opts = {}) {
    const card = document.createElement('div');
    const isGold = data.isGold === true;
    let classes = 'game-card counter-card';
    if (isGold) classes += ' gold-card';
    if (opts.battleSize) classes += ' battle-card';
    card.className = classes;
    card.dataset.cardId = data.id;

    const type = 'counter';

    if (opts.faceDown) {
      // Create flippable card
      card.innerHTML = `
        <div class="card-flipper">
          <div class="card-face card-face-back${isGold ? ' gold-back' : ''}"></div>
          <div class="card-face card-face-front">
            <div class="card-inner">
              ${buildCardInnerHTML(data, type)}
            </div>
          </div>
        </div>
      `;
    } else {
      card.innerHTML = `
        <div class="card-inner">
          ${buildCardInnerHTML(data, type)}
        </div>
      `;
    }

    if (!opts.noTilt) {
      card.addEventListener('mousemove', (e) => handleTilt(e, card));
      card.addEventListener('mouseleave', () => resetTilt(card));
    }

    // Hover preview — only for non-battle, non-facedown cards
    if (!opts.battleSize && !opts.faceDown) {
      attachPreview(card, data, 'counter');
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
      // Show regular cards first, then gold cards
      const regular = COUNTER_CARDS.filter(c => !c.isGold);
      const gold = COUNTER_CARDS.filter(c => c.isGold);
      regular.forEach(card => {
        grid.appendChild(createCounterCard(card, { noTilt: false }));
      });
      if (gold.length > 0) {
        const divider = document.createElement('div');
        divider.className = 'deck-divider';
        divider.innerHTML = '<span>✦ GOLD CARDS — From Reference Letter ✦</span>';
        container.appendChild(grid);
        container.appendChild(divider);
        const goldGrid = document.createElement('div');
        goldGrid.className = 'deck-grid';
        gold.forEach(card => {
          goldGrid.appendChild(createCounterCard(card, { noTilt: false }));
        });
        container.appendChild(goldGrid);
        return; // already appended
      }
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
    renderDeckPreview,
    hidePreview,
    showPreview,
    isCardPreviewActive
  };
})();
