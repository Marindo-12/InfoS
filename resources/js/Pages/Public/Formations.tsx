import Footer from '@/Components/Footer'
import Navbar from '@/Components/Navbar'
import { Head } from '@inertiajs/react'
import { Link } from '@inertiajs/react'
import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'

gsap.registerPlugin(ScrollTrigger)

const successRateData = [
  { year: '2020', rate: 82 },
  { year: '2021', rate: 86 },
  { year: '2022', rate: 89 },
  { year: '2023', rate: 92 },
  { year: '2024', rate: 94 },
]

const laureatesByField = [
  { name: 'Médecine',   value: 180 },
  { name: 'ENCG/ISCAE', value: 250 },
  { name: 'ENSA/ENSAM', value: 120 },
  { name: 'Langues',    value:  80 },
]
const COLORS = ['#c2652a', '#e08850', '#f0a878', '#d8d0c8']

const Formations = () => {
  const pageRef = useRef<HTMLDivElement>(null)

  // ── Hero refs ──
  const heroTextRef  = useRef<HTMLDivElement>(null)
  const heroBadgeRef = useRef<HTMLSpanElement>(null)

  // ── Nouveaux refs pour les sections Langues et Concours ──
  const languesSectionRef = useRef<HTMLElement>(null)
  const concoursSectionRef = useRef<HTMLElement>(null)

  // ── Other section refs ──
  const packsRef      = useRef<HTMLElement>(null)
  const bureautiqueRef = useRef<HTMLElement>(null)
  const statsRef      = useRef<HTMLElement>(null)
  const faqRef        = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ══════════════════════════════════════════════════════════════════
      // PROGRESS BAR
      // ══════════════════════════════════════════════════════════════════
      gsap.to('.formations-progress', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: document.documentElement,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.3,
        },
      })

      // ══════════════════════════════════════════════════════════════════
      // HERO — timeline séquentielle
      // ══════════════════════════════════════════════════════════════════
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      heroTl
        .fromTo(heroBadgeRef.current!,
          { scaleX: 0, transformOrigin: 'left center', opacity: 0 },
          { scaleX: 1, opacity: 1, duration: 0.6, ease: 'power2.inOut' }
        )
        .fromTo(heroTextRef.current!.querySelectorAll('.hero-line'),
          { y: 70, opacity: 0, skewY: 2 },
          { y: 0, opacity: 1, skewY: 0, duration: 0.9, stagger: 0.12 },
          '-=0.2'
        )
        .fromTo(heroTextRef.current!.querySelector('.hero-para') as HTMLElement,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7 },
          '-=0.4'
        )
        .fromTo(heroTextRef.current!.querySelector('.hero-arrow') as HTMLElement,
          { opacity: 0 },
          { opacity: 1, duration: 0.5 },
          '-=0.3'
        )

      // Hero parallax bg
      gsap.to('.hero-bg-img', {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        },
      })

      // ══════════════════════════════════════════════════════════════════
      // SECTION LANGUES (animation normale)
      // ══════════════════════════════════════════════════════════════════
      if (languesSectionRef.current) {
        const trigger = { trigger: languesSectionRef.current, start: 'top 78%' }

        gsap.fromTo(
          languesSectionRef.current.querySelector('.langues-header'),
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', scrollTrigger: trigger }
        )

        gsap.fromTo(
          languesSectionRef.current.querySelectorAll('.langues-row'),
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.15, ease: 'power3.out', delay: 0.2, scrollTrigger: trigger }
        )
      }

      // ══════════════════════════════════════════════════════════════════
      // SECTION CONCOURS (animation normale)
      // ══════════════════════════════════════════════════════════════════
      if (concoursSectionRef.current) {
        const trigger = { trigger: concoursSectionRef.current, start: 'top 78%' }

        gsap.fromTo(
          concoursSectionRef.current.querySelector('.concours-header'),
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', scrollTrigger: trigger }
        )

        gsap.fromTo(
          concoursSectionRef.current.querySelectorAll('.concours-card'),
          { y: 40, opacity: 0, scale: 0.96 },
          { y: 0, opacity: 1, scale: 1, duration: 0.65, stagger: 0.12, ease: 'power3.out', delay: 0.2, scrollTrigger: trigger }
        )
      }

      // ══════════════════════════════════════════════════════════════════
      // PACKS SECTION (inchangé)
      // ══════════════════════════════════════════════════════════════════
      const packTrigger = { trigger: packsRef.current, start: 'top 78%' }

      gsap.fromTo(
        packsRef.current!.querySelectorAll('.pack-header-anim'),
        { y: 36, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out', scrollTrigger: packTrigger }
      )

      gsap.fromTo(
        packsRef.current!.querySelectorAll('.pack-card'),
        { y: 60, opacity: 0, scale: 0.94 },
        { y: 0, opacity: 1, scale: 1, duration: 0.85, stagger: 0.15, ease: 'power3.out', delay: 0.2, scrollTrigger: packTrigger }
      )

      // ══════════════════════════════════════════════════════════════════
      // BUREAUTIQUE & DESIGN (inchangé)
      // ══════════════════════════════════════════════════════════════════
      const burTrigger = { trigger: bureautiqueRef.current, start: 'top 78%' }

      gsap.fromTo(
        bureautiqueRef.current!.querySelector('.bur-left') as HTMLElement,
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.9, ease: 'power3.out', scrollTrigger: burTrigger }
      )

      gsap.fromTo(
        bureautiqueRef.current!.querySelectorAll('.bur-row'),
        { x: 40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out', delay: 0.2, scrollTrigger: burTrigger }
      )

      bureautiqueRef.current?.querySelectorAll('.bur-row').forEach(row => {
        row.addEventListener('mouseenter', () =>
          gsap.to(row, { x: 6, duration: 0.2, ease: 'power1.out' })
        )
        row.addEventListener('mouseleave', () =>
          gsap.to(row, { x: 0, duration: 0.25, ease: 'power1.out' })
        )
      })

      // ══════════════════════════════════════════════════════════════════
      // STATS (inchangé)
      // ══════════════════════════════════════════════════════════════════
      const statTrigger = { trigger: statsRef.current, start: 'top 78%' }

      gsap.fromTo(
        statsRef.current!.querySelectorAll('.stat-header-anim'),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out', scrollTrigger: statTrigger }
      )

      gsap.fromTo(
        statsRef.current!.querySelectorAll('.stat-card'),
        { y: 40, opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1, duration: 0.7, stagger: 0.12, ease: 'power3.out', delay: 0.2, scrollTrigger: statTrigger }
      )

      const countEls = statsRef.current?.querySelectorAll('[data-count]')
      countEls?.forEach(el => {
        const target = parseFloat(el.getAttribute('data-count') || '0')
        const suffix = el.getAttribute('data-suffix') || ''
        const obj    = { val: 0 }
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: 'power2.out',
          delay: 0.5,
          onUpdate: () => { el.textContent = Math.round(obj.val) + suffix },
          scrollTrigger: { ...statTrigger, once: true },
        })
      })

      // ══════════════════════════════════════════════════════════════════
      // FAQ & CONTACT (inchangé)
      // ══════════════════════════════════════════════════════════════════
      const faqTrigger = { trigger: faqRef.current, start: 'top 78%' }

      gsap.fromTo(
        faqRef.current!.querySelector('.faq-col') as HTMLElement,
        { x: -40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.85, ease: 'power3.out', scrollTrigger: faqTrigger }
      )

      gsap.fromTo(
        faqRef.current!.querySelector('.contact-col') as HTMLElement,
        { x: 40, opacity: 0, scale: 0.96 },
        { x: 0, opacity: 1, scale: 1, duration: 0.85, ease: 'power3.out', delay: 0.1, scrollTrigger: faqTrigger }
      )

      gsap.fromTo(
        faqRef.current!.querySelectorAll('details'),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out', delay: 0.3, scrollTrigger: faqTrigger }
      )

    }, pageRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={pageRef}>
      <Head title="Formations" />

      {/* Progress bar */}
      <div
        className="formations-progress fixed top-0 left-0 right-0 h-[2px] bg-primary z-[9999] origin-left"
        style={{ transform: 'scaleX(0)' }}
      />

      <Navbar />

      <main>
        {/* ══════════════════════════════════════════════════
            HERO
        ══════════════════════════════════════════════════ */}
        <section className="hero-section relative min-h-[740px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              className="hero-bg-img w-full h-full object-cover opacity-20"
              alt="Elegant library interior"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfJq3Z5JscUbCCfOT43VNBHOspNIfXPqHBYvr24VqMgbQ1p7_vP2zXFQezpljXwTon6v9grwc7wHARjWBZ8Fi1dYuYTOUHmI_iMThBa6tXBzq3c_9kydt2gNm1Ra-Gn-djszgADqSTU6jw-M7CQi5msgPmAy6VDZasToDcCLjAdqWf8no5xgU6CeIO2WS7bLbZE3VfQpZf5zTCFkywXgPFtsPCKyDSg7ZJUrjrR95SStOY_OeaFnQxdSmnAeQPTWi4XOYokyh6Foss"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/60 to-background" />
          </div>

          <div ref={heroTextRef} className="relative z-10 text-center px-6 max-w-4xl">
            <span
              ref={heroBadgeRef}
              className="text-primary tracking-[0.2em] font-medium text-sm uppercase mb-4 block"
              style={{ opacity: 0 }}
            >
              Excellence Académique
            </span>

            <h1 className="font-serif text-on-background leading-tight mb-6">
              <span className="hero-line block text-6xl md:text-8xl overflow-hidden" style={{ opacity: 0 }}>
                Nos Formations
              </span>
              <span className="hero-line block text-6xl md:text-8xl overflow-hidden text-primary italic" style={{ opacity: 0 }}>
                d'Excellence
              </span>
            </h1>

            <p className="hero-para text-lg md:text-xl text-secondary max-w-2xl mx-auto font-light leading-relaxed" style={{ opacity: 0 }}>
              Découvrez une approche pédagogique raffinée, alliant rigueur académique et développement
              des compétences modernes au cœur du désert doré.
            </p>

            <div className="hero-arrow mt-12 flex justify-center gap-6" style={{ opacity: 0 }}>
              <span className="material-symbols-outlined text-primary text-4xl animate-bounce">expand_more</span>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            SECTION LANGUES (normale, sans fond fixe)
        ══════════════════════════════════════════════════ */}
        <section ref={languesSectionRef} className="py-24 px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="langues-header text-center mb-20">
              <h2 className="text-5xl font-serif text-on-background mb-6">L'Art des Langues</h2>
              <div className="golden-line w-48 mx-auto mb-6" />
              <p className="text-secondary font-light text-xl italic">
                Maîtrisez les codes de la communication mondiale avec élégance.
              </p>
            </div>

            <div className="space-y-24">
              {/* French row */}
              <div className="langues-row grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div className="order-2 md:order-1">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="material-symbols-outlined text-4xl text-primary">translate</span>
                    <h3 className="text-3xl font-serif">Français Classique &amp; Éloquence</h3>
                  </div>
                  <p className="text-secondary mb-8 leading-relaxed font-light text-lg">
                    Bien plus qu'une simple grammaire, nous enseignons la langue de Molière comme un
                    instrument de distinction sociale et professionnelle.
                  </p>
                  <ul className="space-y-4 text-sm text-on-background/80 mb-10 font-light">
                    {['Orthographe et syntaxe irréprochables', 'Techniques de prise de parole en public', 'Rédaction de rapports et mémoires'].map(item => (
                      <li key={item} className="flex items-center gap-3">
                        <span className="w-6 h-[1px] bg-primary flex-shrink-0" /> {item}
                      </li>
                    ))}
                  </ul>
                  <Link
                    className="text-primary text-xs font-bold tracking-widest uppercase flex items-center gap-2 border-b border-primary/20 w-max pb-2 hover:border-primary transition-all"
                    href={route('inscriptions.langues')}
                  >
                    Explorez le syllabus <span className="material-symbols-outlined text-sm">north_east</span>
                  </Link>
                </div>
                <div className="order-1 md:order-2 bg-surface-container-low aspect-video rounded-2xl overflow-hidden relative">
                  <img
                    alt="French calligraphy"
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCuKNmP2_EEJs_aWo1aMmAYFmjsla6WvbL-m6CQR9AK4qPHCHne7dL9QVFzDmT-HEIHYags8bnmp5XxLRiKfWiMMB8iq_lVfzYDNPf1hRUiQ60h6036NNIfNMFxaPPf7aXUgwEo_NrMZa9BBlw7LT488bxlY9dHyUJEfwIQxePJhPpopPYQH40ht8mGU5bJl881bd9btGBtGxnOHpuPKr8tXlRw_dxcxnVRCFtMBLFYc54Oo3gEcpbLqWjO6yMDmrjN4S9554mcNEKR"
                  />
                </div>
              </div>

              {/* English row */}
              <div className="langues-row grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div className="bg-surface-container-low aspect-video rounded-2xl overflow-hidden relative">
                  <img
                    alt="English business meeting"
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnhFJnMTAH9r84qZyV7ddX_FOeCTa-ih_KHDPjukDGI5A8K4vqCjLVDnWxIrySO2v5i2TO5Aydw1k5rvIAo6IjyT4GYce9QMUb9VMVOKRW2tuxDfO3XPeTxsyO6iDeG2MV7bSvIxgwO7xY2L5WSolcS_SqeRwHDGjgkOrP6Crffc4yN4tmJXZcMRHs7-8d7bIcxDDQK_2I4-ah3dELB2U1b8_m6WtCobS0jegs_b5mWEKvOQ0Q19iz8wUGjSosAKBK4aPnl6jwwcEJ"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <span className="material-symbols-outlined text-4xl text-primary">public</span>
                    <h3 className="text-3xl font-serif">Anglais des Affaires (International)</h3>
                  </div>
                  <p className="text-secondary mb-8 leading-relaxed font-light text-lg">
                    Préparez-vous à conquérir les marchés mondiaux avec une maîtrise parfaite de
                    l'anglais professionnel et technique.
                  </p>
                  <ul className="space-y-4 text-sm text-on-background/80 mb-10 font-light">
                    {['Négociation et communication stratégique', 'Préparation intensive aux tests TOEFL/IELTS', 'Immersion culturelle anglo-saxonne'].map(item => (
                      <li key={item} className="flex items-center gap-3">
                        <span className="w-6 h-[1px] bg-primary flex-shrink-0" /> {item}
                      </li>
                    ))}
                  </ul>
                  <Link
                    className="text-primary text-xs font-bold tracking-widest uppercase flex items-center gap-2 border-b border-primary/20 w-max pb-2 hover:border-primary transition-all"
                    href={route('inscriptions.langues')}
                  >
                    Explorez le syllabus <span className="material-symbols-outlined text-sm">north_east</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            SECTION CONCOURS (normale, séparée)
        ══════════════════════════════════════════════════ */}
        <section ref={concoursSectionRef} className="py-24 px-8 bg-surface-container-low">
          <div className="max-w-7xl mx-auto">
            <div className="concours-header text-center mb-16">
              <h2 className="text-5xl font-serif text-on-background mb-4">Préparation aux Concours</h2>
              <div className="golden-line w-48 mx-auto mb-6" />
              <p className="text-secondary font-light text-xl italic">
                Nos programmes spécialisés pour intégrer les plus grandes institutions avec sérénité.
              </p>
            </div>

            {/* Cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Médecine */}
              <div className="concours-card bg-surface-container-low p-8 rounded-2xl border border-outline-variant flex flex-col justify-between group hover:border-primary transition-colors">
                <div>
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm text-primary">
                    <span className="material-symbols-outlined text-3xl">medical_services</span>
                  </div>
                  <span className="text-primary font-bold text-[10px] tracking-widest uppercase mb-4 block">National</span>
                  <h4 className="text-xl font-serif mb-6">Médecine</h4>
                  <ul className="space-y-2 mb-8 text-sm text-secondary font-light">
                    <li className="flex items-center gap-2"><span className="w-1 h-1 bg-primary rounded-full" /> Coaching intensif</li>
                    <li className="flex items-center gap-2"><span className="w-1 h-1 bg-primary rounded-full" /> Examens blancs</li>
                  </ul>
                </div>
                <div className="pt-6 border-t border-outline-variant/30 flex items-center justify-between">
                  <span className="font-serif text-lg text-on-background">1000 dh</span>
                  <Link href={route('inscriptions.concours')} className="text-primary font-bold text-xs uppercase underline">Réserver</Link>
                </div>
              </div>

              {/* ENCG — featured */}
              <div className="concours-card bg-primary text-on-primary p-8 rounded-2xl flex flex-col justify-between shadow-xl shadow-primary/20 scale-105 z-10 relative">
                <div>
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6 text-white">
                    <span className="material-symbols-outlined text-3xl">corporate_fare</span>
                  </div>
                  <span className="text-white/60 font-bold text-[10px] tracking-widest uppercase mb-4 block">Élite</span>
                  <h4 className="text-xl font-serif mb-6">ENCG / ISCAE</h4>
                  <p className="text-white/80 text-sm font-light mb-8 leading-relaxed">
                    Préparation complète au TAFEM et coaching en culture générale pour les futurs managers.
                  </p>
                </div>
                <div className="pt-6 border-t border-white/20 flex items-center justify-between">
                  <span className="font-serif text-lg">600 dh</span>
                  <Link href={route('inscriptions.concours')} className="bg-white text-primary px-4 py-1.5 rounded-full font-bold text-[10px] uppercase">Réserver</Link>
                </div>
              </div>

              {/* ENSA */}
              <div className="concours-card bg-surface-container-low p-8 rounded-2xl border border-outline-variant flex flex-col justify-between group hover:border-primary transition-colors">
                <div>
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm text-primary">
                    <span className="material-symbols-outlined text-3xl">precision_manufacturing</span>
                  </div>
                  <span className="text-primary font-bold text-[10px] tracking-widest uppercase mb-4 block">Ingénierie</span>
                  <h4 className="text-xl font-serif mb-6">ENSA / ENSAM</h4>
                  <ul className="space-y-2 mb-8 text-sm text-secondary font-light">
                    <li className="flex items-center gap-2"><span className="w-1 h-1 bg-primary rounded-full" /> Mathématiques</li>
                    <li className="flex items-center gap-2"><span className="w-1 h-1 bg-primary rounded-full" /> Physique &amp; Chimie</li>
                  </ul>
                </div>
                <div className="pt-6 border-t border-outline-variant/30 flex items-center justify-between">
                  <span className="font-serif text-lg text-on-background">500 dh</span>
                  <Link href={route('inscriptions.concours')} className="text-primary font-bold text-xs uppercase underline">Réserver</Link>
                </div>
              </div>

              {/* Études à l'étranger */}
              <div className="concours-card bg-surface-container-highest p-8 rounded-2xl border border-dashed border-outline flex flex-col justify-center items-center text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 text-primary">
                  <span className="material-symbols-outlined text-4xl">flight_takeoff</span>
                </div>
                <h4 className="text-xl font-serif mb-3">Études à l'Étranger</h4>
                <p className="text-secondary text-sm font-light mb-6">Dossier Campus &amp; Orientation internationale</p>
                <button className="w-full py-3 bg-on-background text-surface rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity">
                  Consulter
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            PACKS PRIVILÈGES (inchangé)
        ══════════════════════════════════════════════════ */}
        <section ref={packsRef} className="py-24 px-8 max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-5xl font-serif text-on-background mb-2 pack-header-anim" style={{ opacity: 0 }}>
              Packs Privilèges
            </h2>
            <div className="w-32 h-[2px] bg-primary pack-header-anim" style={{ opacity: 0 }} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                tag: 'Best-Seller', title: 'Pack Succès', price: '1500 dh',
                desc: 'Langues (FR/EN) + Préparation Concours + Coaching d\'orientation.',
                align: 'left',
                src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAXcTLB4GKztLtdd9vvIf4IpKM8Ac6ZuLXnY4s_blZGg_-46hO8QbtnWctgYPC_CRyNCglg7TTBdsWLcVDJ3bSs4RHmZ8TsIJVywvID1qZH6mXOXPIjOPjEycz2_i4eS0dzcXY_dOOvsmTA5f4W4rOk5zLn-iO3tFmo53QLRVl3rfxEVlPsksi5KQIIGsN7S20HWhL0ehnL_1B9UFTqcNJ5IvohAzPAbNmD4ZCfBMD7Z-X1jcZTUqzA7xoX5xa-rbfQ9L71IAQxOU76',
              },
              {
                tag: 'Digital Ready', title: 'Pack Pro', price: '1800 dh',
                desc: 'Bureautique Expert + Adobe Photoshop + Anglais Business.',
                align: 'right',
                src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSVLXcgED2AKE9fZis11S6myGYhfO7inB006bWYVwccCoJm1TQP22qiufEki91PH_y6_TytYgN4P_AWlslm-My3nO1Yp20C96wNwJXCv7XiIxYKMWuUka4Ge2W0dTcnZo_K9pTyUzRs9h5DmGv38RNJeQVBKbC4GDJ_sy9SaUKF3VsJ_X4m24pc9b6fW1FlqthQDWwhfezofNUByjvwRMeS4WV89hJm-UntyPYKhcnflX56044kUeBgOldob0TOHfHd0s-I1M5aXeG',
              },
            ].map(pack => (
              <div
                key={pack.title}
                className="pack-card relative group h-[500px] rounded-[2rem] overflow-hidden"
                style={{ opacity: 0 }}
              >
                <img
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  src={pack.src} alt={pack.title}
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
                <div className={`absolute inset-0 p-12 flex flex-col justify-end text-white ${pack.align === 'right' ? 'items-end text-right' : ''}`}>
                  <div className="mb-4 text-xs font-bold tracking-[0.3em] uppercase">{pack.tag}</div>
                  <h3 className="text-4xl font-serif mb-4">{pack.title}</h3>
                  <p className="text-white/80 font-light mb-8 max-w-sm">{pack.desc}</p>
                  <div className={`flex items-center gap-6 ${pack.align === 'right' ? 'flex-row-reverse' : ''}`}>
                    <span className="text-3xl font-serif">{pack.price}</span>
                    <button className="bg-primary hover:bg-white hover:text-primary text-white px-8 py-3 rounded-full font-bold transition-all duration-300">
                      S'abonner
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bureautique, Stats, FAQ ... inchangés */}
        {/* ══════════════════════════════════════════════════
            BUREAUTIQUE & DESIGN
        ══════════════════════════════════════════════════ */}
        <section ref={bureautiqueRef} className="py-24 bg-surface-container-low overflow-hidden">
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              <div className="bur-left lg:col-span-1" style={{ opacity: 0 }}>
                <h2 className="text-4xl font-serif text-on-background mb-6">Bureautique &amp; Design</h2>
                <p className="text-secondary font-light leading-relaxed mb-8">
                  Des compétences fondamentales pour naviguer avec aisance dans l'écosystème
                  professionnel moderne.
                </p>
                <div className="p-8 bg-white border border-outline-variant rounded-2xl">
                  <span className="material-symbols-outlined text-primary text-5xl mb-4">verified_user</span>
                  <h4 className="font-serif text-xl mb-2">Certification Incluse</h4>
                  <p className="text-xs text-secondary leading-relaxed">
                    Validez vos acquis avec une attestation de formation reconnue par nos partenaires.
                  </p>
                </div>
              </div>
              <div className="lg:col-span-2 space-y-4">
                {[
                  { icon: 'grid_view', color: 'blue', bg: 'bg-blue-50', text: 'text-blue-600', title: 'Pack Office Expert', sub: 'Excel VBA, Word, PowerPoint', price: '800 dh' },
                  { icon: 'brush', color: 'red', bg: 'bg-red-50', text: 'text-red-600', title: 'Design Graphique', sub: 'Photoshop, Illustrator, Branding', price: '1200 dh' },
                ].map(row => (
                  <div
                    key={row.title}
                    className="bur-row group bg-white p-6 rounded-2xl border border-outline-variant flex items-center justify-between hover:border-primary transition-colors cursor-pointer"
                    style={{ opacity: 0 }}
                  >
                    <div className="flex items-center gap-6">
                      <div className={`w-12 h-12 ${row.bg} rounded-lg flex items-center justify-center ${row.text}`}>
                        <span className="material-symbols-outlined">{row.icon}</span>
                      </div>
                      <div>
                        <h4 className="font-serif text-xl">{row.title}</h4>
                        <p className="text-secondary text-xs font-light">{row.sub}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary">{row.price}</div>
                      <div className="text-[10px] text-secondary uppercase font-bold tracking-widest">Voir Syllabus</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            STATS
        ══════════════════════════════════════════════════ */}
        <section ref={statsRef} className="py-16 bg-white/50 border-y border-outline-variant/30">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif text-on-background mb-2 stat-header-anim" style={{ opacity: 0 }}>
                Une Réussite Mesurée, Gravée dans le Temps
              </h2>
              <p className="text-secondary font-light max-w-2xl mx-auto stat-header-anim" style={{ opacity: 0 }}>
                Notre engagement envers l'excellence se traduit par des résultats tangibles.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              <div
                className="stat-card flex flex-col md:flex-row items-center justify-center gap-8"
                style={{ opacity: 0 }}
              >
                <div className="relative">
                  <div className="w-32 h-32 rounded-full border-4 border-surface-container flex items-center justify-center relative">
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                      <circle className="text-primary" cx="64" cy="64" fill="transparent" r="58"
                        stroke="currentColor" strokeDasharray="364" strokeDashoffset="21.8" strokeWidth="4" />
                    </svg>
                    <span
                      className="text-3xl font-serif text-primary font-bold"
                      data-count="94" data-suffix="%"
                    >0%</span>
                  </div>
                  <div className="mt-4 text-center">
                    <div className="text-sm font-bold tracking-wide text-secondary">Taux de réussite global</div>
                  </div>
                </div>
                <div className="flex gap-8">
                  <div className="text-center">
                    <div className="text-3xl font-serif text-primary" data-count="500" data-suffix="+">0+</div>
                    <div className="text-[10px] uppercase tracking-widest font-bold text-secondary">Lauréats</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-serif text-primary" data-count="15" data-suffix=" ans">0 ans</div>
                    <div className="text-[10px] uppercase tracking-widest font-bold text-secondary">Expertise</div>
                  </div>
                </div>
              </div>

              <div className="stat-card bg-white p-4 rounded-xl shadow-sm border border-outline-variant/30" style={{ opacity: 0 }}>
                <h3 className="text-lg font-serif text-on-background mb-4 text-center">
                  Évolution du taux de réussite (%) par année
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={successRateData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="year" stroke="#605850" />
                    <YAxis domain={[70, 100]} stroke="#605850" />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#c2652a' }} formatter={(v) => [`${v}%`, 'Taux de réussite']} />
                    <Legend />
                    <Line type="monotone" dataKey="rate" stroke="#c2652a" strokeWidth={3}
                      dot={{ r: 5, fill: '#c2652a' }} activeDot={{ r: 8 }} name="Taux de réussite" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="stat-card bg-white p-4 rounded-xl shadow-sm border border-outline-variant/30" style={{ opacity: 0 }}>
                <h3 className="text-lg font-serif text-on-background mb-4 text-center">Répartition des lauréats par filière</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={laureatesByField} cx="50%" cy="50%" labelLine={false} outerRadius={100}
                      dataKey="value" label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                      {laureatesByField.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => [`${v} lauréats`, 'Effectif']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="stat-card space-y-4 text-center lg:text-left" style={{ opacity: 0 }}>
                <div className="inline-flex items-center gap-2 text-primary">
                  <span className="material-symbols-outlined">trending_up</span>
                  <span className="font-bold text-sm uppercase tracking-wider">Croissance constante</span>
                </div>
                <p className="text-secondary font-light">
                  Nos résultats progressent chaque année grâce à une pédagogie innovante et un suivi
                  personnalisé. Rejoignez nos 500+ lauréats qui ont fait confiance à l'excellence.
                </p>
                <button className="mt-4 px-6 py-2 bg-primary text-white rounded-full text-sm font-semibold hover:brightness-110 transition-all">
                  Voir tous les résultats
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            FAQ & CONTACT
        ══════════════════════════════════════════════════ */}
        <section ref={faqRef} className="py-24 px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div className="faq-col" style={{ opacity: 0 }}>
              <h2 className="text-4xl font-serif mb-12 text-on-background">Questions Fréquentes</h2>
              <div className="space-y-4">
                {[
                  { q: 'Comment s\'inscrire à une formation ?', a: 'Vous pouvez vous inscrire directement via notre site web ou nous rendre visite à notre centre pour un entretien d\'orientation gratuit avec nos conseillers.', open: true },
                  { q: 'Les cours sont-ils en présentiel ?', a: 'Sahara Elite privilégie l\'apprentissage en présentiel pour une meilleure immersion, mais nous proposons également des formats hybrides pour certains packs spécifiques.' },
                  { q: 'Quels sont les modes de paiement ?', a: 'Nous acceptons les paiements par virement bancaire, chèque ou espèces à notre accueil. Des facilités de paiement sont disponibles pour les Packs Privilèges.' },
                ].map(faq => (
                  <details key={faq.q} className="group border-b border-outline-variant pb-4" open={faq.open}>
                    <summary className="flex items-center justify-between cursor-pointer list-none">
                      <span className="font-serif text-xl">{faq.q}</span>
                      <span className="material-symbols-outlined expand-icon transition-transform duration-300">expand_more</span>
                    </summary>
                    <div className="mt-4 text-secondary font-light leading-relaxed">{faq.a}</div>
                  </details>
                ))}
              </div>
            </div>

            <div className="contact-col bg-on-background text-surface p-12 rounded-[2rem] flex flex-col justify-between" style={{ opacity: 0 }}>
              <div>
                <h2 className="text-4xl font-serif mb-6">Besoin d'un Conseil ?</h2>
                <p className="text-surface/70 font-light mb-10">
                  Nos conseillers pédagogiques sont à votre disposition pour définir ensemble votre
                  parcours de réussite.
                </p>
                <div className="space-y-6">
                  {[
                    { icon: 'call', label: 'Téléphone', value: '+212 5XX XX XX XX' },
                    { icon: 'location_on', label: 'Adresse', value: 'Sahara Training Center, Laâyoune' },
                  ].map(c => (
                    <div key={c.icon} className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full border border-surface/20 flex items-center justify-center">
                        <span className="material-symbols-outlined">{c.icon}</span>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold tracking-widest text-surface/40">{c.label}</div>
                        <div className="text-xl">{c.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <button className="mt-12 w-full py-4 bg-primary text-white rounded-xl font-bold uppercase tracking-widest hover:bg-primary-container transition-colors">
                Prendre Rendez-vous
              </button>
            </div>
          </div>
        </section>

      </main>

      <Footer />

      <style>{`
        .golden-line {
          height: 1px;
          background: linear-gradient(to right, transparent, #c2652a, transparent);
        }
        details > summary::-webkit-details-marker { display: none; }
        details[open] summary .expand-icon { transform: rotate(180deg); }
      `}</style>
    </div>
  )
}

export default Formations
