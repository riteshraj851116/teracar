// Web Audio API Procedural Supercar Sound Engine
// Synthesizes luxury supercar engine starts, revs, and micro UI sounds without external audio files.

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Plays a luxury subtle UI click sound
 */
export function playUiClick(pitch = 600) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(pitch, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(pitch * 0.5, ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch (e) {
    // AudioContext blocked or not supported
  }
}

/**
 * Synthesizes a high-performance V8/V10 supercar engine rev sound
 */
export function playEngineRev() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Sub-bass rumble
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'sawtooth';
    subOsc.frequency.setValueAtTime(55, now);
    subOsc.frequency.exponentialRampToValueAtTime(220, now + 0.35);
    subOsc.frequency.exponentialRampToValueAtTime(160, now + 0.7);
    subOsc.frequency.exponentialRampToValueAtTime(60, now + 1.2);

    subGain.gain.setValueAtTime(0.001, now);
    subGain.gain.linearRampToValueAtTime(0.18, now + 0.2);
    subGain.gain.linearRampToValueAtTime(0.22, now + 0.4);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.25);

    // Harmonic growl
    const growlOsc = ctx.createOscillator();
    const growlGain = ctx.createGain();
    growlOsc.type = 'triangle';
    growlOsc.frequency.setValueAtTime(110, now);
    growlOsc.frequency.exponentialRampToValueAtTime(440, now + 0.35);
    growlOsc.frequency.exponentialRampToValueAtTime(320, now + 0.7);
    growlOsc.frequency.exponentialRampToValueAtTime(120, now + 1.2);

    growlGain.gain.setValueAtTime(0.001, now);
    growlGain.gain.linearRampToValueAtTime(0.12, now + 0.25);
    growlGain.gain.exponentialRampToValueAtTime(0.001, now + 1.25);

    // Low-pass filter for rich exhaust tone
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, now);
    filter.frequency.exponentialRampToValueAtTime(1800, now + 0.35);
    filter.frequency.exponentialRampToValueAtTime(450, now + 1.2);

    subOsc.connect(filter);
    growlOsc.connect(filter);
    filter.connect(subGain);
    filter.connect(growlGain);

    subGain.connect(ctx.destination);
    growlGain.connect(ctx.destination);

    subOsc.start(now);
    growlOsc.start(now);

    subOsc.stop(now + 1.3);
    growlOsc.stop(now + 1.3);
  } catch (e) {
    // AudioContext blocked
  }
}
