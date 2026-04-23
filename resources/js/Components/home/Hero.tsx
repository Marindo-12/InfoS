import React from 'react'

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-surface-bright py-16 md:py-20">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 transform translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-primary/10 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — Text */}
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-extrabold tracking-[0.3em] rounded-full mb-8 uppercase">
              Excellence Établie
            </span>

            <h1 className="font-display text-8xl md:text-8xl lg:text-9xl leading-[0.9] mb-8 text-on-background">
              La&nbsp;précision <br />
              <span className="text-primary italic">dans chaque</span> <br />
              <span className="tracking-tight font-light">Mot.</span>
            </h1>

            <p className="text-lg md:text-xl text-on-surface-variant font-light mb-12 leading-relaxed max-w-md">
              Centre Informatique offre un parcours éducatif sur mesure pour les professionnels qui cherchent la maîtrise des langues et des technologies.
            </p>

            <div className="flex flex-wrap gap-6">
              <a
                href="#formations"
                className="px-10 py-4 bg-primary text-on-primary rounded-lg font-bold hover:brightness-110 transition-all shadow-xl flex items-center gap-2 group"
              >
                Nos Formations
                <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
              </a>
              <a
                href="#about"
                className="px-10 py-4 border border-outline text-on-surface rounded-lg font-semibold hover:bg-surface-container-high transition-all"
              >
                Notre Méthode
              </a>
            </div>
          </div>

          {/* Right — Image */}
          <div className="relative hidden lg:block">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-700">
              <img
                alt="Environnement d'apprentissage professionnel"
                className="w-full max-h-[70vh] object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnm6UaxD6wdhKYXgX-yKWcnsvZemSTWor9mGapQcF6GuKKlTyQcqe07FeXCJrwHtuM4s2zbLBKt_8XoZQhPHZFtP2MvWf17tIMfeMUymAHouMUbqnS6XuJzHwjUg8JVfJw7dXGAQlyG1RSR7zlaXPUvDX6psFdW71Sb6ixfdztC8h08CyHv4zRr_CplctYiDIwB20dAaH1xRIwn8KSlq_PaS4pEqqCU6co-ZiR56bSVNzJt-O6yOQz4yTfBkyufhY4QgnqwJjM1DbP"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
            <div className="absolute -bottom-6 -left-6 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
            <div className="absolute -top-10 -right-10 w-40 h-40 border-2 border-primary/20 rounded-full -z-10" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero