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
  const indicatorRef = useRef(null);
  const linksContainerRef = useRef(null);
  const linkRefs = useRef([]);
  const [activeSection, setActiveSection] = useState('hero');
  const lenis = useSmoothScroll();
  const lastScrollY = useRef(0);
  const scrollDirection = useRef('up');

  // Move indicator pill to active link
  const moveIndicator = (id) => {
    const idx = sections.slice(1).findIndex(s => s.id === id);
    const linkEl = linkRefs.current[idx];
    const indicator = indicatorRef.current;
    if (!linkEl || !indicator || !linksContainerRef.current) return;

    const containerRect = linksContainerRef.current.getBoundingClientRect();
    const linkRect = linkEl.getBoundingClientRect();

    gsap.to(indicator, {
      x: linkRect.left - containerRect.left,
      width: linkRect.width,
      duration: 0.5,
      ease: 'power3.out',
    });
  };

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
        onEnter: () => {
          setActiveSection(id);
          moveIndicator(id);
        },
        onEnterBack: () => {
          setActiveSection(id);
          moveIndicator(id);
        },
      });
    });

    // Auto-hide nav on scroll down, show on scroll up
    ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const currentY = self.scroll();
        if (currentY < 100) {
          gsap.to(navRef.current, { y: 0, duration: 0.4, ease: 'power3.out' });
          return;
        }
        if (currentY > lastScrollY.current && scrollDirection.current !== 'down') {
          scrollDirection.current = 'down';
          gsap.to(navRef.current, { y: -120, duration: 0.4, ease: 'power3.in' });
        } else if (currentY < lastScrollY.current && scrollDirection.current !== 'up') {
          scrollDirection.current = 'up';
          gsap.to(navRef.current, { y: 0, duration: 0.4, ease: 'power3.out' });
        }
        lastScrollY.current = currentY;
      }
    });

    // Initial indicator position
    setTimeout(() => moveIndicator(activeSection), 600);
  }, [isVisible]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    
    if (lenis) {
      lenis.scrollTo(el, { offset: 0, duration: 2 });
    } else {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (!isVisible) return null;

  return (
    <>
      <div className={styles.progressBar} ref={progressRef}></div>
      <nav className={styles.nav} ref={navRef}>
        <div className={styles.logo} onClick={() => scrollTo('hero')} data-cursor="hover">
          <span className={styles.logoText}>DS</span>
          <span className={styles.logoDot}></span>
        </div>
        <div className={styles.links} ref={linksContainerRef}>
          {/* Sliding indicator pill */}
          <div className={styles.indicator} ref={indicatorRef}></div>
          {sections.slice(1).map(({ id, label }, idx) => (
            <button
              key={id}
              className={`${styles.navLink} ${activeSection === id ? styles.active : ''}`}
              onClick={() => scrollTo(id)}
              ref={el => linkRefs.current[idx] = el}
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
