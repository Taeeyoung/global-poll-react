import { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import {
  LEADERS, PILLS, PILL_MAP, EVAL_OPTIONS, REASON_OPTIONS, TOP_OPTIONS, LEADER_SUMMARY
} from '../data/leaders.js';

function formatDate(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`;
}

export default function PrescriptionPage({ showToast }) {
  const { t, tName, tTitle, rxLeader, getRx, saveRx, user } = useApp();

  const leader = rxLeader;
  const existingRx = leader ? getRx(leader.id) : null;

  const [step, setStep] = useState(existingRx ? 4 : 1);
  const [evalOpt, setEvalOpt] = useState(existingRx?.evalOpt || '');
  const [reasons, setReasons] = useState(existingRx?.reasons || []);
  const [topFactor, setTopFactor] = useState(existingRx?.topFactor || '');
  const [selectedPills, setSelectedPills] = useState(existingRx?.pills || []);
  const [comment, setComment] = useState(existingRx?.comment || '');
  const [showPaper, setShowPaper] = useState(!!existingRx);

  const recommendedPillIds = evalOpt ? (PILL_MAP[evalOpt] || []) : [];

  const handleReset = () => {
    setStep(1);
    setEvalOpt('');
    setReasons([]);
    setTopFactor('');
    setSelectedPills([]);
    setComment('');
    setShowPaper(false);
  };

  const toggleReason = (r) => {
    setReasons(prev =>
      prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]
    );
  };

  const togglePill = (id) => {
    setSelectedPills(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    if (!leader) return;
    const data = { evalOpt, reasons, topFactor, pills: selectedPills, comment };
    saveRx(leader.id, data);
    setShowPaper(true);
    showToast('📋 처방전이 발행되었습니다!');
  };

  const canSubmit = evalOpt && reasons.length > 0 && topFactor;

  if (!leader) {
    return (
      <div className="page-inner">
        <div className="rx-empty">
          <div className="rx-empty-icon">🌡️</div>
          <div className="rx-empty-title">{t('no_rx_yet')}</div>
          <div className="rx-empty-sub">{t('no_rx_sub')}</div>
        </div>
      </div>
    );
  }

  const summaryText = LEADER_SUMMARY[leader.id] || leader.desc;
  const paperPills = PILLS.filter(p => selectedPills.includes(p.id));

  if (showPaper) {
    return (
      <div className="rx-page">
        <div className="rx-paper">
          <div className="rx-paper-header">
            <div className="rx-paper-header-icon">📋</div>
            <div className="rx-paper-header-text">
              <div className="rx-paper-header-title">{t('rx_title')}</div>
              <div className="rx-paper-header-sub">World Peace Prescription</div>
            </div>
            <div className="rx-paper-stamp">🌏</div>
          </div>

          <div className="rx-paper-body">
            <div className="rx-paper-meta">
              <div className="rx-paper-meta-row">
                <span className="rx-paper-meta-label">환자 (지도자)</span>
                <span className="rx-paper-meta-val">{leader.emoji} {tName(leader.id)}</span>
              </div>
              <div className="rx-paper-meta-row">
                <span className="rx-paper-meta-label">직책</span>
                <span className="rx-paper-meta-val">{tTitle(leader.id)}</span>
              </div>
              <div className="rx-paper-meta-row">
                <span className="rx-paper-meta-label">처방의</span>
                <span className="rx-paper-meta-val">{user?.name}</span>
              </div>
              <div className="rx-paper-meta-row">
                <span className="rx-paper-meta-label">발행일</span>
                <span className="rx-paper-meta-val">{formatDate(Date.now())}</span>
              </div>
              <div className="rx-paper-meta-row">
                <span className="rx-paper-meta-label">평가</span>
                <span className="rx-paper-meta-val">{evalOpt}</span>
              </div>
              {topFactor && (
                <div className="rx-paper-meta-row">
                  <span className="rx-paper-meta-label">핵심 요인</span>
                  <span className="rx-paper-meta-val">{topFactor}</span>
                </div>
              )}
            </div>

            {paperPills.length > 0 && (
              <div>
                <div className="rx-paper-pills-title">💊 처방 약물</div>
                <div className="rx-paper-pills">
                  {paperPills.map(p => (
                    <div key={p.id} className="rx-paper-pill">
                      <div className="rx-paper-pill-icon">{p.icon}</div>
                      <div className="rx-paper-pill-body">
                        <div className="rx-paper-pill-name">{p.name}</div>
                        <div className="rx-paper-pill-dose">{p.dose}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {comment && (
              <div className="rx-paper-comment">"{comment}"</div>
            )}

            <div className="rx-paper-warning">
              <span className="rx-paper-warning-icon">⚠️</span>
              <span>본 처방전은 시민 의견으로 작성된 것으로, 실제 정책 효력이 없습니다. 평화를 위한 염원을 담은 상징적 문서입니다.</span>
            </div>
          </div>

          <div className="rx-paper-footer">
            <span className="rx-paper-footer-brand">🌏 Global Poll</span>
            <span>{formatDate(Date.now())}</span>
            <div className="rx-paper-footer-stamp">🕊️</div>
          </div>
        </div>

        <div style={{ marginTop: 14 }}>
          <button className="rx-rewrite-btn" onClick={handleReset}>
            {t('rewrite_rx')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rx-page">
      <div className="rx-form">
        {/* Leader header */}
        <div className="rx-leader-header">
          <div className="rx-leader-emoji">{leader.emoji}</div>
          <div className="rx-leader-info">
            <div className="rx-leader-name">{tName(leader.id)}</div>
            <div className="rx-leader-title">{tTitle(leader.id)}</div>
          </div>
        </div>

        {/* Step 1: eval option */}
        <div className="rx-step">
          <div className="rx-step-title">
            Step 1 · {tName(leader.id)}{t('step1_title')}
          </div>
          <div className="rx-chips">
            {EVAL_OPTIONS.map(opt => (
              <button
                key={opt.val}
                className={`rx-chip${evalOpt === opt.val ? ' selected' : ''}${
                  opt.val === '평화' ? ' peace-chip' :
                  opt.val === '긴장' ? ' tension-chip' : ''
                }`}
                onClick={() => {
                  setEvalOpt(opt.val);
                  if (step < 2) setStep(2);
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: reasons */}
        {step >= 2 && (
          <div className="rx-step">
            <div className="rx-step-title">Step 2 · {t('step2_title')}</div>
            <div className="rx-chips">
              {REASON_OPTIONS.map(r => (
                <button
                  key={r}
                  className={`rx-chip${reasons.includes(r) ? ' selected' : ''}`}
                  onClick={() => {
                    toggleReason(r);
                    if (step < 3 && !reasons.includes(r)) setStep(3);
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: top factor */}
        {step >= 3 && (
          <div className="rx-step">
            <div className="rx-step-title">Step 3 · {t('step3_title')}</div>
            <div className="rx-chips">
              {TOP_OPTIONS.map(opt => (
                <button
                  key={opt}
                  className={`rx-chip${topFactor === opt ? ' selected' : ''}`}
                  onClick={() => {
                    setTopFactor(opt);
                    if (step < 4) setStep(4);
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4+: diagnosis + pills + comment */}
        {step >= 4 && (
          <>
            {/* Diagnosis summary */}
            <div className="rx-summary">
              <div className="rx-summary-title">{t('summary_lbl')}</div>
              <p className="rx-summary-text">
                {summaryText}
              </p>
              {topFactor && (
                <div style={{ marginTop: 8 }}>
                  <span className="rx-summary-highlight">핵심: {topFactor}</span>
                  {reasons.slice(0, 3).map(r => (
                    <span key={r} className="rx-summary-highlight">{r}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Pill selection */}
            <div className="rx-step">
              <div className="rx-step-title">💊 {t('pills_lbl')}</div>
              <div className="rx-pills-grid">
                {PILLS.map(p => {
                  const isRec = recommendedPillIds.includes(p.id);
                  const isSel = selectedPills.includes(p.id);
                  return (
                    <div
                      key={p.id}
                      className={`rx-pill${isSel ? ' selected' : ''}${isRec ? ' recommended' : ''}`}
                      onClick={() => togglePill(p.id)}
                    >
                      {isRec && <span className="rx-pill-star">★ 추천</span>}
                      <div className="rx-pill-icon">{p.icon}</div>
                      <div className="rx-pill-body">
                        <div className="rx-pill-name">{p.name}</div>
                        <div className="rx-pill-dose">{p.dose}</div>
                        <div className="rx-pill-tag">{p.tag}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Comment */}
            <div className="rx-comment">
              <div className="rx-comment-label">{t('comment_lbl')}</div>
              <textarea
                className="rx-comment-input"
                placeholder="한마디 코멘트를 남겨보세요..."
                value={comment}
                onChange={e => setComment(e.target.value)}
                maxLength={200}
              />
            </div>

            {/* Submit */}
            <button
              className="rx-submit-btn"
              onClick={handleSubmit}
              disabled={!canSubmit}
            >
              {t('submit_rx')}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
