import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { LANGS, useLang } from '../i18n';
import { useTheme } from '../theme';

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const { t } = useLang();
  const dark = theme === 'dark';
  return (
    <motion.button
      className="theme-btn"
      onClick={toggle}
      aria-label={dark ? t.ui.lightTheme : t.ui.darkTheme}
      whileTap={{ scale: 0.88 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ y: 18, opacity: 0, rotate: -60 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -18, opacity: 0, rotate: 60 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        >
          {dark ? '🌙' : '☀️'}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}

function LangSwitch() {
  const { lang, setLang } = useLang();
  return (
    <div className="lang-switch" role="group" aria-label="Language">
      {LANGS.map((l) => (
        <button
          key={l.code}
          className={`lang-opt ${lang === l.code ? 'on' : ''}`}
          onClick={() => setLang(l.code)}
          aria-pressed={lang === l.code}
        >
          {lang === l.code && (
            <motion.span className="lang-pill" layoutId="lang-pill" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
          )}
          <span className="lang-txt">{l.label}</span>
        </button>
      ))}
    </div>
  );
}

export default function Nav({ show = true }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(null);
  const { t } = useLang();
  const NAV = t.nav;

  const { scrollYProgress } = useScroll();
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // only touch body scroll while the menu is actually open, otherwise this
  // would clear the lock the intro sets on mount
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <motion.nav
        className={`nav ${scrolled ? 'scrolled' : ''}`}
        initial={{ y: -90, opacity: 0 }}
        animate={show ? { y: 0, opacity: 1 } : undefined}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="wrap">
          <div className="nav-inner">
            <a href="#top" className="logo" aria-label="Open Soul Inc">
              <img src="/logo.png" alt="Open Soul Inc" className="logo-img" />
            </a>

            <div className="nav-links" onMouseLeave={() => setHover(null)}>
              {NAV.map((n) => (
                <a
                  key={n.id}
                  href={`#${n.id}`}
                  className="nav-link"
                  onMouseEnter={() => setHover(n.id)}
                >
                  {hover === n.id && (
                    <motion.span
                      className="pill"
                      layoutId="nav-pill"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  {n.label}
                </a>
              ))}
            </div>

            <div className="nav-cta">
              <LangSwitch />
              <ThemeToggle />
              <button className="burger" onClick={() => setOpen((v) => !v)} aria-label="Menu">
                <motion.span animate={open ? { rotate: 45, y: 3.5 } : { rotate: 0, y: 0 }} />
                <motion.span animate={open ? { rotate: -45, y: -3.5 } : { rotate: 0, y: 0 }} />
              </button>
            </div>

            {scrolled && <motion.div className="progress-bar" style={{ scaleX: bar }} />}
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {NAV.map((n, i) => (
              <motion.a
                key={n.id}
                href={`#${n.id}`}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                {n.label}
              </motion.a>
            ))}
            <div style={{ marginTop: 22 }}>
              <LangSwitch />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
