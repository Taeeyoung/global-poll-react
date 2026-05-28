import { useApp } from '../context/AppContext.jsx';
import { FLAG_BG, LEADERS } from '../data/leaders.js';

export default function LeaderCard({ leader, onClick }) {
  const { tName, getEval, evals } = useApp();
  const ev = getEval(leader.id);
  const peaceVal = ev ? ev.peace : 0;

  const bg = FLAG_BG[leader.id] || '#e2e8f0';
  const bgStyle = bg.startsWith('linear') || bg.startsWith('radial')
    ? { background: bg } : { backgroundColor: bg };

  // 최고/최저 배지 계산
  const evalledScores = LEADERS
    .map(l => ({ id: l.id, peace: evals[l.id]?.peace ?? null }))
    .filter(x => x.peace !== null);

  let badge = null;
  if (ev && evalledScores.length >= 2) {
    const scores = evalledScores.map(x => x.peace);
    const min = Math.min(...scores);
    const max = Math.max(...scores);
    if (ev.peace === min) badge = 'lowest';
    else if (ev.peace === max) badge = 'highest';
    else badge = 'done';
  } else if (ev) {
    badge = 'done';
  }

  return (
    <div className="ldr-card" onClick={onClick}>
      {badge === 'done'    && <div className="ldr-badge done">✓</div>}
      {badge === 'lowest'  && <div className="ldr-badge lowest">!</div>}
      {badge === 'highest' && <div className="ldr-badge highest">+</div>}
      <div className="ldr-flag-strip" style={bgStyle} />
      <div className="ldr-name">{tName(leader.id)}</div>
      <div className="ldr-mini-bar">
        <div className="ldr-mini-fill" style={{ width: `${peaceVal}%` }} />
      </div>
    </div>
  );
}
