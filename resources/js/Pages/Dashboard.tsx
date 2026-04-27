import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';

/* ─── Stat card icons ─── */
const IconFormation = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
);
const IconCalendar = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const IconPayment = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2"/>
    <line x1="2" y1="10" x2="22" y2="10"/>
  </svg>
);
const IconCert = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="6"/>
    <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
  </svg>
);
const IconArrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>
  </svg>
);
const IconClock = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

/* ─── Stat Card ─── */
function StatCard({
  label, value, sub, icon, color,
}: {
  label: string; value: string | number; sub: string;
  icon: React.ReactNode; color: string;
}) {
  return (
    <div className="db-stat-card">
      <div className="db-stat-icon-wrap" style={{ background: `${color}18`, color }}>
        {icon}
      </div>
      <div className="db-stat-body">
        <p className="db-stat-label">{label}</p>
        <p className="db-stat-value">{value}</p>
        <p className="db-stat-sub">{sub}</p>
      </div>
    </div>
  );
}

/* ─── Section placeholder ─── */
function SectionPlaceholder({
  title, description, icon, linkLabel,
}: {
  title: string; description: string; icon: React.ReactNode; linkLabel: string;
}) {
  return (
    <div className="db-placeholder">
      <div className="db-placeholder-icon">{icon}</div>
      <p className="db-placeholder-title">{title}</p>
      <p className="db-placeholder-desc">{description}</p>
      <button className="db-placeholder-btn" disabled>
        {linkLabel}
        <IconArrow />
      </button>
    </div>
  );
}

/* ─── Main ─── */
export default function Dashboard() {
  const user = usePage().props.auth.user;
  const firstName = user.name.split(' ')[0];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';

  return (
    <AuthenticatedLayout
      header={<h2>Tableau de bord</h2>}
    >
      <Head title="Dashboard" />

      <div className="db-root">

        {/* ── Welcome banner ── */}
        <div className="db-welcome">
          <div className="db-welcome-text">
            <h1 className="db-welcome-title">
              {greeting}, <span>{firstName}</span> 👋
            </h1>
            <p className="db-welcome-sub">
              Bienvenue sur votre espace personnel. Voici un aperçu de votre activité.
            </p>
          </div>
          <div className="db-welcome-date">
            <IconClock />
            <span>
              {new Date().toLocaleDateString('fr-MA', {
                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
              })}
            </span>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="db-stats-grid">
          <StatCard
            label="Formations actives"
            value="—"
            sub="En attente de données"
            icon={<IconFormation />}
            color="#ff6b2b"
          />
          <StatCard
            label="Séances restantes"
            value="—"
            sub="En attente de données"
            icon={<IconCalendar />}
            color="#3b82f6"
          />
          <StatCard
            label="Paiements réglés"
            value="—"
            sub="En attente de données"
            icon={<IconPayment />}
            color="#10b981"
          />
          <StatCard
            label="Certificats obtenus"
            value="—"
            sub="En attente de données"
            icon={<IconCert />}
            color="#8b5cf6"
          />
        </div>

        {/* ── Main grid ── */}
        <div className="db-main-grid">

          {/* Prochaine séance */}
          <section className="db-section db-section--accent">
            <div className="db-section-header">
              <h3 className="db-section-title">Prochaine séance</h3>
              <span className="db-section-badge">À venir</span>
            </div>
            <SectionPlaceholder
              icon={<IconCalendar />}
              title="Aucune séance programmée"
              description="Vos prochaines séances apparaîtront ici une fois votre formation activée."
              linkLabel="Voir le planning"
            />
          </section>

          {/* Mes formations */}
          <section className="db-section">
            <div className="db-section-header">
              <h3 className="db-section-title">Mes Formations</h3>
              <a href={route('dashboard')} className="db-section-link">
                Voir tout <IconArrow />
              </a>
            </div>
            <SectionPlaceholder
              icon={<IconFormation />}
              title="Aucune formation inscrite"
              description="Vos formations actives et leur progression s'afficheront ici."
              linkLabel="Découvrir les formations"
            />
          </section>

          {/* Paiements récents */}
          <section className="db-section">
            <div className="db-section-header">
              <h3 className="db-section-title">Paiements récents</h3>
              <a href={route('dashboard')} className="db-section-link">
                Historique <IconArrow />
              </a>
            </div>
            <SectionPlaceholder
              icon={<IconPayment />}
              title="Aucun paiement enregistré"
              description="L'historique de vos transactions et reçus téléchargeables apparaîtront ici."
              linkLabel="Gérer mes paiements"
            />
          </section>

          {/* Certificats */}
          <section className="db-section">
            <div className="db-section-header">
              <h3 className="db-section-title">Mes Certificats</h3>
              <a href={route('dashboard')} className="db-section-link">
                Voir tout <IconArrow />
              </a>
            </div>
            <SectionPlaceholder
              icon={<IconCert />}
              title="Aucun certificat disponible"
              description="Vos certificats de pré-inscription et attestations de formation seront ici."
              linkLabel="Accéder aux certificats"
            />
          </section>

        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');

        .db-root {
          display: flex; flex-direction: column; gap: 24px;
          font-family: 'Manrope', sans-serif;
        }

        /* ── Welcome ── */
        .db-welcome {
          display: flex; align-items: flex-start; justify-content: space-between;
          flex-wrap: wrap; gap: 12px;
          background: #fff;
          border-radius: 16px;
          padding: 24px 28px;
          border: 1px solid rgba(0,0,0,0.06);
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
          position: relative; overflow: hidden;
        }
        .db-welcome::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, #ff6b2b, #ff9a56, #ffb347);
        }
        .db-welcome-title {
          font-size: 1.35rem; font-weight: 800; color: #111;
          margin: 0 0 4px; letter-spacing: -.02em;
        }
        .db-welcome-title span { color: #ff6b2b; }
        .db-welcome-sub { font-size: .85rem; color: #888; margin: 0; }
        .db-welcome-date {
          display: flex; align-items: center; gap: 6px;
          font-size: .78rem; color: #aaa; font-weight: 500;
          white-space: nowrap;
        }

        /* ── Stats grid ── */
        .db-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        @media (max-width: 1023px) { .db-stats-grid { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 479px)  { .db-stats-grid { grid-template-columns: 1fr; } }

        .db-stat-card {
          background: #fff;
          border-radius: 14px;
          border: 1px solid rgba(0,0,0,0.06);
          padding: 20px;
          display: flex; align-items: flex-start; gap: 14px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
          transition: transform .15s, box-shadow .15s;
        }
        .db-stat-card:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
        .db-stat-icon-wrap {
          width: 44px; height: 44px; border-radius: 11px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
        }
        .db-stat-body { min-width: 0; }
        .db-stat-label { font-size: .75rem; font-weight: 600; color: #888; margin: 0 0 4px; text-transform: uppercase; letter-spacing: .06em; }
        .db-stat-value { font-size: 1.6rem; font-weight: 800; color: #111; margin: 0 0 2px; letter-spacing: -.03em; line-height: 1; }
        .db-stat-sub   { font-size: .72rem; color: #bbb; margin: 0; }

        /* ── Main grid ── */
        .db-main-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        @media (max-width: 767px) { .db-main-grid { grid-template-columns: 1fr; } }

        /* ── Section ── */
        .db-section {
          background: #fff;
          border-radius: 16px;
          border: 1px solid rgba(0,0,0,0.06);
          padding: 22px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
          display: flex; flex-direction: column;
        }
        .db-section--accent { border-top: 3px solid #ff6b2b; }

        .db-section-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 16px;
        }
        .db-section-title {
          font-size: .9rem; font-weight: 700; color: #111; margin: 0;
        }
        .db-section-badge {
          font-size: .68rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: .08em;
          background: rgba(255,107,43,.1); color: #ff6b2b;
          border-radius: 99px; padding: 2px 9px;
        }
        .db-section-link {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: .78rem; font-weight: 600; color: #ff6b2b;
          text-decoration: none;
          transition: gap .15s;
        }
        .db-section-link:hover { gap: 7px; }

        /* ── Placeholder ── */
        .db-placeholder {
          flex: 1;
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; text-align: center;
          padding: 24px 16px;
          border-radius: 10px;
          border: 1.5px dashed rgba(0,0,0,0.1);
          background: #fafafa;
          gap: 8px;
          min-height: 160px;
        }
        .db-placeholder-icon {
          width: 40px; height: 40px; border-radius: 10px;
          background: rgba(0,0,0,0.05);
          display: flex; align-items: center; justify-content: center;
          color: #bbb; margin-bottom: 4px;
        }
        .db-placeholder-title {
          font-size: .84rem; font-weight: 700; color: #555; margin: 0;
        }
        .db-placeholder-desc {
          font-size: .76rem; color: #aaa; max-width: 220px; margin: 0; line-height: 1.5;
        }
        .db-placeholder-btn {
          display: inline-flex; align-items: center; gap: 5px;
          margin-top: 6px;
          padding: 6px 14px;
          border-radius: 99px; border: 1px solid rgba(0,0,0,0.1);
          background: transparent; color: #888;
          font-family: 'Manrope', sans-serif;
          font-size: .76rem; font-weight: 600;
          cursor: not-allowed; opacity: .6;
        }
      `}</style>
    </AuthenticatedLayout>
  );
}