import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { TRANSLATIONS } from '../data/translations.js';

const LANGS = Object.keys(TRANSLATIONS);

export default function LanguageSelector() {
  const { lang, setLang, t } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="lang-selector" ref={ref}>
      <button className="lang-btn" onClick={() => setOpen(o => !o)}>
        {TRANSLATIONS[lang]?.label || '🌐'}
        <span style={{ fontSize: '.6rem' }}>▾</span>
      </button>

      {open && (
        <div className="lang-dropdown">
          {LANGS.map(l => (
            <button
              key={l}
              className={`lang-opt${lang === l ? ' active' : ''}`}
              onClick={() => { setLang(l); setOpen(false); }}
            >
              {TRANSLATIONS[l]?.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
