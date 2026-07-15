import { motion, useTransform } from 'framer-motion';

/* ============================================================
   Векторные сцены процессов. Собираются ПО СКРОЛЛУ:
   каждый элемент «прилетает» на своём пороге прогресса —
   стол накрывается, кухня запускается, фура выезжает.
   ============================================================ */

const A = 'rgb(var(--a))';
const A2 = 'rgb(var(--a2))';
const A3 = 'rgb(var(--a3))';
const VB = '0 0 420 300';
const LOOP = { repeat: Infinity, ease: 'easeInOut' };

/* элемент сцены: появляется на своём пороге и потом мягко «дышит» */
function Step({ p, at, span = 0.16, children, float = 0, delay = 0, from = 26 }) {
  const opacity = useTransform(p, [at, at + span * 0.55], [0, 1]);
  const scale = useTransform(p, [at, at + span], [0.72, 1]);
  const y = useTransform(p, [at, at + span], [from, 0]);

  return (
    <motion.g style={{ opacity, scale, y, transformOrigin: 'center' }}>
      {float ? (
        <motion.g animate={{ y: [0, -4, 0] }} transition={{ duration: float, delay, ...LOOP }}>
          {children}
        </motion.g>
      ) : (
        children
      )}
    </motion.g>
  );
}

/* пар: включается на своём пороге */
function Steam({ p, at = 0, x = 210, y = 120, n = 3, spread = 26 }) {
  const opacity = useTransform(p, [at, at + 0.1], [0, 1]);
  return (
    <motion.g style={{ opacity }}>
      {Array.from({ length: n }).map((_, i) => {
        const sx = x + (i - (n - 1) / 2) * spread;
        return (
          <motion.path
            key={i}
            d={`M ${sx} ${y} c -9 -14 9 -22 0 -36 c -9 -14 8 -20 1 -32`}
            fill="none"
            stroke={A}
            strokeWidth="3"
            strokeLinecap="round"
            style={{ filter: 'blur(1px)' }}
            initial={{ pathLength: 0, opacity: 0, y: 8 }}
            animate={{ pathLength: [0, 1, 1], opacity: [0, 0.55, 0], y: [8, -20] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.7, ease: 'easeOut' }}
          />
        );
      })}
    </motion.g>
  );
}

function Glow() {
  return (
    <>
      <defs>
        <radialGradient id="sglow">
          <stop offset="0%" style={{ stopColor: A, stopOpacity: 0.22 }} />
          <stop offset="100%" style={{ stopColor: A, stopOpacity: 0 }} />
        </radialGradient>
        <filter id="ssoft" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>
      <circle cx="210" cy="180" r="150" fill="url(#sglow)" />
    </>
  );
}

/* ============================================================
   1 — СТОЛ НАКРЫВАЕТСЯ: посуда прилетает по одной
   ============================================================ */
export function SceneTable({ p }) {
  return (
    <svg viewBox={VB} className="sv">
      <defs>
        <linearGradient id="tbl" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.13" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.03" />
        </linearGradient>
        <linearGradient id="plate" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#c9d6d2" stopOpacity="0.75" />
        </linearGradient>
        <linearGradient id="soup" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f0a94b" />
          <stop offset="100%" stopColor="#d4722c" />
        </linearGradient>
        <linearGradient id="metal" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#e8eef1" />
          <stop offset="50%" stopColor="#9fb0b8" />
          <stop offset="100%" stopColor="#dfe7ea" />
        </linearGradient>
      </defs>
      <Glow />

      {/* стол — появляется первым */}
      <Step p={p} at={0.02} from={12}>
        <ellipse cx="210" cy="185" rx="192" ry="86" fill="url(#tbl)" stroke="rgba(255,255,255,0.16)" />
        <ellipse cx="210" cy="181" rx="192" ry="86" fill="none" stroke="rgba(255,255,255,0.07)" />
      </Step>

      {/* приборы */}
      <Step p={p} at={0.1}>
        <rect x="46" y="168" width="46" height="30" rx="4" fill="#ffffff" opacity="0.12" />
        <rect x="62" y="150" width="4" height="46" rx="2" fill="url(#metal)" />
        <rect x="57" y="146" width="3" height="12" rx="1.5" fill="url(#metal)" />
        <rect x="62.5" y="146" width="3" height="12" rx="1.5" fill="url(#metal)" />
        <rect x="68" y="146" width="3" height="12" rx="1.5" fill="url(#metal)" />
        <rect x="336" y="168" width="42" height="30" rx="4" fill="#ffffff" opacity="0.12" />
        <path d="M352 146 q8 0 8 12 v20 h-6 v-20 q0 -12 -2 -12 z" fill="url(#metal)" />
        <rect x="352" y="178" width="6" height="20" rx="3" fill="#5c6b73" />
      </Step>

      {/* главная тарелка с супом */}
      <Step p={p} at={0.2} float={5} from={40}>
        <ellipse cx="210" cy="200" rx="88" ry="18" fill="#000" opacity="0.32" filter="url(#ssoft)" />
        <ellipse cx="210" cy="184" rx="84" ry="42" fill="#8f9ea8" opacity="0.55" />
        <ellipse cx="210" cy="180" rx="84" ry="42" fill="url(#plate)" />
        <ellipse cx="210" cy="178" rx="66" ry="32" fill="#ffffff" opacity="0.6" />
        <ellipse cx="210" cy="177" rx="52" ry="24" fill="url(#soup)" />
        <ellipse cx="190" cy="170" rx="13" ry="4.5" fill="#fff" opacity="0.3" />
        <circle cx="222" cy="180" r="3.4" style={{ fill: A }} />
        <circle cx="204" cy="185" r="2.6" style={{ fill: A2 }} />
        <ellipse cx="196" cy="182" rx="5" ry="2.4" fill="#f0a94b" />
        <path d="M140 172 a84 42 0 0 1 46 -33" fill="none" stroke="#fff" strokeOpacity="0.8" strokeWidth="2.5" strokeLinecap="round" />
      </Step>
      <Steam p={p} at={0.34} x={210} y={150} n={3} spread={24} />

      {/* салатник */}
      <Step p={p} at={0.36} float={4.4} delay={0.4} from={44}>
        <ellipse cx="106" cy="150" rx="40" ry="9" fill="#000" opacity="0.25" filter="url(#ssoft)" />
        <path d="M70 122 a36 36 0 0 0 72 0 z" fill="#aebbc2" />
        <path d="M73 124 a33 32 0 0 0 66 0 z" fill="url(#plate)" />
        <ellipse cx="106" cy="122" rx="36" ry="12" fill="#dfe8e5" />
        <ellipse cx="106" cy="122" rx="32" ry="9.5" fill="#3a4a46" opacity="0.35" />
        <ellipse cx="97" cy="121" rx="11" ry="5" style={{ fill: A }} />
        <ellipse cx="115" cy="123" rx="10" ry="4.6" style={{ fill: A2 }} />
        <circle cx="103" cy="119" r="3.4" fill="#e2553f" />
      </Step>

      {/* стакан */}
      <Step p={p} at={0.48} float={5.2} delay={0.8} from={40}>
        <ellipse cx="317" cy="152" rx="20" ry="5" fill="#000" opacity="0.22" filter="url(#ssoft)" />
        <path d="M300 96 h34 l-4 54 h-26 z" fill="#ffffff" opacity="0.1" stroke="rgba(255,255,255,0.35)" />
        <path d="M303 116 h28 l-3 34 h-22 z" style={{ fill: A3 }} opacity="0.45" />
        <ellipse cx="317" cy="116" rx="14" ry="3" style={{ fill: A3 }} opacity="0.75" />
        <rect x="305" y="102" width="3" height="42" rx="1.5" fill="#fff" opacity="0.4" />
      </Step>

      {/* хлеб */}
      <Step p={p} at={0.58} float={4.8} delay={1.2} from={36}>
        <ellipse cx="330" cy="196" rx="26" ry="6" fill="#000" opacity="0.24" filter="url(#ssoft)" />
        <path d="M306 190 q22 -24 46 0 z" fill="#c98d4a" />
        <path d="M309 189 q20 -20 40 0 z" fill="#e2ad6a" />
        <path d="M314 184 q16 -11 30 0" fill="none" stroke="#a86f33" strokeWidth="2" strokeLinecap="round" />
      </Step>

      {/* финальный штрих: «подано» */}
      <Step p={p} at={0.7} float={4}>
        <rect x="146" y="248" width="128" height="30" rx="15" fill="#0d141d" opacity="0.8" stroke="rgba(255,255,255,0.16)" />
        <circle cx="166" cy="263" r="4" style={{ fill: A }} />
        <text x="180" y="268" fill="#eaf2ef" fontSize="13" fontWeight="700" fontFamily="Manrope, sans-serif">
          Обед подан
        </text>
      </Step>
    </svg>
  );
}

/* ============================================================
   2 — КУХНЯ ЗАПУСКАЕТСЯ
   ============================================================ */
export function SceneCook({ p }) {
  const fire = useTransform(p, [0.34, 0.46], [0, 1]);
  return (
    <svg viewBox={VB} className="sv">
      <defs>
        <linearGradient id="pan" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a565e" />
          <stop offset="100%" stopColor="#20272d" />
        </linearGradient>
        <linearGradient id="stove" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.03" />
        </linearGradient>
        <radialGradient id="fireg">
          <stop offset="0%" stopColor="#fff3c4" />
          <stop offset="55%" stopColor="#ffab3d" />
          <stop offset="100%" stopColor="#ff6a2b" stopOpacity="0.1" />
        </radialGradient>
      </defs>
      <Glow />

      {/* плита */}
      <Step p={p} at={0.04} from={16}>
        <rect x="90" y="196" width="240" height="62" rx="14" fill="url(#stove)" stroke="rgba(255,255,255,0.14)" />
        <circle cx="126" cy="240" r="8" fill="#ffffff" opacity="0.16" />
        <circle cx="152" cy="240" r="8" fill="#ffffff" opacity="0.16" />
        <rect x="176" y="234" width="130" height="12" rx="6" fill="#ffffff" opacity="0.06" />
      </Step>

      {/* сковорода */}
      <Step p={p} at={0.16} from={42}>
        <motion.g
          style={{ transformOrigin: '210px 175px' }}
          animate={{ rotate: [-1.6, 1.6, -1.6], y: [0, -3, 0] }}
          transition={{ duration: 3.2, ...LOOP }}
        >
          <rect x="298" y="160" width="86" height="11" rx="5.5" fill="#2b3238" transform="rotate(-12 298 165)" />
          <path d="M132 160 h156 a8 8 0 0 1 8 8 a86 26 0 0 1 -172 0 a8 8 0 0 1 8 -8 z" fill="url(#pan)" />
          <ellipse cx="210" cy="160" rx="80" ry="24" fill="#39434a" />
          <ellipse cx="210" cy="160" rx="80" ry="24" fill="none" stroke="#78868f" strokeWidth="2" />
          <path d="M148 152 a80 24 0 0 1 40 -14" fill="none" stroke="#fff" strokeOpacity="0.45" strokeWidth="2.5" strokeLinecap="round" />
          <ellipse cx="210" cy="160" rx="72" ry="20" fill="#161c21" />
        </motion.g>
      </Step>

      {/* продукты в сковороде */}
      <Step p={p} at={0.28} from={30}>
        <ellipse cx="210" cy="160" rx="58" ry="15" style={{ fill: A }} opacity="0.32" />
        <circle cx="188" cy="158" r="6" fill="#e2553f" />
        <circle cx="214" cy="164" r="5" style={{ fill: A2 }} />
        <circle cx="236" cy="156" r="5.5" fill="#f0a94b" />
        <circle cx="202" cy="166" r="4" style={{ fill: A }} />
      </Step>

      {/* огонь зажигается */}
      <motion.g style={{ opacity: fire, transformOrigin: '210px 200px' }}>
        <motion.g
          animate={{ scaleY: [1, 1.22, 0.94, 1], opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '210px 200px' }}
        >
          <ellipse cx="210" cy="196" rx="52" ry="18" fill="url(#fireg)" opacity="0.55" />
          <path d="M186 198 q6 -22 14 -12 q4 -20 12 -6 q8 -14 12 4 q8 -6 8 14 z" fill="#ff8a3d" opacity="0.9" />
          <path d="M196 198 q4 -14 10 -8 q4 -12 8 -2 q6 -8 6 10 z" fill="#ffd36b" />
        </motion.g>
        {Array.from({ length: 7 }).map((_, i) => (
          <motion.circle
            key={i}
            cx={180 + i * 12}
            cy={190}
            r="2.5"
            fill="#ffd36b"
            animate={{ cy: [190, 110], opacity: [0, 1, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.22, ease: 'easeOut' }}
          />
        ))}
      </motion.g>

      <Steam p={p} at={0.5} x={210} y={132} n={4} spread={22} />

      {/* контроль температуры */}
      <Step p={p} at={0.66} float={3.6}>
        <rect x="272" y="70" width="114" height="34" rx="10" fill="#0d141d" opacity="0.8" stroke="rgba(255,255,255,0.16)" />
        <motion.circle
          cx="290"
          cy="87"
          r="4"
          style={{ fill: A }}
          animate={{ opacity: [1, 0.25, 1] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        />
        <text x="304" y="92" fill="#eaf2ef" fontSize="14" fontWeight="700" fontFamily="Manrope, sans-serif">
          +82 °C
        </text>
      </Step>
    </svg>
  );
}

/* ============================================================
   3 — ОЧИСТКА И ПОДГОТОВКА
   ============================================================ */
export function ScenePrep({ p }) {
  const chop = useTransform(p, [0.34, 0.44], [0, 1]);
  const water = useTransform(p, [0.6, 0.7], [0, 1]);
  return (
    <svg viewBox={VB} className="sv">
      <defs>
        <linearGradient id="boardg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c99a63" />
          <stop offset="100%" stopColor="#9c713f" />
        </linearGradient>
        <linearGradient id="blade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f2f6f8" />
          <stop offset="60%" stopColor="#aebac2" />
          <stop offset="100%" stopColor="#7c8b95" />
        </linearGradient>
        <linearGradient id="carrot" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#f79445" />
          <stop offset="100%" stopColor="#dd6a1f" />
        </linearGradient>
      </defs>
      <Glow />

      {/* доска */}
      <Step p={p} at={0.04} from={18}>
        <ellipse cx="210" cy="240" rx="140" ry="16" fill="#000" opacity="0.22" filter="url(#ssoft)" />
        <rect x="70" y="176" width="280" height="56" rx="12" fill="url(#boardg)" />
        <rect x="70" y="176" width="280" height="8" rx="4" fill="#ffffff" opacity="0.18" />
        {[196, 208, 220].map((y) => (
          <rect key={y} x="86" y={y} width="248" height="1.5" rx="1" fill="#000" opacity="0.12" />
        ))}
      </Step>

      {/* морковь ложится на доску */}
      <Step p={p} at={0.16} from={34}>
        <path d="M212 178 l52 -6 l-4 12 z" fill="url(#carrot)" />
        <path d="M264 172 l14 -10 M264 176 l16 -2" stroke="#3fa66b" strokeWidth="4" strokeLinecap="round" fill="none" />
      </Step>

      {/* нож прилетает и начинает рубить */}
      <Step p={p} at={0.26} from={-40}>
        <motion.g
          style={{ transformOrigin: '250px 120px', opacity: chop }}
          animate={{ rotate: [-4, -30, -4], y: [0, -6, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: [0.4, 0, 0.2, 1] }}
        >
          <path d="M120 128 h116 q14 0 14 14 v6 h-130 z" fill="url(#blade)" />
          <path d="M120 148 h130 v3 h-130 z" fill="#6b7a84" />
          <rect x="236" y="126" width="52" height="14" rx="7" fill="#2b3238" transform="rotate(6 236 133)" />
        </motion.g>
      </Step>

      {/* кружки нарезки появляются один за другим */}
      {[[128, 0.42], [152, 0.5], [176, 0.58]].map(([cx, at], i) => (
        <Step key={cx} p={p} at={at} from={-14} span={0.08}>
          <ellipse cx={cx} cy="182" rx="13" ry="5.5" fill="url(#carrot)" />
          <ellipse cx={cx} cy="181" rx="7" ry="2.8" fill="#ffb570" opacity="0.8" />
        </Step>
      ))}

      {/* мойка: капли */}
      <motion.g style={{ opacity: water }}>
        {Array.from({ length: 7 }).map((_, i) => (
          <motion.rect
            key={i}
            x={60 + i * 42}
            y="0"
            width="3"
            height="12"
            rx="1.5"
            style={{ fill: A3 }}
            animate={{ y: [20, 170], opacity: [0, 0.9, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.26, ease: 'easeIn' }}
          />
        ))}
      </motion.g>

      {/* чип ХАССП */}
      <Step p={p} at={0.72} float={4}>
        <rect x="272" y="62" width="112" height="32" rx="10" fill="#0d141d" opacity="0.8" stroke="rgba(255,255,255,0.16)" />
        <path d="M288 78 l4 5 l8 -10" fill="none" style={{ stroke: A }} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <text x="308" y="83" fill="#eaf2ef" fontSize="13" fontWeight="700" fontFamily="Manrope, sans-serif">
          ХАССП
        </text>
      </Step>
    </svg>
  );
}

/* ============================================================
   4 — ЛОГИСТИКА: фура выезжает
   ============================================================ */
export function SceneLogistics({ p }) {
  const drive = useTransform(p, [0.28, 0.42], [0, 1]);
  const x = useTransform(p, [0.16, 0.42], [-260, 0]);

  const wheel = (cx) => (
    <motion.g
      key={cx}
      style={{ transformOrigin: `${cx}px 206px` }}
      animate={{ rotate: 360 }}
      transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
    >
      <circle cx={cx} cy="206" r="18" fill="#171d23" stroke="#2f3941" strokeWidth="3" />
      <circle cx={cx} cy="206" r="7" fill="#59666f" />
      <rect x={cx - 1.5} y="192" width="3" height="28" rx="1.5" fill="#8b98a1" opacity="0.6" />
      <rect x={cx - 14} y="204.5" width="28" height="3" rx="1.5" fill="#8b98a1" opacity="0.6" />
    </motion.g>
  );

  return (
    <svg viewBox={VB} className="sv">
      <defs>
        <linearGradient id="bodyg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f4f8fa" />
          <stop offset="100%" stopColor="#c4d0d6" />
        </linearGradient>
        <linearGradient id="cabg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" style={{ stopColor: A }} />
          <stop offset="100%" style={{ stopColor: A3 }} />
        </linearGradient>
      </defs>
      <Glow />

      {/* дорога */}
      <Step p={p} at={0.04} from={10}>
        <rect x="0" y="238" width="420" height="4" rx="2" fill="#ffffff" opacity="0.08" />
      </Step>
      <motion.g style={{ opacity: drive }}>
        {Array.from({ length: 7 }).map((_, i) => (
          <motion.rect
            key={i}
            y="238"
            width="38"
            height="4"
            rx="2"
            style={{ fill: A }}
            opacity="0.7"
            initial={{ x: i * 64 }}
            animate={{ x: [i * 64, i * 64 - 64] }}
            transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
          />
        ))}
      </motion.g>

      {/* фура въезжает в кадр слева */}
      <motion.g style={{ x }}>
        <motion.g
          animate={{ y: [0, -2.5, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ellipse cx="210" cy="228" rx="132" ry="10" fill="#000" opacity="0.34" filter="url(#ssoft)" />
          <rect x="96" y="112" width="164" height="82" rx="8" fill="url(#bodyg)" />
          <rect x="96" y="112" width="164" height="12" rx="6" fill="#ffffff" opacity="0.7" />
          <rect x="96" y="182" width="164" height="12" rx="4" fill="#93a3ab" />
          <rect x="108" y="132" width="140" height="50" rx="5" fill="#dbe4e8" />
          {[124, 148, 172, 196, 220].map((rx) => (
            <rect key={rx} x={rx} y="134" width="1.6" height="46" fill="#b6c3ca" opacity="0.55" />
          ))}
          <rect x="112" y="138" width="44" height="26" rx="5" style={{ fill: A }} opacity="0.22" />
          <path d="M134 142 v18 M126 146 l16 10 M142 146 l-16 10" style={{ stroke: A }} strokeWidth="2.4" strokeLinecap="round" />
          <text x="168" y="160" fill="#4a5f59" fontSize="16" fontWeight="800" fontFamily="Unbounded, sans-serif">
            −18°C
          </text>
          <path d="M262 138 h34 l22 30 v26 h-56 z" fill="url(#cabg)" />
          <path d="M266 144 h26 l16 22 h-42 z" fill="#0d141d" opacity="0.6" />
          <motion.circle
            cx="314"
            cy="180"
            r="5"
            fill="#ffe9a8"
            animate={{ opacity: [0.55, 1, 0.55] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
          {wheel(140)}
          {wheel(196)}
          {wheel(292)}
        </motion.g>
      </motion.g>

      {/* приёмка по накладным */}
      <Step p={p} at={0.66} float={4}>
        <rect x="252" y="60" width="140" height="32" rx="10" fill="#0d141d" opacity="0.8" stroke="rgba(255,255,255,0.16)" />
        <path d="M268 76 l4 5 l8 -10" fill="none" style={{ stroke: A }} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <text x="288" y="81" fill="#eaf2ef" fontSize="12" fontWeight="700" fontFamily="Manrope, sans-serif">
          Приёмка ОК
        </text>
      </Step>
    </svg>
  );
}

/* ============================================================
   5 — ЗАЯВКА: галочки проставляются по скроллу
   ============================================================ */
export function SceneOrder({ p }) {
  const rows = [
    ['Меню на день', 0.3],
    ['Расчёт объёмов', 0.44],
    ['Заявка поставщикам', 0.58],
  ];
  return (
    <svg viewBox={VB} className="sv">
      <defs>
        <linearGradient id="paper" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.97" />
          <stop offset="100%" stopColor="#dde6e3" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="clipg" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" style={{ stopColor: A }} />
          <stop offset="100%" style={{ stopColor: A3 }} />
        </linearGradient>
      </defs>
      <Glow />

      {/* планшет */}
      <Step p={p} at={0.04} float={5.5} from={40}>
        <ellipse cx="210" cy="272" rx="96" ry="12" fill="#000" opacity="0.28" filter="url(#ssoft)" />
        <rect x="112" y="48" width="196" height="222" rx="14" fill="#141a20" />
        <rect x="112" y="42" width="196" height="222" rx="14" fill="#2c3740" />
        <rect x="122" y="66" width="176" height="188" rx="8" fill="url(#paper)" />
        <rect x="176" y="30" width="68" height="24" rx="8" fill="url(#clipg)" />
        <rect x="190" y="36" width="40" height="8" rx="4" fill="#0d141d" opacity="0.35" />
        <text x="140" y="98" fill="#0b1a16" fontSize="13" fontWeight="800" fontFamily="Unbounded, sans-serif">
          ЗАЯВКА
        </text>
        <rect x="140" y="106" width="140" height="1.5" fill="#0b1a16" opacity="0.14" />
      </Step>

      {/* строки чек-листа заполняются одна за другой */}
      {rows.map(([label, at], i) => {
        const y = 130 + i * 40;
        return (
          <Step key={label} p={p} at={at} span={0.1} from={12}>
            <rect x="140" y={y} width="22" height="22" rx="6" fill="#0b1a16" opacity="0.07" />
            <motion.path
              d={`M145 ${y + 11} l5 6 l10 -12`}
              fill="none"
              style={{ stroke: A }}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
            <text x="172" y={y + 16} fill="#243a34" fontSize="12" fontWeight="600" fontFamily="Manrope, sans-serif">
              {label}
            </text>
            <rect x="172" y={y + 22} width="100" height="1.5" rx="1" style={{ fill: A }} opacity="0.5" />
          </Step>
        );
      })}

      {/* QR eQamqorlyq */}
      <Step p={p} at={0.72} float={4.2}>
        <rect x="26" y="150" width="64" height="64" rx="12" fill="#0d141d" opacity="0.85" stroke="rgba(255,255,255,0.16)" />
        {[
          [38, 162], [54, 162], [70, 162],
          [38, 178], [70, 178],
          [38, 194], [54, 194], [70, 194],
        ].map(([qx, qy], i) => (
          <motion.rect
            key={i}
            x={qx}
            y={qy}
            width="10"
            height="10"
            rx="2"
            style={{ fill: A }}
            animate={{ opacity: [0.25, 1, 0.25] }}
            transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.12 }}
          />
        ))}
      </Step>
    </svg>
  );
}

export const SCENES = {
  table: SceneTable,
  cook: SceneCook,
  prep: ScenePrep,
  logistics: SceneLogistics,
  order: SceneOrder,
};
