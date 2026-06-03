import { useApp } from '../context/AppContext.jsx';
import { LEADERS, GLOW_COLOR } from '../data/leaders.js';
import { PORTRAITS } from '../data/portraits.js';

// ── 태평양 압축 파라미터 ──
// 150°E~125°W 구간(raw 250~486)을 15%로 압축 (85% 축소)
const PAC_L    = 250;
const PAC_R    = 486;
const PAC_K    = 0.15;
const PAC_SHIFT = (PAC_R - PAC_L) * (1 - PAC_K); // ≈ 200.6

const remapX = (rx) => {
  if (rx <= PAC_L) return rx;
  if (rx <= PAC_R) return PAC_L + (rx - PAC_L) * PAC_K;
  return rx - PAC_SHIFT;
};

// 투영: 태평양 중심 (기준 경선 60°E) + 압축
const project = (lon, lat) => {
  const rx = (((lon - 60) % 360 + 360) % 360) / 360 * 1000;
  return [remapX(rx), (90 - lat) / 180 * 500];
};

const path = (coords) =>
  coords.map(([lon, lat], i) => {
    const [x, y] = project(lon, lat);
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ') + ' Z';

// ── 대륙 경로 (Natural Earth 110m 기반, 60°E seam 회피) ──

const RUSSIA_EAST = path([
  [60,55],[68,54],[78,54],[88,53],[100,50],[110,53],[120,53],[130,52],
  [135,48],[140,46],[142,47],[141,51],[140,55],[138,57],[135,58],[133,60],
  [131,63],[130,65],[131,68],[133,68],[136,70],[140,72],[145,75],[150,72],
  [155,68],[160,63],[162,60],[163,57],[160,52],[158,47],[153,44],[149,44],
  [145,44],[141,44],[136,46],[130,46],[120,43],[110,40],[105,42],[100,43],
  [95,52],[88,50],[80,50],[73,54],[68,55],[62,57],[60,58],[60,55],
]);

const EAST_ASIA = path([
  [120,53],[130,52],[135,48],[140,46],[142,47],[141,51],[140,55],[138,57],
  [135,58],[133,60],[130,52],[122,30],[120,25],[115,22],[110,18],[108,16],
  [105,18],[100,20],[95,22],[100,35],[105,38],[110,38],[115,35],[120,32],
  [122,30],[125,35],[125,38],[128,40],[128,43],[130,45],[132,48],[136,46],
  [136,50],[138,52],[140,55],[138,57],[135,58],[133,60],[130,52],[120,53],
]);

const SOUTH_ASIA = path([
  [60,35],[65,35],[70,34],[75,34],[80,28],[85,25],[90,22],[95,22],
  [100,20],[105,18],[108,16],[110,18],[115,22],[120,25],[122,30],
  [120,32],[115,35],[110,38],[105,38],[100,35],[95,32],[90,25],[85,22],
  [80,22],[77,20],[76,12],[80,8],[78,10],[73,15],[68,23],[63,25],[60,28],[60,35],
]);

const SE_ASIA = path([
  [95,22],[100,20],[105,18],[108,16],[105,12],[103,4],[104,1],
  [103,2],[100,5],[98,8],[98,15],[95,18],[95,22],
]);

const KOREA = path([
  [124,38],[126,37],[129,35],[129,33],[128,36],[126,38],[124,38],
]);

const JAPAN = path([
  [130,32],[131,34],[134,35],[137,37],[140,38],[141,40],[141,42],
  [140,43],[138,42],[135,35],[133,34],[130,33],[130,32],
]);

const INDIA = path([
  [68,23],[73,22],[77,20],[80,14],[80,8],[78,10],[77,8],
  [76,10],[75,16],[74,20],[68,23],
]);

const AUSTRALIA = path([
  [114,22],[118,20],[122,18],[128,15],[132,12],[136,12],[138,14],
  [136,16],[132,18],[130,20],[128,22],[126,24],[128,26],[130,28],
  [132,30],[136,32],[138,34],[140,36],[142,38],[146,38],[150,36],
  [152,32],[152,28],[150,24],[148,20],[148,16],[145,14],[142,12],
  [140,14],[138,14],[136,12],[132,12],[128,15],[122,18],[118,20],
  [114,22],[114,26],[116,28],[118,30],[116,32],[114,34],[112,32],
  [112,28],[114,22],
]);

const NZ_NORTH = path([
  [172,37],[174,37],[176,38],[178,38],[178,40],[176,42],[174,42],[172,40],[172,37],
]);
const NZ_SOUTH = path([
  [166,44],[168,44],[170,44],[172,44],[172,46],[170,48],[168,46],[166,46],[166,44],
]);

const NORTH_AMERICA = path([
  [172,52],[168,54],[164,60],[162,64],[162,68],[160,70],[158,72],
  [150,72],[145,60],[142,54],[138,58],[136,58],[132,54],[126,50],
  [124,46],[122,38],[118,34],[114,30],[110,22],[106,22],[104,20],
  [100,20],[94,18],[90,16],[86,16],[84,10],[80,8],[76,8],[72,10],
  [68,12],[64,16],[64,20],[66,22],[68,28],[64,36],[64,40],[66,44],
  [70,44],[72,44],[72,48],[70,52],[68,54],[64,58],[62,60],[60,62],
  [62,66],[64,68],[68,72],[72,76],[80,78],[90,80],[100,80],[110,78],
  [120,76],[130,74],[140,72],[145,75],[150,72],[155,68],[160,63],
  [162,60],[163,57],[168,54],[172,52],
]);

const GREENLAND = path([
  [298,72],[304,74],[308,76],[316,78],[320,80],[318,82],[312,82],
  [304,82],[296,80],[288,78],[286,74],[290,72],[294,72],[298,72],
]);

const SOUTH_AMERICA = path([
  [286,12],[290,10],[292,8],[294,4],[298,2],[300,0],[300,-4],
  [298,-8],[296,-14],[296,-20],[298,-26],[300,-30],[300,-34],
  [298,-36],[296,-38],[294,-40],[292,-44],[290,-46],[288,-50],
  [284,-54],[280,-56],[276,-54],[274,-50],[272,-46],[270,-42],
  [270,-38],[272,-34],[274,-30],[274,-26],[274,-20],[272,-16],
  [270,-12],[268,-8],[268,-4],[270,-2],[272,2],[276,4],[280,8],
  [284,12],[286,12],
]);

// 유럽 / 러시아 서부 / 중동 — 57°E(x≈792 after remap)에서 동쪽 경계 마감
const EUROPE = path([
  [0,72],[4,72],[8,70],[12,68],[16,68],[20,70],[24,68],[28,70],
  [32,68],[36,68],[40,68],[40,64],[38,60],[40,56],[36,54],[32,54],
  [28,56],[24,58],[20,54],[18,50],[16,48],[12,46],[10,44],[12,42],
  [14,40],[16,38],[18,38],[20,40],[24,38],[26,40],[28,38],[30,36],
  [28,36],[24,36],[20,38],[18,38],[14,40],[10,44],[8,46],[4,48],
  [0,48],[0,52],[2,56],[0,60],[0,64],[0,68],[0,72],
]);

const SCANDINAVIA = path([
  [4,58],[8,58],[12,56],[16,56],[18,58],[20,60],[22,64],[24,68],
  [28,70],[24,68],[20,70],[16,68],[12,68],[8,70],[4,72],
  [4,68],[4,64],[4,60],[4,58],
]);

const UK = path([
  [354,50],[356,52],[356,54],[354,56],[352,58],[350,56],[350,54],[352,52],[354,50],
]);

// RUSSIA_WEST: 57°E로 동쪽 경계 마감 → seam(60°E) 교차 방지
const RUSSIA_WEST = path([
  [26,70],[32,68],[36,68],[40,68],[40,64],[44,62],[48,60],[52,58],
  [56,56],[57,58],[57,60],[56,60],[52,62],[48,64],[44,66],[40,68],
  [36,68],[32,70],[28,70],[26,70],
]);

const AFRICA = path([
  [350,38],[354,36],[358,34],[0,32],[4,32],[8,30],[12,28],[16,24],
  [20,20],[24,16],[28,12],[32,8],[36,4],[40,2],[44,2],[48,4],
  [50,8],[52,12],[52,16],[50,20],[48,24],[44,26],[44,30],[40,32],
  [38,34],[36,36],[34,38],[30,38],[26,38],[22,36],[18,36],[14,36],
  [10,36],[6,38],[2,38],[358,38],[354,38],[350,38],
]);

// MIDDLE_EAST: 57°E까지로 동쪽 마감
const MIDDLE_EAST = path([
  [26,38],[30,38],[34,38],[36,36],[40,36],[44,36],[48,36],
  [52,36],[56,36],[57,32],[57,22],[56,20],[52,22],
  [48,22],[44,26],[40,28],[36,30],[36,36],[30,38],[26,38],
]);

const ARABIA = path([
  [36,30],[40,28],[44,26],[48,24],[52,22],[56,20],[57,18],[57,14],
  [56,12],[54,12],[52,14],[50,18],[48,22],[44,24],[40,26],[36,28],[36,30],
]);

const MADAGASCAR = path([
  [44,14],[46,14],[48,16],[48,20],[46,24],[44,24],[42,22],[42,18],[44,14],
]);

// ── 핀 좌표 (태평양 압축 + viewBox "0 50 858 380" 기준) ──
// 계산: x% = project(lon,lat)[0]/858*100, y% = (project(lon,lat)[1]-50)/380*100
const PIN_POS = {
  xi:        { x: 18, y: 24 },
  kim:       { x: 21, y: 24 },
  ishiba:    { x: 26, y: 27 },
  modi:      { x:  6, y: 32 },
  trump:     { x: 49, y: 24 },
  guterres:  { x: 50, y: 20 },
  macron:    { x: 74, y: 17 },
  zelensky:  { x: 83, y: 16 },
  pope:      { x: 78, y: 22 },
  putin:     { x: 86, y: 12 },
  erdogan:   { x: 84, y: 24 },
  netanyahu: { x: 85, y: 30 },
  khamenei:  { x: 90, y: 26 },
  mbs:       { x: 89, y: 35 },
};

const OCEAN = '#0a1828';
const LAND  = '#1c4432';
const LAND2 = '#163426';
const STR   = 'rgba(100,200,140,.13)';
const GRID  = 'rgba(255,255,255,.04)';
const EQ    = 'rgba(255,255,255,.08)';

export default function WorldMapView({ onPinClick }) {
  const { getEval, tName } = useApp();

  return (
    <div className="map-view">
      <div className="map-container">
        <svg
          className="map-bg"
          viewBox="0 50 858 380"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="og" cx="40%" cy="45%">
              <stop offset="0%"   stopColor="#0f2240" />
              <stop offset="100%" stopColor="#060e1a" />
            </radialGradient>
          </defs>

          {/* 바다 */}
          <rect width="1000" height="500" fill="url(#og)" />

          {/* 위도선 */}
          <line x1="0" y1="83"  x2="858" y2="83"  stroke={GRID} strokeWidth="0.7" />
          <line x1="0" y1="167" x2="858" y2="167" stroke={GRID} strokeWidth="0.7" />
          <line x1="0" y1="250" x2="858" y2="250" stroke={EQ}   strokeWidth="0.9" strokeDasharray="5,4" />
          <line x1="0" y1="333" x2="858" y2="333" stroke={GRID} strokeWidth="0.7" />
          <line x1="0" y1="417" x2="858" y2="417" stroke={GRID} strokeWidth="0.7" />

          {/* 경도선 (압축 후 재계산) */}
          <line x1="167" y1="50" x2="167" y2="430" stroke={GRID} strokeWidth="0.7" />
          <line x1="262" y1="50" x2="262" y2="430" stroke={GRID} strokeWidth="0.7" />
          <line x1="285" y1="50" x2="285" y2="430" stroke={GRID} strokeWidth="0.7" />
          <line x1="466" y1="50" x2="466" y2="430" stroke={GRID} strokeWidth="0.7" />
          <line x1="632" y1="50" x2="632" y2="430" stroke={GRID} strokeWidth="0.7" />

          {/* 대륙 */}
          <path d={RUSSIA_EAST}  fill={LAND}  stroke={STR} strokeWidth="0.8" />
          <path d={EAST_ASIA}    fill={LAND}  stroke={STR} strokeWidth="0.8" />
          <path d={SOUTH_ASIA}   fill={LAND}  stroke={STR} strokeWidth="0.8" />
          <path d={SE_ASIA}      fill={LAND2} stroke={STR} strokeWidth="0.6" />
          <path d={INDIA}        fill={LAND}  stroke={STR} strokeWidth="0.8" />
          <path d={KOREA}        fill={LAND2} stroke={STR} strokeWidth="0.6" />
          <path d={JAPAN}        fill={LAND2} stroke={STR} strokeWidth="0.6" />
          <path d={AUSTRALIA}    fill={LAND}  stroke={STR} strokeWidth="0.8" />
          <path d={NZ_NORTH}     fill={LAND2} stroke={STR} strokeWidth="0.5" />
          <path d={NZ_SOUTH}     fill={LAND2} stroke={STR} strokeWidth="0.5" />
          <path d={NORTH_AMERICA} fill={LAND} stroke={STR} strokeWidth="0.8" />
          <path d={GREENLAND}    fill={LAND2} stroke={STR} strokeWidth="0.6" />
          <path d={SOUTH_AMERICA} fill={LAND} stroke={STR} strokeWidth="0.8" />
          <path d={EUROPE}       fill={LAND}  stroke={STR} strokeWidth="0.8" />
          <path d={SCANDINAVIA}  fill={LAND2} stroke={STR} strokeWidth="0.6" />
          <path d={UK}           fill={LAND2} stroke={STR} strokeWidth="0.5" />
          <path d={RUSSIA_WEST}  fill={LAND}  stroke={STR} strokeWidth="0.8" />
          <path d={AFRICA}       fill={LAND}  stroke={STR} strokeWidth="0.8" />
          <path d={MIDDLE_EAST}  fill={LAND}  stroke={STR} strokeWidth="0.8" />
          <path d={ARABIA}       fill={LAND}  stroke={STR} strokeWidth="0.8" />
          <path d={MADAGASCAR}   fill={LAND2} stroke={STR} strokeWidth="0.5" />

          {/* 지역 레이블 (압축 + viewBox 반영) */}
          <text x="100" y="172" fill="rgba(255,255,255,.1)"  fontSize="12" fontWeight="700" textAnchor="middle" letterSpacing="2">아시아</text>
          <text x="276" y="220" fill="rgba(255,255,255,.07)" fontSize="10" fontWeight="700" textAnchor="middle" letterSpacing="2">태 평 양</text>
          <text x="354" y="118" fill="rgba(255,255,255,.07)" fontSize="9"  fontWeight="700" textAnchor="middle" letterSpacing="1">북아메리카</text>
          <text x="405" y="330" fill="rgba(255,255,255,.07)" fontSize="9"  fontWeight="700" textAnchor="middle" letterSpacing="1">남아메리카</text>
          <text x="650" y="210" fill="rgba(255,255,255,.07)" fontSize="9"  fontWeight="700" textAnchor="middle" letterSpacing="1">아프리카</text>
          <text x="630" y="98"  fill="rgba(255,255,255,.07)" fontSize="8"  fontWeight="700" textAnchor="middle" letterSpacing="1">유럽</text>
          <text x="52"  y="310" fill="rgba(255,255,255,.05)" fontSize="8"  fontWeight="700" textAnchor="middle" letterSpacing="1">인도양</text>
        </svg>

        {/* 지도자 핀 */}
        {LEADERS.map(leader => {
          const pos = PIN_POS[leader.id];
          if (!pos) return null;
          const ev = getEval(leader.id);
          const portrait = PORTRAITS[leader.id];
          return (
            <button
              key={leader.id}
              className={`map-pin${ev ? ' evaluated' : ''}`}
              style={{ left: `${pos.x}%`, top: `${pos.y}%`, '--pin-glow': GLOW_COLOR[leader.id] }}
              onClick={() => onPinClick(leader)}
            >
              <div className="map-pin-bubble">
                {portrait
                  ? <div className="map-pin-portrait" dangerouslySetInnerHTML={{ __html: portrait }} />
                  : <span className="map-pin-emoji">{leader.emoji}</span>}
                {ev && <span className="map-pin-score-badge">{ev.peace}</span>}
              </div>
              <span className="map-pin-label">{tName(leader.id)}</span>
            </button>
          );
        })}

        {/* 범례 */}
        <div className="map-legend">
          <span className="map-legend-item"><span className="map-legend-dot unevaluated" />미평가</span>
          <span className="map-legend-item"><span className="map-legend-dot evaluated" />평가완료</span>
        </div>
      </div>
    </div>
  );
}
