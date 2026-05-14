import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const miniCatalog = {
  langues: ['Francais 30H / 600 DH', 'Anglais 30H / 600 DH', 'Espagnol 30H / 600 DH'],
  bureautique: ['Word 20H / 600 DH', 'Excel 20H / 500 DH', 'PowerPoint 12H / 300 DH', 'Access 16H / 400 DH'],
  concours: ['Medecine 15H / 1000 DH', 'ENSA 12H / 800 DH', 'ENSAM 14H / 1200 DH', 'ENCG 13H / 500 DH', 'ISCAE 15H / 1200 DH', 'ENA 10H / 600 DH'],
  infographie: ['Photoshop 30H / 1000 DH', 'Illustrator 25H / 1000 DH', 'InDesign 20H / 900 DH'],
}

const Formations = () => {
  const sectionRef = useRef<HTMLElement>(null)

  // ── Langues refs ──
  const languesTitleRef = useRef<HTMLDivElement>(null)
  const languesIconRef = useRef<HTMLDivElement>(null)
  const languesListRef = useRef<HTMLUListElement>(null)
  const languesTagsRef = useRef<HTMLDivElement>(null)
  const languesLinkRef = useRef<HTMLAnchorElement>(null)
  const languesImgRef = useRef<HTMLDivElement>(null)

  // ── Bureautique refs ──
  const bureautiqueTitleRef = useRef<HTMLDivElement>(null)
  const bureautiqueIconRef = useRef<HTMLDivElement>(null)
  const bureautiqueCardsRef = useRef<HTMLDivElement>(null)
  const bureautiqueImgRef = useRef<HTMLDivElement>(null)

  // ── Concours refs ──
  const concoursBlockRef = useRef<HTMLDivElement>(null)
  const concoursBadgesRef = useRef<HTMLDivElement>(null)
  const concoursBadgeCertRef = useRef<HTMLDivElement>(null)
  const concoursCircleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ════════════════════════════════════════════════════════════════
      // SECTION HEADER
      // ════════════════════════════════════════════════════════════════
      const headerEls = sectionRef.current?.querySelectorAll('.section-header-anim')
      if (headerEls) {
        gsap.fromTo(
          headerEls,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 78%',
            },
          }
        )
      }

      // ════════════════════════════════════════════════════════════════
      // BLOC LANGUES
      // ════════════════════════════════════════════════════════════════

      const languesTrigger = {
        trigger: languesTitleRef.current,
        start: 'top 75%',
      }

      // Icône — pop
      gsap.fromTo(
        languesIconRef.current,
        { scale: 0, rotate: -15, opacity: 0 },
        {
          scale: 1, rotate: 0, opacity: 1,
          duration: 0.6,
          ease: 'back.out(1.7)',
          scrollTrigger: languesTrigger,
        }
      )

      // Titre + para — slide up
      gsap.fromTo(
        languesTitleRef.current?.querySelectorAll('.langues-text-anim'),
        { y: 36, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.75,
          stagger: 0.12,
          ease: 'power3.out',
          delay: 0.1,
          scrollTrigger: languesTrigger,
        }
      )

      // Checkmarks — stagger depuis la gauche
      gsap.fromTo(
        languesListRef.current?.querySelectorAll('li'),
        { x: -24, opacity: 0 },
        {
          x: 0, opacity: 1,
          duration: 0.5,
          stagger: 0.09,
          ease: 'power2.out',
          delay: 0.25,
          scrollTrigger: languesTrigger,
        }
      )

      // Tags catalogue — cascade depuis le bas
      gsap.fromTo(
        languesTagsRef.current?.querySelectorAll('span'),
        { y: 20, opacity: 0, scale: 0.9 },
        {
          y: 0, opacity: 1, scale: 1,
          duration: 0.45,
          stagger: 0.1,
          ease: 'back.out(1.3)',
          delay: 0.4,
          scrollTrigger: languesTrigger,
        }
      )

      // Lien arrow
      gsap.fromTo(
        languesLinkRef.current,
        { x: -16, opacity: 0 },
        {
          x: 0, opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
          delay: 0.55,
          scrollTrigger: languesTrigger,
        }
      )

      // Image — slide depuis la droite + scale + parallax
      gsap.fromTo(
        languesImgRef.current,
        { x: 70, opacity: 0, scale: 1.04 },
        {
          x: 0, opacity: 1, scale: 1,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: languesTrigger,
        }
      )

      // Parallax image langues
      gsap.to(languesImgRef.current, {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: {
          trigger: languesImgRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
      })

      // Hover tilt 3D image langues
      const languesImg = languesImgRef.current
      if (languesImg) {
        const ryTo = gsap.quickTo(languesImg, 'rotateY', { duration: 0.4, ease: 'power1.out' })
        const rxTo = gsap.quickTo(languesImg, 'rotateX', { duration: 0.4, ease: 'power1.out' })
        const onMove = (e: MouseEvent) => {
          const r = languesImg.getBoundingClientRect()
          ryTo(((e.clientX - r.left - r.width / 2) / (r.width / 2)) * 6)
          rxTo(-((e.clientY - r.top - r.height / 2) / (r.height / 2)) * 4)
        }
        const onLeave = () => gsap.to(languesImg, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'power2.out' })
        languesImg.addEventListener('mousemove', onMove)
        languesImg.addEventListener('mouseleave', onLeave)
      }

      // ════════════════════════════════════════════════════════════════
      // BLOC BUREAUTIQUE
      // ════════════════════════════════════════════════════════════════

      const bureautiqueTrigger = {
        trigger: bureautiqueTitleRef.current,
        start: 'top 75%',
      }

      // Icône — pop
      gsap.fromTo(
        bureautiqueIconRef.current,
        { scale: 0, rotate: 15, opacity: 0 },
        {
          scale: 1, rotate: 0, opacity: 1,
          duration: 0.6,
          ease: 'back.out(1.7)',
          scrollTrigger: bureautiqueTrigger,
        }
      )

      // Titre + para bureautique
      gsap.fromTo(
        bureautiqueTitleRef.current?.querySelectorAll('.bureautique-text-anim'),
        { y: 36, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.75,
          stagger: 0.12,
          ease: 'power3.out',
          delay: 0.1,
          scrollTrigger: bureautiqueTrigger,
        }
      )

      // Cartes bordées — slide depuis la gauche + border-left draw
      const bureautiqueCards = bureautiqueCardsRef.current?.querySelectorAll('.bureautique-card')
      if (bureautiqueCards) {
        gsap.fromTo(
          bureautiqueCards,
          { x: -36, opacity: 0 },
          {
            x: 0, opacity: 1,
            duration: 0.55,
            stagger: 0.08,
            ease: 'power2.out',
            delay: 0.2,
            scrollTrigger: bureautiqueTrigger,
          }
        )

        // Trait border-left — scaleY draw-in
        bureautiqueCards.forEach((card, i) => {
          gsap.fromTo(
            card,
            { borderLeftWidth: '0px' },
            {
              borderLeftWidth: '4px',
              duration: 0.35,
              ease: 'power2.inOut',
              delay: 0.2 + i * 0.08 + 0.25,
              scrollTrigger: bureautiqueTrigger,
            }
          )
        })
      }

      // Image bureautique — slide depuis la gauche (row-reverse)
      gsap.fromTo(
        bureautiqueImgRef.current,
        { x: -70, opacity: 0, scale: 1.04 },
        {
          x: 0, opacity: 1, scale: 1,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: bureautiqueTrigger,
        }
      )

      // Parallax image bureautique
      gsap.to(bureautiqueImgRef.current, {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: {
          trigger: bureautiqueImgRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
      })

      // ════════════════════════════════════════════════════════════════
      // BLOC CONCOURS
      // ════════════════════════════════════════════════════════════════

      const concoursTrigger = {
        trigger: concoursBlockRef.current,
        start: 'top 72%',
      }

      // Bloc entier — scale-up depuis 0.94
      gsap.fromTo(
        concoursBlockRef.current,
        { scale: 0.94, opacity: 0, y: 40 },
        {
          scale: 1, opacity: 1, y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: concoursTrigger,
        }
      )

      // Titre + para concours
      gsap.fromTo(
        concoursBlockRef.current?.querySelectorAll('.concours-text-anim'),
        { y: 28, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power2.out',
          delay: 0.2,
          scrollTrigger: concoursTrigger,
        }
      )

      // Badges concours — stagger depuis le centre
      gsap.fromTo(
        concoursBadgesRef.current?.querySelectorAll('.concours-badge'),
        { scale: 0, opacity: 0 },
        {
          scale: 1, opacity: 1,
          duration: 0.45,
          stagger: { amount: 0.65, from: 'center' },
          ease: 'back.out(1.4)',
          delay: 0.35,
          scrollTrigger: concoursTrigger,
        }
      )

      // Badges certifications — stagger depuis le centre (suite)
      gsap.fromTo(
        concoursBadgeCertRef.current?.querySelectorAll('.concours-badge'),
        { scale: 0, opacity: 0 },
        {
          scale: 1, opacity: 1,
          duration: 0.45,
          stagger: { amount: 0.4, from: 'center' },
          ease: 'back.out(1.4)',
          delay: 0.7,
          scrollTrigger: concoursTrigger,
        }
      )

      // Cercle "95% réussite" — scale pop + pulse idle
      gsap.fromTo(
        concoursCircleRef.current,
        { scale: 0, opacity: 0, rotate: -20 },
        {
          scale: 1, opacity: 1, rotate: 0,
          duration: 0.85,
          ease: 'back.out(1.5)',
          delay: 0.5,
          scrollTrigger: concoursTrigger,
        }
      )

      // Badge "95% Réussite" — pop séparé
      const reussiteBadge = concoursCircleRef.current?.parentElement?.querySelector('.reussite-badge')
      if (reussiteBadge) {
        gsap.fromTo(
          reussiteBadge,
          { scale: 0, opacity: 0, rotate: -5 },
          {
            scale: 1, opacity: 1, rotate: 12,
            duration: 0.6,
            ease: 'back.out(1.6)',
            delay: 0.9,
            scrollTrigger: concoursTrigger,
          }
        )
      }

      // Float idle — cercle concours
      gsap.to(concoursCircleRef.current, {
        y: -10,
        duration: 3.5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 1.2,
      })

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-32 px-8 max-w-7xl mx-auto"
      id="formations"
      style={{ perspective: '1200px' }}
    >
      {/* ── Header ── */}
      <div className="text-center mb-24">
        <h2 className="font-display text-5xl mb-6 section-header-anim" style={{ opacity: 0 }}>
          Nos Disciplines
        </h2>
        <p className="text-on-surface-variant max-w-xl mx-auto text-lg font-light section-header-anim" style={{ opacity: 0 }}>
          Des parcours spécialisés conçus pour propulser votre carrière vers l'excellence.
        </p>
      </div>

      <div className="space-y-32">

        {/* ══════════════════════════════════════════════════════════════
            LANGUES
        ══════════════════════════════════════════════════════════════ */}
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="w-full md:w-1/2" ref={languesTitleRef}>

            <div
              ref={languesIconRef}
              className="inline-flex w-16 h-16 bg-primary/10 rounded-2xl items-center justify-center mb-8"
              style={{ opacity: 0 }}
            >
              <span
                className="material-symbols-outlined text-primary text-3xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                translate
              </span>
            </div>

            <h3 className="font-display text-4xl md:text-5xl mb-6 langues-text-anim" style={{ opacity: 0 }}>
              Excellence en Langues
            </h3>
            <p className="text-on-surface-variant text-lg leading-relaxed mb-8 langues-text-anim" style={{ opacity: 0 }}>
              Maîtrisez l'anglais des affaires, le français ou l'arabe avec un accent sur la nuance
              professionnelle et la diplomatie culturelle. Notre approche immersive vous permet non
              seulement de parler la langue, mais de la maîtriser.
            </p>

            <ul
              ref={languesListRef}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
            >
              {['Niveau natif ciblé', 'Communication professionnelle', 'Coaching individuel', 'Intelligence culturelle'].map(item => (
                <li key={item} className="flex items-center gap-3" style={{ opacity: 0 }}>
                  <span className="material-symbols-outlined text-primary">check_circle</span>
                  {item}
                </li>
              ))}
            </ul>

            <div ref={languesTagsRef} className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {miniCatalog.langues.map(item => (
                <span
                  key={item}
                  className="rounded-xl bg-surface-container px-4 py-3 text-sm font-bold text-on-surface"
                  style={{ opacity: 0 }}
                >
                  {item}
                </span>
              ))}
            </div>

            <a
              ref={languesLinkRef}
              href="/inscriptions/langues"
              className="text-primary font-bold text-sm tracking-widest inline-flex items-center gap-2 group"
              style={{ opacity: 0 }}
              onMouseEnter={e => gsap.to(e.currentTarget.querySelector('.arrow-icon'), { x: 5, duration: 0.2 })}
              onMouseLeave={e => gsap.to(e.currentTarget.querySelector('.arrow-icon'), { x: 0, duration: 0.25 })}
            >
              EN SAVOIR PLUS
              <span className="material-symbols-outlined text-sm arrow-icon">arrow_forward</span>
            </a>
          </div>

          <div
            ref={languesImgRef}
            className="w-full md:w-1/2 aspect-[4/3] bg-surface-container-high rounded-3xl overflow-hidden shadow-2xl relative group"
            style={{ opacity: 0, willChange: 'transform' }}
          >
            <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <img
              alt="Formation en Langues"
              className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqQ0KCzluOtxTXyWeFO_JmP13pQGN4EK2NCzJGRha_W0bfiPJD_XB8ICz3XC99hLNlQt5Q4qXcV33BdsQjhtHTAayST4exgv6iHzQgMkqQCFy_JMr_X6YE5R3dsRBjpwHw45ta0Atm-aIgpuf4FEw65i6EYAgmRXopE20u0Qqt2uwJwwDxAbLkSe_idHN0X0baJYrPB7HotFG_Bpm_ihEZY_jHTvxsdNPfm5D0Rm5agMqlpZMT7c4G-00EhMTBrdTFaGs0dmdApeX9"
            />
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            BUREAUTIQUE & IT
        ══════════════════════════════════════════════════════════════ */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-16">
          <div className="w-full md:w-1/2" ref={bureautiqueTitleRef}>

            <div
              ref={bureautiqueIconRef}
              className="inline-flex w-16 h-16 bg-on-surface rounded-2xl items-center justify-center mb-8"
              style={{ opacity: 0 }}
            >
              <span
                className="material-symbols-outlined text-primary text-3xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                terminal
              </span>
            </div>

            <h3 className="font-display text-4xl md:text-5xl mb-6 bureautique-text-anim" style={{ opacity: 0 }}>
              Bureautique & IT
            </h3>
            <p className="text-on-surface-variant text-lg leading-relaxed mb-8 bureautique-text-anim" style={{ opacity: 0 }}>
              De la bureautique avancée à l'informatique professionnelle. Restez à la pointe avec
              des ateliers pratiques et des projets du monde réel.
            </p>

            <div ref={bureautiqueCardsRef} className="space-y-4 mb-8">
              {[...miniCatalog.bureautique, ...miniCatalog.infographie].map(item => (
                <div
                  key={item}
                  className="bureautique-card p-4 bg-surface-container rounded-xl border-l-4 border-primary"
                  style={{ opacity: 0 }}
                >
                  <h4 className="font-bold mb-1">{item}</h4>
                  <p className="text-sm text-on-surface-variant">
                    {miniCatalog.infographie.includes(item)
                      ? 'Parcours créatif avec production de portfolio.'
                      : 'Atelier pratique avec exercices professionnels.'}
                  </p>
                </div>
              ))}
              <div
                className="bureautique-card p-4 bg-surface-container rounded-xl border-l-4 border-primary"
                style={{ opacity: 0 }}
              >
                <h4 className="font-bold mb-1">Certification MOS</h4>
                <p className="text-sm text-on-surface-variant">
                  Certification Microsoft Office Specialist reconnue mondialement.
                </p>
              </div>
            </div>

            <a
              href="/inscriptions/bureautique"
              className="text-primary font-bold text-sm tracking-widest inline-flex items-center gap-2 group"
              onMouseEnter={e => gsap.to(e.currentTarget.querySelector('.arrow-icon'), { x: 5, duration: 0.2 })}
              onMouseLeave={e => gsap.to(e.currentTarget.querySelector('.arrow-icon'), { x: 0, duration: 0.25 })}
            >
              VOIR LE PROGRAMME
              <span className="material-symbols-outlined text-sm arrow-icon">arrow_forward</span>
            </a>
          </div>

          <div
            ref={bureautiqueImgRef}
            className="w-full md:w-1/2 aspect-[4/3] bg-on-surface rounded-3xl overflow-hidden shadow-2xl relative"
            style={{ opacity: 0, willChange: 'transform' }}
          >
            <div className="absolute inset-0 bg-primary/20 mix-blend-overlay" />
            <img
              alt="Bureautique & IT"
              className="w-full h-full object-cover opacity-80"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUEBLWoDLSYiJDp8SMibyVZk6DpvEjWJBrH1SyIBbBncw3biOdt_5PBURWF_bu1lJprHFcDkPfV7v0G6DtFwrY6Dc3kp1frOEtM0qbjHkrb6WeMTRGBCFjau9g5ok1ImyrnERLCdYGiUl3Izy-VG2WahtXme6QkENPRa_yQeJp6vvJaYR8x1QmGSoJIQvghl9fIwb1nyWQq6_S0zQ8WMMkn7l1-eHxh5q2Qf4YyKy2m_aHkcsqyF5ge0Dh7E5HgWVuWUqDkRrCbkq6"
            />
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            CONCOURS
        ══════════════════════════════════════════════════════════════ */}
        <div
          ref={concoursBlockRef}
          className="bg-surface-container-highest rounded-[3rem] p-8 md:p-16 flex flex-col lg:flex-row gap-12 items-center"
          id="admissions"
          style={{ opacity: 0 }}
        >
          <div className="lg:w-2/3">
            <h3 className="font-display text-4xl mb-6 concours-text-anim" style={{ opacity: 0 }}>
              Préparation aux Concours
            </h3>
            <p className="text-on-surface-variant text-lg leading-relaxed mb-8 concours-text-anim" style={{ opacity: 0 }}>
              Préparation intensive aux concours nationaux et certifications internationales. Nos
              simulateurs reproduisent l'environnement réel pour maximiser vos performances.
            </p>

            {/* Badges concours */}
            <div
              ref={concoursBadgesRef}
              className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-4"
            >
              {miniCatalog.concours.map(item => (
                <div
                  key={item}
                  className="concours-badge bg-surface p-4 rounded-xl text-center shadow-sm"
                  style={{ opacity: 0 }}
                >
                  <div className="text-primary font-bold text-lg mb-1">{item.split(' ')[0]}</div>
                  <div className="text-[10px] uppercase tracking-tighter opacity-60">
                    {item.replace(item.split(' ')[0], '').trim()}
                  </div>
                </div>
              ))}
            </div>

            {/* Badges certifications */}
            <div
              ref={concoursBadgeCertRef}
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              {[
                { code: 'TOEFL', label: 'Compétence linguistique' },
                { code: 'IELTS', label: 'Standard international' },
                { code: 'DELF', label: 'Diplôme français' },
                { code: 'MOS', label: 'Microsoft Office' },
              ].map(cert => (
                <div
                  key={cert.code}
                  className="concours-badge bg-surface p-4 rounded-xl text-center shadow-sm"
                  style={{ opacity: 0 }}
                >
                  <div className="text-primary font-bold text-xl mb-1">{cert.code}</div>
                  <div className="text-[10px] uppercase tracking-tighter opacity-60">{cert.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Cercle animé */}
          <div className="lg:w-1/3 flex justify-center">
            <div className="relative">
              <div
                ref={concoursCircleRef}
                className="w-48 h-48 bg-primary rounded-full flex items-center justify-center text-on-primary shadow-2xl animate-pulse"
                style={{ opacity: 0 }}
              >
                <span className="material-symbols-outlined text-6xl">verified</span>
              </div>
              <div className="reussite-badge absolute -top-4 -right-4 bg-on-surface text-background p-4 rounded-xl shadow-lg"
                style={{ opacity: 0 }}>
                <p className="text-xs font-bold uppercase tracking-widest">95% Réussite</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

export default Formations