import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { FLAG_BG } from '../data/leaders.js';

function EvalSection({ leader, showToast }) {
  const { t, getEval, saveEval } = useApp();
  const ev = getEval(leader.id);
  const [open, setOpen] = useState(false);
  const [peace, setPeace] = useState(ev?.peace ?? 50);
  const [tension, setTension] = useState(ev?.tension ?? 50);

  useEffect(() => {
    if (ev) { setPeace(ev.peace); setTension(ev.tension); }
  }, [ev]);

  const handleSubmit = () => {
    saveEval(leader.id, peace, tension);
    setOpen(false);
    showToast('✅ ' + t('btn_evaled'));
  };

  if (!open) {
    return (
      <div className="sheet-section">
        <div className="sheet-section-title">🌡️ {t('eval_title')}</div>
        {ev && (
          <div style={{ marginBottom: 10 }}>
            <TempRow label={t('peace_lbl')} val={ev.peace} type="peace" />
            <TempRow label={t('tension_lbl')} val={ev.tension} type="tension" />
          </div>
        )}
        <button
          className={`eval-btn${ev ? ' secondary' : ''}`}
          onClick={() => setOpen(true)}
        >
          {ev ? t('btn_evaled') + ' · ' + t('btn_eval') : t('btn_eval')}
        </button>
      </div>
    );
  }

  return (
    <div className="sheet-section">
      <div className="sheet-section-title">🌡️ {t('eval_title')}</div>

      <div className="eval-range-group">
        <div>
          <div className="eval-range-label">
            <span>{t('peace_lbl')}</span>
            <span className="eval-range-val peace">{peace}</span>
          </div>
          <input
            type="range"
            className="eval-range peace-range"
            style={{ '--val': `${peace}%` }}
            min={0} max={100}
            value={peace}
            onChange={e => setPeace(Number(e.target.value))}
          />
        </div>
        <div>
          <div className="eval-range-label">
            <span>{t('tension_lbl')}</span>
            <span className="eval-range-val tension">{tension}</span>
          </div>
          <input
            type="range"
            className="eval-range tension-range"
            style={{ '--val': `${tension}%` }}
            min={0} max={100}
            value={tension}
            onChange={e => setTension(Number(e.target.value))}
          />
        </div>
      </div>

      <button className="eval-submit" onClick={handleSubmit}>
        {t('btn_submit')}
      </button>
    </div>
  );
}

function TempRow({ label, val, type }) {
  return (
    <div className="temp-row">
      <div className="temp-label-row">
        <span className="temp-label">{label}</span>
        <span className={`temp-val ${type}`}>{val}</span>
      </div>
      <div className="temp-bar">
        <div className={`temp-fill ${type}`} style={{ width: `${val}%` }} />
      </div>
    </div>
  );
}

function RxCTA({ leader, onGoToRx }) {
  const { t, getRx } = useApp();
  const rx = getRx(leader.id);
  const done = !!rx;

  return (
    <div className="sheet-section">
      <div className="sheet-section-title">{t('rx_title')}</div>
      <div className="rx-cta">
        <div className="rx-cta-header">
          <span className="sheet-desc" style={{ fontWeight: 700 }}>{t('rx_title')}</span>
          <span className={`rx-cta-badge ${done ? 'done' : 'pending'}`}>
            {done ? t('rx_done') : t('rx_pending')}
          </span>
        </div>
        <p className="rx-cta-hint">
          {done ? t('rx_hint_done') : t('rx_hint')}
        </p>
        <button className="rx-cta-btn" onClick={() => onGoToRx(leader)}>
          {done ? t('btn_prescribe_edit') : t('btn_prescribe')}
        </button>
      </div>
    </div>
  );
}

export default function Sheet({ leader, onClose, onGoToRx, showToast }) {
  const { t, tName, tTitle } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsOpen(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(onClose, 380);
  };

  const bg = FLAG_BG[leader.id] || '#162236';
  const bgStyle = bg.startsWith('linear') || bg.startsWith('radial')
    ? { background: bg }
    : { backgroundColor: bg };

  return (
    <div className="sheet-overlay" onClick={handleClose}>
      <div
        className={`sheet${isOpen ? ' open' : ''}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="sheet-handle" />

        <div className="sheet-flag-strip">
          <div className="sheet-flag-bg" style={bgStyle} />
          <div className="sheet-flag-overlay">
            <span className="sheet-flag-emoji">{leader.emoji}</span>
            <div className="sheet-flag-text">
              <span className="sheet-flag-name">{tName(leader.id)}</span>
              <span className="sheet-flag-title">{tTitle(leader.id)}</span>
              <span className="sheet-flag-country">{leader.country}</span>
            </div>
          </div>
        </div>

        <div className="sheet-body">
          <div className="sheet-section">
            <div className="sheet-section-title">📰 현황 요약</div>
            <p className="sheet-desc">{leader.desc}</p>
          </div>

          <EvalSection leader={leader} showToast={showToast} />

          <RxCTA leader={leader} onGoToRx={onGoToRx} />
        </div>
      </div>
    </div>
  );
}
