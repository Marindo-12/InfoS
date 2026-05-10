import { Link, router, usePage } from '@inertiajs/react'
import { PropsWithChildren, ReactNode, useState, useEffect, useRef } from 'react'
import logo from '../../../public/infos-logo.png'
import { Settings } from 'lucide-react'

/* ═══════════════════════════════════════════════
   ICONS
═══════════════════════════════════════════════ */
const I = {
  Dashboard: () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>,
  Students: () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
  Applications: () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14,2 14,8 20,8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10,9 9,9 8,9" /></svg>,
  Courses: () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>,
  Payments: () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>,
  Reports: () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>,
  Schedule: () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
  Bell: () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>,
  Search: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
  Chevron: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>,
  Menu: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>,
  Close: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
  Moon: () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>,
  Sun: () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></svg>,
  Logout: () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>,
}

/* ═══════════════════════════════════════════════
   NAV DATA
═══════════════════════════════════════════════ */
interface NavItem {
  label: string
  icon: ReactNode
  route: string
  routeName: string
  badge?: number
}

const NAV_CORE: NavItem[] = [
  { label: 'Vue d\'ensemble', icon: <I.Dashboard />, route: route('admin.dashboard'), routeName: 'admin.dashboard' },
  { label: 'Candidatures', icon: <I.Applications />, route: route('admin.applications'), routeName: 'admin.applications' },
  { label: 'Étudiants', icon: <I.Students />, route: route('admin.students'), routeName: 'admin.students' },
  { label: 'Formations', icon: <I.Courses />, route: route('admin.courses'), routeName: 'admin.courses' },
  { label: 'Planning', icon: <I.Schedule />, route: route('admin.schedule'), routeName: 'admin.schedule' },
]

const NAV_FINANCE: NavItem[] = [
  { label: 'Paiements', icon: <I.Payments />, route: route('admin.payments'), routeName: 'admin.payments' },
  { label: 'Rapports', icon: <I.Reports />, route: route('admin.reports'), routeName: 'admin.reports' },
]

const NAV_SYSTEM: NavItem[] = [
  { label: 'Notifications', icon: <I.Bell />, route: route('admin.notifications'), routeName: 'admin.notifications' },
  { label: 'Paramètres', icon: <Settings size={20} />, route: route('profile.edit'), routeName: 'profile.edit' },
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
   LAYOUT — SIDEBAR MODE JOUR (LIGHT)
═══════════════════════════════════════════════ */
export default function AdminLayout({
  header,
  children,
}: PropsWithChildren<{ header?: ReactNode }>) {

  const pageProps = usePage().props as any
  const user = pageProps.auth.user
  const adminHeader = pageProps.adminHeader ?? { unreadNotifications: 0, pendingApplications: 0, recentNotifications: [] }
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [windowWidth, setWindowWidth] = useState(0)
  const [isDark, setIsDark] = useState(false)
  const notificationsRef = useRef<HTMLDivElement | null>(null)

  // Détection largeur écran
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const storedTheme = localStorage.getItem('infos-admin-theme')
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
    setIsDark(storedTheme ? storedTheme === 'dark' : Boolean(prefersDark))
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem('infos-admin-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  // Mode réduit effectif : uniquement sur grand écran ET collapsed activé
  const effectiveCollapsed = collapsed && windowWidth >= 768

  // Forcer collapsed à false sur mobile
  useEffect(() => {
    if (windowWidth < 768 && collapsed) {
      setCollapsed(false)
    }
  }, [windowWidth, collapsed])

  const initials = user.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
  const avatarUrl = user.avatar_url ?? null
  const navCore = NAV_CORE.map(item =>
    item.routeName === 'admin.applications'
      ? { ...item, badge: adminHeader.pendingApplications || undefined }
      : item,
  )
  const navSystem = NAV_SYSTEM.map(item =>
    item.routeName === 'admin.notifications'
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

  useEffect(() => {
    if (!notificationsOpen) return

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null
      if (target && notificationsRef.current?.contains(target)) {
        return
      }

      setNotificationsOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [notificationsOpen])

  // SVG double flèche pour réduction
  const CollapseIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M9.67272 0.522841C10.8339 0.522841 11.76 0.522714 12.4963 0.602493C13.2453 0.683657 13.8789 0.854248 14.4264 1.25197C14.7504 1.48739 15.0355 1.77247 15.2709 2.0965C15.6686 2.64394 15.8392 3.27758 15.9204 4.02655C16.0002 4.7629 16 5.68895 16 6.85014V9.14986C16 10.3111 16.0002 11.2371 15.9204 11.9735C15.8392 12.7224 15.6686 13.3561 15.2709 13.9035C15.0355 14.2275 14.7504 14.5126 14.4264 14.748C13.8789 15.1458 13.2453 15.3163 12.4963 15.3975C11.76 15.4773 10.8339 15.4772 9.67272 15.4772H6.3273C5.16611 15.4772 4.24006 15.4773 3.50371 15.3975C2.75474 15.3163 2.1211 15.1458 1.57366 14.748C1.24963 14.5126 0.964549 14.2275 0.729131 13.9035C0.331407 13.3561 0.160817 12.7224 0.0796529 11.9735C-0.000126137 11.2371 1.25338e-09 10.3111 1.25338e-09 9.14986V6.85014C1.25329e-09 5.68895 -0.000126137 4.7629 0.0796529 4.02655C0.160817 3.27758 0.331407 2.64394 0.729131 2.0965C0.964549 1.77247 1.24963 1.48739 1.57366 1.25197C2.1211 0.854248 2.75474 0.683657 3.50371 0.602493C4.24006 0.522714 5.16611 0.522841 6.3273 0.522841H9.67272ZM5.54303 1.88715V14.1118C5.78636 14.1128 6.04709 14.1169 6.3273 14.1169H9.67272C10.8639 14.1169 11.7032 14.1164 12.3493 14.0465C12.9824 13.9779 13.3497 13.8494 13.6268 13.6482C13.8354 13.4966 14.0195 13.3125 14.1711 13.1039C14.3723 12.8268 14.5007 12.4595 14.5693 11.8264C14.6393 11.1803 14.6398 10.341 14.6398 9.14986V6.85014C14.6398 5.65896 14.6393 4.81967 14.5693 4.1736C14.5007 3.54048 14.3723 3.17318 14.1711 2.89609C14.0195 2.68747 13.8354 2.50337 13.6268 2.35179C13.3497 2.1506 12.9824 2.02212 12.3493 1.95353C11.7032 1.88358 10.8639 1.88307 9.67272 1.88307H6.3273C6.04709 1.88307 5.78636 1.8862 5.54303 1.88715ZM4.1828 1.91166C3.99125 1.9216 3.8148 1.93577 3.65076 1.95353C3.01764 2.02212 2.65034 2.1506 2.37325 2.35179C2.16463 2.50337 1.98052 2.68747 1.82895 2.89609C1.62776 3.17318 1.49928 3.54048 1.43069 4.1736C1.36074 4.81967 1.36023 5.65896 1.36023 6.85014V9.14986C1.36023 10.341 1.36074 11.1803 1.43069 11.8264C1.49928 12.4595 1.62776 12.8268 1.82895 13.1039C1.98052 13.3125 2.16463 13.4966 2.37325 13.6482C2.65034 13.8494 3.01764 13.9779 3.65076 14.0465C3.81478 14.0642 3.99127 14.0774 4.1828 14.0873V1.91166Z" fill="currentColor" />
    </svg>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;1,400&family=Manrope:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* ── Design tokens ── MODE JOUR (LIGHT) */
        :root {
          --al-sw:          256px;
          --al-sw-col:       80px;
          --al-th:           64px;

          /* Brand — orange chaud */
          --al-orange:       #c2652a;
          --al-orange-2:     #e8915a;
          --al-orange-pale:  #fff3ec;
          --al-orange-pale2: #fde8d8;

          /* Surfaces — SIDEBAR CLAIRE */
          --al-sidebar:      #ffffff;
          --al-sidebar-2:    #faf8f5;
          --al-sidebar-b:    rgba(0,0,0,0.08);
          --al-page:         #f5f4f1;
          --al-topbar:       rgba(245,244,241,0.92);

          /* Text — sombre sur fond clair */
          --al-t1:  #1a1612;
          --al-t2:  #6b5f55;
          --al-t3:  #b0a49a;

          /* Nav */
          --al-nav-hover:   rgba(194,101,42,0.08);
          --al-nav-active:  rgba(194,101,42,0.12);
          --al-nav-active-t:#c2652a;

          --al-font: 'Manrope', sans-serif;
          --al-tr:   .2s cubic-bezier(.4,0,.2,1);
        }

        .al-root {
          display: flex; min-height: 100vh;
          background: var(--al-page);
          font-family: var(--al-font);
          width: 100%;
          max-width: 100vw;
          overflow-x: hidden;
        }
        .al-root.al-dark {
          --al-orange:       #f0a878;
          --al-orange-2:     #d47c45;
          --al-orange-pale:  rgba(240,168,120,.12);
          --al-orange-pale2: rgba(240,168,120,.22);
          --al-sidebar:      #17130f;
          --al-sidebar-2:    #211b16;
          --al-sidebar-b:    rgba(240,232,222,0.10);
          --al-page:         #14110f;
          --al-topbar:       rgba(20,17,15,0.86);
          --al-t1:  #f8efe5;
          --al-t2:  #d1c2b4;
          --al-t3:  #8f8174;
          --al-nav-hover:   rgba(240,168,120,0.10);
          --al-nav-active:  rgba(240,168,120,0.16);
          --al-nav-active-t:#f0a878;
        }

        .al-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,.5);
          backdrop-filter: blur(4px);
          z-index: 39;
        }

        /* SIDEBAR */
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

        /* BRAND */
        .al-brand {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: var(--al-th);
          padding: 0 16px;
          border-bottom: 1px solid var(--al-sidebar-b);
          flex-shrink: 0;
          transition: flex-direction var(--al-tr), padding var(--al-tr);
        }
        .al-brand--col {
          flex-direction: column;
          justify-content: center;
          gap: 8px;
          height: auto;
          padding: 12px 0;
        }
        .al-brand-inner {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          overflow: hidden;
          flex: 1;
        }
        .al-brand--col .al-brand-inner {
          justify-content: center;
          flex: none;
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
          background: rgba(194,101,42,.12);
          color: var(--al-orange);
          padding: 2px 7px; border-radius: 99px;
          white-space: nowrap;
        }
        .al-collapse-btn {
          width: 32px; height: 32px;
          flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          border-radius: 7px;
          background: transparent; color: var(--al-t3); cursor: pointer;
          transition: background var(--al-tr), color var(--al-tr), transform var(--al-tr);
        }
        .al-collapse-btn:hover {
          background: rgba(0,0,0,0.05);
          color: var(--al-orange);
        }
        .al-root.al-dark .al-collapse-btn:hover {
          background: rgba(255,255,255,0.06);
        }
        .al-brand--col .al-collapse-btn { transform: rotate(180deg); }

        @media (max-width: 767px) {
          .al-collapse-btn { display: none; }
        }

        /* Admin info */
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
          font-size: .68rem; color: var(--al-orange);
          font-weight: 700; letter-spacing: .04em;
          white-space: nowrap;
        }

        /* NAVIGATION */
        .al-nav {
          flex: 1; overflow-y: auto; overflow-x: hidden;
          padding: 8px 0;
          scrollbar-width: thin;
          scrollbar-color: rgba(0,0,0,0.08) transparent;
        }
        .al-nav::-webkit-scrollbar { width: 3px; }
        .al-nav::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.08); border-radius: 99px; }

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
        .al-nav-item:hover { background: var(--al-nav-hover); color: var(--al-orange); }
        .al-nav-item--active { background: var(--al-nav-active); color: var(--al-nav-active-t); }

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
          background: rgba(194,101,42,0.08);
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
        .al-logout-btn:hover { background: rgba(239,68,68,.1); color: #e05252; }
        .al-logout-icon {
          width: 32px; height: 32px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          border-radius: 8px; transition: background var(--al-tr);
        }
        .al-logout-btn:hover .al-logout-icon { background: rgba(239,68,68,.15); }

        /* MAIN AREA */
        .al-main {
          flex: 1;
          margin-left: var(--al-sw);
          transition: margin-left var(--al-tr);
          display: flex; flex-direction: column;
          min-height: 100vh;
          min-width: 0;
          max-width: 100%;
        }
        .al-sidebar--col ~ .al-main { margin-left: var(--al-sw-col); }
        @media (max-width: 767px) { .al-main { margin-left: 0 !important; } }

        /* Topbar */
        .al-topbar {
          position: sticky; top: 0; z-index: 30;
          height: var(--al-th);
          background: var(--al-topbar);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid transparent;
          display: flex; align-items: center;
          padding: 0 28px; gap: 14px;
          transition: border-color var(--al-tr), box-shadow var(--al-tr);
          min-width: 0;
        }
        .al-topbar--scrolled {
          border-bottom-color: rgba(0,0,0,0.07);
          box-shadow: 0 1px 14px rgba(0,0,0,0.06);
        }
        .al-root.al-dark .al-topbar--scrolled {
          border-bottom-color: rgba(240,232,222,.10);
          box-shadow: 0 12px 32px rgba(0,0,0,.26);
        }

        .al-mobile-btn {
          display: none;
          align-items: center; justify-content: center;
          width: 36px; height: 36px;
          border-radius: 9px; border: 1px solid rgba(0,0,0,0.09);
          background: #fff; color: #555; cursor: pointer; flex-shrink: 0;
        }
        .al-root.al-dark .al-mobile-btn {
          background: #211b16;
          color: #d1c2b4;
          border-color: rgba(240,232,222,.12);
        }
        @media (max-width: 767px) { .al-mobile-btn { display: flex; } }

        .al-topbar-title { flex: 1; min-width: 0; overflow: hidden; }
        .al-root.al-dark .al-topbar-title span {
          color: var(--al-t3) !important;
        }
        .al-root.al-dark .al-topbar-title span:last-child {
          color: var(--al-t1) !important;
        }

        .al-search {
          display: flex; align-items: center; gap: 8px;
          height: 36px; padding: 0 12px;
          border-radius: 10px;
          border: 1px solid rgba(0,0,0,0.09);
          background: #fff;
          transition: border-color var(--al-tr), box-shadow var(--al-tr);
        }
        .al-root.al-dark .al-search {
          background: #211b16;
          border-color: rgba(240,232,222,.12);
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
        .al-root.al-dark .al-search input { color: #f8efe5; }
        .al-search input::placeholder { color: #b0a49a; }
        @media (max-width: 639px) { .al-search { display: none; } }

        .al-topbar-right { display: flex; align-items: center; gap: 8px; min-width: 0; }

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
        .al-theme-btn {
          position: relative;
        }
        .al-tb-btn:hover {
          background: var(--al-orange-pale);
          color: var(--al-orange);
          border-color: var(--al-orange-pale2);
        }
        .al-root.al-dark .al-tb-btn {
          background: #211b16;
          color: #d1c2b4;
          border-color: rgba(240,232,222,.12);
        }
        .al-root.al-dark .al-tb-btn:hover {
          background: rgba(240,168,120,.12);
          color: #f0a878;
          border-color: rgba(240,168,120,.25);
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
        .al-root.al-dark .al-notif-menu {
          background: #211b16;
          border-color: rgba(240,232,222,.12);
          box-shadow: 0 18px 50px rgba(0,0,0,.36);
        }
        .al-notif-head {
          display: flex; align-items: center; justify-content: space-between; gap: 12px;
          padding: 14px 16px;
          border-bottom: 1px solid rgba(15,23,42,.07);
        }
        .al-notif-head strong { font-size: .86rem; color: #18181b; }
        .al-root.al-dark .al-notif-head strong { color: #f8efe5; }
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
        .al-root.al-dark .al-notif-item {
          background: #211b16;
          border-bottom-color: rgba(240,232,222,.08);
        }
        .al-notif-item:hover { background: #fffaf6; }
        .al-notif-item--unread { background: #fff7ed; }
        .al-root.al-dark .al-notif-item:hover,
        .al-root.al-dark .al-notif-item--unread {
          background: rgba(240,168,120,.10);
        }
        .al-notif-item strong {
          display: block; color: #18181b; font-size: .8rem; margin-bottom: 4px;
        }
        .al-root.al-dark .al-notif-item strong { color: #f8efe5; }
        .al-notif-item span {
          display: block; color: #6b7280; font-size: .73rem; line-height: 1.45;
        }
        .al-root.al-dark .al-notif-item span { color: #d1c2b4; }
        .al-notif-item small {
          display: block; color: #a1a1aa; font-size: .67rem; margin-top: 6px;
        }
        .al-notif-empty { padding: 18px 16px; color: #6b7280; font-size: .8rem; }
        .al-root.al-dark .al-notif-empty { color: #d1c2b4; }
        .al-notif-foot {
          display: block; padding: 12px 16px; color: var(--al-orange);
          background: #faf8f5; text-decoration: none; font-size: .78rem; font-weight: 800;
          border-top: 1px solid rgba(15,23,42,.07);
        }
        .al-root.al-dark .al-notif-foot {
          background: #17130f;
          border-top-color: rgba(240,232,222,.10);
        }

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
          text-decoration: none;
        }
        .al-root.al-dark .al-tb-user {
          background: #211b16;
          border-color: rgba(240,168,120,.20);
          box-shadow: 0 10px 24px rgba(0,0,0,.22);
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
        .al-root.al-dark .al-tb-username { color: #f8efe5; }
        .al-tb-role { font-size: .68rem; color: #8b8078; white-space: nowrap; }
        .al-root.al-dark .al-tb-role { color: #9f9286; }

        .al-content {
          flex: 1; padding: 0;
          overflow-y: auto;
          overflow-x: hidden;
          min-width: 0;
          max-width: 100%;
        }

        @media (max-width: 767px) {
          .al-topbar { padding: 0 12px; gap: 8px; }
          .al-admin-tag { display: none; }
          .al-tb-user {
            display: flex;
            min-height: 38px;
            padding: 3px;
            border-radius: 12px;
          }
          .al-tb-user > div:not(.al-av) { display: none; }
          .al-tb-user .al-av--sm {
            width: 30px;
            height: 30px;
          }
          .al-topbar-right { flex-shrink: 0; }
        }
      `}</style>

      <div className={`al-root ${isDark ? 'al-dark dark' : ''}`}>

        {mobileOpen && (
          <div className="al-overlay" onClick={() => setMobileOpen(false)} aria-hidden />
        )}

        {/* SIDEBAR — TOUJOURS EN MODE JOUR (light) */}
        <aside className={`al-sidebar ${effectiveCollapsed ? 'al-sidebar--col' : ''} ${mobileOpen ? 'al-sidebar--open' : ''}`}>

          {/* Brand */}
          <div className={`al-brand ${effectiveCollapsed ? 'al-brand--col' : ''}`}>
            <Link href={route('home')} className="al-brand-inner">
              {effectiveCollapsed ? (
                <img src={logo} alt="InfoSaloua" style={{ width: 32, height: 32 }} />
              ) : (
                <>
                  <img src={logo} alt="InfoSaloua" style={{ width: 32, height: 32 }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span className="al-brand-name">Info<em>Saloua</em></span>
                    <span className="al-brand-tag">Administration</span>
                  </div>
                </>
              )}
            </Link>
            {windowWidth >= 768 && (
              <button
                onClick={() => setCollapsed(c => !c)}
                className="al-collapse-btn"
                aria-label={collapsed ? 'Développer' : 'Réduire'}
              >
                <CollapseIcon />
              </button>
            )}
          </div>

          {/* Admin info */}
          <div className={`al-admin-info ${effectiveCollapsed ? 'al-admin-info--col' : ''}`}>
            <div className="al-av">
              {avatarUrl ? <img src={avatarUrl} alt={user.name} className="al-av-img" /> : initials}
            </div>
            {!effectiveCollapsed && (
              <div style={{ overflow: 'hidden', flex: 1 }}>
                <p className="al-admin-name">{user.name}</p>
                <p className="al-admin-role">Administrateur</p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="al-nav">
            <NavSection title="Gestion" items={navCore} collapsed={effectiveCollapsed} />
            <NavSection title="Finances" items={NAV_FINANCE} collapsed={effectiveCollapsed} />
            <NavSection title="Système" items={navSystem} collapsed={effectiveCollapsed} />
          </nav>

          {/* Logout */}
          <div className="al-logout-wrap">
            <Link
              href={route('logout')}
              method="post"
              as="button"
              className="al-logout-btn"
              title={effectiveCollapsed ? 'Déconnexion' : undefined}
            >
              <span className="al-logout-icon"><I.Logout /></span>
              {!effectiveCollapsed && <span>Déconnexion</span>}
            </Link>
          </div>

        </aside>

        {/* MAIN */}
        <div className="al-main">

          <header className={`al-topbar ${scrolled ? 'al-topbar--scrolled' : ''}`}>
            <button className="al-mobile-btn" onClick={() => setMobileOpen(o => !o)}>
              {mobileOpen ? <I.Close /> : <I.Menu />}
            </button>

            <div className="al-topbar-title">{header}</div>

            <div className="al-topbar-right">
              <button
                className="al-tb-btn al-theme-btn"
                aria-label={isDark ? 'Activer le mode clair' : 'Activer le mode sombre'}
                title={isDark ? 'Mode clair' : 'Mode sombre'}
                type="button"
                onClick={() => setIsDark(value => !value)}
              >
                {isDark ? <I.Sun /> : <I.Moon />}
              </button>

              <div className="al-admin-tag">
                <span className="al-admin-tag-dot" />
                Admin
              </div>

              <div className="al-notif-wrap" ref={notificationsRef}>
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
                            href={notification.actionUrl || route('admin.notifications')}
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
                    <Link href={route('admin.notifications')} className="al-notif-foot" onClick={() => setNotificationsOpen(false)}>
                      Voir toutes les notifications
                    </Link>
                  </div>
                )}
              </div>

              <Link href={route('profile.edit')} className="al-tb-user">
                <div className="al-av al-av--sm">
                  {avatarUrl ? <img src={avatarUrl} alt={user.name} className="al-av-img" /> : initials}
                </div>
                <div>
                  <span className="al-tb-username">{user.name.split(' ')[0]}</span>
                  <p className="al-tb-role">Profil admin</p>
                </div>
              </Link>
            </div>
          </header>

          <main className="al-content">{children}</main>
        </div>
      </div>
    </>
  )
}
