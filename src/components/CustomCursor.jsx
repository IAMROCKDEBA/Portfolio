import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './CustomCursor.module.css';

export const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const posRef = useRef({ x: 0, y: 0 });
  const isTouch = useRef(false);

  useEffect(() => {
    // Detect touch device
    isTouch.current = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch.current) return;

    const dot = dotRef.current;
    const ring = ringRef.current;

    // Use quickTo for buttery-smooth following
    const xDot = gsap.quickTo(dot, 'x', { duration: 0.15, ease: 'power3.out' });
    const yDot = gsap.quickTo(dot, 'y', { duration: 0.15, ease: 'power3.out' });
    const xRing = gsap.quickTo(ring, 'x', { duration: 0.5, ease: 'power3.out' });
    const yRing = gsap.quickTo(ring, 'y', { duration: 0.5, ease: 'power3.out' });

    const onMouseMove = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      xDot(e.clientX);
      yDot(e.clientY);
      xRing(e.clientX);
      yRing(e.clientY);
    };

    const onMouseEnterHoverable = () => {
      gsap.to(ring, { scale: 2.5, opacity: 0.5, duration: 0.4, ease: 'power3.out' });
      gsap.to(dot, { scale: 0, opacity: 0, duration: 0.3, ease: 'power3.out' });
    };

    const onMouseLeaveHoverable = () => {
      gsap.to(ring, { scale: 1, opacity: 1, duration: 0.4, ease: 'power3.out' });
      gsap.to(dot, { scale: 1, opacity: 1, duration: 0.3, ease: 'power3.out' });
    };

    // Bind to interactive elements
    const bindHoverables = () => {
      const hoverables = document.querySelectorAll('a, button, [data-cursor="hover"]');
      hoverables.forEach(el => {
        el.addEventListener('mouseenter', onMouseEnterHoverable);
        el.addEventListener('mouseleave', onMouseLeaveHoverable);
      });
      return hoverables;
    };

    window.addEventListener('mousemove', onMouseMove);

    // Delay binding to allow DOM to settle
    const timer = setTimeout(() => {
      bindHoverables();
    }, 1000);

    // Re-bind on DOM changes
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
      <div className={styles.dot} ref={dotRef}></div>
      <div className={styles.ring} ref={ringRef}></div>
    </>
  );
};
