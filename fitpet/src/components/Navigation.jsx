import { useStore } from '../store/useStore';
import './Navigation.css';

const tabs = [
  { id: 'dashboard', icon: 'book', label: 'Diario' },
  { id: 'workouts', icon: 'fitness_center', label: 'Entreno' },
  { id: 'social', icon: 'groups', label: 'Comunidad' },
  { id: 'pet', icon: 'pets', label: 'Mascota' },
  { id: 'rewards', icon: 'emoji_events', label: 'Logros' },
];

export default function Navigation() {
  const { activeTab, setActiveTab } = useStore();

  return (
    <nav className="nav">
      {tabs.map(tab => {
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            className={`nav-item ${active ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className={`material-symbols-outlined nav-icon ${active ? 'fill' : ''}`}>{tab.icon}</span>
            <span className="nav-label">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
