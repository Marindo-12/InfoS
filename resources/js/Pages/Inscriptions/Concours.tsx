// resources/js/Pages/InscriptionConcours.tsx
import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

const InscriptionConcours: React.FC = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    age: '',
    niveau: '2ème Année Baccalauréat',
    email: '',
    telephone: '',
    concours: 'Préparation Médecine (FMD/FMP)',
    paymentMethod: '',
    acceptTerms: false,
    acceptPrivacy: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: target.checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.acceptTerms || !formData.acceptPrivacy) {
      alert('Veuillez accepter les conditions générales et la politique de confidentialité.');
      return;
    }
    console.log('Formulaire soumis :', formData);
    alert('Inscription enregistrée ! Nous vous contacterons sous 48h.');
  };

  return (
    <>
      <Head title="Inscription aux concours" />
      <PublicLayout>
        <main className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <span className="inline-block px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed-variant rounded-full text-xs font-bold uppercase tracking-widest mb-6">
              Inscriptions Ouvertes
            </span>
            <h1 className="font-headline text-5xl md:text-7xl text-on-surface serif-tight leading-[1.1] mb-8">
              Inscriptions : <br />
              <span className="text-primary italic">Concours d'Excellence</span>
            </h1>
            <p className="text-on-secondary-container text-lg md:text-xl font-light leading-relaxed mb-10 max-w-xl">
              Préparez votre avenir avec l'élite. Nos programmes spécialisés pour Médecine, ENCG et
              ENSA sont conçus pour transformer votre ambition en réussite concrète.
            </p>
            <div className="flex items-center gap-6 mb-12">
              <div className="flex flex-col">
                <span className="font-headline text-4xl font-bold text-primary">94%</span>
                <span className="text-sm font-label uppercase tracking-tighter text-outline">
                  Taux de Réussite
                </span>
              </div>
              <div className="h-12 w-[1px] bg-outline-variant"></div>
              <div className="flex flex-col">
                <span className="font-headline text-4xl font-bold text-on-surface tracking-tight">
                  {new Date().getFullYear()}
                </span>
                <span className="text-sm font-label uppercase tracking-tighter text-outline">
                  Promotion Actuelle
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-6 bg-surface-container-low border border-outline-variant/30 rounded-xl">
                <p className="text-sm text-outline font-label mb-1">Médecine</p>
                <p className="font-headline text-2xl font-semibold">1000 DH</p>
              </div>
              <div className="p-6 bg-surface-container-low border border-outline-variant/30 rounded-xl">
                <p className="text-sm text-outline font-label mb-1">ENCG</p>
                <p className="font-headline text-2xl font-semibold">600 DH</p>
              </div>
              <div className="p-6 bg-surface-container-low border border-outline-variant/30 rounded-xl">
                <p className="text-sm text-outline font-label mb-1">ENSA</p>
                <p className="font-headline text-2xl font-semibold">500 DH</p>
              </div>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-4 bg-primary/5 rounded-2xl blur-3xl group-hover:bg-primary/10 transition-all"></div>
            <img
              alt="Group of diverse focused students studying together in a brightly lit modern library with warm sunbeams and wood textures"
              className="relative rounded-2xl shadow-2xl w-full aspect-[4/5] object-cover border border-white/20"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBB3ECRI4li5jd1PtEYTRLeI3RmLizSfZEXYfkS6vVODxHskqKtBKrcXFCfLgIZpAXwuxwakur-i_dg1vhYsaKIla256OxVlS8t8qxWRK02iH3OGSrefrvHRUMzCpdIcBUYBAdngraJFtEsjtBHJnZ4gF5S7nBBuHxarOJyKq4gWt9rWnJq5JhH3ia1Uv-zpdWt1hy-Gd7YJDGVh7s-Rt0S49g9CcDbodJxd8y8nDGnjarm2zcZcFW4ZOH-N1epejrQm-F-uzlEMi16"
            />
            <div className="absolute bottom-8 -left-8 bg-surface-bright p-6 rounded-xl shadow-xl max-w-[200px] border border-outline-variant/40 hidden md:block">
              <span
                className="material-symbols-outlined text-primary mb-2"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                workspace_premium
              </span>
              <p className="text-sm font-medium italic">
                "L'excellence est une habitude, pas un acte."
              </p>
            </div>
          </div>
        </section>

        {/* Separator Header */}
        <div className="mb-16 text-center">
          <h2 className="font-headline text-4xl md:text-5xl text-on-surface mb-4">
            Formulaire de Candidature
          </h2>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-[1px] w-12 bg-primary/40"></div>
            <p className="text-on-secondary-container font-label uppercase tracking-[0.2em] text-sm">
              Étape décisive vers votre réussite
            </p>
            <div className="h-[1px] w-12 bg-primary/40"></div>
          </div>
          <p className="max-w-2xl mx-auto text-on-surface-variant font-light text-lg">
            Veuillez remplir les informations ci-dessous avec précision. Notre équipe examinera votre
            profil pour garantir une admission adaptée à vos objectifs d'excellence.
          </p>
        </div>

        {/* Form & Content Grid */}
        <div className="flex flex-col lg:flex-row gap-12 relative">
          {/* Form Section with Geometric Elements */}
          <section className="lg:w-2/3 bg-surface-container-lowest rounded-3xl p-8 md:p-12 shadow-sm border border-outline-variant/20 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none geometric-bg opacity-40"></div>
            <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
              {/* Informations Personnelles */}
              <div>
                <h2 className="font-headline text-3xl mb-8 flex items-center gap-3">
                  <span className="w-8 h-[1px] bg-primary"></span>
                  Informations Personnelles
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-label font-semibold text-on-surface-variant uppercase tracking-wider">
                      Nom
                    </label>
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      className="w-full bg-surface-bright/80 backdrop-blur-sm border-outline-variant/60 rounded-lg px-4 py-3 focus:ring-primary focus:border-primary transition-all"
                      placeholder="Entrez votre nom"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-label font-semibold text-on-surface-variant uppercase tracking-wider">
                      Prénom
                    </label>
                    <input
                      type="text"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleChange}
                      className="w-full bg-surface-bright/80 backdrop-blur-sm border-outline-variant/60 rounded-lg px-4 py-3 focus:ring-primary focus:border-primary transition-all"
                      placeholder="Entrez votre prénom"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-label font-semibold text-on-surface-variant uppercase tracking-wider">
                      Âge
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      className="w-full bg-surface-bright/80 backdrop-blur-sm border-outline-variant/60 rounded-lg px-4 py-3 focus:ring-primary focus:border-primary transition-all"
                      placeholder="Ex: 18"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-label font-semibold text-on-surface-variant uppercase tracking-wider">
                      Niveau Académique
                    </label>
                    <select
                      name="niveau"
                      value={formData.niveau}
                      onChange={handleChange}
                      className="w-full bg-surface-bright/80 backdrop-blur-sm border-outline-variant/60 rounded-lg px-4 py-3 focus:ring-primary focus:border-primary transition-all"
                    >
                      <option>2ème Année Baccalauréat</option>
                      <option>Baccalauréat obtenu</option>
                      <option>Bac +1 / Classes Prépas</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-label font-semibold text-on-surface-variant uppercase tracking-wider">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-surface-bright/80 backdrop-blur-sm border-outline-variant/60 rounded-lg px-4 py-3 focus:ring-primary focus:border-primary transition-all"
                      placeholder="votre@email.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-label font-semibold text-on-surface-variant uppercase tracking-wider">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleChange}
                      className="w-full bg-surface-bright/80 backdrop-blur-sm border-outline-variant/60 rounded-lg px-4 py-3 focus:ring-primary focus:border-primary transition-all"
                      placeholder="+212 6..."
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Concours Visé */}
              <div>
                <h2 className="font-headline text-3xl mb-8 flex items-center gap-3">
                  <span className="w-8 h-[1px] bg-primary"></span>
                  Concours Visé
                </h2>
                <div className="space-y-2">
                  <label className="text-sm font-label font-semibold text-on-surface-variant uppercase tracking-wider">
                    Sélectionnez votre parcours
                  </label>
                  <select
                    name="concours"
                    value={formData.concours}
                    onChange={handleChange}
                    className="w-full bg-surface-bright/80 backdrop-blur-sm border-outline-variant/60 rounded-lg px-4 py-4 text-lg font-headline focus:ring-primary focus:border-primary transition-all appearance-none"
                  >
                    <option>Préparation Médecine (FMD/FMP)</option>
                    <option>Préparation ENCG (Tafem)</option>
                    <option>Préparation ENSA/ENSAM</option>
                    <option>Pack Excellence (Multi-concours)</option>
                  </select>
                </div>
              </div>

              {/* Mode de Règlement */}
              <div>
                <h2 className="font-headline text-3xl mb-8 flex items-center gap-3">
                  <span className="w-8 h-[1px] bg-primary"></span>
                  Mode de Règlement
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label
                    className={`relative flex items-center p-6 border-2 rounded-xl cursor-pointer transition-all bg-surface-bright/50 backdrop-blur-sm ${
                      formData.paymentMethod === 'online'
                        ? 'border-primary bg-primary/5'
                        : 'border-outline-variant/40 hover:border-primary/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      checked={formData.paymentMethod === 'online'}
                      onChange={handleChange}
                      className="hidden peer"
                    />
                    <div className="flex items-center gap-4">
                      <span className="material-symbols-outlined text-primary text-3xl">payments</span>
                      <div>
                        <p className="font-bold">Paiement en ligne</p>
                        <p className="text-xs text-outline">Visa, Mastercard, CMI</p>
                      </div>
                    </div>
                  </label>
                  <label
                    className={`relative flex items-center p-6 border-2 rounded-xl cursor-pointer transition-all bg-surface-bright/50 backdrop-blur-sm ${
                      formData.paymentMethod === 'onsite'
                        ? 'border-primary bg-primary/5'
                        : 'border-outline-variant/40 hover:border-primary/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="onsite"
                      checked={formData.paymentMethod === 'onsite'}
                      onChange={handleChange}
                      className="hidden peer"
                    />
                    <div className="flex items-center gap-4">
                      <span className="material-symbols-outlined text-primary text-3xl">meeting_room</span>
                      <div>
                        <p className="font-bold">Rendez-vous Présentiel</p>
                        <p className="text-xs text-outline">Au campus de l'académie</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-4 pt-6">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    className="mt-1 rounded border-outline-variant text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-on-surface-variant font-label leading-relaxed group-hover:text-on-surface transition-colors">
                    J'accepte les Conditions Générales de Vente et le règlement intérieur de l'Elite
                    Academy.
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="acceptPrivacy"
                    checked={formData.acceptPrivacy}
                    onChange={handleChange}
                    className="mt-1 rounded border-outline-variant text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-on-surface-variant font-label leading-relaxed group-hover:text-on-surface transition-colors">
                    Je consens au traitement de mes données personnelles conformément à la politique de
                    confidentialité.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-on-primary py-5 rounded-xl font-headline text-2xl font-bold tracking-wide shadow-lg hover:bg-orange-800 active:scale-[0.98] transition-all flex items-center justify-center gap-4"
              >
                S'inscrire au Concours
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </form>
          </section>

          {/* Sidebar Info */}
          <aside className="lg:w-1/3 space-y-8">
            <div className="bg-surface-container p-8 rounded-3xl border border-outline-variant/20">
              <h3 className="font-headline text-2xl mb-6">Pourquoi nous choisir ?</h3>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <span className="material-symbols-outlined text-primary shrink-0">
                    verified_user
                  </span>
                  <div>
                    <p className="font-bold text-sm uppercase font-label">Corps Professeur</p>
                    <p className="text-on-surface-variant text-sm">
                      Docteurs et ingénieurs issus des meilleures écoles nationales.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="material-symbols-outlined text-primary shrink-0">menu_book</span>
                  <div>
                    <p className="font-bold text-sm uppercase font-label">Supports Exclusifs</p>
                    <p className="text-on-surface-variant text-sm">
                      Polycopiés mis à jour avec les annales des 10 dernières années.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="material-symbols-outlined text-primary shrink-0">timer</span>
                  <div>
                    <p className="font-bold text-sm uppercase font-label">Simulations</p>
                    <p className="text-on-surface-variant text-sm">
                      Concours blancs hebdomadaires dans des conditions réelles.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="relative overflow-hidden rounded-3xl h-64 flex items-end p-8 group">
              <img
                alt="Blurred background of a majestic university building at dusk with soft golden interior lighting through large windows"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfj7oUGmcnBKrBnK3FTnb-QbGPhRQ0kA7iokXHxb5DJN6b8eavmdDNJrL1NEVZXfy-7fMhM2yT-TSGYVz1eashS_mSPB5yxv7QXey2QquggBWbhWOG-lGn2ZPP5zpgaPCiLVVxu-VyiDuOrxn-RogGyQfA14qo3ehQhu1MYEBz5Y3GAuoJxswpE8Q5Q_ddG0huSR3r21I7mWl_uGByeOJ6NHOLpbLQCXHn3uXYfNbKWu5wUc2MKfKh2Op0PI-H389yQeWziDhq2_Du"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent opacity-80"></div>
              <div className="relative text-white">
                <p className="font-headline text-2xl">Rejoignez nos alumni</p>
                <p className="text-stone-300 text-sm">Plus de 5000 étudiants formés.</p>
              </div>
            </div>

            <div className="p-8 border-2 border-dashed border-outline-variant/60 rounded-3xl flex flex-col items-center text-center">
              <span className="material-symbols-outlined text-outline text-4xl mb-4">
                support_agent
              </span>
              <h4 className="font-label font-bold uppercase tracking-widest text-xs mb-2">
                Besoin d'aide ?
              </h4>
              <p className="text-on-surface-variant text-sm mb-6">
                Nos conseillers académiques sont disponibles de 9h à 18h.
              </p>
              <a className="text-primary font-bold text-lg" href="tel:+212500000000">
                +212 522 00 00 00
              </a>
            </div>
          </aside>
        </div>
      </main>
      </PublicLayout>
      <style>{`
        .geometric-bg {
          background-image: 
            radial-gradient(circle at 10% 20%, rgba(194, 101, 42, 0.05) 0%, transparent 8%),
            radial-gradient(circle at 90% 80%, rgba(58, 48, 42, 0.03) 0%, transparent 10%),
            linear-gradient(45deg, transparent 48%, rgba(194, 101, 42, 0.05) 49%, rgba(194, 101, 42, 0.05) 51%, transparent 52%),
            linear-gradient(-45deg, transparent 48%, rgba(58, 48, 42, 0.03) 49%, rgba(58, 48, 42, 0.03) 51%, transparent 52%);
          background-size: 100% 100%, 100% 100%, 400px 400px, 600px 600px;
        }
        .serif-tight {
          letter-spacing: -0.02em;
        }
      `}</style>
    </>
  );
};

export default InscriptionConcours;