import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

interface FormData {
  nom: string;
  prenom: string;
  age: string;
  niveau: string;
  email: string;
  telephone: string;
  modules: {
    word: boolean;
    excel: boolean;
    powerpoint: boolean;
  };
  level: string;
  payment: string;
  acceptTerms: boolean;
  acceptPrivacy: boolean;
}

const InscriptionBureautique: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    nom: '',
    prenom: '',
    age: '',
    niveau: 'Baccalauréat',
    email: '',
    telephone: '',
    modules: {
      word: true,
      excel: true,
      powerpoint: true,
    },
    level: 'debutant',
    payment: 'online',
    acceptTerms: false,
    acceptPrivacy: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      if (name.startsWith('module_')) {
        const moduleName = name.replace('module_', '') as keyof typeof formData.modules;
        setFormData((prev) => ({
          ...prev,
          modules: { ...prev.modules, [moduleName]: target.checked },
        }));
      } else if (name === 'acceptTerms') {
        setFormData((prev) => ({ ...prev, acceptTerms: target.checked }));
      } else if (name === 'acceptPrivacy') {
        setFormData((prev) => ({ ...prev, acceptPrivacy: target.checked }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.acceptTerms || !formData.acceptPrivacy) {
      alert('Veuillez accepter les conditions générales et la politique de confidentialité.');
      return;
    }
    console.log('Formulaire soumis :', formData);
    alert('Inscription enregistrée ! Un conseiller vous contactera sous 48h.');
  };

  return (
    <>
      <Head title="Bureautique" />
      <PublicLayout>
        <main className="relative">
          {/* Background Decor */}
          <div className="absolute inset-0 geometric-bg opacity-30 pointer-events-none"></div>

          {/* 2. Hero Section */}
          <section className="max-w-7xl mx-auto px-8 pt-16 pb-12 relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-primary font-semibold tracking-widest uppercase text-xs mb-4 block">
                  Formation Certifiante
                </span>
                <h1 className="font-display text-5xl md:text-6xl font-bold leading-tight mb-6">
                  <span className="text-primary">Inscriptions :</span> <span className="text-on-surface">Pôle Bureautique</span>
                </h1>
                <p className="text-on-surface-variant text-lg leading-relaxed mb-8 max-w-xl">
                  Maîtrisez les outils indispensables du monde professionnel. Une formation intensive de{' '}
                  <span className="text-on-surface font-bold">2 mois</span> couvrant Excel, Word et PowerPoint pour
                  transformer votre productivité.
                </p>
                <div className="flex flex-wrap gap-6 mb-8">
                  <div className="bg-surface-container flex items-center gap-3 px-5 py-3 rounded-xl border border-outline-variant/50">
                    <span className="material-symbols-outlined text-primary">schedule</span>
                    <span className="font-medium">Durée: 2 mois</span>
                  </div>
                  <div className="bg-surface-container flex items-center gap-3 px-5 py-3 rounded-xl border border-outline-variant/50">
                    <span className="material-symbols-outlined text-primary">payments</span>
                    <span className="font-bold text-lg">800 DH</span>
                  </div>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                    <div>
                      <h4 className="font-semibold">Hands-on training</h4>
                      <p className="text-sm text-on-surface-variant leading-tight">Projets réels et exercices pratiques immédiats.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                    <div>
                      <h4 className="font-semibold">Professional tools</h4>
                      <p className="text-sm text-on-surface-variant leading-tight">Dernières versions de la suite Microsoft Office.</p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="relative group">
                <div className="absolute -inset-4 bg-primary/10 rounded-[2rem] blur-2xl group-hover:bg-primary/20 transition-all duration-500"></div>
                <img
                  alt="Modern Professional Workspace"
                  className="relative rounded-2xl object-cover w-full aspect-video shadow-2xl border border-outline-variant/30 hover-color-transition"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGeQTJWU5lf74rdGfm5Tnl5u6PdpyjIQt_3eZcKeqARYaDMRVtvOcZdJ3nUxsHVTJwFMeaYnc9-P1utuUeOPBxaA0Ah8FnTwTZxXUEdMUp0yOoDcSrnwLW2MCsHDymv8iWMqzcDPycAT6EpjoRqX6ATJdC33yHze1NeEDwH_UdfsmG30RfIFFRjkfiJOS3wNF3tS5szyG_7IktuBbZw5fDLha6cxRvEq4jifilpiHrm2AWjwDmw5ceF02zMOu_Bjm1CfMHLX0d9Ibc"
                />
              </div>
            </div>
          </section>

          {/* Section Header for Form */}
          <div className="max-w-7xl mx-auto px-8 pt-12 pb-8 text-center relative z-10">
            <div className="inline-block h-1 w-12 bg-primary mb-6"></div>
            <h2 className="font-display text-4xl md:text-5xl text-on-surface font-bold mb-4">
              Finaliser votre Inscription
            </h2>
            <p className="text-on-surface-variant text-lg max-w-2xl mx-auto">
              Veuillez remplir le formulaire ci-dessous pour réserver votre place au sein de notre promotion de Bureautique
              Professionnelle.
            </p>
          </div>

          {/* 3 & 4. Form & Payment Section */}
          <section className="max-w-4xl mx-auto px-8 pb-24 relative overflow-visible">
            <div className="absolute -z-10 top-0 left-0 w-full h-full pointer-events-none opacity-20">
              <div className="absolute top-10 -left-20 w-40 h-[1px] bg-on-surface rotate-45"></div>
              <div className="absolute bottom-40 -right-20 w-60 h-[1px] bg-primary -rotate-12"></div>
              <div className="absolute -top-10 -right-10 w-32 h-32 border border-primary rounded-full"></div>
              <div className="absolute bottom-20 -left-16 w-24 h-24 border border-on-surface rounded-full"></div>
              <div className="absolute top-1/2 left-full -translate-x-1/2 w-8 h-8 rounded-full bg-primary/20"></div>
            </div>
            <div className="bg-surface-container-low rounded-3xl p-8 md:p-12 border border-outline-variant/30 shadow-sm relative z-10">
              <form onSubmit={handleSubmit} className="space-y-12">
                {/* Personal Info */}
                <div>
                  <div className="flex items-center gap-4 mb-8">
                    <span className="bg-primary text-on-primary w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </span>
                    <h3 className="font-display text-2xl font-bold">Informations Personnelles</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-on-surface-variant ml-1">Nom</label>
                      <input
                        type="text"
                        name="nom"
                        value={formData.nom}
                        onChange={handleInputChange}
                        className="w-full bg-surface-container-lowest border-outline-variant rounded-lg px-4 py-3 focus:ring-primary focus:border-primary transition-all"
                        placeholder="Votre nom"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-on-surface-variant ml-1">Prénom</label>
                      <input
                        type="text"
                        name="prenom"
                        value={formData.prenom}
                        onChange={handleInputChange}
                        className="w-full bg-surface-container-lowest border-outline-variant rounded-lg px-4 py-3 focus:ring-primary focus:border-primary transition-all"
                        placeholder="Votre prénom"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-on-surface-variant ml-1">Âge</label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        className="w-full bg-surface-container-lowest border-outline-variant rounded-lg px-4 py-3 focus:ring-primary focus:border-primary transition-all"
                        placeholder="Ex: 20"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-on-surface-variant ml-1">Niveau Académique</label>
                      <select
                        name="niveau"
                        value={formData.niveau}
                        onChange={handleInputChange}
                        className="w-full bg-surface-container-lowest border-outline-variant rounded-lg px-4 py-3 focus:ring-primary focus:border-primary transition-all"
                      >
                        <option>Baccalauréat</option>
                        <option>Licence</option>
                        <option>Master</option>
                        <option>Autre</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-on-surface-variant ml-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full bg-surface-container-lowest border-outline-variant rounded-lg px-4 py-3 focus:ring-primary focus:border-primary transition-all"
                        placeholder="email@exemple.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-on-surface-variant ml-1">Téléphone</label>
                      <input
                        type="tel"
                        name="telephone"
                        value={formData.telephone}
                        onChange={handleInputChange}
                        className="w-full bg-surface-container-lowest border-outline-variant rounded-lg px-4 py-3 focus:ring-primary focus:border-primary transition-all"
                        placeholder="+212 600 000 000"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Course Details - Selectable Cards */}
                <div>
                  <div className="flex items-center gap-4 mb-8">
                    <span className="bg-primary text-on-primary w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </span>
                    <h3 className="font-display text-2xl font-bold">Détails de la Formation</h3>
                  </div>
                  <div className="mb-10">
                    <label className="text-sm font-semibold text-on-surface-variant block ml-1 mb-4">
                      Sélectionnez vos modules (Multi-choix possible)
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Word */}
                      <label className="relative group cursor-pointer">
                        <input
                          type="checkbox"
                          name="module_word"
                          checked={formData.modules.word}
                          onChange={handleInputChange}
                          className="peer sr-only"
                        />
                        <div className="h-full p-5 border border-outline-variant rounded-xl flex flex-col items-center text-center transition-all peer-checked:border-primary peer-checked:bg-primary-container/20 group-hover:border-primary/50 bg-white">
                          <div className="bg-surface-container p-3 rounded-full mb-3 group-hover:bg-primary-container/30 transition-colors">
                            <span className="material-symbols-outlined text-primary text-3xl">description</span>
                          </div>
                          <p className="font-bold text-on-surface">Microsoft Word</p>
                          <p className="text-xs text-on-surface-variant mt-1">Édition &amp; mise en page professionnelle</p>
                          <div className="mt-4 opacity-0 peer-checked:opacity-100 transition-opacity">
                            <span className="material-symbols-outlined text-primary">check_circle</span>
                          </div>
                        </div>
                      </label>
                      {/* Excel */}
                      <label className="relative group cursor-pointer">
                        <input
                          type="checkbox"
                          name="module_excel"
                          checked={formData.modules.excel}
                          onChange={handleInputChange}
                          className="peer sr-only"
                        />
                        <div className="h-full p-5 border border-outline-variant rounded-xl flex flex-col items-center text-center transition-all peer-checked:border-primary peer-checked:bg-primary-container/20 group-hover:border-primary/50 bg-white">
                          <div className="bg-surface-container p-3 rounded-full mb-3 group-hover:bg-primary-container/30 transition-colors">
                            <span className="material-symbols-outlined text-primary text-3xl">table_chart</span>
                          </div>
                          <p className="font-bold text-on-surface">Microsoft Excel</p>
                          <p className="text-xs text-on-surface-variant mt-1">Analyse de données &amp; formules</p>
                          <div className="mt-4 opacity-0 peer-checked:opacity-100 transition-opacity">
                            <span className="material-symbols-outlined text-primary">check_circle</span>
                          </div>
                        </div>
                      </label>
                      {/* PowerPoint */}
                      <label className="relative group cursor-pointer">
                        <input
                          type="checkbox"
                          name="module_powerpoint"
                          checked={formData.modules.powerpoint}
                          onChange={handleInputChange}
                          className="peer sr-only"
                        />
                        <div className="h-full p-5 border border-outline-variant rounded-xl flex flex-col items-center text-center transition-all peer-checked:border-primary peer-checked:bg-primary-container/20 group-hover:border-primary/50 bg-white">
                          <div className="bg-surface-container p-3 rounded-full mb-3 group-hover:bg-primary-container/30 transition-colors">
                            <span className="material-symbols-outlined text-primary text-3xl">slideshow</span>
                          </div>
                          <p className="font-bold text-on-surface">Microsoft PowerPoint</p>
                          <p className="text-xs text-on-surface-variant mt-1">Présentations dynamiques &amp; design</p>
                          <div className="mt-4 opacity-0 peer-checked:opacity-100 transition-opacity">
                            <span className="material-symbols-outlined text-primary">check_circle</span>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-sm font-semibold text-on-surface-variant block ml-1">Niveau Souhaité</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <label className="relative group cursor-pointer">
                        <input
                          type="radio"
                          name="level"
                          value="debutant"
                          checked={formData.level === 'debutant'}
                          onChange={handleRadioChange}
                          className="peer sr-only"
                        />
                        <div className="p-4 border border-outline-variant rounded-xl text-center transition-all peer-checked:border-primary peer-checked:bg-primary-container/20 group-hover:border-primary/50">
                          <p className="font-bold">Débutant</p>
                          <p className="text-xs text-on-surface-variant">Bases et introduction</p>
                        </div>
                      </label>
                      <label className="relative group cursor-pointer">
                        <input
                          type="radio"
                          name="level"
                          value="intermediaire"
                          checked={formData.level === 'intermediaire'}
                          onChange={handleRadioChange}
                          className="peer sr-only"
                        />
                        <div className="p-4 border border-outline-variant rounded-xl text-center transition-all peer-checked:border-primary peer-checked:bg-primary-container/20 group-hover:border-primary/50">
                          <p className="font-bold">Intermédiaire</p>
                          <p className="text-xs text-on-surface-variant">Fonctions avancées</p>
                        </div>
                      </label>
                      <label className="relative group cursor-pointer">
                        <input
                          type="radio"
                          name="level"
                          value="avance"
                          checked={formData.level === 'avance'}
                          onChange={handleRadioChange}
                          className="peer sr-only"
                        />
                        <div className="p-4 border border-outline-variant rounded-xl text-center transition-all peer-checked:border-primary peer-checked:bg-primary-container/20 group-hover:border-primary/50">
                          <p className="font-bold">Avancé</p>
                          <p className="text-xs text-on-surface-variant">Expertise métier</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Payment Selection */}
                <div>
                  <div className="flex items-center gap-4 mb-8">
                    <span className="bg-primary text-on-primary w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </span>
                    <h3 className="font-display text-2xl font-bold">Mode de Paiement</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="relative cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        value="online"
                        checked={formData.payment === 'online'}
                        onChange={handleRadioChange}
                        className="peer sr-only"
                      />
                      <div className="flex items-center gap-4 p-5 border border-outline-variant rounded-2xl peer-checked:border-primary peer-checked:bg-white transition-all">
                        <span className="material-symbols-outlined text-on-surface-variant peer-checked:text-primary">
                          credit_card
                        </span>
                        <span className="font-medium">Paiement en ligne</span>
                      </div>
                    </label>
                    <label className="relative cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        value="onsite"
                        checked={formData.payment === 'onsite'}
                        onChange={handleRadioChange}
                        className="peer sr-only"
                      />
                      <div className="flex items-center gap-4 p-5 border border-outline-variant rounded-2xl peer-checked:border-primary peer-checked:bg-white transition-all">
                        <span className="material-symbols-outlined text-on-surface-variant peer-checked:text-primary">
                          event_available
                        </span>
                        <span className="font-medium">Rendez-vous Présentiel</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Legal & Submit */}
                <div className="pt-8 border-t border-outline-variant/30 space-y-8">
                  <div className="space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        name="acceptTerms"
                        checked={formData.acceptTerms}
                        onChange={handleInputChange}
                        className="mt-1 rounded border-outline-variant text-primary focus:ring-primary transition-all"
                      />
                      <span className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">
                        J'accepte les Conditions Générales d'Utilisation (Terms &amp; Conditions)
                      </span>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        name="acceptPrivacy"
                        checked={formData.acceptPrivacy}
                        onChange={handleInputChange}
                        className="mt-1 rounded border-outline-variant text-primary focus:ring-primary transition-all"
                      />
                      <span className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">
                        Je consens au traitement de mes données personnelles selon la Politique de Confidentialité.
                      </span>
                    </label>
                  </div>
                  {/* 5. Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-5 bg-primary text-on-primary rounded-xl font-bold text-lg tracking-wide hover:bg-on-primary-fixed-variant hover:shadow-xl hover:shadow-primary/20 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    Valider ma place
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
                </div>
              </form>
            </div>
          </section>
        </main>
      </PublicLayout>

      <style>{`
          .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
          }
          .geometric-bg {
            background-image: radial-gradient(#d8d0c8 0.5px, transparent 0.5px);
            background-size: 24px 24px;
          }
          .hover-color-transition {
            filter: grayscale(100%);
            transition: filter 0.5s ease-in-out;
          }
          .hover-color-transition:hover {
            filter: grayscale(0%);
          }
        `}</style>

    </>
  );
};

export default InscriptionBureautique;