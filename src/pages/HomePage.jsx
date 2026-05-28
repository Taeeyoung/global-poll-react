import { useApp } from '../context/AppContext.jsx';
import { LEADERS } from '../data/leaders.js';
import LeaderCard from '../components/LeaderCard.jsx';

const TOTAL = LEADERS.length;

export default function HomePage({ showToast }) {
  const { getEval, setActiveSheet } = useApp();

  const doneCount = LEADERS.filter(l => !!getEval(l.id)).length;
  const pct = Math.round((doneCount / TOTAL) * 100);

  return (
    <div className="page-inner">
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
    </div>
  );
}
