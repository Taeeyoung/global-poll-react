import { useApp } from '../context/AppContext.jsx';
import { FLAG_BG, GLOW_COLOR, LEADERS } from '../data/leaders.js';
import { PORTRAITS } from '../data/portraits.js';

export default function LeaderCard({ leader, onClick, featured = false }) {
  const { tName, getEval, evals } = useApp();
  const ev = getEval(leader.id);

  const bg = FLAG_BG[leader.id] || '#1e2d42';
  const bgStyle = bg.startsWith('linear') || bg.startsWith('radial')
    ? { background: bg } : { backgroundColor: bg };

  const glow = GLOW_COLOR[leader.id] || 'rgba(56,189,248,.2)';
  const portrait = PORTRAITS[leader.id];

  const evalledScores = LEADERS
    .map(l => ({ id: l.id, peace: evals[l.id]?.peace ?? null }))
    .filter(x => x.peace !== null);

  let badge = null;
  if (ev && evalledScores.length >= 2) {
    const scores = evalledScores.map(x => x.peace);
    if (ev.peace === Math.min(...scores)) badge = 'lowest';
    else if (ev.peace === Math.max(...scores)) badge = 'highest';
    else badge = 'done';
  } else if (ev) {
    badge = 'done';
  }

  return (
    <div
      className={`ldr-card${featured ? ' featured' : ''}`}
      onClick={onClick}
      style={{ '--glow': glow }}
    >
      {badge === 'done'    && <div className="ldr-badge done">✓</div>}
      {badge === 'lowest'  && <div className="ldr-badge lowest">!</div>}
      {badge === 'highest' && <div className="ldr-badge highest">+</div>}

      {/* 초상화 영역 — 국기 그라디언트 배경 */}
      <div className="ldr-portrait-wrap" style={bgStyle}>
        {portrait
          ? <div className="ldr-portrait" dangerouslySetInnerHTML={{ __html: portrait }} />
          : <div className="ldr-portrait-fallback">{leader.emoji}</div>
        }
      </div>

      {/* 텍스트 + 버튼 래퍼 (가로형 레이아웃에서 우측 컬럼 역할) */}
      <div className="ldr-content">
        <div className="ldr-info">
          <div className="ldr-name">{tName(leader.id)}</div>
          <div className="ldr-country">{leader.country}</div>
          {leader.chip && <div className="ldr-chip">{leader.chip}</div>}

          {ev && (
            <div className="ldr-scores">
              <div className="ldr-score-row">
                <span className="ldr-score-ico">🕊️</span>
                <div className="ldr-score-track">
                  <div className="ldr-score-fill peace" style={{ width: `${ev.peace}%` }} />
                </div>
                <span className="ldr-score-num peace">{ev.peace}</span>
              </div>
              <div className="ldr-score-row">
                <span className="ldr-score-ico">🔥</span>
                <div className="ldr-score-track">
                  <div className="ldr-score-fill tension" style={{ width: `${ev.tension}%` }} />
                </div>
                <span className="ldr-score-num tension">{ev.tension}</span>
              </div>
            </div>
          )}
        </div>

        <div className={`ldr-eval-btn${ev ? ' done' : ''}`}>
          {ev ? '✓ 완료' : '평가하기'}
        </div>
      </div>
    </div>
  );
}
