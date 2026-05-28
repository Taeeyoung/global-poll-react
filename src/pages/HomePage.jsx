import { useRef, useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { LEADERS } from '../data/leaders.js';
import LeaderCard from '../components/LeaderCard.jsx';

const TOTAL = LEADERS.length;

export default function HomePage({ showToast }) {
  const { getEval, setActiveSheet } = useApp();
  const [showLoader, setShowLoader] = useState(false);
  const sentinelRef = useRef(null);

  const doneCount = LEADERS.filter(l => !!getEval(l.id)).length;
  const pct = Math.round((doneCount / TOTAL) * 100);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    let timer;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShowLoader(true);
        timer = setTimeout(() => setShowLoader(false), 1500);
      }
    }, { threshold: 0.1 });
    observer.observe(el);
    return () => { observer.disconnect(); clearTimeout(timer); };
  }, []);

  return (
    <div className="home-inner">
      <div className="home-progress">
        <div className="home-progress-header">
          <span className="home-progress-title">🌏 평가 진행도</span>
          <span className="home-progress-count">{doneCount} / {TOTAL}</span>
        </div>
        <div className="home-progress-track">
          <div className="home-progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="leaders-grid">
        {LEADERS.map(leader => (
          <LeaderCard
            key={leader.id}
            leader={leader}
            onClick={() => setActiveSheet(leader)}
          />
        ))}
      </div>

      {/* 스크롤 감지 센티널 */}
      <div ref={sentinelRef} className="home-loader">
        {showLoader && (
          <>
            <div className="home-loader-spinner" />
            <p className="home-loader-text">더 많은 지도자가 추가될 예정입니다</p>
          </>
        )}
      </div>
    </div>
  );
}

