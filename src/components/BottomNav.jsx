import { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';

const TABS = [
  { id: 'home',    icon: '🏠', labelKey: 'tab_home' },
  { id: 'rx',      icon: '🌡️', labelKey: 'tab_rx' },
  { id: 'stats',   icon: '📊', labelKey: 'tab_stats' },
  { id: 'profile', icon: '👤', labelKey: 'tab_profile' },
];

export default function BottomNav({ tab, setTab }) {
  const { t } = useApp();
  const [bouncing, setBouncing] = useState(null);

  const handleClick = (id) => {
    setBouncing(id);
    setTimeout(() => setBouncing(null), 320);
    setTab(id);
  };

  return (
    <nav className="bnav">
      {TABS.map(item => (
        <button
          key={item.id}
          className={`bnav-item${tab === item.id ? ' active' : ''}`}
          onClick={() => handleClick(item.id)}
        >
          <span className={`bnav-item-icon${bouncing === item.id ? ' bounce' : ''}`}>
            {item.icon}
          </span>
          <span className="bnav-item-label">
            {t(item.labelKey).replace(/^[^\s]+\s/, '')}
          </span>
        </button>
      ))}
    </nav>
  );
}
