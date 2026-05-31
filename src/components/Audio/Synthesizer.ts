'use client';

class AmbientSynthesizer {
  private ctx: AudioContext | null = null;
  private isInitialized = false;
  
  // Master gain for volume control
  private masterGain: GainNode | null = null;
  
  // Reverb node for spacey sound
  private convolver: ConvolverNode | null = null;

  public async init() {
    if (this.isInitialized) return;
    
    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.3; // Keep it ambient and quiet
      
      this.convolver = this.ctx.createConvolver();
      // Generate a simple impulse response for reverb
      this.convolver.buffer = this.createReverbBuffer(this.ctx);
      
      this.convolver.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
      
      this.isInitialized = true;
    } catch (e) {
      console.warn('AudioContext initialization failed:', e);
    }
  }

  // Create a synthetic impulse response for a large room/cave reverb
  private createReverbBuffer(ctx: AudioContext): AudioBuffer {
    const rate = ctx.sampleRate;
    const length = rate * 3; // 3 seconds reverb
    const impulse = ctx.createBuffer(2, length, rate);
    
    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        // Exponential decay of white noise
        channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 5);
      }
    }
    return impulse;
  }

  public playTone(frequency: number, type: OscillatorType = 'sine', duration: number = 2) {
    if (!this.isInitialized || !this.ctx || !this.convolver) return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);
    
    // Envelope: quick attack, long release
    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.5, this.ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(this.convolver); // Connect to reverb instead of directly to master
    
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  // Helper methods for specific game events
  public playHover() {
    // E minor pentatonic notes sound spacey and pleasant
    const pentatonic = [329.63, 392.00, 440.00, 493.88, 587.33]; 
    const randomFreq = pentatonic[Math.floor(Math.random() * pentatonic.length)];
    this.playTone(randomFreq, 'sine', 1.5);
  }

  public playClick() {
    // A higher, more defined chime (triangle wave)
    this.playTone(880.00, 'triangle', 2); 
    // And a subtle harmony
    this.playTone(1318.51, 'sine', 2.5);
  }
  
  public playEasterEgg() {
    // Deep, ominous bass drone
    this.playTone(55.00, 'sawtooth', 8);
    this.playTone(55.50, 'sawtooth', 8); // Slight detune for phasing
  }
}

// Export a singleton instance
export const synth = new AmbientSynthesizer();
