import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

type Stat = {
  label: string;
  value: string;
  sub: string;
  color: string;
  icon: 'check' | 'wallet' | 'receipt';
};

type Summary = {
  remaining: string;
  paid: string;
  completion: number;
  nextDueLabel: string;
};

type MonthlyChartItem = { month: string; expected: number; paid: number };
type DistributionItem = { name: string; value: number; color: string };
type PaymentHistoryItem = {
  date: string;
  method: string;
  type: 'card' | 'bank' | 'cash';
  amount: string;
  status: 'paid' | 'pending';
};
type InvoiceItem = { title: string; issuedAt: string };
type InstallmentItem = {
  month: string;
  amount: string;
  state: 'paid' | 'current' | 'upcoming' | 'final';
};

type PageProps = {
  auth: { user: { id: number; name: string; email: string } };
  stats?: Stat[];
  summary?: Summary;
  monthlyChart?: MonthlyChartItem[];
  distributionChart?: DistributionItem[];
  paymentHistory?: PaymentHistoryItem[];
  invoices?: InvoiceItem[];
  installments?: InstallmentItem[];
};

const fallbackSummary: Summary = {
  remaining: '0,00 DH',
  paid: '0 / 0 DH',
  completion: 0,
  nextDueLabel: 'Aucune echeance',
};

const methodIcon: Record<PaymentHistoryItem['type'], string> = {
  card: 'credit_card',
  bank: 'account_balance',
  cash: 'payments',
};

const statIcon: Record<Stat['icon'], string> = {
  check: 'check_circle',
  wallet: 'account_balance_wallet',
  receipt: 'receipt_long',
};

const installmentLabel: Record<InstallmentItem['state'], string> = {
  paid: 'Regle',
  current: 'En cours',
  upcoming: 'Programme',
  final: 'Final',
};

function clampPercent(value: number | undefined) {
  return Math.max(0, Math.min(100, Number(value ?? 0)));
}

function formatDh(value: number) {
  return `${Number(value ?? 0).toLocaleString('fr-FR')} DH`;
}

function icon(name: string, className = '') {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>;
}

function statusMeta(status: PaymentHistoryItem['status']) {
  return status === 'paid'
    ? { label: 'Paye', className: 'paid' }
    : { label: 'En attente', className: 'pending' };
}

function maxChartValue(items: MonthlyChartItem[]) {
  return Math.max(1, ...items.flatMap((item) => [item.expected, item.paid]));
}

export default function Payment() {
  const { props } = usePage<PageProps>();
  const user = props.auth.user;
  const firstName = user.name.split(' ')[0] || user.name;
  const stats = props.stats ?? [];
  const summary = props.summary ?? fallbackSummary;
  const monthlyChart = props.monthlyChart ?? [];
  const distributionChart = props.distributionChart ?? [];
  const paymentHistory = props.paymentHistory ?? [];
  const invoices = props.invoices ?? [];
  const installments = props.installments ?? [];
  const completion = clampPercent(summary.completion);
  const chartMax = maxChartValue(monthlyChart);
  const paidInstallments = installments.filter((item) => item.state === 'paid').length;
  const timelineProgress = installments.length > 0 ? Math.round((paidInstallments / installments.length) * 100) : 0;

  return (
    <AuthenticatedLayout header={<h2>Paiements</h2>}>
      <Head title="Paiements" />

      <div className="student-payment">
        <section className="payment-hero">
          <div>
            <p className="payment-kicker">Espace financier</p>
            <h1>Suivi des paiements de {firstName}</h1>
            <p className="payment-subtitle">
              Retrouvez vos reglements, echeances et documents financiers directement depuis les donnees de votre dossier.
            </p>
          </div>

          <button type="button" className="payment-primary" onClick={() => window.print()}>
            {icon('download')}
            Telecharger le releve
          </button>
        </section>

        <section className="payment-stats" aria-label="Resume financier">
          {stats.length > 0 ? stats.map((stat) => (
            <article className="payment-stat" key={stat.label}>
              <div>
                {icon(statIcon[stat.icon] ?? 'receipt_long')}
                <span>{stat.label}</span>
              </div>
              <strong>{stat.value}</strong>
              <small>{stat.sub}</small>
            </article>
          )) : (
            <>
              <article className="payment-stat">
                <div>{icon('payments')}<span>Montant regle</span></div>
                <strong>{summary.paid}</strong>
                <small>Depuis votre dossier</small>
              </article>
              <article className="payment-stat">
                <div>{icon('account_balance_wallet')}<span>Reste a payer</span></div>
                <strong>{summary.remaining}</strong>
                <small>{summary.nextDueLabel}</small>
              </article>
              <article className="payment-stat">
                <div>{icon('analytics')}<span>Progression</span></div>
                <strong>{completion}%</strong>
                <small>Regle</small>
              </article>
            </>
          )}
        </section>

        <section className="payment-overview-grid">
          <article className="payment-panel payment-balance">
            <p className="payment-kicker">Solde restant</p>
            <h2>{summary.remaining}</h2>
            <p>
              Votre dossier est regle a {completion}%. La prochaine information financiere disponible est:
              <strong> {summary.nextDueLabel}</strong>.
            </p>
            <div className="payment-actions">
              <button type="button">{icon('credit_card')} Regler maintenant</button>
              <a href="#payment-timeline">{icon('event')} Voir les echeances</a>
            </div>
          </article>

          <article className="payment-panel payment-progress">
            <p className="payment-kicker">Progression annuelle</p>
            <h2>{summary.paid}</h2>
            <div className="payment-track" aria-hidden>
              <span style={{ width: `${completion}%` }} />
            </div>
            <strong>{completion}% regle</strong>
          </article>
        </section>

        <section className="payment-main-grid">
          <article className="payment-panel payment-history-panel">
            <div className="payment-section-head">
              <div>
                <h2>Historique des paiements</h2>
                <p>Reglements deja enregistres dans votre espace etudiant.</p>
              </div>
            </div>

            {paymentHistory.length > 0 ? (
              <>
                <div className="payment-table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Mode</th>
                        <th>Montant</th>
                        <th>Statut</th>
                        <th>Recu</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentHistory.map((item, index) => {
                        const status = statusMeta(item.status);

                        return (
                          <tr key={`${item.date}-${item.amount}-${index}`}>
                            <td>{item.date}</td>
                            <td>
                              <span className="payment-method">
                                {icon(methodIcon[item.type] ?? 'credit_card')}
                                {item.method}
                              </span>
                            </td>
                            <td className="payment-amount">{item.amount}</td>
                            <td><span className={`payment-badge ${status.className}`}>{status.label}</span></td>
                            <td>
                              <button type="button" className="payment-icon-btn" disabled={item.status === 'pending'} title="Telecharger">
                                {icon('download')}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="payment-mobile-list">
                  {paymentHistory.map((item, index) => {
                    const status = statusMeta(item.status);

                    return (
                      <article className="payment-mobile-row" key={`${item.method}-${item.amount}-${index}`}>
                        <div>
                          {icon(methodIcon[item.type] ?? 'credit_card')}
                          <span>
                            <strong>{item.method}</strong>
                            <small>{item.date}</small>
                          </span>
                        </div>
                        <div>
                          <strong>{item.amount}</strong>
                          <span className={`payment-badge ${status.className}`}>{status.label}</span>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="payment-empty">Aucun paiement enregistre pour le moment.</div>
            )}
          </article>

          <aside className="payment-side">
            <article className="payment-panel">
              <div className="payment-section-head">
                <div>
                  <h2>Repartition</h2>
                  <p>Montants regles et restant a solder.</p>
                </div>
              </div>

              {distributionChart.length > 0 ? (
                <div className="payment-distribution">
                  <div className="payment-ring" style={{ '--progress': `${completion}%` } as React.CSSProperties}>
                    <strong>{completion}%</strong>
                    <span>regle</span>
                  </div>
                  <div className="payment-legend">
                    {distributionChart.map((item) => (
                      <div key={item.name}>
                        <span style={{ background: item.color }} />
                        <small>{item.name}</small>
                        <strong>{formatDh(item.value)}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="payment-empty">Aucune repartition disponible.</div>
              )}
            </article>

            <article className="payment-panel">
              <div className="payment-section-head">
                <div>
                  <h2>Factures officielles</h2>
                  <p>Documents disponibles au telechargement.</p>
                </div>
              </div>

              <div className="payment-documents">
                {invoices.length > 0 ? invoices.map((invoice) => (
                  <article className="payment-document" key={`${invoice.title}-${invoice.issuedAt}`}>
                    <div>
                      {icon('description')}
                      <span>
                        <strong>{invoice.title}</strong>
                        <small>Edite le {invoice.issuedAt}</small>
                      </span>
                    </div>
                    <button type="button" title="Telecharger">
                      {icon('download')}
                    </button>
                  </article>
                )) : (
                  <div className="payment-empty">Aucune facture disponible.</div>
                )}
              </div>
            </article>

            <article className="payment-panel payment-help">
              {icon('help')}
              <div>
                <h2>Facture manquante ?</h2>
                <p>Contactez l'administration pour demander un duplicata ou un justificatif supplementaire.</p>
                <Link href={route('contact')}>Contacter le centre</Link>
              </div>
            </article>
          </aside>
        </section>

        {(monthlyChart.length > 0 || installments.length > 0) && (
          <section className="payment-panel" id="payment-timeline">
            <div className="payment-section-head">
              <div>
                <h2>Calendrier des echeances</h2>
                <p>Suivi mois par mois des versements de l'annee.</p>
              </div>
            </div>

            {monthlyChart.length > 0 && (
              <div className="payment-bars">
                {monthlyChart.map((item) => (
                  <div key={item.month}>
                    <div>
                      <span style={{ height: `${Math.max(4, (item.expected / chartMax) * 100)}%` }} title={`Prevu: ${formatDh(item.expected)}`} />
                      <strong style={{ height: `${Math.max(4, (item.paid / chartMax) * 100)}%` }} title={`Regle: ${formatDh(item.paid)}`} />
                    </div>
                    <small>{item.month}</small>
                  </div>
                ))}
              </div>
            )}

            {installments.length > 0 && (
              <div className="payment-timeline-wrap">
                <div className="payment-timeline">
                  <div className="payment-timeline-line" aria-hidden>
                    <span style={{ width: `${timelineProgress}%` }} />
                  </div>

                  {installments.map((item, index) => (
                    <article className={`payment-step ${item.state}`} key={`${item.month}-${index}`}>
                      <span>{item.month}</span>
                      <i />
                      <div>
                        <strong>{item.amount}</strong>
                        <small>{installmentLabel[item.state]}</small>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

        .student-payment {
          --surface: #faf5ee;
          --surface-low: #f6f0e8;
          --surface-mid: #ece6dc;
          --text: #3a302a;
          --muted: #605850;
          --soft: #9a9088;
          --line: #d8d0c8;
          --primary: #c2652a;
          --primary-soft: #fbe8d8;
          color: var(--text);
          display: flex;
          flex-direction: column;
          gap: 34px;
          font-family: 'Manrope', sans-serif;
          margin: -28px;
          min-height: calc(100vh - 64px);
          padding: 46px clamp(18px, 4vw, 48px) 64px;
          background-color: var(--surface);
          background-image: radial-gradient(rgba(216, 208, 200, .85) .6px, transparent .6px);
          background-size: 24px 24px;
        }

        .student-payment * { box-sizing: border-box; }
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 430, 'GRAD' 0, 'opsz' 24; }

        .payment-hero {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
        }

        .payment-kicker {
          color: var(--primary);
          font-size: .72rem;
          font-weight: 800;
          letter-spacing: .16em;
          margin: 0 0 10px;
          text-transform: uppercase;
        }

        .payment-hero h1 {
          font-family: 'EB Garamond', serif;
          font-size: clamp(3.25rem, 7.2vw, 6.2rem);
          font-weight: 600;
          line-height: .9;
          margin: 0;
          max-width: 880px;
        }

        .payment-subtitle {
          color: var(--muted);
          font-size: .95rem;
          font-weight: 700;
          line-height: 1.6;
          margin: 18px 0 0;
          max-width: 720px;
        }

        .payment-primary,
        .payment-actions button,
        .payment-actions a {
          align-items: center;
          border-radius: 8px;
          display: inline-flex;
          font-family: 'Manrope', sans-serif;
          font-size: .9rem;
          font-weight: 800;
          gap: 9px;
          min-height: 48px;
          padding: 0 20px;
          text-decoration: none;
        }

        .payment-primary,
        .payment-actions button {
          background: var(--primary);
          border: 0;
          color: white;
          cursor: pointer;
        }

        .payment-stats {
          display: grid;
          gap: 18px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .payment-stat,
        .payment-panel {
          background: white;
          border: 1px solid rgba(216, 208, 200, .75);
          border-radius: 12px;
          box-shadow: 0 2px 16px rgba(58, 48, 42, .045);
        }

        .payment-stat {
          min-height: 154px;
          padding: 26px;
        }

        .payment-stat div:first-child {
          align-items: flex-start;
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 18px;
        }

        .payment-stat .material-symbols-outlined {
          background: var(--primary-soft);
          border-radius: 8px;
          color: var(--primary);
          padding: 11px;
        }

        .payment-stat div:first-child span:last-child {
          color: var(--muted);
          font-size: .68rem;
          font-weight: 800;
          letter-spacing: .08em;
          text-align: right;
          text-transform: uppercase;
        }

        .payment-stat strong {
          display: block;
          font-family: 'EB Garamond', serif;
          font-size: clamp(1.8rem, 3vw, 2.55rem);
          font-weight: 600;
          line-height: 1.04;
        }

        .payment-stat small {
          color: var(--muted);
          display: block;
          font-size: .8rem;
          margin-top: 8px;
        }

        .payment-overview-grid {
          display: grid;
          gap: 22px;
          grid-template-columns: minmax(0, 1.15fr) minmax(320px, .85fr);
        }

        .payment-panel { padding: 28px; }

        .payment-balance {
          background: var(--surface-low);
        }

        .payment-balance h2,
        .payment-progress h2,
        .payment-section-head h2,
        .payment-help h2 {
          font-family: 'EB Garamond', serif;
          font-weight: 600;
          margin: 0;
        }

        .payment-balance h2,
        .payment-progress h2 {
          font-size: clamp(2.1rem, 4vw, 3.45rem);
          line-height: 1;
        }

        .payment-balance p:not(.payment-kicker),
        .payment-section-head p,
        .payment-help p {
          color: var(--muted);
          font-size: .88rem;
          line-height: 1.7;
          margin: 14px 0 0;
        }

        .payment-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 24px;
        }

        .payment-actions a {
          background: white;
          border: 1px solid var(--line);
          color: var(--text);
        }

        .payment-progress {
          background: var(--text);
          color: var(--surface);
        }

        .payment-progress .payment-kicker,
        .payment-progress strong { color: var(--primary-soft); }

        .payment-progress h2 { color: var(--surface); font-size: clamp(1.6rem, 3vw, 2.4rem); }

        .payment-track {
          background: rgba(250, 245, 238, .16);
          border-radius: 999px;
          height: 9px;
          margin: 28px 0 14px;
          overflow: hidden;
        }

        .payment-track span {
          background: var(--primary);
          border-radius: inherit;
          display: block;
          height: 100%;
        }

        .payment-main-grid {
          align-items: start;
          display: grid;
          gap: 22px;
          grid-template-columns: minmax(0, 1.45fr) minmax(330px, .75fr);
        }

        .payment-side {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .payment-section-head {
          align-items: flex-start;
          display: flex;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 18px;
        }

        .payment-section-head h2,
        .payment-help h2 { font-size: 1.9rem; line-height: 1; }

        .payment-table-wrap {
          border: 1px solid rgba(216, 208, 200, .72);
          border-radius: 12px;
          overflow-x: auto;
        }

        .payment-table-wrap table {
          border-collapse: collapse;
          min-width: 620px;
          width: 100%;
        }

        .payment-table-wrap thead { background: var(--surface-low); }

        .payment-table-wrap th,
        .payment-table-wrap td {
          border-bottom: 1px solid rgba(216, 208, 200, .58);
          font-size: .84rem;
          padding: 15px 16px;
          text-align: left;
        }

        .payment-table-wrap th {
          color: var(--soft);
          font-size: .68rem;
          font-weight: 900;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        .payment-table-wrap tbody tr:hover { background: #fffaf6; }
        .payment-table-wrap td:last-child,
        .payment-table-wrap th:last-child { text-align: right; }

        .payment-method {
          align-items: center;
          display: inline-flex;
          gap: 8px;
        }

        .payment-method .material-symbols-outlined,
        .payment-mobile-row .material-symbols-outlined {
          background: var(--primary-soft);
          border-radius: 8px;
          color: var(--primary);
          font-size: 19px;
          padding: 8px;
        }

        .payment-amount { color: var(--text); font-weight: 900; }

        .payment-badge {
          border-radius: 999px;
          display: inline-flex;
          font-size: .66rem;
          font-weight: 900;
          letter-spacing: .08em;
          padding: 5px 10px;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .payment-badge.paid {
          background: rgba(58, 143, 95, .14);
          color: #276642;
        }

        .payment-badge.pending {
          background: rgba(194, 101, 42, .14);
          color: var(--primary);
        }

        .payment-icon-btn,
        .payment-document button {
          align-items: center;
          background: var(--primary-soft);
          border: 0;
          border-radius: 8px;
          color: var(--primary);
          cursor: pointer;
          display: inline-flex;
          height: 38px;
          justify-content: center;
          width: 38px;
        }

        .payment-icon-btn:disabled {
          cursor: not-allowed;
          opacity: .4;
        }

        .payment-mobile-list {
          display: none;
          flex-direction: column;
          gap: 12px;
        }

        .payment-mobile-row {
          align-items: center;
          background: var(--surface-low);
          border: 1px solid rgba(216, 208, 200, .7);
          border-radius: 12px;
          display: flex;
          justify-content: space-between;
          gap: 14px;
          padding: 14px;
        }

        .payment-mobile-row > div {
          align-items: center;
          display: flex;
          gap: 12px;
          min-width: 0;
        }

        .payment-mobile-row > div:last-child {
          align-items: flex-end;
          flex-direction: column;
          gap: 5px;
        }

        .payment-mobile-row strong { display: block; font-size: .86rem; }
        .payment-mobile-row small { color: var(--soft); display: block; font-size: .72rem; margin-top: 2px; }

        .payment-distribution {
          align-items: center;
          display: grid;
          gap: 20px;
          grid-template-columns: auto minmax(0, 1fr);
        }

        .payment-ring {
          --progress: 0%;
          align-items: center;
          background:
            radial-gradient(circle, white 0 57%, transparent 58%),
            conic-gradient(var(--primary) var(--progress), var(--surface-mid) 0);
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          height: 150px;
          justify-content: center;
          width: 150px;
        }

        .payment-ring strong {
          font-family: 'EB Garamond', serif;
          font-size: 2.1rem;
          line-height: 1;
        }

        .payment-ring span {
          color: var(--soft);
          font-size: .7rem;
          font-weight: 900;
          letter-spacing: .1em;
          text-transform: uppercase;
        }

        .payment-legend {
          display: flex;
          flex-direction: column;
          gap: 11px;
        }

        .payment-legend div {
          align-items: center;
          display: grid;
          gap: 8px;
          grid-template-columns: auto 1fr auto;
        }

        .payment-legend span {
          border-radius: 50%;
          height: 10px;
          width: 10px;
        }

        .payment-legend small { color: var(--muted); font-size: .8rem; }
        .payment-legend strong { font-size: .82rem; }

        .payment-documents {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .payment-document {
          align-items: center;
          background: var(--surface-low);
          border: 1px solid transparent;
          border-radius: 12px;
          display: flex;
          gap: 12px;
          justify-content: space-between;
          padding: 16px;
        }

        .payment-document:hover {
          background: white;
          border-color: rgba(194, 101, 42, .24);
        }

        .payment-document > div {
          align-items: center;
          display: flex;
          gap: 12px;
          min-width: 0;
        }

        .payment-document > div > .material-symbols-outlined,
        .payment-help > .material-symbols-outlined {
          align-items: center;
          background: white;
          border-radius: 9px;
          color: var(--primary);
          display: flex;
          flex-shrink: 0;
          height: 42px;
          justify-content: center;
          width: 42px;
        }

        .payment-document span { min-width: 0; }
        .payment-document strong {
          display: block;
          font-size: .84rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .payment-document small {
          color: var(--muted);
          display: block;
          font-size: .68rem;
          font-weight: 800;
          letter-spacing: .06em;
          margin-top: 3px;
          text-transform: uppercase;
        }

        .payment-help {
          align-items: flex-start;
          background: var(--surface-low);
          display: grid;
          gap: 14px;
          grid-template-columns: auto 1fr;
        }

        .payment-help a {
          color: var(--primary);
          display: inline-block;
          font-size: .82rem;
          font-weight: 900;
          margin-top: 12px;
          text-decoration: none;
        }

        .payment-bars {
          align-items: end;
          background: linear-gradient(180deg, #fffaf6 0%, white 100%);
          border: 1px solid rgba(216, 208, 200, .62);
          border-radius: 12px;
          display: flex;
          gap: 14px;
          height: 260px;
          margin-top: 18px;
          overflow-x: auto;
          padding: 26px 18px 34px;
        }

        .payment-bars > div {
          align-items: end;
          display: flex;
          flex: 1 0 58px;
          flex-direction: column;
          gap: 8px;
          height: 100%;
          justify-content: flex-end;
        }

        .payment-bars > div > div {
          align-items: end;
          display: grid;
          gap: 4px;
          grid-template-columns: 1fr 1fr;
          height: 100%;
          width: 100%;
        }

        .payment-bars span,
        .payment-bars strong {
          align-self: end;
          border-radius: 5px 5px 0 0;
          display: block;
          min-height: 4px;
        }

        .payment-bars span { background: #f2d7c7; }
        .payment-bars strong { background: var(--primary); }

        .payment-bars small {
          color: var(--soft);
          font-size: .66rem;
          font-weight: 900;
          letter-spacing: .08em;
          text-transform: uppercase;
        }

        .payment-timeline-wrap {
          margin-top: 24px;
          overflow-x: auto;
          padding-bottom: 8px;
        }

        .payment-timeline {
          display: flex;
          min-width: max-content;
          padding: 0 4px 4px;
          position: relative;
        }

        .payment-timeline-line {
          background: var(--surface-mid);
          border-radius: 999px;
          height: 4px;
          left: 0;
          overflow: hidden;
          position: absolute;
          right: 0;
          top: 34px;
        }

        .payment-timeline-line span {
          background: var(--primary);
          display: block;
          height: 100%;
        }

        .payment-step {
          align-items: center;
          display: flex;
          flex-direction: column;
          min-width: 136px;
          padding: 0 12px;
          position: relative;
          z-index: 1;
        }

        .payment-step > span {
          color: var(--soft);
          font-size: .68rem;
          font-weight: 900;
          letter-spacing: .1em;
          margin-bottom: 10px;
          text-align: center;
          text-transform: uppercase;
        }

        .payment-step i {
          background: var(--line);
          border: 4px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 7px rgba(58, 48, 42, .14);
          display: block;
          height: 22px;
          margin-bottom: 12px;
          width: 22px;
        }

        .payment-step div {
          background: white;
          border: 1px solid rgba(216, 208, 200, .7);
          border-radius: 12px;
          padding: 12px;
          text-align: center;
          width: 100%;
        }

        .payment-step div strong { display: block; font-size: .86rem; }
        .payment-step div small {
          color: var(--soft);
          display: block;
          font-size: .62rem;
          font-weight: 900;
          letter-spacing: .08em;
          margin-top: 4px;
          text-transform: uppercase;
        }

        .payment-step.paid i,
        .payment-step.current i { background: var(--primary); }
        .payment-step.current > span,
        .payment-step.current strong,
        .payment-step.current small { color: var(--primary); }
        .payment-step.current div {
          background: #fff7f1;
          border-color: rgba(194, 101, 42, .24);
        }

        .payment-empty {
          align-items: center;
          border: 1.5px dashed rgba(154, 144, 136, .45);
          border-radius: 12px;
          color: var(--soft);
          display: flex;
          font-size: .82rem;
          font-style: italic;
          justify-content: center;
          min-height: 118px;
          padding: 16px;
          text-align: center;
        }

        @media (max-width: 1180px) {
          .payment-main-grid,
          .payment-overview-grid { grid-template-columns: 1fr; }
          .payment-side { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .payment-help { grid-column: 1 / -1; }
        }

        @media (max-width: 900px) {
          .student-payment { margin: -18px -16px -32px; padding: 30px 16px 44px; }
          .payment-hero { align-items: flex-start; flex-direction: column; }
          .payment-stats,
          .payment-side { grid-template-columns: 1fr; }
          .payment-table-wrap { display: none; }
          .payment-mobile-list { display: flex; }
          .payment-distribution { grid-template-columns: 1fr; justify-items: center; }
          .payment-legend { width: 100%; }
        }

        @media (max-width: 560px) {
          .payment-hero h1 { font-size: 3rem; }
          .payment-stat,
          .payment-panel { padding: 20px; }
          .payment-actions { flex-direction: column; }
          .payment-actions button,
          .payment-actions a,
          .payment-primary { justify-content: center; width: 100%; }
          .payment-mobile-row { align-items: flex-start; flex-direction: column; }
          .payment-mobile-row > div:last-child { align-items: flex-start; }
          .payment-help { grid-template-columns: 1fr; }
        }
      `}</style>
    </AuthenticatedLayout>
  );
}
