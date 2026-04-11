import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import styles from './Projects.module.css';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    num: '01',
    title: 'ClassConnect',
    category: 'Full-Stack Platform',
    tech: ['React', 'Node.js', 'Express', 'PostgreSQL', 'JWT'],
    description: 'Architected and deployed a full-stack student-mentor management platform with secure JWT-based role-based access control. Built real-time problem tracking, analytics dashboards, and automated reporting modules.',
    color: '#8a5cf5',
  },
  {
    num: '02',
    title: 'Altplate',
    category: 'Enterprise App',
    tech: ['React', 'Node.js', 'Express', 'MongoDB', 'RBAC'],
    description: 'Engineered a university food-court management application replacing error-prone manual processes. Implemented secure role-based dashboards for students, wardens, and staff with real-time submission tracking.',
    color: '#00e5ff',
  },
  {
    num: '03',
    title: 'PC Sentinel',
    category: 'IoT Monitoring',
    tech: ['Node.js', 'Express', 'PowerShell', 'Telegram API'],
    description: 'Developed a bot-integrated application to remotely monitor a home PC server via Telegram with real-time push alerts. Implemented PowerShell agent and Node.js backend for heartbeat signal relay.',
    color: '#ff2d75',
  },
];

export const Projects = () => {
  const wrapperRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef([]);
  const progressRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(headerRef.current,
        { y: 80, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1.2, ease: 'power3.out',
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: 'top 80%',
          }
        }
      );

      // Stacking cards — each card pins and the next one stacks on top
      const cards = cardsRef.current.filter(Boolean);

      cards.forEach((card, i) => {
        const isLast = i === cards.length - 1;

        // Scale down slightly as subsequent cards stack
        if (!isLast) {
          gsap.to(card, {
            scale: 0.92 - i * 0.02,
            opacity: 0.6,
            ease: 'none',
            scrollTrigger: {
              trigger: cards[i + 1],
              start: 'top bottom',
              end: 'top 20%',
              scrub: 1,
            }
          });
        }

        // Reveal animation for each card
        const content = card.querySelector('[data-content]');
        const num = card.querySelector('[data-num]');
        const title = card.querySelector('[data-title]');
        const desc = card.querySelector('[data-desc]');
        const techEls = card.querySelectorAll('[data-tech]');
        const cta = card.querySelector('[data-cta]');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          }
        });

        if (num) tl.fromTo(num, { y: 60, opacity: 0, scale: 0.8 }, { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out' }, 0);
        if (title) tl.fromTo(title, { y: 40, opacity: 0, filter: 'blur(8px)' }, { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out' }, 0.1);
        if (desc) tl.fromTo(desc, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, 0.25);
        if (techEls.length) tl.fromTo(techEls, { y: 20, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out', stagger: 0.05 }, 0.35);
        if (cta) tl.fromTo(cta, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }, 0.5);
      });

      // Progress bar
      gsap.to(progressRef.current, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        },
      });
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  // Spotlight / cursor glow on card
  const handleMouseMove = (e, index) => {
    const card = cardsRef.current[index];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mx', `${x}px`);
    card.style.setProperty('--my', `${y}px`);
  };

  return (
    <section className={styles.wrapper} ref={wrapperRef} id="projects">
      {/* Section header */}
      <div className={styles.header} ref={headerRef}>
        <div className={styles.headerInner}>
          <span className="section-label">
            <span>Selected Work</span>
          </span>
          <h2 className={styles.sectionTitle}>
            <span className={styles.titleStroke}>Featured</span> Projects
          </h2>
        </div>
        {/* Progress */}
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} ref={progressRef}></div>
        </div>
      </div>

      {/* Stacking cards */}
      <div className={styles.cardsContainer}>
        {projects.map((proj, idx) => (
          <div
            key={idx}
            className={styles.cardWrapper}
            ref={el => cardsRef.current[idx] = el}
            onMouseMove={(e) => handleMouseMove(e, idx)}
            style={{ '--accent': proj.color }}
          >
            <div className={styles.card}>
              {/* Large project number */}
              <div className={styles.projectNum} data-num>{proj.num}</div>

              <div className={styles.cardContent} data-content>
                <div className={styles.cardTop}>
                  <span className={styles.category} data-tech>{proj.category}</span>
                  <div className={styles.techStack}>
                    {proj.tech.map((t, i) => (
                      <span key={i} className={styles.techBadge} data-tech>{t}</span>
                    ))}
                  </div>
                </div>

                <h3 className={styles.projectTitle} data-title>{proj.title}</h3>

                <p className={styles.projectDesc} data-desc>{proj.description}</p>

                <div className={styles.cardFooter} data-cta data-cursor="hover">
                  <span className={styles.viewProject}>View Project</span>
                  <ArrowUpRight size={18} />
                </div>
              </div>

              {/* Cursor spotlight */}
              <div className={styles.spotlight}></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
