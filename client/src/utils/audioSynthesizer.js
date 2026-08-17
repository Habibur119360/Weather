/**
 * Pure Web Audio API Ambient Weather Soundscape Generator
 * Synthesizes ambient weather sounds without external audio files.
 */

class WeatherAudioSynthesizer {
  constructor() {
    this.ctx = null;
    this.currentMode = null;
    this.nodes = [];
    this.gainNode = null;
    this.volume = 0.4;
    this.isPlaying = false;
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  stop() {
    if (this.nodes && this.nodes.length > 0) {
      this.nodes.forEach((node) => {
        try {
          if (node.stop) node.stop();
          if (node.disconnect) node.disconnect();
        } catch (e) {}
      });
      this.nodes = [];
    }
    this.isPlaying = false;
    this.currentMode = null;
  }

  // Create White/Pink Noise Buffer
  createNoiseBuffer(type = 'pink') {
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    if (type === 'pink') {
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }
    } else {
      // White noise
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    }
    return buffer;
  }

  playRain() {
    this.initContext();
    this.stop();
    if (!this.ctx) return;

    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(this.volume * 0.6, this.ctx.currentTime);
    this.gainNode.connect(this.ctx.destination);

    // Pink noise rain bed
    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = this.createNoiseBuffer('pink');
    noiseSource.loop = true;

    // Filter for gentle rain
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, this.ctx.currentTime);

    noiseSource.connect(filter);
    filter.connect(this.gainNode);
    noiseSource.start();

    this.nodes.push(noiseSource, filter, this.gainNode);
    this.isPlaying = true;
    this.currentMode = 'rain';
  }

  playWind() {
    this.initContext();
    this.stop();
    if (!this.ctx) return;

    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(this.volume * 0.5, this.ctx.currentTime);
    this.gainNode.connect(this.ctx.destination);

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = this.createNoiseBuffer('pink');
    noiseSource.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(400, this.ctx.currentTime);
    filter.Q.setValueAtTime(3, this.ctx.currentTime);

    // LFO for wind modulation
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.setValueAtTime(0.2, this.ctx.currentTime);
    lfoGain.gain.setValueAtTime(250, this.ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    noiseSource.connect(filter);
    filter.connect(this.gainNode);
    noiseSource.start();

    this.nodes.push(noiseSource, filter, lfo, lfoGain, this.gainNode);
    this.isPlaying = true;
    this.currentMode = 'wind';
  }

  playNight() {
    this.initContext();
    this.stop();
    if (!this.ctx) return;

    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(this.volume * 0.35, this.ctx.currentTime);
    this.gainNode.connect(this.ctx.destination);

    // Low background breeze
    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = this.createNoiseBuffer('pink');
    noiseSource.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(250, this.ctx.currentTime);

    noiseSource.connect(filter);
    filter.connect(this.gainNode);
    noiseSource.start();

    this.nodes.push(noiseSource, filter, this.gainNode);
    this.isPlaying = true;
    this.currentMode = 'night';
  }

  playSunny() {
    this.initContext();
    this.stop();
    if (!this.ctx) return;

    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(this.volume * 0.3, this.ctx.currentTime);
    this.gainNode.connect(this.ctx.destination);

    // Soft warm breeze
    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = this.createNoiseBuffer('pink');
    noiseSource.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(500, this.ctx.currentTime);

    noiseSource.connect(filter);
    filter.connect(this.gainNode);
    noiseSource.start();

    this.nodes.push(noiseSource, filter, this.gainNode);
    this.isPlaying = true;
    this.currentMode = 'sunny';
  }

  toggleSound(ambient = 'clear') {
    if (this.isPlaying) {
      this.stop();
      return false;
    }

    if (ambient.includes('rain') || ambient.includes('drizzle') || ambient.includes('thunderstorm')) {
      this.playRain();
    } else if (ambient.includes('snow') || ambient.includes('wind')) {
      this.playWind();
    } else if (ambient.includes('night')) {
      this.playNight();
    } else {
      this.playSunny();
    }
    return true;
  }
}

export const soundSynth = new WeatherAudioSynthesizer();
