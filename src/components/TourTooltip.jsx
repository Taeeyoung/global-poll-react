import { useState, useEffect } from 'react';

const STEPS = [
  { tab: 0, title: '🏠 홈',    desc: '세계 지도자 카드를 눌러 평화·긴장 온도를 직접 평가해보세요.' },
  { tab: 1, title: '🌡️ 처방전', desc: '평가한 지도자에게 나만의 평화 처방전을 작성해 목소리를 전달하세요.' },
  { tab: 2, title: '📊 통계',   desc: '내가 평가한 지도자들의 평화 온도 순위를 확인하고 언론사에 결과를 보낼 수 있어요.' },
  { tab: 3, title: '👤 프로필', desc: '5명 이상 평가하면 나만의 재판관 성향을 확인할 수 있어요!', highlight: true },
];

export default function TourTooltip({ onDone }) {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const [fromTop, setFromTop] = useState(false);
  const [bubbleLeft, setBubbleLeft] = useState(null); // 데스크탑 전용 px 값

  useEffect(() => {
    setVisible(false);

    const isDesktop = window.innerWidth >= 900;
    setFromTop(isDesktop);

    if (isDesktop) {
      const navItems = document.querySelectorAll('.hdr-nav-item');
      const item = navItems[STEPS[step].tab];
      if (item) {
        const rect = item.getBoundingClientRect();
        const center = rect.left + rect.width / 2;
        const half = 110; // 버블 너비(220px)의 절반
        // 화면 밖으로 잘리지 않도록 clamp
        const clamped = Math.min(Math.max(center, half + 8), window.innerWidth - half - 8);
        setBubbleLeft(clamped);
      }
    } else {
      setBubbleLeft(null);
    }

    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, [step]);

  const handleNext = () => {
    setVisible(false);
    setTimeout(() => {
      if (step < STEPS.length - 1) setStep(s => s + 1);
      else onDone();
    }, 200);
  };

  const current = STEPS[step];

  // 모바일: 하단 탭 기준 % / 데스크탑: 헤더 탭 실측 px
  const bubbleStyle = fromTop && bubbleLeft !== null
    ? { left: `${bubbleLeft}px` }
    : { left: `${(current.tab * 25) + 12.5}%` };

  return (
    <div className="tour-overlay">
      <div
        className={`tour-bubble${visible ? ' on' : ''}${current.highlight ? ' highlight' : ''}${fromTop ? ' from-top' : ''}`}
        style={bubbleStyle}
      >
        <div className="tour-bubble-title">{current.title}</div>
        <div className="tour-bubble-desc">{current.desc}</div>
        <button className="tour-bubble-btn" onClick={handleNext}>
          {step < STEPS.length - 1 ? '확인했어요' : '시작하기!'}
        </button>
        <div className="tour-bubble-arrow" />
      </div>
    </div>
  );
}
