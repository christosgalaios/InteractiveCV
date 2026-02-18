// ============================================
// RECRUITER vs CV — Web Audio SFX
// ============================================

const AudioManager = (() => {
    let ctx = null;
    let masterGain = null;
    let initialized = false;

    function init() {
        if (initialized) return;
        try {
            ctx = new (window.AudioContext || window.webkitAudioContext)();
            masterGain = ctx.createGain();
            masterGain.gain.value = 0.3;
            masterGain.connect(ctx.destination);
            initialized = true;
        } catch (e) {
            console.warn('Web Audio not available:', e);
        }
    }

    function playTone(freq, duration, type = 'sine', volume = 0.3) {
        if (!initialized) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.value = volume;
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + duration);
    }

    function playNoise(duration, volume = 0.1) {
        if (!initialized) return;
        const bufferSize = ctx.sampleRate * duration;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.5;
        }
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        const gain = ctx.createGain();
        gain.gain.value = volume;
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        const filter = ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 2000;
        source.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);
        source.start(ctx.currentTime);
    }

    return {
        init,

        cardFlip() {
            playNoise(0.08, 0.15);
            playTone(800, 0.06, 'sine', 0.1);
        },

        cardSlam() {
            playNoise(0.15, 0.3);
            playTone(120, 0.2, 'triangle', 0.4);
            playTone(80, 0.3, 'sine', 0.2);
        },

        clash() {
            playNoise(0.3, 0.4);
            playTone(200, 0.15, 'sawtooth', 0.25);
            setTimeout(() => playTone(300, 0.2, 'sawtooth', 0.2), 50);
            setTimeout(() => playTone(400, 0.3, 'triangle', 0.15), 100);
        },

        cardDestroy() {
            playNoise(0.4, 0.2);
            playTone(300, 0.1, 'sawtooth', 0.2);
            playTone(150, 0.3, 'sawtooth', 0.15);
            setTimeout(() => playTone(80, 0.4, 'sine', 0.1), 100);
        },

        victory() {
            const notes = [523, 659, 784, 1047];
            notes.forEach((n, i) => {
                setTimeout(() => playTone(n, 0.4, 'triangle', 0.2), i * 150);
            });
        },

        hover() {
            playTone(600, 0.04, 'sine', 0.06);
        },

        click() {
            playTone(400, 0.06, 'triangle', 0.12);
            playNoise(0.03, 0.05);
        },

        narrator() {
            playTone(200 + Math.random() * 100, 0.03, 'sine', 0.04);
        },

        ambient() {
            if (!initialized) return;
            // Low drone
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = 55;
            gain.gain.value = 0.02;
            osc.connect(gain);
            gain.connect(masterGain);
            osc.start();
            // Subtle modulation
            const lfo = ctx.createOscillator();
            const lfoGain = ctx.createGain();
            lfo.frequency.value = 0.1;
            lfoGain.gain.value = 5;
            lfo.connect(lfoGain);
            lfoGain.connect(osc.frequency);
            lfo.start();
        }
    };
})();
