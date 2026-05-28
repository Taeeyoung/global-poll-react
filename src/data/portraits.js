const S = '<svg viewBox="0 0 120 160" xmlns="http://www.w3.org/2000/svg">';
const E = '</svg>';

const bg   = () => '';
const suit = c => `<path d="M0 160 L0 118 L38 106 L60 121 L82 106 L120 118 L120 160Z" fill="${c}"/>`;
const shirt  = () => '<polygon points="54,108 66,108 64,136 56,136" fill="#FFF"/>';
const tie    = c => `<polygon points="58,108 62,108 64,130 60,134 56,130" fill="${c}"/>`;
const neck   = c => `<rect x="52" y="96" width="16" height="14" rx="3" fill="${c}"/>`;
const ears   = c => `<ellipse cx="30" cy="81" rx="5" ry="7.5" fill="${c}"/><ellipse cx="90" cy="81" rx="5" ry="7.5" fill="${c}"/>`;
const face   = (c, rx=30, ry=33) => `<ellipse cx="60" cy="78" rx="${rx}" ry="${ry}" fill="${c}"/>`;
const hair   = (d, c) => `<path d="${d}" fill="${c}"/>`;
const brows  = c => `<path d="M43 72 Q50 69 57 71" stroke="${c}" stroke-width="2.8" fill="none" stroke-linecap="round"/><path d="M63 71 Q70 69 77 72" stroke="${c}" stroke-width="2.8" fill="none" stroke-linecap="round"/>`;
const eyes   = () => '<ellipse cx="50" cy="77" rx="5" ry="3.8" fill="#FFF"/><circle cx="51.5" cy="77" r="2.4" fill="#111"/><ellipse cx="70" cy="77" rx="5" ry="3.8" fill="#FFF"/><circle cx="71.5" cy="77" r="2.4" fill="#111"/>';
const nose   = c => `<path d="M56 85 Q60 90 64 85" stroke="${c}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
const mouth  = c => `<path d="M52 93 Q60 97 68 93" stroke="${c}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
const glasses = () =>
  '<rect x="40" y="73" width="16" height="10" rx="3" fill="none" stroke="#2A2A2A" stroke-width="2"/>' +
  '<rect x="64" y="73" width="16" height="10" rx="3" fill="none" stroke="#2A2A2A" stroke-width="2"/>' +
  '<line x1="56" y1="78" x2="64" y2="78" stroke="#2A2A2A" stroke-width="1.5"/>' +
  '<line x1="40" y1="78" x2="36" y2="80" stroke="#2A2A2A" stroke-width="1.5"/>' +
  '<line x1="80" y1="78" x2="84" y2="80" stroke="#2A2A2A" stroke-width="1.5"/>';

export const PORTRAITS = {
  trump: S + bg('#1D3461') + suit('#22375A') + shirt() + tie('#CC2222') + neck('#F5C89A') + ears('#F5C89A') +
    face('#F5C89A', 30, 33) +
    hair('M30 72 Q28 40 60 36 Q92 40 90 72 Q82 54 60 52 Q38 54 30 72Z', '#E8D060') +
    hair('M30 72 Q26 48 46 38 Q60 30 86 44', '#D4BC48') +
    '<path d="M37 58 Q54 43 78 44" stroke="#F5E888" stroke-width="2" fill="none"/>' +
    brows('#C89018') + eyes() + nose('#CCA070') + mouth('#B07848') + E,

  putin: S + bg('#6B0000') + suit('#181828') + shirt() + tie('#2A2A3A') + neck('#ECC8A0') + ears('#ECC8A0') +
    face('#ECC8A0', 29, 32) +
    hair('M31 68 Q30 50 60 46 Q90 50 89 68 Q80 56 60 54 Q40 56 31 68Z', '#C8C0A0') +
    brows('#887040') + eyes() + nose('#C8A070') +
    '<line x1="53" y1="93" x2="67" y2="92" stroke="#B07848" stroke-width="1.8" stroke-linecap="round"/>' + E,

  zelensky: S + bg('#1A4F7A') +
    suit('#3A4C2C') +
    '<path d="M48 108 L60 100 L72 108 L70 122 L50 122Z" fill="#303E22"/>' +
    neck('#E8C090') + ears('#E8C090') + face('#E8C090', 29, 32) +
    hair('M31 70 Q30 44 60 40 Q90 44 89 70 Q80 54 60 52 Q40 54 31 70Z', '#1E1408') +
    '<path d="M33 89 Q40 102 60 105 Q80 102 87 89 Q80 100 60 102 Q40 100 33 89Z" fill="#2C2010" opacity="0.35"/>' +
    brows('#1A1008') + eyes() + nose('#C09060') + mouth('#9A7048') + E,

  xi: S + bg('#AA0000') + suit('#111122') + shirt() + tie('#CC0000') + neck('#F0C898') + ears('#F0C898') +
    face('#F0C898', 30, 33) +
    hair('M30 71 Q28 44 60 40 Q92 44 90 71 Q82 55 60 52 Q38 55 30 71Z', '#111111') +
    brows('#111111') + eyes() + nose('#C8A070') + mouth('#A07848') + E,

  lee: S + bg('#1D3461') + suit('#1A2A44') + shirt() + tie('#4B8FD5') + neck('#F0C898') + ears('#F0C898') +
    face('#F0C898', 29, 32) +
    hair('M31 70 Q30 44 60 40 Q90 44 89 70 Q80 54 60 52 Q40 54 31 70Z', '#111111') +
    brows('#111111') + eyes() + nose('#C8A070') + mouth('#A07848') + E,

  ishiba: S + bg('#234080') + suit('#1A1A2E') + shirt() + tie('#8A3030') + neck('#F0C898') + ears('#F0C898') +
    face('#F0C898', 30, 33) +
    hair('M30 70 Q28 44 60 40 Q92 44 90 70 Q82 55 60 52 Q38 55 30 70Z', '#C4BCB0') +
    glasses() +
    brows('#888880') +
    '<circle cx="48" cy="78" r="2.2" fill="#111"/><circle cx="72" cy="78" r="2.2" fill="#111"/>' +
    nose('#C8A070') + mouth('#A07848') + E,

  macron: S + bg('#002395') + suit('#1A2A44') + shirt() + tie('#0055A4') + neck('#F5D0A8') + ears('#F5D0A8') +
    face('#F5D0A8', 29, 32) +
    hair('M31 70 Q30 44 60 40 Q90 44 89 70 Q82 56 60 54 Q38 56 31 70Z', '#5A3C20') +
    '<path d="M31 70 Q35 52 62 50" stroke="#44300A" stroke-width="3" fill="none"/>' +
    brows('#4A2C10') + eyes() + nose('#D0A878') + mouth('#B07850') + E,

  modi: S + bg('#FF9933') +
    '<path d="M0 160 L0 116 L35 108 L60 118 L85 108 L120 116 L120 160Z" fill="#F0F0F0"/>' +
    neck('#D09060') + ears('#D09060') + face('#D09060', 29, 32) +
    hair('M31 70 Q30 46 60 42 Q90 46 89 70 Q80 56 60 54 Q40 56 31 70Z', '#D8D0C0') +
    '<path d="M33 90 Q40 106 60 109 Q80 106 87 90 Q80 103 60 106 Q40 103 33 90Z" fill="#D8D0C0"/>' +
    brows('#4A2808') + eyes() + nose('#B07848') +
    '<path d="M54 92 Q60 94 66 92" stroke="#906040" stroke-width="1.5" fill="none" stroke-linecap="round"/>' + E,

  netanyahu: S + bg('#003399') + suit('#111828') + shirt() + tie('#003399') + neck('#ECC8A0') + ears('#ECC8A0') +
    face('#ECC8A0', 30, 33) +
    hair('M30 68 Q28 48 40 42 Q34 52 30 68Z', '#C8C0A8') +
    hair('M90 68 Q92 48 80 42 Q86 52 90 68Z', '#C8C0A8') +
    hair('M32 60 Q35 44 60 40 Q85 44 88 60 Q80 50 60 48 Q40 50 32 60Z', '#C8C0A8') +
    brows('#7A6040') + eyes() + nose('#C8A070') + mouth('#A07848') + E,

  erdogan: S + bg('#CC0000') + suit('#111122') + shirt() + tie('#880000') + neck('#D4A070') + ears('#D4A070') +
    face('#D4A070', 30, 33) +
    hair('M30 71 Q28 46 60 42 Q92 46 90 71 Q84 56 60 54 Q36 56 30 71Z', '#1A1008') +
    brows('#1A1008') + eyes() + nose('#B07840') + mouth('#986048') + E,

  guterres: S + bg('#009EDB') + suit('#1A1A2E') + shirt() + tie('#009EDB') + neck('#F0C898') + ears('#F0C898') +
    face('#F0C898', 30, 33) +
    hair('M30 70 Q28 44 60 40 Q92 44 90 70 Q82 55 60 52 Q38 55 30 70Z', '#E0E0E0') +
    glasses() +
    brows('#888880') +
    '<circle cx="48" cy="78" r="2.2" fill="#111"/><circle cx="72" cy="78" r="2.2" fill="#111"/>' +
    nose('#C8A070') + mouth('#A07848') + E,

  pope: S + bg('#DAA800') +
    '<path d="M0 160 L0 116 L35 108 L60 118 L85 108 L120 116 L120 160Z" fill="#F8F8F8"/>' +
    '<path d="M50 110 L60 104 L70 110 L68 132 L52 132Z" fill="#F0F0F0"/>' +
    '<line x1="60" y1="112" x2="60" y2="130" stroke="#C89A00" stroke-width="2"/>' +
    '<line x1="54" y1="119" x2="66" y2="119" stroke="#C89A00" stroke-width="2"/>' +
    neck('#F0C898') + ears('#F0C898') + face('#F0C898', 29, 32) +
    hair('M31 70 Q30 46 60 44 Q90 46 89 70 Q80 54 60 52 Q40 54 31 70Z', '#FFFFFF') +
    brows('#888880') + eyes() + nose('#C8A070') + mouth('#A07848') + E,

  mbs: S + bg('#006C35') +
    '<path d="M0 160 L0 116 L35 108 L60 118 L85 108 L120 116 L120 160Z" fill="#F8F8F2"/>' +
    neck('#C8906A') + ears('#C8906A') + face('#C8906A', 29, 32) +
    hair('M30 70 Q28 40 60 36 Q92 40 90 70 Q84 52 60 50 Q36 52 30 70Z', '#F8F8F0') +
    '<path d="M30 72 L20 86 Q20 100 30 105 Q28 92 30 72Z" fill="#F0F0E8"/>' +
    '<path d="M90 72 L100 86 Q100 100 90 105 Q92 92 90 72Z" fill="#F0F0E8"/>' +
    '<rect x="26" y="57" width="68" height="8" rx="4" fill="#111111"/>' +
    '<path d="M34 90 Q42 104 60 107 Q78 104 86 90 Q78 101 60 103 Q42 101 34 90Z" fill="#1A1208"/>' +
    brows('#111111') + eyes() + nose('#A87848') + mouth('#906040') + E,

  khamenei: S + bg('#1A3A1A') +
    '<path d="M0 160 L0 116 L35 108 L60 120 L85 108 L120 116 L120 160Z" fill="#111111"/>' +
    '<path d="M48 110 L60 104 L72 110 L70 128 L50 128Z" fill="#1A1A1A"/>' +
    neck('#C89060') + ears('#C89060') + face('#C89060', 29, 32) +
    hair('M31 68 Q28 38 60 34 Q92 38 89 68 Q84 50 60 48 Q36 50 31 68Z', '#111111') +
    '<path d="M30 68 Q33 50 58 44" stroke="#2A2A2A" stroke-width="3.5" fill="none"/>' +
    '<path d="M32 90 Q38 110 60 114 Q82 110 88 90 Q80 106 60 109 Q40 106 32 90Z" fill="#111111"/>' +
    '<path d="M41 72 Q50 67 58 70" stroke="#111" stroke-width="4" fill="none" stroke-linecap="round"/>' +
    '<path d="M62 70 Q70 67 79 72" stroke="#111" stroke-width="4" fill="none" stroke-linecap="round"/>' +
    '<ellipse cx="50" cy="77" rx="5" ry="3.5" fill="#FFF"/><circle cx="51" cy="77" r="2.4" fill="#050505"/>' +
    '<ellipse cx="70" cy="77" rx="5" ry="3.5" fill="#FFF"/><circle cx="71" cy="77" r="2.4" fill="#050505"/>' +
    nose('#A87848') + E,

  kim: S + bg('#880000') + suit('#111111') + shirt() + neck('#F0C898') +
    '<ellipse cx="29" cy="83" rx="6.5" ry="8.5" fill="#F0C898"/>' +
    '<ellipse cx="91" cy="83" rx="6.5" ry="8.5" fill="#F0C898"/>' +
    face('#F0C898', 33, 35) +
    '<rect x="27" y="46" width="66" height="24" rx="5" fill="#111111"/>' +
    '<rect x="27" y="60" width="8" height="22" fill="#F0C898"/>' +
    '<rect x="85" y="60" width="8" height="22" fill="#F0C898"/>' +
    '<path d="M35 70 Q27 62 27 70Z" fill="#111"/>' +
    '<path d="M85 70 Q93 62 93 70Z" fill="#111"/>' +
    brows('#111111') +
    '<ellipse cx="50" cy="80" rx="5" ry="3.8" fill="#FFF"/><circle cx="51.5" cy="80" r="2.4" fill="#050505"/>' +
    '<ellipse cx="70" cy="80" rx="5" ry="3.8" fill="#FFF"/><circle cx="71.5" cy="80" r="2.4" fill="#050505"/>' +
    nose('#C8A070') +
    '<line x1="52" y1="97" x2="68" y2="97" stroke="#B07858" stroke-width="1.8" stroke-linecap="round"/>' + E,
};
