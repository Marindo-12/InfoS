import { Head, usePage } from '@inertiajs/react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type Stat = {
  label: string;
  value: string;
  sub: string;
  accent: 'orange' | 'blue' | 'green' | 'slate';
};

type Summary = {
  totalExpected: string;
  totalCollected: string;
  completion: number;
};

type RevenuePoint = {
  month: string;
  collected: number;
  pending: number;
};

type DistributionPoint = {
  name: string;
  value: number;
  color: string;
};

type RecentPayment = {
  reference: string;
  student: string;
  course: string;
  method: string;
  amount: string;
  status: 'paid' | 'pending';
  date: string;
};

type PaymentRow = {
  reference: string;
  student: string;
  email: string;
  course: string;
  method: string;
  amount: string;
  status: 'paid' | 'pending';
  date: string;
  remaining: string;
};

type UpcomingInstallment = {
  student: string;
  course: string;
  title: string;
  amount: string;
  dueDate: string;
};

type PageProps = {
  auth: {
    user: {
      id: number;
      name: string;
      email: string;
    };
  };
  stats: Stat[];
  summary: Summary;
  monthlyRevenue: RevenuePoint[];
  statusDistribution: DistributionPoint[];
  recentPayments: RecentPayment[];
  payments: PaymentRow[];
  upcomingInstallments: UpcomingInstallment[];
};

function statusMeta(status: 'paid' | 'pending') {
  if (status === 'paid') return { label: 'Paye', className: 'adm-status adm-status--green' };
  return { label: 'En attente', className: 'adm-status adm-status--amber' };
}

function formatDh(value: number | string | undefined) {
  return `${Number(value ?? 0).toLocaleString('fr-FR')} DH`;
}

export default function Payments() {
  const { props } = usePage<PageProps>();
  const { stats, summary, monthlyRevenue, statusDistribution, recentPayments, payments, upcomingInstallments } = props;

  return (
    <>
      <Head title="Gestion des paiements" />

      <main className="adm-root">
        <header className="adm-header adm-header--hero">
          <div>
            <p className="adm-kicker">Administration</p>
            <h1 className="adm-title">Pilotage des paiements</h1>
            <p className="adm-subtitle">
              Une vue claire sur les encaissements, les soldes restants et les echeances a surveiller
              pour garder le suivi financier du centre sous controle.
            </p>
          </div>

          <div className="adm-hero-side">
            <div className="adm-hero-chip">Objectif total: {summary.totalExpected}</div>
            <div className="adm-hero-chip adm-hero-chip--soft">{summary.completion}% deja recouvre</div>
          </div>
        </header>

        <section className="adm-stats-grid">
          {stats.map((stat) => (
            <div className={`adm-stat-card adm-stat-card--${stat.accent}`} key={stat.label}>
              <p className="adm-stat-label">{stat.label}</p>
              <p className="adm-stat-value">{stat.value}</p>
              <p className="adm-stat-sub">{stat.sub}</p>
            </div>
          ))}
        </section>

        <section className="adm-overview-grid">
          <article className="adm-summary-card">
            <div className="adm-section-head">
              <h2>Recouvrement global</h2>
              <span>{summary.totalCollected} encaisses</span>
            </div>

            <div className="adm-progress-block">
              <div className="adm-progress-block__head">
                <div>
                  <p className="adm-stat-label">Progression financiere</p>
                  <p className="adm-progress-value">{summary.completion}%</p>
                </div>
                <span className="adm-status adm-status--green">Suivi actif</span>
              </div>

              <div className="adm-progress-track adm-progress-track--lg">
                <div className="adm-progress-fill" style={{ width: `${summary.completion}%` }} />
              </div>

              <p className="adm-note">
                Le centre a deja securise une grande partie des encaissements. Les paiements en attente
                et les echeances ouvertes restent visibles ci-dessous.
              </p>
            </div>

            <div className="adm-recent-list">
              {recentPayments.map((payment) => {
                const status = statusMeta(payment.status);

                return (
                  <div className="adm-recent-payment" key={payment.reference}>
                    <div>
                      <strong>{payment.student}</strong>
                      <span>
                        {payment.course} • {payment.method}
                      </span>
                    </div>
                    <div className="adm-recent-payment__meta">
                      <strong>{payment.amount}</strong>
                      <span>{payment.date}</span>
                    </div>
                    <span className={status.className}>{status.label}</span>
                  </div>
                );
              })}
            </div>
          </article>

          <article className="adm-panel">
            <div className="adm-section-head">
              <h2>Repartition des montants</h2>
              <span>lecture instantanee</span>
            </div>

            <div className="adm-chart-donut">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={62}
                    outerRadius={90}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {statusDistribution.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatDh(value as number | string | undefined)} />
                </PieChart>
              </ResponsiveContainer>
              <div className="adm-chart-center">
                <strong>{summary.completion}%</strong>
                <span>recouvre</span>
              </div>
            </div>

            <div className="adm-legend">
              {statusDistribution.map((entry) => (
                <div className="adm-legend-item" key={entry.name}>
                  <span className="adm-legend-dot" style={{ background: entry.color }} />
                  <span>{entry.name}</span>
                  <strong>{entry.value.toLocaleString('fr-FR')} DH</strong>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="adm-panel adm-panel--chart">
          <div className="adm-section-head">
            <h2>Evolution mensuelle</h2>
            <span>encaissements et attente</span>
          </div>

          <div className="adm-chart-block">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenue}>
                <defs>
                  <linearGradient id="admCollected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff6b2b" stopOpacity={0.34} />
                    <stop offset="95%" stopColor="#ff6b2b" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="admPending" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#64748b" stopOpacity={0.22} />
                    <stop offset="95%" stopColor="#64748b" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="rgba(15,23,42,0.08)" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#8b8b8b', fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#8b8b8b', fontSize: 12 }} />
                <Tooltip formatter={(value) => formatDh(value as number | string | undefined)} />
                <Area type="monotone" dataKey="pending" stroke="#64748b" fill="url(#admPending)" strokeWidth={2} name="En attente" />
                <Area type="monotone" dataKey="collected" stroke="#ff6b2b" fill="url(#admCollected)" strokeWidth={3} name="Encaisse" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="adm-grid-2">
          <article className="adm-panel">
            <div className="adm-section-head">
              <h2>Liste des paiements</h2>
              <span>{payments.length} operation(s)</span>
            </div>

            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Reference</th>
                    <th>Etudiant</th>
                    <th>Formation</th>
                    <th>Montant</th>
                    <th>Mode</th>
                    <th>Statut</th>
                    <th>Date</th>
                    <th>Reste</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => {
                    const status = statusMeta(payment.status);

                    return (
                      <tr key={payment.reference}>
                        <td>{payment.reference}</td>
                        <td>
                          <div className="adm-student-cell">
                            <div className="adm-avatar adm-avatar--sm">
                              {payment.student
                                .split(' ')
                                .map((part) => part[0])
                                .slice(0, 2)
                                .join('')}
                            </div>
                            <div>
                              <strong>{payment.student}</strong>
                              <span>{payment.email}</span>
                            </div>
                          </div>
                        </td>
                        <td>{payment.course}</td>
                        <td className="adm-amount">{payment.amount}</td>
                        <td>{payment.method}</td>
                        <td>
                          <span className={status.className}>{status.label}</span>
                        </td>
                        <td>{payment.date}</td>
                        <td>{payment.remaining}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </article>

          <article className="adm-panel">
            <div className="adm-section-head">
              <h2>Echeances a relancer</h2>
              <span>{upcomingInstallments.length} priorite(s)</span>
            </div>

            <div className="adm-installments">
              {upcomingInstallments.map((installment) => (
                <div className="adm-installment-card" key={`${installment.student}-${installment.title}`}>
                  <div className="adm-installment-card__top">
                    <div>
                      <strong>{installment.student}</strong>
                      <span>{installment.course}</span>
                    </div>
                    <span className="adm-status adm-status--amber">{installment.amount}</span>
                  </div>
                  <p>{installment.title}</p>
                  <small>Echeance prevue le {installment.dueDate}</small>
                </div>
              ))}
            </div>
          </article>
        </section>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@600;700&family=Manrope:wght@400;500;600;700;800&display=swap');

        body {
          background: #f5f4f1;
        }
        .adm-root {
          min-height: 100vh;
          padding: 32px;
          font-family: 'Manrope', sans-serif;
          color: #18181b;
        }
        .adm-header,
        .adm-stat-card,
        .adm-panel,
        .adm-summary-card {
          background: #fff;
          border: 1px solid rgba(15, 23, 42, 0.07);
          box-shadow: 0 8px 30px rgba(15, 23, 42, 0.04);
        }
        .adm-header {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          align-items: flex-end;
          flex-wrap: wrap;
          border-radius: 22px;
          padding: 28px;
          margin-bottom: 24px;
        }
        .adm-header--hero {
          background: radial-gradient(circle at top right, rgba(255, 154, 86, 0.18), transparent 30%), linear-gradient(180deg, #fff9f4 0%, #ffffff 100%);
        }
        .adm-kicker {
          margin: 0 0 8px;
          font-size: 0.74rem;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #ff6b2b;
        }
        .adm-title {
          margin: 0;
          font-family: 'EB Garamond', serif;
          font-size: clamp(2rem, 3vw, 3rem);
          line-height: 1;
        }
        .adm-subtitle {
          margin: 14px 0 0;
          color: #6b7280;
          max-width: 720px;
          line-height: 1.7;
          font-size: 0.92rem;
        }
        .adm-hero-side {
          display: flex;
          flex-direction: column;
          gap: 12px;
          min-width: 240px;
        }
        .adm-hero-chip {
          width: fit-content;
          max-width: 100%;
          padding: 12px 14px;
          border-radius: 999px;
          background: #fff;
          color: #8f4c2d;
          border: 1px solid rgba(255, 107, 43, 0.14);
          font-size: 0.82rem;
          font-weight: 800;
        }
        .adm-hero-chip--soft {
          border-radius: 16px;
          color: #6b7280;
          border-color: rgba(15, 23, 42, 0.08);
        }
        .adm-stats-grid,
        .adm-overview-grid,
        .adm-grid-2 {
          display: grid;
          gap: 18px;
        }
        .adm-stats-grid {
          grid-template-columns: repeat(4, 1fr);
          margin-bottom: 24px;
        }
        .adm-overview-grid {
          grid-template-columns: 1.35fr 0.85fr;
          margin-bottom: 24px;
        }
        .adm-grid-2 {
          grid-template-columns: 1.45fr 0.85fr;
        }
        .adm-stat-card,
        .adm-panel,
        .adm-summary-card {
          border-radius: 20px;
          padding: 24px;
        }
        .adm-stat-label {
          margin: 0 0 10px;
          color: #8b8b8b;
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.12em;
        }
        .adm-stat-value,
        .adm-progress-value {
          margin: 0;
          color: #18181b;
          font-family: 'EB Garamond', serif;
          line-height: 1;
        }
        .adm-stat-value {
          font-size: 2rem;
        }
        .adm-progress-value {
          font-size: 2.8rem;
          color: #ff6b2b;
        }
        .adm-stat-sub,
        .adm-note {
          margin: 8px 0 0;
          color: #6b7280;
          font-size: 0.82rem;
          line-height: 1.7;
        }
        .adm-stat-card--orange { border-top: 3px solid #ff6b2b; }
        .adm-stat-card--blue { border-top: 3px solid #3b82f6; }
        .adm-stat-card--green { border-top: 3px solid #10b981; }
        .adm-stat-card--slate { border-top: 3px solid #64748b; }
        .adm-section-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 14px;
          flex-wrap: wrap;
        }
        .adm-section-head h2 {
          margin: 0;
          font-family: 'EB Garamond', serif;
          font-size: 1.8rem;
        }
        .adm-section-head span {
          color: #8b8b8b;
          font-size: 0.8rem;
          font-weight: 700;
        }
        .adm-progress-block {
          padding: 22px;
          border-radius: 18px;
          background: linear-gradient(180deg, #fff9f4 0%, #ffffff 100%);
          border: 1px solid rgba(15, 23, 42, 0.06);
        }
        .adm-progress-block__head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          flex-wrap: wrap;
        }
        .adm-progress-track {
          width: 120px;
          height: 8px;
          border-radius: 999px;
          overflow: hidden;
          background: #ece8e4;
        }
        .adm-progress-track--lg {
          width: 100%;
          height: 12px;
          margin-top: 18px;
        }
        .adm-progress-fill {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #ff9a56, #ff6b2b);
        }
        .adm-recent-list,
        .adm-installments {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 18px;
        }
        .adm-recent-payment,
        .adm-installment-card {
          display: grid;
          gap: 10px;
          padding: 16px;
          border-radius: 16px;
          background: #fafafa;
          border: 1px solid rgba(15, 23, 42, 0.06);
        }
        .adm-recent-payment {
          grid-template-columns: 1.1fr auto auto;
          align-items: center;
        }
        .adm-recent-payment strong,
        .adm-installment-card strong,
        .adm-student-cell strong {
          display: block;
          color: #18181b;
        }
        .adm-recent-payment span,
        .adm-installment-card span,
        .adm-installment-card p,
        .adm-installment-card small,
        .adm-student-cell span {
          color: #6b7280;
          font-size: 0.78rem;
          margin: 0;
        }
        .adm-recent-payment__meta {
          text-align: right;
        }
        .adm-chart-donut {
          position: relative;
          width: 100%;
          height: 240px;
          margin-top: 10px;
        }
        .adm-chart-center {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }
        .adm-chart-center strong {
          font-size: 2rem;
          line-height: 1;
          color: #18181b;
        }
        .adm-chart-center span {
          margin-top: 6px;
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #8b8b8b;
        }
        .adm-legend {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 8px;
        }
        .adm-legend-item {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 10px;
          font-size: 0.84rem;
          color: #666;
        }
        .adm-legend-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
        .adm-legend-item strong {
          color: #18181b;
          font-size: 0.82rem;
        }
        .adm-panel--chart {
          margin-bottom: 24px;
        }
        .adm-chart-block {
          width: 100%;
          height: 320px;
          margin-top: 12px;
          padding: 12px 8px 0;
          border-radius: 18px;
          background: linear-gradient(180deg, #fffaf6 0%, #ffffff 100%);
          border: 1px solid rgba(15, 23, 42, 0.06);
        }
        .adm-table-wrap {
          overflow-x: auto;
          border-radius: 16px;
          border: 1px solid rgba(15, 23, 42, 0.06);
        }
        .adm-table {
          width: 100%;
          min-width: 1080px;
          border-collapse: collapse;
          background: #fff;
        }
        .adm-table thead tr {
          background: #faf7f4;
        }
        .adm-table th,
        .adm-table td {
          padding: 16px 18px;
          border-bottom: 1px solid rgba(15, 23, 42, 0.06);
          text-align: left;
          font-size: 0.85rem;
        }
        .adm-table th {
          color: #8b8b8b;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .adm-table tbody tr:hover {
          background: #fffaf6;
        }
        .adm-student-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .adm-avatar {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #ff7a35, #ff5b14);
          color: #fff;
          font-weight: 800;
          font-size: 0.78rem;
          flex-shrink: 0;
        }
        .adm-avatar--sm {
          width: 44px;
          height: 44px;
        }
        .adm-status {
          display: inline-flex;
          align-items: center;
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          width: fit-content;
        }
        .adm-status--green { background: rgba(16, 185, 129, 0.12); color: #0f9d70; }
        .adm-status--amber { background: rgba(245, 158, 11, 0.14); color: #b45309; }
        .adm-status--red { background: rgba(239, 68, 68, 0.12); color: #dc2626; }
        .adm-status--slate { background: rgba(100, 116, 139, 0.12); color: #64748b; }
        .adm-amount {
          font-weight: 800;
          color: #18181b;
        }
        .adm-installment-card__top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        @media (max-width: 1180px) {
          .adm-stats-grid,
          .adm-overview-grid,
          .adm-grid-2 {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 800px) {
          .adm-recent-payment {
            grid-template-columns: 1fr;
          }
          .adm-recent-payment__meta {
            text-align: left;
          }
        }
        @media (max-width: 640px) {
          .adm-root {
            padding: 20px 16px;
          }
          .adm-header,
          .adm-stat-card,
          .adm-panel,
          .adm-summary-card {
            padding: 18px;
            border-radius: 18px;
          }
          .adm-title {
            font-size: 2rem;
          }
          .adm-progress-block {
            padding: 16px;
          }
        }
      `}</style>
    </>
  );
}
