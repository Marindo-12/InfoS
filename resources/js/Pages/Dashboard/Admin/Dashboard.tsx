import AdminLayout from '@/Layouts/AdminLayout'
import { Head, Link, usePage } from '@inertiajs/react'

type PageProps = {
  auth: {
    user: {
      id: number
      name: string
      email: string
    }
  }
}

type Metric = {
  label: string
  value: string
  sub: string
  accent: 'orange' | 'blue' | 'green' | 'slate'
}

type QuickAction = {
  title: string
  description: string
  href: string
  icon: string
}

const metrics: Metric[] = [
  { label: 'Etudiants actifs', value: '128', sub: '+12 inscriptions ce mois', accent: 'orange' },
  { label: 'Paiements suivis', value: '84%', sub: 'taux de recouvrement', accent: 'green' },
  { label: 'Candidatures', value: '18', sub: 'dossiers a traiter', accent: 'blue' },
  { label: 'Alertes', value: '7', sub: 'actions administratives', accent: 'slate' },
]

const quickActions: QuickAction[] = [
  {
    title: 'Gestion des etudiants',
    description: 'Consulter les profils, les formations suivies et les statuts de paiement.',
    href: route('admin.students'),
    icon: 'groups',
  },
  {
    title: 'Pilotage des paiements',
    description: 'Verifier les encaissements, les restes a payer et les prochaines echeances.',
    href: route('admin.payments'),
    icon: 'payments',
  },
  {
    title: 'Candidatures',
    description: 'Traiter les demandes entrantes et suivre les dossiers incomplets.',
    href: route('admin.applications'),
    icon: 'description',
  },
  {
    title: 'Rapports',
    description: 'Preparer une vue claire sur l activite pedagogique et financiere.',
    href: route('admin.reports'),
    icon: 'monitoring',
  },
]

const activity = [
  { title: 'Nouveau paiement enregistre', meta: 'Il y a 12 min', tone: 'green' },
  { title: 'Trois dossiers etudiants mis a jour', meta: 'Aujourd hui', tone: 'orange' },
  { title: 'Echeance de paiement a relancer', meta: 'Demain', tone: 'amber' },
  { title: 'Rapport mensuel pret a verifier', meta: 'Cette semaine', tone: 'slate' },
]

export default function AdminDashboard() {
  const { props } = usePage<PageProps>()
  const firstName = props.auth.user.name.split(' ')[0]

  return (
    <AdminLayout
      header={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Manrope, sans-serif' }}>
          <span style={{ fontSize: '.8rem', color: '#b0a49a' }}>Administration</span>
          <span style={{ color: '#b0a49a', fontSize: '.8rem' }}>/</span>
          <span style={{ fontSize: '.82rem', fontWeight: 700, color: '#1a1612' }}>Vue d'ensemble</span>
        </div>
      }
    >
      <Head title="Tableau de bord admin" />

      <div className="admd-root">
        <header className="admd-header">
          <div>
            <p className="admd-kicker">Administration</p>
            <h1 className="admd-title">Bonjour {firstName}</h1>
            <p className="admd-subtitle">
              Retrouvez les indicateurs essentiels du centre et accedez rapidement aux espaces de gestion.
            </p>
          </div>
          <div className="admd-header-card">
            <span className="material-symbols-outlined">admin_panel_settings</span>
            <div>
              <strong>Espace admin</strong>
              <small>{props.auth.user.email}</small>
            </div>
          </div>
        </header>

        <section className="admd-stats-grid">
          {metrics.map(metric => (
            <article className={`admd-stat-card admd-stat-card--${metric.accent}`} key={metric.label}>
              <p className="admd-stat-label">{metric.label}</p>
              <p className="admd-stat-value">{metric.value}</p>
              <p className="admd-stat-sub">{metric.sub}</p>
            </article>
          ))}
        </section>

        <section className="admd-main-grid">
          <article className="admd-panel">
            <div className="admd-section-head">
              <h2>Acces rapides</h2>
              <span>Gestion quotidienne</span>
            </div>

            <div className="admd-actions-grid">
              {quickActions.map(action => (
                <Link href={action.href} className="admd-action" key={action.title}>
                  <span className="material-symbols-outlined">{action.icon}</span>
                  <div>
                    <strong>{action.title}</strong>
                    <p>{action.description}</p>
                  </div>
                  <span className="material-symbols-outlined admd-arrow">arrow_forward</span>
                </Link>
              ))}
            </div>
          </article>

          <article className="admd-panel">
            <div className="admd-section-head">
              <h2>Activite recente</h2>
              <span>Suivi admin</span>
            </div>

            <div className="admd-activity-list">
              {activity.map(item => (
                <div className="admd-activity" key={item.title}>
                  <span className={`admd-dot admd-dot--${item.tone}`} />
                  <div>
                    <strong>{item.title}</strong>
                    <small>{item.meta}</small>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="admd-panel admd-focus">
          <div>
            <p className="admd-kicker">Priorite</p>
            <h2>Maintenir les suivis etudiants et financiers a jour</h2>
            <p>
              Les espaces Etudiants et Paiements sont maintenant relies au layout admin. Cette vue d'ensemble sert de point d'entree coherent pour naviguer entre les modules.
            </p>
          </div>
          <div className="admd-focus-actions">
            <Link href={route('admin.students')} className="admd-primary-link">Voir les etudiants</Link>
            <Link href={route('admin.payments')} className="admd-secondary-link">Voir les paiements</Link>
          </div>
        </section>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@600;700&family=Manrope:wght@400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');

        .material-symbols-outlined {
          font-variation-settings:'FILL' 0,'wght' 300,'GRAD' 0,'opsz' 24;
          font-family:'Material Symbols Outlined';
          font-style:normal;
          line-height:1;
          display:inline-block;
          white-space:nowrap;
          -webkit-font-smoothing:antialiased;
        }

        .admd-root {
          padding: 28px;
          min-height: 100%;
          color: #18181b;
          font-family: 'Manrope', sans-serif;
        }

        .admd-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
          padding: 28px;
          margin-bottom: 22px;
          border-radius: 20px;
          border: 1px solid rgba(15,23,42,.07);
          background: radial-gradient(circle at top right, rgba(194,101,42,.1), transparent 42%), #fff;
          box-shadow: 0 4px 20px rgba(15,23,42,.04);
        }

        .admd-kicker {
          margin: 0 0 6px;
          font-size: .72rem;
          font-weight: 800;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: #c2652a;
        }

        .admd-title {
          margin: 0;
          font-family: 'EB Garamond', serif;
          font-size: clamp(1.9rem, 3vw, 2.9rem);
          line-height: 1;
          color: #18181b;
        }

        .admd-subtitle {
          max-width: 620px;
          margin: 12px 0 0;
          color: #6b7280;
          line-height: 1.7;
          font-size: .9rem;
        }

        .admd-header-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          border-radius: 16px;
          border: 1px solid rgba(194,101,42,.16);
          background: #fffaf6;
        }

        .admd-header-card > span {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          background: linear-gradient(135deg, #c2652a, #e8915a);
        }

        .admd-header-card strong,
        .admd-header-card small {
          display: block;
        }

        .admd-header-card strong {
          color: #18181b;
          font-size: .88rem;
        }

        .admd-header-card small {
          margin-top: 2px;
          color: #8b8b8b;
          font-size: .75rem;
        }

        .admd-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 22px;
        }

        .admd-stat-card,
        .admd-panel {
          background: #fff;
          border: 1px solid rgba(15,23,42,.07);
          box-shadow: 0 2px 12px rgba(15,23,42,.04);
        }

        .admd-stat-card {
          border-radius: 16px;
          padding: 20px;
          transition: transform .2s, box-shadow .2s;
        }

        .admd-stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(15,23,42,.07);
        }

        .admd-stat-card--orange { border-top: 3px solid #c2652a; }
        .admd-stat-card--blue { border-top: 3px solid #3b82f6; }
        .admd-stat-card--green { border-top: 3px solid #10b981; }
        .admd-stat-card--slate { border-top: 3px solid #64748b; }

        .admd-stat-label {
          margin: 0 0 8px;
          color: #8b8b8b;
          font-size: .7rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: .12em;
        }

        .admd-stat-value {
          margin: 0;
          color: #18181b;
          font-family: 'EB Garamond', serif;
          font-size: 2rem;
          line-height: 1;
        }

        .admd-stat-sub {
          margin: 8px 0 0;
          color: #6b7280;
          font-size: .8rem;
        }

        .admd-main-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.35fr) minmax(320px, .65fr);
          gap: 18px;
          margin-bottom: 22px;
        }

        .admd-panel {
          border-radius: 20px;
          padding: 24px;
        }

        .admd-section-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 16px;
        }

        .admd-section-head h2,
        .admd-focus h2 {
          margin: 0;
          color: #18181b;
          font-family: 'EB Garamond', serif;
          font-size: 1.65rem;
          line-height: 1.05;
        }

        .admd-section-head span {
          color: #8b8b8b;
          font-size: .78rem;
          font-weight: 700;
        }

        .admd-actions-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .admd-action {
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 12px;
          align-items: center;
          padding: 16px;
          border-radius: 16px;
          border: 1px solid rgba(15,23,42,.06);
          background: #fafafa;
          color: inherit;
          text-decoration: none;
          transition: border-color .15s, background .15s, transform .15s;
        }

        .admd-action:hover {
          transform: translateY(-1px);
          border-color: rgba(194,101,42,.3);
          background: #fffaf6;
        }

        .admd-action > .material-symbols-outlined:first-child {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #c2652a;
          background: #fff3ec;
        }

        .admd-action strong {
          display: block;
          color: #18181b;
          font-size: .9rem;
          margin-bottom: 4px;
        }

        .admd-action p {
          margin: 0;
          color: #6b7280;
          font-size: .78rem;
          line-height: 1.55;
        }

        .admd-arrow {
          color: #b0a49a;
          font-size: 18px;
        }

        .admd-activity-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .admd-activity {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 14px;
          border-radius: 14px;
          background: #fafafa;
          border: 1px solid rgba(15,23,42,.06);
        }

        .admd-activity strong,
        .admd-activity small {
          display: block;
        }

        .admd-activity strong {
          color: #18181b;
          font-size: .84rem;
        }

        .admd-activity small {
          margin-top: 4px;
          color: #8b8b8b;
          font-size: .74rem;
        }

        .admd-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          margin-top: 5px;
          flex-shrink: 0;
        }

        .admd-dot--green { background: #10b981; }
        .admd-dot--orange { background: #c2652a; }
        .admd-dot--amber { background: #f59e0b; }
        .admd-dot--slate { background: #64748b; }

        .admd-focus {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          flex-wrap: wrap;
          background: linear-gradient(180deg, #fffaf6, #fff);
        }

        .admd-focus p {
          max-width: 720px;
          margin: 10px 0 0;
          color: #6b7280;
          line-height: 1.7;
          font-size: .88rem;
        }

        .admd-focus-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .admd-primary-link,
        .admd-secondary-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 40px;
          padding: 0 16px;
          border-radius: 12px;
          font-size: .82rem;
          font-weight: 800;
          text-decoration: none;
        }

        .admd-primary-link {
          color: #fff;
          background: linear-gradient(135deg, #c2652a, #e8915a);
          box-shadow: 0 8px 20px rgba(194,101,42,.25);
        }

        .admd-secondary-link {
          color: #6b7280;
          background: #fff;
          border: 1px solid rgba(15,23,42,.08);
        }

        @media (max-width: 1180px) {
          .admd-stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .admd-main-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 760px) {
          .admd-root {
            padding: 16px;
          }

          .admd-header,
          .admd-panel {
            padding: 18px;
            border-radius: 16px;
          }

          .admd-stats-grid,
          .admd-actions-grid {
            grid-template-columns: 1fr;
          }

          .admd-action {
            grid-template-columns: auto 1fr;
          }

          .admd-arrow {
            display: none;
          }
        }
      `}</style>
    </AdminLayout>
  )
}
