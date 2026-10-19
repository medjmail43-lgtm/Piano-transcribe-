/**
 * High-fidelity Web Audio API Sound Engine
 * Synthesizes Piano, Guitar, Bass, and Metronome with natural harmonics and envelope.
 */

class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;
  private activeNodes: { stop: () => void }[] = [];

  public initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.85;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public resumeAudioContext() {
    this.initContext();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Convert MIDI note number to frequency (Hz)
  public midiToFreq(midi: number): number {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  // Convert Note Name (e.g., "C4", "F#4") to MIDI number
  public pitchToMidi(pitch: string): number {
    const noteMap: { [key: string]: number } = {
      C: 0, 'C#': 1, Db: 1,
      D: 2, 'D#': 3, Eb: 3,
      E: 4,
      F: 5, 'F#': 6, Gb: 6,
      G: 7, 'G#': 8, Ab: 8,
      A: 9, 'A#': 10, Bb: 10,
      B: 11
    };
    const match = pitch.match(/^([A-G][#b]?)(-?\d+)$/);
    if (!match) return 60; // Default to Middle C
    const name = match[1];
    const octave = parseInt(match[2], 10);
    return (octave + 1) * 12 + (noteMap[name] ?? 0);
  }

  // Convert MIDI number to note name (e.g. 60 -> "C4")
  public midiToPitch(midi: number): string {
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const octave = Math.floor(midi / 12) - 1;
    const note = noteNames[((midi % 12) + 12) % 12];
    return `${note}${octave}`;
  }

  // Play a single piano note (interactive click or immediate preview)
  public playNote(midi: number, duration: number = 0.8, velocity: number = 90, instrument: 'piano' | 'guitar' | 'bass' = 'piano') {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const startTime = this.ctx.currentTime;
    const freq = this.midiToFreq(midi);
    const gainVal = Math.min(1, Math.max(0.1, (velocity / 127) * 0.7));

    if (instrument === 'piano') {
      this.synthesizePianoVoice(freq, startTime, duration, gainVal);
    } else if (instrument === 'guitar') {
      this.synthesizeGuitarVoice(freq, startTime, duration, gainVal);
    } else if (instrument === 'bass') {
      this.synthesizeBassVoice(freq, startTime, duration, gainVal);
    } else {
      this.synthesizePianoVoice(freq, startTime, duration, gainVal);
    }
  }

  // Schedule a note for song playback at a designated audio context offset
  public scheduleNote(
    midi: number,
    scheduledTime: number,
    duration: number,
    trackVolume: number = 1,
    velocity: number = 85,
    instrument: 'piano' | 'guitar' | 'bass' = 'piano'
  ) {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    if (scheduledTime < this.ctx.currentTime) return; // already past

    const freq = this.midiToFreq(midi);
    const gainVal = Math.min(1, Math.max(0.05, (velocity / 127) * trackVolume * 0.7));

    if (instrument === 'guitar') {
      this.synthesizeGuitarVoice(freq, scheduledTime, duration, gainVal);
    } else if (instrument === 'bass') {
      this.synthesizeBassVoice(freq, scheduledTime, duration, gainVal);
    } else {
      this.synthesizePianoVoice(freq, scheduledTime, duration, gainVal);
    }
  }

  // Realistic Acoustic Piano physical emulation
  private synthesizePianoVoice(freq: number, startTime: number, duration: number, volume: number) {
    if (!this.ctx || !this.masterGain) return;

    const noteGain = this.ctx.createGain();
    noteGain.connect(this.masterGain);

    // Multi-harmonic additive synthesis (fundamental + overtone shimmer)
    const harmonics = [
      { ratio: 1.0, weight: 1.0, decay: 1.0 },
      { ratio: 2.0, weight: 0.5, decay: 0.8 },
      { ratio: 3.0, weight: 0.25, decay: 0.6 },
      { ratio: 4.0, weight: 0.12, decay: 0.4 },
      { ratio: 5.0, weight: 0.05, decay: 0.3 },
    ];

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(Math.min(8000, freq * 6), startTime);
    filter.frequency.exponentialRampToValueAtTime(Math.min(3000, freq * 2.5), startTime + duration);
    filter.connect(noteGain);

    const oscs: OscillatorNode[] = [];

    harmonics.forEach((h) => {
      const osc = this.ctx!.createOscillator();
      const oscGain = this.ctx!.createGain();

      osc.type = h.ratio === 1.0 ? 'triangle' : 'sine';
      // Slight detune for natural acoustic string chorusing
      osc.frequency.setValueAtTime(freq * h.ratio, startTime);
      if (h.ratio === 1.0) {
        osc.detune.setValueAtTime((Math.random() - 0.5) * 3, startTime);
      }

      oscGain.gain.setValueAtTime(h.weight, startTime);
      osc.connect(oscGain);
      oscGain.connect(filter);

      osc.start(startTime);
      const stopAt = startTime + duration + 0.3;
      osc.stop(stopAt);
      oscs.push(osc);
    });

    // Acoustic Piano ADSR Envelope
    const attack = 0.005; // rapid hammer strike
    const decay = duration * 0.9;
    noteGain.gain.setValueAtTime(0.0001, startTime);
    noteGain.gain.linearRampToValueAtTime(volume, startTime + attack);
    noteGain.gain.exponentialRampToValueAtTime(volume * 0.4, startTime + Math.min(0.2, duration * 0.3));
    noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration + 0.2);

    const cleanup = {
      stop: () => {
        try {
          noteGain.gain.cancelScheduledValues(0);
          noteGain.gain.setValueAtTime(0.0001, this.ctx?.currentTime || 0);
          oscs.forEach(o => {
            try { o.stop(); } catch { /* ignore */ }
          });
        } catch { /* ignore */ }
      }
    };

    this.activeNodes.push(cleanup);
    setTimeout(() => {
      const idx = this.activeNodes.indexOf(cleanup);
      if (idx !== -1) this.activeNodes.splice(idx, 1);
    }, (duration + 0.5) * 1000);
  }

  // Classical / Acoustic Guitar synthesis
  private synthesizeGuitarVoice(freq: number, startTime: number, duration: number, volume: number) {
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, startTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(Math.min(6000, freq * 5), startTime);
    filter.frequency.exponentialRampToValueAtTime(400, startTime + duration);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(volume * 0.9, startTime + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.1);
  }

  // Bass guitar synthesis
  private synthesizeBassVoice(freq: number, startTime: number, duration: number, volume: number) {
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, startTime);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(volume * 1.1, startTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.1);
  }

  // Metronome click track
  public playMetronomeTick(accent: boolean = false) {
    this.initContext();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(accent ? 1600 : 1000, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  // Stop all actively playing scheduled sounds
  public stopAll() {
    this.activeNodes.forEach(node => {
      try { node.stop(); } catch { /* ignore */ }
    });
    this.activeNodes = [];
  }

  public setMasterVolume(val: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, val)), this.ctx.currentTime);
    }
  }

  public getCurrentTime(): number {
    return this.ctx ? this.ctx.currentTime : 0;
  }
}

export const audioSynth = new AudioSynthesizer();
