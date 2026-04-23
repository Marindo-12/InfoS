import React from 'react'

const Formations = () => {
  return (
    <section className="py-32 px-8 max-w-7xl mx-auto" id="formations">
      <div className="text-center mb-24">
        <h2 className="font-display text-5xl mb-6">Nos Disciplines</h2>
        <p className="text-on-surface-variant max-w-xl mx-auto text-lg font-light">
          Des parcours spécialisés conçus pour propulser votre carrière vers l'excellence.
        </p>
      </div>

      <div className="space-y-32">

        {/* ── Langues ── */}
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="w-full md:w-1/2">
            <div className="inline-flex w-16 h-16 bg-primary/10 rounded-2xl items-center justify-center mb-8">
              <span
                className="material-symbols-outlined text-primary text-3xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                translate
              </span>
            </div>
            <h3 className="font-display text-4xl md:text-5xl mb-6">Excellence en Langues</h3>
            <p className="text-on-surface-variant text-lg leading-relaxed mb-8">
              Maîtrisez l'anglais des affaires, le français ou l'arabe avec un accent sur la nuance professionnelle et la diplomatie culturelle. Notre approche immersive vous permet non seulement de parler la langue, mais de la maîtriser.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {['Niveau natif ciblé', 'Communication professionnelle', 'Coaching individuel', 'Intelligence culturelle'].map(item => (
                <li key={item} className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">check_circle</span>
                  {item}
                </li>
              ))}
            </ul>
            <a href="#apply" className="text-primary font-bold text-sm tracking-widest inline-flex items-center gap-2 group">
              EN SAVOIR PLUS
              <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
            </a>
          </div>

          <div className="w-full md:w-1/2 aspect-[4/3] bg-surface-container-high rounded-3xl overflow-hidden shadow-2xl relative group">
            <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <img
              alt="Formation en Langues"
              className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqQ0KCzluOtxTXyWeFO_JmP13pQGN4EK2NCzJGRha_W0bfiPJD_XB8ICz3XC99hLNlQt5Q4qXcV33BdsQjhtHTAayST4exgv6iHzQgMkqQCFy_JMr_X6YE5R3dsRBjpwHw45ta0Atm-aIgpuf4FEw65i6EYAgmRXopE20u0Qqt2uwJwwDxAbLkSe_idHN0X0baJYrPB7HotFG_Bpm_ihEZY_jHTvxsdNPfm5D0Rm5agMqlpZMT7c4G-00EhMTBrdTFaGs0dmdApeX9"
            />
          </div>
        </div>

        {/* ── Bureautique / IT ── */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-16">
          <div className="w-full md:w-1/2">
            <div className="inline-flex w-16 h-16 bg-on-surface rounded-2xl items-center justify-center mb-8">
              <span
                className="material-symbols-outlined text-primary text-3xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                terminal
              </span>
            </div>
            <h3 className="font-display text-4xl md:text-5xl mb-6">Bureautique & IT</h3>
            <p className="text-on-surface-variant text-lg leading-relaxed mb-8">
              De la bureautique avancée à l'informatique professionnelle. Restez à la pointe avec des ateliers pratiques et des projets du monde réel.
            </p>
            <div className="space-y-4 mb-8">
              <div className="p-4 bg-surface-container rounded-xl border-l-4 border-primary">
                <h4 className="font-bold mb-1">Word, Excel & PowerPoint</h4>
                <p className="text-sm text-on-surface-variant">Maîtrisez les outils du bureau moderne.</p>
              </div>
              <div className="p-4 bg-surface-container rounded-xl border-l-4 border-primary">
                <h4 className="font-bold mb-1">Certification MOS</h4>
                <p className="text-sm text-on-surface-variant">Certification Microsoft Office Specialist reconnue mondialement.</p>
              </div>
            </div>
            <a href="#apply" className="text-primary font-bold text-sm tracking-widest inline-flex items-center gap-2 group">
              VOIR LE PROGRAMME
              <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
            </a>
          </div>

          <div className="w-full md:w-1/2 aspect-[4/3] bg-on-surface rounded-3xl overflow-hidden shadow-2xl relative">
            <div className="absolute inset-0 bg-primary/20 mix-blend-overlay" />
            <img
              alt="Bureautique & IT"
              className="w-full h-full object-cover opacity-80"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUEBLWoDLSYiJDp8SMibyVZk6DpvEjWJBrH1SyIBbBncw3biOdt_5PBURWF_bu1lJprHFcDkPfV7v0G6DtFwrY6Dc3kp1frOEtM0qbjHkrb6WeMTRGBCFjau9g5ok1ImyrnERLCdYGiUl3Izy-VG2WahtXme6QkENPRa_yQeJp6vvJaYR8x1QmGSoJIQvghl9fIwb1nyWQq6_S0zQ8WMMkn7l1-eHxh5q2Qf4YyKy2m_aHkcsqyF5ge0Dh7E5HgWVuWUqDkRrCbkq6"
            />
          </div>
        </div>

        {/* ── Concours ── */}
        <div
          className="bg-surface-container-highest rounded-[3rem] p-8 md:p-16 flex flex-col lg:flex-row gap-12 items-center"
          id="admissions"
        >
          <div className="lg:w-2/3">
            <h3 className="font-display text-4xl mb-6">Préparation aux Concours</h3>
            <p className="text-on-surface-variant text-lg leading-relaxed mb-8">
              Préparation intensive aux concours nationaux et certifications internationales. Nos simulateurs reproduisent l'environnement réel pour maximiser vos performances.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { code: 'TOEFL', label: 'Compétence linguistique' },
                { code: 'IELTS', label: 'Standard international' },
                { code: 'DELF', label: 'Diplôme français' },
                { code: 'MOS', label: 'Microsoft Office' },
              ].map(cert => (
                <div key={cert.code} className="bg-surface p-4 rounded-xl text-center shadow-sm">
                  <div className="text-primary font-bold text-xl mb-1">{cert.code}</div>
                  <div className="text-[10px] uppercase tracking-tighter opacity-60">{cert.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:w-1/3 flex justify-center">
            <div className="relative">
              <div className="w-48 h-48 bg-primary rounded-full flex items-center justify-center text-on-primary shadow-2xl animate-pulse">
                <span className="material-symbols-outlined text-6xl">verified</span>
              </div>
              <div className="absolute -top-4 -right-4 bg-on-surface text-background p-4 rounded-xl shadow-lg transform rotate-12">
                <p className="text-xs font-bold uppercase tracking-widest">95% Réussite</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

export default Formations