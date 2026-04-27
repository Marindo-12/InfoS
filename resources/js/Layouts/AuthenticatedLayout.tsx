import { Link, usePage } from '@inertiajs/react'
import { PropsWithChildren, ReactNode, useState, useEffect } from 'react'

/* ═══════════════════════════════════════════════════════
   ICONS — custom SVG strokes
═══════════════════════════════════════════════════════ */
const I = {
  Dashboard:     () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>,
  Formations:    () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  Calendar:      () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Results:       () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  Payments:      () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>,
  Certificates:  () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>,
  Documents:     () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/></svg>,
  Bell:          () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  Profile:       () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Logout:        () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Chevron:       () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>,
  Menu:          () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  Close:         () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Search:        () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Sun:           () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  Settings:      () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
}

/* ═══════════════════════════════════════════════════════
   NAV DATA
═══════════════════════════════════════════════════════ */
interface NavItem {
  label:     string
  icon:      ReactNode
  route:     string
  routeName: string
  badge?:    number
}

const NAV_MAIN: NavItem[] = [
  { label: 'Tableau de bord', icon: <I.Dashboard />,   route: route('student.dashboard'), routeName: 'student.dashboard' },
  { label: 'Mes Formations',  icon: <I.Formations />,  route: route('student.courses'),   routeName: 'student.courses'   },
  { label: 'Planning',        icon: <I.Calendar />,    route: route('dashboard'),          routeName: 'planning'          },
  { label: 'Notes & Résultats', icon: <I.Results />,   route: route('dashboard'),          routeName: 'results'           },
]

const NAV_FINANCE: NavItem[] = [
  { label: 'Paiements',   icon: <I.Payments />,     route: route('student.payment'),  routeName: 'student.payment'  },
  { label: 'Certificats', icon: <I.Certificates />, route: route('dashboard'),         routeName: 'certificates'     },
  { label: 'Documents',   icon: <I.Documents />,    route: route('dashboard'),         routeName: 'documents'        },
]

const NAV_ACCOUNT: NavItem[] = [
  { label: 'Notifications', icon: <I.Bell />,    route: route('student.notifications'), routeName: 'student.notifications', badge: 3 },
  { label: 'Mon Profil',    icon: <I.Profile />, route: route('profile.edit'),          routeName: 'profile.edit'           },
]

/* ═══════════════════════════════════════════════════════
   SUB-COMPONENTS
═══════════════════════════════════════════════════════ */
function NavLink({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const active = route().current(item.routeName)

  return (
    <Link
      href={item.route}
      title={collapsed ? item.label : undefined}
      className={`a-nav-item ${active ? 'a-nav-item--active' : ''}`}
    >
      {/* Colored left bar when active */}
      {active && <span className="a-nav-bar" aria-hidden />}

      {/* Icon wrapper — colored bg when active */}
      <span className={`a-nav-icon-wrap ${active ? 'a-nav-icon-wrap--active' : ''}`}>
        {item.icon}
      </span>

      {!collapsed && (
        <>
          <span className="a-nav-label">{item.label}</span>
          {item.badge != null && (
            <span className="a-nav-badge">{item.badge}</span>
          )}
        </>
      )}

      {collapsed && item.badge != null && (
        <span className="a-nav-badge-dot" aria-label={`${item.badge} notifications`} />
      )}
    </Link>
  )
}

function NavSection({ title, items, collapsed }: { title: string; items: NavItem[]; collapsed: boolean }) {
  return (
    <div className="a-nav-section">
      {!collapsed
        ? <p className="a-nav-section-title">{title}</p>
        : <div className="a-nav-section-line" />
      }
      {items.map(item => (
        <NavLink key={item.routeName} item={item} collapsed={collapsed} />
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   MAIN LAYOUT
═══════════════════════════════════════════════════════ */
export default function Authenticated({
  header,
  children,
}: PropsWithChildren<{ header?: ReactNode }>) {

  const user        = (usePage().props as any).auth.user
  const [collapsed, setCollapsed]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled]     = useState(false)

  const initials = user.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()

  useEffect(() => {
    const el = document.querySelector('.a-content')
    if (!el) return
    const fn = () => setScrolled(el.scrollTop > 10)
    el.addEventListener('scroll', fn, { passive: true })
    return () => el.removeEventListener('scroll', fn)
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;1,400&family=Manrope:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --sw:          252px;
          --sw-col:       68px;
          --th:           64px;
          --orange:       #c2652a;
          --orange-light: #e8915a;
          --orange-pale:  #fff3ec;
          --orange-pale2: #fde8d8;
          --sidebar-bg:   #ffffff;
          --page-bg:      #f6f4f0;
          --border:       #ede9e4;
          --text-1:       #1a1612;
          --text-2:       #6b5f55;
          --text-3:       #b0a49a;
          --shadow-sm:    0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
          --shadow-md:    0 4px 16px rgba(0,0,0,0.08);
          --font:         'Manrope', sans-serif;
          --tr:           .2s cubic-bezier(.4,0,.2,1);
        }

        /* ── Root ── */
        .a-root {
          display: flex; min-height: 100vh;
          background: var(--page-bg);
          font-family: var(--font);
        }

        /* ── Overlay mobile ── */
        .a-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,.35);
          backdrop-filter: blur(3px);
          z-index: 39;
        }

        /* ════════════════════════════════════════
           SIDEBAR
        ════════════════════════════════════════ */
        .a-sidebar {
          position: fixed; top: 0; left: 0; bottom: 0;
          width: var(--sw);
          background: var(--sidebar-bg);
          border-right: 1px solid var(--border);
          display: flex; flex-direction: column;
          z-index: 40;
          transition: width var(--tr), transform var(--tr), box-shadow var(--tr);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
        }
        .a-sidebar--col  { width: var(--sw-col); }

        @media (max-width: 767px) {
          .a-sidebar {
            transform: translateX(-100%);
            box-shadow: none;
          }
          .a-sidebar--open {
            transform: translateX(0);
            width: var(--sw) !important;
            box-shadow: var(--shadow-md);
          }
        }

        /* ── Brand ── */
        .a-brand {
          display: flex; align-items: center; justify-content: space-between;
          height: var(--th);
          padding: 0 16px;
          border-bottom: 1px solid var(--border);
          flex-shrink: 0;
        }
        .a-brand-inner {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none; overflow: hidden; flex: 1;
        }
        /* Logo placeholder circle */
        .a-brand-logo {
          width: 32px; height: 32px; flex-shrink: 0;
          border-radius: 10px;
          background: linear-gradient(135deg, var(--orange), var(--orange-light));
          display: flex; align-items: center; justify-content: center;
          color: #fff;
          font-family: 'EB Garamond', serif;
          font-size: 1rem; font-weight: 600;
          box-shadow: 0 2px 8px rgba(194,101,42,.35);
        }
        .a-brand-name {
          font-family: 'EB Garamond', serif;
          font-size: 1.15rem; font-weight: 600;
          color: var(--text-1);
          white-space: nowrap;
        }
        .a-brand-name span { color: var(--orange); }

        .a-collapse-btn {
          width: 28px; height: 28px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          border-radius: 7px; border: 1px solid var(--border);
          background: transparent; color: var(--text-3);
          cursor: pointer;
          transition: background var(--tr), color var(--tr), transform var(--tr);
        }
        .a-collapse-btn:hover { background: var(--orange-pale); color: var(--orange); border-color: var(--orange-pale2); }
        .a-sidebar--col .a-collapse-btn { transform: rotate(180deg); }

        /* ── User card ── */
        .a-user-card {
          display: flex; align-items: center; gap: 10px;
          padding: 14px 16px;
          flex-shrink: 0;
          overflow: hidden;
        }
        .a-user-card--col { justify-content: center; padding: 12px 0; }

        .a-avatar {
          width: 36px; height: 36px; flex-shrink: 0;
          border-radius: 11px;
          background: linear-gradient(135deg, var(--orange), var(--orange-light));
          display: flex; align-items: center; justify-content: center;
          font-size: .72rem; font-weight: 800; color: #fff;
          letter-spacing: .04em;
          box-shadow: 0 2px 8px rgba(194,101,42,.28);
        }
        .a-avatar--sm { width: 32px; height: 32px; border-radius: 9px; font-size: .68rem; }

        .a-user-info { overflow: hidden; flex: 1; }
        .a-user-name {
          font-size: .82rem; font-weight: 700; color: var(--text-1);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .a-user-role {
          font-size: .7rem; color: var(--text-3);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }

        /* ── Divider ── */
        .a-divider {
          height: 1px; background: var(--border);
          margin: 0 16px 8px;
          flex-shrink: 0;
        }

        /* ── Nav ── */
        .a-nav {
          flex: 1; overflow-y: auto; overflow-x: hidden;
          padding: 4px 0 8px;
          scrollbar-width: thin;
          scrollbar-color: var(--border) transparent;
        }
        .a-nav::-webkit-scrollbar { width: 3px; }
        .a-nav::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }

        .a-nav-section { margin-bottom: 2px; }
        .a-nav-section-title {
          font-size: .63rem; font-weight: 700; letter-spacing: .1em;
          text-transform: uppercase; color: var(--text-3);
          padding: 10px 20px 4px; white-space: nowrap;
        }
        .a-nav-section-line {
          height: 1px; background: var(--border);
          margin: 10px 14px 8px;
        }

        .a-nav-item {
          position: relative;
          display: flex; align-items: center; gap: 11px;
          padding: 7px 14px 7px 16px;
          margin: 1px 10px;
          border-radius: 10px;
          text-decoration: none;
          color: var(--text-2);
          font-size: .84rem; font-weight: 500;
          transition: background var(--tr), color var(--tr);
          white-space: nowrap; overflow: hidden;
        }
        .a-sidebar--col .a-nav-item {
          justify-content: center;
          padding: 8px 0;
          margin: 2px 10px;
        }
        .a-nav-item:hover {
          background: var(--orange-pale);
          color: var(--orange);
        }
        .a-nav-item--active {
          background: var(--orange-pale);
          color: var(--orange);
          font-weight: 600;
        }

        .a-nav-bar {
          position: absolute; left: 0; top: 20%; bottom: 20%;
          width: 3px;
          background: var(--orange);
          border-radius: 0 3px 3px 0;
        }

        .a-nav-icon-wrap {
          width: 32px; height: 32px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          border-radius: 8px;
          background: transparent;
          transition: background var(--tr);
        }
        .a-nav-icon-wrap--active {
          background: linear-gradient(135deg, var(--orange), var(--orange-light));
          color: #fff !important;
          box-shadow: 0 2px 8px rgba(194,101,42,.3);
        }
        .a-nav-item:hover .a-nav-icon-wrap:not(.a-nav-icon-wrap--active) {
          background: var(--orange-pale2);
        }

        .a-nav-label { flex: 1; }

        .a-nav-badge {
          min-width: 18px; height: 18px; padding: 0 5px;
          border-radius: 99px;
          background: var(--orange);
          color: #fff; font-size: .63rem; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .a-nav-badge-dot {
          position: absolute; top: 5px; right: 5px;
          width: 7px; height: 7px;
          border-radius: 50%; background: var(--orange);
          border: 2px solid var(--sidebar-bg);
        }

        /* ── Logout ── */
        .a-logout-wrap {
          padding: 10px 10px 14px;
          border-top: 1px solid var(--border);
          flex-shrink: 0;
        }
        .a-logout-btn {
          display: flex; align-items: center; gap: 11px;
          width: 100%; padding: 8px 14px;
          border-radius: 10px; border: none;
          background: transparent;
          color: var(--text-3);
          font-family: var(--font);
          font-size: .84rem; font-weight: 500;
          cursor: pointer; text-decoration: none;
          transition: background var(--tr), color var(--tr);
          white-space: nowrap; overflow: hidden;
        }
        .a-sidebar--col .a-logout-btn {
          justify-content: center; padding: 8px 0;
        }
        .a-logout-btn:hover {
          background: #fff0f0; color: #e05252;
        }
        .a-logout-icon {
          width: 32px; height: 32px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          border-radius: 8px;
        }
        .a-logout-btn:hover .a-logout-icon { background: #ffe4e4; }

        /* ════════════════════════════════════════
           MAIN AREA
        ════════════════════════════════════════ */
        .a-main {
          flex: 1;
          margin-left: var(--sw);
          transition: margin-left var(--tr);
          display: flex; flex-direction: column;
          min-height: 100vh;
        }
        .a-sidebar--col ~ .a-main { margin-left: var(--sw-col); }
        @media (max-width: 767px) {
          .a-main { margin-left: 0 !important; }
        }

        /* ── Topbar ── */
        .a-topbar {
          position: sticky; top: 0; z-index: 30;
          height: var(--th);
          background: rgba(246,244,240,.92);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-bottom: 1px solid transparent;
          display: flex; align-items: center;
          padding: 0 28px;
          gap: 14px;
          transition: border-color var(--tr), box-shadow var(--tr);
        }
        .a-topbar--scrolled {
          border-bottom-color: var(--border);
          box-shadow: 0 1px 12px rgba(0,0,0,0.06);
        }

        .a-mobile-menu {
          display: none;
          align-items: center; justify-content: center;
          width: 36px; height: 36px;
          border-radius: 9px; border: 1px solid var(--border);
          background: #fff; color: var(--text-2);
          cursor: pointer; flex-shrink: 0;
        }
        @media (max-width: 767px) { .a-mobile-menu { display: flex; } }

        /* Breadcrumb / title */
        .a-topbar-title {
          flex: 1;
          display: flex; align-items: center; gap: 8px;
        }
        .a-topbar-title h2 {
          margin: 0;
          font-family: var(--font);
          font-size: .95rem; font-weight: 700;
          color: var(--text-1);
        }

        /* Search */
        .a-search {
          display: flex; align-items: center; gap-8px: 8px;
          height: 36px; padding: 0 12px;
          border-radius: 10px;
          border: 1px solid var(--border);
          background: #fff;
          gap: 8px;
          transition: border-color var(--tr), box-shadow var(--tr);
        }
        .a-search:focus-within {
          border-color: var(--orange);
          box-shadow: 0 0 0 3px rgba(194,101,42,.1);
        }
        .a-search input {
          border: none; outline: none; background: transparent;
          font-family: var(--font); font-size: .82rem;
          color: var(--text-1); width: 160px;
        }
        .a-search input::placeholder { color: var(--text-3); }
        @media (max-width: 639px) { .a-search { display: none; } }

        /* Topbar right */
        .a-topbar-right {
          display: flex; align-items: center; gap: 8px;
        }

        .a-tb-btn {
          position: relative;
          width: 36px; height: 36px;
          border-radius: 10px;
          border: 1px solid var(--border);
          background: #fff; color: var(--text-2);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: background var(--tr), color var(--tr), border-color var(--tr);
          flex-shrink: 0;
        }
        .a-tb-btn:hover {
          background: var(--orange-pale);
          border-color: var(--orange-pale2);
          color: var(--orange);
        }
        .a-tb-badge {
          position: absolute; top: -4px; right: -4px;
          width: 16px; height: 16px;
          border-radius: 50%;
          background: var(--orange); color: #fff;
          font-size: .58rem; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          border: 2px solid var(--page-bg);
        }

        .a-tb-user {
          display: flex; align-items: center; gap: 9px;
          height: 36px; padding: 0 12px 0 5px;
          border-radius: 10px;
          border: 1px solid var(--border);
          background: #fff;
          cursor: pointer;
          transition: background var(--tr), border-color var(--tr);
        }
        .a-tb-user:hover {
          background: var(--orange-pale);
          border-color: var(--orange-pale2);
        }
        .a-tb-username {
          font-size: .82rem; font-weight: 600; color: var(--text-1);
          white-space: nowrap;
        }
        .a-tb-role {
          font-size: .68rem; color: var(--text-3);
          white-space: nowrap;
        }

        /* ── Content ── */
        .a-content {
          flex: 1;
          padding: 28px 28px 40px;
          overflow-y: auto;
        }
        @media (max-width: 639px) {
          .a-content { padding: 18px 16px 32px; }
        }
      `}</style>

      <div className="a-root">

        {/* Mobile overlay */}
        {mobileOpen && (
          <div className="a-overlay" onClick={() => setMobileOpen(false)} aria-hidden />
        )}

        {/* ══════════════════════════════════════
            SIDEBAR
        ══════════════════════════════════════ */}
        <aside className={`a-sidebar ${collapsed ? 'a-sidebar--col' : ''} ${mobileOpen ? 'a-sidebar--open' : ''}`}>

          {/* Brand */}
          <div className="a-brand">
            <Link href={route('home')} className="a-brand-inner">
              <div className="a-brand-logo">CI</div>
              {!collapsed && (
                <span className="a-brand-name">
                  Centre<span>Info</span>
                </span>
              )}
            </Link>
            <button
              onClick={() => setCollapsed(c => !c)}
              className="a-collapse-btn"
              aria-label={collapsed ? 'Développer' : 'Réduire'}
            >
              <I.Chevron />
            </button>
          </div>

          {/* User card */}
          <div className={`a-user-card ${collapsed ? 'a-user-card--col' : ''}`}>
            <div className="a-avatar">{initials}</div>
            {!collapsed && (
              <div className="a-user-info">
                <p className="a-user-name">{user.name}</p>
                <p className="a-user-role">Étudiant · Actif</p>
              </div>
            )}
          </div>

          <div className="a-divider" />

          {/* Nav */}
          <nav className="a-nav">
            <NavSection title="Menu principal" items={NAV_MAIN}    collapsed={collapsed} />
            <NavSection title="Finances"       items={NAV_FINANCE} collapsed={collapsed} />
            <NavSection title="Mon compte"     items={NAV_ACCOUNT} collapsed={collapsed} />
          </nav>

          {/* Logout */}
          <div className="a-logout-wrap">
            <Link
              href={route('logout')}
              method="post"
              as="button"
              className="a-logout-btn"
              title={collapsed ? 'Déconnexion' : undefined}
            >
              <span className="a-logout-icon"><I.Logout /></span>
              {!collapsed && <span>Déconnexion</span>}
            </Link>
          </div>

        </aside>

        {/* ══════════════════════════════════════
            MAIN
        ══════════════════════════════════════ */}
        <div className="a-main">

          {/* Topbar */}
          <header className={`a-topbar ${scrolled ? 'a-topbar--scrolled' : ''}`}>

            {/* Mobile menu toggle */}
            <button
              className="a-mobile-menu"
              onClick={() => setMobileOpen(o => !o)}
              aria-label="Menu"
            >
              {mobileOpen ? <I.Close /> : <I.Menu />}
            </button>

            {/* Title / breadcrumb */}
            <div className="a-topbar-title">
              {header}
            </div>

            {/* Search */}
            <div className="a-search">
              <I.Search />
              <input type="text" placeholder="Rechercher…" aria-label="Rechercher" />
            </div>

            {/* Right actions */}
            <div className="a-topbar-right">

              {/* Settings */}
              <button className="a-tb-btn" aria-label="Paramètres">
                <I.Settings />
              </button>

              {/* Notifications */}
              <button className="a-tb-btn" aria-label="Notifications">
                <I.Bell />
                <span className="a-tb-badge">3</span>
              </button>

              {/* User pill */}
              <div className="a-tb-user">
                <div className="a-avatar a-avatar--sm">{initials}</div>
                <div>
                  <p className="a-tb-username">{user.name.split(' ')[0]}</p>
                </div>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="a-content">
            {children}
          </main>

        </div>
      </div>
    </>
  )
}