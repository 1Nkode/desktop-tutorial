import { useRef, useState } from 'react';
import { useStore } from '../store/useStore';
import { connectHeartRate, bluetoothSupported } from '../sensors';
import { connectFitbit, connectGoogleFit, fetchToday, disconnectProvider } from '../integrations/health';
import { playSound } from '../sound';
import './Devices.css';

const DEVICES = [
  { id: 'apple', name: 'Apple Watch', sub: 'Apple Health', icon: '⌚', kind: 'cloud' },
  { id: 'fitbit', name: 'Fitbit', sub: 'OAuth · datos reales', icon: '🟦', kind: 'oauth' },
  { id: 'samsung', name: 'Samsung Watch', sub: 'Samsung Health', icon: '⌚', kind: 'cloud' },
  { id: 'garmin', name: 'Garmin', sub: 'Garmin Connect', icon: '🛰️', kind: 'cloud' },
  { id: 'googlefit', name: 'Google Fit', sub: 'OAuth · datos reales', icon: '🟢', kind: 'oauth' },
  { id: 'oura', name: 'Oura Ring', sub: 'Sueño y recuperación', icon: '💍', kind: 'cloud' },
  { id: 'whoop', name: 'Whoop', sub: 'Esfuerzo y recuperación', icon: '🔴', kind: 'cloud' },
  { id: 'miband', name: 'Xiaomi Mi Band', sub: 'Bluetooth · HR real', icon: '📿', kind: 'bluetooth' },
  { id: 'huawei', name: 'Huawei Watch', sub: 'Huawei Health', icon: '⌚', kind: 'cloud' },
  { id: 'ble', name: 'Sensor BLE de pulso', icon: '❤️', sub: 'Bluetooth · HR real', kind: 'bluetooth' },
];

const DATA_REQUESTED = ['👣 Pasos', '🔥 Calorías', '❤️ Frecuencia cardíaca', '📏 Distancia', '⏱️ Minutos activos', '😴 Sueño'];

export default function Devices() {
  const { connectedDevices, lastDeviceSync, deviceError, liveHR, hr, stats,
    connectDevice, disconnectDevice, resyncDevices, setLiveHR, setDeviceError, setActiveTab, applyHealthSync } = useStore();
  const [permFor, setPermFor] = useState(null);   // device pending permission
  const [connecting, setConnecting] = useState(null);
  const btDevice = useRef(null);

  async function realResync() {
    const provider = connectedDevices.find(d => d === 'fitbit' || d === 'googlefit');
    if (!provider) { resyncDevices(); return; }
    try {
      setDeviceError(null);
      const data = await fetchToday(provider);
      if (data) applyHealthSync(data);
    } catch (e) { setDeviceError(e.message || 'No se pudo sincronizar'); }
  }

  const distance = (stats.steps * 0.0007).toFixed(2);
  const lastSyncTxt = lastDeviceSync ? timeAgo(lastDeviceSync) : 'nunca';

  async function doConnect(dev) {
    setPermFor(null);
    setConnecting(dev.id);
    setDeviceError(null);
    try {
      if (dev.kind === 'bluetooth') {
        if (!bluetoothSupported()) throw new Error('Web Bluetooth no disponible. Usa Chrome/Edge en HTTPS.');
        btDevice.current = await connectHeartRate({
          onHR: (bpm) => setLiveHR(bpm),
          onDisconnect: () => disconnectDevice(dev.id),
        });
        connectDevice(dev.id);
        playSound('reward');
      } else if (dev.kind === 'oauth') {
        // Real OAuth — this navigates away to Fitbit/Google and returns
        if (dev.id === 'fitbit') await connectFitbit();
        else if (dev.id === 'googlefit') connectGoogleFit();
        return; // page redirects; connection completes on return
      } else {
        // brands without a public web API yet: simulated pairing
        await new Promise(r => setTimeout(r, 900));
        connectDevice(dev.id);
        playSound('reward');
      }
    } catch (e) {
      setDeviceError(e.message || 'No se pudo conectar el dispositivo');
    } finally {
      setConnecting(null);
    }
  }

  function doDisconnect(id) {
    if (btDevice.current && (id === 'ble' || id === 'miband')) {
      try { btDevice.current.gatt?.disconnect(); } catch {}
      btDevice.current = null;
    }
    if (id === 'fitbit' || id === 'googlefit') disconnectProvider(id);
    disconnectDevice(id);
  }

  return (
    <div className="dev-page animate-fadeIn">
      <div className="dev-head">
        <button className="dev-back" onClick={() => setActiveTab('dashboard')}>‹</button>
        <h2 className="section-title">Dispositivos</h2>
        <button className="dev-resync" onClick={realResync} disabled={!connectedDevices.length}>
          <span className="material-symbols-outlined">sync</span>
        </button>
      </div>

      {/* live summary */}
      <div className="card dev-live">
        <div className="dev-live-row">
          <div className="dev-hr">
            <span className="material-symbols-outlined fill dev-hr-ico">favorite</span>
            <div>
              <p className="dev-hr-v">{liveHR ?? '--'} <span>BPM</span></p>
              <p className="dev-hr-sub">{liveHR ? 'en vivo' : 'sin señal'} · prom {hr.avg ?? '--'} · máx {hr.max ?? '--'}</p>
            </div>
          </div>
          <span className={`dev-status ${connectedDevices.length ? 'on' : ''}`}>
            {connectedDevices.length ? `${connectedDevices.length} conectado(s)` : 'sin conexión'}
          </span>
        </div>
        <div className="dev-metrics">
          <Metric icon="👣" v={stats.steps.toLocaleString()} l="Pasos" />
          <Metric icon="🔥" v={stats.caloriesBurned} l="Cal activas" />
          <Metric icon="📏" v={`${distance} km`} l="Distancia" />
          <Metric icon="⏱️" v={`${stats.activeMinutes}m`} l="Activo" />
        </div>
        <p className="dev-sync-txt">Última sincronización: {lastSyncTxt}</p>
      </div>

      {deviceError && <div className="dev-error">⚠️ {deviceError}</div>}

      <div className="section-header" style={{ marginTop: 4 }}>
        <span className="section-title">Dispositivos compatibles</span>
      </div>

      <div className="dev-list">
        {DEVICES.map(dev => {
          const connected = connectedDevices.includes(dev.id);
          return (
            <div className={`dev-item ${connected ? 'connected' : ''}`} key={dev.id}>
              <div className="dev-icon">{dev.icon}</div>
              <div className="dev-info">
                <p className="dev-name">{dev.name} {(dev.kind === 'bluetooth' || dev.kind === 'oauth') && <span className="dev-real">REAL</span>}</p>
                <p className="dev-sub">{dev.sub}</p>
              </div>
              {connected ? (
                <button className="dev-btn off" onClick={() => doDisconnect(dev.id)}>Desconectar</button>
              ) : (
                <button className="dev-btn" disabled={connecting === dev.id}
                  onClick={() => (dev.kind === 'bluetooth' || dev.kind === 'oauth') ? doConnect(dev) : setPermFor(dev)}>
                  {connecting === dev.id ? '…' : 'Conectar'}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="dev-privacy">
        <span className="material-symbols-outlined">lock</span>
        <p>Tus datos de salud se procesan en el dispositivo y nunca se comparten sin tu permiso. Puedes desconectar cuando quieras.</p>
      </div>

      <div style={{ height: 110 }} />

      {/* permission sheet */}
      {permFor && (
        <div className="modal-overlay" onClick={() => setPermFor(null)}>
          <div className="modal animate-slideUp" onClick={e => e.stopPropagation()}>
            <div className="modal-handle" />
            <div className="dev-perm-head">
              <div className="dev-icon big">{permFor.icon}</div>
              <div>
                <h3 className="modal-title" style={{ margin: 0 }}>Conectar {permFor.name}</h3>
                <p className="dev-sub">{permFor.sub}</p>
              </div>
            </div>
            <p className="dev-perm-label">FitPet podrá leer:</p>
            <div className="dev-perm-grid">
              {DATA_REQUESTED.map(d => <span key={d} className="dev-perm-chip">{d}</span>)}
            </div>
            <p className="dev-perm-note">
              {permFor.kind === 'cloud'
                ? 'En esta demo la conexión con servicios en la nube se simula (requiere OAuth/SDK nativo en producción) y empieza a sincronizar datos en vivo.'
                : 'Se abrirá el selector Bluetooth del navegador para vincular tu sensor real.'}
            </p>
            <button className="btn btn-primary modal-submit" onClick={() => doConnect(permFor)}>Autorizar y conectar</button>
            <button className="btn btn-outline modal-submit" style={{ marginTop: 10 }} onClick={() => setPermFor(null)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}

function Metric({ icon, v, l }) {
  return (
    <div className="dev-metric">
      <span className="dev-metric-ico">{icon}</span>
      <p className="dev-metric-v">{v}</p>
      <p className="dev-metric-l">{l}</p>
    </div>
  );
}

function timeAgo(ts) {
  const s = Math.round((Date.now() - ts) / 1000);
  if (s < 60) return 'hace segundos';
  if (s < 3600) return `hace ${Math.floor(s / 60)} min`;
  return `hace ${Math.floor(s / 3600)} h`;
}
