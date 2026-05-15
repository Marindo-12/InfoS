import AboutHero from '@/Components/about/AboutHero'
import Navbar from '@/Components/Navbar'
import { Head, Link } from '@inertiajs/react'
import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

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

      // Titre — split lines
      gsap.fromTo(
        histoireMissionRef.current?.querySelector('h2'),
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', scrollTrigger: histTrigger }
      )

      // Paragraphes — stagger
      gsap.fromTo(
        histoireMissionRef.current?.querySelectorAll('p'),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75, stagger: 0.15, ease: 'power2.out', delay: 0.2, scrollTrigger: histTrigger }
      )

      // Chiffres stats — count-up + pop
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
        // Pulsation finale
        gsap.fromTo(el, { scale: 1 }, {
          scale: 1.1, yoyo: true, repeat: 1, duration: 0.2,
          ease: 'power1.out', delay: 0.4 + i * 0.15 + 2,
          scrollTrigger: { ...histTrigger, once: true },
        })
      })

      // Image — slide + tilt hover
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
        valeursRef.current?.querySelectorAll('.valeur-header-anim'),
        { y: 36, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.14, ease: 'power3.out', scrollTrigger: valTrigger }
      )

      // Cartes — cascade depuis le bas avec scale
      gsap.fromTo(
        valeursRef.current?.querySelectorAll('.valeur-card'),
        { y: 50, opacity: 0, scale: 0.94 },
        {
          y: 0, opacity: 1, scale: 1,
          duration: 0.7, stagger: 0.13,
          ease: 'power3.out', delay: 0.2,
          scrollTrigger: valTrigger,
        }
      )

      // Icônes — pop après les cartes
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
        equipeRef.current?.querySelectorAll('.equipe-header-anim'),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out', scrollTrigger: eqTrigger }
      )

      // Cartes membres — stagger + scale depuis 0.9
      gsap.fromTo(
        equipeRef.current?.querySelectorAll('.membre-card'),
        { y: 60, opacity: 0, scale: 0.92 },
        {
          y: 0, opacity: 1, scale: 1,
          duration: 0.8, stagger: 0.15,
          ease: 'power3.out', delay: 0.2,
          scrollTrigger: eqTrigger,
        }
      )

      // ════════════════════════════════════════════════════════════════════
      // TIMELINE — animations simples par item au scroll
      // ════════════════════════════════════════════════════════════════════

      // Ligne principale — draw-in scrub
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

      // Chaque item — reveal indépendant déclenché par sa propre position
      itemRefs.current.forEach((item, i) => {
        if (!item) return

        const dot    = dotRefs.current[i]
        const yr     = yearRefs.current[i]
        const isLeft = i % 2 === 0

        const t = { trigger: item, start: 'top 78%' }

        // Contenu — slide depuis le bon côté
        gsap.fromTo(
          item,
          { x: isLeft ? -40 : 40, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.75, ease: 'power3.out', scrollTrigger: t }
        )

        // Dot — pop
        if (dot) {
          gsap.fromTo(
            dot,
            { scale: 0 },
            { scale: 1, duration: 0.45, ease: 'back.out(2)', delay: 0.15, scrollTrigger: t }
          )
        }

        // Année — slide up
        if (yr) {
          gsap.fromTo(
            yr,
            { y: 18, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', delay: 0.1, scrollTrigger: t }
          )
        }

        // Image — grayscale → couleur au scroll (scrub bidirectionnel)
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

      // ════════════════════════════════════════════════════════════════════
      // ★ LIGNE VOYAGEUSE ENTRE SECTIONS ★
      //
      // La ligne verticale de la timeline "sort" de sa section au bas de la page,
      // traverse la section narrative, et crée un fil conducteur visuel.
      // Bidirectionnel grâce à scrub.
      // ════════════════════════════════════════════════════════════════════
      if (travelingLineRef.current) {
        // La ligne part de 0 hauteur et grandit jusqu'à connecter la section narrative
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
              scrub: 1.5,             // ← scrub bidirectionnel
            },
          }
        )
      }

      // ════════════════════════════════════════════════════════════════════
      // SECTION : NARRATIVE (sombre)
      // ════════════════════════════════════════════════════════════════════
      const narrTrigger = { trigger: narrativeRef.current, start: 'top 75%' }

      // Ligne "Notre conviction"
      gsap.fromTo(
        narrativeRef.current?.querySelector('.conviction-line'),
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, duration: 0.7, ease: 'power2.inOut', scrollTrigger: narrTrigger }
      )
      gsap.fromTo(
        narrativeRef.current?.querySelector('.conviction-label'),
        { x: 20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, delay: 0.2, ease: 'power2.out', scrollTrigger: narrTrigger }
      )

      // Grand titre narrative
      gsap.fromTo(
        narrativeRef.current?.querySelector('.narr-title'),
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.15, scrollTrigger: narrTrigger }
      )

      // Paragraphe + CTA
      gsap.fromTo(
        narrativeRef.current?.querySelectorAll('.narr-body-anim'),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.15, ease: 'power2.out', delay: 0.3, scrollTrigger: narrTrigger }
      )

      // Grille droite — stagger
      gsap.fromTo(
        narrativeRef.current?.querySelectorAll('.narr-grid-item'),
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.65, stagger: 0.12, ease: 'power2.out', delay: 0.4, scrollTrigger: narrTrigger }
      )

      // Citation card — scale pop
      gsap.fromTo(
        narrativeRef.current?.querySelector('.narr-quote'),
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
            VALEURS
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
                  className="valeur-card group relative bg-white p-10 rounded-xl border border-outline-variant/30 hover:border-primary/60 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 cursor-pointer"
                  style={{ opacity: 0 }}
                >
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
                  <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            ÉQUIPE
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
                name: 'Dr. Elara Thorne', role: 'Directrice de l\'académie',
                bio: 'Doctorat en linguistique à Oxford. Plus de 20 ans de direction pédagogique sur trois continents.',
                tags: ['Stratégie', 'Conception de programmes'],
                src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqx1ybRlEjBupElaburzVy_DHR_uSP4bSKXS04xLP7GUSxxMZK7zPH2zH15zgCNhItOfASX5LYPxDcdC-830epmCzqexCjqRdfmA3Jv6cbrPAUxaPbcc8BYolRrQmw6ivCeGofExNz-m_WJMEyHiy1897K28IoTTMYmpx_04Om7IeuMSiuYD8mG4rB7F3pqq3mT3B9a5sFWStTLrsVjoGvLgGZm8tB8nSHPcHxnNIpisalkixzKDY_9HPFW4c9kVnMwqMyxfgUkKS0',
              },
              {
                name: 'Marcus Vane', role: 'Responsable technologie',
                bio: 'Ancien architecte logiciel dans des grandes places technologiques. Spécialisé en éthique de l\'IA.',
                tags: ['Python', 'Systèmes Cloud'],
                src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByr_oWhqRT1CvdzK9nS1MxdOY8I-zdx2Qe2Y07J1ZJaGkAwvr065anjUXSfE2jIz01SYZCxt_RwgLtmdOlyStwlv6xnu05xG2XrgmyeKyLNFosVKIHHQ8u7tO7YjkDsIMCQJNWGMqM7UZN6LHonNGm7Hx4lbRpO2bxnl_NbLx1qjHWupYh5Lo8po-aoWu-GzQFjdc6kXAV3X5J8gpPJXRTxktGUOcBYKOlcIuuGjMKVhyJXKJTeDZ3w68A18ig6-Yo7ThSusLFRpFP',
              },
              {
                name: 'Sofia Chen', role: 'Coordinatrice linguistique',
                bio: 'Experte en méthodologies d\'apprentissage immersif. Parle cinq langues couramment.',
                tags: ['Pédagogie', 'Interculturel'],
                src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoVU1mhHk2oH_HGagkk-mW049CG0BNw3k1jje6vjTYH6TDaUPVqYBCozCF-JAHTPhFBAzRwJyznt_EjDu_a3n9VxM4oINvrZPp0hQ3piVPtQb5PiaWg9UqTCo0NJ3bRP0UwbjiZ86cXim1X1Ng_ymauDqa6azp2HOYE1b6CB8ov5jI32iqxHteZZbCA1bNHtgBGN2iFrMvQpsC5e9gAO7Uz4lR9wM_6WAL__1OoQSI9AUyL9Hc8mGyZqEu9O4HVXbIzv5UL1zvc2JA',
              },
            ].map(m => (
              <div
                key={m.name}
                className="membre-card group relative overflow-hidden rounded-xl bg-white"
                style={{ opacity: 0 }}
              >
                <img
                  className="w-full h-[450px] object-cover transition-transform duration-700 group-hover:scale-110"
                  src={m.src} alt={m.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-on-surface/90 via-on-surface/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8 text-white">
                  <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-sm font-body uppercase tracking-widest mb-2 opacity-80">{m.role}</p>
                    <h4 className="text-3xl font-serif mb-4">{m.name}</h4>
                    <p className="text-sm leading-relaxed mb-6">{m.bio}</p>
                    <div className="flex gap-4 flex-wrap">
                      {m.tags.map(t => (
                        <span key={t} className="px-3 py-1 bg-white/10 rounded-full text-xs font-body">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-white border-x border-b border-outline-variant/30 group-hover:hidden">
                  <h4 className="text-xl font-serif">{m.name}</h4>
                  <p className="text-on-surface-variant text-sm mt-1">{m.role}</p>
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

            {/* Conteneur ligne + curseur */}
            <div className="relative">

              {/* ── Ligne verticale principale (se dessine au scroll) ── */}
              <div
                ref={timelineLineRef}
                className="absolute left-1/2 -translate-x-1/2 top-0 w-px bg-primary/40 hidden md:block"
                style={{ height: '100%', transformOrigin: 'top center', scaleY: 0 }}
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
                    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRRF0afWOJWpAhepm21JHTyWqGECQPULDLWquvzkfAKFbwuMFHTc6k5PRVRPd1_WxqCNbsyTBZA-ffUflGRKUGNNCsaLf8BhqyXp2ZxwBTMLexsbCLog-Ey61h0isnICcPwNXWMbszfXpNcCDYpeh2e5Nn3rXZSDHtNv8tirYqxvbdPdOcUaLRYLQX28VGvnqZU22nmwwttVrGudu8DXb-kfcvPBtUoVat87VFfhQr4UHNikaeYmBZoKfcMIh1ntvOQhq5hfn5AcTa',
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
                      {/* Point intérieur */}
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
          {/* Elle part du bas de la section timeline et descend vers la narrative */}
          <div
            ref={travelingLineRef}
            className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[2px] hidden md:block"
            style={{
              height: '180px',         // longueur du "pont" entre les deux sections
              background: 'linear-gradient(to bottom, rgba(194,101,42,0.5), rgba(194,101,42,0))',
              transformOrigin: 'top center',
              scaleY: 0,
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

          {/* ── Point de réception de la ligne voyageuse ── */}
          {/* Petit cercle au sommet de la section narrative qui "reçoit" la ligne */}
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