// Space Invaders - Audio System
// Uses Web Audio API for authentic sound effects

export class AudioManager {
    constructor() {
        this.audioContext = null;
        this.masterVolume = 0.3;
        this.isMuted = false;
        this.marchIndex = 0;
        this.marchNotes = [55, 49, 46, 41]; // Bass notes for alien march (A1, G1, F#1, E1)
        this.marchInterval = null;
        this.isInitialized = false;
    }

    init() {
        if (this.isInitialized) return;

        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.isInitialized = true;
        } catch (e) {
            console.warn('Web Audio API not supported');
        }
    }

    resume() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    // Create oscillator-based sounds
    createOscillator(type, frequency, duration, volume = 1) {
        if (!this.audioContext || this.isMuted) return null;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

        gainNode.gain.setValueAtTime(this.masterVolume * volume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        return { oscillator, gainNode, duration };
    }

    // Player shooting sound
    playShoot() {
        if (!this.audioContext || this.isMuted) return;

        const osc = this.createOscillator('square', 1500, 0.1, 0.5);
        if (!osc) return;

        osc.oscillator.frequency.exponentialRampToValueAtTime(500, this.audioContext.currentTime + 0.1);
        osc.oscillator.start();
        osc.oscillator.stop(this.audioContext.currentTime + 0.1);
    }

    // Alien explosion sound
    playAlienExplosion() {
        if (!this.audioContext || this.isMuted) return;

        // White noise burst for explosion
        const bufferSize = this.audioContext.sampleRate * 0.15;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
        }

        const noise = this.audioContext.createBufferSource();
        const gainNode = this.audioContext.createGain();

        noise.buffer = buffer;
        gainNode.gain.setValueAtTime(this.masterVolume * 0.4, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);

        noise.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        noise.start();
    }

    // Player explosion sound
    playPlayerExplosion() {
        if (!this.audioContext || this.isMuted) return;

        // Lower, longer explosion for player death
        const bufferSize = this.audioContext.sampleRate * 0.5;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize) * Math.sin(i * 0.01);
        }

        const noise = this.audioContext.createBufferSource();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, this.audioContext.currentTime);
        filter.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.5);

        noise.buffer = buffer;
        gainNode.gain.setValueAtTime(this.masterVolume * 0.6, this.audioContext.currentTime);

        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        noise.start();
    }

    // UFO sound (continuous wavering)
    playUFO() {
        if (!this.audioContext || this.isMuted) return null;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const lfo = this.audioContext.createOscillator();
        const lfoGain = this.audioContext.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);

        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(8, this.audioContext.currentTime);
        lfoGain.gain.setValueAtTime(50, this.audioContext.currentTime);

        lfo.connect(lfoGain);
        lfoGain.connect(oscillator.frequency);

        gainNode.gain.setValueAtTime(this.masterVolume * 0.3, this.audioContext.currentTime);

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.start();
        lfo.start();

        return { oscillator, lfo, gainNode };
    }

    stopUFO(ufoSound) {
        if (ufoSound) {
            try {
                ufoSound.gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
                setTimeout(() => {
                    ufoSound.oscillator.stop();
                    ufoSound.lfo.stop();
                }, 100);
            } catch (e) {
                // Sound already stopped
            }
        }
    }

    // Alien march beat
    playMarchBeat() {
        if (!this.audioContext || this.isMuted) return;

        const note = this.marchNotes[this.marchIndex];
        const osc = this.createOscillator('square', note, 0.1, 0.4);
        if (!osc) return;

        osc.oscillator.start();
        osc.oscillator.stop(this.audioContext.currentTime + 0.1);

        this.marchIndex = (this.marchIndex + 1) % this.marchNotes.length;
    }

    // Start the march rhythm
    startMarch(intervalMs) {
        this.stopMarch();
        this.marchInterval = setInterval(() => this.playMarchBeat(), intervalMs);
    }

    // Update march speed
    updateMarchSpeed(intervalMs) {
        this.stopMarch();
        this.marchInterval = setInterval(() => this.playMarchBeat(), intervalMs);
    }

    // Stop the march
    stopMarch() {
        if (this.marchInterval) {
            clearInterval(this.marchInterval);
            this.marchInterval = null;
        }
    }

    // Extra life sound
    playExtraLife() {
        if (!this.audioContext || this.isMuted) return;

        const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
        notes.forEach((freq, i) => {
            setTimeout(() => {
                const osc = this.createOscillator('square', freq, 0.15, 0.4);
                if (osc) {
                    osc.oscillator.start();
                    osc.oscillator.stop(this.audioContext.currentTime + 0.15);
                }
            }, i * 100);
        });
    }

    // Game over sound
    playGameOver() {
        if (!this.audioContext || this.isMuted) return;

        const notes = [392, 349, 330, 294]; // G4, F4, E4, D4 - descending
        notes.forEach((freq, i) => {
            setTimeout(() => {
                const osc = this.createOscillator('square', freq, 0.3, 0.4);
                if (osc) {
                    osc.oscillator.start();
                    osc.oscillator.stop(this.audioContext.currentTime + 0.3);
                }
            }, i * 250);
        });
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted) {
            this.stopMarch();
        }
        return this.isMuted;
    }

    setVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
    }
}

export const audioManager = new AudioManager();
