import React from 'react'

const Experience = () => {
  return (
    <section className="py-24 bg-surface-container-low" id="about">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col lg:flex-row gap-20 items-center">

          {/* Left — Images */}
          <div className="w-full lg:w-1/2 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <img
                className="w-full h-80 object-cover rounded-xl shadow-sm"
                alt="Salle informatique moderne"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwS3S0JrSLNtNCTRFseaaZgxfqRz_4djwcuGCGxy9wNQb-iWv1hW1_w-FFm_4ngBLpXnhUN-chIik-zZzVbpzIiMmyDawSGcef16ZjY2FoaQKCLn3RBJrSpo67JJReRmUoeqTMCJKu5zXjI5nrAUKubtjNQXXCklebpwqmlY95wNJ5_t5Ws3D2fhsfBZen978v4x9u6BKjFmlsfutorUMyOTSbnpvP-prFlgpqOLK5TtRHouGNsztNBJ-4iDuNjqRkWYfverFM7X3b"
              />
              <div className="bg-primary p-8 rounded-xl text-on-primary">
                <h4 className="font-display text-2xl mb-2 italic">Accompagnement</h4>
                <p className="text-sm font-light opacity-90">
                  Des formateurs experts guident chacun de vos pas vers l'excellence.
                </p>
              </div>
            </div>
            <div className="pt-12 space-y-4">
              <img
                className="w-full h-96 object-cover rounded-xl shadow-sm"
                alt="Formateurs expérimentés"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnm6UaxD6wdhKYXgX-yKWcnsvZemSTWor9mGapQcF6GuKKlTyQcqe07FeXCJrwHtuM4s2zbLBKt_8XoZQhPHZFtP2MvWf17tIMfeMUymAHouMUbqnS6XuJzHwjUg8JVfJw7dXGAQlyG1RSR7zlaXPUvDX6psFdW71Sb6ixfdztC8h08CyHv4zRr_CplctYiDIwB20dAaH1xRIwn8KSlq_PaS4pEqqCU6co-ZiR56bSVNzJt-O6yOQz4yTfBkyufhY4QgnqwJjM1DbP"
              />
            </div>
          </div>

          {/* Right — Features */}
          <div className="w-full lg:w-1/2">
            <h2 className="font-display text-5xl mb-8">L'Expérience Centre Info</h2>
            <p className="text-lg text-on-surface-variant font-light mb-8 leading-relaxed">
              Notre centre est bien plus qu'un simple lieu d'apprentissage — c'est un écosystème conçu pour une performance maximale. Des salles informatiques modernes aux cours de langues immersifs, chaque détail est pensé pour minimiser les obstacles et maximiser la croissance.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                { icon: 'biotech', title: 'Salles équipées', desc: 'Matériel de pointe pour une simulation du monde réel.' },
                { icon: 'school', title: 'Formateurs experts', desc: 'Professeurs expérimentés avec des années de pratique.' },
                { icon: 'public', title: 'Réseau professionnel', desc: 'Connectez-vous avec nos anciens dans les meilleures entreprises.' },
                { icon: 'verified_user', title: 'Pédagogie reconnue', desc: 'Méthodes reconnues par les organismes éducatifs.' },
              ].map(item => (
                <div key={item.title} className="flex gap-4">
                  <span className="material-symbols-outlined text-primary text-3xl">{item.icon}</span>
                  <div>
                    <h5 className="font-bold mb-1">{item.title}</h5>
                    <p className="text-sm text-on-surface-variant font-light">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Experience