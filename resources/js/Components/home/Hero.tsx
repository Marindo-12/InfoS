import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const badgeRef = useRef<HTMLSpanElement>(null)
  const line1Ref = useRef<HTMLSpanElement>(null)
  const line2Ref = useRef<HTMLSpanElement>(null)
  const line3Ref = useRef<HTMLSpanElement>(null)
  const paraRef = useRef<HTMLParagraphElement>(null)
  const btnsRef = useRef<HTMLDivElement>(null)
  const imgWrapRef = useRef<HTMLDivElement>(null)
  const blobRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const decorSkewRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Timeline principale (page load) ──────────────────────────────
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      // 1. Badge — clip reveal gauche → droite
      tl.fromTo(
        badgeRef.current,
        { scaleX: 0, transformOrigin: 'left center', opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.55, ease: 'power2.inOut' }
      )

      // 2. Ligne 1 "La précision"
      tl.fromTo(
        line1Ref.current,
        { y: 70, opacity: 0, skewY: 3 },
        { y: 0, opacity: 1, skewY: 0, duration: 0.85 },
        '-=0.2'
      )

      // 3. Ligne 2 "dans chaque" (italic, légère rotation en entrée)
      tl.fromTo(
        line2Ref.current,
        { y: 70, opacity: 0, rotate: -2, skewY: 2 },
        { y: 0, opacity: 1, rotate: 0, skewY: 0, duration: 0.85 },
        '-=0.55'
      )

      // 4. Ligne 3 "Mot."
      tl.fromTo(
        line3Ref.current,
        { y: 70, opacity: 0, skewY: 3 },
        { y: 0, opacity: 1, skewY: 0, duration: 0.85 },
        '-=0.55'
      )

      // 5. Paragraphe
      tl.fromTo(
        paraRef.current,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7 },
        '-=0.4'
      )

      // 6. Boutons en stagger
      tl.fromTo(
        btnsRef.current!.children,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.12 },
        '-=0.35'
      )

      // 7. Image — arrive depuis la droite + scale
      tl.fromTo(
        imgWrapRef.current,
        { x: 60, opacity: 0, rotate: 6, scale: 1.04 },
        { x: 0, opacity: 1, rotate: 2, scale: 1, duration: 1.1, ease: 'power2.out' },
        '-=0.8'
      )

      // 8. Décor skew — fade in
      tl.fromTo(
        decorSkewRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8 },
        '-=0.8'
      )

      // ── Float idle — blob ────────────────────────────────────────────
      gsap.to(blobRef.current, {
        x: 18,
        y: -14,
        duration: 4.5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      })

      // ── Float idle — anneau décoratif ────────────────────────────────
      gsap.to(ringRef.current, {
        y: -10,
        x: 6,
        duration: 3.8,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 1,
      })

      // ── Parallax scroll — image ──────────────────────────────────────
      gsap.to(imgWrapRef.current, {
        yPercent: -12,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
        },
      })

      // ── Parallax scroll — décor skew ─────────────────────────────────
      gsap.to(decorSkewRef.current, {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 2,
        },
      })

      // ── Hover 3D tilt sur l'image ────────────────────────────────────
      const imgEl = imgWrapRef.current
      if (imgEl) {
        const rotateYTo = gsap.quickTo(imgEl, 'rotateY', { duration: 0.4, ease: 'power1.out' })
        const rotateXTo = gsap.quickTo(imgEl, 'rotateX', { duration: 0.4, ease: 'power1.out' })

        const onMove = (e: MouseEvent) => {
          const rect = imgEl.getBoundingClientRect()
          const cx = rect.left + rect.width / 2
          const cy = rect.top + rect.height / 2
          const dx = (e.clientX - cx) / (rect.width / 2)
          const dy = (e.clientY - cy) / (rect.height / 2)
          rotateYTo(dx * 6)
          rotateXTo(-dy * 4)
        }

        const onLeave = () => {
          // Retour à la rotation initiale (légère)
          gsap.to(imgEl, { rotateY: 0, rotateX: 0, rotate: 2, duration: 0.6, ease: 'power2.out' })
        }

        imgEl.addEventListener('mousemove', onMove)
        imgEl.addEventListener('mouseleave', onLeave)

        // Cleanup listeners dans le return de useEffect
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
      className="relative min-h-[90vh] flex items-center overflow-hidden bg-surface-bright py-16 md:py-20"
      style={{ perspective: '1200px' }}
    >
      {/* Décors background */}
      <div className="absolute inset-0 z-0">
        <div
          ref={decorSkewRef}
          className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 transform translate-x-1/2"
        />
        <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-primary/10 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* ── Gauche — Texte ── */}
          <div className="max-w-2xl">
            {/* Badge */}
            <span
              ref={badgeRef}
              className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-extrabold tracking-[0.3em] rounded-full mb-8 uppercase"
              style={{ opacity: 0 }}
            >
              Excellence Établie
            </span>

            {/* Titre — chaque ligne est un span autonome pour le reveal */}
            <h1 className="font-display text-7xl md:text-8xl lg:text-9xl leading-[0.9] mb-8 text-on-background overflow-hidden">
              {/* Chaque ligne est wrappée pour masquer le overflow du slide-up */}
              <span className="block overflow-hidden">
                <span ref={line1Ref} className="block" style={{ opacity: 0 }}>
                  La précision
                </span>
              </span>
              <span className="block overflow-hidden">
                <span ref={line2Ref} className="block text-primary italic" style={{ opacity: 0 }}>
                  dans chaque
                </span>
              </span>
              <span className="block overflow-hidden">
                <span ref={line3Ref} className="block tracking-tight font-light" style={{ opacity: 0 }}>
                  Mot.
                </span>
              </span>
            </h1>

            <p
              ref={paraRef}
              className="text-lg md:text-xl text-on-surface-variant font-light mb-12 leading-relaxed max-w-md"
              style={{ opacity: 0 }}
            >
              Centre Informatique offre un parcours éducatif sur mesure pour les professionnels
              qui cherchent la maîtrise des langues et des technologies.
            </p>

            <div ref={btnsRef} className="flex flex-wrap gap-6">
              <a
                href="/formations"
                className="px-10 py-4 bg-primary text-on-primary rounded-lg font-bold hover:brightness-110 transition-all shadow-xl flex items-center gap-2 group"
                onMouseEnter={e => gsap.to(e.currentTarget, { scale: 1.04, duration: 0.25, ease: 'power2.out' })}
                onMouseLeave={e => gsap.to(e.currentTarget, { scale: 1, duration: 0.3, ease: 'power2.out' })}
              >
                Nos Formations
                <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
              </a>
              <a
                href="/about"
                className="px-10 py-4 border border-outline text-on-surface rounded-lg font-semibold hover:bg-surface-container-high transition-all"
                onMouseEnter={e => gsap.to(e.currentTarget, { x: 3, duration: 0.2, ease: 'power1.out' })}
                onMouseLeave={e => gsap.to(e.currentTarget, { x: 0, duration: 0.25, ease: 'power1.out' })}
              >
                Notre Méthode
              </a>
            </div>
          </div>

          {/* ── Droite — Image ── */}
          <div className="relative hidden lg:block" style={{ transformStyle: 'preserve-3d' }}>
            {/* Wrapper animé (tilt 3D + parallax) */}
            <div
              ref={imgWrapRef}
              className="relative z-10 rounded-2xl overflow-hidden shadow-2xl"
              style={{ opacity: 0, transformStyle: 'preserve-3d', willChange: 'transform' }}
            >
              <img
                alt="Environnement d'apprentissage professionnel"
                className="w-full max-h-[70vh] object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnm6UaxD6wdhKYXgX-yKWcnsvZemSTWor9mGapQcF6GuKKlTyQcqe07FeXCJrwHtuM4s2zbLBKt_8XoZQhPHZFtP2MvWf17tIMfeMUymAHouMUbqnS6XuJzHwjUg8JVfJw7dXGAQlyG1RSR7zlaXPUvDX6psFdW71Sb6ixfdztC8h08CyHv4zRr_CplctYiDIwB20dAaH1xRIwn8KSlq_PaS4pEqqCU6co-ZiR56bSVNzJt-O6yOQz4yTfBkyufhY4QgnqwJjM1DbP"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>

            {/* Blob décoratif */}
            <div
              ref={blobRef}
              className="absolute -bottom-6 -left-6 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10"
            />

            {/* Anneau décoratif */}
            <div
              ref={ringRef}
              className="absolute -top-10 -right-10 w-40 h-40 border-2 border-primary/20 rounded-full -z-10"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero