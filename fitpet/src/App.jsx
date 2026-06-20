import { useStore } from './store/useStore';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Pet from './components/Pet';
import Workouts from './components/Workouts';
import Social from './components/Social';
import Rewards from './components/Rewards';
import Profile from './components/Profile';
import Modals from './components/Modals';
import { Avatar } from './components/Avatar';
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
        {activeTab === 'profile' && <Profile />}
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
