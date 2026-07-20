import { useRef } from 'react';
import { motion, useInView, useScroll, useSpring, useTransform } from 'framer-motion';
import FeastReveal from './FeastReveal';
import { Counter } from './fx';
import { useLang } from '../i18n';
import { KZ_PINS, TOTAL_OBJECTS } from '../data/kz';

/* ============================================================
   Провал в Астану → накрытый стол.

   Камера падает в точку Астаны сквозь городские огни, круг
   раскрывается — и мы на столе. Дальше по скроллу стол
   постепенно наполняется блюдами: горячее дымится, воздух
   наполняется тёплыми искрами.

   Если в /public лежит food.jpg — показывается фотография,
   иначе рисуется векторная сцена (FeastTable).
   ============================================================ */

/* позиции карточек на столе (текст берётся из перевода по индексу) */
const CARD_POS = [
  { x: '26%', y: '54%', at: 0.5 },
  { x: '74%', y: '52%', at: 0.56 },
  { x: '30%', y: '84%', at: 0.62 },
  { x: '72%', y: '86%', at: 0.68 },
];

function Card({ pos, card, p }) {
  const opacity = useTransform(p, [pos.at, pos.at + 0.06, 0.76, 0.82], [0, 1, 1, 0]);
  const y = useTransform(p, [pos.at, pos.at + 0.08], [24, 0]);
  return (
    <motion.span className="feast-card" style={{ left: pos.x, top: pos.y, opacity, y }}>
      <b>{card.t}</b>
      <i>{card.s}</i>
    </motion.span>
  );
}

export default function Astana() {
  const ref = useRef(null);
  const { t } = useLang();

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 28, restDelta: 0.001 });

  /* тяжёлая векторная сцена стола монтируется только рядом с вьюпортом */
  const near = useInView(ref, { margin: '20% 0px 20% 0px' });

  /* --- фаза 1: падение --- */
  const fallOpacity = useTransform(p, [0, 0.16, 0.24], [1, 1, 0]);
  const fallVis = useTransform(p, (v) => (v > 0.26 ? 'hidden' : 'visible'));
  const cityScale = useTransform(p, [0, 0.24], [1, 9]);
  const cityOpacity = useTransform(p, [0, 0.14, 0.22], [0.9, 0.5, 0]);
  /* фото гаснет раньше огней: на сильном зуме апскейл был бы заметен, дальше падение
     держат только огни и полосы скорости */
  const cityPhotoOpacity = useTransform(p, [0, 0.07, 0.16], [1, 0.82, 0]);

  /* --- фаза 2: круг раскрывается на стол --- */
  const holeR = useTransform(p, [0.05, 0.26], [0, 135]);
  const holeClip = useTransform(holeR, (r) => `circle(${r}% at 50% 50%)`);

  /* --- фаза 3: стол накрывается (блюда прилетают по скроллу) --- */
  const titleOpacity = useTransform(p, [0.24, 0.32, 0.4, 0.46], [0, 1, 1, 0]);
  const finalOpacity = useTransform(p, [0.82, 0.92], [0, 1]);
  const warmth = useTransform(p, [0.28, 0.7], [0, 1]);

  return (
    <section className="astana" id="astana" ref={ref}>
      <div className="astana-sticky">
        {/* ---------- падение сквозь город ---------- */}
        <motion.div className="fall" style={{ opacity: fallOpacity, visibility: fallVis }}>
          {/* реальная Астана с высоты — камера падает прямо в неё */}
          <motion.div className="city-photo" style={{ scale: cityScale, opacity: cityPhotoOpacity }} />
          <span className="city-shade" />

          <motion.div className="city" style={{ scale: cityScale, opacity: cityOpacity }}>
            {Array.from({ length: 46 }).map((_, i) => {
              const a = (i * 137.5 * Math.PI) / 180;
              const r = 6 + (i % 13) * 3.6;
              return (
                <span
                  key={i}
                  className="light"
                  style={{
                    left: `${50 + Math.cos(a) * r}%`,
                    top: `${50 + Math.sin(a) * r * 0.72}%`,
                    animationDelay: `${(i % 7) * 0.3}s`,
                  }}
                />
              );
            })}
          </motion.div>

          {Array.from({ length: 14 }).map((_, i) => (
            <span key={i} className="streak" style={{ left: `${7 + i * 6.6}%`, animationDelay: `${i * 0.09}s` }} />
          ))}

          <div className="fall-copy">
            <motion.div
              className="fall-city"
              initial={{ opacity: 0, letterSpacing: '0.6em' }}
              whileInView={{ opacity: 1, letterSpacing: '0.25em' }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
              {t.astana.city}
            </motion.div>
            <div className="fall-coords">51.13° N · 71.43° E</div>
            <div className="fall-sub">{t.astana.sub}</div>
          </div>
        </motion.div>

        {/* ---------- стол накрывается: анимированная сцена ---------- */}
        <motion.div className="feast" style={{ clipPath: holeClip }}>
          <div className="feast-scene">{near && <FeastReveal p={p} />}</div>

          {/* пар над горячими блюдами — привязан к тарелкам с мясом */}
          <motion.div className="feast-steam" style={{ opacity: warmth }}>
            {[
              { x: '69%', y: '16%', s: 1 }, // манты
              { x: '71%', y: '49%', s: 1.15 }, // бешбармак
              { x: '29%', y: '49%', s: 0.9 }, // плов
            ].map((pl, i) => (
              <span key={i} className="plume" style={{ left: pl.x, top: pl.y, transform: `scale(${pl.s})` }}>
                {[0, 1, 2].map((k) => (
                  <i key={k} style={{ animationDelay: `${i * 0.7 + k * 1.1}s` }} />
                ))}
              </span>
            ))}
          </motion.div>

          {/* тёплый свет усиливается по мере наполнения стола */}
          <motion.span className="feast-warm" style={{ opacity: warmth }} />
          <span className="feast-vig" />

          {/* парящие искры / специи в тёплом воздухе */}
          <motion.div className="embers" style={{ opacity: warmth }}>
            {Array.from({ length: 26 }).map((_, i) => (
              <span
                key={i}
                className="ember"
                style={{
                  left: `${(i * 37) % 100}%`,
                  animationDelay: `${(i % 9) * 0.9}s`,
                  animationDuration: `${7 + (i % 5) * 2.5}s`,
                }}
              />
            ))}
          </motion.div>

          <motion.div className="feast-title" style={{ opacity: titleOpacity }}>
            <span className="eyebrow">
              <span className="dot" /> {t.astana.servedEyebrow}
            </span>
            <h2 className="h2">
              {t.astana.title[0]} <span className="grad">{t.astana.title[1]}</span>
            </h2>
          </motion.div>

          <div className="feast-cards">
            {CARD_POS.map((pos, i) => (
              <Card key={i} pos={pos} card={t.astana.cards[i]} p={p} />
            ))}
          </div>

          {/* финал: стол накрыт полностью */}
          <motion.div className="feast-final" style={{ opacity: finalOpacity }}>
            <h2 className="h2">
              {t.astana.final[0]} <span className="grad">{t.astana.final[1]}</span>
            </h2>
            <div className="feast-stats">
              {[
                { v: 10000, s: '+', l: t.astana.stats[0].l },
                { v: TOTAL_OBJECTS, s: '', l: t.astana.stats[1].l },
                { v: KZ_PINS.length, s: '', l: t.astana.stats[2].l },
              ].map((x) => (
                <div className="feast-stat" key={x.l}>
                  <div className="v grad">
                    <Counter to={x.v} suffix={x.s} />
                  </div>
                  <div className="l">{x.l}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
