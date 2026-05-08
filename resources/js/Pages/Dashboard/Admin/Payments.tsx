import AdminLayout from '@/Layouts/AdminLayout'
import { Head, usePage } from '@inertiajs/react'
import { useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type Stat = { label: string; value: string; sub: string; accent: 'orange' | 'blue' | 'green' | 'slate' }
type Summary = { totalExpected: string; totalCollected: string; completion: number }
type RevenuePoint = { month: string; collected: number; pending: number }
type DistributionPoint = { name: string; value: number; color: string }
type RecentPayment = { reference: string; student: string; course: string; method: string; amount: string; status: 'paid' | 'pending'; date: string }
type PaymentRow = { reference: string; student: string; email: string; course: string; method: string; amount: string; status: 'paid' | 'pending'; date: string; remaining: string }
type UpcomingInstallment = { student: string; course: string; title: string; amount: string; dueDate: string }

type PageProps = {
  auth: { user: { id: number; name: string; email: string } }
  stats: Stat[]
  summary: Summary
  monthlyRevenue: RevenuePoint[]
  statusDistribution: DistributionPoint[]
  recentPayments: RecentPayment[]
  payments: PaymentRow[]
  upcomingInstallments: UpcomingInstallment[]
}

const PAGE_SIZE = 6

function initials(name: string) {
  return name.split(' ').filter(Boolean).map(part => part[0]).slice(0, 2).join('').toUpperCase()
}

function fmtDh(value: number | string | undefined) {
  return `${Number(value ?? 0).toLocaleString('fr-FR')} DH`
}

function statusMeta(status: 'paid' | 'pending') {
  return status === 'paid'
    ? { label: 'Paye', cls: 'pay-status pay-status--paid' }
    : { label: 'En attente', cls: 'pay-status pay-status--pending' }
}

function csvEscape(value: string | number | null | undefined) {
  return `"${String(value ?? '').replaceAll('"', '""')}"`
}

export default function AdminPayments() {
  const { props } = usePage<PageProps>()
  const { stats, summary, monthlyRevenue, statusDistribution, payments, upcomingInstallments } = props
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const filteredPayments = useMemo(() => {
    const q = search.trim().toLowerCase()
    return payments.filter(payment => !q || [
      payment.reference,
      payment.student,
      payment.email,
      payment.course,
      payment.method,
      payment.status,
    ].some(value => value.toLowerCase().includes(q)))
  }, [payments, search])

  const totalPages = Math.max(1, Math.ceil(filteredPayments.length / PAGE_SIZE))
  const safePage = Math.min(currentPage, totalPages)
  const paginatedPayments = filteredPayments.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
  const pendingAmount = statusDistribution
    .filter(item => item.name !== 'Regle')
    .reduce((sum, item) => sum + item.value, 0)

  const exportCsv = () => {
    const header = ['Reference', 'Etudiant', 'Email', 'Formation', 'Montant', 'Mode', 'Statut', 'Date', 'Reste']
    const rows = filteredPayments.map(payment => [
      payment.reference,
      payment.student,
      payment.email,
      payment.course,
      payment.amount,
      payment.method,
      statusMeta(payment.status).label,
      payment.date,
      payment.remaining,
    ])
    const csv = [header, ...rows].map(row => row.map(csvEscape).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'rapport-paiements.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

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
      <Head title="Pilotage des paiements" />

      <main className="pay-root">
        <header className="pay-hero">
          <div>
            <h1>Pilotage des Paiements</h1>
            <p>Suivi analytique et gestion du recouvrement financier pour Info Saloua.</p>
          </div>
          <button type="button" className="pay-primary" onClick={exportCsv}>
            <span className="material-symbols-outlined">ios_share</span>
            Exporter Rapport
          </button>
        </header>

        <section className="pay-metrics">
          {stats.map(stat => (
            <article className={`pay-metric pay-metric--${stat.accent}`} key={stat.label}>
              <p>{stat.label}</p>
              <div>
                <strong>{stat.value}</strong>
                {stat.label.toLowerCase().includes('recouvrement') ? (
                  <em><i style={{ width: `${summary.completion}%` }} /></em>
                ) : (
                  <span>{stat.sub}</span>
                )}
              </div>
            </article>
          ))}
        </section>

        <section className="pay-main-grid">
          <article className="pay-panel pay-table-panel">
            <div className="pay-panel-head">
              <h2>Recouvrement Global</h2>
              <label className="pay-search">
                <span className="material-symbols-outlined">search</span>
                <input
                  value={search}
                  onChange={event => { setSearch(event.target.value); setCurrentPage(1) }}
                  placeholder="Rechercher un etudiant..."
                />
              </label>
            </div>

            <div className="pay-table-wrap">
              {paginatedPayments.length === 0 ? (
                <div className="pay-empty">Aucun paiement ne correspond a votre recherche.</div>
              ) : (
                <table className="pay-table">
                  <thead>
                    <tr>
                      <th>Etudiant</th>
                      <th>Montant</th>
                      <th>Date</th>
                      <th>Statut</th>
                      <th>Reste</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedPayments.map(payment => {
                      const status = statusMeta(payment.status)
                      return (
                        <tr key={payment.reference}>
                          <td data-label="Etudiant">
                            <div className="pay-student">
                              <div className="pay-avatar">{initials(payment.student)}</div>
                              <div>
                                <strong>{payment.student}</strong>
                                <span>{payment.course}</span>
                              </div>
                            </div>
                          </td>
                          <td data-label="Montant" className="pay-amount">{payment.amount}</td>
                          <td data-label="Date">{payment.date}</td>
                          <td data-label="Statut"><span className={status.cls}>{status.label}</span></td>
                          <td data-label="Reste" className={payment.remaining === '0,00 DH' || payment.remaining === '0 DH' ? 'pay-ok' : 'pay-wait'}>{payment.remaining}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>

            <footer className="pay-table-footer">
              <p>
                Affichage de {filteredPayments.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1}-{Math.min(safePage * PAGE_SIZE, filteredPayments.length)}
                {' '}sur {filteredPayments.length} paiement{filteredPayments.length > 1 ? 's' : ''}
              </p>
              <div>
                <button type="button" disabled={safePage === 1} onClick={() => setCurrentPage(page => Math.max(1, page - 1))}>Precedent</button>
                <button type="button" disabled={safePage === totalPages} onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}>Suivant</button>
              </div>
            </footer>
          </article>

          <aside className="pay-side">
            <article className="pay-panel pay-donut-panel">
              <h2>Repartition des Fonds</h2>
              <div className="pay-donut">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={70}
                      outerRadius={92}
                      stroke="none"
                      paddingAngle={3}
                    >
                      {statusDistribution.map(entry => <Cell key={entry.name} fill={entry.color} />)}
                    </Pie>
                    <Tooltip formatter={(value: any) => fmtDh(value)} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pay-donut-center">
                  <strong>{summary.completion}%</strong>
                  <span>Recouvre</span>
                </div>
              </div>
              <div className="pay-legend">
                <div>
                  <span><i style={{ background: '#c2652a' }} />Fonds Percus</span>
                  <strong>{summary.totalCollected}</strong>
                </div>
                <div>
                  <span><i style={{ background: '#d8d0c8' }} />Fonds en Attente</span>
                  <strong>{fmtDh(pendingAmount)}</strong>
                </div>
              </div>
            </article>

            <article className="pay-panel pay-reminders">
              <div className="pay-panel-head">
                <h2>Echeances a relancer</h2>
                <span>{upcomingInstallments.length}</span>
              </div>
              <div className="pay-reminder-list">
                {upcomingInstallments.length > 0 ? upcomingInstallments.map(item => (
                  <div className="pay-reminder" key={`${item.student}-${item.title}-${item.dueDate}`}>
                    <div>
                      <strong>{item.student}</strong>
                      <span>{item.course}</span>
                      <small>{item.title} - {item.dueDate}</small>
                    </div>
                    <button type="button">Relancer</button>
                  </div>
                )) : (
                  <div className="pay-empty pay-empty--small">Aucune echeance ouverte.</div>
                )}
              </div>
            </article>
          </aside>
        </section>

        <section className="pay-panel pay-chart-section">
          <div className="pay-panel-head">
            <div>
              <h2>Evolution Mensuelle</h2>
              <p>Performance des revenus sur l'annee en cours</p>
            </div>
            <div className="pay-year-switch">
              <button type="button">2026</button>
            </div>
          </div>
          <div className="pay-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenue} margin={{ top: 12, right: 16, left: 0, bottom: 8 }}>
                <CartesianGrid vertical={false} stroke="rgba(154,144,136,.22)" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#78706a', fontSize: 11, fontWeight: 800 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#9a9088', fontSize: 11 }} tickFormatter={value => `${Math.round(Number(value) / 1000)}k`} />
                <Tooltip formatter={(value: any) => fmtDh(value)} />
                <Bar dataKey="pending" name="En attente" stackId="a" fill="#d8d0c8" radius={[0, 0, 0, 0]} />
                <Bar dataKey="collected" name="Encaisse" stackId="a" fill="#c2652a" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;600;700&family=Manrope:wght@400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');
        .material-symbols-outlined { font-family:'Material Symbols Outlined'; font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24; line-height:1; }
        .pay-root { --bg:#faf5ee; --surface:#fff; --surface-low:#f6f0e8; --line:#d8d0c8; --line-soft:rgba(216,208,200,.6); --text:#3a302a; --muted:#605850; --primary:#c2652a; --tertiary:#8c3c3c; min-height:100%; padding:48px 32px 58px; background:var(--bg); color:var(--text); font-family:'Manrope',sans-serif; }
        .pay-root *, .pay-root *::before, .pay-root *::after { box-sizing:border-box; }
        .pay-hero { display:flex; align-items:flex-end; justify-content:space-between; gap:24px; margin-bottom:44px; }
        .pay-hero h1 { margin:0; font-family:'EB Garamond',serif; font-size:clamp(2.7rem,5vw,4.6rem); line-height:.98; font-weight:700; color:var(--text); }
        .pay-hero p { max-width:720px; margin:12px 0 0; color:var(--muted); font-size:1.05rem; line-height:1.75; }
        .pay-primary { min-height:46px; display:inline-flex; align-items:center; justify-content:center; gap:9px; border:0; border-radius:8px; background:var(--primary); color:#fff; padding:0 18px; font-weight:800; cursor:pointer; box-shadow:0 14px 30px rgba(194,101,42,.18); }
        .pay-primary:hover { opacity:.9; transform:translateY(-1px); }
        .pay-metrics { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:20px; margin-bottom:32px; }
        .pay-metric { min-height:138px; border:1px solid var(--line-soft); border-radius:12px; background:#fff; padding:25px; box-shadow:0 2px 16px rgba(58,48,42,.04); }
        .pay-metric p { margin:0 0 10px; color:#78706a; font-size:.72rem; font-weight:900; letter-spacing:.15em; text-transform:uppercase; }
        .pay-metric div { display:flex; align-items:baseline; gap:10px; flex-wrap:wrap; }
        .pay-metric strong { color:var(--text); font-family:'EB Garamond',serif; font-size:clamp(1.85rem,2.8vw,2.55rem); line-height:1; }
        .pay-metric span { color:var(--muted); font-size:.74rem; font-weight:800; }
        .pay-metric em { width:72px; height:8px; display:block; overflow:hidden; border-radius:999px; background:#f2ece4; }
        .pay-metric em i { display:block; height:100%; background:var(--primary); }
        .pay-main-grid { display:grid; grid-template-columns:minmax(0,2fr) minmax(320px,.95fr); gap:26px; margin-bottom:32px; }
        .pay-panel { min-width:0; border:1px solid var(--line-soft); border-radius:12px; background:#fff; box-shadow:0 2px 16px rgba(58,48,42,.04); overflow:hidden; }
        .pay-panel-head { display:flex; align-items:center; justify-content:space-between; gap:16px; padding:22px 24px; border-bottom:1px solid var(--line-soft); flex-wrap:wrap; }
        .pay-panel h2, .pay-panel-head h2 { margin:0; font-family:'EB Garamond',serif; font-size:1.75rem; font-weight:600; color:var(--text); }
        .pay-panel-head p { margin:4px 0 0; color:var(--muted); font-size:.82rem; }
        .pay-search { position:relative; display:flex; align-items:center; }
        .pay-search .material-symbols-outlined { position:absolute; left:11px; color:#9a9088; font-size:18px; }
        .pay-search input { width:280px; height:40px; border:1px solid var(--line-soft); border-radius:8px; background:#faf5ee; padding:0 12px 0 36px; color:var(--text); outline:none; font-family:'Manrope',sans-serif; }
        .pay-search input:focus { border-color:rgba(194,101,42,.55); box-shadow:0 0 0 3px rgba(194,101,42,.1); }
        .pay-table-wrap { overflow-x:auto; }
        .pay-table { width:100%; min-width:760px; border-collapse:collapse; text-align:left; }
        .pay-table th { padding:15px 24px; background:rgba(246,240,232,.55); color:#78706a; font-size:.66rem; font-weight:900; letter-spacing:.15em; text-transform:uppercase; }
        .pay-table td { padding:17px 24px; border-top:1px solid var(--line-soft); color:var(--muted); font-size:.88rem; vertical-align:middle; }
        .pay-table tbody tr:hover { background:#f6f0e8; }
        .pay-student { display:flex; align-items:center; gap:12px; min-width:0; }
        .pay-avatar { width:36px; height:36px; flex-shrink:0; border-radius:999px; display:flex; align-items:center; justify-content:center; background:#fbe8d8; color:#8a4518; font-size:.72rem; font-weight:900; }
        .pay-student strong { display:block; color:var(--text); font-weight:800; }
        .pay-student span { display:block; color:#9a9088; font-size:.74rem; margin-top:2px; }
        .pay-amount { color:var(--text) !important; font-weight:900; }
        .pay-status { display:inline-flex; padding:5px 10px; border-radius:999px; font-size:.62rem; font-weight:900; letter-spacing:.12em; text-transform:uppercase; white-space:nowrap; }
        .pay-status--paid { background:#dcfce7; color:#166534; }
        .pay-status--pending { background:#fef3c7; color:#92400e; }
        .pay-ok { color:#047857 !important; font-weight:900; }
        .pay-wait { color:#92400e !important; font-weight:900; }
        .pay-table-footer { display:flex; justify-content:space-between; align-items:center; gap:12px; padding:18px 24px; border-top:1px solid var(--line-soft); flex-wrap:wrap; }
        .pay-table-footer p { margin:0; color:#9a9088; font-size:.78rem; font-weight:800; }
        .pay-table-footer div { display:flex; gap:8px; }
        .pay-table-footer button { min-height:36px; border:1px solid var(--line-soft); border-radius:8px; background:#fff; color:var(--text); padding:0 13px; font-weight:800; cursor:pointer; }
        .pay-table-footer button:disabled { opacity:.4; cursor:not-allowed; }
        .pay-side { display:flex; flex-direction:column; gap:24px; }
        .pay-donut-panel { padding:26px; text-align:center; }
        .pay-donut { position:relative; width:220px; height:220px; margin:20px auto; }
        .pay-donut-center { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; pointer-events:none; }
        .pay-donut-center strong { font-family:'EB Garamond',serif; font-size:2.55rem; line-height:1; color:var(--text); }
        .pay-donut-center span { margin-top:5px; color:#78706a; font-size:.68rem; font-weight:900; letter-spacing:.12em; text-transform:uppercase; }
        .pay-legend { display:flex; flex-direction:column; gap:13px; text-align:left; }
        .pay-legend div { display:flex; align-items:center; justify-content:space-between; gap:12px; }
        .pay-legend span { display:inline-flex; align-items:center; gap:8px; color:var(--muted); font-size:.86rem; }
        .pay-legend i { width:9px; height:9px; border-radius:999px; display:inline-block; }
        .pay-legend strong { color:var(--text); font-size:.84rem; }
        .pay-reminders .pay-panel-head span { min-width:28px; height:28px; border-radius:999px; display:inline-flex; align-items:center; justify-content:center; background:#fbe8d8; color:var(--primary); font-weight:900; }
        .pay-reminder-list { padding:20px 24px 24px; display:flex; flex-direction:column; gap:18px; }
        .pay-reminder { display:flex; align-items:center; justify-content:space-between; gap:14px; }
        .pay-reminder strong { display:block; color:var(--text); font-size:.88rem; }
        .pay-reminder span, .pay-reminder small { display:block; color:#9a9088; font-size:.72rem; margin-top:2px; }
        .pay-reminder small { color:var(--tertiary); font-weight:700; }
        .pay-reminder button { border:1px solid var(--primary); border-radius:8px; background:#fff; color:var(--primary); padding:7px 12px; font-size:.7rem; font-weight:900; cursor:pointer; white-space:nowrap; }
        .pay-reminder button:hover { background:#fff7f2; }
        .pay-chart-section { padding-bottom:24px; }
        .pay-chart { height:310px; padding:10px 20px 0; }
        .pay-year-switch { display:flex; background:#f2ece4; border-radius:8px; padding:4px; }
        .pay-year-switch button { border:0; background:#fff; color:var(--text); border-radius:6px; padding:7px 14px; font-weight:900; font-size:.72rem; }
        .pay-empty { padding:48px 20px; text-align:center; color:#9a9088; font-weight:700; }
        .pay-empty--small { padding:20px; border:1px dashed var(--line-soft); border-radius:10px; }
        .al-root.al-dark .pay-root { --bg:#191512; --surface:#241f1a; --surface-low:#241f1a; --line:#3b3028; --line-soft:rgba(210,194,181,.16); --text:#f8efe5; --muted:#d5c8bc; --primary:#f0a878; --tertiary:#e8a0a0; }
        .al-root.al-dark .pay-panel, .al-root.al-dark .pay-metric, .al-root.al-dark .pay-search input, .al-root.al-dark .pay-table-footer button, .al-root.al-dark .pay-reminder button { background:#241f1a; color:#d5c8bc; }
        .al-root.al-dark .pay-table th, .al-root.al-dark .pay-year-switch { background:#1f1a16; }
        .al-root.al-dark .pay-table tbody tr:hover { background:rgba(240,168,120,.07); }
        .al-root.al-dark .pay-student strong, .al-root.al-dark .pay-panel h2, .al-root.al-dark .pay-panel-head h2, .al-root.al-dark .pay-metric strong, .al-root.al-dark .pay-donut-center strong, .al-root.al-dark .pay-legend strong { color:#f8efe5; }
        .al-root.al-dark .recharts-tooltip-wrapper { color:#3a302a; }
        @media (max-width:1180px) { .pay-metrics { grid-template-columns:repeat(2,minmax(0,1fr)); } .pay-main-grid { grid-template-columns:1fr; } }
        @media (max-width:700px) { .pay-root { padding:26px 14px 42px; } .pay-hero { align-items:flex-start; flex-direction:column; margin-bottom:28px; } .pay-primary, .pay-search, .pay-search input { width:100%; } .pay-metrics { grid-template-columns:1fr; } .pay-panel-head { padding:18px; } .pay-table { min-width:680px; } .pay-table th, .pay-table td { padding:14px 16px; } .pay-donut { width:190px; height:190px; } .pay-reminder { align-items:flex-start; flex-direction:column; } .pay-reminder button { width:100%; } .pay-chart { height:250px; padding:8px 6px 0; } }
      `}</style>
    </AdminLayout>
  )
}
