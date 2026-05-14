import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const stats = [
  { raw: 500, suffix: '+', label: "Étudiants formés" },
  { raw: 95,  suffix: '%', label: "Taux de réussite" },
  { raw: 10,  suffix: '+', label: "Années d'expérience" },
]

const State = () => {
  const sectionRef  = useRef<HTMLElement>(null)
  const blobRef     = useRef<HTMLDivElement>(null)
  const gridRef     = useRef<HTMLDivElement>(null)
  const dividerRefs = useRef<(HTMLDivElement | null)[]>([])
  const valueRefs   = useRef<(HTMLDivElement | null)[]>([])
  const labelRefs   = useRef<(HTMLDivElement | null)[]>([])
  const statBlocks  = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── Blob — slow drift infini ─────────────────────────────────────
      gsap.to(blobRef.current, {
        x: 40,
        y: -30,
        duration: 6,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      })

      // ── Trigger commun ───────────────────────────────────────────────
      const trigger = {
        trigger: sectionRef.current,
        start: 'top 70%',
      }

      // ── Grid entière — fade-in depuis le bas ─────────────────────────
      gsap.fromTo(
        gridRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: trigger,
        }
      )

      // ── Blocs stat — stagger scale + slide ──────────────────────────
      gsap.fromTo(
        statBlocks.current,
        { y: 40, opacity: 0, scale: 0.92 },
        {
          y: 0, opacity: 1, scale: 1,
          duration: 0.7,
          stagger: 0.15,
          ease: 'power3.out',
          delay: 0.15,
          scrollTrigger: trigger,
        }
      )

      // ── Dividers — draw-in vertical ──────────────────────────────────
      dividerRefs.current.forEach((div, i) => {
        if (!div) return
        gsap.fromTo(
          div,
          { scaleY: 0, transformOrigin: 'top center', opacity: 0 },
          {
            scaleY: 1, opacity: 1,
            duration: 0.6,
            ease: 'power2.inOut',
            delay: 0.3 + i * 0.12,
            scrollTrigger: trigger,
          }
        )
      })

      // ── Count-up animé pour chaque valeur ───────────────────────────
      stats.forEach((stat, i) => {
        const el = valueRefs.current[i]
        if (!el) return

        const obj = { val: 0 }

        gsap.to(obj, {
          val: stat.raw,
          duration: 2.2,
          ease: 'power2.out',
          delay: 0.4 + i * 0.15,
          onUpdate: () => {
            el.textContent = Math.round(obj.val) + stat.suffix
          },
          scrollTrigger: {
            ...trigger,
            once: true,
          },
        })

        // Légère pulsation finale quand le chiffre atteint son max
        gsap.fromTo(
          el,
          { scale: 1 },
          {
            scale: 1.08,
            duration: 0.18,
            ease: 'power1.out',
            yoyo: true,
            repeat: 1,
            delay: 0.4 + i * 0.15 + 2.2,
            scrollTrigger: { ...trigger, once: true },
          }
        )
      })

      // ── Labels — fade-up après les chiffres ──────────────────────────
      gsap.fromTo(
        labelRefs.current,
        { y: 14, opacity: 0 },
        {
          y: 0, opacity: 0.6,
          duration: 0.55,
          stagger: 0.15,
          ease: 'power2.out',
          delay: 0.7,
          scrollTrigger: trigger,
        }
      )

      // ── Hover — chaque bloc stat scale-up léger ──────────────────────
      statBlocks.current.forEach(block => {
        if (!block) return
        block.addEventListener('mouseenter', () => {
          gsap.to(block.querySelector('.stat-value'), {
            scale: 1.06,
            duration: 0.25,
            ease: 'power2.out',
          })
        })
        block.addEventListener('mouseleave', () => {
          gsap.to(block.querySelector('.stat-value'), {
            scale: 1,
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
      className="py-24 bg-on-surface text-background relative overflow-hidden"
    >
      {/* Blob décoratif */}
      <div
        ref={blobRef}
        className="absolute right-[-10%] top-[-20%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center"
          style={{ opacity: 0 }}
        >
          {stats.map((stat, i) => (
            <div key={stat.label} className="relative">

              {/* Divider vertical — seulement entre les colonnes */}
              {i > 0 && (
                <div
                  ref={el => { dividerRefs.current[i - 1] = el }}
                  className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-16 bg-white/10"
                  style={{ opacity: 0 }}
                />
              )}

              <div
                ref={el => { statBlocks.current[i] = el }}
                className="py-8 md:py-0"
                style={{ opacity: 0 }}
              >
                <div
                  ref={el => { valueRefs.current[i] = el }}
                  className="stat-value font-display text-7xl text-primary mb-2 inline-block"
                  style={{ display: 'inline-block' }}
                >
                  0{stat.suffix}
                </div>
                <div
                  ref={el => { labelRefs.current[i] = el }}
                  className="uppercase tracking-[0.3em] text-xs font-semibold"
                  style={{ opacity: 0 }}
                >
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default State