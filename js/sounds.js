// Sound Manager for Corporate Whack
// Uses Web Audio API to generate retro arcade sounds

class SoundManager {
    constructor() {
        this.audioContext = null;
        this.initialized = false;
        this.muted = false;
    }

    init() {
        if (this.initialized) return;
        
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.initialized = true;
        } catch (e) {
            console.warn('Web Audio API not supported:', e);
        }
    }

    // Resume audio context (needed after user interaction)
    resume() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    // Generate a "bleep" sound for successful hits
    playWhack() {
        if (!this.initialized || this.muted) return;
        this.resume();

        const ctx = this.audioContext;
        const now = ctx.currentTime;

        // Create oscillator for the bleep
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        // Square wave for retro feel
        osc.type = 'square';
        
        // Frequency sweep down (satisfying hit sound)
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.1);

        // Quick attack, fast decay
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

        osc.start(now);
        osc.stop(now + 0.15);
    }

    // Generate a harsh buzz for wrong hits
    playBuzz() {
        if (!this.initialized || this.muted) return;
        this.resume();

        const ctx = this.audioContext;
        const now = ctx.currentTime;

        // Create multiple oscillators for harsh buzz
        const oscs = [];
        const gain = ctx.createGain();
        gain.connect(ctx.destination);

        // Dissonant frequencies for harsh sound
        const frequencies = [150, 153, 157, 160];
        
        frequencies.forEach(freq => {
            const osc = ctx.createOscillator();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, now);
            osc.connect(gain);
            oscs.push(osc);
        });

        // Harsh attack, medium decay
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

        oscs.forEach(osc => {
            osc.start(now);
            osc.stop(now + 0.4);
        });
    }

    // Level up fanfare
    playLevelUp() {
        if (!this.initialized || this.muted) return;
        this.resume();

        const ctx = this.audioContext;
        const now = ctx.currentTime;

        // Arpeggio notes (C major fanfare)
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'square';
            osc.frequency.setValueAtTime(freq, now);

            const startTime = now + (i * 0.1);
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

            osc.start(startTime);
            osc.stop(startTime + 0.3);
        });
    }

    // Game over sad sound
    playGameOver() {
        if (!this.initialized || this.muted) return;
        this.resume();

        const ctx = this.audioContext;
        const now = ctx.currentTime;

        // Descending sad notes
        const notes = [400, 350, 300, 250];
        
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now);

            const startTime = now + (i * 0.2);
            gain.gain.setValueAtTime(0.2, startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.25);

            osc.start(startTime);
            osc.stop(startTime + 0.25);
        });
    }

    // Victory fanfare
    playVictory() {
        if (!this.initialized || this.muted) return;
        this.resume();

        const ctx = this.audioContext;
        const now = ctx.currentTime;

        // Extended victory arpeggio
        const notes = [
            523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50,
            1046.50, 1318.51, 1567.98
        ];
        
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'square';
            osc.frequency.setValueAtTime(freq, now);

            const startTime = now + (i * 0.08);
            const duration = i < 8 ? 0.15 : 0.5;
            
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.15, startTime + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

            osc.start(startTime);
            osc.stop(startTime + duration);
        });
    }

    // Mole popup sound
    playPopup() {
        if (!this.initialized || this.muted) return;
        this.resume();

        const ctx = this.audioContext;
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.05);

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

        osc.start(now);
        osc.stop(now + 0.08);
    }

    // Miss sound (mole escaped)
    playMiss() {
        if (!this.initialized || this.muted) return;
        this.resume();

        const ctx = this.audioContext;
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.15);

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

        osc.start(now);
        osc.stop(now + 0.15);
    }

    // Toggle mute
    toggleMute() {
        this.muted = !this.muted;
        return this.muted;
    }
}

// Export singleton instance
export const soundManager = new SoundManager();
