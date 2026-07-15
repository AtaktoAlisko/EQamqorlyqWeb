import { motion, useTransform } from 'framer-motion';

/* ============================================================
   Накрытый стол сверху. Блюда появляются волнами по мере
   скролла. Рисовка «полуреалистичная»: объёмная керамика,
   мраморный стейк, глянцевые овощи, текстура дерева, мягкие
   тени и общий тёплый свет сверху.
   ============================================================ */

const LOOP = { repeat: Infinity, ease: 'easeInOut' };

/* Блюдо: выезжает и «садится» на стол на своём пороге прокрутки */
function Dish({ p, at, children, float = 5, delay = 0 }) {
  const span = 0.14;
  const opacity = useTransform(p, [at, at + span * 0.6], [0, 1]);
  const scale = useTransform(p, [at, at + span], [0.72, 1]);
  const y = useTransform(p, [at, at + span], [46, 0]);

  return (
    <motion.g style={{ opacity, scale, y, transformOrigin: 'center' }}>
      <motion.g animate={{ y: [0, -4, 0] }} transition={{ duration: float, delay, ...LOOP }}>
        {children}
      </motion.g>
    </motion.g>
  );
}

/* Пар */
function Steam({ p, x, y, n = 3, gap = 22, at = 0 }) {
  const opacity = useTransform(p, [at, at + 0.12], [0, 1]);
  return (
    <motion.g style={{ opacity }}>
      {Array.from({ length: n }).map((_, i) => (
        <motion.path
          key={i}
          d={`M${x + (i - (n - 1) / 2) * gap} ${y} c -10 -18 10 -26 0 -44 c -10 -17 9 -24 1 -38`}
          fill="none"
          stroke="#ffffff"
          strokeWidth="5"
          strokeLinecap="round"
          style={{ filter: 'blur(4px)' }}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1, 1], opacity: [0, 0.4, 0], y: [10, -32] }}
          transition={{ duration: 3.6, repeat: Infinity, delay: i * 0.8, ease: 'easeOut' }}
        />
      ))}
    </motion.g>
  );
}

/* Керамическая тарелка: контактная тень → толщина борта → глазурь
   → углубление с мягкой внутренней тенью → блик по кромке */
function Plate({ cx, cy, r, ry, children, dark = false }) {
  const rim = dark ? 'url(#glazeD)' : 'url(#glaze)';
  const well = dark ? 'url(#wellD)' : 'url(#well)';
  return (
    <g>
      <ellipse cx={cx} cy={cy + r * 0.1} rx={r * 1.05} ry={ry * 1.05} fill="#000" opacity="0.4" filter="url(#soft)" />
      {/* толщина борта */}
      <ellipse cx={cx} cy={cy + r * 0.035} rx={r} ry={ry} fill={dark ? '#090c0e' : '#7c8a86'} />
      {/* глазурованный борт */}
      <ellipse cx={cx} cy={cy} rx={r} ry={ry} fill={rim} />
      <ellipse cx={cx} cy={cy} rx={r} ry={ry} fill="none" stroke="#ffffff" strokeOpacity={dark ? 0.14 : 0.6} strokeWidth={r * 0.012} />
      {/* переход к углублению — тень */}
      <ellipse cx={cx} cy={cy} rx={r * 0.78} ry={ry * 0.78} fill="#000" opacity="0.22" filter="url(#soft2)" />
      {/* дно */}
      <ellipse cx={cx} cy={cy - ry * 0.015} rx={r * 0.74} ry={ry * 0.74} fill={well} />
      {/* глянцевый серп-блик */}
      <path
        d={`M ${cx - r * 0.7} ${cy - ry * 0.26} a ${r} ${ry} 0 0 1 ${r * 0.52} ${-ry * 0.58}`}
        fill="none"
        stroke="#fff"
        strokeOpacity={dark ? 0.28 : 0.85}
        strokeWidth={r * 0.028}
        strokeLinecap="round"
      />
      <g transform={`translate(${cx} ${cy}) scale(1 ${ry / r})`}>{children}</g>
    </g>
  );
}

/* глянцевый шарик — помидор/картофель/виноград */
function Ball({ cx, cy, r, base, hi = '#ffffff', shadow = true }) {
  return (
    <g>
      {shadow && <ellipse cx={cx} cy={cy + r * 0.85} rx={r * 0.95} ry={r * 0.34} fill="#000" opacity="0.3" filter="url(#soft2)" />}
      <circle cx={cx} cy={cy} r={r} fill={base} />
      <circle cx={cx} cy={cy} r={r} fill="url(#sphere)" />
      <ellipse cx={cx - r * 0.32} cy={cy - r * 0.36} rx={r * 0.34} ry={r * 0.24} fill={hi} opacity="0.75" />
      <circle cx={cx - r * 0.18} cy={cy - r * 0.22} r={r * 0.1} fill="#fff" opacity="0.9" />
    </g>
  );
}

export default function FeastTable({ p }) {
  return (
    <svg viewBox="0 0 1000 640" className="feast-svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        {/* дерево */}
        <linearGradient id="wood" x1="0" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#6a4526" />
          <stop offset="50%" stopColor="#4a2e17" />
          <stop offset="100%" stopColor="#301d0d" />
        </linearGradient>
        {/* керамика — светлая */}
        <radialGradient id="glaze" cx="0.4" cy="0.32" r="0.85">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="#e6ece9" />
          <stop offset="100%" stopColor="#b9c6c1" />
        </radialGradient>
        <radialGradient id="well" cx="0.42" cy="0.34" r="0.8">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="70%" stopColor="#eef3f0" />
          <stop offset="100%" stopColor="#cdd8d3" />
        </radialGradient>
        {/* керамика — тёмная */}
        <radialGradient id="glazeD" cx="0.4" cy="0.3" r="0.9">
          <stop offset="0%" stopColor="#3a444b" />
          <stop offset="55%" stopColor="#232a30" />
          <stop offset="100%" stopColor="#0e1215" />
        </radialGradient>
        <radialGradient id="wellD" cx="0.42" cy="0.34" r="0.85">
          <stop offset="0%" stopColor="#2a3238" />
          <stop offset="100%" stopColor="#12171b" />
        </radialGradient>
        {/* шар */}
        <radialGradient id="sphere" cx="0.35" cy="0.3" r="0.85">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.4" />
        </radialGradient>
        {/* доска */}
        <linearGradient id="board" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d09a56" />
          <stop offset="100%" stopColor="#9a6a30" />
        </linearGradient>
        {/* суп */}
        <radialGradient id="soup" cx="0.42" cy="0.36" r="0.72">
          <stop offset="0%" stopColor="#f7c069" />
          <stop offset="65%" stopColor="#e08e30" />
          <stop offset="100%" stopColor="#b25e1c" />
        </radialGradient>
        {/* стейк */}
        <linearGradient id="crust" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a2c1b" />
          <stop offset="45%" stopColor="#3a1a10" />
          <stop offset="100%" stopColor="#23100a" />
        </linearGradient>
        <linearGradient id="flesh" x1="0" y1="0" x2="1" y2="0.15">
          <stop offset="0%" stopColor="#9e3a33" />
          <stop offset="30%" stopColor="#cf5f56" />
          <stop offset="55%" stopColor="#e07d72" />
          <stop offset="80%" stopColor="#cf5f56" />
          <stop offset="100%" stopColor="#a03a33" />
        </linearGradient>
        {/* хлеб */}
        <linearGradient id="breadg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8b878" />
          <stop offset="100%" stopColor="#b07c3f" />
        </linearGradient>
        {/* картофель */}
        <radialGradient id="potato" cx="0.4" cy="0.32" r="0.85">
          <stop offset="0%" stopColor="#e6b56a" />
          <stop offset="60%" stopColor="#c68a3e" />
          <stop offset="100%" stopColor="#8f5d24" />
        </radialGradient>
        {/* свет сверху */}
        <radialGradient id="toplight" cx="0.5" cy="0.42" r="0.62">
          <stop offset="0%" stopColor="#ffe2ac" stopOpacity="0.28" />
          <stop offset="55%" stopColor="#ffd79a" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#ffd79a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="vig" cx="0.5" cy="0.48" r="0.72">
          <stop offset="46%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.68" />
        </radialGradient>
        <filter id="soft" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
        <filter id="soft2" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      {/* ---------- СТОЛ ---------- */}
      <rect width="1000" height="640" fill="url(#wood)" />
      {/* швы досок */}
      {[128, 256, 384, 512, 640, 768, 896].map((x) => (
        <g key={x}>
          <rect x={x} y="0" width="2.5" height="640" fill="#000" opacity="0.3" />
          <rect x={x + 2.5} y="0" width="2" height="640" fill="#fff" opacity="0.05" />
        </g>
      ))}
      {/* волокна дерева */}
      {[26, 70, 150, 210, 300, 360, 450, 520, 600].map((y, i) => (
        <path
          key={y}
          d={`M0 ${y} q 250 ${i % 2 ? 10 : -10} 500 ${i % 2 ? 4 : -4} q 250 ${i % 2 ? -8 : 8} 500 0`}
          stroke="#000"
          strokeOpacity="0.1"
          strokeWidth={1 + (i % 3)}
          fill="none"
        />
      ))}
      <ellipse cx="500" cy="290" rx="560" ry="400" fill="url(#toplight)" />

      {/* =======================================================
          ВОЛНА 0 — стейк, хлеб, бокалы, приборы
          ======================================================= */}
      <Dish p={p} at={0} float={6}>
        {/* разделочная доска */}
        <ellipse cx="510" cy="452" rx="182" ry="30" fill="#000" opacity="0.4" filter="url(#soft)" />
        <rect x="336" y="268" width="348" height="182" rx="18" fill="#7c5024" />
        <rect x="336" y="264" width="348" height="182" rx="18" fill="url(#board)" />
        <rect x="336" y="264" width="348" height="10" rx="5" fill="#fff" opacity="0.22" />
        {/* прожилки доски */}
        {[300, 340, 380, 420].map((yy) => (
          <path key={yy} d={`M348 ${yy} q170 6 324 0`} stroke="#7a4e22" strokeWidth="1.5" opacity="0.5" fill="none" />
        ))}
        <circle cx="360" cy="428" r="7" fill="#000" opacity="0.25" />

        {/* стейк — ломти веером с мраморностью, соком и корочкой */}
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <g key={i} transform={`translate(${380 + i * 38} 300) rotate(${-9 + i * 1.4})`}>
            <ellipse cx="6" cy="99" rx="30" ry="9" fill="#000" opacity="0.42" filter="url(#soft2)" />
            {/* корочка */}
            <rect x="-25" y="0" width="51" height="97" rx="13" fill="url(#crust)" />
            {/* мясо */}
            <rect x="-17" y="9" width="36" height="79" rx="10" fill="url(#flesh)" />
            {/* мраморность */}
            <path d="M-12 24 q10 8 24 2 M-10 44 q12 6 22 0 M-8 64 q10 6 20 -2" stroke="#f0a89f" strokeWidth="1.6" opacity="0.55" fill="none" strokeLinecap="round" />
            {/* сочный блик */}
            <ellipse cx="-1" cy="30" rx="6" ry="15" fill="#fff" opacity="0.16" />
            {/* обугленная кромка сверху */}
            <rect x="-25" y="0" width="51" height="11" rx="5" fill="#1c0b07" />
            <path d="M-25 4 q25 5 51 0" stroke="#000" strokeWidth="2" opacity="0.4" fill="none" />
            <circle cx="12" cy="86" r="2.4" fill="#7a2a1e" opacity="0.85" />
          </g>
        ))}

        {/* розмарин */}
        <path d="M666 300 q -34 30 -60 70" stroke="#3f7d4a" strokeWidth="5" fill="none" strokeLinecap="round" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <path
            key={i}
            d={`M${658 - i * 10} ${310 + i * 13} l -16 -5 M${658 - i * 10} ${310 + i * 13} l -12 10`}
            stroke="#5aa864"
            strokeWidth="3"
            strokeLinecap="round"
          />
        ))}
        {/* черри — глянцевые */}
        <Ball cx={356} cy={292} r={13} base="#d22a24" />
        <Ball cx={384} cy={282} r={13} base="#e03029" />
        <Ball cx={412} cy={290} r={13} base="#cf2f2a" />
        {[356, 384, 412].map((x, i) => (
          <path key={i} d={`M${x} ${282 - i * 0 - 11} l 4 -7`} stroke="#3f7d4a" strokeWidth="2.5" strokeLinecap="round" />
        ))}
        {/* соль */}
        {[[612, 424], [626, 432], [600, 436], [642, 420], [590, 420], [636, 438]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="1.8" fill="#fff" opacity="0.8" />
        ))}
      </Dish>
      <Steam p={p} x={500} y={272} n={4} gap={40} at={0.02} />

      {/* хлеб */}
      <Dish p={p} at={0.04} float={5.6} delay={0.4}>
        {[[452, 566], [500, 578], [548, 566]].map(([x, y], i) => (
          <g key={i} transform={`rotate(${i * 12 - 12} ${x} ${y})`}>
            <ellipse cx={x} cy={y + 10} rx="44" ry="15" fill="#000" opacity="0.36" filter="url(#soft2)" />
            <ellipse cx={x} cy={y} rx="44" ry="27" fill="#a8763c" />
            <ellipse cx={x} cy={y - 4} rx="38" ry="22" fill="url(#breadg)" />
            <path d={`M${x - 24} ${y - 7} q 24 -11 48 0`} stroke="#9a6529" strokeWidth="3" fill="none" strokeLinecap="round" />
            <ellipse cx={x - 9} cy={y - 11} rx="12" ry="5" fill="#fff" opacity="0.22" />
          </g>
        ))}
      </Dish>

      {/* бокалы */}
      <Dish p={p} at={0.05} float={6.8} delay={0.2}>
        {[[430, 86, '#7d1f36'], [508, 72, '#c9b45f']].map(([x, y, c], i) => (
          <g key={i}>
            <ellipse cx={x} cy={y + 10} rx="36" ry="12" fill="#000" opacity="0.32" filter="url(#soft2)" />
            <circle cx={x} cy={y} r="35" fill="#e6eef0" opacity="0.14" stroke="#fff" strokeOpacity="0.45" />
            <circle cx={x} cy={y} r="26" fill={c} opacity="0.9" />
            <circle cx={x} cy={y} r="26" fill="url(#sphere)" opacity="0.6" />
            <ellipse cx={x - 11} cy={y - 12} rx="9" ry="6" fill="#fff" opacity="0.5" />
            <path d={`M${x - 25} ${y - 8} a 26 26 0 0 1 10 -16`} stroke="#fff" strokeOpacity="0.4" strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>
        ))}
      </Dish>

      {/* =======================================================
          ВОЛНА 1 — супы, салаты, морепродукты, сыры
          ======================================================= */}
      <Dish p={p} at={0.12} float={5} delay={0.3}>
        <Plate cx={150} cy={128} r={94} ry={80}>
          <circle r="60" fill="#000" opacity="0.22" />
          <circle r="56" fill="url(#soup)" />
          <ellipse cx="-16" cy="-22" rx="22" ry="10" fill="#fff" opacity="0.22" />
          {/* овощи в супе */}
          <Ball cx={14} cy={12} r={7} base="#3f8d4a" shadow={false} />
          <Ball cx={-10} cy={24} r={6} base="#7fbf5e" shadow={false} />
          <Ball cx={24} cy={-12} r={5.5} base="#e0772a" shadow={false} />
          <ellipse cx="-24" cy="16" rx="10" ry="4.5" fill="#f0c070" />
          <path d="M-30 -6 q10 4 20 -2" stroke="#2f6b3a" strokeWidth="2" opacity="0.6" fill="none" />
        </Plate>
      </Dish>
      <Steam p={p} x={150} y={92} n={3} gap={24} at={0.16} />

      {/* капрезе */}
      <Dish p={p} at={0.16} float={5.6} delay={0.6}>
        <Plate cx={152} cy={402} r={112} ry={94} dark>
          {[-52, -18, 16, 50].map((x, i) => (
            <g key={x}>
              <ellipse cx={x} cy={i % 2 ? 8 : -8} rx="27" ry="25" fill="#f7f4e8" />
              <ellipse cx={x} cy={i % 2 ? 8 : -8} rx="27" ry="25" fill="url(#sphere)" opacity="0.5" />
              <ellipse cx={x - 7} cy={(i % 2 ? 8 : -8) - 7} rx="9" ry="7" fill="#fff" opacity="0.8" />
              <ellipse cx={x + 12} cy={i % 2 ? -6 : 10} rx="23" ry="21" fill="#cf3430" />
              <ellipse cx={x + 12} cy={i % 2 ? -6 : 10} rx="23" ry="21" fill="url(#sphere)" opacity="0.55" />
            </g>
          ))}
          <path d="M-42 26 q 26 -18 44 2 q 22 -20 42 0" stroke="#3f7d4a" strokeWidth="7" fill="none" strokeLinecap="round" />
          <ellipse cx="-30" cy="-26" rx="16" ry="9" fill="#57a664" transform="rotate(-20 -30 -26)" />
          <ellipse cx="34" cy="30" rx="14" ry="8" fill="#57a664" transform="rotate(15 34 30)" />
          {/* капли масла */}
          <circle cx="-8" cy="34" r="3" fill="#c9a038" opacity="0.7" />
        </Plate>
      </Dish>

      {/* креветки */}
      <Dish p={p} at={0.2} float={5.2} delay={0.9}>
        <Plate cx={852} cy={136} r={106} ry={90} dark>
          {[[-40, -18], [4, -30], [44, -8], [-22, 26], [26, 32]].map(([x, y], i) => (
            <g key={i} transform={`translate(${x} ${y}) rotate(${i * 40 - 30})`}>
              <path d="M-18 0 a 18 18 0 1 1 22 16 q -10 4 -16 -4" fill="#f0904f" />
              <path d="M-18 0 a 18 18 0 1 1 22 16 q -10 4 -16 -4" fill="url(#sphere)" opacity="0.4" />
              <path d="M-14 0 a 14 14 0 1 1 17 12" fill="none" stroke="#c9622c" strokeWidth="2.5" />
              <circle cx="-16" cy="-6" r="2" fill="#4a1f10" />
            </g>
          ))}
          <path d="M-58 40 l 20 -6 M-50 46 l 22 -4" stroke="#57a664" strokeWidth="3" strokeLinecap="round" />
          <path d="M52 -42 l 20 11 l -13 15 z" fill="#f2d24a" />
        </Plate>
      </Dish>

      {/* сырно-мясная доска */}
      <Dish p={p} at={0.24} float={6.2} delay={1.2}>
        <circle cx="842" cy="442" r="118" fill="#000" opacity="0.42" filter="url(#soft)" />
        <circle cx="842" cy="430" r="118" fill="#8a5a2b" />
        <circle cx="842" cy="430" r="118" fill="url(#board)" opacity="0.72" />
        <circle cx="842" cy="430" r="112" fill="none" stroke="#000" strokeOpacity="0.16" strokeWidth="2" />
        <path d="M774 386 l 56 -16 l 10 42 z" fill="#f0d786" />
        <path d="M774 386 l 56 -16 l 2 8 l -54 16 z" fill="#fbeeb8" />
        <rect x="842" y="372" width="44" height="34" rx="4" fill="#f6e6a8" transform="rotate(12 864 389)" />
        <circle cx="804" cy="452" r="7" fill="#fffdf2" />
        <circle cx="822" cy="470" r="6" fill="#fffdf2" />
        <path d="M884 440 q 34 -12 46 16 q -30 22 -54 4 z" fill="#d4655f" />
        <path d="M890 446 q 28 -8 36 12" stroke="#f3aca6" strokeWidth="4" fill="none" />
        <path d="M866 480 q 30 -10 44 12 q -26 20 -50 2 z" fill="#c9544e" />
        {[[794, 496], [810, 504], [826, 496], [802, 512], [818, 514]].map(([x, y], i) => (
          <Ball key={i} cx={x} cy={y} r={9} base="#5a3570" />
        ))}
        <circle cx="870" cy="416" r="20" fill="#2a2118" />
        <circle cx="870" cy="414" r="16" fill="#e0a53a" />
        <circle cx="864" cy="408" r="4" fill="#fff" opacity="0.55" />
      </Dish>

      {/* =======================================================
          ВОЛНА 2 — банкет: плов, рыба, фри, устрицы, шашлык
          ======================================================= */}
      <Dish p={p} at={0.34} float={5.4} delay={0.2}>
        <Plate cx={330} cy={110} r={88} ry={74} dark>
          <circle r="56" fill="#000" opacity="0.2" />
          <circle r="53" fill="#d9a04a" />
          <circle r="53" fill="url(#sphere)" opacity="0.35" />
          {[[-20, -14], [10, -22], [26, 4], [-6, 18], [-30, 10], [16, 24]].map(([x, y], i) => (
            <ellipse key={i} cx={x} cy={y} rx="10" ry="7" fill={i % 2 ? '#8c4a2a' : '#b5652f'} />
          ))}
          {[[-34, -4], [4, -6], [30, -12], [-14, 30]].map(([x, y], i) => (
            <ellipse key={i} cx={x} cy={y} rx="9" ry="4" fill="#e8892f" />
          ))}
          <Ball cx={20} cy={-4} r={5} base="#57a664" shadow={false} />
          <Ball cx={-24} cy={22} r={4} base="#57a664" shadow={false} />
        </Plate>
      </Dish>
      <Steam p={p} x={330} y={78} n={3} gap={22} at={0.38} />

      {/* рыба */}
      <Dish p={p} at={0.38} float={5.8} delay={0.5}>
        <Plate cx={676} cy={122} r={98} ry={74}>
          <ellipse cx="0" cy="6" rx="62" ry="26" fill="#e8dfc8" />
          <path d="M-58 0 q 30 -28 62 -2 q 20 14 -2 20 q -34 16 -60 -6 z" fill="#dccfad" />
          <path d="M-58 0 q 30 -28 62 -2" fill="none" stroke="#b8a682" strokeWidth="2" />
          <ellipse cx="-20" cy="-8" rx="18" ry="6" fill="#fff" opacity="0.4" />
          <path d="M46 -4 l 20 -12 l -2 26 z" fill="#cbbd97" />
          {[-36, -18, 0, 18].map((x) => (
            <path key={x} d={`M${x} -12 q 6 12 0 24`} stroke="#a89572" strokeWidth="2" fill="none" />
          ))}
          {[[-44, 26], [-16, 30], [14, 28], [42, 24]].map(([x, y], i) => (
            <rect key={i} x={x} y={y} width="26" height="7" rx="3.5" fill="#5aa05e" transform={`rotate(${i * 8 - 12} ${x} ${y})`} />
          ))}
          <Ball cx={30} cy={-18} r={7} base="#cf3430" shadow={false} />
          <Ball cx={-46} cy={-14} r={6} base="#cf3430" shadow={false} />
        </Plate>
      </Dish>
      <Steam p={p} x={676} y={92} n={3} gap={26} at={0.42} />

      {/* фри */}
      <Dish p={p} at={0.42} float={5} delay={0.8}>
        <circle cx="122" cy="256" r="62" fill="#000" opacity="0.4" filter="url(#soft)" />
        <circle cx="122" cy="248" r="60" fill="url(#glazeD)" />
        <circle cx="122" cy="248" r="52" fill="#1a2025" />
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <g key={i} transform={`rotate(${i * 23 - 60} ${105 + (i % 3) * 16} 240)`}>
            <rect x={100 + (i % 3) * 16} y={214 + Math.floor(i / 3) * 12} width="10" height="46" rx="4" fill={i % 2 ? '#f0b756' : '#e5a53f'} />
            <rect x={100 + (i % 3) * 16} y={214 + Math.floor(i / 3) * 12} width="4" height="46" rx="2" fill="#fff" opacity="0.25" />
          </g>
        ))}
      </Dish>

      {/* устрицы */}
      <Dish p={p} at={0.46} float={6} delay={0.3}>
        <ellipse cx="874" cy="284" rx="92" ry="66" fill="#000" opacity="0.4" filter="url(#soft)" />
        <ellipse cx="874" cy="274" rx="90" ry="64" fill="url(#glazeD)" />
        <ellipse cx="874" cy="274" rx="82" ry="56" fill="#c9dbe4" opacity="0.32" />
        {[[840, 250], [900, 246], [860, 292], [916, 288], [874, 268]].map(([x, y], i) => (
          <g key={i} transform={`rotate(${i * 30 - 40} ${x} ${y})`}>
            <ellipse cx={x} cy={y} rx="21" ry="16" fill="#b8bfae" />
            <ellipse cx={x} cy={y} rx="16" ry="11" fill="#e8ead9" />
            <ellipse cx={x} cy={y} rx="12" ry="8" fill="#cfd8c9" />
            <ellipse cx={x - 3} cy={y - 2} rx="5" ry="3" fill="#fff" opacity="0.6" />
          </g>
        ))}
        <Ball cx={874} cy={316} r={12} base="#cf3430" />
      </Dish>

      {/* шашлык */}
      <Dish p={p} at={0.5} float={5.6} delay={0.6}>
        <rect x="382" y="486" width="248" height="96" rx="14" fill="#000" opacity="0.4" filter="url(#soft)" />
        <rect x="382" y="478" width="248" height="96" rx="14" fill="url(#glazeD)" />
        {[0, 1].map((row) => (
          <g key={row}>
            <rect x="396" y={500 + row * 40} width="220" height="4" rx="2" fill="#9aa6ad" />
            {[0, 1, 2, 3].map((i) => (
              <g key={i}>
                <rect x={404 + i * 52} y={490 + row * 40} width="42" height="24" rx="9" fill={i % 2 ? '#7d3d21' : '#8f4a26'} />
                <rect x={404 + i * 52} y={490 + row * 40} width="42" height="8" rx="4" fill="#4d2312" />
                <ellipse cx={416 + i * 52} cy={498 + row * 40} rx="8" ry="3" fill="#fff" opacity="0.14" />
              </g>
            ))}
          </g>
        ))}
      </Dish>
      <Steam p={p} x={506} y={470} n={4} gap={40} at={0.54} />

      {/* соусники */}
      <Dish p={p} at={0.54} float={4.6} delay={0.9}>
        {[[700, 236, '#c23a2c'], [742, 214, '#4d7c2e'], [716, 190, '#e0a53a']].map(([x, y, c], i) => (
          <g key={i}>
            <circle cx={x} cy={y + 5} r="26" fill="#000" opacity="0.35" filter="url(#soft2)" />
            <circle cx={x} cy={y} r="26" fill="url(#glaze)" />
            <circle cx={x} cy={y} r="20" fill={c} />
            <circle cx={x} cy={y} r="20" fill="url(#sphere)" opacity="0.4" />
            <ellipse cx={x - 6} cy={y - 7} rx="6" ry="3.5" fill="#fff" opacity="0.45" />
          </g>
        ))}
      </Dish>

      {/* фрукты */}
      <Dish p={p} at={0.58} float={6.4} delay={0.4}>
        <ellipse cx="252" cy="580" rx="76" ry="52" fill="#000" opacity="0.38" filter="url(#soft)" />
        <ellipse cx="252" cy="570" rx="74" ry="50" fill="#a8752f" />
        <ellipse cx="252" cy="566" rx="66" ry="43" fill="url(#board)" opacity="0.85" />
        <Ball cx={224} cy={552} r={14} base="#cf3430" />
        <Ball cx={258} cy={546} r={14} base="#e8892f" />
        <Ball cx={286} cy={560} r={14} base="#5a3570" />
        <Ball cx={236} cy={578} r={14} base="#7fbf5e" />
        <Ball cx={272} cy={582} r={14} base="#cf3430" />
      </Dish>

      {/* перечница/солонка */}
      <Dish p={p} at={0.6} float={5} delay={0.2}>
        <ellipse cx="700" cy="576" rx="20" ry="16" fill="#000" opacity="0.35" filter="url(#soft2)" />
        <rect x="686" y="530" width="28" height="46" rx="11" fill="#5c4029" />
        <rect x="688" y="530" width="8" height="46" rx="4" fill="#fff" opacity="0.12" />
        <rect x="690" y="522" width="20" height="12" rx="5" fill="#8d9aa3" />
        <ellipse cx="748" cy="572" rx="16" ry="13" fill="#000" opacity="0.3" filter="url(#soft2)" />
        <rect x="736" y="540" width="24" height="34" rx="10" fill="url(#glaze)" />
        <rect x="740" y="533" width="16" height="10" rx="4" fill="#8d9aa3" />
      </Dish>

      {/* приборы */}
      <Dish p={p} at={0.08} float={0}>
        <g opacity="0.92">
          <rect x="296" y="502" width="7" height="88" rx="3.5" fill="#c2cdd3" transform="rotate(8 300 545)" />
          <rect x="290" y="492" width="4" height="26" rx="2" fill="#c2cdd3" transform="rotate(8 292 502)" />
          <rect x="298" y="491" width="4" height="26" rx="2" fill="#c2cdd3" transform="rotate(8 300 502)" />
          <rect x="306" y="490" width="4" height="26" rx="2" fill="#c2cdd3" transform="rotate(8 308 502)" />
          <path d="M700 492 q 12 2 12 20 v 34 h -9 v -34 q 0 -18 -3 -20 z" fill="#d2dce1" transform="rotate(-6 706 530)" />
          <rect x="700" y="546" width="9" height="42" rx="4" fill="#5c6b73" transform="rotate(-6 704 567)" />
        </g>
      </Dish>

      <rect width="1000" height="640" fill="url(#vig)" />
    </svg>
  );
}
