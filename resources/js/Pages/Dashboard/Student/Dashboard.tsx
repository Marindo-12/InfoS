import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

type Stat = {
  label: string;
  value: string;
  sub: string;
  color: string;
  icon: 'formation' | 'calendar' | 'payment' | 'certificate';
};

type NextSession = {
  title: string;
  date: string | null;
  time: string | null;
  room: string | null;
} | null;

type CourseCard = {
  title: string;
  category: string;
  progress: number;
  description: string | null;
};

type RecentPayment = {
  course: string;
  amount: string;
  status: 'paid' | 'pending';
  date: string;
};

type NotificationCard = {
  title: string;
  message: string;
  category: string;
  timeLabel: string | null;
};

type PageProps = {
  auth: {
    user: {
      id: number;
      name: string;
      email: string;
    };
  };
  stats: Stat[];
  nextSession: NextSession;
  courseCards: CourseCard[];
  recentPayments: RecentPayment[];
  notificationCards: NotificationCard[];
};

function statIcon(icon: Stat['icon']) {
  if (icon === 'calendar') return <IconCalendar />;
  if (icon === 'payment') return <IconPayment />;
  if (icon === 'certificate') return <IconCert />;
  return <IconFormation />;
}

function StatCard({ label, value, sub, color, icon }: Stat) {
  return (
    <div className="db-stat-card">
      <div className="db-stat-icon-wrap" style={{ background: `${color}18`, color }}>
        {statIcon(icon)}
      </div>
      <div className="db-stat-body">
        <p className="db-stat-label">{label}</p>
        <p className="db-stat-value">{value}</p>
        <p className="db-stat-sub">{sub}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { props } = usePage<PageProps>();
  const { stats, nextSession, courseCards, recentPayments, notificationCards } = props;
  const user = props.auth.user;
  const firstName = user.name.split(' ')[0];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon apres-midi' : 'Bonsoir';

  return (
    <AuthenticatedLayout header={<h2>Tableau de bord</h2>}>
      <Head title="Dashboard" />

      <div className="db-root">
        <div className="db-welcome">
          <div className="db-welcome-text">
            <h1 className="db-welcome-title">
              {greeting}, <span>{firstName}</span>
            </h1>
            <p className="db-welcome-sub">
              Bienvenue sur votre espace personnel. Voici un apercu de votre activite et de vos prochaines priorites.
            </p>
          </div>
          <div className="db-welcome-date">
            <IconClock />
            <span>
              {new Date().toLocaleDateString('fr-MA', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>

        <div className="db-stats-grid">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        <div className="db-main-grid">
          <section className="db-section db-section--accent">
            <div className="db-section-header">
              <h3 className="db-section-title">Prochaine seance</h3>
              <span className="db-section-badge">A venir</span>
            </div>

            {nextSession ? (
              <div className="db-detail-card">
                <div className="db-detail-icon">
                  <IconCalendar />
                </div>
                <div>
                  <p className="db-detail-title">{nextSession.title}</p>
                  <p className="db-detail-text">{nextSession.date}</p>
                  <p className="db-detail-meta">
                    {nextSession.time} · {nextSession.room ?? 'Salle a confirmer'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="db-empty-card">
                <p>Aucune seance programmee pour le moment.</p>
              </div>
            )}
          </section>

          <section className="db-section">
            <div className="db-section-header">
              <h3 className="db-section-title">Mes formations</h3>
              <Link href={route('student.courses')} className="db-section-link">
                Voir tout <IconArrow />
              </Link>
            </div>

            <div className="db-list-stack">
              {courseCards.map((course) => (
                <div className="db-mini-card" key={course.title}>
                  <div className="db-mini-top">
                    <span className="db-mini-badge">{course.category}</span>
                    <strong>{course.progress}%</strong>
                  </div>
                  <p className="db-mini-title">{course.title}</p>
                  <p className="db-mini-text">{course.description ?? 'Description a venir.'}</p>
                  <div className="db-progress-track">
                    <div className="db-progress-fill" style={{ width: `${course.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="db-section">
            <div className="db-section-header">
              <h3 className="db-section-title">Paiements recents</h3>
              <Link href={route('student.payment')} className="db-section-link">
                Historique <IconArrow />
              </Link>
            </div>

            <div className="db-list-stack">
              {recentPayments.map((payment) => (
                <div className="db-mini-card" key={`${payment.course}-${payment.date}`}>
                  <div className="db-mini-top">
                    <span className={`db-mini-badge ${payment.status === 'paid' ? 'db-mini-badge--green' : ''}`}>
                      {payment.status === 'paid' ? 'Paye' : 'En attente'}
                    </span>
                    <strong>{payment.amount}</strong>
                  </div>
                  <p className="db-mini-title">{payment.course}</p>
                  <p className="db-mini-text">Operation enregistree le {payment.date}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="db-section">
            <div className="db-section-header">
              <h3 className="db-section-title">Notifications utiles</h3>
              <Link href={route('student.notifications')} className="db-section-link">
                Ouvrir <IconArrow />
              </Link>
            </div>

            <div className="db-list-stack">
              {notificationCards.map((notification) => (
                <div className="db-mini-card" key={`${notification.title}-${notification.timeLabel}`}>
                  <div className="db-mini-top">
                    <span className="db-mini-badge">{notification.category}</span>
                    <strong>{notification.timeLabel ?? 'Recemment'}</strong>
                  </div>
                  <p className="db-mini-title">{notification.title}</p>
                  <p className="db-mini-text">{notification.message}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');

        .db-root { display: flex; flex-direction: column; gap: 24px; font-family: 'Manrope', sans-serif; }
        .db-welcome {
          display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 12px;
          background: #fff; border-radius: 16px; padding: 24px 28px; border: 1px solid rgba(0,0,0,0.06);
          box-shadow: 0 1px 4px rgba(0,0,0,0.04); position: relative; overflow: hidden;
        }
        .db-welcome::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, #ff6b2b, #ff9a56, #ffb347);
        }
        .db-welcome-title { font-size: 1.35rem; font-weight: 800; color: #111; margin: 0 0 4px; letter-spacing: -.02em; }
        .db-welcome-title span { color: #ff6b2b; }
        .db-welcome-sub { font-size: .85rem; color: #888; margin: 0; max-width: 680px; }
        .db-welcome-date {
          display: flex; align-items: center; gap: 6px; font-size: .78rem; color: #aaa; font-weight: 500; white-space: nowrap;
        }
        .db-stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        @media (max-width: 1023px) { .db-stats-grid { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 479px) { .db-stats-grid { grid-template-columns: 1fr; } }
        .db-stat-card {
          background: #fff; border-radius: 14px; border: 1px solid rgba(0,0,0,0.06); padding: 20px;
          display: flex; align-items: flex-start; gap: 14px; box-shadow: 0 1px 3px rgba(0,0,0,0.04);
          transition: transform .15s, box-shadow .15s;
        }
        .db-stat-card:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
        .db-stat-icon-wrap {
          width: 44px; height: 44px; border-radius: 11px; flex-shrink: 0; display: flex; align-items: center; justify-content: center;
        }
        .db-stat-body { min-width: 0; }
        .db-stat-label { font-size: .75rem; font-weight: 600; color: #888; margin: 0 0 4px; text-transform: uppercase; letter-spacing: .06em; }
        .db-stat-value { font-size: 1.45rem; font-weight: 800; color: #111; margin: 0 0 2px; letter-spacing: -.03em; line-height: 1; }
        .db-stat-sub { font-size: .72rem; color: #bbb; margin: 0; }
        .db-main-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
        @media (max-width: 767px) { .db-main-grid { grid-template-columns: 1fr; } }
        .db-section {
          background: #fff; border-radius: 16px; border: 1px solid rgba(0,0,0,0.06); padding: 22px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04); display: flex; flex-direction: column; gap: 16px;
        }
        .db-section--accent { border-top: 3px solid #ff6b2b; }
        .db-section-header { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
        .db-section-title { font-size: .9rem; font-weight: 700; color: #111; margin: 0; }
        .db-section-badge {
          font-size: .68rem; font-weight: 700; text-transform: uppercase; letter-spacing: .08em;
          background: rgba(255,107,43,.1); color: #ff6b2b; border-radius: 99px; padding: 2px 9px;
        }
        .db-section-link {
          display: inline-flex; align-items: center; gap: 4px; font-size: .78rem; font-weight: 600; color: #ff6b2b; text-decoration: none;
          transition: gap .15s;
        }
        .db-section-link:hover { gap: 7px; }
        .db-detail-card, .db-mini-card, .db-empty-card {
          border-radius: 14px; border: 1px solid rgba(0,0,0,0.06); background: #fafafa;
        }
        .db-detail-card {
          display: flex; gap: 14px; padding: 18px; align-items: flex-start;
        }
        .db-detail-icon {
          width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center;
          background: rgba(255,107,43,.1); color: #ff6b2b; flex-shrink: 0;
        }
        .db-detail-title, .db-mini-title { margin: 0; color: #151515; font-weight: 800; }
        .db-detail-title { font-size: .95rem; }
        .db-detail-text, .db-detail-meta, .db-mini-text {
          margin: 6px 0 0; color: #777; font-size: .8rem; line-height: 1.6;
        }
        .db-empty-card {
          padding: 24px 18px; text-align: center; color: #888; font-size: .84rem;
        }
        .db-list-stack { display: flex; flex-direction: column; gap: 12px; }
        .db-mini-card { padding: 16px; }
        .db-mini-top { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 8px; }
        .db-mini-badge {
          display: inline-flex; align-items: center; padding: 5px 9px; border-radius: 999px;
          background: rgba(255,107,43,.1); color: #ff6b2b; font-size: .65rem; font-weight: 800; text-transform: uppercase; letter-spacing: .08em;
        }
        .db-mini-badge--green { background: rgba(16,185,129,.12); color: #10b981; }
        .db-mini-top strong { font-size: .78rem; color: #666; }
        .db-progress-track {
          width: 100%; height: 9px; border-radius: 999px; overflow: hidden; background: #ece8e4; margin-top: 12px;
        }
        .db-progress-fill { height: 100%; border-radius: inherit; background: linear-gradient(90deg, #ff9a56, #ff6b2b); }
      `}</style>
    </AuthenticatedLayout>
  );
}

function IconFormation() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
}
function IconCalendar() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
}
function IconPayment() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>;
}
function IconCert() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>;
}
function IconArrow() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>;
}
function IconClock() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
}
