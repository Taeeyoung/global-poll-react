const SKIN = {
  fair:  ['#f4d5b8','#e7bb98'],
  light: ['#edc6a3','#d9a67d'],
  tan:   ['#d6a576','#bd875a'],
  brown: ['#a9744a','#875836'],
  deep:  ['#7c5032','#5d3a22'],
};
const HAIRC = {
  black:'#24242b', darkbrown:'#34241a', brown:'#5b3d25', blonde:'#cda95c',
  gray:'#aab0bd', white:'#e6e9ef', saltpepper:'#7c828f',
};
const HAIR = {
  short:   "M33,52 C30,22 47,14 60,14 C73,14 90,22 87,52 C87,45 84,41 81,40 C81,41 80,42 80,43 C77,38 69,35 60,35 C51,35 43,38 40,43 C40,42 39,40 39,40 C36,41 33,45 33,52 Z",
  sidePart:"M33,52 C30,22 47,14 60,14 C73,14 90,22 87,52 C87,44 83,40 80,40 C80,41 78,42 78,44 C74,36 66,34 56,35 C49,36 45,40 43,46 C43,42 41,40 41,40 C37,41 33,45 33,52 Z",
  swoop:   "M32,50 C30,22 47,13 61,13 C75,13 89,21 87,46 C87,40 83,37 79,38 C82,33 74,30 64,31 C54,32 46,35 41,42 C45,33 58,28 70,30 C58,24 44,27 39,36 C35,40 33,45 32,50 Z",
  receded: "M34,52 C32,26 46,16 60,16 C74,16 88,26 86,52 C86,46 83,42 80,42 C80,43 79,45 79,47 C76,42 71,40 67,40 C66,37 63,35 60,35 C57,35 54,37 53,40 C49,40 44,42 41,47 C41,45 40,42 40,42 C37,42 34,46 34,52 Z",
  buzz:    "M36,49 C35,28 47,19 60,19 C73,19 85,28 84,49 C84,43 80,39 60,39 C40,39 36,43 36,49 Z",
};

const REGION_TINT = {
  trump:     ['#6a5ba5','#352e5c'],
  putin:     ['#4a7aa5','#26415c'],
  zelensky:  ['#4a7aa5','#26415c'],
  xi:        ['#3a6ea5','#1e3a5c'],
  ishiba:    ['#3a6ea5','#1e3a5c'],
  macron:    ['#4a7aa5','#26415c'],
  modi:      ['#a5683a','#5c361e'],
  netanyahu: ['#48607e','#26344a'],
  erdogan:   ['#48607e','#26344a'],
  guterres:  ['#4a7aa5','#26415c'],
  pope:      ['#4a7aa5','#26415c'],
  mbs:       ['#3aa58a','#1e5c4a'],
  khamenei:  ['#48607e','#26344a'],
  kim:       ['#3a6ea5','#1e3a5c'],
};

const AV_FEAT = {
  trump:     { skin:'fair',  hair:'blonde',     style:'swoop',    tie:'#c0392b' },
  putin:     { skin:'light', hair:'saltpepper', style:'buzz',     tie:'#34516e' },
  zelensky:  { skin:'light', hair:'darkbrown',  style:'short',    tie:'#5a7a3a' },
  xi:        { skin:'light', hair:'black',      style:'short',    tie:'#b23b3b' },
  ishiba:    { skin:'light', hair:'saltpepper', style:'short',    tie:'#34516e' },
  macron:    { skin:'light', hair:'brown',      style:'short',    tie:'#34516e' },
  modi:      { skin:'tan',   hair:'white',      style:'short',    tie:'#d98c2b', beard:true },
  netanyahu: { skin:'light', hair:'gray',       style:'receded',  tie:'#34516e' },
  erdogan:   { skin:'light', hair:'darkbrown',  style:'short',    tie:'#8b2323' },
  guterres:  { skin:'fair',  hair:'white',      style:'short',    tie:'#34516e', glasses:true },
  pope:      { skin:'fair',  hair:'white',      style:'short',    tie:'#e8e8e8' },
  mbs:       { skin:'tan',   hair:'black',      style:'short',    tie:'#2c6e49' },
  khamenei:  { skin:'tan',   hair:'black',      style:'receded',  tie:'#2c4a1e', beard:true, mustache:true },
  kim:       { skin:'light', hair:'black',      style:'receded',  tie:'#1a2a4a' },
};

export default function LeaderAvatar({ leader }) {
  const feat = AV_FEAT[leader.id] || { skin:'light', hair:'brown', style:'short', tie:'#34516e' };
  const [sa, sb] = SKIN[feat.skin] || SKIN.light;
  const hc = HAIRC[feat.hair] || HAIRC.brown;
  const [ba, bb] = REGION_TINT[leader.id] || ['#48607e','#26344a'];
  const uid = 'av-' + leader.id;

  return (
    <svg viewBox="0 0 120 124" width="100%" style={{ display:'block', aspectRatio:'120/124' }}>
      <defs>
        <linearGradient id={uid+'-bg'} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={ba} stopOpacity="0.9"/>
          <stop offset="100%" stopColor={bb} stopOpacity="0.95"/>
        </linearGradient>
        <radialGradient id={uid+'-skin'} cx="42%" cy="36%" r="75%">
          <stop offset="0%" stopColor={sa}/>
          <stop offset="100%" stopColor={sb}/>
        </radialGradient>
        <linearGradient id={uid+'-suit'} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22405c"/>
          <stop offset="100%" stopColor="#162c41"/>
        </linearGradient>
        <clipPath id={uid+'-clip'}><rect x="0" y="0" width="120" height="124"/></clipPath>
      </defs>

      <g clipPath={`url(#${uid}-clip)`}>
        <rect x="0" y="0" width="120" height="124" fill={`url(#${uid}-bg)`}/>
        <ellipse cx="60" cy="34" rx="50" ry="34" fill="#ffffff" opacity="0.06"/>

        <path d="M10,124 C10,102 28,92 60,92 C92,92 110,102 110,124 Z" fill={`url(#${uid}-suit)`}/>
        <path d="M10,124 C10,108 22,99 36,95 C30,104 28,114 28,124 Z" fill="#000" opacity="0.12"/>
        <path d="M110,124 C110,108 98,99 84,95 C90,104 92,114 92,124 Z" fill="#fff" opacity="0.05"/>

        <path d="M60,92 L47,98 L60,122 L73,98 Z" fill="#eef2f7"/>
        <path d="M60,92 L52,97 L60,104 Z" fill="#cfd8e2"/>
        <path d="M60,92 L68,97 L60,104 Z" fill="#dce3ec"/>
        <path d="M60,99 L56,104 L60,122 L64,104 Z" fill={feat.tie}/>
        <path d="M60,99 L57,103 L60,108 L63,103 Z" fill="#000" opacity="0.12"/>

        <path d="M52,80 L68,80 L68,96 L52,96 Z" fill={`url(#${uid}-skin)`}/>
        <ellipse cx="60" cy="82" rx="11" ry="6" fill="#000" opacity="0.13"/>

        <ellipse cx="34" cy="55" rx="4.5" ry="6.5" fill={`url(#${uid}-skin)`}/>
        <ellipse cx="86" cy="55" rx="4.5" ry="6.5" fill={`url(#${uid}-skin)`}/>

        <ellipse cx="60" cy="52" rx="26.5" ry="30.5" fill={`url(#${uid}-skin)`}/>
        <path d="M40,70 C46,80 74,80 80,70 C76,82 44,82 40,70 Z" fill="#000" opacity="0.06"/>

        {feat.beard && (
          <path d="M37,54 C37,72 48,84 60,84 C72,84 83,72 83,54 C83,67 73,72 60,72 C47,72 37,67 37,54 Z"
            fill={hc} opacity="0.95"/>
        )}

        {feat.style !== 'bald' && <path d={HAIR[feat.style] || HAIR.short} fill={hc}/>}
        {feat.style !== 'bald' && <path d={HAIR[feat.style] || HAIR.short} fill="#fff" opacity="0.07"/>}
        {feat.style === 'bald' && (
          <g fill={hc}>
            <path d="M34,56 C33,47 35,41 38,41 C37,46 38,52 39,57 Z"/>
            <path d="M86,56 C87,47 85,41 82,41 C83,46 82,52 81,57 Z"/>
          </g>
        )}

        <rect x="45.5" y="45" width="9.5" height="3" rx="1.5" fill={hc} opacity="0.85"/>
        <rect x="65" y="45" width="9.5" height="3" rx="1.5" fill={hc} opacity="0.85"/>

        <ellipse cx="50.2" cy="51" rx="3.4" ry="2.3" fill="#f3f5f8"/>
        <ellipse cx="69.8" cy="51" rx="3.4" ry="2.3" fill="#f3f5f8"/>
        <circle cx="50.4" cy="51.3" r="1.8" fill="#33384a"/>
        <circle cx="69.6" cy="51.3" r="1.8" fill="#33384a"/>
        <path d="M46.6,49.6 C48,48.4 52.4,48.4 53.8,49.6" stroke="#000" strokeOpacity="0.16" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        <path d="M66.2,49.6 C67.6,48.4 72,48.4 73.4,49.6" stroke="#000" strokeOpacity="0.16" strokeWidth="1.2" fill="none" strokeLinecap="round"/>

        <path d="M59,53 C57.5,58 57,60 60,61 C63,60 62.5,58 61,53" fill="none" stroke="#000" strokeOpacity="0.16" strokeWidth="1.4" strokeLinecap="round"/>
        <path d="M53,67 C57,70 63,70 67,67" fill="none" stroke="#7a4a3a" strokeOpacity="0.7" strokeWidth="1.8" strokeLinecap="round"/>

        {feat.mustache && (
          <path d="M52,64 C55,62 58,63 60,64 C62,63 65,62 68,64 C66,67 62,66 60,64.6 C58,66 54,67 52,64 Z" fill={hc}/>
        )}

        {feat.glasses && (
          <g fill="none" stroke="#1c1f27" strokeOpacity="0.82" strokeWidth="1.8">
            <rect x="44.5" y="46.5" width="11.5" height="9" rx="3"/>
            <rect x="64" y="46.5" width="11.5" height="9" rx="3"/>
            <path d="M56,50.5 L64,50.5"/>
            <path d="M44.5,49 L38,48"/>
            <path d="M75.5,49 L82,48"/>
          </g>
        )}
      </g>
    </svg>
  );
}
