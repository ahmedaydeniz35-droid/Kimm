let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctx) return null;
  if (!audioCtx) {
    audioCtx = new Ctx();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function playTone(
  freq: number,
  duration: number,
  type: OscillatorType = 'sine',
  gainValue = 0.06,
  delaySeconds = 0
) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime + delaySeconds;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(gainValue, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.02);
  } catch {
    // Ignore Web Audio errors on restricted devices
  }
}

export const soundFx = {
  tap(enabled: boolean) {
    if (!enabled) return;
    playTone(520, 0.06, 'triangle', 0.04);
  },
  lock(enabled: boolean) {
    if (!enabled) return;
    playTone(523.25, 0.09, 'sine', 0.06, 0);
    playTone(659.25, 0.14, 'sine', 0.06, 0.07);
  },
  shuffle(enabled: boolean) {
    if (!enabled) return;
    playTone(392, 0.07, 'triangle', 0.04, 0);
    playTone(440, 0.07, 'triangle', 0.04, 0.08);
    playTone(493.88, 0.09, 'triangle', 0.04, 0.16);
  },
  reveal(enabled: boolean) {
    if (!enabled) return;
    playTone(523.25, 0.16, 'sine', 0.05, 0);
    playTone(659.25, 0.16, 'sine', 0.05, 0.08);
    playTone(783.99, 0.28, 'sine', 0.06, 0.16);
  },
};
