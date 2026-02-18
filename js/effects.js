// ============================================
// RECRUITER vs CV — Particle Effects
// ============================================

const Effects = (() => {
    let canvas, ctx;
    let particles = [];
    let embers = [];
    let running = false;

    function init() {
        canvas = document.getElementById('fx-canvas');
        ctx = canvas.getContext('2d');
        resize();
        window.addEventListener('resize', resize);
        running = true;
        spawnEmbers();
        loop();
    }

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    // Floating embers (ambient)
    function spawnEmbers() {
        embers = [];
        const count = Math.min(40, Math.floor(window.innerWidth / 30));
        for (let i = 0; i < count; i++) {
            embers.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: -Math.random() * 0.5 - 0.1,
                size: Math.random() * 2.5 + 0.5,
                alpha: Math.random() * 0.4 + 0.1,
                color: Math.random() > 0.5 ? 'rgba(212,168,67,' : 'rgba(255,140,50,',
                flicker: Math.random() * Math.PI * 2,
                flickerSpeed: 0.02 + Math.random() * 0.03
            });
        }
    }

    function updateEmbers() {
        for (const e of embers) {
            e.x += e.vx;
            e.y += e.vy;
            e.flicker += e.flickerSpeed;
            const a = e.alpha * (0.5 + 0.5 * Math.sin(e.flicker));

            ctx.beginPath();
            ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
            ctx.fillStyle = e.color + a + ')';
            ctx.fill();

            // Glow
            ctx.beginPath();
            ctx.arc(e.x, e.y, e.size * 3, 0, Math.PI * 2);
            ctx.fillStyle = e.color + (a * 0.15) + ')';
            ctx.fill();

            // Reset if out of bounds
            if (e.y < -10 || e.x < -10 || e.x > canvas.width + 10) {
                e.x = Math.random() * canvas.width;
                e.y = canvas.height + 10;
                e.alpha = Math.random() * 0.4 + 0.1;
            }
        }
    }

    // Burst particles (for clashes)
    function spawnBurst(x, y, count = 30, color = '#d4a843') {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 / count) * i + (Math.random() - 0.5) * 0.5;
            const speed = 2 + Math.random() * 6;
            particles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: Math.random() * 4 + 1,
                alpha: 1,
                decay: 0.015 + Math.random() * 0.02,
                color,
                type: 'burst'
            });
        }
    }

    // Spark trail particles
    function spawnSparks(x, y, count = 15, color = '#f0d078') {
        for (let i = 0; i < count; i++) {
            particles.push({
                x: x + (Math.random() - 0.5) * 40,
                y: y + (Math.random() - 0.5) * 40,
                vx: (Math.random() - 0.5) * 3,
                vy: -Math.random() * 4 - 1,
                size: Math.random() * 2 + 0.5,
                alpha: 1,
                decay: 0.02 + Math.random() * 0.01,
                color,
                type: 'spark'
            });
        }
    }

    // Card dust (when card is destroyed)
    function spawnCardDust(x, y, color = '#c0392b') {
        for (let i = 0; i < 40; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1 + Math.random() * 4;
            particles.push({
                x: x + (Math.random() - 0.5) * 80,
                y: y + (Math.random() - 0.5) * 100,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 1,
                size: Math.random() * 3 + 1,
                alpha: 0.9,
                decay: 0.008 + Math.random() * 0.012,
                color,
                type: 'dust',
                gravity: 0.05
            });
        }
    }

    function updateParticles() {
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= p.decay;
            p.vx *= 0.98;
            p.vy *= 0.98;
            if (p.gravity) p.vy += p.gravity;

            if (p.alpha <= 0) {
                particles.splice(i, 1);
                continue;
            }

            ctx.globalAlpha = p.alpha;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();

            // Glow for burst particles
            if (p.type === 'burst' || p.type === 'spark') {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.alpha * 0.2;
                ctx.fill();
            }
        }
        ctx.globalAlpha = 1;
    }

    function loop() {
        if (!running) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        updateEmbers();
        updateParticles();
        requestAnimationFrame(loop);
    }

    // Screen shake
    function screenShake() {
        const el = document.getElementById('game-container');
        el.classList.add('screen-shake');
        setTimeout(() => el.classList.remove('screen-shake'), 400);
    }

    return {
        init,
        spawnBurst,
        spawnSparks,
        spawnCardDust,
        screenShake,
        // Get center of an element for particle spawning
        getCenter(el) {
            const r = el.getBoundingClientRect();
            return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
        }
    };
})();
