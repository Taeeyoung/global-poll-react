import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { TRANSLATIONS } from '../data/translations.js';

const LANGS = Object.keys(TRANSLATIONS);

const TABS = [
  { id: 'home',    labelKey: 'tab_home' },
  { id: 'rx',      labelKey: 'tab_rx' },
  { id: 'stats',   labelKey: 'tab_stats' },
  { id: 'profile', labelKey: 'tab_profile' },
];

export default function Header({ tab, setTab }) {
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
      {/* 1행: 로고 + 우측 액션 */}
      <div className="hdr-top">
        <div className="hdr-logo">
          <span className="hdr-logo-emoji">🌏</span>
          <span className="hdr-logo-text">Global Poll</span>
        </div>

        <div className="hdr-actions">
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

          {user && (
            <button className="hdr-logout-btn" onClick={logout}>
              {t('logout_btn')}
            </button>
          )}
        </div>
      </div>

      {/* 2행: 탭 네비 — 데스크탑 전용 */}
      {tab !== undefined && setTab && (
        <nav className="hdr-nav">
          {TABS.map(item => (
            <button
              key={item.id}
              className={`hdr-nav-item${tab === item.id ? ' active' : ''}`}
              onClick={() => setTab(item.id)}
            >
              {t(item.labelKey)}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}
