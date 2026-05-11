import { Link, router, usePage } from '@inertiajs/react'
import { PropsWithChildren, ReactNode, useState, useEffect } from 'react'
import logo from '../../../public/infos-logo.png'
import { Settings,Calendar,BookOpen } from 'lucide-react'

/* ═══════════════════════════════════════════════════════
   ICONS — custom SVG strokes (identique à votre version)
═══════════════════════════════════════════════════════ */
const I = {
  Dashboard:     () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>,
  Payments:      () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>,
  Certificates:  () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>,
  Documents:     () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/></svg>,
  Bell:          () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  Profile:       () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Logout:        () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Chevron:       () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>,
  Menu:          () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  Close:         () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Sun:           () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  Moon:          () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/></svg>,
  Settings:      () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
}

/* ═══════════════════════════════════════════════════════
   DONNÉES DE NAVIGATION
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
  { label: 'Mes Formations',  icon: <BookOpen size={18} />,  route: route('student.courses'),   routeName: 'student.courses'   },
  { label: 'Planning',        icon: <Calendar size={18}/>,    route: route('student.schedule'),          routeName: 'student.schedule'          },
]

const NAV_FINANCE: NavItem[] = [
  { label: 'Paiements',   icon: <I.Payments />,     route: route('student.payment'),  routeName: 'student.payment'  },
  { label: 'Certificats', icon: <I.Certificates />, route: route('dashboard'),         routeName: 'certificates'     },
  { label: 'Documents',   icon: <I.Documents />,    route: route('dashboard'),         routeName: 'documents'        },
]

const NAV_ACCOUNT: NavItem[] = [
  { label: 'Notifications', icon: <I.Bell />,    route: route('student.notifications'), routeName: 'student.notifications' },
  { label: 'Mon Profil',    icon: <I.Profile />, route: route('profile.edit'),          routeName: 'profile.edit'           },
]

/* ═══════════════════════════════════════════════════════
   SOUS-COMPOSANTS
═══════════════════════════════════════════════════════ */
function NavLink({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const active = route().current(item.routeName)

  return (
    <Link
      href={item.route}
      title={collapsed ? item.label : undefined}
      className={`a-nav-item ${active ? 'a-nav-item--active' : ''}`}
    >
      {active && <span className="a-nav-bar" aria-hidden />}
      <span className={`a-nav-icon-wrap ${active ? 'a-nav-icon-wrap--active' : ''}`}>
        {item.icon}
      </span>
      {!collapsed && (
        <>
          <span className="a-nav-label">{item.label}</span>
          {item.badge != null && <span className="a-nav-badge">{item.badge}</span>}
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
   COMPOSANT PRINCIPAL
═══════════════════════════════════════════════════════ */
export default function Authenticated({
  header,
  children,
}: PropsWithChildren<{ header?: ReactNode }>) {

  const pageProps = usePage().props as any
  const user = pageProps.auth.user
  const studentHeader = pageProps.studentHeader ?? { unreadNotifications: 0, recentNotifications: [] }
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [windowWidth, setWindowWidth] = useState(0)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false
    const saved = window.localStorage.getItem('student-dashboard-theme')
    if (saved) return saved === 'dark'
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
  })

  // Détection de la largeur d'écran
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Mode réduit effectif : uniquement sur grand écran ET collapsed activé
  const effectiveCollapsed = collapsed && windowWidth >= 768

  // Reset collapsed sur mobile quand la largeur passe en dessous de 768
  useEffect(() => {
    if (windowWidth < 768 && collapsed) {
      setCollapsed(false)
    }
  }, [windowWidth, collapsed])

  const initials = user.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
  const avatarUrl = user.avatar_url ?? null
  const totalHeaderNotifications = Number(studentHeader.unreadNotifications ?? 0)
  const navAccount = NAV_ACCOUNT.map(item =>
    item.routeName === 'student.notifications'
      ? { ...item, badge: totalHeaderNotifications || undefined }
      : item,
  )

  useEffect(() => {
    const el = document.querySelector('.a-content')
    if (!el) return
    const fn = () => setScrolled(el.scrollTop > 10)
    el.addEventListener('scroll', fn, { passive: true })
    return () => el.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    window.localStorage.setItem('student-dashboard-theme', darkMode ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;1,400&family=Manrope:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --sw:          252px;
          --sw-col:       80px;   /* Largeur sidebar réduite (modifié) */
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

        .a-root--dark {
          --orange:       #ffb68e;
          --orange-light: #d9773a;
          --orange-pale:  rgba(255, 182, 142, .12);
          --orange-pale2: rgba(255, 182, 142, .18);
          --sidebar-bg:   #0e0e0e;
          --page-bg:      #131313;
          --border:       #554339;
          --text-1:       #e5e2e1;
          --text-2:       #dbc1b5;
          --text-3:       #a38c80;
          --shadow-sm:    0 1px 0 rgba(255,255,255,0.04), 0 18px 44px rgba(0,0,0,0.24);
          --shadow-md:    0 20px 60px rgba(0,0,0,0.42);
        }

        .a-root {
          display: flex; min-height: 100vh;
          background: var(--page-bg);
          font-family: var(--font);
          color: var(--text-1);
          color-scheme: light;
        }
        .a-root--dark { color-scheme: dark; }

        .a-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,.35);
          backdrop-filter: blur(3px);
          z-index: 39;
        }

        /* SIDEBAR */
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

        /* BRAND */
        .a-brand {
          display: flex; align-items: center; justify-content: space-between;
          height: var(--th);
          padding: 0 16px;
          border-bottom: 1px solid var(--border);
          flex-shrink: 0;
          transition: flex-direction var(--tr), padding var(--tr);
        }
        /* Mode réduit : colonne */
        .a-brand--col {
          flex-direction: column;
          justify-content: center;
          gap: 8px;
          height: auto;
          padding: 12px 0;
        }
        .a-brand-inner {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none; overflow: hidden; flex: 1;
        }
        .a-brand--col .a-brand-inner {
          justify-content: center;
          flex: none;
        }
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
          width: 38px; height: 38px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          background: transparent; color: var(--text-3);
          cursor: pointer;
          border-radius: 10px;
          transition: background var(--tr), color var(--tr), transform var(--tr);
        }
        .a-collapse-btn:hover { background: var(--orange-pale); color: var(--orange); border-color: var(--orange-pale2); }
        /* Rotation de la flèche en mode réduit */
        .a-brand--col .a-collapse-btn { transform: rotate(180deg); }

        /* Cacher le bouton sur mobile (sécurité) */
        @media (max-width: 767px) {
          .a-collapse-btn {
            display: none;
          }
        }

        .a-user-card {
          display: flex; align-items: center; gap: 10px;
          padding: 14px 16px;
          flex-shrink: 0;
          overflow: hidden;
        }
        .a-user-card--col { justify-content: center; padding: 12px 0; }

        .a-avatar {
          width: 36px; height: 36px; flex-shrink: 0;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--orange), var(--orange-light));
          display: flex; align-items: center; justify-content: center;
          font-size: .72rem; font-weight: 800; color: #fff;
          letter-spacing: .04em;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(194,101,42,.28);
        }
        .a-avatar--sm { width: 42px; height: 42px; font-size: .72rem; }
        .a-avatar-img { width: 100%; height: 100%; object-fit: cover; }

        .a-user-info { overflow: hidden; flex: 1; }
        .a-user-name { font-size: .82rem; font-weight: 700; color: var(--text-1); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .a-user-role { font-size: .7rem; color: var(--text-3); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        .a-divider { height: 1px; background: var(--border); margin: 0 16px 8px; flex-shrink: 0; }

        /* NAVIGATION */
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
        .a-nav-section-line { height: 1px; background: var(--border); margin: 10px 14px 8px; }

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
        .a-nav-item:hover { background: var(--orange-pale); color: var(--orange); }
        .a-nav-item--active { background: var(--orange-pale); color: var(--orange); font-weight: 600; }

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
        .a-nav-item:hover .a-nav-icon-wrap:not(.a-nav-icon-wrap--active) { background: var(--orange-pale2); }

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
        .a-logout-btn:hover { background: #fff0f0; color: #e05252; }
        .a-logout-icon {
          width: 32px; height: 32px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          border-radius: 8px;
        }
        .a-logout-btn:hover .a-logout-icon { background: #ffe4e4; }

        /* MAIN */
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

        .a-topbar {
          position: sticky; top: 0; z-index: 30;
          height: var(--th);
          background: rgba(246,244,240,.92);
          backdrop-filter: blur(14px);
          border-bottom: 1px solid transparent;
          display: flex; align-items: center;
          padding: 0 28px;
          gap: 14px;
          transition: border-color var(--tr), box-shadow var(--tr);
        }
        .a-root--dark .a-topbar { background: rgba(19,19,19,.88); }
        .a-topbar--scrolled { border-bottom-color: var(--border); box-shadow: 0 1px 12px rgba(0,0,0,0.06); }

        .a-mobile-menu {
          display: none;
          align-items: center; justify-content: center;
          width: 36px; height: 36px;
          border-radius: 9px; border: 1px solid var(--border);
          background: var(--sidebar-bg);
          color: var(--text-2);
          cursor: pointer; flex-shrink: 0;
        }
        @media (max-width: 767px) { .a-mobile-menu { display: flex; } }

        .a-topbar-title { flex: 1; display: flex; align-items: center; gap: 8px; }
        .a-topbar-title h2 { margin: 0; font-size: .95rem; font-weight: 700; color: var(--text-1); }

        .a-search {
          display: flex; align-items: center;
          height: 36px; padding: 0 12px;
          border-radius: 10px;
          border: 1px solid var(--border);
          background: var(--sidebar-bg);
          gap: 8px;
          transition: border-color var(--tr), box-shadow var(--tr);
        }
        .a-search:focus-within { border-color: var(--orange); box-shadow: 0 0 0 3px rgba(194,101,42,.1); }
        .a-search input { border: none; outline: none; background: transparent; font-family: var(--font); font-size: .82rem; color: var(--text-1); width: 160px; }
        .a-search input::placeholder { color: var(--text-3); }
        @media (max-width: 639px) { .a-search { display: none; } }

        .a-topbar-right { display: flex; align-items: center; gap: 8px; }

        .a-tb-btn {
          position: relative;
          width: 36px; height: 36px;
          border-radius: 10px;
          border: 1px solid var(--border);
          background: var(--sidebar-bg);
          color: var(--text-2);
          align-items: center; justify-content: center;
          cursor: pointer;
          transition: background var(--tr), color var(--tr), border-color var(--tr);
          flex-shrink: 0;
        }
        .a-tb-btn:hover,
        .a-tb-btn--active { border-color: var(--orange-pale2);}
        .a-tb-badge {
          position: absolute; top: -4px; right: -4px;
          width: 16px; height: 16px;
          border-radius: 50%;
          background: var(--orange); color: #fff;
          font-size: .58rem; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          border: 2px solid var(--page-bg);
        }

        .a-notif-wrap { position: relative; }
        .a-notif-menu {
          position: absolute; top: 44px; right: 0;
          width: min(360px, calc(100vw - 32px));
          background: var(--sidebar-bg);
          border: 1px solid var(--border);
          border-radius: 14px;
          box-shadow: 0 18px 50px rgba(15,23,42,.16);
          z-index: 80;
          overflow: hidden;
        }
        .a-notif-head {
          display: flex; align-items: center; justify-content: space-between; gap: 12px;
          padding: 14px 16px;
          border-bottom: 1px solid var(--border);
        }
        .a-notif-head strong { font-size: .86rem; color: var(--text-1); }
        .a-notif-head button {
          border: none; background: transparent; color: var(--orange);
          font-size: .72rem; font-weight: 800; cursor: pointer;
        }
        .a-notif-list { max-height: 320px; overflow-y: auto; }
        .a-notif-item {
          display: block;
          padding: 13px 16px;
          text-decoration: none;
          border-bottom: 1px solid var(--border);
          background: var(--sidebar-bg);
        }
        .a-notif-item:hover { background: var(--orange-pale); }
        .a-notif-item--unread { background: var(--orange-pale); }
        .a-notif-item strong {
          display: block; color: var(--text-1); font-size: .8rem; margin-bottom: 4px;
        }
        .a-notif-item span {
          display: block; color: var(--text-2); font-size: .73rem; line-height: 1.45;
        }
        .a-notif-item small {
          display: block; color: var(--text-3); font-size: .67rem; margin-top: 6px;
        }
        .a-notif-empty { padding: 18px 16px; color: var(--text-2); font-size: .8rem; }
        .a-notif-foot {
          display: block; padding: 12px 16px; color: var(--orange);
          background: var(--orange-pale); text-decoration: none; font-size: .78rem; font-weight: 800;
          border-top: 1px solid var(--border);
        }

        .a-tb-user {
          display: flex; align-items: center; gap: 9px;
          min-height: 50px; padding: 4px 14px 4px 5px;
          background: var(--sidebar-bg);
          border-radius: 20px;
          cursor: pointer;
          box-shadow: 0 10px 24px rgba(36, 28, 20, .08);
          transition: background var(--tr), border-color var(--tr), box-shadow var(--tr), transform var(--tr);
        }
        .a-tb-user:hover {
          background: var(--orange-pale);
          border-color: var(--orange-pale2);
          box-shadow: 0 14px 30px rgba(194,101,42,.14);
          transform: translateY(-1px);
        }
        .a-theme-toggle {
          overflow: hidden;
        }
        .a-theme-toggle svg {
          transition: transform var(--tr), opacity var(--tr);
        }
        .a-tb-username { font-size: .86rem; font-weight: 800; color: var(--text-1); white-space: nowrap; }
        .a-tb-role { font-size: .68rem; color: var(--text-3); white-space: nowrap; }

        .a-content {
          flex: 1;
          padding: 28px 28px 40px;
          overflow-y: auto;
        }
        @media (max-width: 639px) {
          .a-content { padding: 18px 16px 32px; }
        }

        @media (min-width: 400px) {
          .par {display:flex;}
        }
      `}</style>

      <div className={`a-root ${darkMode ? 'a-root--dark' : ''}`}>
        {mobileOpen && <div className="a-overlay" onClick={() => setMobileOpen(false)} aria-hidden />}

        {/* SIDEBAR */}
        <aside className={`a-sidebar ${effectiveCollapsed ? 'a-sidebar--col' : ''} ${mobileOpen ? 'a-sidebar--open' : ''}`}>
          {/* Brand */}
          <div className={`a-brand ${effectiveCollapsed ? 'a-brand--col' : ''}`}>
            <Link href={route('home')} className="a-brand-inner">
              {effectiveCollapsed ? (
                <img src={logo} alt="Logo" style={{ width: 32, height: 32 }} />
              ) : (
                <>
                  <img src={logo} alt="Logo" style={{ width: 32, height: 32 }} />
                  <span className="a-brand-name">Info<span>Saloua</span></span>
                </>
              )}
            </Link>
            {windowWidth >= 768 && (
              <button
                onClick={() => setCollapsed(c => !c)}
                className="a-collapse-btn"
                aria-label={collapsed ? 'Développer' : 'Réduire'}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M9.67272 0.522841C10.8339 0.522841 11.76 0.522714 12.4963 0.602493C13.2453 0.683657 13.8789 0.854248 14.4264 1.25197C14.7504 1.48739 15.0355 1.77247 15.2709 2.0965C15.6686 2.64394 15.8392 3.27758 15.9204 4.02655C16.0002 4.7629 16 5.68895 16 6.85014V9.14986C16 10.3111 16.0002 11.2371 15.9204 11.9735C15.8392 12.7224 15.6686 13.3561 15.2709 13.9035C15.0355 14.2275 14.7504 14.5126 14.4264 14.748C13.8789 15.1458 13.2453 15.3163 12.4963 15.3975C11.76 15.4773 10.8339 15.4772 9.67272 15.4772H6.3273C5.16611 15.4772 4.24006 15.4773 3.50371 15.3975C2.75474 15.3163 2.1211 15.1458 1.57366 14.748C1.24963 14.5126 0.964549 14.2275 0.729131 13.9035C0.331407 13.3561 0.160817 12.7224 0.0796529 11.9735C-0.000126137 11.2371 1.25338e-09 10.3111 1.25338e-09 9.14986V6.85014C1.25329e-09 5.68895 -0.000126137 4.7629 0.0796529 4.02655C0.160817 3.27758 0.331407 2.64394 0.729131 2.0965C0.964549 1.77247 1.24963 1.48739 1.57366 1.25197C2.1211 0.854248 2.75474 0.683657 3.50371 0.602493C4.24006 0.522714 5.16611 0.522841 6.3273 0.522841H9.67272ZM5.54303 1.88715V14.1118C5.78636 14.1128 6.04709 14.1169 6.3273 14.1169H9.67272C10.8639 14.1169 11.7032 14.1164 12.3493 14.0465C12.9824 13.9779 13.3497 13.8494 13.6268 13.6482C13.8354 13.4966 14.0195 13.3125 14.1711 13.1039C14.3723 12.8268 14.5007 12.4595 14.5693 11.8264C14.6393 11.1803 14.6398 10.341 14.6398 9.14986V6.85014C14.6398 5.65896 14.6393 4.81967 14.5693 4.1736C14.5007 3.54048 14.3723 3.17318 14.1711 2.89609C14.0195 2.68747 13.8354 2.50337 13.6268 2.35179C13.3497 2.1506 12.9824 2.02212 12.3493 1.95353C11.7032 1.88358 10.8639 1.88307 9.67272 1.88307H6.3273C6.04709 1.88307 5.78636 1.8862 5.54303 1.88715ZM4.1828 1.91166C3.99125 1.9216 3.8148 1.93577 3.65076 1.95353C3.01764 2.02212 2.65034 2.1506 2.37325 2.35179C2.16463 2.50337 1.98052 2.68747 1.82895 2.89609C1.62776 3.17318 1.49928 3.54048 1.43069 4.1736C1.36074 4.81967 1.36023 5.65896 1.36023 6.85014V9.14986C1.36023 10.341 1.36074 11.1803 1.43069 11.8264C1.49928 12.4595 1.62776 12.8268 1.82895 13.1039C1.98052 13.3125 2.16463 13.4966 2.37325 13.6482C2.65034 13.8494 3.01764 13.9779 3.65076 14.0465C3.81478 14.0642 3.99127 14.0774 4.1828 14.0873V1.91166Z" fill="currentColor" />
                </svg>
              </button>
            )}
          </div>

          {/* User card */}
          <div className={`a-user-card ${effectiveCollapsed ? 'a-user-card--col' : ''}`}>
            <div className="a-avatar">
              {avatarUrl ? <img src={avatarUrl} alt={user.name} className="a-avatar-img" /> : initials}
            </div>
            {!effectiveCollapsed && (
              <div className="a-user-info">
                <p className="a-user-name">{user.name}</p>
                <p className="a-user-role">Étudiant · Actif</p>
              </div>
            )}
          </div>

          <div className="a-divider" />

          {/* Navigation */}
          <nav className="a-nav">
            <NavSection title="Menu principal" items={NAV_MAIN}    collapsed={effectiveCollapsed} />
            <NavSection title="Finances"       items={NAV_FINANCE} collapsed={effectiveCollapsed} />
            <NavSection title="Mon compte"     items={navAccount} collapsed={effectiveCollapsed} />
          </nav>

          {/* Logout */}
          <div className="a-logout-wrap">
            <Link
              href={route('logout')}
              method="post"
              as="button"
              className="a-logout-btn"
              title={effectiveCollapsed ? 'Déconnexion' : undefined}
            >
              <span className="a-logout-icon"><I.Logout /></span>
              {!effectiveCollapsed && <span>Déconnexion</span>}
            </Link>
          </div>
        </aside>

        {/* MAIN */}
        <div className="a-main">
          <header className={`a-topbar ${scrolled ? 'a-topbar--scrolled' : ''}`}>
            <button className="a-mobile-menu" onClick={() => setMobileOpen(o => !o)} aria-label="Menu">
              {mobileOpen ? <I.Close /> : <I.Menu />}
            </button>
            <div className="a-topbar-title">{header}</div>
            <div className="a-topbar-right">
              <Link
                href={route('profile.edit')}
                className={`a-tb-btn par hidden ${route().current('profile.edit') ? 'a-tb-btn--active' : ''}`}
                aria-label="Parametres"
                title="Parametres du compte"
              >
                <Settings size={18} />
              </Link>
              <div className="a-notif-wrap">
                <button
                  className={`a-tb-btn flex ${notificationsOpen ? 'a-tb-btn--active' : ''}`}
                  aria-label="Notifications"
                  type="button"
                  onClick={() => setNotificationsOpen(open => !open)}
                >
                  <I.Bell />
                  {totalHeaderNotifications > 0 && <span className="a-tb-badge">{totalHeaderNotifications}</span>}
                </button>
                {notificationsOpen && (
                  <div className="a-notif-menu">
                    <div className="a-notif-head">
                      <strong>Notifications</strong>
                      {totalHeaderNotifications > 0 && (
                        <button
                          type="button"
                          onClick={() => router.post(route('student.notifications.read-all'), {}, { preserveScroll: true })}
                        >
                          Tout lire
                        </button>
                      )}
                    </div>
                    <div className="a-notif-list">
                      {studentHeader.recentNotifications?.length ? (
                        studentHeader.recentNotifications.map((notification: any) => (
                          <Link
                            key={notification.id}
                            href={notification.actionUrl || route('student.notifications')}
                            className={`a-notif-item ${notification.isRead ? '' : 'a-notif-item--unread'}`}
                            onClick={() => setNotificationsOpen(false)}
                          >
                            <strong>{notification.title}</strong>
                            <span>{notification.message}</span>
                            <small>{notification.publishedAt}</small>
                          </Link>
                        ))
                      ) : (
                        <div className="a-notif-empty">Aucune notification pour le moment.</div>
                      )}
                    </div>
                    <Link href={route('student.notifications')} className="a-notif-foot" onClick={() => setNotificationsOpen(false)}>
                      Voir toutes les notifications
                    </Link>
                  </div>
                )}
              </div>
              <button
                className="a-tb-btn a-theme-toggle flex"
                aria-label={darkMode ? 'Activer le mode clair' : 'Activer le mode sombre'}
                title={darkMode ? 'Mode clair' : 'Mode sombre'}
                type="button"
                onClick={() => setDarkMode(mode => !mode)}
              >
                {darkMode ? <I.Sun /> : <I.Moon />}
              </button>
              <Link href={route('profile.edit')} className="a-tb-user">
                <div className="a-avatar a-avatar--sm">
                  {avatarUrl ? <img src={avatarUrl} alt={user.name} className="a-avatar-img" /> : initials}
                </div>
                <div>
                  <p className="a-tb-username">{user.name.split(' ')[0]}</p>
                  <p className="a-tb-role">Profil étudiant</p>
                </div>
              </Link>
            </div>
          </header>
          <main className="a-content">{children}</main>
        </div>
      </div>
    </>
  )
}
