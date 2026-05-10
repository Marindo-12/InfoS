import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';

type NotificationItem = {
  id: number;
  category: 'academic' | 'financial' | 'news';
  title: string;
  message: string;
  icon: string;
  isRead: boolean;
  timeLabel: string | null;
  actionLabel?: string | null;
  actionUrl?: string | null;
};

type FilterItem = {
  key: string;
  label: string;
  count: number;
};

type ImportantNotice = {
  title: string;
  message: string;
  actionLabel: string;
  actionUrl: string;
};

type UpcomingItem = {
  day: string;
  month: string;
  title: string;
  meta: string;
};

type PageProps = {
  auth: {
    user: {
      id: number;
      name: string;
      email: string;
    };
  };
  filters: FilterItem[];
  activeFilter: string;
  unreadCount: number;
  notifications: NotificationItem[];
  importantNotice: ImportantNotice;
  upcoming: UpcomingItem[];
};

function categoryLabel(category: NotificationItem['category']) {
  if (category === 'academic') return 'Academique';
  if (category === 'financial') return 'Financier';
  return 'Actualites';
}

function categoryClass(category: NotificationItem['category']) {
  if (category === 'academic') return 'academic';
  if (category === 'financial') return 'financial';
  return 'news';
}

function materialIcon(name: string, className = '') {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>;
}

export default function Notifications() {
  const { props } = usePage<PageProps>();
  const { filters = [], activeFilter, unreadCount = 0, notifications = [], importantNotice, upcoming = [] } = props;
  const [selectedFilter, setSelectedFilter] = useState(activeFilter || 'all');
  const visibleNotifications = useMemo(
    () => selectedFilter === 'all'
      ? notifications
      : notifications.filter((notification) => notification.category === selectedFilter),
    [notifications, selectedFilter],
  );
  const totalNotifications = filters.find((filter) => filter.key === 'all')?.count ?? notifications.length;
  const readCount = Math.max(totalNotifications - unreadCount, 0);

  return (
    <AuthenticatedLayout header={<h2>Notifications</h2>}>
      <Head title="Notifications" />

      <div className="student-notifications">
        <section className="notif-hero">
          <div>
            <p className="notif-kicker">Centre etudiant</p>
            <h1>Activite recente</h1>
            <p>
              {unreadCount > 0
                ? `Vous avez ${unreadCount} notification(s) non lue(s) dans votre espace Info Saloua.`
                : 'Toutes vos notifications ont ete consultees.'}
            </p>
          </div>

          <button
            type="button"
            className="notif-primary"
            onClick={() => router.post(route('student.notifications.read-all'))}
          >
            {materialIcon('done_all')}
            Tout marquer comme lu
          </button>
        </section>

        <section className="notif-stats" aria-label="Resume des notifications">
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
              {materialIcon('event_available')}
              <span>A venir</span>
            </div>
            <strong>{upcoming.length}</strong>
            <small>Seance{upcoming.length > 1 ? 's' : ''}</small>
          </article>
        </section>

        <section className="notif-board">
          <div className="notif-main">
            <div className="notif-section-head">
              <h2>Boite de reception</h2>
              <span>{readCount} lue{readCount > 1 ? 's' : ''}</span>
            </div>

            <div className="notif-filters" aria-label="Filtres de notifications">
              {filters.map((filter) => (
                <button
                  type="button"
                  key={filter.key}
                  className={`notif-filter ${selectedFilter === filter.key ? 'is-active' : ''}`}
                  onClick={() => setSelectedFilter(filter.key)}
                >
                  {filter.label}
                  <span>{filter.count}</span>
                </button>
              ))}
            </div>

            <div className="notif-list">
              {visibleNotifications.length > 0 ? visibleNotifications.map((notification) => {
                const tone = categoryClass(notification.category);

                return (
                  <article className={`notif-item ${tone} ${notification.isRead ? 'is-read' : 'is-unread'}`} key={notification.id}>
                    <div className="notif-icon">
                      {materialIcon(notification.icon)}
                    </div>

                    <div className="notif-copy">
                      <div className="notif-item-head">
                        <div>
                          <span className="notif-category">{categoryLabel(notification.category)}</span>
                          <h3>{notification.title}</h3>
                        </div>
                        <time>{notification.timeLabel ?? 'Recemment'}</time>
                      </div>

                      <p>{notification.message}</p>

                      <div className="notif-meta">
                        <span className={`notif-status ${notification.isRead ? 'read' : 'unread'}`}>
                          {notification.isRead ? 'Lu' : 'Non lu'}
                        </span>
                        {notification.actionLabel && notification.actionUrl && (
                          <Link href={notification.actionUrl}>
                            {notification.actionLabel}
                          </Link>
                        )}
                      </div>
                    </div>
                  </article>
                );
              }) : (
                <div className="notif-empty">
                  {materialIcon('notifications_off')}
                  <p>Aucune notification pour ce filtre.</p>
                </div>
              )}
            </div>
          </div>

          <aside className="notif-side">
            <section className="notif-panel notif-important">
              <p className="notif-kicker">Important</p>
              <h2>{importantNotice.title}</h2>
              <p>{importantNotice.message}</p>
              <Link href={importantNotice.actionUrl}>
                {importantNotice.actionLabel}
              </Link>
            </section>

            <section className="notif-panel">
              <div className="notif-section-head compact">
                <h2>Prochaines seances</h2>
              </div>

              <div className="notif-upcoming-list">
                {upcoming.length > 0 ? upcoming.map((item) => (
                  <article className="notif-upcoming" key={`${item.day}-${item.month}-${item.title}`}>
                    <div className="notif-date">
                      <span>{item.month}</span>
                      <strong>{item.day}</strong>
                    </div>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.meta}</p>
                    </div>
                  </article>
                )) : (
                  <div className="notif-empty small">
                    <p>Aucune seance a venir.</p>
                  </div>
                )}
              </div>
            </section>
          </aside>
        </section>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

        .student-notifications {
          --surface: #faf5ee;
          --surface-low: #f6f0e8;
          --surface-mid: #ece6dc;
          --surface-high: #ffffff;
          --text: #3a302a;
          --muted: #605850;
          --soft: #9a9088;
          --line: #d8d0c8;
          --primary: #c2652a;
          --primary-soft: #fbe8d8;
          color: var(--text);
          display: flex;
          flex-direction: column;
          gap: 38px;
          font-family: 'Manrope', sans-serif;
          margin: -28px;
          min-height: calc(100vh - 64px);
          padding: 46px clamp(18px, 4vw, 48px) 64px;
          background-color: var(--surface);
          background-image: radial-gradient(rgba(216, 208, 200, .85) .6px, transparent .6px);
          background-size: 24px 24px;
        }

        .student-notifications * { box-sizing: border-box; }
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 430, 'GRAD' 0, 'opsz' 24; }

        .notif-hero {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
        }

        .notif-kicker {
          color: var(--primary);
          font-size: .72rem;
          font-weight: 800;
          letter-spacing: .16em;
          margin: 0 0 10px;
          text-transform: uppercase;
        }

        .notif-hero h1 {
          font-family: 'EB Garamond', serif;
          font-size: clamp(3.4rem, 8vw, 6.8rem);
          font-weight: 600;
          line-height: .9;
          margin: 0;
        }

        .notif-hero p:not(.notif-kicker) {
          color: var(--muted);
          font-size: .95rem;
          font-weight: 700;
          line-height: 1.65;
          margin: 18px 0 0;
          max-width: 720px;
        }

        .notif-primary {
          align-items: center;
          background: var(--primary);
          border: 0;
          border-radius: 8px;
          color: white;
          cursor: pointer;
          display: inline-flex;
          flex-shrink: 0;
          font-family: 'Manrope', sans-serif;
          font-size: .9rem;
          font-weight: 800;
          gap: 9px;
          min-height: 48px;
          padding: 0 20px;
        }

        .notif-stats {
          display: grid;
          gap: 18px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .notif-stats article,
        .notif-panel,
        .notif-item,
        .notif-filter {
          background: var(--surface-high);
          border: 1px solid rgba(216, 208, 200, .75);
          border-radius: 12px;
          box-shadow: 0 2px 16px rgba(58, 48, 42, .045);
        }

        .notif-stats article {
          min-height: 154px;
          padding: 26px;
        }

        .notif-stats article div {
          align-items: flex-start;
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 18px;
        }

        .notif-stats .material-symbols-outlined {
          background: var(--primary-soft);
          border-radius: 8px;
          color: var(--primary);
          padding: 11px;
        }

        .notif-stats div span:last-child {
          color: var(--muted);
          font-size: .68rem;
          font-weight: 800;
          letter-spacing: .08em;
          text-align: right;
          text-transform: uppercase;
        }

        .notif-stats strong {
          display: inline-block;
          font-family: 'EB Garamond', serif;
          font-size: 2.75rem;
          font-weight: 600;
          line-height: 1;
        }

        .notif-stats small {
          color: var(--muted);
          font-size: .85rem;
          margin-left: 7px;
        }

        .notif-board {
          display: grid;
          gap: 28px;
          grid-template-columns: minmax(0, 1.45fr) minmax(330px, .75fr);
          align-items: start;
        }

        .notif-main,
        .notif-side {
          display: flex;
          flex-direction: column;
          gap: 18px;
          min-width: 0;
        }

        .notif-section-head {
          align-items: center;
          display: flex;
          justify-content: space-between;
          gap: 16px;
        }

        .notif-section-head h2,
        .notif-panel h2 {
          font-family: 'EB Garamond', serif;
          font-size: 2rem;
          font-weight: 600;
          line-height: 1;
          margin: 0;
        }

        .notif-section-head > span {
          color: var(--soft);
          font-size: .72rem;
          font-weight: 900;
          letter-spacing: .1em;
          text-transform: uppercase;
        }

        .notif-section-head.compact { margin-bottom: 18px; }

        .notif-filters {
          background: var(--surface-low);
          border-radius: 10px;
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          padding: 6px;
          width: fit-content;
        }

        .notif-filter {
          align-items: center;
          border: 0;
          box-shadow: none;
          color: var(--muted);
          cursor: pointer;
          display: inline-flex;
          font-family: 'Manrope', sans-serif;
          font-size: .78rem;
          font-weight: 800;
          gap: 8px;
          min-height: 36px;
          padding: 0 13px;
        }

        .notif-filter span {
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

        .notif-filter.is-active {
          background: white;
          color: var(--primary);
          box-shadow: 0 1px 5px rgba(58, 48, 42, .08);
        }

        .notif-filter.is-active span {
          background: var(--primary-soft);
        }

        .notif-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .notif-item {
          display: grid;
          grid-template-columns: 54px minmax(0, 1fr);
          gap: 16px;
          overflow: hidden;
          padding: 20px;
          position: relative;
        }

        .notif-item::before {
          bottom: 0;
          content: '';
          left: 0;
          position: absolute;
          top: 0;
          width: 4px;
        }

        .notif-item.academic::before { background: var(--primary); }
        .notif-item.financial::before { background: #8c3c3c; }
        .notif-item.news::before { background: #78706a; }
        .notif-item.is-read { opacity: .78; }

        .notif-icon {
          align-items: center;
          background: var(--primary-soft);
          border-radius: 10px;
          color: var(--primary);
          display: flex;
          height: 54px;
          justify-content: center;
          width: 54px;
        }

        .notif-item.financial .notif-icon { background: #fce0e0; color: #8c3c3c; }
        .notif-item.news .notif-icon { background: var(--surface-low); color: var(--muted); }

        .notif-item-head {
          align-items: flex-start;
          display: flex;
          gap: 14px;
          justify-content: space-between;
        }

        .notif-category {
          color: var(--primary);
          display: block;
          font-size: .66rem;
          font-weight: 900;
          letter-spacing: .12em;
          margin-bottom: 5px;
          text-transform: uppercase;
        }

        .notif-item-head h3 {
          font-family: 'EB Garamond', serif;
          font-size: 1.45rem;
          font-weight: 600;
          line-height: 1.08;
          margin: 0;
        }

        .notif-item-head time {
          color: var(--soft);
          flex-shrink: 0;
          font-size: .75rem;
          font-weight: 800;
        }

        .notif-copy p,
        .notif-panel p,
        .notif-upcoming p {
          color: var(--muted);
          font-size: .86rem;
          line-height: 1.7;
          margin: 10px 0 0;
        }

        .notif-meta {
          align-items: center;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 14px;
        }

        .notif-status {
          border-radius: 999px;
          display: inline-flex;
          font-size: .64rem;
          font-weight: 900;
          letter-spacing: .1em;
          padding: 5px 9px;
          text-transform: uppercase;
        }

        .notif-status.unread { background: var(--primary-soft); color: var(--primary); }
        .notif-status.read { background: var(--surface-low); color: var(--soft); }

        .notif-meta a,
        .notif-important a {
          color: var(--primary);
          font-size: .78rem;
          font-weight: 900;
          text-decoration: none;
        }

        .notif-panel {
          padding: 24px;
        }

        .notif-important {
          background: var(--surface-low);
        }

        .notif-important a {
          align-items: center;
          background: var(--primary);
          border-radius: 8px;
          color: white;
          display: inline-flex;
          margin-top: 18px;
          min-height: 42px;
          padding: 0 16px;
        }

        .notif-upcoming-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .notif-upcoming {
          align-items: center;
          background: var(--surface-low);
          border: 1px solid transparent;
          border-radius: 12px;
          display: flex;
          gap: 14px;
          padding: 14px;
        }

        .notif-date {
          align-items: center;
          background: var(--primary);
          border-radius: 9px;
          color: white;
          display: flex;
          flex-direction: column;
          height: 58px;
          justify-content: center;
          width: 58px;
          flex-shrink: 0;
        }

        .notif-date span {
          font-size: .62rem;
          font-weight: 900;
          letter-spacing: .08em;
          text-transform: uppercase;
        }

        .notif-date strong {
          font-family: 'EB Garamond', serif;
          font-size: 1.45rem;
          line-height: 1;
        }

        .notif-upcoming h3 {
          font-size: .88rem;
          margin: 0;
        }

        .notif-empty {
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

        .notif-empty.small { min-height: 96px; }
        .notif-empty p { margin: 0; }

        .a-root--dark .student-notifications {
          --surface: #131313;
          --surface-low: #1c1b1b;
          --surface-mid: #353534;
          --surface-high: #201f1f;
          --text: #e5e2e1;
          --muted: #dbc1b5;
          --soft: #a38c80;
          --line: #554339;
          --primary: #ffb68e;
          --primary-soft: rgba(255, 182, 142, .14);
          background-color: var(--surface);
          background-image: radial-gradient(rgba(85, 67, 57, .72) .6px, transparent .6px);
        }

        .a-root--dark .notif-stats article,
        .a-root--dark .notif-panel,
        .a-root--dark .notif-item,
        .a-root--dark .notif-filter.is-active {
          background: var(--surface-high);
          border-color: rgba(255, 255, 255, .08);
          box-shadow: 0 12px 32px rgba(0, 0, 0, .22);
        }

        .a-root--dark .notif-filters,
        .a-root--dark .notif-upcoming,
        .a-root--dark .notif-status.read,
        .a-root--dark .notif-item.news .notif-icon {
          background: var(--surface-low);
        }

        .a-root--dark .notif-important { background: var(--surface-low); }
        .a-root--dark .notif-item.financial .notif-icon { background: rgba(255, 180, 171, .14); color: #ffb4ab; }
        .a-root--dark .notif-upcoming { border-color: rgba(255, 255, 255, .08); }

        @media (max-width: 1180px) {
          .notif-board { grid-template-columns: 1fr; }
        }

        @media (max-width: 900px) {
          .student-notifications { margin: -18px -16px -32px; padding: 30px 16px 44px; }
          .notif-hero { align-items: flex-start; flex-direction: column; }
          .notif-stats { grid-template-columns: 1fr; }
        }

        @media (max-width: 560px) {
          .notif-hero h1 { font-size: 3rem; }
          .notif-primary { justify-content: center; width: 100%; }
          .notif-section-head,
          .notif-item-head { align-items: flex-start; flex-direction: column; }
          .notif-item { grid-template-columns: 1fr; }
          .notif-filters { width: 100%; }
          .notif-filter { flex: 1 1 auto; justify-content: center; }
        }
      `}</style>
    </AuthenticatedLayout>
  );
}
