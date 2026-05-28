import { useRef, useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { LEADERS } from '../data/leaders.js';
import LeaderCard from '../components/LeaderCard.jsx';

const TOTAL = LEADERS.length;

export default function HomePage({ showToast }) {
  const { getEval, setActiveSheet } = useApp();
  const [loaderState, setLoaderState] = useState('hidden'); // 'hidden' | 'in' | 'out'
  const sentinelRef = useRef(null);

  const doneCount = LEADERS.filter(l => !!getEval(l.id)).length;
  const pct = Math.round((doneCount / TOTAL) * 100);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    let inTimer, outTimer;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        clearTimeout(outTimer);
        setLoaderState('in');
        // 2초 후 fade-out 시작
        inTimer = setTimeout(() => {
          setLoaderState('out');
          // fade-out 애니메이션 끝나면 hidden
          outTimer = setTimeout(() => setLoaderState('hidden'), 600);
        }, 2000);
      } else {
        clearTimeout(inTimer);
      }
    }, { threshold: 0.1 });

    observer.observe(el);
    return () => { observer.disconnect(); clearTimeout(inTimer); clearTimeout(outTimer); };
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

      <div ref={sentinelRef} className={`home-loader home-loader-${loaderState}`}>
        <div className="home-loader-spinner" />
        <p className="home-loader-text">더 많은 지도자가 추가될 예정입니다</p>
      </div>
    </div>
  );
}
