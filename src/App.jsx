import React, { useState, useCallback } from 'react';
import { SmoothScrollProvider } from './context/SmoothScroll';
import { Preloader } from './components/Preloader';
import { Navigation } from './components/Navigation';
import { CustomCursor } from './components/CustomCursor';
import { ThreeBackground } from './components/ThreeBackground';
import { SectionDivider } from './components/SectionDivider';
import { Hero } from './components/sections/Hero';
import { About } from './components/sections/About';
import { Skills } from './components/sections/Skills';
import { Certifications } from './components/sections/Certifications';
import { Projects } from './components/sections/Projects';
import { Footer } from './components/sections/Footer';
import './App.css';

function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  const handlePreloaderComplete = useCallback(() => {
    setIsLoaded(true);
  }, []);

  return (
    <>
      {!isLoaded && <Preloader onComplete={handlePreloaderComplete} />}
      <CustomCursor />
      <SmoothScrollProvider>
        <Navigation isVisible={isLoaded} />
        <ThreeBackground />
        <main className="main-content" data-loaded={isLoaded}>
          <Hero isLoaded={isLoaded} />
          <SectionDivider />
          <About />
          <SectionDivider />
          <Skills />
          <SectionDivider />
          <Certifications />
          <SectionDivider />
          <Projects />
          <SectionDivider />
          <Footer />
        </main>
      </SmoothScrollProvider>
    </>
  );
}

export default App;
