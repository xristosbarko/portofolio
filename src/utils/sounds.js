// Retro 8-bit sound engine using Web Audio API — no external deps needed

let ctx = null;

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  // Resume if suspended (browsers require user gesture first)
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function playTone({ freq = 440, type = 'square', duration = 0.1, volume = 0.15, delay = 0 }) {
  try {
    const ac = getCtx();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ac.currentTime + delay);
    gain.gain.setValueAtTime(0, ac.currentTime + delay);
    gain.gain.linearRampToValueAtTime(volume, ac.currentTime + delay + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + delay + duration);
    osc.start(ac.currentTime + delay);
    osc.stop(ac.currentTime + delay + duration + 0.05);
  } catch (e) {
    // Silently fail if audio isn't available
  }
}

export const sounds = {
  // Short blip on tab / general click
  click() {
    playTone({ freq: 440, type: 'square', duration: 0.06, volume: 0.1 });
  },

  // Ascending 3-note arpeggio on XP gain
  xpGain() {
    [523, 659, 784].forEach((freq, i) => {
      playTone({ freq, type: 'square', duration: 0.1, volume: 0.12, delay: i * 0.07 });
    });
  },

  // Fanfare for quest accept
  questAccept() {
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      playTone({ freq, type: 'square', duration: 0.15, volume: 0.13, delay: i * 0.09 });
    });
  },

  // Achievement unlock chime
  achievement() {
    [784, 988, 1175, 1568].forEach((freq, i) => {
      playTone({ freq, type: 'sine', duration: 0.2, volume: 0.12, delay: i * 0.08 });
    });
  },

  // Big level-up fanfare
  levelUp() {
    const melody = [
      { freq: 523, delay: 0 },
      { freq: 659, delay: 0.1 },
      { freq: 784, delay: 0.2 },
      { freq: 1047, delay: 0.3 },
      { freq: 784, delay: 0.4 },
      { freq: 1047, delay: 0.5 },
      { freq: 1319, delay: 0.65 },
    ];
    melody.forEach(({ freq, delay }) => {
      playTone({ freq, type: 'square', duration: 0.18, volume: 0.15, delay });
    });
  },

  // Error/locked blip
  locked() {
    playTone({ freq: 180, type: 'sawtooth', duration: 0.15, volume: 0.1 });
  },

  // Konami / secret
  secret() {
    const notes = [262, 330, 392, 523, 659, 784, 1047, 1319];
    notes.forEach((freq, i) => {
      playTone({ freq, type: 'square', duration: 0.12, volume: 0.13, delay: i * 0.06 });
    });
  },
};
