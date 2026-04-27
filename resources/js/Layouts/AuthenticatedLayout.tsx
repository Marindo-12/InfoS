import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useState } from 'react';
import logo from '../../../public/infos-logo.png'

/* ─────────────────────────────────────────────
   NAV ITEMS
───────────────────────────────────────────── */

interface NavItem {
  label: string;
  icon: ReactNode;
  route: string;
  routeName: string;
  badge?: number;
}

const IconDashboard = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
    <rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>
  </svg>
);
const IconFormations = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
);
const IconCalendar = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const IconPayments = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2"/>
    <line x1="2" y1="10" x2="22" y2="10"/>
  </svg>
);
const IconCertificates = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
  </svg>
);
const IconDocuments = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14,2 14,8 20,8"/><line x1="8" y1="13" x2="16" y2="13"/>
    <line x1="8" y1="17" x2="16" y2="17"/>
  </svg>
);
const IconResults = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);
const IconNotifications = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);
const IconProfile = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconLogout = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const IconChevron = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6"/>
  </svg>
);
const IconMenu = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);
const IconClose = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

/* ─────────────────────────────────────────────
   NAV SECTIONS
───────────────────────────────────────────── */

const NAV_MAIN: NavItem[] = [
  { label: 'Tableau de bord', icon: <IconDashboard />, route: route('student.dashboard'),     routeName: 'dashboard'     },
  { label: 'Mes Formations',  icon: <IconFormations />, route: route('student.courses'),    routeName: 'formations'    },
  { label: 'Planning',        icon: <IconCalendar />,   route: route('dashboard'),    routeName: 'planning'      },
  { label: 'Notes & Résultats', icon: <IconResults />,  route: route('dashboard'),   routeName: 'results'       },
];

const NAV_FINANCE: NavItem[] = [
  { label: 'Paiements',       icon: <IconPayments />,  route: route('student.payment'),    routeName: 'payments'      },
  { label: 'Certificats',     icon: <IconCertificates />, route: route('dashboard'), routeName: 'certificates'  },
  { label: 'Documents',       icon: <IconDocuments />, route: route('dashboard'),    routeName: 'documents'     },
];

const NAV_ACCOUNT: NavItem[] = [
  { label: 'Notifications',   icon: <IconNotifications />, route: route('student.notifications'), routeName: 'notifications', badge: 3 },
  { label: 'Mon Profil',      icon: <IconProfile />,    route: route('profile.edit'), routeName: 'profile.edit' },
];

/* ─────────────────────────────────────────────
   SIDEBAR LINK
───────────────────────────────────────────── */

function SideNavItem({
  item,
  active,
  collapsed,
}: {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
}) {
  return (
    <Link
      href={item.route}
      className={`dash-nav-item ${active ? 'dash-nav-item--active' : ''}`}
      title={collapsed ? item.label : undefined}
    >
      <span className="dash-nav-icon">{item.icon}</span>
      {!collapsed && (
        <>
          <span className="dash-nav-label">{item.label}</span>
          {item.badge != null && (
            <span className="dash-nav-badge">{item.badge}</span>
          )}
          {active && <span className="dash-nav-pip" aria-hidden="true" />}
        </>
      )}
      {collapsed && item.badge != null && (
        <span className="dash-nav-badge dash-nav-badge--dot" aria-label={`${item.badge} notifications`} />
      )}
    </Link>
  );
}

function SideNavSection({
  title,
  items,
  collapsed,
}: {
  title: string;
  items: NavItem[];
  collapsed: boolean;
}) {
  const { url } = usePage();
  return (
    <div className="dash-nav-section">
      {!collapsed && <p className="dash-nav-section-title">{title}</p>}
      {collapsed && <div className="dash-nav-section-divider" />}
      {items.map((item) => (
        <SideNavItem
          key={item.routeName}
          item={item}
          active={route().current(item.routeName)}
          collapsed={collapsed}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   LAYOUT
───────────────────────────────────────────── */

export default function Authenticated({
  header,
  children,
}: PropsWithChildren<{ header?: ReactNode }>) {
  const user = usePage().props.auth.user;
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials = user.name
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <div className="dash-root">

        {/* ── Mobile overlay ── */}
        {mobileOpen && (
          <div
            className="dash-overlay"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* ══════════════════════════════════════
            SIDEBAR
        ══════════════════════════════════════ */}
        <aside className={`dash-sidebar ${collapsed ? 'dash-sidebar--collapsed' : ''} ${mobileOpen ? 'dash-sidebar--open' : ''}`}>

          {/* Brand */}
          <div className="dash-brand">
            <Link href={route('home')} className="dash-brand-inner">
              <img src={logo} alt="Info Saloua" className="dash-brand-logo" />
              {!collapsed && <span className="dash-brand-name">Info Saloua</span>}
            </Link>
            <button
              onClick={() => setCollapsed((c) => !c)}
              className="dash-collapse-btn"
              aria-label={collapsed ? 'Développer' : 'Réduire'}
            >
              <IconChevron />
            </button>
          </div>

          {/* User card */}
          <div className={`dash-user-card ${collapsed ? 'dash-user-card--collapsed' : ''}`}>
            <div className="dash-avatar">{initials}</div>
            {!collapsed && (
              <div className="dash-user-info">
                <p className="dash-user-name">{user.name}</p>
                <p className="dash-user-email">{user.email}</p>
              </div>
            )}
          </div>

          {/* Nav */}
          <nav className="dash-nav">
            <SideNavSection title="Menu principal" items={NAV_MAIN}    collapsed={collapsed} />
            <SideNavSection title="Finances"       items={NAV_FINANCE} collapsed={collapsed} />
            <SideNavSection title="Mon compte"     items={NAV_ACCOUNT} collapsed={collapsed} />
          </nav>

          {/* Logout */}
          <div className="dash-logout-wrap">
            <Link
              href={route('logout')}
              method="post"
              as="button"
              className="dash-logout-btn"
              title={collapsed ? 'Déconnexion' : undefined}
            >
              <IconLogout />
              {!collapsed && <span>Déconnexion</span>}
            </Link>
          </div>
        </aside>

        {/* ══════════════════════════════════════
            MAIN
        ══════════════════════════════════════ */}
        <div className="dash-main">

          {/* Topbar */}
          <header className="dash-topbar">
            {/* Mobile menu button */}
            <button
              className="dash-mobile-menu-btn"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Menu"
            >
              {mobileOpen ? <IconClose /> : <IconMenu />}
            </button>

            {/* Page title */}
            <div className="dash-topbar-title">
              {header}
            </div>

            {/* Right side */}
            <div className="dash-topbar-right">
              {/* Notification bell */}
              <button className="dash-topbar-icon-btn" aria-label="Notifications">
                <IconNotifications />
                <span className="dash-topbar-badge">3</span>
              </button>

              {/* Avatar dropdown (simple) */}
              <div className="dash-topbar-user">
                <div className="dash-avatar dash-avatar--sm">{initials}</div>
                <span className="dash-topbar-username">{user.name.split(' ')[0]}</span>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="dash-content">
            {children}
          </main>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;1,400&family=Manrope:wght@400;500;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        /* ── CSS Variables ── */
        :root {
          --sidebar-w:       240px;
          --sidebar-w-col:   68px;
          --topbar-h:        60px;
          --brand-orange:    #ff6b2b;
          --brand-orange-2:  #ff9a56;
          --sidebar-bg:      #0f0f0f;
          --sidebar-border:  rgba(255,255,255,0.06);
          --nav-hover:       rgba(255,255,255,0.05);
          --nav-active-bg:   rgba(255,107,43,0.12);
          --nav-active-text: #ff8c52;
          --text-muted:      rgba(255,255,255,0.38);
          --text-secondary:  rgba(255,255,255,0.60);
          --text-primary:    rgba(255,255,255,0.92);
          --page-bg:         #f5f4f1;
          --topbar-bg:       #ffffff;
          --font:            'Manrope', sans-serif;
          --transition:      .18s cubic-bezier(.4,0,.2,1);
        }

        /* ── Root layout ── */
        .dash-root {
          display: flex;
          min-height: 100vh;
          font-family: var(--font);
          background: var(--page-bg);
        }

        /* ── Mobile overlay ── */
        .dash-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.5);
          z-index: 39;
          backdrop-filter: blur(2px);
        }

        /* ══════════════════════════════════════
           SIDEBAR
        ══════════════════════════════════════ */
        .dash-sidebar {
          position: fixed; top: 0; left: 0; bottom: 0;
          width: var(--sidebar-w);
          background: var(--sidebar-bg);
          display: flex; flex-direction: column;
          z-index: 40;
          transition: width var(--transition), transform var(--transition);
          overflow: hidden;
          border-right: 1px solid var(--sidebar-border);
        }
        .dash-sidebar--collapsed { width: var(--sidebar-w-col); }

        /* Mobile: off-screen by default */
        @media (max-width: 767px) {
          .dash-sidebar {
            transform: translateX(-100%);
          }
          .dash-sidebar--open {
            transform: translateX(0);
            width: var(--sidebar-w) !important;
          }
        }

        /* ── Brand ── */
        .dash-brand {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 14px;
          height: var(--topbar-h);
          border-bottom: 1px solid var(--sidebar-border);
          flex-shrink: 0;
        }
        .dash-brand-inner {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none; overflow: hidden; flex: 1;
        }
        .dash-brand-logo {
          width: 28px; height: 28px; border-radius: 6px; object-fit: contain; flex-shrink: 0;
        }
        .dash-brand-name {
          font-family: 'EB Garamond', serif;
          font-size: 1.1rem; font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          border-bottom: 1.5px solid rgba(255,107,43,.5);
          padding-bottom: 1px;
        }
        .dash-collapse-btn {
          width: 28px; height: 28px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          border-radius: 6px; border: none;
          background: transparent; color: var(--text-muted);
          cursor: pointer;
          transition: background var(--transition), color var(--transition), transform var(--transition);
        }
        .dash-collapse-btn:hover { background: var(--nav-hover); color: var(--text-primary); }
        .dash-sidebar--collapsed .dash-collapse-btn { transform: rotate(180deg); }

        /* ── User card ── */
        .dash-user-card {
          display: flex; align-items: center; gap: 10px;
          padding: 14px 14px;
          border-bottom: 1px solid var(--sidebar-border);
          flex-shrink: 0;
          overflow: hidden;
        }
        .dash-user-card--collapsed { justify-content: center; padding: 12px 0; }

        .dash-avatar {
          width: 36px; height: 36px; flex-shrink: 0;
          border-radius: 10px;
          background: linear-gradient(135deg, var(--brand-orange), var(--brand-orange-2));
          display: flex; align-items: center; justify-content: center;
          font-size: .72rem; font-weight: 800; color: #fff;
          letter-spacing: .04em;
        }
        .dash-avatar--sm { width: 30px; height: 30px; border-radius: 8px; font-size: .65rem; }

        .dash-user-info { overflow: hidden; flex: 1; }
        .dash-user-name {
          font-size: .82rem; font-weight: 700;
          color: var(--text-primary);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          margin: 0;
        }
        .dash-user-email {
          font-size: .72rem; color: var(--text-muted);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          margin: 0;
        }

        /* ── Nav ── */
        .dash-nav {
          flex: 1; overflow-y: auto; overflow-x: hidden;
          padding: 8px 0;
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.08) transparent;
        }
        .dash-nav::-webkit-scrollbar { width: 3px; }
        .dash-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 99px; }

        .dash-nav-section { margin-bottom: 4px; }
        .dash-nav-section-title {
          font-size: .65rem; font-weight: 700; letter-spacing: .1em;
          text-transform: uppercase;
          color: var(--text-muted);
          padding: 10px 16px 4px;
          white-space: nowrap;
          margin: 0;
        }
        .dash-nav-section-divider {
          height: 1px; background: var(--sidebar-border);
          margin: 8px 12px;
        }

        .dash-nav-item {
          position: relative;
          display: flex; align-items: center; gap: 10px;
          padding: 9px 14px;
          margin: 1px 8px;
          border-radius: 8px;
          text-decoration: none;
          color: var(--text-secondary);
          font-size: .84rem; font-weight: 500;
          transition: background var(--transition), color var(--transition);
          white-space: nowrap;
          overflow: hidden;
        }
        .dash-sidebar--collapsed .dash-nav-item {
          justify-content: center; padding: 9px 0; margin: 1px 10px;
        }
        .dash-nav-item:hover {
          background: var(--nav-hover);
          color: var(--text-primary);
        }
        .dash-nav-item--active {
          background: var(--nav-active-bg);
          color: var(--nav-active-text);
        }
        .dash-nav-item--active:hover { background: var(--nav-active-bg); }

        .dash-nav-icon {
          display: flex; align-items: center; flex-shrink: 0;
          opacity: .75;
        }
        .dash-nav-item:hover .dash-nav-icon,
        .dash-nav-item--active .dash-nav-icon { opacity: 1; }

        .dash-nav-label { flex: 1; }

        .dash-nav-badge {
          min-width: 18px; height: 18px; padding: 0 5px;
          border-radius: 99px;
          background: var(--brand-orange);
          color: #fff; font-size: .65rem; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .dash-nav-badge--dot {
          position: absolute; top: 6px; right: 6px;
          width: 7px; height: 7px; min-width: unset; padding: 0;
          border-radius: 50%;
        }

        .dash-nav-pip {
          position: absolute; right: 0; top: 50%;
          transform: translateY(-50%);
          width: 3px; height: 18px;
          background: var(--brand-orange);
          border-radius: 99px 0 0 99px;
        }

        /* ── Logout ── */
        .dash-logout-wrap {
          padding: 12px 8px;
          border-top: 1px solid var(--sidebar-border);
          flex-shrink: 0;
        }
        .dash-logout-btn {
          display: flex; align-items: center; gap: 10px;
          width: 100%; padding: 9px 14px;
          border-radius: 8px; border: none;
          background: transparent;
          color: var(--text-muted);
          font-family: var(--font);
          font-size: .84rem; font-weight: 500;
          cursor: pointer; text-decoration: none;
          transition: background var(--transition), color var(--transition);
          white-space: nowrap; overflow: hidden;
        }
        .dash-sidebar--collapsed .dash-logout-btn {
          justify-content: center; padding: 9px 0;
        }
        .dash-logout-btn:hover {
          background: rgba(239,68,68,.1);
          color: #f87171;
        }

        /* ══════════════════════════════════════
           MAIN AREA
        ══════════════════════════════════════ */
        .dash-main {
          flex: 1;
          margin-left: var(--sidebar-w);
          transition: margin-left var(--transition);
          display: flex; flex-direction: column;
          min-height: 100vh;
        }
        .dash-sidebar--collapsed ~ .dash-main { margin-left: var(--sidebar-w-col); }

        @media (max-width: 767px) {
          .dash-main { margin-left: 0 !important; }
        }

        /* ── Topbar ── */
        .dash-topbar {
          position: sticky; top: 0; z-index: 30;
          height: var(--topbar-h);
          background: var(--topbar-bg);
          border-bottom: 1px solid rgba(0,0,0,0.06);
          display: flex; align-items: center;
          padding: 0 24px;
          gap: 16px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }

        .dash-mobile-menu-btn {
          display: none;
          align-items: center; justify-content: center;
          width: 36px; height: 36px;
          border-radius: 8px; border: none;
          background: #f5f5f5; color: #333;
          cursor: pointer;
        }
        @media (max-width: 767px) {
          .dash-mobile-menu-btn { display: flex; }
        }

        .dash-topbar-title {
          flex: 1;
          font-size: .95rem; font-weight: 700; color: #111;
          display: flex; align-items: center;
        }
        .dash-topbar-title h2 {
          margin: 0; font-size: .95rem; font-weight: 700;
          font-family: var(--font); color: #111;
        }

        .dash-topbar-right {
          display: flex; align-items: center; gap: 12px;
        }

        .dash-topbar-icon-btn {
          position: relative;
          width: 36px; height: 36px;
          border-radius: 9px; border: 1px solid rgba(0,0,0,0.08);
          background: #fafafa; color: #555;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: background .15s, color .15s;
        }
        .dash-topbar-icon-btn:hover { background: #f0f0f0; color: #111; }
        .dash-topbar-badge {
          position: absolute; top: -4px; right: -4px;
          width: 16px; height: 16px;
          border-radius: 50%;
          background: var(--brand-orange);
          color: #fff; font-size: .6rem; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          border: 2px solid var(--topbar-bg);
        }

        .dash-topbar-user {
          display: flex; align-items: center; gap: 8px;
          padding: 4px 10px 4px 4px;
          border-radius: 99px;
          border: 1px solid rgba(0,0,0,0.08);
          background: #fafafa;
          cursor: pointer;
          transition: background .15s;
        }
        .dash-topbar-user:hover { background: #f0f0f0; }
        .dash-topbar-username {
          font-size: .82rem; font-weight: 600; color: #333;
        }

        /* ── Content ── */
        .dash-content {
          flex: 1;
          padding: 28px 24px;
        }
        @media (max-width: 639px) {
          .dash-content { padding: 20px 16px; }
        }
      `}</style>
    </>
  );
}