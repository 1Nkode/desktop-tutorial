/*
  Talking-Tom style voice: listen with the Web Speech API and repeat back
  in a funny high-pitched voice, or speak any text. Works in Chrome/Edge.
*/
export function speechSupported() {
  return typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
}

export function speak(text, { pitch = 1.7, rate = 1.05, lang = 'es-ES', onstart, onend } = {}) {
  try {
    const synth = window.speechSynthesis;
    if (!synth || !text) { onend?.(); return; }
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang; u.pitch = pitch; u.rate = rate;
    // prefer a matching voice if available
    const v = synth.getVoices().find(voice => voice.lang?.startsWith('es')) || synth.getVoices()[0];
    if (v) u.voice = v;
    if (onstart) u.onstart = onstart;
    if (onend) u.onend = onend;
    synth.speak(u);
  } catch { onend?.(); }
}

// Starts one-shot listening. Calls handlers; returns the recognition object.
export function listen({ lang = 'es-ES', onResult, onError, onStart, onEnd } = {}) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { onError?.('unsupported'); return null; }
  const rec = new SR();
  rec.lang = lang;
  rec.interimResults = false;
  rec.maxAlternatives = 1;
  rec.onstart = () => onStart?.();
  rec.onerror = (e) => onError?.(e.error);
  rec.onend = () => onEnd?.();
  rec.onresult = (e) => {
    const text = e.results[e.results.length - 1][0].transcript;
    onResult?.(text);
  };
  try { rec.start(); } catch { /* already started */ }
  return rec;
}
