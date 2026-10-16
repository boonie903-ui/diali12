// Web Audio API Synthesizer - 100% self-contained without needing external assets

class SoundManager {
  private ctx: AudioContext | null = null;
  private isBgmPlaying = false;
  private bgmGain: GainNode | null = null;
  private bgmOscillators: OscillatorNode[] = [];

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Play button click sound
  playClick(enabled = true) {
    if (!enabled) return;
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // Audio might be blocked before first user gesture
    }
  }

  // Play crisp correct answer chime
  playCorrect(enabled = true) {
    if (!enabled) return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.value = freq;

        const startTime = now + index * 0.06;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.18, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.28);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.3);
      });
    } catch {}
  }

  // Play wrong answer buzzer
  playWrong(enabled = true) {
    if (!enabled) return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.linearRampToValueAtTime(120, now + 0.25);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {}
  }

  // Play countdown tick
  playTick(enabled = true) {
    if (!enabled) return;
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(700, ctx.currentTime);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {}
  }

  // Play celebratory Level Up / Stage Victory Fanfare
  playFanfare(enabled = true) {
    if (!enabled) return;
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      // Trumpet-like heroic melody: C4, G4, C5, E5, G5
      const chords = [
        { freq: 261.63, delay: 0 },
        { freq: 392.00, delay: 0.12 },
        { freq: 523.25, delay: 0.24 },
        { freq: 659.25, delay: 0.36 },
        { freq: 783.99, delay: 0.50 },
        { freq: 1046.50, delay: 0.65 }
      ];

      chords.forEach(({ freq, delay }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + delay);

        gain.gain.setValueAtTime(0, now + delay);
        gain.gain.linearRampToValueAtTime(0.2, now + delay + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + delay);
        osc.stop(now + delay + 0.5);
      });
    } catch {}
  }

  // Ambient cosmic drone toggle
  setBgm(enabled: boolean) {
    if (!enabled) {
      if (this.isBgmPlaying) {
        this.stopBgm();
      }
      return;
    }
    if (this.isBgmPlaying) return;

    try {
      const ctx = this.getContext();
      this.bgmGain = ctx.createGain();
      this.bgmGain.gain.setValueAtTime(0.02, ctx.currentTime);
      this.bgmGain.connect(ctx.destination);

      // Low ethereal pad chords (F2, C3, A3)
      const freqs = [87.31, 130.81, 220.00];
      this.bgmOscillators = freqs.map((freq) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.connect(this.bgmGain!);
        osc.start();
        return osc;
      });

      this.isBgmPlaying = true;
    } catch {}
  }

  stopBgm() {
    this.bgmOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {}
    });
    this.bgmOscillators = [];
    this.isBgmPlaying = false;
  }

  // Read Vietnamese text out loud with Web Speech API
  speak(text: string, enabled = true) {
    if (!enabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'vi-VN';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch {}
  }

  stopSpeech() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const soundManager = new SoundManager();
