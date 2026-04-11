import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { gsap } from 'gsap';
import styles from './Preloader.module.css';

export const Preloader = ({ onComplete }) => {
  const containerRef = useRef(null);
  const counterRef = useRef(null);
  const nameRef = useRef(null);
  const lineRef = useRef(null);
  const yearRef = useRef(null);
  const barsRef = useRef([]);
  const [count, setCount] = useState(0);

  // Set GSAP from-states synchronously before the browser's first paint so the
  // name and line never flash at their natural (fully-visible) CSS positions.
  useLayoutEffect(() => {
    const nameChars = nameRef.current?.querySelectorAll('span');
    if (nameChars?.length) {
      gsap.set(nameChars, { y: '110%', opacity: 0, rotateX: -60 });
    }
    gsap.set(lineRef.current, { scaleX: 0 });
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const counter = { val: 0 };

      // Counter animation
      gsap.to(counter, {
        val: 100,
        duration: 2.8,
        ease: 'power2.inOut',
        onUpdate: () => setCount(Math.floor(counter.val)),
      });

      const tl = gsap.timeline({
        onComplete: () => {
          // flushSync forces React to commit the isLoaded state update in the
          // same RAF frame as this callback, preventing a 1–2 frame gap where
          // the bars are gone but the hero is still visibility:hidden.
          flushSync(() => {
            if (onComplete) onComplete();
          });
        }
      });

      // Line grows with shimmer
      tl.fromTo(lineRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 2.8, ease: 'power2.inOut' },
        0
      );

      // Name reveals with stagger per letter
      const nameChars = nameRef.current?.querySelectorAll('span');
      if (nameChars?.length) {
        tl.fromTo(nameChars,
          { y: '110%', opacity: 0, rotateX: -60 },
          {
            y: '0%', opacity: 1, rotateX: 0,
            duration: 0.8, ease: 'power3.out',
            stagger: 0.03,
          },
          0.4
        );
      }

      // Year/subtitle fade in
      tl.fromTo(yearRef.current,
        { opacity: 0, y: 20 },
        { opacity: 0.3, y: 0, duration: 0.6, ease: 'power3.out' },
        1.0
      );

      // Exit sequence: name flies up with blur
      if (nameChars?.length) {
        tl.to(nameChars, {
          y: '-120%', opacity: 0, rotateX: 40,
          duration: 0.5, ease: 'power3.in',
          stagger: 0.02,
        }, 3.0);
      }

      tl.to(yearRef.current, {
        opacity: 0, y: -20,
        duration: 0.4, ease: 'power3.in',
      }, 3.0);

      tl.to(counterRef.current, {
        y: '-60%', opacity: 0, scale: 0.8,
        duration: 0.5, ease: 'power3.in',
      }, 3.0);

      tl.to(lineRef.current, {
        scaleX: 0, opacity: 0,
        duration: 0.4, ease: 'power3.in',
        transformOrigin: 'right center',
      }, 3.1);

      // Split-panel wipe: multiple bars slide away
      const bars = barsRef.current.filter(Boolean);
      tl.to(bars, {
        yPercent: (i) => (i % 2 === 0 ? -110 : 110),
        duration: 0.8,
        ease: 'power4.inOut',
        stagger: 0.05,
      }, 3.3);

    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  const nameText = 'DEBARSHI SAU';

  return (
    <div className={styles.preloader} ref={containerRef}>
      {/* Split panel wipe bars */}
      <div className={styles.barsContainer}>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={styles.bar}
            ref={el => barsRef.current[i] = el}
          />
        ))}
      </div>

      <div className={styles.content}>
        <div className={styles.nameWrapper} style={{ perspective: '600px' }}>
          <div className={styles.name} ref={nameRef}>
            {nameText.split('').map((char, i) => (
              <span key={i} style={{ display: 'inline-block', willChange: 'transform' }}>
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.line} ref={lineRef}>
          <div className={styles.lineShimmer}></div>
        </div>

        <div className={styles.bottomRow}>
          <span className={styles.year} ref={yearRef}>PORTFOLIO — 2026</span>
          <div className={styles.counterWrapper}>
            <span className={styles.counter} ref={counterRef}>
              {String(count).padStart(3, '0')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
