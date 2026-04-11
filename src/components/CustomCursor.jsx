import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './CustomCursor.module.css';

export const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const glowRef = useRef(null);
  const trailRefs = useRef([]);
  const posRef = useRef({ x: -100, y: -100 });
  const isTouch = useRef(false);

  useEffect(() => {
    isTouch.current = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch.current) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const glow = glowRef.current;
    const trails = trailRefs.current.filter(Boolean);

    // Use quickTo for buttery-smooth following
    const xDot = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'power3.out' });
    const yDot = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'power3.out' });
    const xRing = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3.out' });
    const yRing = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3.out' });
    const xGlow = gsap.quickTo(glow, 'x', { duration: 0.6, ease: 'power3.out' });
    const yGlow = gsap.quickTo(glow, 'y', { duration: 0.6, ease: 'power3.out' });

    // Trail quickTo - each has progressively more delay
    const trailQuickTos = trails.map((trail, i) => ({
      x: gsap.quickTo(trail, 'x', { duration: 0.2 + i * 0.1, ease: 'power3.out' }),
      y: gsap.quickTo(trail, 'y', { duration: 0.2 + i * 0.1, ease: 'power3.out' }),
    }));

    const onMouseMove = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      xDot(e.clientX);
      yDot(e.clientY);
      xRing(e.clientX);
      yRing(e.clientY);
      xGlow(e.clientX);
      yGlow(e.clientY);

      trailQuickTos.forEach(({ x, y }) => {
        x(e.clientX);
        y(e.clientY);
      });
    };

    const onMouseEnterHoverable = () => {
      gsap.to(ring, { scale: 2.5, opacity: 0.3, duration: 0.4, ease: 'power3.out', borderColor: 'rgba(138, 92, 245, 0.5)' });
      gsap.to(dot, { scale: 0, opacity: 0, duration: 0.3, ease: 'power3.out' });
      gsap.to(glow, { scale: 1.5, opacity: 0.15, duration: 0.4, ease: 'power3.out' });
    };

    const onMouseLeaveHoverable = () => {
      gsap.to(ring, { scale: 1, opacity: 1, duration: 0.4, ease: 'power3.out', borderColor: 'rgba(240, 238, 246, 0.8)' });
      gsap.to(dot, { scale: 1, opacity: 1, duration: 0.3, ease: 'power3.out' });
      gsap.to(glow, { scale: 1, opacity: 0.08, duration: 0.4, ease: 'power3.out' });
    };

    const bindHoverables = () => {
      const hoverables = document.querySelectorAll('a, button, [data-cursor="hover"]');
      hoverables.forEach(el => {
        el.addEventListener('mouseenter', onMouseEnterHoverable);
        el.addEventListener('mouseleave', onMouseLeaveHoverable);
      });
      return hoverables;
    };

    window.addEventListener('mousemove', onMouseMove);

    const timer = setTimeout(() => {
      bindHoverables();
    }, 1000);

    const observer = new MutationObserver(() => {
      bindHoverables();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  // Don't render on touch devices
  if (typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
    return null;
  }

  return (
    <>
      {/* Trail ghosts */}
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className={styles.trail}
          ref={el => trailRefs.current[i] = el}
          style={{ opacity: 0.15 - i * 0.04 }}
        />
      ))}
      <div className={styles.glow} ref={glowRef}></div>
      <div className={styles.dot} ref={dotRef}></div>
      <div className={styles.ring} ref={ringRef}></div>
    </>
  );
};
