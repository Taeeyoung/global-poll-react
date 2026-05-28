import { useApp } from '../context/AppContext.jsx';
import { FLAG_BG } from '../data/leaders.js';

export default function LeaderCard({ leader, onClick }) {
  const { tName, getEval } = useApp();
  const ev = getEval(leader.id);
  const peaceVal = ev ? ev.peace : 0;

  const bg = FLAG_BG[leader.id] || '#e2e8f0';
  const bgStyle = bg.startsWith('linear') || bg.startsWith('radial')
    ? { background: bg }
    : { backgroundColor: bg };

  return (
    <div className="ldr-card" onClick={onClick}>
      {ev && <div className="ldr-badge done">✓</div>}
      <div className="ldr-flag-strip" style={bgStyle} />
      <div className="ldr-name">{tName(leader.id)}</div>
      <div className="ldr-mini-bar">
        <div className="ldr-mini-fill" style={{ width: `${peaceVal}%` }} />
      </div>
    </div>
  );
}
