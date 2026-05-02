import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './About.module.css';

gsap.registerPlugin(ScrollTrigger);

// ── Animated Counter ──
const AnimatedStat = ({ value, label, suffix = '', index }) => {
  const numRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parse numeric value
      const numericVal = parseFloat(value);

      if (!isNaN(numericVal)) {
        const counter = { val: 0 };
        gsap.to(counter, {
          val: numericVal,
          duration: 2,
          ease: 'power2.out',
          delay: index * 0.2,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
          },
          onUpdate: () => {
            if (numRef.current) {
              numRef.current.textContent = Math.floor(counter.val) + suffix;
            }
          }
        });
      }

      gsap.fromTo(containerRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          delay: 0.2 + index * 0.15,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [value, suffix, index]);

  return (
    <div className={styles.stat} ref={containerRef}>
      <span className={styles.statNumber} ref={numRef}>{value === '∞' ? '∞' : '0' + suffix}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  );
};

export const About = () => {
  const containerRef = useRef(null);
  const wordsRef = useRef([]);
  const labelRef = useRef(null);
  const decorLineRef = useRef(null);
  const watermarkRef = useRef(null);
  const imageRef = useRef(null);

  const text = "Results-driven B.Tech Computer Science & Engineering student at Adamas University. Proficient in Python, C++, and JavaScript with a strong foundation in modern software architecture. Passionate about solving real-world problems and building high-performance production-ready systems.";
  const words = text.split(' ');

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Watermark parallax
      gsap.fromTo(watermarkRef.current,
        { x: -200, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 1.5, ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
          }
        }
      );

      gsap.to(watermarkRef.current, {
        y: -100,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        }
      });

      // Section label reveal
      gsap.fromTo(labelRef.current,
        { x: -50, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
          }
        }
      );

      // Decorative line
      gsap.fromTo(decorLineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1, duration: 1.5, ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%',
          }
        }
      );

      // Left profile image animation
      gsap.fromTo(imageRef.current,
        { scale: 0.8, opacity: 0, y: 30 },
        {
          scale: 1, opacity: 1, y: 0,
          duration: 1.2, ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%',
          }
        }
      );

      // Word-by-word cinematic reveal — one GSAP timeline scrubbed by one
      // ScrollTrigger. Timing is identical to the original 47 individual tweens:
      // each word reveals over 60px of scroll, staggered 12px apart.
      //
      // Using `animation: wordsTl` instead of an `onUpdate` callback lets GSAP
      // own all transforms through its internal cache. The previous approach used
      // gsap.set() (which wrote _gsap.y = 8) then overwrote transforms via direct
      // style mutations — when the scrub tween reconciled its cached state it reset
      // elements to y:8, producing the snap-jump. The timeline also only re-renders
      // the 1–2 tweens crossing the playhead per frame instead of all 47.
      const wordsArray = wordsRef.current.filter(Boolean);
      const wordCount  = wordsArray.length;
      // totalRange matches the original: last word ends at (wordCount-1)*12 + 60
      const totalRange = (wordCount - 1) * 12 + 60;

      const wordsTl = gsap.timeline({ paused: true });
      wordsArray.forEach((word, i) => {
        wordsTl.fromTo(
          word,
          { opacity: 0.08, y: 8, filter: 'blur(4px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', color: 'var(--text-primary)', ease: 'none', duration: 60 },
          i * 12
        );
      });

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top 60%',
        end: `top+=${totalRange} 60%`,
        animation: wordsTl,
        scrub: 1,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.about} ref={containerRef} id="about">
      {/* Background watermark */}
      <div className={styles.watermark} ref={watermarkRef}>ABOUT</div>

      <div className={styles.inner}>
        <div className={styles.splitLayout}>
          {/* Left: Profile Picture */}
          <div className={styles.leftColumn}>
            <div className={styles.imageContainer} ref={imageRef}>
              <img src="/image.jpg" alt="Debarshi Sau — Full-Stack Developer and Creative Technologist" className={styles.profileImage} />
            </div>
          </div>

          {/* Right: Content */}
          <div className={styles.rightColumn}>
            <div className="section-label" ref={labelRef}>
              <span>About Me</span>
            </div>

            <div className={styles.decorLine} ref={decorLineRef}></div>

            <p className={styles.text}>
              {words.map((word, idx) => (
                <span
                  key={idx}
                  className={styles.word}
                  ref={el => wordsRef.current[idx] = el}
                >
                  {word}
                </span>
              ))}
            </p>

            {/* Stats row */}
            <div className={styles.stats}>
              <AnimatedStat value="3" suffix="+" label="Projects Shipped" index={0} />
              <AnimatedStat value="5" suffix="★" label="HackerRank C" index={1} />
              <AnimatedStat value="∞" suffix="" label="Curiosity" index={2} />
            </div>
          </div>
        </div>

        {/* ── Photo Gallery ── */}
        <div className={styles.gallery}>
          <div className={styles.galleryHeader}>
            <span className={styles.galleryLabel}>Moments</span>
            <div className={styles.galleryLine}></div>
          </div>
          <div className={styles.galleryGrid}>
            {[
              {
                src: '/debarshi-sau-conference.jpg',
                alt: 'Debarshi Sau at a professional conference — full-stack developer and creative technologist',
                caption: 'Conference'
              },
              {
                src: '/debarshi-sau-delhiAiImapct.jpg',
                alt: 'Debarshi Sau at AI Impact Summit 2026 India — exploring artificial intelligence innovations',
                caption: 'AI Impact Summit 2026'
              },
              {
                src: '/debarshi-sau-quantumcomputing.jpg',
                alt: 'Debarshi Sau with IBM Quantum System Two — quantum computing exploration at tech summit',
                caption: 'IBM Quantum Computing'
              }
            ].map((photo, idx) => (
              <figure key={idx} className={styles.galleryItem}>
                <div className={styles.galleryImageWrap}>
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className={styles.galleryImage}
                    loading="lazy"
                  />
                </div>
                <figcaption className={styles.galleryCaption}>{photo.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
