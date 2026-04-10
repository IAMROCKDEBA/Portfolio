import React from 'react';
import { SmoothScrollProvider } from './context/SmoothScroll';
import { ThreeBackground } from './components/ThreeBackground';
import { Hero } from './components/sections/Hero';
import { About } from './components/sections/About';
import { Skills } from './components/sections/Skills';
import { Projects } from './components/sections/Projects';
import { Footer } from './components/sections/Footer';

function App() {
  return (
    <SmoothScrollProvider>
      <ThreeBackground />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Footer />
    </SmoothScrollProvider>
  );
}

export default App;
