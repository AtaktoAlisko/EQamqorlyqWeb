import { motion, useTransform } from 'framer-motion';

/* ============================================================
   Накрытый стол — РЕАЛЬНОЕ ФОТО, которое накрывается по скроллу.

   Приём: под фото лежит его же затемнённая копия («пустой» тёмный
   стол), а сверху — яркое фото, видимое сквозь маску из растущих
   кругов. Каждый круг привязан к тарелке и «раскрывается» на своём
   пороге прокрутки — блюда с настоящей едой проявляются по одному,
   как будто стол накрывают. Фотореализм + анимация сборки.
   ============================================================ */

const W = 1000;
const H = 634;

/* центры тарелок (в координатах viewBox) и порог их появления */
const PLATES = [
  { x: 800, y: 115, r: 175, at: 0.04 }, // правый верх — мясо
  { x: 330, y: 95, r: 165, at: 0.09 }, // центр-верх — мясо
  { x: 180, y: 130, r: 160, at: 0.14 }, // левый верх — салат
  { x: 780, y: 300, r: 185, at: 0.19 }, // правый центр — мясо с картофелем (герой)
  { x: 430, y: 235, r: 165, at: 0.24 }, // центр — корзина с хлебом
  { x: 545, y: 95, r: 160, at: 0.29 }, // центр-верх — салат
  { x: 110, y: 320, r: 165, at: 0.34 }, // левый центр — салат
  { x: 960, y: 300, r: 165, at: 0.38 }, // дальний правый — мясо
  { x: 440, y: 370, r: 150, at: 0.42 }, // центр — графин
  { x: 125, y: 490, r: 165, at: 0.46 }, // низ слева — мясо
  { x: 410, y: 525, r: 160, at: 0.5 }, // низ центр — салат
  { x: 570, y: 525, r: 160, at: 0.54 }, // низ центр — салат
  { x: 885, y: 525, r: 170, at: 0.58 }, // низ справа — хлеб
];

function RevealCircle({ plate, p }) {
  const r = useTransform(p, [plate.at, plate.at + 0.16], [0, plate.r]);
  return <motion.circle cx={plate.x} cy={plate.y} r={r} fill="#fff" />;
}

export default function FeastReveal({ p }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="feast-svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        <mask id="serve">
          <rect width={W} height={H} fill="#000" />
          {PLATES.map((pl, i) => (
            <RevealCircle key={i} plate={pl} p={p} />
          ))}
        </mask>
        {/* тёплый свет сверху и виньетка */}
        <radialGradient id="rvlight" cx="0.5" cy="0.42" r="0.6">
          <stop offset="0%" stopColor="#ffe2ac" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#ffd79a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="rvvig" cx="0.5" cy="0.5" r="0.72">
          <stop offset="52%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.6" />
        </radialGradient>
      </defs>

      {/* «пустой» тёмный стол — та же фотография, сильно затемнённая */}
      <image
        href="/food.jpg"
        x="0"
        y="0"
        width={W}
        height={H}
        preserveAspectRatio="xMidYMid slice"
      />
      <rect width={W} height={H} fill="#05070c" opacity="0.82" />

      {/* яркое фото проявляется сквозь растущие круги-тарелки */}
      <g mask="url(#serve)">
        <image
          href="/food.jpg"
          x="0"
          y="0"
          width={W}
          height={H}
          preserveAspectRatio="xMidYMid slice"
        />
        <rect width={W} height={H} fill="url(#rvlight)" />
      </g>

      <rect width={W} height={H} fill="url(#rvvig)" />
    </svg>
  );
}
