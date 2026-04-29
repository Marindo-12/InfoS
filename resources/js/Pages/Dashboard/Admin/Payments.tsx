import AdminLayout from '@/Layouts/AdminLayout'
import { Head, usePage } from '@inertiajs/react'
import {
  Area, AreaChart, CartesianGrid,
  Cell, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'

/* ═══════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════ */
type Stat             = { label: string; value: string; sub: string; accent: 'orange'|'blue'|'green'|'slate' }
type Summary          = { totalExpected: string; totalCollected: string; completion: number }
type RevenuePoint     = { month: string; collected: number; pending: number }
type DistributionPoint= { name: string; value: number; color: string }
type RecentPayment    = { reference: string; student: string; course: string; method: string; amount: string; status: 'paid'|'pending'; date: string }
type PaymentRow       = { reference: string; student: string; email: string; course: string; method: string; amount: string; status: 'paid'|'pending'; date: string; remaining: string }
type UpcomingInstallment = { student: string; course: string; title: string; amount: string; dueDate: string }

type PageProps = {
  auth:                 { user: { id: number; name: string; email: string } }
  stats:                Stat[]
  summary:              Summary
  monthlyRevenue:       RevenuePoint[]
  statusDistribution:   DistributionPoint[]
  recentPayments:       RecentPayment[]
  payments:             PaymentRow[]
  upcomingInstallments: UpcomingInstallment[]
}

/* ═══════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════ */
function statusMeta(status: 'paid'|'pending') {
  return status === 'paid'
    ? { label: 'Payé',       cls: 'admp-status admp-status--green' }
    : { label: 'En attente', cls: 'admp-status admp-status--amber' }
}

function fmtDh(value: number | string | undefined) {
  return `${Number(value ?? 0).toLocaleString('fr-FR')} DH`
}

function initials(name: string) {
  return name.split(' ').map(p => p[0]).slice(0, 2).join('')
}

/* ═══════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════ */
export default function AdminPayments() {
  const { props } = usePage<PageProps>()
  const {
    stats, summary, monthlyRevenue,
    statusDistribution, recentPayments,
    payments, upcomingInstallments,
  } = props

  return (
    <AdminLayout
      header={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Manrope, sans-serif' }}>
          <span style={{ fontSize: '.8rem', color: '#b0a49a' }}>Administration</span>
          <span style={{ color: '#b0a49a', fontSize: '.8rem' }}>/</span>
          <span style={{ fontSize: '.82rem', fontWeight: 700, color: '#1a1612' }}>Paiements</span>
        </div>
      }
    >
      <Head title="Gestion des paiements" />

      <div className="admp-root">

        {/* ── Page header ── */}
        <header className="admp-header">
          <div>
            <p className="admp-kicker">Administration</p>
            <h1 className="admp-title">Pilotage des paiements</h1>
            <p className="admp-subtitle">
              Vue claire sur les encaissements, les soldes restants et les échéances à surveiller pour garder le suivi financier du centre sous contrôle.
            </p>
          </div>
          <div className="admp-header-chips">
            <div className="admp-chip">Objectif : {summary.totalExpected}</div>
            <div className="admp-chip admp-chip--soft">{summary.completion}% déjà recouvré</div>
          </div>
        </header>

        {/* ── Stats ── */}
        <section className="admp-stats-grid">
          {stats.map(stat => (
            <div className={`admp-stat-card admp-stat-card--${stat.accent}`} key={stat.label}>
              <p className="admp-stat-label">{stat.label}</p>
              <p className="admp-stat-value">{stat.value}</p>
              <p className="admp-stat-sub">{stat.sub}</p>
            </div>
          ))}
        </section>

        {/* ── Overview : Summary + Donut ── */}
        <section className="admp-overview-grid">

          {/* Summary card */}
          <article className="admp-panel">
            <div className="admp-section-head">
              <h2>Recouvrement global</h2>
              <span>{summary.totalCollected} encaissés</span>
            </div>

            <div className="admp-progress-block">
              <div className="admp-progress-block-head">
                <div>
                  <p className="admp-stat-label">Progression financière</p>
                  <p className="admp-progress-value">{summary.completion}%</p>
                </div>
                <span className="admp-status admp-status--green">Suivi actif</span>
              </div>
              <div className="admp-track-lg">
                <div className="admp-fill" style={{ width: `${summary.completion}%` }} />
              </div>
              <p className="admp-note">
                Le centre a sécurisé une grande partie des encaissements. Les paiements en attente et les échéances ouvertes restent visibles ci-dessous.
              </p>
            </div>

            <div className="admp-recent-list">
              {recentPayments.map(payment => {
                const s = statusMeta(payment.status)
                return (
                  <div className="admp-recent-payment" key={payment.reference}>
                    <div>
                      <strong>{payment.student}</strong>
                      <span>{payment.course} · {payment.method}</span>
                    </div>
                    <div className="admp-recent-meta">
                      <strong>{payment.amount}</strong>
                      <span>{payment.date}</span>
                    </div>
                    <span className={s.cls}>{s.label}</span>
                  </div>
                )
              })}
            </div>
          </article>

          {/* Donut */}
          <article className="admp-panel">
            <div className="admp-section-head">
              <h2>Répartition</h2>
              <span>lecture instantanée</span>
            </div>

            <div className="admp-donut-wrap">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    dataKey="value" nameKey="name"
                    innerRadius={62} outerRadius={90}
                    paddingAngle={3} stroke="none"
                  >
                    {statusDistribution.map(entry => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: any) => fmtDh(v)} />
                </PieChart>
              </ResponsiveContainer>
              <div className="admp-donut-center">
                <strong>{summary.completion}%</strong>
                <span>recouvré</span>
              </div>
            </div>

            <div className="admp-legend">
              {statusDistribution.map(entry => (
                <div className="admp-legend-row" key={entry.name}>
                  <span className="admp-legend-dot" style={{ background: entry.color }} />
                  <span>{entry.name}</span>
                  <strong>{entry.value.toLocaleString('fr-FR')} DH</strong>
                </div>
              ))}
            </div>
          </article>
        </section>

        {/* ── Area chart ── */}
        <section className="admp-panel admp-chart-section">
          <div className="admp-section-head">
            <h2>Évolution mensuelle</h2>
            <span>encaissements & attente</span>
          </div>
          <div className="admp-area-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenue}>
                <defs>
                  <linearGradient id="admCollected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#c2652a" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#c2652a" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="admPending" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#64748b" stopOpacity={0.22} />
                    <stop offset="95%" stopColor="#64748b" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="rgba(15,23,42,0.07)" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#8b8b8b', fontSize: 12, fontFamily: 'Manrope' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#8b8b8b', fontSize: 12, fontFamily: 'Manrope' }} tickFormatter={v => v > 0 ? `${v/1000}k` : '0'} />
                <Tooltip formatter={(v: any) => fmtDh(v)} />
                <Area type="monotone" dataKey="pending"   stroke="#64748b" fill="url(#admPending)"   strokeWidth={2}   name="En attente" />
                <Area type="monotone" dataKey="collected" stroke="#c2652a" fill="url(#admCollected)" strokeWidth={2.5} name="Encaissé"   />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* ── Table + Upcoming ── */}
        <section className="admp-bottom-grid">

          {/* Payments table */}
          <article className="admp-panel">
            <div className="admp-section-head">
              <h2>Liste des paiements</h2>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <span>{payments.length} opération{payments.length > 1 ? 's' : ''}</span>
                <button className="admp-export-btn">
                  <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>download</span>
                  Exporter
                </button>
              </div>
            </div>
            <div className="admp-table-wrap">
              <table className="admp-table">
                <thead>
                  <tr>
                    <th>Référence</th>
                    <th>Étudiant</th>
                    <th>Formation</th>
                    <th>Montant</th>
                    <th>Mode</th>
                    <th>Statut</th>
                    <th>Date</th>
                    <th>Reste</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map(payment => {
                    const s = statusMeta(payment.status)
                    return (
                      <tr key={payment.reference}>
                        <td style={{ fontFamily: 'monospace', fontSize: '.78rem', color: '#8b8b8b' }}>
                          {payment.reference}
                        </td>
                        <td>
                          <div className="admp-student-cell">
                            <div className="admp-av">{initials(payment.student)}</div>
                            <div>
                              <strong>{payment.student}</strong>
                              <span>{payment.email}</span>
                            </div>
                          </div>
                        </td>
                        <td>{payment.course}</td>
                        <td className="admp-amount">{payment.amount}</td>
                        <td style={{ color: '#6b7280' }}>{payment.method}</td>
                        <td><span className={s.cls}>{s.label}</span></td>
                        <td style={{ color: '#6b7280', whiteSpace: 'nowrap' }}>{payment.date}</td>
                        <td style={{ fontWeight: 700, color: payment.remaining === '0 DH' ? '#10b981' : '#b45309' }}>
                          {payment.remaining}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </article>

          {/* Upcoming installments */}
          <article className="admp-panel">
            <div className="admp-section-head">
              <h2>Échéances à relancer</h2>
              <span>{upcomingInstallments.length} priorité{upcomingInstallments.length > 1 ? 's' : ''}</span>
            </div>
            <div className="admp-installments">
              {upcomingInstallments.map(inst => (
                <div className="admp-inst-card" key={`${inst.student}-${inst.title}`}>
                  <div className="admp-inst-top">
                    <div>
                      <strong>{inst.student}</strong>
                      <span>{inst.course}</span>
                    </div>
                    <span className="admp-status admp-status--amber">{inst.amount}</span>
                  </div>
                  <p style={{ fontSize: '.82rem', color: '#18181b', margin: '4px 0 2px' }}>{inst.title}</p>
                  <small style={{ color: '#9ca3af', fontSize: '.72rem' }}>Échéance prévue le {inst.dueDate}</small>
                  <button className="admp-relance-btn">Envoyer un rappel →</button>
                </div>
              ))}
            </div>
          </article>
        </section>

      </div>

      {/* ═══════════════════════════
          STYLES
      ═══════════════════════════ */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@600;700&family=Manrope:wght@400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');
        .material-symbols-outlined {
          font-variation-settings:'FILL' 0,'wght' 300,'GRAD' 0,'opsz' 24;
          font-family:'Material Symbols Outlined';
          font-style:normal; line-height:1;
          letter-spacing:normal; text-transform:none;
          display:inline-block; white-space:nowrap;
          -webkit-font-smoothing:antialiased;
        }

        .admp-root {
          padding: 28px;
          font-family: 'Manrope', sans-serif;
          color: #18181b; min-height: 100%;
        }

        /* Header */
        .admp-header {
          display: flex; justify-content: space-between;
          gap: 20px; align-items: flex-end; flex-wrap: wrap;
          background: radial-gradient(circle at top right, rgba(194,101,42,.1), transparent 40%), #fff;
          border: 1px solid rgba(15,23,42,.07);
          box-shadow: 0 4px 20px rgba(15,23,42,.04);
          border-radius: 20px; padding: 28px;
          margin-bottom: 22px;
        }
        .admp-kicker {
          margin: 0 0 6px; font-size: .72rem; font-weight: 800;
          letter-spacing: .14em; text-transform: uppercase; color: #c2652a;
        }
        .admp-title {
          margin: 0; font-family: 'EB Garamond', serif;
          font-size: clamp(1.8rem, 3vw, 2.8rem); line-height: 1;
        }
        .admp-subtitle {
          margin: 12px 0 0; color: #6b7280;
          max-width: 600px; line-height: 1.7; font-size: .9rem;
        }
        .admp-header-chips { display: flex; flex-direction: column; gap: 10px; }
        .admp-chip {
          padding: 10px 16px; border-radius: 99px;
          background: #fff; color: #8f4c2d;
          border: 1px solid rgba(194,101,42,.18);
          font-size: .8rem; font-weight: 800; width: fit-content;
        }
        .admp-chip--soft { color: #6b7280; border-color: rgba(15,23,42,.08); border-radius: 14px; }

        /* Stats */
        .admp-stats-grid {
          display: grid;
          grid-template-columns: repeat(4,1fr);
          gap: 16px; margin-bottom: 22px;
        }
        .admp-stat-card {
          background: #fff;
          border: 1px solid rgba(15,23,42,.07);
          box-shadow: 0 2px 12px rgba(15,23,42,.04);
          border-radius: 16px; padding: 20px;
          transition: transform .2s, box-shadow .2s;
        }
        .admp-stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(15,23,42,.07); }
        .admp-stat-label {
          margin: 0 0 8px; color: #8b8b8b;
          font-size: .7rem; font-weight: 800;
          text-transform: uppercase; letter-spacing: .12em;
        }
        .admp-stat-value {
          margin: 0; font-family: 'EB Garamond', serif;
          font-size: 2rem; line-height: 1; color: #18181b;
        }
        .admp-stat-sub { margin: 8px 0 0; color: #6b7280; font-size: .8rem; }
        .admp-stat-card--orange { border-top: 3px solid #c2652a; }
        .admp-stat-card--blue   { border-top: 3px solid #3b82f6; }
        .admp-stat-card--green  { border-top: 3px solid #10b981; }
        .admp-stat-card--slate  { border-top: 3px solid #64748b; }

        /* Panels */
        .admp-panel {
          background: #fff;
          border: 1px solid rgba(15,23,42,.07);
          box-shadow: 0 4px 20px rgba(15,23,42,.04);
          border-radius: 20px; padding: 24px;
        }
        .admp-section-head {
          display: flex; align-items: center;
          justify-content: space-between; gap: 12px;
          margin-bottom: 16px; flex-wrap: wrap;
        }
        .admp-section-head h2 {
          margin: 0; font-family: 'EB Garamond', serif;
          font-size: 1.6rem; color: #18181b;
        }
        .admp-section-head > span { color: #8b8b8b; font-size: .78rem; font-weight: 700; }

        /* Overview grid */
        .admp-overview-grid {
          display: grid;
          grid-template-columns: 1.35fr 0.85fr;
          gap: 18px; margin-bottom: 22px;
        }

        /* Progress block */
        .admp-progress-block {
          padding: 20px; border-radius: 16px;
          background: linear-gradient(180deg, #fffaf6, #fff);
          border: 1px solid rgba(15,23,42,.06);
          margin-bottom: 16px;
        }
        .admp-progress-block-head {
          display: flex; justify-content: space-between;
          align-items: flex-start; gap: 12px; flex-wrap: wrap;
        }
        .admp-progress-value {
          margin: 0; font-family: 'EB Garamond', serif;
          font-size: 2.6rem; color: #c2652a; line-height: 1;
        }
        .admp-track-lg {
          width: 100%; height: 10px;
          border-radius: 99px; overflow: hidden;
          background: #ece8e4; margin-top: 16px;
        }
        .admp-fill {
          height: 100%; border-radius: inherit;
          background: linear-gradient(90deg, #e8915a, #c2652a);
          transition: width .8s cubic-bezier(.4,0,.2,1);
        }
        .admp-note { margin: 10px 0 0; color: #6b7280; font-size: .82rem; line-height: 1.7; }

        /* Recent payments */
        .admp-recent-list { display: flex; flex-direction: column; gap: 10px; }
        .admp-recent-payment {
          display: grid; grid-template-columns: 1fr auto auto;
          align-items: center; gap: 12px;
          padding: 14px; border-radius: 14px;
          background: #fafafa;
          border: 1px solid rgba(15,23,42,.06);
        }
        .admp-recent-payment strong { display: block; color: #18181b; font-weight: 700; font-size: .84rem; }
        .admp-recent-payment span  { color: #6b7280; font-size: .76rem; }
        .admp-recent-meta { text-align: right; }
        .admp-recent-meta strong { display: block; color: #18181b; font-weight: 800; }
        .admp-recent-meta span   { color: #9ca3af; font-size: .72rem; }

        /* Donut */
        .admp-donut-wrap { position: relative; width: 100%; height: 220px; margin-top: 8px; }
        .admp-donut-center {
          position: absolute; inset: 0;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          pointer-events: none;
        }
        .admp-donut-center strong { font-size: 1.8rem; color: #18181b; font-family: 'EB Garamond',serif; }
        .admp-donut-center span { font-size: .72rem; font-weight: 800; text-transform: uppercase; letter-spacing: .1em; color: #8b8b8b; margin-top: 4px; }
        .admp-legend { display: flex; flex-direction: column; gap: 10px; margin-top: 10px; }
        .admp-legend-row {
          display: grid; grid-template-columns: auto 1fr auto;
          align-items: center; gap: 10px; font-size: .84rem; color: #6b7280;
        }
        .admp-legend-dot { width: 10px; height: 10px; border-radius: 50%; }
        .admp-legend-row strong { color: #18181b; font-size: .82rem; }

        /* Chart section */
        .admp-chart-section { margin-bottom: 22px; }
        .admp-area-wrap {
          width: 100%; height: 300px; margin-top: 12px;
          padding: 12px 8px 0;
          border-radius: 16px;
          background: linear-gradient(180deg, #fffaf6, #fff);
          border: 1px solid rgba(15,23,42,.06);
        }

        /* Bottom grid */
        .admp-bottom-grid {
          display: grid;
          grid-template-columns: 1.5fr 0.8fr;
          gap: 18px;
        }

        /* Table */
        .admp-table-wrap { overflow-x: auto; border-radius: 14px; border: 1px solid rgba(15,23,42,.06); margin-top: 12px; }
        .admp-table { width: 100%; min-width: 900px; border-collapse: collapse; background: #fff; }
        .admp-table thead tr { background: #faf8f5; }
        .admp-table th, .admp-table td {
          padding: 13px 16px;
          border-bottom: 1px solid rgba(15,23,42,.06);
          text-align: left; font-size: .83rem;
        }
        .admp-table th { color: #8b8b8b; font-size: .67rem; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; }
        .admp-table tbody tr:last-child td { border-bottom: none; }
        .admp-table tbody tr:hover { background: #fffaf6; }
        .admp-student-cell { display: flex; align-items: center; gap: 10px; }
        .admp-student-cell strong { display: block; color: #18181b; font-weight: 700; font-size: .84rem; }
        .admp-student-cell span  { display: block; color: #6b7280; font-size: .72rem; }
        .admp-av {
          width: 36px; height: 36px; flex-shrink: 0;
          border-radius: 10px;
          background: linear-gradient(135deg, #c2652a, #e8915a);
          color: #fff; font-weight: 800; font-size: .7rem;
          display: flex; align-items: center; justify-content: center;
        }
        .admp-amount { font-weight: 800; color: #18181b; font-family: 'EB Garamond',serif; font-size: .96rem; }

        /* Status */
        .admp-status {
          display: inline-flex; align-items: center;
          padding: 4px 10px; border-radius: 99px;
          font-size: .67rem; font-weight: 800;
          text-transform: uppercase; letter-spacing: .06em; width: fit-content;
        }
        .admp-status--green { background: rgba(16,185,129,.12); color: #0f9d70; }
        .admp-status--amber { background: rgba(245,158,11,.14); color: #b45309; }
        .admp-status--red   { background: rgba(239,68,68,.12);  color: #dc2626; }

        /* Export btn */
        .admp-export-btn {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 5px 12px; border-radius: 8px;
          border: 1px solid rgba(0,0,0,.09);
          background: #faf8f5; color: #6b7280;
          font-family: 'Manrope',sans-serif; font-size: .74rem; font-weight: 700;
          cursor: pointer; transition: background .15s, color .15s;
        }
        .admp-export-btn:hover { background: #fff3ec; color: #c2652a; border-color: rgba(194,101,42,.3); }

        /* Installments */
        .admp-installments { display: flex; flex-direction: column; gap: 12px; }
        .admp-inst-card {
          padding: 16px; border-radius: 14px;
          background: #fafafa;
          border: 1px solid rgba(15,23,42,.06);
          transition: border-color .15s;
        }
        .admp-inst-card:hover { border-color: rgba(194,101,42,.3); background: #fffaf6; }
        .admp-inst-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; }
        .admp-inst-top strong { display: block; color: #18181b; font-weight: 700; font-size: .84rem; }
        .admp-inst-top span   { color: #6b7280; font-size: .74rem; display: block; margin-top: 2px; }
        .admp-relance-btn {
          margin-top: 10px;
          display: inline-block; font-size: .72rem;
          font-weight: 800; color: #c2652a; background: none;
          border: none; cursor: pointer; padding: 0;
          font-family: 'Manrope',sans-serif;
          transition: opacity .15s;
        }
        .admp-relance-btn:hover { opacity: .7; }

        /* Responsive */
        @media (max-width: 1180px) {
          .admp-stats-grid, .admp-overview-grid, .admp-bottom-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 640px) {
          .admp-root { padding: 16px; }
          .admp-header, .admp-panel { padding: 18px; border-radius: 16px; }
          .admp-recent-payment { grid-template-columns: 1fr; }
          .admp-stats-grid { grid-template-columns: 1fr; }
        }
      `}</style>

    </AdminLayout>
  )
}