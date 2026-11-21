let context;
let muted = false;
export function unlock() {
  if (!context) {
    const Audio = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (Audio) context = new Audio();
  }
  if (context?.state === 'suspended') context.resume();
}
export function toggleMute() { muted = !muted; return muted; }
export function isMuted() { return muted; }
function note(frequency, delay, duration, type = 'sine', volume = 0.09) {
  if (!context || muted) return;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const start = context.currentTime + delay;
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(volume, start + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.02);
}
export function sound(kind) {
  if (kind === 'find') { note(660, 0, 0.18); note(990, 0.095, 0.27); }
  if (kind === 'miss') note(95, 0, 0.18, 'square', 0.035);
  if (kind === 'hint') note(520, 0, 0.3, 'sine', 0.06);
  if (kind === 'tick') note(800, 0, 0.055, 'sine', 0.04);
  if (kind === 'clear' || kind === 'victory') {
    const melody = kind === 'clear' ? [523, 659, 784, 1047] : [392, 523, 659, 784, 1047, 1319, 1568];
    melody.forEach((frequency, index) => note(frequency, index * 0.12, 0.45));
  }
}
