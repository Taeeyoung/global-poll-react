import { useApp } from '../context/AppContext.jsx';
import { LEADERS } from '../data/leaders.js';

const TOTAL = LEADERS.length;

export default function ProfilePage({ showToast, setTab, onTendency }) {
  const { t, tName, tTitle, user, logout, getEval, getRx, clearAll, evals } = useApp();

  const doneCount = LEADERS.filter(l => !!getEval(l.id)).length;
  const canTendency = doneCount >= 3;
  const completionPct = TOTAL > 0 ? Math.round((doneCount / TOTAL) * 100) : 0;

  const history = LEADERS
    .filter(l => !!getRx(l.id))
    .map(l => ({ leader: l, rx: getRx(l.id), ev: getEval(l.id) }));

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

      {/* Prescription history */}
      <div className="profile-section-title">{t('prof_hist')}</div>
      <div className="profile-hist">
        {history.length === 0 ? (
          <div className="profile-empty">{t('prof_empty')}</div>
        ) : (
          history.map(item => (
            <div key={item.leader.id} className="profile-hist-item">
              <span className="profile-hist-emoji">{item.leader.emoji}</span>
              <div className="profile-hist-info">
                <div className="profile-hist-name">{tName(item.leader.id)}</div>
                <div className="profile-hist-eval">
                  {tTitle(item.leader.id)}
                  {item.rx?.evalOpt && ` · ${item.rx.evalOpt}`}
                </div>
              </div>
              <span className="profile-hist-badge">{t('rx_done')}</span>
            </div>
          ))
        )}
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

      {/* Menu */}
      <div className="profile-menu" style={{ marginTop: 16 }}>
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
    </div>
  );
}
