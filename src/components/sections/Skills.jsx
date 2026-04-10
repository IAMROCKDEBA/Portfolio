import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './Skills.module.css';

const row1 = ["Python", "C++", "JavaScript", "Java", "C", "TypeScript"];
const row2 = ["React 18", "Three.js", "Node.js", "Express.js", "Vite", "HTML5/CSS3"];
const row3 = ["PostgreSQL", "MongoDB", "MediaPipe", "Git & GitHub", "PowerShell"];

const MarqueeRow = ({ items, speed = 20, direction = 1, reverseColor = false }) => {
  const trackRef = useRef(null);
  const trackRef2 = useRef(null);
  
  useEffect(() => {
    // Infinite smooth scrolling using GSAP
    const xPercent = direction === 1 ? -100 : 100;
    
    gsap.to([trackRef.current, trackRef2.current], {
      xPercent: xPercent,
      ease: "none",
      duration: speed,
      repeat: -1,
    });
  }, [speed, direction]);

  return (
    <div className={styles.marqueeContainer}>
      <div className={styles.marqueeTrack} ref={trackRef}>
        {items.map((item, idx) => (
          <React.Fragment key={idx}>
            <span className={`${styles.skillItem} ${reverseColor ? styles.alt : ''}`}>
              {item}
            </span>
            <div className={styles.separator}></div>
          </React.Fragment>
        ))}
      </div>
      <div className={styles.marqueeTrack} ref={trackRef2}>
        {items.map((item, idx) => (
          <React.Fragment key={`clone-${idx}`}>
            <span className={`${styles.skillItem} ${reverseColor ? styles.alt : ''}`}>
              {item}
            </span>
            <div className={styles.separator}></div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export const Skills = () => {
  return (
    <section className={styles.skillsSection}>
      <MarqueeRow items={row1} speed={25} direction={1} />
      <MarqueeRow items={row2} speed={30} direction={-1} reverseColor={true} />
      <MarqueeRow items={row3} speed={28} direction={1} />
    </section>
  );
};
