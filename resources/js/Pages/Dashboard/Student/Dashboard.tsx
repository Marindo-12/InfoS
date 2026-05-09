import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, Link, usePage } from '@inertiajs/react'

type Stat = {
  label: string
  value: string
  sub: string
  color: string
  icon: 'formation' | 'calendar' | 'payment' | 'certificate'
}

type NextSession = {
  title: string
  category: string
  date: string | null
  time: string | null
  room: string | null
  group: string | null
} | null

type CourseCard = {
  title: string
  category: string
  progress: number
  description: string | null
}

type RecentPayment = {
  reference: string
  course: string
  amount: string
  status: 'paid' | 'pending'
  date: string
}

type NotificationCard = {
  title: string
  message: string
  category: string
  icon?: string | null
  isRead: boolean
  timeLabel: string | null
}

type PageProps = {
  auth: { user: { id: number; name: string; email: string } }
  stats: Stat[]
  nextSession: NextSession
  courseCards: CourseCard[]
  recentPayments: RecentPayment[]
  notificationCards: NotificationCard[]
}

const sessionImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlY_fflOk8b4YeMn779mLhATYxZZAqpH59rwl7QC-D8KCCULKVVWWcZPKoxe1CmBlq2K3xbEm3CHpj0-mIEUKgACUR2SCDWleM-Fa086xhaHMaY9iytf6F-OXQD9jhMt_un9NSr3R-tlEmThUnYWSLR5E7Jofz7N3LC7ScWwpkE7r8WcHsYmXHEIaC_axmMSLNpRpjMQmQzDgsgJpNeR3YQ__-RXM0Zy4RUh5DWyRzzwS8brf_AdbaCU43gMZCDiJkWeEk16loI5Pq'

function iconFor(stat: Stat['icon']) {
  if (stat === 'calendar') return 'calendar_month'
  if (stat === 'payment') return 'payments'
  if (stat === 'certificate') return 'military_tech'
  return 'school'
}

function firstName(name: string) {
  return name.split(' ').filter(Boolean)[0] ?? name
}

function todayLabel() {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date())
}

function notificationIcon(notification: NotificationCard) {
  if (notification.icon) return notification.icon
  if (notification.category?.toLowerCase().includes('payment')) return 'payments'
  if (notification.category?.toLowerCase().includes('security')) return 'vpn_key'
  return 'school'
}

export default function Dashboard() {
  const { props } = usePage<PageProps>()
  const { auth, stats = [], nextSession, courseCards = [], recentPayments = [], notificationCards = [] } = props
  const greeting = new Date().getHours() < 12 ? 'Bonjour' : new Date().getHours() < 18 ? 'Bon apres-midi' : 'Bonsoir'
  const unreadCount = notificationCards.filter(item => !item.isRead).length

  return (
    <AuthenticatedLayout header={<h2>Tableau de bord</h2>}>
      <Head title="Dashboard etudiant" />

      <main className="sdb-root">
        <section className="sdb-hero">
          <div>
            <h1>{greeting}, {firstName(auth.user.name)}</h1>
            <p>
              C'est un plaisir de vous revoir. Vous avez {stats[1]?.value ?? '0'} seance(s) a venir
              {unreadCount > 0 ? ` et ${unreadCount} nouvelle(s) notification(s).` : '.'}
            </p>
          </div>
          <div className="sdb-today">
            <span>Aujourd'hui</span>
            <strong>{todayLabel()}</strong>
          </div>
        </section>

        <section className="sdb-stats">
          {stats.map(stat => (
            <article className="sdb-stat" key={stat.label}>
              <div>
                <span className="material-symbols-outlined">{iconFor(stat.icon)}</span>
                <small>{stat.label}</small>
              </div>
              <strong>{stat.value}</strong>
              <p>{stat.sub}</p>
            </article>
          ))}
        </section>

        <div className="sdb-grid">
          <div className="sdb-left">
            <section className="sdb-panel sdb-session">
              <div className="sdb-panel-head">
                <h2>Prochaine Seance</h2>
                <Link href={route('student.schedule')}>Voir le calendrier</Link>
              </div>

              {nextSession ? (
                <div className="sdb-session-body">
                  <div className="sdb-session-media">
                    <img src={sessionImage} alt="" />
                  </div>
                  <div className="sdb-session-copy">
                    <div className="sdb-chips">
                      <span>{nextSession.category}</span>
                      <span>{nextSession.room ?? 'Salle a confirmer'}</span>
                    </div>
                    <h3>{nextSession.title}</h3>
                    <div className="sdb-session-meta">
                      <span><i className="material-symbols-outlined">event</i>{nextSession.date ?? 'Date a confirmer'}</span>
                      <span><i className="material-symbols-outlined">schedule</i>{nextSession.time ?? 'Horaire a confirmer'}</span>
                      <span><i className="material-symbols-outlined">groups</i>{nextSession.group ?? 'Groupe standard'}</span>
                    </div>
                    <Link className="sdb-primary" href={route('student.schedule')}>Consulter le planning</Link>
                  </div>
                </div>
              ) : (
                <div className="sdb-empty">Aucune seance programmee pour le moment.</div>
              )}
            </section>

            <section className="sdb-panel">
              <div className="sdb-panel-head">
                <h2>Paiements Recents</h2>
                <Link href={route('student.payment')}>Voir l'historique</Link>
              </div>
              <div className="sdb-table-wrap">
                {recentPayments.length > 0 ? (
                  <table className="sdb-table">
                    <thead>
                      <tr>
                        <th>ID Transaction</th>
                        <th>Description</th>
                        <th>Date</th>
                        <th>Montant</th>
                        <th>Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentPayments.map(payment => (
                        <tr key={payment.reference}>
                          <td>{payment.reference}</td>
                          <td>{payment.course}</td>
                          <td>{payment.date}</td>
                          <td className="sdb-amount">{payment.amount}</td>
                          <td>
                            <span className={`sdb-status ${payment.status === 'paid' ? 'sdb-status--paid' : 'sdb-status--pending'}`}>
                              {payment.status === 'paid' ? 'Paye' : 'En attente'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="sdb-empty">Aucun paiement enregistre.</div>
                )}
              </div>
            </section>
          </div>

          <aside className="sdb-right">
            <section className="sdb-panel">
              <div className="sdb-panel-head sdb-panel-head--plain">
                <h2>Mes Formations</h2>
              </div>
              <div className="sdb-course-list">
                {courseCards.length > 0 ? courseCards.map(course => (
                  <article className="sdb-course" key={course.title}>
                    <div>
                      <h3>{course.title}</h3>
                      <strong>{course.progress}%</strong>
                    </div>
                    <span>{course.category}</span>
                    <div className="sdb-track"><i style={{ width: `${course.progress}%` }} /></div>
                    <Link href={route('student.courses')}>Reprendre le cours</Link>
                  </article>
                )) : (
                  <div className="sdb-empty">Aucune formation inscrite.</div>
                )}
              </div>
              <div className="sdb-panel-foot">
                <Link href={route('student.courses')}>Parcourir le catalogue</Link>
              </div>
            </section>

            <section className="sdb-panel">
              <div className="sdb-panel-head sdb-panel-head--plain">
                <h2>Notifications</h2>
                {unreadCount > 0 && <span className="sdb-dot" />}
              </div>
              <div className="sdb-notif-list">
                {notificationCards.length > 0 ? notificationCards.map((notification, index) => (
                  <article className="sdb-notif" key={`${notification.title}-${index}`}>
                    <div className="sdb-notif-icon">
                      <span className="material-symbols-outlined">{notificationIcon(notification)}</span>
                    </div>
                    <div>
                      <h3>{notification.title}</h3>
                      <p>{notification.message}</p>
                      <small>{notification.timeLabel ?? 'Recemment'}</small>
                    </div>
                  </article>
                )) : (
                  <div className="sdb-empty">Aucune notification pour le moment.</div>
                )}
              </div>
              <div className="sdb-panel-foot">
                <Link href={route('student.notifications')}>Toutes les notifications</Link>
              </div>
            </section>
          </aside>
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');
        .material-symbols-outlined { font-family:'Material Symbols Outlined'; font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24; line-height:1; }
        .sdb-root { --bg:#faf5ee; --surface:#fff; --surface-low:#f6f0e8; --line:#d8d0c8; --line-soft:rgba(216,208,200,.6); --text:#3a302a; --muted:#605850; --primary:#c2652a; --primary-soft:#fbe8d8; min-height:100%; padding:40px 32px 56px; background:var(--bg); color:var(--text); font-family:'Manrope',sans-serif; }
        .sdb-root *, .sdb-root *::before, .sdb-root *::after { box-sizing:border-box; }
        .sdb-hero { display:flex; align-items:flex-end; justify-content:space-between; gap:24px; margin-bottom:34px; }
        .sdb-hero h1 { margin:0 0 8px; font-family:'EB Garamond',serif; font-size:clamp(2.6rem,5vw,4.4rem); font-weight:500; line-height:.98; color:var(--text); }
        .sdb-hero p { max-width:620px; margin:0; color:#78716c; line-height:1.75; font-weight:500; }
        .sdb-today { text-align:right; flex-shrink:0; }
        .sdb-today span { display:block; color:var(--primary); font-size:.7rem; font-weight:900; letter-spacing:.18em; text-transform:uppercase; margin-bottom:5px; }
        .sdb-today strong { display:block; color:var(--text); font-family:'EB Garamond',serif; font-size:1.55rem; font-weight:500; text-transform:capitalize; }
        .sdb-stats { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:18px; margin-bottom:34px; }
        .sdb-stat { border:1px solid var(--line-soft); border-radius:12px; background:#fff; padding:22px; box-shadow:0 2px 16px rgba(58,48,42,.04); transition:transform .18s; }
        .sdb-stat:hover { transform:translateY(-2px); }
        .sdb-stat div { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:14px; }
        .sdb-stat .material-symbols-outlined { padding:9px; border-radius:8px; background:var(--primary-soft); color:var(--primary); }
        .sdb-stat small { color:#9a9088; font-size:.62rem; font-weight:900; letter-spacing:.13em; text-transform:uppercase; }
        .sdb-stat strong { display:block; color:var(--text); font-family:'EB Garamond',serif; font-size:2.35rem; line-height:1; }
        .sdb-stat p { margin:7px 0 0; color:#78716c; font-size:.78rem; }
        .sdb-grid { display:grid; grid-template-columns:minmax(0,2fr) minmax(320px,1fr); gap:26px; align-items:start; }
        .sdb-left, .sdb-right { display:flex; flex-direction:column; gap:26px; min-width:0; }
        .sdb-panel { border:1px solid var(--line-soft); border-radius:12px; background:#fff; overflow:hidden; box-shadow:0 2px 16px rgba(58,48,42,.04); }
        .sdb-panel-head { display:flex; align-items:center; justify-content:space-between; gap:14px; padding:22px 24px; border-bottom:1px solid var(--line-soft); }
        .sdb-panel-head h2 { margin:0; color:var(--text); font-family:'EB Garamond',serif; font-size:1.8rem; font-weight:600; }
        .sdb-panel-head a, .sdb-panel-foot a { color:var(--primary); font-size:.72rem; font-weight:900; text-transform:uppercase; letter-spacing:.1em; text-decoration:none; }
        .sdb-panel-head a:hover, .sdb-panel-foot a:hover { text-decoration:underline; }
        .sdb-panel-head--plain { border-bottom-color:rgba(216,208,200,.45); }
        .sdb-session-body { display:grid; grid-template-columns:210px minmax(0,1fr); gap:28px; padding:28px; align-items:center; }
        .sdb-session-media { height:210px; border-radius:10px; overflow:hidden; position:relative; background:var(--primary-soft); }
        .sdb-session-media img { width:100%; height:100%; object-fit:cover; transition:transform .6s; }
        .sdb-session:hover .sdb-session-media img { transform:scale(1.04); }
        .sdb-chips { display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:12px; }
        .sdb-chips span { display:inline-flex; border-radius:5px; padding:5px 8px; background:#fff7ed; color:var(--primary); font-size:.62rem; font-weight:900; letter-spacing:.1em; text-transform:uppercase; }
        .sdb-chips span + span { background:#f5f5f4; color:#78716c; }
        .sdb-session-copy h3 { max-width:560px; margin:0 0 18px; color:var(--text); font-family:'EB Garamond',serif; font-size:2.25rem; line-height:1.05; }
        .sdb-session-meta { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px 18px; color:#78716c; font-size:.86rem; }
        .sdb-session-meta span { display:flex; align-items:center; gap:7px; min-width:0; }
        .sdb-session-meta i { color:var(--primary); font-size:18px; flex-shrink:0; }
        .sdb-primary { min-height:42px; margin-top:26px; display:inline-flex; align-items:center; justify-content:center; border-radius:8px; background:var(--primary); color:#fff; padding:0 22px; font-size:.82rem; font-weight:900; text-decoration:none; box-shadow:0 14px 28px rgba(194,101,42,.18); }
        .sdb-primary:hover { opacity:.9; }
        .sdb-table-wrap { overflow-x:auto; }
        .sdb-table { width:100%; min-width:760px; border-collapse:collapse; text-align:left; }
        .sdb-table th { padding:15px 24px; background:rgba(246,240,232,.55); color:#9a9088; font-size:.62rem; font-weight:900; letter-spacing:.16em; text-transform:uppercase; }
        .sdb-table td { padding:17px 24px; border-top:1px solid var(--line-soft); color:#78716c; font-size:.86rem; }
        .sdb-table tbody tr:hover { background:rgba(246,240,232,.35); }
        .sdb-amount { color:var(--text) !important; font-weight:900; text-align:right; }
        .sdb-status { display:inline-flex; align-items:center; border-radius:999px; padding:4px 9px; font-size:.6rem; font-weight:900; letter-spacing:.12em; text-transform:uppercase; white-space:nowrap; }
        .sdb-status--paid { background:#f0fdf4; color:#047857; }
        .sdb-status--pending { background:#fff7ed; color:#c2652a; }
        .sdb-course-list { padding:22px 24px; display:flex; flex-direction:column; gap:22px; }
        .sdb-course h3 { margin:0; color:var(--text); font-size:.92rem; font-weight:900; }
        .sdb-course > div:first-child { display:flex; justify-content:space-between; gap:14px; align-items:center; }
        .sdb-course strong { color:var(--primary); font-size:.82rem; }
        .sdb-course span { display:block; margin-top:4px; color:#9a9088; font-size:.72rem; font-weight:800; }
        .sdb-track { height:7px; border-radius:999px; overflow:hidden; background:#f2ece4; margin:12px 0; }
        .sdb-track i { display:block; height:100%; background:var(--primary); border-radius:inherit; }
        .sdb-course a { width:100%; min-height:36px; display:flex; align-items:center; justify-content:center; border:1px solid var(--line-soft); border-radius:6px; color:#78716c; text-decoration:none; font-size:.64rem; font-weight:900; letter-spacing:.14em; text-transform:uppercase; }
        .sdb-course a:hover { background:#faf8f5; color:var(--primary); }
        .sdb-panel-foot { padding:15px; border-top:1px solid var(--line-soft); background:rgba(246,240,232,.45); text-align:center; }
        .sdb-dot { width:8px; height:8px; border-radius:999px; background:var(--primary); }
        .sdb-notif-list { display:flex; flex-direction:column; }
        .sdb-notif { display:grid; grid-template-columns:42px minmax(0,1fr); gap:13px; padding:18px 20px; border-top:1px solid var(--line-soft); }
        .sdb-notif:first-child { border-top:0; }
        .sdb-notif:hover { background:#faf8f5; }
        .sdb-notif-icon { width:42px; height:42px; border-radius:999px; display:flex; align-items:center; justify-content:center; background:#fff7ed; color:var(--primary); }
        .sdb-notif h3 { margin:0 0 5px; color:var(--text); font-size:.82rem; font-weight:900; }
        .sdb-notif p { margin:0; color:#78716c; font-size:.74rem; line-height:1.55; }
        .sdb-notif small { display:block; margin-top:8px; color:#aaa29a; font-size:.68rem; }
        .sdb-empty { padding:34px 20px; color:#9a9088; text-align:center; font-size:.86rem; }
        @media (max-width:1180px) { .sdb-stats { grid-template-columns:repeat(2,minmax(0,1fr)); } .sdb-grid { grid-template-columns:1fr; } }
        @media (max-width:760px) { .sdb-root { padding:24px 14px 40px; } .sdb-hero { align-items:flex-start; flex-direction:column; margin-bottom:24px; } .sdb-today { text-align:left; } .sdb-stats { grid-template-columns:1fr; } .sdb-panel-head { padding:18px; } .sdb-session-body { grid-template-columns:1fr; padding:18px; } .sdb-session-media { height:180px; } .sdb-session-copy h3 { font-size:1.75rem; } .sdb-session-meta { grid-template-columns:1fr; } .sdb-table { min-width:720px; } .sdb-course-list { padding:18px; } }
      `}</style>
    </AuthenticatedLayout>
  )
}
