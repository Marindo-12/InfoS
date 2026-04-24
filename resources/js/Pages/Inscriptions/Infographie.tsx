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
  message: string;
  payment: string;
  acceptTerms: boolean;
  acceptPrivacy: boolean;
}

const InscriptionInfographie: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    nom: '',
    prenom: '',
    age: '',
    niveau: 'Baccalauréat',
    email: '',
    telephone: '',
    message: '',
    payment: 'online',
    acceptTerms: false,
    acceptPrivacy: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: target.checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, payment: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.acceptTerms || !formData.acceptPrivacy) {
      alert('Veuillez accepter les conditions générales et la politique de confidentialité.');
      return;
    }
    if (!formData.nom || !formData.prenom || !formData.age || !formData.email || !formData.telephone) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    console.log('Formulaire soumis :', formData);
    alert('Inscription enregistrée ! Un conseiller vous contactera sous 48h.');
    // Ici, vous pouvez envoyer les données vers votre backend (via Inertia ou fetch)
  };

  return (
    <>
      <Head title="Infographie" />
      <PublicLayout>
        <main className="flex-grow">
          {/* Hero / Description Section */}
          <section className="relative pt-24 pb-16 px-8 overflow-hidden">
            {/* Abstract background elements */}
            <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
              <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary to-transparent blur-3xl"></div>
            </div>
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h1 className="serif-headline text-6xl md:text-8xl text-on-surface leading-none mb-8 tracking-tighter">
                  Inscriptions : <br />
                  <span className="text-primary italic">Créativité &amp; Infographie</span>
                </h1>
                <p className="sans-body text-xl text-on-surface-variant max-w-xl mb-10 leading-relaxed">
                  Maîtrisez les outils qui définissent l'industrie visuelle moderne. Une immersion de 4 mois pour
                  transformer votre vision en réalité digitale.
                </p>
                <div className="grid grid-cols-3 gap-4 mb-12">
                  <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/40 flex flex-col items-center text-center">
                    <span className="material-symbols-outlined text-primary mb-2">brush</span>
                    <span className="sans-body font-bold text-lg">Adobe Suite</span>
                  </div>
                  <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/40 flex flex-col items-center text-center">
                    <span className="material-symbols-outlined text-primary mb-2">schedule</span>
                    <span className="sans-body font-bold text-lg">4 Mois</span>
                  </div>
                  <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/40 flex flex-col items-center text-center">
                    <span className="material-symbols-outlined text-primary mb-2">payments</span>
                    <span className="sans-body font-bold text-lg">1200 DH</span>
                  </div>
                </div>
              </div>
              <div className="relative group">
                <div className="absolute -inset-4 bg-primary/5 rounded-[2rem] blur-xl transition group-hover:bg-primary/10"></div>
                <div className="relative aspect-square overflow-hidden rounded-[2rem] shadow-2xl border border-outline-variant/30">
                  <img
                    alt="Digital design process"
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8G-jYVZmeS7NmPiHCEYldkLEhhZuUsjoObCw39FofSQAcqmWYcQJsM_5QKvfqkjd3iyIcI9pkiej_Fi-mftZm-8_nnYl4bSUulAkuhSmmBGrZyIGXTEoyp-Bu1mJIkUeOC04wPHW7Q7LUc6r2Q3F-6n6RO6bEL7uD0IPMdzduX4nS_akg_WgLvy9V4ulWZeBP58eaaUjpL0A3ItoEbn-mfwviEas3YqRedKycgRKuVp0Jg7-fvnfhJowwYeE4nVt9f7zsouBplVKG"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <div className="absolute bottom-8 left-8">
                    <div className="flex gap-4">
                      <span className="px-4 py-2 bg-surface-bright/90 backdrop-blur-md rounded-full text-sm font-bold sans-body uppercase tracking-widest text-primary">
                        Photoshop
                      </span>
                      <span className="px-4 py-2 bg-surface-bright/90 backdrop-blur-md rounded-full text-sm font-bold sans-body uppercase tracking-widest text-primary">
                        Illustrator
                      </span>
                      <span className="px-4 py-2 bg-surface-bright/90 backdrop-blur-md rounded-full text-sm font-bold sans-body uppercase tracking-widest text-primary">
                        Figma
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Form Section */}
          <section className="py-20 px-8 bg-surface-container-lowest">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="serif-headline text-4xl mb-4 text-on-surface">Votre Candidature Créative</h2>
                <p className="sans-body text-on-surface-variant">
                  Remplissez le formulaire ci-dessous pour réserver votre place dans la prochaine promotion.
                </p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-12">
                {/* Personal Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="sans-body text-sm font-semibold text-on-surface-variant px-1">Prénom</label>
                    <input
                      type="text"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 rounded-xl border border-outline-variant bg-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all sans-body"
                      placeholder="Ex: Sarah"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="sans-body text-sm font-semibold text-on-surface-variant px-1">Nom</label>
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 rounded-xl border border-outline-variant bg-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all sans-body"
                      placeholder="Ex: Mansouri"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="sans-body text-sm font-semibold text-on-surface-variant px-1">Âge</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 rounded-xl border border-outline-variant bg-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all sans-body"
                      placeholder="22"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="sans-body text-sm font-semibold text-on-surface-variant px-1">Niveau Académique</label>
                    <select
                      name="niveau"
                      value={formData.niveau}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 rounded-xl border border-outline-variant bg-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all sans-body appearance-none"
                    >
                      <option>Baccalauréat</option>
                      <option>Bac +2 / DTS</option>
                      <option>Licence</option>
                      <option>Master</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="sans-body text-sm font-semibold text-on-surface-variant px-1">E-mail</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 rounded-xl border border-outline-variant bg-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all sans-body"
                      placeholder="sarah@exemple.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="sans-body text-sm font-semibold text-on-surface-variant px-1">Téléphone</label>
                    <input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 rounded-xl border border-outline-variant bg-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all sans-body"
                      placeholder="+212 6..."
                      required
                    />
                  </div>
                </div>

                {/* Portfolio / Interest */}
                <div className="space-y-4">
                  <label className="sans-body text-sm font-semibold text-on-surface-variant px-1">
                    Niveau actuel en design &amp; aspirations (Optionnel)
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 rounded-xl border border-outline-variant bg-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all sans-body resize-none"
                    rows={4}
                    placeholder="Parlez-nous de vos projets ou de ce que vous souhaitez accomplir..."
                  />
                </div>

                {/* Payment Selection */}
                <div className="space-y-6">
                  <h3 className="sans-body font-bold text-on-surface px-1">Mode de Paiement</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="relative group cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        value="online"
                        checked={formData.payment === 'online'}
                        onChange={handleRadioChange}
                        className="peer sr-only"
                      />
                      <div className="p-6 border border-outline-variant rounded-xl flex items-center gap-4 transition-all peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-surface-container">
                        <span className="material-symbols-outlined text-secondary group-peer-checked:text-primary">
                          credit_card
                        </span>
                        <div>
                          <div className="sans-body font-bold">Paiement en ligne</div>
                          <div className="sans-body text-xs text-on-surface-variant">Sécurisé &amp; Instantané</div>
                        </div>
                      </div>
                    </label>
                    <label className="relative group cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        value="onsite"
                        checked={formData.payment === 'onsite'}
                        onChange={handleRadioChange}
                        className="peer sr-only"
                      />
                      <div className="p-6 border border-outline-variant rounded-xl flex items-center gap-4 transition-all peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-surface-container">
                        <span className="material-symbols-outlined text-secondary group-peer-checked:text-primary">
                          calendar_month
                        </span>
                        <div>
                          <div className="sans-body font-bold">Rendez-vous Présentiel</div>
                          <div className="sans-body text-xs text-on-surface-variant">Sur campus Elite Academy</div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Legal */}
                <div className="space-y-4 pt-4">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      name="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={handleInputChange}
                      className="mt-1 w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary"
                    />
                    <span className="sans-body text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">
                      J'accepte les <span className="underline decoration-primary/30">Terms &amp; Conditions</span> de Elite
                      Academy.
                    </span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      name="acceptPrivacy"
                      checked={formData.acceptPrivacy}
                      onChange={handleInputChange}
                      className="mt-1 w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary"
                    />
                    <span className="sans-body text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">
                      Je consens à la politique de confidentialité et au traitement de mes données.
                    </span>
                  </label>
                </div>

                {/* Submit */}
                <div className="pt-8 text-center">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center px-12 py-5 bg-primary text-on-primary rounded-xl sans-body font-bold text-lg hover:bg-orange-800 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20"
                  >
                    Lancer mon Parcours Créatif
                    <span className="material-symbols-outlined ml-2">arrow_forward</span>
                  </button>
                  <p className="sans-body text-xs text-on-surface-variant mt-4">
                    Places limitées. Inscription soumise à validation du dossier.
                  </p>
                </div>
              </form>
            </div>
          </section>
        </main>

        {/* Styles personnalisés */}
        <style>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .serif-headline {
          font-family: 'EB Garamond', serif;
        }
        .sans-body {
          font-family: 'Manrope', sans-serif;
        }
      `}</style>
      </PublicLayout>
    </>
  );
};

export default InscriptionInfographie;