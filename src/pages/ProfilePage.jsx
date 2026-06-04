import { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { LEADERS } from '../data/leaders.js';

function RequestLeaderModal({ onClose, showToast }) {
  const [name, setName] = useState('');

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const saved = JSON.parse(localStorage.getItem('leaderRequests') || '[]');
    localStorage.setItem('leaderRequests', JSON.stringify([...saved, trimmed]));
    showToast('신청해주셔서 감사합니다! 🙏');
    onClose();
  };

  return (
    <div className="req-overlay" onClick={onClose}>
      <div className="req-modal" onClick={e => e.stopPropagation()}>
        <button className="req-close" onClick={onClose}>×</button>
        <div className="req-title">🙋 지도자 신청</div>
        <p className="req-desc">평가하고 싶은 지도자를 적어주세요!</p>
        <input
          className="req-input"
          type="text"
          placeholder="예: 볼로디미르 젤렌스키"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          autoFocus
          maxLength={40}
        />
        <button className="req-submit" onClick={handleSubmit} disabled={!name.trim()}>
          신청하기
        </button>
      </div>
    </div>
  );
}

const TOTAL = LEADERS.length;

export default function ProfilePage({ showToast, setTab, onTendency }) {
  const { t, user, logout, getEval, clearAll } = useApp();
  const [showRequest, setShowRequest] = useState(false);

  const doneCount = LEADERS.filter(l => !!getEval(l.id)).length;
  const canTendency = doneCount >= 3;
  const completionPct = TOTAL > 0 ? Math.round((doneCount / TOTAL) * 100) : 0;

  const handleReset = () => {
    if (window.confirm('모든 처방전과 평가를 초기화할까요?')) {
      clearAll();
      showToast('🗑️ 초기화되었습니다');
    }
  };

  const handleLogout = () => {
    logout();
  };

  const initial = user?.initial || user?.name?.[0] || '?';

  return (
    <div className="profile-page">
      {/* User card */}
      <div className="profile-card">
        <div className="profile-avatar">{initial}</div>
        <div className="profile-info">
          <div className="profile-name">{user?.name}</div>
          <div className="profile-stats-row">
            <div className="profile-stat">
              <span className="profile-stat-val">{doneCount}</span>
              <span className="profile-stat-label">{t('prof_done')}</span>
            </div>
            <div className="profile-stat">
              <span className="profile-stat-val">{completionPct}%</span>
              <span className="profile-stat-label">{t('prof_rate')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 성향 리포트 */}
      <div className="profile-section-title">📋 재판관 성향</div>
      {canTendency ? (
        <button className="profile-tendency-btn" onClick={onTendency}>
          📋 나의 재판관 성향 확인하기
        </button>
      ) : (
        <p className="profile-tendency-hint">
          <b>{3 - doneCount}명</b>을 더 평가하면 재판관 성향 리포트를 볼 수 있어요
        </p>
      )}

      {/* 지도자 신청 */}
      <button className="stats-request-btn" style={{ marginTop: 16, marginBottom: 0 }} onClick={() => setShowRequest(true)}>
        🙋 추가되었으면 하는 지도자 신청
      </button>

      {/* Menu */}
      <div className="profile-menu" style={{ marginTop: 12 }}>
        <button className="profile-menu-item danger" onClick={handleReset}>
          <span className="profile-menu-icon">🗑️</span>
          <div className="profile-menu-text">
            <div className="profile-menu-label">{t('prof_reset')}</div>
            <div className="profile-menu-desc">{t('prof_reset_desc')}</div>
          </div>
          <span className="profile-menu-arrow">›</span>
        </button>

        <button className="profile-menu-item" onClick={handleLogout}>
          <span className="profile-menu-icon">🚪</span>
          <div className="profile-menu-text">
            <div className="profile-menu-label">{t('prof_logout')}</div>
            <div className="profile-menu-desc">{t('prof_logout_desc')}</div>
          </div>
          <span className="profile-menu-arrow">›</span>
        </button>
      </div>

      {showRequest && (
        <RequestLeaderModal onClose={() => setShowRequest(false)} showToast={showToast} />
      )}
    </div>
  );
}
