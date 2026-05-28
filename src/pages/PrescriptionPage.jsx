import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { LEADERS, PILLS, PILL_MAP, EVAL_OPTIONS, REASON_OPTIONS, LEADER_SUMMARY } from '../data/leaders.js';
import { PORTRAITS } from '../data/portraits.js';
import { FLAG_BG } from '../data/leaders.js';

function formatDate(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`;
}

function ProgressBar({ step1, step2, step3 }) {
  const done = [step1, step2, step3].filter(Boolean).length;
  return (
    <div className="rx-prog-bar">
      <div className="rx-pb-track">
        <div className={`rx-pb-dot${step1 ? ' done' : ''}`}>1</div>
        <div className={`rx-pb-line${step1 && step2 ? ' done' : ''}`} />
        <div className={`rx-pb-dot${step2 ? ' done' : ''}`}>2</div>
        <div className={`rx-pb-line${step2 && step3 ? ' done' : ''}`} />
        <div className={`rx-pb-dot${step3 ? ' done' : ''}`}>3</div>
      </div>
      <span className={`rx-prog-count${done === 3 ? ' all' : ''}`}>{done}/3 완료</span>
    </div>
  );
}

function ChoiceGrid({ options, selected, multi, onSelect, className }) {
  return (
    <div className={`rx-choice-grid ${className || ''}`}>
      {options.map((opt, i) => (
        <button
          key={opt}
          className={`rx-choice-btn${(multi ? selected.includes(opt) : selected === opt) ? ' active' : ''}`}
          style={{ animationDelay: `${i * 45}ms` }}
          onClick={() => onSelect(opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function RxPaper({ leader, evalOpt, reasons, topFactor, pills, comment, onRewrite }) {
  const { tName, tTitle, user } = useApp();
  const portrait = PORTRAITS[leader.id];
  const selectedPills = PILLS.filter(p => pills.includes(p.id));

  return (
    <div className="rx-paper">
      <div className="rx-paper-header">
        {portrait && <div className="rx-paper-portrait" dangerouslySetInnerHTML={{ __html: portrait }} />}
        <div className="rx-paper-header-text">
          <div className="rx-paper-header-title">🌡️ 평화온도 처방전</div>
          <div className="rx-paper-header-sub">Global Poll · {formatDate(Date.now())}</div>
        </div>
        <div className="rx-paper-stamp">📋</div>
      </div>
      <div className="rx-paper-body">
        <div className="rx-paper-meta">
          <div className="rx-paper-meta-row"><span className="rx-paper-meta-label">대상</span><span className="rx-paper-meta-val">{tName(leader.id)} · {tTitle(leader.id)}</span></div>
          <div className="rx-paper-meta-row"><span className="rx-paper-meta-label">평가</span><span className="rx-paper-meta-val">{evalOpt}</span></div>
          <div className="rx-paper-meta-row"><span className="rx-paper-meta-label">핵심 요인</span><span className="rx-paper-meta-val">{topFactor}</span></div>
          {user?.name && <div className="rx-paper-meta-row"><span className="rx-paper-meta-label">처방자</span><span className="rx-paper-meta-val">{user.name}</span></div>}
        </div>
        {selectedPills.length > 0 && (<>
          <div className="rx-paper-pills-title">처방 알약</div>
          <div className="rx-paper-pills">
            {selectedPills.map(p => (
              <div key={p.id} className="rx-paper-pill">
                <span className="rx-paper-pill-icon">{p.icon}</span>
                <div><div className="rx-paper-pill-name">{p.name}</div><div className="rx-paper-pill-dose">{p.dose}</div></div>
              </div>
            ))}
          </div>
        </>)}
        {comment && <div className="rx-paper-comment">💬 {comment}</div>}
        <div className="rx-paper-warning">
          <span className="rx-paper-warning-icon">⚠️</span>
          이 처방전은 시민 의견 표현을 위한 상징적 도구입니다. <b>실제 외교 효과를 보장하지 않습니다.</b>
        </div>
      </div>
      <div className="rx-paper-footer">
        <span className="rx-paper-footer-brand">🌍 Global Poll</span>
        <div className="rx-paper-footer-stamp">🌐</div>
      </div>
      <button className="rx-rewrite-btn" style={{ margin: '12px 16px 16px' }} onClick={onRewrite}>✏️ 처방전 수정하기</button>
    </div>
  );
}

function RxForm({ leader, showToast }) {
  const { getRx, saveRx } = useApp();
  const existing = getRx(leader.id);

  const [evalOpt,   setEvalOpt]   = useState(existing?.evalOpt || '');
  const [grid1Open, setGrid1Open] = useState(!existing?.evalOpt);
  const [reasons,   setReasons]   = useState(existing?.reasons || []);
  const [grid2Open, setGrid2Open] = useState(false);
  const [topFactor, setTopFactor] = useState(existing?.topFactor || '');
  const [grid3Open, setGrid3Open] = useState(false);
  const [selPills,  setSelPills]  = useState(existing?.pills || []);
  const [comment,   setComment]   = useState(existing?.comment || '');
  const [showPaper, setShowPaper] = useState(!!existing);

  const step1Done = !!evalOpt;
  const step2Done = reasons.length > 0;
  const step3Done = !!topFactor;
  const allDone   = step1Done && step2Done && step3Done;
  const recPillIds = evalOpt ? (PILL_MAP[evalOpt] || []) : [];
  const sortedPills = [...PILLS].sort((a, b) => {
    const aR = recPillIds.indexOf(a.id), bR = recPillIds.indexOf(b.id);
    if (aR !== -1 && bR === -1) return -1;
    if (bR !== -1 && aR === -1) return 1;
    if (aR !== -1 && bR !== -1) return aR - bR;
    return 0;
  });

  const toggleReason = (r) => setReasons(prev => {
    const next = prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r];
    if (topFactor && !next.includes(topFactor)) setTopFactor('');
    return next;
  });

  const handleSubmit = () => {
    saveRx(leader.id, { evalOpt, reasons, topFactor, pills: selPills, comment });
    setShowPaper(true);
    showToast('📋 처방전이 발행되었습니다!');
  };

  if (showPaper) {
    return <RxPaper leader={leader} evalOpt={evalOpt} reasons={reasons} topFactor={topFactor} pills={selPills} comment={comment} onRewrite={() => setShowPaper(false)} />;
  }

  return (
    <div className="rxl-inline-form">
      <ProgressBar step1={step1Done} step2={step2Done} step3={step3Done} />

      <div className="rx-narrative">
        <p className="rx-np">
          이 지도자는&nbsp;
          <button className={`rx-eval-chip${step1Done ? ' sel' : ''}`} onClick={() => setGrid1Open(v => !v)}>
            {evalOpt || '평가 선택'}&nbsp;<span className="rx-arr">{grid1Open ? '▴' : '▾'}</span>
          </button>
          &nbsp;라고 보여진다.
        </p>
        {grid1Open && <ChoiceGrid options={EVAL_OPTIONS} selected={evalOpt} onSelect={opt => { setEvalOpt(opt); setGrid1Open(false); setSelPills([]); }} className="rx-cg-1" />}

        {step1Done && (<>
          <p className="rx-np rx-np-on">
            그 이유로&nbsp;
            <button className={`rx-eval-chip${step2Done ? ' sel' : ''}`} onClick={() => setGrid2Open(v => !v)}>
              {reasons.length > 0 ? reasons.join(', ') : '이유 선택'}&nbsp;<span className="rx-arr">{grid2Open ? '▴' : '▾'}</span>
            </button>
            &nbsp;이(가) 작용했으며,
          </p>
          {grid2Open && <ChoiceGrid options={REASON_OPTIONS} selected={reasons} multi onSelect={toggleReason} className="rx-cg-2" />}
        </>)}

        {step2Done && (<>
          <p className="rx-np rx-np-on">
            그중에서도&nbsp;
            <button className={`rx-eval-chip${step3Done ? ' sel' : ''}`} onClick={() => setGrid3Open(v => !v)}>
              {topFactor || '가장 큰 요인 선택'}&nbsp;<span className="rx-arr">{grid3Open ? '▴' : '▾'}</span>
            </button>
            &nbsp;이 가장 크게 작용했다.
          </p>
          {grid3Open && <ChoiceGrid options={reasons} selected={topFactor} onSelect={r => { setTopFactor(r); setGrid3Open(false); }} className="rx-cg-3" />}
        </>)}
      </div>

      {allDone && (<>
        <div className="rx-diag-card">
          <div className="rx-diag-lbl">📋 진단 요약</div>
          <p className="rx-diag-txt">{LEADER_SUMMARY[leader.id] || leader.desc} 특히 <b>{topFactor}</b> 측면이 현재 가장 주목받는 요인입니다.</p>
        </div>

        <div className="rx-pills-hd">💊 처방 알약을 선택하세요</div>
        <div className="rx-pills-list">
          {sortedPills.map((p, i) => {
            const recIdx = recPillIds.indexOf(p.id);
            const isSel = selPills.includes(p.id);
            return (
              <div key={p.id} className={`rx-pi${isSel ? ' sel' : ''}${recIdx !== -1 ? ' rx-pi-rec' : ''}`}
                style={{ animationDelay: `${i * 40}ms` }}
                onClick={() => setSelPills(prev => prev.includes(p.id) ? prev.filter(x => x !== p.id) : [...prev, p.id])}>
                {recIdx !== -1 && <div className="rx-pi-rec-badge">{recIdx === 0 ? '★ 추천' : '추천'}</div>}
                <span className="rx-pi-ico">{p.icon}</span>
                <div className="rx-pi-nm">{p.name}</div>
                <div className="rx-pi-desc">{p.dose}</div>
                <div className="rx-pi-chk">✓</div>
              </div>
            );
          })}
        </div>

        <div className="rx-comment-wrap">
          <div className="rx-comment-lbl">이 지도자에 대한 한마디&nbsp;<span className="rx-comment-cnt">{comment.length}/50</span></div>
          <textarea className="rx-comment-ta" maxLength={50} placeholder="50자 이내로 자유롭게 남겨주세요" value={comment} onChange={e => setComment(e.target.value)} />
        </div>

        <button className="rx-submit-btn" onClick={handleSubmit}>📋 처방전 발행하기</button>
      </>)}
    </div>
  );
}

/* ── 지도자 행 (아코디언) ── */
function LeaderRow({ leader, done, isOpen, onToggle, showToast }) {
  const { tName, tTitle } = useApp();
  const formRef = useRef(null);
  const portrait = PORTRAITS[leader.id];
  const bg = FLAG_BG[leader.id] || '#e2e8f0';
  const bgStyle = bg.startsWith('linear') || bg.startsWith('radial') ? { background: bg } : { backgroundColor: bg };

  useEffect(() => {
    if (isOpen && formRef.current) {
      setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
    }
  }, [isOpen]);

  return (
    <div className="rxl-item">
      <button className={`rxl-row${isOpen ? ' active' : ''}`} onClick={onToggle}>
        <div className="rxl-flag" style={bgStyle}>
          {portrait && <div className="rxl-portrait" dangerouslySetInnerHTML={{ __html: portrait }} />}
        </div>
        <div className="rxl-info">
          <div className="rxl-name">{tName(leader.id)}</div>
          <div className="rxl-title">{tTitle(leader.id)}</div>
        </div>
        <span className={`rxl-badge${done ? ' done' : ''}`}>{done ? '✓ 완료' : '─ 미완'}</span>
        <span className="rxl-chevron">{isOpen ? '▴' : '▾'}</span>
      </button>

      {isOpen && (
        <div ref={formRef} className="rxl-form-panel">
          <RxForm key={leader.id} leader={leader} showToast={showToast} />
        </div>
      )}
    </div>
  );
}

/* ── 메인 ── */
export default function PrescriptionPage({ showToast }) {
  const { getRx, getEval, rxLeader } = useApp();
  const [openId, setOpenId] = useState(rxLeader?.id || null);

  useEffect(() => {
    if (rxLeader) setOpenId(rxLeader.id);
  }, [rxLeader]);

  const evaluatedLeaders = LEADERS.filter(l => !!getEval(l.id));
  const doneCount    = evaluatedLeaders.filter(l => !!getRx(l.id)).length;
  const pendingCount = evaluatedLeaders.length - doneCount;

  if (evaluatedLeaders.length === 0) {
    return (
      <div className="page-inner">
        <div className="rx-empty">
          <div className="rx-empty-icon">🌡️</div>
          <div className="rx-empty-title">평가한 지도자가 없어요</div>
          <div className="rx-empty-sub">홈 탭에서 지도자를 먼저 평가해주세요.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="rx-page">
      <div className="rxl-summary">
        <div className="rxl-summary-item done">
          <span className="rxl-summary-num">{doneCount}</span>
          <span className="rxl-summary-lbl">처방 완료</span>
        </div>
        <div className="rxl-summary-item pending">
          <span className="rxl-summary-num">{pendingCount}</span>
          <span className="rxl-summary-lbl">처방 대기</span>
        </div>
      </div>

      <div className="rxl-list">
        {evaluatedLeaders.map(leader => (
          <LeaderRow
            key={leader.id}
            leader={leader}
            done={!!getRx(leader.id)}
            isOpen={openId === leader.id}
            onToggle={() => setOpenId(prev => prev === leader.id ? null : leader.id)}
            showToast={showToast}
          />
        ))}
      </div>
    </div>
  );
}
