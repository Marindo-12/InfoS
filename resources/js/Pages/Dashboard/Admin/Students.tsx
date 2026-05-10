import AdminLayout from '@/Layouts/AdminLayout'
import { Head, router, usePage } from '@inertiajs/react'
import { FormEvent, useMemo, useState } from 'react'

/* ═══════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════ */
type Stat = {
  label: string
  value: string
  sub: string
  accent: 'orange' | 'blue' | 'green' | 'slate'
}

type RecentStudent = {
  id: number
  name: string
  email: string
  phone: string | null
  city: string | null
  status: string
  avatarUrl: string | null
  course: string
  joinedAt: string
  progress: number
}

type StudentRow = {
  id: number
  name: string
  email: string
  phone: string | null
  address: string | null
  city: string | null
  status: string
  joinedAt: string
  avatarUrl: string | null
  course: string
  progress: number
  paymentStatus: 'paye' | 'partiel' | 'retard' | 'non defini'
  lastSeen: string
  enrollmentsCount: number
}

type PageProps = {
  auth: { user: { id: number; name: string; email: string } }
  stats: Stat[]
  recentStudents: RecentStudent[]
  students: StudentRow[]
  flash?: { success?: string }
  errors?: Record<string, string>
}

type StudentForm = {
  name: string
  email: string
  phone: string
  address: string
  city: string
  status: 'active' | 'inactive'
}

/* ═══════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════ */
const PAGE_SIZE = 8

const coverImages = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCwwJL7H4YMdsSWXFxIEl5efJNCGP-2z-yTOamMi3CzKlbJrMXhoJLXgPWfDvrGuOTlhjnr7Xmt-ymBDq6qVdvM-m0W-hCaEyv7jRo2YXG1qV3e35Biv2i40DS604kHZ3JkQFhlkVdV3why9Owcv90nw__U7ju1efBggxiAMtLPlsKHmLFR2xs8tf-VN4pigmH_GU5XPxAwQY2T8c6gKWlHMsmgp_A7R55d6dP0uLI2WzLdzaIrdkp_qXTY56rUzNV1TOjwQ3Q15Grv',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC09Wyi_pk_kaM7mr_TUsw-A2QhDlQSKh5J8syuQyof-PRqy__kXdPR5UGMpvKL76_WmruqRkYGlaHtQLWlcCkvzLKXCeBBgMZSVWTDa_SpNpMri1LRTk2W-ZQxONByKEHIQNWD2MJelQG6L2zySlu1332kQpoy1-TphWen1YSa7ZcvZGVJYhRT_rD9LZnlKFM8pkjrVF2AIfjzFRXBmVF4ccq2gglc15coWvnopjn4zPEetUsv7SSrH0rav-HQwT1pCHJJ-oAZW54i',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAjchjoJjLlCv5GR-yZgM-H_vxEsGgRZNguoUCAVl6w1kE03ITgnGsqk8njvxlCcm1TtRs3qf6GG3TrTvikfeEzLiKbIlCdKA9545dkCO15c0bmjxEsSPwH1Cw_t6wzwQUHCYQZeXoKRyGaQ9rK2UQaNS0YwWckUuAp48BbsCA3TWeXYF0VsuNdpRXWbvmaYtth3IMP2JFBwpSY2umI0FIco00mrctTE-q55Hhhh859Qdk7deFD-foqFGs-WaEAWHk_-eaRLBxoL9Mc',
]

const emptyForm: StudentForm = {
  name: '', email: '', phone: '', address: '', city: '', status: 'active',
}

/* ═══════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════ */
function initials(name: string) {
  return name.split(' ').filter(Boolean).map(p => p[0]).slice(0, 2).join('').toUpperCase()
}

function paymentMeta(status: StudentRow['paymentStatus']) {
  if (status === 'paye')    return { label: 'Payé',       cls: 'stu-pay stu-pay--green' }
  if (status === 'partiel') return { label: 'Partiel',    cls: 'stu-pay stu-pay--amber' }
  if (status === 'retard')  return { label: 'Retard',     cls: 'stu-pay stu-pay--red'   }
  return                           { label: 'Non défini', cls: 'stu-pay stu-pay--slate' }
}

function formFromStudent(student: StudentRow): StudentForm {
  return {
    name:    student.name,
    email:   student.email,
    phone:   student.phone    ?? '',
    address: student.address  ?? '',
    city:    student.city     ?? '',
    status:  student.status === 'inactive' ? 'inactive' : 'active',
  }
}

function avatarFor(student: Pick<StudentRow | RecentStudent, 'avatarUrl' | 'name'>) {
  return student.avatarUrl
    ? <img src={student.avatarUrl} alt={student.name} />
    : initials(student.name)
}

function csvEscape(value: string | number | null | undefined) {
  return `"${String(value ?? '').replaceAll('"', '""')}"`
}

/* ═══════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════ */
export default function Students() {
  const { props } = usePage<PageProps>()
  const { stats, recentStudents, students, flash, errors = {} } = props

  const [search,      setSearch]      = useState('')
  const [payFilter,   setPayFilter]   = useState<'all' | StudentRow['paymentStatus']>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [viewing,     setViewing]     = useState<StudentRow | null>(null)
  const [editing,     setEditing]     = useState<StudentRow | null>(null)
  const [deleting,    setDeleting]    = useState<StudentRow | null>(null)
  const [showCreate,  setShowCreate]  = useState(false)
  const [form,        setForm]        = useState<StudentForm>(emptyForm)
  const [processing,  setProcessing]  = useState(false)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return students.filter(s => {
      const matchQ = !q || [s.name, s.email, s.phone ?? '', s.course, s.city ?? '']
        .some(v => v.toLowerCase().includes(q))
      const matchP = payFilter === 'all' || s.paymentStatus === payFilter
      return matchQ && matchP
    })
  }, [students, search, payFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage   = Math.min(currentPage, totalPages)
  const paginated  = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
  const hasFilters = search !== '' || payFilter !== 'all'

  /* ── Pagination pages array (max 5 visible) ── */
  const allPages = Array.from({ length: totalPages }, (_, i) => i + 1)
  const visiblePages = allPages.filter(p => {
    if (totalPages <= 5) return true
    if (p === 1 || p === totalPages) return true
    return Math.abs(p - safePage) <= 1
  })

  const openCreate = () => { setForm(emptyForm); setShowCreate(true) }
  const openEdit   = (s: StudentRow) => { setForm(formFromStudent(s)); setEditing(s) }
  const closeForm  = () => { setShowCreate(false); setEditing(null); setForm(emptyForm) }

  const pf = (fn: () => void) => { fn(); setCurrentPage(1) }

  const submitForm = (e: FormEvent) => {
    e.preventDefault()
    setProcessing(true)
    const opts = { preserveScroll: true, onFinish: () => setProcessing(false), onSuccess: closeForm }
    if (editing) { router.patch(route('admin.students.update', editing.id), form, opts); return }
    router.post(route('admin.students.store'), form, opts)
  }

  const destroyStudent = () => {
    if (!deleting) return
    setProcessing(true)
    router.delete(route('admin.students.destroy', deleting.id), {
      preserveScroll: true,
      onFinish: () => setProcessing(false),
      onSuccess: () => setDeleting(null),
    })
  }

  const resetFilters = () => pf(() => { setSearch(''); setPayFilter('all') })

  const exportCsv = () => {
    const header = ['Nom','Email','Téléphone','Ville','Formation','Paiement','Progression','Parcours','Statut']
    const rows = filtered.map(s => [
      s.name, s.email, s.phone ?? '', s.city ?? '', s.course,
      paymentMeta(s.paymentStatus).label, `${s.progress}%`,
      s.enrollmentsCount, s.status,
    ])
    const csv = [header, ...rows].map(r => r.map(csvEscape).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = 'etudiants.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <AdminLayout
      header={
        <div style={{ display:'flex', alignItems:'center', gap:8, fontFamily:'Manrope,sans-serif' }}>
          <span style={{ fontSize:'.8rem', color:'#b0a49a' }}>Administration</span>
          <span style={{ color:'#b0a49a', fontSize:'.8rem' }}>/</span>
          <span style={{ fontSize:'.82rem', fontWeight:700, color:'#1a1612' }}>Étudiants</span>
        </div>
      }
    >
      <Head title="Gestion des étudiants" />

      <main className="stu-root">

        {/* ── Header ── */}
        <header className="stu-top">
          <div>
            <h1>Gestion des Étudiants</h1>
            <p>Portail administratif pour le suivi des inscriptions, des paiements et des progressions.</p>
          </div>
          <button className="stu-primary" type="button" onClick={openCreate}>
            <span className="material-symbols-outlined">add</span>
            Nouvel Étudiant
          </button>
        </header>

        {flash?.success && <div className="stu-flash">{flash.success}</div>}

        {/* ── Stats ── */}
        <section className="stu-stats">
          {stats.map(stat => (
            <article className={`stu-stat stu-stat--${stat.accent}`} key={stat.label}>
              <div>
                <span className="material-symbols-outlined">
                  {stat.accent === 'green' ? 'payments' : stat.accent === 'blue' ? 'person_add' : stat.accent === 'slate' ? 'auto_stories' : 'group'}
                </span>
                <small>{stat.sub}</small>
              </div>
              <p>{stat.label}</p>
              <strong>{stat.value}</strong>
            </article>
          ))}
        </section>

        {/* ── Featured students ── */}
        <section className="stu-featured">
          <div className="stu-section-title">
            <h2>Inscriptions Vedettes</h2>
            <span />
          </div>
          <div className="stu-featured-grid">
            {recentStudents.slice(0, 3).map((student, index) => (
              <article className="stu-card" key={student.id}>
                <div className="stu-card-media">
                  <img src={coverImages[index % coverImages.length]} alt="" />
                  <b>{index === 0 ? 'Récent' : student.status === 'active' ? 'En cours' : 'Inactif'}</b>
                </div>
                <div className="stu-card-body">
                  <div className="stu-card-head">
                    <div className="stu-avatar">{avatarFor(student)}</div>
                    <div>
                      <h3>{student.name}</h3>
                      <p>Inscrit le {student.joinedAt}</p>
                    </div>
                  </div>
                  <div className="stu-mini-row">
                    <span>Formation</span>
                    <strong>{student.course}</strong>
                  </div>
                  <div className="stu-progress">
                    <i><em style={{ width: `${student.progress}%` }} /></i>
                    <span>{student.progress}%</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── Table ── */}
        <section className="stu-table-panel">
          <div className="stu-table-head">
            <div>
              <h2>Liste des Étudiants</h2>
              <p>
                {filtered.length} résultat{filtered.length > 1 ? 's' : ''}
                {hasFilters ? ` sur ${students.length}` : ''}
              </p>
            </div>
            <div className="stu-tools">
              <label className="stu-search">
                <span className="material-symbols-outlined">search</span>
                <input
                  value={search}
                  onChange={e => pf(() => setSearch(e.target.value))}
                  placeholder="Rechercher un étudiant…"
                />
              </label>
              <select
                value={payFilter}
                onChange={e => pf(() => setPayFilter(e.target.value as any))}
                aria-label="Filtrer par paiement"
              >
                <option value="all">Tous paiements</option>
                <option value="paye">Payé</option>
                <option value="partiel">Partiel</option>
                <option value="retard">Retard</option>
                <option value="non defini">Non défini</option>
              </select>
              {hasFilters && (
                <button type="button" className="stu-ghost" onClick={resetFilters}>Reset</button>
              )}
              <button type="button" className="stu-ghost" onClick={exportCsv}>Exporter CSV</button>
            </div>
          </div>

          <div className="stu-table-wrap">
            {paginated.length === 0 ? (
              <div className="stu-empty">
                <p>Aucun étudiant ne correspond aux filtres.</p>
                <button type="button" onClick={resetFilters}>Voir tous les étudiants</button>
              </div>
            ) : (
              <table className="stu-table">
                <thead>
                  <tr>
                    <th>Étudiant</th>
                    <th>Formation</th>
                    <th>Statut paiement</th>
                    <th>Progression</th>
                    <th>Parcours</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((student, rowIdx) => {
                    const pay    = paymentMeta(student.paymentStatus)
                    const rowBg  = rowIdx % 2 === 0 ? '#ffffff' : '#f6f4f0'
                    return (
                      <tr key={student.id} style={{ background: rowBg }}>
                        <td data-label="Étudiant">
                          <div className="stu-student-cell">
                            <div className="stu-avatar stu-avatar--sm">{avatarFor(student)}</div>
                            <div>
                              <strong>{student.name}</strong>
                              <span>{student.email}</span>
                              {student.phone && <small>{student.phone}</small>}
                            </div>
                          </div>
                        </td>
                        <td data-label="Formation">
                          <span className="stu-course">{student.course}</span>
                        </td>
                        <td data-label="Paiement">
                          <span className={pay.cls}>{pay.label}</span>
                        </td>
                        <td data-label="Progression">
                          <div className="stu-progress stu-progress--table">
                            <i><em style={{ width: `${student.progress}%` }} /></i>
                            <span>{student.progress}%</span>
                          </div>
                        </td>
                        <td data-label="Parcours">
                          <b className="stu-count">{student.enrollmentsCount}</b>
                        </td>
                        <td data-label="Actions">
                          <div className="stu-actions">
                            <button type="button" title="Voir le profil" onClick={() => setViewing(student)}>
                              <span className="material-symbols-outlined">visibility</span>
                            </button>
                            <button type="button" title="Modifier" onClick={() => openEdit(student)}>
                              <span className="material-symbols-outlined">edit</span>
                            </button>
                            <button type="button" title="Supprimer" className="stu-danger" onClick={() => setDeleting(student)}>
                              <span className="material-symbols-outlined">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* ── Pagination ── */}
          <footer className="stu-pagination">
            <p>
              {filtered.length === 0
                ? '0 résultat'
                : `${(safePage - 1) * PAGE_SIZE + 1}–${Math.min(safePage * PAGE_SIZE, filtered.length)} sur ${filtered.length} étudiant${filtered.length > 1 ? 's' : ''}`}
            </p>
            <div>
              <button
                type="button"
                disabled={safePage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                aria-label="Page précédente"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>

              {visiblePages.map((p, i, arr) => (
                <>
                  {i > 0 && arr[i - 1] !== p - 1 && (
                    <span key={`ell-${p}`} className="stu-page-ellipsis">…</span>
                  )}
                  <button
                    key={p}
                    type="button"
                    className={p === safePage ? 'stu-page-active' : ''}
                    onClick={() => setCurrentPage(p)}
                    aria-current={p === safePage ? 'page' : undefined}
                  >
                    {p}
                  </button>
                </>
              ))}

              <button
                type="button"
                disabled={safePage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                aria-label="Page suivante"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
            <p style={{ color: '#9a9088', fontSize: '.68rem' }}>
              {PAGE_SIZE} par page · {totalPages} page{totalPages > 1 ? 's' : ''}
            </p>
          </footer>
        </section>
      </main>

      {/* ════════════════════════════════════════
          MODAL — CRÉER / MODIFIER
      ════════════════════════════════════════ */}
      {(showCreate || editing) && (
        <div className="stu-modal-backdrop" role="dialog" aria-modal="true" aria-label={editing ? 'Modifier étudiant' : 'Nouvel étudiant'}>
          <form className="stu-modal" onSubmit={submitForm} noValidate>

            <div className="stu-modal-head">
              <div>
                <p className="stu-modal-kicker">{editing ? 'Modification du dossier' : 'Nouveau dossier'}</p>
                <h2>{editing ? 'Modifier un étudiant' : 'Ajouter un étudiant'}</h2>
              </div>
              <button type="button" onClick={closeForm} aria-label="Fermer">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="stu-form-grid">
              <Field label="Nom complet" error={errors.name} required>
                <input
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Ex : Karim Alaoui"
                  required
                />
              </Field>

              <Field label="Adresse email" error={errors.email} required>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="email@exemple.com"
                  required
                />
              </Field>

              <Field label="Téléphone" error={errors.phone}>
                <input
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="+212 6XX XXX XXX"
                />
              </Field>

              <Field label="Ville" error={errors.city}>
                <input
                  value={form.city}
                  onChange={e => setForm({ ...form, city: e.target.value })}
                  placeholder="Ex : Tanger"
                />
              </Field>

              <Field label="Adresse complète" error={errors.address} wide>
                <input
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                  placeholder="Rue, quartier, code postal…"
                />
              </Field>

              <Field label="Statut du compte" error={errors.status}>
                <select
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value as StudentForm['status'] })}
                >
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                </select>
              </Field>
            </div>

            <div className="stu-modal-actions">
              <button type="button" className="stu-ghost" onClick={closeForm}>Annuler</button>
              <button type="submit" className="stu-primary" disabled={processing}>
                {processing
                  ? <><span className="stu-spinner" /> Traitement…</>
                  : editing ? 'Enregistrer les modifications' : 'Créer l\'étudiant'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ════════════════════════════════════════
          MODAL — PROFIL
      ════════════════════════════════════════ */}
      {viewing && (
        <div className="stu-modal-backdrop" role="dialog" aria-modal="true" aria-label="Profil étudiant">
          <div className="stu-modal stu-profile-modal">

            <div className="stu-modal-head">
              <div>
                <p className="stu-modal-kicker">Dossier étudiant</p>
                <h2>Profil complet</h2>
              </div>
              <button type="button" onClick={() => setViewing(null)} aria-label="Fermer">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="stu-profile">
              <div className="stu-avatar stu-avatar--lg">{avatarFor(viewing)}</div>
              <div>
                <h3>{viewing.name}</h3>
                <p>{viewing.email}</p>
                <div style={{ marginTop: 6 }}>
                  <span className={paymentMeta(viewing.paymentStatus).cls}>
                    {paymentMeta(viewing.paymentStatus).label}
                  </span>
                </div>
              </div>
            </div>

            <div className="stu-detail-grid">
              <Detail label="Téléphone"        value={viewing.phone     ?? 'Non renseigné'  } />
              <Detail label="Ville"             value={viewing.city      ?? 'Non renseignée' } />
              <Detail label="Formation"         value={viewing.course                        } />
              <Detail label="Date d'inscription" value={viewing.joinedAt                    } />
              <Detail label="Dernière activité" value={viewing.lastSeen                      } />
              <Detail label="Adresse"           value={viewing.address   ?? 'Non renseignée' } />
            </div>

            {/* Progress */}
            <div style={{ padding: '0 26px 20px' }}>
              <p className="stu-detail-label">Progression de la formation</p>
              <div className="stu-progress" style={{ marginTop: 8 }}>
                <i style={{ flex: 1 }}><em style={{ width: `${viewing.progress}%` }} /></i>
                <span>{viewing.progress}%</span>
              </div>
            </div>

            <div className="stu-modal-actions">
              <button type="button" className="stu-ghost" onClick={() => setViewing(null)}>Fermer</button>
              <button
                type="button"
                className="stu-primary"
                onClick={() => { setViewing(null); openEdit(viewing) }}
              >
                <span className="material-symbols-outlined">edit</span>
                Modifier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════
          MODAL — SUPPRESSION
      ════════════════════════════════════════ */}
      {deleting && (
        <div className="stu-modal-backdrop" role="dialog" aria-modal="true" aria-label="Confirmer la suppression">
          <div className="stu-modal stu-confirm">

            <div className="stu-modal-head stu-modal-head--danger">
              <div>
                <p className="stu-modal-kicker stu-modal-kicker--danger">Action irréversible</p>
                <h2>Supprimer l'étudiant</h2>
              </div>
              <button type="button" onClick={() => setDeleting(null)} aria-label="Annuler">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="stu-confirm-body">
              <div className="stu-confirm-icon">
                <span className="material-symbols-outlined">warning</span>
              </div>
              <p>
                Vous êtes sur le point de supprimer définitivement le compte de{' '}
                <strong>{deleting.name}</strong>. Cette action supprimera toutes ses données,
                inscriptions et historique de paiement. Elle est <strong>irréversible</strong>.
              </p>
            </div>

            <div className="stu-modal-actions">
              <button type="button" className="stu-ghost" onClick={() => setDeleting(null)}>
                Annuler
              </button>
              <button
                type="button"
                className="stu-delete-btn"
                disabled={processing}
                onClick={destroyStudent}
              >
                {processing
                  ? <><span className="stu-spinner stu-spinner--white" /> Suppression…</>
                  : <><span className="material-symbols-outlined">delete</span> Supprimer définitivement</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          STYLES
      ═══════════════════════════════════════════════════════════ */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;600;700&family=Manrope:wght@400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');
        .material-symbols-outlined {
          font-family: 'Material Symbols Outlined';
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          line-height: 1; vertical-align: middle;
        }

        /* ── Root ── */
        .stu-root {
          --bg:       #faf5ee;
          --surface:  #fff;
          --line:     #d8d0c8;
          --line-s:   rgba(216,208,200,.55);
          --text:     #3a302a;
          --muted:    #605850;
          --primary:  #c2652a;
          --soft:     #fbe8d8;

          /* Form tokens */
          --fi-bg:    #ffffff;
          --fi-bd:    #d8d0c8;
          --fi-focus: #c2652a;
          --fi-r:     10px;
          --fi-h:     44px;
          --fi-lbl:   #78716c;
          --fi-text:  #3a302a;
          --fi-ph:    #b8aea8;
          --fi-err:   #c0392b;

          min-height: 100%;
          padding: 42px 32px 56px;
          background: var(--bg);
          color: var(--text);
          font-family: 'Manrope', sans-serif;
        }
        .stu-root *, .stu-root *::before, .stu-root *::after { box-sizing: border-box; }

        /* ── Page header ── */
        .stu-top { display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; margin-bottom: 30px; }
        .stu-top h1 { margin: 0; font-family: 'EB Garamond', serif; font-size: clamp(2.2rem, 5vw, 3.8rem); line-height: .98; }
        .stu-top p  { max-width: 640px; margin: 10px 0 0; color: var(--muted); line-height: 1.75; }

        /* ── Buttons ── */
        .stu-primary, .stu-delete-btn, .stu-ghost {
          min-height: 42px;
          display: inline-flex; align-items: center; justify-content: center; gap: 7px;
          border-radius: 8px; padding: 0 16px;
          font-family: 'Manrope', sans-serif; font-weight: 800; font-size: .82rem;
          cursor: pointer; transition: .16s; border: none;
          white-space: nowrap;
        }
        .stu-primary {
          background: var(--primary); color: #fff;
          box-shadow: 0 8px 20px rgba(194,101,42,.2);
        }
        .stu-primary:hover:not(:disabled) { opacity: .9; transform: translateY(-1px); }
        .stu-primary:disabled, .stu-delete-btn:disabled { opacity: .55; cursor: not-allowed; transform: none; }
        .stu-ghost {
          border: 1px solid var(--line-s); background: #fff; color: var(--muted);
          text-transform: uppercase; letter-spacing: .08em; font-size: .68rem;
        }
        .stu-ghost:hover { background: #fff7f2; color: var(--primary); border-color: rgba(194,101,42,.28); }
        .stu-delete-btn {
          background: #c0392b; color: #fff;
          box-shadow: 0 4px 14px rgba(192,57,43,.25);
        }
        .stu-delete-btn:hover:not(:disabled) { background: #a93226; }

        /* ── Flash ── */
        .stu-flash { margin-bottom: 18px; padding: 12px 14px; border: 1px solid #bbf7d0; background: #f0fdf4; color: #047857; border-radius: 8px; font-weight: 800; font-size: .82rem; }

        /* ── Stats ── */
        .stu-stats { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 18px; margin-bottom: 34px; }
        .stu-stat { border: 1px solid var(--line-s); border-radius: 12px; background: #fff; padding: 24px; }
        .stu-stat div { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 18px; }
        .stu-stat .material-symbols-outlined { padding: 9px; border-radius: 8px; background: var(--soft); color: var(--primary); }
        .stu-stat small { color: #16a34a; background: #f0fdf4; padding: 4px 7px; border-radius: 999px; font-size: .62rem; font-weight: 900; }
        .stu-stat p { margin: 0 0 5px; color: #78716c; font-size: .68rem; font-weight: 900; letter-spacing: .15em; text-transform: uppercase; }
        .stu-stat strong { font-family: 'EB Garamond', serif; font-size: 2.4rem; line-height: 1; font-weight: 600; }

        /* ── Featured cards ── */
        .stu-featured { margin-bottom: 36px; }
        .stu-section-title { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
        .stu-section-title h2 { margin: 0; font-family: 'EB Garamond', serif; font-size: 2rem; font-weight: 600; }
        .stu-section-title span { height: 1px; flex: 1; background: var(--line-s); }
        .stu-featured-grid { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 24px; }
        .stu-card { overflow: hidden; border: 1px solid var(--line-s); border-radius: 12px; background: #fff; }
        .stu-card-media { position: relative; height: 190px; overflow: hidden; }
        .stu-card-media img { width: 100%; height: 100%; object-fit: cover; transition: transform .6s; }
        .stu-card:hover .stu-card-media img { transform: scale(1.05); }
        .stu-card-media b { position: absolute; right: 14px; top: 14px; padding: 6px 10px; border-radius: 999px; background: rgba(255,255,255,.9); color: var(--primary); font-size: .58rem; font-weight: 900; letter-spacing: .12em; text-transform: uppercase; }
        .stu-card-body { padding: 20px; }
        .stu-card-head { display: flex; align-items: center; gap: 13px; }
        .stu-card h3 { margin: 0; font-weight: 900; color: var(--text); }
        .stu-card p  { margin: 3px 0 0; color: #8b8178; font-size: .76rem; }
        .stu-avatar { width: 48px; height: 48px; border-radius: 999px; overflow: hidden; display: flex; align-items: center; justify-content: center; flex-shrink: 0; background: linear-gradient(135deg,#c2652a,#e08850); color: #fff; font-weight: 900; }
        .stu-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .stu-avatar--sm { width: 40px; height: 40px; font-size: .72rem; }
        .stu-avatar--lg { width: 72px; height: 72px; font-size: 1rem; }
        .stu-mini-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 18px; color: #8b8178; font-size: .82rem; }
        .stu-mini-row strong, .stu-course { color: var(--text); font-weight: 800; }
        .stu-progress { display: flex; align-items: center; gap: 10px; margin-top: 12px; }
        .stu-progress i { display: block; width: 100%; height: 7px; border-radius: 999px; overflow: hidden; background: #ece6dc; }
        .stu-progress em { display: block; height: 100%; border-radius: inherit; background: var(--primary); }
        .stu-progress span { color: var(--text); font-size: .74rem; font-weight: 900; white-space: nowrap; }

        /* ── Table panel ── */
        .stu-table-panel { overflow: hidden; border: 1px solid var(--line-s); border-radius: 16px; background: #fff; }
        .stu-table-head { display: flex; align-items: center; justify-content: space-between; gap: 18px; padding: 24px; border-bottom: 1px solid var(--line-s); flex-wrap: wrap; background: #faf8f5; }
        .stu-table-head h2 { margin: 0; font-family: 'EB Garamond', serif; font-size: 2rem; font-weight: 600; color: var(--text); }
        .stu-table-head p { margin: 4px 0 0; color: #9a9088; font-size: .68rem; font-weight: 900; letter-spacing: .14em; text-transform: uppercase; }
        .stu-tools { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .stu-search { position: relative; display: flex; align-items: center; }
        .stu-search .material-symbols-outlined { position: absolute; left: 10px; color: #9a9088; font-size: 18px; pointer-events: none; }
        .stu-search input { height: 40px; width: 260px; padding: 0 12px 0 35px; border: 1px solid var(--line-s); border-radius: 8px; background: #fff; color: var(--text); font-family: 'Manrope', sans-serif; font-size: .82rem; outline: none; }
        .stu-search input:focus { border-color: rgba(194,101,42,.5); box-shadow: 0 0 0 3px rgba(194,101,42,.1); }
        .stu-tools select { height: 40px; padding: 0 12px; border: 1px solid var(--line-s); border-radius: 8px; background: #fff; color: var(--text); font-family: 'Manrope', sans-serif; font-size: .82rem; outline: none; cursor: pointer; }
        .stu-tools select:focus { border-color: rgba(194,101,42,.5); }

        /* ── Table ── */
        .stu-table-wrap { overflow-x: auto; }
        .stu-table { width: 100%; min-width: 920px; border-collapse: collapse; text-align: left; }
        .stu-table th { padding: 14px 22px; background: #faf8f5; color: #9a9088; font-size: .65rem; font-weight: 900; letter-spacing: .15em; text-transform: uppercase; border-bottom: 1px solid var(--line-s); }
        .stu-table td { padding: 16px 22px; border-bottom: 1px solid #f0ede8; vertical-align: middle; font-size: .86rem; }
        .stu-table tbody tr:hover td { background: #fffaf6 !important; }
        .stu-table tbody tr:last-child td { border-bottom: none; }
        .stu-student-cell { display: flex; align-items: center; gap: 12px; }
        .stu-student-cell strong { display: block; font-weight: 900; color: var(--text); }
        .stu-student-cell span, .stu-student-cell small { display: block; color: #9a9088; font-size: .73rem; margin-top: 2px; }
        .stu-pay { display: inline-flex; align-items: center; padding: 4px 10px; border-radius: 999px; border: 1px solid; font-size: .6rem; font-weight: 900; letter-spacing: .12em; text-transform: uppercase; white-space: nowrap; }
        .stu-pay--green { background: #f0fdf4; color: #047857; border-color: #bbf7d0; }
        .stu-pay--amber { background: #fffbeb; color: #92400e; border-color: #fde68a; }
        .stu-pay--red   { background: #fff0f0; color: #c0392b; border-color: #fecaca; }
        .stu-pay--slate { background: #f5f5f4; color: #78716c; border-color: #e7e5e4; }
        .stu-progress--table { margin: 0; max-width: 160px; }
        .stu-count { width: 32px; height: 32px; display: inline-flex; align-items: center; justify-content: center; border-radius: 8px; background: #f5f4f1; border: 1px solid var(--line-s); color: var(--text); font-weight: 900; font-size: .82rem; }
        .stu-actions { display: flex; justify-content: flex-end; gap: 6px; }
        .stu-actions button { width: 32px; height: 32px; border-radius: 8px; border: 1px solid var(--line-s); background: #fff; color: #78716c; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; transition: .15s; }
        .stu-actions button .material-symbols-outlined { font-size: 16px; }
        .stu-actions button:hover { background: #fff3ec; color: var(--primary); border-color: rgba(194,101,42,.32); }
        .stu-actions .stu-danger:hover { background: #fff0f0; color: #c0392b; border-color: #fecaca; }
        .stu-empty { padding: 54px 20px; text-align: center; color: #9a9088; }
        .stu-empty p { margin: 0 0 14px; }
        .stu-empty button { border: 1px solid var(--line-s); background: #fff; border-radius: 8px; padding: 10px 14px; font-weight: 900; cursor: pointer; font-family: 'Manrope', sans-serif; }

        /* ── Pagination ── */
        .stu-pagination { display: flex; align-items: center; justify-content: space-between; gap: 14px; padding: 16px 24px; border-top: 1px solid var(--line-s); background: #faf8f5; flex-wrap: wrap; }
        .stu-pagination p { margin: 0; color: #9a9088; font-size: .72rem; font-weight: 700; }
        .stu-pagination div { display: flex; align-items: center; gap: 3px; }
        .stu-pagination button { min-width: 34px; height: 34px; border-radius: 7px; border: 1px solid var(--line-s); background: #fff; color: var(--text); font-weight: 800; font-size: .8rem; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; transition: .15s; }
        .stu-pagination button:disabled { opacity: .35; cursor: not-allowed; }
        .stu-pagination button:not(:disabled):hover { background: #fff3ec; color: var(--primary); border-color: rgba(194,101,42,.3); }
        .stu-pagination .stu-page-active { background: var(--primary); border-color: var(--primary); color: #fff; }
        .stu-pagination .stu-page-active:hover { background: var(--primary); color: #fff; }
        .stu-page-ellipsis { min-width: 28px; text-align: center; color: #9a9088; pointer-events: none; font-size: .82rem; }

        /* ══════════════════════════════════════════════════════════
           MODALS & FORMS
        ══════════════════════════════════════════════════════════ */

        /* Backdrop */
        .stu-modal-backdrop {
          position: fixed; inset: 0; z-index: 80;
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
          background: rgba(58,48,42,.5);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          animation: stuFadeIn .2s ease both;
        }
        @keyframes stuFadeIn { from { opacity:0; } to { opacity:1; } }

        /* Modal shell */
        .stu-modal {
          width: min(660px, 100%);
          max-height: calc(100dvh - 40px);
          overflow-y: auto;
          background: #ffffff;
          border: 1px solid #e2dbd5;
          border-radius: 18px;
          font-family: 'Manrope', sans-serif;
          box-shadow:
            0 0 0 1px rgba(0,0,0,.04),
            0 8px 28px rgba(58,48,42,.12),
            0 40px 80px rgba(58,48,42,.16);
          animation: stuSlideUp .22s cubic-bezier(.22,1,.36,1) both;
        }
        @keyframes stuSlideUp {
          from { opacity:0; transform: translateY(16px) scale(.97); }
          to   { opacity:1; transform: translateY(0)   scale(1);    }
        }

        /* Modal header */
        .stu-modal-head {
          display: flex; align-items: center; justify-content: space-between; gap: 16px;
          padding: 22px 26px 18px;
          border-bottom: 1px solid #ede8e2;
        }
        .stu-modal-head--danger { border-bottom-color: rgba(192,57,43,.2); }
        .stu-modal-kicker {
          margin: 0 0 4px;
          font-size: .62rem; font-weight: 900;
          letter-spacing: .15em; text-transform: uppercase;
          color: #9a9088;
        }
        .stu-modal-kicker--danger { color: #c0392b; }
        .stu-modal-head h2 {
          margin: 0;
          font-family: 'EB Garamond', serif;
          font-size: 1.65rem; font-weight: 600; color: #3a302a; line-height: 1.1;
        }
        .stu-modal-head button {
          width: 34px; height: 34px; flex-shrink: 0;
          border-radius: 8px; border: 1px solid #ede8e2;
          background: #faf8f5; color: #9a9088;
          display: inline-flex; align-items: center; justify-content: center;
          cursor: pointer; transition: .15s;
        }
        .stu-modal-head button:hover {
          background: #fff3ec; color: #c2652a; border-color: rgba(194,101,42,.3);
        }

        /* Form grid */
        .stu-form-grid {
          display: grid; grid-template-columns: repeat(2, minmax(0,1fr));
          gap: 18px; padding: 22px 26px;
        }

        /* Field wrapper */
        .stu-field { display: flex; flex-direction: column; }
        .stu-field--wide { grid-column: 1 / -1; }
        .stu-field--error .stu-field-control input,
        .stu-field--error .stu-field-control select {
          border-color: #c0392b;
          background: #fff8f8;
          box-shadow: 0 0 0 3px rgba(192,57,43,.08);
        }

        /* Label */
        .stu-field > label {
          display: flex; align-items: center; gap: 3px;
          margin-bottom: 7px;
          color: #78716c;
          font-size: .67rem; font-weight: 900;
          letter-spacing: .1em; text-transform: uppercase;
          user-select: none;
        }
        .stu-field-required { color: #c0392b; font-size: .8rem; line-height: 1; }

        /* Field control — wraps input/select */
        .stu-field-control { position: relative; }

        /* Inputs & selects inside modal */
        .stu-field-control input,
        .stu-field-control select {
          width: 100%; height: 44px;
          padding: 0 14px;
          font-family: 'Manrope', sans-serif; font-size: .9rem; font-weight: 500;
          color: #3a302a;
          background: #ffffff;
          border: 1.5px solid #d8d0c8;
          border-radius: 10px;
          outline: none;
          appearance: none; -webkit-appearance: none;
          transition: border-color .18s, box-shadow .18s, background .18s;
        }
        .stu-field-control select {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239a9088' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
          background-repeat: no-repeat; background-position: right 13px center;
          padding-right: 36px;
        }
        .stu-field-control input::placeholder { color: #b8aea8; }
        .stu-field-control input:hover,
        .stu-field-control select:hover { border-color: #b5a89e; }
        .stu-field-control input:focus,
        .stu-field-control select:focus {
          border-color: #c2652a;
          box-shadow: 0 0 0 3px rgba(194,101,42,.12);
          background: #fff;
        }

        /* Error message */
        .stu-error {
          display: flex; align-items: center; gap: 5px;
          margin-top: 5px;
          color: #c0392b; font-size: .72rem; font-weight: 700;
        }

        /* Modal actions */
        .stu-modal-actions {
          display: flex; align-items: center; justify-content: flex-end; gap: 10px;
          padding: 18px 26px 22px;
          border-top: 1px solid #ede8e2;
          flex-wrap: wrap;
        }

        /* Confirm modal specifics */
        .stu-confirm { max-width: 480px; }
        .stu-confirm-body {
          display: flex; align-items: flex-start; gap: 16px;
          padding: 20px 26px;
        }
        .stu-confirm-icon {
          width: 42px; height: 42px; flex-shrink: 0;
          border-radius: 10px; background: #fff0f0;
          display: flex; align-items: center; justify-content: center;
          color: #c0392b;
        }
        .stu-confirm-icon .material-symbols-outlined { font-size: 22px; }
        .stu-confirm-body p {
          margin: 0; color: #605850; line-height: 1.75; font-size: .92rem;
        }
        .stu-confirm-body strong { color: #3a302a; }

        /* Profile modal */
        .stu-profile-modal .stu-modal-head { border-bottom: none; padding-bottom: 0; }
        .stu-profile {
          display: flex; align-items: center; gap: 16px;
          padding: 18px 26px 14px;
        }
        .stu-profile h3 { margin: 0; font-size: 1.2rem; font-weight: 900; color: #3a302a; }
        .stu-profile p  { margin: 3px 0 0; color: #9a9088; font-size: .82rem; }

        .stu-detail-label {
          margin: 0; color: #9a9088;
          font-size: .65rem; font-weight: 900;
          letter-spacing: .12em; text-transform: uppercase;
        }

        /* Detail grid */
        .stu-detail-grid { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 10px; padding: 4px 26px 20px; }
        .stu-detail {
          padding: 12px 14px;
          border: 1.5px solid #ede8e2; border-radius: 10px;
          background: #faf8f5;
          transition: border-color .15s;
        }
        .stu-detail:hover { border-color: rgba(194,101,42,.3); }
        .stu-detail span  { display: block; color: #9a9088; font-size: .62rem; font-weight: 900; letter-spacing: .12em; text-transform: uppercase; margin-bottom: 4px; }
        .stu-detail strong { display: block; color: #3a302a; font-size: .88rem; font-weight: 600; overflow-wrap: anywhere; }

        /* Spinner */
        .stu-spinner {
          display: inline-block; width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: stuSpin .7s linear infinite;
        }
        .stu-spinner--white { border-top-color: #fff; }
        @keyframes stuSpin { to { transform: rotate(360deg); } }

        /* ══════════════════════════════════════════════════════════
           DARK MODE
        ══════════════════════════════════════════════════════════ */
        .al-root.al-dark .stu-root {
          --bg:      #191512;
          --surface: #241f1a;
          --line:    #3b3028;
          --line-s:  rgba(210,194,181,.16);
          --text:    #f8efe5;
          --muted:   #d5c8bc;
          --primary: #f0a878;
          --soft:    rgba(240,168,120,.14);

          --fi-bg:   #251e17;
          --fi-bd:   rgba(210,194,181,.18);
          --fi-focus:#f0a878;
          --fi-text: #f0e8e0;
          --fi-lbl:  #a09080;
          --fi-ph:   #6b5f55;
          --fi-err:  #f87171;
        }

        /* Dark — general surfaces */
        .al-root.al-dark .stu-stat,
        .al-root.al-dark .stu-card,
        .al-root.al-dark .stu-table-panel,
        .al-root.al-dark .stu-search input,
        .al-root.al-dark .stu-tools select,
        .al-root.al-dark .stu-ghost,
        .al-root.al-dark .stu-actions button,
        .al-root.al-dark .stu-pagination button,
        .al-root.al-dark .stu-empty button { background: #241f1a; color: #d5c8bc; border-color: rgba(210,194,181,.18); }
        .al-root.al-dark .stu-table th,
        .al-root.al-dark .stu-pagination,
        .al-root.al-dark .stu-table-head { background: #1f1a16; }
        .al-root.al-dark .stu-table tbody tr:hover td { background: rgba(240,168,120,.06) !important; }
        .al-root.al-dark .stu-table td { border-bottom-color: rgba(210,194,181,.08); }
        .al-root.al-dark .stu-count { background: #2a221a; border-color: rgba(210,194,181,.16); color: #f0e8e0; }
        .al-root.al-dark .stu-progress i { background: #3b3028; }

        /* Dark — modal backdrop */
        .al-root.al-dark .stu-modal-backdrop { background: rgba(8,5,3,.65); }

        /* Dark — modal shell */
        .al-root.al-dark .stu-modal {
          background: #1e1812;
          border-color: rgba(210,194,181,.12);
          box-shadow: 0 0 0 1px rgba(255,255,255,.04), 0 12px 36px rgba(0,0,0,.5), 0 48px 96px rgba(0,0,0,.55);
        }
        .al-root.al-dark .stu-modal-head { border-bottom-color: rgba(210,194,181,.1); }
        .al-root.al-dark .stu-modal-head h2 { color: #f8efe5; }
        .al-root.al-dark .stu-modal-kicker { color: #786b60; }
        .al-root.al-dark .stu-modal-kicker--danger { color: #f87171; }
        .al-root.al-dark .stu-modal-head button { background: #2a211a; border-color: rgba(210,194,181,.14); color: #a09080; }
        .al-root.al-dark .stu-modal-head button:hover { background: rgba(240,168,120,.12); color: #f0a878; border-color: rgba(240,168,120,.3); }
        .al-root.al-dark .stu-modal-actions { border-top-color: rgba(210,194,181,.1); }

        /* Dark — inputs */
        .al-root.al-dark .stu-field-control input,
        .al-root.al-dark .stu-field-control select {
          background: #251e17; border-color: rgba(210,194,181,.2); color: #f0e8e0;
        }
        .al-root.al-dark .stu-field-control select {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23a09080' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
        }
        .al-root.al-dark .stu-field-control input::placeholder { color: #5e5248; }
        .al-root.al-dark .stu-field-control input:hover,
        .al-root.al-dark .stu-field-control select:hover { border-color: rgba(210,194,181,.35); }
        .al-root.al-dark .stu-field-control input:focus,
        .al-root.al-dark .stu-field-control select:focus {
          border-color: #f0a878;
          box-shadow: 0 0 0 3px rgba(240,168,120,.15);
          background: #2e241c;
        }
        .al-root.al-dark .stu-field--error .stu-field-control input,
        .al-root.al-dark .stu-field--error .stu-field-control select {
          border-color: #f87171; background: rgba(248,113,113,.07);
          box-shadow: 0 0 0 3px rgba(248,113,113,.1);
        }

        /* Dark — labels & errors */
        .al-root.al-dark .stu-field > label { color: #9a8878; }
        .al-root.al-dark .stu-field-required { color: #f87171; }
        .al-root.al-dark .stu-error { color: #f87171; }

        /* Dark — profile & details */
        .al-root.al-dark .stu-profile h3  { color: #f8efe5; }
        .al-root.al-dark .stu-profile p   { color: #9a8878; }
        .al-root.al-dark .stu-detail { background: #241e18; border-color: rgba(210,194,181,.12); }
        .al-root.al-dark .stu-detail:hover { border-color: rgba(240,168,120,.25); }
        .al-root.al-dark .stu-detail span   { color: #9a8878; }
        .al-root.al-dark .stu-detail strong { color: #f0e8e0; }

        /* Dark — confirm */
        .al-root.al-dark .stu-confirm-icon { background: rgba(248,113,113,.12); color: #f87171; }
        .al-root.al-dark .stu-confirm-body p      { color: #c8bdb6; }
        .al-root.al-dark .stu-confirm-body strong  { color: #f8efe5; }

        /* ── Responsive ── */
        @media (max-width: 1120px) {
          .stu-stats { grid-template-columns: repeat(2,minmax(0,1fr)); }
          .stu-featured-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 720px) {
          .stu-root { padding: 24px 14px 38px; }
          .stu-top { align-items: flex-start; flex-direction: column; }
          .stu-primary, .stu-tools, .stu-search, .stu-search input { width: 100%; }
          .stu-stats { grid-template-columns: 1fr; }
          .stu-table-head { padding: 18px; flex-direction: column; align-items: flex-start; }
          .stu-table { min-width: 760px; }
          .stu-form-grid, .stu-detail-grid { grid-template-columns: 1fr; }
          .stu-field--wide { grid-column: auto; }
          .stu-modal-actions > * { flex: 1; }
          .stu-pagination { flex-direction: column; align-items: flex-start; gap: 10px; }
        }
        @media (max-width: 520px) {
          .stu-modal { border-radius: 18px 18px 0 0; align-self: flex-end; }
          .stu-modal-backdrop { align-items: flex-end; padding: 0; }
        }
      `}</style>
    </AdminLayout>
  )
}

/* ═══════════════════════════════════════════════
   SUB-COMPONENTS
═══════════════════════════════════════════════ */
function Field({
  label,
  error,
  wide,
  required,
  children,
}: {
  label:    string
  error?:   string
  wide?:    boolean
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className={`stu-field ${wide ? 'stu-field--wide' : ''} ${error ? 'stu-field--error' : ''}`}>
      <label>
        {label}
        {required && <span className="stu-field-required" aria-hidden="true">*</span>}
      </label>
      <div className="stu-field-control">
        {children}
      </div>
      {error && (
        <span className="stu-error" role="alert">
          <span aria-hidden="true">⚠</span> {error}
        </span>
      )}
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="stu-detail">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}