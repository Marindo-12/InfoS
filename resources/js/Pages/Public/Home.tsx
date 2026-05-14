import { Head } from '@inertiajs/react'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import PublicLayout from '@/Layouts/PublicLayout'
import Hero from '@/Components/home/Hero'
import Formations from '@/Components/home/Formations'
import Experience from '@/Components/home/Experience'
import State from '@/Components/home/State'
import Feedbacks from '@/Components/home/Feedbacks'
import Cta from '@/Components/home/Cta'
import History from '@/Components/home/History'

gsap.registerPlugin(ScrollTrigger)

// ── Séparateur visuel entre sections ────────────────────────────────────────
const SectionDivider = ({ index }: { index: number }) => {
  const divRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!divRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        divRef.current!.querySelector('.divider-line'),
        { scaleX: 0, transformOrigin: index % 2 === 0 ? 'left center' : 'right center' },
        {
          scaleX: 1,
          duration: 1.2,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: divRef.current,
            start: 'top 85%',
          },
        }
      )
    }, divRef)
    return () => ctx.revert()
  }, [index])

  return (
    <div ref={divRef} className="overflow-hidden px-8 max-w-7xl mx-auto">
      <div className="divider-line h-px bg-outline-variant/50" style={{ transformOrigin: index % 2 === 0 ? 'left center' : 'right center' }} />
    </div>
  )
}

export default function Home() {
  const progressBarRef = useRef<HTMLDivElement>(null)
  const sectionsRef    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── Barre de progression au scroll ─────────────────────────────────
      gsap.to(progressBarRef.current, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: document.documentElement,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.3,
        },
      })

      // ── Effet parallax global entre sections ────────────────────────────
      // Chaque section (sauf Hero) démarre légèrement vers le bas
      // et remonte au scroll — crée un effet de "pages qui glissent"
      const sections = sectionsRef.current?.querySelectorAll('.page-section')
      sections?.forEach((section) => {
        // Fade-in + slide-up doux quand la section entre dans le viewport
        gsap.fromTo(
          section,
          { opacity: 0.6 },
          {
            opacity: 1,
            duration: 0.6,
            ease: 'power1.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 90%',
              end: 'top 40%',
              scrub: 0.8,
            },
          }
        )
      })

      // ── Effet "reveal depuis le bas" global sur tous les éléments data-reveal ──
      // Permet aux composants enfants d'utiliser data-reveal sans JS supplémentaire
      const revealEls = document.querySelectorAll('[data-reveal]')
      revealEls.forEach(el => {
        gsap.fromTo(
          el,
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1,
            duration: 0.75,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 82%',
            },
          }
        )
      })

      // ── Smooth scroll velocity — inclinaison légère des sections au scroll rapide ──
      // Donne une sensation de "momentum" physique entre les sections
      let lastScrollY = window.scrollY
      let velocity = 0
      let rafId: number

      const updateVelocity = () => {
        const currentY = window.scrollY
        velocity = (currentY - lastScrollY) * 0.04
        lastScrollY = currentY

        sections?.forEach(section => {
          const el = section as HTMLElement
          gsap.to(el, {
            skewY: gsap.utils.clamp(-1.5, 1.5, -velocity),
            duration: 0.6,
            ease: 'power1.out',
            overwrite: 'auto',
          })
        })

        rafId = requestAnimationFrame(updateVelocity)
      }

      rafId = requestAnimationFrame(updateVelocity)

      return () => cancelAnimationFrame(rafId)

    }, sectionsRef)

    return () => ctx.revert()
  }, [])

  return (
    <PublicLayout>
      <Head title="Home" />

      {/* ── Barre de progression scroll ── */}
      <div
        ref={progressBarRef}
        className="fixed top-0 left-0 right-0 h-[2px] bg-primary z-[9999] origin-left"
        style={{ transform: 'scaleX(0)' }}
      />

      <div ref={sectionsRef}>

        {/* Hero — pas d'effet d'entrée, c'est le point de départ */}
        <div className="page-section">
          <Hero />
        </div>

        <SectionDivider index={0} />

        <div className="page-section">
          <History />
        </div>

        <SectionDivider index={1} />

        <div className="page-section">
          <Formations />
        </div>

        <SectionDivider index={2} />

        <div className="page-section">
          <Experience />
        </div>

        <SectionDivider index={3} />

        <div className="page-section">
          <State />
        </div>

        <SectionDivider index={4} />

        <div className="page-section">
          <Feedbacks />
        </div>

        <SectionDivider index={5} />

        <div className="page-section">
          <Cta />
        </div>

      </div>
    </PublicLayout>
  )
}