import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Award, Code, Shield, Brain } from 'lucide-react';
import styles from './Certifications.module.css';

gsap.registerPlugin(ScrollTrigger);

const certifications = [
  {
    title: '5 Star in C',
    issuer: 'HackerRank',
    icon: <Code size={22} />,
    color: '#22c55e',
    description: 'Achieved the highest rank in C programming with expert-level problem solving.',
  },
  {
    title: 'C for Beginners',
    issuer: 'Udemy / freeCodeCamp',
    icon: <Award size={22} />,
    color: '#8a5cf5',
    description: 'Comprehensive course covering fundamentals through advanced C programming concepts.',
  },
  {
    title: 'Offensive Security Intro',
    issuer: 'TryHackMe / Cybrary',
    icon: <Shield size={22} />,
    color: '#ff2d75',
    description: 'Introduction to ethical hacking, penetration testing, and cybersecurity fundamentals.',
  },
  {
    title: 'ML Foundations',
    issuer: 'AWS',
    icon: <Brain size={22} />,
    color: '#00e5ff',
    description: 'Machine Learning foundations including supervised learning, neural networks, and AWS ML services.',
  },
];

export const Certifications = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading
      gsap.fromTo(headingRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1.2, ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          }
        }
      );

      // Cards stagger in
      cardsRef.current.filter(Boolean).forEach((card, i) => {
        gsap.fromTo(card,
          { y: 60, opacity: 0, scale: 0.95 },
          {
            y: 0, opacity: 1, scale: 1,
            duration: 0.8,
            ease: 'power3.out',
            delay: i * 0.1,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 65%',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Spotlight on card
  const handleMouseMove = (e, index) => {
    const card = cardsRef.current[index];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--cx', `${e.clientX - rect.left}px`);
    card.style.setProperty('--cy', `${e.clientY - rect.top}px`);
  };

  return (
    <section className={styles.section} ref={sectionRef} id="certifications">
      <div className={styles.container}>
        <div className={styles.header} ref={headingRef}>
          <span className="section-label">
            <span>Credentials</span>
          </span>
          <h2 className={styles.title}>
            <span className={styles.titleStroke}>Verified</span> Certifications
          </h2>
        </div>

        <div className={styles.grid}>
          {certifications.map((cert, idx) => (
            <div
              key={idx}
              className={styles.card}
              ref={el => cardsRef.current[idx] = el}
              onMouseMove={(e) => handleMouseMove(e, idx)}
              style={{ '--card-accent': cert.color }}
              data-cursor="hover"
            >
              {/* Spotlight glow */}
              <div className={styles.spotlight}></div>

              {/* Top row */}
              <div className={styles.cardTop}>
                <div className={styles.iconWrap}>
                  {cert.icon}
                </div>
                <span className={styles.issuer}>{cert.issuer}</span>
              </div>

              {/* Content */}
              <h3 className={styles.certTitle}>{cert.title}</h3>
              <p className={styles.certDesc}>{cert.description}</p>

              {/* Bottom accent line */}
              <div className={styles.accentLine}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
