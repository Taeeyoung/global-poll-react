import { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { LEADERS, GLOBAL_RX_COUNT, LEADER_COMMENTS } from '../data/leaders.js';
import MediaShareModal from '../components/MediaShareModal.jsx';
import LeaderAvatar from '../components/LeaderAvatar.jsx';


const TOTAL = LEADERS.length;

function RankTable({ items, type }) {
  return (
    <div className="stats-rank-table">
      {items.map((item, i) => {
        const score = type === 'peace' ? item.ev.peace : item.ev.tension;
        const highlight = i < 3 ? (type === 'peace' ? ' highlight-peace' : ' highlight-tension') : '';
        const medalColor = ['#FFD700','#C0C0C0','#CD7F32'];
        return (
          <div key={item.leader.id} className={`stats-rank-row${highlight}`}>
            <div
              className={`stats-rank-num${i < 3 ? ' top' : ''}`}
              style={i < 3 ? { color: medalColor[i] } : {}}
            >
              {i + 1}
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

// 처방 한마디 팝업 (지도자별)
function CommentPopup({ leader, name, onClose }) {
  const comments = LEADER_COMMENTS[leader.id] || [];
  return (
    <div className="rxc-overlay" onClick={onClose}>
      <div className="rxc-modal" onClick={e => e.stopPropagation()}>
        <button className="rxc-close" onClick={onClose}>×</button>
        <div className="rxc-header">
          <div className="rxc-avatar"><LeaderAvatar leader={leader} /></div>
          <div>
            <div className="rxc-name">{name}</div>
            <div className="rxc-label">처방 한마디 모음</div>
          </div>
        </div>
        <div className="rxc-list">
          {comments.map((c, i) => (
            <div key={i} className="rxc-item">
              <span className="rxc-quote">"</span>
              <span className="rxc-text">{c}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 선택 통계 팝업 (요인별/유형별)
function StatPopup({ leader, name, label, onClose }) {
  const count = Math.round((leader.votes ?? 0) * 0.28).toLocaleString();
  return (
    <div className="rxc-overlay" onClick={onClose}>
      <div className="rxc-modal rxc-stat-modal" onClick={e => e.stopPropagation()}>
        <button className="rxc-close" onClick={onClose}>×</button>
        <div className="rxc-header">
          <div className="rxc-avatar"><LeaderAvatar leader={leader} /></div>
          <div className="rxc-name">{name}</div>
        </div>
        <p className="rxc-stat-text">
          전체 응답자 중 <strong>{count}명</strong>이<br />
          <strong>{name}</strong>에 대해<br />
          <strong className="rxc-stat-label">"{label}"</strong>을 선택했습니다.
        </p>
      </div>
    </div>
  );
}

function PrescriptionPattern() {
  const { tName, setActiveSheet } = useApp();
  const [view, setView] = useState('leader');
  const [commentPopup, setCommentPopup] = useState(null);   // { leader, name }
  const [statPopup, setStatPopup] = useState(null);         // { leader, name, label }

  // 커뮤니티 집계 데이터 (leaders.js mock)
  const data = LEADERS.map(l => ({
    leader: l,
    name: tName(l.id),
    evalOpt: l.topEvalOpt,
    topFactor: l.topFactor,
  }));

  // 전체 요약: 가장 많이 언급된 유형 / 요인
  const evalFreq = {}, factorFreq = {};
  data.forEach(p => {
    evalFreq[p.evalOpt]   = (evalFreq[p.evalOpt]   || 0) + 1;
    factorFreq[p.topFactor] = (factorFreq[p.topFactor] || 0) + 1;
  });
  const topEval   = Object.entries(evalFreq).sort((a, b) => b[1] - a[1])[0];
  const topFactor = Object.entries(factorFreq).sort((a, b) => b[1] - a[1])[0];

  // 요인별 그룹
  const byFactor = {};
  data.forEach(p => {
    if (!byFactor[p.topFactor]) byFactor[p.topFactor] = [];
    byFactor[p.topFactor].push(p);
  });
  const sortedFactors = Object.entries(byFactor).sort((a, b) => b[1].length - a[1].length);

  // 유형별 그룹
  const byEval = {};
  data.forEach(p => {
    if (!byEval[p.evalOpt]) byEval[p.evalOpt] = [];
    byEval[p.evalOpt].push(p);
  });
  const sortedEvals = Object.entries(byEval).sort((a, b) => b[1].length - a[1].length);

  return (
    <div className="stats-pattern">
      <div className="stats-pattern-title">
        🌐 전 세계 처방 패턴
        <span className="stats-pattern-sample">샘플</span>
        <span className="stats-pattern-participants">{GLOBAL_RX_COUNT.toLocaleString()}명 참여</span>
      </div>

      {/* 요약 2칸 */}
      <div className="stats-pattern-summary">
        <div className="stats-pattern-summary-card">
          <div className="stats-pattern-summary-label">가장 많이 선택된 유형</div>
          <div className="stats-pattern-summary-val">{topEval[0]}</div>
          <div className="stats-pattern-summary-count">{topEval[1]}명의 지도자</div>
        </div>
        <div className="stats-pattern-summary-card">
          <div className="stats-pattern-summary-label">가장 많이 지목된 요인</div>
          <div className="stats-pattern-summary-val">{topFactor[0]}</div>
          <div className="stats-pattern-summary-count">{topFactor[1]}명의 지도자</div>
        </div>
      </div>

      {/* 뷰 토글 — 유형별 / 요인별 순서 */}
      <div className="stats-pattern-toggle">
        <button className={`stats-pattern-tab${view === 'leader' ? ' active' : ''}`} onClick={() => setView('leader')}>지도자별</button>
        <button className={`stats-pattern-tab${view === 'eval'   ? ' active' : ''}`} onClick={() => setView('eval')}>유형별</button>
        <button className={`stats-pattern-tab${view === 'factor' ? ' active' : ''}`} onClick={() => setView('factor')}>요인별</button>
      </div>

      {/* 지도자별 뷰 */}
      {view === 'leader' && (
        <div className="stats-pattern-rows">
          {data.map(p => (
            <div key={p.leader.id} className="stats-pattern-row" onClick={() => setCommentPopup({ leader: p.leader, name: p.name })}>
              <div className="stats-rank-flag"><LeaderAvatar leader={p.leader} /></div>
              <span className="stats-pattern-name">{p.name}</span>
              <div className="stats-pattern-tags">
                <span className="stats-pattern-tag eval">{p.evalOpt}</span>
                <span className="stats-pattern-tag factor">{p.topFactor}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 유형별 뷰 */}
      {view === 'eval' && (
        <div className="stats-pattern-groups">
          {sortedEvals.map(([evalOpt, items]) => (
            <div key={evalOpt} className="stats-pattern-group stats-pattern-group-eval">
              <div className="stats-pattern-group-header">
                <span className="stats-pattern-group-label">{evalOpt}</span>
                <span className="stats-pattern-group-count">{items.length}명</span>
              </div>
              <div className="stats-pattern-avatars">
                {items.map(p => (
                  <button key={p.leader.id} className="stats-pattern-avatar-btn"
                    onClick={() => setStatPopup({ leader: p.leader, name: p.name, label: evalOpt })}>
                    <div className="stats-pattern-avatar"><LeaderAvatar leader={p.leader} /></div>
                    <span className="stats-pattern-avatar-name">{p.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 요인별 뷰 */}
      {view === 'factor' && (
        <div className="stats-pattern-groups">
          {sortedFactors.map(([factor, items]) => (
            <div key={factor} className="stats-pattern-group">
              <div className="stats-pattern-group-header">
                <span className="stats-pattern-group-label">{factor}</span>
                <span className="stats-pattern-group-count">{items.length}명</span>
              </div>
              <div className="stats-pattern-avatars">
                {items.map(p => (
                  <button key={p.leader.id} className="stats-pattern-avatar-btn"
                    onClick={() => setStatPopup({ leader: p.leader, name: p.name, label: factor })}>
                    <div className="stats-pattern-avatar"><LeaderAvatar leader={p.leader} /></div>
                    <span className="stats-pattern-avatar-name">{p.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      {commentPopup && (
        <CommentPopup
          leader={commentPopup.leader}
          name={commentPopup.name}
          onClose={() => setCommentPopup(null)}
        />
      )}
      {statPopup && (
        <StatPopup
          leader={statPopup.leader}
          name={statPopup.name}
          label={statPopup.label}
          onClose={() => setStatPopup(null)}
        />
      )}
    </div>
  );
}

export default function StatsPage({ showToast }) {
  const { t, tName, getEval } = useApp();
  const [rankType, setRankType] = useState('peace');
  const [showShare, setShowShare] = useState(false);

  const evaluated = LEADERS
    .map(l => ({ leader: l, ev: getEval(l.id), name: tName(l.id) }))
    .filter(x => !!x.ev);

  const doneCount  = evaluated.length;
  const remaining  = TOTAL - doneCount;
  const avgPeace   = doneCount ? Math.round(evaluated.reduce((s, x) => s + x.ev.peace,   0) / doneCount) : null;
  const avgTension = doneCount ? Math.round(evaluated.reduce((s, x) => s + x.ev.tension, 0) / doneCount) : null;

  const rankedPeace   = [...evaluated].sort((a, b) => b.ev.peace   - a.ev.peace);
  const rankedTension = [...evaluated].sort((a, b) => b.ev.tension - a.ev.tension);
  const currentRanked = rankType === 'peace' ? rankedPeace : rankedTension;
  const rankedForShare = rankedPeace.map(item => ({ name: item.name, peace: item.ev.peace }));

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
          <div className="stats-card-val peace">{avgPeace !== null ? avgPeace : '–'}</div>
          <div className="stats-card-label">평균 평화 온도</div>
        </div>
        <div className="stats-card">
          <div className="stats-card-val tension">{avgTension !== null ? avgTension : '–'}</div>
          <div className="stats-card-label">평균 긴장 온도</div>
        </div>
      </div>

      {evaluated.length === 0 ? (
        <div className="stats-empty">{t('stats_empty')}</div>
      ) : (
        <>
          <div className="stats-rank-tabs">
            <button className={`stats-rank-tab${rankType === 'peace'   ? ' active peace'   : ''}`} onClick={() => setRankType('peace')}>🕊️ 평화 온도 순위</button>
            <button className={`stats-rank-tab${rankType === 'tension' ? ' active tension' : ''}`} onClick={() => setRankType('tension')}>🔥 긴장 온도 순위</button>
          </div>

          <RankTable items={currentRanked} type={rankType} />
        </>
      )}

      <PrescriptionPattern />

      <button className="stats-share-btn" onClick={() => setShowShare(true)}>
        📧 결과를 언론사·기관에 보내기
      </button>

      {showShare && (
        <MediaShareModal ranked={rankedForShare} onClose={() => setShowShare(false)} />
      )}
    </div>
  );
}
