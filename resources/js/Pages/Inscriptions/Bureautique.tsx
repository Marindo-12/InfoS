import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import wordIc from '../../../../public/images/word.png'
import excelIc from '../../../../public/images/excel.png'
import powerpointIc from '../../../../public/images/powerpoint.png'

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

const MODULE_CARDS = [
  {
    key: 'word',
    name: 'module_word',
    title: 'Microsoft Word',
    description: 'Edition, mise en page et documents professionnels',
    price: '250 DH',
    accent: '#185ABD',
    icon: wordIc,
  },
  {
    key: 'excel',
    name: 'module_excel',
    title: 'Microsoft Excel',
    description: 'Tableaux, calculs, formules et analyse de donnees',
    price: '350 DH',
    accent: '#107C41',
    icon: excelIc,
  },
  {
    key: 'powerpoint',
    name: 'module_powerpoint',
    title: 'Microsoft PowerPoint',
    description: 'Presentations visuelles, slides et animations',
    price: '250 DH',
    accent: '#D24726',
    icon: powerpointIc,
  },
] as const;

const InscriptionBureautique: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    nom: '',
    prenom: '',
    age: '',
    niveau: 'Baccalaureat',
    email: '',
    telephone: '',
    modules: {
      word: false,
      excel: false,
      powerpoint: false,
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
    if (!Object.values(formData.modules).some(Boolean)) {
      alert('Veuillez selectionner au moins un module de formation.');
      return;
    }
    if (!formData.acceptTerms || !formData.acceptPrivacy) {
      alert('Veuillez accepter les conditions generales et la politique de confidentialite.');
      return;
    }
    console.log('Formulaire soumis :', formData);
    alert('Inscription enregistree ! Un conseiller vous contactera sous 48h.');
  };

  return (
    <>
      <Head title="Bureautique" />
      <PublicLayout>
        <main className="relative">
          <div className="geometric-bg pointer-events-none absolute inset-0 opacity-30" />

          <section className="relative mx-auto max-w-7xl px-8 pb-12 pt-16">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
              <div>
                <span className="mb-4 block text-xs font-semibold uppercase tracking-widest text-primary">
                  Formation Certifiante
                </span>
                <h1 className="mb-6 font-display text-5xl font-bold leading-tight md:text-6xl">
                  <span className="text-primary">Inscriptions :</span>{' '}
                  <span className="text-on-surface">Pole Bureautique</span>
                </h1>
                <p className="mb-8 max-w-xl text-lg leading-relaxed text-on-surface-variant">
                  Maitrisez les outils indispensables du monde professionnel. Une formation intensive de{' '}
                  <span className="font-bold text-on-surface">2 mois</span> couvrant Excel, Word et PowerPoint pour
                  transformer votre productivite.
                </p>
                <div className="mb-8 flex flex-wrap gap-6">
                  <div className="flex items-center gap-3 rounded-xl border border-outline-variant/50 bg-surface-container px-5 py-3">
                    <span className="material-symbols-outlined text-primary">schedule</span>
                    <span className="font-medium">Duree: 2 mois</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-outline-variant/50 bg-surface-container px-5 py-3">
                    <span className="material-symbols-outlined text-primary">payments</span>
                    <span className="text-lg font-bold">800 DH</span>
                  </div>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span
                      className="material-symbols-outlined mt-0.5 text-primary"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      check_circle
                    </span>
                    <div>
                      <h4 className="font-semibold">Hands-on training</h4>
                      <p className="text-sm leading-tight text-on-surface-variant">
                        Projets reels et exercices pratiques immediats.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span
                      className="material-symbols-outlined mt-0.5 text-primary"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      check_circle
                    </span>
                    <div>
                      <h4 className="font-semibold">Professional tools</h4>
                      <p className="text-sm leading-tight text-on-surface-variant">
                        Dernieres versions de la suite Microsoft Office.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="group relative">
                <div className="absolute -inset-4 rounded-[2rem] bg-primary/10 blur-2xl transition-all duration-500 group-hover:bg-primary/20" />
                <img
                  alt="Modern Professional Workspace"
                  className="hover-color-transition relative aspect-video w-full rounded-2xl border border-outline-variant/30 object-cover shadow-2xl"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGeQTJWU5lf74rdGfm5Tnl5u6PdpyjIQt_3eZcKeqARYaDMRVtvOcZdJ3nUxsHVTJwFMeaYnc9-P1utuUeOPBxaA0Ah8FnTwTZxXUEdMUp0yOoDcSrnwLW2MCsHDymv8iWMqzcDPycAT6EpjoRqX6ATJdC33yHze1NeEDwH_UdfsmG30RfIFFRjkfiJOS3wNF3tS5szyG_7IktuBbZw5fDLha6cxRvEq4jifilpiHrm2AWjwDmw5ceF02zMOu_Bjm1CfMHLX0d9Ibc"
                />
              </div>
            </div>
          </section>

          <div className="relative z-10 mx-auto max-w-7xl px-8 pb-8 pt-12 text-center">
            <div className="mb-6 inline-block h-1 w-12 bg-primary" />
            <h2 className="mb-4 font-display text-4xl font-bold text-on-surface md:text-5xl">
              Finaliser votre Inscription
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-on-surface-variant">
              Veuillez remplir le formulaire ci-dessous pour reserver votre place au sein de notre promotion de
              Bureautique Professionnelle.
            </p>
          </div>

          <section className="relative mx-auto max-w-4xl overflow-visible px-8 pb-24">
            <div className="pointer-events-none absolute left-0 top-0 -z-10 h-full w-full opacity-20">
              <div className="absolute top-10 -left-20 h-[1px] w-40 rotate-45 bg-on-surface" />
              <div className="absolute bottom-40 -right-20 h-[1px] w-60 -rotate-12 bg-primary" />
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full border border-primary" />
              <div className="absolute bottom-20 -left-16 h-24 w-24 rounded-full border border-on-surface" />
              <div className="absolute left-full top-1/2 h-8 w-8 -translate-x-1/2 rounded-full bg-primary/20" />
            </div>
            <div className="relative z-10 rounded-3xl border border-outline-variant/30 bg-surface-container-low p-8 shadow-sm md:p-12">
              <form onSubmit={handleSubmit} className="space-y-12">
                <div>
                  <div className="mb-8 flex items-center gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-on-primary">
                      1
                    </span>
                    <h3 className="font-display text-2xl font-bold">Informations Personnelles</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="ml-1 text-sm font-semibold text-on-surface-variant">Nom</label>
                      <input
                        type="text"
                        name="nom"
                        value={formData.nom}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border-outline-variant bg-surface-container-lowest px-4 py-3 transition-all focus:border-primary focus:ring-primary"
                        placeholder="Votre nom"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="ml-1 text-sm font-semibold text-on-surface-variant">Prenom</label>
                      <input
                        type="text"
                        name="prenom"
                        value={formData.prenom}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border-outline-variant bg-surface-container-lowest px-4 py-3 transition-all focus:border-primary focus:ring-primary"
                        placeholder="Votre prenom"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="ml-1 text-sm font-semibold text-on-surface-variant">Age</label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border-outline-variant bg-surface-container-lowest px-4 py-3 transition-all focus:border-primary focus:ring-primary"
                        placeholder="Ex: 20"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="ml-1 text-sm font-semibold text-on-surface-variant">Niveau Academique</label>
                      <select
                        name="niveau"
                        value={formData.niveau}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border-outline-variant bg-surface-container-lowest px-4 py-3 transition-all focus:border-primary focus:ring-primary"
                      >
                        <option>Baccalaureat</option>
                        <option>Licence</option>
                        <option>Master</option>
                        <option>Autre</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="ml-1 text-sm font-semibold text-on-surface-variant">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border-outline-variant bg-surface-container-lowest px-4 py-3 transition-all focus:border-primary focus:ring-primary"
                        placeholder="email@exemple.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="ml-1 text-sm font-semibold text-on-surface-variant">Telephone</label>
                      <input
                        type="tel"
                        name="telephone"
                        value={formData.telephone}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border-outline-variant bg-surface-container-lowest px-4 py-3 transition-all focus:border-primary focus:ring-primary"
                        placeholder="+212 600 000 000"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="mb-8 flex items-center gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-on-primary">
                      2
                    </span>
                    <h3 className="font-display text-2xl font-bold">Details de la Formation</h3>
                  </div>
                  <div className="mb-10">
                    <label className="mb-4 ml-1 block text-sm font-semibold text-on-surface-variant">
                      Selectionnez vos modules (Multi-choix possible)
                    </label>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      {MODULE_CARDS.map((module) => {
                        const checked = formData.modules[module.key];

                        return (
                          <label key={module.key} className="group relative cursor-pointer">
                            <input
                              type="checkbox"
                              name={module.name}
                              checked={checked}
                              onChange={handleInputChange}
                              className="peer sr-only"
                            />
                            <div
                              className="h-full rounded-2xl border border-outline-variant bg-white p-5 text-center transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg peer-checked:shadow-lg"
                              style={{
                                borderColor: checked ? module.accent : undefined,
                                backgroundColor: checked ? `${module.accent}12` : undefined,
                                boxShadow: checked ? `0 18px 40px -24px ${module.accent}` : undefined,
                              }}
                            >
                              <div className="mb-4 flex items-start justify-between gap-3">
                                <div
                                  className="flex h-14 w-14 items-center justify-center rounded-2xl"
                                  style={{ backgroundColor: `${module.accent}18` }}
                                >
                                  <img
                                    src={module.icon}
                                    alt={module.title}
                                    className="h-9 w-9 object-contain"
                                  />
                                </div>
                                <div
                                  className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.18em]"
                                  style={{
                                    color: module.accent,
                                    backgroundColor: `${module.accent}14`,
                                  }}
                                >
                                  {module.price}
                                </div>
                              </div>
                              <div className="text-left">
                                <p className="font-bold text-on-surface">{module.title}</p>
                                <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                                  {module.description}
                                </p>
                              </div>
                              <div className="mt-6 flex items-center justify-between">
                                <span className="text-xs font-medium uppercase tracking-[0.18em] text-on-surface-variant">
                                  {checked ? 'Selectionne' : 'Cliquer pour choisir'}
                                </span>
                                <span
                                  className="material-symbols-outlined transition-all"
                                  style={{
                                    color: checked ? module.accent : '#9ca3af',
                                    fontVariationSettings: checked ? "'FILL' 1" : "'FILL' 0",
                                  }}
                                >
                                  check_circle
                                </span>
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="ml-1 block text-sm font-semibold text-on-surface-variant">Niveau Souhaite</label>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <label className="group relative cursor-pointer">
                        <input
                          type="radio"
                          name="level"
                          value="debutant"
                          checked={formData.level === 'debutant'}
                          onChange={handleRadioChange}
                          className="peer sr-only"
                        />
                        <div className="rounded-xl border border-outline-variant p-4 text-center transition-all group-hover:border-primary/50 peer-checked:border-primary peer-checked:bg-primary-container/20">
                          <p className="font-bold">Debutant</p>
                          <p className="text-xs text-on-surface-variant">Bases et introduction</p>
                        </div>
                      </label>
                      <label className="group relative cursor-pointer">
                        <input
                          type="radio"
                          name="level"
                          value="intermediaire"
                          checked={formData.level === 'intermediaire'}
                          onChange={handleRadioChange}
                          className="peer sr-only"
                        />
                        <div className="rounded-xl border border-outline-variant p-4 text-center transition-all group-hover:border-primary/50 peer-checked:border-primary peer-checked:bg-primary-container/20">
                          <p className="font-bold">Intermediaire</p>
                          <p className="text-xs text-on-surface-variant">Fonctions avancees</p>
                        </div>
                      </label>
                      <label className="group relative cursor-pointer">
                        <input
                          type="radio"
                          name="level"
                          value="avance"
                          checked={formData.level === 'avance'}
                          onChange={handleRadioChange}
                          className="peer sr-only"
                        />
                        <div className="rounded-xl border border-outline-variant p-4 text-center transition-all group-hover:border-primary/50 peer-checked:border-primary peer-checked:bg-primary-container/20">
                          <p className="font-bold">Avance</p>
                          <p className="text-xs text-on-surface-variant">Expertise metier</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="mb-8 flex items-center gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-on-primary">
                      3
                    </span>
                    <h3 className="font-display text-2xl font-bold">Mode de Paiement</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <label className="relative cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        value="online"
                        checked={formData.payment === 'online'}
                        onChange={handleRadioChange}
                        className="peer sr-only"
                      />
                      <div className="flex items-center gap-4 rounded-2xl border border-outline-variant p-5 transition-all peer-checked:border-primary peer-checked:bg-white">
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
                      <div className="flex items-center gap-4 rounded-2xl border border-outline-variant p-5 transition-all peer-checked:border-primary peer-checked:bg-white">
                        <span className="material-symbols-outlined text-on-surface-variant peer-checked:text-primary">
                          event_available
                        </span>
                        <span className="font-medium">Rendez-vous Presentiel</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="space-y-8 border-t border-outline-variant/30 pt-8">
                  <div className="space-y-3">
                    <label className="group flex cursor-pointer items-start gap-3">
                      <input
                        type="checkbox"
                        name="acceptTerms"
                        checked={formData.acceptTerms}
                        onChange={handleInputChange}
                        className="mt-1 rounded border-outline-variant text-primary transition-all focus:ring-primary"
                      />
                      <span className="text-sm text-on-surface-variant transition-colors group-hover:text-on-surface">
                        J'accepte les Conditions Generales d'Utilisation.
                      </span>
                    </label>
                    <label className="group flex cursor-pointer items-start gap-3">
                      <input
                        type="checkbox"
                        name="acceptPrivacy"
                        checked={formData.acceptPrivacy}
                        onChange={handleInputChange}
                        className="mt-1 rounded border-outline-variant text-primary transition-all focus:ring-primary"
                      />
                      <span className="text-sm text-on-surface-variant transition-colors group-hover:text-on-surface">
                        Je consens au traitement de mes donnees personnelles selon la Politique de Confidentialite.
                      </span>
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-5 text-lg font-bold tracking-wide text-on-primary transition-all duration-300 hover:bg-on-primary-fixed-variant hover:shadow-xl hover:shadow-primary/20 active:scale-[0.98]"
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
