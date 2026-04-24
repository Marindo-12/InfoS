import { Link } from '@inertiajs/react'
import React, { useEffect, useState } from 'react'
import logo from '../../../public/infos-logo.png'
import { Menu, X } from 'lucide-react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  // Fermer le menu si la fenêtre redevient large (optionnel mais ergonomique)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { // md breakpoint
        setIsOpen(false)
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
  const closeMenu = () => setIsOpen(false)

  return (
    <nav className="bg-surface/80 backdrop-blur-md sticky top-0 z-50 border-b border-stone-200/40">
      <div className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto">
        <Link href="/" className="text-2xl flex items-center gap-3 font-serif italic text-orange-900 tracking-tight">
          <img src={logo} alt="infoslogo" className='w-10 h-10' />
          Info Saloua
        </Link>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link href={route('formations')} className="text-sm font-medium tracking-wide text-orange-700 border-b-2 border-orange-700 pb-1 transition-colors duration-300">
            Formations
          </Link>
          <Link href={route('about')} className="text-sm font-medium tracking-wide text-stone-700 hover:text-orange-600 transition-colors duration-300">
            À propos
          </Link>
          <Link href={route('about')} className="text-sm font-medium tracking-wide text-stone-700 hover:text-orange-600 transition-colors duration-300">
            Inscriptions
          </Link>
          <Link href={route('contact')} className="text-sm font-medium tracking-wide text-stone-700 hover:text-orange-600 transition-colors duration-300">
            Contact
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="inline-block px-6 py-2 bg-primary text-on-primary rounded-lg text-sm font-semibold tracking-wide hover:brightness-110 active:scale-95 transition-all shadow-sm"
          >
            S'inscrire
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
        <div className="fixed inset-0 top-[72px] bg-surface/80 backdrop-blur-sm z-40 md:hidden">
          <div className="flex flex-col bg-surface-bright border border-t-2 items-center py-8 gap-8 text-lg">
            <Link
              href={route('formations')}
              onClick={closeMenu}
              className="text-orange-700 font-medium border-b-2 border-orange-700 pb-1"
            >
              Formations
            </Link>
            <Link
              href={route('about')}
              onClick={closeMenu}
              className="text-stone-700 hover:text-orange-600 transition-colors"
            >
              À propos
            </Link>
            <Link
              href={route('about')}
              onClick={closeMenu}
              className="text-stone-700 hover:text-orange-600 transition-colors"
            >
              Inscriptions
            </Link>
            <Link
              href={route('contact')}
              onClick={closeMenu}
              className="text-stone-700 hover:text-orange-600 transition-colors"
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