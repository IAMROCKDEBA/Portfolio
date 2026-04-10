import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSmoothScroll } from '../../context/SmoothScroll';
import styles from './Skills.module.css';

gsap.registerPlugin(ScrollTrigger);

const row1 = ['Python', 'C++', 'JavaScript', 'Java', 'C', 'TypeScript'];
const row2 = ['React 18', 'Three.js', 'Node.js', 'Express.js', 'Vite', 'HTML5/CSS3'];
const row3 = ['PostgreSQL', 'MongoDB', 'MediaPipe', 'Git & GitHub', 'PowerShell'];

const VelocityMarquee = ({ items, baseSpeed = 1, direction = 1, reverseColor = false }) => {
  const trackRef = useRef(null);
  const xRef = useRef(0);
  const animRef = useRef(null);
  const lenis = useSmoothScroll();

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Duplicate children for seamless loop  
    const trackWidth = track.scrollWidth / 2;
    let velocity = 0;

    const animate = () => {
      // Get scroll velocity from Lenis if available
      const scrollVelocity = lenis ? Math.abs(lenis.velocity) : 0;
      const speedMultiplier = 1 + scrollVelocity * 0.08;

      // Skew based on velocity direction
      const skewTarget = lenis ? lenis.velocity * 0.3 : 0;
      velocity += (skewTarget - velocity) * 0.1;

      xRef.current += baseSpeed * direction * speedMultiplier;

      // Reset position for seamless loop
      if (direction === 1 && xRef.current >= trackWidth) {
        xRef.current -= trackWidth;
      } else if (direction === -1 && Math.abs(xRef.current) >= trackWidth) {
        xRef.current += trackWidth;
      }

      track.style.transform = `translateX(${-xRef.current}px) skewX(${velocity}deg)`;
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [baseSpeed, direction, lenis]);

  // Duplicate items for seamless wrap
  const allItems = [...items, ...items];

  return (
    <div className={styles.marqueeContainer}>
      <div className={styles.marqueeTrack} ref={trackRef}>
        {allItems.map((item, idx) => (
          <React.Fragment key={idx}>
            <span
              className={`${styles.skillItem} ${reverseColor ? styles.alt : ''}`}
              data-cursor="hover"
            >
              {item}
            </span>
            <div className={styles.separator}>✦</div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export const Skills = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headingRef.current,
        { x: -80, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 1.2, ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.skills} ref={sectionRef} id="skills">
      <div className={styles.headingRow} ref={headingRef}>
        <span className="section-label">
          <span>Tech Stack</span>
        </span>
      </div>
      <div className={styles.marqueeGroup}>
        <VelocityMarquee items={row1} baseSpeed={0.8} direction={1} />
        <VelocityMarquee items={row2} baseSpeed={1.0} direction={-1} reverseColor />
        <VelocityMarquee items={row3} baseSpeed={0.9} direction={1} />
      </div>
    </section>
  );
};
