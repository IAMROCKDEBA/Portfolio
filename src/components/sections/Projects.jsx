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
  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  const headerRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const container = containerRef.current;
      const totalWidth = container.scrollWidth - window.innerWidth;

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

      // Horizontal scroll
      const scrollTween = gsap.to(container, {
        x: -totalWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: 'top top',
          end: () => `+=${totalWidth}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Progress bar
      gsap.to(progressRef.current, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: 'top top',
          end: () => `+=${totalWidth}`,
          scrub: 1,
        },
      });

      // Per-card reveal animations (within horizontal scroll)
      cardsRef.current.filter(Boolean).forEach((card, i) => {
        gsap.fromTo(card,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              containerAnimation: scrollTween,
              start: 'left 80%',
              toggleActions: 'play none none reverse',
            }
          }
        );
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
        {/* Horizontal progress */}
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} ref={progressRef}></div>
        </div>
      </div>

      {/* Horizontal scroll container */}
      <div className={styles.scrollContainer} ref={containerRef}>
        {projects.map((proj, idx) => (
          <div
            key={idx}
            className={styles.panel}
          >
            <div
              className={styles.card}
              ref={el => cardsRef.current[idx] = el}
              onMouseMove={(e) => handleMouseMove(e, idx)}
              style={{ '--accent': proj.color }}
            >
              {/* Large project number */}
              <div className={styles.projectNum}>{proj.num}</div>

              <div className={styles.cardContent}>
                <div className={styles.cardTop}>
                  <span className={styles.category}>{proj.category}</span>
                  <div className={styles.techStack}>
                    {proj.tech.map((t, i) => (
                      <span key={i} className={styles.techBadge}>{t}</span>
                    ))}
                  </div>
                </div>

                <h3 className={styles.projectTitle}>{proj.title}</h3>

                <p className={styles.projectDesc}>{proj.description}</p>

                <div className={styles.cardFooter} data-cursor="hover">
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
