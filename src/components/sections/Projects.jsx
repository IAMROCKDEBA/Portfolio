import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Activity, ShieldCheck, Server } from 'lucide-react';
import styles from './Projects.module.css';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    title: "ClassConnect",
    tech: ["React", "Node.js", "Express", "PostgreSQL", "JWT"],
    icon: <Activity size={32} className={styles.bulletIcon} />,
    points: [
      "Architected and deployed a full-stack student-mentor management platform with secure JWT-based role-based access control, supporting multiple user roles (student, mentor, admin).",
      "Built real-time problem tracking, analytics dashboards, and automated reporting modules, reducing manual administrative effort significantly.",
      "Designed a scalable, responsive UI in React with custom CSS; integrated RESTful APIs and nodemon/dotenv for streamlined development workflows.",
    ]
  },
  {
    title: "Altplate",
    tech: ["React", "Node.js", "Express", "MongoDB", "Role-Based Auth"],
    icon: <ShieldCheck size={32} className={styles.bulletIcon} />,
    points: [
      "Engineered a full-stack university food-court management application to replace error-prone manual meal selection and parcel-management processes.",
      "Implemented secure role-based dashboards for students, wardens, and staff, enabling real-time submission tracking and automated data handling.",
      "Reduced operational errors and improved accountability by digitising the entire food-selection workflow end-to-end.",
    ]
  },
  {
    title: "PC Sentinel",
    tech: ["Node.js", "Express", "PowerShell", "Telegram Bot API"],
    icon: <Server size={32} className={styles.bulletIcon} />,
    points: [
      "Developed a bot-integrated web application to remotely monitor a home PC server's online/offline status via Telegram with real-time push alerts.",
      "Implemented a PowerShell agent on the host machine and a Node.js/Express backend to relay heartbeat signals and trigger Telegram notifications on downtime.",
    ]
  }
];

export const Projects = () => {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    cardsRef.current.forEach((card, i) => {
      gsap.fromTo(card, 
        { y: 100, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 1, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });
  }, []);

  const handleMouseMove = (e, index) => {
    const card = cardsRef.current[index];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--x', `${x}px`);
    card.style.setProperty('--y', `${y}px`);
  };

  return (
    <section className={styles.projectsWrapper} ref={containerRef}>
      <div className={styles.titleContainer}>
        <h2 className={styles.sectionTitle}>Selected Works</h2>
      </div>
      <div className={styles.projectsContainer}>
        {projects.map((proj, idx) => (
          <div 
            key={idx} 
            className={styles.projectCard}
            ref={el => cardsRef.current[idx] = el}
            onMouseMove={(e) => handleMouseMove(e, idx)}
          >
            <div className={styles.projectContent}>
              <div className={styles.projectHeader}>
                <h3 className={styles.projectTitle}>{proj.title}</h3>
                <div className={styles.techStack}>
                  {proj.tech.map((t, i) => (
                    <span key={i} className={styles.techBadge}>{t}</span>
                  ))}
                </div>
              </div>
              <div className={styles.projectDescription}>
                {proj.points.map((pt, i) => (
                  <div key={i} className={styles.bullet}>
                    {i === 0 ? proj.icon : <ArrowRight size={24} className={styles.bulletIcon} />}
                    <p>{pt}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
