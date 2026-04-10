import React, { useState, useCallback } from 'react';
import { SmoothScrollProvider } from './context/SmoothScroll';
import { Preloader } from './components/Preloader';
import { Navigation } from './components/Navigation';
import { ThreeBackground } from './components/ThreeBackground';
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
      <SmoothScrollProvider>
        <Navigation isVisible={isLoaded} />
        <ThreeBackground />
        <main className="main-content" data-loaded={isLoaded}>
          <Hero isLoaded={isLoaded} />
          <About />
          <Skills />
          <Certifications />
          <Projects />
          <Footer />
        </main>
      </SmoothScrollProvider>
    </>
  );
}

export default App;
