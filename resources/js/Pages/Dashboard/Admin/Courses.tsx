import AdminLayout from '@/Layouts/AdminLayout'
import { Head, router, usePage } from '@inertiajs/react'
import { FormEvent, useMemo, useState } from 'react'

type Stat = {
  label: string
  value: string
  sub: string
  icon: string
  accent: 'slate' | 'primary' | 'tertiary' | 'orange'
}

type CourseRow = {
  id: number
  title: string
  slug: string
  category: string
  categoryKey: string
  level: string | null
  description: string | null
  durationHours: number | null
  durationWeeks: number | null
  price: number
  capacity: number
  enrolled: number
  occupancy: number
  status: 'active' | 'inactive' | 'draft' | string
  startsAt: string | null
  endsAt: string | null
  instructor: string
  room: string | null
  sessionsCount: number
  revenue: number
}

type CategoryOption = {
  key: string
  label: string
}

type CategoryStat = {
  name: string
  value: number
}

type PageProps = {
  auth: { user: { id: number; name: string; email: string } }
  stats: Stat[]
  courses: CourseRow[]
  categories: CategoryOption[]
  instructors: string[]
  categoryStats: CategoryStat[]
  flash?: { success?: string; warning?: string }
  errors?: Record<string, string>
}

type CourseForm = {
  title: string
  category: string
  level: string
  description: string
  duration_hours: string
  duration_weeks: string
  price: string
  capacity: string
  status: 'active' | 'inactive' | 'draft'
  starts_at: string
  ends_at: string
}

const PAGE_SIZE = 8

const emptyForm: CourseForm = {
  title: '',
  category: 'langues',
  level: '',
  description: '',
  duration_hours: '',
  duration_weeks: '',
  price: '0',
  capacity: '',
  status: 'active',
  starts_at: '',
  ends_at: '',
}

const courseImages = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAq8hkH6tQlbyN4_4t01vk1mq6b8FeyW3WNOuUd7IpSiC_66FtJ10hZD7aJKd4XFnrae_A7bqrPFuH4NCruG2eKSynAKnex_EUGKPmDLQzpcX3ufm0qlNTlmat6pTR7yi2GpzWhgwPkq7O50akFBr_c97nMFaJwT389AfpX2kENgNGBFSZxExNhpgr4geF1j8Zo3uDxnCy7AmlvQjiOkrz6vIdP8EQXKpQto7WvFgumXTUAuR1LrY5ffCHtrWu4Aza20TygxO2edLSH',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBZeHYDaW84n-Su0cFykCqpjTSfS0NwF-VpWXgexlDtI1xQGShk2iQ4hK8AIVzLZYOtQN-Bp2hiQdwBET5y49MB9BL37LpVVSpmO10_CMXYzSOVZ-7BuRO8faHUYebDAdLfH7_5y-fLkyZovf1Pqm8pwWL-9o0DS7nhtHIBdxpmXZ8s68JMI8sddI02dpQHwdCFaUbv2eSNRFMxv20tB8vQPBQD3Pf3wJ9oLUCdA421-EcibrV6DpQ7jP51mWhUohWpl00mrHcTgZJp',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA-xJv9l2d6Zqm41VMd-JMvpvrC3syWHS6tsldNt3rSooYgNigIhSD4_RhCNtX7AINcKHS4gNK_lzBelrt2onzeOS8cvd9fJIV5qAz-Pde67wufXWae8CFsiqwZcHDG7qPLCsYIkaMKTyA4ipt92plSLRrqDZ0w2lHjeBpMdccvbrpDArsY49tqAgUmgmCiQhX3ePgxjhAHKci09pFnu0uopW4LcJfeT34trvqKA5em2QxvUercvfO3N9MdZ8qSTC7KLBYkFApODDrP',
]

function fmtDh(value: number | string | undefined) {
  return `${Number(value ?? 0).toLocaleString('fr-FR')} DH`
}

function fmtNumber(value: number | string | undefined) {
  return Number(value ?? 0).toLocaleString('fr-FR')
}

function dateForInput(value: string | null) {
  if (!value) return ''
  const [day, month, year] = value.split('/')
  return year && month && day ? `${year}-${month}-${day}` : ''
}

function formFromCourse(course: CourseRow): CourseForm {
  return {
    title: course.title,
    category: course.categoryKey,
    level: course.level ?? '',
    description: course.description ?? '',
    duration_hours: course.durationHours ? String(course.durationHours) : '',
    duration_weeks: course.durationWeeks ? String(course.durationWeeks) : '',
    price: String(course.price),
    capacity: course.capacity ? String(course.capacity) : '',
    status: course.status === 'inactive' || course.status === 'draft' ? course.status : 'active',
    starts_at: dateForInput(course.startsAt),
    ends_at: dateForInput(course.endsAt),
  }
}

function statusLabel(status: string) {
  if (status === 'active') return 'Active'
  if (status === 'draft') return 'Brouillon'
  return 'Inactive'
}

function payloadFromForm(form: CourseForm) {
  return {
    ...form,
    duration_hours: form.duration_hours === '' ? null : Number(form.duration_hours),
    duration_weeks: form.duration_weeks === '' ? null : Number(form.duration_weeks),
    price: Number(form.price || 0),
    capacity: form.capacity === '' ? null : Number(form.capacity),
    starts_at: form.starts_at || null,
    ends_at: form.ends_at || null,
  }
}

export default function Courses() {
  const { props } = usePage<PageProps>()
  const { stats, courses, categories, instructors, categoryStats, flash, errors = {} } = props
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [instructorFilter, setInstructorFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [viewing, setViewing] = useState<CourseRow | null>(null)
  const [editing, setEditing] = useState<CourseRow | null>(null)
  const [deleting, setDeleting] = useState<CourseRow | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState<CourseForm>(emptyForm)
  const [processing, setProcessing] = useState(false)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return courses.filter(course => {
      const matchesSearch = !q || [course.title, course.category, course.level ?? '', course.instructor]
        .some(value => value.toLowerCase().includes(q))
      const matchesCategory = categoryFilter === 'all' || course.categoryKey === categoryFilter
      const matchesInstructor = instructorFilter === 'all' || course.instructor === instructorFilter
      return matchesSearch && matchesCategory && matchesInstructor
    })
  }, [courses, search, categoryFilter, instructorFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(currentPage, totalPages)
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
  const featuredCourses = [...courses].sort((a, b) => b.enrolled - a.enrolled).slice(0, 3)
  const hasFilters = search !== '' || categoryFilter !== 'all' || instructorFilter !== 'all'

  const openCreate = () => {
    setForm({
      ...emptyForm,
      category: categories[0]?.key ?? 'langues',
    })
    setShowCreate(true)
  }

  const openEdit = (course: CourseRow) => {
    setForm(formFromCourse(course))
    setEditing(course)
  }

  const closeForm = () => {
    setShowCreate(false)
    setEditing(null)
    setForm(emptyForm)
  }

  const submitForm = (event: FormEvent) => {
    event.preventDefault()
    setProcessing(true)
    const payload = payloadFromForm(form)
    const options = {
      preserveScroll: true,
      onFinish: () => setProcessing(false),
      onSuccess: closeForm,
    }

    if (editing) {
      router.patch(route('admin.courses.update', editing.id), payload, options)
      return
    }

    router.post(route('admin.courses.store'), payload, options)
  }

  const destroyCourse = () => {
    if (!deleting) return
    setProcessing(true)
    router.delete(route('admin.courses.destroy', deleting.id), {
      preserveScroll: true,
      onFinish: () => setProcessing(false),
      onSuccess: () => setDeleting(null),
    })
  }

  const resetFilters = () => {
    setSearch('')
    setCategoryFilter('all')
    setInstructorFilter('all')
    setCurrentPage(1)
  }

  return (
    <AdminLayout
      header={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Manrope, sans-serif' }}>
          <span style={{ fontSize: '.8rem', color: '#b0a49a' }}>Administration</span>
          <span style={{ color: '#b0a49a', fontSize: '.8rem' }}>/</span>
          <span style={{ fontSize: '.82rem', fontWeight: 700, color: '#1a1612' }}>Formations</span>
        </div>
      }
    >
      <Head title="Gestion des formations" />

      <main className="crs-root">
        <header className="crs-hero">
          <div>
            <h1>Gestion des Formations</h1>
            <p>
              Optimisez votre catalogue academique, gerez les inscriptions et suivez les performances
              de vos programmes avec des donnees synchronisees depuis le backend.
            </p>
          </div>
          <button className="crs-primary" type="button" onClick={openCreate}>
            <span className="material-symbols-outlined">add</span>
            Nouvelle Formation
          </button>
        </header>

        {flash?.success && <div className="crs-flash crs-flash--success">{flash.success}</div>}
        {flash?.warning && <div className="crs-flash crs-flash--warning">{flash.warning}</div>}

        <section className="crs-stats">
          {stats.map(stat => (
            <article className={`crs-stat crs-stat--${stat.accent}`} key={stat.label}>
              <span className="material-symbols-outlined">{stat.icon}</span>
              <p>{stat.label}</p>
              <strong>{stat.value}</strong>
              <small>{stat.sub}</small>
            </article>
          ))}
        </section>

        <section className="crs-feature-grid">
          {featuredCourses.map((course, index) => (
            <article className="crs-feature" key={course.id}>
              <img src={courseImages[index % courseImages.length]} alt="" />
              <div>
                <span>{course.category}</span>
                <h2>{course.title}</h2>
                <p>{course.description || `${course.enrolled} inscription(s), ${course.sessionsCount} seance(s) planifiee(s).`}</p>
                <div className="crs-feature-meta">
                  <strong>{fmtDh(course.price)}</strong>
                  <em>{course.occupancy}% occupe</em>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="crs-canvas">
          <div className="crs-filterbar">
            <div className="crs-filter-left">
              <label className="crs-search">
                <span className="material-symbols-outlined">search</span>
                <input
                  value={search}
                  onChange={event => { setSearch(event.target.value); setCurrentPage(1) }}
                  placeholder="Rechercher une formation..."
                />
              </label>
              <select value={categoryFilter} onChange={event => { setCategoryFilter(event.target.value); setCurrentPage(1) }}>
                <option value="all">Toutes les categories</option>
                {categories.map(category => <option key={category.key} value={category.key}>{category.label}</option>)}
              </select>
              <select value={instructorFilter} onChange={event => { setInstructorFilter(event.target.value); setCurrentPage(1) }}>
                <option value="all">Tous les instructeurs</option>
                {instructors.map(instructor => <option key={instructor} value={instructor}>{instructor}</option>)}
              </select>
              {hasFilters && <button type="button" className="crs-ghost" onClick={resetFilters}>Reset</button>}
            </div>
            <p>
              Affichage de <span>{filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1}-{Math.min(safePage * PAGE_SIZE, filtered.length)}</span>
              {' '}sur {filtered.length} formation{filtered.length > 1 ? 's' : ''}
            </p>
          </div>

          <div className="crs-table-wrap">
            {paginated.length === 0 ? (
              <div className="crs-empty">
                <p>Aucune formation ne correspond aux filtres.</p>
                <button type="button" onClick={resetFilters}>Voir tout le catalogue</button>
              </div>
            ) : (
              <table className="crs-table">
                <thead>
                  <tr>
                    <th>Formation</th>
                    <th>Instructeur</th>
                    <th>Duree</th>
                    <th>Capacite</th>
                    <th>Prix</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((course, index) => (
                    <tr key={course.id}>
                      <td data-label="Formation">
                        <div className="crs-course-cell">
                          <div className="crs-thumb">
                            <img src={courseImages[index % courseImages.length]} alt="" />
                          </div>
                          <div>
                            <strong>{course.title}</strong>
                            <span>{course.category}{course.level ? ` - ${course.level}` : ''}</span>
                            <small className={`crs-status crs-status--${course.status}`}>{statusLabel(course.status)}</small>
                          </div>
                        </div>
                      </td>
                      <td data-label="Instructeur">
                        <div className="crs-instructor">
                          <b>{course.instructor.slice(0, 2).toUpperCase()}</b>
                          <span>{course.instructor}</span>
                        </div>
                      </td>
                      <td data-label="Duree">{course.durationHours ? `${course.durationHours} heures` : course.durationWeeks ? `${course.durationWeeks} semaines` : 'A definir'}</td>
                      <td data-label="Capacite">
                        <div className="crs-capacity">
                          <div>
                            <span>{course.enrolled}/{course.capacity || '∞'} Places</span>
                            <span>{course.occupancy}%</span>
                          </div>
                          <i><em className={course.occupancy >= 100 ? 'crs-full' : ''} style={{ width: `${course.occupancy}%` }} /></i>
                        </div>
                      </td>
                      <td data-label="Prix"><strong className="crs-price">{fmtDh(course.price)}</strong></td>
                      <td data-label="Actions">
                        <div className="crs-actions">
                          <button type="button" title="Voir details" onClick={() => setViewing(course)}>
                            <span className="material-symbols-outlined">visibility</span>
                          </button>
                          <button type="button" title="Modifier" onClick={() => openEdit(course)}>
                            <span className="material-symbols-outlined">edit</span>
                          </button>
                          <button type="button" className="crs-danger" title="Supprimer" onClick={() => setDeleting(course)}>
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <footer className="crs-pagination">
            <div>
              <button type="button" disabled={safePage === 1} onClick={() => setCurrentPage(page => Math.max(1, page - 1))}>Precedent</button>
              <button type="button" disabled={safePage === totalPages} onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}>Suivant</button>
            </div>
            <div>
              {Array.from({ length: totalPages }, (_, index) => index + 1).slice(0, 5).map(page => (
                <button
                  type="button"
                  key={page}
                  className={page === safePage ? 'crs-page-active' : ''}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
            </div>
          </footer>
        </section>

        <section className="crs-bottom">
          <article>
            <h2>Repartition du catalogue</h2>
            <div className="crs-category-list">
              {categoryStats.map(item => (
                <div key={item.name}>
                  <span>{item.name}</span>
                  <strong>{fmtNumber(item.value)}</strong>
                </div>
              ))}
            </div>
          </article>
          <article className="crs-dark">
            <h2>Lecture rapide</h2>
            <p>
              Les taux de capacite sont calcules depuis les inscriptions actives. Les instructeurs proviennent
              des seances planifiees dans le module planning.
            </p>
          </article>
        </section>
      </main>

      {(showCreate || editing) && (
        <div className="crs-modal-backdrop" role="dialog" aria-modal="true">
          <form className="crs-modal" onSubmit={submitForm}>
            <div className="crs-modal-head">
              <h2>{editing ? 'Modifier la formation' : 'Nouvelle formation'}</h2>
              <button type="button" onClick={closeForm}><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="crs-form-grid">
              <Field label="Titre" error={errors.title}>
                <input value={form.title} onChange={event => setForm({ ...form, title: event.target.value })} required />
              </Field>
              <Field label="Categorie" error={errors.category}>
                <input list="course-categories" value={form.category} onChange={event => setForm({ ...form, category: event.target.value })} required />
                <datalist id="course-categories">
                  {categories.map(category => <option key={category.key} value={category.key}>{category.label}</option>)}
                </datalist>
              </Field>
              <Field label="Niveau" error={errors.level}>
                <input value={form.level} onChange={event => setForm({ ...form, level: event.target.value })} />
              </Field>
              <Field label="Statut" error={errors.status}>
                <select value={form.status} onChange={event => setForm({ ...form, status: event.target.value as CourseForm['status'] })}>
                  <option value="active">Active</option>
                  <option value="draft">Brouillon</option>
                  <option value="inactive">Inactive</option>
                </select>
              </Field>
              <Field label="Duree heures" error={errors.duration_hours}>
                <input type="number" min="0" value={form.duration_hours} onChange={event => setForm({ ...form, duration_hours: event.target.value })} />
              </Field>
              <Field label="Duree semaines" error={errors.duration_weeks}>
                <input type="number" min="0" value={form.duration_weeks} onChange={event => setForm({ ...form, duration_weeks: event.target.value })} />
              </Field>
              <Field label="Prix DH" error={errors.price}>
                <input type="number" min="0" step="0.01" value={form.price} onChange={event => setForm({ ...form, price: event.target.value })} required />
              </Field>
              <Field label="Capacite" error={errors.capacity}>
                <input type="number" min="0" value={form.capacity} onChange={event => setForm({ ...form, capacity: event.target.value })} />
              </Field>
              <Field label="Debut" error={errors.starts_at}>
                <input type="date" value={form.starts_at} onChange={event => setForm({ ...form, starts_at: event.target.value })} />
              </Field>
              <Field label="Fin" error={errors.ends_at}>
                <input type="date" value={form.ends_at} onChange={event => setForm({ ...form, ends_at: event.target.value })} />
              </Field>
              <Field label="Description" error={errors.description} wide>
                <textarea value={form.description} onChange={event => setForm({ ...form, description: event.target.value })} rows={4} />
              </Field>
            </div>
            <div className="crs-modal-actions">
              <button type="button" className="crs-ghost" onClick={closeForm}>Annuler</button>
              <button type="submit" className="crs-primary" disabled={processing}>{processing ? 'Traitement...' : 'Enregistrer'}</button>
            </div>
          </form>
        </div>
      )}

      {viewing && (
        <div className="crs-modal-backdrop" role="dialog" aria-modal="true">
          <div className="crs-modal crs-detail-modal">
            <div className="crs-modal-head">
              <h2>Details formation</h2>
              <button type="button" onClick={() => setViewing(null)}><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="crs-detail-hero">
              <span>{viewing.category}</span>
              <h3>{viewing.title}</h3>
              <p>{viewing.description || 'Aucune description renseignee.'}</p>
            </div>
            <div className="crs-detail-grid">
              <Detail label="Instructeur" value={viewing.instructor} />
              <Detail label="Salle" value={viewing.room ?? 'A definir'} />
              <Detail label="Prix" value={fmtDh(viewing.price)} />
              <Detail label="Revenu encaisse" value={fmtDh(viewing.revenue)} />
              <Detail label="Seances" value={`${viewing.sessionsCount}`} />
              <Detail label="Periode" value={`${viewing.startsAt ?? 'A definir'} - ${viewing.endsAt ?? 'A definir'}`} />
            </div>
            <div className="crs-modal-actions">
              <button type="button" className="crs-ghost" onClick={() => setViewing(null)}>Fermer</button>
              <button type="button" className="crs-primary" onClick={() => { setViewing(null); openEdit(viewing) }}>Modifier</button>
            </div>
          </div>
        </div>
      )}

      {deleting && (
        <div className="crs-modal-backdrop" role="dialog" aria-modal="true">
          <div className="crs-modal crs-confirm">
            <div className="crs-modal-head">
              <h2>Supprimer formation</h2>
              <button type="button" onClick={() => setDeleting(null)}><span className="material-symbols-outlined">close</span></button>
            </div>
            <p>
              Confirmer la suppression de <strong>{deleting.title}</strong>. Si des inscriptions existent,
              la formation sera desactivee pour preserver les dossiers.
            </p>
            <div className="crs-modal-actions">
              <button type="button" className="crs-ghost" onClick={() => setDeleting(null)}>Annuler</button>
              <button type="button" className="crs-delete" disabled={processing} onClick={destroyCourse}>
                {processing ? 'Traitement...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;600;700&family=Manrope:wght@400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');
        .material-symbols-outlined { font-family:'Material Symbols Outlined'; font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24; line-height:1; }
        .crs-root { --bg:#faf5ee; --surface:#fff; --surface-low:#f6f0e8; --line:#d8d0c8; --line-soft:rgba(216,208,200,.55); --text:#3a302a; --muted:#605850; --primary:#c2652a; --tertiary:#8c3c3c; min-height:100%; padding:42px 32px 56px; background:var(--bg); color:var(--text); font-family:'Manrope',sans-serif; }
        .crs-root *, .crs-root *::before, .crs-root *::after { box-sizing:border-box; }
        .crs-hero { display:flex; align-items:flex-end; justify-content:space-between; gap:24px; margin-bottom:28px; }
        .crs-hero h1 { margin:0; font-family:'EB Garamond',serif; font-size:clamp(2.5rem,5vw,4.1rem); font-style:italic; line-height:.96; }
        .crs-hero p { max-width:720px; margin:12px 0 0; color:var(--muted); line-height:1.75; font-size:.95rem; }
        .crs-primary, .crs-ghost, .crs-delete { min-height:42px; border-radius:8px; padding:0 16px; display:inline-flex; align-items:center; justify-content:center; gap:8px; font-family:'Manrope',sans-serif; font-weight:800; cursor:pointer; transition:.16s; }
        .crs-primary { border:0; background:var(--primary); color:#fff; box-shadow:0 14px 28px rgba(194,101,42,.17); }
        .crs-primary:hover { opacity:.9; transform:translateY(-1px); }
        .crs-primary:disabled, .crs-delete:disabled { opacity:.55; cursor:not-allowed; transform:none; }
        .crs-ghost { border:1px solid var(--line-soft); background:#fff; color:var(--muted); text-transform:uppercase; letter-spacing:.08em; font-size:.68rem; }
        .crs-ghost:hover { background:#fff7f2; color:var(--primary); border-color:rgba(194,101,42,.28); }
        .crs-delete { border:0; background:#c0392b; color:#fff; }
        .crs-flash { margin-bottom:18px; padding:12px 14px; border-radius:8px; font-weight:800; font-size:.82rem; }
        .crs-flash--success { border:1px solid #bbf7d0; background:#f0fdf4; color:#047857; }
        .crs-flash--warning { border:1px solid #fde68a; background:#fffbeb; color:#92400e; }
        .crs-stats { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:18px; margin-bottom:28px; }
        .crs-stat { min-height:150px; border:1px solid var(--line-soft); border-radius:12px; background:#fff; padding:22px; box-shadow:0 2px 16px rgba(58,48,42,.04); }
        .crs-stat .material-symbols-outlined { display:block; margin-bottom:16px; font-size:32px; }
        .crs-stat--primary .material-symbols-outlined, .crs-stat--orange .material-symbols-outlined { color:var(--primary); }
        .crs-stat--tertiary .material-symbols-outlined { color:var(--tertiary); }
        .crs-stat--slate .material-symbols-outlined { color:#78706a; }
        .crs-stat p { margin:0 0 6px; color:#78706c; font-size:.66rem; font-weight:900; letter-spacing:.15em; text-transform:uppercase; }
        .crs-stat strong { display:block; font-family:'EB Garamond',serif; font-size:2.35rem; line-height:1; }
        .crs-stat small { display:block; margin-top:8px; color:#9a9088; font-size:.78rem; }
        .crs-feature-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:18px; margin-bottom:28px; }
        .crs-feature { display:grid; grid-template-columns:120px minmax(0,1fr); gap:18px; border:1px solid var(--line-soft); border-radius:12px; background:#fff; padding:14px; min-width:0; }
        .crs-feature img { width:120px; height:150px; object-fit:cover; border-radius:8px; }
        .crs-feature span, .crs-detail-hero span { color:var(--primary); font-size:.65rem; font-weight:900; letter-spacing:.14em; text-transform:uppercase; }
        .crs-feature h2, .crs-bottom h2, .crs-modal h2, .crs-detail-hero h3 { margin:6px 0 8px; font-family:'EB Garamond',serif; line-height:1.05; color:var(--text); }
        .crs-feature h2 { font-size:1.45rem; }
        .crs-feature p { margin:0; color:var(--muted); font-size:.78rem; line-height:1.6; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; }
        .crs-feature-meta { display:flex; align-items:center; justify-content:space-between; gap:10px; margin-top:12px; }
        .crs-feature-meta strong { color:var(--text); }
        .crs-feature-meta em { color:#9a9088; font-size:.72rem; font-style:normal; font-weight:800; }
        .crs-canvas { overflow:hidden; border:1px solid var(--line-soft); border-radius:12px; background:#fff; box-shadow:0 2px 16px rgba(58,48,42,.04); }
        .crs-filterbar { display:flex; align-items:center; justify-content:space-between; gap:16px; padding:22px 24px; border-bottom:1px solid var(--line-soft); flex-wrap:wrap; }
        .crs-filter-left { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
        .crs-filterbar p { margin:0; color:var(--muted); font-size:.82rem; font-weight:700; }
        .crs-filterbar p span { color:var(--primary); }
        .crs-search { position:relative; display:flex; align-items:center; }
        .crs-search .material-symbols-outlined { position:absolute; left:10px; color:#9a9088; font-size:18px; }
        .crs-search input, .crs-filter-left select, .crs-modal input, .crs-modal select, .crs-modal textarea { border:1px solid var(--line-soft); border-radius:8px; background:#fff; color:var(--text); font-family:'Manrope',sans-serif; outline:none; }
        .crs-search input, .crs-filter-left select, .crs-modal input, .crs-modal select { height:40px; }
        .crs-search input { width:260px; padding:0 12px 0 35px; }
        .crs-filter-left select, .crs-modal select { padding:0 12px; }
        .crs-modal textarea { padding:10px 12px; resize:vertical; }
        .crs-search input:focus, .crs-filter-left select:focus, .crs-modal input:focus, .crs-modal select:focus, .crs-modal textarea:focus { border-color:rgba(194,101,42,.56); box-shadow:0 0 0 3px rgba(194,101,42,.1); }
        .crs-table-wrap { overflow-x:auto; }
        .crs-table { width:100%; min-width:980px; border-collapse:collapse; text-align:left; }
        .crs-table th { padding:18px 24px; border-bottom:1px solid var(--line-soft); background:#fbf8f3; color:#78706a; font-size:.65rem; font-weight:900; letter-spacing:.16em; text-transform:uppercase; }
        .crs-table td { padding:20px 24px; border-bottom:1px solid var(--line-soft); vertical-align:middle; color:var(--muted); font-size:.86rem; }
        .crs-table tbody tr:hover { background:rgba(246,240,232,.55); }
        .crs-course-cell, .crs-instructor { display:flex; align-items:center; gap:13px; min-width:0; }
        .crs-thumb { width:52px; height:52px; flex-shrink:0; border-radius:9px; overflow:hidden; background:#fbe8d8; }
        .crs-thumb img { width:100%; height:100%; object-fit:cover; }
        .crs-course-cell strong { display:block; color:var(--text); font-family:'EB Garamond',serif; font-size:1.15rem; }
        .crs-course-cell span { display:block; color:var(--primary); font-size:.72rem; font-weight:800; }
        .crs-status { display:inline-flex; margin-top:5px; padding:3px 7px; border-radius:999px; font-size:.56rem; font-style:normal; letter-spacing:.11em; text-transform:uppercase; }
        .crs-status--active { background:#f0fdf4; color:#047857; }
        .crs-status--draft { background:#fffbeb; color:#92400e; }
        .crs-status--inactive { background:#f5f5f4; color:#78716c; }
        .crs-instructor b { width:32px; height:32px; display:inline-flex; align-items:center; justify-content:center; flex-shrink:0; border-radius:999px; background:#fbe8d8; color:var(--primary); font-size:.66rem; }
        .crs-instructor span { color:var(--text); }
        .crs-capacity { width:120px; }
        .crs-capacity div { display:flex; justify-content:space-between; gap:8px; color:#78706a; font-size:.62rem; font-weight:900; text-transform:uppercase; }
        .crs-capacity i { display:block; height:7px; margin-top:6px; overflow:hidden; border-radius:999px; background:#ece6dc; }
        .crs-capacity em { display:block; height:100%; border-radius:inherit; background:var(--primary); }
        .crs-capacity .crs-full { background:var(--tertiary); }
        .crs-price { color:var(--text); font-family:'EB Garamond',serif; font-size:1.1rem; }
        .crs-actions { display:flex; justify-content:flex-end; gap:8px; }
        .crs-actions button, .crs-modal-head button { border:1px solid transparent; background:transparent; color:#9a9088; width:34px; height:34px; border-radius:8px; display:inline-flex; align-items:center; justify-content:center; cursor:pointer; transition:.15s; }
        .crs-actions button:hover { background:#fff3ec; color:var(--primary); border-color:rgba(194,101,42,.25); }
        .crs-actions .crs-danger:hover { background:#fff0f0; color:#c0392b; border-color:#fecaca; }
        .crs-actions .material-symbols-outlined { font-size:20px; }
        .crs-empty { padding:54px 20px; color:#9a9088; text-align:center; }
        .crs-empty button { border:1px solid var(--line-soft); background:#fff; border-radius:8px; padding:10px 14px; cursor:pointer; font-weight:900; }
        .crs-pagination { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:20px 24px; border-top:1px solid var(--line-soft); flex-wrap:wrap; }
        .crs-pagination div { display:flex; gap:8px; }
        .crs-pagination button { min-width:36px; height:36px; border:1px solid var(--line-soft); border-radius:8px; background:#fff; color:var(--muted); cursor:pointer; font-weight:800; }
        .crs-pagination button:disabled { opacity:.4; cursor:not-allowed; }
        .crs-pagination .crs-page-active { background:var(--primary); border-color:var(--primary); color:#fff; }
        .crs-bottom { display:grid; grid-template-columns:1.2fr .8fr; gap:18px; margin-top:28px; }
        .crs-bottom article { border:1px solid var(--line-soft); border-radius:12px; background:#fff; padding:24px; }
        .crs-bottom h2 { font-size:1.8rem; }
        .crs-category-list { display:grid; gap:10px; }
        .crs-category-list div { display:flex; justify-content:space-between; gap:12px; padding:12px 0; border-bottom:1px solid var(--line-soft); }
        .crs-category-list div:last-child { border-bottom:0; }
        .crs-category-list span { color:var(--muted); font-weight:800; }
        .crs-category-list strong { color:var(--primary); }
        .crs-dark { background:#3a302a !important; color:#faf5ee; }
        .crs-dark h2 { color:#faf5ee; }
        .crs-dark p { color:rgba(250,245,238,.75); line-height:1.75; }
        .crs-modal-backdrop { position:fixed; inset:0; z-index:80; display:flex; align-items:center; justify-content:center; padding:20px; background:rgba(58,48,42,.36); backdrop-filter:blur(6px); }
        .crs-modal { width:min(760px,100%); max-height:calc(100vh - 40px); overflow:auto; border:1px solid var(--line-soft); border-radius:16px; background:#fff; padding:24px; box-shadow:0 24px 70px rgba(58,48,42,.24); font-family:'Manrope',sans-serif; }
        .crs-confirm { max-width:540px; }
        .crs-confirm p { color:var(--muted); line-height:1.75; }
        .crs-modal-head { display:flex; align-items:center; justify-content:space-between; gap:16px; margin-bottom:20px; }
        .crs-modal-head button { border-color:var(--line-soft); background:#fff; }
        .crs-form-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:14px; }
        .crs-field { display:flex; flex-direction:column; gap:6px; }
        .crs-field--wide { grid-column:1 / -1; }
        .crs-field label { color:#78716c; font-size:.68rem; font-weight:900; letter-spacing:.12em; text-transform:uppercase; }
        .crs-modal input, .crs-modal select { width:100%; padding:0 12px; }
        .crs-modal textarea { width:100%; }
        .crs-error { color:#c0392b; font-size:.72rem; font-weight:700; }
        .crs-modal-actions { display:flex; justify-content:flex-end; gap:10px; margin-top:22px; flex-wrap:wrap; }
        .crs-detail-hero { padding:20px; border-radius:12px; background:#faf8f3; border:1px solid var(--line-soft); }
        .crs-detail-hero h3 { font-size:2.1rem; }
        .crs-detail-hero p { margin:0; color:var(--muted); line-height:1.7; }
        .crs-detail-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; margin-top:16px; }
        .crs-detail { padding:13px; border:1px solid var(--line-soft); border-radius:10px; }
        .crs-detail span { display:block; color:#9a9088; font-size:.62rem; font-weight:900; letter-spacing:.12em; text-transform:uppercase; }
        .crs-detail strong { display:block; margin-top:5px; color:var(--text); overflow-wrap:anywhere; }
        .al-root.al-dark .crs-root { --bg:#191512; --surface:#241f1a; --surface-low:#241f1a; --line:#3b3028; --line-soft:rgba(210,194,181,.16); --text:#f8efe5; --muted:#d5c8bc; --primary:#f0a878; --tertiary:#e8a0a0; }
        .al-root.al-dark .crs-stat, .al-root.al-dark .crs-feature, .al-root.al-dark .crs-canvas, .al-root.al-dark .crs-bottom article, .al-root.al-dark .crs-modal, .al-root.al-dark .crs-search input, .al-root.al-dark .crs-filter-left select, .al-root.al-dark .crs-ghost, .al-root.al-dark .crs-modal input, .al-root.al-dark .crs-modal select, .al-root.al-dark .crs-modal textarea, .al-root.al-dark .crs-pagination button { background:#241f1a; color:#d5c8bc; }
        .al-root.al-dark .crs-table th, .al-root.al-dark .crs-detail-hero { background:#1f1a16; }
        .al-root.al-dark .crs-table tbody tr:hover { background:rgba(240,168,120,.07); }
        @media (max-width:1180px) { .crs-stats { grid-template-columns:repeat(2,minmax(0,1fr)); } .crs-feature-grid, .crs-bottom { grid-template-columns:1fr; } }
        @media (max-width:760px) { .crs-root { padding:24px 14px 40px; } .crs-hero { align-items:flex-start; flex-direction:column; } .crs-primary, .crs-filter-left, .crs-search, .crs-search input, .crs-filter-left select, .crs-ghost { width:100%; } .crs-stats { grid-template-columns:1fr; } .crs-feature { grid-template-columns:1fr; } .crs-feature img { width:100%; height:180px; } .crs-table { min-width:900px; } .crs-filterbar, .crs-pagination { padding:18px; } .crs-form-grid, .crs-detail-grid { grid-template-columns:1fr; } .crs-field--wide { grid-column:auto; } .crs-modal-actions > * { flex:1; } }
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
    <div className={`crs-field ${wide ? 'crs-field--wide' : ''}`}>
      <label>{label}</label>
      {children}
      {error && <span className="crs-error">{error}</span>}
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="crs-detail">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}
