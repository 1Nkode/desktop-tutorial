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

// Plays a recorded blob back PITCHED UP — the real Talking-Tom voice
// (your own voice replayed higher/faster, not robotic text-to-speech).
function playPitched(blob, setTalk, { rate = 1.65, text = '🔊' } = {}) {
  try {
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.playbackRate = rate;
    // disable pitch preservation so a faster rate also raises the pitch
    audio.preservesPitch = false;
    audio.mozPreservesPitch = false;
    audio.webkitPreservesPitch = false;
    audio.onplay = () => setTalk('talking', text);
    audio.onended = () => { setTalk('idle'); URL.revokeObjectURL(url); };
    audio.onerror = () => { setTalk('idle'); URL.revokeObjectURL(url); };
    audio.play().catch(() => setTalk('idle'));
  } catch { setTalk('idle'); }
}

// Full Talking-Tom turn: record your voice while you talk, then replay it
// pitched up (Tom's voice). Falls back to TTS if recording isn't available.
export async function talkOnce(setTalk) {
  const canRecord = typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia && typeof MediaRecorder !== 'undefined';
  if (!canRecord) return ttsFallback(setTalk);

  let stream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch { setTalk('idle'); return; }

  const chunks = [];
  let lastText = '🔊';
  const rec = new MediaRecorder(stream);
  rec.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };
  rec.onstop = () => {
    stream.getTracks().forEach(t => t.stop());
    if (!chunks.length) { setTalk('idle'); return; }
    playPitched(new Blob(chunks, { type: rec.mimeType || 'audio/webm' }), setTalk, { text: lastText });
  };

  setTalk('listening');
  rec.start();

  let stopped = false;
  const stop = () => { if (!stopped && rec.state !== 'inactive') { stopped = true; rec.stop(); } };

  // Use speech recognition only to detect end-of-speech + caption text
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SR) {
    const r = new SR();
    r.lang = 'es-ES';
    r.interimResults = false;
    r.onresult = (e) => { lastText = e.results[e.results.length - 1][0].transcript || '🔊'; };
    r.onspeechend = stop;
    r.onend = stop;
    try { r.start(); } catch { /* noop */ }
    setTimeout(() => { try { r.stop(); } catch { /* noop */ } }, 5000);
  }
  setTimeout(stop, 4500); // safety max record window
}

// Fallback when MediaRecorder/mic isn't available: recognise + TTS echo.
function ttsFallback(setTalk) {
  const frogSpeak = (text) => {
    if (!text) { setTalk('idle'); return; }
    setTalk('talking', text);
    speak(text, { onstart: () => setTalk('talking', text), onend: () => setTalk('idle') });
    setTimeout(() => setTalk('idle'), Math.min(8000, 1500 + text.length * 90));
  };
  if (speechSupported()) {
    listen({ onStart: () => setTalk('listening'), onError: () => setTalk('idle'), onResult: frogSpeak });
  } else {
    const t = prompt('Escribe algo y tu mascota lo repetirá:');
    frogSpeak(t || '');
  }
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
