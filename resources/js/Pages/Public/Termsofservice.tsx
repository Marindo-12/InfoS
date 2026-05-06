import { Head, Link } from '@inertiajs/react'
import PublicLayout from '@/Layouts/PublicLayout'
import { useState, useEffect } from 'react'

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const SECTIONS = [
  { id: 'objet',          num: '01', title: 'Objet & champ d\'application' },
  { id: 'acces',          num: '02', title: 'Accès aux services'           },
  { id: 'inscription',    num: '03', title: 'Inscription & compte'         },
  { id: 'propriete',      num: '04', title: 'Propriété intellectuelle'     },
  { id: 'donnees',        num: '05', title: 'Données personnelles'         },
  { id: 'paiements',      num: '06', title: 'Paiements & remboursements'   },
  { id: 'responsabilite', num: '07', title: 'Responsabilité'               },
  { id: 'evolution',      num: '08', title: 'Évolution des CGU'            },
  { id: 'droit',          num: '09', title: 'Droit applicable'             },
]

/* ─────────────────────────────────────────────
   COMPOSANTS
───────────────────────────────────────────── */
function SectionHead({ num, title }: { num: string; title: string }) {
  return (
    <div className="flex items-center gap-5 mb-7">
      <span className="font-display text-5xl text-primary/20 font-bold leading-none select-none tabular-nums">
        {num}
      </span>
      <div>
        <h2 className="font-display text-2xl md:text-3xl text-on-surface leading-tight">{title}</h2>
      </div>
    </div>
  )
}

function InfoBox({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4 bg-white p-6 rounded-xl border border-outline-variant/30 shadow-sm my-6">
      <span className="material-symbols-outlined text-primary text-2xl flex-shrink-0 mt-0.5">{icon}</span>
      <div className="text-on-surface-variant font-body text-base leading-relaxed">{children}</div>
    </div>
  )
}

function QuoteBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-primary-fixed/25 border-l-4 border-primary p-6 rounded-r-xl my-6 italic text-on-surface-variant font-body leading-relaxed">
      {children}
    </div>
  )
}

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */
export default function TermsOfService() {
  const [active, setActive] = useState<string>('objet')
  const lastUpdated = 'Mai 2025'

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
      <Head title="Conditions Générales d'Utilisation — Centre Informatique" />

      <style>{`
        .cgu-prose p { margin-bottom: 1.25rem; }
        .cgu-prose p:last-child { margin-bottom: 0; }
        .cgu-prose ul { list-style: none; padding: 0; margin: 0; }
        .cgu-prose ul li {
          display: flex; align-items: flex-start; gap: 10px;
          margin-bottom: .75rem;
          font-size: 1.0625rem;
          color: #605850; line-height: 1.75;
        }
        .cgu-prose ul li::before {
          content: '';
          display: block; flex-shrink: 0;
          width: 6px; height: 6px;
          background: #c2652a; border-radius: 50%;
          margin-top: .65rem;
        }

        .cgu-nav-link {
          display: flex; align-items: center; gap: 8px;
          font-size: .8rem; font-weight: 500;
          color: #605850; padding: 6px 12px;
          border-radius: 8px; text-decoration: none;
          transition: background .15s, color .15s;
          white-space: nowrap;
        }
        .cgu-nav-link:hover { background: #fff3ec; color: #c2652a; }
        .cgu-nav-link--active {
          background: #fff3ec; color: #c2652a; font-weight: 700;
        }

        /* Section card style for special sections */
        .cgu-card {
          background: #fff;
          border: 1px solid rgba(0,0,0,0.07);
          border-radius: 20px;
          padding: 32px 36px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
        }

        /* Table */
        .cgu-table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
        .cgu-table th {
          background: #f6f0e8; text-align: left;
          padding: 10px 16px; font-size: .72rem;
          font-weight: 800; text-transform: uppercase;
          letter-spacing: .08em; color: #9a9088;
          border-bottom: 1px solid #d8d0c8;
        }
        .cgu-table td {
          padding: 12px 16px; font-size: .9rem;
          color: #605850; border-bottom: 1px solid #ede9e4;
          line-height: 1.6;
        }
        .cgu-table tr:last-child td { border-bottom: none; }
        .cgu-table tr:hover td { background: #fffaf6; }
        .cgu-table-wrap { overflow-x: auto; border-radius: 12px; border: 1px solid #ede9e4; }
      `}</style>

      <main className="bg-background min-h-screen">

        {/* ── HERO BANNER ── */}
        <div className="relative overflow-hidden" style={{
          background: 'linear-gradient(135deg, #faf5ee 0%, #fdf3e8 50%, #faf5ee 100%)',
          borderBottom: '1px solid #d8d0c8',
        }}>
          {/* Background pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.06] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="cgu-grid" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#c2652a" strokeWidth="0.8"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cgu-grid)" />
          </svg>

          <div className="relative max-w-5xl mx-auto px-6 pt-36 pb-20">

            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs font-medium text-outline uppercase tracking-wider mb-10">
              <Link href="/" className="hover:text-primary transition-colors">Accueil</Link>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>chevron_right</span>
              <span className="text-primary">Conditions d'utilisation</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
              <div>
                <span className="font-label text-xs font-bold tracking-widest uppercase text-primary block mb-5">
                  Centre Informatique — Tanger
                </span>
                <h1 className="font-display text-5xl md:text-7xl text-on-surface leading-tight mb-6">
                  Conditions<br />
                  <em className="text-primary">d'Utilisation</em>
                </h1>
                <p className="text-base text-on-surface-variant font-body leading-relaxed mb-4">
                  Les présentes CGU encadrent l'utilisation de la plateforme Centre Informatique et de l'ensemble de ses services pédagogiques et administratifs.
                </p>
                <p className="text-xs text-outline uppercase tracking-widest font-label">
                  Dernière mise à jour : {lastUpdated}
                </p>
              </div>

              {/* Key points */}
              <div className="space-y-3">
                {[
                  { icon: 'gavel',         text: 'Document juridiquement contraignant' },
                  { icon: 'update',        text: 'Mis à jour régulièrement'            },
                  { icon: 'verified_user', text: 'Conformité RGPD garantie'            },
                  { icon: 'support_agent', text: 'Équipe disponible pour vos questions' },
                ].map(item => (
                  <div key={item.text} className="flex items-center gap-3 bg-white/70 backdrop-blur-sm rounded-xl px-5 py-3 border border-outline-variant/30">
                    <span className="material-symbols-outlined text-primary text-lg flex-shrink-0">{item.icon}</span>
                    <span className="text-sm font-medium text-on-surface-variant">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="max-w-5xl mx-auto px-6 py-20">
          <div className="flex gap-16 items-start">

            {/* Sticky nav */}
            <aside className="hidden lg:flex flex-col gap-1 sticky top-28 min-w-[210px] flex-shrink-0">
              <p className="text-xs font-bold uppercase tracking-widest text-outline mb-3 px-3 font-label">Sommaire</p>
              {SECTIONS.map(s => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className={`cgu-nav-link ${active === s.id ? 'cgu-nav-link--active' : ''}`}
                >
                  <span className="text-outline text-xs font-mono">{s.num}</span>
                  {s.title}
                </a>
              ))}
              <div className="mt-6 p-4 bg-primary/5 border border-primary/15 rounded-xl">
                <p className="text-xs text-on-surface-variant font-body leading-relaxed">
                  En utilisant nos services, vous acceptez pleinement les présentes conditions.
                </p>
              </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 min-w-0 space-y-16">

              {/* 01 — Objet */}
              <section id="objet">
                <SectionHead num="01" title="Objet & champ d'application" />
                <div className="cgu-prose text-on-surface-variant font-body leading-loose text-lg">
                  <p>
                    Les présentes Conditions Générales d'Utilisation (CGU) définissent les règles d'accès et d'utilisation de la plateforme numérique du Centre Informatique, accessible à l'adresse <strong className="text-on-surface">centreinformatique.ma</strong>, ainsi que de l'ensemble des services associés : espace étudiant, suivi pédagogique, paiement en ligne et communication administrative.
                  </p>
                  <p>
                    L'utilisation de la plateforme implique l'acceptation sans réserve des présentes CGU. Toute personne qui ne souhaite pas être liée par ces conditions doit s'abstenir d'utiliser les services proposés.
                  </p>
                </div>
                <QuoteBox>
                  "En vous inscrivant sur la plateforme, vous reconnaissez avoir pris connaissance des présentes CGU et les acceptez dans leur intégralité."
                </QuoteBox>
              </section>

              <div className="border-b border-outline-variant/30" />

              {/* 02 — Accès */}
              <section id="acces">
                <SectionHead num="02" title="Accès aux services" />
                <div className="cgu-prose text-on-surface-variant font-body leading-loose text-lg">
                  <p>La plateforme Centre Informatique permet à l'Utilisateur d'accéder aux services suivants :</p>
                  <ul>
                    <li>Consultation des formations disponibles et de leurs programmes détaillés</li>
                    <li>Inscription en ligne et suivi de l'avancement du dossier de candidature</li>
                    <li>Accès à l'espace étudiant personnalisé après validation et paiement</li>
                    <li>Suivi pédagogique : notes, assiduité, progression, calendrier des séances</li>
                    <li>Gestion des paiements et téléchargement des reçus et factures officielles</li>
                  </ul>
                  <p>
                    L'accès à la partie publique est gratuit. L'espace étudiant est réservé aux personnes dûment inscrites et ayant procédé au règlement de leur formation.
                  </p>
                </div>
              </section>

              <div className="border-b border-outline-variant/30" />

              {/* 03 — Inscription */}
              <section id="inscription">
                <SectionHead num="03" title="Inscription & compte" />
                <div className="cgu-prose text-on-surface-variant font-body leading-loose text-lg">
                  <p>
                    Pour accéder aux services pédagogiques, l'Utilisateur doit soumettre un dossier de candidature en ligne. Le Centre examine chaque dossier et notifie l'Utilisateur par e-mail dans les 48 heures ouvrées.
                  </p>
                  <p>
                    L'activation du compte étudiant est conditionnée au règlement intégral ou partiel (selon le plan de paiement convenu) des frais de formation. L'Utilisateur est responsable de la confidentialité de ses identifiants.
                  </p>
                </div>
                <InfoBox icon="info">
                  <strong className="text-on-surface block mb-1">Important</strong>
                  Tout compte inactif depuis plus de 24 mois pourra être archivé. L'Utilisateur sera notifié 30 jours avant toute archivation.
                </InfoBox>
              </section>

              <div className="border-b border-outline-variant/30" />

              {/* 04 — Propriété intellectuelle */}
              <section id="propriete">
                <div className="cgu-card">
                  <SectionHead num="04" title="Propriété intellectuelle" />
                  <div className="grid md:grid-cols-2 gap-8 cgu-prose text-on-surface-variant font-body leading-loose text-base">
                    <div>
                      <p>
                        L'ensemble des contenus présents sur la plateforme (textes, supports pédagogiques, vidéos, images, logos, marques) sont la propriété exclusive du Centre Informatique ou de ses partenaires et sont protégés par le droit marocain de la propriété intellectuelle.
                      </p>
                    </div>
                    <div>
                      <p>
                        Toute reproduction, même partielle, sans autorisation écrite préalable est strictement interdite. Les ressources pédagogiques sont fournies à titre personnel et non commercial, exclusivement pour l'usage de l'étudiant inscrit.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <div className="border-b border-outline-variant/30" />

              {/* 05 — Données personnelles */}
              <section id="donnees">
                <SectionHead num="05" title="Données personnelles" />
                <div className="cgu-prose text-on-surface-variant font-body leading-loose text-lg">
                  <p>
                    Centre Informatique traite vos données personnelles dans le respect de la vie privée. L'adresse e-mail et le numéro de téléphone sont utilisés pour la gestion administrative de votre inscription et la communication des informations relatives à votre formation.
                  </p>
                </div>
                <QuoteBox>
                  "Le Centre assure une collecte et un traitement d'informations personnelles conformes au RGPD et aux lois applicables en matière de protection des données."
                </QuoteBox>
                <InfoBox icon="verified_user">
                  <strong className="text-on-surface block mb-1">Protection RGPD</strong>
                  Conformément aux articles 39 et 40 de la loi du 6 janvier 1978, vous disposez d'un droit d'accès, de rectification, d'effacement et d'opposition. Consultez notre{' '}
                  <Link href="/politique-de-confidentialite" className="text-primary font-semibold">
                    Politique de confidentialité
                  </Link>{' '}
                  pour en savoir plus.
                </InfoBox>
              </section>

              <div className="border-b border-outline-variant/30" />

              {/* 06 — Paiements */}
              <section id="paiements">
                <SectionHead num="06" title="Paiements & remboursements" />
                <div className="cgu-prose text-on-surface-variant font-body leading-loose text-lg mb-6">
                  <p>
                    Les frais de formation sont indiqués sur la page de chaque programme. Le règlement peut s'effectuer en une ou plusieurs fois selon le plan convenu lors de l'inscription.
                  </p>
                </div>
                <div className="cgu-table-wrap">
                  <table className="cgu-table">
                    <thead>
                      <tr>
                        <th>Modalité</th>
                        <th>Détail</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { mode: 'Paiement en ligne',       detail: 'Carte bancaire via plateforme sécurisée SSL — confirmation immédiate'           },
                        { mode: 'Virement bancaire',        detail: 'RIB communiqué par e-mail — délai de validation : 2 jours ouvrés'              },
                        { mode: 'Règlement en espèces',     detail: 'Directement au centre sur rendez-vous — reçu officiel remis immédiatement'    },
                        { mode: 'Facilités de paiement',    detail: 'Plan mensuel disponible sur demande, sous réserve d\'acceptation du dossier'   },
                        { mode: 'Politique de remboursement', detail: 'Remboursement intégral si annulation avant le 1er cours, partiel ensuite'    },
                      ].map(row => (
                        <tr key={row.mode}>
                          <td><strong className="text-on-surface">{row.mode}</strong></td>
                          <td>{row.detail}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <div className="border-b border-outline-variant/30" />

              {/* 07 — Responsabilité */}
              <section id="responsabilite">
                <SectionHead num="07" title="Responsabilité" />
                <div className="cgu-prose text-on-surface-variant font-body leading-loose text-lg">
                  <p>
                    Centre Informatique s'engage à fournir des informations exactes et à jour. Toutefois, en cas d'erreur ou d'omission, la responsabilité du Centre ne saurait être engagée à ce titre.
                  </p>
                  <p>
                    Le Centre ne peut être tenu responsable d'interruptions temporaires du service dues à des opérations de maintenance, à des incidents techniques ou à des causes extérieures indépendantes de sa volonté (force majeure).
                  </p>
                  <p>
                    Il appartient à l'Utilisateur de prendre toutes mesures appropriées pour protéger ses propres données et logiciels contre d'éventuelles atteintes.
                  </p>
                </div>
              </section>

              <div className="border-b border-outline-variant/30" />

              {/* 08 & 09 — Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <section id="evolution">
                  <SectionHead num="08" title="Évolution des CGU" />
                  <p className="text-on-surface-variant font-body leading-relaxed text-base">
                    Centre Informatique se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront notifiés par e-mail au moins 15 jours avant l'entrée en vigueur de toute modification substantielle. La poursuite de l'utilisation des services vaut acceptation des nouvelles conditions.
                  </p>
                </section>
                <section id="droit">
                  <SectionHead num="09" title="Droit applicable" />
                  <p className="text-on-surface-variant font-body leading-relaxed text-base">
                    Les présentes CGU sont soumises au droit marocain. En cas de litige, les parties s'engagent à rechercher une solution amiable avant tout recours judiciaire. À défaut, les tribunaux compétents du ressort de Tanger seront saisis.
                  </p>
                </section>
              </div>

              {/* CTA block */}
              <div className="cgu-card flex flex-col md:flex-row gap-6 items-center justify-between" style={{ background: 'linear-gradient(135deg, rgba(194,101,42,0.06), #fff)' }}>
                <div>
                  <h3 className="font-display text-2xl text-on-surface mb-2">Une question sur ces CGU ?</h3>
                  <p className="text-on-surface-variant text-sm font-body leading-relaxed">
                    Notre équipe est disponible pour répondre à toute interrogation juridique ou administrative.
                  </p>
                </div>
                <div className="flex gap-3 flex-shrink-0 flex-wrap">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-lg font-label font-bold text-sm hover:brightness-110 transition-all shadow-sm"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>support_agent</span>
                    Nous contacter
                  </Link>
                  <Link
                    href="/politique-de-confidentialite"
                    className="inline-flex items-center gap-2 px-6 py-3 border border-outline text-on-surface rounded-lg font-label font-bold text-sm hover:bg-surface-container-low transition-all"
                  >
                    Confidentialité
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Footer section */}
        <div className="border-t border-outline-variant/30 mt-4 py-14 text-center bg-surface-container-lowest">
          <p className="font-display text-2xl text-on-surface mb-2">Centre Informatique</p>
          <p className="text-xs text-outline uppercase tracking-widest font-label mb-8">Excellence · Intégrité · Transmission</p>
          <div className="flex justify-center flex-wrap gap-x-8 gap-y-4 mb-8">
            <Link href="/politique-de-confidentialite" className="text-on-surface-variant hover:text-primary text-sm font-medium transition-colors">
              Politique de confidentialité
            </Link>
            <Link href="/contact" className="text-on-surface-variant hover:text-primary text-sm font-medium transition-colors">
              Contact
            </Link>
            <Link href="/" className="text-on-surface-variant hover:text-primary text-sm font-medium transition-colors">
              Accueil
            </Link>
          </div>
          <p className="text-xs text-outline uppercase tracking-widest font-label">
            © {new Date().getFullYear()} Centre Informatique. Dernière mise à jour : {lastUpdated}
          </p>
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