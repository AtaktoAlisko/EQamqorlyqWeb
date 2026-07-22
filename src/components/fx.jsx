import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring, useTransform, animate } from 'framer-motion';

/* Pointer capability check — tilt / custom cursor are desktop-only.
   Doing this once at module level avoids a listener per card. */
export const FINE_POINTER =
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/* ---------- Background: aurora + grid + noise + vignette ---------- */
export function Background() {
  return (
    <>
      <div className="bg-fx">
        <div className="aurora a1" />
        <div className="aurora a2" />
        <div className="aurora a3" />
        <div className="grid-lines" />
      </div>
      <div className="vignette" />
      <div className="noise" />
    </>
  );
}

/* ---------- Custom cursor: dot + lagging ring + ambient glow ---------- */
export function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const [hot, setHot] = useState(false);

  const rx = useSpring(x, { damping: 26, stiffness: 320, mass: 0.6 });
  const ry = useSpring(y, { damping: 26, stiffness: 320, mass: 0.6 });
  const gx = useSpring(x, { damping: 40, stiffness: 60, mass: 1 });
  const gy = useSpring(y, { damping: 40, stiffness: 60, mass: 1 });

  useEffect(() => {
    if (!FINE_POINTER) return;
    let raf = 0;
    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      // hit-testing every mousemove is wasteful — throttle to one frame
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const t = e.target;
        setHot(!!(t.closest && t.closest('a, button, .tilt, .news-card, .mq-item, input, textarea')));
      });
    };
    window.addEventListener('mousemove', move, { passive: true });
    return () => {
      window.removeEventListener('mousemove', move);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [x, y]);

  if (!FINE_POINTER) return null;

  return (
    <>
      <motion.div className="cursor-glow" style={{ x: gx, y: gy, translateX: '-50%', translateY: '-50%' }} />
      <motion.div className="cursor-dot" style={{ x, y, translateX: '-50%', translateY: '-50%' }} />
      <motion.div
        className="cursor-ring"
        style={{ x: rx, y: ry, translateX: '-50%', translateY: '-50%' }}
        animate={{ scale: hot ? 1.7 : 1, opacity: hot ? 0.9 : 0.5 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      />
    </>
  );
}

/* ---------- Scroll reveal wrapper ----------
   transform + opacity only: animating `filter` here repaints the whole
   subtree every frame and was the main source of scroll jank. */
export function Reveal({ children, delay = 0, y = 30, className = '', once = true }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-70px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ---------- Word-by-word headline reveal ----------
   `play=false` holds the words in their hidden state (used while the intro runs).
   `wordClass` goes on the animated span itself — a gradient (.grad) must live on
   the moving element, otherwise WebKit drops the background-clip:text fill of a
   parent once the child gets its own compositing layer and the word turns blank. */
export function SplitWords({ text, className = '', wordClass = '', delay = 0, play = true }) {
  const words = text.split(' ');
  return (
    <span className={className}>
      {words.map((w, i) => (
        <span className="word" key={i}>
          <motion.span
            className={wordClass}
            initial={{ y: '110%', opacity: 0 }}
            animate={play ? { y: '0%', opacity: 1 } : undefined}
            transition={{ duration: 0.9, delay: delay + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            dangerouslySetInnerHTML={{ __html: w + (i < words.length - 1 ? '&nbsp;' : '') }}
          />
        </span>
      ))}
    </span>
  );
}

/* ---------- Magnetic element (buttons) ---------- */
export function Magnetic({ children, strength = 0.35 }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { damping: 15, stiffness: 200, mass: 0.4 });
  const sy = useSpring(y, { damping: 15, stiffness: 200, mass: 0.4 });

  if (!FINE_POINTER) return <span className="mag">{children}</span>;

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span ref={ref} className="mag" style={{ x: sx, y: sy }} onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </motion.span>
  );
}

/* ---------- 3D tilt card with inner spotlight ---------- */
export function TiltCard({ children, className = '', max = 10 }) {
  const ref = useRef(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useMotionValue(0);
  const sy = useMotionValue(0);

  const cfg = { damping: 22, stiffness: 190, mass: 0.5 };
  const rx = useSpring(useTransform(my, [0, 1], [max, -max]), cfg);
  const ry = useSpring(useTransform(mx, [0, 1], [-max, max]), cfg);

  // touch devices get a plain card — no tilt listeners, no spotlight layer
  if (!FINE_POINTER) return <div className={`tilt ${className}`}>{children}</div>;

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
    sx.set(e.clientX - r.left);
    sy.set(e.clientY - r.top);
  };
  const onLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      className={`tilt ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
    >
      <motion.span className="spot" style={{ left: sx, top: sy }} />
      {children}
    </motion.div>
  );
}

/* ---------- Animated counter ---------- */
export function Counter({ to, suffix = '', duration = 2 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setVal(Math.floor(v)),
    });
    return () => c.stop();
  }, [inView, to, duration]);

  return (
    <span ref={ref}>
      {val.toLocaleString('ru-RU')}
      {suffix}
    </span>
  );
}
