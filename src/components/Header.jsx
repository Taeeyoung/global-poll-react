import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { TRANSLATIONS } from '../data/translations.js';

const LANGS = Object.keys(TRANSLATIONS);

export default function Header() {
  const { lang, setLang, logout, t, user } = useApp();
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="hdr">
      <div className="hdr-logo">
        <span className="hdr-logo-emoji">🌏</span>
        <span className="hdr-logo-text">Global Poll</span>
      </div>

      <div className="hdr-actions">
        {/* 언어 선택 */}
        <div className="hdr-lang" ref={langRef}>
          <button className="hdr-lang-btn" onClick={() => setLangOpen(o => !o)}>
            {TRANSLATIONS[lang]?.label || '🌐'}
            <span className="hdr-lang-arrow">▾</span>
          </button>
          {langOpen && (
            <div className="hdr-lang-dropdown">
              {LANGS.map(l => (
                <button
                  key={l}
                  className={`hdr-lang-opt${lang === l ? ' active' : ''}`}
                  onClick={() => { setLang(l); setLangOpen(false); }}
                >
                  {TRANSLATIONS[l]?.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 로그아웃 */}
        {user && (
          <button className="hdr-logout-btn" onClick={logout}>
            {t('logout_btn')}
          </button>
        )}
      </div>
    </header>
  );
}
