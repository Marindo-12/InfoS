import { Link, usePage } from '@inertiajs/react'
import React, { useEffect, useRef, useState } from 'react'
import logo from '../../../public/infos-logo.png'
import { ChevronDown, LayoutDashboard, Menu, X } from 'lucide-react'
import gsap from 'gsap'

/* ─────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────── */
interface InscriptionLink {
  name: string
  href: string
}

/* ─────────────────────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────────────────────── */
const Navbar: React.FC = () => {
  const [isOpen,       setIsOpen]       = useState(false)
  const [openDropdown, setOpenDropdown] = useState(false)
  const [scrolled,     setScrolled]     = useState(false)

  const cardRef    = useRef<HTMLDivElement>(null)
  const btnRef     = useRef<HTMLButtonElement>(null)
  const itemsRef   = useRef<HTMLDivElement>(null)
  const animating  = useRef(false)

  const { url, props } = usePage()
  const authUser = (props as any).auth?.user

  const inscriptionLinks: InscriptionLink[] = [
    { name: 'Langues',                    href: route('inscriptions.langues') },
    { name: 'Bureautique',                href: route('inscriptions.bureautique') },
    { name: 'Préparation aux concours',   href: route('inscriptions.concours') },
    { name: 'Infographie',               href: route('inscriptions.infographie') },
  ]

  const isActive = (path: string) =>
    url === path || url.startsWith(path + '/')

  /* ── Scroll detection ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* ── Close on resize to desktop ── */
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768 && isOpen) closeMenu()
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [isOpen])

  /* ── Click outside to close ── */
  useEffect(() => {
    if (!isOpen) return
    const onDown = (e: MouseEvent) => {
      if (
        cardRef.current && !cardRef.current.contains(e.target as Node) &&
        btnRef.current  && !btnRef.current.contains(e.target as Node)
      ) closeMenu()
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [isOpen])

  /* ─────────────────────────────────────────────
     GSAP open / close
  ───────────────────────────────────────────── */
  const openMenu = () => {
    if (animating.current || isOpen) return
    animating.current = true
    setIsOpen(true)          // mount the card
  }

  // Run GSAP after the card mounts
  useEffect(() => {
    if (!isOpen || !cardRef.current || !itemsRef.current) return

    const card  = cardRef.current
    const items = itemsRef.current.querySelectorAll<HTMLElement>('.menu-item')

    // Starting state
    gsap.set(card,  { opacity: 0, scale: 0.72, y: -16, transformOrigin: 'top right' })
    gsap.set(items, { opacity: 0, x: 14 })

    const tl = gsap.timeline({
      onComplete: () => { animating.current = false },
    })

    tl.to(card, {
      opacity: 1, scale: 1, y: 0,
      duration: 0.38, ease: 'back.out(1.6)',
    })
    tl.to(items, {
      opacity: 1, x: 0,
      stagger: 0.055, duration: 0.3, ease: 'power2.out',
    }, '-=0.18')
  }, [isOpen])

  const closeMenu = () => {
    if (animating.current || !isOpen || !cardRef.current) return
    animating.current = true

    gsap.to(cardRef.current, {
      opacity: 0, scale: 0.78, y: -10,
      duration: 0.22, ease: 'power2.in',
      onComplete: () => {
        setIsOpen(false)
        setOpenDropdown(false)
        animating.current = false
      },
    })
  }

  const toggleMenu = () => (isOpen ? closeMenu() : openMenu())

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-surface/80 shadow-sm backdrop-blur-md border-b border-stone-200/40'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-8 py-4">

        {/* ── Logo ── */}
        <Link
          href="/"
          className="flex items-center gap-3 font-serif text-2xl italic tracking-tight text-orange-900"
        >
          <img src={logo} alt="Info Saloua" className="h-10 w-10" />
          Info Saloua
        </Link>

        {/* ── Desktop links ── */}
        <div className="hidden items-center gap-8 md:flex">
          {[
            { label: 'Formations', path: route('formations') },
            { label: 'À propos',   path: route('about') },
          ].map(({ label, path }) => (
            <Link
              key={label}
              href={path}
              prefetch
              className={`pb-1 text-sm font-medium tracking-wide transition-colors duration-200 ${
                isActive('/' + label.toLowerCase().replace(' ', ''))
                  ? 'border-b-2 border-orange-700 text-orange-700'
                  : 'text-stone-700 hover:text-orange-600'
              }`}
            >
              {label}
            </Link>
          ))}

          {/* Desktop dropdown — Inscriptions */}
          <div className="group relative">
            <div className="flex cursor-pointer items-center gap-1">
              <span
                className={`pb-1 text-sm font-medium tracking-wide transition-colors duration-200 ${
                  isActive('/inscriptions')
                    ? 'border-b-2 border-orange-700 text-orange-700'
                    : 'text-stone-700 group-hover:text-orange-600'
                }`}
              >
                Inscriptions
              </span>
              <ChevronDown
                size={15}
                className={`transition-transform duration-200 group-hover:rotate-180 ${
                  isActive('/inscriptions') ? 'text-orange-700' : 'text-stone-600 group-hover:text-orange-600'
                }`}
              />
            </div>

            {/* Dropdown card */}
            <div className="invisible absolute left-0 mt-3 w-58 min-w-[13rem] rounded-xl border border-stone-200/80 bg-white py-2 opacity-0 shadow-xl shadow-stone-200/60 transition-all duration-200 group-hover:visible group-hover:opacity-100">
              {/* Arrow tip */}
              <div className="absolute -top-[6px] left-5 h-3 w-3 rotate-45 border-l border-t border-stone-200/80 bg-white" />
              {inscriptionLinks.map((lk) => (
                <Link
                  key={lk.name}
                  href={lk.href}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-stone-700 transition-colors hover:bg-orange-50 hover:text-orange-700"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/50" />
                  {lk.name}
                </Link>
              ))}
            </div>
          </div>

          <Link
            href={route('contact')}
            prefetch
            className={`pb-1 text-sm font-medium tracking-wide transition-colors duration-200 ${
              isActive('/contact')
                ? 'border-b-2 border-orange-700 text-orange-700'
                : 'text-stone-700 hover:text-orange-600'
            }`}
          >
            Contact
          </Link>
        </div>

        {/* ── Right controls ── */}
        <div className="flex items-center gap-3">
          {/* S'inscrire button — hidden on mobile (shown inside card) */}
          <Link
            href={authUser ? route('dashboard') : route('login')}
            className="hidden items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold tracking-wide text-on-primary shadow-sm transition-all hover:brightness-110 active:scale-95 md:flex"
          >
            {authUser ? <LayoutDashboard size={16} /> : null}
            {authUser ? 'Dashboard' : "S'inscrire"}
          </Link>

          {/* Mobile hamburger button */}
          <div className="relative md:hidden">
            <button
              ref={btnRef}
              onClick={toggleMenu}
              aria-label="Menu"
              aria-expanded={isOpen}
              className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 ${
                isOpen
                  ? 'bg-primary text-on-primary shadow-md'
                  : 'bg-surface-container text-stone-700 hover:bg-orange-50'
              }`}
            >
              {isOpen
                ? <X size={20} strokeWidth={2.2} />
                : <Menu size={20} strokeWidth={2} />
              }
            </button>

            {/* ── FLOATING CARD MENU ── */}
            {isOpen && (
              <div
                ref={cardRef}
                className="absolute right-0 top-[calc(100%+10px)] z-[200] w-[280px] origin-top-right overflow-hidden rounded-2xl border border-stone-200/70 bg-white shadow-2xl shadow-stone-300/40"
              >
                {/* Warm accent strip at top */}
                <div className="h-1 w-full bg-gradient-to-r  via-orange-400 to-amber-300" />

                <div ref={itemsRef} className="flex flex-col p-3 gap-0.5">

                  {/* Nav links */}
                  {[
                    { label: 'Formations', href: route('formations') },
                    { label: 'À propos',   href: route('about') },
                    { label: 'Contact',    href: route('contact') },
                  ].map(({ label, href }) => (
                    <Link
                      key={label}
                      href={href}
                      onClick={closeMenu}
                      className="menu-item flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-stone-700 transition-colors hover:bg-orange-50 hover:text-orange-700"
                    >
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary/40" />
                      {label}
                    </Link>
                  ))}

                  {/* Inscriptions accordion */}
                  <div className="menu-item">
                    <button
                      onClick={() => setOpenDropdown((p) => !p)}
                      className="flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm font-medium text-stone-700 transition-colors hover:bg-orange-50 hover:text-orange-700"
                    >
                      <span className="flex items-center gap-3">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary/40" />
                        Inscriptions
                      </span>
                      <ChevronDown
                        size={15}
                        className={`shrink-0 text-stone-400 transition-transform duration-200 ${
                          openDropdown ? 'rotate-180 text-orange-600' : ''
                        }`}
                      />
                    </button>

                    {/* Sub-links with smooth height expand */}
                    <div
                      className="overflow-hidden transition-all duration-300"
                      style={{ maxHeight: openDropdown ? '200px' : '0px', opacity: openDropdown ? 1 : 0 }}
                    >
                      <div className="ml-7 flex flex-col gap-0.5 pb-1 pt-0.5">
                        {inscriptionLinks.map((lk) => (
                          <Link
                            key={lk.name}
                            href={lk.href}
                            onClick={closeMenu}
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-stone-600 transition-colors hover:bg-orange-50 hover:text-orange-700"
                          >
                            <span className="h-1 w-1 shrink-0 rounded-full bg-orange-300" />
                            {lk.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="mx-3 my-1.5 h-px bg-stone-100" />

                  {/* S'inscrire / Dashboard — mobile only inside card */}
                  <Link
                    href={authUser ? route('dashboard') : route('login')}
                    onClick={closeMenu}
                    className="menu-item flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold tracking-wide text-on-primary shadow-sm transition-all hover:brightness-110 active:scale-95"
                  >
                    {authUser ? <LayoutDashboard size={16} /> : null}
                    {authUser ? 'Dashboard' : "S'inscrire"}
                  </Link>

                  {/* Small branding footer */}
                  <p className="menu-item px-4 pb-1 pt-0.5 text-center text-[10px] font-medium tracking-wider text-stone-400">
                    Info Saloua · Excellence établie
                  </p>
                </div>
              </div>
            )}
          </div>
          {/* end mobile controls */}
        </div>
      </div>
    </nav>
  )
}

export default Navbar