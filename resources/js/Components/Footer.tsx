import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-stone-50 border-t border-stone-200">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-8 py-16 max-w-7xl mx-auto">

        <div className="space-y-6">
          <div className="text-xl font-serif text-orange-900">Centre Informatique</div>
          <p className="text-sm font-light text-stone-600 leading-relaxed">
            Votre succès commence ici. Formation en langues, préparation aux concours et bureautique à Tanger.
          </p>
          <div className="flex gap-4">
            {['social_leaderboard', 'language', 'share'].map(icon => (
              <a key={icon}
                href="#"
                className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-stone-600 hover:bg-primary hover:text-white transition-colors">
                <span className="material-symbols-outlined text-sm">{icon}</span>
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-lg font-serif mb-6 text-on-surface">Formations</h4>
          <ul className="space-y-4 text-sm font-light text-stone-600">
            {['Langues étrangères', 'Préparation concours', 'Bureautique', 'Informatique'].map(item => (
              <li key={item}>
                <a href="#" className="hover:text-orange-600 underline transition-all">{item}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-serif mb-6 text-on-surface">Liens utiles</h4>
          <ul className="space-y-4 text-sm font-light text-stone-600">
            {['Politique de confidentialité', 'Conditions d\'utilisation', 'Cookies', 'Guide étudiant'].map(item => (
              <li key={item}>
                <a href="#" className="hover:text-orange-600 underline transition-all">{item}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-serif mb-6 text-on-surface">Accréditation</h4>
          <p className="text-xs font-light text-stone-500 leading-relaxed mb-6">
            © {new Date().getFullYear()} Centre Informatique. Tanger, Maroc.
          </p>
          <div className="flex items-center gap-4 grayscale opacity-60">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-12 h-12 bg-stone-300 rounded" />
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-stone-200 py-6 text-center">
        <p className="text-xs text-stone-400 font-light tracking-widest">
          CENTRE INFORMATIQUE • TANGER • MAROC
        </p>
      </div>
    </footer>
  )
}

export default Footer