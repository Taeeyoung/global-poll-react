import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { LEADERS } from '../data/leaders.js';
import { CONFLICTS } from '../data/conflicts.js';
import LeaderCard from '../components/LeaderCard.jsx';
import LeaderAvatar from '../components/LeaderAvatar.jsx';
import WorldMapView from '../components/WorldMapView.jsx';

const TOTAL = LEADERS.length;
const TENDENCY_THRESHOLD = 3;

function MissionCard({ doneCount }) {
  const pct = Math.round((doneCount / TOTAL) * 100);
  let message;
  if (doneCount === 0)                    message = '첫 번째 지도자를 평가해보세요';
  else if (doneCount < TENDENCY_THRESHOLD) message = `${TENDENCY_THRESHOLD - doneCount}명 더 평가하면 재판관 성향 리포트가 열려요!`;
  else if (doneCount < TOTAL)             message = `성향 리포트 열림 🎉  ·  ${TOTAL - doneCount}명 남았어요`;
  else                                    message = '🏆 모든 지도자 평가 완료!';

  return (
    <div className="mission-card">
      <div className="mission-card-top">
        <div className="mission-card-left">
          <span className="mission-card-label">⚖️ 평가 현황</span>
          <span className="mission-card-msg">{message}</span>
        </div>
        <span className="mission-card-count">
          {doneCount}<span className="mission-card-total">/{TOTAL}</span>
        </span>
      </div>
      <div className="mission-card-track">
        <div className="mission-card-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/* ── 분쟁 이슈 모달 ── */
function ConflictLeadersModal({ conflict, onLeaderClick, onClose }) {
  const { tName } = useApp();
  const leaders = conflict.leaders
    .map(id => LEADERS.find(l => l.id === id))
    .filter(Boolean);

  return (
    <div className="ci-modal-overlay" onClick={onClose}>
      <div className="ci-modal" onClick={e => e.stopPropagation()}>
        <button className="ci-modal-close" onClick={onClose}>×</button>
        <div className="ci-modal-title">⚔️ {conflict.name}</div>
        <div className="ci-modal-chip">{conflict.chip}</div>
        {conflict.desc && <p className="ci-modal-desc">{conflict.desc}</p>}
        <div className="ci-modal-leaders">
          {leaders.map(leader => (
            <button
              key={leader.id}
              className="ci-modal-leader"
              onClick={() => { onLeaderClick(leader); onClose(); }}
            >
              <div className="ci-modal-avatar"><LeaderAvatar leader={leader} /></div>
              <span className="ci-modal-name">{tName(leader.id)}</span>
              <span className="ci-modal-role">{leader.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── 지금 주목 이슈 섹션 ── */
function ConflictIssueSection({ onConflictClick }) {
  const featured = CONFLICTS.filter(c => c.featured);
  return (
    <div className="ci-section">
      <div className="ci-section-header">
        <span className="ci-section-title">🌐 지금 주목 이슈</span>
      </div>
      <div className="ci-chips">
        {featured.map(c => (
          <button key={c.id} className="ci-chip" onClick={() => onConflictClick(c)}>
            <span className="ci-chip-icon">⚔️</span>
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
}

const FILTER_OPTIONS = [
  { value: 'all',         label: '전체' },
  { value: 'featured',    label: '🔥 주목' },
  { value: 'unevaluated', label: '미평가' },
  { value: 'evaluated',   label: '✓ 완료' },
];
const SORT_OPTIONS = [
  { value: 'default',     label: '기본순' },
  { value: 'name',        label: '이름순' },
  { value: 'avg_high',    label: '평점 높은순' },
  { value: 'avg_low',     label: '평점 낮은순' },
  { value: 'unevaluated', label: '미평가 먼저' },
];

function CardView({ onCardClick }) {
  const { getEval, tName } = useApp();
  const sentinelRef = useRef(null);
  const [filter, setFilter] = useState('all');
  const [sort, setSort]     = useState('default');

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    let timer = null;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.className = 'home-loader home-loader-in';
        timer = setTimeout(() => { el.className = 'home-loader home-loader-out'; }, 1800);
      }
    }, { threshold: 0.1 });
    observer.observe(el);
    return () => { observer.disconnect(); clearTimeout(timer); };
  }, []);

  const displayed = LEADERS
    .filter(l => {
      if (filter === 'featured')    return l.featured;
      if (filter === 'unevaluated') return !getEval(l.id);
      if (filter === 'evaluated')   return !!getEval(l.id);
      return true;
    })
    .sort((a, b) => {
      if (sort === 'name')        return tName(a.id).localeCompare(tName(b.id), 'ko');
      if (sort === 'avg_high')    return (b.avg ?? 0) - (a.avg ?? 0);
      if (sort === 'avg_low')     return (a.avg ?? 0) - (b.avg ?? 0);
      if (sort === 'unevaluated') {
        const aEv = !!getEval(a.id), bEv = !!getEval(b.id);
        return aEv === bEv ? 0 : aEv ? 1 : -1;
      }
      return 0;
    });

  return (
    <>
      <div className="cv-filterbar">
        <div className="cv-chips">
          {FILTER_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              className={`cv-chip${filter === value ? ' active' : ''}`}
              onClick={() => setFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>
        <select className="cv-sort" value={sort} onChange={e => setSort(e.target.value)}>
          {SORT_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      <div className="cv-count">지도자 <strong>{displayed.length}</strong>명</div>

      <div className="leaders-grid">
        {displayed.map(leader => (
          <LeaderCard key={leader.id} leader={leader} onClick={() => onCardClick(leader)} />
        ))}
      </div>

      <div ref={sentinelRef} className="home-loader home-loader-hidden">
        <div className="home-loader-spinner" />
        <p className="home-loader-text">더 많은 지도자가 추가될 예정입니다</p>
      </div>
    </>
  );
}

export default function HomePage({ showToast }) {
  const { getEval, setActiveSheet } = useApp();
  const [homeTab, setHomeTab] = useState('card');
  const [activeConflict, setActiveConflict] = useState(null);
  const doneCount = LEADERS.filter(l => !!getEval(l.id)).length;

  return (
    <div className="home-inner">
      <MissionCard doneCount={doneCount} />

      <div className="home-sub-tabs">
        <button
          className={`home-sub-tab${homeTab === 'map' ? ' active' : ''}`}
          onClick={() => setHomeTab('map')}
        >
          🗺️ 지도뷰
        </button>
        <button
          className={`home-sub-tab${homeTab === 'card' ? ' active' : ''}`}
          onClick={() => setHomeTab('card')}
        >
          📋 카드뷰
        </button>
      </div>

      {homeTab === 'map' && (
        <>
          <ConflictIssueSection onConflictClick={setActiveConflict} />
          <WorldMapView onPinClick={setActiveSheet} />
        </>
      )}
      {homeTab === 'card' && <CardView onCardClick={setActiveSheet} />}

      {activeConflict && (
        <ConflictLeadersModal
          conflict={activeConflict}
          onLeaderClick={setActiveSheet}
          onClose={() => setActiveConflict(null)}
        />
      )}
    </div>
  );
}
