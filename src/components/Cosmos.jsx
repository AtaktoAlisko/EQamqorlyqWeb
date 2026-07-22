import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from 'framer-motion';
import { KZ_GEO, KZ_H, KZ_PAD, KZ_PATH, KZ_PINS, KZ_VIEWBOX, KZ_W, TOTAL_OBJECTS } from '../data/kz';
import { Magnetic, SplitWords } from './fx';
import { useLang } from '../i18n';

/* ============================================================
   Первый экран: космос → Земля → Казахстан.

   Глобус рисуется на canvas в ортографической проекции по
   реальным контурам суши (Natural Earth 110m): вращается как
   сфера, обратная сторона отсекается. Сверху — процедурные
   облака, терминатор, атмосфера и солнечный лимб.

   По мере скролла планета доворачивается на Казахстан,
   камера «ныряет» к поверхности — и раскрывается карта
   с нашими объектами.
   ============================================================ */

const RAD = Math.PI / 180;
const KZ_LON = 67;
const KZ_LAT = 48;

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const lerp = (a, b, t) => a + (b - a) * t;


/* крупные города — огни на ночной стороне */
const LIGHTS = [
  [71.4, 51.1], [76.9, 43.2], [37.6, 55.7], [30.5, 50.4], [2.3, 48.8], [-0.1, 51.5],
  [13.4, 52.5], [12.5, 41.9], [28.9, 41.0], [51.4, 35.7], [55.3, 25.2], [77.2, 28.6],
  [72.9, 19.1], [116.4, 39.9], [121.5, 31.2], [139.7, 35.7], [126.9, 37.6], [106.8, -6.2],
  [100.5, 13.7], [-74.0, 40.7], [-87.6, 41.9], [-118.2, 34.1], [-99.1, 19.4], [-46.6, -23.5],
  [-58.4, -34.6], [31.2, 30.0], [3.4, 6.5], [28.0, -26.2], [151.2, -33.9], [174.8, -36.9],
  [69.2, 41.3], [58.4, 43.8], [49.1, 55.8], [30.3, 59.9],
];

function Globe({ progress, wide }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    let raf = 0;
    let w = 0;
    let h = 0;
    let stars = [];
    let clouds = [];
    let buf = null;
    let bufCtx = null;
    let bufImg = null;
    const lowCore = (navigator.hardwareConcurrency || 8) <= 4;

    /* Текстура Земли — реальный спутниковый снимок NASA Blue Marble.
       Кладём её в оффскрин-канвас, чтобы читать пиксели напрямую. */
    let tex = null;
    const img = new Image();
    img.onload = () => {
      const t = document.createElement('canvas');
      t.width = img.width;
      t.height = img.height;
      const tc = t.getContext('2d', { willReadFrequently: true });
      tc.drawImage(img, 0, 0);
      tex = {
        data: tc.getImageData(0, 0, img.width, img.height).data,
        w: img.width,
        h: img.height,
      };
    };
    img.src = '/earth.jpg';

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      stars = Array.from({ length: Math.round((w * h) / 4200) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.5 + 0.2,
        a: Math.random() * 0.65 + 0.15,
        tw: Math.random() * 2.2 + 0.6,
      }));

      // процедурные облачные поля
      const n = w < 760 ? 34 : 78;
      clouds = Array.from({ length: n }, () => ({
        lon: Math.random() * 360 - 180,
        lat: (Math.random() - 0.5) * 150,
        r: 0.05 + Math.random() * 0.11,
        a: 0.28 + Math.random() * 0.4,
      }));
    };
    build();
    window.addEventListener('resize', build);

    let visible = true;
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible && !raf) raf = requestAnimationFrame(draw);
      },
      { rootMargin: '10%' },
    );
    io.observe(canvas);

    const t0 = performance.now();

    function draw(now) {
      if (!visible) {
        raf = 0;
        return;
      }
      const t = (now - t0) / 1000;
      const p = progress.get();

      /* Глобус уже полностью прозрачен (opacity→0 к 0.64) — прекращаем
         тяжёлый пиксельный рендер сферы, чтобы кроссфейд на карту шёл без
         рывка. RAF продолжаем крутить дёшево, чтобы подхватить обратный скролл. */
      if (p > 0.65) {
        ctx.clearRect(0, 0, w, h);
        raf = requestAnimationFrame(draw);
        return;
      }

      /* --- камера --- */
      const k = easeOut(clamp(p / 0.48));          // доворот на Казахстан
      const dive = easeOut(clamp((p - 0.4) / 0.16)); // «нырок» к поверхности
      const spin = -t * 4.5;
      const lon0 = lerp(spin, KZ_LON, k);
      const lat0 = lerp(12, KZ_LAT, k);

      const cx = wide ? lerp(w * 0.7, w * 0.5, k) : w * 0.5;
      const cy = h * 0.5;
      const R = Math.min(w, h) * lerp(0.3, 0.5, k) * (1 + dive * 1.55);

      const sinL = Math.sin(lat0 * RAD);
      const cosL = Math.cos(lat0 * RAD);

      ctx.clearRect(0, 0, w, h);

      /* --- звёзды --- */
      for (const s of stars) {
        ctx.globalAlpha = s.a * (0.5 + 0.5 * Math.sin(t * s.tw + s.x));
        ctx.fillStyle = '#e6f4ff';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      /* --- атмосферное гало --- */
      const atm = ctx.createRadialGradient(cx, cy, R * 0.93, cx, cy, R * 1.3);
      atm.addColorStop(0, 'rgba(104, 190, 255, 0.42)');
      atm.addColorStop(0.4, 'rgba(60, 145, 225, 0.14)');
      atm.addColorStop(1, 'rgba(40, 110, 200, 0)');
      ctx.fillStyle = atm;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.3, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.clip();

      /* --- ПЛАНЕТА: пиксельный рендер текстуры NASA на сферу ---
         Для каждого пикселя диска решаем обратную ортографическую
         проекцию (экран → широта/долгота), берём цвет из снимка и
         затеняем по закону Ламберта — получается настоящий шар
         со светом, тенью и терминатором, а не плоская заливка.
         Считаем в половинном разрешении и растягиваем: полная
         сетка на каждом кадре съедала бы кадровый бюджет. */
      if (tex) {
        // масштаб внутреннего буфера: на слабых экранах (мало ядер / телефон)
        // считаем грубее, чтобы держать 60fps; растяжение сгладит.
        // Жёсткий потолок радиуса буфера — ключ к плавности: во время «нырка»
        // экранный R раздувается в ~2.5 раза, и без cap стоимость кадра росла
        // бы как R² именно в момент кроссфейда на карту → рывок. Потолок держит
        // бюджет постоянным, а бикубическое растяжение drawImage сглаживает.
        const q = w < 760 ? 0.4 : lowCore ? 0.42 : 0.5;
        const RB_MAX = w < 760 ? 175 : lowCore ? 200 : 300;
        const Rb = Math.max(2, Math.min(RB_MAX, Math.round(R * q)));
        const size = Rb * 2;
        if (!buf || buf.width !== size) {
          buf = document.createElement('canvas');
          buf.width = size;
          buf.height = size;
          bufCtx = buf.getContext('2d');
          bufImg = bufCtx.createImageData(size, size);
        }
        const out = bufImg.data;

        // направление на солнце в системе камеры (свет сверху-слева)
        const LX = -0.42, LY = 0.38, LZ = 0.82;

        for (let py = 0; py < size; py++) {
          const yN = (Rb - py) / Rb;
          for (let px = 0; px < size; px++) {
            const xN = (px - Rb) / Rb;
            const rho2 = xN * xN + yN * yN;
            const i4 = (py * size + px) * 4;
            if (rho2 > 1) {
              out[i4 + 3] = 0;
              continue;
            }
            const zN = Math.sqrt(1 - rho2);   // нормаль к сфере = (xN, yN, zN)
            const rho = Math.sqrt(rho2) || 1e-6;
            const sinc = rho;
            const cosc = zN;

            const lat = Math.asin(cosc * sinL + (yN * sinc * cosL) / rho);
            const lon =
              lon0 * RAD +
              Math.atan2(xN * sinc, rho * cosc * cosL - yN * sinc * sinL);

            // текстура: равнопромежуточная развёртка с билинейной выборкой —
            // цвет усредняется между 4 соседними тексели, поэтому при «нырке»
            // и увеличении не видно квадратных пикселей, а плавный переход.
            const u = ((lon / RAD + 180) % 360 + 360) % 360;
            const fx = (u / 360) * tex.w - 0.5;
            const fy = ((90 - lat / RAD) / 180) * tex.h - 0.5;
            const x0 = Math.floor(fx);
            const y0 = Math.floor(fy);
            const gx = fx - x0;
            const gy = fy - y0;
            // долгота заворачивается по кругу, широта прижимается к полюсам
            const xa = ((x0 % tex.w) + tex.w) % tex.w;
            const xb = (xa + 1) % tex.w;
            const ya = y0 < 0 ? 0 : y0 >= tex.h ? tex.h - 1 : y0;
            const yb = y0 + 1 < 0 ? 0 : y0 + 1 >= tex.h ? tex.h - 1 : y0 + 1;
            const rowA = ya * tex.w;
            const rowB = yb * tex.w;
            const iAA = (rowA + xa) * 4;
            const iBA = (rowA + xb) * 4;
            const iAB = (rowB + xa) * 4;
            const iBB = (rowB + xb) * 4;
            const wAA = (1 - gx) * (1 - gy);
            const wBA = gx * (1 - gy);
            const wAB = (1 - gx) * gy;
            const wBB = gx * gy;
            const td = tex.data;

            // диффузное освещение + мягкий край терминатора
            let li = xN * LX + yN * LY + zN * LZ;
            li = li < 0 ? 0 : li;
            const shade = 0.05 + 0.95 * Math.pow(li, 0.75);
            // атмосферное поджатие к лимбу
            const edge = 0.55 + 0.45 * zN;
            const sh = shade * edge;

            out[i4] = (td[iAA] * wAA + td[iBA] * wBA + td[iAB] * wAB + td[iBB] * wBB) * sh;
            out[i4 + 1] = (td[iAA + 1] * wAA + td[iBA + 1] * wBA + td[iAB + 1] * wAB + td[iBB + 1] * wBB) * sh;
            out[i4 + 2] = (td[iAA + 2] * wAA + td[iBA + 2] * wBA + td[iAB + 2] * wAB + td[iBB + 2] * wBB) * sh * 1.06;
            out[i4 + 3] = 255;
          }
        }
        bufCtx.putImageData(bufImg, 0, 0);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(buf, cx - R, cy - R, R * 2, R * 2);
      }

      /* проекция: [x, y, cosc] или null для обратной стороны */
      const project = (lon, lat) => {
        const dl = (lon - lon0) * RAD;
        const ph = lat * RAD;
        const cosc = sinL * Math.sin(ph) + cosL * Math.cos(ph) * Math.cos(dl);
        if (cosc <= 0) return null;
        return [
          cx + R * Math.cos(ph) * Math.sin(dl),
          cy - R * (cosL * Math.sin(ph) - sinL * Math.cos(ph) * Math.cos(dl)),
          cosc,
        ];
      };

      const ring = (pts, fill, stroke, lw = 0.7) => {
        let anyVisible = false;
        for (const [lon, lat] of pts) {
          if (project(lon, lat)) {
            anyVisible = true;
            break;
          }
        }
        if (!anyVisible) return;

        // невидимые точки прижимаем к лимбу, иначе полигон замкнётся «сквозь шар»
        const toLimb = (lon, lat) => {
          const dl = (lon - lon0) * RAD;
          const ph = lat * RAD;
          const x = Math.cos(ph) * Math.sin(dl);
          const y = cosL * Math.sin(ph) - sinL * Math.cos(ph) * Math.cos(dl);
          const len = Math.hypot(x, y) || 1;
          return [cx + (R * x) / len, cy - (R * y) / len];
        };

        ctx.beginPath();
        pts.forEach(([lon, lat], i) => {
          const pt = project(lon, lat) || toLimb(lon, lat);
          if (i === 0) ctx.moveTo(pt[0], pt[1]);
          else ctx.lineTo(pt[0], pt[1]);
        });
        ctx.closePath();
        if (fill) {
          ctx.fillStyle = fill;
          ctx.fill();
        }
        if (stroke) {
          ctx.strokeStyle = stroke;
          ctx.lineWidth = lw;
          ctx.stroke();
        }
      };

      /* --- Казахстан загорается при довороте --- */
      if (k > 0.2) {
        const pulse = 0.4 + 0.28 * Math.sin(t * 2.4);
        ctx.globalAlpha = clamp((k - 0.2) / 0.35);
        ring(KZ_GEO, `rgba(46, 230, 168, ${pulse})`, 'rgba(120, 255, 205, 0.95)', 1.6);
        ctx.globalAlpha = 1;
      }

      /* --- огни городов на ночной стороне --- */
      for (const [lon, lat] of LIGHTS) {
        const q = project(lon, lat);
        if (!q) continue;
        const night = clamp(1 - q[2] * 2.6);
        if (night <= 0.02) continue;
        const g = ctx.createRadialGradient(q[0], q[1], 0, q[0], q[1], R * 0.035);
        g.addColorStop(0, `rgba(255, 214, 140, ${0.85 * night})`);
        g.addColorStop(1, 'rgba(255, 190, 100, 0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(q[0], q[1], R * 0.035, 0, Math.PI * 2);
        ctx.fill();
      }

      /* --- облака: дрейфуют быстрее планеты --- */
      for (const c of clouds) {
        const q = project(c.lon + t * 1.6, c.lat);
        if (!q) continue;
        const edge = Math.min(1, q[2] * 2.2);
        const rad = c.r * R * edge;
        if (rad < 1) continue;
        const g = ctx.createRadialGradient(q[0], q[1], 0, q[0], q[1], rad);
        g.addColorStop(0, `rgba(255, 255, 255, ${c.a * edge * 0.9})`);
        g.addColorStop(0.55, `rgba(240, 248, 255, ${c.a * edge * 0.35})`);
        g.addColorStop(1, 'rgba(230, 245, 255, 0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(q[0], q[1], rad, 0, Math.PI * 2);
        ctx.fill();
      }

      /* Терминатор и затенение теперь считаются попиксельно при рендере
         текстуры (закон Ламберта) — дублировать их градиентом не нужно.
         Остаётся только лёгкая голубая дымка атмосферы у лимба. */
      const haze = ctx.createRadialGradient(cx, cy, R * 0.72, cx, cy, R);
      haze.addColorStop(0, 'rgba(120, 190, 255, 0)');
      haze.addColorStop(1, 'rgba(120, 190, 255, 0.22)');
      ctx.fillStyle = haze;
      ctx.fillRect(cx - R, cy - R, R * 2, R * 2);
      ctx.restore();

      /* --- солнечный лимб --- */
      const limb = ctx.createLinearGradient(cx - R, cy - R, cx + R, cy + R);
      limb.addColorStop(0, 'rgba(190, 235, 255, 0.95)');
      limb.addColorStop(0.45, 'rgba(120, 200, 255, 0.35)');
      limb.addColorStop(1, 'rgba(70, 140, 210, 0.08)');
      ctx.strokeStyle = limb;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.stroke();

      raf = requestAnimationFrame(draw);
    }

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', build);
    };
  }, [progress, wide]);

  return <canvas ref={ref} className="globe-canvas" />;
}

export default function Cosmos({ start = true }) {
  const ref = useRef(null);
  const { t, lang } = useLang();
  const [pin, setPin] = useState(null);
  const [wide, setWide] = useState(
    typeof window !== 'undefined' ? window.innerWidth > 1000 : true,
  );

  useEffect(() => {
    const on = () => setWide(window.innerWidth > 1000);
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  /* Сглаженный прогресс: быстрый рывок колеса догоняется пружиной,
     поэтому глобус→карта переходят маслянисто, а не скачком.
     Глобус читает СЫРОЙ прогресс (вращение должно быть отзывчивым),
     а вот переходы слоёв — уже сглаженный. */
  const smooth = useSpring(scrollYProgress, { stiffness: 70, damping: 26, restDelta: 0.0004 });

  const globeOpacity = useTransform(smooth, [0, 0.5, 0.64], [1, 1, 0]);
  const globeScale = useTransform(smooth, [0.4, 0.64], [1, 1.25]);

  /* Оффер исчезает с первым же движением колеса — и полностью снимается
     из отрисовки, чтобы не «призрачить» за планетой. */
  const heroOpacity = useTransform(scrollYProgress, [0, 0.015, 0.05], [1, 1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.05], [0, -60]);
  const heroVis = useTransform(scrollYProgress, (v) => (v > 0.055 ? 'hidden' : 'visible'));
  const heroEvents = useTransform(scrollYProgress, (v) => (v > 0.04 ? 'none' : 'auto'));

  /* Карта: плавно проявляется на кроссфейде с глобусом (0.5→0.66),
     а затем ДЕРЖИТСЯ до самого конца секции — из-за большой высоты
     .cosmos это ~2 экрана «плато», проскочить надпись невозможно. */
  const mapOpacity = useTransform(smooth, [0.5, 0.66], [0, 1]);
  const mapScale = useTransform(smooth, [0.5, 0.72], [0.92, 1]);
  const mapY = useTransform(smooth, [0.5, 0.72], [50, 0]);
  const mapEvents = useTransform(smooth, (v) => (v > 0.66 ? 'auto' : 'none'));

  /* Контур и пины оживают ровно в момент проявления карты — а не при
     входе секции (иначе анимация «падения» пинов уходит в пустоту). */
  const [mapIn, setMapIn] = useState(false);
  useMotionValueEvent(smooth, 'change', (v) => {
    const on = v > 0.58;
    setMapIn((was) => (was === on ? was : on));
  });

  const on = (to) => (start ? to : undefined);

  return (
    <section className="cosmos" id="top" ref={ref}>
      <div className="cosmos-sticky">
        <motion.div className="globe-wrap" style={{ opacity: globeOpacity, scale: globeScale }}>
          <Globe progress={scrollYProgress} wide={wide} />
        </motion.div>

        {/* первый экран: оффер поверх планеты */}
        <motion.div
          className="cosmos-hero"
          style={{
            opacity: heroOpacity,
            y: heroY,
            visibility: heroVis,
            pointerEvents: heroEvents,
          }}
        >
          <div className="wrap">
            <div className="cosmos-copy">
              <motion.span
                className="eyebrow"
                initial={{ opacity: 0, y: 20 }}
                animate={on({ opacity: 1, y: 0 })}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                <span className="dot" /> {t.cosmos.eyebrow}
              </motion.span>

              <h1 key={lang}>
                <SplitWords text={t.cosmos.h1[0]} delay={0.25} play={start} />
                <br />
                <SplitWords text={t.cosmos.h1[1]} delay={0.4} play={start} />{' '}
                <SplitWords text={t.cosmos.h1[2]} delay={0.5} play={start} wordClass="grad" />
              </h1>

              <motion.p
                className="lead"
                initial={{ opacity: 0, y: 22 }}
                animate={on({ opacity: 1, y: 0 })}
                transition={{ duration: 0.8, delay: 0.75 }}
              >
                {t.cosmos.lead(TOTAL_OBJECTS, KZ_PINS.length)}
              </motion.p>

              <motion.div
                className="hero-cta"
                initial={{ opacity: 0, y: 22 }}
                animate={on({ opacity: 1, y: 0 })}
                transition={{ duration: 0.8, delay: 0.9 }}
              >
                <Magnetic>
                  <a href="#contact" className="btn btn-primary">
                    {t.ui.getQuote} <span className="arw">→</span>
                  </a>
                </Magnetic>
                <Magnetic strength={0.2}>
                  <a href="#about" className="btn btn-ghost">
                    {t.ui.aboutCompany}
                  </a>
                </Magnetic>
              </motion.div>

              <motion.div
                className="hero-badges"
                initial={{ opacity: 0 }}
                animate={on({ opacity: 1 })}
                transition={{ duration: 1, delay: 1.1 }}
              >
                {t.cosmos.badges.map((b) => (
                  <div className="hero-badge" key={b.l}>
                    <div className="n grad">{b.n}</div>
                    <div className="l">{b.l}</div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

          <motion.span
            className="cosmos-hint"
            initial={{ opacity: 0 }}
            animate={on({ opacity: 1 })}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            {t.cosmos.hint}
          </motion.span>
        </motion.div>

        {/* карта Казахстана с объектами */}
        <motion.div
          className="kzmap"
          style={{ opacity: mapOpacity, scale: mapScale, y: mapY, pointerEvents: mapEvents }}
        >
          <div className="kzmap-head">
            <span className="eyebrow">
              <span className="dot" /> {t.cosmos.mapEyebrow}
            </span>
            <h3>
              {TOTAL_OBJECTS} {t.cosmos.mapH3[0]} <span className="grad">{t.cosmos.mapH3[1]}</span>
            </h3>
          </div>

          <div className="kzmap-canvas">
            <svg viewBox={KZ_VIEWBOX} className="kzmap-svg">
              <defs>
                {/* спутниковый снимок обрезается точно по границе страны */}
                <clipPath id="kzclip">
                  <path d={KZ_PATH} />
                </clipPath>
                <linearGradient id="kztint" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" style={{ stopColor: 'rgb(var(--a))', stopOpacity: 0.28 }} />
                  <stop offset="100%" style={{ stopColor: 'rgb(var(--a3))', stopOpacity: 0.16 }} />
                </linearGradient>
                <filter id="kzglow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="7" />
                </filter>
              </defs>

              <path d={KZ_PATH} fill="rgb(var(--a))" opacity="0.35" filter="url(#kzglow)" />

              {/* реальный снимок NASA Blue Marble: тот же bbox, что и контур */}
              <g clipPath="url(#kzclip)">
                <image
                  href="/kz-satellite.jpg"
                  x={KZ_PAD}
                  y={KZ_PAD}
                  width={KZ_W - KZ_PAD * 2}
                  height={KZ_H - KZ_PAD * 2}
                  preserveAspectRatio="none"
                />
                <rect x="0" y="0" width={KZ_W} height={KZ_H} fill="url(#kztint)" />
              </g>

              <motion.path
                d={KZ_PATH}
                fill="none"
                stroke="rgb(var(--a))"
                strokeWidth="2.5"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: mapIn ? 1 : 0 }}
                transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
              />

              {KZ_PINS.map((c, i) => (
                <g
                  key={c.name}
                  className={`kzpin ${pin === c.name ? 'on' : ''}`}
                  onMouseEnter={() => setPin(c.name)}
                  onMouseLeave={() => setPin(null)}
                >
                  {mapIn && (
                    <motion.circle
                      cx={c.x}
                      cy={c.y}
                      r="6"
                      fill="rgb(var(--a))"
                      initial={{ scale: 1, opacity: 0 }}
                      animate={{ scale: [1, 3.4], opacity: [0.55, 0] }}
                      transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.18, ease: 'easeOut' }}
                      style={{ transformOrigin: `${c.x}px ${c.y}px` }}
                    />
                  )}
                  {/* город с одним объектом — тонкое кольцо с ядром,
                      с несколькими — заливка, иначе цифра внутри не читается */}
                  <motion.g
                    initial={{ scale: 0, opacity: 0 }}
                    animate={mapIn ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 14, delay: 0.5 + i * 0.07 }}
                    style={{ transformOrigin: `${c.x}px ${c.y}px` }}
                  >
                    {c.objects.length > 1 ? (
                      <circle cx={c.x} cy={c.y} r="8" fill="rgb(var(--a))" stroke="var(--bg)" strokeWidth="1.4" />
                    ) : (
                      <>
                        <circle cx={c.x} cy={c.y} r="5.5" fill="none" stroke="rgb(var(--a))" strokeWidth="1.4" opacity="0.95" />
                        <circle cx={c.x} cy={c.y} r="1.9" fill="rgb(var(--a))" />
                      </>
                    )}
                  </motion.g>
                  {c.objects.length > 1 && (
                    <text x={c.x} y={c.y + 3.5} className="kzpin-n">
                      {c.objects.length}
                    </text>
                  )}
                  <text x={c.x + 13} y={c.y + 4} className="kzpin-label">
                    {c.name}
                  </text>
                </g>
              ))}
            </svg>

            {KZ_PINS.filter((c) => c.name === pin).map((c) => (
              <div className="kzcard" key={c.name}>
                <div className="kzcard-city">{c.name}</div>
                <div className="kzcard-n">
                  {c.objects.length} {c.objects.length === 1 ? t.cosmos.obj1 : t.cosmos.obj2}
                </div>
                <ul>
                  {c.objects.map((o) => (
                    <li key={o}>{o}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="kzmap-legend">
            <span>
              <i className="lg-dot" /> {t.cosmos.legendCity}
            </span>
            <span>
              <i className="lg-dot big">2</i> {t.cosmos.legendMulti}
            </span>
            <span className="kz-hint">{t.cosmos.legendHint}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
