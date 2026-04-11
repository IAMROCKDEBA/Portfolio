import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Award, Code, Shield, Brain } from 'lucide-react';
import styles from './Certifications.module.css';

gsap.registerPlugin(ScrollTrigger);

const certifications = [
  {
    title: '5 Star in HackerRank',
    issuer: 'HackerRank',
    icon: <Code size={22} />,
    color: '#22c55e',
    emoji: '★',
    description: 'Achieved the highest rank in C programming with expert-level problem solving.',
  },
  {
    title: 'C for Beginners',
    issuer: 'Udemy / freeCodeCamp',
    icon: <Award size={22} />,
    color: '#8a5cf5',
    emoji: '📜',
    description: 'Comprehensive course covering fundamentals through advanced C programming concepts.',
  },
  {
    title: 'Offensive Security Intro',
    issuer: 'TryHackMe / Cybrary',
    icon: <Shield size={22} />,
    color: '#ff2d75',
    emoji: '🔒',
    description: 'Introduction to ethical hacking, penetration testing, and cybersecurity fundamentals.',
  },
  {
    title: 'ML Foundations',
    issuer: 'AWS',
    icon: <Brain size={22} />,
    color: '#00e5ff',
    emoji: '🧠',
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

      // Cards cascade in with 3D flip
      cardsRef.current.filter(Boolean).forEach((card, i) => {
        gsap.fromTo(card,
          {
            y: 80,
            opacity: 0,
            rotateY: -15,
            rotateX: 10,
            scale: 0.9,
          },
          {
            y: 0,
            opacity: 1,
            rotateY: 0,
            rotateX: 0,
            scale: 1,
            duration: 1,
            ease: 'power3.out',
            delay: i * 0.12,
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

  // 3D tilt + spotlight + holographic shimmer
  const handleMouseMove = (e, index) => {
    const card = cardsRef.current[index];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Tilt calculation
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    card.style.setProperty('--cx', `${x}px`);
    card.style.setProperty('--cy', `${y}px`);
    card.style.setProperty('--rx', `${rotateX}deg`);
    card.style.setProperty('--ry', `${rotateY}deg`);

    // Holographic shimmer position
    const shimmerX = (x / rect.width) * 100;
    const shimmerY = (y / rect.height) * 100;
    card.style.setProperty('--shimmer-x', `${shimmerX}%`);
    card.style.setProperty('--shimmer-y', `${shimmerY}%`);
  };

  const handleMouseLeave = (index) => {
    const card = cardsRef.current[index];
    if (!card) return;
    card.style.setProperty('--rx', '0deg');
    card.style.setProperty('--ry', '0deg');
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
              onMouseLeave={() => handleMouseLeave(idx)}
              style={{ '--card-accent': cert.color }}
              data-cursor="hover"
            >
              {/* Holographic shimmer overlay */}
              <div className={styles.holoShimmer}></div>
              {/* Spotlight glow */}
              <div className={styles.spotlight}></div>
              {/* Glow border pulse */}
              <div className={styles.glowBorder}></div>

              {/* Floating badge */}
              <div className={styles.floatingBadge}>{cert.emoji}</div>

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
