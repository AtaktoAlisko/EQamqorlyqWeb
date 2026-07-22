import { useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useScroll, useSpring } from 'framer-motion';
import { Counter, Magnetic, Reveal, TiltCard } from './fx';
import { useLang } from '../i18n';

/* ================= FEATURES ================= */
export function Features() {
  const { t } = useLang();
  const s = t.features;
  return (
    <section className="section" id="features">
      <div className="wrap z">
        <div className="sec-head center">
          <Reveal>
            <span className="eyebrow">
              <span className="dot" /> {s.eyebrow}
            </span>
            <h2 className="h2">
              {s.head[0]} <span className="grad">{s.head[1]}</span>
            </h2>
            <p className="lead">{s.lead}</p>
          </Reveal>
        </div>

        <div className="cards-3">
          {s.items.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.08}>
              <TiltCard className="f-card glass">
                <span className="f-num">0{i + 1}</span>
                <div className="f-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= STATS ================= */
export function Stats() {
  const { t } = useLang();
  const s = t.stats;
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="wrap z">
        <div className="sec-head center">
          <Reveal>
            <h2 className="h2">
              {s.head[0]} <span className="grad">{s.head[1]}</span>
            </h2>
          </Reveal>
        </div>

        <div className="stats">
          {s.items.map((it, i) => (
            <Reveal key={it.label} delay={i * 0.1}>
              <div className="stat glass">
                <div className="v grad">
                  <Counter to={it.value} suffix={it.suffix} />
                </div>
                <div className="l">{it.label}</div>
                <span className="beam" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= ABOUT ================= */
export function About() {
  const { t } = useLang();
  const s = t.about;
  return (
    <section className="section" id="about">
      <div className="wrap z">
        <div className="adv-grid">
          <Reveal>
            <span className="eyebrow">
              <span className="dot" /> {s.eyebrow}
            </span>
            <h2 className="h2">
              {s.head[0]} <span className="grad">{s.head[1]}</span>
            </h2>
            <p className="lead" style={{ marginBottom: 20 }}>
              {s.p1}
            </p>
            <p className="lead">{s.p2}</p>
            <div style={{ marginTop: 34 }}>
              <Magnetic>
                <a href="#contact" className="btn btn-primary">
                  {t.ui.contact} <span className="arw">→</span>
                </a>
              </Magnetic>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="cards-3" style={{ gridTemplateColumns: '1fr 1fr' }}>
              {s.cards.map((c) => (
                <TiltCard key={c.t} className="f-card glass" max={12}>
                  <div className="f-icon">{c.i}</div>
                  <h3 style={{ fontSize: 17 }}>{c.t}</h3>
                  <p style={{ fontSize: 13.5 }}>{c.s}</p>
                </TiltCard>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ================= TIMELINE ================= */
export function Timeline() {
  const { t } = useLang();
  const s = t.timeline;
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 65%', 'end 60%'] });
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 26, restDelta: 0.001 });

  return (
    <section className="section" id="history">
      <div className="wrap z">
        <div className="sec-head center">
          <Reveal>
            <span className="eyebrow">
              <span className="dot" /> {s.eyebrow}
            </span>
            <h2 className="h2">
              {s.head[0]} <span className="grad">{s.head[1]}</span>
            </h2>
          </Reveal>
        </div>

        <div className="tl" ref={ref}>
          <div className="tl-line">
            <motion.div className="fill" style={{ scaleY: fill }} />
          </div>

          {s.items.map((it, i) => (
            <div className="tl-item" key={it.year}>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="tl-node"
              />
              <motion.div
                className="tl-card glass"
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-90px' }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="tl-year grad">{it.year}</div>
                <h3>{it.title}</h3>
                <p>{it.text}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= TRUST MARQUEE ================= */
function Row({ items, reverse = false, duration = 34 }) {
  const list = [...items, ...items];
  return (
    <div className="marquee">
      <motion.div
        className="marquee-track"
        animate={{ x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={{ duration, repeat: Infinity, ease: 'linear' }}
      >
        {list.map((c, i) => (
          <div className="mq-item glass" key={i}>
            <span className="b">{c.icon}</span>
            {c.name}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function Trust() {
  const { t } = useLang();
  const clients = t.trust.clients;
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="wrap z">
        <div className="sec-head center" style={{ marginBottom: 40 }}>
          <Reveal>
            <span className="eyebrow">
              <span className="dot" /> {t.trust.eyebrow}
            </span>
          </Reveal>
        </div>
      </div>
      <div className="z">
        <Row items={clients} />
        <Row items={[...clients].reverse()} reverse duration={42} />
      </div>
    </section>
  );
}

/* ================= NEWS ================= */
export function News() {
  const { t } = useLang();
  const s = t.news;
  return (
    <section className="section" id="news">
      <div className="wrap z">
        <div className="sec-head center">
          <Reveal>
            <span className="eyebrow">
              <span className="dot" /> {s.eyebrow}
            </span>
            <h2 className="h2">
              {s.head[0]} <span className="grad">{s.head[1]}</span>
            </h2>
            <p className="lead">{s.lead}</p>
          </Reveal>
        </div>

        <div className="news-grid">
          {s.items.map((n, i) => (
            <Reveal key={n.title} delay={i * 0.07}>
              <motion.article className="news-card glass" whileHover={{ scale: 1.015 }}>
                <div className="news-media">
                  <span className="news-tag">{n.tag}</span>
                  {/* фото, если оно есть; иначе прежняя эмодзи-заглушка */}
                  {n.img ? (
                    <img className="news-img" src={n.img} alt="" loading="lazy" decoding="async" />
                  ) : (
                    <div
                      className="ph"
                      style={{
                        background:
                          'linear-gradient(140deg, rgba(var(--a), 0.16), rgba(var(--a3), 0.06))',
                      }}
                    >
                      {n.emoji}
                    </div>
                  )}
                </div>
                <div className="news-body">
                  <div className="news-date">{n.date}</div>
                  <h3>{n.title}</h3>
                  <p>{n.text}</p>
                  <span className="news-more">
                    {t.ui.readMore} <span className="arw">→</span>
                  </span>
                </div>
              </motion.article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Magnetic>
              <a href="#news" className="btn btn-ghost">
                {t.ui.allNews} <span className="arw">→</span>
              </a>
            </Magnetic>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ================= PLATFORM (E-Qamqorlyq) ================= */
export function Platform() {
  const { t } = useLang();
  const s = t.platform;
  return (
    <section className="section" id="platform">
      <div className="wrap z">
        <div className="sec-head center">
          <Reveal>
            <span className="eyebrow">
              <span className="dot" /> {s.eyebrow}
            </span>
            <h2 className="h2">
              {s.head[0]} <span className="grad">{s.head[1]}</span>
            </h2>
            <p className="lead">{s.lead}</p>
          </Reveal>
        </div>

        <div className="cards-3">
          {s.modules.map((m, i) => (
            <Reveal key={m.code} delay={i * 0.06}>
              <TiltCard className="f-card mod-card glass" max={10}>
                <div className="mod-top">
                  <span className="f-icon">{m.icon}</span>
                  <span className="mod-code">{m.code}</span>
                </div>
                <h3>{m.title}</h3>
                <ul className="mod-list">
                  {m.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
                <div className="mod-effect">
                  <span className="k">{s.effectLabel}</span>
                  <span className="v">{m.effect}</span>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="haccp glass">
            <div className="haccp-head">
              <div>
                <h3>{s.haccpTitle}</h3>
                <p className="lead" style={{ fontSize: 14.5, marginTop: 10 }}>
                  {s.haccpText}
                </p>
              </div>
              <span className="patent">🏅 {s.patent}</span>
            </div>
            <div className="sensors">
              {s.sensors.map((sn) => (
                <div className="sensor" key={sn.t}>
                  <span className="ic">{sn.icon}</span>
                  <div>
                    <div className="t">{sn.t}</div>
                    <div className="s">{sn.s}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ================= RESULTS ================= */
export function Results() {
  const { t } = useLang();
  const s = t.results;
  return (
    <section className="section" id="results" style={{ paddingTop: 0 }}>
      <div className="wrap z">
        <div className="sec-head center">
          <Reveal>
            <span className="eyebrow">
              <span className="dot" /> {s.eyebrow}
            </span>
            <h2 className="h2">
              {s.head[0]} <span className="grad">{s.head[1]}</span>
            </h2>
            <p className="lead">{s.lead}</p>
          </Reveal>
        </div>

        <div className="res-grid">
          {s.items.map((r, i) => (
            <Reveal key={r.title} delay={i * 0.07}>
              <div className="res-card glass">
                <div className="res-title">{r.title}</div>
                {r.from ? (
                  <div className="res-shift">
                    <span className="from">
                      <span className="lbl">{s.beforeLabel}</span>
                      {r.from}
                    </span>
                    <span className={`arrow ${r.dir}`}>{r.dir === 'up' ? '↗' : '↘'}</span>
                    <span className="to grad">
                      <span className="lbl">{s.afterLabel}</span>
                      {r.to}
                    </span>
                  </div>
                ) : (
                  <div className="res-single grad">{r.value}</div>
                )}
                <p>{r.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= ESG ================= */
export function Esg() {
  const { t } = useLang();
  const s = t.esg;
  return (
    <section className="section" id="esg">
      <div className="wrap z">
        <div className="sec-head center">
          <Reveal>
            <span className="eyebrow">
              <span className="dot" /> {s.eyebrow}
            </span>
            <h2 className="h2">
              {s.head[0]} <span className="grad">{s.head[1]}</span>
            </h2>
            <p className="lead">{s.lead}</p>
          </Reveal>
        </div>

        <div className="esg-grid">
          {s.crisis.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.1}>
              <div className="esg-card glass">
                <div className="esg-v grad">{c.value}</div>
                <div className="esg-u">{c.unit}</div>
                <h3>{c.title}</h3>
                <p>{c.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <h3 className="esg-sub">{s.systemicTitle}</h3>
          <div className="esg-sys">
            {s.systemic.map((it) => (
              <TiltCard key={it.t} className="f-card glass" max={10}>
                <div className="f-icon">{it.i}</div>
                <h3 style={{ fontSize: 16 }}>{it.t}</h3>
                <p style={{ fontSize: 13.5 }}>{it.s}</p>
              </TiltCard>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ================= ADVANTAGES + eQAMQORLYQ ================= */
function Skill({ s, i }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <div className="skill" ref={ref}>
      <div className="skill-top">
        <span className="n">{s.name}</span>
        <span className="p">
          {inView ? <Counter to={s.value} suffix="%" duration={1.6} /> : '0%'}
        </span>
      </div>
      <div className="skill-bar">
        <motion.div
          className="skill-fill"
          initial={{ width: 0 }}
          animate={inView ? { width: `${s.value}%` } : {}}
          transition={{ duration: 1.5, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

export function Advantages() {
  const { t } = useLang();
  const s = t.advantages;
  return (
    <section className="section" id="advantages">
      <div className="wrap z">
        <div className="cards-3" style={{ marginBottom: 'clamp(48px, 7vw, 84px)' }}>
          {s.reasons.map((r, i) => (
            <Reveal key={r.title} delay={i * 0.06}>
              <TiltCard className="f-card reason-card glass" max={10}>
                <span className="f-num">0{i + 1}</span>
                <h3>{r.title}</h3>
                <p>{r.text}</p>
                <span className="reason-tag">{r.tag}</span>
              </TiltCard>
            </Reveal>
          ))}
        </div>

        <div className="adv-grid">
          <Reveal>
            <span className="eyebrow">
              <span className="dot" /> {s.eyebrow}
            </span>
            <h2 className="h2">
              {s.head[0]} <span className="grad">{s.head[1]}</span>
            </h2>
            <p className="lead" style={{ marginBottom: 44 }}>
              {s.lead}
            </p>
            {s.skills.map((sk, i) => (
              <Skill key={sk.name} s={sk} i={i} />
            ))}
          </Reveal>

          <Reveal delay={0.15}>
            <TiltCard className="qr-card glass" max={7}>
              <div className="qr-box">📱</div>
              <h3>
                <span className="grad">{s.qrTitle}</span>
              </h3>
              <p>{s.qrText}</p>
              <Magnetic>
                <a href="https://eqamqorlyq.kz" target="_blank" rel="noreferrer" className="btn btn-primary">
                  {t.ui.portal} <span className="arw">→</span>
                </a>
              </Magnetic>
            </TiltCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ================= TESTIMONIALS ================= */
export function Testimonials() {
  const { t } = useLang();
  const items = t.testimonials.items;
  const [[i, dir], setI] = useState([0, 0]);
  const idx = i % items.length;
  const go = (d) => setI(([p]) => [(p + d + items.length) % items.length, d]);
  const item = items[idx];

  return (
    <section className="section">
      <div className="wrap z" style={{ maxWidth: 900 }}>
        <div className="sec-head center">
          <Reveal>
            <span className="eyebrow">
              <span className="dot" /> {t.testimonials.eyebrow}
            </span>
            <h2 className="h2">
              {t.testimonials.head[0]} <span className="grad">{t.testimonials.head[1]}</span>
            </h2>
          </Reveal>
        </div>

        <Reveal>
          <div style={{ position: 'relative' }}>
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={idx}
                className="tst-card glass"
                custom={dir}
                initial={{ opacity: 0, x: dir >= 0 ? 60 : -60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir >= 0 ? -60 : 60 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="tst-quote">“</div>
                <p className="tst-text">{item.text}</p>
                <div className="tst-who">
                  <div className="tst-av">{item.initials}</div>
                  <div>
                    <div className="nm">{item.name}</div>
                    <div className="rl">{item.role}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="tst-nav">
            <button className="tst-btn" onClick={() => go(-1)} aria-label="←">
              ←
            </button>
            <div className="tst-dots">
              {items.map((_, k) => (
                <button
                  key={k}
                  className={`tst-dot ${k === idx ? 'on' : ''}`}
                  onClick={() => setI([k, k > idx ? 1 : -1])}
                  aria-label={`${k + 1}`}
                />
              ))}
            </div>
            <button className="tst-btn" onClick={() => go(1)} aria-label="→">
              →
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ================= CONTACT ================= */
export function Contact() {
  const { t } = useLang();
  const s = t.contact;
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setSent(true);
    e.target.reset();
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <section className="section" id="contact">
      <div className="wrap z">
        <Reveal>
          <div className="cta-banner glass" style={{ marginBottom: 60 }}>
            <div className="cta-glow" />
            <div className="z">
              <h2>
                {s.ctaTitle[0]} <span className="grad">{s.ctaTitle[1]}</span>
              </h2>
              <p className="lead" style={{ margin: '0 auto 32px' }}>
                {s.ctaLead}
              </p>
              <Magnetic>
                <a href="tel:+77715058000" className="btn btn-primary">
                  +7 771 505 80 00 <span className="arw">→</span>
                </a>
              </Magnetic>
            </div>
          </div>
        </Reveal>

        <div className="sec-head center">
          <Reveal>
            <span className="eyebrow">
              <span className="dot" /> {s.eyebrow}
            </span>
            <h2 className="h2">
              {s.head[0]} <span className="grad">{s.head[1]}</span>
            </h2>
          </Reveal>
        </div>

        <div className="contact-grid">
          <Reveal>
            <div className="info-card glass" style={{ height: '100%' }}>
              <h3>{s.office}</h3>
              <p className="lead" style={{ fontSize: 14.5, marginBottom: 12 }}>
                {s.city}
              </p>
              {s.info.map((c) => (
                <div className="info-row" key={c.key}>
                  <span className="ic">{c.icon}</span>
                  <div>
                    <div className="k">{c.key}</div>
                    {c.href ? (
                      <a className="v" href={c.href}>
                        {c.value}
                      </a>
                    ) : (
                      <div className="v">{c.value}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <form className="form-card glass" onSubmit={submit}>
              <h3>{s.formTitle}</h3>

              <AnimatePresence>
                {sent && (
                  <motion.div
                    className="form-ok"
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginBottom: 18 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  >
                    {t.ui.thanks}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="field">
                <label htmlFor="name">{t.ui.name}</label>
                <input id="name" name="name" required placeholder={t.ui.namePh} />
              </div>
              <div className="field">
                <label htmlFor="phone">{t.ui.phone}</label>
                <input id="phone" name="phone" type="tel" required placeholder={t.ui.phonePh} />
              </div>
              <div className="field">
                <label htmlFor="msg">{t.ui.message}</label>
                <textarea id="msg" name="msg" placeholder={t.ui.msgPh} />
              </div>

              <Magnetic strength={0.2}>
                <button type="submit" className="btn btn-primary">
                  {t.ui.send} <span className="arw">→</span>
                </button>
              </Magnetic>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ================= FOOTER ================= */
export function Footer() {
  const { t } = useLang();
  const s = t.footer;
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <a href="#top" className="logo" style={{ marginBottom: 18 }} aria-label="Open Soul Inc">
              <img src="/logo.png" alt="Open Soul Inc" className="logo-img footer-logo" />
            </a>
            <p className="lead" style={{ fontSize: 14, maxWidth: 340, marginTop: 16 }}>
              {s.tagline}
            </p>
            <p className="footer-motto grad">{s.motto}</p>
          </div>

          <div>
            <h4>{s.companyH}</h4>
            <div className="footer-links">
              {s.company.map((l) => (
                <a key={l.label} href={l.href}>
                  {l.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4>{s.infoH}</h4>
            <div className="footer-links">
              {s.info.map((l) =>
                l.ext ? (
                  <a key={l.label} href={l.href} target="_blank" rel="noreferrer">
                    {l.label}
                  </a>
                ) : (
                  <a key={l.label} href={l.href}>
                    {l.label}
                  </a>
                ),
              )}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {s.rights}</span>
          <span>info@opensoul.kz · +7 771 505 80 00</span>
        </div>
      </div>
    </footer>
  );
}
