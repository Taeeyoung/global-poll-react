import { useEffect, useRef, useState, useMemo } from 'react';
import { geoNaturalEarth1, geoPath, geoGraticule } from 'd3-geo';
import { feature } from 'topojson-client';
import { useApp } from '../context/AppContext.jsx';
import { LEADERS, GLOW_COLOR } from '../data/leaders.js';
import { CONFLICTS } from '../data/conflicts.js';
import LeaderAvatar from './LeaderAvatar.jsx';

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

const MIN_ZOOM = 1;
const MAX_ZOOM = 8;
const ZOOM_IN_FACTOR  = 2;
const ZOOM_OUT_FACTOR = 0.5;
const DRAG_THRESHOLD  = 4;

// 분쟁 팝업 컴포넌트
function ConflictPopup({ conflict, leaders, pinX, pinY, containerW, containerH, onLeaderClick, onClose }) {
  const POPUP_W = 220;
  const POPUP_H = 120;
  const OFFSET  = 14;

  // 화면 끝 overflow 방지: 기본은 핀 오른쪽, 부족하면 왼쪽
  let left = pinX + OFFSET;
  if (left + POPUP_W > containerW - 8) left = pinX - POPUP_W - OFFSET;

  let top = pinY - POPUP_H / 2;
  top = Math.max(8, Math.min(top, containerH - POPUP_H - 8));

  return (
    <div
      className="conflict-popup"
      style={{ left, top }}
      onClick={e => e.stopPropagation()}
    >
      <button className="conflict-popup-close" onClick={onClose}>×</button>
      <div className="conflict-popup-name">{conflict.name}</div>
      <div className="conflict-popup-chip">{conflict.chip}</div>
      <div className="conflict-popup-leaders">
        {leaders.map(leader => (
          <button
            key={leader.id}
            className="conflict-popup-avatar"
            onClick={() => { onLeaderClick(leader); onClose(); }}
            title={leader.title}
          >
            <LeaderAvatar leader={leader} />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function WorldMapView({ onPinClick }) {
  const { getEval, tName } = useApp();
  const containerRef = useRef(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [world, setWorld] = useState(null);

  const vpRef = useRef({ zoom: 1, x: 0, y: 0 });
  const [vp, setVp] = useState({ zoom: 1, x: 0, y: 0 });

  const dragRef = useRef({ active: false, startX: 0, startY: 0, startVp: null, moved: false });
  const [dragging, setDragging] = useState(false);

  const clickTimerRef = useRef(null);

  // 활성 분쟁 팝업
  const [activeConflict, setActiveConflict] = useState(null);

  // 컨테이너 크기 감지
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      setSize({ w: Math.floor(width), h: Math.floor(height) });
      vpRef.current = { zoom: 1, x: 0, y: 0 };
      setVp({ zoom: 1, x: 0, y: 0 });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // 지도 데이터 로드
  useEffect(() => {
    loadWorld().then(setWorld).catch(() => {});
  }, []);

  // 드래그 mouseup (window)
  useEffect(() => {
    const onMouseUp = () => {
      if (dragRef.current.active) {
        dragRef.current.active = false;
        setDragging(false);
      }
    };
    window.addEventListener('mouseup', onMouseUp);
    return () => window.removeEventListener('mouseup', onMouseUp);
  }, []);

  const handleMouseDown = (e) => {
    if (e.target.closest('.map-pin') || e.target.closest('.conflict-pin') || e.target.closest('.conflict-popup')) return;
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      startVp: { ...vpRef.current },
      moved: false,
    };
    setDragging(true);
  };

  const handleMouseMove = (e) => {
    const d = dragRef.current;
    if (!d.active) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (!d.moved && Math.hypot(dx, dy) > DRAG_THRESHOLD) {
      d.moved = true;
      clearTimeout(clickTimerRef.current);
      setActiveConflict(null);
    }
    if (!d.moved) return;
    const next = { zoom: d.startVp.zoom, x: d.startVp.x + dx, y: d.startVp.y + dy };
    vpRef.current = next;
    setVp(next);
  };

  const handleMapClick = (e) => {
    if (e.target.closest('.map-pin') || e.target.closest('.conflict-pin') || e.target.closest('.conflict-popup')) return;
    if (dragRef.current.moved) return;

    setActiveConflict(null);

    const rect = containerRef.current.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;

    clearTimeout(clickTimerRef.current);

    if (e.detail >= 2) {
      const prev = vpRef.current;
      const newZoom = Math.max(MIN_ZOOM, prev.zoom * ZOOM_OUT_FACTOR);
      const next = newZoom <= MIN_ZOOM
        ? { zoom: 1, x: 0, y: 0 }
        : { zoom: newZoom, x: cx - (cx - prev.x) * (newZoom / prev.zoom), y: cy - (cy - prev.y) * (newZoom / prev.zoom) };
      vpRef.current = next;
      setVp(next);
    } else {
      clickTimerRef.current = setTimeout(() => {
        const prev = vpRef.current;
        const newZoom = Math.min(MAX_ZOOM, prev.zoom * ZOOM_IN_FACTOR);
        const next = { zoom: newZoom, x: cx - (cx - prev.x) * (newZoom / prev.zoom), y: cy - (cy - prev.y) * (newZoom / prev.zoom) };
        vpRef.current = next;
        setVp(next);
      }, 250);
    }
  };

  // 기본 projection
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

  const cursor = dragging ? 'grabbing' : (vp.zoom >= MAX_ZOOM ? 'zoom-out' : 'zoom-in');

  return (
    <div className="map-view">
      <div
        className="map-container"
        ref={containerRef}
        onClick={handleMapClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        style={{
          aspectRatio: '2.2 / 1',
          minHeight: 280,
          background: 'radial-gradient(120% 90% at 50% -10%, #101f33, #0b1524 60%)',
          overflow: 'hidden',
          cursor,
          userSelect: 'none',
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
          <svg width={size.w} height={size.h} style={{ display: 'block', position: 'absolute', inset: 0 }}>
            <defs>
              <filter id="landSoft" x="-6%" y="-6%" width="112%" height="112%">
                <feDropShadow dx="0" dy="1.5" stdDeviation="2.5" floodColor="#000" floodOpacity="0.4" />
              </filter>
            </defs>
            <g transform={`translate(${vp.x},${vp.y}) scale(${vp.zoom})`}>
              <path d={proj.graticule} fill="none" stroke="rgba(120,150,190,0.08)" strokeWidth="1" />
              <g filter="url(#landSoft)">
                {proj.countries.map(c => (
                  <path key={c.key} d={c.d}
                    fill="#1b2c41" stroke="#314a67" strokeWidth="0.7"
                    strokeLinejoin="round" vectorEffect="non-scaling-stroke"
                  />
                ))}
              </g>
            </g>
          </svg>
        )}

        {/* 지도자 핀 */}
        {proj && LEADERS.map(leader => {
          const coords = LEADER_COORDS[leader.id];
          if (!coords) return null;
          const base = proj.project(coords.lng, coords.lat);
          if (!base || isNaN(base[0]) || isNaN(base[1])) return null;
          const x = base[0] * vp.zoom + vp.x;
          const y = base[1] * vp.zoom + vp.y;
          const ev = getEval(leader.id);
          return (
            <button
              key={leader.id}
              className={`map-pin${ev ? ' evaluated' : ''}`}
              style={{ left: x, top: y, '--pin-glow': GLOW_COLOR[leader.id] }}
              onClick={(e) => { e.stopPropagation(); onPinClick(leader); }}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div className="map-pin-bubble">
                <div className="map-pin-portrait"><LeaderAvatar leader={leader} /></div>
                {ev && <span className="map-pin-score-badge">{ev.peace}</span>}
              </div>
              <span className="map-pin-label">{tName(leader.id)}</span>
            </button>
          );
        })}

        {/* 분쟁 지역 핀 */}
        {proj && CONFLICTS.map(conflict => {
          const base = proj.project(conflict.lng, conflict.lat);
          if (!base || isNaN(base[0]) || isNaN(base[1])) return null;
          const x = base[0] * vp.zoom + vp.x;
          const y = base[1] * vp.zoom + vp.y;
          const isActive = activeConflict?.id === conflict.id;
          return (
            <button
              key={conflict.id}
              className={`conflict-pin${isActive ? ' active' : ''}`}
              style={{ left: x, top: y }}
              onClick={(e) => {
                e.stopPropagation();
                setActiveConflict(isActive ? null : conflict);
              }}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <span className="conflict-pin-icon">⚔️</span>
            </button>
          );
        })}

        {/* 분쟁 팝업 */}
        {proj && activeConflict && (() => {
          const base = proj.project(activeConflict.lng, activeConflict.lat);
          if (!base) return null;
          const px = base[0] * vp.zoom + vp.x;
          const py = base[1] * vp.zoom + vp.y;
          const relatedLeaders = activeConflict.leaders
            .map(id => LEADERS.find(l => l.id === id))
            .filter(Boolean);
          return (
            <ConflictPopup
              conflict={activeConflict}
              leaders={relatedLeaders}
              pinX={px}
              pinY={py}
              containerW={size.w}
              containerH={size.h}
              onLeaderClick={onPinClick}
              onClose={() => setActiveConflict(null)}
            />
          );
        })()}

        {vp.zoom > 1 && (
          <div style={{
            position: 'absolute', bottom: 8, left: 10,
            background: 'rgba(11,23,41,.75)', border: '1px solid rgba(255,255,255,.1)',
            borderRadius: 99, padding: '3px 9px',
            fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,.5)',
            pointerEvents: 'none',
          }}>
            {vp.zoom.toFixed(1)}×
          </div>
        )}

        <div className="map-legend">
          <span className="map-legend-item"><span className="map-legend-dot unevaluated" />미평가</span>
          <span className="map-legend-item"><span className="map-legend-dot evaluated" />평가완료</span>
          <span className="map-legend-item"><span className="map-legend-dot conflict" />분쟁지역</span>
        </div>
      </div>
    </div>
  );
}
