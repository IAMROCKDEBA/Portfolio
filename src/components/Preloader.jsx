import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import styles from './Preloader.module.css';

export const Preloader = ({ onComplete }) => {
  const containerRef = useRef(null);
  const counterRef = useRef(null);
  const nameRef = useRef(null);
  const lineRef = useRef(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Counter animation
      const counter = { val: 0 };
      gsap.to(counter, {
        val: 100,
        duration: 2.5,
        ease: 'power2.inOut',
        onUpdate: () => setCount(Math.floor(counter.val)),
      });

      // Build the timeline
      const tl = gsap.timeline({
        onComplete: () => {
          if (onComplete) onComplete();
        }
      });

      // Line grows
      tl.fromTo(lineRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 2.5, ease: 'power2.inOut' },
        0
      );

      // Name reveals
      tl.fromTo(nameRef.current,
        { y: '100%', opacity: 0 },
        { y: '0%', opacity: 1, duration: 1, ease: 'power3.out' },
        0.5
      );

      // After counter finishes, wipe out
      tl.to(nameRef.current, {
        y: '-100%',
        opacity: 0,
        duration: 0.6,
        ease: 'power3.in'
      }, 2.8);

      tl.to(counterRef.current, {
        y: '-50%',
        opacity: 0,
        duration: 0.6,
        ease: 'power3.in'
      }, 2.8);

      tl.to(containerRef.current, {
        yPercent: -100,
        duration: 1,
        ease: 'power4.inOut'
      }, 3.2);

    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div className={styles.preloader} ref={containerRef}>
      <div className={styles.content}>
        <div className={styles.nameWrapper}>
          <span className={styles.name} ref={nameRef}>DEBARSHI SAU</span>
        </div>
        <div className={styles.line} ref={lineRef}></div>
        <div className={styles.counterWrapper}>
          <span className={styles.counter} ref={counterRef}>{String(count).padStart(3, '0')}</span>
        </div>
      </div>
    </div>
  );
};
