export const BRIEFS = {
  trump:     { peace: '미국 우선주의 협상으로 지역 갈등 완화 가능성', tension: '관세·동맹 압박으로 국제 긴장 고조' },
  putin:     { peace: '외교 채널 복원 시 유럽 안정 기대',           tension: '우크라이나 전쟁 지속으로 핵 위험 상승' },
  zelensky:  { peace: '영토 방어 성공이 공정한 협상 조건 형성',      tension: '전쟁 장기화로 민간 피해 계속 누적' },
  xi:        { peace: '일대일로 외교로 다자 협력 주도 가능',         tension: '대만 긴장·무역전쟁으로 아시아 불안' },
  ishiba:    { peace: '방위 협력 강화로 지역 억지력 향상',           tension: '역사 문제 미해결로 한·중 관계 경색' },
  macron:    { peace: '유럽 자율 국방 추진으로 안보 다변화',         tension: '내부 정치 분열로 외교력 약화 우려' },
  modi:      { peace: '비동맹 중재자로 글로벌 대화 촉진 기대',       tension: '국경 분쟁·종교 갈등으로 지역 불안' },
  netanyahu: { peace: '아브라함 협정 확대로 아랍권 관계 개선',       tension: '가자 전쟁 지속으로 인도적 위기 심화' },
  erdogan:   { peace: '양측 중재 역할로 흑해 협상 기여 가능',        tension: '쿠르드 분쟁·NATO 갈등으로 마찰 지속' },
  guterres:  { peace: '다자 외교 조율로 글로벌 평화 기반 강화',      tension: '강대국 거부권으로 UN 실효성 제한' },
  pope:      { peace: '도덕적 권위로 분쟁 지역 평화 호소 가능',      tension: '직접 영향력 부재로 실질 개입 한계' },
  mbs:       { peace: '이스라엘 관계 정상화로 중동 안정 기여',       tension: '예멘 분쟁·인권 이슈로 국제 비판 지속' },
  khamenei:  { peace: '핵합의 복원 시 제재 완화·지역 안정 가능',     tension: '대리 세력 지원으로 중동 갈등 확대' },
  kim:       { peace: '체제 보장 조건 대화 시 비핵화 가능성',        tension: '핵·미사일 개발 지속으로 한반도 위기' },
};

export const PROPOSAL_TYPE_MAP = {
  negotiation:    'rationalist',
  rhetoric:       'rationalist',
  civilian:       'humanitarian',
  ceasefire:      'humanitarian',
  opinion:        'multilateralist',
  accountability: 'accountability',
};

export const JUDGE_PROFILES = {
  rationalist: {
    emoji: '🤝',
    label: 'Rationalist Judge',
    name: '합리주의 재판관',
    desc: '협상과 대화를 통해 갈등을 해결하려는 현실주의적 시각을 가졌습니다. 충돌보다 타협에서 더 큰 가치를 찾으며, 실질적인 결과를 중시합니다.',
    bg: 'linear-gradient(145deg,#0ea5e9,#0369a1)',
  },
  humanitarian: {
    emoji: '🕊️',
    label: 'Humanitarian Judge',
    name: '인도주의 재판관',
    desc: '민간인 보호와 생명을 최우선 가치로 삼습니다. 어떤 명분보다도 사람의 존엄을 먼저 생각하는 따뜻한 시각을 가졌습니다.',
    bg: 'linear-gradient(145deg,#22c55e,#15803d)',
  },
  multilateralist: {
    emoji: '🌐',
    label: 'Multilateralist Judge',
    name: '다자주의 재판관',
    desc: '국제 여론과 다자 협력으로 균형을 추구합니다. 혼자보다 함께의 힘을 믿으며, 연대를 통한 지속 가능한 평화를 지향합니다.',
    bg: 'linear-gradient(145deg,#a78bfa,#6d28d9)',
  },
  accountability: {
    emoji: '⚖️',
    label: 'Accountability Judge',
    name: '책임 재판관',
    desc: '원칙과 책임을 중심으로 정의로운 질서를 추구합니다. 책임 없는 평화보다 지속 가능한 정의를 선택하며, 규범의 힘을 믿습니다.',
    bg: 'linear-gradient(145deg,#f97316,#c2410c)',
  },
};
