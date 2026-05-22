import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import firstimage from '../../../../public/images/home_first.png'
import secondimage from '../../../../public/images/home_second.png'

gsap.registerPlugin(ScrollTrigger)

/* ─────────────────────────────────────────────────────────────
   WORD HIGHLIGHTER
   Splits text into individual <span> words, each coloured
   in primary orange.  The spans are used as GSAP targets.
───────────────────────────────────────────────────────────── */
interface WordLineProps {
  text: string
  italic?: boolean
  className?: string
}

const WordLine = React.forwardRef<HTMLSpanElement, WordLineProps>(
  ({ text, italic, className = '' }, ref) => (
    <span
      ref={ref}
      className={`block ${italic ? 'font-normal italic' : ''} ${className}`}
      style={{ opacity: 0 }}
      aria-label={text}
    >
      {text.split(' ').map((word, i) => (
        <span
          key={i}
          className="word-token mr-[0.22em] inline-block text-primary last:mr-0"
          aria-hidden="true"
        >
          {word}
        </span>
      ))}
    </span>
  )
)

WordLine.displayName = 'WordLine'

/* ─────────────────────────────────────────────────────────────
   HERO
───────────────────────────────────────────────────────────── */
const Hero: React.FC = () => {
  const sectionRef    = useRef<HTMLElement>(null)
  const badgeRef      = useRef<HTMLSpanElement>(null)
  const line1Ref      = useRef<HTMLSpanElement>(null)
  const line2Ref      = useRef<HTMLSpanElement>(null)
  const line3Ref      = useRef<HTMLSpanElement>(null)
  const paraRef       = useRef<HTMLParagraphElement>(null)
  const btnsRef       = useRef<HTMLDivElement>(null)
  const trustRef      = useRef<HTMLDivElement>(null)

  // Right column elements
  const rightColRef   = useRef<HTMLDivElement>(null)
  const img1WrapRef   = useRef<HTMLDivElement>(null)
  const img2WrapRef   = useRef<HTMLDivElement>(null)
  const floatCardRef  = useRef<HTMLDivElement>(null)
  const floatIconRef  = useRef<HTMLDivElement>(null)
  const decorRingRef  = useRef<HTMLDivElement>(null)
  const decorBlobRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cleanupTilt: (() => void) | undefined

    const ctx = gsap.context(() => {

      /* ── Master entrance timeline ── */
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      // Badge pill scales in from left
      tl.fromTo(badgeRef.current,
        { scaleX: 0, transformOrigin: 'left center', opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.55, ease: 'power2.inOut' }
      )

      // H1 lines: each line clips up, then words stagger in x
      ;[line1Ref, line2Ref, line3Ref].forEach((ref, i) => {
        tl.fromTo(ref.current,
          { y: 72, opacity: 0, skewY: i === 1 ? 0 : 2.5, rotate: i === 1 ? -1.5 : 0 },
          { y: 0, opacity: 1, skewY: 0, rotate: 0, duration: 0.88 },
          `-=${i === 0 ? 0.1 : 0.6}`
        )
        // Words within each line stagger x
        if (ref.current) {
          const words = ref.current.querySelectorAll<HTMLElement>('.word-token')
          tl.fromTo(words,
            { x: -18, opacity: 0 },
            { x: 0, opacity: 1, stagger: 0.07, duration: 0.45, ease: 'power2.out' },
            `-=0.55`
          )
        }
      })

      // Paragraph
      tl.fromTo(paraRef.current,
        { y: 26, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.65 },
        '-=0.4'
      )

      // Buttons stagger
      tl.fromTo(btnsRef.current?.children ?? [],
        { y: 22, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.13, duration: 0.5 },
        '-=0.35'
      )

      // Trust row
      tl.fromTo(trustRef.current,
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        '-=0.25'
      )

      // ── Right column sequence ──

      // Decorative shapes first (behind images)
      tl.fromTo([decorBlobRef.current, decorRingRef.current],
        { opacity: 0, scale: 0.88 },
        { opacity: 1, scale: 1, stagger: 0.12, duration: 0.8, ease: 'power2.out' },
        '-=0.6'
      )

      // Image 1: top-right — slides in from right + slight rotation
      tl.fromTo(img1WrapRef.current,
        { x: 80, opacity: 0, rotate: -5, scale: 1.06 },
        { x: 0, opacity: 1, rotate: -2, scale: 1, duration: 1.05, ease: 'power2.out' },
        '-=0.55'
      )

      // Image 2: bottom-left — slides in from left + slight rotation
      tl.fromTo(img2WrapRef.current,
        { x: -80, opacity: 0, rotate: 6, scale: 1.06 },
        { x: 0, opacity: 1, rotate: 3, scale: 1, duration: 1.05, ease: 'power2.out' },
        '-=0.8'
      )

      // Floating verified card — pops in with back ease
      tl.fromTo(floatCardRef.current,
        { x: 24, opacity: 0, scale: 0.85 },
        { x: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(2)' },
        '-=0.4'
      )

      // Language icon orb — bounces in
      tl.fromTo(floatIconRef.current,
        { y: -28, opacity: 0, scale: 0.7, rotation: -20 },
        { y: 0, opacity: 1, scale: 1, rotation: 0, duration: 0.7, ease: 'back.out(2)' },
        '-=0.5'
      )

      /* ── Ambient floating animations (infinite) ── */

      // Blob drifts slowly
      gsap.to(decorBlobRef.current, {
        x: 16, y: -12,
        duration: 4.5, ease: 'sine.inOut',
        yoyo: true, repeat: -1,
      })

      // Ring drifts opposite direction
      gsap.to(decorRingRef.current, {
        y: -10, x: 8,
        duration: 3.8, ease: 'sine.inOut',
        yoyo: true, repeat: -1, delay: 1.2,
      })

      // Floating card gentle bob
      gsap.to(floatCardRef.current, {
        y: -6,
        duration: 2.8, ease: 'sine.inOut',
        yoyo: true, repeat: -1, delay: 1.8,
      })

      // Language icon gentle rotation + bob
      gsap.to(floatIconRef.current, {
        y: -8, rotation: 8,
        duration: 3.2, ease: 'sine.inOut',
        yoyo: true, repeat: -1, delay: 0.5,
      })

      /* ── Scroll parallax ── */
      gsap.to(rightColRef.current, {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.4,
        },
      })

      // Words subtle parallax on scroll
      gsap.to(sectionRef.current?.querySelectorAll('.word-token') ?? [], {
        yPercent: -5,
        ease: 'none',
        stagger: 0.01,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 2,
        },
      })

      /* ── 3-D tilt on right column (mouse tracking) ── */
      const imgWrap = rightColRef.current
      if (imgWrap) {
        const rotY = gsap.quickTo(imgWrap, 'rotateY', { duration: 0.45, ease: 'power1.out' })
        const rotX = gsap.quickTo(imgWrap, 'rotateX', { duration: 0.45, ease: 'power1.out' })

        const onMove = (e: MouseEvent) => {
          const rect = imgWrap.getBoundingClientRect()
          const cx = rect.left + rect.width  / 2
          const cy = rect.top  + rect.height / 2
          rotY((e.clientX - cx) / (rect.width  / 2) * 5)
          rotX(-(e.clientY - cy) / (rect.height / 2) * 3.5)
        }
        const onLeave = () =>
          gsap.to(imgWrap, { rotateY: 0, rotateX: 0, duration: 0.7, ease: 'power2.out' })

        imgWrap.addEventListener('mousemove', onMove)
        imgWrap.addEventListener('mouseleave', onLeave)
        cleanupTilt = () => {
          imgWrap.removeEventListener('mousemove', onMove)
          imgWrap.removeEventListener('mouseleave', onLeave)
        }
      }

      /* ── Button hover micro-interactions ── */
      if (btnsRef.current) {
        const btns = btnsRef.current.querySelectorAll<HTMLElement>('a, button')
        btns.forEach((btn) => {
          btn.addEventListener('mouseenter', () =>
            gsap.to(btn, { scale: 1.045, duration: 0.22, ease: 'power2.out' })
          )
          btn.addEventListener('mouseleave', () =>
            gsap.to(btn, { scale: 1, duration: 0.28, ease: 'power2.out' })
          )
        })
      }

    }, sectionRef)

    return () => {
      cleanupTilt?.()
      ctx.revert()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[90vh] items-center overflow-hidden bg-surface-bright py-16 md:py-20"
      style={{ perspective: '1200px' }}
    >
      {/* ── Decorative background layer ── */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {/* Skewed panel — right side */}
        <div className="absolute right-0 top-0 h-full w-1/3 origin-top-right -skew-x-12 bg-surface-container-low" />
        {/* Warm blob top-right */}
        <div className="absolute -right-24 -top-24 h-[560px] w-[560px] rounded-full bg-primary/5 blur-3xl" />
        {/* Circles */}
        <div className="absolute left-[-4rem] top-1/4 h-64 w-64 rounded-full border border-outline-variant/40" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 translate-x-1/2 rounded-full border border-primary/10" />
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(154,144,136,0.55) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 h-1/4 w-full bg-gradient-to-t from-primary/8 to-transparent" />
      </div>

      {/* ── Main grid ── */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-8">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">

          {/* ══ LEFT COLUMN ══ */}
          <div className="max-w-2xl">

            {/* Badge */}
            <span
              ref={badgeRef}
              className="mb-8 inline-flex items-center rounded-full bg-surface-container-high px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.28em] text-primary"
              style={{ opacity: 0 }}
            >
              Excellence établie
            </span>

            {/* H1 — every word in orange */}
            <h1 className="font-display text-6xl leading-[0.92] md:text-8xl lg:text-9xl">
              <span className="block overflow-hidden">
                <WordLine ref={line1Ref} text="La précision" />
              </span>
              <span className="block overflow-hidden">
                <WordLine ref={line2Ref} text="dans chaque" italic />
              </span>
              <span className="block overflow-hidden">
                <WordLine ref={line3Ref} text="Mot." italic className="tracking-tight" />
              </span>
            </h1>

            {/* Paragraph */}
            <p
              ref={paraRef}
              className="mt-8 max-w-xl text-lg leading-relaxed text-on-surface-variant md:text-xl"
              style={{ opacity: 0 }}
            >
              Info Saloua offre un parcours éducatif sur mesure pour les apprenants qui
              cherchent la maîtrise des langues, de la bureautique et des technologies modernes.
            </p>

            {/* CTA buttons */}
            <div ref={btnsRef} className="mt-10 flex flex-wrap gap-4">
              <a
                href="/formations"
                className="group flex items-center gap-2 rounded-lg bg-primary px-8 py-4 font-bold text-on-primary shadow-xl transition-all hover:brightness-110"
              >
                Nos Formations
                <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
              </a>
              <a
                href="/about"
                className="rounded-lg border border-outline bg-transparent px-8 py-4 font-semibold text-on-surface transition-all hover:bg-surface-container-high"
              >
                Notre Méthode
              </a>
            </div>

            {/* Trust row */}
            <div
              ref={trustRef}
              className="mt-12 flex flex-wrap items-center gap-6 border-t border-outline-variant/50 pt-8"
              style={{ opacity: 0 }}
            >
              {/* Avatar stack */}
              <div className="flex -space-x-3">
                {['LS', 'IF'].map((label) => (
                  <div
                    key={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-surface-container-highest text-xs font-bold text-primary shadow-sm"
                  >
                    {label}
                  </div>
                ))}
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-primary text-xs font-bold text-on-primary shadow-sm">
                  +2k
                </div>
              </div>
              <div className="text-sm text-on-surface-variant">
                <span className="block font-bold text-on-surface">Rejoint par des apprenants ambitieux</span>
                Programmes pratiques, rythme flexible, suivi humain.
              </div>
            </div>
          </div>

          {/* ══ RIGHT COLUMN ══ */}
          <div
            className="relative hidden min-h-[520px] lg:block"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div
              ref={rightColRef}
              className="relative h-[520px] w-full"
              style={{ opacity: 1, transformStyle: 'preserve-3d', willChange: 'transform' }}
            >

              {/* ── Decorative shapes (behind images) ── */}
              <div
                ref={decorRingRef}
                className="absolute right-10 top-12 -z-10 h-80 w-64 rotate-6 rounded-2xl border-2 border-primary/20"
                style={{ opacity: 0 }}
              />
              <div
                ref={decorBlobRef}
                className="absolute bottom-8 left-10 -z-10 h-72 w-72 -rotate-3 rounded-3xl bg-surface-container-highest/70"
                style={{ opacity: 0 }}
              />

              {/* ── Image 1 — top-right, tilted slightly left ── */}
              <div
                ref={img1WrapRef}
                className="absolute right-4 top-0 z-20 aspect-[4/5] w-[66%] overflow-hidden rounded-2xl border-4 border-white shadow-2xl transition-transform duration-700 hover:rotate-0"
                style={{ rotate: '-2deg', opacity: 0 }}
              >
                <img
                  alt="Environnement d'apprentissage professionnel"
                  className="h-full w-full object-cover"
                  src={firstimage}
                />
              </div>

              {/* ── Image 2 — bottom-left, overlapping img1, tilted right ── */}
              <div
                ref={img2WrapRef}
                className="absolute bottom-4 left-4 z-30 aspect-square w-[62%] overflow-hidden rounded-2xl border-4 border-white shadow-2xl transition-transform duration-700 hover:rotate-0"
                style={{ rotate: '3deg', opacity: 0 }}
              >
                <img
                  alt="Salle de formation collaborative"
                  className="h-full w-full object-cover"
                  src={secondimage}
                />
              </div>

              {/* ── Floating verified card — vertically centred on the right edge ── */}
              <div
                ref={floatCardRef}
                className="absolute right-0 top-1/2 z-40 max-w-[170px] -translate-y-1/2 rounded-xl border border-outline-variant/50 bg-white/90 p-4 shadow-lg backdrop-blur-md"
                style={{ opacity: 0 }}
              >
                <div className="mb-1 flex items-center gap-2">
                  <span
                    className="material-symbols-outlined text-sm text-primary"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">
                    Certifié
                  </span>
                </div>
                <p className="text-xs leading-tight text-on-surface">
                  Des formations orientées compétences et pratique.
                </p>
              </div>

              {/* ── Language icon orb — top-left corner ── */}
              <div
                ref={floatIconRef}
                className="absolute -left-6 -top-6 z-10 flex h-24 w-24 items-center justify-center rounded-full bg-tertiary-fixed-dim/20 text-tertiary"
                style={{ opacity: 0 }}
              >
                <span
                  className="material-symbols-outlined text-3xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  language
                </span>
              </div>

            </div>
          </div>
          {/* ══ END RIGHT COLUMN ══ */}

        </div>
      </div>
    </section>
  )
}

export default Hero