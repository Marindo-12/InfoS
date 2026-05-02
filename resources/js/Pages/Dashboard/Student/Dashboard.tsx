import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

/* ═══════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════ */

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
  auth: { user: { id: number; name: string; email: string } };
  stats: Stat[];
  nextSession: NextSession;
  courseCards: CourseCard[];
  recentPayments: RecentPayment[];
  notificationCards: NotificationCard[];
};

/* ═══════════════════════════════════════════════
   ICONS
═══════════════════════════════════════════════ */

const IconFormation = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
);
const IconCalendar = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const IconPayment = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
  </svg>
);
const IconCert = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
  </svg>
);
const IconArrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>
  </svg>
);
const IconClock = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const IconMapPin = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const IconBell = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);

const statIcon = (icon: Stat['icon']) => {
  if (icon === 'calendar')    return <IconCalendar />;
  if (icon === 'payment')     return <IconPayment />;
  if (icon === 'certificate') return <IconCert />;
  return <IconFormation />;
};

/* ═══════════════════════════════════════════════
   HERO ILLUSTRATION — inline SVG scene
═══════════════════════════════════════════════ */

const HeroIllustration = () => (
  <svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg"
    className="db-hero-svg" aria-hidden="true">
    {/* Desk */}
    <rect x="40" y="140" width="240" height="10" rx="5" fill="rgba(255,255,255,0.15)"/>
    {/* Monitor stand */}
    <rect x="148" y="110" width="24" height="32" rx="3" fill="rgba(255,255,255,0.18)"/>
    {/* Monitor */}
    <rect x="90" y="55" width="140" height="88" rx="8" fill="rgba(255,255,255,0.22)"/>
    <rect x="96" y="61" width="128" height="72" rx="5" fill="rgba(255,255,255,0.1)"/>
    {/* Screen content — chart bars */}
    <rect x="108" y="108" width="10" height="18" rx="2" fill="#ff9a56" opacity="0.9"/>
    <rect x="122" y="100" width="10" height="26" rx="2" fill="#ff6b2b" opacity="0.9"/>
    <rect x="136" y="90"  width="10" height="36" rx="2" fill="#ff9a56" opacity="0.9"/>
    <rect x="150" y="98"  width="10" height="28" rx="2" fill="#ff6b2b" opacity="0.9"/>
    <rect x="164" y="85"  width="10" height="41" rx="2" fill="#ff9a56" opacity="0.9"/>
    <rect x="178" y="93"  width="10" height="33" rx="2" fill="#ff6b2b" opacity="0.9"/>
    <rect x="192" y="80"  width="10" height="46" rx="2" fill="#ffb347" opacity="0.9"/>
    {/* Screen top bar */}
    <rect x="96" y="61" width="128" height="10" rx="3" fill="rgba(255,255,255,0.15)"/>
    <circle cx="103" cy="66" r="2.5" fill="rgba(255,255,255,0.5)"/>
    <circle cx="111" cy="66" r="2.5" fill="rgba(255,255,255,0.35)"/>
    <circle cx="119" cy="66" r="2.5" fill="rgba(255,255,255,0.25)"/>
    {/* Book stack left */}
    <rect x="44" y="120" width="34" height="6"  rx="3" fill="rgba(255,255,255,0.28)"/>
    <rect x="47" y="114" width="28" height="6"  rx="3" fill="rgba(255,255,255,0.22)"/>
    <rect x="50" y="108" width="22" height="6"  rx="3" fill="rgba(255,255,255,0.16)"/>
    {/* Pencil */}
    <line x1="258" y1="128" x2="272" y2="112" stroke="rgba(255,255,255,0.55)" strokeWidth="3" strokeLinecap="round"/>
    <polygon points="258,128 263,122 268,127" fill="rgba(255,255,255,0.4)"/>
    {/* Certificate badge */}
    <circle cx="275" cy="80" r="18" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
    <path d="M268 80l4 4 8-8" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    {/* Floating dots */}
    <circle cx="60"  cy="70"  r="4" fill="rgba(255,255,255,0.2)"/>
    <circle cx="50"  cy="90"  r="2.5" fill="rgba(255,255,255,0.15)"/>
    <circle cx="285" cy="130" r="3"   fill="rgba(255,255,255,0.2)"/>
    <circle cx="300" cy="110" r="2"   fill="rgba(255,255,255,0.15)"/>
    {/* Stars */}
    {[[72,50],[280,60],[55,155],[295,150]].map(([x,y],i) => (
      <g key={i} transform={`translate(${x},${y})`}>
        <line x1="0" y1="-5" x2="0" y2="5" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" strokeLinecap="round"/>
        <line x1="-5" y1="0" x2="5" y2="0" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" strokeLinecap="round"/>
      </g>
    ))}
    {/* Wave bottom */}
    <path d="M0 175 Q80 160 160 170 Q240 180 320 165 L320 200 L0 200 Z" fill="rgba(0,0,0,0.08)"/>
  </svg>
);

/* ═══════════════════════════════════════════════
   SECTION ILLUSTRATIONS — small inline SVGs
═══════════════════════════════════════════════ */

const IlluSession = () => (
  <svg viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg" width="80" height="60" aria-hidden="true">
    <rect x="8"  y="8"  width="64" height="44" rx="6" fill="#fff3eb" stroke="#ffe0cc" strokeWidth="1"/>
    <rect x="8"  y="8"  width="64" height="12" rx="6" fill="#ff9a56" opacity=".6"/>
    <rect x="8"  y="14" width="64" height="6"  fill="#ff9a56" opacity=".6"/>
    {[0,1,2,3].map(i => (
      <rect key={i} x={16+i*14} y="10" width="8" height="8" rx="2" fill="rgba(255,255,255,.7)"/>
    ))}
    {[[16,28],[30,28],[44,28],[58,28],[16,38],[30,38],[44,38]].map(([x,y],i)=>(
      <rect key={i} x={x} y={y} width="10" height="8" rx="2" fill="#ff6b2b" opacity={i<3?0.7:0.25}/>
    ))}
  </svg>
);

const IlluCourse = () => (
  <svg viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg" width="80" height="60" aria-hidden="true">
    <rect x="6"  y="10" width="44" height="40" rx="4" fill="#fff3eb" stroke="#ffe0cc" strokeWidth="1"/>
    <rect x="6"  y="10" width="44" height="8"  rx="4" fill="#ff9a56" opacity=".5"/>
    <rect x="6"  y="14" width="44" height="4"  fill="#ff9a56" opacity=".5"/>
    {[22,30,38,46].map((y,i)=>(
      <rect key={i} x="12" y={y} width={28-i*4} height="3" rx="1.5" fill="#ff6b2b" opacity=".3"/>
    ))}
    <rect x="54" y="18" width="20" height="28" rx="4" fill="#fff3eb" stroke="#ffe0cc" strokeWidth="1"/>
    <rect x="54" y="18" width="20" height="6"  rx="4" fill="#ffb347" opacity=".5"/>
    <rect x="54" y="20" width="20" height="4"  fill="#ffb347" opacity=".5"/>
    {[28,34,40].map((y,i)=>(
      <rect key={i} x="57" y={y} width={12-i*3} height="2.5" rx="1.2" fill="#ff6b2b" opacity=".3"/>
    ))}
    {/* Progress arc */}
    <circle cx="64" cy="50" r="7" fill="none" stroke="#ffe0cc" strokeWidth="2"/>
    <path d="M64 43 A7 7 0 0 1 71 50" fill="none" stroke="#ff6b2b" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const IlluPayment = () => (
  <svg viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg" width="80" height="60" aria-hidden="true">
    <rect x="6" y="12" width="68" height="36" rx="6" fill="#fff3eb" stroke="#ffe0cc" strokeWidth="1"/>
    <rect x="6" y="12" width="68" height="12" rx="6" fill="#ff9a56" opacity=".5"/>
    <rect x="6" y="18" width="68" height="6"  fill="#ff9a56" opacity=".5"/>
    <rect x="12" y="30" width="16" height="10" rx="3" fill="#ff6b2b" opacity=".6"/>
    {[34,46,58].map((x,i)=>(
      <rect key={i} x={x} y="32" width={10-i} height="6" rx="2" fill="#ff6b2b" opacity={.3-.05*i}/>
    ))}
    {/* Coin */}
    <circle cx="66" cy="14" r="8" fill="#ffb347" opacity=".9" stroke="#ff9a56" strokeWidth="1"/>
    <text x="63" y="17.5" fontSize="8" fill="white" fontWeight="800" fontFamily="sans-serif">$</text>
  </svg>
);

const IlluNotif = () => (
  <svg viewBox="0 0 80 60" xmlns="http://www.w3.org/2000/svg" width="80" height="60" aria-hidden="true">
    {/* Bell */}
    <path d="M40 8 C32 8 26 14 26 22 C26 34 20 38 20 38 L60 38 C60 38 54 34 54 22 C54 14 48 8 40 8 Z"
      fill="#fff3eb" stroke="#ff9a56" strokeWidth="1.5"/>
    <rect x="36" y="38" width="8" height="5" rx="2.5" fill="#ff9a56" opacity=".7"/>
    {/* Notification dot */}
    <circle cx="54" cy="14" r="7" fill="#ff6b2b"/>
    <text x="51.5" y="17.5" fontSize="7" fill="white" fontWeight="800" fontFamily="sans-serif">3</text>
    {/* Wavy lines */}
    {[44,49,54].map((y,i)=>(
      <line key={i} x1="16" y1={y} x2={16+22-i*4} y2={y}
        stroke="#ff9a56" strokeWidth="1.5" strokeLinecap="round" opacity=".4"/>
    ))}
  </svg>
);

/* ═══════════════════════════════════════════════
   STAT CARD
═══════════════════════════════════════════════ */

function StatCard({ label, value, sub, color, icon }: Stat) {
  return (
    <div className="db-stat-card">
      <div className="db-stat-icon" style={{ background: `${color}18`, color }}>
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

/* ═══════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════ */

export default function Dashboard() {
  const { props } = usePage<PageProps>();
  const { stats = [], nextSession, courseCards = [], recentPayments = [], notificationCards = [] } = props;
  const user = props.auth.user;
  const firstName = user.name.split(' ')[0];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';

  const initials = user.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();

  return (
    <AuthenticatedLayout header={<h2>Tableau de bord</h2>}>
      <Head title="Dashboard" />

      <div className="db-root">

        {/* ══════════════════════════════════════
            HERO — gradient card with illustration
        ══════════════════════════════════════ */}
        <div className="db-hero">
          {/* Noise/texture overlay */}
          <div className="db-hero-noise" aria-hidden="true" />

          {/* Floating rings */}
          <div className="db-hero-ring db-hero-ring-1" aria-hidden="true" />
          <div className="db-hero-ring db-hero-ring-2" aria-hidden="true" />

          <div className="db-hero-content">
            {/* Avatar + greeting */}
            <div className="db-hero-left">
              <div className="db-hero-avatar">{initials}</div>
              <div>
                <p className="db-hero-greeting">{greeting} 👋</p>
                <h1 className="db-hero-name">{user.name}</h1>
                <p className="db-hero-sub">
                  Bienvenue sur votre espace personnel. Voici vos priorités du jour.
                </p>
                <div className="db-hero-date">
                  <IconClock />
                  {new Date().toLocaleDateString('fr-MA', {
                    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </div>
              </div>
            </div>

            {/* Quick badges */}
            <div className="db-hero-badges">
              {nextSession && (
                <div className="db-hero-badge">
                  <span className="db-hero-badge-dot" />
                  <span>Séance : {nextSession.date}</span>
                </div>
              )}
              <div className="db-hero-badge db-hero-badge--soft">
                <IconBell />
                <span>{notificationCards.length > 0 ? `${notificationCards.length} notification(s)` : 'Aucune notification'}</span>
              </div>
            </div>
          </div>

          {/* Illustration */}
          <div className="db-hero-illus-wrap" aria-hidden="true">
            <HeroIllustration />
          </div>
        </div>

        {/* ══════════════════════════════════════
            STATS
        ══════════════════════════════════════ */}
        {stats.length > 0 && (
          <div className="db-stats-grid">
            {stats.map((stat) => <StatCard key={stat.label} {...stat} />)}
          </div>
        )}

        {/* ══════════════════════════════════════
            MAIN GRID
        ══════════════════════════════════════ */}
        <div className="db-main-grid">

          {/* Prochaine séance */}
          <section className="db-section">
            <div className="db-section-head">
              <div className="db-section-head-text">
                <h3 className="db-section-title">Prochaine séance</h3>
                <p className="db-section-sub">Votre prochain rendez-vous de formation</p>
              </div>
              <div className="db-section-illus"><IlluSession /></div>
            </div>

            {nextSession ? (
              <div className="db-detail-card">
                <div className="db-detail-icon"><IconCalendar /></div>
                <div>
                  <p className="db-detail-title">{nextSession.title}</p>
                  <div className="db-detail-metas">
                    <span><IconClock /> {nextSession.date}</span>
                    {nextSession.time && <span>· {nextSession.time}</span>}
                    {nextSession.room && <span><IconMapPin /> {nextSession.room}</span>}
                  </div>
                </div>
                <span className="db-badge db-badge--orange">À venir</span>
              </div>
            ) : (
              <div className="db-empty">
                <p>Aucune séance programmée pour le moment.</p>
              </div>
            )}
          </section>

          {/* Mes formations */}
          <section className="db-section">
            <div className="db-section-head">
              <div className="db-section-head-text">
                <h3 className="db-section-title">Mes formations</h3>
                <p className="db-section-sub">Progression en temps réel</p>
              </div>
              <div className="db-section-illus"><IlluCourse /></div>
            </div>

            <div className="db-section-action">
              <Link href={route('student.courses')} className="db-link">
                Voir tout <IconArrow />
              </Link>
            </div>

            <div className="db-list">
              {courseCards.length > 0 ? courseCards.map((course) => (
                <div key={course.title} className="db-mini-card">
                  <div className="db-mini-top">
                    <span className="db-badge db-badge--orange">{course.category}</span>
                    <span className="db-mini-pct">{course.progress}%</span>
                  </div>
                  <p className="db-mini-title">{course.title}</p>
                  <p className="db-mini-text">{course.description ?? 'Description à venir.'}</p>
                  <div className="db-track">
                    <div className="db-track-fill" style={{ width: `${course.progress}%` }} />
                  </div>
                </div>
              )) : (
                <div className="db-empty"><p>Aucune formation inscrite.</p></div>
              )}
            </div>
          </section>

          {/* Paiements récents */}
          <section className="db-section">
            <div className="db-section-head">
              <div className="db-section-head-text">
                <h3 className="db-section-title">Paiements récents</h3>
                <p className="db-section-sub">Dernières transactions enregistrées</p>
              </div>
              <div className="db-section-illus"><IlluPayment /></div>
            </div>

            <div className="db-section-action">
              <Link href={route('student.payment')} className="db-link">
                Historique <IconArrow />
              </Link>
            </div>

            <div className="db-list">
              {recentPayments.length > 0 ? recentPayments.map((p) => (
                <div key={`${p.course}-${p.date}`} className="db-mini-card">
                  <div className="db-mini-top">
                    <span className={`db-badge ${p.status === 'paid' ? 'db-badge--green' : 'db-badge--gray'}`}>
                      {p.status === 'paid' ? 'Payé' : 'En attente'}
                    </span>
                    <span className="db-mini-amount">{p.amount}</span>
                  </div>
                  <p className="db-mini-title">{p.course}</p>
                  <p className="db-mini-text">Opération enregistrée le {p.date}</p>
                </div>
              )) : (
                <div className="db-empty"><p>Aucun paiement enregistré.</p></div>
              )}
            </div>
          </section>

          {/* Notifications */}
          <section className="db-section">
            <div className="db-section-head">
              <div className="db-section-head-text">
                <h3 className="db-section-title">Notifications</h3>
                <p className="db-section-sub">Messages et alertes récentes</p>
              </div>
              <div className="db-section-illus"><IlluNotif /></div>
            </div>

            <div className="db-section-action">
              <Link href={route('student.notifications')} className="db-link">
                Tout voir <IconArrow />
              </Link>
            </div>

            <div className="db-list">
              {notificationCards.length > 0 ? notificationCards.map((n, i) => (
                <div key={i} className="db-mini-card">
                  <div className="db-mini-top">
                    <span className="db-badge db-badge--blue">{n.category}</span>
                    <span className="db-mini-time">{n.timeLabel ?? 'Récemment'}</span>
                  </div>
                  <p className="db-mini-title">{n.title}</p>
                  <p className="db-mini-text">{n.message}</p>
                </div>
              )) : (
                <div className="db-empty"><p>Aucune notification pour le moment.</p></div>
              )}
            </div>
          </section>

        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');

        .db-root {
          display: flex; flex-direction: column; gap: 20px;
          font-family: 'Manrope', sans-serif; width: 100%; min-width: 0;
        }
        .db-root *, .db-root *::before, .db-root *::after { box-sizing: border-box; }

        /* ══ HERO ══ */
        .db-hero {
          position: relative;
          border-radius: 22px;
          overflow: hidden;
          background: linear-gradient(135deg, #1a0a00 0%, #4a1800 30%, #ff6b2b 80%, #ffb347 100%);
          padding: 32px 36px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          min-height: 180px;
        }

        /* Subtle noise texture overlay */
        .db-hero-noise {
          position: absolute; inset: 0; pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          background-size: 200px;
          opacity: 0.4;
        }

        /* Floating rings */
        .db-hero-ring {
          position: absolute; border-radius: 50%; pointer-events: none;
          border: 1px solid rgba(255,255,255,0.10);
        }
        .db-hero-ring-1 { width: 350px; height: 350px; top: -120px; right: 80px; }
        .db-hero-ring-2 { width: 200px; height: 200px; top: -60px;  right: 180px; border-color: rgba(255,255,255,0.06); }

        .db-hero-content {
          position: relative; z-index: 2;
          display: flex; align-items: flex-start; gap: 18px; flex: 1;
          flex-wrap: wrap;
        }
        .db-hero-avatar {
          width: 52px; height: 52px; border-radius: 14px; flex-shrink: 0;
          background: rgba(255,255,255,0.18);
          border: 2px solid rgba(255,255,255,0.3);
          display: flex; align-items: center; justify-content: center;
          font-size: .9rem; font-weight: 800; color: #fff; letter-spacing: .04em;
          backdrop-filter: blur(8px);
        }
        .db-hero-greeting { margin: 0 0 2px; font-size: .82rem; color: rgba(255,255,255,.7); font-weight: 500; }
        .db-hero-name     { margin: 0 0 6px; font-size: 1.35rem; font-weight: 800; color: #fff; letter-spacing: -.02em; }
        .db-hero-sub      { margin: 0 0 12px; font-size: .82rem; color: rgba(255,255,255,.65); line-height: 1.5; max-width: 360px; }
        .db-hero-date {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: .74rem; color: rgba(255,255,255,.55); font-weight: 500;
        }
        .db-hero-badges {
          position: relative; z-index: 2;
          display: flex; flex-direction: column; gap: 8px; align-self: center;
        }
        .db-hero-badge {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 8px 14px; border-radius: 99px;
          background: rgba(255,255,255,0.14);
          border: 1px solid rgba(255,255,255,0.18);
          backdrop-filter: blur(8px);
          color: #fff; font-size: .78rem; font-weight: 600;
          white-space: nowrap;
        }
        .db-hero-badge--soft { background: rgba(0,0,0,0.2); border-color: rgba(255,255,255,0.1); color: rgba(255,255,255,.8); }
        .db-hero-badge-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: #4ade80; box-shadow: 0 0 0 3px rgba(74,222,128,.25);
          flex-shrink: 0;
        }

        /* Illustration */
        .db-hero-illus-wrap {
          position: absolute; right: 0; top: 0; bottom: 0;
          width: 320px; pointer-events: none; opacity: .9;
          display: flex; align-items: flex-end;
        }
        .db-hero-svg { width: 100%; height: 100%; }

        /* ══ STATS ══ */
        .db-stats-grid {
          display: grid; grid-template-columns: repeat(4,1fr); gap: 14px;
        }
        @media (max-width: 1024px) { .db-stats-grid { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 480px)  { .db-stats-grid { grid-template-columns: 1fr; } }

        .db-stat-card {
          background: #fff; border-radius: 16px;
          border: 1px solid rgba(0,0,0,0.06);
          padding: 18px; display: flex; align-items: flex-start; gap: 14px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
          transition: transform .15s, box-shadow .15s;
        }
        .db-stat-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.08); }
        .db-stat-icon {
          width: 42px; height: 42px; border-radius: 11px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
        }
        .db-stat-body { min-width: 0; }
        .db-stat-label { font-size: .68rem; font-weight: 700; color: #999; margin: 0 0 3px; text-transform: uppercase; letter-spacing: .08em; }
        .db-stat-value { font-size: 1.5rem; font-weight: 800; color: #111; margin: 0 0 2px; letter-spacing: -.03em; line-height: 1; }
        .db-stat-sub   { font-size: .7rem; color: #bbb; margin: 0; }

        /* ══ MAIN GRID ══ */
        .db-main-grid {
          display: grid; grid-template-columns: repeat(2,1fr); gap: 16px;
        }
        @media (max-width: 768px) { .db-main-grid { grid-template-columns: 1fr; } }

        /* ══ SECTION ══ */
        .db-section {
          background: #fff; border-radius: 18px;
          border: 1px solid rgba(0,0,0,0.06);
          padding: 0; overflow: hidden;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
          display: flex; flex-direction: column; gap: 0;
        }

        /* Section head — gradient mini-banner with illustration */
        .db-section-head {
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 20px 14px;
          background: linear-gradient(120deg, #fff9f5 0%, #fff4eb 100%);
          border-bottom: 1px solid rgba(255,107,43,0.10);
        }
        .db-section-head-text { flex: 1; }
        .db-section-title { margin: 0 0 2px; font-size: .92rem; font-weight: 800; color: #111; }
        .db-section-sub   { margin: 0; font-size: .74rem; color: #aaa; }
        .db-section-illus { flex-shrink: 0; opacity: .85; }

        .db-section-action {
          padding: 10px 20px 0;
          display: flex; justify-content: flex-end;
        }
        .db-link {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: .76rem; font-weight: 700; color: #ff6b2b;
          text-decoration: none; transition: gap .15s;
        }
        .db-link:hover { gap: 7px; }

        /* ══ CARDS ══ */
        .db-list { padding: 12px 16px 16px; display: flex; flex-direction: column; gap: 10px; }

        .db-detail-card {
          margin: 0 16px 16px;
          display: flex; align-items: flex-start; gap: 12px;
          padding: 14px; border-radius: 14px;
          background: #fafafa; border: 1px solid rgba(0,0,0,0.06);
        }
        .db-detail-icon {
          width: 40px; height: 40px; border-radius: 11px; flex-shrink: 0;
          background: rgba(255,107,43,.1); color: #ff6b2b;
          display: flex; align-items: center; justify-content: center;
        }
        .db-detail-title { margin: 0 0 5px; font-size: .9rem; font-weight: 800; color: #111; }
        .db-detail-metas {
          display: flex; align-items: center; flex-wrap: wrap; gap: 6px;
          font-size: .76rem; color: #888;
        }
        .db-detail-metas span { display: inline-flex; align-items: center; gap: 3px; }

        .db-mini-card {
          padding: 13px 14px; border-radius: 13px;
          background: #fafafa; border: 1px solid rgba(0,0,0,0.055);
        }
        .db-mini-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 7px; }
        .db-mini-title  { margin: 0 0 4px; font-size: .84rem; font-weight: 700; color: #111; }
        .db-mini-text   { margin: 0; font-size: .74rem; color: #888; line-height: 1.5; }
        .db-mini-pct    { font-size: .76rem; font-weight: 800; color: #ff6b2b; }
        .db-mini-amount { font-size: .78rem; font-weight: 800; color: #111; }
        .db-mini-time   { font-size: .72rem; color: #bbb; font-weight: 600; }

        .db-track {
          width: 100%; height: 6px; border-radius: 99px;
          background: #ece8e4; overflow: hidden; margin-top: 10px;
        }
        .db-track-fill {
          height: 100%; border-radius: inherit;
          background: linear-gradient(90deg, #ff9a56, #ff6b2b);
          transition: width .4s ease;
        }

        .db-empty {
          margin: 0 16px 16px; padding: 22px;
          text-align: center; color: #bbb; font-size: .82rem;
          border: 1.5px dashed #e8e3df; border-radius: 12px;
        }

        /* ══ BADGES ══ */
        .db-badge {
          display: inline-flex; align-items: center;
          padding: 4px 9px; border-radius: 99px;
          font-size: .63rem; font-weight: 800; text-transform: uppercase; letter-spacing: .07em;
          white-space: nowrap;
        }
        .db-badge--orange { background: rgba(255,107,43,.12); color: #ff6b2b; }
        .db-badge--green  { background: rgba(16,185,129,.12); color: #059669; }
        .db-badge--gray   { background: rgba(120,113,108,.12); color: #78716c; }
        .db-badge--blue   { background: rgba(59,130,246,.12);  color: #2563eb; }

        /* ══ RESPONSIVE HERO ══ */
        @media (max-width: 900px) {
          .db-hero-illus-wrap { display: none; }
          .db-hero { padding: 24px 24px; }
        }
        @media (max-width: 600px) {
          .db-hero { min-height: auto; padding: 22px 20px; }
          .db-hero-badges { display: none; }
          .db-hero-name { font-size: 1.15rem; }
        }
      `}</style>
    </AuthenticatedLayout>
  );
}