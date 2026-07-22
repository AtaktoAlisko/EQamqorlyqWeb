import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Magnetic, SplitWords } from './fx';

const FLOATS = [
  { cls: 'fc1', icon: '🥗', t: 'Диетические рационы', s: 'по мед. стандартам', d: 0 },
  { cls: 'fc2', icon: '📊', t: 'eQamqorlyq', s: 'цифровой контроль', d: 0.6 },
  { cls: 'fc3', icon: '⭐', t: '6 000+ клиентов', s: 'каждый день', d: 1.2 },
];

/* `start` is flipped on once the intro curtains open, so the hero
   plays its entrance for the user instead of behind the preloader. */
export default function Hero({ start = true }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const yText = useTransform(scrollYProgress, [0, 1], [0, 110]);
  const yVis = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // when start is false, `animate: undefined` leaves each element at its initial state
  const on = (to) => (start ? to : undefined);

  return (
    <section className="hero" id="top" ref={ref}>
      <div className="wrap z">
        <div className="hero-grid">
          <motion.div style={{ y: yText, opacity: fade }}>
            <motion.span
              className="eyebrow"
              initial={{ opacity: 0, y: 20 }}
              animate={on({ opacity: 1, y: 0 })}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <span className="dot" /> Организация питания · 8 лет на рынке
            </motion.span>

            <h1>
              <SplitWords text="Лечебно-диетическое" delay={0.25} play={start} />
              <br />
              <SplitWords text="питание" delay={0.4} play={start} />{' '}
              <span className="grad">
                <SplitWords text="нового уровня" delay={0.5} play={start} />
              </span>
            </h1>

            <motion.p
              className="lead"
              initial={{ opacity: 0, y: 22 }}
              animate={on({ opacity: 1, y: 0 })}
              transition={{ duration: 0.8, delay: 0.75 }}
            >
              Open Soul Inc — эксперт в организации лечебно-диетического и общественного питания
              в больницах и учреждениях. Более 200 профессионалов в 5 регионах Казахстана
              ежедневно обслуживают свыше 6 000 клиентов.
            </motion.p>

            <motion.div
              className="hero-cta"
              initial={{ opacity: 0, y: 22 }}
              animate={on({ opacity: 1, y: 0 })}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <Magnetic>
                <a href="#contact" className="btn btn-primary">
                  Получить КП <span className="arw">→</span>
                </a>
              </Magnetic>
              <Magnetic strength={0.2}>
                <a href="#about" className="btn btn-ghost">
                  О компании
                </a>
              </Magnetic>
            </motion.div>

            <motion.div
              className="hero-badges"
              initial={{ opacity: 0 }}
              animate={on({ opacity: 1 })}
              transition={{ duration: 1, delay: 1.1 }}
            >
              {[
                { n: '8+', l: 'лет опыта' },
                { n: '5', l: 'регионов РК' },
                { n: '17 млн', l: 'порций' },
              ].map((b) => (
                <div className="hero-badge" key={b.l}>
                  <div className="n grad">{b.n}</div>
                  <div className="l">{b.l}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div className="hero-visual" style={{ y: yVis, opacity: fade }}>
            <motion.div
              className="ring r2"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={on({ scale: 1, opacity: 1 })}
              transition={{ duration: 1.4, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.div
              className="ring r1"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={on({ scale: 1, opacity: 1 })}
              transition={{ duration: 1.4, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.div
              className="orb-core"
              initial={{ scale: 0.4, opacity: 0 }}
              animate={on({ scale: 1, opacity: 0.85 })}
              transition={{ duration: 1.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            />

            {FLOATS.map((f) => (
              <motion.div
                key={f.cls}
                className={`float-card glass ${f.cls}`}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={on({ opacity: 1, scale: 1, y: [0, -12, 0] })}
                transition={{
                  opacity: { duration: 0.7, delay: 0.7 + f.d * 0.25 },
                  scale: { duration: 0.7, delay: 0.7 + f.d * 0.25 },
                  y: { duration: 5, repeat: Infinity, ease: 'easeInOut', delay: f.d },
                }}
                whileHover={{ scale: 1.06 }}
              >
                <span className="ic">{f.icon}</span>
                <div>
                  <div className="t">{f.t}</div>
                  <div className="s">{f.s}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <motion.div
        className="scroll-hint"
        style={{ opacity: fade }}
        initial={{ opacity: 0 }}
        animate={on({ opacity: 1 })}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <span className="mouse" />
        Листайте вниз
      </motion.div>
    </section>
  );
}
