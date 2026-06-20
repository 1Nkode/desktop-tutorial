import { useEffect, useRef, useState } from 'react';
import './BarcodeScanner.css';

/*
  BarcodeScanner — uses the device camera + the native BarcodeDetector API
  to read a product barcode, then looks it up on Open Food Facts to
  autocomplete nutrition. Falls back to manual barcode entry when the
  camera or BarcodeDetector isn't available (e.g. desktop browsers).
  Calls onFound(food) with a normalized food object.
*/
export default function BarcodeScanner({ onFound, onClose }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [status, setStatus] = useState('init');   // init | scanning | nocam | looking | notfound | error
  const [manual, setManual] = useState('');

  async function lookup(code) {
    setStatus('looking');
    try {
      const res = await fetch(`https://world.openfoodfacts.org/api/v2/product/${code}.json?fields=product_name,brands,nutriments,image_url`);
      const data = await res.json();
      if (data.status !== 1 || !data.product) { setStatus('notfound'); return; }
      const n = data.product.nutriments || {};
      const food = {
        id: 'bc' + code,
        name: data.product.product_name || data.product.brands || `Producto ${code}`,
        icon: '📦',
        serving: '100 g',
        calories: Math.round(n['energy-kcal_100g'] ?? n['energy-kcal_serving'] ?? 0),
        protein: +(n.proteins_100g ?? 0).toFixed(1),
        carbs: +(n.carbohydrates_100g ?? 0).toFixed(1),
        fat: +(n.fat_100g ?? 0).toFixed(1),
        fiber: +(n.fiber_100g ?? 0).toFixed(1),
        barcode: code,
      };
      stop();
      onFound(food);
    } catch {
      setStatus('error');
    }
  }

  function stop() {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
  }

  useEffect(() => {
    let detector, raf, cancelled = false;
    async function start() {
      if (!('BarcodeDetector' in window) || !navigator.mediaDevices?.getUserMedia) {
        setStatus('nocam');
        return;
      }
      try {
        detector = new window.BarcodeDetector({ formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128'] });
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        streamRef.current = stream;
        if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play(); }
        setStatus('scanning');
        const scan = async () => {
          if (cancelled || !videoRef.current) return;
          try {
            const codes = await detector.detect(videoRef.current);
            if (codes && codes.length) { lookup(codes[0].rawValue); return; }
          } catch { /* frame skip */ }
          raf = requestAnimationFrame(scan);
        };
        raf = requestAnimationFrame(scan);
      } catch {
        setStatus('nocam');
      }
    }
    start();
    return () => { cancelled = true; cancelAnimationFrame(raf); stop(); };
  }, []);

  return (
    <div className="bc-overlay" onClick={() => { stop(); onClose(); }}>
      <div className="bc-panel" onClick={e => e.stopPropagation()}>
        <div className="bc-head">
          <span>Escanear código</span>
          <button className="bc-x" onClick={() => { stop(); onClose(); }}>×</button>
        </div>

        {(status === 'init' || status === 'scanning' || status === 'looking') && (
          <div className="bc-cam">
            <video ref={videoRef} playsInline muted className="bc-video" />
            <div className="bc-reticle" />
            <p className="bc-cam-hint">{status === 'looking' ? 'Buscando producto…' : 'Apunta al código de barras'}</p>
          </div>
        )}

        {(status === 'nocam' || status === 'notfound' || status === 'error') && (
          <div className="bc-manual">
            <p className="bc-msg">
              {status === 'nocam' && '📷 Cámara/escáner no disponible en este dispositivo. Escribe el código:'}
              {status === 'notfound' && '🔍 Producto no encontrado. Prueba con otro código:'}
              {status === 'error' && '⚠️ Error de red. Intenta de nuevo:'}
            </p>
            <input
              className="input"
              placeholder="Ej. 7501055300013"
              value={manual}
              inputMode="numeric"
              onChange={e => setManual(e.target.value.replace(/\D/g, ''))}
              onKeyDown={e => e.key === 'Enter' && manual && lookup(manual)}
            />
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 10 }}
              disabled={manual.length < 6} onClick={() => lookup(manual)}>
              Buscar producto
            </button>
            <p className="bc-powered">Datos: Open Food Facts</p>
          </div>
        )}
      </div>
    </div>
  );
}
