import React, { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Hero.module.css';

gsap.registerPlugin(ScrollTrigger);

// Text scramble effect
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&';

const TextScramble = ({ text, delay = 0, isLoaded }) => {
  const ref = useRef(null);
  const frameRef = useRef(0);

  useEffect(() => {
    if (!isLoaded || !ref.current) return;
    const el = ref.current;
    const original = text;
    let iteration = 0;

    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        el.textContent = original
          .split('')
          .map((char, index) => {
            if (index < iteration) return original[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');

        if (iteration >= original.length) {
          clearInterval(interval);
        }
        iteration += 1 / 3;
      }, 30);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [text, delay, isLoaded]);

  return <span ref={ref} className={styles.scrambleText}>{'\u00A0'}</span>;
};

export const Hero = ({ isLoaded }) => {
  const containerRef = useRef(null);
  const titleLine1Ref = useRef([]);
  const titleLine2Ref = useRef([]);
  const subtitleRef = useRef(null);
  const scrollIndicatorRef = useRef(null);
  const decorRef = useRef([]);

  const line1 = 'DEBARSHI';
  const line2 = 'SAU';

  useEffect(() => {
    if (!isLoaded) return;

    const ctx = gsap.context(() => {
      const masterTl = gsap.timeline({
        defaults: { ease: 'power4.out' }
      });

      // Stagger each character of line 1
      masterTl.fromTo(
        titleLine1Ref.current.filter(Boolean),
        { y: '120%', rotateX: -80 },
        { y: '0%', rotateX: 0, duration: 1.4, stagger: 0.04 },
        0.2
      );

      // Stagger each character of line 2
      masterTl.fromTo(
        titleLine2Ref.current.filter(Boolean),
        { y: '120%', rotateX: -80 },
        { y: '0%', rotateX: 0, duration: 1.4, stagger: 0.04 },
        0.4
      );

      // Subtitle
      masterTl.fromTo(subtitleRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2 },
        1.0
      );

      // Scroll indicator
      masterTl.fromTo(scrollIndicatorRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
        1.5
      );

      // Decorative floating elements
      decorRef.current.filter(Boolean).forEach((el, i) => {
        gsap.fromTo(el,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 0.15 + Math.random() * 0.1,
            duration: 1.5,
            ease: 'elastic.out(1, 0.5)',
            delay: 1 + i * 0.2,
          }
        );

        // Floating animation
        gsap.to(el, {
          y: `+=${15 + Math.random() * 20}`,
          x: `+=${(Math.random() - 0.5) * 15}`,
          duration: 3 + Math.random() * 2,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: i * 0.5,
        });
      });

      // Scroll parallax — hero scales and fades out
      gsap.to(containerRef.current, {
        scale: 0.9,
        opacity: 0,
        y: -100,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isLoaded]);

  return (
    <section className={styles.hero} ref={containerRef} id="hero">
      {/* Decorative elements */}
      <div className={styles.decorations}>
        <div className={styles.decorCircle} ref={el => decorRef.current[0] = el} style={{ top: '15%', left: '8%', width: '60px', height: '60px' }}></div>
        <div className={styles.decorRing} ref={el => decorRef.current[1] = el} style={{ top: '25%', right: '12%', width: '80px', height: '80px' }}></div>
        <div className={styles.decorDot} ref={el => decorRef.current[2] = el} style={{ bottom: '30%', left: '15%', width: '12px', height: '12px' }}></div>
        <div className={styles.decorLine} ref={el => decorRef.current[3] = el} style={{ top: '60%', right: '20%' }}></div>
        <div className={styles.decorCross} ref={el => decorRef.current[4] = el} style={{ bottom: '20%', right: '10%' }}></div>
      </div>

      {/* Glow effects */}
      <div className={styles.glowOrb} style={{ top: '30%', left: '20%', background: 'var(--accent-violet)' }}></div>
      <div className={styles.glowOrb} style={{ bottom: '30%', right: '20%', background: 'var(--accent-cyan)' }}></div>

      <div className={styles.content}>
        {/* Title line 1 */}
        <div className={styles.titleLine}>
          <div className="reveal-mask">
            {line1.split('').map((char, i) => (
              <span
                key={i}
                ref={el => titleLine1Ref.current[i] = el}
                className={styles.char}
                style={{ display: 'inline-block' }}
              >
                {char}
              </span>
            ))}
          </div>
        </div>

        {/* Title line 2 — with gradient */}
        <div className={styles.titleLine}>
          <div className="reveal-mask">
            {line2.split('').map((char, i) => (
              <span
                key={i}
                ref={el => titleLine2Ref.current[i] = el}
                className={`${styles.char} ${styles.charGradient}`}
                style={{ display: 'inline-block' }}
              >
                {char}
              </span>
            ))}
          </div>
        </div>

        {/* Subtitle with scramble */}
        <div className={styles.subtitle} ref={subtitleRef}>
          <TextScramble text="CREATIVE DEVELOPER" delay={1200} isLoaded={isLoaded} />
          <span className={styles.divider}>—</span>
          <TextScramble text="B.TECH CS&E @ ADAMAS UNIVERSITY" delay={1800} isLoaded={isLoaded} />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={styles.scrollIndicator} ref={scrollIndicatorRef}>
        <div className={styles.scrollLine}>
          <div className={styles.scrollDot}></div>
        </div>
        <span className={styles.scrollText}>SCROLL</span>
      </div>
    </section>
  );
};
