import { useStore } from './store/useStore';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Pet from './components/Pet';
import Workouts from './components/Workouts';
import Social from './components/Social';
import Rewards from './components/Rewards';
import Modals from './components/Modals';
import './App.css';

export default function App() {
  const { activeTab } = useStore();

  return (
    <div className="app">
      <TopBar />
      <main className="main-content">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'pet' && <Pet />}
        {activeTab === 'workouts' && <Workouts />}
        {activeTab === 'social' && <Social />}
        {activeTab === 'rewards' && <Rewards />}
      </main>
      <Navigation />
      <Modals />
    </div>
  );
}

function TopBar() {
  const { setShowNotifications, setShowSettings, notifications } = useStore();
  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="topbar">
      <div className="topbar-logo">
        <span className="logo-icon">🐾</span>
        <span className="logo-text">FitPet</span>
      </div>
      <div className="topbar-right">
        <button className="icon-btn notif-btn" onClick={() => setShowNotifications(true)}>
          🔔
          {unread > 0 && <span className="notif-badge">{unread}</span>}
        </button>
        <button className="icon-btn" onClick={() => setShowSettings(true)}>⚙️</button>
      </div>
    </div>
  );
}
