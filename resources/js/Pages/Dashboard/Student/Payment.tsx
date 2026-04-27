import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
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
} from 'recharts';

const paymentHistory = [
  { date: '12 sept. 2024', method: 'Visa **** 4421', type: 'card', amount: '2 500,00 DH', status: 'paid' },
  { date: '15 aout 2024', method: 'Virement bancaire', type: 'bank', amount: '2 500,00 DH', status: 'paid' },
  { date: '10 juil. 2024', method: 'Depot espece', type: 'cash', amount: '5 000,00 DH', status: 'pending' },
];

const invoices = [
  { title: 'Facture semestre d automne', issuedAt: '01 sept. 2024' },
  { title: 'Recu des frais d inscription', issuedAt: '15 juin 2024' },
];

const installments = [
  { month: 'Juillet', amount: '5 000 DH', state: 'paid' },
  { month: 'Aout', amount: '2 500 DH', state: 'paid' },
  { month: 'Septembre', amount: '2 500 DH', state: 'current' },
  { month: 'Octobre', amount: '2 500 DH', state: 'upcoming' },
  { month: 'Novembre', amount: '2 500 DH', state: 'upcoming' },
  { month: 'Decembre', amount: '10 000 DH', state: 'final' },
];

const stats = [
  { label: 'Montant deja regle', value: '15 000 DH', sub: 'sur 25 000 DH', color: '#10b981', icon: <IconCheck /> },
  { label: 'Reste a payer', value: '2 450 DH', sub: 'prochaine echeance le 15 oct.', color: '#ff6b2b', icon: <IconWallet /> },
  { label: 'Paiements valides', value: '2 / 3', sub: 'une operation en attente', color: '#3b82f6', icon: <IconReceipt /> },
];

const paymentDistribution = [
  { name: 'Regle', value: 15000, color: '#ff6b2b' },
  { name: 'Restant', value: 10000, color: '#f2d7c7' },
];

const installmentChartData = [
  { month: 'Juil', paid: 5000, expected: 5000 },
  { month: 'Aout', paid: 2500, expected: 2500 },
  { month: 'Sept', paid: 2500, expected: 2500 },
  { month: 'Oct', paid: 0, expected: 2500 },
  { month: 'Nov', paid: 0, expected: 2500 },
  { month: 'Dec', paid: 0, expected: 10000 },
];

function formatDh(value: number | string | undefined) {
  return `${Number(value ?? 0).toLocaleString('fr-FR')} DH`;
}

function statusMeta(status: 'paid' | 'pending') {
  if (status === 'paid') {
    return { label: 'Paye', className: 'pay-badge pay-badge--success' };
  }

  return { label: 'En attente', className: 'pay-badge pay-badge--pending' };
}

function methodIcon(type: 'card' | 'bank' | 'cash') {
  if (type === 'bank') return <IconBank />;
  if (type === 'cash') return <IconCash />;
  return <IconCard />;
}

function StatCard({
  label,
  value,
  sub,
  color,
  icon,
}: {
  label: string;
  value: string;
  sub: string;
  color: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="pay-stat-card">
      <div className="pay-stat-icon" style={{ background: `${color}16`, color }}>
        {icon}
      </div>
      <div>
        <p className="pay-eyebrow">{label}</p>
        <p className="pay-stat-value">{value}</p>
        <p className="pay-muted">{sub}</p>
      </div>
    </div>
  );
}

export default function Payment() {
  const user = usePage().props.auth.user;
  const firstName = user.name.split(' ')[0];
  const completion = 60;

  return (
    <AuthenticatedLayout header={<h2>Paiements</h2>}>
      <Head title="Paiements" />

      <div className="pay-root">
        <section className="pay-hero">
          <div className="pay-hero-copy">
            <p className="pay-section-kicker">Espace financier</p>
            <h1 className="pay-hero-title">
              Suivi des paiements de <span>{firstName}</span>
            </h1>
            <p className="pay-hero-text">
              Retrouvez ici votre solde, vos echeances, l historique des reglements et vos documents
              administratifs pour l annee universitaire 2023-2024.
            </p>
          </div>

          <div className="pay-hero-side">
            <div className="pay-chip">
              <span className="pay-chip-dot" />
              Semestre actif : Automne 2024
            </div>
            <div className="pay-chip pay-chip--soft">Transactions securisees SSL 256 bits</div>
          </div>
        </section>

        <section className="pay-top-grid">
          <div className="pay-balance-card">
            <div className="pay-balance-head">
              <div>
                <p className="pay-eyebrow">Solde restant</p>
                <h3 className="pay-balance-value">2 450,00 DH</h3>
              </div>
              <span className="pay-badge pay-badge--highlight">Echeance : 15 oct.</span>
            </div>

            <p className="pay-balance-text">
              Votre dossier est a jour a 60 %. Il reste une partie du montant annuel a regler pour
              finaliser la scolarite.
            </p>

            <div className="pay-balance-actions">
              <button type="button" className="pay-btn pay-btn--primary">
                Regler maintenant
              </button>
              <button type="button" className="pay-btn pay-btn--secondary">
                Voir les echeances
              </button>
            </div>
          </div>

          <div className="pay-progress-card">
            <div className="pay-progress-head">
              <div>
                <p className="pay-eyebrow">Progression annuelle</p>
                <h3 className="pay-progress-value">15 000 / 25 000 DH</h3>
              </div>
              <span className="pay-badge pay-badge--success">{completion}% regle</span>
            </div>

            <div className="pay-progress-track" aria-hidden="true">
              <div className="pay-progress-fill" style={{ width: `${completion}%` }} />
            </div>

            <p className="pay-muted">
              En gardant ce rythme, vous pourrez valider vos paiements avant les examens finaux.
            </p>
          </div>
        </section>

        <section className="pay-stats-grid">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </section>

        <section className="pay-content-grid">
          <div className="pay-panel">
            <div className="pay-panel-head">
              <div>
                <h3 className="pay-panel-title">Historique des paiements</h3>
                <p className="pay-muted">Vue detaillee des reglements deja enregistres.</p>
              </div>
              <button type="button" className="pay-text-link">
                Voir tout
              </button>
            </div>

            <div className="pay-table-wrap">
              <table className="pay-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Mode</th>
                    <th>Montant</th>
                    <th>Statut</th>
                    <th className="pay-align-right">Recu</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.map((item) => {
                    const status = statusMeta(item.status as 'paid' | 'pending');

                    return (
                      <tr key={`${item.date}-${item.method}`}>
                        <td>{item.date}</td>
                        <td>
                          <div className="pay-method">
                            <span className="pay-method-icon">{methodIcon(item.type as 'card' | 'bank' | 'cash')}</span>
                            <span>{item.method}</span>
                          </div>
                        </td>
                        <td className="pay-amount">{item.amount}</td>
                        <td>
                          <span className={status.className}>{status.label}</span>
                        </td>
                        <td className="pay-align-right">
                          <button type="button" className="pay-icon-btn" disabled={item.status === 'pending'}>
                            <IconDownload />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pay-side-stack">
            <div className="pay-panel">
              <div className="pay-panel-head">
                <div>
                  <h3 className="pay-panel-title">Repartition du budget</h3>
                  <p className="pay-muted">Lecture rapide entre le montant deja regle et le reste a solder.</p>
                </div>
              </div>

              <div className="pay-chart-donut">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paymentDistribution}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={62}
                      outerRadius={92}
                      paddingAngle={3}
                      stroke="none"
                    >
                      {paymentDistribution.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatDh(value as number | string | undefined)} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pay-chart-center">
                  <strong>60%</strong>
                  <span>deja regle</span>
                </div>
              </div>

              <div className="pay-legend">
                {paymentDistribution.map((entry) => (
                  <div key={entry.name} className="pay-legend-item">
                    <span className="pay-legend-dot" style={{ background: entry.color }} />
                    <span>{entry.name}</span>
                    <strong>{entry.value.toLocaleString('fr-FR')} DH</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="pay-panel">
              <div className="pay-panel-head">
                <div>
                  <h3 className="pay-panel-title">Factures officielles</h3>
                  <p className="pay-muted">Documents disponibles au telechargement.</p>
                </div>
              </div>

              <div className="pay-doc-list">
                {invoices.map((invoice) => (
                  <div className="pay-doc-card" key={invoice.title}>
                    <div className="pay-doc-icon">
                      <IconDocument />
                    </div>
                    <div className="pay-doc-copy">
                      <p className="pay-doc-title">{invoice.title}</p>
                      <p className="pay-muted">Edite le {invoice.issuedAt}</p>
                    </div>
                    <button type="button" className="pay-icon-btn">
                      <IconDownload />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pay-help-card">
              <div className="pay-help-icon">
                <IconHelp />
              </div>
              <div>
                <h3 className="pay-panel-title">Besoin d une facture manquante ?</h3>
                <p className="pay-muted">
                  Contactez l administration pour demander un duplicata ou un justificatif supplementaire.
                </p>
              </div>
              <Link href={route('contact')} className="pay-text-link pay-text-link--strong">
                Contacter le centre
              </Link>
            </div>
          </div>
        </section>

        <section className="pay-panel">
          <div className="pay-panel-head">
            <div>
              <h3 className="pay-panel-title">Calendrier des echeances</h3>
              <p className="pay-muted">Suivi mois par mois des versements de l annee.</p>
            </div>
          </div>

          <div className="pay-chart-block">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={installmentChartData} barGap={10}>
                <CartesianGrid vertical={false} stroke="rgba(15,23,42,0.08)" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#8b8b8b', fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#8b8b8b', fontSize: 12 }} />
                <Tooltip formatter={(value) => formatDh(value as number | string | undefined)} />
                <Bar dataKey="expected" fill="#f2d7c7" radius={[8, 8, 0, 0]} name="Prevu" />
                <Bar dataKey="paid" fill="#ff6b2b" radius={[8, 8, 0, 0]} name="Regle" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pay-timeline">
            <div className="pay-timeline-line" aria-hidden="true" />
            {installments.map((installment, index) => (
              <div className={`pay-step pay-step--${installment.state}`} key={`${installment.month}-${index}`}>
                <p className="pay-step-month">{installment.month}</p>
                <div className="pay-step-dot" />
                <div className="pay-step-card">
                  <p className="pay-step-amount">{installment.amount}</p>
                  <p className="pay-step-state">
                    {installment.state === 'paid' && 'Regle'}
                    {installment.state === 'current' && 'En cours'}
                    {installment.state === 'upcoming' && 'Programme'}
                    {installment.state === 'final' && 'Final'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer className="pay-footer">
          Toutes les operations financieres sont protegees et archivees dans votre espace etudiant.
        </footer>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@600;700&family=Manrope:wght@400;500;600;700;800&display=swap');

        .pay-root {
          display: flex;
          flex-direction: column;
          gap: 24px;
          font-family: 'Manrope', sans-serif;
          color: #18181b;
        }

        .pay-hero,
        .pay-panel,
        .pay-balance-card,
        .pay-progress-card,
        .pay-help-card,
        .pay-stat-card {
          background: #fff;
          border: 1px solid rgba(15, 23, 42, 0.07);
          box-shadow: 0 8px 30px rgba(15, 23, 42, 0.04);
        }

        .pay-hero {
          position: relative;
          display: flex;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
          padding: 28px;
          border-radius: 22px;
          overflow: hidden;
          background:
            radial-gradient(circle at top right, rgba(255, 154, 86, 0.16), transparent 28%),
            linear-gradient(180deg, #fffaf6 0%, #ffffff 100%);
        }
        .pay-hero::before {
          content: '';
          position: absolute;
          inset: 0 auto auto 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, #ff6b2b, #ff9a56, #ffbf7a);
        }

        .pay-hero-copy {
          max-width: 760px;
          position: relative;
          z-index: 1;
        }
        .pay-section-kicker,
        .pay-eyebrow {
          margin: 0 0 8px;
          font-size: 0.74rem;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #ff6b2b;
        }
        .pay-hero-title {
          margin: 0;
          font-family: 'EB Garamond', serif;
          font-size: clamp(2rem, 3vw, 3rem);
          line-height: 1;
          letter-spacing: -0.03em;
          color: #151515;
        }
        .pay-hero-title span {
          color: #ff6b2b;
        }
        .pay-hero-text {
          margin: 14px 0 0;
          max-width: 640px;
          font-size: 0.95rem;
          line-height: 1.7;
          color: #666;
        }

        .pay-hero-side {
          display: flex;
          flex-direction: column;
          gap: 12px;
          min-width: 240px;
          position: relative;
          z-index: 1;
        }
        .pay-chip {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.84);
          border: 1px solid rgba(255, 107, 43, 0.12);
          color: #6b4b3e;
          font-size: 0.82rem;
          font-weight: 700;
          width: fit-content;
          max-width: 100%;
        }
        .pay-chip--soft {
          border-radius: 16px;
          color: #757575;
          font-weight: 600;
          border-color: rgba(15, 23, 42, 0.08);
        }
        .pay-chip-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 0 6px rgba(16, 185, 129, 0.14);
        }

        .pay-top-grid,
        .pay-content-grid,
        .pay-stats-grid {
          display: grid;
          gap: 18px;
        }
        .pay-top-grid {
          grid-template-columns: 1.8fr 1fr;
        }
        .pay-stats-grid {
          grid-template-columns: repeat(3, 1fr);
        }
        .pay-content-grid {
          grid-template-columns: 1.55fr 1fr;
          align-items: start;
        }

        .pay-balance-card,
        .pay-progress-card,
        .pay-panel,
        .pay-help-card,
        .pay-stat-card {
          border-radius: 20px;
          padding: 24px;
        }

        .pay-balance-card {
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(circle at bottom right, rgba(255, 107, 43, 0.12), transparent 30%),
            #fff;
        }
        .pay-balance-head,
        .pay-progress-head,
        .pay-panel-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          flex-wrap: wrap;
        }
        .pay-balance-value,
        .pay-progress-value,
        .pay-stat-value {
          margin: 0;
          line-height: 1;
          color: #171717;
        }
        .pay-balance-value {
          font-family: 'EB Garamond', serif;
          font-size: clamp(2.2rem, 4vw, 3.5rem);
          color: #ff6b2b;
        }
        .pay-progress-value {
          font-size: 1.4rem;
          font-weight: 800;
        }
        .pay-stat-value {
          font-size: 1.5rem;
          font-weight: 800;
        }
        .pay-balance-text,
        .pay-muted {
          margin: 0;
          color: #7a7a7a;
          line-height: 1.6;
          font-size: 0.86rem;
        }
        .pay-balance-text {
          margin-top: 18px;
          max-width: 620px;
        }

        .pay-balance-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 24px;
        }
        .pay-btn,
        .pay-text-link,
        .pay-icon-btn {
          transition: all 0.18s ease;
        }
        .pay-btn {
          border: none;
          border-radius: 12px;
          padding: 13px 18px;
          font-family: 'Manrope', sans-serif;
          font-size: 0.88rem;
          font-weight: 800;
          cursor: pointer;
        }
        .pay-btn--primary {
          background: linear-gradient(135deg, #ff7a35, #ff5b14);
          color: #fff;
          box-shadow: 0 12px 24px rgba(255, 107, 43, 0.22);
        }
        .pay-btn--primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 16px 32px rgba(255, 107, 43, 0.28);
        }
        .pay-btn--secondary {
          background: #fff7f1;
          color: #8f4c2d;
          border: 1px solid rgba(255, 107, 43, 0.18);
        }
        .pay-btn--secondary:hover {
          background: #fff1e7;
        }

        .pay-progress-track {
          width: 100%;
          height: 12px;
          border-radius: 999px;
          background: #f1f1f1;
          overflow: hidden;
          margin: 18px 0 14px;
        }
        .pay-progress-fill {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #ff9a56, #ff6b2b);
        }

        .pay-stat-card {
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }
        .pay-stat-icon,
        .pay-method-icon,
        .pay-doc-icon,
        .pay-help-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .pay-stat-icon {
          width: 46px;
          height: 46px;
          border-radius: 14px;
        }

        .pay-panel-title,
        .pay-doc-title,
        .pay-step-amount {
          margin: 0;
          color: #18181b;
          font-weight: 800;
        }
        .pay-panel-title {
          font-size: 1rem;
        }
        .pay-text-link {
          padding: 0;
          background: transparent;
          border: none;
          color: #ff6b2b;
          font-weight: 800;
          font-size: 0.82rem;
          cursor: pointer;
          text-decoration: none;
        }
        .pay-text-link:hover {
          color: #e25817;
        }
        .pay-text-link--strong {
          margin-top: 2px;
        }

        .pay-table-wrap {
          overflow-x: auto;
          margin-top: 18px;
          border-radius: 16px;
          border: 1px solid rgba(15, 23, 42, 0.06);
        }
        .pay-table {
          width: 100%;
          min-width: 620px;
          border-collapse: collapse;
          background: #fff;
        }
        .pay-table thead tr {
          background: #faf7f4;
        }
        .pay-table th,
        .pay-table td {
          padding: 16px 18px;
          text-align: left;
          border-bottom: 1px solid rgba(15, 23, 42, 0.06);
          font-size: 0.86rem;
        }
        .pay-table th {
          color: #8b8b8b;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .pay-table tbody tr:hover {
          background: #fffaf6;
        }
        .pay-align-right {
          text-align: right !important;
        }
        .pay-method {
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }
        .pay-method-icon,
        .pay-doc-icon,
        .pay-help-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: #faf7f4;
          color: #ff6b2b;
        }
        .pay-amount {
          font-weight: 800;
          color: #161616;
        }
        .pay-icon-btn {
          width: 38px;
          height: 38px;
          border: 1px solid rgba(255, 107, 43, 0.14);
          border-radius: 12px;
          background: #fff7f1;
          color: #ff6b2b;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .pay-icon-btn:hover:not(:disabled) {
          background: #ffefe3;
        }
        .pay-icon-btn:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        .pay-badge {
          display: inline-flex;
          align-items: center;
          border-radius: 999px;
          padding: 7px 11px;
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .pay-badge--highlight {
          background: rgba(255, 107, 43, 0.1);
          color: #ff6b2b;
        }
        .pay-badge--success {
          background: rgba(16, 185, 129, 0.12);
          color: #0f9d70;
        }
        .pay-badge--pending {
          background: rgba(120, 113, 108, 0.12);
          color: #6b6762;
        }

        .pay-side-stack,
        .pay-doc-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .pay-chart-donut {
          position: relative;
          width: 100%;
          height: 240px;
          margin-top: 10px;
        }
        .pay-chart-center {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }
        .pay-chart-center strong {
          font-size: 2rem;
          line-height: 1;
          color: #18181b;
        }
        .pay-chart-center span {
          margin-top: 6px;
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #8b8b8b;
        }
        .pay-legend {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 8px;
        }
        .pay-legend-item {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 10px;
          font-size: 0.84rem;
          color: #666;
        }
        .pay-legend-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
        .pay-legend-item strong {
          color: #18181b;
          font-size: 0.82rem;
        }
        .pay-doc-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px;
          border-radius: 16px;
          background: #fafafa;
          border: 1px solid rgba(15, 23, 42, 0.06);
        }
        .pay-doc-copy {
          flex: 1;
          min-width: 0;
        }
        .pay-doc-title {
          font-size: 0.9rem;
          margin-bottom: 2px;
        }

        .pay-help-card {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 16px;
          align-items: start;
        }

        .pay-timeline {
          position: relative;
          display: grid;
          grid-template-columns: repeat(6, minmax(140px, 1fr));
          gap: 14px;
          overflow-x: auto;
          padding-top: 8px;
          margin-top: 18px;
        }
        .pay-chart-block {
          width: 100%;
          height: 280px;
          margin-top: 18px;
          padding: 12px 8px 0;
          border-radius: 18px;
          background: linear-gradient(180deg, #fffaf6 0%, #ffffff 100%);
          border: 1px solid rgba(15, 23, 42, 0.06);
        }
        .pay-timeline-line {
          position: absolute;
          top: 38px;
          left: 0;
          right: 0;
          height: 4px;
          border-radius: 999px;
          background: linear-gradient(90deg, #ff6b2b 0%, #ff6b2b 48%, #ece7e3 48%, #ece7e3 100%);
        }
        .pay-step {
          position: relative;
          min-width: 140px;
          z-index: 1;
        }
        .pay-step-month {
          margin: 0 0 12px;
          font-size: 0.74rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #8f8f8f;
        }
        .pay-step-dot {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          margin-bottom: 14px;
          border: 4px solid #fff;
          box-shadow: 0 3px 8px rgba(15, 23, 42, 0.12);
          background: #dbd6d1;
        }
        .pay-step-card {
          padding: 14px;
          border-radius: 16px;
          background: #fbfbfb;
          border: 1px solid rgba(15, 23, 42, 0.06);
        }
        .pay-step-state {
          margin: 4px 0 0;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #8c8c8c;
        }
        .pay-step--paid .pay-step-dot,
        .pay-step--current .pay-step-dot {
          background: #ff6b2b;
        }
        .pay-step--paid .pay-step-state {
          color: #10b981;
        }
        .pay-step--current .pay-step-month,
        .pay-step--current .pay-step-amount,
        .pay-step--current .pay-step-state {
          color: #ff6b2b;
        }
        .pay-step--current .pay-step-card {
          background: #fff7f1;
          border-color: rgba(255, 107, 43, 0.18);
        }
        .pay-step--final .pay-step-state {
          color: #a16207;
        }

        .pay-footer {
          text-align: center;
          color: #8a8a8a;
          font-size: 0.8rem;
          padding: 4px 0 8px;
        }

        @media (max-width: 1100px) {
          .pay-top-grid,
          .pay-content-grid,
          .pay-stats-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .pay-hero,
          .pay-balance-card,
          .pay-progress-card,
          .pay-panel,
          .pay-help-card,
          .pay-stat-card {
            padding: 18px;
            border-radius: 18px;
          }

          .pay-hero-title {
            font-size: 2rem;
          }

          .pay-balance-actions {
            flex-direction: column;
          }

          .pay-btn {
            width: 100%;
          }

          .pay-help-card {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </AuthenticatedLayout>
  );
}

function IconWallet() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
      <path d="M18 9h2a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-2" />
      <circle cx="16" cy="12" r="1" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 12 5 5L20 7" />
    </svg>
  );
}

function IconReceipt() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 3v18l3-2 2 2 2-2 2 2 2-2 2 2 3-2V3z" />
      <path d="M8 7h8" />
      <path d="M8 11h8" />
      <path d="M8 15h5" />
    </svg>
  );
}

function IconCard() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </svg>
  );
}

function IconBank() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10 12 4l9 6" />
      <path d="M4 10h16" />
      <path d="M6 10v8" />
      <path d="M10 10v8" />
      <path d="M14 10v8" />
      <path d="M18 10v8" />
      <path d="M3 21h18" />
    </svg>
  );
}

function IconCash() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="3" />
      <path d="M6 12h.01" />
      <path d="M18 12h.01" />
    </svg>
  );
}

function IconDownload() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  );
}

function IconDocument() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8" />
      <path d="M8 17h6" />
    </svg>
  );
}

function IconHelp() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
  );
}
