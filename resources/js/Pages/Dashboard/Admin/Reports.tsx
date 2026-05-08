import AdminLayout from '@/Layouts/AdminLayout'
import { Head, router, usePage } from '@inertiajs/react'
import {
  Area,
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type ChartPoint = {
  name: string
  value: number
  color: string
}

type MonthlyPoint = {
  month: string
  revenue: number
  applications: number
  enrollments: number
}

type HistoryRow = {
  year: number
  revenue: number
  monthlyAverage: number
  students: number
  certificates: number
  approvalRate: number
}

type CourseLeader = {
  title: string
  category: string
  enrollments: number
}

type PageProps = {
  auth: {
    user: {
      id: number
      name: string
      email: string
    }
  }
  filters: {
    year: number
    availableYears: number[]
  }
  metrics: {
    annualRevenue: number
    revenueGrowth: number
    yearEnrollments: number
    activeEnrollments: number
    certificates: number
    completionRate: number
    approvalRate: number
  }
  monthlyPerformance: MonthlyPoint[]
  categoryDistribution: ChartPoint[]
  financialStatus: ChartPoint[]
  applicationStatus: ChartPoint[]
  historicalComparison: HistoryRow[]
  courseLeaders: CourseLeader[]
}

const emptyChart = [{ name: 'Aucune donnee', value: 1, color: '#cec6be' }]

function fmtDh(value: number | string | undefined) {
  return `${Number(value ?? 0).toLocaleString('fr-FR')} DH`
}

function fmtNumber(value: number | string | undefined) {
  return Number(value ?? 0).toLocaleString('fr-FR')
}

function percent(value: number, total: number) {
  return total > 0 ? Math.round((value / total) * 100) : 0
}

function changeYear(year: number) {
  router.get(route('admin.reports'), { year }, { preserveScroll: true, preserveState: false })
}

function Donut({
  data,
  centerValue,
  centerLabel,
  money,
}: {
  data: ChartPoint[]
  centerValue: string
  centerLabel: string
  money?: boolean
}) {
  const chartData = data.length > 0 ? data : emptyChart

  return (
    <div className="rep-donut">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            innerRadius={62}
            outerRadius={92}
            paddingAngle={3}
            stroke="rgba(255,255,255,.72)"
            strokeWidth={2}
          >
            {chartData.map(item => <Cell key={item.name} fill={item.color} />)}
          </Pie>
          <Tooltip
            formatter={(value: any) => money ? fmtDh(value) : fmtNumber(value)}
            contentStyle={{
              borderRadius: 10,
              border: '1px solid rgba(154,144,136,.28)',
              boxShadow: '0 18px 42px rgba(58,48,42,.13)',
              fontFamily: 'Manrope, sans-serif',
              fontSize: 12,
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="rep-donut-center">
        <strong>{centerValue}</strong>
        <span>{centerLabel}</span>
      </div>
    </div>
  )
}

export default function Reports() {
  const {
    filters,
    metrics,
    monthlyPerformance,
    categoryDistribution,
    financialStatus,
    applicationStatus,
    historicalComparison,
    courseLeaders,
  } = usePage<PageProps>().props

  const categoryTotal = categoryDistribution.reduce((sum, item) => sum + item.value, 0)
  const statusTotal = applicationStatus.reduce((sum, item) => sum + item.value, 0)
  const financialTotal = financialStatus.reduce((sum, item) => sum + item.value, 0)
  const positiveGrowth = metrics.revenueGrowth >= 0

  return (
    <AdminLayout
      header={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Manrope, sans-serif' }}>
          <span style={{ fontSize: '.8rem', color: '#b0a49a' }}>Administration</span>
          <span style={{ color: '#b0a49a', fontSize: '.8rem' }}>/</span>
          <span style={{ fontSize: '.82rem', fontWeight: 700, color: '#1a1612' }}>Rapports</span>
        </div>
      }
    >
      <Head title="Rapports annuels" />

      <main className="rep-root">
        <header className="rep-hero">
          <div className="rep-hero-copy">
            <h1>Rapports Annuels</h1>
            <p>
              Analyse consolidee de la performance academique et financiere du centre Info Saloua,
              generee depuis les inscriptions, candidatures et paiements reels.
            </p>
          </div>

          <div className="rep-actions">
            <label className="rep-select">
              <span>Annee</span>
              <select value={filters.year} onChange={event => changeYear(Number(event.target.value))}>
                {filters.availableYears.map(year => <option key={year} value={year}>{year}</option>)}
              </select>
            </label>
            <button type="button" className="rep-export" onClick={() => window.print()}>
              <span className="material-symbols-outlined">picture_as_pdf</span>
              Exporter PDF
            </button>
          </div>
        </header>

        <section className="rep-metrics">
          <article>
            <span>Revenu annuel total</span>
            <div><strong>{fmtNumber(metrics.annualRevenue)}</strong><small>DH</small></div>
          </article>
          <article>
            <span>Croissance vs annee precedente</span>
            <div>
              <strong className={positiveGrowth ? 'rep-positive' : 'rep-negative'}>
                {positiveGrowth ? '+' : ''}{metrics.revenueGrowth}%
              </strong>
              <span className="material-symbols-outlined">{positiveGrowth ? 'trending_up' : 'trending_down'}</span>
            </div>
          </article>
          <article>
            <span>Inscriptions annuelles</span>
            <div><strong>{fmtNumber(metrics.yearEnrollments)}</strong><small>etudiants</small></div>
          </article>
          <article>
            <span>Taux de validation</span>
            <div>
              <strong>{metrics.approvalRate}%</strong>
              <em><i style={{ width: `${metrics.approvalRate}%` }} /></em>
            </div>
          </article>
        </section>

        <section className="rep-panel rep-performance">
          <div className="rep-panel-head">
            <h2>Performance Mensuelle</h2>
            <div className="rep-legend-inline">
              <span><i className="rep-dot rep-dot--primary" />Revenus</span>
              <span><i className="rep-dot rep-dot--tertiary" />Candidatures</span>
              <span><i className="rep-dot rep-dot--secondary" />Inscriptions</span>
            </div>
          </div>

          <div className="rep-chart-lg">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={monthlyPerformance} margin={{ top: 12, right: 14, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="repRevenueGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#c2652a" stopOpacity={0.26} />
                    <stop offset="100%" stopColor="#c2652a" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="rgba(154,144,136,.22)" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#9a9088', fontSize: 11, fontWeight: 800 }} />
                <YAxis yAxisId="money" tickLine={false} axisLine={false} tickFormatter={value => `${Math.round(Number(value) / 1000)}k`} tick={{ fill: '#9a9088', fontSize: 11 }} />
                <YAxis yAxisId="count" orientation="right" tickLine={false} axisLine={false} tick={{ fill: '#9a9088', fontSize: 11 }} />
                <Tooltip formatter={(value: any, name: any) => name === 'revenue' ? fmtDh(value) : fmtNumber(value)} />
                <Legend />
                <Area yAxisId="money" type="monotone" dataKey="revenue" name="Revenus" stroke="#c2652a" strokeWidth={3} fill="url(#repRevenueGradient)" />
                <Bar yAxisId="count" dataKey="applications" name="Candidatures" fill="#8c3c3c" radius={[5, 5, 0, 0]} barSize={18} />
                <Line yAxisId="count" type="monotone" dataKey="enrollments" name="Inscriptions" stroke="#78706a" strokeWidth={2.5} dot={{ r: 3 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rep-grid-2">
          <article className="rep-panel rep-donut-card">
            <Donut
              data={categoryDistribution}
              centerValue={fmtNumber(categoryTotal)}
              centerLabel="Inscriptions"
            />
            <div className="rep-card-copy">
              <h3>Repartition par Pole</h3>
              {(categoryDistribution.length > 0 ? categoryDistribution : emptyChart).map(item => (
                <div className="rep-list-row" key={item.name}>
                  <span><i style={{ background: item.color }} />{item.name}</span>
                  <strong>{item.name === 'Aucune donnee' ? '0%' : `${percent(item.value, categoryTotal)}%`}</strong>
                </div>
              ))}
            </div>
          </article>

          <article className="rep-panel rep-donut-card">
            <Donut
              data={financialStatus}
              centerValue={fmtDh(financialTotal)}
              centerLabel="Total suivi"
              money
            />
            <div className="rep-card-copy">
              <h3>Statut Financier</h3>
              {(financialStatus.length > 0 ? financialStatus : emptyChart).map(item => (
                <div className="rep-list-row" key={item.name}>
                  <span><i style={{ background: item.color }} />{item.name}</span>
                  <strong>{item.name === 'Aucune donnee' ? '0 DH' : fmtDh(item.value)}</strong>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="rep-grid-2 rep-grid-bottom">
          <article className="rep-panel">
            <div className="rep-panel-head">
              <h2>Statut des Dossiers</h2>
              <p>{fmtNumber(statusTotal)} candidature(s)</p>
            </div>
            <div className="rep-status-bars">
              {(applicationStatus.length > 0 ? applicationStatus : emptyChart).map(item => (
                <div className="rep-status-row" key={item.name}>
                  <div>
                    <span>{item.name}</span>
                    <strong>{item.name === 'Aucune donnee' ? 0 : item.value}</strong>
                  </div>
                  <em><i style={{ width: `${item.name === 'Aucune donnee' ? 0 : percent(item.value, statusTotal)}%`, background: item.color }} /></em>
                </div>
              ))}
            </div>
          </article>

          <article className="rep-panel">
            <div className="rep-panel-head">
              <h2>Formations Leaders</h2>
              <p>{metrics.activeEnrollments} inscription(s) active(s)</p>
            </div>
            <div className="rep-course-list">
              {courseLeaders.length > 0 ? courseLeaders.map(course => (
                <div className="rep-course" key={`${course.title}-${course.category}`}>
                  <div>
                    <strong>{course.title}</strong>
                    <span>{course.category}</span>
                  </div>
                  <b>{course.enrollments}</b>
                </div>
              )) : (
                <div className="rep-empty">Aucune formation suivie pour cette annee.</div>
              )}
            </div>
          </article>
        </section>

        <section className="rep-history">
          <h2>Comparaison Historique</h2>
          <div className="rep-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Annee</th>
                  <th>Revenus mensuels moy.</th>
                  <th>Inscriptions</th>
                  <th>Certificats</th>
                  <th>Taux validation</th>
                </tr>
              </thead>
              <tbody>
                {historicalComparison.map(row => (
                  <tr key={row.year}>
                    <td>{row.year}{row.year === filters.year ? ' (selection)' : ''}</td>
                    <td>{fmtDh(row.monthlyAverage)}</td>
                    <td>{fmtNumber(row.students)}</td>
                    <td>{fmtNumber(row.certificates)}</td>
                    <td>{row.approvalRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;600;700&family=Manrope:wght@400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');

        .material-symbols-outlined {
          font-family: 'Material Symbols Outlined';
          font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
          line-height: 1;
        }

        .rep-root {
          --bg: #faf5ee;
          --surface: rgba(255,255,255,.72);
          --surface-low: #f6f0e8;
          --surface-high: #ece6dc;
          --outline: #9a9088;
          --outline-soft: rgba(154,144,136,.32);
          --text: #3a302a;
          --muted: #605850;
          --primary: #c2652a;
          --tertiary: #8c3c3c;
          --secondary: #78706a;
          min-height: 100%;
          padding: 46px 32px 56px;
          background: var(--bg);
          color: var(--text);
          font-family: 'Manrope', sans-serif;
        }

        .rep-root *, .rep-root *::before, .rep-root *::after { box-sizing: border-box; }
        .rep-hero { display: flex; align-items: flex-end; justify-content: space-between; gap: 28px; margin-bottom: 46px; }
        .rep-hero-copy h1 {
          margin: 0;
          font-family: 'EB Garamond', serif;
          font-size: clamp(3.1rem, 7vw, 5.7rem);
          font-weight: 700;
          line-height: .92;
          color: var(--text);
        }
        .rep-hero-copy p {
          max-width: 720px;
          margin: 18px 0 0;
          color: var(--muted);
          font-size: 1.02rem;
          line-height: 1.8;
        }

        .rep-actions { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .rep-select, .rep-export {
          min-height: 46px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          border: 1px solid var(--outline-soft);
          border-radius: 8px;
          background: var(--surface-low);
          padding: 0 14px;
        }
        .rep-select span {
          color: var(--outline);
          font-size: .66rem;
          font-weight: 900;
          letter-spacing: .16em;
          text-transform: uppercase;
        }
        .rep-select select {
          border: none;
          background: transparent;
          color: var(--text);
          font-weight: 800;
          outline: none;
        }
        .rep-export {
          border-color: transparent;
          background: var(--primary);
          color: #fff;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 16px 30px rgba(194,101,42,.18);
        }

        .rep-metrics {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          border-block: 1px solid var(--outline-soft);
          margin-bottom: 42px;
        }
        .rep-metrics article { padding: 26px 28px; border-right: 1px solid var(--outline-soft); }
        .rep-metrics article:last-child { border-right: none; }
        .rep-metrics span, .rep-panel-head p {
          color: var(--outline);
          font-size: .68rem;
          font-weight: 900;
          letter-spacing: .16em;
          text-transform: uppercase;
        }
        .rep-metrics div { display: flex; align-items: center; gap: 10px; margin-top: 9px; flex-wrap: wrap; }
        .rep-metrics strong {
          font-family: 'EB Garamond', serif;
          font-size: clamp(2.2rem, 3.7vw, 3.4rem);
          font-weight: 700;
          line-height: 1;
        }
        .rep-metrics small { color: var(--muted); font-size: .82rem; }
        .rep-positive { color: var(--text); }
        .rep-negative { color: #c0392b; }
        .rep-metrics .material-symbols-outlined { color: var(--primary); font-size: 30px; }
        .rep-metrics em, .rep-status-row em {
          display: block;
          width: 70px;
          height: 7px;
          overflow: hidden;
          border-radius: 999px;
          background: var(--surface-high);
        }
        .rep-metrics em i, .rep-status-row em i { display: block; height: 100%; background: var(--primary); }

        .rep-panel {
          min-width: 0;
          border: 1px solid var(--outline-soft);
          border-radius: 16px;
          background: var(--surface);
          box-shadow: 0 2px 18px rgba(58,48,42,.06);
        }
        .rep-performance { padding: 30px; margin-bottom: 30px; }
        .rep-panel-head { display: flex; align-items: center; justify-content: space-between; gap: 18px; margin-bottom: 22px; flex-wrap: wrap; }
        .rep-panel-head h2, .rep-history h2, .rep-card-copy h3 {
          margin: 0;
          font-family: 'EB Garamond', serif;
          color: var(--text);
          font-style: italic;
          font-weight: 700;
        }
        .rep-panel-head h2, .rep-history h2 { font-size: clamp(2rem, 3vw, 2.8rem); }
        .rep-card-copy h3 { font-size: 1.55rem; margin-bottom: 20px; }
        .rep-legend-inline { display: flex; gap: 18px; flex-wrap: wrap; }
        .rep-legend-inline span { display: inline-flex; align-items: center; gap: 7px; color: var(--muted); font-size: .82rem; }
        .rep-dot, .rep-list-row i {
          width: 9px;
          height: 9px;
          border-radius: 999px;
          display: inline-block;
          flex-shrink: 0;
        }
        .rep-dot--primary { background: var(--primary); }
        .rep-dot--tertiary { background: var(--tertiary); }
        .rep-dot--secondary { background: var(--secondary); }
        .rep-chart-lg { width: 100%; height: 410px; }
        .rep-chart-lg .recharts-legend-item-text { color: var(--muted) !important; font-size: 12px; }

        .rep-grid-2 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 30px; margin-bottom: 30px; }
        .rep-donut-card { min-height: 330px; display: grid; grid-template-columns: 260px minmax(0, 1fr); align-items: center; gap: 28px; padding: 32px; }
        .rep-donut { position: relative; width: 240px; height: 240px; filter: drop-shadow(0 18px 24px rgba(58,48,42,.11)); }
        .rep-donut-center {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }
        .rep-donut-center strong {
          max-width: 150px;
          color: var(--text);
          font-family: 'EB Garamond', serif;
          font-size: 1.9rem;
          font-weight: 700;
          line-height: 1;
          text-align: center;
        }
        .rep-donut-center span {
          margin-top: 7px;
          color: var(--outline);
          font-size: .6rem;
          font-weight: 900;
          letter-spacing: .16em;
          text-transform: uppercase;
        }
        .rep-card-copy { min-width: 0; }
        .rep-list-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 8px 0;
          color: var(--muted);
          font-size: .88rem;
        }
        .rep-list-row span { display: inline-flex; align-items: center; gap: 9px; min-width: 0; }
        .rep-list-row strong { color: var(--text); font-size: .84rem; }

        .rep-grid-bottom .rep-panel { padding: 30px; }
        .rep-status-bars, .rep-course-list { display: flex; flex-direction: column; gap: 15px; }
        .rep-status-row div, .rep-course {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        .rep-status-row span { color: var(--muted); font-weight: 700; }
        .rep-status-row strong { color: var(--text); font-family: 'EB Garamond', serif; font-size: 1.45rem; }
        .rep-status-row em { width: 100%; margin-top: 7px; }
        .rep-course { padding: 13px 0; border-bottom: 1px solid var(--outline-soft); }
        .rep-course:last-child { border-bottom: none; }
        .rep-course strong { display: block; color: var(--text); font-size: .9rem; font-weight: 900; }
        .rep-course span { display: block; margin-top: 3px; color: var(--outline); font-size: .72rem; }
        .rep-course b {
          min-width: 42px;
          height: 42px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          background: #fbe8d8;
          color: var(--primary);
          font-family: 'EB Garamond', serif;
          font-size: 1.3rem;
        }
        .rep-empty { color: var(--muted); font-size: .88rem; font-style: italic; }

        .rep-history { margin-top: 44px; }
        .rep-history h2 { margin-bottom: 20px; }
        .rep-table-wrap { overflow-x: auto; border: 1px solid var(--outline-soft); border-radius: 16px; background: var(--surface); }
        .rep-history table { width: 100%; min-width: 780px; border-collapse: collapse; text-align: left; }
        .rep-history th {
          padding: 18px 24px;
          border-bottom: 1px solid var(--outline-soft);
          background: var(--surface-low);
          color: var(--outline);
          font-size: .64rem;
          font-weight: 900;
          letter-spacing: .16em;
          text-transform: uppercase;
        }
        .rep-history td {
          padding: 20px 24px;
          border-bottom: 1px solid var(--outline-soft);
          color: var(--muted);
          font-size: .9rem;
        }
        .rep-history tbody tr:last-child td { border-bottom: none; }
        .rep-history td:first-child { color: var(--text); font-weight: 900; }

        .al-root.al-dark .rep-root {
          --bg: #191512;
          --surface: rgba(43,35,29,.72);
          --surface-low: #241f1a;
          --surface-high: #382f27;
          --outline: #b9aaa0;
          --outline-soft: rgba(210,194,181,.18);
          --text: #f8efe5;
          --muted: #d5c8bc;
          --primary: #f0a878;
          --tertiary: #e8a0a0;
          --secondary: #cec6be;
        }
        .al-root.al-dark .rep-export { color: #241913; }
        .al-root.al-dark .rep-course b { background: rgba(240,168,120,.14); }
        .al-root.al-dark .recharts-tooltip-wrapper { color: #3a302a; }

        @media print {
          .rep-root { padding: 18px; background: #fff; }
          .rep-export { display: none; }
        }

        @media (max-width: 1180px) {
          .rep-hero { align-items: flex-start; flex-direction: column; }
          .rep-metrics { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .rep-metrics article:nth-child(2) { border-right: none; }
          .rep-metrics article:nth-child(-n+2) { border-bottom: 1px solid var(--outline-soft); }
          .rep-grid-2 { grid-template-columns: 1fr; }
        }

        @media (max-width: 760px) {
          .rep-root { padding: 26px 16px 42px; }
          .rep-actions, .rep-select, .rep-export { width: 100%; }
          .rep-select, .rep-export { justify-content: space-between; }
          .rep-metrics { grid-template-columns: 1fr; }
          .rep-metrics article { border-right: none; border-bottom: 1px solid var(--outline-soft); padding: 22px 0; }
          .rep-metrics article:last-child { border-bottom: none; }
          .rep-performance, .rep-grid-bottom .rep-panel, .rep-donut-card { padding: 22px; border-radius: 12px; }
          .rep-chart-lg { height: 330px; }
          .rep-donut-card { grid-template-columns: 1fr; justify-items: center; }
          .rep-card-copy { width: 100%; }
        }
      `}</style>
    </AdminLayout>
  )
}
