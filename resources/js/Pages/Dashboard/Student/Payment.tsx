import Authenticated from '@/Layouts/AuthenticatedLayout'
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts'

/* ═══════════════════════════════════════════════════════
   MOCK DATA
═══════════════════════════════════════════════════════ */
const monthlyData = [
  { month: 'Jan', paid: 0,    pending: 0    },
  { month: 'Fév', paid: 0,    pending: 0    },
  { month: 'Mar', paid: 0,    pending: 0    },
  { month: 'Avr', paid: 0,    pending: 0    },
  { month: 'Mai', paid: 0,    pending: 0    },
  { month: 'Jun', paid: 0,    pending: 0    },
  { month: 'Jul', paid: 5000, pending: 0    },
  { month: 'Aoû', paid: 2500, pending: 0    },
  { month: 'Sep', paid: 2500, pending: 0    },
  { month: 'Oct', paid: 0,    pending: 2500 },
  { month: 'Nov', paid: 0,    pending: 2500 },
  { month: 'Déc', paid: 0,    pending: 10000},
]

const pieData = [
  { name: 'Payé',   value: 10000 },
  { name: 'Restant', value: 15000 },
]
const PIE_COLORS = ['#c2652a', '#ede9e4']

const transactions = [
  { id: 1, date: '12 Sep 2024', method: 'Visa **** 4421', methodIcon: 'credit_card',       amount: 2500,  status: 'paid'    },
  { id: 2, date: '15 Aoû 2024', method: 'Virement bancaire', methodIcon: 'account_balance', amount: 2500,  status: 'paid'    },
  { id: 3, date: '10 Jul 2024', method: 'Dépôt espèces',  methodIcon: 'payments',           amount: 5000,  status: 'pending' },
]

const installments = [
  { month: 'Juillet',   amount: 5000,  status: 'paid',    label: 'PAYÉ'       },
  { month: 'Août',      amount: 2500,  status: 'paid',    label: 'PAYÉ'       },
  { month: 'Septembre', amount: 2500,  status: 'current', label: 'EN COURS'   },
  { month: 'Octobre',   amount: 2500,  status: 'upcoming',label: 'PRÉVU'      },
  { month: 'Novembre',  amount: 2500,  status: 'upcoming',label: 'PRÉVU'      },
  { month: 'Décembre',  amount: 10000, status: 'upcoming',label: 'SOLDE FINAL'},
]

/* ═══════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════ */
const fmt = (n: number) =>
  new Intl.NumberFormat('fr-MA', { minimumFractionDigits: 2 }).format(n)

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    paid:     'status-paid',
    pending:  'status-pending',
    current:  'status-current',
    upcoming: 'status-upcoming',
  }
  const label: Record<string, string> = {
    paid: 'Payé', pending: 'En attente', current: 'En cours', upcoming: 'Prévu',
  }
  return <span className={`p-status ${map[status] ?? ''}`}>{label[status] ?? status}</span>
}

/* ═══════════════════════════════════════════════════════
   STAT CARD
═══════════════════════════════════════════════════════ */
function StatCard({ label, value, sub, icon, accent = false }: {
  label: string; value: string; sub?: string
  icon: string; accent?: boolean
}) {
  return (
    <div className={`p-stat-card ${accent ? 'p-stat-card--accent' : ''}`}>
      <div className="p-stat-body">
        <p className="p-stat-label">{label}</p>
        <p className="p-stat-value">{value}</p>
        {sub && <p className="p-stat-sub">{sub}</p>}
      </div>
      <div className={`p-stat-icon ${accent ? 'p-stat-icon--accent' : ''}`}>
        <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>{icon}</span>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   CUSTOM TOOLTIP
═══════════════════════════════════════════════════════ */
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="p-tooltip">
      <p className="p-tooltip-label">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }} className="p-tooltip-row">
          {p.name === 'paid' ? 'Payé' : 'À payer'} : {fmt(p.value)} DH
        </p>
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════ */
export default function Payment() {
  return (
    <Authenticated header={
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: '.82rem', color: 'var(--text-3, #b0a49a)' }}>Dashboard</span>
        <span style={{ color: 'var(--text-3, #b0a49a)', fontSize: '.82rem' }}>/</span>
        <span style={{ fontSize: '.82rem', fontWeight: 700, color: 'var(--text-1, #1a1612)' }}>Paiements</span>
      </div>
    }>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;1,400&family=Manrope:wght@400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');

        .material-symbols-outlined {
          font-variation-settings:'FILL' 0,'wght' 300,'GRAD' 0,'opsz' 24;
          font-family:'Material Symbols Outlined';
          font-style: normal; line-height: 1;
          letter-spacing: normal; text-transform: none;
          display: inline-block; white-space: nowrap;
          -webkit-font-smoothing: antialiased;
        }

        :root {
          --orange:       #c2652a;
          --orange-light: #e8915a;
          --orange-pale:  #fff3ec;
          --orange-pale2: #fde8d8;
          --page-bg:      #f6f4f0;
          --surface:      #ffffff;
          --border:       #ede9e4;
          --text-1:       #1a1612;
          --text-2:       #6b5f55;
          --text-3:       #b0a49a;
          --shadow:       0 1px 4px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
          --shadow-md:    0 4px 16px rgba(0,0,0,0.07);
          --font:         'Manrope', sans-serif;
          --radius:       14px;
        }

        /* ── Page header ── */
        .p-header {
          display: flex; flex-wrap: wrap;
          align-items: flex-end; justify-content: space-between;
          gap: 16px; margin-bottom: 28px;
        }
        .p-title {
          font-family: 'EB Garamond', serif;
          font-size: 2rem; font-weight: 600;
          color: var(--text-1); margin: 0;
        }
        .p-subtitle {
          font-size: .84rem; color: var(--text-2);
          margin: 4px 0 0; font-family: var(--font);
        }
        .p-semester-pill {
          display: flex; align-items: center; gap: 8px;
          padding: 8px 16px;
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 99px;
          font-size: .78rem; font-weight: 600;
          color: var(--text-2);
          box-shadow: var(--shadow);
        }
        .p-semester-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--orange);
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50%      { opacity: .6; transform: scale(.85); }
        }

        /* ── Stat cards ── */
        .p-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }
        .p-stat-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 20px;
          display: flex; align-items: center;
          justify-content: space-between;
          box-shadow: var(--shadow);
          transition: box-shadow .2s, transform .2s;
        }
        .p-stat-card:hover { box-shadow: var(--shadow-md); transform: translateY(-1px); }
        .p-stat-card--accent {
          background: linear-gradient(135deg, var(--orange), var(--orange-light));
          border-color: transparent; color: #fff;
        }
        .p-stat-label {
          font-size: .7rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: .08em; color: var(--text-3); margin: 0 0 6px;
          font-family: var(--font);
        }
        .p-stat-card--accent .p-stat-label { color: rgba(255,255,255,.75); }
        .p-stat-value {
          font-family: 'EB Garamond', serif;
          font-size: 1.7rem; font-weight: 600;
          color: var(--text-1); margin: 0;
          line-height: 1.1;
        }
        .p-stat-card--accent .p-stat-value { color: #fff; }
        .p-stat-sub {
          font-size: .72rem; color: var(--text-3);
          margin: 4px 0 0; font-family: var(--font);
        }
        .p-stat-card--accent .p-stat-sub { color: rgba(255,255,255,.7); }
        .p-stat-icon {
          width: 44px; height: 44px; flex-shrink: 0;
          border-radius: 12px;
          background: var(--orange-pale);
          color: var(--orange);
          display: flex; align-items: center; justify-content: center;
        }
        .p-stat-icon--accent {
          background: rgba(255,255,255,.2);
          color: #fff;
        }

        /* ── Progress card ── */
        .p-progress-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 20px 24px;
          box-shadow: var(--shadow);
          margin-bottom: 24px;
        }
        .p-progress-header {
          display: flex; align-items: center;
          justify-content: space-between; margin-bottom: 16px;
          flex-wrap: wrap; gap: 8px;
        }
        .p-progress-label {
          font-size: .7rem; font-weight: 700; text-transform: uppercase;
          letter-spacing: .08em; color: var(--text-3); margin: 0;
          font-family: var(--font);
        }
        .p-progress-amounts {
          font-size: .82rem; font-weight: 700; color: var(--orange);
          font-family: var(--font);
        }
        .p-progress-track {
          height: 10px; background: var(--orange-pale);
          border-radius: 99px; overflow: hidden;
        }
        .p-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--orange), var(--orange-light));
          border-radius: 99px;
          width: 40%;
          transition: width .8s cubic-bezier(.4,0,.2,1);
        }
        .p-progress-note {
          font-size: .76rem; color: var(--text-3);
          margin: 10px 0 0; font-family: var(--font); font-style: italic;
        }

        /* ── Card generic ── */
        .p-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          box-shadow: var(--shadow);
          overflow: hidden;
        }
        .p-card-header {
          padding: 20px 24px 0;
          display: flex; align-items: center;
          justify-content: space-between;
          flex-wrap: wrap; gap: 8px;
        }
        .p-card-title {
          font-family: 'EB Garamond', serif;
          font-size: 1.15rem; font-weight: 600;
          color: var(--text-1); margin: 0;
        }
        .p-card-link {
          font-size: .78rem; font-weight: 700;
          color: var(--orange); text-decoration: none;
          display: flex; align-items: center; gap: 2px;
        }
        .p-card-link:hover { text-decoration: underline; }
        .p-card-body { padding: 20px 24px 24px; }

        /* ── Grids ── */
        .p-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 24px;
        }
        .p-grid-3col {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 20px;
          margin-bottom: 24px;
        }
        @media (max-width: 1024px) {
          .p-grid-3col { grid-template-columns: 1fr; }
        }
        @media (max-width: 767px) {
          .p-grid-2 { grid-template-columns: 1fr; }
        }
        .p-chart-2col { grid-column: span 2; }
        @media (max-width: 767px) {
          .p-chart-2col { grid-column: span 1; }
        }

        /* ── Table ── */
        .p-table-wrap { overflow-x: auto; }
        .p-table {
          width: 100%; border-collapse: collapse;
          font-family: var(--font); font-size: .84rem;
        }
        .p-table thead tr {
          border-bottom: 1px solid var(--border);
          background: #faf8f5;
        }
        .p-table th {
          padding: 12px 20px;
          font-size: .68rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: .08em;
          color: var(--text-3); text-align: left;
        }
        .p-table tbody tr {
          border-bottom: 1px solid #f3ede6;
          transition: background .15s;
        }
        .p-table tbody tr:last-child { border-bottom: none; }
        .p-table tbody tr:hover { background: var(--orange-pale); }
        .p-table td {
          padding: 14px 20px;
          color: var(--text-1); vertical-align: middle;
        }
        .p-table-method {
          display: flex; align-items: center; gap: 8px; color: var(--text-2);
        }
        .p-table-amount { font-weight: 700; font-family: 'EB Garamond', serif; font-size: .98rem; }
        .p-table-actions { text-align: right; }
        .p-dl-btn {
          background: transparent; border: none; cursor: pointer;
          color: var(--orange); padding: 6px;
          border-radius: 8px; transition: background .15s;
          display: inline-flex; align-items: center; justify-content: center;
        }
        .p-dl-btn:hover { background: var(--orange-pale); }

        /* ── Status badges ── */
        .p-status {
          display: inline-block; padding: 3px 10px;
          border-radius: 99px;
          font-size: .67rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: .06em;
          font-family: var(--font);
        }
        .status-paid    { background: #dcfce7; color: #15803d; }
        .status-pending { background: #fef3c7; color: #b45309; }
        .status-current { background: var(--orange-pale2); color: var(--orange); }
        .status-upcoming{ background: var(--border); color: var(--text-3); }

        /* ── Invoice items ── */
        .p-invoice-item {
          display: flex; align-items: center; gap: 14px;
          padding: 14px;
          border: 1px solid var(--border);
          border-radius: 10px;
          transition: border-color .2s, box-shadow .2s;
          background: var(--surface);
          margin-bottom: 10px;
        }
        .p-invoice-item:hover {
          border-color: var(--orange);
          box-shadow: 0 0 0 3px var(--orange-pale);
        }
        .p-invoice-icon {
          width: 42px; height: 42px; flex-shrink: 0;
          border-radius: 10px; background: var(--orange-pale);
          color: var(--orange);
          display: flex; align-items: center; justify-content: center;
        }
        .p-invoice-name { font-size: .84rem; font-weight: 600; color: var(--text-1); }
        .p-invoice-date { font-size: .72rem; color: var(--text-3); margin-top: 2px; }
        .p-invoice-dl {
          margin-left: auto; flex-shrink: 0;
          background: var(--orange-pale); color: var(--orange);
          border: none; cursor: pointer; padding: 7px;
          border-radius: 8px; display: flex;
          transition: background .15s, color .15s;
        }
        .p-invoice-dl:hover { background: var(--orange); color: #fff; }

        /* ── Missing invoice ── */
        .p-invoice-missing {
          border: 1px dashed var(--border);
          border-radius: 10px; padding: 18px;
          text-align: center; color: var(--text-3);
          font-size: .82rem; font-family: var(--font);
        }
        .p-invoice-missing a { color: var(--orange); font-weight: 700; }

        /* ── Timeline ── */
        .p-timeline-wrap {
          overflow-x: auto; padding-bottom: 8px;
        }
        .p-timeline {
          min-width: 700px; position: relative;
          padding: 28px 0;
        }
        .p-timeline-track {
          position: absolute; top: 50%;
          left: 0; right: 0; height: 2px;
          background: var(--border);
          transform: translateY(-50%); z-index: 0;
        }
        .p-timeline-fill {
          position: absolute; top: 50%;
          left: 0; width: 40%;
          height: 2px;
          background: linear-gradient(90deg, var(--orange), var(--orange-light));
          transform: translateY(-50%); z-index: 1;
        }
        .p-timeline-items {
          position: relative; z-index: 2;
          display: flex; justify-content: space-between;
          align-items: center;
        }
        .p-tl-item {
          display: flex; flex-direction: column;
          align-items: center; gap: 8px;
        }
        .p-tl-label {
          font-size: .68rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: .08em;
          color: var(--text-3); font-family: var(--font);
          white-space: nowrap;
        }
        .p-tl-label--active { color: var(--orange); }
        .p-tl-dot {
          width: 20px; height: 20px; border-radius: 50%;
          background: var(--border);
          border: 3px solid var(--surface);
          box-shadow: 0 0 0 2px var(--border);
        }
        .p-tl-dot--paid {
          background: var(--orange);
          box-shadow: 0 0 0 2px var(--orange-pale2);
        }
        .p-tl-dot--current {
          width: 26px; height: 26px;
          background: var(--surface);
          border: 3px solid var(--orange);
          box-shadow: 0 0 0 4px var(--orange-pale2), 0 0 12px rgba(194,101,42,.25);
          display: flex; align-items: center; justify-content: center;
        }
        .p-tl-dot-inner {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--orange);
          animation: pulse 2s ease-in-out infinite;
        }
        .p-tl-info { text-align: center; }
        .p-tl-amount {
          font-size: .86rem; font-weight: 700; font-family: 'EB Garamond', serif;
          color: var(--text-1);
        }
        .p-tl-amount--active { color: var(--orange); }
        .p-tl-amount--dim { color: var(--text-3); }

        /* ── Pay button ── */
        .p-btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          background: linear-gradient(135deg, var(--orange), var(--orange-light));
          color: #fff; border: none; cursor: pointer;
          padding: 11px 24px; border-radius: 10px;
          font-family: var(--font); font-size: .84rem; font-weight: 700;
          transition: opacity .2s, transform .2s, box-shadow .2s;
          box-shadow: 0 4px 14px rgba(194,101,42,.35);
          text-decoration: none;
        }
        .p-btn-primary:hover {
          opacity: .92; transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(194,101,42,.45);
        }
        .p-btn-primary:active { transform: translateY(0); }

        .p-btn-secondary {
          display: inline-flex; align-items: center; gap: 8px;
          background: transparent;
          border: 1px solid var(--border);
          color: var(--text-1); cursor: pointer;
          padding: 10px 22px; border-radius: 10px;
          font-family: var(--font); font-size: .84rem; font-weight: 600;
          transition: background .2s, border-color .2s;
        }
        .p-btn-secondary:hover {
          background: var(--orange-pale); border-color: var(--orange-pale2);
          color: var(--orange);
        }

        /* ── Legend dot ── */
        .p-legend { display: flex; align-items: center; gap: 20px; }
        .p-legend-item { display: flex; align-items: center; gap: 6px; font-size: .76rem; font-weight: 600; color: var(--text-2); font-family: var(--font); }
        .p-legend-dot { width: 10px; height: 10px; border-radius: 50%; }

        /* ── Tooltip ── */
        .p-tooltip {
          background: var(--text-1); border-radius: 10px;
          padding: 10px 14px; box-shadow: var(--shadow-md);
        }
        .p-tooltip-label {
          font-size: .72rem; color: rgba(255,255,255,.6);
          font-family: var(--font); font-weight: 600;
          margin: 0 0 4px; text-transform: uppercase; letter-spacing: .06em;
        }
        .p-tooltip-row {
          font-size: .84rem; font-weight: 700;
          font-family: 'EB Garamond', serif; margin: 2px 0;
        }

        /* ── Footer ── */
        .p-footer {
          margin-top: 16px; padding: 16px 0 4px;
          border-top: 1px solid var(--border);
          font-size: .72rem; color: var(--text-3);
          font-family: var(--font);
          display: flex; align-items: center; gap: 8px;
        }
      `}</style>

      {/* ══════════════════════════════════════
          HEADER
      ══════════════════════════════════════ */}
      <div className="p-header">
        <div>
          <h1 className="p-title">Suivi financier</h1>
          <p className="p-subtitle">Consulter vos paiements, échéances et documents officiels.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div className="p-semester-pill">
            <span className="p-semester-dot" />
            Semestre actif : Automne 2024
          </div>
          <button className="p-btn-primary">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>payment</span>
            Payer maintenant
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════
          STAT CARDS
      ══════════════════════════════════════ */}
      <div className="p-stats-grid">
        <StatCard label="Solde restant"     value="15 000 DH" sub="Prochain: 15 oct."  icon="account_balance_wallet" accent />
        <StatCard label="Total payé"        value="10 000 DH" sub="Sur 25 000 DH"      icon="check_circle" />
        <StatCard label="Prochaine échéance" value="2 500 DH"  sub="Dans 28 jours"    icon="event" />
        <StatCard label="Versements effectués" value="3 / 6"  sub="Taux : 50%"         icon="receipt_long" />
      </div>

      {/* ══════════════════════════════════════
          PROGRESS BAR
      ══════════════════════════════════════ */}
      <div className="p-progress-card">
        <div className="p-progress-header">
          <p className="p-progress-label">Progression de paiement annuel</p>
          <span className="p-progress-amounts">10 000 / 25 000 DH payés</span>
        </div>
        <div className="p-progress-track">
          <div className="p-progress-fill" style={{ width: '40%' }} />
        </div>
        <p className="p-progress-note">
          40 % de la scolarité annuelle couverte. Maintenir ce rythme garantit l'accès aux examens finaux.
        </p>
      </div>

      {/* ══════════════════════════════════════
          CHARTS ROW
      ══════════════════════════════════════ */}
      <div className="p-grid-2" style={{ marginBottom: 24 }}>

        {/* Bar chart — paiements mensuels */}
        <div className="p-card p-chart-2col" style={{ gridColumn: 'span 1' }}>
          <div className="p-card-header">
            <h2 className="p-card-title">Versements mensuels</h2>
            <div className="p-legend">
              <div className="p-legend-item">
                <div className="p-legend-dot" style={{ background: '#c2652a' }} />
                Payé
              </div>
              <div className="p-legend-item">
                <div className="p-legend-dot" style={{ background: '#e8c9b0' }} />
                À payer
              </div>
            </div>
          </div>
          <div className="p-card-body" style={{ paddingTop: 16 }}>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyData} barSize={14} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ede9e4" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#b0a49a', fontFamily: 'Manrope' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#b0a49a', fontFamily: 'Manrope' }} axisLine={false} tickLine={false} tickFormatter={v => v > 0 ? `${v/1000}k` : '0'} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: '#fff3ec', radius: 4 }} />
                <Bar dataKey="paid"    fill="#c2652a" radius={[4,4,0,0]} name="paid" />
                <Bar dataKey="pending" fill="#e8c9b0" radius={[4,4,0,0]} name="pending" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut — répartition */}
        <div className="p-card">
          <div className="p-card-header">
            <h2 className="p-card-title">Répartition</h2>
          </div>
          <div className="p-card-body" style={{ paddingTop: 8 }}>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%" cy="50%"
                  innerRadius={62} outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: any) => [`${fmt(v)} DH`]} />
                <Legend
                  iconType="circle" iconSize={9}
                  formatter={(v) => <span style={{ fontSize: '0.78rem', color: '#6b5f55', fontFamily: 'Manrope' }}>{v}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Centre label */}
            <div style={{ textAlign: 'center', marginTop: -8 }}>
              <p style={{ fontFamily: "'EB Garamond', serif", fontSize: '1.5rem', fontWeight: 600, color: '#1a1612', margin: 0 }}>40%</p>
              <p style={{ fontSize: '.72rem', color: '#b0a49a', fontFamily: 'Manrope' }}>couvert</p>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          TRANSACTIONS + INVOICES
      ══════════════════════════════════════ */}
      <div className="p-grid-3col">

        {/* Table transactions — 2/3 */}
        <div className="p-card" style={{ gridColumn: 'span 2' }}>
          <div className="p-card-header">
            <h2 className="p-card-title">Historique des paiements</h2>
            <a href="#" className="p-card-link">
              Voir tout
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>chevron_right</span>
            </a>
          </div>
          <div className="p-card-body" style={{ padding: 0 }}>
            <div className="p-table-wrap">
              <table className="p-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Méthode</th>
                    <th>Montant</th>
                    <th>Statut</th>
                    <th className="p-table-actions">Reçu</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(tx => (
                    <tr key={tx.id}>
                      <td style={{ color: '#6b5f55', whiteSpace: 'nowrap' }}>{tx.date}</td>
                      <td>
                        <div className="p-table-method">
                          <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#b0a49a' }}>
                            {tx.methodIcon}
                          </span>
                          {tx.method}
                        </div>
                      </td>
                      <td className="p-table-amount">{fmt(tx.amount)} DH</td>
                      <td><StatusBadge status={tx.status} /></td>
                      <td className="p-table-actions">
                        {tx.status === 'paid'
                          ? (
                            <button className="p-dl-btn" aria-label="Télécharger">
                              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>download</span>
                            </button>
                          ) : (
                            <span style={{ color: '#b0a49a', display: 'flex', justifyContent: 'flex-end' }}>
                              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>hourglass_empty</span>
                            </span>
                          )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Invoices — 1/3 */}
        <div className="p-card">
          <div className="p-card-header">
            <h2 className="p-card-title">Factures officielles</h2>
          </div>
          <div className="p-card-body">
            {[
              { name: 'Facture Semestre Automne', date: 'Émise le 01 Sep 2024' },
              { name: 'Reçu droits d\'inscription', date: 'Émis le 15 Jun 2024' },
            ].map(inv => (
              <div key={inv.name} className="p-invoice-item">
                <div className="p-invoice-icon">
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>description</span>
                </div>
                <div>
                  <p className="p-invoice-name">{inv.name}</p>
                  <p className="p-invoice-date">{inv.date}</p>
                </div>
                <button className="p-invoice-dl" aria-label="Télécharger">
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>download</span>
                </button>
              </div>
            ))}
            <div className="p-invoice-missing">
              <span className="material-symbols-outlined" style={{ fontSize: '28px', display: 'block', marginBottom: 6 }}>help_outline</span>
              Facture manquante ?<br />
              <a href="#">Contacter l'administration</a>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          INSTALLMENT TIMELINE
      ══════════════════════════════════════ */}
      <div className="p-card" style={{ marginBottom: 24 }}>
        <div className="p-card-header">
          <h2 className="p-card-title">Calendrier des versements</h2>
          <div className="p-legend">
            <div className="p-legend-item">
              <div className="p-legend-dot" style={{ background: '#c2652a' }} />Payé
            </div>
            <div className="p-legend-item">
              <div className="p-legend-dot" style={{ background: '#ede9e4' }} />À venir
            </div>
          </div>
        </div>
        <div className="p-card-body">
          <div className="p-timeline-wrap">
            <div className="p-timeline">
              <div className="p-timeline-track" />
              <div className="p-timeline-fill" />
              <div className="p-timeline-items">
                {installments.map(inst => (
                  <div key={inst.month} className="p-tl-item">
                    <p className={`p-tl-label ${inst.status === 'current' ? 'p-tl-label--active' : ''}`}>
                      {inst.month}
                    </p>

                    {inst.status === 'paid' && <div className="p-tl-dot p-tl-dot--paid" />}
                    {inst.status === 'current' && (
                      <div className="p-tl-dot p-tl-dot--current">
                        <span className="p-tl-dot-inner" />
                      </div>
                    )}
                    {inst.status === 'upcoming' && <div className="p-tl-dot" />}

                    <div className="p-tl-info">
                      <p className={`p-tl-amount ${inst.status === 'current' ? 'p-tl-amount--active' : inst.status === 'upcoming' ? 'p-tl-amount--dim' : ''}`}>
                        {fmt(inst.amount)} DH
                      </p>
                      <p style={{ fontSize: '.63rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: inst.status === 'current' ? '#c2652a' : inst.status === 'paid' ? '#15803d' : '#b0a49a', fontFamily: 'Manrope', marginTop: 2 }}>
                        {inst.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          ACTIONS RAPIDES
      ══════════════════════════════════════ */}
      <div className="p-card" style={{ marginBottom: 0 }}>
        <div className="p-card-header">
          <h2 className="p-card-title">Actions rapides</h2>
        </div>
        <div className="p-card-body" style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <button className="p-btn-primary">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>payment</span>
            Effectuer un paiement
          </button>
          <button className="p-btn-secondary">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>calendar_month</span>
            Prendre un rendez-vous
          </button>
          <button className="p-btn-secondary">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>download</span>
            Télécharger le relevé
          </button>
          <button className="p-btn-secondary">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>support_agent</span>
            Contacter l'administration
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="p-footer">
        <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>lock</span>
        Toutes les transactions sont sécurisées par chiffrement SSL 256 bits. © 2024 Centre Informatique.
      </div>

    </Authenticated>
  )
}