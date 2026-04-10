import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Footer.module.css';

gsap.registerPlugin(ScrollTrigger);

// A reusable magnetic link component
const MagneticLink = ({ children, href }) => {
  const linkRef = useRef(null);

  useEffect(() => {
    const el = linkRef.current;
    
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { height, width, left, top } = el.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);
      gsap.to(el, { x: x * 0.3, y: y * 0.3, duration: 0.5, ease: 'power3.out' });
    };

    const handleMouseLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'power3.out' });
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <a href={href} ref={linkRef} className={styles.magneticLink}>
      {children}
    </a>
  );
};

export const Footer = () => {
  const titleRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(titleRef.current,
      { opacity: 0, y: 100 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 1.5,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 80%',
        }
      }
    );
  }, []);

  return (
    <footer className={styles.footerSection}>
      <div className={styles.giantText} ref={titleRef}>
        <span>LET'S</span>
        <a href="mailto:debarshi@outlook.com" className={styles.ctaLink}>TALK</a>
      </div>

      <div className={styles.footerGrid}>
        <div className={styles.column}>
          <h4>Contact & Socials</h4>
          <ul className={styles.socialList}>
            <li><MagneticLink href="mailto:debarshi@outlook.com">debarshi@outlook.com</MagneticLink></li>
            <li><MagneticLink href="#">+91 91993360412</MagneticLink></li>
            <li><MagneticLink href="#">LinkedIn</MagneticLink></li>
            <li><MagneticLink href="#">GitHub</MagneticLink></li>
          </ul>
        </div>
        
        <div className={styles.column}>
          <h4>Certifications</h4>
          <ul className={styles.certList}>
            <li className={styles.certItem}>HackerRank – 5 Star in C</li>
            <li className={styles.certItem}>Udemy / freeCodeCamp – C for Beginners</li>
            <li className={styles.certItem}>TryHackMe / Cybrary – Offensive Security Intro</li>
            <li className={styles.certItem}>AWS – Machine Learning Foundations</li>
          </ul>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <span>© {new Date().getFullYear()} Debarshi Sau</span>
        <span>Based in Barasat, West Bengal</span>
      </div>
    </footer>
  );
};
