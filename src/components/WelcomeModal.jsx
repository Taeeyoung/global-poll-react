import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.jsx';

export default function WelcomeModal({ onClose }) {
  const { user } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsOpen(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(onClose, 320);
  };

  const name = user?.name?.split('@')[0] || '재판관';

  return (
    <div className={`welcome-overlay${isOpen ? ' on' : ''}`}>
      <div className="welcome-modal">

        <div className="welcome-orb">⚖️</div>

        <h2 className="welcome-title">
          {name}님,<br />평화 재판관으로 위촉합니다
        </h2>

        <div className="welcome-steps">
          <div className="welcome-step">
            <div className="welcome-step-num">1</div>
            <div className="welcome-step-text">
              <strong>15명의 세계 지도자</strong>를 평화 온도·긴장 온도로 평가하세요
            </div>
          </div>
          <div className="welcome-step">
            <div className="welcome-step-num">2</div>
            <div className="welcome-step-text">
              각 지도자에게 <strong>평화 처방전</strong>을 발행해 목소리를 전달하세요
            </div>
          </div>
          <div className="welcome-step">
            <div className="welcome-step-num">3</div>
            <div className="welcome-step-text">
              <strong>5명 이상</strong> 평가하면 나만의 <strong>재판관 성향 리포트</strong>가 완성됩니다
            </div>
          </div>
        </div>

        <button className="welcome-btn" onClick={handleClose}>
          평가 시작하기 →
        </button>
      </div>
    </div>
  );
}
