import { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import LeaderAvatar from './LeaderAvatar.jsx';

const CC = {
  trump:'us', putin:'ru', zelensky:'ua', xi:'cn', ishiba:'jp',
  macron:'fr', modi:'in', netanyahu:'il', erdogan:'tr',
  guterres:'un', pope:'va', mbs:'sa', khamenei:'ir', kim:'kp',
};

function FlagBadge({ id }) {
  const [err, setErr] = useState(false);
  const cc = CC[id];
  return (
    <span className="ldr-flag-badge">
      {!err && cc && cc !== 'un'
        ? <img src={`https://flagcdn.com/w80/${cc}.png`} alt={cc} onError={() => setErr(true)} />
        : <span>{CC[id] === 'un' ? '🌍' : (cc ?? '').toUpperCase()}</span>}
    </span>
  );
}

function scoreColor(v) {
  if (v == null) return '#6f86a3';
  const t = Math.max(0, Math.min(100, v)) / 100;
  const stops = [[0,[233,86,86]],[0.5,[246,183,90]],[1,[54,211,154]]];
  let a = stops[0], b = stops[2];
  for (let i = 0; i < stops.length - 1; i++) {
    if (t >= stops[i][0] && t <= stops[i+1][0]) { a = stops[i]; b = stops[i+1]; break; }
  }
  const f = (t - a[0]) / ((b[0] - a[0]) || 1);
  const c = a[1].map((x, i) => Math.round(x + (b[1][i] - x) * f));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}

function fmtVotes(n) {
  if (n >= 10000) return (n / 10000).toFixed(1).replace(/\.0$/, '') + '만';
  if (n >= 1000)  return (n / 1000).toFixed(1).replace(/\.0$/, '') + '천';
  return String(n);
}

export default function LeaderCard({ leader, onClick }) {
  const { tName, getEval } = useApp();
  const ev = getEval(leader.id);
  const avg = leader.avg ?? 50;

  return (
    <div className="ldr-card-v" onClick={onClick}>
      <div className="ldr-card-portrait">
        <LeaderAvatar leader={leader} />

        {/* 좌상단 국기 배지 */}
        <FlagBadge id={leader.id} />

        {/* 우상단 상태 배지 */}
        <div className={`ldr-card-badge${ev ? ' done' : ' pending'}`}>
          {ev ? `✓ ${ev.peace}점` : '미평가'}
        </div>
      </div>
      <div className="ldr-card-body">
        <div className="ldr-card-name">{tName(leader.id)}</div>
        <div className="ldr-card-sub">{leader.title}</div>

        <div className="ldr-card-avg-row">
          <span className="ldr-card-avg-label">글로벌 평균</span>
          <span className="ldr-card-avg-score" style={{ color: scoreColor(avg) }}>{avg}</span>
          <span className="ldr-card-avg-denom">/100</span>
        </div>
        <div className="ldr-card-score-bar">
          <div className="ldr-card-score-fill" style={{ width: `${avg}%`, background: scoreColor(avg) }} />
        </div>

        <div className="ldr-card-footer">
          <span className="ldr-card-votes">{fmtVotes(leader.votes ?? 0)}명 참여</span>
          {ev && <span className="ldr-card-my">내 평가 {ev.peace}점</span>}
        </div>
      </div>
    </div>
  );
}
