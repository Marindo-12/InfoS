import React from 'react'

const State = () => {
  return (
    <section className="py-24 bg-on-surface text-background relative overflow-hidden">
      <div className="absolute right-[-10%] top-[-20%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]" />
      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
          {[
            { value: '500+', label: 'Étudiants formés' },
            { value: '95%', label: 'Taux de réussite' },
            { value: '10+', label: 'Années d\'expérience' },
          ].map(stat => (
            <div key={stat.label} className="py-8 md:py-0">
              <div className="font-display text-7xl text-primary mb-2">{stat.value}</div>
              <div className="uppercase tracking-[0.3em] text-xs font-semibold opacity-60">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default State