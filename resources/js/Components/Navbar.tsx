import { Link, usePage } from '@inertiajs/react'
import React, { useEffect, useState } from 'react'
import logo from '../../../public/infos-logo.png'
import { Menu, X, ChevronDown } from 'lucide-react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(false) // pour mobile
  const [scrolled, setScrolled] = useState(false)
  const { url, props } = usePage()
  const authUser = (props as any).auth?.user

  // Détecter le scroll pour changer le background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Fermer le menu si la fenêtre redevient large
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false)
        setOpenDropdown(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Empêcher le scroll du body quand le menu mobile est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => {
    setIsOpen(false)
    setOpenDropdown(false)
  }

  // Vérifier si un lien est actif
  const isActive = (routePath: string) => {
    return url === routePath || url.startsWith(routePath + '/')
  }

  // Liste des sous-pages pour "Inscriptions"
  const inscriptionLinks = [
    { name: 'Langues', href: route('inscriptions.langues') },
    { name: 'Bureautique', href: route('inscriptions.bureautique') },
    { name: 'Préparation aux concours', href: route('inscriptions.concours') },
    { name: 'Infographie', href: route('inscriptions.infographie') },
  ]

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-surface/80 backdrop-blur-md border-b border-stone-200/40' 
        : 'bg-transparent'
    }`}>
      <div className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto">
        <Link href="/" className="text-2xl flex items-center gap-3 font-serif italic text-orange-900 tracking-tight">
          <img src={logo} alt="infoslogo" className='w-10 h-10' />
          Info Saloua
        </Link>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href={route('formations')}
            prefetch
            className={`text-sm font-medium tracking-wide transition-colors duration-300 pb-1 ${
              isActive('/formations')
                ? 'text-orange-700 border-b-2 border-orange-700'
                : 'text-stone-700 hover:text-orange-600'
            }`}
          >
            Formations
          </Link>
          <Link
            href={route('about')}
            prefetch
            className={`text-sm font-medium tracking-wide transition-colors duration-300 pb-1 ${
              isActive('/about')
                ? 'text-orange-700 border-b-2 border-orange-700'
                : 'text-stone-700 hover:text-orange-600'
            }`}
          >
            À propos
          </Link>

          {/* Dropdown Inscriptions Desktop */}
          <div className="relative group">
            <div className="flex items-center gap-1 cursor-pointer">
              <span
                className={`text-sm font-medium tracking-wide transition-colors duration-300 pb-1 ${
                  isActive('/inscriptions')
                    ? 'text-orange-700 border-b-2 border-orange-700'
                    : 'text-stone-700 group-hover:text-orange-600'
                }`}
              >
                Inscriptions
              </span>
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 group-hover:rotate-180 ${
                  isActive('/inscriptions') ? 'text-orange-700' : 'text-stone-700 group-hover:text-orange-600'
                }`}
              />
            </div>
            <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-stone-200 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              {inscriptionLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block px-4 py-2 text-sm text-stone-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <Link
            href={route('contact')}
            prefetch
            className={`text-sm font-medium tracking-wide transition-colors duration-300 pb-1 ${
              isActive('/contact')
                ? 'text-orange-700 border-b-2 border-orange-700'
                : 'text-stone-700 hover:text-orange-600'
            }`}
          >
            Contact
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href={authUser ? route('dashboard') : route('login')}
            className="inline-block px-6 py-2 bg-primary text-on-primary rounded-lg text-sm font-semibold tracking-wide hover:brightness-110 active:scale-95 transition-all shadow-sm"
          >
            {authUser ? 'Dashboard' : "S'inscrire"}
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg text-stone-800 hover:bg-orange-50 transition-colors"
            aria-label="Menu principal"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile navigation overlay */}
      {isOpen && (
        <div className="fixed inset-0 top-[72px] bg-surface/95 backdrop-blur-sm z-[100] md:hidden" style={{ height: 'calc(100vh - 72px)' }}>
          <div className="flex flex-col bg-surface-bright border-t items-center py-8 gap-6 text-lg">
            <Link
              href={route('formations')}
              onClick={closeMenu}
              className={`font-medium ${
                isActive('/formations') ? 'text-orange-700 border-b-2 border-orange-700' : 'text-stone-700'
              }`}
            >
              Formations
            </Link>
            <Link
              href={route('about')}
              onClick={closeMenu}
              className={`font-medium ${
                isActive('/about') ? 'text-orange-700 border-b-2 border-orange-700' : 'text-stone-700'
              }`}
            >
              À propos
            </Link>

            {/* Dropdown Inscriptions Mobile (accordéon) */}
            <div className="w-full flex flex-col items-center">
              <button
                onClick={() => setOpenDropdown(!openDropdown)}
                className="flex items-center gap-1 font-medium text-stone-700 hover:text-orange-600 transition-colors"
              >
                <span>Inscriptions</span>
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-200 ${openDropdown ? 'rotate-180' : ''}`}
                />
              </button>
              {openDropdown && (
                <div className="flex flex-col items-center gap-4 mt-4 w-full">
                  {inscriptionLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={closeMenu}
                      className="text-sm text-stone-600 hover:text-orange-600 transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href={route('contact')}
              onClick={closeMenu}
              className={`font-medium ${
                isActive('/contact') ? 'text-orange-700 border-b-2 border-orange-700' : 'text-stone-700'
              }`}
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
