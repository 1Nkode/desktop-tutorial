import { useEffect } from 'react';
import { useStore } from './store/useStore';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Pet from './components/Pet';
import Workouts from './components/Workouts';
import Social from './components/Social';
import Rewards from './components/Rewards';
import Profile from './components/Profile';
import Devices from './components/Devices';
import Modals from './components/Modals';
import { Avatar } from './components/Avatar';
import './App.css';

// Live-sync engine: while devices are connected, stream activity into the
// store (steps/calories/active minutes) and simulate HR when no real sensor.
function useLiveSync() {
  const connected = useStore(s => s.connectedDevices.length);
  const settings = useStore(s => s.settings);
  useEffect(() => {
    if (!connected || settings.autoSync === false) return;
    const id = setInterval(() => {
      if (document.hidden) return;
      const st = useStore.getState();
      st.liveTick();
      // simulate HR only if no real Bluetooth sensor is feeding it recently
      const realBT = st.connectedDevices.includes('ble') || st.connectedDevices.includes('miband');
      if (!realBT) {
        const base = st.liveHR || 78;
        const next = Math.max(58, Math.min(150, base + Math.round((Math.random() - 0.5) * 8)));
        st.setLiveHR(next);
      }
    }, 3000);
    return () => clearInterval(id);
  }, [connected, settings.autoSync]);
}

// On load, finish any wearable OAuth redirect and pull real data.
function useHealthRedirect() {
  useEffect(() => {
    (async () => {
      try {
        const { handleOAuthRedirect, fetchToday } = await import('./integrations/health');
        const res = await handleOAuthRedirect();
        if (!res) return;
        const st = useStore.getState();
        st.connectDevice(res.provider);
        const data = await fetchToday(res.provider);
        if (data) st.applyHealthSync(data);
        st.setActiveTab('devices');
      } catch (e) {
        useStore.getState().setDeviceError?.(e.message || 'Error de conexión');
      }
    })();
  }, []);
}

export default function App() {
  const { activeTab } = useStore();
  useLiveSync();
  useHealthRedirect();

  return (
    <div className="app">
      <TopBar />
      <main className="main-content">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'pet' && <Pet />}
        {activeTab === 'workouts' && <Workouts />}
        {activeTab === 'social' && <Social />}
        {activeTab === 'rewards' && <Rewards />}
        {activeTab === 'profile' && <Profile />}
        {activeTab === 'devices' && <Devices />}
      </main>
      <Navigation />
      <Modals />
    </div>
  );
}

function TopBar() {
  const { setShowNotifications, setShowSettings, setActiveTab, notifications, user } = useStore();
  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="topbar">
      <div className="topbar-logo" onClick={() => setActiveTab('profile')}>
        <Avatar user={user} size={38} className="topbar-avatar neon-glow" />
        <span className="logo-text">FitPet</span>
      </div>
      <div className="topbar-right">
        <div className="streak-pill-top">
          <span className="material-symbols-outlined fill">local_fire_department</span>
          {user.streak}
        </div>
        <button className="icon-btn notif-btn" onClick={() => setShowNotifications(true)}>
          <span className="material-symbols-outlined">notifications</span>
          {unread > 0 && <span className="notif-badge">{unread}</span>}
        </button>
        <button className="icon-btn" onClick={() => setShowSettings(true)}>
          <span className="material-symbols-outlined">settings</span>
        </button>
      </div>
    </div>
  );
}
