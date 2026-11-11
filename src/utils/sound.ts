/**
 * Web Audio API synthesizer for cheerful pastoral farm background music
 * and playful sound effects (SFX). No external asset dependencies.
 */

class SoundManager {
  private ctx: AudioContext | null = null;
  private bgmGainNode: GainNode | null = null;
  private sfxGainNode: GainNode | null = null;
  private isBgmPlaying = false;
  private bgmTimer: number | null = null;
  private bgmStep = 0;
  private bgmVolume = 0.25;
  private sfxVolume = 0.6;
  private isMuted = false;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();

      this.bgmGainNode = this.ctx.createGain();
      this.bgmGainNode.gain.value = this.isMuted ? 0 : this.bgmVolume;
      this.bgmGainNode.connect(this.ctx.destination);

      this.sfxGainNode = this.ctx.createGain();
      this.sfxGainNode.gain.value = this.isMuted ? 0 : this.sfxVolume;
      this.sfxGainNode.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // ---- BACKGROUND MUSIC (CHEERFUL COUNTRY FOLK / MARIMBA THEME) ----

  // Melody and chord notes in Hz for a sunny farm feel (Key of C major / G major)
  private readonly MELODY_NOTES: (number | null)[] = [
    523.25, 659.25, 783.99, 659.25,  // C5, E5, G5, E5 (Apple picking bounce)
    587.33, 659.25, 698.46, 587.33,  // D5, E5, F5, D5
    659.25, 783.99, 880.00, 783.99,  // E5, G5, A5, G5 (Sunny breeze)
    783.99, 659.25, 587.33, 523.25,  // G5, E5, D5, C5 (Landing in basket)

    523.25, 587.33, 659.25, 523.25,  // Little variations
    440.00, 523.25, 587.33, 440.00,
    392.00, 523.25, 659.25, 783.99,
    1046.50, 783.99, 659.25, 523.25
  ];

  private readonly BASS_ROOTS: number[] = [
    130.81, 130.81, 146.83, 146.83, // C3, D3
    164.81, 164.81, 174.61, 196.00, // E3, F3, G3
    130.81, 130.81, 220.00, 220.00, // C3, A3
    174.61, 196.00, 130.81, 130.81
  ];

  public startBGM() {
    this.initContext();
    if (this.isBgmPlaying) return;
    this.isBgmPlaying = true;
    this.bgmStep = 0;

    // Tempo: ~110 BPM (approx 270ms per 16th note beat)
    const beatIntervalMs = 280;

    const playNextBeat = () => {
      if (!this.isBgmPlaying || !this.ctx || !this.bgmGainNode) return;

      const note = this.MELODY_NOTES[this.bgmStep % this.MELODY_NOTES.length];
      const bass = this.BASS_ROOTS[Math.floor((this.bgmStep / 2) % this.BASS_ROOTS.length)];

      const now = this.ctx.currentTime;

      // Play lead marimba/flute note
      if (note) {
        this.synthMarimba(note, now, 0.22, 0.14);
      }

      // Play warm bass every 2 beats
      if (this.bgmStep % 2 === 0 && bass) {
        this.synthBass(bass, now, 0.35, 0.12);
      }

      // Subtle shaker / grass rustle every odd beat
      if (this.bgmStep % 2 === 1) {
        this.synthRustle(now);
      }

      this.bgmStep++;
      this.bgmTimer = window.setTimeout(playNextBeat, beatIntervalMs);
    };

    playNextBeat();
  }

  public stopBGM() {
    this.isBgmPlaying = false;
    if (this.bgmTimer !== null) {
      window.clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  public toggleBGM(): boolean {
    if (this.isBgmPlaying) {
      this.stopBGM();
      return false;
    } else {
      this.startBGM();
      return true;
    }
  }

  public isPlayingBGM(): boolean {
    return this.isBgmPlaying;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.bgmGainNode) {
      this.bgmGainNode.gain.value = muted ? 0 : this.bgmVolume;
    }
    if (this.sfxGainNode) {
      this.sfxGainNode.gain.value = muted ? 0 : this.sfxVolume;
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setVolume(volume: number) {
    this.bgmVolume = Math.max(0, Math.min(1, volume * 0.4));
    this.sfxVolume = Math.max(0, Math.min(1, volume * 0.8));
    if (!this.isMuted) {
      if (this.bgmGainNode) this.bgmGainNode.gain.value = this.bgmVolume;
      if (this.sfxGainNode) this.sfxGainNode.gain.value = this.sfxVolume;
    }
  }

  // Synth instruments
  private synthMarimba(freq: number, startTime: number, duration: number, gainLevel: number) {
    if (!this.ctx || !this.bgmGainNode) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(gainLevel, startTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.bgmGainNode);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  private synthBass(freq: number, startTime: number, duration: number, gainLevel: number) {
    if (!this.ctx || !this.bgmGainNode) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(gainLevel, startTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.bgmGainNode);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  private synthRustle(startTime: number) {
    if (!this.ctx || !this.bgmGainNode) return;

    // Small high passed noise / brush sound
    const bufferSize = this.ctx.sampleRate * 0.04;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(5000, startTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.03, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.04);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.bgmGainNode);

    whiteNoise.start(startTime);
    whiteNoise.stop(startTime + 0.04);
  }

  // ---- SOUND EFFECTS (SFX) ----

  // Apple plucked from the tree: snappy pop & upward blip
  public playApplePluck() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.sfxGainNode) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(740, now + 0.12);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);

    osc.connect(gain);
    gain.connect(this.sfxGainNode);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  // Apple caught in the basket: friendly woody thud and bell
  public playBasketCatch() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.sfxGainNode) return;

    const now = this.ctx.currentTime;

    // Thud
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(220, now);
    osc1.frequency.exponentialRampToValueAtTime(90, now + 0.1);
    gain1.gain.setValueAtTime(0.5, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
    osc1.connect(gain1);
    gain1.connect(this.sfxGainNode);
    osc1.start(now);
    osc1.stop(now + 0.12);

    // Sweet chime
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.04);
    gain2.gain.setValueAtTime(0.25, now + 0.04);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
    osc2.connect(gain2);
    gain2.connect(this.sfxGainNode);
    osc2.start(now + 0.04);
    osc2.stop(now + 0.35);
  }

  // Correct answer / Read-aloud celebration fanfare
  public playSuccessFanfare() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.sfxGainNode) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGainNode) return;
      const noteTime = now + idx * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0, noteTime);
      gain.gain.linearRampToValueAtTime(0.35, noteTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, noteTime + 0.3);

      osc.connect(gain);
      gain.connect(this.sfxGainNode);

      osc.start(noteTime);
      osc.stop(noteTime + 0.35);
    });
  }

  // Star twinkling on rating modal
  public playStarTwinkle(starIndex: number = 0) {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.sfxGainNode) return;

    const baseFreqs = [880, 1174.66, 1567.98];
    const freq = baseFreqs[starIndex % baseFreqs.length] || 1200;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

    osc.connect(gain);
    gain.connect(this.sfxGainNode);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  // Gentle retry sound (soft "uh-oh" pitch bend, friendly not punitive)
  public playGentleRetry() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.sfxGainNode) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(360, now);
    osc.frequency.linearRampToValueAtTime(290, now + 0.2);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    osc.connect(gain);
    gain.connect(this.sfxGainNode);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  // Microphone listening prompt
  public playMicChime() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.sfxGainNode) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(659.25, now);
    osc.frequency.setValueAtTime(987.77, now + 0.08);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    osc.connect(gain);
    gain.connect(this.sfxGainNode);

    osc.start(now);
    osc.stop(now + 0.28);
  }

  // Step-by-step walking footstep sound (pleasant soft patter)
  public playFootstep() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.sfxGainNode) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140 + Math.random() * 40, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.06);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.07);

    osc.connect(gain);
    gain.connect(this.sfxGainNode);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  // Found target item celebration fanfare
  public playDiscoveryFanfare() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.sfxGainNode) return;

    const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGainNode) return;
      const noteTime = now + idx * 0.07;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0, noteTime);
      gain.gain.linearRampToValueAtTime(0.3, noteTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.01, noteTime + 0.25);

      osc.connect(gain);
      gain.connect(this.sfxGainNode);

      osc.start(noteTime);
      osc.stop(noteTime + 0.28);
    });
  }

  // UI button click
  public playClick() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.sfxGainNode) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

    osc.connect(gain);
    gain.connect(this.sfxGainNode);

    osc.start(now);
    osc.stop(now + 0.05);
  }
}

export const soundManager = new SoundManager();
