import AdminLayout from '@/Layouts/AdminLayout'
import { Head, Link, router, usePage } from '@inertiajs/react'
import { useMemo, useState } from 'react'

type AdminNotificationCategory = 'application' | 'financial' | 'schedule' | 'system'

type NotificationItem = {
  id: number
  category: AdminNotificationCategory
  title: string
  message: string
  icon: string
  isRead: boolean
  timeLabel: string | null
  actionLabel?: string | null
  actionUrl?: string | null
}

type FilterItem = {
  key: string
  label: string
  count: number
}

type ImportantNotice = {
  title: string
  message: string
  actionLabel: string
  actionUrl: string
}

type PendingApplication = {
  id: number
  reference: string
  student: string
  course: string
  amount: string
  createdAt: string | null
}

type PageProps = {
  auth: {
    user: {
      id: number
      name: string
      email: string
    }
  }
  filters: FilterItem[]
  activeFilter: string
  unreadCount: number
  pendingCount: number
  notifications: NotificationItem[]
  importantNotice: ImportantNotice
  pendingApplications: PendingApplication[]
}

function materialIcon(name: string, className = '') {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>
}

function categoryLabel(category: AdminNotificationCategory) {
  if (category === 'application') return 'Candidatures'
  if (category === 'financial') return 'Financier'
  if (category === 'schedule') return 'Planning'
  return 'Systeme'
}

export default function AdminNotifications() {
  const {
    filters = [],
    activeFilter = 'all',
    unreadCount = 0,
    pendingCount = 0,
    notifications = [],
    importantNotice,
    pendingApplications = [],
  } = usePage<PageProps>().props

  const [selectedFilter, setSelectedFilter] = useState(activeFilter || 'all')

  const visibleNotifications = useMemo(
    () => selectedFilter === 'all'
      ? notifications
      : notifications.filter(notification => notification.category === selectedFilter),
    [notifications, selectedFilter],
  )

  const totalNotifications = filters.find(filter => filter.key === 'all')?.count ?? notifications.length
  const readCount = Math.max(totalNotifications - unreadCount, 0)

  return (
    <AdminLayout
      header={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Manrope,sans-serif' }}>
          <span style={{ fontSize: '.8rem', color: '#b0a49a' }}>Administration</span>
          <span style={{ color: '#b0a49a', fontSize: '.8rem' }}>/</span>
          <span style={{ fontSize: '.82rem', fontWeight: 700, color: '#1a1612' }}>Notifications</span>
        </div>
      }
    >
      <Head title="Notifications admin" />

      <main className="admnotif-root">
        <section className="admnotif-hero">
          <div>
            <p className="admnotif-kicker">Centre administratif</p>
            <h1>Notifications</h1>
            <p>
              {unreadCount > 0
                ? `${unreadCount} notification(s) non lue(s) attendent votre attention.`
                : 'Toutes les notifications administratives ont ete consultees.'}
            </p>
          </div>

          <button
            type="button"
            className="admnotif-primary"
            onClick={() => router.post(route('admin.notifications.read-all'), {}, { preserveScroll: true })}
          >
            {materialIcon('done_all')}
            Tout marquer comme lu
          </button>
        </section>

        <section className="admnotif-stats" aria-label="Resume des notifications">
          <article>
            <div>
              {materialIcon('notifications')}
              <span>Total</span>
            </div>
            <strong>{totalNotifications}</strong>
            <small>Notification{totalNotifications > 1 ? 's' : ''}</small>
          </article>

          <article>
            <div>
              {materialIcon('mark_email_unread')}
              <span>Non lues</span>
            </div>
            <strong>{unreadCount}</strong>
            <small>A traiter</small>
          </article>

          <article>
            <div>
              {materialIcon('pending_actions')}
              <span>Candidatures</span>
            </div>
            <strong>{pendingCount}</strong>
            <small>En attente</small>
          </article>
        </section>

        <section className="admnotif-board">
          <div className="admnotif-main">
            <div className="admnotif-section-head">
              <h2>Boite de reception</h2>
              <span>{readCount} lue{readCount > 1 ? 's' : ''}</span>
            </div>

            <div className="admnotif-filters" aria-label="Filtres de notifications">
              {filters.map(filter => (
                <button
                  type="button"
                  key={filter.key}
                  className={`admnotif-filter ${selectedFilter === filter.key ? 'is-active' : ''}`}
                  onClick={() => setSelectedFilter(filter.key)}
                >
                  {filter.label}
                  <span>{filter.count}</span>
                </button>
              ))}
            </div>

            <div className="admnotif-list">
              {visibleNotifications.length > 0 ? visibleNotifications.map(notification => (
                <article
                  className={`admnotif-item ${notification.category} ${notification.isRead ? 'is-read' : 'is-unread'}`}
                  key={notification.id}
                >
                  <div className="admnotif-icon">
                    {materialIcon(notification.icon)}
                  </div>

                  <div className="admnotif-copy">
                    <div className="admnotif-item-head">
                      <div>
                        <span>{categoryLabel(notification.category)}</span>
                        <h3>{notification.title}</h3>
                      </div>
                      <time>{notification.timeLabel ?? 'Recemment'}</time>
                    </div>

                    <p>{notification.message}</p>

                    <div className="admnotif-meta">
                      <span className={`admnotif-status ${notification.isRead ? 'read' : 'unread'}`}>
                        {notification.isRead ? 'Lu' : 'Non lu'}
                      </span>
                      {notification.actionLabel && notification.actionUrl && (
                        <Link href={notification.actionUrl}>{notification.actionLabel}</Link>
                      )}
                    </div>
                  </div>
                </article>
              )) : (
                <div className="admnotif-empty">
                  {materialIcon('notifications_off')}
                  <p>Aucune notification pour ce filtre.</p>
                </div>
              )}
            </div>
          </div>

          <aside className="admnotif-side">
            <section className="admnotif-panel admnotif-important">
              <p className="admnotif-kicker">Important</p>
              <h2>{importantNotice.title}</h2>
              <p>{importantNotice.message}</p>
              <Link href={importantNotice.actionUrl}>{importantNotice.actionLabel}</Link>
            </section>

            <section className="admnotif-panel">
              <div className="admnotif-section-head compact">
                <h2>Candidatures recentes</h2>
              </div>

              <div className="admnotif-pending-list">
                {pendingApplications.length > 0 ? pendingApplications.map(application => (
                  <article className="admnotif-pending" key={application.id}>
                    <div>
                      <strong>{application.student}</strong>
                      <span>{application.reference}</span>
                    </div>
                    <p>{application.course}</p>
                    <small>{application.amount} · {application.createdAt ?? 'Recemment'}</small>
                  </article>
                )) : (
                  <div className="admnotif-empty small">
                    <p>Aucune candidature en attente.</p>
                  </div>
                )}
              </div>
            </section>
          </aside>
        </section>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

        .admnotif-root {
          --bg: #faf5ee;
          --surface-low: #f6f0e8;
          --surface-mid: #ece6dc;
          --surface: #ffffff;
          --text: #3a302a;
          --muted: #605850;
          --soft: #9a9088;
          --line: rgba(216, 208, 200, .75);
          --primary: #c2652a;
          --primary-soft: #fbe8d8;
          color: var(--text);
          display: flex;
          flex-direction: column;
          gap: 34px;
          font-family: 'Manrope', sans-serif;
          margin: 0;
          min-height: calc(100vh - 64px);
          padding: 42px clamp(18px, 4vw, 48px) 58px;
          background-color: var(--bg);
          background-image: radial-gradient(rgba(216, 208, 200, .75) .6px, transparent .6px);
          background-size: 24px 24px;
        }

        .admnotif-root * { box-sizing: border-box; }
        .admnotif-root .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 430, 'GRAD' 0, 'opsz' 24; }

        .admnotif-hero {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
        }
        .admnotif-kicker {
          color: var(--primary);
          font-size: .72rem;
          font-weight: 900;
          letter-spacing: .16em;
          margin: 0 0 10px;
          text-transform: uppercase;
        }
        .admnotif-hero h1 {
          font-family: 'EB Garamond', serif;
          font-size: clamp(3.2rem, 7vw, 6rem);
          font-weight: 600;
          line-height: .92;
          margin: 0;
        }
        .admnotif-hero p:not(.admnotif-kicker) {
          color: var(--muted);
          font-size: .95rem;
          font-weight: 700;
          line-height: 1.65;
          margin: 18px 0 0;
          max-width: 720px;
        }
        .admnotif-primary {
          align-items: center;
          background: var(--primary);
          border: 0;
          border-radius: 8px;
          color: white;
          cursor: pointer;
          display: inline-flex;
          flex-shrink: 0;
          font-family: 'Manrope', sans-serif;
          font-size: .88rem;
          font-weight: 900;
          gap: 9px;
          min-height: 48px;
          padding: 0 20px;
        }

        .admnotif-stats {
          display: grid;
          gap: 18px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
        .admnotif-stats article,
        .admnotif-panel,
        .admnotif-item,
        .admnotif-filter {
          background: var(--surface);
          border: 1px solid var(--line);
          border-radius: 12px;
          box-shadow: 0 2px 16px rgba(58, 48, 42, .045);
        }
        .admnotif-stats article { min-height: 150px; padding: 26px; }
        .admnotif-stats article div {
          align-items: flex-start;
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 18px;
        }
        .admnotif-stats .material-symbols-outlined,
        .admnotif-icon {
          background: var(--primary-soft);
          border-radius: 8px;
          color: var(--primary);
          padding: 11px;
        }
        .admnotif-stats div span:last-child {
          color: var(--muted);
          font-size: .68rem;
          font-weight: 900;
          letter-spacing: .08em;
          text-align: right;
          text-transform: uppercase;
        }
        .admnotif-stats strong {
          display: inline-block;
          font-family: 'EB Garamond', serif;
          font-size: 2.75rem;
          font-weight: 600;
          line-height: 1;
        }
        .admnotif-stats small { color: var(--muted); font-size: .85rem; margin-left: 7px; }

        .admnotif-board {
          align-items: start;
          display: grid;
          gap: 28px;
          grid-template-columns: minmax(0, 1.45fr) minmax(330px, .75fr);
        }
        .admnotif-main,
        .admnotif-side {
          display: flex;
          flex-direction: column;
          gap: 18px;
          min-width: 0;
        }
        .admnotif-section-head {
          align-items: center;
          display: flex;
          gap: 16px;
          justify-content: space-between;
        }
        .admnotif-section-head h2,
        .admnotif-panel h2 {
          font-family: 'EB Garamond', serif;
          font-size: 2rem;
          font-weight: 600;
          line-height: 1;
          margin: 0;
        }
        .admnotif-section-head > span {
          color: var(--soft);
          font-size: .72rem;
          font-weight: 900;
          letter-spacing: .1em;
          text-transform: uppercase;
        }
        .admnotif-section-head.compact { margin-bottom: 18px; }

        .admnotif-filters {
          background: var(--surface-low);
          border-radius: 10px;
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          padding: 6px;
          width: fit-content;
        }
        .admnotif-filter {
          align-items: center;
          border: 0;
          box-shadow: none;
          color: var(--muted);
          cursor: pointer;
          display: inline-flex;
          font-family: 'Manrope', sans-serif;
          font-size: .78rem;
          font-weight: 900;
          gap: 8px;
          min-height: 36px;
          padding: 0 13px;
        }
        .admnotif-filter span {
          align-items: center;
          background: var(--surface-mid);
          border-radius: 999px;
          display: inline-flex;
          font-size: .68rem;
          height: 20px;
          justify-content: center;
          min-width: 20px;
          padding: 0 6px;
        }
        .admnotif-filter.is-active {
          background: white;
          color: var(--primary);
          box-shadow: 0 1px 5px rgba(58, 48, 42, .08);
        }
        .admnotif-filter.is-active span { background: var(--primary-soft); }

        .admnotif-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .admnotif-item {
          display: grid;
          gap: 16px;
          grid-template-columns: 54px minmax(0, 1fr);
          overflow: hidden;
          padding: 20px;
          position: relative;
        }
        .admnotif-item::before {
          bottom: 0;
          content: '';
          left: 0;
          position: absolute;
          top: 0;
          width: 4px;
        }
        .admnotif-item.application::before { background: var(--primary); }
        .admnotif-item.financial::before { background: #8c3c3c; }
        .admnotif-item.schedule::before { background: #667f4a; }
        .admnotif-item.system::before { background: #78706a; }
        .admnotif-item.is-read { opacity: .78; }
        .admnotif-icon {
          align-items: center;
          display: flex;
          height: 54px;
          justify-content: center;
          padding: 0;
          width: 54px;
        }
        .admnotif-item.financial .admnotif-icon { background: #fce0e0; color: #8c3c3c; }
        .admnotif-item.schedule .admnotif-icon { background: #edf6df; color: #526b38; }
        .admnotif-item.system .admnotif-icon { background: var(--surface-low); color: var(--muted); }
        .admnotif-item-head {
          align-items: flex-start;
          display: flex;
          gap: 14px;
          justify-content: space-between;
        }
        .admnotif-item-head span {
          color: var(--primary);
          display: block;
          font-size: .66rem;
          font-weight: 900;
          letter-spacing: .12em;
          margin-bottom: 5px;
          text-transform: uppercase;
        }
        .admnotif-item-head h3 {
          font-family: 'EB Garamond', serif;
          font-size: 1.45rem;
          font-weight: 600;
          line-height: 1.08;
          margin: 0;
        }
        .admnotif-item-head time {
          color: var(--soft);
          flex-shrink: 0;
          font-size: .75rem;
          font-weight: 800;
        }
        .admnotif-copy p,
        .admnotif-panel p,
        .admnotif-pending p {
          color: var(--muted);
          font-size: .86rem;
          line-height: 1.7;
          margin: 10px 0 0;
        }
        .admnotif-meta {
          align-items: center;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 14px;
        }
        .admnotif-status {
          border-radius: 999px;
          display: inline-flex;
          font-size: .64rem;
          font-weight: 900;
          letter-spacing: .1em;
          padding: 5px 9px;
          text-transform: uppercase;
        }
        .admnotif-status.unread { background: var(--primary-soft); color: var(--primary); }
        .admnotif-status.read { background: var(--surface-low); color: var(--soft); }
        .admnotif-meta a,
        .admnotif-important a {
          color: var(--primary);
          font-size: .78rem;
          font-weight: 900;
          text-decoration: none;
        }

        .admnotif-panel { padding: 24px; }
        .admnotif-important { background: var(--surface-low); }
        .admnotif-important a {
          align-items: center;
          background: var(--primary);
          border-radius: 8px;
          color: white;
          display: inline-flex;
          margin-top: 18px;
          min-height: 42px;
          padding: 0 16px;
        }
        .admnotif-pending-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .admnotif-pending {
          background: var(--surface-low);
          border: 1px solid transparent;
          border-radius: 12px;
          padding: 15px;
        }
        .admnotif-pending div {
          align-items: center;
          display: flex;
          gap: 12px;
          justify-content: space-between;
        }
        .admnotif-pending strong { color: var(--text); font-size: .9rem; }
        .admnotif-pending span {
          color: var(--primary);
          flex-shrink: 0;
          font-size: .66rem;
          font-weight: 900;
        }
        .admnotif-pending small {
          color: var(--soft);
          display: block;
          font-size: .72rem;
          font-weight: 800;
          margin-top: 9px;
        }
        .admnotif-empty {
          align-items: center;
          border: 1.5px dashed rgba(154, 144, 136, .45);
          border-radius: 12px;
          color: var(--soft);
          display: flex;
          flex-direction: column;
          font-size: .82rem;
          font-style: italic;
          gap: 8px;
          justify-content: center;
          min-height: 160px;
          padding: 18px;
          text-align: center;
        }
        .admnotif-empty.small { min-height: 96px; }
        .admnotif-empty p { margin: 0; }

        .al-root.al-dark .admnotif-root {
          --bg: #14110f;
          --surface-low: #1f1a16;
          --surface-mid: #3b3028;
          --surface: #241f1a;
          --text: #f8efe5;
          --muted: #d5c8bc;
          --soft: #a09080;
          --line: rgba(210, 194, 181, .16);
          --primary: #f0a878;
          --primary-soft: rgba(240, 168, 120, .14);
          background-image: radial-gradient(rgba(210, 194, 181, .12) .6px, transparent .6px);
        }
        .al-root.al-dark .admnotif-stats article,
        .al-root.al-dark .admnotif-panel,
        .al-root.al-dark .admnotif-item,
        .al-root.al-dark .admnotif-filter.is-active {
          background: var(--surface);
          border-color: var(--line);
          box-shadow: 0 12px 32px rgba(0, 0, 0, .22);
        }
        .al-root.al-dark .admnotif-filters,
        .al-root.al-dark .admnotif-important,
        .al-root.al-dark .admnotif-pending,
        .al-root.al-dark .admnotif-status.read,
        .al-root.al-dark .admnotif-item.system .admnotif-icon {
          background: var(--surface-low);
        }
        .al-root.al-dark .admnotif-item.financial .admnotif-icon { background: rgba(255, 180, 171, .14); color: #ffb4ab; }
        .al-root.al-dark .admnotif-item.schedule .admnotif-icon { background: rgba(179, 212, 132, .14); color: #b3d484; }
        .al-root.al-dark .admnotif-pending { border-color: rgba(210, 194, 181, .12); }

        @media (max-width: 1180px) {
          .admnotif-board { grid-template-columns: 1fr; }
        }
        @media (max-width: 900px) {
          .admnotif-root { padding: 30px 16px 44px; }
          .admnotif-hero { align-items: flex-start; flex-direction: column; }
          .admnotif-stats { grid-template-columns: 1fr; }
        }
        @media (max-width: 560px) {
          .admnotif-hero h1 { font-size: 3rem; }
          .admnotif-primary { justify-content: center; width: 100%; }
          .admnotif-section-head,
          .admnotif-item-head { align-items: flex-start; flex-direction: column; }
          .admnotif-item { grid-template-columns: 1fr; }
          .admnotif-filters { width: 100%; }
          .admnotif-filter { flex: 1 1 auto; justify-content: center; }
          .admnotif-pending div { align-items: flex-start; flex-direction: column; gap: 4px; }
        }
      `}</style>
    </AdminLayout>
  )
}
