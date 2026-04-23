import React from 'react'

const Feedbacks = () => {
  return (
    <section className="py-32 bg-surface" id="temoignages">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <span className="text-primary font-bold tracking-widest text-xs uppercase">Voix des étudiants</span>
          <h2 className="font-display text-5xl mt-4 mb-6">Résultats réels de nos élèves</h2>
          <p className="text-on-surface-variant max-w-xl mx-auto font-light">
            Rejoignez la communauté de ceux qui ont transformé leur parcours professionnel grâce au Centre Informatique.
          </p>
        </div>

        <div className="masonry-grid">

          <div className="masonry-item p-8 bg-surface-container-low rounded-2xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
            <div className="flex gap-1 text-primary mb-4">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="material-symbols-outlined text-sm">star</span>
              ))}
            </div>
            <p className="text-on-surface italic mb-6 leading-relaxed">
              "La préparation au concours a été décisive. Les méthodes sont rigoureuses et les professeurs sont disponibles. J'ai intégré l'école que je visais dès la première tentative."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">KA</div>
              <div>
                <h5 className="text-sm font-bold">Karim Alaoui</h5>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Ingénieur — École Nationale</p>
              </div>
            </div>
          </div>

          <div className="masonry-item p-8 bg-on-surface text-background rounded-2xl shadow-xl">
            <div className="mb-6 opacity-40">
              <span className="material-symbols-outlined text-5xl">format_quote</span>
            </div>
            <p className="text-lg leading-relaxed mb-6 font-light">
              "La formation bureautique m'a permis de décrocher mon poste actuel. Excel avancé et PowerPoint professionnel sont désormais mes meilleurs alliés."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-white">SM</div>
              <div>
                <h5 className="text-sm font-bold">Sara Mansouri</h5>
                <p className="text-[10px] text-stone-400 uppercase tracking-wider">Assistante de Direction</p>
              </div>
            </div>
          </div>

          <div className="masonry-item p-8 bg-primary/5 rounded-2xl border border-primary/10">
            <p className="text-on-surface-variant mb-6">
              "Mon niveau d'anglais a fait un bond spectaculaire en 3 mois. Les exercices sont variés, l'ambiance est excellente et les résultats sont au rendez-vous."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-on-primary">YB</div>
              <div>
                <h5 className="text-sm font-bold">Youssef Benali</h5>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Étudiant en Master</p>
              </div>
            </div>
          </div>

          <div className="masonry-item p-8 bg-surface-container-high rounded-2xl">
            <div className="flex gap-1 text-primary mb-4">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="material-symbols-outlined text-sm">star</span>
              ))}
            </div>
            <p className="text-on-surface mb-6">
              "Le suivi individualisé fait vraiment la différence. Les formateurs connaissent vos points faibles et y travaillent avec vous pas à pas."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-stone-300 flex items-center justify-center font-bold">FZ</div>
              <div>
                <h5 className="text-sm font-bold">Fatima Zahra</h5>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Fonctionnaire</p>
              </div>
            </div>
          </div>

          <div className="masonry-item p-8 bg-white rounded-2xl border border-outline-variant shadow-sm">
            <p className="text-on-surface-variant leading-relaxed mb-6 italic">
              "Excellent centre. L'approche pédagogique est moderne et efficace. Je recommande vivement à tous ceux qui souhaitent progresser rapidement."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center font-bold text-orange-900">MA</div>
              <div>
                <h5 className="text-sm font-bold">Mohammed Azzouzi</h5>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Chef de Projet IT</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default Feedbacks