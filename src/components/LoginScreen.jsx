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
      <div className="login-orb">🌏</div>

      <h1 className="login-title grad-text">{t('login_title')}</h1>
      <p className="login-sub">{t('login_sub')}</p>

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
    </div>
  );
}
