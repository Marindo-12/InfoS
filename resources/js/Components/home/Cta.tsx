import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from '@inertiajs/react'

gsap.registerPlugin(ScrollTrigger)

const Cta = () => {
  const sectionRef   = useRef<HTMLElement>(null)
  const eyebrowRef   = useRef<HTMLSpanElement>(null)
  const titleRef     = useRef<HTMLHeadingElement>(null)
  const paraRef      = useRef<HTMLParagraphElement>(null)
  const btnsRef      = useRef<HTMLDivElement>(null)
  const line1Ref     = useRef<HTMLDivElement>(null)
  const line2Ref     = useRef<HTMLDivElement>(null)
  const orb1Ref      = useRef<HTMLDivElement>(null)
  const orb2Ref      = useRef<HTMLDivElement>(null)
  const decorNumsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {

      const trigger = {
        trigger: sectionRef.current,
        start: 'top 72%',
      }

      // ── Orbs — drift idle ─────────────────────────────────────────────
      gsap.to(orb1Ref.current, {
        x: 30, y: -20,
        duration: 5.5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      })
      gsap.to(orb2Ref.current, {
        x: -24, y: 18,
        duration: 4.2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 1.2,
      })

      // ── Lignes décoratives — draw-in horizontal ───────────────────────
      gsap.fromTo(
        line1Ref.current,
        { scaleX: 0, transformOrigin: 'left center', opacity: 0 },
        {
          scaleX: 1, opacity: 1,
          duration: 0.9,
          ease: 'power3.inOut',
          scrollTrigger: trigger,
        }
      )
      gsap.fromTo(
        line2Ref.current,
        { scaleX: 0, transformOrigin: 'right center', opacity: 0 },
        {
          scaleX: 1, opacity: 1,
          duration: 0.9,
          ease: 'power3.inOut',
          delay: 0.08,
          scrollTrigger: trigger,
        }
      )

      // ── Eyebrow ───────────────────────────────────────────────────────
      gsap.fromTo(
        eyebrowRef.current,
        { y: 20, opacity: 0, letterSpacing: '0.1em' },
        {
          y: 0, opacity: 1, letterSpacing: '0.3em',
          duration: 0.7,
          ease: 'power2.out',
          delay: 0.2,
          scrollTrigger: trigger,
        }
      )

      // ── Titre — lignes en slide-up avec overflow masqué ───────────────
      const titleLines = titleRef.current?.querySelectorAll('.cta-line')
      if (titleLines) {
        gsap.fromTo(
          titleLines,
          { y: 80, opacity: 0, skewY: 2 },
          {
            y: 0, opacity: 1, skewY: 0,
            duration: 0.9,
            stagger: 0.12,
            ease: 'power3.out',
            delay: 0.3,
            scrollTrigger: trigger,
          }
        )
      }

      // ── Paragraphe ────────────────────────────────────────────────────
      gsap.fromTo(
        paraRef.current,
        { y: 24, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.7,
          ease: 'power2.out',
          delay: 0.55,
          scrollTrigger: trigger,
        }
      )

      // ── Boutons — stagger + scale depuis 0.88 ─────────────────────────
      if (btnsRef.current?.children) {
        gsap.fromTo(
          btnsRef.current.children,
          { y: 20, opacity: 0, scale: 0.88 },
          {
            y: 0, opacity: 1, scale: 1,
            duration: 0.55,
            stagger: 0.14,
            ease: 'back.out(1.4)',
            delay: 0.7,
            scrollTrigger: trigger,
          }
        )
      }

      // ── Numéros décoratifs — fade in flottant ─────────────────────────
      const decorNums = decorNumsRef.current?.querySelectorAll('.decor-num')
      if (decorNums) {
        gsap.fromTo(
          decorNums,
          { opacity: 0, y: 10 },
          {
            opacity: 1, y: 0,
            duration: 0.6,
            stagger: 0.2,
            ease: 'power2.out',
            delay: 0.8,
            scrollTrigger: trigger,
          }
        )
      }

      // ── Hover bouton primaire ─────────────────────────────────────────
      const btnPrimary = btnsRef.current?.querySelector('.btn-primary')
      if (btnPrimary) {
        btnPrimary.addEventListener('mouseenter', () => {
          gsap.to(btnPrimary, { scale: 1.04, duration: 0.25, ease: 'power2.out' })
        })
        btnPrimary.addEventListener('mouseleave', () => {
          gsap.to(btnPrimary, { scale: 1, duration: 0.3, ease: 'power2.out' })
        })
      }

      // ── Hover bouton secondaire — slide subtil ────────────────────────
      const btnSecondary = btnsRef.current?.querySelector('.btn-secondary')
      if (btnSecondary) {
        btnSecondary.addEventListener('mouseenter', () => {
          gsap.to(btnSecondary, { x: 4, duration: 0.2, ease: 'power1.out' })
        })
        btnSecondary.addEventListener('mouseleave', () => {
          gsap.to(btnSecondary, { x: 0, duration: 0.25, ease: 'power1.out' })
        })
      }

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative py-40 px-8 overflow-hidden bg-surface-bright"
      id="apply"
    >
      {/* ── Orbs décoratifs flous ── */}
      <div
        ref={orb1Ref}
        className="absolute top-[-80px] left-[10%] w-[420px] h-[420px] rounded-full bg-primary/8 blur-[100px] pointer-events-none"
      />
      <div
        ref={orb2Ref}
        className="absolute bottom-[-60px] right-[8%] w-[340px] h-[340px] rounded-full bg-primary/12 blur-[90px] pointer-events-none"
      />

      {/* ── Numéros décoratifs flottants ── */}
      <div
        ref={decorNumsRef}
        className="absolute inset-0 pointer-events-none select-none overflow-hidden"
      >
        <span className="decor-num absolute top-[12%] left-[4%] font-display text-[120px] text-primary/4 leading-none" style={{ opacity: 0 }}>01</span>
        <span className="decor-num absolute bottom-[10%] right-[3%] font-display text-[120px] text-primary/4 leading-none" style={{ opacity: 0 }}>02</span>
      </div>

      <div className="max-w-4xl mx-auto relative z-10 text-center">

        {/* ── Ligne décorative top ── */}
        <div className="flex items-center gap-6 mb-12 justify-center">
          <div
            ref={line1Ref}
            className="h-px bg-primary/30 flex-1 max-w-[120px]"
            style={{ opacity: 0 }}
          />
          <span
            ref={eyebrowRef}
            className="text-primary font-bold text-[10px] tracking-[0.3em] uppercase"
            style={{ opacity: 0 }}
          >
            Inscriptions ouvertes
          </span>
          <div
            ref={line2Ref}
            className="h-px bg-primary/30 flex-1 max-w-[120px]"
            style={{ opacity: 0 }}
          />
        </div>

        {/* ── Titre massif avec overflow masqué ── */}
        <h2
          ref={titleRef}
          className="font-display text-6xl md:text-7xl lg:text-8xl leading-[0.92] mb-10"
        >
          <span className="block overflow-hidden">
            <span className="cta-line block" style={{ opacity: 0 }}>Prêt à rejoindre</span>
          </span>
          <span className="block overflow-hidden">
            <span className="cta-line block text-primary italic" style={{ opacity: 0 }}>l'excellence ?</span>
          </span>
        </h2>

        {/* ── Para ── */}
        <p
          ref={paraRef}
          className="text-xl text-on-surface-variant font-light mb-14 max-w-xl mx-auto leading-relaxed"
          style={{ opacity: 0 }}
        >
          Les inscriptions pour la prochaine session sont ouvertes.
          Sécurisez votre place dès maintenant — les places sont limitées.
        </p>

        {/* ── Boutons ── */}
        <div ref={btnsRef} className="flex flex-wrap justify-center gap-6">
          <Link
            href="/inscriptions"
            className="btn-primary px-12 py-5 bg-primary text-on-primary rounded-lg font-bold text-lg shadow-lg active:scale-95 transition-none"
            style={{ opacity: 0 }}
          >
            Déposer ma candidature
          </Link>
          <a
            href="/contact"
            className="btn-secondary px-12 py-5 border-2 border-primary text-primary rounded-lg font-bold text-lg hover:bg-primary hover:text-on-primary transition-colors inline-flex items-center gap-2 group"
            style={{ opacity: 0 }}
          >
            Nous contacter
            <span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-1">
              arrow_forward
            </span>
          </a>
        </div>

        {/* ── Ligne décorative bottom ── */}
        <div className="mt-20 flex items-center justify-center gap-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-primary/30"
              style={{
                transform: i === 2 ? 'scale(1.8)' : 'scale(1)',
                opacity: 1 - Math.abs(i - 2) * 0.25,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Cta