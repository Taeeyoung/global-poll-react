import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { LEADERS } from '../data/leaders.js';
import LeaderCard from '../components/LeaderCard.jsx';
import WorldMapView from '../components/WorldMapView.jsx';

const TOTAL = LEADERS.length;
const TENDENCY_THRESHOLD = 3;
const FEATURED = LEADERS.filter(l => l.featured);

function MissionCard({ doneCount }) {
  const pct = Math.round((doneCount / TOTAL) * 100);

  let message;
  if (doneCount === 0) {
    message = '첫 번째 지도자를 평가해보세요';
  } else if (doneCount < TENDENCY_THRESHOLD) {
    message = `${TENDENCY_THRESHOLD - doneCount}명 더 평가하면 재판관 성향 리포트가 열려요!`;
  } else if (doneCount < TOTAL) {
    message = `성향 리포트 열림 🎉  ·  ${TOTAL - doneCount}명 남았어요`;
  } else {
    message = '🏆 모든 지도자 평가 완료!';
  }

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

function FeaturedCard({ leader, onClick }) {
  const { tName, getEval } = useApp();
  const ev = getEval(leader.id);
  return (
    <button className={`featured-card${ev ? ' done' : ''}`} onClick={onClick}>
      <div className="fc-row">
        <div className="fc-info">
          <span className="fc-name">{tName(leader.id)}</span>
          <span className="fc-country">{leader.country}</span>
        </div>
        <span className={`fc-arrow${ev ? ' done' : ''}`}>{ev ? '✓' : '›'}</span>
      </div>
      {leader.chip && <span className="fc-chip">{leader.chip}</span>}
    </button>
  );
}

function FeaturedSection({ onCardClick }) {
  return (
    <div className="featured-section">
      <div className="featured-header">
        <span className="featured-title">🔥 지금 주목</span>
      </div>
      <div className="featured-list">
        {FEATURED.map(leader => (
          <FeaturedCard
            key={leader.id}
            leader={leader}
            onClick={() => onCardClick(leader)}
          />
        ))}
      </div>
    </div>
  );
}

function CardView({ onCardClick }) {
  const sentinelRef = useRef(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      el.dataset.visible = entry.isIntersecting ? '1' : '0';
    }, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <FeaturedSection onCardClick={onCardClick} />

      <div className="home-section-header">
        <span className="home-section-title">🌍 전체 지도자</span>
        <span className="home-section-count">{LEADERS.filter(() => true).length}명</span>
      </div>

      <div className="leaders-grid">
        {LEADERS.map(leader => (
          <LeaderCard
            key={leader.id}
            leader={leader}
            onClick={() => onCardClick(leader)}
          />
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

  const doneCount = LEADERS.filter(l => !!getEval(l.id)).length;

  return (
    <div className="home-inner">
      <MissionCard doneCount={doneCount} />

      {/* 서브 탭 */}
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

      {homeTab === 'map'  && <WorldMapView onPinClick={setActiveSheet} />}
      {homeTab === 'card' && <CardView onCardClick={setActiveSheet} />}
    </div>
  );
}
