import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './About.module.css';

gsap.registerPlugin(ScrollTrigger);

export const About = () => {
  const containerRef = useRef(null);
  const wordsRef = useRef([]);

  const text = "Results-driven B.Tech Computer Science & Engineering (AI/ML) student at Adamas University. Proficient in Python, C++, and JavaScript with a strong foundation in modern software architecture. Passionate about solving real-world problems and building high-performance production-ready systems.";
  
  const words = text.split(" ");

  useEffect(() => {
    // GSAP ScrollTrigger to illuminate text as we scroll
    gsap.to(wordsRef.current, {
      opacity: 1,
      color: '#f5f5f5',
      stagger: 0.1,
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 70%",
        end: "bottom 60%",
        scrub: 1, // Smooth scrubbing
      }
    });
  }, []);

  return (
    <section className={styles.aboutSection} ref={containerRef}>
      <div className={styles.textContainer}>
        <p className={styles.cinematicText}>
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
      </div>
    </section>
  );
};
