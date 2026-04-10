import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import styles from './Footer.module.css';

gsap.registerPlugin(ScrollTrigger);

// Magnetic element that follows cursor
const MagneticLink = ({ children, href, className = '' }) => {
  const linkRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const el = linkRef.current;
    const text = textRef.current;
    if (!el) return;

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { height, width, left, top } = el.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);
      gsap.to(el, { x: x * 0.35, y: y * 0.35, duration: 0.6, ease: 'power3.out' });
      if (text) {
        gsap.to(text, { x: x * 0.15, y: y * 0.15, duration: 0.6, ease: 'power3.out' });
      }
    };

    const handleMouseLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'power3.out' });
      if (text) {
        gsap.to(text, { x: 0, y: 0, duration: 0.6, ease: 'power3.out' });
      }
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <a href={href} ref={linkRef} className={`${styles.magneticLink} ${className}`} data-cursor="hover">
      <span ref={textRef}>{children}</span>
    </a>
  );
};

export const Footer = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const lineRef = useRef(null);
  const linksRef = useRef([]);
  const certsRef = useRef([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Giant CTA reveal
      gsap.fromTo(titleRef.current,
        { y: 150, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1.5, ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          }
        }
      );

      // Animated separator line
      gsap.fromTo(lineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1, duration: 1.2, ease: 'power3.out',
          scrollTrigger: {
            trigger: lineRef.current,
            start: 'top 85%',
          }
        }
      );

      // Stagger social links
      gsap.fromTo(linksRef.current.filter(Boolean),
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: lineRef.current,
            start: 'top 80%',
          }
        }
      );

      // Stagger certifications
      gsap.fromTo(certsRef.current.filter(Boolean),
        { y: 20, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: {
            trigger: lineRef.current,
            start: 'top 75%',
          }
        }
      );

      // Bottom bar
      gsap.fromTo(bottomRef.current,
        { opacity: 0 },
        {
          opacity: 1, duration: 1,
          scrollTrigger: {
            trigger: bottomRef.current,
            start: 'top 95%',
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer className={styles.footer} ref={sectionRef} id="contact">
      {/* Giant CTA */}
      <div className={styles.ctaArea} ref={titleRef}>
        <span className={styles.ctaSmall}>Have a project in mind?</span>
        <div className={styles.ctaGiant}>
          <span>LET'S</span>
          <a href="mailto:debarshi@outlook.com" className={styles.ctaLink} data-cursor="hover">
            <span className={styles.ctaLinkInner}>TALK</span>
            <ArrowUpRight size={64} strokeWidth={2.5} className={styles.ctaArrow} />
          </a>
        </div>
      </div>

      {/* Separator */}
      <div className={styles.separator} ref={lineRef}></div>

      {/* Grid */}
      <div className={styles.grid}>
        <div className={styles.column}>
          <h4 className={styles.colTitle}>Contact & Socials</h4>
          <ul className={styles.linkList}>
            <li ref={el => linksRef.current[0] = el}>
              <MagneticLink href="mailto:debarshi@outlook.com">
                debarshi@outlook.com
              </MagneticLink>
            </li>
            <li ref={el => linksRef.current[1] = el}>
              <MagneticLink href="tel:+919199360412">
                +91 91993 60412
              </MagneticLink>
            </li>
            <li ref={el => linksRef.current[2] = el}>
              <MagneticLink href="#">
                LinkedIn
              </MagneticLink>
            </li>
            <li ref={el => linksRef.current[3] = el}>
              <MagneticLink href="#">
                GitHub
              </MagneticLink>
            </li>
          </ul>
        </div>

        <div className={styles.column}>
          <h4 className={styles.colTitle}>Certifications</h4>
          <ul className={styles.certList}>
            {[
              'HackerRank – 5 Star in C',
              'Udemy / freeCodeCamp – C for Beginners',
              'TryHackMe / Cybrary – Offensive Security Intro',
              'AWS – Machine Learning Foundations',
            ].map((cert, i) => (
              <li key={i} className={styles.certItem} ref={el => certsRef.current[i] = el}>
                <span className={styles.certDot}></span>
                {cert}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className={styles.bottomBar} ref={bottomRef}>
        <span>© {new Date().getFullYear()} Debarshi Sau</span>
        <span className={styles.location}>
          <span className={styles.locationDot}></span>
          Barasat, West Bengal
        </span>
      </div>
    </footer>
  );
};
