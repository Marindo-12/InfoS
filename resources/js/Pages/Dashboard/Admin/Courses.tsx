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

type CategoryOption = { key: string; label: string }
type CategoryStat   = { name: string; value: number }

type PageProps = {
  auth:          { user: { id: number; name: string; email: string } }
  stats:         Stat[]
  courses:       CourseRow[]
  categories:    CategoryOption[]
  instructors:   string[]
  categoryStats: CategoryStat[]
  flash?:        { success?: string; warning?: string }
  errors?:       Record<string, string>
}

type CourseForm = {
  title:          string
  category:       string
  level:          string
  description:    string
  duration_hours: string
  duration_weeks: string
  price:          string
  capacity:       string
  status:         'active' | 'inactive' | 'draft'
  starts_at:      string
  ends_at:        string
}

/* ═══════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════ */
const PAGE_SIZE = 8

const emptyForm: CourseForm = {
  title: '', category: 'langues', level: '', description: '',
  duration_hours: '', duration_weeks: '', price: '0',
  capacity: '', status: 'active', starts_at: '', ends_at: '',
}

const courseImages = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAq8hkH6tQlbyN4_4t01vk1mq6b8FeyW3WNOuUd7IpSiC_66FtJ10hZD7aJKd4XFnrae_A7bqrPFuH4NCruG2eKSynAKnex_EUGKPmDLQzpcX3ufm0qlNTlmat6pTR7yi2GpzWhgwPkq7O50akFBr_c97nMFaJwT389AfpX2kENgNGBFSZxExNhpgr4geF1j8Zo3uDxnCy7AmlvQjiOkrz6vIdP8EQXKpQto7WvFgumXTUAuR1LrY5ffCHtrWu4Aza20TygxO2edLSH',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBZeHYDaW84n-Su0cFykCqpjTSfS0NwF-VpWXgexlDtI1xQGShk2iQ4hK8AIVzLZYOtQN-Bp2hiQdwBET5y49MB9BL37LpVVSpmO10_CMXYzSOVZ-7BuRO8faHUYebDAdLfH7_5y-fLkyZovf1Pqm8pwWL-9o0DS7nhtHIBdxpmXZ8s68JMI8sddI02dpQHwdCFaUbv2eSNRFMxv20tB8vQPBQD3Pf3wJ9oLUCdA421-EcibrV6DpQ7jP51mWhUohWpl00mrHcTgZJp',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA-xJv9l2d6Zqm41VMd-JMvpvrC3syWHS6tsldNt3rSooYgNigIhSD4_RhCNtX7AINcKHS4gNK_lzBelrt2onzeOS8cvd9fJIV5qAz-Pde67wufXWae8CFsiqwZcHDG7qPLCsYIkaMKTyA4ipt92plSLRrqDZ0w2lHjeBpMdccvbrpDArsY49tqAgUmgmCiQhX3ePgxjhAHKci09pFnu0uopW4LcJfeT34trvqKA5em2QxvUercvfO3N9MdZ8qSTC7KLBYkFApODDrP',
]

/* ═══════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════ */
const fmtDh     = (v: number | string | undefined) => `${Number(v ?? 0).toLocaleString('fr-FR')} DH`
const fmtNumber = (v: number | string | undefined) => Number(v ?? 0).toLocaleString('fr-FR')

function dateForInput(value: string | null) {
  if (!value) return ''
  const [day, month, year] = value.split('/')
  return year && month && day ? `${year}-${month}-${day}` : ''
}

function formFromCourse(c: CourseRow): CourseForm {
  return {
    title:          c.title,
    category:       c.categoryKey,
    level:          c.level          ?? '',
    description:    c.description    ?? '',
    duration_hours: c.durationHours  ? String(c.durationHours) : '',
    duration_weeks: c.durationWeeks  ? String(c.durationWeeks) : '',
    price:          String(c.price),
    capacity:       c.capacity       ? String(c.capacity) : '',
    status:         c.status === 'inactive' || c.status === 'draft' ? c.status : 'active',
    starts_at:      dateForInput(c.startsAt),
    ends_at:        dateForInput(c.endsAt),
  }
}

function statusLabel(s: string) {
  if (s === 'active') return 'Active'
  if (s === 'draft')  return 'Brouillon'
  return 'Inactive'
}

function payloadFromForm(form: CourseForm) {
  return {
    ...form,
    duration_hours: form.duration_hours === '' ? null : Number(form.duration_hours),
    duration_weeks: form.duration_weeks === '' ? null : Number(form.duration_weeks),
    price:          Number(form.price || 0),
    capacity:       form.capacity === '' ? null : Number(form.capacity),
    starts_at:      form.starts_at || null,
    ends_at:        form.ends_at   || null,
  }
}

/* ═══════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════ */
export default function Courses() {
  const { props } = usePage<PageProps>()
  const { stats, courses, categories, instructors, categoryStats, flash, errors = {} } = props

  const [categoryFilter,   setCategoryFilter]   = useState('all')
  const [instructorFilter, setInstructorFilter] = useState('all')
  const [search,           setSearch]           = useState('')
  const [currentPage,      setCurrentPage]      = useState(1)
  const [viewing,          setViewing]          = useState<CourseRow | null>(null)
  const [editing,          setEditing]          = useState<CourseRow | null>(null)
  const [deleting,         setDeleting]         = useState<CourseRow | null>(null)
  const [showCreate,       setShowCreate]       = useState(false)
  const [form,             setForm]             = useState<CourseForm>(emptyForm)
  const [processing,       setProcessing]       = useState(false)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return courses.filter(c => {
      const matchQ = !q || [c.title, c.category, c.level ?? '', c.instructor]
        .some(v => v.toLowerCase().includes(q))
      const matchC = categoryFilter   === 'all' || c.categoryKey === categoryFilter
      const matchI = instructorFilter === 'all' || c.instructor  === instructorFilter
      return matchQ && matchC && matchI
    })
  }, [courses, search, categoryFilter, instructorFilter])

  const totalPages    = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage      = Math.min(currentPage, totalPages)
  const paginated     = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
  const featuredCourses = [...courses].sort((a, b) => b.enrolled - a.enrolled).slice(0, 3)
  const hasFilters    = search !== '' || categoryFilter !== 'all' || instructorFilter !== 'all'

  const allPages = Array.from({ length: totalPages }, (_, i) => i + 1)
  const visiblePages = allPages.filter(p => {
    if (totalPages <= 5) return true
    if (p === 1 || p === totalPages) return true
    return Math.abs(p - safePage) <= 1
  })

  const pf = (fn: () => void) => { fn(); setCurrentPage(1) }

  const openCreate = () => {
    setForm({ ...emptyForm, category: categories[0]?.key ?? 'langues' })
    setShowCreate(true)
  }
  const openEdit  = (c: CourseRow) => { setForm(formFromCourse(c)); setEditing(c) }
  const closeForm = () => { setShowCreate(false); setEditing(null); setForm(emptyForm) }

  const submitForm = (e: FormEvent) => {
    e.preventDefault()
    setProcessing(true)
    const payload = payloadFromForm(form)
    const opts    = { preserveScroll: true, onFinish: () => setProcessing(false), onSuccess: closeForm }
    if (editing) { router.patch(route('admin.courses.update', editing.id), payload, opts); return }
    router.post(route('admin.courses.store'), payload, opts)
  }

  const destroyCourse = () => {
    if (!deleting) return
    setProcessing(true)
    router.delete(route('admin.courses.destroy', deleting.id), {
      preserveScroll: true,
      onFinish:  () => setProcessing(false),
      onSuccess: () => setDeleting(null),
    })
  }

  const resetFilters = () => pf(() => {
    setSearch(''); setCategoryFilter('all'); setInstructorFilter('all')
  })

  return (
    <AdminLayout
      header={
        <div style={{ display:'flex', alignItems:'center', gap:8, fontFamily:'Manrope,sans-serif' }}>
          <span style={{ fontSize:'.8rem', color:'#b0a49a' }}>Administration</span>
          <span style={{ color:'#b0a49a', fontSize:'.8rem' }}>/</span>
          <span style={{ fontSize:'.82rem', fontWeight:700, color:'#1a1612' }}>Formations</span>
        </div>
      }
    >
      <Head title="Gestion des formations" />

      <main className="min-h-screen bg-[#faf5ee] text-[#3a302a] font-['Manrope'] p-8 md:p-[42px_32px_56px]
        [.al-dark_&]:bg-[#191512] [.al-dark_&]:text-[#f8efe5]">

        {/* ── Hero ── */}
        <header className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-7 flex-wrap">
          <div>
            <h1 className="font-['EB_Garamond',serif] italic text-[clamp(2.5rem,5vw,4.1rem)] leading-none">Gestion des Formations</h1>
            <p className="max-w-[720px] mt-3 text-[#605850] text-[.95rem] leading-relaxed
              [.al-dark_&]:text-[#d5c8bc]">
              Optimisez votre catalogue académique, gérez les inscriptions et suivez les performances
              de vos programmes avec des données synchronisées depuis le backend.
            </p>
          </div>
          <button
            className="inline-flex items-center gap-2 bg-[#fc642d] text-white rounded-lg px-4 py-2.5 font-extrabold text-sm
            shadow-[0_8px_20px_rgba(194,101,42,.2)] hover:opacity-90 hover:-translate-y-px transition-all
            disabled:opacity-55 disabled:cursor-not-allowed disabled:transform-none"
            type="button" onClick={openCreate}
          >
            <span className="material-symbols-outlined">add</span>
            Nouvelle Formation
          </button>
        </header>

        {flash?.success && (
          <div className="mb-4 p-3 rounded-lg border border-green-200 bg-green-50 text-green-700 font-extrabold text-sm
            [.al-dark_&]:border-green-800 [.al-dark_&]:bg-green-900/20 [.al-dark_&]:text-green-300">
            {flash.success}
          </div>
        )}
        {flash?.warning && (
          <div className="mb-4 p-3 rounded-lg border border-yellow-200 bg-yellow-50 text-yellow-800 font-extrabold text-sm
            [.al-dark_&]:border-yellow-800 [.al-dark_&]:bg-yellow-900/20 [.al-dark_&]:text-yellow-300">
            {flash.warning}
          </div>
        )}

        {/* ── Stats ── */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
          {stats.map(stat => (
            <article
              key={stat.label}
              className="min-h-[150px] border border-black/10 rounded-xl bg-white p-5 shadow-sm
              hover:-translate-y-0.5 hover:shadow-lg transition-all
              [.al-dark_&]:bg-[#241f1a] [.al-dark_&]:border-white/10"
            >
              <span className={`material-symbols-outlined block mb-4 text-3xl
                ${stat.accent === 'primary' || stat.accent === 'orange' ? 'text-[#fc642d]' : ''}
                ${stat.accent === 'tertiary' ? 'text-[#8c3c3c]' : ''}
                ${stat.accent === 'slate' ? 'text-[#78706a]' : ''}
                [.al-dark_&]:text-[#f0a878] [.al-dark_&]:${stat.accent === 'slate' ? 'text-[#a09080]' : ''}
              `}>
                {stat.icon}
              </span>
              <p className="text-[#78706a] text-[.66rem] font-black uppercase tracking-[.15em] mb-1.5
                [.al-dark_&]:text-[#a09080]">{stat.label}</p>
              <strong className="block font-['EB_Garamond',serif] text-[2.35rem] leading-none">{stat.value}</strong>
              <small className="block mt-2 text-[#9a9088] text-xs
                [.al-dark_&]:text-[#786b60]">{stat.sub}</small>
            </article>
          ))}
        </section>

        {/* ── Featured ── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-7">
          {featuredCourses.map((course, index) => (
            <article key={course.id} className="flex flex-col sm:grid sm:grid-cols-[120px_1fr] gap-4 border border-black/10 rounded-xl bg-white p-4
              [.al-dark_&]:bg-[#241f1a] [.al-dark_&]:border-white/10">
              <img src={courseImages[index % courseImages.length]} alt="" className="w-full sm:w-[120px] h-[180px] sm:h-[150px] object-cover rounded-lg" />
              <div>
                <span className="text-[#fc642d] text-[.65rem] font-black uppercase tracking-[.14em]
                  [.al-dark_&]:text-[#f0a878]">{course.category}</span>
                <h2 className="font-['EB_Garamond',serif] text-2xl mt-1.5 mb-2 text-[#3a302a]
                  [.al-dark_&]:text-[#f8efe5]">{course.title}</h2>
                <p className="text-[#605850] text-xs leading-relaxed line-clamp-3
                  [.al-dark_&]:text-[#c8bdb6]">{course.description || `${course.enrolled} inscription(s), ${course.sessionsCount} séance(s) planifiée(s).`}</p>
                <div className="flex items-center justify-between gap-2 mt-3">
                  <strong className="text-[#3a302a] [.al-dark_&]:text-[#f0e8e0]">{fmtDh(course.price)}</strong>
                  <em className="text-[#9a9088] text-xs not-italic font-extrabold">{course.occupancy}% occupé</em>
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* ── Table panel ── */}
        <section className="overflow-hidden border border-black/10 rounded-xl bg-white shadow-sm
          [.al-dark_&]:bg-[#241f1a] [.al-dark_&]:border-white/10">
          {/* Filter bar */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 border-b border-black/10 bg-[#faf8f5]
            [.al-dark_&]:bg-[#1f1a16] [.al-dark_&]:border-white/10">
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <label className="relative flex items-center w-full sm:w-auto">
                <span className="material-symbols-outlined absolute left-3 text-[#9a9088] text-lg pointer-events-none">search</span>
                <input
                  value={search}
                  onChange={e => pf(() => setSearch(e.target.value))}
                  placeholder="Rechercher une formation…"
                  className="h-10 w-full sm:w-[260px] pl-9 pr-3 border border-black/10 rounded-lg bg-white text-[#3a302a] text-sm outline-none focus:border-[#fc642d]/50 focus:ring-2 focus:ring-[#fc642d]/10
                    [.al-dark_&]:bg-[#241f1a] [.al-dark_&]:text-[#d5c8bc] [.al-dark_&]:border-white/10 [.al-dark_&]:placeholder-[#5e5248]"
                />
              </label>
              <select
                value={categoryFilter}
                onChange={e => pf(() => setCategoryFilter(e.target.value))}
                className="h-10 px-3 border border-black/10 rounded-lg bg-white text-[#3a302a] text-sm outline-none focus:border-[#fc642d]/50 cursor-pointer
                  [.al-dark_&]:bg-[#241f1a] [.al-dark_&]:text-[#d5c8bc] [.al-dark_&]:border-white/10"
              >
                <option value="all">Toutes les catégories</option>
                {categories.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
              </select>
              <select
                value={instructorFilter}
                onChange={e => pf(() => setInstructorFilter(e.target.value))}
                className="h-10 px-3 border border-black/10 rounded-lg bg-white text-[#3a302a] text-sm outline-none focus:border-[#fc642d]/50 cursor-pointer
                  [.al-dark_&]:bg-[#241f1a] [.al-dark_&]:text-[#d5c8bc] [.al-dark_&]:border-white/10"
              >
                <option value="all">Tous les instructeurs</option>
                {instructors.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
              {hasFilters && (
                <button type="button" onClick={resetFilters}
                  className="h-10 px-4 border border-black/10 rounded-lg bg-white text-[#605850] text-xs font-extrabold uppercase tracking-wider hover:bg-[#fff7f2] hover:text-[#fc642d] hover:border-[#fc642d]/30 transition-colors
                    [.al-dark_&]:bg-[#241f1a] [.al-dark_&]:text-[#d5c8bc] [.al-dark_&]:border-white/10 [.al-dark_&]:hover:bg-[#f0a878]/10 [.al-dark_&]:hover:text-[#f0a878] [.al-dark_&]:hover:border-[#f0a878]/30">
                  Reset
                </button>
              )}
            </div>
            <p className="text-[#605850] text-sm font-bold
              [.al-dark_&]:text-[#d5c8bc]">
              Affichage de{' '}
              <span className="text-[#fc642d] [.al-dark_&]:text-[#f0a878]">
                {filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)}
              </span>{' '}
              sur {filtered.length} formation{filtered.length > 1 ? 's' : ''}
            </p>
          </div>

          <div className="overflow-x-auto">
            {paginated.length === 0 ? (
              <div className="py-12 text-center text-[#9a9088]">
                <p className="mb-4">Aucune formation ne correspond aux filtres.</p>
                <button type="button" onClick={resetFilters}
                  className="inline-flex items-center px-4 py-2 border border-black/10 rounded-lg bg-white font-extrabold text-sm hover:bg-gray-50
                    [.al-dark_&]:bg-[#241f1a] [.al-dark_&]:text-[#d5c8bc]">
                  Voir tout le catalogue
                </button>
              </div>
            ) : (
              <table className="w-full min-w-[980px] border-collapse text-left">
                <thead>
                  <tr className="bg-[#faf8f5] [.al-dark_&]:bg-[#1f1a16]">
                    <th className="p-3.5 font-black text-[.65rem] tracking-[.16em] uppercase text-[#78706a] border-b border-black/10">Formation</th>
                    <th className="p-3.5 font-black text-[.65rem] tracking-[.16em] uppercase text-[#78706a] border-b border-black/10">Instructeur</th>
                    <th className="p-3.5 font-black text-[.65rem] tracking-[.16em] uppercase text-[#78706a] border-b border-black/10">Durée</th>
                    <th className="p-3.5 font-black text-[.65rem] tracking-[.16em] uppercase text-[#78706a] border-b border-black/10">Capacité</th>
                    <th className="p-3.5 font-black text-[.65rem] tracking-[.16em] uppercase text-[#78706a] border-b border-black/10">Prix</th>
                    <th className="p-3.5 font-black text-[.65rem] tracking-[.16em] uppercase text-[#78706a] border-b border-black/10">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((course, rowIdx) => {
                    const rowBg = rowIdx % 2 === 0 ? '#ffffff' : '#f6f4f0'
                    const darkRowBg = rowIdx % 2 === 0 ? '#241f1a' : '#1f1a16'
                    return (
                      <tr key={course.id}
                        style={{ background: rowBg }}
                        className="[.al-dark_&]:hover:bg-[#f0a878]/5"
                      >
                        <td className="p-4 border-b border-black/5 [.al-dark_&]:border-white/5">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-[50px] h-[50px] flex-shrink-0 rounded-lg overflow-hidden bg-[#fbe8d8]">
                              <img src={courseImages[rowIdx % courseImages.length]} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <strong className="block font-['EB_Garamond',serif] text-lg text-[#3a302a] [.al-dark_&]:text-[#f8efe5]">{course.title}</strong>
                              <span className="block text-[#fc642d] text-xs font-extrabold [.al-dark_&]:text-[#f0a878]">
                                {course.category}{course.level ? ` – ${course.level}` : ''}
                              </span>
                              <small className={`inline-flex mt-1 px-2 py-0.5 rounded-full text-[.56rem] tracking-[.11em] uppercase
                                ${course.status === 'active' ? 'bg-green-50 text-green-700 [.al-dark_&]:bg-green-900/20 [.al-dark_&]:text-green-300' : ''}
                                ${course.status === 'draft' ? 'bg-yellow-50 text-yellow-800 [.al-dark_&]:bg-yellow-900/20 [.al-dark_&]:text-yellow-300' : ''}
                                ${course.status === 'inactive' ? 'bg-gray-100 text-gray-500 [.al-dark_&]:bg-white/5 [.al-dark_&]:text-[#a09080]' : ''}
                              `}>
                                {statusLabel(course.status)}
                              </small>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 border-b border-black/5 [.al-dark_&]:border-white/5">
                          <div className="flex items-center gap-3">
                            <b className="w-8 h-8 inline-flex items-center justify-center rounded-full bg-[#fbe8d8] text-[#fc642d] text-xs font-bold
                              [.al-dark_&]:bg-[#f0a878]/15 [.al-dark_&]:text-[#f0a878]">
                              {course.instructor.slice(0, 2).toUpperCase()}
                            </b>
                            <span className="text-[#3a302a] [.al-dark_&]:text-[#f0e8e0]">{course.instructor}</span>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-[#605850] border-b border-black/5 [.al-dark_&]:border-white/5 [.al-dark_&]:text-[#d5c8bc]">
                          {course.durationHours
                            ? `${course.durationHours} heures`
                            : course.durationWeeks
                            ? `${course.durationWeeks} semaines`
                            : 'À définir'}
                        </td>
                        <td className="p-4 border-b border-black/5 [.al-dark_&]:border-white/5">
                          <div className="w-[130px]">
                            <div className="flex justify-between gap-2 text-[#78706a] text-[.62rem] font-black uppercase
                              [.al-dark_&]:text-[#a09080]">
                              <span>{course.enrolled}/{course.capacity || '∞'} Places</span>
                              <span>{course.occupancy}%</span>
                            </div>
                            <i className="block h-1.5 mt-1.5 overflow-hidden rounded-full bg-[#ece6dc] [.al-dark_&]:bg-[#3b3028]">
                              <em
                                className={`block h-full rounded-full transition-all duration-500 ${course.occupancy >= 100 ? 'bg-[#8c3c3c]' : 'bg-[#fc642d]'}`}
                                style={{ width: `${course.occupancy}%` }}
                              />
                            </i>
                          </div>
                        </td>
                        <td className="p-4 font-['EB_Garamond',serif] text-lg text-[#3a302a] border-b border-black/5 [.al-dark_&]:border-white/5 [.al-dark_&]:text-[#f0e8e0]">
                          {fmtDh(course.price)}
                        </td>
                        <td className="p-4 border-b border-black/5 [.al-dark_&]:border-white/5">
                          <div className="flex justify-end gap-1.5">
                            <button type="button" title="Voir détails" onClick={() => setViewing(course)}
                              className="w-8 h-8 inline-flex items-center justify-center rounded-lg border border-black/10 bg-white text-[#9a9088] hover:bg-[#fff3ec] hover:text-[#fc642d] hover:border-[#fc642d]/30 transition-colors
                                [.al-dark_&]:bg-[#241f1a] [.al-dark_&]:text-[#a09080] [.al-dark_&]:hover:bg-[#f0a878]/10 [.al-dark_&]:hover:text-[#f0a878]">
                              <span className="material-symbols-outlined text-lg">visibility</span>
                            </button>
                            <button type="button" title="Modifier" onClick={() => openEdit(course)}
                              className="w-8 h-8 inline-flex items-center justify-center rounded-lg border border-black/10 bg-white text-[#9a9088] hover:bg-[#fff3ec] hover:text-[#fc642d] hover:border-[#fc642d]/30 transition-colors
                                [.al-dark_&]:bg-[#241f1a] [.al-dark_&]:text-[#a09080] [.al-dark_&]:hover:bg-[#f0a878]/10 [.al-dark_&]:hover:text-[#f0a878]">
                              <span className="material-symbols-outlined text-lg">edit</span>
                            </button>
                            <button type="button" className="w-8 h-8 inline-flex items-center justify-center rounded-lg border border-black/10 bg-white text-[#9a9088] hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors
                              [.al-dark_&]:bg-[#241f1a] [.al-dark_&]:text-[#a09080] [.al-dark_&]:hover:bg-red-900/10 [.al-dark_&]:hover:text-red-400"
                              title="Supprimer" onClick={() => setDeleting(course)}>
                              <span className="material-symbols-outlined text-lg">delete</span>
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

          {/* Pagination */}
          {filtered.length > 0 && (
            <footer className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 border-t border-black/10 bg-[#faf8f5]
              [.al-dark_&]:bg-[#1f1a16] [.al-dark_&]:border-white/10">
              <p className="text-[#9a9088] text-xs font-bold [.al-dark_&]:text-[#786b60]">
                {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)} sur {filtered.length} — {totalPages} page{totalPages > 1 ? 's' : ''}
              </p>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={safePage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  aria-label="Précédent"
                  className="min-w-[34px] h-[34px] border border-black/10 rounded-md bg-white text-sm font-extrabold disabled:opacity-35 hover:bg-[#fff3ec] hover:text-[#fc642d] hover:border-[#fc642d]/30 transition-colors
                    [.al-dark_&]:bg-[#241f1a] [.al-dark_&]:text-[#d5c8bc] [.al-dark_&]:border-white/10"
                >
                  ‹
                </button>

                {visiblePages.map((p, i, arr) => (
                  <>
                    {i > 0 && arr[i - 1] !== p - 1 && (
                      <span key={`ell-${p}`} className="min-w-[26px] text-center text-[#9a9088] pointer-events-none">…</span>
                    )}
                    <button
                      key={p}
                      type="button"
                      onClick={() => setCurrentPage(p)}
                      aria-current={p === safePage ? 'page' : undefined}
                      className={`min-w-[34px] h-[34px] border border-black/10 rounded-md text-sm font-extrabold transition-colors
                        ${p === safePage ? 'bg-[#fc642d] border-[#fc642d] text-white hover:bg-[#fc642d] hover:text-white' : 'bg-white text-[#3a302a] hover:bg-[#fff3ec] hover:text-[#fc642d] hover:border-[#fc642d]/30'}
                        [.al-dark_&]:bg-[#241f1a] [.al-dark_&]:text-[#d5c8bc]
                        [.al-dark_&]:${p === safePage ? 'bg-[#f0a878] border-[#f0a878] text-white' : 'hover:bg-[#f0a878]/10 hover:text-[#f0a878]'}
                      `}
                    >
                      {p}
                    </button>
                  </>
                ))}

                <button
                  type="button"
                  disabled={safePage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  aria-label="Suivant"
                  className="min-w-[34px] h-[34px] border border-black/10 rounded-md bg-white text-sm font-extrabold disabled:opacity-35 hover:bg-[#fff3ec] hover:text-[#fc642d] hover:border-[#fc642d]/30 transition-colors
                    [.al-dark_&]:bg-[#241f1a] [.al-dark_&]:text-[#d5c8bc] [.al-dark_&]:border-white/10"
                >
                  ›
                </button>
              </div>
            </footer>
          )}
        </section>

        {/* ── Bottom ── */}
        <section className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-4 mt-7">
          <article className="border border-black/10 rounded-xl bg-white p-6
            [.al-dark_&]:bg-[#241f1a] [.al-dark_&]:border-white/10">
            <h2 className="font-['EB_Garamond',serif] text-3xl mb-4 text-[#3a302a] [.al-dark_&]:text-[#f8efe5]">Répartition du catalogue</h2>
            <div className="space-y-3">
              {categoryStats.map(item => (
                <div key={item.name} className="flex justify-between items-center gap-3 py-3 border-b border-black/5 last:border-b-0
                  [.al-dark_&]:border-white/5">
                  <span className="font-extrabold text-[#605850] [.al-dark_&]:text-[#d5c8bc]">{item.name}</span>
                  <strong className="text-[#fc642d] [.al-dark_&]:text-[#f0a878]">{fmtNumber(item.value)}</strong>
                </div>
              ))}
            </div>
          </article>
          <article className="border border-black/10 rounded-xl bg-[#3a302a] p-6 text-[#faf5ee]
            [.al-dark_&]:bg-[#0d0b08]">
            <h2 className="font-['EB_Garamond',serif] text-3xl mb-4 text-[#faf5ee]">Lecture rapide</h2>
            <p className="text-white/75 leading-relaxed">
              Les taux de capacité sont calculés depuis les inscriptions actives. Les instructeurs
              proviennent des séances planifiées dans le module planning.
            </p>
          </article>
        </section>
      </main>

      {/* ════════════════════════════════════════
          MODAL — CRÉER / MODIFIER
      ════════════════════════════════════════ */}
      {(showCreate || editing) && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-5 bg-[#3a302a]/50 backdrop-blur-sm animate-fade-in"
          role="dialog" aria-modal="true">
          <form
            className="w-full max-w-[760px] max-h-[calc(100dvh-40px)] overflow-y-auto bg-white border border-[#e2dbd5] rounded-t-2xl sm:rounded-2xl shadow-2xl animate-slide-up
              [.al-dark_&]:bg-[#1e1812] [.al-dark_&]:border-white/10 [.al-dark_&]:shadow-black/40"
            onSubmit={submitForm} noValidate
          >
            <div className="flex items-center justify-between gap-4 p-6 border-b border-[#ede8e2]
              [.al-dark_&]:border-white/10">
              <div>
                <p className="text-[.62rem] font-black tracking-[.15em] uppercase text-[#9a9088] mb-1
                  [.al-dark_&]:text-[#786b60]">
                  {editing ? 'Modification du programme' : 'Nouveau programme'}
                </p>
                <h2 className="font-['EB_Garamond',serif] text-2xl text-[#3a302a]
                  [.al-dark_&]:text-[#f8efe5]">
                  {editing ? 'Modifier la formation' : 'Créer une formation'}
                </h2>
              </div>
              <button type="button" onClick={closeForm} aria-label="Fermer"
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#ede8e2] bg-[#faf8f5] text-[#9a9088] hover:bg-[#fff3ec] hover:text-[#c2652a] hover:border-[#c2652a]/30 transition-colors
                  [.al-dark_&]:bg-[#2a211a] [.al-dark_&]:border-white/10 [.al-dark_&]:text-[#a09080] [.al-dark_&]:hover:bg-[#f0a878]/10 [.al-dark_&]:hover:text-[#f0a878]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
              <Field label="Titre de la formation" error={errors.title} required wide>
                <input
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="Ex : Anglais des affaires B2"
                  required
                  className="w-full h-11 px-4 border border-[#d8d0c8] rounded-lg text-[#3a302a] text-sm outline-none focus:border-[#c2652a] focus:ring-2 focus:ring-[#c2652a]/10
                    [.al-dark_&]:bg-[#251e17] [.al-dark_&]:text-[#f0e8e0] [.al-dark_&]:border-white/20 [.al-dark_&]:placeholder-[#5e5248] [.al-dark_&]:focus:border-[#f0a878] [.al-dark_&]:focus:ring-[#f0a878]/20"
                />
              </Field>

              <Field label="Catégorie" error={errors.category} required>
                <input
                  list="course-categories"
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  placeholder="Sélectionner ou taper…"
                  required
                  className="w-full h-11 px-4 border border-[#d8d0c8] rounded-lg text-[#3a302a] text-sm outline-none focus:border-[#c2652a] focus:ring-2 focus:ring-[#c2652a]/10
                    [.al-dark_&]:bg-[#251e17] [.al-dark_&]:text-[#f0e8e0] [.al-dark_&]:border-white/20"
                />
                <datalist id="course-categories">
                  {categories.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                </datalist>
              </Field>

              <Field label="Niveau" error={errors.level}>
                <input
                  value={form.level}
                  onChange={e => setForm({ ...form, level: e.target.value })}
                  placeholder="Ex : Débutant, B2, Avancé…"
                  className="w-full h-11 px-4 border border-[#d8d0c8] rounded-lg text-[#3a302a] text-sm outline-none focus:border-[#c2652a] focus:ring-2 focus:ring-[#c2652a]/10
                    [.al-dark_&]:bg-[#251e17] [.al-dark_&]:text-[#f0e8e0] [.al-dark_&]:border-white/20"
                />
              </Field>

              <Field label="Statut" error={errors.status}>
                <select
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value as CourseForm['status'] })}
                  className="w-full h-11 px-4 border border-[#d8d0c8] rounded-lg text-[#3a302a] text-sm outline-none focus:border-[#c2652a] focus:ring-2 focus:ring-[#c2652a]/10 appearance-none bg-white
                    [.al-dark_&]:bg-[#251e17] [.al-dark_&]:text-[#f0e8e0] [.al-dark_&]:border-white/20"
                >
                  <option value="active">Active</option>
                  <option value="draft">Brouillon</option>
                  <option value="inactive">Inactive</option>
                </select>
              </Field>

              <Field label="Durée (heures)" error={errors.duration_hours}>
                <input
                  type="number" min="0"
                  value={form.duration_hours}
                  onChange={e => setForm({ ...form, duration_hours: e.target.value })}
                  placeholder="Ex : 40"
                  className="w-full h-11 px-4 border border-[#d8d0c8] rounded-lg text-[#3a302a] text-sm outline-none focus:border-[#c2652a] focus:ring-2 focus:ring-[#c2652a]/10
                    [.al-dark_&]:bg-[#251e17] [.al-dark_&]:text-[#f0e8e0] [.al-dark_&]:border-white/20"
                />
              </Field>

              <Field label="Durée (semaines)" error={errors.duration_weeks}>
                <input
                  type="number" min="0"
                  value={form.duration_weeks}
                  onChange={e => setForm({ ...form, duration_weeks: e.target.value })}
                  placeholder="Ex : 8"
                  className="w-full h-11 px-4 border border-[#d8d0c8] rounded-lg text-[#3a302a] text-sm outline-none focus:border-[#c2652a] focus:ring-2 focus:ring-[#c2652a]/10
                    [.al-dark_&]:bg-[#251e17] [.al-dark_&]:text-[#f0e8e0] [.al-dark_&]:border-white/20"
                />
              </Field>

              <Field label="Prix (DH)" error={errors.price} required>
                <input
                  type="number" min="0" step="0.01"
                  value={form.price}
                  onChange={e => setForm({ ...form, price: e.target.value })}
                  placeholder="Ex : 2500"
                  required
                  className="w-full h-11 px-4 border border-[#d8d0c8] rounded-lg text-[#3a302a] text-sm outline-none focus:border-[#c2652a] focus:ring-2 focus:ring-[#c2652a]/10
                    [.al-dark_&]:bg-[#251e17] [.al-dark_&]:text-[#f0e8e0] [.al-dark_&]:border-white/20"
                />
              </Field>

              <Field label="Capacité max" error={errors.capacity}>
                <input
                  type="number" min="0"
                  value={form.capacity}
                  onChange={e => setForm({ ...form, capacity: e.target.value })}
                  placeholder="Ex : 20"
                  className="w-full h-11 px-4 border border-[#d8d0c8] rounded-lg text-[#3a302a] text-sm outline-none focus:border-[#c2652a] focus:ring-2 focus:ring-[#c2652a]/10
                    [.al-dark_&]:bg-[#251e17] [.al-dark_&]:text-[#f0e8e0] [.al-dark_&]:border-white/20"
                />
              </Field>

              <Field label="Date de début" error={errors.starts_at}>
                <input
                  type="date"
                  value={form.starts_at}
                  onChange={e => setForm({ ...form, starts_at: e.target.value })}
                  className="w-full h-11 px-4 border border-[#d8d0c8] rounded-lg text-[#3a302a] text-sm outline-none focus:border-[#c2652a] focus:ring-2 focus:ring-[#c2652a]/10
                    [.al-dark_&]:bg-[#251e17] [.al-dark_&]:text-[#f0e8e0] [.al-dark_&]:border-white/20"
                />
              </Field>

              <Field label="Date de fin" error={errors.ends_at}>
                <input
                  type="date"
                  value={form.ends_at}
                  onChange={e => setForm({ ...form, ends_at: e.target.value })}
                  className="w-full h-11 px-4 border border-[#d8d0c8] rounded-lg text-[#3a302a] text-sm outline-none focus:border-[#c2652a] focus:ring-2 focus:ring-[#c2652a]/10
                    [.al-dark_&]:bg-[#251e17] [.al-dark_&]:text-[#f0e8e0] [.al-dark_&]:border-white/20"
                />
              </Field>

              <Field label="Description" error={errors.description} wide>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  rows={4}
                  placeholder="Objectifs pédagogiques, contenu, prérequis…"
                  className="w-full px-4 py-2.5 border border-[#d8d0c8] rounded-lg text-[#3a302a] text-sm outline-none focus:border-[#c2652a] focus:ring-2 focus:ring-[#c2652a]/10 resize-y min-h-[110px]
                    [.al-dark_&]:bg-[#251e17] [.al-dark_&]:text-[#f0e8e0] [.al-dark_&]:border-white/20"
                />
              </Field>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-[#ede8e2]
              [.al-dark_&]:border-white/10">
              <button type="button" onClick={closeForm}
                className="h-11 px-4 border border-black/10 rounded-lg bg-white text-[#605850] text-xs font-extrabold uppercase tracking-wider hover:bg-[#fff7f2] hover:text-[#fc642d] hover:border-[#fc642d]/30 transition-colors
                  [.al-dark_&]:bg-[#241f1a] [.al-dark_&]:text-[#d5c8bc] [.al-dark_&]:border-white/10">
                Annuler
              </button>
              <button type="submit" disabled={processing}
                className="h-11 px-5 inline-flex items-center gap-2 bg-[#fc642d] text-white rounded-lg font-extrabold text-sm shadow-[0_8px_20px_rgba(194,101,42,.2)] hover:opacity-90 hover:-translate-y-px transition-all
                disabled:opacity-55 disabled:cursor-not-allowed disabled:transform-none">
                {processing ? (
                  <>
                    <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Traitement…
                  </>
                ) : editing ? 'Enregistrer les modifications' : 'Créer la formation'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ════════════════════════════════════════
          MODAL — DÉTAIL
      ════════════════════════════════════════ */}
      {viewing && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-5 bg-[#3a302a]/50 backdrop-blur-sm animate-fade-in"
          role="dialog" aria-modal="true">
          <div className="w-full max-w-[760px] max-h-[calc(100dvh-40px)] overflow-y-auto bg-white border border-[#e2dbd5] rounded-t-2xl sm:rounded-2xl shadow-2xl animate-slide-up
            [.al-dark_&]:bg-[#1e1812] [.al-dark_&]:border-white/10">

            <div className="flex items-center justify-between gap-4 p-6 border-b-0">
              <div>
                <p className="text-[.62rem] font-black tracking-[.15em] uppercase text-[#9a9088] mb-1
                  [.al-dark_&]:text-[#786b60]">Fiche formation</p>
                <h2 className="font-['EB_Garamond',serif] text-2xl text-[#3a302a]
                  [.al-dark_&]:text-[#f8efe5]">Détail complet</h2>
              </div>
              <button type="button" onClick={() => setViewing(null)} aria-label="Fermer"
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#ede8e2] bg-[#faf8f5] text-[#9a9088] hover:bg-[#fff3ec] hover:text-[#c2652a] hover:border-[#c2652a]/30 transition-colors
                  [.al-dark_&]:bg-[#2a211a] [.al-dark_&]:border-white/10 [.al-dark_&]:text-[#a09080] [.al-dark_&]:hover:bg-[#f0a878]/10 [.al-dark_&]:hover:text-[#f0a878]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="mx-6 mt-3 p-5 rounded-xl bg-[#faf8f3] border border-[#ede8e2]
              [.al-dark_&]:bg-[#241e18] [.al-dark_&]:border-white/10">
              <span className="text-[#fc642d] text-[.65rem] font-black uppercase tracking-[.14em]
                [.al-dark_&]:text-[#f0a878]">{viewing.category}</span>
              <h3 className="font-['EB_Garamond',serif] text-3xl mt-1 mb-2 text-[#3a302a]
                [.al-dark_&]:text-[#f8efe5]">{viewing.title}</h3>
              <p className="text-[#605850] leading-relaxed text-sm
                [.al-dark_&]:text-[#c8bdb6]">{viewing.description || 'Aucune description renseignée.'}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 px-6 py-3">
              <Detail label="Instructeur"       value={viewing.instructor} />
              <Detail label="Salle"             value={viewing.room      ?? 'À définir'} />
              <Detail label="Prix"              value={fmtDh(viewing.price)} />
              <Detail label="Revenu encaissé"   value={fmtDh(viewing.revenue)} />
              <Detail label="Séances"           value={`${viewing.sessionsCount}`} />
              <Detail label="Période"           value={`${viewing.startsAt ?? 'À définir'} — ${viewing.endsAt ?? 'À définir'}`} />
            </div>

            {/* Occupancy bar */}
            <div className="px-6 pb-5">
              <div className="flex justify-between mb-2">
                <span className="text-[.62rem] font-black tracking-[.12em] uppercase text-[#9a9088]
                  [.al-dark_&]:text-[#9a8878]">Taux d'occupation</span>
                <span className="text-[.62rem] font-black tracking-[.12em] uppercase text-[#9a9088]
                  [.al-dark_&]:text-[#9a8878]">{viewing.enrolled}/{viewing.capacity || '∞'} — {viewing.occupancy}%</span>
              </div>
              <div className="h-2 rounded-full bg-[#ece6dc] overflow-hidden
                [.al-dark_&]:bg-[#3b3028]">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${viewing.occupancy >= 100 ? 'bg-[#8c3c3c]' : 'bg-[#fc642d]'}`}
                  style={{ width: `${viewing.occupancy}%` }}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-[#ede8e2]
              [.al-dark_&]:border-white/10">
              <button type="button" onClick={() => setViewing(null)}
                className="h-11 px-4 border border-black/10 rounded-lg bg-white text-[#605850] text-xs font-extrabold uppercase tracking-wider hover:bg-[#fff7f2] hover:text-[#fc642d] hover:border-[#fc642d]/30 transition-colors
                  [.al-dark_&]:bg-[#241f1a] [.al-dark_&]:text-[#d5c8bc] [.al-dark_&]:border-white/10">
                Fermer
              </button>
              <button
                type="button"
                onClick={() => { setViewing(null); openEdit(viewing) }}
                className="h-11 px-5 inline-flex items-center gap-2 bg-[#fc642d] text-white rounded-lg font-extrabold text-sm shadow-[0_8px_20px_rgba(194,101,42,.2)] hover:opacity-90 hover:-translate-y-px transition-all">
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
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-5 bg-[#3a302a]/50 backdrop-blur-sm animate-fade-in"
          role="dialog" aria-modal="true">
          <div className="w-full max-w-lg bg-white border border-[#e2dbd5] rounded-t-2xl sm:rounded-2xl shadow-2xl animate-slide-up
            [.al-dark_&]:bg-[#1e1812] [.al-dark_&]:border-white/10">

            <div className="flex items-center justify-between gap-4 p-6 border-b border-red-100
              [.al-dark_&]:border-red-900/30">
              <div>
                <p className="text-[.62rem] font-black tracking-[.15em] uppercase text-red-600 mb-1
                  [.al-dark_&]:text-red-400">Action irréversible</p>
                <h2 className="font-['EB_Garamond',serif] text-2xl text-[#3a302a]
                  [.al-dark_&]:text-[#f8efe5]">Supprimer la formation</h2>
              </div>
              <button type="button" onClick={() => setDeleting(null)} aria-label="Annuler"
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#ede8e2] bg-[#faf8f5] text-[#9a9088] hover:bg-[#fff3ec] hover:text-[#c2652a] hover:border-[#c2652a]/30 transition-colors
                  [.al-dark_&]:bg-[#2a211a] [.al-dark_&]:border-white/10 [.al-dark_&]:text-[#a09080] [.al-dark_&]:hover:bg-[#f0a878]/10 [.al-dark_&]:hover:text-[#f0a878]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex items-start gap-4 p-6">
              <div className="w-10 h-10 flex-shrink-0 rounded-lg bg-red-50 flex items-center justify-center text-red-600
                [.al-dark_&]:bg-red-900/20 [.al-dark_&]:text-red-400">
                <span className="material-symbols-outlined text-xl">warning</span>
              </div>
              <p className="text-[#605850] leading-relaxed text-sm
                [.al-dark_&]:text-[#c8bdb6]">
                Confirmer la suppression de <strong className="text-[#3a302a] [.al-dark_&]:text-[#f8efe5]">{deleting.title}</strong>.<br />
                Si des inscriptions existent, la formation sera désactivée pour préserver les dossiers étudiants.
              </p>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-[#ede8e2]
              [.al-dark_&]:border-white/10">
              <button type="button" onClick={() => setDeleting(null)}
                className="h-11 px-4 border border-black/10 rounded-lg bg-white text-[#605850] text-xs font-extrabold uppercase tracking-wider hover:bg-[#fff7f2] hover:text-[#fc642d] hover:border-[#fc642d]/30 transition-colors
                  [.al-dark_&]:bg-[#241f1a] [.al-dark_&]:text-[#d5c8bc] [.al-dark_&]:border-white/10">
                Annuler
              </button>
              <button type="button" disabled={processing} onClick={destroyCourse}
                className="h-11 px-5 inline-flex items-center gap-2 bg-red-600 text-white rounded-lg font-extrabold text-sm shadow-[0_4px_14px_rgba(192,57,43,.25)] hover:bg-red-700 disabled:opacity-55 disabled:cursor-not-allowed transition-colors">
                {processing ? (
                  <>
                    <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Suppression…
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">delete</span>
                    Supprimer définitivement
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════
          STYLES (minimal — only keyframes & fonts)
      ═══════════════════════════════════════ */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;600;700&family=Manrope:wght@400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');
        .material-symbols-outlined {
          font-family: 'Material Symbols Outlined';
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          line-height: 1; vertical-align: middle;
        }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(14px) scale(.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .animate-fade-in { animation: fade-in .2s ease both; }
        .animate-slide-up { animation: slide-up .22s cubic-bezier(.22,1,.36,1) both; }
      `}</style>
    </AdminLayout>
  )
}

/* ═══════════════════════════════════════════════
   SUB-COMPONENTS (with Tailwind)
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
    <div className={`flex flex-col ${wide ? 'md:col-span-2' : ''} ${error ? 'border-red-600' : ''}`}>
      <label className="flex items-center gap-1 mb-2 text-[.67rem] font-black tracking-[.1em] uppercase text-[#78716c]
        [.al-dark_&]:text-[#9a8878]">
        {label}
        {required && <span className="text-red-600 text-xs" aria-hidden="true">*</span>}
      </label>
      <div className="relative">
        {children}
      </div>
      {error && (
        <span className="flex items-center gap-1 mt-1.5 text-red-600 text-xs font-bold" role="alert">
          <span aria-hidden="true">⚠</span> {error}
        </span>
      )}
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 border border-[#ede8e2] rounded-lg bg-[#faf8f5] hover:border-[#fc642d]/30 transition-colors
      [.al-dark_&]:bg-[#241e18] [.al-dark_&]:border-white/10 [.al-dark_&]:hover:border-[#f0a878]/25">
      <span className="block text-[.62rem] font-black tracking-[.12em] uppercase text-[#9a9088] mb-1
        [.al-dark_&]:text-[#9a8878]">{label}</span>
      <strong className="block text-[#3a302a] text-sm font-semibold overflow-anywhere
        [.al-dark_&]:text-[#f0e8e0]">{value}</strong>
    </div>
  )
}