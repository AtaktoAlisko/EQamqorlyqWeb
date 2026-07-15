import { useEffect, useState } from 'react';
import { animate, motion } from 'framer-motion';

const WORD = 'OPEN SOUL';
const EASE = [0.22, 1, 0.36, 1];

/* Timeline (seconds) */
const T = {
  mark: 0.15,
  letters: 0.5,
  meter: 0.9,
  hold: 2.6,   // when the curtains start splitting
  done: 3.5,   // when the intro unmounts
};

export default function Intro({ onDone }) {
  const [pct, setPct] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);

    const count = animate(0, 100, {
      duration: 1.5,
      delay: T.meter,
      ease: EASE,
      onUpdate: (v) => setPct(Math.round(v)),
    });

    const split = setTimeout(() => setOpen(true), T.hold * 1000);
    const finish = setTimeout(() => {
      document.body.style.overflow = '';
      onDone();
    }, T.done * 1000);

    return () => {
      count.stop();
      clearTimeout(split);
      clearTimeout(finish);
      document.body.style.overflow = '';
    };
  }, [onDone]);

  const letters = WORD.split('');

  return (
    <motion.div className="intro" exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
      {/* curtains: they hold the background, then split apart to reveal the site */}
      <motion.div
        className="curtain top"
        animate={open ? { y: '-100%' } : { y: 0 }}
        transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
      >
        <span className="curtain-edge" />
      </motion.div>
      <motion.div
        className="curtain bottom"
        animate={open ? { y: '100%' } : { y: 0 }}
        transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
      >
        <span className="curtain-edge" />
      </motion.div>

      <motion.div
        className="intro-orb"
        initial={{ scale: 0.3, opacity: 0 }}
        animate={
          open
            ? { scale: 2.2, opacity: 0 }
            : { scale: [0.6, 1.05, 1], opacity: [0, 0.9, 0.7] }
        }
        transition={{ duration: open ? 1 : 2, ease: EASE }}
        style={{ zIndex: 3 }}
      />

      <motion.div
        className="intro-inner"
        style={{ zIndex: 4 }}
        animate={open ? { scale: 1.25, opacity: 0, filter: 'blur(14px)' } : {}}
        transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
      >
        {/* logo mark drops in and settles */}
        <motion.div
          className="intro-mark"
          initial={{ scale: 0, rotate: -140, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 180, damping: 13, delay: T.mark }}
        >
          🍃
        </motion.div>

        {/* letters flip up one by one */}
        <div className="intro-word">
          {letters.map((ch, i) =>
            ch === ' ' ? (
              <span className="sp" key={i} />
            ) : (
              <motion.span
                className="ch"
                key={i}
                initial={{ y: '90%', opacity: 0, rotateX: -85, filter: 'blur(10px)' }}
                animate={{ y: '0%', opacity: 1, rotateX: 0, filter: 'blur(0px)' }}
                transition={{
                  duration: 0.9,
                  delay: T.letters + i * 0.06,
                  ease: EASE,
                }}
                style={{ transformPerspective: 700 }}
              >
                {i < 4 ? ch : <span className="grad">{ch}</span>}
              </motion.span>
            ),
          )}
        </div>

        <motion.div
          className="intro-tag"
          initial={{ opacity: 0, letterSpacing: '0.9em' }}
          animate={{ opacity: 1, letterSpacing: '0.4em' }}
          transition={{ duration: 1.4, delay: T.letters + 0.5, ease: EASE }}
        >
          Организация питания
        </motion.div>

        <motion.div
          className="intro-meter"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: T.meter, duration: 0.4 }}
        >
          <motion.div
            className="fill"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.5, delay: T.meter, ease: EASE }}
          />
        </motion.div>

        <motion.div
          className="intro-pct"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: T.meter, duration: 0.4 }}
        >
          {pct}%
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
