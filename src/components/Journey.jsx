import { useRef } from 'react';
import { motion, useInView, useScroll, useSpring, useTransform } from 'framer-motion';
import { SCENES } from './scenes';
import { useLang } from '../i18n';

/* ============================================================
   Обратная цепочка: стол → приготовление → очистка →
   логистика → заявка. Листаем вниз — время идёт назад.

   Каждый этап работает как секвенция с Землёй: экран залипает,
   реальный кадр растворяется — и процесс СОБИРАЕТСЯ ПО СКРОЛЛУ.
   Стол накрывается посудой, кухня зажигает огонь, нож начинает
   рубить, фура въезжает в кадр, галочки в заявке проставляются.
   ============================================================ */

const PHOTO = {
  table: '/scenes/table.jpg',
  cook: '/scenes/cook.jpg',
  prep: '/scenes/prep.jpg',
  logistics: '/scenes/logistics.jpg',
  order: '/scenes/order.jpg',
};

/* порядок и ключ сцены/фото — структура одинакова во всех языках,
   текст приходит из перевода по индексу */
const STAGE_KEYS = ['table', 'cook', 'prep', 'logistics', 'order'];

const EASE = [0.22, 1, 0.36, 1];

function Page({ key0, stage, i, total }) {
  const ref = useRef(null);
  const flip = i % 2 === 1;
  const num = String(total - i).padStart(2, '0');
  const Visual = SCENES[key0];

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 28, restDelta: 0.001 });

  /* сцена монтируется, только когда этап рядом с вьюпортом — иначе все пять
     сцен крутили бы десятки бесконечных анимаций одновременно и тормозили */
  const near = useInView(ref, { margin: '20% 0px 20% 0px' });

  /* реальный кадр растворяется в анимированный процесс */
  const photoOpacity = useTransform(p, [0.06, 0.22], [1, 0]);
  const photoScale = useTransform(p, [0, 0.25], [1, 1.14]);
  const sceneOpacity = useTransform(p, [0.12, 0.26], [0, 1]);

  /* текст въезжает в начале этапа */
  const copyOpacity = useTransform(p, [0, 0.08, 0.94, 1], [0, 1, 1, 0.5]);
  const copyY = useTransform(p, [0, 0.1], [40, 0]);

  return (
    <section className={`jrn-page ${flip ? 'flip' : ''}`} ref={ref}>
      <div className="jrn-sticky">
        <motion.span
          className="jrn-ghost"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20%' }}
          transition={{ duration: 1.1, ease: EASE }}
        >
          {num}
        </motion.span>

        <div className="wrap z jrn-page-grid">
          <motion.div className="jrn-copy" style={{ opacity: copyOpacity, y: copyY }}>
            <span className="jrn-time">
              <span className="rew">◀◀</span> {stage.time}
            </span>
            <div className="jrn-step">
              {num} · {stage.step}
            </div>
            <h3 className="jrn-title">{stage.title}</h3>
            <p className="lead">{stage.text}</p>
            <div className="jrn-meta">
              {stage.meta.map((m) => (
                <span className="jrn-chip" key={m}>
                  {m}
                </span>
              ))}
            </div>
          </motion.div>

          <div className="jrn-visual">
            <div className="jrn-stagebox">
              {/* реальный кадр — с него начинается этап */}
              <motion.img
                className="jrn-photo"
                src={PHOTO[key0]}
                alt={stage.title}
                loading="lazy"
                style={{ opacity: photoOpacity, scale: photoScale }}
              />
              <motion.span className="jrn-grade" style={{ opacity: photoOpacity }} />

              {/* процесс собирается по скроллу */}
              <motion.div className="jrn-layer" style={{ opacity: sceneOpacity }}>
                {near && <Visual p={p} />}
              </motion.div>

              {/* прогресс этапа */}
              <div className="jrn-bar">
                <motion.i style={{ scaleX: p }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Journey() {
  const { t } = useLang();
  const stages = t.journey.stages;
  return (
    <div className="journey" id="journey">
      <div className="wrap z jrn-intro">
        <motion.span
          className="eyebrow"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-25%' }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <span className="dot" /> {t.journey.eyebrow}
        </motion.span>
        <motion.h2
          className="h2"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-25%' }}
          transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
        >
          {t.journey.head[0]} <span className="grad">{t.journey.head[1]}</span>
        </motion.h2>
        <motion.p
          className="lead"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-25%' }}
          transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
        >
          {t.journey.intro}
        </motion.p>
      </div>

      {stages.map((s, i) => (
        <Page key={STAGE_KEYS[i]} key0={STAGE_KEYS[i]} stage={s} i={i} total={stages.length} />
      ))}
    </div>
  );
}
