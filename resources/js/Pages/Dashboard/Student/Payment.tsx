import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import {
  Bar, BarChart, CartesianGrid, Cell, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';

/* ═══════════════════════════════════════════════════
   TYPES — match your Laravel controller props
═══════════════════════════════════════════════════ */

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

type MonthlyChartItem   = { month: string; expected: number; paid: number };
type DistributionItem   = { name: string; value: number; color: string };
type PaymentHistoryItem = {
  date: string; method: string; type: 'card' | 'bank' | 'cash';
  amount: string; status: 'paid' | 'pending';
};
type InvoiceItem      = { title: string; issuedAt: string };
type InstallmentItem  = {
  month: string; amount: string;
  state: 'paid' | 'current' | 'upcoming' | 'final';
};

type PageProps = {
  auth: { user: { id: number; name: string; email: string } };
  stats: Stat[];
  summary: Summary;
  monthlyChart: MonthlyChartItem[];
  distributionChart: DistributionItem[];
  paymentHistory: PaymentHistoryItem[];
  invoices: InvoiceItem[];
  installments: InstallmentItem[];
};

/* ═══════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════ */

const fmtDh = (v: number | string | undefined) =>
  `${Number(v ?? 0).toLocaleString('fr-FR')} DH`;

const statusMeta = (s: 'paid' | 'pending') =>
  s === 'paid'
    ? { label: 'Payé', cls: 'pay-badge--success' }
    : { label: 'En attente', cls: 'pay-badge--pending' };

/* ═══════════════════════════════════════════════════
   ICONS
═══════════════════════════════════════════════════ */

const IconWallet    = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/><path d="M18 9h2a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-2"/><circle cx="16" cy="12" r="1"/></svg>;
const IconCheck     = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7"/></svg>;
const IconReceipt   = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 3v18l3-2 2 2 2-2 2 2 2-2 2 2 3-2V3z"/><path d="M8 7h8"/><path d="M8 11h8"/><path d="M8 15h5"/></svg>;
const IconCard      = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>;
const IconBank      = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10 12 4l9 6"/><path d="M4 10h16"/><path d="M6 10v8"/><path d="M10 10v8"/><path d="M14 10v8"/><path d="M18 10v8"/><path d="M3 21h18"/></svg>;
const IconCash      = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 12h.01"/><path d="M18 12h.01"/></svg>;
const IconDownload  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></svg>;
const IconDocument  = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8"/><path d="M8 17h6"/></svg>;
const IconHelp      = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>;

const methodIcon = (t: PaymentHistoryItem['type']) =>
  t === 'bank' ? <IconBank /> : t === 'cash' ? <IconCash /> : <IconCard />;

const statIcon = (i: Stat['icon']) =>
  i === 'check' ? <IconCheck /> : i === 'receipt' ? <IconReceipt /> : <IconWallet />;

/* ═══════════════════════════════════════════════════
   SUB-COMPONENTS
═══════════════════════════════════════════════════ */

function StatCard({ label, value, sub, color, icon }: Stat) {
  return (
    <div className="pay-stat-card">
      <div className="pay-stat-icon" style={{ background: `${color}16`, color }}>
        {statIcon(icon)}
      </div>
      <div className="pay-stat-body">
        <p className="pay-eyebrow">{label}</p>
        <p className="pay-stat-value">{value}</p>
        <p className="pay-muted">{sub}</p>
      </div>
    </div>
  );
}

/* Responsive table — cards on mobile */
function PaymentTable({ rows }: { rows: PaymentHistoryItem[] }) {
  return (
    <>
      {/* Desktop table */}
      <div className="pay-table-wrap">
        <table className="pay-table">
          <thead>
            <tr>
              <th>Date</th><th>Mode</th><th>Montant</th><th>Statut</th>
              <th style={{ textAlign: 'right' }}>Reçu</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item, i) => {
              const { label, cls } = statusMeta(item.status);
              return (
                <tr key={i}>
                  <td>{item.date}</td>
                  <td>
                    <div className="pay-method">
                      <span className="pay-method-icon">{methodIcon(item.type)}</span>
                      <span>{item.method}</span>
                    </div>
                  </td>
                  <td className="pay-amount">{item.amount}</td>
                  <td><span className={`pay-badge ${cls}`}>{label}</span></td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="pay-icon-btn" disabled={item.status === 'pending'}>
                      <IconDownload />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="pay-mobile-list">
        {rows.map((item, i) => {
          const { label, cls } = statusMeta(item.status);
          return (
            <div key={i} className="pay-mobile-row">
              <div className="pay-mobile-left">
                <div className="pay-method-icon">{methodIcon(item.type)}</div>
                <div>
                  <p className="pay-mobile-method">{item.method}</p>
                  <p className="pay-muted">{item.date}</p>
                </div>
              </div>
              <div className="pay-mobile-right">
                <p className="pay-amount">{item.amount}</p>
                <span className={`pay-badge ${cls}`}>{label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════ */

export default function Payment() {
  const { props } = usePage<PageProps>();
  const {
    stats = [], summary, monthlyChart = [], distributionChart = [],
    paymentHistory = [], invoices = [], installments = [],
  } = props;

  const user = props.auth.user;
  const firstName = user.name.split(' ')[0];

  /* Fallback summary when backend hasn't sent data yet */
  const s: Summary = summary ?? {
    remaining: '— DH', paid: '— DH', completion: 0, nextDueLabel: 'Aucune échéance',
  };

  return (
    <AuthenticatedLayout header={<h2>Paiements</h2>}>
      <Head title="Paiements" />

      <div className="pay-root">

        {/* ── Hero ── */}
        <section className="pay-hero">
          <div className="pay-hero-copy">
            <p className="pay-eyebrow">Espace financier</p>
            <h1 className="pay-hero-title">
              Suivi des paiements de <span>{firstName}</span>
            </h1>
            <p className="pay-hero-text">
              Retrouvez votre solde, vos échéances, l'historique des règlements et vos documents
              administratifs pour l'année en cours.
            </p>
          </div>
          <div className="pay-hero-side">
            <div className="pay-chip">
              <span className="pay-chip-dot" />
              {s.nextDueLabel}
            </div>
            <div className="pay-chip pay-chip--soft">
              Transactions sécurisées SSL 256 bits
            </div>
          </div>
        </section>

        {/* ── Balance + Progress ── */}
        <section className="pay-top-grid">
          <div className="pay-balance-card">
            <div className="pay-flex-between">
              <div>
                <p className="pay-eyebrow">Solde restant</p>
                <h3 className="pay-balance-value">{s.remaining}</h3>
              </div>
              <span className="pay-badge pay-badge--highlight">{s.nextDueLabel}</span>
            </div>
            <p className="pay-balance-text">
              Votre dossier est à jour à {s.completion}%. Il reste une partie du montant annuel
              à régler pour finaliser la scolarité.
            </p>
            <div className="pay-balance-actions">
              <button type="button" className="pay-btn pay-btn--primary">Régler maintenant</button>
              <button type="button" className="pay-btn pay-btn--secondary">Voir les échéances</button>
            </div>
          </div>

          <div className="pay-progress-card">
            <div className="pay-flex-between">
              <div>
                <p className="pay-eyebrow">Progression annuelle</p>
                <h3 className="pay-progress-value">{s.paid}</h3>
              </div>
              <span className="pay-badge pay-badge--success">{s.completion}% réglé</span>
            </div>
            <div className="pay-progress-track">
              <div className="pay-progress-fill" style={{ width: `${s.completion}%` }} />
            </div>
            <p className="pay-muted">
              Une lecture claire de vos versements pour garder un suivi financier stable tout au long
              de la formation.
            </p>
          </div>
        </section>

        {/* ── Stats ── */}
        {stats.length > 0 && (
          <section className="pay-stats-grid">
            {stats.map((stat) => <StatCard key={stat.label} {...stat} />)}
          </section>
        )}

        {/* ── Main content grid ── */}
        <section className="pay-content-grid">

          {/* Left — history */}
          <div className="pay-panel">
            <div className="pay-flex-between pay-mb">
              <div>
                <h3 className="pay-panel-title">Historique des paiements</h3>
                <p className="pay-muted">Vue détaillée des règlements déjà enregistrés.</p>
              </div>
            </div>
            {paymentHistory.length > 0
              ? <PaymentTable rows={paymentHistory} />
              : <div className="pay-empty">Aucun paiement enregistré pour le moment.</div>
            }
          </div>

          {/* Right stack */}
          <div className="pay-side-stack">

            {/* Donut chart */}
            {distributionChart.length > 0 && (
              <div className="pay-panel">
                <h3 className="pay-panel-title pay-mb-sm">Répartition du budget</h3>
                <p className="pay-muted">Entre le montant déjà réglé et le reste à solder.</p>
                <div className="pay-chart-donut">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={distributionChart} dataKey="value" nameKey="name"
                        innerRadius={60} outerRadius={88} paddingAngle={3} stroke="none">
                        {distributionChart.map((e) => <Cell key={e.name} fill={e.color} />)}
                      </Pie>
                      <Tooltip formatter={(v) => fmtDh(v as number)} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="pay-chart-center">
                    <strong>{s.completion}%</strong>
                    <span>réglé</span>
                  </div>
                </div>
                <div className="pay-legend">
                  {distributionChart.map((e) => (
                    <div key={e.name} className="pay-legend-item">
                      <span className="pay-legend-dot" style={{ background: e.color }} />
                      <span>{e.name}</span>
                      <strong>{e.value.toLocaleString('fr-FR')} DH</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Invoices */}
            <div className="pay-panel">
              <h3 className="pay-panel-title pay-mb-sm">Factures officielles</h3>
              <p className="pay-muted">Documents disponibles au téléchargement.</p>
              {invoices.length > 0 ? (
                <div className="pay-doc-list">
                  {invoices.map((inv) => (
                    <div key={`${inv.title}-${inv.issuedAt}`} className="pay-doc-card">
                      <div className="pay-doc-icon"><IconDocument /></div>
                      <div className="pay-doc-copy">
                        <p className="pay-doc-title">{inv.title}</p>
                        <p className="pay-muted">Édité le {inv.issuedAt}</p>
                      </div>
                      <button type="button" className="pay-icon-btn"><IconDownload /></button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="pay-empty">Aucune facture disponible.</div>
              )}
            </div>

            {/* Help */}
            <div className="pay-help-card pay-panel">
              <div className="pay-help-icon"><IconHelp /></div>
              <div>
                <h3 className="pay-panel-title pay-mb-sm">Facture manquante ?</h3>
                <p className="pay-muted">
                  Contactez l'administration pour demander un duplicata ou un justificatif supplémentaire.
                </p>
              </div>
              <Link href={route('contact')} className="pay-text-link">
                Contacter le centre
              </Link>
            </div>
          </div>
        </section>

        {/* ── Bar chart + Timeline ── */}
        {(monthlyChart.length > 0 || installments.length > 0) && (
          <section className="pay-panel">
            <h3 className="pay-panel-title pay-mb-sm">Calendrier des échéances</h3>
            <p className="pay-muted">Suivi mois par mois des versements de l'année.</p>

            {monthlyChart.length > 0 && (
              <div className="pay-chart-block">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyChart} barGap={6} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                    <CartesianGrid vertical={false} stroke="rgba(15,23,42,0.07)" />
                    <XAxis dataKey="month" tickLine={false} axisLine={false}
                      tick={{ fill: '#8b8b8b', fontSize: 11 }} />
                    <YAxis tickLine={false} axisLine={false}
                      tick={{ fill: '#8b8b8b', fontSize: 11 }} width={55} />
                    <Tooltip formatter={(v) => fmtDh(v as number)} />
                    <Bar dataKey="expected" fill="#f2d7c7" radius={[6,6,0,0]} name="Prévu" maxBarSize={32}/>
                    <Bar dataKey="paid"     fill="#ff6b2b" radius={[6,6,0,0]} name="Réglé" maxBarSize={32}/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {installments.length > 0 && (
              <>
                {/* Legend */}
                <div className="pay-legend pay-legend--row">
                  <div className="pay-legend-item">
                    <span className="pay-legend-dot" style={{ background: '#ff6b2b' }} />
                    <span>Payé</span>
                  </div>
                  <div className="pay-legend-item">
                    <span className="pay-legend-dot" style={{ background: '#e2ddd9' }} />
                    <span>À venir</span>
                  </div>
                </div>

                {/* Timeline — horizontal scroll container with proper overflow */}
                <div className="pay-timeline-wrap">
                  <div className="pay-timeline">
                    {/* Progress line */}
                    <div className="pay-timeline-track" aria-hidden="true">
                      <div className="pay-timeline-fill"
                        style={{
                          width: `${Math.round(
                            (installments.filter(i => i.state === 'paid').length /
                            installments.length) * 100
                          )}%`
                        }}
                      />
                    </div>

                    {installments.map((step, idx) => (
                      <div key={idx} className={`pay-step pay-step--${step.state}`}>
                        <p className="pay-step-month">{step.month}</p>
                        <div className="pay-step-dot">
                          {step.state === 'current' && (
                            <span className="pay-step-pulse" />
                          )}
                        </div>
                        <div className="pay-step-card">
                          <p className="pay-step-amount">{step.amount}</p>
                          <p className="pay-step-state">
                            {step.state === 'paid'     && 'Réglé'}
                            {step.state === 'current'  && 'En cours'}
                            {step.state === 'upcoming' && 'Programmé'}
                            {step.state === 'final'    && 'Final'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </section>
        )}

        <footer className="pay-footer">
          Toutes les opérations financières sont protégées et archivées dans votre espace étudiant.
        </footer>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@600;700&family=Manrope:wght@400;500;600;700;800&display=swap');

        /* ── Reset scroll containment ── */
        .pay-root {
          display: flex; flex-direction: column; gap: 20px;
          font-family: 'Manrope', sans-serif; color: #18181b;
          /* KEY FIX: contain width, never let children overflow */
          width: 100%; min-width: 0; overflow-x: hidden;
          box-sizing: border-box;
        }
        .pay-root *, .pay-root *::before, .pay-root *::after { box-sizing: border-box; }

        /* ── Shared panel base ── */
        .pay-hero, .pay-panel, .pay-balance-card, .pay-progress-card,
        .pay-help-card, .pay-stat-card {
          background: #fff;
          border: 1px solid rgba(15,23,42,0.07);
          box-shadow: 0 2px 12px rgba(15,23,42,0.04);
          border-radius: 20px;
          padding: 24px;
          min-width: 0; /* prevent flex/grid blowout */
        }

        /* ── Utilities ── */
        .pay-flex-between { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; flex-wrap: wrap; }
        .pay-mb    { margin-bottom: 16px; }
        .pay-mb-sm { margin-bottom: 6px; }
        .pay-eyebrow {
          margin: 0 0 6px; font-size: .72rem; font-weight: 800;
          letter-spacing: .13em; text-transform: uppercase; color: #ff6b2b;
        }
        .pay-muted { margin: 0; color: #7a7a7a; font-size: .84rem; line-height: 1.6; }
        .pay-empty {
          padding: 32px; text-align: center; color: #aaa;
          font-size: .85rem; border: 1.5px dashed #e5e5e5;
          border-radius: 14px; margin-top: 12px;
        }

        /* ── Hero ── */
        .pay-hero {
          position: relative; overflow: hidden;
          display: flex; justify-content: space-between; gap: 20px; flex-wrap: wrap;
          background: radial-gradient(circle at top right, rgba(255,154,86,.16), transparent 28%),
                      linear-gradient(180deg,#fffaf6 0%,#fff 100%);
        }
        .pay-hero::before {
          content: ''; position: absolute; inset: 0 auto auto 0;
          width: 100%; height: 4px;
          background: linear-gradient(90deg,#ff6b2b,#ff9a56,#ffbf7a);
        }
        .pay-hero-copy { max-width: 680px; position: relative; z-index: 1; }
        .pay-hero-title {
          margin: 0; font-family: 'EB Garamond', serif;
          font-size: clamp(1.8rem, 3vw, 2.8rem); line-height: 1.1;
          letter-spacing: -.03em; color: #151515;
        }
        .pay-hero-title span { color: #ff6b2b; }
        .pay-hero-text { margin: 12px 0 0; font-size: .92rem; line-height: 1.7; color: #666; }
        .pay-hero-side { display: flex; flex-direction: column; gap: 10px; position: relative; z-index: 1; }

        .pay-chip {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 10px 14px; border-radius: 999px;
          background: rgba(255,255,255,.84);
          border: 1px solid rgba(255,107,43,.12);
          color: #6b4b3e; font-size: .8rem; font-weight: 700;
          white-space: nowrap;
        }
        .pay-chip--soft { border-radius: 14px; color: #757575; font-weight: 600; border-color: rgba(15,23,42,.08); }
        .pay-chip-dot {
          width: 10px; height: 10px; border-radius: 50%;
          background: #10b981; box-shadow: 0 0 0 5px rgba(16,185,129,.14);
          flex-shrink: 0;
        }

        /* ── Grids ── */
        .pay-top-grid   { display: grid; gap: 16px; grid-template-columns: 1.8fr 1fr; }
        .pay-stats-grid { display: grid; gap: 14px; grid-template-columns: repeat(3,1fr); }
        .pay-content-grid { display: grid; gap: 16px; grid-template-columns: 1.55fr 1fr; align-items: start; }

        /* ── Balance ── */
        .pay-balance-card {
          background: radial-gradient(circle at bottom right, rgba(255,107,43,.10), transparent 30%), #fff;
          position: relative; overflow: hidden;
        }
        .pay-balance-value {
          margin: 6px 0 0; font-family: 'EB Garamond', serif;
          font-size: clamp(2rem,4vw,3.2rem); color: #ff6b2b; line-height: 1;
        }
        .pay-balance-text { margin: 16px 0 0; font-size: .86rem; line-height: 1.6; color: #7a7a7a; }
        .pay-balance-actions { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 20px; }

        .pay-btn {
          border: none; border-radius: 12px; padding: 11px 18px;
          font-family: 'Manrope', sans-serif; font-size: .86rem; font-weight: 800; cursor: pointer;
          transition: all .15s;
        }
        .pay-btn--primary {
          background: linear-gradient(135deg,#ff7a35,#ff5b14); color: #fff;
          box-shadow: 0 8px 20px rgba(255,107,43,.22);
        }
        .pay-btn--primary:hover { transform: translateY(-1px); box-shadow: 0 12px 28px rgba(255,107,43,.30); }
        .pay-btn--secondary {
          background: #fff7f1; color: #8f4c2d;
          border: 1px solid rgba(255,107,43,.18);
        }
        .pay-btn--secondary:hover { background: #ffefe6; }

        /* ── Progress ── */
        .pay-progress-value { margin: 6px 0 0; font-size: 1.35rem; font-weight: 800; line-height: 1; }
        .pay-progress-track {
          width: 100%; height: 10px; border-radius: 999px;
          background: #f0ece8; overflow: hidden; margin: 16px 0 12px;
        }
        .pay-progress-fill {
          height: 100%; border-radius: inherit;
          background: linear-gradient(90deg,#ff9a56,#ff6b2b);
          transition: width .6s ease;
        }

        /* ── Stat cards ── */
        .pay-stat-card { display: flex; align-items: flex-start; gap: 14px; }
        .pay-stat-icon { width: 44px; height: 44px; border-radius: 13px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .pay-stat-body { min-width: 0; }
        .pay-stat-value { margin: 4px 0 2px; font-size: 1.45rem; font-weight: 800; line-height: 1; }

        /* ── Badges ── */
        .pay-badge {
          display: inline-flex; align-items: center; border-radius: 999px;
          padding: 5px 10px; font-size: .66rem; font-weight: 800;
          letter-spacing: .07em; text-transform: uppercase; white-space: nowrap;
        }
        .pay-badge--highlight { background: rgba(255,107,43,.10); color: #ff6b2b; }
        .pay-badge--success   { background: rgba(16,185,129,.12); color: #0f9d70; }
        .pay-badge--pending   { background: rgba(120,113,108,.12); color: #6b6762; }

        /* ── Panel ── */
        .pay-panel-title { margin: 0; font-size: .96rem; font-weight: 800; color: #18181b; }
        .pay-side-stack  { display: flex; flex-direction: column; gap: 16px; min-width: 0; }

        /* ── Table — desktop only ── */
        .pay-table-wrap {
          overflow-x: auto; margin-top: 16px;
          border-radius: 14px; border: 1px solid rgba(15,23,42,.06);
          /* ensure it never pushes parent wider */
          max-width: 100%;
        }
        .pay-table {
          width: 100%; border-collapse: collapse; background: #fff;
          /* table must stay within its scroll wrapper */
          min-width: 520px;
        }
        .pay-table thead tr { background: #faf7f4; }
        .pay-table th, .pay-table td {
          padding: 14px 16px; text-align: left;
          border-bottom: 1px solid rgba(15,23,42,.05); font-size: .84rem;
        }
        .pay-table th { color: #8b8b8b; font-size: .68rem; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }
        .pay-table tbody tr:hover { background: #fffaf6; }
        .pay-method { display: inline-flex; align-items: center; gap: 9px; }
        .pay-method-icon, .pay-doc-icon, .pay-help-icon {
          width: 38px; height: 38px; border-radius: 11px;
          background: #faf7f4; color: #ff6b2b;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .pay-amount { font-weight: 800; color: #161616; }
        .pay-icon-btn {
          width: 36px; height: 36px; border: 1px solid rgba(255,107,43,.14);
          border-radius: 10px; background: #fff7f1; color: #ff6b2b;
          display: inline-flex; align-items: center; justify-content: center; cursor: pointer;
          transition: background .15s;
        }
        .pay-icon-btn:hover:not(:disabled) { background: #ffece0; }
        .pay-icon-btn:disabled { opacity: .4; cursor: not-allowed; }

        /* ── Mobile payment list (hidden on desktop) ── */
        .pay-mobile-list { display: none; flex-direction: column; gap: 10px; margin-top: 14px; }
        .pay-mobile-row {
          display: flex; align-items: center; justify-content: space-between; gap: 12px;
          padding: 14px; border-radius: 14px;
          border: 1px solid rgba(15,23,42,.06); background: #fafaf9;
        }
        .pay-mobile-left  { display: flex; align-items: center; gap: 12px; }
        .pay-mobile-right { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
        .pay-mobile-method { margin: 0; font-size: .84rem; font-weight: 700; color: #18181b; }

        /* ── Donut chart ── */
        .pay-chart-donut {
          position: relative; width: 100%; height: 220px; margin-top: 14px;
        }
        .pay-chart-center {
          position: absolute; inset: 0; display: flex; flex-direction: column;
          align-items: center; justify-content: center; pointer-events: none;
        }
        .pay-chart-center strong { font-size: 1.9rem; line-height: 1; color: #18181b; }
        .pay-chart-center span {
          margin-top: 4px; font-size: .72rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: .1em; color: #8b8b8b;
        }

        /* ── Legend ── */
        .pay-legend { display: flex; flex-direction: column; gap: 9px; margin-top: 10px; }
        .pay-legend--row { flex-direction: row; gap: 18px; margin-top: 14px; flex-wrap: wrap; }
        .pay-legend-item {
          display: grid; grid-template-columns: auto 1fr auto;
          align-items: center; gap: 9px; font-size: .82rem; color: #666;
        }
        .pay-legend--row .pay-legend-item { display: flex; align-items: center; gap: 7px; }
        .pay-legend-dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
        .pay-legend-item strong { color: #18181b; font-size: .8rem; }

        /* ── Invoices ── */
        .pay-doc-list { display: flex; flex-direction: column; gap: 10px; margin-top: 14px; }
        .pay-doc-card {
          display: flex; align-items: center; gap: 12px; padding: 13px;
          border-radius: 14px; background: #fafafa;
          border: 1px solid rgba(15,23,42,.06);
          transition: border-color .15s;
        }
        .pay-doc-card:hover { border-color: rgba(255,107,43,.3); }
        .pay-doc-copy { flex: 1; min-width: 0; }
        .pay-doc-title { margin: 0 0 2px; font-size: .88rem; font-weight: 700; color: #18181b; }

        /* ── Help card ── */
        .pay-help-card { display: grid; grid-template-columns: auto 1fr; gap: 14px; align-items: start; }
        .pay-text-link {
          grid-column: 1 / -1; color: #ff6b2b; font-weight: 800; font-size: .82rem;
          text-decoration: none; cursor: pointer; transition: color .15s;
        }
        .pay-text-link:hover { color: #e25817; }

        /* ── Bar chart ── */
        .pay-chart-block {
          width: 100%; height: 260px; margin-top: 18px; padding: 8px 4px 0;
          border-radius: 16px;
          background: linear-gradient(180deg,#fffaf6 0%,#fff 100%);
          border: 1px solid rgba(15,23,42,.05);
        }

        /* ── Timeline — KEY FIX for horizontal scroll ── */
        .pay-timeline-wrap {
          width: 100%;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          padding-bottom: 8px;     /* room for scrollbar */
          margin-top: 20px;
          /* scrollbar styling */
          scrollbar-width: thin;
          scrollbar-color: rgba(255,107,43,.3) transparent;
        }
        .pay-timeline-wrap::-webkit-scrollbar { height: 4px; }
        .pay-timeline-wrap::-webkit-scrollbar-thumb { background: rgba(255,107,43,.3); border-radius: 99px; }

        .pay-timeline {
          position: relative;
          display: flex;           /* flex instead of grid — no blowout */
          gap: 0;
          min-width: max-content;  /* expand to content, scrolls inside wrapper */
          padding: 0 4px 4px;
        }

        /* Shared track line behind all steps */
        .pay-timeline-track {
          position: absolute; top: 33px; left: 0; right: 0; height: 4px;
          background: #e2ddd9; border-radius: 999px; overflow: hidden;
        }
        .pay-timeline-fill {
          height: 100%; background: #ff6b2b; border-radius: inherit; transition: width .5s ease;
        }

        .pay-step {
          position: relative; z-index: 1;
          display: flex; flex-direction: column; align-items: center;
          min-width: 130px; padding: 0 12px;
        }
        .pay-step-month {
          margin: 0 0 10px; font-size: .68rem; font-weight: 800;
          letter-spacing: .12em; text-transform: uppercase; color: #9b9b9b;
          text-align: center;
        }
        .pay-step-dot {
          width: 20px; height: 20px; border-radius: 50%; margin-bottom: 12px;
          background: #dbd6d1; border: 4px solid #fff;
          box-shadow: 0 2px 6px rgba(15,23,42,.12);
          position: relative; display: flex; align-items: center; justify-content: center;
        }
        .pay-step-pulse {
          width: 8px; height: 8px; border-radius: 50%;
          background: #fff;
          animation: step-pulse 1.6s ease-in-out infinite;
        }
        @keyframes step-pulse {
          0%,100% { transform: scale(1); opacity: 1; }
          50%      { transform: scale(1.5); opacity: .5; }
        }
        .pay-step-card {
          padding: 12px 14px; border-radius: 14px; width: 100%;
          background: #fbfbfb; border: 1px solid rgba(15,23,42,.06);
          text-align: center;
        }
        .pay-step-amount {
          margin: 0; font-size: .9rem; font-weight: 800; color: #18181b;
        }
        .pay-step-state {
          margin: 3px 0 0; font-size: .64rem; font-weight: 800;
          letter-spacing: .08em; text-transform: uppercase; color: #9c9c9c;
        }

        /* Step state variants */
        .pay-step--paid .pay-step-dot { background: #ff6b2b; }
        .pay-step--paid .pay-step-state { color: #10b981; }
        .pay-step--current .pay-step-dot { background: #ff6b2b; width: 24px; height: 24px; }
        .pay-step--current .pay-step-month,
        .pay-step--current .pay-step-amount,
        .pay-step--current .pay-step-state { color: #ff6b2b; }
        .pay-step--current .pay-step-card { background: #fff7f1; border-color: rgba(255,107,43,.2); }
        .pay-step--final .pay-step-state { color: #a16207; }

        /* ── Footer ── */
        .pay-footer { text-align: center; color: #8a8a8a; font-size: .78rem; padding: 4px 0 10px; }

        /* ══════════════════════════════════════
           RESPONSIVE BREAKPOINTS
        ══════════════════════════════════════ */

        /* Tablet landscape → 2 cols shrink */
        @media (max-width: 1100px) {
          .pay-top-grid     { grid-template-columns: 1fr; }
          .pay-content-grid { grid-template-columns: 1fr; }
          .pay-stats-grid   { grid-template-columns: repeat(2,1fr); }
        }

        /* Tablet portrait */
        @media (max-width: 800px) {
          .pay-stats-grid { grid-template-columns: 1fr 1fr; }
          /* Switch table → mobile cards */
          .pay-table-wrap  { display: none; }
          .pay-mobile-list { display: flex; }
        }

        /* Mobile */
        @media (max-width: 600px) {
          .pay-hero, .pay-panel, .pay-balance-card, .pay-progress-card,
          .pay-help-card, .pay-stat-card { padding: 18px; border-radius: 16px; }
          .pay-stats-grid { grid-template-columns: 1fr; }
          .pay-hero-title { font-size: 1.8rem; }
          .pay-balance-actions { flex-direction: column; }
          .pay-btn { width: 100%; text-align: center; }
          .pay-help-card { grid-template-columns: 1fr; }
          .pay-hero-side { width: 100%; }
          .pay-chip { width: 100%; }
        }
      `}</style>
    </AuthenticatedLayout>
  );
}