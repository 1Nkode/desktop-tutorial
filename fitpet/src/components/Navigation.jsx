import { useStore } from '../store/useStore';
import './Navigation.css';

const tabs = [
  { id: 'dashboard', icon: '📊', label: 'Home' },
  { id: 'pet', icon: '🐾', label: 'Pet' },
  { id: 'workouts', icon: '💪', label: 'Train' },
  { id: 'social', icon: '🌍', label: 'Social' },
  { id: 'rewards', icon: '🏆', label: 'Awards' },
];

export default function Navigation() {
  const { activeTab, setActiveTab } = useStore();

  return (
    <nav className="nav">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => setActiveTab(tab.id)}
        >
          <span className="nav-icon">{tab.icon}</span>
          <span className="nav-label">{tab.label}</span>
          {activeTab === tab.id && <span className="nav-dot" />}
        </button>
      ))}
    </nav>
  );
}
