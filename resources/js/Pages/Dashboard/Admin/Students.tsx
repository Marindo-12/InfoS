import AdminLayout from '@/Layouts/AdminLayout'
import { Head, router, usePage } from '@inertiajs/react'
import { FormEvent, useMemo, useState } from 'react'

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

const PAGE_SIZE = 8

const coverImages = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCwwJL7H4YMdsSWXFxIEl5efJNCGP-2z-yTOamMi3CzKlbJrMXhoJLXgPWfDvrGuOTlhjnr7Xmt-ymBDq6qVdvM-m0W-hCaEyv7jRo2YXG1qV3e35Biv2i40DS604kHZ3JkQFhlkVdV3why9Owcv90nw__U7ju1efBggxiAMtLPlsKHmLFR2xs8tf-VN4pigmH_GU5XPxAwQY2T8c6gKWlHMsmgp_A7R55d6dP0uLI2WzLdzaIrdkp_qXTY56rUzNV1TOjwQ3Q15Grv',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC09Wyi_pk_kaM7mr_TUsw-A2QhDlQSKh5J8syuQyof-PRqy__kXdPR5UGMpvKL76_WmruqRkYGlaHtQLWlcCkvzLKXCeBBgMZSVWTDa_SpNpMri1LRTk2W-ZQxONByKEHIQNWD2MJelQG6L2zySlu1332kQpoy1-TphWen1YSa7ZcvZGVJYhRT_rD9LZnlKFM8pkjrVF2AIfjzFRXBmVF4ccq2gglc15coWvnopjn4zPEetUsv7SSrH0rav-HQwT1pCHJJ-oAZW54i',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAjchjoJjLlCv5GR-yZgM-H_vxEsGgRZNguoUCAVl6w1kE03ITgnGsqk8njvxlCcm1TtRs3qf6GG3TrTvikfeEzLiKbIlCdKA9545dkCO15c0bmjxEsSPwH1Cw_t6wzwQUHCYQZeXoKRyGaQ9rK2UQaNS0YwWckUuAp48BbsCA3TWeXYF0VsuNdpRXWbvmaYtth3IMP2JFBwpSY2umI0FIco00mrctTE-q55Hhhh859Qdk7deFD-foqFGs-WaEAWHk_-eaRLBxoL9Mc',
]

const emptyForm: StudentForm = {
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  status: 'active',
}

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map(part => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function paymentMeta(status: StudentRow['paymentStatus']) {
  if (status === 'paye') return { label: 'Paye', cls: 'stu-pay stu-pay--green' }
  if (status === 'partiel') return { label: 'Partiel', cls: 'stu-pay stu-pay--amber' }
  if (status === 'retard') return { label: 'Retard', cls: 'stu-pay stu-pay--red' }
  return { label: 'Non defini', cls: 'stu-pay stu-pay--slate' }
}

function formFromStudent(student: StudentRow): StudentForm {
  return {
    name: student.name,
    email: student.email,
    phone: student.phone ?? '',
    address: student.address ?? '',
    city: student.city ?? '',
    status: student.status === 'inactive' ? 'inactive' : 'active',
  }
}

function avatarFor(student: Pick<StudentRow, 'avatarUrl' | 'name'>) {
  return student.avatarUrl
    ? <img src={student.avatarUrl} alt={student.name} />
    : initials(student.name)
}

function csvEscape(value: string | number | null | undefined) {
  return `"${String(value ?? '').replaceAll('"', '""')}"`
}

export default function Students() {
  const { props } = usePage<PageProps>()
  const { stats, recentStudents, students, flash, errors = {} } = props
  const [search, setSearch] = useState('')
  const [paymentFilter, setPaymentFilter] = useState<'all' | StudentRow['paymentStatus']>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [viewing, setViewing] = useState<StudentRow | null>(null)
  const [editing, setEditing] = useState<StudentRow | null>(null)
  const [deleting, setDeleting] = useState<StudentRow | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState<StudentForm>(emptyForm)
  const [processing, setProcessing] = useState(false)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return students.filter(student => {
      const matchesQuery = !q || [student.name, student.email, student.phone ?? '', student.course, student.city ?? '']
        .some(value => value.toLowerCase().includes(q))
      const matchesPayment = paymentFilter === 'all' || student.paymentStatus === paymentFilter
      return matchesQuery && matchesPayment
    })
  }, [students, search, paymentFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(currentPage, totalPages)
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
  const hasFilters = search !== '' || paymentFilter !== 'all'

  const openCreate = () => {
    setForm(emptyForm)
    setShowCreate(true)
  }

  const openEdit = (student: StudentRow) => {
    setForm(formFromStudent(student))
    setEditing(student)
  }

  const closeForm = () => {
    setShowCreate(false)
    setEditing(null)
    setForm(emptyForm)
  }

  const submitForm = (event: FormEvent) => {
    event.preventDefault()
    setProcessing(true)

    const options = {
      preserveScroll: true,
      onFinish: () => setProcessing(false),
      onSuccess: closeForm,
    }

    if (editing) {
      router.patch(route('admin.students.update', editing.id), form, options)
      return
    }

    router.post(route('admin.students.store'), form, options)
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

  const resetFilters = () => {
    setSearch('')
    setPaymentFilter('all')
    setCurrentPage(1)
  }

  const exportCsv = () => {
    const header = ['Nom', 'Email', 'Telephone', 'Ville', 'Formation', 'Paiement', 'Progression', 'Parcours', 'Statut']
    const rows = filtered.map(student => [
      student.name,
      student.email,
      student.phone ?? '',
      student.city ?? '',
      student.course,
      paymentMeta(student.paymentStatus).label,
      `${student.progress}%`,
      student.enrollmentsCount,
      student.status,
    ])
    const csv = [header, ...rows].map(row => row.map(csvEscape).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'etudiants.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <AdminLayout
      header={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Manrope, sans-serif' }}>
          <span style={{ fontSize: '.8rem', color: '#b0a49a' }}>Administration</span>
          <span style={{ color: '#b0a49a', fontSize: '.8rem' }}>/</span>
          <span style={{ fontSize: '.82rem', fontWeight: 700, color: '#1a1612' }}>Etudiants</span>
        </div>
      }
    >
      <Head title="Gestion des etudiants" />

      <main className="stu-root">
        <header className="stu-top">
          <div>
            <h1>Gestion des Etudiants</h1>
            <p>Portail administratif pour le suivi des inscriptions, des paiements et des progressions.</p>
          </div>
          <button className="stu-primary" type="button" onClick={openCreate}>
            <span className="material-symbols-outlined">add</span>
            Nouvel Etudiant
          </button>
        </header>

        {flash?.success && <div className="stu-flash">{flash.success}</div>}

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
                  <b>{index === 0 ? 'Recent' : student.status === 'active' ? 'En cours' : 'Inactif'}</b>
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

        <section className="stu-table-panel">
          <div className="stu-table-head">
            <div>
              <h2>Liste des Etudiants</h2>
              <p>
                {filtered.length} resultat{filtered.length > 1 ? 's' : ''}
                {hasFilters ? ` sur ${students.length}` : ''}
              </p>
            </div>
            <div className="stu-tools">
              <label className="stu-search">
                <span className="material-symbols-outlined">search</span>
                <input
                  value={search}
                  onChange={event => { setSearch(event.target.value); setCurrentPage(1) }}
                  placeholder="Rechercher un etudiant..."
                />
              </label>
              <select
                value={paymentFilter}
                onChange={event => { setPaymentFilter(event.target.value as any); setCurrentPage(1) }}
                aria-label="Filtrer par paiement"
              >
                <option value="all">Tous paiements</option>
                <option value="paye">Paye</option>
                <option value="partiel">Partiel</option>
                <option value="retard">Retard</option>
                <option value="non defini">Non defini</option>
              </select>
              {hasFilters && <button type="button" className="stu-ghost" onClick={resetFilters}>Reset</button>}
              <button type="button" className="stu-ghost" onClick={exportCsv}>Exporter CSV</button>
            </div>
          </div>

          <div className="stu-table-wrap">
            {paginated.length === 0 ? (
              <div className="stu-empty">
                <p>Aucun etudiant ne correspond aux filtres.</p>
                <button type="button" onClick={resetFilters}>Voir tous les etudiants</button>
              </div>
            ) : (
              <table className="stu-table">
                <thead>
                  <tr>
                    <th>Etudiant</th>
                    <th>Formation</th>
                    <th>Statut paiement</th>
                    <th>Progression</th>
                    <th>Parcours</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map(student => {
                    const payment = paymentMeta(student.paymentStatus)
                    return (
                      <tr key={student.id}>
                        <td data-label="Etudiant">
                          <div className="stu-student-cell">
                            <div className="stu-avatar stu-avatar--sm">{avatarFor(student)}</div>
                            <div>
                              <strong>{student.name}</strong>
                              <span>{student.email}</span>
                              {student.phone && <small>{student.phone}</small>}
                            </div>
                          </div>
                        </td>
                        <td data-label="Formation"><span className="stu-course">{student.course}</span></td>
                        <td data-label="Paiement"><span className={payment.cls}>{payment.label}</span></td>
                        <td data-label="Progression">
                          <div className="stu-progress stu-progress--table">
                            <i><em style={{ width: `${student.progress}%` }} /></i>
                            <span>{student.progress}%</span>
                          </div>
                        </td>
                        <td data-label="Parcours"><b className="stu-count">{student.enrollmentsCount}</b></td>
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

          <footer className="stu-pagination">
            <p>
              Affichage de {filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1}-{Math.min(safePage * PAGE_SIZE, filtered.length)}
              {' '}sur {filtered.length} etudiants
            </p>
            <div>
              <button type="button" disabled={safePage === 1} onClick={() => setCurrentPage(page => Math.max(1, page - 1))}>
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).slice(0, 5).map(page => (
                <button
                  type="button"
                  key={page}
                  className={page === safePage ? 'stu-page-active' : ''}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
              <button type="button" disabled={safePage === totalPages} onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}>
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </footer>
        </section>
      </main>

      {(showCreate || editing) && (
        <div className="stu-modal-backdrop" role="dialog" aria-modal="true">
          <form className="stu-modal" onSubmit={submitForm}>
            <div className="stu-modal-head">
              <h2>{editing ? 'Modifier etudiant' : 'Nouvel etudiant'}</h2>
              <button type="button" onClick={closeForm}><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="stu-form-grid">
              <Field label="Nom complet" error={errors.name}>
                <input value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} required />
              </Field>
              <Field label="Email" error={errors.email}>
                <input type="email" value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} required />
              </Field>
              <Field label="Telephone" error={errors.phone}>
                <input value={form.phone} onChange={event => setForm({ ...form, phone: event.target.value })} />
              </Field>
              <Field label="Ville" error={errors.city}>
                <input value={form.city} onChange={event => setForm({ ...form, city: event.target.value })} />
              </Field>
              <Field label="Adresse" error={errors.address} wide>
                <input value={form.address} onChange={event => setForm({ ...form, address: event.target.value })} />
              </Field>
              <Field label="Statut" error={errors.status}>
                <select value={form.status} onChange={event => setForm({ ...form, status: event.target.value as StudentForm['status'] })}>
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                </select>
              </Field>
            </div>
            <div className="stu-modal-actions">
              <button type="button" className="stu-ghost" onClick={closeForm}>Annuler</button>
              <button type="submit" className="stu-primary" disabled={processing}>{processing ? 'Traitement...' : 'Enregistrer'}</button>
            </div>
          </form>
        </div>
      )}

      {viewing && (
        <div className="stu-modal-backdrop" role="dialog" aria-modal="true">
          <div className="stu-modal stu-profile-modal">
            <div className="stu-modal-head">
              <h2>Profil etudiant</h2>
              <button type="button" onClick={() => setViewing(null)}><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="stu-profile">
              <div className="stu-avatar stu-avatar--lg">{avatarFor(viewing)}</div>
              <div>
                <h3>{viewing.name}</h3>
                <p>{viewing.email}</p>
              </div>
            </div>
            <div className="stu-detail-grid">
              <Detail label="Telephone" value={viewing.phone ?? 'Non renseigne'} />
              <Detail label="Ville" value={viewing.city ?? 'Non renseignee'} />
              <Detail label="Formation" value={viewing.course} />
              <Detail label="Inscription" value={viewing.joinedAt} />
              <Detail label="Derniere activite" value={viewing.lastSeen} />
              <Detail label="Adresse" value={viewing.address ?? 'Non renseignee'} />
            </div>
            <div className="stu-modal-actions">
              <button type="button" className="stu-ghost" onClick={() => setViewing(null)}>Fermer</button>
              <button type="button" className="stu-primary" onClick={() => { setViewing(null); openEdit(viewing) }}>Modifier</button>
            </div>
          </div>
        </div>
      )}

      {deleting && (
        <div className="stu-modal-backdrop" role="dialog" aria-modal="true">
          <div className="stu-modal stu-confirm">
            <div className="stu-modal-head">
              <h2>Supprimer etudiant</h2>
              <button type="button" onClick={() => setDeleting(null)}><span className="material-symbols-outlined">close</span></button>
            </div>
            <p>Cette action supprimera le compte de <strong>{deleting.name}</strong> et ses donnees liees.</p>
            <div className="stu-modal-actions">
              <button type="button" className="stu-ghost" onClick={() => setDeleting(null)}>Annuler</button>
              <button type="button" className="stu-delete-btn" disabled={processing} onClick={destroyStudent}>
                {processing ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;600;700&family=Manrope:wght@400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');
        .material-symbols-outlined { font-family:'Material Symbols Outlined'; font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24; line-height:1; }
        .stu-root { --bg:#faf5ee; --surface:#fff; --line:#d8d0c8; --line-soft:rgba(216,208,200,.62); --text:#3a302a; --muted:#605850; --primary:#c2652a; --soft:#fbe8d8; min-height:100%; padding:42px 32px 56px; background:var(--bg); color:var(--text); font-family:'Manrope',sans-serif; }
        .stu-root *, .stu-root *::before, .stu-root *::after { box-sizing:border-box; }
        .stu-top { display:flex; align-items:flex-end; justify-content:space-between; gap:24px; margin-bottom:30px; }
        .stu-top h1 { margin:0; font-family:'EB Garamond',serif; font-size:clamp(2.4rem,5vw,4rem); line-height:.98; }
        .stu-top p { max-width:640px; margin:12px 0 0; color:var(--muted); line-height:1.75; }
        .stu-primary, .stu-delete-btn, .stu-ghost { min-height:42px; display:inline-flex; align-items:center; justify-content:center; gap:8px; border-radius:8px; padding:0 16px; font-family:'Manrope',sans-serif; font-weight:800; font-size:.82rem; cursor:pointer; transition:.16s; }
        .stu-primary { border:0; background:var(--primary); color:#fff; box-shadow:0 14px 28px rgba(194,101,42,.18); }
        .stu-primary:hover { opacity:.9; transform:translateY(-1px); }
        .stu-primary:disabled, .stu-delete-btn:disabled { opacity:.55; cursor:not-allowed; transform:none; }
        .stu-ghost { border:1px solid var(--line-soft); background:#fff; color:var(--muted); text-transform:uppercase; letter-spacing:.08em; font-size:.68rem; }
        .stu-ghost:hover { background:#fff7f2; color:var(--primary); border-color:rgba(194,101,42,.28); }
        .stu-delete-btn { border:0; background:#c0392b; color:#fff; }
        .stu-flash { margin-bottom:18px; padding:12px 14px; border:1px solid #bbf7d0; background:#f0fdf4; color:#047857; border-radius:8px; font-weight:800; font-size:.82rem; }
        .stu-stats { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:18px; margin-bottom:34px; }
        .stu-stat { border:1px solid var(--line-soft); border-radius:12px; background:#fff; padding:24px; }
        .stu-stat div { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; margin-bottom:18px; }
        .stu-stat .material-symbols-outlined { padding:9px; border-radius:8px; background:var(--soft); color:var(--primary); }
        .stu-stat small { color:#16a34a; background:#f0fdf4; padding:4px 7px; border-radius:999px; font-size:.62rem; font-weight:900; }
        .stu-stat p { margin:0 0 5px; color:#78716c; font-size:.68rem; font-weight:900; letter-spacing:.15em; text-transform:uppercase; }
        .stu-stat strong { font-family:'EB Garamond',serif; font-size:2.4rem; line-height:1; font-weight:600; }
        .stu-featured { margin-bottom:36px; }
        .stu-section-title { display:flex; align-items:center; gap:16px; margin-bottom:20px; }
        .stu-section-title h2, .stu-table-head h2, .stu-modal h2 { margin:0; font-family:'EB Garamond',serif; font-size:2rem; font-weight:600; color:var(--text); }
        .stu-section-title span { height:1px; flex:1; background:var(--line-soft); }
        .stu-featured-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:24px; }
        .stu-card { overflow:hidden; border:1px solid var(--line-soft); border-radius:12px; background:#fff; }
        .stu-card-media { position:relative; height:190px; overflow:hidden; }
        .stu-card-media img { width:100%; height:100%; object-fit:cover; transition:transform .6s; }
        .stu-card:hover .stu-card-media img { transform:scale(1.05); }
        .stu-card-media b { position:absolute; right:14px; top:14px; padding:6px 10px; border-radius:999px; background:rgba(255,255,255,.9); color:var(--primary); font-size:.58rem; font-weight:900; letter-spacing:.12em; text-transform:uppercase; }
        .stu-card-body { padding:20px; }
        .stu-card-head, .stu-student-cell, .stu-profile { display:flex; align-items:center; gap:13px; min-width:0; }
        .stu-card h3, .stu-profile h3 { margin:0; font-weight:900; color:var(--text); }
        .stu-card p, .stu-profile p { margin:3px 0 0; color:#8b8178; font-size:.76rem; }
        .stu-avatar { width:48px; height:48px; border-radius:999px; overflow:hidden; display:flex; align-items:center; justify-content:center; flex-shrink:0; background:linear-gradient(135deg,#c2652a,#e08850); color:#fff; font-weight:900; }
        .stu-avatar img { width:100%; height:100%; object-fit:cover; }
        .stu-avatar--sm { width:40px; height:40px; font-size:.72rem; }
        .stu-avatar--lg { width:72px; height:72px; font-size:1rem; }
        .stu-mini-row { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-top:18px; color:#8b8178; font-size:.82rem; }
        .stu-mini-row strong, .stu-course { color:var(--text); font-weight:800; }
        .stu-progress { display:flex; align-items:center; gap:10px; margin-top:12px; }
        .stu-progress i { display:block; width:100%; height:7px; border-radius:999px; overflow:hidden; background:#ece6dc; }
        .stu-progress em { display:block; height:100%; border-radius:inherit; background:var(--primary); }
        .stu-progress span { color:var(--text); font-size:.74rem; font-weight:900; }
        .stu-table-panel { overflow:hidden; border:1px solid var(--line-soft); border-radius:16px; background:#fff; }
        .stu-table-head { display:flex; align-items:center; justify-content:space-between; gap:18px; padding:24px; border-bottom:1px solid var(--line-soft); flex-wrap:wrap; }
        .stu-table-head p { margin:4px 0 0; color:#9a9088; font-size:.68rem; font-weight:900; letter-spacing:.14em; text-transform:uppercase; }
        .stu-tools { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
        .stu-search { position:relative; display:flex; align-items:center; }
        .stu-search .material-symbols-outlined { position:absolute; left:10px; color:#9a9088; font-size:18px; }
        .stu-search input, .stu-tools select, .stu-modal input, .stu-modal select { height:40px; border:1px solid var(--line-soft); border-radius:8px; background:#fff; color:var(--text); font-family:'Manrope',sans-serif; font-size:.82rem; outline:none; }
        .stu-search input { width:260px; padding:0 12px 0 35px; }
        .stu-tools select, .stu-modal select { padding:0 12px; }
        .stu-search input:focus, .stu-tools select:focus, .stu-modal input:focus, .stu-modal select:focus { border-color:rgba(194,101,42,.56); box-shadow:0 0 0 3px rgba(194,101,42,.1); }
        .stu-table-wrap { overflow-x:auto; }
        .stu-table { width:100%; min-width:920px; border-collapse:collapse; text-align:left; }
        .stu-table th { padding:15px 24px; background:#faf8f5; color:#9a9088; font-size:.65rem; font-weight:900; letter-spacing:.15em; text-transform:uppercase; }
        .stu-table td { padding:18px 24px; border-top:1px solid var(--line-soft); vertical-align:middle; font-size:.86rem; }
        .stu-table tbody tr:hover { background:#fffaf6; }
        .stu-student-cell strong { display:block; font-weight:900; color:var(--text); }
        .stu-student-cell span, .stu-student-cell small { display:block; color:#9a9088; font-size:.73rem; margin-top:2px; }
        .stu-pay { display:inline-flex; align-items:center; padding:5px 10px; border-radius:999px; border:1px solid; font-size:.6rem; font-weight:900; letter-spacing:.12em; text-transform:uppercase; white-space:nowrap; }
        .stu-pay--green { background:#f0fdf4; color:#047857; border-color:#bbf7d0; }
        .stu-pay--amber { background:#fffbeb; color:#92400e; border-color:#fde68a; }
        .stu-pay--red { background:#fff0f0; color:#c0392b; border-color:#fecaca; }
        .stu-pay--slate { background:#f5f5f4; color:#78716c; border-color:#e7e5e4; }
        .stu-progress--table { margin:0; max-width:170px; }
        .stu-count { width:34px; height:34px; display:inline-flex; align-items:center; justify-content:center; border-radius:8px; background:#f5f4f1; border:1px solid var(--line-soft); color:var(--text); }
        .stu-actions { display:flex; justify-content:flex-end; gap:8px; }
        .stu-actions button, .stu-modal-head button, .stu-pagination button { border:1px solid var(--line-soft); background:#fff; color:#78716c; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; transition:.15s; }
        .stu-actions button { width:32px; height:32px; border-radius:8px; }
        .stu-actions .material-symbols-outlined { font-size:18px; }
        .stu-actions button:hover { background:#fff3ec; color:var(--primary); border-color:rgba(194,101,42,.32); }
        .stu-actions .stu-danger:hover { background:#fff0f0; color:#c0392b; border-color:#fecaca; }
        .stu-empty { padding:54px 20px; text-align:center; color:#9a9088; }
        .stu-empty button { border:1px solid var(--line-soft); background:#fff; border-radius:8px; padding:10px 14px; font-weight:900; cursor:pointer; }
        .stu-pagination { display:flex; align-items:center; justify-content:space-between; gap:14px; padding:18px 24px; border-top:1px solid var(--line-soft); background:#faf8f5; flex-wrap:wrap; }
        .stu-pagination p { margin:0; color:#9a9088; font-size:.72rem; font-weight:800; }
        .stu-pagination div { display:flex; gap:4px; }
        .stu-pagination button { min-width:34px; height:34px; border-radius:7px; font-weight:800; }
        .stu-pagination button:disabled { opacity:.35; cursor:not-allowed; }
        .stu-pagination .stu-page-active { background:var(--primary); border-color:var(--primary); color:#fff; }
        .stu-modal-backdrop { position:fixed; inset:0; z-index:80; display:flex; align-items:center; justify-content:center; padding:20px; background:rgba(58,48,42,.36); backdrop-filter:blur(6px); }
        .stu-modal { width:min(680px,100%); max-height:calc(100vh - 40px); overflow:auto; border:1px solid var(--line-soft); border-radius:16px; background:#fff; padding:24px; box-shadow:0 24px 70px rgba(58,48,42,.24); font-family:'Manrope',sans-serif; }
        .stu-confirm { max-width:520px; }
        .stu-confirm p { color:var(--muted); line-height:1.7; }
        .stu-modal-head { display:flex; justify-content:space-between; align-items:center; gap:16px; margin-bottom:20px; }
        .stu-modal-head button { width:36px; height:36px; border-radius:999px; }
        .stu-form-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:14px; }
        .stu-field { display:flex; flex-direction:column; gap:6px; }
        .stu-field--wide { grid-column:1 / -1; }
        .stu-field label { color:#78716c; font-size:.68rem; font-weight:900; letter-spacing:.12em; text-transform:uppercase; }
        .stu-modal input, .stu-modal select { width:100%; padding:0 12px; }
        .stu-error { color:#c0392b; font-size:.72rem; font-weight:700; }
        .stu-modal-actions { display:flex; justify-content:flex-end; gap:10px; margin-top:22px; flex-wrap:wrap; }
        .stu-detail-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; margin-top:20px; }
        .stu-detail { padding:13px; border:1px solid var(--line-soft); border-radius:10px; background:#faf8f5; }
        .stu-detail span { display:block; color:#9a9088; font-size:.62rem; font-weight:900; letter-spacing:.12em; text-transform:uppercase; }
        .stu-detail strong { display:block; margin-top:5px; color:var(--text); overflow-wrap:anywhere; }
        .al-root.al-dark .stu-root { --bg:#191512; --surface:#241f1a; --line:#3b3028; --line-soft:rgba(210,194,181,.16); --text:#f8efe5; --muted:#d5c8bc; --primary:#f0a878; --soft:rgba(240,168,120,.14); }
        .al-root.al-dark .stu-stat, .al-root.al-dark .stu-card, .al-root.al-dark .stu-table-panel, .al-root.al-dark .stu-modal, .al-root.al-dark .stu-search input, .al-root.al-dark .stu-tools select, .al-root.al-dark .stu-ghost, .al-root.al-dark .stu-modal input, .al-root.al-dark .stu-modal select, .al-root.al-dark .stu-actions button, .al-root.al-dark .stu-pagination button { background:#241f1a; color:#d5c8bc; }
        .al-root.al-dark .stu-table th, .al-root.al-dark .stu-pagination, .al-root.al-dark .stu-detail { background:#1f1a16; }
        .al-root.al-dark .stu-table tbody tr:hover { background:rgba(240,168,120,.07); }
        @media (max-width:1120px) { .stu-stats { grid-template-columns:repeat(2,minmax(0,1fr)); } .stu-featured-grid { grid-template-columns:1fr; } }
        @media (max-width:720px) { .stu-root { padding:24px 14px 38px; } .stu-top { align-items:flex-start; flex-direction:column; } .stu-primary, .stu-tools, .stu-search, .stu-search input, .stu-tools select, .stu-ghost { width:100%; } .stu-stats { grid-template-columns:1fr; } .stu-table-head { padding:18px; } .stu-table { min-width:760px; } .stu-form-grid, .stu-detail-grid { grid-template-columns:1fr; } .stu-field--wide { grid-column:auto; } .stu-modal-actions > * { flex:1; } }
      `}</style>
    </AdminLayout>
  )
}

function Field({
  label,
  error,
  wide,
  children,
}: {
  label: string
  error?: string
  wide?: boolean
  children: React.ReactNode
}) {
  return (
    <div className={`stu-field ${wide ? 'stu-field--wide' : ''}`}>
      <label>{label}</label>
      {children}
      {error && <span className="stu-error">{error}</span>}
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
