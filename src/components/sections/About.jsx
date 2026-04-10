import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './About.module.css';

gsap.registerPlugin(ScrollTrigger);

export const About = () => {
  const containerRef = useRef(null);
  const wordsRef = useRef([]);
  const labelRef = useRef(null);
  const decorLineRef = useRef(null);

  const text = "Results-driven B.Tech Computer Science & Engineering student at Adamas University. Proficient in Python, C++, and JavaScript with a strong foundation in modern software architecture. Passionate about solving real-world problems and building high-performance production-ready systems.";
  const words = text.split(' ');

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section label reveal
      gsap.fromTo(labelRef.current,
        { x: -50, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
          }
        }
      );

      // Decorative line
      gsap.fromTo(decorLineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1, duration: 1.5, ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%',
          }
        }
      );

      // Word-by-word illumination with scroll scrub
      wordsRef.current.filter(Boolean).forEach((word, i) => {
        gsap.fromTo(word,
          { opacity: 0.15, y: 5 },
          {
            opacity: 1,
            y: 0,
            color: 'var(--text-primary)',
            duration: 0.5,
            scrollTrigger: {
              trigger: containerRef.current,
              start: `top+=${i * 15} 65%`,
              end: `top+=${i * 15 + 80} 65%`,
              scrub: 1,
            }
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.about} ref={containerRef} id="about">
      <div className={styles.inner}>
        <div className="section-label" ref={labelRef}>
          <span>About Me</span>
        </div>

        <div className={styles.decorLine} ref={decorLineRef}></div>

        <p className={styles.text}>
          {words.map((word, idx) => (
            <span
              key={idx}
              className={styles.word}
              ref={el => wordsRef.current[idx] = el}
            >
              {word}
            </span>
          ))}
        </p>

        {/* Stats row */}
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>3+</span>
            <span className={styles.statLabel}>Projects Shipped</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>5★</span>
            <span className={styles.statLabel}>HackerRank C</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>∞</span>
            <span className={styles.statLabel}>Curiosity</span>
          </div>
        </div>
      </div>
    </section>
  );
};
