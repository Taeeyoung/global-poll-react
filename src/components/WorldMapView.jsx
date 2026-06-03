import { useEffect, useRef, useState, useMemo } from 'react';
import { geoNaturalEarth1, geoPath, geoGraticule } from 'd3-geo';
import { feature } from 'topojson-client';
import { useApp } from '../context/AppContext.jsx';
import { LEADERS, GLOW_COLOR } from '../data/leaders.js';
import { PORTRAITS } from '../data/portraits.js';

const WORLD_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';
let _worldCache = null;
let _worldPromise = null;

function loadWorld() {
  if (_worldCache) return Promise.resolve(_worldCache);
  if (_worldPromise) return _worldPromise;
  _worldPromise = fetch(WORLD_URL)
    .then(r => r.json())
    .then(topo => {
      const land = feature(topo, topo.objects.countries);
      land.features = land.features.filter(f => String(f.id) !== '010');
      _worldCache = land;
      return land;
    });
  return _worldPromise;
}

// 수도 위경도 (핀 위치 기준)
const LEADER_COORDS = {
  trump:     { lat: 38.91,  lng: -77.04 },
  putin:     { lat: 55.75,  lng:  37.62 },
  zelensky:  { lat: 50.45,  lng:  30.52 },
  xi:        { lat: 39.90,  lng: 116.40 },
  ishiba:    { lat: 35.68,  lng: 139.69 },
  macron:    { lat: 48.86,  lng:   2.35 },
  modi:      { lat: 28.61,  lng:  77.21 },
  netanyahu: { lat: 31.77,  lng:  35.22 },
  erdogan:   { lat: 39.93,  lng:  32.86 },
  guterres:  { lat: 40.75,  lng: -73.97 },
  pope:      { lat: 41.90,  lng:  12.45 },
  mbs:       { lat: 24.69,  lng:  46.72 },
  khamenei:  { lat: 35.69,  lng:  51.39 },
  kim:       { lat: 39.02,  lng: 125.75 },
};

export default function WorldMapView({ onPinClick }) {
  const { getEval, tName } = useApp();
  const containerRef = useRef(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [world, setWorld] = useState(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      setSize({ w: Math.floor(width), h: Math.floor(height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    loadWorld().then(setWorld).catch(() => {});
  }, []);

  const proj = useMemo(() => {
    if (!world || !size.w || !size.h) return null;
    const pad = 12;
    const p = geoNaturalEarth1();
    p.fitExtent([[pad, pad], [size.w - pad, size.h - pad]], world);
    const pathGen = geoPath(p);
    const grat = geoGraticule().step([30, 30])();
    return {
      project: (lng, lat) => p([lng, lat]),
      countries: world.features.map((f, i) => ({ key: i, d: pathGen(f) })),
      graticule: pathGen(grat),
    };
  }, [world, size.w, size.h]);

  return (
    <div className="map-view">
      <div
        className="map-container"
        ref={containerRef}
        style={{
          aspectRatio: '2.2 / 1',
          minHeight: 280,
          background: 'radial-gradient(120% 90% at 50% -10%, #101f33, #0b1524 60%)',
        }}
      >
        {!world && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'rgba(255,255,255,0.3)', fontSize: 13,
          }}>
            지도를 불러오는 중…
          </div>
        )}

        {proj && (
          <svg
            width={size.w}
            height={size.h}
            style={{ display: 'block', position: 'absolute', inset: 0 }}
          >
            <defs>
              <filter id="landSoft" x="-6%" y="-6%" width="112%" height="112%">
                <feDropShadow dx="0" dy="1.5" stdDeviation="2.5" floodColor="#000" floodOpacity="0.4" />
              </filter>
            </defs>
            <path d={proj.graticule} fill="none" stroke="rgba(120,150,190,0.08)" strokeWidth="1" />
            <g filter="url(#landSoft)">
              {proj.countries.map(c => (
                <path
                  key={c.key}
                  d={c.d}
                  fill="#1b2c41"
                  stroke="#314a67"
                  strokeWidth="0.7"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </g>
          </svg>
        )}

        {proj && LEADERS.map(leader => {
          const coords = LEADER_COORDS[leader.id];
          if (!coords) return null;
          const pos = proj.project(coords.lng, coords.lat);
          if (!pos || isNaN(pos[0]) || isNaN(pos[1])) return null;
          const [x, y] = pos;
          const ev = getEval(leader.id);
          const portrait = PORTRAITS[leader.id];
          return (
            <button
              key={leader.id}
              className={`map-pin${ev ? ' evaluated' : ''}`}
              style={{ left: x, top: y, '--pin-glow': GLOW_COLOR[leader.id] }}
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

        <div className="map-legend">
          <span className="map-legend-item"><span className="map-legend-dot unevaluated" />미평가</span>
          <span className="map-legend-item"><span className="map-legend-dot evaluated" />평가완료</span>
        </div>
      </div>
    </div>
  );
}
