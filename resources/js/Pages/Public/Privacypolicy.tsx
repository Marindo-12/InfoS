import { Head, Link } from '@inertiajs/react'
import PublicLayout from '@/Layouts/PublicLayout'
import { useState, useEffect } from 'react'

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const SECTIONS = [
  { id: 'collecte',       num: '01', title: 'Collecte des données'      },
  { id: 'finalites',      num: '02', title: 'Finalités du traitement'   },
  { id: 'conservation',   num: '03', title: 'Conservation'               },
  { id: 'droits',         num: '04', title: 'Vos droits'                 },
  { id: 'securite',       num: '05', title: 'Sécurité'                   },
  { id: 'cookies',        num: '06', title: 'Cookies'                    },
  { id: 'contact',        num: '07', title: 'Nous contacter'             },
]

const PURPOSES = [
  { icon: 'school',      title: 'Gestion académique',    desc: 'Suivi de votre progression, personnalisation de vos parcours pédagogiques et gestion de vos inscriptions.'   },
  { icon: 'mail',        title: 'Communication',          desc: 'Envoi de notifications importantes concernant vos formations, paiements et actualités du centre.'             },
  { icon: 'monitoring',  title: 'Amélioration continue', desc: 'Analyse statistique anonymisée pour optimiser l\'interface et la qualité de nos formations.'                   },
  { icon: 'security',    title: 'Sécurité',               desc: 'Prévention de la fraude, protection de votre compte et sécurisation des transactions de paiement.'           },
]

const RETENTION = [
  { label: 'Compte étudiant',         detail: 'Conservé tant que votre compte est actif et jusqu\'à 3 ans après votre dernière connexion.' },
  { label: 'Données de paiement',      detail: 'Conservées 10 ans conformément aux obligations légales comptables et fiscales.'            },
  { label: 'Données de communication', detail: 'Archivées 1 an après votre désinscription aux communications.'                            },
  { label: 'Données de navigation',    detail: 'Cookies analytiques supprimés automatiquement au bout de 13 mois.'                        },
]

const RIGHTS = [
  { icon: 'visibility',   title: 'Droit d\'accès',       desc: 'Obtenir une copie de toutes les données personnelles que nous détenons vous concernant.'    },
  { icon: 'edit',         title: 'Droit de rectification', desc: 'Faire corriger toute donnée inexacte ou incomplète sans délai.'                           },
  { icon: 'delete',       title: 'Droit d\'effacement',  desc: 'Demander la suppression de vos données dans les conditions prévues par la loi.'              },
  { icon: 'block',        title: 'Droit d\'opposition',  desc: 'Vous opposer au traitement de vos données à des fins de prospection.'                        },
]

/* ─────────────────────────────────────────────
   COMPOSANT SECTION HEADER
───────────────────────────────────────────── */
function SectionHead({ num, title }: { num: string; title: string }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <span className="font-display text-3xl text-primary/30 font-bold select-none">{num}</span>
      <h2 className="font-display text-3xl text-on-surface pb-2 border-b-2 border-[#8f4d14]">{title}</h2>
    </div>
  )
}

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */
export default function PrivacyPolicy() {
  const [active, setActive] = useState<string>('collecte')
  const lastUpdated = 'Mai 2025'

  /* Highlight active nav item on scroll */
  useEffect(() => {
    const handler = () => {
      const scrollY = window.scrollY + 140
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id)
        if (el && scrollY >= el.offsetTop) setActive(s.id)
      }
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <PublicLayout>
      <Head title="Politique de Confidentialité — Info Saloua" />

      <style>{`
        .pp-prose p { margin-bottom: 1.25rem; }
        .pp-prose p:last-child { margin-bottom: 0; }
        .pp-nav-link {
          display: flex; align-items: center; gap: 8px;
          font-size: .82rem; font-weight: 500;
          color: #605850; padding: 7px 12px;
          border-radius: 8px;
          text-decoration: none;
          transition: background .15s, color .15s;
          white-space: nowrap;
        }
        .pp-nav-link:hover { background: #fff3ec; color: #c2652a; }
        .pp-nav-link--active {
          background: #fff3ec; color: #c2652a; font-weight: 700;
          box-shadow: inset 0 0 0 1px rgba(194,101,42,.2);
        }
        .pp-nav-link--active::before {
          content: '';
          display: block; width: 4px; height: 4px;
          background: #c2652a; border-radius: 50%; flex-shrink: 0;
        }
        .pp-section-divider {
          border-bottom: 2px solid rgba(194,101,42,.24);
          margin: 3.5rem 0;
        }
      `}</style>

      <main className="bg-background min-h-screen pt-28 pb-24">
        <div className="max-w-6xl mx-auto px-6">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-medium text-outline uppercase tracking-wider mb-12">
            <Link href="/" className="hover:text-primary transition-colors">Accueil</Link>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>chevron_right</span>
            <span className="text-primary">Politique de confidentialité</span>
          </nav>

          {/* ── HERO ── */}
          <div className="max-w-2xl mb-20">
            <span className="font-label text-xs font-bold tracking-widest uppercase text-primary block mb-5">
              Info Saloua
            </span>
            <h1 className="font-display text-6xl md:text-7xl text-on-surface leading-tight mb-7">
              Engagement de<br />
              <em className="text-primary not-italic">Confidentialité</em>
            </h1>
            <p className="text-lg text-on-surface-variant font-body leading-relaxed mb-5">
              Chez Info Saloua, la protection de vos données personnelles est au cœur de notre démarche. Nous nous engageons à la transparence totale sur l'usage de vos informations.
            </p>
            <p className="text-xs text-outline uppercase tracking-widest font-label">
              Dernière mise à jour : {lastUpdated}
            </p>
          </div>

          {/* ── SUMMARY CARDS ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
            <div className="bg-primary text-white p-8 rounded-2xl">
              <span className="material-symbols-outlined text-4xl mb-4 block"
                style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
              <h3 className="font-display text-2xl font-bold mb-2">Protection certifiée</h3>
              <p className="text-sm opacity-90 leading-relaxed font-body">
                Conformité totale avec le RGPD et les normes internationales de sécurité des données personnelles.
              </p>
            </div>
            <div className="bg-surface-container-highest p-8 rounded-2xl border border-outline-variant/40">
              <h4 className="font-display text-xl font-bold text-on-surface mb-2">Transparence totale</h4>
              <div className="h-1 w-10 bg-primary mb-4 rounded-full" />
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Nous ne vendons jamais vos données à des tiers. Vos informations restent votre propriété et sont utilisées uniquement dans le cadre de votre formation.
              </p>
            </div>
          </div>

          {/* ── TWO-COL LAYOUT ── */}
          <div className="flex flex-col lg:flex-row gap-16 items-start">

            {/* Sticky nav */}
            <aside className="hidden lg:flex flex-col gap-1 sticky top-28 w-full lg:w-72 max-w-[280px]">
              <p className="text-xs font-bold uppercase tracking-widest text-outline mb-3 px-3">Sommaire</p>
              {SECTIONS.map(s => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className={`pp-nav-link ${active === s.id ? 'pp-nav-link--active' : ''}`}
                >
                  <span className="text-outline text-xs font-mono">{s.num}</span>
                  {s.title}
                </a>
              ))}
            </aside>

            {/* Content */}
            <div className="flex-1 min-w-0 lg:w-2/3 space-y-20">

              {/* 01 — Collecte */}
              <section id="collecte">
                <SectionHead num="01" title="Collecte des données" />
                <div className="pp-prose text-on-surface-variant font-body leading-loose text-lg">
                  <p>
                    Nous collectons uniquement les informations que vous nous fournissez directement lors de votre inscription ou lors de l'utilisation de nos services : nom complet, adresse e-mail, numéro de téléphone, parcours académique et préférences de formation.
                  </p>
                  <div className="bg-surface-container-low p-6 rounded-xl border-l-4 border-primary mt-6">
                    <h4 className="font-bold text-on-surface mb-2 font-label text-xs uppercase tracking-wide">Usage des Cookies</h4>
                    <p className="text-base m-0">
                      Nous utilisons des cookies techniques essentiels pour assurer la fluidité de votre navigation et des cookies analytiques anonymisés pour améliorer continuellement nos services pédagogiques.
                    </p>
                  </div>
                </div>
              </section>

              <div className="border-b-2 border-orange-900/20 my-14" />

              {/* 02 — Finalités */}
              <section id="finalites">
                <SectionHead num="02" title="Finalités du traitement" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {PURPOSES.map(p => (
                    <div key={p.title} className="p-6 bg-white rounded-xl border border-outline-variant/20 shadow-sm hover:border-primary/30 transition-colors">
                      <span className="material-symbols-outlined text-primary text-2xl block mb-3">{p.icon}</span>
                      <h4 className="font-bold text-on-surface mb-2 font-label text-sm">{p.title}</h4>
                      <p className="text-sm text-on-surface-variant leading-relaxed">{p.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              <div className="border-b-2 border-orange-900/20 my-14" />

              {/* 03 — Conservation */}
              <section id="conservation">
                <SectionHead num="03" title="Conservation" />
                <p className="text-on-surface-variant font-body leading-relaxed text-lg mb-6">
                  Vos données sont conservées uniquement pendant la durée nécessaire aux finalités pour lesquelles elles ont été collectées :
                </p>
                <div className="space-y-3">
                  {RETENTION.map(r => (
                    <div key={r.label} className="flex items-start gap-4 p-5 rounded-xl hover:bg-surface-container-low transition-colors border border-transparent hover:border-outline-variant/20">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2.5 flex-shrink-0" />
                      <div>
                        <strong className="text-on-surface font-label text-sm block mb-1">{r.label}</strong>
                        <p className="text-on-surface-variant text-sm leading-relaxed m-0">{r.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <div className="border-b-2 border-orange-900/20 my-14" />

              {/* 04 — Droits */}
              <section id="droits">
                <SectionHead num="04" title="Vos droits" />
                <p className="text-on-surface-variant font-body leading-relaxed text-lg mb-6">
                  Conformément au RGPD et à la loi n°78-17 du 6 janvier 1978, vous disposez des droits suivants sur vos données personnelles :
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {RIGHTS.map(r => (
                    <div key={r.title} className="flex items-start gap-4 p-5 bg-white rounded-xl border border-outline-variant/20 shadow-sm">
                      <span className="material-symbols-outlined text-primary text-xl flex-shrink-0 mt-0.5">{r.icon}</span>
                      <div>
                        <h4 className="font-bold text-on-surface font-label text-sm mb-1">{r.title}</h4>
                        <p className="text-sm text-on-surface-variant leading-relaxed m-0">{r.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 bg-primary-fixed/20 p-6 rounded-xl border-l-4 border-primary">
                  <p className="text-on-surface-variant font-body text-base leading-relaxed m-0 italic">
                    "Pour exercer ces droits, adressez une demande écrite à :{' '}
                    <a href="mailto:privacy@infosaloua.ma" className="text-primary font-semibold not-italic">
                      privacy@infosaloua.ma
                    </a>"
                  </p>
                </div>
              </section>

              <div className="border-b-2 border-orange-900/20 my-14" />

              {/* 05 — Sécurité */}
              <section id="securite">
                <SectionHead num="05" title="Sécurité" />
                <div className="pp-prose text-on-surface-variant font-body leading-loose text-lg">
                  <p>
                    Info Saloua met en œuvre toutes les mesures techniques et organisationnelles appropriées pour garantir la sécurité de vos données contre tout accès non autorisé, toute divulgation ou toute altération.
                  </p>
                  <p>
                    Nos serveurs bénéficient d'un chiffrement SSL 256 bits. Les mots de passe sont stockés sous forme de hachage non réversible. Les accès aux données sont strictement limités au personnel habilité.
                  </p>
                </div>
              </section>

              <div className="border-b-2 border-orange-900/20 my-14" />

              {/* 06 — Cookies */}
              <section id="cookies">
                <SectionHead num="06" title="Cookies" />
                <div className="pp-prose text-on-surface-variant font-body leading-loose text-lg">
                  <p>
                    Notre site utilise trois types de cookies : les cookies essentiels (nécessaires au fonctionnement), les cookies de performance (analyse anonymisée) et les cookies de préférence (mémorisation de vos paramètres).
                  </p>
                  <p>
                    Vous pouvez à tout moment modifier vos préférences de cookies via les paramètres de votre navigateur. Le refus des cookies non essentiels n'affecte pas l'accès à vos formations.
                  </p>
                </div>
              </section>

              <div className="border-b-2 border-orange-900/20 my-14" />

              {/* 07 — Contact */}
              <section id="contact">
                <SectionHead num="07" title="Nous contacter" />
                <div className="pp-prose text-on-surface-variant font-body leading-loose text-lg">
                  <p>
                    Pour toute question relative à la présente politique ou pour exercer vos droits, notre délégué à la protection des données est joignable :
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                  {[
                    { icon: 'mail',       label: 'Email',    value: 'privacy@infosaloua.ma' },
                    { icon: 'location_on', label: 'Adresse', value: '14 avenue Hassan II, 1er étage, Ville Nouvelle, Meknès, Maroc'   },
                    { icon: 'schedule',   label: 'Délai',    value: 'Réponse sous 30 jours'         },
                  ].map(c => (
                    <div key={c.label} className="flex items-start gap-3 p-5 bg-white rounded-xl border border-outline-variant/20 shadow-sm">
                      <span className="material-symbols-outlined text-primary text-xl flex-shrink-0">{c.icon}</span>
                      <div>
                        <p className="font-label text-xs font-bold uppercase tracking-wide text-outline mb-1">{c.label}</p>
                        <p className="text-sm text-on-surface font-semibold m-0">{c.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

            </div>
          </div>
        </div>
      </main>

      {/* Scroll to top */}
      <button
        className="fixed bottom-8 right-8 bg-primary text-on-primary w-12 h-12 rounded-full shadow-lg hover:brightness-110 transition-all flex items-center justify-center z-50"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Retour en haut"
      >
        <span className="material-symbols-outlined">expand_less</span>
      </button>

    </PublicLayout>
  )
}