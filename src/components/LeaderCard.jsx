import { useApp } from '../context/AppContext.jsx';
import { FLAG_BG } from '../data/leaders.js';

export default function LeaderCard({ leader, onClick }) {
  const { t, tName, tTitle, getEval } = useApp();
  const ev = getEval(leader.id);
  const isDone = !!ev;

  const bg = FLAG_BG[leader.id] || '#162236';
  const bgStyle = bg.startsWith('linear') || bg.startsWith('radial')
    ? { background: bg }
    : { backgroundColor: bg };

  return (
    <div className="ldr-card" onClick={onClick}>
      <div className="ldr-card-bg" style={bgStyle} />

      <div className="ldr-card-overlay">
        <div
          className={`ldr-card-badge ${isDone ? 'done' : 'pending'}`}
        >
          {isDone ? '✓' : '…'}
        </div>

        <div className="ldr-card-info">
          <div className="ldr-card-emoji">{leader.emoji}</div>
          <div className="ldr-card-name">{tName(leader.id)}</div>
          <div className="ldr-card-title">{tTitle(leader.id)}</div>

          {isDone && (
            <div className="ldr-card-score-bar">
              <div
                className="ldr-card-score-fill"
                style={{ width: `${ev.peace}%` }}
              />
            </div>
          )}

          <div className={`ldr-card-btn${isDone ? ' evaled' : ''}`}>
            {isDone ? t('btn_evaled') : t('btn_eval')}
          </div>
        </div>
      </div>
    </div>
  );
}
