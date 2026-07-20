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

/* Центры блюд (в координатах viewBox) и порог их появления.
   Координаты сняты с public/food.jpg: центр блюда в пикселях фото
   пересчитан как v = px * (634/1632) - 9.7 — множитель это масштаб
   «slice» по высоте, вычет — боковой срез, потому что фото шире viewBox.
   При замене фотографии пересчитывать заново, иначе круги будут
   проявлять пустое дерево вместо тарелок. */
const PLATES = [
  // сначала два главных блюда — они держат кадр
  { x: 714, y: 311, r: 150, at: 0.04 }, // бешбармак (герой)
  { x: 291, y: 311, r: 145, at: 0.08 }, // плов
  { x: 500, y: 199, r: 185, at: 0.12 }, // корзина с лепёшкой
  // верхний ряд
  { x: 126, y: 102, r: 160, at: 0.16 }, // казы
  { x: 337, y: 97, r: 150, at: 0.2 }, // баурсаки
  { x: 689, y: 99, r: 150, at: 0.24 }, // манты
  { x: 903, y: 107, r: 155, at: 0.27 }, // салат
  // средний ряд
  { x: 105, y: 316, r: 150, at: 0.31 }, // сорпа
  { x: 936, y: 326, r: 150, at: 0.35 }, // сметана
  { x: 485, y: 357, r: 130, at: 0.38 }, // графин
  // нижний ряд
  { x: 105, y: 515, r: 160, at: 0.42 }, // шашлык
  { x: 332, y: 520, r: 155, at: 0.46 }, // самса
  { x: 526, y: 510, r: 140, at: 0.5 }, // чайник
  { x: 704, y: 515, r: 150, at: 0.54 }, // казы с гранатом
  { x: 920, y: 520, r: 155, at: 0.58 }, // соленья
];

function RevealCircle({ plate, p }) {
  const r = useTransform(p, [plate.at, plate.at + 0.16], [0, plate.r]);
  return <motion.circle cx={plate.x} cy={plate.y} r={r} fill="#fff" />;
}

export default function FeastReveal({ p }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="feast-svg" preserveAspectRatio="xMidYMid slice">
      <defs>
        {/* растушёвка краёв: круги растворяются друг в друге вместо жёстких «дырок» */}
        <filter id="feather" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="34" />
        </filter>
        {/* «пустой» стол — обесцвеченный и приглушённый, а не залитый чёрным */}
        <filter id="cold">
          <feColorMatrix type="saturate" values="0.12" />
          <feComponentTransfer>
            <feFuncR type="linear" slope="0.42" />
            <feFuncG type="linear" slope="0.44" />
            <feFuncB type="linear" slope="0.52" />
          </feComponentTransfer>
        </filter>
        <mask id="serve">
          <rect width={W} height={H} fill="#000" />
          <g filter="url(#feather)">
            {PLATES.map((pl, i) => (
              <RevealCircle key={i} plate={pl} p={p} />
            ))}
          </g>
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

      {/* «пустой» стол — та же фотография, обесцвеченная и притушенная */}
      <g filter="url(#cold)">
        <image
          href="/food.jpg"
          x="0"
          y="0"
          width={W}
          height={H}
          preserveAspectRatio="xMidYMid slice"
        />
      </g>
      <rect width={W} height={H} fill="#05070c" opacity="0.34" />

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
