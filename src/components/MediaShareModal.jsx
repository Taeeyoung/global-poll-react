import { useState, useEffect } from 'react';

const RECIPIENTS = [
  { ico:'🕊️', name:'UN 공보국',    email:'press@un.org',                     grad:'linear-gradient(145deg,#1a6fb5,#56c0e8)' },
  { ico:'🌙',  name:'Al Jazeera',  email:'english@aljazeera.net',             grad:'linear-gradient(145deg,#1a3a6e,#2d7a5f)' },
  { ico:'⚡',  name:'AP통신',       email:'info@ap.org',                       grad:'linear-gradient(145deg,#c0392b,#e74c3c)' },
  { ico:'🗽',  name:'뉴욕타임스',   email:'letters@nytimes.com',               grad:'linear-gradient(145deg,#2c3e50,#4a4a4a)' },
  { ico:'🏛️', name:'워싱턴포스트', email:'letters@washpost.com',              grad:'linear-gradient(145deg,#1a2f5e,#2980b9)' },
  { ico:'🎙️', name:'NPR',          email:'ombudsman@npr.org',                 grad:'linear-gradient(145deg,#6c3483,#a855f7)' },
  { ico:'📻',  name:'VOA',          email:'letters@voa.gov',                   grad:'linear-gradient(145deg,#b03a2e,#1a5276)' },
  { ico:'👑',  name:'BBC',          email:'haveyoursay@bbc.co.uk',             grad:'linear-gradient(145deg,#c0392b,#922b21)' },
  { ico:'🛡️', name:'가디언',        email:'guardian.readers@theguardian.com',  grad:'linear-gradient(145deg,#1a3a6e,#0d5c8a)' },
  { ico:'🔭',  name:'로이터',        email:'feedback@reuters.com',              grad:'linear-gradient(145deg,#e67e22,#d35400)' },
  { ico:'🗼',  name:'AFP',           email:'contact@afp.com',                   grad:'linear-gradient(145deg,#1a4a8a,#c0392b)' },
  { ico:'🥐',  name:'France 24',    email:'contact@france24.com',              grad:'linear-gradient(145deg,#2471a3,#1a6fb5)' },
  { ico:'🎵',  name:'RFI',           email:'english.rfi@rfi.fr',                grad:'linear-gradient(145deg,#7d3c98,#5b2c6f)' },
  { ico:'🦅',  name:'DW',            email:'feedback.world@dw.com',             grad:'linear-gradient(145deg,#922b21,#2c2c2c)' },
  { ico:'⛩️', name:'NHK World',     email:'nhkworld@nhk.or.jp',                grad:'linear-gradient(145deg,#c0392b,#f39c12)' },
  { ico:'🌸',  name:'Japan Times',  email:'editors@japantimes.co.jp',          grad:'linear-gradient(145deg,#d45a8a,#f06292)' },
  { ico:'🗾',  name:'교도통신',      email:'english@kyodonews.jp',              grad:'linear-gradient(145deg,#a93226,#784212)' },
  { ico:'🤝',  name:'연합뉴스',      email:'english@yna.co.kr',                 grad:'linear-gradient(145deg,#1a5276,#0d7a5f)' },
  { ico:'📺',  name:'KBS World',    email:'kbsworld@kbs.co.kr',                grad:'linear-gradient(145deg,#154360,#2980b9)' },
  { ico:'🎋',  name:'아리랑TV',      email:'news@arirang.com',                  grad:'linear-gradient(145deg,#1e8449,#148f77)' },
];

function buildEmailBody(ranked) {
  const d = new Date();
  const dateStr = `${d.getFullYear()}. ${d.getMonth()+1}. ${d.getDate()}.`;
  const lines = [
    '안녕하세요.',
    '',
    '시민 참여형 글로벌 리더십 평가 서비스 Global Poll을 통해 수집된 「세계 지도자 평화 온도」 결과를 공유드립니다.',
    '',
    'Global Poll은 시민들이 세계 주요 리더의 발언, 태도, 정책 방향을 바탕으로 해당 리더가 국제 사회에 주는 평화감과 긴장감을 직접 평가하는 참여형 여론 서비스입니다.',
    '',
    '이번 결과는 특정 리더에 대한 단정적 판단이 아니라, 시민들이 지금의 국제 사회를 어떻게 체감하고 있는지 보여주는 시민 인식 기반 데이터입니다.',
    '',
    `■ 평가 일시: ${dateStr}`,
    '■ 지표명: 시민 인식 기반 평화 온도',
    '■ 점수 기준: 100점 만점',
    '',
    '■ 주요 리더별 평화 온도',
    '',
    ...ranked.map((item, i) => `${i+1}위  ${item.name}  —  ${item.peace}점`),
    '',
    '시민들은 지금 세계 지도자들의 말과 선택이 평화를 향하고 있는지, 아니면 더 큰 긴장을 만들고 있는지 주목하고 있습니다.',
    '',
    '이 결과는 단순한 순위가 아닙니다.',
    '세계 곳곳의 시민들이 느끼는 불안, 기대, 경계심, 그리고 평화를 바라는 마음이 담긴 하나의 목소리입니다.',
    '',
    '시민들의 목소리에 귀 기울여주세요.',
    '더 많은 대화와 더 낮은 긴장으로, 평화를 지켜주세요.',
    '',
    '감사합니다.',
  ];
  return lines.join('\n');
}

export default function MediaShareModal({ ranked, onClose }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsOpen(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(onClose, 340);
  };

  const handleSend = (recipient) => {
    const body = buildEmailBody(ranked);
    const subject = encodeURIComponent('[Global Poll] 세계 지도자 평화 온도 평가 결과');
    const encodedBody = encodeURIComponent(body);
    window.location.href = `mailto:${recipient.email}?subject=${subject}&body=${encodedBody}`;
  };

  const previewText = buildEmailBody(ranked);

  return (
    <div className={`share-overlay${isOpen ? ' on' : ''}`} onClick={handleClose}>
      <div className="share-panel" onClick={e => e.stopPropagation()}>
        <div className="share-handle" />
        <div className="share-title">📧 결과를 언론사·기관에 보내기</div>
        <div className="share-sub">평가 결과를 이메일로 언론사·기관에 전달합니다.<br />클릭하면 이메일 앱이 열립니다.</div>

        <div className="share-preview">{previewText}</div>

        <div className="share-lbl">수신처 선택</div>
        <div className="share-recipient-grid">
          {RECIPIENTS.map(r => (
            <button
              key={r.email}
              className="share-recipient-btn"
              style={{ background: r.grad }}
              onClick={() => handleSend(r)}
            >
              <span className="share-recipient-ico">{r.ico}</span>
              <span className="share-recipient-name">{r.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
