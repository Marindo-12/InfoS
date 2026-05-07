import AdminLayout from '@/Layouts/AdminLayout'
import { Head, router, usePage } from '@inertiajs/react'
import { useMemo, useState } from 'react'
import {
  Search, X, Check, Send, Filter,
  GraduationCap, CreditCard, Banknote,
  Tag, RefreshCw, ChevronLeft, ChevronRight,
  TrendingUp, FileEdit,
} from 'lucide-react'

/* ═══════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════ */
type ApplicationRow = {
  id: number
  reference: string
  student: string
  email: string
  phone?: string
  course: string
  category: string
  amount: string
  paymentMethod: 'online' | 'onsite'
  paymentStatus: 'paid' | 'pending'
  preferredPaymentDate?: string
  certificateReference?: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
}

type PageProps = {
  auth: { user: { id: number; name: string; email: string } }
  applications: ApplicationRow[]
  stats: { pending: number; approved: number; onlinePaid: number; onsitePending: number }
  flash?: { success?: string; warning?: string }
}

/* ═══════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════ */
const PAGE_SIZE = 10

/* ═══════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════ */
function initials(name: string) {
  return name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
}
function padded(n: number) {
  return String(n).padStart(2, '0')
}
function paymentLabel(a: ApplicationRow) {
  if (a.paymentMethod === 'online')
    return a.paymentStatus === 'paid' ? 'Validé' : 'En attente'
  return a.preferredPaymentDate ? `Rdv ${a.preferredPaymentDate}` : 'Présentiel'
}
function statusLabel(s: ApplicationRow['status']) {
  if (s === 'approved') return 'Dossier validé'
  if (s === 'rejected') return 'Rejeté'
  return 'Reçu'
}

/* ═══════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════ */
export default function Applications() {
  const { applications, stats, flash } = usePage<PageProps>().props

  /* Filters */
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPayment, setFilterPayment] = useState<string>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)

  const categories = useMemo(() => {
    return Array.from(new Set(applications.map(a => a.category))).sort()
  }, [applications])

  /* Filtered list */
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return applications.filter(a => {
      if (q && ![a.student, a.email, a.reference, a.course, a.phone ?? '']
        .some(f => f.toLowerCase().includes(q))) return false
      if (filterStatus !== 'all' && a.status !== filterStatus) return false
      if (filterPayment !== 'all' && a.paymentMethod !== filterPayment) return false
      if (filterCategory !== 'all' && a.category !== filterCategory) return false
      return true
    })
  }, [applications, search, filterStatus, filterPayment, filterCategory])

  /* Reset page on filter change */
  const applyFilter = (fn: () => void) => { fn(); setCurrentPage(1) }

  /* Pagination */
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(currentPage, totalPages)
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const goTo = (p: number) => setCurrentPage(Math.max(1, Math.min(p, totalPages)))
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  /* show at most 5 page buttons centered around current */
  const visiblePages = pages.filter(p => {
    if (totalPages <= 7) return true
    if (p === 1 || p === totalPages) return true
    return Math.abs(p - safePage) <= 2
  })

  const hasFilter = search || filterStatus !== 'all' || filterPayment !== 'all' || filterCategory !== 'all'
  const approvedRate = applications.length ? Math.round((stats.approved / applications.length) * 100) : 0

  const resetFilters = () => {
    applyFilter(() => {
      setSearch('')
      setFilterStatus('all')
      setFilterPayment('all')
      setFilterCategory('all')
    })
  }

  const pendingApps = useMemo(
    () => applications.filter(a => a.status === 'pending').slice(0, 2),
    [applications],
  )

  const approve = (a: ApplicationRow) =>
    router.post(route('admin.applications.approve', a.id), {}, { preserveScroll: true })
  const resendAccess = (a: ApplicationRow) =>
    router.post(route('admin.applications.resend-access', a.id), {}, { preserveScroll: true })

  return (
    <AdminLayout
      header={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Manrope,sans-serif' }}>
          <span style={{ fontSize: '.8rem', color: '#b0a49a' }}>Administration</span>
          <span style={{ color: '#b0a49a', fontSize: '.8rem' }}>/</span>
          <span style={{ fontSize: '.82rem', fontWeight: 700, color: '#1a1612' }}>Candidatures</span>
        </div>
      }
    >
      <Head title="Demandes d'inscription" />

      <div className="app-root">

        {/* ════════════════════════
            HERO
        ════════════════════════ */}
        <section className="app-hero">
          <div className="app-live">
            <span className="app-live-dot" />
            Mise à jour en direct
          </div>

          <div className="app-hero-grid">
            <div className="app-hero-copy">
              <h1>Demandes d'inscription</h1>
              <p>Gestion centrale des flux d'admission et validation des dossiers.</p>
            </div>

            <div className="app-stat-grid">
              {[
                { label: 'En attente', value: stats.pending, accent: true },
                { label: 'Validées', value: stats.approved, accent: false },
                { label: 'En ligne', value: stats.onlinePaid, accent: false },
                { label: 'Présentiel', value: stats.onsitePending, accent: false },
              ].map((s, i) => (
                <div className="app-stat" key={i}>
                  <span>{s.label}</span>
                  <strong style={{ color: s.accent ? '#c2652a' : '#3a302a' }}>
                    {padded(s.value)}
                  </strong>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Flash messages */}
        {flash?.success && (
          <div className="app-flash app-flash--success">
            <Check size={15} /> {flash.success}
          </div>
        )}
        {flash?.warning && (
          <div className="app-flash app-flash--warning">
            <X size={15} /> {flash.warning}
          </div>
        )}

        {/* ════════════════════════
            TABLE SECTION
        ════════════════════════ */}
        <section className="app-canvas">

          {/* ── Canvas header ── */}
          <div className="app-canvas-head">
            <div>
              <h2>Liste des dossiers récents</h2>
              <p>
                {filtered.length} dossier{filtered.length > 1 ? 's' : ''} affiché{filtered.length > 1 ? 's' : ''}
                {hasFilter && ` sur ${applications.length}`}
              </p>
            </div>

            {/* ── Toolbar : search + filters always flex ── */}
            <div className="app-toolbar">

              {/* Search */}
              <label className="app-search">
                <Search size={15} className="app-search-icon" />
                <input
                  type="text"
                  value={search}
                  onChange={e => applyFilter(() => setSearch(e.target.value))}
                  placeholder="Rechercher un candidat, email…"
                  aria-label="Rechercher"
                />
                {search && (
                  <button
                    type="button"
                    className="app-search-clear"
                    onClick={() => applyFilter(() => setSearch(''))}
                    aria-label="Effacer"
                  >
                    <X size={13} />
                  </button>
                )}
              </label>

              {/* Filters row */}
              <div className="app-filters">
                {/* Filter icon — always visible */}
                <Filter size={15} className="app-filter-icon" />

                {/* Status */}
                <div className="app-select-wrap">
                  <GraduationCap size={13} className="app-select-icon" />
                  <select
                    value={filterStatus}
                    onChange={e => applyFilter(() => setFilterStatus(e.target.value))}
                    aria-label="Filtrer par statut"
                  >
                    <option value="all">Tous statuts</option>
                    <option value="pending">En attente</option>
                    <option value="approved">Validées</option>
                    <option value="rejected">Rejetées</option>
                  </select>
                </div>

                {/* Payment */}
                <div className="app-select-wrap">
                  <CreditCard size={13} className="app-select-icon" />
                  <select
                    value={filterPayment}
                    onChange={e => applyFilter(() => setFilterPayment(e.target.value))}
                    aria-label="Filtrer par paiement"
                  >
                    <option value="all">Tout paiement</option>
                    <option value="online">En ligne</option>
                    <option value="onsite">Présentiel</option>
                  </select>
                </div>

                {/* Category */}
                <div className="app-select-wrap">
                  <Tag size={13} className="app-select-icon" />
                  <select
                    value={filterCategory}
                    onChange={e => applyFilter(() => setFilterCategory(e.target.value))}
                    aria-label="Filtrer par formation"
                  >
                    <option value="all">Toutes formations</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Reset */}
                {hasFilter && (
                  <button type="button" className="app-reset" onClick={resetFilters}>
                    <RefreshCw size={13} />
                    <span className="app-reset-label">Réinitialiser</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ── Table ── */}
          <div className="app-table-wrap">
            {paginated.length === 0 ? (
              <div className="app-empty">
                <p>Aucun dossier ne correspond à vos filtres.</p>
                <button type="button" onClick={resetFilters}>Voir tous les dossiers</button>
              </div>
            ) : (
              <table className="app-table">
                <thead>
                  <tr>
                    <th>Candidat</th>
                    <th>Formation</th>
                    <th>Paiement</th>
                    <th>Certificat ID</th>
                    <th>Statut</th>
                    <th>Date</th>
                    <th>Gestion</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((a, rowIdx) => {
                    const isApproved = a.status === 'approved'
                    const isRejected = a.status === 'rejected'
                    /* Alternating rows: even = white, odd = light grey */
                    const rowBg = rowIdx % 2 === 0 ? '#ffffff' : '#f9f6f2'

                    return (
                      <tr key={a.reference} style={{ background: rowBg }}>
                        <td data-label="Candidat">
                          <div className="app-candidate">
                            <div className="app-avatar">{initials(a.student)}</div>
                            <div>
                              <strong>{a.student}</strong>
                              <span>{a.email}</span>
                              {a.phone && <small>{a.phone}</small>}
                            </div>
                          </div>
                        </td>

                        <td data-label="Formation">
                          <strong className="app-course">{a.course}</strong>
                          <span className="app-muted">{a.category}</span>
                          <span className="app-price">{a.amount}</span>
                        </td>

                        <td data-label="Paiement">
                          <div className={`app-pay ${a.paymentStatus === 'paid' ? 'app-pay--ok' : 'app-pay--wait'}`}>
                            {a.paymentStatus === 'paid'
                              ? <Check size={12} strokeWidth={3} />
                              : <span className="app-pay-dot" />}
                            <span>{paymentLabel(a)}</span>
                          </div>
                          {a.paymentMethod === 'online'
                            ? <CreditCard size={11} className="app-method-icon" />
                            : <Banknote size={11} className="app-method-icon" />}
                        </td>

                        <td data-label="Certificat ID">
                          {a.certificateReference
                            ? <code className="app-code">{a.certificateReference}</code>
                            : <span className="app-muted app-italic">En génération…</span>}
                        </td>

                        <td data-label="Statut">
                          <span className={`app-status app-status--${a.status}`}>
                            {statusLabel(a.status)}
                          </span>
                        </td>

                        <td data-label="Date">
                          <span className="app-date">{a.createdAt}</span>
                        </td>

                        <td data-label="Gestion">
                          <button
                            type="button"
                            className={`app-action ${isApproved ? 'app-action--light' : ''}`}
                            onClick={() => isApproved ? resendAccess(a) : approve(a)}
                            disabled={isRejected}
                          >
                            {isApproved
                              ? <><Send size={13} /> Renvoyer</>
                              : <>Accorder l'accès</>}
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* ════════════════════════
              PAGINATION
          ════════════════════════ */}
          {filtered.length > 0 && (
            <div className="app-pagination">
              {/* Info */}
              <p className="app-pagination-info">
                {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)} sur {filtered.length} dossiers
              </p>

              {/* Controls */}
              <div className="app-pager">

                {/* Prev */}
                <button
                  type="button"
                  className="app-pager-btn"
                  onClick={() => goTo(safePage - 1)}
                  disabled={safePage === 1}
                  aria-label="Page précédente"
                >
                  <ChevronLeft size={15} />
                </button>

                {/* Page buttons with ellipsis */}
                {visiblePages.map((p, i, arr) => (
                  <>
                    {/* Ellipsis before */}
                    {i > 0 && arr[i - 1] !== p - 1 && (
                      <span key={`ell-${p}`} className="app-pager-ellipsis">…</span>
                    )}
                    <button
                      key={p}
                      type="button"
                      className={`app-pager-btn ${p === safePage ? 'app-pager-btn--active' : ''}`}
                      onClick={() => goTo(p)}
                      aria-current={p === safePage ? 'page' : undefined}
                    >
                      {p}
                    </button>
                  </>
                ))}

                {/* Next */}
                <button
                  type="button"
                  className="app-pager-btn"
                  onClick={() => goTo(safePage + 1)}
                  disabled={safePage === totalPages}
                  aria-label="Page suivante"
                >
                  <ChevronRight size={15} />
                </button>
              </div>

              {/* Page size info */}
              <p className="app-pagination-info app-pagination-info--right">
                {PAGE_SIZE} par page · {totalPages} page{totalPages > 1 ? 's' : ''}
              </p>
            </div>
          )}
        </section>

        {/* ════════════════════════
            INSIGHTS
        ════════════════════════ */}
        <section className="app-insights">

          {/* Performance */}
          <article>
            <div className="app-insight-head">
              <TrendingUp size={22} className="app-insight-icon" />
              <h3>Suivi de performance hebdomadaire</h3>
            </div>
            <div className="app-bars">
              {[48, 76, 120, 92, 64].map((h, i) => (
                <span
                  key={i}
                  className={`app-bar ${i === 2 ? 'app-bar--primary' : ''}`}
                  style={{ height: h }}
                />
              ))}
              <div className="app-bars-stat">
                <strong>{approvedRate}%</strong>
                <small>dossiers validés</small>
              </div>
            </div>
            <p>
              Les admissions sont visibles par statut, mode de paiement et formation. La conversion des dossiers en attente peut être suivie directement depuis cette console.
            </p>
          </article>

          {/* Pending */}
          <article>
            <div className="app-insight-head">
              <FileEdit size={22} className="app-insight-icon" />
              <h3>Dossiers en attente de validation</h3>
            </div>
            <div className="app-pending-list">
              {pendingApps.length
                ? pendingApps.map((a, i) => (
                  <div key={a.reference} className="app-pending-card">
                    <div>
                      <strong>{a.course}</strong>
                      <span>Candidat : {a.student}</span>
                    </div>
                    <em className={i === 0 ? 'app-urgent' : 'app-planned'}>
                      {i === 0 ? 'Urgent' : 'Prévu'}
                    </em>
                  </div>
                ))
                : <p className="app-muted">Aucun dossier prioritaire pour le moment.</p>}
            </div>
            <p>
              <strong>{stats.pending} dossier{stats.pending > 1 ? 's' : ''}</strong> requièrent encore une validation manuelle pour débloquer l'accès étudiant.
            </p>
          </article>
        </section>
      </div>

      {/* ═══════════════════════════
          STYLES
      ═══════════════════════════ */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Manrope:wght@400;500;600;700;800&display=swap');

        /* ── Root ── */
        .app-root {
          min-height: 100%;
          width: 100%;
          max-width: 1440px;
          margin: 0 auto;
          padding: 40px 40px 64px;
          background: #f8f8f4;         /* ← changed from white */
          color: #3a302a;
          font-family: 'Manrope', sans-serif;
          overflow-x: hidden;
        }
        .app-root *, .app-root *::before, .app-root *::after { box-sizing: border-box; }

        /* ── Hero ── */
        .app-hero { margin-bottom: 36px; }
        .app-live {
          display: inline-flex; align-items: center; gap: 8px;
          margin-bottom: 22px; padding: 5px 12px;
          background: #fff; border: 1px solid #e7e5e4;
          color: #78716c; font-size: 10px; font-weight: 800;
          letter-spacing: .16em; text-transform: uppercase;
          border-radius: 3px;
        }
        .app-live-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #c2652a;
          animation: appPulse 1.8s ease-in-out infinite;
        }
        @keyframes appPulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:.4; transform:scale(.8); }
        }

        .app-hero-grid {
          display: grid;
          grid-template-columns: minmax(0,1fr) auto;
          align-items: end; gap: 40px;
        }
        .app-hero-copy h1 {
          margin: 0;
          font-family: 'EB Garamond', serif;
          font-size: clamp(2.6rem, 6vw, 4.5rem);
          font-weight: 400; line-height: .92;
          letter-spacing: -.03em; color: #3a302a;
        }
        .app-hero-copy p {
          margin: 18px 0 0; max-width: 520px;
          font-family: 'EB Garamond', serif;
          font-size: clamp(1.2rem, 2vw, 1.8rem);
          font-style: italic; line-height: 1.3; color: #a8a29e;
        }

        .app-stat-grid {
          display: grid; grid-template-columns: repeat(4, minmax(120px,1fr));
          border: 1px solid #e7e5e4; background: #fff;
        }
        .app-stat {
          padding: 22px 26px;
          border-right: 1px solid #e7e5e4;
        }
        .app-stat:last-child { border-right: none; }
        .app-stat span {
          display: block; margin-bottom: 6px;
          color: #a8a29e; font-size: 9px; font-weight: 800;
          letter-spacing: .18em; text-transform: uppercase;
        }
        .app-stat strong {
          font-family: 'EB Garamond', serif;
          font-size: 3rem; font-weight: 500; line-height: 1;
        }

        /* ── Flash ── */
        .app-flash {
          display: flex; align-items: center; gap: 8px;
          margin-bottom: 16px; padding: 11px 14px;
          border: 1px solid; font-size: .82rem; font-weight: 700;
          border-radius: 3px;
        }
        .app-flash--success { background: #f0fdf4; color: #047857; border-color: #bbf7d0; }
        .app-flash--warning { background: #fffbeb; color: #92400e; border-color: #fde68a; }

        /* ── Canvas ── */
        .app-canvas {
          border: 1px solid #e7e5e4;
          background: #fff;
          box-shadow: 0 1px 4px rgba(0,0,0,0.05);
          border-radius: 3px;
        }
        .app-canvas-head {
          display: flex; align-items: center;
          justify-content: space-between; gap: 20px;
          padding: 20px 24px;
          border-bottom: 1px solid #e7e5e4;
          background: #f8f8f4;
          flex-wrap: wrap;
        }
        .app-canvas-head h2 {
          margin: 0;
          font-family: 'EB Garamond', serif;
          font-size: 1.9rem; font-weight: 500; color: #3a302a;
        }
        .app-canvas-head > div:first-child p {
          margin: 3px 0 0; color: #a8a29e;
          font-size: 10px; font-weight: 800;
          letter-spacing: .14em; text-transform: uppercase;
        }

        /* ── Toolbar ── */
        .app-toolbar {
          display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap;
        }

        /* Search */
        .app-search {
          position: relative; display: flex; align-items: center;
          background: #fff; border: 1px solid #e7e5e4;
          width:100%; flex: 1;
        }
        .app-search-icon {
          position: absolute; left: 11px; color: #a8a29e; pointer-events: none;
        }
        .app-search input {
          width: 100%; border: none; outline: none;
          padding: 9px 34px 9px 34px;
          font-family: 'Manrope', sans-serif;
          font-size: .78rem; color: #3a302a;
          background: transparent;
        }
        .app-search input:focus { box-shadow: inset 0 0 0 1.5px #c2652a; }
        .app-search-clear {
          position: absolute; right: 8px;
          display: inline-flex; border: none;
          background: transparent; color: #a8a29e; cursor: pointer;
          padding: 3px;
        }

        /* Filters row */
        .app-filters {
          display: flex; align-items: center; gap: 7px; flex-wrap: wrap;
        }
        .app-filter-icon { color: #a8a29e; flex-shrink: 0; }

        /* Select with icon */
        .app-select-wrap {
          position: relative; display: inline-flex; align-items: center;
        }
        .app-select-icon {
          position: absolute; left: 9px; color: #a8a29e; pointer-events: none;
          z-index: 1;
        }
        .app-select-wrap select {
          height: 36px;
          padding: 0 10px 0 28px;
          border: 1px solid #e7e5e4;
          background: #fff; color: #57534e;
          font-family: 'Manrope', sans-serif;
          font-size: .72rem; font-weight: 700;
          letter-spacing: .06em; text-transform: uppercase;
          cursor: pointer; appearance: none;
          border-radius: 2px;
          transition: border-color .15s;
        }
        .app-select-wrap select:focus {
          outline: none; border-color: #c2652a;
          box-shadow: 0 0 0 2px rgba(194,101,42,.12);
        }

        /* Reset button */
        .app-reset {
          display: inline-flex; align-items: center; gap: 5px;
          height: 36px; padding: 0 12px;
          border: 1px solid #e7e5e4; background: #fff;
          color: #78716c;
          font-family: 'Manrope', sans-serif;
          font-size: .72rem; font-weight: 800;
          letter-spacing: .06em; text-transform: uppercase;
          cursor: pointer; border-radius: 2px;
          transition: background .15s, color .15s, border-color .15s;
        }
        .app-reset:hover { background: #fff3ec; color: #c2652a; border-color: rgba(194,101,42,.3); }

        /* ── Table ── */
        .app-table-wrap { overflow-x: auto; }
        .app-table {
          width: 100%; min-width: 960px;
          border-collapse: collapse; text-align: left;
        }
        .app-table th {
          padding: 14px 22px;
          border-bottom: 1px solid #e7e5e4;
          background: #f8f8f4;
          color: #a8a29e; font-size: 10px; font-weight: 800;
          letter-spacing: .15em; text-transform: uppercase;
        }
        .app-table th:last-child { text-align: right; }
        .app-table td {
          padding: 18px 22px;
          border-bottom: 1px solid #f0ede8;
          vertical-align: middle; font-size: .86rem;
          transition: background .12s;
        }
        /* Alternating rows set via inline style on <tr>, hover override */
        .app-table tbody tr:hover td { background: #fff8f2 !important; }
        .app-table tbody tr:last-child td { border-bottom: none; }
        .app-table td:last-child { text-align: right; }

        /* Candidate cell */
        .app-candidate { display: flex; align-items: center; gap: 14px; }
        .app-avatar {
          width: 40px; height: 40px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid #e7e5e4; background: #f5f5f4;
          color: #a8a29e; font-size: .72rem; font-weight: 900;
          border-radius: 2px;
        }
        .app-candidate strong { display: block; color: #3a302a; font-weight: 800; }
        .app-candidate span, .app-candidate small, .app-muted, .app-date {
          display: block; color: #a8a29e; font-size: .73rem; margin-top: 2px;
        }
        .app-course { display: block; color: #3a302a; font-weight: 800; }
        .app-price  { display: block; margin-top: 5px; color: #c2652a; font-weight: 800; font-size: .8rem; }
        .app-italic { font-style: italic; }
        .app-method-icon { color: #c8bdb6; margin-top: 4px; display: block; }

        /* Payment */
        .app-pay {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 9px; font-weight: 900; letter-spacing: .14em; text-transform: uppercase;
        }
        .app-pay--ok   { color: #059669; }
        .app-pay--wait { color: #c2652a; }
        .app-pay-dot {
          width: 7px; height: 7px;
          border: 1.5px solid currentColor; border-radius: 50%;
        }

        /* Code */
        .app-code {
          background: #f5f5f4; color: #57534e;
          padding: 3px 7px; font-size: 11px;
          font-family: ui-monospace, SFMono-Regular, monospace;
          border-radius: 2px;
        }

        /* Status */
        .app-status {
          display: inline-flex; border: 1px solid;
          padding: 3px 8px; border-radius: 2px;
          font-size: 9px; font-weight: 900;
          letter-spacing: .12em; text-transform: uppercase; white-space: nowrap;
        }
        .app-status--approved { border-color: #a7f3d0; color: #047857; background: #f0fdf4; }
        .app-status--pending  { border-color: #e08850; color: #c2652a; background: #fff7f2; }
        .app-status--rejected { border-color: #fecaca; color: #dc2626; background: #fff0f0; }

        /* Action button */
        .app-action {
          display: inline-flex; align-items: center; justify-content: center; gap: 7px;
          border: none; background: #1a1a1a; color: #fff;
          padding: 9px 18px; border-radius: 2px;
          font-family: 'Manrope', sans-serif;
          font-size: 9px; font-weight: 900;
          letter-spacing: .14em; text-transform: uppercase;
          cursor: pointer; white-space: nowrap;
          transition: background .15s;
        }
        .app-action:hover:not(:disabled) { background: #c2652a; }
        .app-action:disabled { opacity: .35; cursor: not-allowed; }
        .app-action--light {
          background: #fff; color: #3a302a;
          border: 1px solid #e7e5e4;
        }
        .app-action--light:hover:not(:disabled) {
          background: #c2652a; color: #fff; border-color: #c2652a;
        }

        /* Empty state */
        .app-empty {
          display: flex; flex-direction: column; align-items: center; gap: 12px;
          padding: 60px 20px; color: #a8a29e; text-align: center;
        }
        .app-empty button {
          border: 1px solid #e7e5e4; background: #fff;
          padding: 9px 16px; font-size: 10px; font-weight: 900;
          letter-spacing: .12em; text-transform: uppercase; cursor: pointer;
          border-radius: 2px;
        }

        /* ── Pagination ── */
        .app-pagination {
          display: flex; align-items: center; justify-content: space-between;
          gap: 14px; flex-wrap: wrap;
          padding: 18px 22px;
          border-top: 1px solid #e7e5e4;
          background: #f8f8f4;
        }
        .app-pagination-info {
          margin: 0; color: #a8a29e;
          font-size: 10px; font-weight: 800;
          letter-spacing: .14em; text-transform: uppercase;
        }
        .app-pagination-info--right { text-align: right; }

        .app-pager { display: flex; align-items: center; gap: 2px; }
        .app-pager-btn {
          min-width: 36px; height: 36px; padding: 0 6px;
          display: inline-flex; align-items: center; justify-content: center;
          border: 1px solid #e7e5e4; background: #fff;
          color: #57534e;
          font-family: 'Manrope', sans-serif;
          font-size: .78rem; font-weight: 700;
          cursor: pointer; border-radius: 2px;
          transition: background .13s, color .13s, border-color .13s;
        }
        .app-pager-btn:hover:not(:disabled) {
          background: #fff3ec; color: #c2652a; border-color: rgba(194,101,42,.3);
        }
        .app-pager-btn:disabled { opacity: .35; cursor: not-allowed; }
        .app-pager-btn--active {
          background: #c2652a; color: #fff; border-color: #c2652a;
        }
        .app-pager-btn--active:hover { background: #c2652a; color: #fff; }
        .app-pager-ellipsis {
          min-width: 28px; text-align: center;
          color: #a8a29e; font-size: .82rem; pointer-events: none;
        }

        /* ── Insights ── */
        .app-insights {
          display: grid; grid-template-columns: 1fr 1fr;
          margin-top: 40px; border: 1px solid #e7e5e4;
          background: #fff;
        }
        .app-insights article {
          padding: 36px;
        }
        .app-insights article + article {
          border-left: 1px solid #e7e5e4;
          background: #f8f8f4;
        }
        .app-insight-head {
          display: flex; align-items: center; gap: 12px; margin-bottom: 22px;
        }
        .app-insight-icon { color: #c2652a; flex-shrink: 0; }
        .app-insight-head h3 {
          margin: 0;
          font-family: 'EB Garamond', serif;
          font-size: 1.8rem; font-weight: 500; color: #3a302a;
        }

        .app-bars {
          display: flex; align-items: flex-end; gap: 8px; margin-bottom: 20px;
        }
        .app-bar {
          width: 28px; display: block;
          background: #e7e5e4; border-radius: 2px 2px 0 0;
          transition: background .15s;
        }
        .app-bar--primary { background: #c2652a; }
        .app-bars-stat { margin-left: 14px; }
        .app-bars-stat strong {
          display: block;
          font-family: 'EB Garamond', serif;
          font-size: 2.2rem; font-weight: 500; color: #3a302a;
        }
        .app-bars-stat small {
          display: block; color: #a8a29e;
          font-size: 9px; font-weight: 900;
          letter-spacing: .14em; text-transform: uppercase;
        }
        .app-insights p {
          margin: 0; color: #78716c; font-size: .88rem; line-height: 1.75;
        }

        .app-pending-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px; }
        .app-pending-card {
          display: flex; align-items: center; justify-content: space-between; gap: 14px;
          padding: 14px; border: 1px solid #e7e5e4; background: #fff;
          border-radius: 2px;
        }
        .app-pending-card strong {
          display: block; font-size: .76rem; font-weight: 900;
          letter-spacing: .06em; text-transform: uppercase; color: #3a302a;
        }
        .app-pending-card span { display: block; margin-top: 2px; color: #a8a29e; font-size: .74rem; }
        .app-urgent {
          flex-shrink: 0; padding: 3px 8px;
          background: #fce4e0; color: #c0392b;
          font-size: 9px; font-style: normal; font-weight: 900;
          letter-spacing: .1em; text-transform: uppercase; border-radius: 2px;
        }
        .app-planned {
          flex-shrink: 0; padding: 3px 8px;
          background: #f5f5f4; color: #78716c;
          font-size: 9px; font-style: normal; font-weight: 900;
          letter-spacing: .1em; text-transform: uppercase; border-radius: 2px;
        }

        /* ── Responsive ── */
        @media (max-width: 1100px) {
          .app-hero-grid { grid-template-columns: 1fr; }
          .app-stat-grid { grid-template-columns: repeat(2,1fr); }
          .app-stat:nth-child(2) { border-right: none; }
          .app-stat:nth-child(1), .app-stat:nth-child(2) { border-bottom: 1px solid #e7e5e4; }
        }

        @media (max-width: 800px) {
          .app-root { padding: 24px 16px 48px; }
          .app-insights { grid-template-columns: 1fr; }
          .app-insights article + article { border-left: none; border-top: 1px solid #e7e5e4; }

          /* Filters: icons only */
          .app-select-wrap select { padding: 0 8px 0 8px; width: 36px; color: transparent; font-size: 0; }
          .app-select-wrap select option { font-size: .78rem; color: #3a302a; }
          .app-select-icon { left: 50%; transform: translateX(-50%); }
          .app-reset-label { display: none; }
          .app-reset { width: 36px; padding: 0; justify-content: center; }
        }

        @media (max-width: 640px) {
          .app-stat-grid { grid-template-columns: 1fr; }
          .app-stat { border-right: none; border-bottom: 1px solid #e7e5e4; }
          .app-stat:last-child { border-bottom: none; }
          .app-canvas-head { align-items: flex-start; flex-direction: column; }
          .app-toolbar { width: 100%; }
          .app-search { min-width: 0; width: 100%; }
        }
      `}</style>
    </AdminLayout>
  )
}