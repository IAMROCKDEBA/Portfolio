import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSmoothScroll } from '../context/SmoothScroll';
import styles from './Navigation.module.css';

gsap.registerPlugin(ScrollTrigger);

const sections = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'certifications', label: 'Certs' },
  { id: 'projects', label: 'Work' },
  { id: 'contact', label: 'Contact' },
];

export const Navigation = ({ isVisible }) => {
  const navRef = useRef(null);
  const progressRef = useRef(null);
  const [activeSection, setActiveSection] = useState('hero');
  const lenis = useSmoothScroll();

  useEffect(() => {
    if (!isVisible) return;

    // Animate nav in
    gsap.fromTo(navRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.5 }
    );

    // Scroll progress bar
    gsap.to(progressRef.current, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3,
      }
    });

    // Track active section
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      ScrollTrigger.create({
        trigger: el,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setActiveSection(id),
        onEnterBack: () => setActiveSection(id),
      });
    });
  }, [isVisible]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el && lenis) {
      lenis.scrollTo(el, { offset: 0, duration: 2 });
    }
  };

  if (!isVisible) return null;

  return (
    <>
      <div className={styles.progressBar} ref={progressRef}></div>
      <nav className={styles.nav} ref={navRef}>
        <div className={styles.logo} onClick={() => scrollTo('hero')} data-cursor="hover">
          DS
        </div>
        <div className={styles.links}>
          {sections.slice(1).map(({ id, label }) => (
            <button
              key={id}
              className={`${styles.navLink} ${activeSection === id ? styles.active : ''}`}
              onClick={() => scrollTo(id)}
              data-cursor="hover"
            >
              {label}
            </button>
          ))}
        </div>
      </nav>
    </>
  );
};
