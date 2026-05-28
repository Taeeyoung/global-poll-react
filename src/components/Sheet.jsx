import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { FLAG_BG } from '../data/leaders.js';
import { PORTRAITS } from '../data/portraits.js';
import { BRIEFS } from '../data/briefs.js';
import { LEADER_SUMMARY } from '../data/leaders.js';
import { SOURCES } from '../data/sources.js';

function BriefSection({ leaderId }) {
  const b = BRIEFS[leaderId];
  if (!b) return null;
  return (
    <div className="brief-section">
      <div className="brief-row"><span>🕊️</span><span>{b.peace}</span></div>
      <div className="brief-row"><span>🔥</span><span>{b.tension}</span></div>
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
      <div className="sheet-section eval">
        <div className="sheet-section-title">🌡️ {t('eval_title')}</div>
        <div style={{ marginBottom: 10 }}>
          <TempRow label={t('peace_lbl')} val={ev?.peace ?? 0} type="peace" />
          <TempRow label={t('tension_lbl')} val={ev?.tension ?? 0} type="tension" />
        </div>
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
    <div className="sheet-section eval">
      <div className="sheet-section-title">🌡️ {t('eval_title')}</div>
      <div className="eval-range-group">
        <div>
          <div className="eval-range-label">
            <span>{t('peace_lbl')}</span>
            <span className="eval-range-val peace">{peace}</span>
          </div>
          <input type="range" className="eval-range peace-range"
            style={{ '--val': `${peace}%` }} min={0} max={100} value={peace}
            onChange={e => setPeace(Number(e.target.value))} />
        </div>
        <div>
          <div className="eval-range-label">
            <span>{t('tension_lbl')}</span>
            <span className="eval-range-val tension">{tension}</span>
          </div>
          <input type="range" className="eval-range tension-range"
            style={{ '--val': `${tension}%` }} min={0} max={100} value={tension}
            onChange={e => setTension(Number(e.target.value))} />
        </div>
      </div>
      <button className="eval-submit" onClick={handleSubmit}>{t('btn_submit')}</button>
    </div>
  );
}

function RxCTA({ leader, onGoToRx }) {
  const { t, getRx } = useApp();
  const done = !!getRx(leader.id);
  return (
    <div className="sheet-section rx">
      <div className="sheet-section-title">{t('rx_title')}</div>
      <div className="rx-cta">
        <div className="rx-cta-header">
          <span className={`rx-cta-badge ${done ? 'done' : 'pending'}`}>
            {done ? t('rx_done') : t('rx_pending')}
          </span>
        </div>
        <p className="rx-cta-hint">{done ? t('rx_hint_done') : t('rx_hint')}</p>
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

  const handleGoToRxAnimated = (l) => {
    setIsOpen(false);
    setTimeout(() => onGoToRx(l), 320);
  };

  const bg = FLAG_BG[leader.id] || '#e2e8f0';
  const bgStyle = bg.startsWith('linear') || bg.startsWith('radial')
    ? { background: bg } : { backgroundColor: bg };

  const portrait = PORTRAITS[leader.id];

  return (
    <div className="sheet-overlay" onClick={handleClose}>
      <div className={`sheet${isOpen ? ' open' : ''}`} onClick={e => e.stopPropagation()}>
        <div className="sheet-handle" />

        {/* 헤더: 초상화 + 이름 */}
        <div className="sheet-header">
          <div className="sheet-flag-bg" style={bgStyle} />
          <div className="sheet-header-content">
            {portrait && (
              <div
                className="sheet-portrait"
                dangerouslySetInnerHTML={{ __html: portrait }}
              />
            )}
            <div className="sheet-leader-info">
              <div className="sheet-flag-name">{tName(leader.id)}</div>
              <div className="sheet-flag-title">{tTitle(leader.id)}</div>
            </div>
          </div>
        </div>

        <div className="sheet-body">
          {/* 1. 평가 (제일 위) */}
          <EvalSection leader={leader} showToast={showToast} />

          {/* 2. Brief: 평화/긴장 요인 */}
          <BriefSection leaderId={leader.id} />

          {/* 3. 정치 프로필 + 출처 */}
          {LEADER_SUMMARY[leader.id] && (
            <div className="sheet-section">
              <div className="sheet-section-title">📋 정치 프로필</div>
              <p className="sheet-desc">{LEADER_SUMMARY[leader.id]}</p>
              {SOURCES[leader.id] && (
                <div className="src-wrap">
                  <span className="src-label">참고 기사</span>
                  <div className="src-list">
                    {SOURCES[leader.id].map((s, i) => (
                      <a key={i} className="src-tag" href={s.url} target="_blank" rel="noopener noreferrer">
                        <span className="src-outlet">{s.outlet}</span>
                        {s.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 4. 처방전 */}
          <RxCTA leader={leader} onGoToRx={handleGoToRxAnimated} />
        </div>
      </div>
    </div>
  );
}
