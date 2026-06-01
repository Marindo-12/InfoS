import AboutHero from '@/Components/about/AboutHero'
import Navbar from '@/Components/Navbar'
import { Head, Link } from '@inertiajs/react'
import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { User } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const About = () => {
  const pageRef = useRef<HTMLDivElement>(null)

  // ── Section refs ──
  const histoireMissionRef = useRef<HTMLElement>(null)
  const valeursRef         = useRef<HTMLElement>(null)
  const equipeRef          = useRef<HTMLElement>(null)
  const timelineRef        = useRef<HTMLElement>(null)
  const narrativeRef       = useRef<HTMLElement>(null)

  // ── Timeline traveling line refs ──
  const travelingLineRef   = useRef<HTMLDivElement>(null)
  const timelineLineRef    = useRef<HTMLDivElement>(null)

  // ── Timeline dot refs ──
  const dotRefs            = useRef<(HTMLDivElement | null)[]>([])
  const itemRefs           = useRef<(HTMLDivElement | null)[]>([])
  const yearRefs           = useRef<(HTMLHeadingElement | null)[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ════════════════════════════════════════════════════════════════════
      // PROGRESS BAR
      // ════════════════════════════════════════════════════════════════════
      gsap.to('.about-progress', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: document.documentElement,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.3,
        },
      })

      // ════════════════════════════════════════════════════════════════════
      // SECTION : HISTOIRE & MISSION
      // ════════════════════════════════════════════════════════════════════
      const histTrigger = { trigger: histoireMissionRef.current, start: 'top 75%' }

      gsap.fromTo(
        histoireMissionRef.current!.querySelector('h2') as HTMLHeadingElement,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', scrollTrigger: histTrigger }
      )

      gsap.fromTo(
        histoireMissionRef.current!.querySelectorAll('p'),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75, stagger: 0.15, ease: 'power2.out', delay: 0.2, scrollTrigger: histTrigger }
      )

      const statEls = histoireMissionRef.current?.querySelectorAll('.stat-number')
      statEls?.forEach((el, i) => {
        const raw   = parseInt(el.getAttribute('data-value') || '0')
        const suf   = el.getAttribute('data-suffix') || ''
        const obj   = { val: 0 }
        gsap.to(obj, {
          val: raw,
          duration: 2,
          ease: 'power2.out',
          delay: 0.4 + i * 0.15,
          onUpdate: () => { el.textContent = Math.round(obj.val) + suf },
          scrollTrigger: { ...histTrigger, once: true },
        })
        gsap.fromTo(el, { scale: 1 }, {
          scale: 1.1, yoyo: true, repeat: 1, duration: 0.2,
          ease: 'power1.out', delay: 0.4 + i * 0.15 + 2,
          scrollTrigger: { ...histTrigger, once: true },
        })
      })

      const imgEl = histoireMissionRef.current?.querySelector('.about-img') as HTMLElement
      if (imgEl) {
        gsap.fromTo(
          imgEl,
          { x: 60, opacity: 0, scale: 1.05 },
          { x: 0, opacity: 1, scale: 1, duration: 1.1, ease: 'power3.out', scrollTrigger: histTrigger }
        )
        const ryTo = gsap.quickTo(imgEl, 'rotateY', { duration: 0.45, ease: 'power1.out' })
        const rxTo = gsap.quickTo(imgEl, 'rotateX', { duration: 0.45, ease: 'power1.out' })
        imgEl.addEventListener('mousemove', (e: MouseEvent) => {
          const r = imgEl.getBoundingClientRect()
          ryTo(((e.clientX - r.left - r.width / 2) / (r.width / 2)) * 6)
          rxTo(-((e.clientY - r.top - r.height / 2) / (r.height / 2)) * 4)
        })
        imgEl.addEventListener('mouseleave', () =>
          gsap.to(imgEl, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'power2.out' })
        )
      }

      // ════════════════════════════════════════════════════════════════════
      // SECTION : VALEURS
      // ════════════════════════════════════════════════════════════════════
      const valTrigger = { trigger: valeursRef.current, start: 'top 75%' }

      gsap.fromTo(
        valeursRef.current!.querySelectorAll('.valeur-header-anim'),
        { y: 36, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.14, ease: 'power3.out', scrollTrigger: valTrigger }
      )

      gsap.fromTo(
        valeursRef.current!.querySelectorAll('.valeur-card'),
        { y: 50, opacity: 0, scale: 0.94 },
        {
          y: 0, opacity: 1, scale: 1,
          duration: 0.7, stagger: 0.13,
          ease: 'power3.out', delay: 0.2,
          scrollTrigger: valTrigger,
        }
      )

      valeursRef.current?.querySelectorAll('.valeur-icon').forEach((icon, i) => {
        gsap.fromTo(
          icon,
          { scale: 0, rotate: -20 },
          {
            scale: 1, rotate: 0,
            duration: 0.5, ease: 'back.out(1.8)',
            delay: 0.35 + i * 0.13,
            scrollTrigger: valTrigger,
          }
        )
      })

      // ════════════════════════════════════════════════════════════════════
      // SECTION : ÉQUIPE
      // ════════════════════════════════════════════════════════════════════
      const eqTrigger = { trigger: equipeRef.current, start: 'top 75%' }

      gsap.fromTo(
        equipeRef.current!.querySelectorAll('.equipe-header-anim'),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out', scrollTrigger: eqTrigger }
      )

      gsap.fromTo(
        equipeRef.current!.querySelectorAll('.membre-card'),
        { y: 60, opacity: 0, scale: 0.92 },
        {
          y: 0, opacity: 1, scale: 1,
          duration: 0.8, stagger: 0.15,
          ease: 'power3.out', delay: 0.2,
          scrollTrigger: eqTrigger,
        }
      )

      // ════════════════════════════════════════════════════════════════════
      // TIMELINE
      // ════════════════════════════════════════════════════════════════════
      if (timelineLineRef.current) {
        gsap.fromTo(
          timelineLineRef.current,
          { scaleY: 0, transformOrigin: 'top center' },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: timelineRef.current,
              start: 'top 65%',
              end: 'bottom 70%',
              scrub: 1,
            },
          }
        )
      }

      itemRefs.current.forEach((item, i) => {
        if (!item) return

        const dot    = dotRefs.current[i]
        const yr     = yearRefs.current[i]
        const isLeft = i % 2 === 0

        const t = { trigger: item, start: 'top 78%' }

        gsap.fromTo(
          item,
          { x: isLeft ? -40 : 40, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.75, ease: 'power3.out', scrollTrigger: t }
        )

        if (dot) {
          gsap.fromTo(
            dot,
            { scale: 0 },
            { scale: 1, duration: 0.45, ease: 'back.out(2)', delay: 0.15, scrollTrigger: t }
          )
        }

        if (yr) {
          gsap.fromTo(
            yr,
            { y: 18, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', delay: 0.1, scrollTrigger: t }
          )
        }

        const img = item.querySelector('img') as HTMLElement
        if (img) {
          gsap.fromTo(
            img,
            { filter: 'grayscale(100%) brightness(0.8)', scale: 1.05 },
            {
              filter: 'grayscale(0%) brightness(1)',
              scale: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: item,
                start: 'top 75%',
                end: 'top 25%',
                scrub: 1,
              },
            }
          )
        }
      })

      if (travelingLineRef.current) {
        gsap.fromTo(
          travelingLineRef.current,
          { scaleY: 0, transformOrigin: 'top center', opacity: 0 },
          {
            scaleY: 1, opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: timelineRef.current,
              start: 'bottom 80%',
              end: 'bottom top',
              scrub: 1.5,
            },
          }
        )
      }

      // ════════════════════════════════════════════════════════════════════
      // SECTION : NARRATIVE
      // ════════════════════════════════════════════════════════════════════
      const narrTrigger = { trigger: narrativeRef.current, start: 'top 75%' }

      gsap.fromTo(
        narrativeRef.current!.querySelector('.conviction-line') as HTMLElement,
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, duration: 0.7, ease: 'power2.inOut', scrollTrigger: narrTrigger }
      )
      gsap.fromTo(
        narrativeRef.current!.querySelector('.conviction-label') as HTMLElement,
        { x: 20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, delay: 0.2, ease: 'power2.out', scrollTrigger: narrTrigger }
      )

      gsap.fromTo(
        narrativeRef.current!.querySelector('.narr-title') as HTMLElement,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.15, scrollTrigger: narrTrigger }
      )

      gsap.fromTo(
        narrativeRef.current!.querySelectorAll('.narr-body-anim'),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.15, ease: 'power2.out', delay: 0.3, scrollTrigger: narrTrigger }
      )

      gsap.fromTo(
        narrativeRef.current!.querySelectorAll('.narr-grid-item'),
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.65, stagger: 0.12, ease: 'power2.out', delay: 0.4, scrollTrigger: narrTrigger }
      )

      gsap.fromTo(
        narrativeRef.current!.querySelector('.narr-quote') as HTMLElement,
        { scale: 0.92, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.75, ease: 'back.out(1.3)', delay: 0.55, scrollTrigger: narrTrigger }
      )

    }, pageRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={pageRef} style={{ perspective: '1200px' }}>
      <Head title="À propos" />

      {/* ── Barre de progression ── */}
      <div
        className="about-progress fixed top-0 left-0 right-0 h-[2px] bg-primary z-[9999] origin-left"
        style={{ transform: 'scaleX(0)' }}
      />

      <Navbar />

      <main>

        {/* ══════════════════════════════════════════════════
            HERO
        ══════════════════════════════════════════════════ */}
        <AboutHero />

        {/* ══════════════════════════════════════════════════
            HISTOIRE & MISSION
        ══════════════════════════════════════════════════ */}
        <section ref={histoireMissionRef} className="py-24 px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-serif text-on-surface leading-tight">
                L'excellence au service de l'esprit et du code.
              </h2>
              <div className="space-y-6 font-body text-lg text-on-surface-variant leading-relaxed">
                <p>
                  Fondée il y a trois décennies en tant qu'institut linguistique de niche, Elite Academy
                  est devenue un sanctuaire de premier plan pour l'épanouissement intellectuel et la
                  maîtrise technique. Notre parcours a commencé avec une conviction simple : la
                  communication et la technologie sont les deux piliers du monde moderne.
                </p>
                <p>
                  Aujourd'hui, nous nous situons à la croisée de l'éducation humaniste traditionnelle
                  et de l'innovation numérique de pointe. Notre mission est de doter la prochaine
                  génération de leaders mondiaux de la finesse linguistique et de la puissance technique
                  nécessaires pour naviguer dans un paysage complexe et interconnecté.
                </p>
              </div>
              <div className="flex items-center space-x-4 pt-4">
                {[
                  { value: 30, suffix: '+', label: 'Années' },
                  { value: 12, suffix: 'k',  label: 'Anciens élèves' },
                  { value: 45, suffix: '',   label: 'Partenaires' },
                ].map((s, i) => (
                  <div key={s.label} className={`text-center px-8 ${i < 2 ? 'border-r border-outline-variant' : ''}`}>
                    <div
                      className="stat-number text-3xl font-serif text-primary"
                      data-value={s.value}
                      data-suffix={s.suffix}
                    >
                      0{s.suffix}
                    </div>
                    <div className="text-xs uppercase tracking-widest mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="about-img relative group"
              style={{ willChange: 'transform', transformStyle: 'preserve-3d' }}
            >
              <div className="absolute -inset-4 bg-primary/5 rounded-xl -rotate-2 group-hover:rotate-0 transition-transform duration-500" />
              <img
                className="relative z-10 w-full h-[600px] object-cover rounded-xl shadow-lg"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAohhUjkOm8R1NlZvl8GWCf9Gxoxl7CabaEmWFR7GrZIVOTqNe4LOCAWmjhxxmjTAaYNWiOYGHws-F0d2feMJ3yB6N3n4cw2FdmL_grs9lyJdqTTc3uI3raLoU1ruJphSwwr6bFJrTdGR_1EEc1bKozrtv9VhT0qTo1SZPLeuYrKP2J302NyEpWtiOXzUjLkmL2X8Dfn0s2PZl8FoW6Be8EfYGKgPtSyimli_vZXvNqkLR3bkxKrSiakF3-3YmkF63pKj58S9vvYXb1"
                alt="groupe diversifié d'étudiants professionnels"
              />
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            VALEURS — améliorées avec traits orange
        ══════════════════════════════════════════════════ */}
        <section ref={valeursRef} className="py-24 bg-surface-container-low px-8 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-serif mb-4 valeur-header-anim" style={{ opacity: 0 }}>
                Nos piliers fondamentaux
              </h2>
              <p className="font-body text-on-surface-variant tracking-wide uppercase text-sm valeur-header-anim" style={{ opacity: 0 }}>
                Les principes qui guident chacun de nos cours
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: 'architecture', title: 'Précision', desc: "Qu'il s'agisse de la syntaxe d'une nouvelle langue ou de l'architecture d'un système logiciel, nous croyons en la puissance de l'exactitude et du souci du détail." },
                { icon: 'lightbulb', title: 'Innovation', desc: "Nous n'enseignons pas seulement la norme actuelle ; nous anticipons l'avenir. Notre programme est un écosystème vivant qui évolue avec les mutations de l'industrie." },
                { icon: 'public', title: 'Excellence globale', desc: "Nos normes sont alignées sur les critères mondiaux les plus élevés, garantissant que nos diplômés sont compétitifs sur n'importe quel marché." },
              ].map(v => (
                <div
                  key={v.title}
                  className="valeur-card group relative bg-white p-10 rounded-xl border border-outline-variant/30 hover:border-primary/60 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 cursor-pointer overflow-hidden"
                  style={{ opacity: 0 }}
                >
                  {/* Trait orange top */}
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary via-primary/70 to-primary/30 rounded-t-xl" />

                  {/* Trait orange left — visible au hover */}
                  <div className="absolute top-0 left-0 bottom-0 w-[3px] bg-gradient-to-b from-primary to-primary/10 rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Coin décoratif bas-droit */}
                  <div className="absolute bottom-0 right-0 w-20 h-20 bg-primary/5 rounded-tl-full group-hover:bg-primary/10 transition-colors duration-500" />

                  <span
                    className="valeur-icon material-symbols-outlined text-5xl text-primary mb-6 block"
                    style={{ display: 'inline-block', opacity: 0 }}
                  >
                    {v.icon}
                  </span>
                  <h3 className="text-2xl font-serif mb-4 group-hover:text-primary transition-colors duration-300">{v.title}</h3>
                  <p className="text-on-surface-variant leading-relaxed">{v.desc}</p>
                  <div className="mt-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                    <a href="#" className="text-primary text-sm font-semibold inline-flex items-center gap-1">
                      Explorer <span className="material-symbols-outlined text-base">arrow_right_alt</span>
                    </a>
                  </div>

                  {/* Gradient background hover */}
                  <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            ÉQUIPE — avec icônes Lucide au lieu d'images
        ══════════════════════════════════════════════════ */}
        <section ref={equipeRef} className="py-24 px-8 max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-4xl font-serif mb-2 equipe-header-anim" style={{ opacity: 0 }}>
                Les architectes de la croissance
              </h2>
              <p className="font-body text-on-surface-variant text-lg equipe-header-anim" style={{ opacity: 0 }}>
                Guidés par des maîtres dans leurs disciplines.
              </p>
            </div>
            <button className="text-primary font-body font-semibold flex items-center gap-2 group equipe-header-anim" style={{ opacity: 0 }}>
              Rencontrer toute l'équipe
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[
              {
                name: 'Dr. Elara Thorne', role: "Directrice de l'académie",
                bio: 'Doctorat en linguistique à Oxford. Plus de 20 ans de direction pédagogique sur trois continents.',
                tags: ['Stratégie', 'Conception de programmes'],
                color: 'from-primary/10 to-primary/5',
              },
              {
                name: 'Marcus Vane', role: 'Responsable technologie',
                bio: "Ancien architecte logiciel dans des grandes places technologiques. Spécialisé en éthique de l'IA.",
                tags: ['Python', 'Systèmes Cloud'],
                color: 'from-primary/15 to-primary/5',
              },
              {
                name: 'Sofia Chen', role: 'Coordinatrice linguistique',
                bio: "Experte en méthodologies d'apprentissage immersif. Parle cinq langues couramment.",
                tags: ['Pédagogie', 'Interculturel'],
                color: 'from-primary/10 to-primary/5',
              },
            ].map(m => (
              <div
                key={m.name}
                className="membre-card group relative overflow-hidden rounded-xl bg-white border border-outline-variant/30 hover:border-primary/40 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                style={{ opacity: 0 }}
              >
                {/* Trait orange top */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary via-primary/70 to-primary/30 z-10" />

                {/* Zone avatar */}
                <div className={`relative h-[280px] bg-gradient-to-br ${m.color} flex items-center justify-center overflow-hidden`}>
                  {/* Cercles décoratifs en arrière-plan */}
                  <div className="absolute -bottom-8 -right-8 w-40 h-40 rounded-full bg-primary/10 group-hover:scale-125 transition-transform duration-700" />
                  <div className="absolute -top-6 -left-6 w-28 h-28 rounded-full bg-primary/8 group-hover:scale-110 transition-transform duration-700" />

                  {/* Icône User de Lucide */}
                  <div className="relative z-10 w-32 h-32 rounded-full bg-white border-4 border-primary/20 group-hover:border-primary/60 shadow-lg flex items-center justify-center transition-all duration-500 group-hover:scale-105">
                    <User
                      size={56}
                      strokeWidth={1.25}
                      className="text-primary/70 group-hover:text-primary transition-colors duration-300"
                    />
                  </div>

                  {/* Overlay au hover */}
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Infos membre */}
                <div className="p-8 relative">
                  {/* Trait orange left décoratif */}
                  <div className="absolute left-0 top-8 bottom-8 w-[3px] bg-gradient-to-b from-primary to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-r-full" />

                  <p className="text-xs font-body uppercase tracking-widest text-primary mb-2">{m.role}</p>
                  <h4 className="text-2xl font-serif mb-3 group-hover:text-primary transition-colors duration-300">{m.name}</h4>
                  <p className="text-on-surface-variant text-sm leading-relaxed mb-6">{m.bio}</p>
                  <div className="flex gap-2 flex-wrap">
                    {m.tags.map(t => (
                      <span
                        key={t}
                        className="px-3 py-1 bg-primary/8 border border-primary/20 rounded-full text-xs font-body text-primary group-hover:bg-primary/15 transition-colors duration-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            ★ FRISE CHRONOLOGIQUE — TIMELINE VOYAGEUSE ★
        ══════════════════════════════════════════════════ */}
        <section ref={timelineRef} className="py-24 px-8 bg-surface-container relative overflow-visible">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-serif mb-4">Trente ans d'étapes clés</h2>
              <p className="font-body text-on-surface-variant uppercase tracking-[0.2em] text-xs">
                Notre évolution de 1994 à aujourd'hui
              </p>
            </div>

            <div className="relative">

              {/* ── Ligne verticale principale ── */}
              <div
                ref={timelineLineRef}
                className="absolute left-1/2 -translate-x-1/2 top-0 w-px bg-primary/40 hidden md:block"
                style={{ height: '100%', transformOrigin: 'top center', transform: 'scaleY(0)' }}
              />

              {/* ── Items de la timeline ── */}
              <div className="space-y-24">
                {[
                  {
                    year: '1994', side: 'left',
                    text: 'Création de « The Language Loft » dans un petit studio urbain avec 3 salles de classe.',
                    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBch4qoGNCdCkd6Uu69rB197I5OR4DQgucbtstZKD2WYm31zjbQbSexUbqVexvHrOZK5J7KVff4FcR3gwldNoSC0bkMWPwQHT3SI1xQl6FLwsc3rlDUt9tb86IwApv4AdD5QMmWV3NiokNJNEgciMlOlY0kdOliRbgM3TM93BK9NCpXGsqwG2rV84qY7WNHagRsfz2W8NyUby9h4YKeiC-lZOex82YbqUWo08B3lknQ8-VzhPa3cTvwd-X_CqK1fHGqtOYWlbTx1lAV',
                  },
                  {
                    year: '2005', side: 'right',
                    text: "Expansion vers les technologies de l'information. Lancement du premier programme « Coding for Leaders ».",
                    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBDfJBExsnuQRG_Mer-Odmw1TCL-skOXqL0n6_eouykDsY8dtYGvh10lPJl9pjqpEoiVoOexVWqoJTyuUC3AOYy2ITtytDpHG4aWSNHp954i2phad9e8HAKIwZq6B-rwRze4fONAm8JKTOByEa2y34lDpBkgfUNcXI1F-yxfrpevCXDB-PeM3OstPU689mqdi7T3wZuLIBfrHE1tFOF_tpXO1_lMy8DnlJwEuvKdeVAom5jwfONV8Ape8O7-SzcY_dA9PT-m1QSXQ2',
                  },
                  {
                    year: '2018', side: 'left',
                    text: "Obtention de l'accréditation mondiale. L'institut est renommé Elite Academy pour refléter ses normes élevées.",
                    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRRF0afWOJWpAhepm21JHTyWqGECQPULDLWquvzkfAKFbwuMFHTc6k5PRVRPd1_WxqCNbsyTBZA-ffUflGRKUGNNCsaLf8BhqyXp2ZxwBTMLexsbCLog-Ey61h0isnICcPwNXWMbszfXpNcCDYpeh2e5Nn3rXZSDHtNv8tirYqxvbdPdOcUaLRYLQX28VGvnqZU22nmwwttVrGudu8DXb-kfcMIh1ntvOQhq5hfn5AcTa',
                  },
                  {
                    year: "Aujourd'hui", side: 'right',
                    text: "Un pôle mondial pour la recherche en IA et les études linguistiques avancées, avec 12 000 anciens élèves.",
                    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCU9fxgrdjOcAV7qRM_0v-p1srNV3T08SW2nYlC76tJMb1F9fwtvC9D2LnhlExTPZ6QfoIgUkcje4cBEAzQ451RRmxayZ4bkU_mTOwRzRG5Pgnu0JWqOmFPrv_b_cVyB2ZcXh2OtSd9js06Fpq2cTfrIKc8THIPIIuI01rhH9UOcqsNgtZvPUieOfXOvMs-NQpkMWpRGJnKOxnK1g48Whd9cYwJkU5CqSqZkbazdTmcm6k1q4AiAQin7Y7ZUSFvLwmVWqwNNA6QBt3e',
                  },
                ].map((ev, i) => (
                  <div
                    key={ev.year}
                    ref={el => { itemRefs.current[i] = el }}
                    className={`relative flex flex-col ${ev.side === 'left' ? 'md:flex-row' : 'md:flex-row-reverse'} items-center justify-between group`}
                    style={{ opacity: 0 }}
                  >
                    {/* Texte */}
                    <div className={`md:w-[45%] ${ev.side === 'left' ? 'text-right' : 'text-left'} hidden md:block`}>
                      <h3
                        ref={el => { yearRefs.current[i] = el }}
                        className="text-3xl font-serif text-primary"
                        style={{ opacity: 0 }}
                      >
                        {ev.year}
                      </h3>
                      <p className="text-on-surface-variant mt-2">{ev.text}</p>
                    </div>

                    {/* Dot */}
                    <div
                      ref={el => { dotRefs.current[i] = el }}
                      className="timeline-dot w-10 h-10 bg-background border-2 border-primary rounded-full relative z-10 hidden md:flex items-center justify-center"
                      style={{ scale: 0 }}
                    >
                      <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                    </div>

                    {/* Mobile */}
                    <div className="md:hidden text-center mb-4">
                      <h3 className="text-3xl font-serif text-primary">{ev.year}</h3>
                      <p className="text-on-surface-variant mt-2">{ev.text}</p>
                    </div>

                    {/* Image */}
                    <div className="md:w-[45%]">
                      <img
                        className="rounded-lg shadow-sm w-full"
                        src={ev.src}
                        alt={`Étape ${ev.year}`}
                        style={{ filter: 'grayscale(100%) brightness(0.8)' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Ligne voyageuse vers la section narrative ── */}
          <div
            ref={travelingLineRef}
            className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[2px] hidden md:block"
            style={{
              height: '180px',
              background: 'linear-gradient(to bottom, rgba(194,101,42,0.5), rgba(194,101,42,0))',
              transformOrigin: 'top center',
              transform: 'scaleY(0)',
              opacity: 0,
              zIndex: 10,
            }}
          />
        </section>

        {/* ══════════════════════════════════════════════════
            NARRATIVE (sombre)
        ══════════════════════════════════════════════════ */}
        <section
          ref={narrativeRef}
          className="bg-[#1a1a1a] text-white pt-32 pb-16 px-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 translate-x-20 pointer-events-none" />

          {/* Point de réception de la ligne voyageuse */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden md:block">
            <div className="w-4 h-4 rounded-full bg-primary shadow-[0_0_16px_6px_rgba(194,101,42,0.5)] animate-pulse" />
          </div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-start mb-32">
            <div className="space-y-10">
              <div className="inline-flex items-center gap-4 text-primary">
                <div className="conviction-line w-12 h-px bg-primary" style={{ transform: 'scaleX(0)', transformOrigin: 'left center' }} />
                <span className="conviction-label font-body text-xs uppercase tracking-[0.4em]" style={{ opacity: 0 }}>
                  Notre conviction
                </span>
              </div>
              <h2 className="narr-title text-5xl md:text-6xl font-serif leading-tight" style={{ opacity: 0 }}>
                Chaque code est une langue, chaque langue est un monde.
              </h2>
              <p className="narr-body-anim text-lg text-white/60 font-body leading-relaxed max-w-xl" style={{ opacity: 0 }}>
                Nous croyons que les avancées humaines les plus profondes surviennent lorsque nous
                comblons le fossé entre la logique technique et l'expression humaine. À Info Saloua,
                nous n'enseignons pas seulement des compétences ; nous cultivons un état d'esprit de
                fluence globale qui transcende les frontières et le binaire.
              </p>
              <div className="pt-4 narr-body-anim" style={{ opacity: 0 }}>
                <a className="inline-flex items-center gap-3 group" href="/formations">
                  <span className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
                    <span className="material-symbols-outlined text-sm">play_arrow</span>
                  </span>
                  <span className="font-body text-sm font-bold uppercase tracking-widest">
                    Voir l'impact de notre histoire
                  </span>
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
              {[
                { title: 'La vision', text: 'Devenir la référence mondiale incontestée pour une formation pluridisciplinaire où éthique et technologie coexistent.' },
                { title: 'La communauté', text: 'Rejoignez les 12 000+ anciens élèves qui mènent le changement dans la Silicon Valley, à Londres, Tokyo et au-delà.' },
              ].map(item => (
                <div key={item.title} className="narr-grid-item space-y-4" style={{ opacity: 0 }}>
                  <h4 className="font-serif text-2xl text-primary">{item.title}</h4>
                  <p className="text-white/50 text-sm leading-relaxed">{item.text}</p>
                </div>
              ))}

              <div className="narr-quote sm:col-span-2 pt-8" style={{ opacity: 0 }}>
                <div className="bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <p className="font-serif italic text-xl mb-6 text-white/80">
                    « Elite Academy ne m'a pas seulement appris à programmer ; elle m'a appris à
                    communiquer le "pourquoi" derrière le "comment". »
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center font-serif text-primary italic">S</div>
                    <div>
                      <p className="text-sm font-bold uppercase tracking-wide">Sarah Jenkins</p>
                      <p className="text-xs text-white/40">Ancienne élève '19, Responsable produit senior chez Vertex</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="max-w-7xl mx-auto border-t border-white/10 pt-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
              <div className="md:col-span-1">
                <div className="text-3xl font-serif tracking-tight text-primary mb-6">Info Saloua</div>
                <p className="text-white/40 text-sm leading-relaxed">
                  L'excellence au service de l'esprit et du code.<br />
                  Formation professionnelle en langues, bureautique et concours.
                </p>
              </div>
              <div className="space-y-6">
                <h5 className="font-body font-bold text-xs uppercase tracking-widest text-white/80">Formations</h5>
                <ul className="space-y-3 text-white/50 text-sm font-body">
                  <li><Link className="hover:text-primary transition-colors" href={route('formations')}>Infographie</Link></li>
                  <li><Link className="hover:text-primary transition-colors" href={route('inscriptions.langues')}>Langues</Link></li>
                  <li><Link className="hover:text-primary transition-colors" href={route('inscriptions.bureautique')}>Bureautique</Link></li>
                  <li><Link className="hover:text-primary transition-colors" href={route('inscriptions.concours')}>Concours</Link></li>
                </ul>
              </div>
              <div className="space-y-6">
                <h5 className="font-body font-bold text-xs uppercase tracking-widest text-white/80">Entreprise</h5>
                <ul className="space-y-3 text-white/50 text-sm font-body">
                  <li><Link className="hover:text-primary transition-colors" href={route('about')}>À propos</Link></li>
                  <li><Link className="hover:text-primary transition-colors" href={route('contact')}>Contact</Link></li>
                  <li><Link className="hover:text-primary transition-colors" href={route('privacy')}>Privacy</Link></li>
                  <li><Link className="hover:text-primary transition-colors" href={route('terms')}>Terms</Link></li>
                </ul>
              </div>
              <div className="space-y-8">
                <h5 className="font-body font-bold text-xs uppercase tracking-widest text-white/80">Admissions</h5>
                <a href={route('inscriptions')} className="w-full bg-primary text-white py-4 rounded-xl font-body font-bold text-sm hover:opacity-90 transition-opacity inline-block text-center">
                  Commencer votre candidature
                </a>
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] uppercase tracking-[0.3em] text-white/30 border-t border-white/5 pt-8">
              <p>© {new Date().getFullYear()} Info Saloua. Tous droits réservés.</p>
              <div className="flex gap-8">
                <a className="hover:text-primary transition-colors" href={route('privacy')}>Confidentialité</a>
                <a className="hover:text-primary transition-colors" href={route('terms')}>Conditions</a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <style>{`
        .timeline-dot::after {
          content: '';
          position: absolute;
          left: 50%; top: 50%;
          transform: translate(-50%, -50%);
          width: 8px; height: 8px;
          background-color: #c2652a;
          border-radius: 50%;
        }
      `}</style>
    </div>
  )
}

export default About