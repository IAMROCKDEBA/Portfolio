import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './Hero.module.css';

export const Hero = () => {
  const titleRefs = useRef([]);
  const subtitleRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.5 } });
    
    tl.to(titleRefs.current, {
      y: '0%',
      opacity: 1,
      stagger: 0.1,
      duration: 1.8,
      delay: 0.2
    })
    .fromTo(subtitleRef.current, 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 },
      "-=1.2"
    );
  }, []);

  const titleText = "DEBARSHI SAU".split("");

  return (
    <section className={`container ${styles.heroContainer}`}>
      <div className={styles.glowBall}></div>
      <h1 className={styles.title}>
        {titleText.map((char, index) => (
          <span 
            key={index} 
            ref={(el) => titleRefs.current[index] = el}
            style={{ display: char === " " ? "inline" : "inline-block" }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </h1>
      <p className={styles.subtitle} ref={subtitleRef}>
        B.Tech Computer Science <span className="text-gradient">&amp;</span> Engineering student at Adamas University.
        <br/>
        Building elegant experiences <span className="text-gradient">&amp;</span> production-ready systems.
      </p>
    </section>
  );
};
