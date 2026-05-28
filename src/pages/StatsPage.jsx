import { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { LEADERS, FLAG_BG } from '../data/leaders.js';
import MediaShareModal from '../components/MediaShareModal.jsx';

const TOTAL = LEADERS.length;

export default function StatsPage() {
  const { t, tName, getEval } = useApp();
  const [showShare, setShowShare] = useState(false);

  const evaluated = LEADERS
    .map(l => ({ leader: l, ev: getEval(l.id) }))
    .filter(x => !!x.ev);

  const ranked = [...evaluated].sort((a, b) => b.ev.peace - a.ev.peace);
  const doneCount = evaluated.length;
  const remaining = TOTAL - doneCount;

  const rankedForShare = ranked.map(item => ({
    name: tName(item.leader.id),
    peace: item.ev.peace,
  }));

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
        <>
          <div className="stats-rank-table">
            {ranked.map((item, i) => {
              const bg = FLAG_BG[item.leader.id] || '#e2e8f0';
              const bgStyle = bg.startsWith('linear') || bg.startsWith('radial')
                ? { background: bg } : { backgroundColor: bg };
              return (
                <div key={item.leader.id} className="stats-rank-row">
                  <div className={`stats-rank-num${i < 3 ? ' top' : ''}`}>
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                  </div>
                  <div className="stats-rank-flag" style={bgStyle} />
                  <span className="stats-rank-name">{tName(item.leader.id)}</span>
                  <div className="stats-rank-bar-wrap">
                    <div className="stats-rank-bar">
                      <div className="stats-rank-bar-fill" style={{ width: `${item.ev.peace}%` }} />
                    </div>
                  </div>
                  <span className="stats-rank-score">{item.ev.peace}</span>
                </div>
              );
            })}
          </div>

          <button className="stats-share-btn" onClick={() => setShowShare(true)}>
            📧 결과를 언론사·기관에 보내기
          </button>
        </>
      )}

      {showShare && (
        <MediaShareModal
          ranked={rankedForShare}
          onClose={() => setShowShare(false)}
        />
      )}
    </div>
  );
}
