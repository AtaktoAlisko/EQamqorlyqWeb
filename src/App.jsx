import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Nav from './components/Nav';
import Intro from './components/Intro';
import Journey from './components/Journey';
import Cosmos from './components/Cosmos';
import Astana from './components/Astana';
import { Background, Cursor } from './components/fx';
import { ThemeProvider } from './theme';
import { LangProvider } from './i18n';
import {
  About,
  Advantages,
  Contact,
  Features,
  Footer,
  News,
  Stats,
  Testimonials,
  Timeline,
  Trust,
} from './components/Sections';

/* Show the intro once per browser session — a reload during the same visit
   skips it so it never gets in the way. */
const seen = sessionStorage.getItem('osi-intro') === '1';
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const SKIP = seen || reduced;

export default function App() {
  const [ready, setReady] = useState(SKIP);

  const done = () => {
    sessionStorage.setItem('osi-intro', '1');
    setReady(true);
  };

  return (
    <ThemeProvider>
      <LangProvider>
        <AnimatePresence>{!SKIP && !ready && <Intro key="intro" onDone={done} />}</AnimatePresence>

        <Background />
        <Cursor />
        <Nav show={ready} />
        <main>
          <Cosmos start={ready} />
          <Astana />
          <Journey />
          <Features />
          <Stats />
          <About />
          <Timeline />
          <Trust />
          <News />
          <Advantages />
          <Testimonials />
          <Contact />
        </main>
        <Footer />
      </LangProvider>
    </ThemeProvider>
  );
}
