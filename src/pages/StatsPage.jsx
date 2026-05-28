import { useApp } from '../context/AppContext.jsx';
import { LEADERS } from '../data/leaders.js';

const TOTAL = LEADERS.length;

export default function StatsPage() {
  const { t, tName, getEval } = useApp();

  const evaluated = LEADERS
    .map(l => ({ leader: l, ev: getEval(l.id) }))
    .filter(x => !!x.ev);

  const ranked = [...evaluated].sort((a, b) => b.ev.peace - a.ev.peace);
  const doneCount = evaluated.length;
  const remaining = TOTAL - doneCount;

  return (
    <div className="stats-page">
      <div className="stats-title grad-text">{t('stats_title')}</div>

      <div className="stats-cards">
        <div className="stats-card">
          <div className="stats-card-val peace">{doneCount}</div>
          <div className="stats-card-label">{t('stats_done')}</div>
        </div>
        <div className="stats-card">
          <div className="stats-card-val pending">{remaining}</div>
          <div className="stats-card-label">{t('stats_remain')}</div>
        </div>
      </div>

      <div className="stats-rank-title">{t('stats_rank')}</div>

      {ranked.length === 0 ? (
        <div className="stats-empty">{t('stats_empty')}</div>
      ) : (
        <div className="stats-rank-table">
          {ranked.map((item, i) => (
            <div key={item.leader.id} className="stats-rank-row">
              <div className={`stats-rank-num${i < 3 ? ' top' : ''}`}>
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
              </div>
              <span className="stats-rank-emoji">{item.leader.emoji}</span>
              <span className="stats-rank-name">{tName(item.leader.id)}</span>
              <div className="stats-rank-bar-wrap">
                <div className="stats-rank-bar">
                  <div
                    className="stats-rank-bar-fill"
                    style={{ width: `${item.ev.peace}%` }}
                  />
                </div>
              </div>
              <span className="stats-rank-score">{item.ev.peace}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
