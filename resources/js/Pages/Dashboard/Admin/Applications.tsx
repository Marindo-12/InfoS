import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';

/* ═══════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════ */

type ApplicationRow = {
  id: number;
  reference: string;
  student: string;
  email: string;
  phone?: string;
  course: string;
  category: string;
  amount: string;
  paymentMethod: 'online' | 'onsite';
  paymentStatus: 'paid' | 'pending';
  preferredPaymentDate?: string;
  certificateReference?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
};

type PageProps = {
  auth: { user: { id: number; name: string; email: string } };
  applications: ApplicationRow[];
  stats: { pending: number; approved: number; onlinePaid: number; onsitePending: number };
  flash?: { success?: string; warning?: string };
};

/* ═══════════════════════════════════════════════════
   ICONS
═══════════════════════════════════════════════════ */

const Ic = {
  search:  () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  filter:  () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  check:   () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7"/></svg>,
  mail:    () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/></svg>,
  phone:   () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.6 19a19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 3.12 4.18 2 2 0 0 1 5.09 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L9.91 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  card:    () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>,
  store:   () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>,
  cert:    () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>,
  send:    () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  close:   () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  pending: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  ok:      () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="m9 12 2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/></svg>,
  online:  () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>,
  cash:    () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/></svg>,
};

/* ═══════════════════════════════════════════════════
   BADGE
═══════════════════════════════════════════════════ */

type Tone = 'green' | 'amber' | 'slate' | 'red' | 'blue';

const TONE: Record<Tone, { bg: string; text: string }> = {
  green: { bg: 'rgba(16,185,129,.12)',  text: '#047857' },
  amber: { bg: 'rgba(245,158,11,.14)',  text: '#b45309' },
  slate: { bg: 'rgba(100,116,139,.12)', text: '#475569' },
  red:   { bg: 'rgba(239,68,68,.12)',   text: '#dc2626' },
  blue:  { bg: 'rgba(59,130,246,.12)',  text: '#2563eb' },
};

function Badge({ label, tone }: { label: string; tone: Tone }) {
  const { bg, text } = TONE[tone];
  return (
    <span className="app-badge" style={{ background: bg, color: text }}>
      {label}
    </span>
  );
}

/* ═══════════════════════════════════════════════════
   STAT CARD
═══════════════════════════════════════════════════ */

function StatCard({ value, label, icon, color }: {
  value: number; label: string; icon: React.ReactNode; color: string;
}) {
  return (
    <div className="app-stat">
      <div className="app-stat-icon" style={{ background: `${color}14`, color }}>
        {icon}
      </div>
      <div>
        <p className="app-stat-val">{value}</p>
        <p className="app-stat-lbl">{label}</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   INITIALS AVATAR
═══════════════════════════════════════════════════ */

const AVATAR_COLORS = [
  '#c2652a','#2563eb','#059669','#7c3aed','#db2777','#0891b2',
];

function Avatar({ name }: { name: string }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const color = AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
  return (
    <div className="app-avatar" style={{ background: `${color}18`, color, borderColor: `${color}30` }}>
      {initials}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════ */

export default function Applications() {
  const { applications, stats, flash } = usePage<PageProps>().props;

  /* ── Filters state ── */
  const [search,         setSearch]         = useState('');
  const [filterStatus,   setFilterStatus]   = useState<string>('all');
  const [filterPayment,  setFilterPayment]  = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  /* ── Unique categories for filter dropdown ── */
  const categories = useMemo(() => {
    const s = new Set(applications.map(a => a.category));
    return Array.from(s).sort();
  }, [applications]);

  /* ── Filtered list ── */
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return applications.filter(a => {
      if (q && ![a.student, a.email, a.reference, a.course, a.phone ?? '']
        .some(f => f.toLowerCase().includes(q))) return false;
      if (filterStatus !== 'all' && a.status !== filterStatus) return false;
      if (filterPayment !== 'all' && a.paymentMethod !== filterPayment) return false;
      if (filterCategory !== 'all' && a.category !== filterCategory) return false;
      return true;
    });
  }, [applications, search, filterStatus, filterPayment, filterCategory]);

  const hasFilter = search || filterStatus !== 'all' || filterPayment !== 'all' || filterCategory !== 'all';
  const resetFilters = () => { setSearch(''); setFilterStatus('all'); setFilterPayment('all'); setFilterCategory('all'); };

  /* ── Actions ── */
  const approve = (a: ApplicationRow) =>
    router.post(route('admin.applications.approve', a.id), {}, { preserveScroll: true });

  const resendAccess = (a: ApplicationRow) =>
    router.post(route('admin.applications.resend-access', a.id), {}, { preserveScroll: true });

  /* ─────────────────────── RENDER ─────────────────────── */
  return (
    <AdminLayout header={<span style={{ fontWeight: 700 }}>Demandes d'inscription</span>}>
      <Head title="Demandes d'inscription" />

      <div className="app-root">

        {/* ── Page header ── */}
        <header className="app-header">
          <div className="app-header-text">
            <p className="app-kicker">Administration</p>
            <h1 className="app-title">Demandes d'inscription</h1>
            <p className="app-subtitle">
              Les formulaires envoyés depuis le site public arrivent ici avec le paiement, le certificat
              et la date de passage au centre. Validez les dossiers pour donner accès à l'espace étudiant.
            </p>
          </div>

          {/* Stat cards */}
          <div className="app-stats">
            <StatCard value={stats.pending}      label="En attente"            icon={<Ic.pending />} color="#f59e0b" />
            <StatCard value={stats.approved}     label="Validées"              icon={<Ic.ok />}      color="#10b981" />
            <StatCard value={stats.onlinePaid}   label="Payées en ligne"       icon={<Ic.online />}  color="#2563eb" />
            <StatCard value={stats.onsitePending}label="Présentiel à encaisser"icon={<Ic.cash />}    color="#c2652a" />
          </div>
        </header>

        {/* Flash */}
        {flash?.success && (
          <div className="app-flash app-flash--success">
            <Ic.check /> {flash.success}
          </div>
        )}
        {flash?.warning && (
          <div className="app-flash app-flash--warning">
            <Ic.close /> {flash.warning}
          </div>
        )}

        {/* ── Table panel ── */}
        <section className="app-panel">

          {/* Panel header */}
          <div className="app-panel-head">
            <div>
              <h2 className="app-panel-title">Liste des dossiers</h2>
              <p className="app-panel-sub">
                {filtered.length} dossier{filtered.length > 1 ? 's' : ''} affiché{filtered.length > 1 ? 's' : ''}
                {hasFilter && ` · ${applications.length} au total`}
              </p>
            </div>
          </div>

          {/* ── Search + Filters ── */}
          <div className="app-toolbar">
            {/* Search */}
            <div className="app-search-wrap">
              <span className="app-search-icon"><Ic.search /></span>
              <input
                type="text"
                className="app-search"
                placeholder="Rechercher : nom, email, référence, formation..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button className="app-search-clear" onClick={() => setSearch('')} aria-label="Effacer">
                  <Ic.close />
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="app-filters">
              <div className="app-filter-group">
                <span className="app-filter-icon"><Ic.filter /></span>

                <select className="app-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                  <option value="all">Tous statuts</option>
                  <option value="pending">En attente</option>
                  <option value="approved">Validées</option>
                  <option value="rejected">Rejetées</option>
                </select>

                <select className="app-select" value={filterPayment} onChange={e => setFilterPayment(e.target.value)}>
                  <option value="all">Tout paiement</option>
                  <option value="online">En ligne</option>
                  <option value="onsite">Présentiel</option>
                </select>

                <select className="app-select" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                  <option value="all">Toutes formations</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {hasFilter && (
                <button className="app-reset-btn" onClick={resetFilters}>
                  <Ic.close /> Réinitialiser
                </button>
              )}
            </div>
          </div>

          {/* ── Table ── */}
          <div className="app-table-wrap">
            {filtered.length === 0 ? (
              <div className="app-empty">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity=".2">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <p>Aucun dossier ne correspond à vos filtres.</p>
                <button className="app-reset-btn" onClick={resetFilters}>Voir tous les dossiers</button>
              </div>
            ) : (
              <table className="app-table">
                <thead>
                  <tr>
                    <th>Candidat</th>
                    <th>Formation</th>
                    <th>Paiement</th>
                    <th>Certificat</th>
                    <th>Statut</th>
                    <th>Date</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((a) => {
                    const isApproved = a.status === 'approved';
                    const isRejected = a.status === 'rejected';
                    return (
                      <tr key={a.reference} className={isApproved ? 'app-row--approved' : ''}>

                        {/* Candidat */}
                        <td data-label="Candidat">
                          <div className="app-candidate">
                            <Avatar name={a.student} />
                            <div className="app-candidate-info">
                              <p className="app-candidate-name">{a.student}</p>
                              <span className="app-meta">
                                <Ic.mail /> {a.email}
                              </span>
                              {a.phone && (
                                <span className="app-meta">
                                  <Ic.phone /> {a.phone}
                                </span>
                              )}
                              <code className="app-ref">{a.reference}</code>
                            </div>
                          </div>
                        </td>

                        {/* Formation */}
                        <td data-label="Formation">
                          <p className="app-strong">{a.course}</p>
                          <span className="app-meta">{a.category}</span>
                          <p className="app-amount">{a.amount}</p>
                        </td>

                        {/* Paiement */}
                        <td data-label="Paiement">
                          <div className="app-payment-cell">
                            {a.paymentMethod === 'online' ? (
                              <>
                                <Badge label="En ligne" tone="blue" />
                                <span className="app-meta">
                                  <Ic.card />
                                  {a.paymentStatus === 'paid'
                                    ? <span style={{ color: '#047857', fontWeight: 700 }}>Réglé ✓</span>
                                    : <span style={{ color: '#b45309' }}>En attente</span>
                                  }
                                </span>
                              </>
                            ) : (
                              <>
                                <Badge label="Présentiel" tone="amber" />
                                <span className="app-meta">
                                  <Ic.store />
                                  {a.preferredPaymentDate
                                    ? `Rdv : ${a.preferredPaymentDate}`
                                    : 'Date non précisée'}
                                </span>
                              </>
                            )}
                          </div>
                        </td>

                        {/* Certificat */}
                        <td data-label="Certificat">
                          {a.certificateReference ? (
                            <div className="app-cert">
                              <Ic.cert />
                              <code>{a.certificateReference}</code>
                            </div>
                          ) : (
                            <span className="app-meta" style={{ fontStyle: 'italic' }}>—</span>
                          )}
                        </td>

                        {/* Statut */}
                        <td data-label="Statut">
                          {isApproved
                            ? <Badge label="Validée" tone="green" />
                            : isRejected
                            ? <Badge label="Rejetée" tone="red" />
                            : <Badge label="En attente" tone="slate" />
                          }
                        </td>

                        {/* Date */}
                        <td data-label="Date">
                          <span className="app-date">{a.createdAt}</span>
                        </td>

                        {/* Action */}
                        <td data-label="Action" style={{ textAlign: 'right' }}>
                          <button
                            className={`app-action-btn ${isApproved ? 'app-action-btn--ghost' : ''}`}
                            onClick={() => isApproved ? resendAccess(a) : approve(a)}
                            disabled={isRejected}
                          >
                            {isApproved ? (
                              <><Ic.send /> Renvoyer l'accès</>
                            ) : (
                              <><Ic.check /> Donner l'accès</>
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Footer count */}
          {filtered.length > 0 && (
            <div className="app-table-footer">
              {filtered.length} résultat{filtered.length > 1 ? 's' : ''}
              {hasFilter && ` sur ${applications.length} dossiers`}
            </div>
          )}
        </section>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@600;700&family=Manrope:wght@400;500;600;700;800&display=swap');

        /* ── Root ── */
        .app-root {
          padding: 28px; font-family: 'Manrope', sans-serif; color: #18181b;
          display: flex; flex-direction: column; gap: 18px;
          width: 100%; max-width: 100%; min-width: 0; overflow-x: hidden;
        }
        .app-root *, .app-root *::before, .app-root *::after { box-sizing: border-box; }

        /* ── Header ── */
        .app-header {
          background: #fff; border-radius: 18px;
          border: 1px solid rgba(0,0,0,0.07);
          box-shadow: 0 2px 10px rgba(0,0,0,0.04);
          padding: 28px 32px;
          display: flex; gap: 28px; flex-wrap: wrap; align-items: flex-start;
          position: relative; overflow: hidden;
        }
        .app-header::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, #c2652a, #e8915a, #f5b89a);
        }
        .app-header-text { flex: 1; min-width: 0; }
        .app-kicker {
          font-size: .68rem; font-weight: 800; letter-spacing: .14em;
          text-transform: uppercase; color: #c2652a; margin: 0 0 5px;
        }
        .app-title {
          font-family: 'EB Garamond', serif;
          font-size: 2.2rem; font-weight: 700; color: #111; margin: 0 0 8px;
          letter-spacing: -.01em;
        }
        .app-subtitle { margin: 0; font-size: .84rem; color: #7a7a7a; line-height: 1.65; max-width: 580px; }

        /* Stats row */
        .app-stats {
          display: grid; grid-template-columns: repeat(4,1fr); gap: 12px;
          width: 100%;
        }
        @media (max-width: 900px)  { .app-stats { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 500px)  { .app-stats { grid-template-columns: 1fr; } }

        .app-stat {
          display: flex; align-items: center; gap: 12px;
          padding: 14px 16px; border-radius: 12px;
          background: #fafaf9; border: 1px solid rgba(0,0,0,0.06);
        }
        .app-stat-icon {
          width: 40px; height: 40px; border-radius: 10px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
        }
        .app-stat-val {
          margin: 0 0 1px; font-family: 'EB Garamond', serif;
          font-size: 1.6rem; font-weight: 700; color: #111; line-height: 1;
        }
        .app-stat-lbl { margin: 0; font-size: .7rem; font-weight: 700; color: #9ca3af; }

        /* ── Flash ── */
        .app-flash {
          display: flex; align-items: center; gap: 8px;
          padding: 12px 16px; border-radius: 12px;
          font-size: .86rem; font-weight: 700; border: 1px solid;
        }
        .app-flash--success { background: #f0fdf4; color: #047857; border-color: #bbf7d0; }
        .app-flash--warning { background: #fffbeb; color: #92400e; border-color: #fde68a; }

        /* ── Panel ── */
        .app-panel {
          background: #fff; border-radius: 18px;
          border: 1px solid rgba(0,0,0,0.07);
          box-shadow: 0 2px 10px rgba(0,0,0,0.04);
          overflow: hidden; max-width: 100%; min-width: 0;
        }
        .app-panel-head {
          display: flex; align-items: flex-start; justify-content: space-between;
          gap: 14px; flex-wrap: wrap; padding: 22px 24px 16px;
          border-bottom: 1px solid rgba(0,0,0,0.06);
        }
        .app-panel-title {
          font-family: 'EB Garamond', serif;
          font-size: 1.4rem; font-weight: 700; margin: 0 0 2px;
        }
        .app-panel-sub { margin: 0; font-size: .78rem; color: #9ca3af; font-weight: 600; }

        /* ── Toolbar ── */
        .app-toolbar {
          display: flex; flex-direction: column; gap: 10px;
          padding: 14px 24px; border-bottom: 1px solid rgba(0,0,0,0.06);
          background: #fafaf9;
        }

        /* Search */
        .app-search-wrap {
          position: relative; display: flex; align-items: center;
        }
        .app-search-icon {
          position: absolute; left: 12px; color: #aaa;
          display: flex; align-items: center; pointer-events: none;
        }
        .app-search {
          width: 100%; padding: 10px 36px 10px 36px;
          border: 1.5px solid #e5e5e5; border-radius: 10px;
          background: #fff; font-family: 'Manrope',sans-serif;
          font-size: .86rem; color: #111; outline: none;
          transition: border-color .15s, box-shadow .15s;
        }
        .app-search:focus { border-color: #c2652a; box-shadow: 0 0 0 3px rgba(194,101,42,.10); }
        .app-search-clear {
          position: absolute; right: 10px; color: #bbb; background: none; border: none;
          cursor: pointer; display: flex; align-items: center; padding: 4px;
          border-radius: 6px; transition: color .15s;
        }
        .app-search-clear:hover { color: #555; }

        /* Filters row */
        .app-filters { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .app-filter-group { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; flex: 1; }
        .app-filter-icon { color: #aaa; display: flex; align-items: center; flex-shrink: 0; }
        .app-select {
          border: 1.5px solid #e5e5e5; border-radius: 9px;
          background: #fff; padding: 7px 10px;
          font-family: 'Manrope',sans-serif; font-size: .8rem; color: #333;
          outline: none; cursor: pointer; transition: border-color .15s;
        }
        .app-select:focus { border-color: #c2652a; }

        .app-reset-btn {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 7px 12px; border-radius: 9px; border: 1.5px solid #e5e5e5;
          background: #fff; color: #666;
          font-family: 'Manrope',sans-serif; font-size: .78rem; font-weight: 700;
          cursor: pointer; transition: all .15s; white-space: nowrap;
        }
        .app-reset-btn:hover { border-color: #c2652a; color: #c2652a; }

        /* ── Table ── */
        .app-table-wrap { overflow-x: auto; min-width: 0; max-width: 100%; }
        .app-table {
          width: 100%; min-width: 900px; border-collapse: collapse;
        }
        .app-table thead tr { background: #faf8f5; }
        .app-table th {
          padding: 11px 16px; text-align: left;
          font-size: .63rem; font-weight: 800; text-transform: uppercase;
          letter-spacing: .1em; color: #9ca3af;
          border-bottom: 1px solid rgba(0,0,0,0.06);
        }
        .app-table td {
          padding: 14px 16px; vertical-align: top;
          border-bottom: 1px solid rgba(0,0,0,0.05);
          font-size: .84rem;
        }
        .app-table tbody tr:hover { background: #fdfcfa; }
        .app-table tbody tr:last-child td { border-bottom: none; }
        .app-row--approved { background: #fafffe; }

        /* ── Candidate cell ── */
        .app-candidate { display: flex; align-items: flex-start; gap: 10px; }
        .app-avatar {
          width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
          border: 1.5px solid; display: flex; align-items: center; justify-content: center;
          font-size: .68rem; font-weight: 800; letter-spacing: .04em;
        }
        .app-candidate-info { display: flex; flex-direction: column; gap: 2px; }
        .app-candidate-name { margin: 0; font-size: .86rem; font-weight: 800; color: #111; }
        .app-meta {
          display: flex; align-items: center; gap: 4px;
          font-size: .72rem; color: #9ca3af; font-weight: 500;
        }
        .app-ref {
          font-family: monospace; font-size: .66rem;
          color: #bbb; background: #f5f5f5; border-radius: 4px;
          padding: 1px 5px; margin-top: 2px; display: inline-block;
        }

        /* ── Other cells ── */
        .app-strong { margin: 0 0 2px; font-weight: 800; color: #111; font-size: .84rem; }
        .app-amount { margin: 4px 0 0; font-size: .84rem; font-weight: 800; color: #c2652a; }

        .app-payment-cell { display: flex; flex-direction: column; gap: 5px; }

        .app-cert {
          display: flex; align-items: center; gap: 5px;
          font-size: .72rem; color: #6b5f55;
        }
        .app-cert code { font-size: .7rem; color: #555; }

        .app-date { font-size: .76rem; color: #9ca3af; font-weight: 500; white-space: nowrap; }

        .app-badge {
          display: inline-flex; align-items: center; width: fit-content;
          border-radius: 99px; padding: 3px 9px;
          font-size: .63rem; font-weight: 900;
          text-transform: uppercase; letter-spacing: .06em; white-space: nowrap;
        }

        /* ── Action button ── */
        .app-action-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 13px; border-radius: 9px; border: none;
          background: #c2652a; color: #fff;
          font-family: 'Manrope',sans-serif; font-size: .78rem; font-weight: 800;
          cursor: pointer; white-space: nowrap;
          transition: opacity .15s, transform .1s, box-shadow .15s;
          box-shadow: 0 2px 8px rgba(194,101,42,.25);
        }
        .app-action-btn:hover:not(:disabled) {
          opacity: .9; transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(194,101,42,.35);
        }
        .app-action-btn:disabled { opacity: .35; cursor: not-allowed; box-shadow: none; }
        .app-action-btn--ghost {
          background: rgba(194,101,42,.08); color: #c2652a;
          border: 1.5px solid rgba(194,101,42,.2); box-shadow: none;
        }
        .app-action-btn--ghost:hover:not(:disabled) {
          background: rgba(194,101,42,.14); box-shadow: none;
        }

        /* ── Empty state ── */
        .app-empty {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 12px; padding: 60px 24px; text-align: center; color: #9ca3af;
        }
        .app-empty p { margin: 0; font-size: .86rem; font-weight: 600; }

        /* ── Table footer ── */
        .app-table-footer {
          padding: 12px 24px;
          font-size: .75rem; color: #9ca3af; font-weight: 600;
          border-top: 1px solid rgba(0,0,0,0.05);
          text-align: right; background: #fafaf9;
        }

        /* ── Responsive ── */
        @media (max-width: 1100px) {
          .app-header { flex-direction: column; }
        }
        @media (max-width: 640px) {
          .app-root { padding: 16px; }
          .app-header { padding: 20px; }
          .app-panel-head, .app-toolbar { padding-left: 16px; padding-right: 16px; }
          .app-filter-group { flex-direction: column; align-items: flex-start; width: 100%; }
          .app-select { width: 100%; }
          .app-table-wrap { overflow-x: visible; padding: 0 12px 12px; }
          .app-table { min-width: 0; border-collapse: separate; border-spacing: 0 12px; }
          .app-table thead { display: none; }
          .app-table, .app-table tbody, .app-table tr, .app-table td { display: block; width: 100%; }
          .app-table tbody tr {
            border: 1px solid rgba(0,0,0,.07);
            border-radius: 14px;
            background: #fff;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(15,23,42,.04);
          }
          .app-table td {
            display: grid;
            grid-template-columns: 96px minmax(0, 1fr);
            gap: 12px;
            padding: 12px;
            border-bottom: 1px solid rgba(0,0,0,.05);
            text-align: left !important;
            min-width: 0;
          }
          .app-table td:last-child { border-bottom: none; }
          .app-table td::before {
            content: attr(data-label);
            font-size: .62rem;
            font-weight: 900;
            letter-spacing: .08em;
            text-transform: uppercase;
            color: #9ca3af;
          }
          .app-candidate, .app-candidate-info, .app-meta, .app-strong, .app-cert { min-width: 0; }
          .app-candidate-name, .app-meta, .app-strong, .app-cert code {
            overflow-wrap: anywhere;
            word-break: break-word;
          }
          .app-action-btn { width: 100%; justify-content: center; white-space: normal; }
        }
      `}</style>
    </AdminLayout>
  );
}
