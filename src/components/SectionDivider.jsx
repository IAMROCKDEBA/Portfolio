import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './SectionDivider.module.css';

gsap.registerPlugin(ScrollTrigger);

export const SectionDivider = ({ variant = 'gradient' }) => {
  const dividerRef = useRef(null);
  const lineRef = useRef(null);
  const orbRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Line draws itself on scroll
      gsap.fromTo(lineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: dividerRef.current,
            start: 'top 85%',
          }
        }
      );

      // Center orb pulses in
      if (orbRef.current) {
        gsap.fromTo(orbRef.current,
          { scale: 0, opacity: 0 },
          {
            scale: 1, opacity: 1,
            duration: 0.8,
            ease: 'elastic.out(1, 0.5)',
            scrollTrigger: {
              trigger: dividerRef.current,
              start: 'top 80%',
            }
          }
        );
      }
    }, dividerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className={styles.divider} ref={dividerRef}>
      <div className={`${styles.line} ${styles[variant]}`} ref={lineRef}>
        <div className={styles.lineGlow}></div>
      </div>
      <div className={styles.orb} ref={orbRef}>
        <div className={styles.orbInner}></div>
      </div>
    </div>
  );
};
