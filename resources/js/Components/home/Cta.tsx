import React from 'react'
import { Link } from '@inertiajs/react'

const Cta = () => {
  return (
    <section className="py-32 px-8" id="apply">
      <div className="max-w-5xl mx-auto bg-primary-container/20 rounded-3xl p-16 md:p-24 text-center border border-primary/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
        <h2 className="font-display text-5xl md:text-6xl mb-8 relative z-10">
          Prêt à rejoindre l'excellence ?
        </h2>
        <p className="text-xl text-on-surface-variant font-light mb-12 max-w-2xl mx-auto relative z-10">
          Les inscriptions pour la prochaine session sont ouvertes. Sécurisez votre place dès maintenant.
        </p>
        <div className="flex flex-wrap justify-center gap-6 relative z-10">
          <Link
            href="/inscriptions"
            className="px-12 py-5 bg-primary text-on-primary rounded-lg font-bold text-lg hover:brightness-110 shadow-lg active:scale-95 transition-all"
          >
            Déposer ma candidature
          </Link>
          <a
            href="/contact"
            className="px-12 py-5 border-2 border-primary text-primary rounded-lg font-bold text-lg hover:bg-primary hover:text-on-primary transition-all"
          >
            Nous contacter
          </a>
        </div>
      </div>
    </section>
  )
}

export default Cta