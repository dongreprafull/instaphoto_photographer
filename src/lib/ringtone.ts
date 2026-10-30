// Plays an audible alert + vibration when a new booking offer comes in.
// Uses the Web Audio API to generate a simple beep (no audio asset file
// needed) and falls back to vibration-only if Web Audio isn't available.
let audioCtx: AudioContext | null = null
let stopFn: (() => void) | null = null

export function playRing() {
  stopRing()
  try {
    const Ctx = window.AudioContext || (window as any).webkitAudioContext
    if (!Ctx) throw new Error('no AudioContext')
    if (!audioCtx) audioCtx = new Ctx()
    const ctx = audioCtx
    if (ctx.state === 'suspended') ctx.resume().catch(() => {})

    let stopped = false
    const beep = () => {
      if (stopped) return
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = 880
      gain.gain.setValueAtTime(0.0001, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.4, ctx.currentTime + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.4)
    }

    beep()
    const interval = setInterval(beep, 700)
    try {
      navigator.vibrate?.([300, 200, 300, 200, 300])
    } catch {
      // ignore
    }

    stopFn = () => {
      stopped = true
      clearInterval(interval)
      try {
        navigator.vibrate?.(0)
      } catch {
        // ignore
      }
    }
  } catch {
    try {
      navigator.vibrate?.([300, 200, 300, 200, 300])
    } catch {
      // ignore — no audio, no vibration available
    }
  }
}

export function stopRing() {
  if (stopFn) {
    stopFn()
    stopFn = null
  }
}
