import { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { LEADERS } from '../data/leaders.js';
import MediaShareModal from '../components/MediaShareModal.jsx';
import LeaderAvatar from '../components/LeaderAvatar.jsx';

const TOTAL = LEADERS.length;

function RankTable({ items, type }) {
  return (
    <div className="stats-rank-table">
      {items.map((item, i) => {
        const score = type === 'peace' ? item.ev.peace : item.ev.tension;
        return (
          <div key={item.leader.id} className="stats-rank-row">
            <div className={`stats-rank-num${i < 3 ? ' top' : ''}`}>
              {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
            </div>
            <div className="stats-rank-flag"><LeaderAvatar leader={item.leader} /></div>
            <span className="stats-rank-name">{item.name}</span>
            <div className="stats-rank-bar-wrap">
              <div className="stats-rank-bar">
                <div
                  className={`stats-rank-bar-fill${type === 'tension' ? ' tension' : ''}`}
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
            <span className={`stats-rank-score${type === 'tension' ? ' tension' : ''}`}>
              {score}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function StatsPage() {
  const { t, tName, getEval } = useApp();
  const [rankType, setRankType] = useState('peace');
  const [showShare, setShowShare] = useState(false);

  const evaluated = LEADERS
    .map(l => ({ leader: l, ev: getEval(l.id), name: tName(l.id) }))
    .filter(x => !!x.ev);

  const doneCount   = evaluated.length;
  const remaining   = TOTAL - doneCount;

  const avgPeace   = doneCount
    ? Math.round(evaluated.reduce((s, x) => s + x.ev.peace, 0) / doneCount)
    : null;
  const avgTension = doneCount
    ? Math.round(evaluated.reduce((s, x) => s + x.ev.tension, 0) / doneCount)
    : null;

  const rankedPeace   = [...evaluated].sort((a, b) => b.ev.peace   - a.ev.peace);
  const rankedTension = [...evaluated].sort((a, b) => b.ev.tension - a.ev.tension);
  const currentRanked = rankType === 'peace' ? rankedPeace : rankedTension;

  const rankedForShare = rankedPeace.map(item => ({
    name: item.name, peace: item.ev.peace,
  }));

  return (
    <div className="stats-page">
      {/* 요약 카드 4개 */}
      <div className="stats-cards stats-cards-4">
        <div className="stats-card">
          <div className="stats-card-val peace">{doneCount}</div>
          <div className="stats-card-label">{t('stats_done')}</div>
        </div>
        <div className="stats-card">
          <div className="stats-card-val pending">{remaining}</div>
          <div className="stats-card-label">{t('stats_remain')}</div>
        </div>
        <div className="stats-card">
          <div className="stats-card-val peace">
            {avgPeace !== null ? avgPeace : '–'}
          </div>
          <div className="stats-card-label">평균 평화 온도</div>
        </div>
        <div className="stats-card">
          <div className="stats-card-val tension">
            {avgTension !== null ? avgTension : '–'}
          </div>
          <div className="stats-card-label">평균 긴장 온도</div>
        </div>
      </div>

      {evaluated.length === 0 ? (
        <div className="stats-empty">{t('stats_empty')}</div>
      ) : (
        <>
          {/* 랭킹 타입 탭 */}
          <div className="stats-rank-tabs">
            <button
              className={`stats-rank-tab${rankType === 'peace' ? ' active peace' : ''}`}
              onClick={() => setRankType('peace')}
            >
              🕊️ 평화 온도 순위
            </button>
            <button
              className={`stats-rank-tab${rankType === 'tension' ? ' active tension' : ''}`}
              onClick={() => setRankType('tension')}
            >
              🔥 긴장 온도 순위
            </button>
          </div>

          <RankTable items={currentRanked} type={rankType} />

          <button className="stats-share-btn" onClick={() => setShowShare(true)}>
            📧 결과를 언론사·기관에 보내기
          </button>
        </>
      )}

      {showShare && (
        <MediaShareModal ranked={rankedForShare} onClose={() => setShowShare(false)} />
      )}
    </div>
  );
}
