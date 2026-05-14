import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const Experience = () => {
  const sectionRef = useRef<HTMLElement>(null)

  // ── Image grid refs ──
  const colLeftRef = useRef<HTMLDivElement>(null)
  const colRightRef = useRef<HTMLDivElement>(null)
  const img1Ref = useRef<HTMLImageElement>(null)
  const img2Ref = useRef<HTMLImageElement>(null)
  const accentCardRef = useRef<HTMLDivElement>(null)

  // ── Text refs ──
  const titleRef = useRef<HTMLHeadingElement>(null)
  const paraRef = useRef<HTMLParagraphElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const trigger = {
        trigger: sectionRef.current,
        start: 'top 72%',
      }

      // ════════════════════════════════════════════════════════════════
      // COLONNE GAUCHE — images décalées en parallax divergent
      // ════════════════════════════════════════════════════════════════

      // Colonne gauche — slide depuis la gauche
      gsap.fromTo(
        colLeftRef.current,
        { x: -60, opacity: 0 },
        {
          x: 0, opacity: 1,
          duration: 1.0,
          ease: 'power3.out',
          scrollTrigger: trigger,
        }
      )

      // Colonne droite — slide depuis la droite, légèrement décalée
      gsap.fromTo(
        colRightRef.current,
        { x: 60, opacity: 0 },
        {
          x: 0, opacity: 1,
          duration: 1.0,
          ease: 'power3.out',
          delay: 0.12,
          scrollTrigger: trigger,
        }
      )

      // Image 1 (col gauche) — scale reveal
      gsap.fromTo(
        img1Ref.current,
        { scale: 1.08 },
        {
          scale: 1,
          duration: 1.3,
          ease: 'power2.out',
          scrollTrigger: trigger,
        }
      )

      // Image 2 (col droite) — scale reveal décalé
      gsap.fromTo(
        img2Ref.current,
        { scale: 1.08 },
        {
          scale: 1,
          duration: 1.3,
          ease: 'power2.out',
          delay: 0.15,
          scrollTrigger: trigger,
        }
      )

      // Carte accent "Accompagnement" — pop avec rebond
      gsap.fromTo(
        accentCardRef.current,
        { scale: 0.75, opacity: 0, y: 20 },
        {
          scale: 1, opacity: 1, y: 0,
          duration: 0.75,
          ease: 'back.out(1.5)',
          delay: 0.4,
          scrollTrigger: trigger,
        }
      )

      // ── Parallax scroll divergent (masonry vivant) ──────────────────
      // Col gauche monte plus vite
      gsap.to(colLeftRef.current, {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.4,
        },
      })

      // Col droite monte moins vite — divergence entre les deux colonnes
      gsap.to(colRightRef.current, {
        yPercent: -4,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.4,
        },
      })

      // ── Hover tilt 3D — image 1 ──────────────────────────────────────
      const setupTilt = (el: HTMLImageElement | null) => {
        if (!el) return
        const ryTo = gsap.quickTo(el, 'rotateY', { duration: 0.45, ease: 'power1.out' })
        const rxTo = gsap.quickTo(el, 'rotateX', { duration: 0.45, ease: 'power1.out' })
        const onMove = (e: MouseEvent) => {
          const r = el.getBoundingClientRect()
          ryTo(((e.clientX - r.left - r.width / 2) / (r.width / 2)) * 5)
          rxTo(-((e.clientY - r.top - r.height / 2) / (r.height / 2)) * 3)
        }
        const onLeave = () =>
          gsap.to(el, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'power2.out' })
        el.addEventListener('mousemove', onMove)
        el.addEventListener('mouseleave', onLeave)
      }

      setupTilt(img1Ref.current)
      setupTilt(img2Ref.current)

      // ════════════════════════════════════════════════════════════════
      // COLONNE DROITE — titre, para, features
      // ════════════════════════════════════════════════════════════════

      const textTrigger = {
        trigger: titleRef.current,
        start: 'top 78%',
      }

      // Titre — slide up
      gsap.fromTo(
        titleRef.current,
        { y: 44, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: textTrigger,
        }
      )

      // Paragraphe
      gsap.fromTo(
        paraRef.current,
        { y: 28, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.75,
          ease: 'power2.out',
          delay: 0.12,
          scrollTrigger: textTrigger,
        }
      )

      // Features — zigzag : pairs depuis droite, impairs depuis gauche
      const features = featuresRef.current?.querySelectorAll('.feature-item')
      if (features) {
        features.forEach((feature, i) => {
          const isEven = i % 2 === 0
          gsap.fromTo(
            feature,
            { x: isEven ? -30 : 30, opacity: 0 },
            {
              x: 0, opacity: 1,
              duration: 0.6,
              ease: 'power2.out',
              delay: 0.2 + i * 0.1,
              scrollTrigger: textTrigger,
            }
          )
        })
      }

      // ── Icônes features — pop séquentiel ────────────────────────────
      const featureIcons = featuresRef.current?.querySelectorAll('.feature-icon')
      if (featureIcons) {
        featureIcons.forEach((icon, i) => {
          gsap.fromTo(
            icon,
            { scale: 0, rotate: -20 },
            {
              scale: 1, rotate: 0,
              duration: 0.5,
              ease: 'back.out(1.8)',
              delay: 0.3 + i * 0.1,
              scrollTrigger: textTrigger,
            }
          )
        })
      }

      // ── Hover micro-bounce sur chaque feature ───────────────────────
      const featureItems = featuresRef.current?.querySelectorAll('.feature-item')
      featureItems?.forEach(item => {
        item.addEventListener('mouseenter', () => {
          gsap.to(item.querySelector('.feature-icon'), {
            scale: 1.2,
            rotate: 8,
            duration: 0.25,
            ease: 'power2.out',
          })
        })
        item.addEventListener('mouseleave', () => {
          gsap.to(item.querySelector('.feature-icon'), {
            scale: 1,
            rotate: 0,
            duration: 0.3,
            ease: 'power2.out',
          })
        })
      })

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-24 bg-surface-container-low"
      id="experience"
      style={{ perspective: '1200px' }}
    >
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col lg:flex-row gap-20 items-center">

          {/* ── Colonne gauche — grille images ── */}
          <div className="w-full lg:w-1/2 grid grid-cols-2 gap-4" style={{ transformStyle: 'preserve-3d' }}>

            {/* Col gauche */}
            <div ref={colLeftRef} className="space-y-4" style={{ opacity: 0 }}>
              <img
                ref={img1Ref}
                className="w-full h-80 object-cover rounded-xl shadow-sm"
                alt="Salle informatique moderne"
                style={{ willChange: 'transform' }}
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwS3S0JrSLNtNCTRFseaaZgxfqRz_4djwcuGCGxy9wNQb-iWv1hW1_w-FFm_4ngBLpXnhUN-chIik-zZzVbpzIiMmyDawSGcef16ZjY2FoaQKCLn3RBJrSpo67JJReRmUoeqTMCJKu5zXjI5nrAUKubtjNQXXCklebpwqmlY95wNJ5_t5Ws3D2fhsfBZen978v4x9u6BKjFmlsfutorUMyOTSbnpvP-prFlgpqOLK5TtRHouGNsztNBJ-4iDuNjqRkWYfverFM7X3b"
              />
              <div
                ref={accentCardRef}
                className="bg-primary p-8 rounded-xl text-on-primary"
                style={{ opacity: 0 }}
              >
                <h4 className="font-display text-2xl mb-2 italic">Accompagnement</h4>
                <p className="text-sm font-light opacity-90">
                  Des formateurs experts guident chacun de vos pas vers l'excellence.
                </p>
              </div>
            </div>

            {/* Col droite — décalée vers le bas (pt-12) */}
            <div ref={colRightRef} className="pt-12 space-y-4" style={{ opacity: 0 }}>
              <img
                ref={img2Ref}
                className="w-full h-96 object-cover rounded-xl shadow-sm"
                alt="Formateurs expérimentés"
                style={{ willChange: 'transform' }}
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnm6UaxD6wdhKYXgX-yKWcnsvZemSTWor9mGapQcF6GuKKlTyQcqe07FeXCJrwHtuM4s2zbLBKt_8XoZQhPHZFtP2MvWf17tIMfeMUymAHouMUbqnS6XuJzHwjUg8JVfJw7dXGAQlyG1RSR7zlaXPUvDX6psFdW71Sb6ixfdztC8h08CyHv4zRr_CplctYiDIwB20dAaH1xRIwn8KSlq_PaS4pEqqCU6co-ZiR56bSVNzJt-O6yOQz4yTfBkyufhY4QgnqwJjM1DbP"
              />
            </div>
          </div>

          {/* ── Colonne droite — texte + features ── */}
          <div className="w-full lg:w-1/2">
            <h2
              ref={titleRef}
              className="font-display text-5xl mb-8"
              style={{ opacity: 0 }}
            >
              L'Expérience Centre Info
            </h2>

            <p
              ref={paraRef}
              className="text-lg text-on-surface-variant font-light mb-8 leading-relaxed"
              style={{ opacity: 0 }}
            >
              Notre centre est bien plus qu'un simple lieu d'apprentissage — c'est un écosystème
              conçu pour une performance maximale. Des salles informatiques modernes aux cours de
              langues immersifs, chaque détail est pensé pour minimiser les obstacles et maximiser
              la croissance.
            </p>

            <div
              ref={featuresRef}
              className="grid grid-cols-1 sm:grid-cols-2 gap-8"
            >
              {[
                { icon: 'biotech', title: 'Salles équipées', desc: 'Matériel de pointe pour une simulation du monde réel.' },
                { icon: 'school', title: 'Formateurs experts', desc: 'Professeurs expérimentés avec des années de pratique.' },
                { icon: 'public', title: 'Réseau professionnel', desc: 'Connectez-vous avec nos anciens dans les meilleures entreprises.' },
                { icon: 'verified_user', title: 'Pédagogie reconnue', desc: 'Méthodes reconnues par les organismes éducatifs.' },
              ].map(item => (
                <div
                  key={item.title}
                  className="feature-item flex gap-4 cursor-default"
                  style={{ opacity: 0 }}
                >
                  <span
                    className="feature-icon material-symbols-outlined text-primary text-3xl flex-shrink-0"
                    style={{ display: 'inline-block' }}
                  >
                    {item.icon}
                  </span>
                  <div>
                    <h5 className="font-bold mb-1">{item.title}</h5>
                    <p className="text-sm text-on-surface-variant font-light">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default Experience