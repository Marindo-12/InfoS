import Footer from '@/Components/Footer';
import Navbar from '@/Components/Navbar';
import { Head } from '@inertiajs/react';
import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Données d'exemple (à remplacer par vos vraies données)
const successRateData = [
  { year: '2020', rate: 82 },
  { year: '2021', rate: 86 },
  { year: '2022', rate: 89 },
  { year: '2023', rate: 92 },
  { year: '2024', rate: 94 },
];

const laureatesByField = [
  { name: 'Médecine', value: 180 },
  { name: 'ENCG/ISCAE', value: 250 },
  { name: 'ENSA/ENSAM', value: 120 },
  { name: 'Langues', value: 80 },
];

const COLORS = ['#c2652a', '#e08850', '#f0a878', '#d8d0c8'];

const Formations = () => {
  return (
    <>
      <Head title='Formations' />
      <Navbar />
      <main className="">
        {/* Hero Section */}
        <section className="relative min-h-[614px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              className="w-full h-full object-cover opacity-20"
              alt="Elegant library interior with warm sunlight streaming through large windows, dust motes dancing in the air, old books and comfortable leather chairs."
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBfJq3Z5JscUbCCfOT43VNBHOspNIfXPqHBYvr24VqMgbQ1p7_vP2zXFQezpljXwTon6v9grwc7wHARjWBZ8Fi1dYuYTOUHmI_iMThBa6tXBzq3c_9kydt2gNm1Ra-Gn-djszgADqSTU6jw-M7CQi5msgPmAy6VDZasToDcCLjAdqWf8no5xgU6CeIO2WS7bLbZE3VfQpZf5zTCFkywXgPFtsPCKyDSg7ZJUrjrR95SStOY_OeaFnQxdSmnAeQPTWi4XOYokyh6Foss"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/60 to-background"></div>
          </div>
          <div className="relative z-10 text-center px-6 max-w-4xl">
            <span className="text-primary tracking-[0.2em] font-medium text-sm uppercase mb-4 block">
              Excellence Académique
            </span>
            <h1 className="text-6xl md:text-8xl font-serif text-on-background leading-tight mb-6">
              Nos Formations d'Excellence
            </h1>
            <p className="text-lg md:text-xl text-secondary max-w-2xl mx-auto font-light leading-relaxed">
              Découvrez une approche pédagogique raffinée, alliant rigueur académique et développement
              des compétences modernes au cœur du désert doré.
            </p>
            <div className="mt-12 flex justify-center gap-6">
              <span className="material-symbols-outlined text-primary text-4xl animate-bounce">
                expand_more
              </span>
            </div>
          </div>
        </section>

        {/* Languages Section */}
        <section className="py-32 px-8 max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-5xl font-serif text-on-background mb-6">L'Art des Langues</h2>
            <div className="golden-line w-48 mx-auto mb-6"></div>
            <p className="text-secondary font-light text-xl italic">
              Maîtrisez les codes de la communication mondiale avec élégance.
            </p>
          </div>
          <div className="space-y-32">
            {/* French */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div className="order-2 md:order-1">
                <div className="flex items-center gap-4 mb-6">
                  <span className="material-symbols-outlined text-4xl text-primary">translate</span>
                  <h3 className="text-3xl font-serif">Français Classique &amp; Éloquence</h3>
                </div>
                <p className="text-secondary mb-8 leading-relaxed font-light text-lg">
                  Bien plus qu'une simple grammaire, nous enseignons la langue de Molière comme un
                  instrument de distinction sociale et professionnelle.
                </p>
                <ul className="space-y-4 text-sm text-on-background/80 mb-10 font-light">
                  <li className="flex items-center gap-3">
                    <span className="w-6 h-[1px] bg-primary"></span> Orthographe et syntaxe
                    irréprochables
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-6 h-[1px] bg-primary"></span> Techniques de prise de parole en
                    public
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-6 h-[1px] bg-primary"></span> Rédaction de rapports et mémoires
                  </li>
                </ul>
                <a
                  className="text-primary text-xs font-bold tracking-widest uppercase flex items-center gap-2 border-b border-primary/20 w-max pb-2 hover:border-primary transition-all"
                  href="#"
                >
                  Explorez le syllabus <span className="material-symbols-outlined text-sm">north_east</span>
                </a>
              </div>
              <div className="order-1 md:order-2 bg-surface-container-low aspect-video rounded-2xl overflow-hidden relative group">
                <img
                  alt="French calligraphy"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCuKNmP2_EEJs_aWo1aMmAYFmjsla6WvbL-m6CQR9AK4qPHCHne7dL9QVFzDmT-HEIHYags8bnmp5XxLRiKfWiMMB8iq_lVfzYDNPf1hRUiQ60h6036NNIfNMFxaPPf7aXUgwEo_NrMZa9BBlw7LT488bxlY9dHyUJEfwIQxePJhPpopPYQH40ht8mGU5bJl881bd9btGBtGxnOHpuPKr8tXlRw_dxcxnVRCFtMBLFYc54Oo3gEcpbLqWjO6yMDmrjN4S9554mcNEKR"
                />
                <div className="absolute inset-0 border-[1rem] border-background/20 pointer-events-none"></div>
              </div>
            </div>
            {/* English */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div className="bg-surface-container-low aspect-video rounded-2xl overflow-hidden relative group">
                <img
                  alt="English business meeting"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnhFJnMTAH9r84qZyV7ddX_FOeCTa-ih_KHDPjukDGI5A8K4vqCjLVDnWxIrySO2v5i2TO5Aydw1k5rvIAo6IjyT4GYce9QMUb9VMVOKRW2tuxDfO3XPeTxsyO6iDeG2MV7bSvIxgwO7xY2L5WSolcS_SqeRwHDGjgkOrP6Crffc4yN4tmJXZcMRHs7-8d7bIcxDDQK_2I4-ah3dELB2U1b8_m6WtCobS0jegs_b5mWEKvOQ0Q19iz8wUGjSosAKBK4aPnl6jwwcEJ"
                />
                <div className="absolute inset-0 border-[1rem] border-background/20 pointer-events-none"></div>
              </div>
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <span className="material-symbols-outlined text-4xl text-primary">public</span>
                  <h3 className="text-3xl font-serif">Anglais des Affaires (International)</h3>
                </div>
                <p className="text-secondary mb-8 leading-relaxed font-light text-lg">
                  Préparez-vous à conquérir les marchés mondiaux avec une maîtrise parfaite de l'anglais
                  professionnel et technique.
                </p>
                <ul className="space-y-4 text-sm text-on-background/80 mb-10 font-light">
                  <li className="flex items-center gap-3">
                    <span className="w-6 h-[1px] bg-primary"></span> Négociation et communication
                    stratégique
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-6 h-[1px] bg-primary"></span> Préparation intensive aux tests
                    TOEFL/IELTS
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-6 h-[1px] bg-primary"></span> Immersion culturelle anglo-saxonne
                  </li>
                </ul>
                <a
                  className="text-primary text-xs font-bold tracking-widest uppercase flex items-center gap-2 border-b border-primary/20 w-max pb-2 hover:border-primary transition-all"
                  href="#"
                >
                  Explorez le syllabus <span className="material-symbols-outlined text-sm">north_east</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Preparations for Concours */}
        <section className="py-24 bg-surface-container-lowest border-y border-outline-variant">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <h2 className="text-4xl font-serif text-on-background mb-4">
                  Préparation aux Concours
                </h2>
                <p className="text-secondary font-light max-w-xl">
                  Nos programmes spécialisés pour intégrer les plus grandes institutions avec sérénité.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-on-primary-fixed-variant font-semibold italic text-sm">
                  Sélection Rigoureuse
                </span>
                <div className="w-12 h-[1px] bg-primary"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Medicine Card */}
              <div className="bg-surface-container-low p-8 rounded-2xl border border-outline-variant flex flex-col justify-between group hover:border-primary transition-colors">
                <div>
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm text-primary">
                    <span className="material-symbols-outlined text-3xl">medical_services</span>
                  </div>
                  <span className="text-primary font-bold text-[10px] tracking-widest uppercase mb-4 block">
                    National
                  </span>
                  <h4 className="text-xl font-serif mb-6">Médecine</h4>
                  <ul className="space-y-2 mb-8 text-sm text-secondary font-light">
                    <li className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-primary rounded-full"></span> Coaching intensif
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-primary rounded-full"></span> Examens blancs
                    </li>
                  </ul>
                </div>
                <div className="pt-6 border-t border-outline-variant/30 flex items-center justify-between">
                  <span className="font-serif text-lg text-on-background">1000 dh</span>
                  <button className="text-primary font-bold text-xs uppercase underline">Réserver</button>
                </div>
              </div>
              {/* ENCG Card */}
              <div className="bg-primary text-on-primary p-8 rounded-2xl flex flex-col justify-between shadow-xl shadow-primary/20 scale-105 z-10 relative">
                <div>
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6 text-white">
                    <span className="material-symbols-outlined text-3xl">corporate_fare</span>
                  </div>
                  <span className="text-white/60 font-bold text-[10px] tracking-widest uppercase mb-4 block">
                    Élite
                  </span>
                  <h4 className="text-xl font-serif mb-6">ENCG / ISCAE</h4>
                  <p className="text-white/80 text-sm font-light mb-8 leading-relaxed">
                    Préparation complète au TAFEM et coaching en culture générale pour les futurs
                    managers.
                  </p>
                </div>
                <div className="pt-6 border-t border-white/20 flex items-center justify-between">
                  <span className="font-serif text-lg">600 dh</span>
                  <button className="bg-white text-primary px-4 py-1.5 rounded-full font-bold text-[10px] uppercase">
                    Réserver
                  </button>
                </div>
              </div>
              {/* ENSA Card */}
              <div className="bg-surface-container-low p-8 rounded-2xl border border-outline-variant flex flex-col justify-between group hover:border-primary transition-colors">
                <div>
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm text-primary">
                    <span className="material-symbols-outlined text-3xl">precision_manufacturing</span>
                  </div>
                  <span className="text-primary font-bold text-[10px] tracking-widest uppercase mb-4 block">
                    Ingénierie
                  </span>
                  <h4 className="text-xl font-serif mb-6">ENSA / ENSAM</h4>
                  <ul className="space-y-2 mb-8 text-sm text-secondary font-light">
                    <li className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-primary rounded-full"></span> Mathématiques
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-primary rounded-full"></span> Physique &amp; Chimie
                    </li>
                  </ul>
                </div>
                <div className="pt-6 border-t border-outline-variant/30 flex items-center justify-between">
                  <span className="font-serif text-lg text-on-background">500 dh</span>
                  <button className="text-primary font-bold text-xs uppercase underline">Réserver</button>
                </div>
              </div>
              {/* Consultation Card */}
              <div className="bg-surface-container-highest p-8 rounded-2xl border border-dashed border-outline flex flex-col justify-center items-center text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 text-primary">
                  <span className="material-symbols-outlined text-4xl">flight_takeoff</span>
                </div>
                <h4 className="text-xl font-serif mb-3">Études à l'Étranger</h4>
                <p className="text-secondary text-sm font-light mb-6">
                  Dossier Campus &amp; Orientation internationale
                </p>
                <button className="w-full py-3 bg-on-background text-surface rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity">
                  Consulter
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Packs Section */}
        <section className="py-24 px-8 max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-5xl font-serif text-on-background mb-2">Packs Privilèges</h2>
            <div className="w-32 h-[2px] bg-primary"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Pack 1 */}
            <div className="relative group h-[500px] rounded-[2rem] overflow-hidden">
              <img
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXcTLB4GKztLtdd9vvIf4IpKM8Ac6ZuLXnY4s_blZGg_-46hO8QbtnWctgYPC_CRyNCglg7TTBdsWLcVDJ3bSs4RHmZ8TsIJVywvID1qZH6mXOXPIjOPjEycz2_i4eS0dzcXY_dOOvsmTA5f4W4rOk5zLn-iO3tFmo53QLRVl3rfxEVlPsksi5KQIIGsN7S20HWhL0ehnL_1B9UFTqcNJ5IvohAzPAbNmD4ZCfBMD7Z-X1jcZTUqzA7xoX5xa-rbfQ9L71IAQxOU76"
                alt="Pack Succès"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500"></div>
              <div className="absolute inset-0 p-12 flex flex-col justify-end text-white">
                <div className="mb-4 text-xs font-bold tracking-[0.3em] uppercase">Best-Seller</div>
                <h3 className="text-4xl font-serif mb-4">Pack Succès</h3>
                <p className="text-white/80 font-light mb-8 max-w-sm">
                  Langues (FR/EN) + Préparation Concours + Coaching d'orientation.
                </p>
                <div className="flex items-center gap-6">
                  <span className="text-3xl font-serif">1500 dh</span>
                  <button className="bg-primary hover:bg-white hover:text-primary text-white px-8 py-3 rounded-full font-bold transition-all duration-300">
                    S'abonner
                  </button>
                </div>
              </div>
            </div>
            {/* Pack 2 */}
            <div className="relative group h-[500px] rounded-[2rem] overflow-hidden">
              <img
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSVLXcgED2AKE9fZis11S6myGYhfO7inB006bWYVwccCoJm1TQP22qiufEki91PH_y6_TytYgN4P_AWlslm-My3nO1Yp20C96wNwJXCv7XiIxYKMWuUka4Ge2W0dTcnZo_K9pTyUzRs9h5DmGv38RNJeQVBKbC4GDJ_sy9SaUKF3VsJ_X4m24pc9b6fW1FlqthQDWwhfezofNUByjvwRMeS4WV89hJm-UntyPYKhcnflX56044kUeBgOldob0TOHfHd0s-I1M5aXeG"
                alt="Pack Pro"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500"></div>
              <div className="absolute inset-0 p-12 flex flex-col justify-end text-white text-right items-end">
                <div className="mb-4 text-xs font-bold tracking-[0.3em] uppercase">Digital Ready</div>
                <h3 className="text-4xl font-serif mb-4">Pack Pro</h3>
                <p className="text-white/80 font-light mb-8 max-w-sm">
                  Bureautique Expert + Adobe Photoshop + Anglais Business.
                </p>
                <div className="flex items-center gap-6">
                  <button className="border-2 border-white hover:bg-white hover:text-on-background px-8 py-3 rounded-full font-bold transition-all duration-300">
                    S'abonner
                  </button>
                  <span className="text-3xl font-serif">1800 dh</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Office & Design */}
        <section className="py-24 bg-surface-container-low overflow-hidden">
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              <div className="lg:col-span-1">
                <h2 className="text-4xl font-serif text-on-background mb-6">Bureautique &amp; Design</h2>
                <p className="text-secondary font-light leading-relaxed mb-8">
                  Des compétences fondamentales pour naviguer avec aisance dans l'écosystème
                  professionnel moderne.
                </p>
                <div className="p-8 bg-white border border-outline-variant rounded-2xl">
                  <span className="material-symbols-outlined text-primary text-5xl mb-4">
                    verified_user
                  </span>
                  <h4 className="font-serif text-xl mb-2">Certification Incluse</h4>
                  <p className="text-xs text-secondary leading-relaxed">
                    Validez vos acquis avec une attestation de formation reconnue par nos partenaires.
                  </p>
                </div>
              </div>
              <div className="lg:col-span-2 space-y-4">
                {/* Pack Office Expert */}
                <div className="group bg-white p-6 rounded-2xl border border-outline-variant flex items-center justify-between hover:border-primary transition-colors cursor-pointer">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                      <span className="material-symbols-outlined">grid_view</span>
                    </div>
                    <div>
                      <h4 className="font-serif text-xl">Pack Office Expert</h4>
                      <p className="text-secondary text-xs font-light">Excel VBA, Word, PowerPoint</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary">800 dh</div>
                    <div className="text-[10px] text-secondary uppercase font-bold tracking-widest">
                      Voir Syllabus
                    </div>
                  </div>
                </div>
                {/* Design Graphique */}
                <div className="group bg-white p-6 rounded-2xl border border-outline-variant flex items-center justify-between hover:border-primary transition-colors cursor-pointer">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center text-red-600">
                      <span className="material-symbols-outlined">brush</span>
                    </div>
                    <div>
                      <h4 className="font-serif text-xl">Design Graphique</h4>
                      <p className="text-secondary text-xs font-light">Photoshop, Illustrator, Branding</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary">1200 dh</div>
                    <div className="text-[10px] text-secondary uppercase font-bold tracking-widest">
                      Voir Syllabus
                    </div>
                  </div>
                </div>
                {/* Web Design & UX */}
                <div className="group bg-white p-6 rounded-2xl border border-outline-variant flex items-center justify-between hover:border-primary transition-colors cursor-pointer">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined">devices</span>
                    </div>
                    <div>
                      <h4 className="font-serif text-xl">Web Design &amp; UX</h4>
                      <p className="text-secondary text-xs font-light">Figma, HTML/CSS, UI Design</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary">1500 dh</div>
                    <div className="text-[10px] text-secondary uppercase font-bold tracking-widest">
                      Voir Syllabus
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Success Rate Section */}
        <section className="py-16 bg-white/50 border-y border-outline-variant/30">
      <div className="max-w-7xl mx-auto px-8">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif text-on-background mb-2">
            Une Réussite Mesurée, Gravée dans le Temps
          </h2>
          <p className="text-secondary font-light max-w-2xl mx-auto">
            Notre engagement envers l'excellence se traduit par des résultats tangibles.
            Découvrez nos indicateurs de performance.
          </p>
        </div>

        {/* Première ligne : indicateurs clés + graphique d'évolution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Indicateurs clés (style original amélioré) */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-surface-container flex items-center justify-center relative">
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle
                    className="text-primary"
                    cx="64"
                    cy="64"
                    fill="transparent"
                    r="58"
                    stroke="currentColor"
                    strokeDasharray="364"
                    strokeDashoffset="21.8"
                    strokeWidth="4"
                  />
                </svg>
                <span className="text-3xl font-serif text-primary font-bold">94%</span>
              </div>
              <div className="mt-4 text-center">
                <div className="text-sm font-bold tracking-wide text-secondary">Taux de réussite global</div>
              </div>
            </div>

            <div className="flex gap-8">
              <div className="text-center">
                <div className="text-3xl font-serif text-primary">500+</div>
                <div className="text-[10px] uppercase tracking-widest font-bold text-secondary">
                  Lauréats
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-serif text-primary">15 ans</div>
                <div className="text-[10px] uppercase tracking-widest font-bold text-secondary">
                  Expertise
                </div>
              </div>
            </div>
          </div>

          {/* Graphique d'évolution du taux de réussite */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-outline-variant/30">
            <h3 className="text-lg font-serif text-on-background mb-4 text-center">
              Évolution du taux de réussite (%) par année
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={successRateData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="year" stroke="#605850" />
                <YAxis domain={[70, 100]} stroke="#605850" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderColor: '#c2652a' }}
                  formatter={(value) => [`${value}%`, 'Taux de réussite']}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="#c2652a"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#c2652a' }}
                  activeDot={{ r: 8 }}
                  name="Taux de réussite"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Deuxième ligne : répartition des lauréats par filière */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-outline-variant/30">
            <h3 className="text-lg font-serif text-on-background mb-4 text-center">
              Répartition des lauréats par filière
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={laureatesByField}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {laureatesByField.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} lauréats`, 'Effectif']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Petit texte additionnel ou autre indicateur */}
          <div className="space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined">trending_up</span>
              <span className="font-bold text-sm uppercase tracking-wider">Croissance constante</span>
            </div>
            <p className="text-secondary font-light">
              Nos résultats progressent chaque année grâce à une pédagogie innovante
              et un suivi personnalisé. Rejoignez nos 500+ lauréats qui ont fait
              confiance à l'excellence de Sahara Elite.
            </p>
            <button className="mt-4 px-6 py-2 bg-primary text-white rounded-full text-sm font-semibold hover:brightness-110 transition-all">
              Voir tous les résultats
            </button>
          </div>
        </div>
      </div>
    </section>

        {/* FAQ & Contact */}
        <section className="py-24 px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            {/* FAQ Accordion */}
            <div>
              <h2 className="text-4xl font-serif mb-12 text-on-background">Questions Fréquentes</h2>
              <div className="space-y-4">
                <details className="group border-b border-outline-variant pb-4" open>
                  <summary className="flex items-center justify-between cursor-pointer list-none">
                    <span className="font-serif text-xl">Comment s'inscrire à une formation ?</span>
                    <span className="material-symbols-outlined expand-icon transition-transform duration-300">
                      expand_more
                    </span>
                  </summary>
                  <div className="mt-4 text-secondary font-light leading-relaxed">
                    Vous pouvez vous inscrire directement via notre site web ou nous rendre visite à
                    notre centre pour un entretien d'orientation gratuit avec nos conseillers.
                  </div>
                </details>
                <details className="group border-b border-outline-variant pb-4">
                  <summary className="flex items-center justify-between cursor-pointer list-none">
                    <span className="font-serif text-xl">Les cours sont-ils en présentiel ?</span>
                    <span className="material-symbols-outlined expand-icon transition-transform duration-300">
                      expand_more
                    </span>
                  </summary>
                  <div className="mt-4 text-secondary font-light leading-relaxed">
                    Sahara Elite privilégie l'apprentissage en présentiel pour une meilleure immersion,
                    mais nous proposons également des formats hybrides pour certains packs spécifiques.
                  </div>
                </details>
                <details className="group border-b border-outline-variant pb-4">
                  <summary className="flex items-center justify-between cursor-pointer list-none">
                    <span className="font-serif text-xl">Quels sont les modes de paiement ?</span>
                    <span className="material-symbols-outlined expand-icon transition-transform duration-300">
                      expand_more
                    </span>
                  </summary>
                  <div className="mt-4 text-secondary font-light leading-relaxed">
                    Nous acceptons les paiements par virement bancaire, chèque ou espèces à notre
                    accueil. Des facilités de paiement sont disponibles pour les Packs Privilèges.
                  </div>
                </details>
              </div>
            </div>

            {/* Quick Contact */}
            <div className="bg-on-background text-surface p-12 rounded-[2rem] flex flex-col justify-between">
              <div>
                <h2 className="text-4xl font-serif mb-6">Besoin d'un Conseil ?</h2>
                <p className="text-surface/70 font-light mb-10">
                  Nos conseillers pédagogiques sont à votre disposition pour définir ensemble votre
                  parcours de réussite.
                </p>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full border border-surface/20 flex items-center justify-center">
                      <span className="material-symbols-outlined">call</span>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold tracking-widest text-surface/40">
                        Téléphone
                      </div>
                      <div className="text-xl">+212 5XX XX XX XX</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full border border-surface/20 flex items-center justify-center">
                      <span className="material-symbols-outlined">location_on</span>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold tracking-widest text-surface/40">
                        Adresse
                      </div>
                      <div className="text-xl">Sahara Training Center, Laâyoune</div>
                    </div>
                  </div>
                </div>
              </div>
              <button className="mt-12 w-full py-4 bg-primary text-white rounded-xl font-bold uppercase tracking-widest hover:bg-primary-container transition-colors">
                Prendre Rendez-vous
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Custom styles */}
      <style>{`
        .golden-line {
          height: 1px;
          background: linear-gradient(to right, transparent, #c2652a, transparent);
        }
        details > summary::-webkit-details-marker {
          display: none;
        }
        details[open] summary .expand-icon {
          transform: rotate(180deg);
        }
      `}</style>
    </>
  );
};

export default Formations;