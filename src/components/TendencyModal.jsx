import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { LEADERS } from '../data/leaders.js';

export default function TendencyModal({ onClose }) {
  const { getTendencyProfile, getTendencyType, evals, proposalLog } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsOpen(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(onClose, 340);
  };

  const profile = getTendencyProfile();
  const type = getTendencyType();
  const evalCount = LEADERS.filter(l => !!evals[l.id]).length;

  const handleCopy = () => {
    const text = `🌍 글로벌 폴 — 나의 재판관 성향 리포트\n${profile.emoji} ${profile.name}\n\n${profile.desc}\n\n#글로벌폴 #평화재판관 #${profile.name}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(() => setCopied(false));
  };

  const typeColors = {
    rationalist:    '#0ea5e9',
    humanitarian:   '#22c55e',
    multilateralist:'#a78bfa',
    accountability: '#f97316',
  };
  const color = typeColors[type] || '#38bdf8';

  return (
    <div className={`tend-overlay${isOpen ? ' on' : ''}`} onClick={handleClose}>
      <div className="tend-modal" onClick={e => e.stopPropagation()}>
        <div className="tend-handle" />
        <p className="tend-headline">나의 재판관 성향 리포트</p>

        <div className="tend-card" style={{ background: profile.bg }}>
          <div className="tend-card-bg-emoji">{profile.emoji}</div>
          <span className="tend-card-emoji">{profile.emoji}</span>
          <div className="tend-card-label">{profile.label}</div>
          <div className="tend-card-name">{profile.name}</div>
          <div className="tend-card-desc">{profile.desc}</div>
          <div className="tend-chips">
            <div className="tend-chip">평가 지도자 {evalCount}명</div>
            {proposalLog.length > 0 && (
              <div className="tend-chip">제안 {proposalLog.length}회</div>
            )}
          </div>
        </div>

        <div className="tend-sns-row">
          <button className="tend-sns-btn kakao">
            <span className="tend-sns-icon">💬</span>
            <span className="tend-sns-label">카카오톡</span>
          </button>
          <button className="tend-sns-btn x">
            <span className="tend-sns-icon">𝕏</span>
            <span className="tend-sns-label">X</span>
          </button>
          <button className="tend-sns-btn insta">
            <span className="tend-sns-icon">📷</span>
            <span className="tend-sns-label">인스타</span>
          </button>
          <button className="tend-sns-btn link">
            <span className="tend-sns-icon">🔗</span>
            <span className="tend-sns-label">링크 복사</span>
          </button>
        </div>

        <button className="tend-share-btn" onClick={handleCopy}>
          {copied ? '✓ 클립보드에 복사되었습니다' : '📋 결과 클립보드 복사'}
        </button>
        <button className="tend-close-btn" onClick={handleClose}>닫기</button>
      </div>
    </div>
  );
}
