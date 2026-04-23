import React from 'react'

const History = () => {
  return (
    <section className="py-32 bg-white relative overflow-hidden" id="about">
  <div className="max-w-7xl mx-auto px-8 relative z-10">
    <div className="flex flex-col lg:flex-row items-center gap-20">
      <div className="w-full lg:w-1/2">
        <div className="relative">
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary-fixed rounded-full -z-10 opacity-50"></div>
          <img alt="Centre d'apprentissage moderne" className="rounded-2xl shadow-2xl w-full h-[550px] object-cover relative z-10" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_ZoEDywvm5iEbkq1S6VSKGqkaJOi96XTttssRJh5QF7-fjtynlGBhyLI_1ByZaY5BW-FX5r29qK-ob9VB2IBqEF7oWTxwX-DMdliYRhnkuIwp6Q7Ye9Llmafcej0DQcRvRVwJ4Fw15Npye94FYgiVyLjLMfG3K8L9AgSG1up8qyrdYuKy36FrNo1omb6cuu_q21h3wePwzqXmOVyWov-c4ESm3RAeKj32tNtlRJPpxo01FmvruWJl-v_Ql2_rJ0eGS5UZ_oZ5GNsj" />
          <div className="absolute -bottom-6 -right-6 bg-primary p-8 rounded-xl shadow-xl z-20 hidden md:block">
            <p className="text-on-primary font-display text-2xl italic">Fondée sur le principe de la synthèse linguistique et technique.</p>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 space-y-8">
        <span className="text-primary font-bold tracking-[0.2em] text-xs uppercase">Héritage d’une académie d’élite</span>
        <h2 className="font-display text-5xl md:text-6xl text-on-background leading-tight">Façonner l’avenir de <span className="italic text-primary">l’épanouissement professionnel.</span></h2>
        <p className="text-on-surface-variant text-lg leading-relaxed font-light">
          Depuis plus d’une décennie, Elite Academy se tient à la croisée de l’intelligence culturelle et de l’innovation technologique. Notre mission est de doter les professionnels de la double maîtrise nécessaire à la scène mondiale du XXIe siècle : la maîtrise nuancée des langues et la compétence technique en ingénierie full‑stack.
        </p>
        <p className="text-on-surface-variant text-lg leading-relaxed font-light">
          Nous ne proposons pas seulement des cours ; nous organisons des expériences qui définissent une carrière. Notre centre a été conçu comme un sanctuaire pour un apprentissage ciblé et à fort impact, où chaque outil pédagogique est conçu pour vous rapprocher de l’élite des talents mondiaux.
        </p>
        <div className="grid grid-cols-2 gap-8 pt-4">
          <div>
            <h4 className="font-bold text-primary text-xl mb-2">Notre mission</h4>
            <p className="text-sm text-on-surface-variant leading-relaxed">Combler le fossé entre la communication humaine et l’infrastructure numérique.</p>
          </div>
          <div>
            <h4 className="font-bold text-primary text-xl mb-2">Notre histoire</h4>
            <p className="text-sm text-on-surface-variant leading-relaxed">D’un laboratoire de langues de niche à un institut mondial de premier plan pour l’informatique et la diplomatie.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
  )
}

export default History