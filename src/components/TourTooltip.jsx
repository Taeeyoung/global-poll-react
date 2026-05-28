import { useState, useEffect } from 'react';

const STEPS = [
  {
    tab: 0,
    title: '🏠 홈',
    desc: '세계 지도자 카드를 눌러 평화·긴장 온도를 직접 평가해보세요.',
  },
  {
    tab: 1,
    title: '🌡️ 처방전',
    desc: '평가한 지도자에게 나만의 평화 처방전을 작성해 목소리를 전달하세요.',
  },
  {
    tab: 2,
    title: '📊 통계',
    desc: '내가 평가한 지도자들의 평화 온도 순위를 확인하고 언론사에 결과를 보낼 수 있어요.',
  },
  {
    tab: 3,
    title: '👤 프로필',
    desc: '5명 이상 평가하면 나만의 재판관 성향을 확인할 수 있어요!',
    highlight: true,
  },
];

export default function TourTooltip({ onDone }) {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, [step]);

  const handleNext = () => {
    setVisible(false);
    setTimeout(() => {
      if (step < STEPS.length - 1) {
        setStep(s => s + 1);
      } else {
        onDone();
      }
    }, 200);
  };

  const current = STEPS[step];
  // 탭 4개 → 각 탭 중앙 위치 (25% 단위)
  const leftPct = (current.tab * 25) + 12.5;

  return (
    <div className="tour-overlay">
      <div
        className={`tour-bubble${visible ? ' on' : ''}${current.highlight ? ' highlight' : ''}`}
        style={{ left: `${leftPct}%` }}
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
