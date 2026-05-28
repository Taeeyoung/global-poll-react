import { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';

export default function LoginScreen() {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) { setError('이메일을 입력해주세요.'); return; }
    if (!trimmed.includes('@')) { setError('올바른 이메일 형식을 입력해주세요.'); return; }
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

      <form className="login-form" onSubmit={handleSubmit}>
        <div className="login-google-field">
          <div className="login-google-icon">
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
          </div>
          <input
            className="login-input"
            type="email"
            placeholder="Google 이메일 주소 입력"
            value={email}
            onChange={e => { setEmail(e.target.value); setError(''); }}
            autoComplete="email"
            autoFocus
          />
        </div>

        {error && <p className="login-error">{error}</p>}

        <button className="login-submit" type="submit" disabled={!email.trim()}>
          Google로 계속하기
        </button>
      </form>

      <p className="login-privacy">로그인 정보는 평가 기록 저장에만 사용되며<br />외부에 공유되지 않습니다.</p>
    </div>
  );
}
