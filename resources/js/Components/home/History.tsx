import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const History = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const imgColRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const blobCircleRef = useRef<HTMLDivElement>(null)
  const citationRef = useRef<HTMLDivElement>(null)
  const badgeRef = useRef<HTMLSpanElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const para1Ref = useRef<HTMLParagraphElement>(null)
  const para2Ref = useRef<HTMLParagraphElement>(null)
  const missionRef = useRef<HTMLDivElement>(null)
  const histoireRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const triggerDefaults = {
        trigger: sectionRef.current,
        start: 'top 72%',
      }

      // ── Image colonne — slide depuis la gauche ───────────────────────
      gsap.fromTo(
        imgColRef.current,
        { x: -80, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: triggerDefaults,
        }
      )

      // ── Image elle-même — léger scale reveal ─────────────────────────
      gsap.fromTo(
        imgRef.current,
        { scale: 1.06 },
        {
          scale: 1,
          duration: 1.4,
          ease: 'power2.out',
          scrollTrigger: triggerDefaults,
        }
      )

      // ── Blob cercle décoratif — pop depuis 0 ─────────────────────────
      gsap.fromTo(
        blobCircleRef.current,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 0.5,
          duration: 0.9,
          ease: 'back.out(1.6)',
          delay: 0.2,
          scrollTrigger: triggerDefaults,
        }
      )

      // ── Citation card — pop avec rebond ──────────────────────────────
      gsap.fromTo(
        citationRef.current,
        { scale: 0.72, opacity: 0, rotate: 10, y: 20 },
        {
          scale: 1,
          opacity: 1,
          rotate: 0,
          y: 0,
          duration: 0.85,
          ease: 'back.out(1.4)',
          delay: 0.45,
          scrollTrigger: triggerDefaults,
        }
      )

      // ── Badge texte — fade + slide ────────────────────────────────────
      gsap.fromTo(
        badgeRef.current,
        { x: 30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: { ...triggerDefaults, start: 'top 70%' },
        }
      )

      // ── Titre — lignes en slide-up ────────────────────────────────────
      // On cible les éléments enfants directs (texte wrappé en spans)
      gsap.fromTo(
        titleRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          ease: 'power3.out',
          delay: 0.1,
          scrollTrigger: { ...triggerDefaults, start: 'top 70%' },
        }
      )

      // ── Paragraphe 1 ─────────────────────────────────────────────────
      gsap.fromTo(
        para1Ref.current,
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          ease: 'power2.out',
          delay: 0.2,
          scrollTrigger: { ...triggerDefaults, start: 'top 68%' },
        }
      )

      // ── Paragraphe 2 ─────────────────────────────────────────────────
      gsap.fromTo(
        para2Ref.current,
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          ease: 'power2.out',
          delay: 0.32,
          scrollTrigger: { ...triggerDefaults, start: 'top 68%' },
        }
      )

      // ── Mission & Histoire — stagger depuis le bas ────────────────────
      gsap.fromTo(
        [missionRef.current, histoireRef.current],
        { y: 32, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          ease: 'power2.out',
          stagger: 0.15,
          delay: 0.4,
          scrollTrigger: { ...triggerDefaults, start: 'top 65%' },
        }
      )

      // ── Float idle — blob cercle ──────────────────────────────────────
      gsap.to(blobCircleRef.current, {
        y: -12,
        x: 8,
        duration: 4,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 1,
      })

      // ── Parallax léger — image au scroll ─────────────────────────────
      gsap.to(imgRef.current, {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
      })

      // ── Hover tilt sur l'image ────────────────────────────────────────
      const imgEl = imgRef.current
      if (imgEl) {
        const rotateYTo = gsap.quickTo(imgEl, 'rotateY', { duration: 0.5, ease: 'power1.out' })
        const rotateXTo = gsap.quickTo(imgEl, 'rotateX', { duration: 0.5, ease: 'power1.out' })

        const onMove = (e: MouseEvent) => {
          const rect = imgEl.getBoundingClientRect()
          const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)
          const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)
          rotateYTo(dx * 5)
          rotateXTo(-dy * 3)
        }
        const onLeave = () => {
          gsap.to(imgEl, { rotateY: 0, rotateX: 0, duration: 0.7, ease: 'power2.out' })
        }

        imgEl.addEventListener('mousemove', onMove)
        imgEl.addEventListener('mouseleave', onLeave)

        return () => {
          imgEl.removeEventListener('mousemove', onMove)
          imgEl.removeEventListener('mouseleave', onLeave)
        }
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-32 bg-white relative overflow-hidden"
      id="about"
      style={{ perspective: '1200px' }}
    >
      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-20">

          {/* ── Colonne image ── */}
          <div ref={imgColRef} className="w-full lg:w-1/2" style={{ opacity: 0 }}>
            <div className="relative" style={{ transformStyle: 'preserve-3d' }}>

              {/* Blob cercle décoratif */}
              <div
                ref={blobCircleRef}
                className="absolute -top-10 -left-10 w-32 h-32 bg-primary-fixed rounded-full -z-10"
                style={{ opacity: 0 }}
              />

              {/* Image principale */}
              <img
                ref={imgRef}
                alt="Centre d'apprentissage moderne"
                className="rounded-2xl shadow-2xl w-full h-[550px] object-cover relative z-10"
                style={{ willChange: 'transform' }}
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_ZoEDywvm5iEbkq1S6VSKGqkaJOi96XTttssRJh5QF7-fjtynlGBhyLI_1ByZaY5BW-FX5r29qK-ob9VB2IBqEF7oWTxwX-DMdliYRhnkuIwp6Q7Ye9Llmafcej0DQcRvRVwJ4Fw15Npye94FYgiVyLjLMfG3K8L9AgSG1up8qyrdYuKy36FrNo1omb6cuu_q21h3wePwzqXmOVyWov-c4ESm3RAeKj32tNtlRJPpxo01FmvruWJl-v_Ql2_rJ0eGS5UZ_oZ5GNsj"
              />

              {/* Citation card — pop avec rebond */}
              <div
                ref={citationRef}
                className="absolute -bottom-6 -right-6 bg-primary p-8 rounded-xl shadow-xl z-20 hidden md:block"
                style={{ opacity: 0 }}
              >
                <p className="text-on-primary font-display text-2xl italic">
                  Fondée sur le principe de la synthèse linguistique et technique.
                </p>
              </div>
            </div>
          </div>

          {/* ── Colonne texte ── */}
          <div className="w-full lg:w-1/2 space-y-8">

            <span
              ref={badgeRef}
              className="text-primary font-bold tracking-[0.2em] text-xs uppercase"
              style={{ opacity: 0, display: 'block' }}
            >
              Héritage d'une académie d'élite
            </span>

            <h2
              ref={titleRef}
              className="font-display text-5xl md:text-6xl text-on-background leading-tight"
              style={{ opacity: 0 }}
            >
              Façonner l'avenir de{' '}
              <span className="italic text-primary">l'épanouissement professionnel.</span>
            </h2>

            <p
              ref={para1Ref}
              className="text-on-surface-variant text-lg leading-relaxed font-light"
              style={{ opacity: 0 }}
            >
              Depuis plus d'une décennie, Elite Academy se tient à la croisée de l'intelligence
              culturelle et de l'innovation technologique. Notre mission est de doter les
              professionnels de la double maîtrise nécessaire à la scène mondiale du XXIe siècle :
              la maîtrise nuancée des langues et la compétence technique en ingénierie full‑stack.
            </p>

            <p
              ref={para2Ref}
              className="text-on-surface-variant text-lg leading-relaxed font-light"
              style={{ opacity: 0 }}
            >
              Nous ne proposons pas seulement des cours ; nous organisons des expériences qui
              définissent une carrière. Notre centre a été conçu comme un sanctuaire pour un
              apprentissage ciblé et à fort impact, où chaque outil pédagogique est conçu pour
              vous rapprocher de l'élite des talents mondiaux.
            </p>

            <div className="grid grid-cols-2 gap-8 pt-4">
              <div ref={missionRef} style={{ opacity: 0 }}>
                <h4 className="font-bold text-primary text-xl mb-2">Notre mission</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Combler le fossé entre la communication humaine et l'infrastructure numérique.
                </p>
              </div>
              <div ref={histoireRef} style={{ opacity: 0 }}>
                <h4 className="font-bold text-primary text-xl mb-2">Notre histoire</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  D'un laboratoire de langues de niche à un institut mondial de premier plan pour
                  l'informatique et la diplomatie.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default History