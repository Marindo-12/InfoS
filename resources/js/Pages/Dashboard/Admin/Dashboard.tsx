import AdminLayout from '@/Layouts/AdminLayout'
import { Head, Link, usePage } from '@inertiajs/react'
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

type Accent = 'orange' | 'green' | 'tertiary' | 'slate'

type Stat = {
  label: string
  value: string
  sub: string
  delta: string
  accent: Accent
}

type ChartPoint = {
  name: string
  value: number
  color: string
}

type ActivityItem = {
  title: string
  description: string
  time: string
  icon: string
  tone: 'primary' | 'secondary' | 'tertiary' | 'warning'
}

type Summary = {
  students: number
  monthlyRevenue: number
  totalCollected: number
  pendingApplications: number
  collectionRate: number
  conversionRate: number
  applicationsTotal: number
  enrollmentsTotal: number
}

type Spotlight = {
  students: string
  courses: string
  reports: string
}

type PageProps = {
  auth: {
    user: {
      id: number
      name: string
      email: string
      avatar_url?: string | null
    }
  }
  stats: Stat[]
  summary: Summary
  enrollmentDistribution: ChartPoint[]
  financialDistribution: ChartPoint[]
  recentActivity: ActivityItem[]
  spotlight: Spotlight
}

const fallbackChart = [{ name: 'Aucune donnee', value: 1, color: '#cec6be' }]

function greetingForHour(hour: number) {
  if (hour < 5) return 'Bonne nuit'
  if (hour < 12) return 'Bonjour'
  if (hour < 18) return 'Bon apres-midi'
  if (hour < 22) return 'Bonsoir'
  return 'Bonne nuit'
}

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map(part => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function darken(hex: string) {
  const value = hex.replace('#', '')
  const r = Math.max(0, parseInt(value.slice(0, 2), 16) - 54)
  const g = Math.max(0, parseInt(value.slice(2, 4), 16) - 54)
  const b = Math.max(0, parseInt(value.slice(4, 6), 16) - 54)
  return `rgb(${r}, ${g}, ${b})`
}

function fmtDh(value: number | string | undefined) {
  return `${Number(value ?? 0).toLocaleString('fr-FR')} DH`
}

function percent(value: number, total: number) {
  return total > 0 ? Math.round((value / total) * 100) : 0
}

function Donut3D({
  data,
  totalLabel,
  totalValue,
  tooltipSuffix,
}: {
  data: ChartPoint[]
  totalLabel: string
  totalValue: string
  tooltipSuffix?: string
}) {
  const chartData = data.length > 0 ? data : fallbackChart

  return (
    <div className="admd-donut-shell">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="56%"
            innerRadius={58}
            outerRadius={91}
            paddingAngle={3}
            stroke="none"
            isAnimationActive={false}
          >
            {chartData.map(entry => (
              <Cell key={`depth-${entry.name}`} fill={darken(entry.color)} opacity={0.42} />
            ))}
          </Pie>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="49%"
            innerRadius={58}
            outerRadius={91}
            paddingAngle={3}
            stroke="rgba(255,255,255,.65)"
            strokeWidth={2}
          >
            {chartData.map(entry => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: any) => tooltipSuffix === 'DH' ? fmtDh(value) : `${value}${tooltipSuffix ?? ''}`}
            contentStyle={{
              borderRadius: 12,
              border: '1px solid rgba(154,144,136,.22)',
              boxShadow: '0 16px 40px rgba(58,48,42,.12)',
              fontFamily: 'Manrope, sans-serif',
              fontSize: 12,
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="admd-donut-center">
        <strong>{totalValue}</strong>
        <span>{totalLabel}</span>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const { props } = usePage<PageProps>()
  const { auth, stats, summary, enrollmentDistribution, financialDistribution, recentActivity, spotlight } = props
  const adminName = auth.user.name
  const greeting = greetingForHour(new Date().getHours())
  const enrollmentTotal = enrollmentDistribution.reduce((sum, item) => sum + item.value, 0)
  const financialTotal = financialDistribution.reduce((sum, item) => sum + item.value, 0)

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
      <Head title="Vue d'ensemble admin" />

      <main className="admd-root">
        <header className="admd-hero">
          <div>
            <p className="admd-kicker">Administration</p>
            <h1 className="admd-title">{greeting}, {adminName}</h1>
            <p className="admd-subtitle">
              Bienvenue dans l'espace de gestion Info Saloua. Supervisez les inscriptions, les candidatures et le flux financier avec des donnees synchronisees depuis le backend.
            </p>
          </div>

          <div className="admd-admin-card">
            <div className="admd-admin-text">
              <p>Administrateur</p>
              <strong>{adminName}</strong>
              <span>{auth.user.email}</span>
            </div>
            <div className="admd-avatar">
              {auth.user.avatar_url ? <img src={auth.user.avatar_url} alt={adminName} /> : initials(adminName)}
            </div>
          </div>
        </header>

        <section className="admd-stats-grid">
          {stats.map(stat => (
            <article className={`admd-stat admd-stat--${stat.accent}`} key={stat.label}>
              <p>{stat.label}</p>
              <div>
                <strong>{stat.value}</strong>
                <span>{stat.delta}</span>
              </div>
              <small>{stat.sub}</small>
            </article>
          ))}
        </section>

        <section className="admd-content-grid">
          <div className="admd-analysis">
            <div className="admd-section-head">
              <h2>Analyse des Inscriptions</h2>
              <div>
                <Link href={route('admin.applications')}>Candidatures</Link>
                <Link className="admd-primary-link" href={route('admin.reports')}>Exporter</Link>
              </div>
            </div>

            <div className="admd-chart-grid">
              <article className="admd-chart-card">
                <Donut3D
                  data={enrollmentDistribution}
                  totalValue={summary.enrollmentsTotal.toLocaleString('fr-FR')}
                  totalLabel="Total"
                />
                <div className="admd-legend">
                  {(enrollmentDistribution.length > 0 ? enrollmentDistribution : fallbackChart).map(item => (
                    <div className="admd-legend-row" key={item.name}>
                      <span className="admd-legend-dot" style={{ background: item.color }} />
                      <span>{item.name}</span>
                      <strong>{item.name === 'Aucune donnee' ? '0%' : `${percent(item.value, enrollmentTotal)}%`}</strong>
                    </div>
                  ))}
                </div>
              </article>

              <article className="admd-chart-card">
                <Donut3D
                  data={financialDistribution}
                  totalValue={`${summary.collectionRate}%`}
                  totalLabel="Paye"
                  tooltipSuffix="DH"
                />
                <div className="admd-finance-note">
                  <h3>Sante financiere</h3>
                  <p>
                    {financialTotal > 0
                      ? `${fmtDh(summary.totalCollected)} deja encaisses, avec un recouvrement global de ${summary.collectionRate}%.`
                      : 'Aucune donnee de paiement n est encore disponible.'}
                  </p>
                </div>
              </article>
            </div>
          </div>

          <aside className="admd-activity-panel">
            <h2>Activite recente</h2>
            <div className="admd-activity-list">
              {recentActivity.length > 0 ? recentActivity.map(item => (
                <div className="admd-activity" key={`${item.title}-${item.description}-${item.time}`}>
                  <div className={`admd-activity-icon admd-activity-icon--${item.tone}`}>
                    <span className="material-symbols-outlined">{item.icon}</span>
                  </div>
                  <div>
                    <div className="admd-activity-top">
                      <strong>{item.title}</strong>
                      <span>{item.time}</span>
                    </div>
                    <p>{item.description}</p>
                  </div>
                </div>
              )) : (
                <div className="admd-empty">Aucune activite recente pour le moment.</div>
              )}
            </div>
            <Link className="admd-history-link" href={route('admin.applications')}>
              Voir les dossiers
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </aside>
        </section>

        <section className="admd-bottom-grid">
          <Link href={route('admin.students')} className="admd-feature admd-feature--wide">
            <div>
              <p>Gestion Etudiants</p>
              <h3>{spotlight.students}</h3>
              <span>Consultez les dossiers, les formations et les progressions academiques.</span>
            </div>
          </Link>

          <Link href={route('admin.courses')} className="admd-mini-card">
            <span className="material-symbols-outlined">school</span>
            <h3>Offre de Formation</h3>
            <p>{spotlight.courses}</p>
            <small>Modifier <span className="material-symbols-outlined">east</span></small>
          </Link>

          <Link href={route('admin.reports')} className="admd-mini-card admd-mini-card--primary">
            <span className="material-symbols-outlined">analytics</span>
            <h3>Rapports Annuels</h3>
            <p>{spotlight.reports}</p>
            <small>Generer <span className="material-symbols-outlined">east</span></small>
          </Link>
        </section>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;600;700&family=Manrope:wght@400;500;600;700;800&display=swap');
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
          --surface: #faf5ee;
          --surface-lowest: rgba(255,255,255,.58);
          --surface-low: #f6f0e8;
          --surface-high: #ece6dc;
          --surface-highest: #e6e0d6;
          --outline: #9a9088;
          --outline-soft: rgba(154,144,136,.32);
          --text: #3a302a;
          --muted: #605850;
          --primary: #c2652a;
          --primary-soft: #fbe8d8;
          --secondary: #78706a;
          --tertiary: #8c3c3c;
          --shadow: rgba(58,48,42,.07);
          min-height: 100%;
          max-width: 100%;
          overflow-x: hidden;
          padding: 42px 32px;
          background: var(--surface);
          color: var(--text);
          font-family: 'Manrope', sans-serif;
        }

        .admd-root *, .admd-root *::before, .admd-root *::after {
          box-sizing: border-box;
        }

        .admd-hero {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 28px;
          margin-bottom: 44px;
        }

        .admd-kicker {
          margin: 0 0 12px;
          font-family: 'Manrope', sans-serif;
          font-size: .72rem;
          font-weight: 800;
          letter-spacing: .2em;
          text-transform: uppercase;
          color: var(--outline);
        }

        .admd-title {
          max-width: 820px;
          margin: 0;
          color: var(--text);
          font-family: 'EB Garamond', serif;
          font-size: clamp(2.55rem, 5vw, 4.85rem);
          font-weight: 700;
          line-height: .95;
        }

        .admd-subtitle {
          max-width: 680px;
          margin: 20px 0 0;
          color: var(--muted);
          font-size: 1rem;
          line-height: 1.9;
        }

        .admd-admin-card {
          display: flex;
          align-items: center;
          gap: 18px;
          flex-shrink: 0;
        }

        .admd-admin-text {
          text-align: right;
        }

        .admd-admin-text p {
          margin: 0 0 5px;
          color: var(--outline);
          font-size: .68rem;
          font-weight: 800;
          letter-spacing: .18em;
          text-transform: uppercase;
        }

        .admd-admin-text strong {
          display: block;
          color: var(--text);
          font-family: 'EB Garamond', serif;
          font-size: 1.35rem;
          font-style: italic;
          font-weight: 600;
        }

        .admd-admin-text span {
          display: block;
          margin-top: 3px;
          color: var(--muted);
          font-size: .76rem;
          overflow-wrap: anywhere;
        }

        .admd-avatar {
          width: 64px;
          height: 64px;
          border-radius: 999px;
          overflow: hidden;
          border: 1px solid var(--outline-soft);
          box-shadow: 0 12px 26px var(--shadow);
          background: linear-gradient(135deg, #fbe8d8, #c2652a);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          letter-spacing: .04em;
        }

        .admd-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .admd-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 26px;
          margin-bottom: 44px;
        }

        .admd-stat {
          padding: 28px;
          border: 1px solid var(--outline-soft);
          border-radius: 12px;
          background: var(--surface-lowest);
          transition: background .18s, transform .18s, border-color .18s;
        }

        .admd-stat:nth-child(4) {
          grid-column: span 3;
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
        }

        .admd-stat:hover {
          transform: translateY(-2px);
          background: rgba(255,255,255,.78);
          border-color: rgba(194,101,42,.34);
        }

        .admd-stat p {
          margin: 0 0 10px;
          color: var(--outline);
          font-size: .7rem;
          font-weight: 900;
          letter-spacing: .18em;
          text-transform: uppercase;
        }

        .admd-stat div {
          display: flex;
          align-items: baseline;
          gap: 14px;
          flex-wrap: wrap;
        }

        .admd-stat strong {
          color: var(--text);
          font-family: 'EB Garamond', serif;
          font-size: clamp(2.2rem, 3vw, 3.3rem);
          font-style: italic;
          font-weight: 600;
          line-height: 1;
        }

        .admd-stat span {
          color: var(--primary);
          font-size: .84rem;
          font-weight: 800;
        }

        .admd-stat small {
          display: block;
          margin-top: 10px;
          color: var(--muted);
          font-size: .82rem;
        }

        .admd-stat--tertiary span {
          color: var(--tertiary);
        }

        .admd-content-grid {
          display: grid;
          grid-template-columns: minmax(0, 8fr) minmax(320px, 4fr);
          gap: 42px;
          margin-bottom: 38px;
        }

        .admd-section-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 28px;
        }

        .admd-section-head h2,
        .admd-activity-panel h2 {
          margin: 0;
          color: var(--text);
          font-family: 'EB Garamond', serif;
          font-size: clamp(1.9rem, 2.6vw, 2.45rem);
          font-style: italic;
          font-weight: 600;
          line-height: 1.05;
        }

        .admd-section-head div {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .admd-section-head a {
          min-height: 40px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 16px;
          border: 1px solid var(--outline-soft);
          border-radius: 8px;
          color: var(--text);
          text-decoration: none;
          font-size: .85rem;
          font-weight: 700;
          transition: background .16s, color .16s, border-color .16s;
        }

        .admd-section-head a:hover {
          background: var(--surface-high);
        }

        .admd-section-head .admd-primary-link {
          border-color: transparent;
          background: var(--primary);
          color: #fff;
          box-shadow: 0 14px 28px rgba(194,101,42,.18);
        }

        .admd-chart-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 28px;
        }

        .admd-chart-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 0;
          min-height: 430px;
          padding: 34px 30px;
          border: 1px solid var(--outline-soft);
          border-radius: 16px;
          background: var(--surface-lowest);
          box-shadow: 0 2px 16px var(--shadow);
        }

        .admd-donut-shell {
          position: relative;
          width: min(260px, 100%);
          height: 250px;
          filter: drop-shadow(0 22px 22px rgba(58,48,42,.12));
        }

        .admd-donut-center {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding-top: 4px;
          pointer-events: none;
        }

        .admd-donut-center strong {
          color: var(--text);
          font-family: 'EB Garamond', serif;
          font-size: 2.25rem;
          font-style: italic;
          font-weight: 600;
          line-height: 1;
        }

        .admd-donut-center span {
          margin-top: 7px;
          color: var(--outline);
          font-size: .62rem;
          font-weight: 900;
          letter-spacing: .18em;
          text-transform: uppercase;
        }

        .admd-legend {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 13px;
          margin-top: 12px;
        }

        .admd-legend-row {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 10px;
          color: var(--muted);
          font-size: .86rem;
          font-weight: 600;
        }

        .admd-legend-row strong {
          color: var(--outline);
          font-size: .82rem;
        }

        .admd-legend-dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
        }

        .admd-finance-note {
          width: 100%;
          margin-top: 12px;
          text-align: center;
        }

        .admd-finance-note h3 {
          margin: 0 0 8px;
          color: var(--text);
          font-family: 'EB Garamond', serif;
          font-size: 1.45rem;
          font-style: italic;
          font-weight: 600;
        }

        .admd-finance-note p {
          max-width: 320px;
          margin: 0 auto;
          color: var(--muted);
          font-size: .82rem;
          line-height: 1.75;
        }

        .admd-activity-panel {
          min-width: 0;
        }

        .admd-activity-panel h2 {
          margin-bottom: 28px;
        }

        .admd-activity-list {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .admd-activity {
          display: grid;
          grid-template-columns: 48px minmax(0, 1fr);
          gap: 18px;
          padding: 14px;
          border-radius: 12px;
          color: inherit;
          transition: background .16s;
        }

        .admd-activity:hover {
          background: var(--surface-low);
        }

        .admd-activity-icon {
          width: 48px;
          height: 48px;
          border-radius: 999px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .admd-activity-icon--primary { background: rgba(194,101,42,.14); color: var(--primary); }
        .admd-activity-icon--secondary { background: rgba(120,112,106,.18); color: var(--secondary); }
        .admd-activity-icon--tertiary { background: rgba(140,60,60,.12); color: var(--tertiary); }
        .admd-activity-icon--warning { background: rgba(224,136,80,.16); color: #b45309; }

        .admd-activity-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
          padding-bottom: 6px;
        }

        .admd-activity-top strong {
          color: var(--text);
          font-size: .9rem;
          font-weight: 800;
        }

        .admd-activity-top span {
          color: var(--outline);
          font-size: .65rem;
          font-weight: 800;
          letter-spacing: .08em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .admd-activity p {
          margin: 0;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--outline-soft);
          color: var(--muted);
          font-size: .78rem;
          font-style: italic;
          line-height: 1.65;
        }

        .admd-empty {
          padding: 18px;
          border: 1px dashed var(--outline-soft);
          border-radius: 12px;
          color: var(--muted);
          font-size: .86rem;
        }

        .admd-history-link {
          width: 100%;
          margin-top: 22px;
          padding: 18px 0 0;
          border-top: 1px solid var(--outline-soft);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: var(--primary);
          font-size: .72rem;
          font-weight: 900;
          letter-spacing: .18em;
          text-transform: uppercase;
          text-decoration: none;
          transition: color .16s, gap .16s;
        }

        .admd-history-link:hover {
          gap: 14px;
          color: var(--tertiary);
        }

        .admd-bottom-grid {
          display: grid;
          grid-template-columns: minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr);
          gap: 22px;
        }

        .admd-feature,
        .admd-mini-card {
          min-width: 0;
          min-height: 250px;
          border-radius: 16px;
          text-decoration: none;
          color: inherit;
          overflow: hidden;
        }

        .admd-feature {
          position: relative;
          display: flex;
          align-items: flex-end;
          padding: 34px;
          background:
            linear-gradient(to top, rgba(58,48,42,.86), rgba(58,48,42,.35), rgba(58,48,42,.04)),
            radial-gradient(circle at 18% 22%, rgba(250,245,238,.9), transparent 28%),
            linear-gradient(135deg, #c2652a, #8c3c3c 48%, #3a302a);
          transition: transform .25s;
        }

        .admd-feature:hover {
          transform: translateY(-3px);
        }

        .admd-feature p,
        .admd-feature h3,
        .admd-feature span {
          position: relative;
          z-index: 1;
          color: #fff;
        }

        .admd-feature p {
          margin: 0 0 8px;
          font-size: .68rem;
          font-weight: 900;
          letter-spacing: .18em;
          text-transform: uppercase;
          opacity: .78;
        }

        .admd-feature h3 {
          max-width: 440px;
          margin: 0 0 10px;
          font-family: 'EB Garamond', serif;
          font-size: 2rem;
          font-style: italic;
          font-weight: 600;
          line-height: 1.05;
        }

        .admd-feature span {
          display: block;
          max-width: 440px;
          font-size: .86rem;
          line-height: 1.7;
          opacity: .8;
        }

        .admd-mini-card {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 28px;
          border: 1px solid var(--outline-soft);
          background: rgba(230,224,214,.34);
          transition: transform .18s, background .18s;
        }

        .admd-mini-card:hover {
          transform: translateY(-2px);
          background: var(--surface-high);
        }

        .admd-mini-card > .material-symbols-outlined {
          color: var(--primary);
          font-size: 28px;
        }

        .admd-mini-card h3 {
          margin: 18px 0 8px;
          color: var(--text);
          font-family: 'EB Garamond', serif;
          font-size: 1.55rem;
          font-style: italic;
          font-weight: 600;
        }

        .admd-mini-card p {
          margin: 0;
          color: var(--muted);
          font-size: .82rem;
          line-height: 1.7;
        }

        .admd-mini-card small {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin-top: 18px;
          color: var(--primary);
          font-size: .66rem;
          font-weight: 900;
          letter-spacing: .17em;
          text-transform: uppercase;
        }

        .admd-mini-card small .material-symbols-outlined {
          font-size: 16px;
        }

        .admd-mini-card--primary {
          border-color: transparent;
          background: var(--primary);
          box-shadow: 0 22px 42px rgba(194,101,42,.22);
        }

        .admd-mini-card--primary,
        .admd-mini-card--primary h3,
        .admd-mini-card--primary p,
        .admd-mini-card--primary small,
        .admd-mini-card--primary > .material-symbols-outlined {
          color: #fff;
        }

        .admd-mini-card--primary p,
        .admd-mini-card--primary > .material-symbols-outlined {
          opacity: .72;
        }

        .al-root.al-dark .admd-root {
          --surface: #191512;
          --surface-lowest: rgba(43,35,29,.72);
          --surface-low: #241f1a;
          --surface-high: #2e2721;
          --surface-highest: #382f27;
          --outline: #b9aaa0;
          --outline-soft: rgba(210,194,181,.18);
          --text: #f8efe5;
          --muted: #d5c8bc;
          --primary: #f0a878;
          --primary-soft: rgba(240,168,120,.18);
          --secondary: #cec6be;
          --tertiary: #e8a0a0;
          --shadow: rgba(0,0,0,.32);
          background: var(--surface);
        }

        .al-root.al-dark .admd-stat:hover {
          background: rgba(55,45,38,.92);
        }

        .al-root.al-dark .admd-section-head a {
          background: rgba(255,255,255,.03);
        }

        .al-root.al-dark .admd-section-head .admd-primary-link,
        .al-root.al-dark .admd-mini-card--primary {
          background: linear-gradient(135deg, #c2652a, #8c3c3c);
        }

        .al-root.al-dark .admd-feature {
          background:
            linear-gradient(to top, rgba(8,7,6,.9), rgba(25,21,18,.42), rgba(25,21,18,.1)),
            radial-gradient(circle at 20% 20%, rgba(240,168,120,.42), transparent 26%),
            linear-gradient(135deg, #6f351b, #5b2727 48%, #15110e);
        }

        .al-root.al-dark .recharts-tooltip-wrapper {
          color: #3a302a;
        }

        @media (max-width: 1180px) {
          .admd-hero,
          .admd-content-grid,
          .admd-bottom-grid {
            grid-template-columns: 1fr;
          }

          .admd-content-grid,
          .admd-bottom-grid {
            display: grid;
          }
        }

        @media (max-width: 920px) {
          .admd-root {
            padding: 26px 18px;
          }

          .admd-hero {
            flex-direction: column;
            margin-bottom: 30px;
          }

          .admd-admin-card {
            width: 100%;
            justify-content: space-between;
            padding-top: 8px;
          }

          .admd-admin-text {
            text-align: left;
          }

          .admd-stats-grid,
          .admd-chart-grid {
            grid-template-columns: 1fr;
          }

          .admd-stat:nth-child(4) {
            grid-column: auto;
            display: block;
          }
        }

        @media (max-width: 640px) {
          .admd-root {
            padding: 20px 14px 28px;
          }

          .admd-title {
            font-size: clamp(2.3rem, 14vw, 3.3rem);
          }

          .admd-subtitle {
            font-size: .92rem;
          }

          .admd-admin-card {
            align-items: flex-start;
            gap: 12px;
          }

          .admd-avatar {
            width: 54px;
            height: 54px;
          }

          .admd-stat,
          .admd-chart-card,
          .admd-feature,
          .admd-mini-card {
            padding: 22px;
            border-radius: 12px;
          }

          .admd-content-grid {
            gap: 28px;
          }

          .admd-section-head {
            margin-bottom: 18px;
          }

          .admd-section-head div,
          .admd-section-head a {
            width: 100%;
          }

          .admd-chart-card {
            min-height: 390px;
          }

          .admd-donut-shell {
            height: 220px;
          }

          .admd-activity {
            grid-template-columns: 42px minmax(0, 1fr);
            padding: 10px 0;
          }

          .admd-activity-icon {
            width: 42px;
            height: 42px;
          }

          .admd-activity-top {
            flex-direction: column;
            gap: 2px;
          }

          .admd-feature,
          .admd-mini-card {
            min-height: 210px;
          }
        }
      `}</style>
    </AdminLayout>
  )
}
