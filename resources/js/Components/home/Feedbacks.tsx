import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const feedbacks = [
  {
    id: 'ka',
    initials: 'KA',
    name: 'Karim Alaoui',
    role: 'Ingénieur — École Nationale',
    stars: 5,
    text: "La préparation au concours a été décisive. Les méthodes sont rigoureuses et les professeurs sont disponibles. J'ai intégré l'école que je visais dès la première tentative.",
    variant: 'light',
  },
  {
    id: 'sm',
    initials: 'SM',
    name: 'Sara Mansouri',
    role: 'Assistante de Direction',
    stars: 0,
    text: "La formation bureautique m'a permis de décrocher mon poste actuel. Excel avancé et PowerPoint professionnel sont désormais mes meilleurs alliés.",
    variant: 'dark',
  },
  {
    id: 'yb',
    initials: 'YB',
    name: 'Youssef Benali',
    role: 'Étudiant en Master',
    stars: 0,
    text: "Mon niveau d'anglais a fait un bond spectaculaire en 3 mois. Les exercices sont variés, l'ambiance est excellente et les résultats sont au rendez-vous.",
    variant: 'accent',
  },
  {
    id: 'fz',
    initials: 'FZ',
    name: 'Fatima Zahra',
    role: 'Fonctionnaire',
    stars: 5,
    text: "Le suivi individualisé fait vraiment la différence. Les formateurs connaissent vos points faibles et y travaillent avec vous pas à pas.",
    variant: 'muted',
  },
  {
    id: 'ma',
    initials: 'MA',
    name: 'Mohammed Azzouzi',
    role: 'Chef de Projet IT',
    stars: 0,
    text: "Excellent centre. L'approche pédagogique est moderne et efficace. Je recommande vivement à tous ceux qui souhaitent progresser rapidement.",
    variant: 'white',
  },
]

const Feedbacks = () => {
  const sectionRef   = useRef<HTMLElement>(null)
  const headerRef    = useRef<HTMLDivElement>(null)
  const cardRefs     = useRef<(HTMLDivElement | null)[]>([])
  const starRefs     = useRef<(HTMLSpanElement[])[]>([[], [], [], [], []])
  const quoteIconRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── Header — badge + titre + para en stagger ─────────────────────
      gsap.fromTo(
        headerRef.current?.querySelectorAll('.header-anim'),
        { y: 36, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.8,
          stagger: 0.14,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 78%',
          },
        }
      )

      // ── Cartes masonry — cascade en stagger colonnes ──────────────────
      // Simuler l'ordre colonne par colonne (gauche avant droite)
      // Layout masonry CSS: carte 0,2,4 = col gauche / 1,3 = col droite
      const columnOrder = [0, 2, 4, 1, 3]

      columnOrder.forEach((cardIndex, order) => {
        const card = cardRefs.current[cardIndex]
        if (!card) return

        gsap.fromTo(
          card,
          { y: 60, opacity: 0, scale: 0.96 },
          {
            y: 0, opacity: 1, scale: 1,
            duration: 0.7,
            ease: 'power3.out',
            delay: order * 0.1,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 72%',
            },
          }
        )
      })

      // ── Étoiles — allumage séquentiel par carte ───────────────────────
      cardRefs.current.forEach((card, cardIdx) => {
        const stars = starRefs.current[cardIdx]
        if (!stars || stars.length === 0) return

        gsap.fromTo(
          stars,
          { scale: 0, opacity: 0, rotate: -30 },
          {
            scale: 1, opacity: 1, rotate: 0,
            duration: 0.3,
            stagger: 0.08,
            ease: 'back.out(2)',
            delay: cardIdx * 0.1 + 0.4,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 72%',
              once: true,
            },
          }
        )
      })

      // ── Icône quote carte dark — reveal depuis opacity ────────────────
      if (quoteIconRef.current) {
        gsap.fromTo(
          quoteIconRef.current,
          { scale: 0.4, opacity: 0, rotate: 20 },
          {
            scale: 1, opacity: 0.4, rotate: 0,
            duration: 0.6,
            ease: 'back.out(1.5)',
            delay: 0.35,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 72%',
              once: true,
            },
          }
        )
      }

      // ── Hover — lift effect sur chaque carte ─────────────────────────
      cardRefs.current.forEach(card => {
        if (!card) return

        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            y: -6,
            scale: 1.02,
            duration: 0.3,
            ease: 'power2.out',
          })
        })

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            y: 0,
            scale: 1,
            duration: 0.4,
            ease: 'power2.out',
          })
        })
      })

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-32 bg-surface" id="temoignages">
      <div className="max-w-7xl mx-auto px-8">

        {/* ── Header ── */}
        <div ref={headerRef} className="text-center mb-16">
          <span
            className="header-anim text-primary font-bold tracking-widest text-xs uppercase"
            style={{ opacity: 0, display: 'inline-block' }}
          >
            Voix des étudiants
          </span>
          <h2
            className="header-anim font-display text-5xl mt-4 mb-6"
            style={{ opacity: 0 }}
          >
            Résultats réels de nos élèves
          </h2>
          <p
            className="header-anim text-on-surface-variant max-w-xl mx-auto font-light"
            style={{ opacity: 0 }}
          >
            Rejoignez la communauté de ceux qui ont transformé leur parcours professionnel
            grâce au Centre Informatique.
          </p>
        </div>

        {/* ── Masonry grid ── */}
        <div className="masonry-grid">

          {/* Carte 0 — light avec étoiles */}
          <div
            ref={el => { cardRefs.current[0] = el }}
            className="masonry-item p-8 bg-surface-container-low rounded-2xl border border-outline-variant shadow-sm"
            style={{ opacity: 0 }}
          >
            <div className="flex gap-1 text-primary mb-4">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  ref={el => { if (el) starRefs.current[0][i] = el }}
                  className="material-symbols-outlined text-sm"
                  style={{ opacity: 0 }}
                >
                  star
                </span>
              ))}
            </div>
            <p className="text-on-surface italic mb-6 leading-relaxed">
              "La préparation au concours a été décisive. Les méthodes sont rigoureuses et les
              professeurs sont disponibles. J'ai intégré l'école que je visais dès la première
              tentative."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                KA
              </div>
              <div>
                <h5 className="text-sm font-bold">Karim Alaoui</h5>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">
                  Ingénieur — École Nationale
                </p>
              </div>
            </div>
          </div>

          {/* Carte 1 — dark */}
          <div
            ref={el => { cardRefs.current[1] = el }}
            className="masonry-item p-8 bg-on-surface text-background rounded-2xl shadow-xl"
            style={{ opacity: 0 }}
          >
            <div className="mb-6">
              <span
                ref={quoteIconRef}
                className="material-symbols-outlined text-5xl"
                style={{ opacity: 0 }}
              >
                format_quote
              </span>
            </div>
            <p className="text-lg leading-relaxed mb-6 font-light">
              "La formation bureautique m'a permis de décrocher mon poste actuel. Excel avancé
              et PowerPoint professionnel sont désormais mes meilleurs alliés."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-white">
                SM
              </div>
              <div>
                <h5 className="text-sm font-bold">Sara Mansouri</h5>
                <p className="text-[10px] text-stone-400 uppercase tracking-wider">
                  Assistante de Direction
                </p>
              </div>
            </div>
          </div>

          {/* Carte 2 — accent */}
          <div
            ref={el => { cardRefs.current[2] = el }}
            className="masonry-item p-8 bg-primary/5 rounded-2xl border border-primary/10"
            style={{ opacity: 0 }}
          >
            <p className="text-on-surface-variant mb-6">
              "Mon niveau d'anglais a fait un bond spectaculaire en 3 mois. Les exercices sont
              variés, l'ambiance est excellente et les résultats sont au rendez-vous."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-on-primary">
                YB
              </div>
              <div>
                <h5 className="text-sm font-bold">Youssef Benali</h5>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">
                  Étudiant en Master
                </p>
              </div>
            </div>
          </div>

          {/* Carte 3 — muted avec étoiles */}
          <div
            ref={el => { cardRefs.current[3] = el }}
            className="masonry-item p-8 bg-surface-container-high rounded-2xl"
            style={{ opacity: 0 }}
          >
            <div className="flex gap-1 text-primary mb-4">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  ref={el => { if (el) starRefs.current[3][i] = el }}
                  className="material-symbols-outlined text-sm"
                  style={{ opacity: 0 }}
                >
                  star
                </span>
              ))}
            </div>
            <p className="text-on-surface mb-6">
              "Le suivi individualisé fait vraiment la différence. Les formateurs connaissent vos
              points faibles et y travaillent avec vous pas à pas."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-stone-300 flex items-center justify-center font-bold">
                FZ
              </div>
              <div>
                <h5 className="text-sm font-bold">Fatima Zahra</h5>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">
                  Fonctionnaire
                </p>
              </div>
            </div>
          </div>

          {/* Carte 4 — white */}
          <div
            ref={el => { cardRefs.current[4] = el }}
            className="masonry-item p-8 bg-white rounded-2xl border border-outline-variant shadow-sm"
            style={{ opacity: 0 }}
          >
            <p className="text-on-surface-variant leading-relaxed mb-6 italic">
              "Excellent centre. L'approche pédagogique est moderne et efficace. Je recommande
              vivement à tous ceux qui souhaitent progresser rapidement."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center font-bold text-orange-900">
                MA
              </div>
              <div>
                <h5 className="text-sm font-bold">Mohammed Azzouzi</h5>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">
                  Chef de Projet IT
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default Feedbacks