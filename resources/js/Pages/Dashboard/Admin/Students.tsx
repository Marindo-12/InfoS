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

function paymentClasses(status: StudentRow['paymentStatus']) {
  switch (status) {
    case 'paye': return 'bg-green-50 text-green-700 border-green-200 [.al-dark_&]:bg-green-900/20 [.al-dark_&]:text-green-300 [.al-dark_&]:border-green-800'
    case 'partiel': return 'bg-yellow-50 text-yellow-800 border-yellow-200 [.al-dark_&]:bg-yellow-900/20 [.al-dark_&]:text-yellow-300 [.al-dark_&]:border-yellow-800'
    case 'retard': return 'bg-red-50 text-red-700 border-red-200 [.al-dark_&]:bg-red-900/20 [.al-dark_&]:text-red-400 [.al-dark_&]:border-red-800'
    default: return 'bg-gray-100 text-gray-500 border-gray-200 [.al-dark_&]:bg-white/5 [.al-dark_&]:text-gray-400 [.al-dark_&]:border-white/10'
  }
}

function paymentLabel(status: StudentRow['paymentStatus']) {
  return status === 'paye' ? 'Payé' : status === 'partiel' ? 'Partiel' : status === 'retard' ? 'Retard' : 'Non défini'
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
    ? <img src={student.avatarUrl} alt={student.name} className="w-full h-full object-cover" />
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
      paymentLabel(s.paymentStatus), `${s.progress}%`,
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

      <main className="min-h-screen bg-[#faf5ee] text-[#3a302a] font-['Manrope',sans-serif] p-6 sm:p-8 lg:p-[42px_32px_56px] [.al-dark_&]:bg-[#191512] [.al-dark_&]:text-[#f8efe5]">

        {/* ── Hero ── */}
        <header className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="font-['EB_Garamond',serif] text-[clamp(2.2rem,5vw,3.8rem)] leading-none">Gestion des Étudiants</h1>
            <p className="max-w-xl mt-2.5 text-[#605850] text-[.95rem] leading-relaxed [.al-dark_&]:text-[#d5c8bc]">
              Portail administratif pour le suivi des inscriptions, des paiements et des progressions.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 bg-[#c2652a] text-white rounded-lg px-4 py-2.5 font-extrabold text-sm shadow-[0_8px_20px_rgba(194,101,42,.2)] hover:opacity-90 hover:-translate-y-px transition-all disabled:opacity-55 disabled:cursor-not-allowed disabled:transform-none"
          >
            <span className="material-symbols-outlined">add</span>
            Nouvel Étudiant
          </button>
        </header>

        {flash?.success && (
          <div className="mb-5 p-3 border border-green-200 bg-green-50 text-green-700 rounded-lg font-extrabold text-sm [.al-dark_&]:border-green-800 [.al-dark_&]:bg-green-900/20 [.al-dark_&]:text-green-300">
            {flash.success}
          </div>
        )}

        {/* ── Stats ── */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(stat => (
            <article
              key={stat.label}
              className="border border-black/10 rounded-xl bg-white p-5 shadow-sm hover:-translate-y-0.5 hover:shadow-lg transition-all [.al-dark_&]:bg-[#241f1a] [.al-dark_&]:border-white/10"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <span className="material-symbols-outlined inline-flex p-2 rounded-lg bg-[#fbe8d8] text-[#c2652a] [.al-dark_&]:bg-[#f0a878]/15 [.al-dark_&]:text-[#f0a878]">
                  {stat.accent === 'green' ? 'payments' : stat.accent === 'blue' ? 'person_add' : stat.accent === 'slate' ? 'auto_stories' : 'group'}
                </span>
                <small className="text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full text-[.62rem] font-black whitespace-nowrap">
                  {stat.sub}
                </small>
              </div>
              <p className="text-[#78716c] text-[.68rem] font-black uppercase tracking-[.15em] mb-1">{stat.label}</p>
              <strong className="font-['EB_Garamond',serif] text-[2.4rem] leading-none font-semibold">{stat.value}</strong>
            </article>
          ))}
        </section>

        {/* ── Featured students ── */}
        <section className="mb-9">
          <div className="flex items-center gap-4 mb-5">
            <h2 className="font-['EB_Garamond',serif] text-3xl font-semibold text-[#3a302a] [.al-dark_&]:text-[#f8efe5]">Inscriptions Vedettes</h2>
            <span className="flex-1 h-px bg-[#d8d0c8]/50" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentStudents.slice(0, 3).map((student, index) => (
              <article key={student.id} className="overflow-hidden border border-black/10 rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md [.al-dark_&]:bg-[#241f1a] [.al-dark_&]:border-white/10">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={coverImages[index % coverImages.length]}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <b className="absolute top-3 right-3 px-2.5 py-1.5 rounded-full bg-white/90 text-[#c2652a] text-[.58rem] font-black uppercase tracking-[.12em] [.al-dark_&]:text-[#f0a878]">
                    {index === 0 ? 'Récent' : student.status === 'active' ? 'En cours' : 'Inactif'}
                  </b>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#c2652a] to-[#e08850] text-white font-black">
                      {avatarFor(student)}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-[#3a302a] [.al-dark_&]:text-[#f8efe5]">{student.name}</h3>
                      <p className="text-[#8b8178] text-xs mt-0.5">Inscrit le {student.joinedAt}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3 mt-4 text-[#8b8178] text-sm [.al-dark_&]:text-[#d5c8bc]">
                    <span>Formation</span>
                    <strong className="text-[#3a302a] font-extrabold [.al-dark_&]:text-[#f0e8e0]">{student.course}</strong>
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex-1 h-2 rounded-full bg-[#ece6dc] overflow-hidden [.al-dark_&]:bg-[#3b3028]">
                      <div className="h-full rounded-full bg-[#c2652a] transition-all duration-500" style={{ width: `${student.progress}%` }} />
                    </div>
                    <span className="text-[#3a302a] text-xs font-black whitespace-nowrap [.al-dark_&]:text-[#f0e8e0]">{student.progress}%</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── Table ── */}
        <section className="overflow-hidden border border-black/10 rounded-2xl bg-white shadow-sm [.al-dark_&]:bg-[#241f1a] [.al-dark_&]:border-white/10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 border-b border-black/10 bg-[#faf8f5] [.al-dark_&]:bg-[#1f1a16] [.al-dark_&]:border-white/10">
            <div>
              <h2 className="font-['EB_Garamond',serif] text-3xl font-semibold text-[#3a302a] [.al-dark_&]:text-[#f8efe5]">Liste des Étudiants</h2>
              <p className="text-[#9a9088] text-[.68rem] font-black uppercase tracking-[.14em] mt-1">
                {filtered.length} résultat{filtered.length > 1 ? 's' : ''}
                {hasFilters ? ` sur ${students.length}` : ''}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <label className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-[#9a9088] text-lg pointer-events-none">search</span>
                <input
                  value={search}
                  onChange={e => pf(() => setSearch(e.target.value))}
                  placeholder="Rechercher un étudiant…"
                  className="h-10 w-full sm:w-[260px] pl-9 pr-3 border border-black/10 rounded-lg bg-white text-[#3a302a] text-sm outline-none focus:border-[#c2652a]/50 focus:ring-2 focus:ring-[#c2652a]/10 [.al-dark_&]:bg-[#241f1a] [.al-dark_&]:text-[#d5c8bc] [.al-dark_&]:border-white/10 [.al-dark_&]:placeholder-[#5e5248]"
                />
              </label>
              <select
                value={payFilter}
                onChange={e => pf(() => setPayFilter(e.target.value as any))}
                className="h-10 px-3 border border-black/10 rounded-lg bg-white text-[#3a302a] text-sm outline-none focus:border-[#c2652a]/50 cursor-pointer [.al-dark_&]:bg-[#241f1a] [.al-dark_&]:text-[#d5c8bc] [.al-dark_&]:border-white/10"
                aria-label="Filtrer par paiement"
              >
                <option value="all">Tous paiements</option>
                <option value="paye">Payé</option>
                <option value="partiel">Partiel</option>
                <option value="retard">Retard</option>
                <option value="non defini">Non défini</option>
              </select>
              {hasFilters && (
                <button type="button" onClick={resetFilters}
                  className="h-10 px-4 border border-black/10 rounded-lg bg-white text-[#605850] text-xs font-extrabold uppercase tracking-wider hover:bg-[#fff7f2] hover:text-[#c2652a] hover:border-[#c2652a]/30 transition-colors [.al-dark_&]:bg-[#241f1a] [.al-dark_&]:text-[#d5c8bc] [.al-dark_&]:border-white/10"
                >
                  Reset
                </button>
              )}
              <button type="button" onClick={exportCsv}
                className="h-10 px-4 border border-black/10 rounded-lg bg-white text-[#605850] text-xs font-extrabold uppercase tracking-wider hover:bg-[#fff7f2] hover:text-[#c2652a] hover:border-[#c2652a]/30 transition-colors [.al-dark_&]:bg-[#241f1a] [.al-dark_&]:text-[#d5c8bc] [.al-dark_&]:border-white/10"
              >
                Exporter CSV
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {paginated.length === 0 ? (
              <div className="py-12 text-center text-[#9a9088]">
                <p className="mb-4">Aucun étudiant ne correspond aux filtres.</p>
                <button type="button" onClick={resetFilters} className="inline-flex items-center px-4 py-2 border border-black/10 rounded-lg bg-white font-extrabold text-sm hover:bg-gray-50 [.al-dark_&]:bg-[#241f1a] [.al-dark_&]:text-[#d5c8bc]">
                  Voir tous les étudiants
                </button>
              </div>
            ) : (
              <table className="w-full min-w-[920px] border-collapse text-left">
                <thead>
                  <tr className="bg-[#faf8f5] [.al-dark_&]:bg-[#1f1a16]">
                    <th className="p-3.5 font-black text-[.65rem] tracking-[.15em] uppercase text-[#9a9088] border-b border-black/10">Étudiant</th>
                    <th className="p-3.5 font-black text-[.65rem] tracking-[.15em] uppercase text-[#9a9088] border-b border-black/10">Formation</th>
                    <th className="p-3.5 font-black text-[.65rem] tracking-[.15em] uppercase text-[#9a9088] border-b border-black/10">Statut paiement</th>
                    <th className="p-3.5 font-black text-[.65rem] tracking-[.15em] uppercase text-[#9a9088] border-b border-black/10">Progression</th>
                    <th className="p-3.5 font-black text-[.65rem] tracking-[.15em] uppercase text-[#9a9088] border-b border-black/10">Parcours</th>
                    <th className="p-3.5 font-black text-[.65rem] tracking-[.15em] uppercase text-[#9a9088] border-b border-black/10">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((student) => (
                    <tr
                      key={student.id}
                      className="odd:bg-white even:bg-[#f6f4f0] hover:bg-[#fffaf6] transition-colors [.al-dark_&]:odd:bg-[#241f1a] [.al-dark_&]:even:bg-[#1f1a16] [.al-dark_&]:hover:bg-[#f0a878]/5"
                    >
                      <td className="p-4 border-b border-black/5 [.al-dark_&]:border-white/5" data-label="Étudiant">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#c2652a] to-[#e08850] text-white font-black text-xs">
                            {avatarFor(student)}
                          </div>
                          <div>
                            <strong className="block font-extrabold text-[#3a302a] [.al-dark_&]:text-[#f8efe5]">{student.name}</strong>
                            <span className="block text-[#9a9088] text-xs mt-0.5">{student.email}</span>
                            {student.phone && <small className="block text-[#9a9088] text-xs">{student.phone}</small>}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 border-b border-black/5 [.al-dark_&]:border-white/5" data-label="Formation">
                        <span className="font-extrabold text-[#3a302a] [.al-dark_&]:text-[#f0e8e0]">{student.course}</span>
                      </td>
                      <td className="p-4 border-b border-black/5 [.al-dark_&]:border-white/5" data-label="Paiement">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full border text-[.6rem] font-black uppercase tracking-[.12em] ${paymentClasses(student.paymentStatus)}`}>
                          {paymentLabel(student.paymentStatus)}
                        </span>
                      </td>
                      <td className="p-4 border-b border-black/5 [.al-dark_&]:border-white/5" data-label="Progression">
                        <div className="flex items-center gap-3 max-w-[160px]">
                          <div className="flex-1 h-2 rounded-full bg-[#ece6dc] overflow-hidden [.al-dark_&]:bg-[#3b3028]">
                            <div className="h-full rounded-full bg-[#c2652a] transition-all duration-500" style={{ width: `${student.progress}%` }} />
                          </div>
                          <span className="text-[#3a302a] text-xs font-black whitespace-nowrap [.al-dark_&]:text-[#f0e8e0]">{student.progress}%</span>
                        </div>
                      </td>
                      <td className="p-4 border-b border-black/5 [.al-dark_&]:border-white/5" data-label="Parcours">
                        <b className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#f5f4f1] border border-black/10 text-[#3a302a] font-black text-sm [.al-dark_&]:bg-[#2a221a] [.al-dark_&]:text-[#f0e8e0] [.al-dark_&]:border-white/10">
                          {student.enrollmentsCount}
                        </b>
                      </td>
                      <td className="p-4 border-b border-black/5 [.al-dark_&]:border-white/5" data-label="Actions">
                        <div className="flex justify-end gap-1.5">
                          <button type="button" title="Voir le profil" onClick={() => setViewing(student)}
                            className="w-8 h-8 inline-flex items-center justify-center rounded-lg border border-black/10 bg-white text-[#78716c] hover:bg-[#fff3ec] hover:text-[#c2652a] hover:border-[#c2652a]/30 transition-colors [.al-dark_&]:bg-[#241f1a] [.al-dark_&]:text-[#a09080] [.al-dark_&]:hover:bg-[#f0a878]/10 [.al-dark_&]:hover:text-[#f0a878]">
                            <span className="material-symbols-outlined text-sm">visibility</span>
                          </button>
                          <button type="button" title="Modifier" onClick={() => openEdit(student)}
                            className="w-8 h-8 inline-flex items-center justify-center rounded-lg border border-black/10 bg-white text-[#78716c] hover:bg-[#fff3ec] hover:text-[#c2652a] hover:border-[#c2652a]/30 transition-colors [.al-dark_&]:bg-[#241f1a] [.al-dark_&]:text-[#a09080] [.al-dark_&]:hover:bg-[#f0a878]/10 [.al-dark_&]:hover:text-[#f0a878]">
                            <span className="material-symbols-outlined text-sm">edit</span>
                          </button>
                          <button type="button" title="Supprimer" onClick={() => setDeleting(student)}
                            className="w-8 h-8 inline-flex items-center justify-center rounded-lg border border-black/10 bg-white text-[#78716c] hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors [.al-dark_&]:bg-[#241f1a] [.al-dark_&]:text-[#a09080] [.al-dark_&]:hover:bg-red-900/10 [.al-dark_&]:hover:text-red-400">
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* ── Pagination ── */}
          <footer className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 border-t border-black/10 bg-[#faf8f5] [.al-dark_&]:bg-[#1f1a16] [.al-dark_&]:border-white/10">
            <p className="text-[#9a9088] text-xs font-bold">
              {filtered.length === 0
                ? '0 résultat'
                : `${(safePage - 1) * PAGE_SIZE + 1}–${Math.min(safePage * PAGE_SIZE, filtered.length)} sur ${filtered.length} étudiant${filtered.length > 1 ? 's' : ''}`}
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={safePage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                aria-label="Page précédente"
                className="min-w-[34px] h-9 rounded-md border border-black/10 bg-white font-extrabold disabled:opacity-35 hover:bg-[#fff3ec] hover:text-[#c2652a] transition-colors flex items-center justify-center [.al-dark_&]:bg-[#241f1a] [.al-dark_&]:text-[#d5c8bc] [.al-dark_&]:border-white/10"
              >
                <span className="material-symbols-outlined text-lg">chevron_left</span>
              </button>

              {visiblePages.map((p, i, arr) => (
                <>
                  {i > 0 && arr[i - 1] !== p - 1 && (
                    <span key={`ell-${p}`} className="min-w-[28px] text-center text-[#9a9088] pointer-events-none text-sm">…</span>
                  )}
                  <button
                    key={p}
                    type="button"
                    onClick={() => setCurrentPage(p)}
                    aria-current={p === safePage ? 'page' : undefined}
                    className={`min-w-[34px] h-9 rounded-md border border-black/10 font-extrabold text-sm transition-colors flex items-center justify-center 
                      ${p === safePage
                        ? 'bg-[#c2652a] border-[#c2652a] text-white hover:bg-[#c2652a] hover:text-white'
                        : 'bg-white text-[#3a302a] hover:bg-[#fff3ec] hover:text-[#c2652a] hover:border-[#c2652a]/30'}
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
                aria-label="Page suivante"
                className="min-w-[34px] h-9 rounded-md border border-black/10 bg-white font-extrabold disabled:opacity-35 hover:bg-[#fff3ec] hover:text-[#c2652a] transition-colors flex items-center justify-center [.al-dark_&]:bg-[#241f1a] [.al-dark_&]:text-[#d5c8bc] [.al-dark_&]:border-white/10"
              >
                <span className="material-symbols-outlined text-lg">chevron_right</span>
              </button>
            </div>
            <p className="text-[#9a9088] text-[.68rem] [.al-dark_&]:text-[#786b60]">
              {PAGE_SIZE} par page · {totalPages} page{totalPages > 1 ? 's' : ''}
            </p>
          </footer>
        </section>
      </main>

      {/* ════════════════════════════════════════
          MODAL — CRÉER / MODIFIER
      ════════════════════════════════════════ */}
      {(showCreate || editing) && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-5 bg-[#3a302a]/50 backdrop-blur-sm animate-fade-in [.al-dark_&]:bg-[#080503]/65"
          role="dialog" aria-modal="true" aria-label={editing ? 'Modifier étudiant' : 'Nouvel étudiant'}>
          <form className="w-full max-w-[660px] max-h-[calc(100dvh-40px)] overflow-y-auto bg-white border border-[#e2dbd5] rounded-t-2xl sm:rounded-2xl shadow-2xl animate-slide-up [.al-dark_&]:bg-[#1e1812] [.al-dark_&]:border-white/10" onSubmit={submitForm} noValidate>
            <div className="flex items-center justify-between gap-4 p-6 border-b border-[#ede8e2] [.al-dark_&]:border-white/10">
              <div>
                <p className="text-[.62rem] font-black tracking-[.15em] uppercase text-[#9a9088] mb-1 [.al-dark_&]:text-[#786b60]">
                  {editing ? 'Modification du dossier' : 'Nouveau dossier'}
                </p>
                <h2 className="font-['EB_Garamond',serif] text-2xl text-[#3a302a] [.al-dark_&]:text-[#f8efe5]">
                  {editing ? 'Modifier un étudiant' : 'Ajouter un étudiant'}
                </h2>
              </div>
              <button type="button" onClick={closeForm} aria-label="Fermer"
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#ede8e2] bg-[#faf8f5] text-[#9a9088] hover:bg-[#fff3ec] hover:text-[#c2652a] hover:border-[#c2652a]/30 transition-colors [.al-dark_&]:bg-[#2a211a] [.al-dark_&]:border-white/10 [.al-dark_&]:text-[#a09080] [.al-dark_&]:hover:bg-[#f0a878]/10 [.al-dark_&]:hover:text-[#f0a878]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
              <Field label="Nom complet" error={errors.name} required>
                <input
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Ex : Karim Alaoui"
                  required
                  className="w-full h-11 px-4 border border-[#d8d0c8] rounded-lg text-[#3a302a] text-sm outline-none focus:border-[#c2652a] focus:ring-2 focus:ring-[#c2652a]/10 [.al-dark_&]:bg-[#251e17] [.al-dark_&]:text-[#f0e8e0] [.al-dark_&]:border-white/20 [.al-dark_&]:placeholder-[#5e5248] [.al-dark_&]:focus:border-[#f0a878] [.al-dark_&]:focus:ring-[#f0a878]/15"
                />
              </Field>

              <Field label="Adresse email" error={errors.email} required>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="email@exemple.com"
                  required
                  className="w-full h-11 px-4 border border-[#d8d0c8] rounded-lg text-[#3a302a] text-sm outline-none focus:border-[#c2652a] focus:ring-2 focus:ring-[#c2652a]/10 [.al-dark_&]:bg-[#251e17] [.al-dark_&]:text-[#f0e8e0] [.al-dark_&]:border-white/20 [.al-dark_&]:placeholder-[#5e5248]"
                />
              </Field>

              <Field label="Téléphone" error={errors.phone}>
                <input
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="+212 6XX XXX XXX"
                  className="w-full h-11 px-4 border border-[#d8d0c8] rounded-lg text-[#3a302a] text-sm outline-none focus:border-[#c2652a] focus:ring-2 focus:ring-[#c2652a]/10 [.al-dark_&]:bg-[#251e17] [.al-dark_&]:text-[#f0e8e0] [.al-dark_&]:border-white/20"
                />
              </Field>

              <Field label="Ville" error={errors.city}>
                <input
                  value={form.city}
                  onChange={e => setForm({ ...form, city: e.target.value })}
                  placeholder="Ex : Tanger"
                  className="w-full h-11 px-4 border border-[#d8d0c8] rounded-lg text-[#3a302a] text-sm outline-none focus:border-[#c2652a] focus:ring-2 focus:ring-[#c2652a]/10 [.al-dark_&]:bg-[#251e17] [.al-dark_&]:text-[#f0e8e0] [.al-dark_&]:border-white/20"
                />
              </Field>

              <Field label="Adresse complète" error={errors.address} wide>
                <input
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                  placeholder="Rue, quartier, code postal…"
                  className="w-full h-11 px-4 border border-[#d8d0c8] rounded-lg text-[#3a302a] text-sm outline-none focus:border-[#c2652a] focus:ring-2 focus:ring-[#c2652a]/10 [.al-dark_&]:bg-[#251e17] [.al-dark_&]:text-[#f0e8e0] [.al-dark_&]:border-white/20"
                />
              </Field>

              <Field label="Statut du compte" error={errors.status}>
                <select
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value as StudentForm['status'] })}
                  className="w-full h-11 px-4 border border-[#d8d0c8] rounded-lg text-[#3a302a] text-sm outline-none focus:border-[#c2652a] focus:ring-2 focus:ring-[#c2652a]/10 appearance-none bg-white [.al-dark_&]:bg-[#251e17] [.al-dark_&]:text-[#f0e8e0] [.al-dark_&]:border-white/20"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239a9088' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 13px center',
                    paddingRight: '36px'
                  }}
                >
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                </select>
              </Field>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-[#ede8e2] [.al-dark_&]:border-white/10">
              <button type="button" onClick={closeForm}
                className="h-11 px-4 border border-black/10 rounded-lg bg-white text-[#605850] text-xs font-extrabold uppercase tracking-wider hover:bg-[#fff7f2] hover:text-[#c2652a] hover:border-[#c2652a]/30 transition-colors [.al-dark_&]:bg-[#241f1a] [.al-dark_&]:text-[#d5c8bc] [.al-dark_&]:border-white/10">
                Annuler
              </button>
              <button type="submit" disabled={processing}
                className="h-11 px-5 inline-flex items-center gap-2 bg-[#c2652a] text-white rounded-lg font-extrabold text-sm shadow-[0_8px_20px_rgba(194,101,42,.2)] hover:opacity-90 hover:-translate-y-px transition-all disabled:opacity-55 disabled:cursor-not-allowed disabled:transform-none">
                {processing ? (
                  <><span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Traitement…</>
                ) : editing ? 'Enregistrer les modifications' : "Créer l'étudiant"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ════════════════════════════════════════
          MODAL — PROFIL
      ════════════════════════════════════════ */}
      {viewing && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-5 bg-[#3a302a]/50 backdrop-blur-sm animate-fade-in [.al-dark_&]:bg-[#080503]/65"
          role="dialog" aria-modal="true" aria-label="Profil étudiant">
          <div className="w-full max-w-[660px] max-h-[calc(100dvh-40px)] overflow-y-auto bg-white border border-[#e2dbd5] rounded-t-2xl sm:rounded-2xl shadow-2xl animate-slide-up [.al-dark_&]:bg-[#1e1812] [.al-dark_&]:border-white/10">
            <div className="flex items-center justify-between gap-4 p-6 border-b-0">
              <div>
                <p className="text-[.62rem] font-black tracking-[.15em] uppercase text-[#9a9088] mb-1 [.al-dark_&]:text-[#786b60]">Dossier étudiant</p>
                <h2 className="font-['EB_Garamond',serif] text-2xl text-[#3a302a] [.al-dark_&]:text-[#f8efe5]">Profil complet</h2>
              </div>
              <button type="button" onClick={() => setViewing(null)} aria-label="Fermer"
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#ede8e2] bg-[#faf8f5] text-[#9a9088] hover:bg-[#fff3ec] hover:text-[#c2652a] hover:border-[#c2652a]/30 transition-colors [.al-dark_&]:bg-[#2a211a] [.al-dark_&]:border-white/10 [.al-dark_&]:text-[#a09080] [.al-dark_&]:hover:bg-[#f0a878]/10 [.al-dark_&]:hover:text-[#f0a878]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex items-center gap-4 px-6 pb-4">
              <div className="w-18 h-18 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#c2652a] to-[#e08850] text-white font-black text-lg">
                {avatarFor(viewing)}
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-[#3a302a] [.al-dark_&]:text-[#f8efe5]">{viewing.name}</h3>
                <p className="text-[#9a9088] text-sm mt-1">{viewing.email}</p>
                <div className="mt-1.5">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full border text-[.6rem] font-black uppercase tracking-[.12em] ${paymentClasses(viewing.paymentStatus)}`}>
                    {paymentLabel(viewing.paymentStatus)}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 px-6 pb-5">
              <Detail label="Téléphone"         value={viewing.phone    ?? 'Non renseigné'} />
              <Detail label="Ville"             value={viewing.city     ?? 'Non renseignée'} />
              <Detail label="Formation"         value={viewing.course} />
              <Detail label="Date d'inscription" value={viewing.joinedAt} />
              <Detail label="Dernière activité" value={viewing.lastSeen} />
              <Detail label="Adresse"           value={viewing.address  ?? 'Non renseignée'} />
            </div>

            <div className="px-6 pb-5">
              <p className="text-[#9a9088] text-[.65rem] font-black uppercase tracking-[.12em] mb-2">Progression de la formation</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 rounded-full bg-[#ece6dc] overflow-hidden [.al-dark_&]:bg-[#3b3028]">
                  <div className="h-full rounded-full bg-[#c2652a] transition-all duration-500" style={{ width: `${viewing.progress}%` }} />
                </div>
                <span className="text-[#3a302a] text-xs font-black [.al-dark_&]:text-[#f0e8e0]">{viewing.progress}%</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-[#ede8e2] [.al-dark_&]:border-white/10">
              <button type="button" onClick={() => setViewing(null)}
                className="h-11 px-4 border border-black/10 rounded-lg bg-white text-[#605850] text-xs font-extrabold uppercase tracking-wider hover:bg-[#fff7f2] hover:text-[#c2652a] hover:border-[#c2652a]/30 transition-colors [.al-dark_&]:bg-[#241f1a] [.al-dark_&]:text-[#d5c8bc] [.al-dark_&]:border-white/10">
                Fermer
              </button>
              <button type="button" onClick={() => { setViewing(null); openEdit(viewing) }}
                className="h-11 px-5 inline-flex items-center gap-2 bg-[#c2652a] text-white rounded-lg font-extrabold text-sm shadow-[0_8px_20px_rgba(194,101,42,.2)] hover:opacity-90 hover:-translate-y-px transition-all">
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
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-5 bg-[#3a302a]/50 backdrop-blur-sm animate-fade-in [.al-dark_&]:bg-[#080503]/65"
          role="dialog" aria-modal="true" aria-label="Confirmer la suppression">
          <div className="w-full max-w-[480px] bg-white border border-[#e2dbd5] rounded-t-2xl sm:rounded-2xl shadow-2xl animate-slide-up [.al-dark_&]:bg-[#1e1812] [.al-dark_&]:border-white/10">
            <div className="flex items-center justify-between gap-4 p-6 border-b border-red-100 [.al-dark_&]:border-red-900/30">
              <div>
                <p className="text-[.62rem] font-black tracking-[.15em] uppercase text-red-600 mb-1 [.al-dark_&]:text-red-400">Action irréversible</p>
                <h2 className="font-['EB_Garamond',serif] text-2xl text-[#3a302a] [.al-dark_&]:text-[#f8efe5]">Supprimer l'étudiant</h2>
              </div>
              <button type="button" onClick={() => setDeleting(null)} aria-label="Annuler"
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#ede8e2] bg-[#faf8f5] text-[#9a9088] hover:bg-[#fff3ec] hover:text-[#c2652a] hover:border-[#c2652a]/30 transition-colors [.al-dark_&]:bg-[#2a211a] [.al-dark_&]:border-white/10 [.al-dark_&]:text-[#a09080] [.al-dark_&]:hover:bg-[#f0a878]/10 [.al-dark_&]:hover:text-[#f0a878]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex items-start gap-4 p-6">
              <div className="w-10 h-10 flex-shrink-0 rounded-lg bg-red-50 flex items-center justify-center text-red-600 [.al-dark_&]:bg-red-900/20 [.al-dark_&]:text-red-400">
                <span className="material-symbols-outlined text-xl">warning</span>
              </div>
              <p className="text-[#605850] leading-relaxed text-sm [.al-dark_&]:text-[#c8bdb6]">
                Vous êtes sur le point de supprimer définitivement le compte de{' '}
                <strong className="text-[#3a302a] [.al-dark_&]:text-[#f8efe5]">{deleting.name}</strong>. Cette action supprimera toutes ses données,
                inscriptions et historique de paiement. Elle est <strong className="text-[#3a302a] [.al-dark_&]:text-[#f8efe5]">irréversible</strong>.
              </p>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-[#ede8e2] [.al-dark_&]:border-white/10">
              <button type="button" onClick={() => setDeleting(null)}
                className="h-11 px-4 border border-black/10 rounded-lg bg-white text-[#605850] text-xs font-extrabold uppercase tracking-wider hover:bg-[#fff7f2] hover:text-[#c2652a] hover:border-[#c2652a]/30 transition-colors [.al-dark_&]:bg-[#241f1a] [.al-dark_&]:text-[#d5c8bc] [.al-dark_&]:border-white/10">
                Annuler
              </button>
              <button type="button" disabled={processing} onClick={destroyStudent}
                className="h-11 px-5 inline-flex items-center gap-2 bg-red-600 text-white rounded-lg font-extrabold text-sm shadow-[0_4px_14px_rgba(192,57,43,.25)] hover:bg-red-700 disabled:opacity-55 disabled:cursor-not-allowed transition-colors">
                {processing ? (
                  <><span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Suppression…</>
                ) : (
                  <><span className="material-symbols-outlined">delete</span> Supprimer définitivement</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════
          STYLES (minimum – polices + animations)
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
   SUB-COMPONENTS (Tailwind)
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
      <label className="flex items-center gap-1 mb-2 text-[.67rem] font-black tracking-[.1em] uppercase text-[#78716c] [.al-dark_&]:text-[#9a8878]">
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
    <div className="p-3 border border-[#ede8e2] rounded-lg bg-[#faf8f5] hover:border-[#c2652a]/30 transition-colors [.al-dark_&]:bg-[#241e18] [.al-dark_&]:border-white/10 [.al-dark_&]:hover:border-[#f0a878]/25">
      <span className="block text-[.62rem] font-black tracking-[.12em] uppercase text-[#9a9088] mb-1 [.al-dark_&]:text-[#9a8878]">{label}</span>
      <strong className="block text-[#3a302a] text-sm font-semibold overflow-wrap-anywhere [.al-dark_&]:text-[#f0e8e0]">{value}</strong>
    </div>
  )
}