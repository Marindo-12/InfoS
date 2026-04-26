import AboutHero from '@/Components/about/AboutHero';
import Navbar from '@/Components/Navbar';
import { Head } from '@inertiajs/react';
import React from 'react';

const About = () => {
  return (
    <>
      <Head title='À propos' />
      <Navbar />
      <main>
        {/* Hero Section */}
        <AboutHero />

        {/* Histoire & Mission */}
        <section className="py-24 px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-serif text-on-surface leading-tight">
                L'excellence au service de l'esprit et du code.
              </h2>
              <div className="space-y-6 font-body text-lg text-on-surface-variant leading-relaxed">
                <p>
                  Fondée il y a trois décennies en tant qu'institut linguistique de niche, Elite Academy
                  est devenue un sanctuaire de premier plan pour l'épanouissement intellectuel et la
                  maîtrise technique. Notre parcours a commencé avec une conviction simple : la
                  communication et la technologie sont les deux piliers du monde moderne.
                </p>
                <p>
                  Aujourd'hui, nous nous situons à la croisée de l'éducation humaniste traditionnelle
                  et de l'innovation numérique de pointe. Notre mission est de doter la prochaine
                  génération de leaders mondiaux de la finesse linguistique et de la puissance technique
                  nécessaires pour naviguer dans un paysage complexe et interconnecté.
                </p>
              </div>
              <div className="flex items-center space-x-4 pt-4">
                <div className="text-center px-8 border-r border-outline-variant">
                  <div className="text-3xl font-serif text-primary">30+</div>
                  <div className="text-xs uppercase tracking-widest mt-1">Années</div>
                </div>
                <div className="text-center px-8 border-r border-outline-variant">
                  <div className="text-3xl font-serif text-primary">12k</div>
                  <div className="text-xs uppercase tracking-widest mt-1">Anciens élèves</div>
                </div>
                <div className="text-center px-8">
                  <div className="text-3xl font-serif text-primary">45</div>
                  <div className="text-xs uppercase tracking-widest mt-1">Partenaires</div>
                </div>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute -inset-4 bg-primary/5 rounded-xl -rotate-2 group-hover:rotate-0 transition-transform duration-500" />
              <img
                className="relative z-10 w-full h-[600px] object-cover rounded-xl shadow-lg"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAohhUjkOm8R1NlZvl8GWCf9Gxoxl7CabaEmWFR7GrZIVOTqNe4LOCAWmjhxxmjTAaYNWiOYGHws-F0d2feMJ3yB6N3n4cw2FdmL_grs9lyJdqTTc3uI3raLoU1ruJphSwwr6bFJrTdGR_1EEc1bKozrtv9VhT0qTo1SZPLeuYrKP2J302NyEpWtiOXzUjLkmL2X8Dfn0s2PZl8FoW6Be8EfYGKgPtSyimli_vZXvNqkLR3bkxKrSiakF3-3YmkF63pKj58S9vvYXb1"
                alt="groupe diversifié d'étudiants professionnels collaborant dans une salle de conférence minimaliste et high-tech"
              />
            </div>
          </div>
        </section>

        {/* Valeurs fondamentales */}
        <section className="py-24 bg-surface-container-low px-8 overflow-hidden">
  <div className="max-w-7xl mx-auto">
    <div className="text-center mb-16">
      <h2 className="text-4xl font-serif mb-4">Nos piliers fondamentaux</h2>
      <p className="font-body text-on-surface-variant tracking-wide uppercase text-sm">
        Les principes qui guident chacun de nos cours
      </p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Carte Précision */}
      <div className="group relative bg-white p-10 rounded-xl border border-outline-variant/30 hover:border-primary/60 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 cursor-pointer">
        <span className="material-symbols-outlined text-5xl text-primary mb-6 block transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
          architecture
        </span>
        <h3 className="text-2xl font-serif mb-4 group-hover:text-primary transition-colors duration-300">Précision</h3>
        <p className="text-on-surface-variant leading-relaxed transition-all duration-300">
          Qu'il s'agisse de la syntaxe d'une nouvelle langue ou de l'architecture d'un système
          logiciel, nous croyons en la puissance de l'exactitude et du souci du détail.
        </p>
        <div className="mt-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
          <a href="#" className="text-primary text-sm font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
            Explorer <span className="material-symbols-outlined text-base">arrow_right_alt</span>
          </a>
        </div>
        {/* Décoration de fond au hover */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>

      {/* Carte Innovation */}
      <div className="group relative bg-white p-10 rounded-xl border border-outline-variant/30 hover:border-primary/60 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 cursor-pointer">
        <span className="material-symbols-outlined text-5xl text-primary mb-6 block transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3">
          lightbulb
        </span>
        <h3 className="text-2xl font-serif mb-4 group-hover:text-primary transition-colors duration-300">Innovation</h3>
        <p className="text-on-surface-variant leading-relaxed">
          Nous n'enseignons pas seulement la norme actuelle ; nous anticipons l'avenir. Notre
          programme est un écosystème vivant qui évolue avec les mutations de l'industrie.
        </p>
        <div className="mt-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
          <a href="#" className="text-primary text-sm font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
            Explorer <span className="material-symbols-outlined text-base">arrow_right_alt</span>
          </a>
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>

      {/* Carte Excellence globale */}
      <div className="group relative bg-white p-10 rounded-xl border border-outline-variant/30 hover:border-primary/60 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 cursor-pointer">
        <span className="material-symbols-outlined text-5xl text-primary mb-6 block transition-all duration-300 group-hover:scale-110 group-hover:translate-x-1">
          public
        </span>
        <h3 className="text-2xl font-serif mb-4 group-hover:text-primary transition-colors duration-300">Excellence globale</h3>
        <p className="text-on-surface-variant leading-relaxed">
          Nos normes sont alignées sur les critères mondiaux les plus élevés, garantissant que
          nos diplômés sont compétitifs sur n'importe quel marché, où que ce soit.
        </p>
        <div className="mt-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
          <a href="#" className="text-primary text-sm font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
            Explorer <span className="material-symbols-outlined text-base">arrow_right_alt</span>
          </a>
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>
    </div>
  </div>
</section>

        {/* Direction & Corps professoral */}
        <section className="py-24 px-8 max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-4xl font-serif mb-2">Les architectes de la croissance</h2>
              <p className="font-body text-on-surface-variant text-lg">
                Guidés par des maîtres dans leurs disciplines.
              </p>
            </div>
            <button className="text-primary font-body font-semibold flex items-center gap-2 group">
              Rencontrer toute l'équipe
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {/* Directrice */}
            <div className="group relative overflow-hidden rounded-xl bg-white">
              <img
                className="w-full h-[450px] object-cover transition-transform duration-700 group-hover:scale-110"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqx1ybRlEjBupElaburzVy_DHR_uSP4bSKXS04xLP7GUSxxMZK7zPH2zH15zgCNhItOfASX5LYPxDcdC-830epmCzqexCjqRdfmA3Jv6cbrPAUxaPbcc8BYolRrQmw6ivCeGofExNz-m_WJMEyHiy1897K28IoTTMYmpx_04Om7IeuMSiuYD8mG4rB7F3pqq3mT3B9a5sFWStTLrsVjoGvLgGZm8tB8nSHPcHxnNIpisalkixzKDY_9HPFW4c9kVnMwqMyxfgUkKS0"
                alt="portrait professionnel d'une directrice senior élégante aux cheveux gris, portant un blazer structuré couleur camel"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-on-surface/90 via-on-surface/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8 text-white">
                <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-sm font-body uppercase tracking-widest mb-2 opacity-80">
                    Directrice de l'académie
                  </p>
                  <h4 className="text-3xl font-serif mb-4">Dr. Elara Thorne</h4>
                  <p className="text-sm leading-relaxed mb-6">
                    Doctorat en linguistique à Oxford. Plus de 20 ans de direction pédagogique sur trois
                    continents.
                  </p>
                  <div className="flex gap-4">
                    <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-body">
                      Stratégie
                    </span>
                    <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-body">
                      Conception de programmes
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-white border-x border-b border-outline-variant/30 group-hover:hidden">
                <h4 className="text-xl font-serif">Dr. Elara Thorne</h4>
                <p className="text-on-surface-variant text-sm mt-1">Directrice de l'académie</p>
              </div>
            </div>

            {/* Responsable informatique */}
            <div className="group relative overflow-hidden rounded-xl bg-white">
              <img
                className="w-full h-[450px] object-cover transition-transform duration-700 group-hover:scale-110"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuByr_oWhqRT1CvdzK9nS1MxdOY8I-zdx2Qe2Y07J1ZJaGkAwvr065anjUXSfE2jIz01SYZCxt_RwgLtmdOlyStwlv6xnu05xG2XrgmyeKyLNFosVKIHHQ8u7tO7YjkDsIMCQJNWGMqM7UZN6LHonNGm7Hx4lbRpO2bxnl_NbLx1qjHWupYh5Lo8po-aoWu-GzQFjdc6kXAV3X5J8gpPJXRTxktGUOcBYKOlcIuuGjMKVhyJXKJTeDZ3w68A18ig6-Yo7ThSusLFRpFP"
                alt="portrait d'un quadragénaire concentré avec des lunettes, col roulé noir, dans un environnement high-tech"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-on-surface/90 via-on-surface/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8 text-white">
                <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-sm font-body uppercase tracking-widest mb-2 opacity-80">
                    Responsable technologie
                  </p>
                  <h4 className="text-3xl font-serif mb-4">Marcus Vane</h4>
                  <p className="text-sm leading-relaxed mb-6">
                    Ancien architecte logiciel dans des grandes places technologiques. Spécialisé en éthique
                    de l'IA et écosystèmes full-stack.
                  </p>
                  <div className="flex gap-4">
                    <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-body">Python</span>
                    <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-body">Systèmes Cloud</span>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-white border-x border-b border-outline-variant/30 group-hover:hidden">
                <h4 className="text-xl font-serif">Marcus Vane</h4>
                <p className="text-on-surface-variant text-sm mt-1">Responsable technologie</p>
              </div>
            </div>

            {/* Coordinatrice linguistique */}
            <div className="group relative overflow-hidden rounded-xl bg-white">
              <img
                className="w-full h-[450px] object-cover transition-transform duration-700 group-hover:scale-110"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDoVU1mhHk2oH_HGagkk-mW049CG0BNw3k1jje6vjTYH6TDaUPVqYBCozCF-JAHTPhFBAzRwJyznt_EjDu_a3n9VxM4oINvrZPp0hQ3piVPtQb5PiaWg9UqTCo0NJ3bRP0UwbjiZ86cXim1X1Ng_ymauDqa6azp2HOYE1b6CB8ov5jI32iqxHteZZbCA1bNHtgBGN2iFrMvQpsC5e9gAO7Uz4lR9wM_6WAL__1OoQSI9AUyL9Hc8mGyZqEu9O4HVXbIzv5UL1zvc2JA"
                alt="portrait professionnel d'une jeune femme souriante aux cheveux bouclés foncés, fond de studio créatif"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-on-surface/90 via-on-surface/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8 text-white">
                <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-sm font-body uppercase tracking-widest mb-2 opacity-80">
                    Coordinatrice linguistique
                  </p>
                  <h4 className="text-3xl font-serif mb-4">Sofia Chen</h4>
                  <p className="text-sm leading-relaxed mb-6">
                    Experte en méthodologies d'apprentissage immersif. Parle cinq langues couramment,
                    spécialisée en communication professionnelle.
                  </p>
                  <div className="flex gap-4">
                    <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-body">
                      Pédagogie
                    </span>
                    <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-body">
                      Interculturel
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-white border-x border-b border-outline-variant/30 group-hover:hidden">
                <h4 className="text-xl font-serif">Sofia Chen</h4>
                <p className="text-on-surface-variant text-sm mt-1">Coordinatrice linguistique</p>
              </div>
            </div>
          </div>
        </section>

        {/* Frise chronologique */}
        <section className="py-24 px-8 bg-surface-container">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-serif mb-4">Trente ans d'étapes clés</h2>
              <p className="font-body text-on-surface-variant uppercase tracking-[0.2em] text-xs">
                Notre évolution de 1994 à aujourd'hui
              </p>
            </div>
            <div className="relative">
              {/* Ligne verticale */}
              <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-outline-variant/60 hidden md:block" />
              <div className="space-y-24">
                {/* 1994 */}
                <div className="relative flex flex-col md:flex-row items-center justify-between group">
                  <div className="md:w-[45%] text-right hidden md:block">
                    <h3 className="text-3xl font-serif text-primary">1994</h3>
                    <p className="text-on-surface-variant mt-2">
                      Création de « The Language Loft » dans un petit studio urbain avec 3 salles de classe.
                    </p>
                  </div>
                  <div className="timeline-dot w-10 h-10 bg-background border-2 border-primary rounded-full relative z-10 hidden md:block" />
                  <div className="md:w-[45%] md:hidden text-center mb-4">
                    <h3 className="text-3xl font-serif text-primary">1994</h3>
                    <p className="text-on-surface-variant mt-2">
                      Création de « The Language Loft » dans un petit studio urbain.
                    </p>
                  </div>
                  <div className="md:w-[45%]">
                    <img
                      className="rounded-lg shadow-sm w-full grayscale group-hover:grayscale-0 transition-all duration-500"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBch4qoGNCdCkd6Uu69rB197I5OR4DQgucbtstZKD2WYm31zjbQbSexUbqVexvHrOZK5J7KVff4FcR3gwldNoSC0bkMWPwQHT3SI1xQl6FLwsc3rlDUt9tb86IwApv4AdD5QMmWV3NiokNJNEgciMlOlY0kdOliRbgM3TM93BK9NCpXGsqwG2rV84qY7WNHagRsfz2W8NyUby9h4YKeiC-lZOex82YbqUWo08B3lknQ8-VzhPa3cTvwd-X_CqK1fHGqtOYWlbTx1lAV"
                      alt="croquis architectural sépia d'un bâtiment académique classique en brique"
                    />
                  </div>
                </div>

                {/* 2005 */}
                <div className="relative flex flex-col md:flex-row-reverse items-center justify-between group">
                  <div className="md:w-[45%] text-left hidden md:block">
                    <h3 className="text-3xl font-serif text-primary">2005</h3>
                    <p className="text-on-surface-variant mt-2">
                      Expansion vers les technologies de l'information. Lancement du premier programme
                      « Coding for Leaders ».
                    </p>
                  </div>
                  <div className="timeline-dot w-10 h-10 bg-background border-2 border-primary rounded-full relative z-10 hidden md:block" />
                  <div className="md:w-[45%] md:hidden text-center mb-4">
                    <h3 className="text-3xl font-serif text-primary">2005</h3>
                    <p className="text-on-surface-variant mt-2">
                      Expansion vers les technologies de l'information et la littératie numérique.
                    </p>
                  </div>
                  <div className="md:w-[45%]">
                    <img
                      className="rounded-lg shadow-sm w-full grayscale group-hover:grayscale-0 transition-all duration-500"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBDfJBExsnuQRG_Mer-Odmw1TCL-skOXqL0n6_eouykDsY8dtYGvh10lPJl9pjqpEoiVoOexVWqoJTyuUC3AOYy2ITtytDpHG4aWSNHp954i2phad9e8HAKIwZq6B-rwRze4fONAm8JKTOByEa2y34lDpBkgfUNcXI1F-yxfrpevCXDB-PeM3OstPU689mqdi7T3wZuLIBfrHE1tFOF_tpXO1_lMy8DnlJwEuvKdeVAom5jwfONV8Ape8O7-SzcY_dA9PT-m1QSXQ2"
                      alt="bureau tech des années 2000 avec ordinateurs blancs et environnement professionnel"
                    />
                  </div>
                </div>

                {/* 2018 */}
                <div className="relative flex flex-col md:flex-row items-center justify-between group">
                  <div className="md:w-[45%] text-right hidden md:block">
                    <h3 className="text-3xl font-serif text-primary">2018</h3>
                    <p className="text-on-surface-variant mt-2">
                      Obtention de l'accréditation mondiale. L'institut est renommé Elite Academy pour
                      refléter ses normes élevées.
                    </p>
                  </div>
                  <div className="timeline-dot w-10 h-10 bg-background border-2 border-primary rounded-full relative z-10 hidden md:block" />
                  <div className="md:w-[45%] md:hidden text-center mb-4">
                    <h3 className="text-3xl font-serif text-primary">2018</h3>
                    <p className="text-on-surface-variant mt-2">
                      Accréditation mondiale complète et changement de nom pour Elite Academy.
                    </p>
                  </div>
                  <div className="md:w-[45%]">
                    <img
                      className="rounded-lg shadow-sm w-full grayscale group-hover:grayscale-0 transition-all duration-500"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRRF0afWOJWpAhepm21JHTyWqGECQPULDLWquvzkfAKFbwuMFHTc6k5PRVRPd1_WxqCNbsyTBZA-ffUflGRKUGNNCsaLf8BhqyXp2ZxwBTMLexsbCLog-Ey61h0isnICcPwNXWMbszfXpNcCDYpeh2e5Nn3rXZSDHtNv8tirYqxvbdPdOcUaLRYLQX28VGvnqZU22nmwwttVrGudu8DXb-kfcvPBtUoVat87VFfhQr4UHNikaeYmBZoKfcMIh1ntvOQhq5hfn5AcTa"
                      alt="bâtiment moderne en verre et acier au crépuscule avec lumières intérieures"
                    />
                  </div>
                </div>

                {/* Aujourd'hui */}
                <div className="relative flex flex-col md:flex-row-reverse items-center justify-between group">
                  <div className="md:w-[45%] text-left hidden md:block">
                    <h3 className="text-3xl font-serif text-primary">Aujourd'hui</h3>
                    <p className="text-on-surface-variant mt-2">
                      Un pôle mondial pour la recherche en IA et les études linguistiques avancées,
                      avec 12 000 anciens élèves.
                    </p>
                  </div>
                  <div className="timeline-dot w-10 h-10 bg-background border-2 border-primary rounded-full relative z-10 hidden md:block" />
                  <div className="md:w-[45%] md:hidden text-center mb-4">
                    <h3 className="text-3xl font-serif text-primary">Aujourd'hui</h3>
                    <p className="text-on-surface-variant mt-2">
                      Un leader mondial de la formation double compétence : technologie et linguistique.
                    </p>
                  </div>
                  <div className="md:w-[45%]">
                    <img
                      className="rounded-lg shadow-sm w-full grayscale group-hover:grayscale-0 transition-all duration-500"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCU9fxgrdjOcAV7qRM_0v-p1srNV3T08SW2nYlC76tJMb1F9fwtvC9D2LnhlExTPZ6QfoIgUkcje4cBEAzQ451RRmxayZ4bkU_mTOwRzRG5Pgnu0JWqOmFPrv_b_cVyB2ZcXh2OtSd9js06Fpq2cTfrIKc8THIPIIuI01rhH9UOcqsNgtZvPUieOfXOvMs-NQpkMWpRGJnKOxnK1g48Whd9cYwJkU5CqSqZkbazdTmcm6k1q4AiAQin7Y7ZUSFvLwmVWqwNNA6QBt3e"
                      alt="intérieur moderne et dynamique d'une académie avec étudiants et équipements tech"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section narrative & pied de page */}
        <section className="bg-[#1a1a1a] text-white pt-32 pb-16 px-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 translate-x-20 pointer-events-none" />
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-start mb-32">
            <div className="space-y-10">
              <div className="inline-flex items-center gap-4 text-primary">
                <div className="w-12 h-px bg-primary" />
                <span className="font-body text-xs uppercase tracking-[0.4em]">Notre conviction</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-serif leading-tight">
                Chaque code est une langue, chaque langue est un monde.
              </h2>
              <p className="text-lg text-white/60 font-body leading-relaxed max-w-xl">
                Nous croyons que les avancées humaines les plus profondes surviennent lorsque nous
                comblons le fossé entre la logique technique et l'expression humaine. À Info Saloua,
                nous n'enseignons pas seulement des compétences ; nous cultivons un état d'esprit de
                fluence globale qui transcende les frontières et le binaire.
              </p>
              <div className="pt-4">
                <a className="inline-flex items-center gap-3 group" href="#">
                  <span className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
                    <span className="material-symbols-outlined text-sm">play_arrow</span>
                  </span>
                  <span className="font-body text-sm font-bold uppercase tracking-widest">
                    Voir l'impact de notre histoire
                  </span>
                </a>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
              <div className="space-y-4">
                <h4 className="font-serif text-2xl text-primary">La vision</h4>
                <p className="text-white/50 text-sm leading-relaxed">
                  Devenir la référence mondiale incontestée pour une formation pluridisciplinaire où
                  éthique et technologie coexistent.
                </p>
              </div>
              <div className="space-y-4">
                <h4 className="font-serif text-2xl text-primary">La communauté</h4>
                <p className="text-white/50 text-sm leading-relaxed">
                  Rejoignez les 12 000+ anciens élèves qui mènent le changement dans la Silicon Valley,
                  à Londres, Tokyo et au-delà.
                </p>
              </div>
              <div className="sm:col-span-2 pt-8">
                <div className="bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <p className="font-serif italic text-xl mb-6 text-white/80">
                    « Elite Academy ne m'a pas seulement appris à programmer ; elle m'a appris à
                    communiquer le "pourquoi" derrière le "comment". »
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center font-serif text-primary italic">
                      S
                    </div>
                    <div>
                      <p className="text-sm font-bold uppercase tracking-wide">Sarah Jenkins</p>
                      <p className="text-xs text-white/40">
                        Ancienne élève '19, Responsable produit senior chez Vertex
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contenu du pied de page */}
          <div className="max-w-7xl mx-auto border-t border-white/10 pt-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
              <div className="md:col-span-1">
                <div className="text-3xl font-serif tracking-tight text-primary mb-6">
                  Info Saloua
                </div>
                <p className="text-white/40 text-sm leading-relaxed">
                  L'excellence au service de l'esprit et du code.<br />
                  Basée à Londres, New York et Singapour.
                </p>
              </div>
              <div className="space-y-6">
                <h5 className="font-body font-bold text-xs uppercase tracking-widest text-white/80">
                  Parcours
                </h5>
                <ul className="space-y-3 text-white/50 text-sm font-body">
                  <li><a className="hover:text-primary transition-colors" href="#">Maîtrise des langues</a></li>
                  <li><a className="hover:text-primary transition-colors" href="#">Ingénierie avancée</a></li>
                  <li><a className="hover:text-primary transition-colors" href="#">Éthique & politique de l'IA</a></li>
                  <li><a className="hover:text-primary transition-colors" href="#">Leadership numérique</a></li>
                </ul>
              </div>
              <div className="space-y-6">
                <h5 className="font-body font-bold text-xs uppercase tracking-widest text-white/80">
                  Académie
                </h5>
                <ul className="space-y-3 text-white/50 text-sm font-body">
                  <li><a className="hover:text-primary transition-colors" href="#">Notre histoire</a></li>
                  <li><a className="hover:text-primary transition-colors" href="#">Le corps professoral</a></li>
                  <li><a className="hover:text-primary transition-colors" href="#">Bourses</a></li>
                  <li><a className="hover:text-primary transition-colors" href="#">Partenaires mondiaux</a></li>
                </ul>
              </div>
              <div className="space-y-8">
                <h5 className="font-body font-bold text-xs uppercase tracking-widest text-white/80">
                  Admissions
                </h5>
                <button className="w-full bg-primary text-white py-4 rounded-xl font-body font-bold text-sm hover:opacity-90 transition-opacity">
                  Commencer votre candidature
                </button>
                <div className="flex gap-4">
                  <a className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all" href="#">
                    <span className="material-symbols-outlined text-sm">alternate_email</span>
                  </a>
                  <a className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all" href="#">
                    <span className="material-symbols-outlined text-sm">language</span>
                  </a>
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] uppercase tracking-[0.3em] text-white/30 border-t border-white/5 pt-8">
              <p>© {new Date().getFullYear()} Info Saloua. Tous droits réservés.</p>
              <div className="flex gap-8">
                <a className="hover:text-primary transition-colors" href="#">Confidentialité</a>
                <a className="hover:text-primary transition-colors" href="#">Conditions</a>
                <a className="hover:text-primary transition-colors" href="#">Accessibilité</a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Styles personnalisés (inchangés) */}
      <style>{`
        .abstract-bg {
          background-color: #faf5ee;
          background-image: 
            radial-gradient(circle at 10% 20%, rgba(194, 101, 42, 0.03) 0%, transparent 20%),
            radial-gradient(circle at 90% 80%, rgba(194, 101, 42, 0.04) 0%, transparent 25%),
            linear-gradient(45deg, rgba(216, 208, 200, 0.1) 0%, transparent 40%);
        }
        .hero-line {
          background: linear-gradient(to right, transparent, #d8d0c8, transparent);
          height: 1px;
          width: 100%;
          position: absolute;
        }
        .hero-circle {
          border: 1px solid rgba(194, 101, 42, 0.1);
          border-radius: 50%;
          position: absolute;
        }
        .blob {
          position: absolute;
          filter: blur(40px);
          opacity: 0.15;
          z-index: 5;
          mix-blend-mode: multiply;
        }
        .timeline-dot::after {
          content: '';
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 8px;
          height: 8px;
          background-color: #c2652a;
          border-radius: 50%;
        }
      `}</style>
    </>
  );
};

export default About;