import { Link, router, usePage } from '@inertiajs/react'
import { PropsWithChildren, ReactNode, useState, useEffect } from 'react'
import logo from '../../../public/infos-logo.png'

/* ═══════════════════════════════════════════════
   ICONS
═══════════════════════════════════════════════ */
const I = {
  Dashboard:    () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>,
  Students:     () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Applications: () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/></svg>,
  Courses:      () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  Payments:     () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>,
  Reports:      () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  Schedule:     () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Settings:     () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Bell:         () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  Search:       () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Chevron:      () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>,
  Menu:         () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  Close:        () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Logout:       () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Globe:        () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
}

/* ═══════════════════════════════════════════════
   NAV DATA
═══════════════════════════════════════════════ */
interface NavItem {
  label:     string
  icon:      ReactNode
  route:     string
  routeName: string
  badge?:    number
}

const NAV_CORE: NavItem[] = [
  { label: 'Vue d\'ensemble', icon: <I.Dashboard />,    route: route('admin.dashboard'),    routeName: 'admin.dashboard'    },
  { label: 'Candidatures',    icon: <I.Applications />, route: route('admin.applications'), routeName: 'admin.applications' },
  { label: 'Étudiants',       icon: <I.Students />,     route: route('admin.students'),     routeName: 'admin.students'     },
  { label: 'Formations',      icon: <I.Courses />,      route: route('admin.courses'),      routeName: 'admin.courses'      },
  { label: 'Planning',        icon: <I.Schedule />,     route: route('admin.dashboard'),    routeName: 'planning'           },
]

const NAV_FINANCE: NavItem[] = [
  { label: 'Paiements', icon: <I.Payments />, route: route('admin.payments'), routeName: 'admin.payments' },
  { label: 'Rapports',  icon: <I.Reports />,  route: route('admin.reports'),  routeName: 'admin.reports'  },
]

const NAV_SYSTEM: NavItem[] = [
  { label: 'Site public',  icon: <I.Globe />,    route: route('home'),         routeName: 'home'         },
  { label: 'Paramètres',   icon: <I.Settings />, route: route('admin.dashboard'), routeName: 'settings'  },
  { label: 'Notifications',icon: <I.Bell />,     route: route('admin.applications'), routeName: 'admin.notif' },
]

/* ═══════════════════════════════════════════════
   NAV LINK
═══════════════════════════════════════════════ */
function NavLink({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const active = route().current(item.routeName)
  return (
    <Link
      href={item.route}
      title={collapsed ? item.label : undefined}
      className={`al-nav-item ${active ? 'al-nav-item--active' : ''}`}
    >
      {active && <span className="al-nav-bar" aria-hidden />}
      <span className={`al-nav-icon ${active ? 'al-nav-icon--active' : ''}`}>
        {item.icon}
      </span>
      {!collapsed && (
        <>
          <span className="al-nav-label">{item.label}</span>
          {item.badge != null && <span className="al-badge">{item.badge}</span>}
        </>
      )}
      {collapsed && item.badge != null && (
        <span className="al-badge-dot" aria-label={`${item.badge}`} />
      )}
    </Link>
  )
}

function NavSection({ title, items, collapsed }: { title: string; items: NavItem[]; collapsed: boolean }) {
  return (
    <div className="al-nav-section">
      {!collapsed
        ? <p className="al-nav-section-title">{title}</p>
        : <div className="al-nav-section-line" />
      }
      {items.map(item => <NavLink key={item.routeName} item={item} collapsed={collapsed} />)}
    </div>
  )
}

/* ═══════════════════════════════════════════════
   LAYOUT
═══════════════════════════════════════════════ */
export default function AdminLayout({
  header,
  children,
}: PropsWithChildren<{ header?: ReactNode }>) {

  const pageProps                       = usePage().props as any
  const user                            = pageProps.auth.user
  const adminHeader                     = pageProps.adminHeader ?? { unreadNotifications: 0, pendingApplications: 0, recentNotifications: [] }
  const [collapsed, setCollapsed]       = useState(false)
  const [mobileOpen, setMobileOpen]     = useState(false)
  const [scrolled, setScrolled]         = useState(false)
  const [searchQuery, setSearchQuery]   = useState('')
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  const initials = user.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
  const avatarUrl = user.avatar_url ?? null
  const navCore = NAV_CORE.map(item =>
    item.routeName === 'admin.applications'
      ? { ...item, badge: adminHeader.pendingApplications || undefined }
      : item,
  )
  const navSystem = NAV_SYSTEM.map(item =>
    item.routeName === 'admin.notif'
      ? { ...item, badge: adminHeader.unreadNotifications || undefined }
      : item,
  )
  const totalHeaderNotifications = Number(adminHeader.unreadNotifications ?? 0)

  useEffect(() => {
    const el = document.querySelector('.al-content')
    if (!el) return
    const fn = () => setScrolled(el.scrollTop > 12)
    el.addEventListener('scroll', fn, { passive: true })
    return () => el.removeEventListener('scroll', fn)
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;1,400&family=Manrope:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* ── Design tokens ── */
        :root {
          --al-sw:          256px;
          --al-sw-col:       68px;
          --al-th:           64px;

          /* Brand — orange chaud cohérent avec les pages admin */
          --al-orange:       #c2652a;
          --al-orange-2:     #e8915a;
          --al-orange-pale:  #fff3ec;
          --al-orange-pale2: #fde8d8;

          /* Surfaces */
          --al-sidebar:      #0d0d0d;
          --al-sidebar-2:    #161616;
          --al-sidebar-b:    rgba(255,255,255,0.07);
          --al-page:         #f5f4f1;
          --al-topbar:       rgba(245,244,241,0.92);

          /* Text */
          --al-t1:  rgba(255,255,255,0.92);
          --al-t2:  rgba(255,255,255,0.58);
          --al-t3:  rgba(255,255,255,0.30);

          /* Nav */
          --al-nav-hover:   rgba(255,255,255,0.06);
          --al-nav-active:  rgba(194,101,42,0.18);
          --al-nav-active-t:#ff9a56;

          --al-font: 'Manrope', sans-serif;
          --al-tr:   .2s cubic-bezier(.4,0,.2,1);
        }

        /* ── Root ── */
        .al-root {
          display: flex; min-height: 100vh;
          background: var(--al-page);
          font-family: var(--al-font);
        }

        /* ── Mobile overlay ── */
        .al-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,.5);
          backdrop-filter: blur(4px);
          z-index: 39;
        }

        /* ════════════════════════════
           SIDEBAR — dark
        ════════════════════════════ */
        .al-sidebar {
          position: fixed; top:0; left:0; bottom:0;
          width: var(--al-sw);
          background: var(--al-sidebar);
          border-right: 1px solid var(--al-sidebar-b);
          display: flex; flex-direction: column;
          z-index: 40;
          transition: width var(--al-tr), transform var(--al-tr);
          overflow: hidden;
        }
        .al-sidebar--col { width: var(--al-sw-col); }

        @media (max-width: 767px) {
          .al-sidebar { transform: translateX(-100%); }
          .al-sidebar--open { transform: translateX(0); width: var(--al-sw) !important; }
        }

        /* Brand */
        .al-brand {
          display: flex; align-items: center; justify-content: space-between;
          height: var(--al-th); padding: 0 16px;
          border-bottom: 1px solid var(--al-sidebar-b);
          flex-shrink: 0;
        }
        .al-brand-inner {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none; overflow: hidden; flex: 1;
        }
        .al-brand-logo {
          width: 32px; height: 32px; flex-shrink: 0;
          border-radius: 10px;
          background: linear-gradient(135deg, var(--al-orange), var(--al-orange-2));
          display: flex; align-items: center; justify-content: center;
          font-family: 'EB Garamond', serif;
          font-size: 1rem; font-weight: 600; color: #fff;
          box-shadow: 0 2px 10px rgba(194,101,42,.4);
        }
        .al-brand-name {
          font-family: 'EB Garamond', serif;
          font-size: 1.1rem; font-weight: 600;
          color: var(--al-t1); white-space: nowrap;
        }
        .al-brand-name em { color: var(--al-orange-2); font-style: normal; }
        .al-brand-tag {
          font-size: .58rem; font-weight: 800; letter-spacing: .12em;
          text-transform: uppercase;
          background: rgba(194,101,42,.2);
          color: var(--al-orange-2);
          padding: 2px 7px; border-radius: 99px;
          white-space: nowrap;
        }
        .al-collapse-btn {
          width: 28px; height: 28px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          border-radius: 7px; border: 1px solid var(--al-sidebar-b);
          background: transparent; color: var(--al-t3); cursor: pointer;
          transition: background var(--al-tr), color var(--al-tr), transform var(--al-tr);
        }
        .al-collapse-btn:hover { background: var(--al-nav-hover); color: var(--al-t1); }
        .al-sidebar--col .al-collapse-btn { transform: rotate(180deg); }

        /* Admin badge */
        .al-admin-info {
          display: flex; align-items: center; gap: 10px;
          padding: 14px 16px;
          border-bottom: 1px solid var(--al-sidebar-b);
          flex-shrink: 0; overflow: hidden;
        }
        .al-admin-info--col { justify-content: center; padding: 12px 0; }
        .al-av {
          width: 36px; height: 36px; flex-shrink: 0;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--al-orange), var(--al-orange-2));
          display: flex; align-items: center; justify-content: center;
          font-size: .7rem; font-weight: 800; color: #fff;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(194,101,42,.3);
        }
        .al-av--sm { width: 42px; height: 42px; font-size: .72rem; }
        .al-av-img { width: 100%; height: 100%; object-fit: cover; }
        .al-admin-name {
          font-size: .82rem; font-weight: 700; color: var(--al-t1);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .al-admin-role {
          font-size: .68rem; color: var(--al-orange-2);
          font-weight: 700; letter-spacing: .04em;
          white-space: nowrap;
        }

        /* Nav */
        .al-nav {
          flex: 1; overflow-y: auto; overflow-x: hidden;
          padding: 8px 0;
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.06) transparent;
        }
        .al-nav::-webkit-scrollbar { width: 3px; }
        .al-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.06); border-radius: 99px; }

        .al-nav-section { margin-bottom: 2px; }
        .al-nav-section-title {
          font-size: .62rem; font-weight: 800; letter-spacing: .12em;
          text-transform: uppercase; color: var(--al-t3);
          padding: 10px 18px 4px; white-space: nowrap;
        }
        .al-nav-section-line {
          height: 1px; background: var(--al-sidebar-b);
          margin: 10px 14px 8px;
        }

        .al-nav-item {
          position: relative;
          display: flex; align-items: center; gap: 10px;
          padding: 8px 14px 8px 16px;
          margin: 1px 8px;
          border-radius: 9px;
          text-decoration: none;
          color: var(--al-t2);
          font-size: .83rem; font-weight: 500;
          transition: background var(--al-tr), color var(--al-tr);
          white-space: nowrap; overflow: hidden;
        }
        .al-sidebar--col .al-nav-item {
          justify-content: center; padding: 8px 0; margin: 2px 10px;
        }
        .al-nav-item:hover { background: var(--al-nav-hover); color: var(--al-t1); }
        .al-nav-item--active { background: var(--al-nav-active); color: var(--al-nav-active-t); }
        .al-nav-item--active:hover { background: var(--al-nav-active); }

        .al-nav-bar {
          position: absolute; left: 0; top: 22%; bottom: 22%;
          width: 3px; background: var(--al-orange);
          border-radius: 0 3px 3px 0;
        }

        .al-nav-icon {
          width: 32px; height: 32px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          border-radius: 8px; transition: background var(--al-tr);
        }
        .al-nav-icon--active {
          background: linear-gradient(135deg, var(--al-orange), var(--al-orange-2));
          color: #fff;
          box-shadow: 0 2px 8px rgba(194,101,42,.35);
        }
        .al-nav-item:hover .al-nav-icon:not(.al-nav-icon--active) {
          background: rgba(255,255,255,0.06);
        }

        .al-nav-label { flex: 1; }

        .al-badge {
          min-width: 18px; height: 18px; padding: 0 5px;
          border-radius: 99px;
          background: var(--al-orange); color: #fff;
          font-size: .62rem; font-weight: 800;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .al-badge-dot {
          position: absolute; top: 5px; right: 5px;
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--al-orange);
          border: 2px solid var(--al-sidebar);
        }

        /* Logout */
        .al-logout-wrap {
          padding: 10px 10px 14px;
          border-top: 1px solid var(--al-sidebar-b);
          flex-shrink: 0;
        }
        .al-logout-btn {
          display: flex; align-items: center; gap: 10px;
          width: 100%; padding: 8px 14px;
          border-radius: 9px; border: none;
          background: transparent; color: var(--al-t3);
          font-family: var(--al-font); font-size: .83rem; font-weight: 500;
          cursor: pointer; text-decoration: none;
          transition: background var(--al-tr), color var(--al-tr);
          white-space: nowrap; overflow: hidden;
        }
        .al-sidebar--col .al-logout-btn { justify-content: center; padding: 8px 0; }
        .al-logout-btn:hover { background: rgba(239,68,68,.1); color: #f87171; }
        .al-logout-icon {
          width: 32px; height: 32px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          border-radius: 8px; transition: background var(--al-tr);
        }
        .al-logout-btn:hover .al-logout-icon { background: rgba(239,68,68,.15); }

        /* ════════════════════════════
           MAIN AREA
        ════════════════════════════ */
        .al-main {
          flex: 1;
          margin-left: var(--al-sw);
          transition: margin-left var(--al-tr);
          display: flex; flex-direction: column;
          min-height: 100vh;
        }
        .al-sidebar--col ~ .al-main { margin-left: var(--al-sw-col); }
        @media (max-width: 767px) { .al-main { margin-left: 0 !important; } }

        /* Topbar */
        .al-topbar {
          position: sticky; top: 0; z-index: 30;
          height: var(--al-th);
          background: var(--al-topbar);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid transparent;
          display: flex; align-items: center;
          padding: 0 28px; gap: 14px;
          transition: border-color var(--al-tr), box-shadow var(--al-tr);
        }
        .al-topbar--scrolled {
          border-bottom-color: rgba(0,0,0,0.07);
          box-shadow: 0 1px 14px rgba(0,0,0,0.06);
        }

        .al-mobile-btn {
          display: none;
          align-items: center; justify-content: center;
          width: 36px; height: 36px;
          border-radius: 9px; border: 1px solid rgba(0,0,0,0.09);
          background: #fff; color: #555; cursor: pointer; flex-shrink: 0;
        }
        @media (max-width: 767px) { .al-mobile-btn { display: flex; } }

        .al-topbar-title { flex: 1; }

        /* Search */
        .al-search {
          display: flex; align-items: center; gap: 8px;
          height: 36px; padding: 0 12px;
          border-radius: 10px;
          border: 1px solid rgba(0,0,0,0.09);
          background: #fff;
          transition: border-color var(--al-tr), box-shadow var(--al-tr);
        }
        .al-search:focus-within {
          border-color: var(--al-orange);
          box-shadow: 0 0 0 3px rgba(194,101,42,.1);
        }
        .al-search input {
          border: none; outline: none; background: transparent;
          font-family: var(--al-font); font-size: .82rem;
          color: #1a1612; width: 180px;
        }
        .al-search input::placeholder { color: #b0a49a; }
        @media (max-width: 639px) { .al-search { display: none; } }

        .al-topbar-right { display: flex; align-items: center; gap: 8px; }

        .al-tb-btn {
          position: relative;
          width: 36px; height: 36px;
          border-radius: 10px;
          border: 1px solid rgba(0,0,0,0.09);
          background: #fff; color: #6b5f55;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: background var(--al-tr), color var(--al-tr);
          flex-shrink: 0;
        }
        .al-tb-btn:hover {
          background: var(--al-orange-pale);
          color: var(--al-orange);
          border-color: var(--al-orange-pale2);
        }
        .al-tb-badge {
          position: absolute; top: -4px; right: -4px;
          min-width: 16px; height: 16px; padding: 0 4px; border-radius: 999px;
          background: #dc2626; color: #fff;
          font-size: .58rem; font-weight: 800;
          display: flex; align-items: center; justify-content: center;
          border: 2px solid var(--al-page);
        }
        .al-notif-wrap { position: relative; }
        .al-notif-menu {
          position: absolute; top: 44px; right: 0;
          width: min(360px, calc(100vw - 32px));
          background: #fff;
          border: 1px solid rgba(0,0,0,.08);
          border-radius: 14px;
          box-shadow: 0 18px 50px rgba(15,23,42,.16);
          z-index: 80;
          overflow: hidden;
        }
        .al-notif-head {
          display: flex; align-items: center; justify-content: space-between; gap: 12px;
          padding: 14px 16px;
          border-bottom: 1px solid rgba(15,23,42,.07);
        }
        .al-notif-head strong { font-size: .86rem; color: #18181b; }
        .al-notif-head button {
          border: none; background: transparent; color: var(--al-orange);
          font-size: .72rem; font-weight: 800; cursor: pointer;
        }
        .al-notif-list { max-height: 320px; overflow-y: auto; }
        .al-notif-item {
          display: block;
          padding: 13px 16px;
          text-decoration: none;
          border-bottom: 1px solid rgba(15,23,42,.06);
          background: #fff;
        }
        .al-notif-item:hover { background: #fffaf6; }
        .al-notif-item--unread { background: #fff7ed; }
        .al-notif-item strong {
          display: block; color: #18181b; font-size: .8rem; margin-bottom: 4px;
        }
        .al-notif-item span {
          display: block; color: #6b7280; font-size: .73rem; line-height: 1.45;
        }
        .al-notif-item small {
          display: block; color: #a1a1aa; font-size: .67rem; margin-top: 6px;
        }
        .al-notif-empty { padding: 18px 16px; color: #6b7280; font-size: .8rem; }
        .al-notif-foot {
          display: block; padding: 12px 16px; color: var(--al-orange);
          background: #faf8f5; text-decoration: none; font-size: .78rem; font-weight: 800;
          border-top: 1px solid rgba(15,23,42,.07);
        }

        /* Admin tag on topbar */
        .al-admin-tag {
          display: flex; align-items: center; gap: 6px;
          padding: 4px 10px; border-radius: 99px;
          background: rgba(194,101,42,.1);
          border: 1px solid rgba(194,101,42,.2);
          font-size: .68rem; font-weight: 800;
          color: var(--al-orange); letter-spacing: .06em;
          text-transform: uppercase; white-space: nowrap;
          flex-shrink: 0;
        }
        .al-admin-tag-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--al-orange);
          animation: al-pulse 2.5s ease-in-out infinite;
        }
        @keyframes al-pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:.5; transform:scale(.8); }
        }

        .al-tb-user {
          display: flex; align-items: center; gap: 8px;
          min-height: 50px; padding: 4px 14px 4px 5px;
          border-radius: 18px;
          border: 1px solid rgba(194,101,42,.18);
          background: #fff; cursor: pointer;
          box-shadow: 0 10px 24px rgba(36,28,20,.08);
          transition: background var(--al-tr), border-color var(--al-tr), box-shadow var(--al-tr), transform var(--al-tr);
        }
        .al-tb-user:hover {
          background: var(--al-orange-pale);
          border-color: var(--al-orange-pale2);
          box-shadow: 0 14px 30px rgba(194,101,42,.14);
          transform: translateY(-1px);
        }
        .al-tb-username {
          font-size: .86rem; font-weight: 800; color: #1a1612;
          white-space: nowrap;
        }
        .al-tb-role { font-size: .68rem; color: #8b8078; white-space: nowrap; }

        /* Content */
        .al-content {
          flex: 1; padding: 0;
          overflow-y: auto;
        }
      `}</style>

      <div className="al-root">

        {mobileOpen && (
          <div className="al-overlay" onClick={() => setMobileOpen(false)} aria-hidden />
        )}

        {/* ════════════════════
            SIDEBAR
        ════════════════════ */}
        <aside className={`al-sidebar ${collapsed ? 'al-sidebar--col' : ''} ${mobileOpen ? 'al-sidebar--open' : ''}`}>

          {/* Brand */}
          <div className="al-brand">
            <Link href={route('home')} className="al-brand-inner">
              <img src={logo} alt="InfoSaloua" className="w-9 h-9" />
              {!collapsed && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span className="al-brand-name">Info<em>Saloua</em></span>
                  <span className="al-brand-tag">Administration</span>
                </div>
              )}
            </Link>
            <button
              onClick={() => setCollapsed(c => !c)}
              className="al-collapse-btn"
              aria-label={collapsed ? 'Développer' : 'Réduire'}
            >
              <I.Chevron />
            </button>
          </div>

          {/* Admin info */}
          <div className={`al-admin-info ${collapsed ? 'al-admin-info--col' : ''}`}>
            <div className="al-av">
              {avatarUrl ? <img src={avatarUrl} alt={user.name} className="al-av-img" /> : initials}
            </div>
            {!collapsed && (
              <div style={{ overflow: 'hidden', flex: 1 }}>
                <p className="al-admin-name">{user.name}</p>
                <p className="al-admin-role">Administrateur</p>
              </div>
            )}
          </div>

          {/* Nav */}
          <nav className="al-nav">
            <NavSection title="Gestion"   items={navCore}    collapsed={collapsed} />
            <NavSection title="Finances"  items={NAV_FINANCE} collapsed={collapsed} />
            <NavSection title="Système"   items={navSystem}  collapsed={collapsed} />
          </nav>

          {/* Logout */}
          <div className="al-logout-wrap">
            <Link
              href={route('logout')}
              method="post"
              as="button"
              className="al-logout-btn"
              title={collapsed ? 'Déconnexion' : undefined}
            >
              <span className="al-logout-icon"><I.Logout /></span>
              {!collapsed && <span>Déconnexion</span>}
            </Link>
          </div>

        </aside>

        {/* ════════════════════
            MAIN
        ════════════════════ */}
        <div className="al-main">

          {/* Topbar */}
          <header className={`al-topbar ${scrolled ? 'al-topbar--scrolled' : ''}`}>

            <button className="al-mobile-btn" onClick={() => setMobileOpen(o => !o)}>
              {mobileOpen ? <I.Close /> : <I.Menu />}
            </button>

            <div className="al-topbar-title">
              {header}
            </div>

            {/* Search */}
            <div className="al-search">
              <I.Search />
              <input
                type="text"
                placeholder="Rechercher un étudiant, paiement…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                aria-label="Rechercher"
              />
            </div>

            {/* Right */}
            <div className="al-topbar-right">

              {/* Admin indicator */}
              <div className="al-admin-tag">
                <span className="al-admin-tag-dot" />
                Admin
              </div>

              {/* Notifications */}
              <div className="al-notif-wrap">
                <button
                  className="al-tb-btn"
                  aria-label="Notifications"
                  onClick={() => setNotificationsOpen(open => !open)}
                  type="button"
                >
                  <I.Bell />
                  {totalHeaderNotifications > 0 && <span className="al-tb-badge">{totalHeaderNotifications}</span>}
                </button>
                {notificationsOpen && (
                  <div className="al-notif-menu">
                    <div className="al-notif-head">
                      <strong>Notifications</strong>
                      {totalHeaderNotifications > 0 && (
                        <button
                          type="button"
                          onClick={() => router.post(route('admin.notifications.read-all'), {}, { preserveScroll: true })}
                        >
                          Tout lire
                        </button>
                      )}
                    </div>
                    <div className="al-notif-list">
                      {adminHeader.recentNotifications?.length ? (
                        adminHeader.recentNotifications.map((notification: any) => (
                          <Link
                            key={notification.id}
                            href={notification.actionUrl || route('admin.applications')}
                            className={`al-notif-item ${notification.isRead ? '' : 'al-notif-item--unread'}`}
                            onClick={() => setNotificationsOpen(false)}
                          >
                            <strong>{notification.title}</strong>
                            <span>{notification.message}</span>
                            <small>{notification.publishedAt}</small>
                          </Link>
                        ))
                      ) : (
                        <div className="al-notif-empty">Aucune notification pour le moment.</div>
                      )}
                    </div>
                    <Link href={route('admin.applications')} className="al-notif-foot" onClick={() => setNotificationsOpen(false)}>
                      Voir les candidatures
                    </Link>
                  </div>
                )}
              </div>

              {/* Settings */}
              <button className="al-tb-btn" aria-label="Paramètres">
                <I.Settings />
              </button>

              {/* User */}
              <div className="al-tb-user">
                <div className="al-av al-av--sm">
                  {avatarUrl ? <img src={avatarUrl} alt={user.name} className="al-av-img" /> : initials}
                </div>
                <div>
                  <span className="al-tb-username">{user.name.split(' ')[0]}</span>
                  <p className="al-tb-role">Profil admin</p>
                </div>
              </div>

            </div>
          </header>

          {/* Content */}
          <main className="al-content">
            {children}
          </main>

        </div>
      </div>
    </>
  )
}
