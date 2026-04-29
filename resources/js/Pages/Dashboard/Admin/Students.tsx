import AdminLayout from '@/Layouts/AdminLayout'
import { Head, usePage } from '@inertiajs/react'

/* ═══════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════ */
type Stat = {
  label:  string
  value:  string
  sub:    string
  accent: 'orange' | 'blue' | 'green' | 'slate'
}

type RecentStudent = {
  name:     string
  email:    string
  course:   string
  joinedAt: string
}

type StudentRow = {
  name:             string
  email:            string
  phone:            string | null
  course:           string
  progress:         number
  paymentStatus:    'paye' | 'partiel' | 'retard' | 'non defini'
  lastSeen:         string
  enrollmentsCount: number
}

type PageProps = {
  auth:           { user: { id: number; name: string; email: string } }
  stats:          Stat[]
  recentStudents: RecentStudent[]
  students:       StudentRow[]
}

/* ═══════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════ */
function statusMeta(status: StudentRow['paymentStatus']) {
  if (status === 'paye')    return { label: 'Payé',       cls: 'adm-status adm-status--green' }
  if (status === 'partiel') return { label: 'Partiel',    cls: 'adm-status adm-status--amber' }
  if (status === 'retard')  return { label: 'Retard',     cls: 'adm-status adm-status--red'   }
  return                           { label: 'Non défini', cls: 'adm-status adm-status--slate' }
}

function initials(name: string) {
  return name.split(' ').map(p => p[0]).slice(0, 2).join('')
}

/* ═══════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════ */
export default function Students() {
  const { props }                             = usePage<PageProps>()
  const { stats, recentStudents, students }   = props

  return (
    <AdminLayout
      header={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Manrope, sans-serif' }}>
          <span style={{ fontSize: '.8rem', color: '#b0a49a' }}>Administration</span>
          <span style={{ color: '#b0a49a', fontSize: '.8rem' }}>/</span>
          <span style={{ fontSize: '.82rem', fontWeight: 700, color: '#1a1612' }}>Étudiants</span>
        </div>
      }
    >
      <Head title="Gestion des étudiants" />

      <div className="adm-root">

        {/* ── Page header ── */}
        <header className="adm-header">
          <div>
            <p className="adm-kicker">Administration</p>
            <h1 className="adm-title">Gestion des étudiants</h1>
            <p className="adm-subtitle">
              Vue d'ensemble des inscriptions, paiements et progressions des étudiants du centre.
            </p>
          </div>
          <button className="adm-primary-btn" type="button">
            + Nouvel étudiant
          </button>
        </header>

        {/* ── Stats ── */}
        <section className="adm-stats-grid">
          {stats.map(stat => (
            <div className={`adm-stat-card adm-stat-card--${stat.accent}`} key={stat.label}>
              <p className="adm-stat-label">{stat.label}</p>
              <p className="adm-stat-value">{stat.value}</p>
              <p className="adm-stat-sub">{stat.sub}</p>
            </div>
          ))}
        </section>

        {/* ── Recent students ── */}
        <section className="adm-recent-section">
          <div className="adm-section-head">
            <h2>Nouveaux étudiants récents</h2>
            <span>{recentStudents.length} profil{recentStudents.length > 1 ? 's' : ''} affiché{recentStudents.length > 1 ? 's' : ''}</span>
          </div>
          <div className="adm-recent-grid">
            {recentStudents.map(student => (
              <article className="adm-recent-card" key={student.email}>
                <div className="adm-avatar">{initials(student.name)}</div>
                <h3>{student.name}</h3>
                <p>{student.email}</p>
                <span className="adm-recent-chip">{student.course}</span>
                <small>Inscrit le {student.joinedAt}</small>
              </article>
            ))}
          </div>
        </section>

        {/* ── Table ── */}
        <section className="adm-table-section">
          <div className="adm-section-head">
            <h2>Liste des étudiants</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span>{students.length} ligne{students.length > 1 ? 's' : ''}</span>
              {/* Filters row */}
              <div style={{ display: 'flex', gap: 8 }}>
                {['Tous', 'Payé', 'Partiel', 'Retard'].map(f => (
                  <button key={f} style={{
                    padding: '4px 12px', borderRadius: 99,
                    border: f === 'Tous' ? '1px solid rgba(194,101,42,.4)' : '1px solid rgba(0,0,0,0.08)',
                    background: f === 'Tous' ? '#fff3ec' : '#fff',
                    color: f === 'Tous' ? '#c2652a' : '#6b7280',
                    fontSize: '.72rem', fontWeight: 700, cursor: 'pointer',
                    fontFamily: 'Manrope, sans-serif',
                  }}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Étudiant</th>
                  <th>Formation</th>
                  <th>Paiement</th>
                  <th>Progression</th>
                  <th>Parcours</th>
                  <th>Dernière activité</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => {
                  const status = statusMeta(student.paymentStatus)
                  return (
                    <tr key={student.email}>
                      <td>
                        <div className="adm-student-cell">
                          <div className="adm-avatar adm-avatar--sm">{initials(student.name)}</div>
                          <div>
                            <strong>{student.name}</strong>
                            <span>{student.email}</span>
                            {student.phone && <small>{student.phone}</small>}
                          </div>
                        </div>
                      </td>
                      <td>{student.course}</td>
                      <td><span className={status.cls}>{status.label}</span></td>
                      <td>
                        <div className="adm-progress">
                          <div className="adm-progress-track">
                            <div className="adm-progress-fill" style={{ width: `${student.progress}%` }} />
                          </div>
                          <span>{student.progress}%</span>
                        </div>
                      </td>
                      <td>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          width: 28, height: 28, borderRadius: 8,
                          background: '#f5f4f1', border: '1px solid rgba(0,0,0,0.07)',
                          fontWeight: 800, fontSize: '.82rem', color: '#1a1612',
                        }}>
                          {student.enrollmentsCount}
                        </span>
                      </td>
                      <td style={{ color: '#6b7280', fontSize: '.8rem' }}>{student.lastSeen}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="adm-action-btn" title="Voir le profil">
                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>visibility</span>
                          </button>
                          <button className="adm-action-btn" title="Modifier">
                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>edit</span>
                          </button>
                          <button className="adm-action-btn adm-action-btn--danger" title="Supprimer">
                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0 4px', flexWrap: 'wrap', gap: 10 }}>
            <p style={{ fontSize: '.78rem', color: '#8b8b8b', fontFamily: 'Manrope,sans-serif' }}>
              Affichage de {students.length} sur {students.length} résultats
            </p>
            <div style={{ display: 'flex', gap: 6 }}>
              {['←', '1', '2', '3', '→'].map((p, i) => (
                <button key={i} style={{
                  width: 32, height: 32, borderRadius: 8, border: '1px solid rgba(0,0,0,0.08)',
                  background: p === '1' ? '#c2652a' : '#fff',
                  color: p === '1' ? '#fff' : '#6b7280',
                  fontWeight: 700, fontSize: '.78rem', cursor: 'pointer',
                  fontFamily: 'Manrope, sans-serif',
                }}>{p}</button>
              ))}
            </div>
          </div>
        </section>

      </div>

      {/* ═══════════════════════════
          STYLES — scoped
      ═══════════════════════════ */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');
        .material-symbols-outlined {
          font-variation-settings:'FILL' 0,'wght' 300,'GRAD' 0,'opsz' 24;
          font-family:'Material Symbols Outlined';
          font-style:normal;line-height:1;
          letter-spacing:normal;text-transform:none;
          display:inline-block;white-space:nowrap;
          -webkit-font-smoothing:antialiased;
        }

        .adm-root {
          padding: 28px;
          font-family: 'Manrope', sans-serif;
          color: #18181b;
          min-height: 100%;
        }

        /* Header */
        .adm-header {
          display: flex; justify-content: space-between;
          gap: 20px; align-items: flex-end; flex-wrap: wrap;
          background: #fff;
          border: 1px solid rgba(15,23,42,.07);
          box-shadow: 0 4px 20px rgba(15,23,42,.04);
          border-radius: 20px;
          padding: 28px;
          margin-bottom: 22px;
          background: radial-gradient(circle at top right, rgba(194,101,42,.08), transparent 40%), #fff;
        }
        .adm-kicker {
          margin: 0 0 6px;
          font-size: .72rem; font-weight: 800;
          letter-spacing: .14em; text-transform: uppercase;
          color: #c2652a;
        }
        .adm-title {
          margin: 0;
          font-family: 'EB Garamond', serif;
          font-size: clamp(1.8rem, 3vw, 2.8rem);
          line-height: 1; color: #18181b;
        }
        .adm-subtitle {
          margin: 12px 0 0; color: #6b7280;
          max-width: 600px; line-height: 1.7; font-size: .9rem;
        }
        .adm-primary-btn {
          border: none; border-radius: 12px;
          padding: 11px 20px;
          background: linear-gradient(135deg, #c2652a, #e8915a);
          color: #fff;
          font-size: .84rem; font-weight: 800;
          cursor: pointer; white-space: nowrap;
          box-shadow: 0 8px 20px rgba(194,101,42,.3);
          font-family: 'Manrope', sans-serif;
          transition: opacity .2s, transform .2s;
        }
        .adm-primary-btn:hover { opacity: .9; transform: translateY(-1px); }

        /* Stats */
        .adm-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px; margin-bottom: 22px;
        }
        .adm-stat-card {
          background: #fff;
          border: 1px solid rgba(15,23,42,.07);
          box-shadow: 0 2px 12px rgba(15,23,42,.04);
          border-radius: 16px; padding: 20px;
          transition: transform .2s, box-shadow .2s;
        }
        .adm-stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(15,23,42,.07); }
        .adm-stat-label {
          margin: 0 0 8px;
          color: #8b8b8b; font-size: .7rem;
          font-weight: 800; text-transform: uppercase;
          letter-spacing: .12em;
        }
        .adm-stat-value {
          margin: 0; color: #18181b;
          font-family: 'EB Garamond', serif;
          font-size: 2rem; line-height: 1;
        }
        .adm-stat-sub { margin: 8px 0 0; color: #6b7280; font-size: .8rem; }
        .adm-stat-card--orange { border-top: 3px solid #c2652a; }
        .adm-stat-card--blue   { border-top: 3px solid #3b82f6; }
        .adm-stat-card--green  { border-top: 3px solid #10b981; }
        .adm-stat-card--slate  { border-top: 3px solid #64748b; }

        /* Recent */
        .adm-recent-section { margin-bottom: 22px; }
        .adm-section-head {
          display: flex; align-items: center;
          justify-content: space-between; gap: 12px;
          margin-bottom: 14px; flex-wrap: wrap;
        }
        .adm-section-head h2 {
          margin: 0;
          font-family: 'EB Garamond', serif; font-size: 1.7rem;
          color: #18181b;
        }
        .adm-section-head > span {
          color: #8b8b8b; font-size: .78rem; font-weight: 700;
        }
        .adm-recent-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        .adm-recent-card {
          background: #fff;
          border: 1px solid rgba(15,23,42,.07);
          box-shadow: 0 2px 12px rgba(15,23,42,.04);
          border-radius: 16px; padding: 22px; text-align: center;
          transition: transform .2s, box-shadow .2s;
        }
        .adm-recent-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(15,23,42,.07); }
        .adm-avatar {
          width: 56px; height: 56px;
          border-radius: 16px;
          display: inline-flex; align-items: center; justify-content: center;
          background: linear-gradient(135deg, #c2652a, #e8915a);
          color: #fff; font-weight: 800; font-size: .9rem;
          margin-bottom: 12px;
        }
        .adm-avatar--sm {
          width: 42px; height: 42px;
          border-radius: 12px;
          margin-bottom: 0; flex-shrink: 0;
          font-size: .74rem;
        }
        .adm-recent-card h3 { margin: 0; font-size: .96rem; font-weight: 800; color: #18181b; }
        .adm-recent-card p  { margin: 6px 0; color: #6b7280; font-size: .8rem; }
        .adm-recent-chip {
          display: inline-flex; align-items: center;
          padding: 5px 10px; border-radius: 99px;
          background: #fff3ec; color: #c2652a;
          font-size: .68rem; font-weight: 800;
          margin-bottom: 8px;
        }
        .adm-recent-card small { display: block; color: #9ca3af; font-size: .72rem; }

        /* Table section */
        .adm-table-section {
          background: #fff;
          border: 1px solid rgba(15,23,42,.07);
          box-shadow: 0 4px 20px rgba(15,23,42,.04);
          border-radius: 20px; padding: 24px;
          margin-bottom: 8px;
        }
        .adm-table-wrap {
          overflow-x: auto;
          border-radius: 14px;
          border: 1px solid rgba(15,23,42,.06);
          margin-top: 12px;
        }
        .adm-table {
          width: 100%; min-width: 900px;
          border-collapse: collapse; background: #fff;
        }
        .adm-table thead tr { background: #faf8f5; }
        .adm-table th, .adm-table td {
          padding: 14px 18px;
          border-bottom: 1px solid rgba(15,23,42,.06);
          text-align: left; font-size: .84rem;
        }
        .adm-table th {
          color: #8b8b8b; font-size: .68rem;
          font-weight: 800; letter-spacing: .1em;
          text-transform: uppercase;
        }
        .adm-table tbody tr:last-child td { border-bottom: none; }
        .adm-table tbody tr:hover { background: #fffaf6; }

        .adm-student-cell { display: flex; align-items: center; gap: 12px; }
        .adm-student-cell strong { display: block; color: #18181b; font-weight: 700; }
        .adm-student-cell span, .adm-student-cell small {
          display: block; color: #6b7280;
          font-size: .74rem; margin-top: 1px;
        }

        /* Status badges */
        .adm-status {
          display: inline-flex; align-items: center;
          padding: 4px 10px; border-radius: 99px;
          font-size: .67rem; font-weight: 800;
          text-transform: uppercase; letter-spacing: .06em;
          width: fit-content;
        }
        .adm-status--green { background: rgba(16,185,129,.12); color: #0f9d70; }
        .adm-status--amber { background: rgba(245,158,11,.14); color: #b45309; }
        .adm-status--red   { background: rgba(239,68,68,.12);  color: #dc2626; }
        .adm-status--slate { background: rgba(100,116,139,.12);color: #64748b; }

        /* Progress */
        .adm-progress { display: flex; align-items: center; gap: 10px; }
        .adm-progress-track {
          width: 100px; height: 7px;
          border-radius: 99px; overflow: hidden;
          background: #ece8e4; flex-shrink: 0;
        }
        .adm-progress-fill {
          height: 100%; border-radius: inherit;
          background: linear-gradient(90deg, #e8915a, #c2652a);
        }
        .adm-progress > span { color: #18181b; font-size: .76rem; font-weight: 800; }

        /* Action buttons */
        .adm-action-btn {
          width: 28px; height: 28px;
          border-radius: 7px; border: 1px solid rgba(0,0,0,0.08);
          background: #faf8f5; color: #6b7280;
          display: inline-flex; align-items: center; justify-content: center;
          cursor: pointer; transition: background .15s, color .15s, border-color .15s;
        }
        .adm-action-btn:hover {
          background: #fff3ec; color: #c2652a; border-color: rgba(194,101,42,.3);
        }
        .adm-action-btn--danger:hover {
          background: #fff0f0; color: #e05252; border-color: rgba(220,38,38,.2);
        }

        /* Responsive */
        @media (max-width: 1100px) {
          .adm-stats-grid   { grid-template-columns: repeat(2, 1fr); }
          .adm-recent-grid  { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .adm-root         { padding: 16px; }
          .adm-stats-grid   { grid-template-columns: 1fr; }
          .adm-recent-grid  { grid-template-columns: 1fr; }
          .adm-header       { padding: 18px; border-radius: 16px; }
        }
      `}</style>

    </AdminLayout>
  )
}