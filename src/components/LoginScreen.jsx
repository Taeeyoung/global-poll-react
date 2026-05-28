import { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';

export default function LoginScreen() {
  const { t, login } = useApp();
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    login(trimmed);
  };

  return (
    <div className="login-screen">
      <div className="login-orb">🌍</div>

      <h1 className="login-title">오늘의 지도자,<br />당신은 어떻게 진단하나요?</h1>

      <p className="login-body">
        지도자의 말과 행동을 보고<br />
        평화 온도와 긴장 온도를 직접 평가해보세요.<br />
        당신의 선택이 미래를 위한 처방전이 됩니다.
      </p>

      <div className="login-divider" />

      <p className="login-cta">{t('login_sub')}</p>

      <form className="login-form" onSubmit={handleSubmit}>
        <input
          className="login-input"
          type="text"
          placeholder={t('login_placeholder')}
          value={name}
          onChange={e => setName(e.target.value)}
          maxLength={20}
          autoFocus
        />
        <button
          className="login-submit"
          type="submit"
          disabled={!name.trim()}
        >
          {t('login_btn')}
        </button>
      </form>

      <p className="login-privacy">닉네임은 처방전 기록 저장에만 사용되며<br />외부에 공유되지 않습니다.</p>
    </div>
  );
}
