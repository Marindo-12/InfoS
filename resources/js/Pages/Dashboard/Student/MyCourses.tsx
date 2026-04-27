import Authenticated from '@/Layouts/AuthenticatedLayout'
import React from 'react'

const MyCourses = () => {
  return (
    <Authenticated header={<h2>Formations</h2>}>
      <div className="bg-background text-on-background selection:bg-primary-fixed selection:text-on-primary-fixed">
      <main className="pt-14 pb-12 px-8 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <header className="mb-12">
            <h2 className="text-5xl font-display font-medium text-on-background mb-2">Mes Formations</h2>
            <p className="text-on-surface-variant font-body max-w-2xl leading-relaxed">
              Bienvenue dans votre espace d'apprentissage. Retrouvez ici vos cours en Bureautique, Infographie et Langues.
            </p>
          </header>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 group bg-surface-container-low rounded-3xl overflow-hidden flex flex-col md:flex-row border border-outline-variant/30 shadow-[0_2px_16px_rgba(58,48,42,0.04)]">
              <div className="md:w-1/2 relative overflow-hidden h-64 md:h-auto">
                <img alt="Design workflow" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" data-alt="high-end minimalist graphic design studio workspace with large monitor displaying creative digital artwork and warm ambient lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0_Q3R2P_9XHaQDE0JVaBAJaJW9XXI2a86t8Q2lWQHQqODNeRqGRB3_gDtNMBmmu9wOsHobL8uex5hw5vlrPzn3-vl1kTtskbvUlI60tFVif_UhGBQWL7FXxtpExx_G5MD7xbKl8nQw9YxH-mhZcfElGTkOaMazZe85ojAgHH_rlwZy1MBEuXoT4vVd16Dg2_ItEIs6EnMrOeNE5Wr2MRx0iY-KfgZCWykin98w7ewLkvTo2KDpZunWJ8COJ9JHFTguqHEtfl-p7A2" />
                <div className="absolute top-4 left-4 bg-primary text-on-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">Infographie Digitale</div>
              </div>
              <div className="md:w-1/2 p-8 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-3xl font-display text-on-background italic">Maîtrise Adobe Creative Suite</h3>
                    <div className="text-right">
                      <p className="text-primary font-bold text-xl">4500 DH</p>
                      <p className="text-[10px] text-outline uppercase">Paiement Validé</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-on-surface-variant mb-6 font-body">
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm" data-icon="schedule">schedule</span> 12 Semaines</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm" data-icon="group">group</span> Groupe A2</span>
                  </div>
                  <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 mb-6">
                    <p className="text-[10px] uppercase font-bold text-primary mb-1 tracking-widest">Prochaine Séance</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary" data-icon="event">event</span>
                        <span className="text-sm font-semibold">Lundi, 14 Octobre</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary" data-icon="alarm">alarm</span>
                        <span className="text-sm font-semibold">14:00 - 17:00</span>
                      </div>
                      <div className="text-sm font-bold text-on-surface">Salle 302</div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-outline">Progression</span>
                    <span className="text-xs font-bold text-primary">68%</span>
                  </div>
                  <div className="w-full bg-surface-variant h-1.5 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full w-[68%] transition-all duration-1000"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-4 flex flex-col gap-8">
              <div className="bg-surface-container-low rounded-3xl overflow-hidden border border-outline-variant/30 group shadow-[0_2px_16px_rgba(58,48,42,0.04)]">
                <div className="relative h-40">
                  <img alt="Modern office" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" data-alt="clean desk with aluminum laptop, glasses, and a notebook in a bright high-end corporate office with floor to ceiling windows" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXkVw74TfRa86Va9tIiJXmrJJlHpufDdhho512D2AxwehuS6qYuINDrRNAw1nBCptDZLl3TVuGf0oYSDVB6HnlkW1eXaAFazgIEDtNTloH8gVbk2xNpUK_RgRUexKgBefYH5Xo5kxkL75_cnpHThQb1X9uy-YD9FqmZz7ggjMSBDvCU3rX77m80qI0fmXSTgrsPwieIudr4Uzc63LbOAgo8SvSDDtNR4zWuyCAeLW6-hYv9FfaX4UN0nH8qj5dMf7yqvCQ5E9UUzTH" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-[10px] uppercase font-bold tracking-widest opacity-80">Bureautique</p>
                    <h3 className="text-xl font-display italic">Expertise Microsoft Office</h3>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-primary font-bold">2800 DH</span>
                    <span className="text-xs text-on-surface-variant font-medium">8 Semaines</span>
                  </div>
                  <div className="bg-stone-100 dark:bg-stone-900 rounded-xl p-3 mb-6 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-xs" data-icon="calendar_today">calendar_today</span>
                      <span>Mercredi, 09:00</span>
                    </div>
                    <span className="font-bold text-primary">Lab 1</span>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-bold text-outline">Progression</span>
                      <span className="text-[10px] font-bold">92%</span>
                    </div>
                    <div className="w-full bg-surface-variant h-1 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full w-[92%]"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-on-background text-surface-container-lowest rounded-3xl p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-display text-2xl italic mb-4">Résumé Hebdomadaire</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <span className="text-sm opacity-60">Heures de cours</span>
                      <span className="font-bold">12h</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <span className="text-sm opacity-60">Projets rendus</span>
                      <span className="font-bold">04</span>
                    </div>
                  </div>
                </div>
                <button className="mt-6 flex items-center justify-center gap-2 w-full py-3 border border-white/20 rounded-xl text-sm font-semibold hover:bg-white/5 transition-colors">
                  <span className="material-symbols-outlined" data-icon="file_download">file_download</span>
                  Télécharger l'emploi du temps
                </button>
              </div>
            </div>
            <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
              <div className="md:col-span-2 bg-primary/5 rounded-3xl p-1 border border-primary/10">
                <div className="bg-background rounded-[calc(1.5rem-4px)] p-8 h-full flex flex-col md:flex-row gap-8 items-center">
                  <div className="w-full md:w-1/3">
                    <img alt="Students" className="w-full aspect-square object-cover rounded-2xl shadow-lg" data-alt="a group of diverse students sitting around a table in a bright library with architectural design features, engaged in warm conversation" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAI2Fr0Rf0x1JLm8_t9wdkOBXetND2Lo6_5SskjQY_ywxbScHF2STbqGyrc8AGR4YYmygs_f2YwmuQ1MNPMIlEu5wZEK3yKYsE8pOoBfstwZ6duNmvZo32hOOgDQAK6gSZXz4UYvrpgwLv6rNlTT0V5XTQ6aQ3j2qVjYM2SwijkVPJ0pXGGzpzyEPRbPOqQBEN_qs1cL4lK_1uJpP1TPw8EaeSFRR7HTT4Nrnpkza1LtunRPO4YqFYmSUjLwIpCKo5Bz_x1S9QFE5fr" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                      <span className="text-xs font-bold text-primary uppercase tracking-widest">En cours</span>
                    </div>
                    <h3 className="text-4xl font-display text-on-background italic mb-4">Anglais des Affaires - Niveau B2</h3>
                    <p className="text-on-surface-variant font-body mb-6 text-sm leading-relaxed">
                      Développez votre aisance orale et écrite dans un contexte professionnel international. Focus sur la négociation et la communication stratégique.
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                      <div className="text-center p-3 bg-stone-50 rounded-2xl border border-stone-100">
                        <p className="text-[10px] text-outline uppercase mb-1">Prix</p>
                        <p className="font-bold">3200 DH</p>
                      </div>
                      <div className="text-center p-3 bg-stone-50 rounded-2xl border border-stone-100">
                        <p className="text-[10px] text-outline uppercase mb-1">Salles</p>
                        <p className="font-bold">Lab 4</p>
                      </div>
                      <div className="text-center p-3 bg-stone-50 rounded-2xl border border-stone-100">
                        <p className="text-[10px] text-outline uppercase mb-1">Durée</p>
                        <p className="font-bold">60h</p>
                      </div>
                      <div className="text-center p-3 bg-stone-50 rounded-2xl border border-stone-100">
                        <p className="text-[10px] text-outline uppercase mb-1">Note</p>
                        <p className="font-bold">16/20</p>
                      </div>
                    </div>
                    <div className="w-full bg-surface-variant h-1 rounded-full overflow-hidden mb-2">
                      <div className="bg-primary h-full rounded-full w-[45%]"></div>
                    </div>
                    <p className="text-[10px] text-outline font-bold">Progression: 45% du module validé</p>
                  </div>
                </div>
              </div>
              <div className="bg-stone-50 dark:bg-stone-900/50 rounded-3xl p-8 border border-stone-200/60 flex flex-col justify-between">
                <div>
                  <h4 className="font-display text-3xl italic mb-6">Agenda Immédiat</h4>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center justify-center w-12 h-12 bg-primary rounded-xl text-on-primary">
                        <span className="text-xs font-bold">OCT</span>
                        <span className="text-xl font-bold leading-none">12</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold">Anglais des Affaires</p>
                        <p className="text-xs text-outline">10:00 • Salle Lab 4</p>
                      </div>
                    </div>
                    <div className="flex gap-4 opacity-50">
                      <div className="flex flex-col items-center justify-center w-12 h-12 bg-outline-variant rounded-xl text-on-surface-variant">
                        <span className="text-xs font-bold">OCT</span>
                        <span className="text-xl font-bold leading-none">14</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold">Infographie Digitale</p>
                        <p className="text-xs text-outline">14:00 • Salle 302</p>
                      </div>
                    </div>
                  </div>
                </div>
                <button className="mt-8 text-primary font-bold text-sm flex items-center gap-2 group">
                  Voir tout le calendrier
                  <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform" data-icon="arrow_forward">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <button className="fixed bottom-8 right-8 h-14 w-14 bg-primary text-on-primary rounded-full shadow-lg shadow-primary/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50">
        <span className="material-symbols-outlined" data-icon="add">add</span>
      </button>
    </div>

    <style>
        {`.material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            vertical-align: middle;
        }
        body { font-family: 'Manrope', sans-serif; }
        h1, h2, h3, .serif-font { font-family: 'EB Garamond', serif; }`}
    </style>
    </Authenticated>
  )
}

export default MyCourses