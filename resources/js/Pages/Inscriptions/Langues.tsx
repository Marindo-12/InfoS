// resources/js/Pages/InscriptionLangues.tsx
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
  language: string;
  payment: string;
  acceptTerms: boolean;
  acceptPrivacy: boolean;
}

const InscriptionLangues: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    nom: '',
    prenom: '',
    age: '',
    niveau: 'Baccalauréat',
    email: '',
    telephone: '',
    language: 'francais',
    payment: 'online',
    acceptTerms: false,
    acceptPrivacy: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: target.checked }));
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
    // Validation simple des champs obligatoires
    if (!formData.nom || !formData.prenom || !formData.age || !formData.email || !formData.telephone) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    console.log('Formulaire soumis :', formData);
    alert('Inscription enregistrée ! Vous recevrez un email de confirmation sous 24h.');
    // Ici, vous pouvez envoyer les données vers votre backend (via Inertia ou fetch)
  };

  return (
    <>
      <Head title="Langues" />
      <PublicLayout>
        <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-16 pb-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="z-10">
              <span className="text-primary font-bold tracking-[0.2em] uppercase text-sm mb-4 block">
                Formation d'Excellence
              </span>
              <h1 className="font-display text-6xl lg:text-7xl text-on-surface leading-tight mb-6">
                Inscriptions : <br />
                <span className="italic text-primary">Pôle Langues</span>
              </h1>
              <p className="text-lg text-secondary mb-10 max-w-lg leading-relaxed">
                Maîtrisez le Français, l'Anglais ou l'Allemand avec une pédagogie immersive. Une opportunité unique
                de certifier vos compétences dans un cadre prestigieux.
              </p>
              <div className="grid grid-cols-2 gap-8 mb-12">
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-primary text-3xl">schedule</span>
                  <div>
                    <p className="font-bold text-on-surface">Durée</p>
                    <p className="text-secondary text-sm">3-6 mois flexible</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-primary text-3xl">payments</span>
                  <div>
                    <p className="font-bold text-on-surface">Prix</p>
                    <p className="text-secondary text-sm">1500 DH / Niveau</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4 border-l-2 border-primary-container pl-6">
                <div className="flex items-center gap-3">
                  <span
                    className="material-symbols-outlined text-tertiary text-xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified
                  </span>
                  <span className="text-on-surface-variant font-medium">Native teachers &amp; Expert Pedagogy</span>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className="material-symbols-outlined text-tertiary text-xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified
                  </span>
                  <span className="text-on-surface-variant font-medium">Certification internationale incluse</span>
                </div>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute -inset-4 bg-primary-container/20 rounded-xl rotate-3 transition-transform group-hover:rotate-1"></div>
              <div className="relative h-[600px] w-full overflow-hidden rounded-xl">
                <img
                  alt="Student studying in a luxury library"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpb1pZr6F79ywjJsuRb1GMNTp6vIOmXQ-o6lPwVPuhbOEExLYEv5mkNGMjBue6r7kjBAEoI64JwwlBj4xhlqXHYdnpuC2ofFWNZuWvkpx9mte141KaQ3OIVnkFn44bjp-vLpFy-m4pc94bqzo48QRJLe7-OzpYhAeK81v2c0wZ60vFyNk4TpHZDz8pCtT-Wc_LkTo6BoOyXmpe10Q1TsxJ8_K2itPhL_87k9LZJ-JXNVXUNcQZy20qG_fXDMuP7jWhtMZCYBhuW0OH"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Enrollment Header Section */}
        <section className="bg-white border-y border-outline-variant/30 py-12">
          <div className="max-w-7xl mx-auto px-8 text-center">
            <h2 className="font-display text-5xl text-on-surface mb-4">Dossier d'Inscription</h2>
            <p className="text-secondary max-w-2xl mx-auto text-lg">
              Veuillez compléter le formulaire ci-dessous pour réserver votre place. Nos conseillers pédagogiques vous
              recontacteront sous 24h pour valider votre dossier.
            </p>
            <div className="mt-6 flex justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <div className="w-12 h-2 rounded-full bg-primary-container"></div>
              <div className="w-2 h-2 rounded-full bg-primary"></div>
            </div>
          </div>
        </section>

        {/* Enrollment Form Section */}
        <section className="relative bg-surface-container-low py-24 overflow-hidden">
          {/* Geometric Background Elements */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-pattern opacity-50"></div>
            <div className="absolute top-20 right-[10%] w-[400px] h-[400px] border border-stone-300 rounded-full opacity-20"></div>
            <div className="absolute bottom-40 left-[5%] w-[300px] h-[300px] border-2 border-gold/20 rounded-full opacity-30"></div>
            <div className="absolute top-1/2 left-0 w-[50%] h-[1px] bg-gradient-to-r from-transparent via-stone-400 to-transparent opacity-10 rotate-12"></div>
            <div className="absolute top-1/3 right-0 w-[40%] h-[1px] bg-gradient-to-l from-transparent via-gold/30 to-transparent opacity-20 -rotate-6"></div>
            <div className="absolute bottom-10 right-20 w-4 h-4 rounded-full bg-gold opacity-20"></div>
            <div className="absolute top-40 left-40 w-2 h-2 rounded-full bg-black opacity-10"></div>
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-8">
            <div className="bg-white rounded-2xl p-10 lg:p-16 form-shadow border border-outline-variant/40">
              <form onSubmit={handleSubmit} className="space-y-12">
                {/* Step 1: Personal Info */}
                <div className="space-y-8">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="bg-primary text-on-primary w-8 h-8 rounded-full flex items-center justify-center font-bold">
                      1
                    </span>
                    <h3 className="font-display text-2xl">Informations Personnelles</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-on-surface-variant tracking-wider uppercase">Nom</label>
                      <input
                        type="text"
                        name="nom"
                        value={formData.nom}
                        onChange={handleInputChange}
                        className="w-full bg-surface-bright border-outline-variant rounded-lg px-4 py-3 focus:ring-primary focus:border-primary transition-all"
                        placeholder="Votre nom"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-on-surface-variant tracking-wider uppercase">Prénom</label>
                      <input
                        type="text"
                        name="prenom"
                        value={formData.prenom}
                        onChange={handleInputChange}
                        className="w-full bg-surface-bright border-outline-variant rounded-lg px-4 py-3 focus:ring-primary focus:border-primary transition-all"
                        placeholder="Votre prénom"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-on-surface-variant tracking-wider uppercase">Âge</label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        className="w-full bg-surface-bright border-outline-variant rounded-lg px-4 py-3 focus:ring-primary focus:border-primary transition-all"
                        placeholder="25"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-on-surface-variant tracking-wider uppercase">Niveau Académique</label>
                      <select
                        name="niveau"
                        value={formData.niveau}
                        onChange={handleInputChange}
                        className="w-full bg-surface-bright border-outline-variant rounded-lg px-4 py-3 focus:ring-primary focus:border-primary transition-all"
                      >
                        <option>Baccalauréat</option>
                        <option>Licence</option>
                        <option>Master</option>
                        <option>Doctorat / Autre</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-on-surface-variant tracking-wider uppercase">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full bg-surface-bright border-outline-variant rounded-lg px-4 py-3 focus:ring-primary focus:border-primary transition-all"
                        placeholder="email@exemple.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-on-surface-variant tracking-wider uppercase">Téléphone</label>
                      <input
                        type="tel"
                        name="telephone"
                        value={formData.telephone}
                        onChange={handleInputChange}
                        className="w-full bg-surface-bright border-outline-variant rounded-lg px-4 py-3 focus:ring-primary focus:border-primary transition-all"
                        placeholder="+212 600 000 000"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Step 2: Course Selection */}
                <div className="space-y-8 pt-4">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="bg-primary text-on-primary w-8 h-8 rounded-full flex items-center justify-center font-bold">
                      2
                    </span>
                    <h3 className="font-display text-2xl">Choix de la Formation</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label className="relative cursor-pointer group">
                      <input
                        type="radio"
                        name="language"
                        value="francais"
                        checked={formData.language === 'francais'}
                        onChange={handleRadioChange}
                        className="peer sr-only"
                      />
                      <div className="p-6 border-2 border-outline-variant rounded-xl group-hover:border-primary/50 peer-checked:border-primary peer-checked:bg-primary/5 transition-all h-full flex flex-col justify-center">
                        <p className="font-bold text-center">Français</p>
                        <p className="text-xs text-center text-secondary-fixed-dim mt-1">Communication &amp; DELF</p>
                      </div>
                    </label>
                    <label className="relative cursor-pointer group">
                      <input
                        type="radio"
                        name="language"
                        value="anglais"
                        checked={formData.language === 'anglais'}
                        onChange={handleRadioChange}
                        className="peer sr-only"
                      />
                      <div className="p-6 border-2 border-outline-variant rounded-xl group-hover:border-primary/50 peer-checked:border-primary peer-checked:bg-primary/5 transition-all h-full flex flex-col justify-center">
                        <p className="font-bold text-center">Anglais Business</p>
                        <p className="text-xs text-center text-secondary-fixed-dim mt-1">TOEFL &amp; Cambridge</p>
                      </div>
                    </label>
                    <label className="relative cursor-pointer group">
                      <input
                        type="radio"
                        name="language"
                        value="allemand"
                        checked={formData.language === 'allemand'}
                        onChange={handleRadioChange}
                        className="peer sr-only"
                      />
                      <div className="p-6 border-2 border-outline-variant rounded-xl group-hover:border-primary/50 peer-checked:border-primary peer-checked:bg-primary/5 transition-all h-full flex flex-col justify-center">
                        <p className="font-bold text-center">Allemand</p>
                        <p className="text-xs text-center text-secondary-fixed-dim mt-1">Niveaux A1 à C1</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Step 3: Payment Selection */}
                <div className="space-y-8 pt-4">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="bg-primary text-on-primary w-8 h-8 rounded-full flex items-center justify-center font-bold">
                      3
                    </span>
                    <h3 className="font-display text-2xl">Mode de Règlement</h3>
                  </div>
                  <div className="space-y-4">
                    <label className="flex items-center p-4 bg-surface-container rounded-xl cursor-pointer border border-transparent hover:border-outline transition-all">
                      <input
                        type="radio"
                        name="payment"
                        value="online"
                        checked={formData.payment === 'online'}
                        onChange={handleRadioChange}
                        className="w-5 h-5 text-primary border-outline-variant focus:ring-primary"
                      />
                      <div className="ml-4 flex-grow flex justify-between items-center">
                        <div>
                          <p className="font-bold text-on-surface">Paiement en ligne</p>
                          <p className="text-sm text-on-surface-variant">Stripe / Carte Bancaire (Sécurisé)</p>
                        </div>
                        <span className="material-symbols-outlined text-on-surface-variant">credit_card</span>
                      </div>
                    </label>
                    <label className="flex items-center p-4 bg-surface-container rounded-xl cursor-pointer border border-transparent hover:border-outline transition-all">
                      <input
                        type="radio"
                        name="payment"
                        value="onsite"
                        checked={formData.payment === 'onsite'}
                        onChange={handleRadioChange}
                        className="w-5 h-5 text-primary border-outline-variant focus:ring-primary"
                      />
                      <div className="ml-4 flex-grow flex justify-between items-center">
                        <div>
                          <p className="font-bold text-on-surface">Rendez-vous Présentiel</p>
                          <p className="text-sm text-on-surface-variant">Espèces ou Chèque au centre Elite</p>
                        </div>
                        <span className="material-symbols-outlined text-on-surface-variant">stadium</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Legal */}
                <div className="space-y-4 pt-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={handleInputChange}
                      className="mt-1 rounded text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-on-surface-variant">
                      J'accepte les{' '}
                      <a className="text-primary hover:underline" href="#">
                        Conditions Générales d'Utilisation
                      </a>{' '}
                      d'Elite Academy.
                    </span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="acceptPrivacy"
                      checked={formData.acceptPrivacy}
                      onChange={handleInputChange}
                      className="mt-1 rounded text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-on-surface-variant">
                      Je consens au traitement de mes données personnelles conformément à la politique de confidentialité.
                    </span>
                  </label>
                </div>

                {/* Submit */}
                <div className="pt-8 text-center">
                  <button
                    type="submit"
                    className="glow-hover w-full md:w-auto px-12 py-5 bg-primary text-on-primary rounded-xl font-bold text-lg transition-all duration-300 transform active:scale-95 shadow-lg"
                  >
                    Finaliser l'Inscription
                  </button>
                  <p className="mt-4 text-xs text-on-surface-variant uppercase tracking-widest font-semibold">
                    Confirmation immédiate par e-mail
                  </p>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Styles personnalisés */}
      <style>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .form-shadow {
          box-shadow: 0 2px 24px rgba(58, 48, 42, 0.08);
        }
        .glow-hover:hover {
          box-shadow: 0 0 20px rgba(194, 101, 42, 0.3);
        }
        .bg-pattern {
          background-image: radial-gradient(circle at 2px 2px, rgba(194, 101, 42, 0.05) 1px, transparent 0);
          background-size: 40px 40px;
        }
      `}</style>
      </PublicLayout>
    </>
  );
};

export default InscriptionLangues;