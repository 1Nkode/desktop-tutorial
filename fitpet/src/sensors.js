/*
  Real device sensors usable from the browser:
  - Web Bluetooth Heart Rate (GATT 0x180D / 0x2A37): live BPM from a real
    BLE chest strap / Mi Band / watch that exposes the standard HR service.
  Works on Chrome/Edge over HTTPS (or localhost). Other brands' cloud APIs
  (Fitbit/Garmin/Apple) need native or OAuth backends and are simulated.
*/
export function bluetoothSupported() {
  return typeof navigator !== 'undefined' && !!navigator.bluetooth;
}

// Connect to a real BLE heart-rate sensor. Returns the device (call
// device.gatt.disconnect() to stop). Calls onHR(bpm) on every notification.
export async function connectHeartRate({ onHR, onDisconnect } = {}) {
  if (!bluetoothSupported()) throw new Error('Web Bluetooth no está disponible en este navegador');
  const device = await navigator.bluetooth.requestDevice({
    filters: [{ services: ['heart_rate'] }],
    optionalServices: ['battery_service'],
  });
  if (onDisconnect) device.addEventListener('gattserverdisconnected', onDisconnect);
  const server = await device.gatt.connect();
  const service = await server.getPrimaryService('heart_rate');
  const ch = await service.getCharacteristic('heart_rate_measurement');
  await ch.startNotifications();
  ch.addEventListener('characteristicvaluechanged', (e) => {
    const v = e.target.value;
    const flags = v.getUint8(0);
    const hr = (flags & 0x1) ? v.getUint16(1, true) : v.getUint8(1);
    if (hr > 0) onHR?.(hr);
  });
  return device;
}
