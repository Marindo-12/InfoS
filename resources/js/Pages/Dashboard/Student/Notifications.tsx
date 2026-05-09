import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

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

function categoryTone(category: NotificationItem['category']) {
  if (category === 'academic') {
    return {
      card: 'notif-item notif-item--academic',
      icon: 'notif-icon notif-icon--academic',
    };
  }

  if (category === 'financial') {
    return {
      card: 'notif-item notif-item--financial',
      icon: 'notif-icon notif-icon--financial',
    };
  }

  return {
    card: 'notif-item notif-item--news',
    icon: 'notif-icon notif-icon--news',
  };
}

export default function Notifications() {
  const { props } = usePage<PageProps>();
  const { filters, activeFilter, unreadCount, notifications, importantNotice, upcoming } = props;

  return (
    <AuthenticatedLayout header={<h2>Notifications</h2>}>
      <Head title="Notifications" />

      <div className="notif-root">
        <section className="notif-hero">
          <div>
            <p className="notif-kicker">Centre etudiant</p>
            <h1 className="notif-title">Activite recente</h1>
            <p className="notif-subtitle">
              {unreadCount > 0
                ? `Vous avez ${unreadCount} notification(s) non lue(s) de Info Saloua.`
                : 'Toutes vos notifications ont ete consultees.'}
            </p>
          </div>

          <button
            type="button"
            className="notif-mark-btn"
            onClick={() => router.post(route('student.notifications.read-all'))}
          >
            Tout marquer comme lu
          </button>
        </section>

        <div className="notif-grid">
          <section className="notif-main">
            <div className="notif-filters">
              {filters.map((filter) => (
                <button
                  type="button"
                  key={filter.key}
                  className={`notif-filter ${activeFilter === filter.key ? 'notif-filter--active' : ''}`}
                  onClick={() => router.get(route('student.notifications'), { filter: filter.key }, { preserveState: true, preserveScroll: true })}
                >
                  {filter.label}
                  <span>{filter.count}</span>
                </button>
              ))}
            </div>

            <div className="notif-list">
              {notifications.map((notification) => {
                const tone = categoryTone(notification.category);

                return (
                  <article key={notification.id} className={tone.card}>
                    <div className={tone.icon}>
                      <span className="material-symbols-outlined">{notification.icon}</span>
                    </div>

                    <div className="notif-item-copy">
                      <div className="notif-item-head">
                        <h3>{notification.title}</h3>
                        <span>{notification.timeLabel ?? 'Recemment'}</span>
                      </div>
                      <p>{notification.message}</p>

                      <div className="notif-item-meta">
                        <span className={`notif-badge ${notification.isRead ? 'notif-badge--read' : 'notif-badge--unread'}`}>
                          {notification.isRead ? 'Lu' : 'Non lu'}
                        </span>
                        <span className="notif-category">{categoryLabel(notification.category)}</span>
                        {notification.actionLabel && notification.actionUrl && (
                          <Link href={notification.actionUrl} className="notif-action-link">
                            {notification.actionLabel}
                          </Link>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}

              {notifications.length === 0 && (
                <div className="notif-empty">
                  <span className="material-symbols-outlined">notifications_off</span>
                  <p>Aucune notification pour ce filtre.</p>
                </div>
              )}
            </div>
          </section>

          <aside className="notif-side">
            <section className="notif-panel notif-panel--accent">
              <h3>{importantNotice.title}</h3>
              <p>{importantNotice.message}</p>
              <Link href={importantNotice.actionUrl} className="notif-primary-link">
                {importantNotice.actionLabel}
              </Link>
            </section>

            <section className="notif-panel">
              <div className="notif-panel-head">
                <h3>Prochaines seances</h3>
              </div>
              <div className="notif-upcoming-list">
                {upcoming.map((item) => (
                  <div key={`${item.day}-${item.title}`} className="notif-upcoming-item">
                    <div className="notif-date-box">
                      <span>{item.month}</span>
                      <strong>{item.day}</strong>
                    </div>
                    <div>
                      <p>{item.title}</p>
                      <span>{item.meta}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@600;700&family=Manrope:wght@400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');

        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 350, 'GRAD' 0, 'opsz' 24;
          font-family: 'Material Symbols Outlined';
          line-height: 1;
        }

        .notif-root {
          display: flex;
          flex-direction: column;
          gap: 24px;
          font-family: 'Manrope', sans-serif;
          color: #18181b;
        }
        .notif-hero,
        .notif-panel,
        .notif-item {
          background: #fff;
          border: 1px solid rgba(15, 23, 42, 0.07);
          box-shadow: 0 8px 30px rgba(15, 23, 42, 0.04);
        }
        .notif-hero {
          position: relative;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 20px;
          flex-wrap: wrap;
          padding: 28px;
          border-radius: 22px;
          overflow: hidden;
          background:
            radial-gradient(circle at top right, rgba(255, 154, 86, 0.16), transparent 28%),
            linear-gradient(180deg, #fffaf6 0%, #ffffff 100%);
        }
        .notif-hero::before {
          content: '';
          position: absolute;
          inset: 0 auto auto 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, #ff6b2b, #ff9a56, #ffbf7a);
        }
        .notif-kicker {
          margin: 0 0 8px;
          font-size: 0.74rem;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #ff6b2b;
        }
        .notif-title {
          margin: 0;
          font-family: 'EB Garamond', serif;
          font-size: clamp(2rem, 3vw, 3rem);
          line-height: 1;
        }
        .notif-subtitle {
          margin: 12px 0 0;
          color: #717171;
          font-size: 0.92rem;
          line-height: 1.7;
        }
        .notif-mark-btn,
        .notif-primary-link,
        .notif-action-link {
          transition: all 0.18s ease;
        }
        .notif-mark-btn {
          border: none;
          border-radius: 12px;
          padding: 12px 16px;
          background: linear-gradient(135deg, #ff7a35, #ff5b14);
          color: #fff;
          font-family: 'Manrope', sans-serif;
          font-size: 0.86rem;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 12px 24px rgba(255, 107, 43, 0.2);
        }
        .notif-mark-btn:hover {
          transform: translateY(-1px);
        }

        .notif-grid {
          display: grid;
          grid-template-columns: 1.55fr 1fr;
          gap: 18px;
          align-items: start;
        }
        .notif-main,
        .notif-side {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .notif-filters {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .notif-filter {
          border: 1px solid rgba(15, 23, 42, 0.08);
          background: #fff;
          color: #777;
          border-radius: 999px;
          padding: 10px 14px;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .notif-filter span {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 20px;
          height: 20px;
          border-radius: 999px;
          background: #f5f5f5;
          font-size: 0.72rem;
        }
        .notif-filter--active {
          border-color: rgba(255, 107, 43, 0.18);
          background: #fff7f1;
          color: #ff6b2b;
        }
        .notif-filter--active span {
          background: rgba(255, 107, 43, 0.12);
        }

        .notif-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .notif-item {
          display: flex;
          gap: 16px;
          padding: 22px;
          border-radius: 20px;
        }
        .notif-item--academic { border-left: 4px solid #ff6b2b; }
        .notif-item--financial { border-left: 4px solid #ef4444; }
        .notif-item--news { border-left: 4px solid #94a3b8; }
        .notif-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .notif-icon--academic { background: #fff3ec; color: #ff6b2b; }
        .notif-icon--financial { background: #fff1f2; color: #ef4444; }
        .notif-icon--news { background: #f3f4f6; color: #64748b; }
        .notif-item-copy { flex: 1; min-width: 0; }
        .notif-item-head {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: flex-start;
          flex-wrap: wrap;
        }
        .notif-item-head h3 {
          margin: 0;
          font-family: 'EB Garamond', serif;
          font-size: 1.35rem;
          line-height: 1.1;
        }
        .notif-item-head span {
          color: #a3a3a3;
          font-size: 0.76rem;
          font-weight: 700;
        }
        .notif-item-copy p {
          margin: 10px 0 0;
          color: #666;
          line-height: 1.7;
          font-size: 0.88rem;
        }
        .notif-item-meta {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 14px;
        }
        .notif-badge,
        .notif-category {
          display: inline-flex;
          align-items: center;
          border-radius: 999px;
          padding: 6px 10px;
          font-size: 0.68rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .notif-badge--unread { background: rgba(255, 107, 43, 0.12); color: #ff6b2b; }
        .notif-badge--read { background: #f4f4f5; color: #777; }
        .notif-category { background: #faf5f0; color: #8b6b56; }
        .notif-action-link {
          color: #ff6b2b;
          font-size: 0.78rem;
          font-weight: 800;
          text-decoration: none;
        }
        .notif-action-link:hover { color: #e25817; }

        .notif-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 40px 20px;
          border-radius: 20px;
          border: 1px dashed rgba(15, 23, 42, 0.12);
          background: #fafafa;
          color: #8b8b8b;
        }

        .notif-panel {
          border-radius: 20px;
          padding: 22px;
        }
        .notif-panel--accent {
          background: linear-gradient(180deg, #fff7f1 0%, #ffffff 100%);
          border-color: rgba(255, 107, 43, 0.12);
        }
        .notif-panel-head h3,
        .notif-panel--accent h3 {
          margin: 0;
          font-family: 'EB Garamond', serif;
          font-size: 1.4rem;
        }
        .notif-panel--accent p {
          margin: 12px 0 18px;
          color: #666;
          line-height: 1.7;
          font-size: 0.88rem;
        }
        .notif-primary-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 12px 16px;
          border-radius: 12px;
          background: linear-gradient(135deg, #ff7a35, #ff5b14);
          color: #fff;
          font-size: 0.84rem;
          font-weight: 800;
          text-decoration: none;
          box-shadow: 0 12px 24px rgba(255, 107, 43, 0.18);
        }
        .notif-primary-link:hover { transform: translateY(-1px); }

        .notif-upcoming-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-top: 16px;
        }
        .notif-upcoming-item {
          display: flex;
          gap: 14px;
          align-items: center;
          padding: 14px;
          border-radius: 16px;
          background: #fafafa;
          border: 1px solid rgba(15, 23, 42, 0.06);
        }
        .notif-date-box {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          background: #ff6b2b;
          color: #fff;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .notif-date-box span {
          font-size: 0.62rem;
          font-weight: 800;
          letter-spacing: 0.08em;
        }
        .notif-date-box strong {
          font-size: 1.15rem;
          line-height: 1;
        }
        .notif-upcoming-item p {
          margin: 0;
          font-size: 0.88rem;
          font-weight: 800;
          color: #18181b;
        }
        .notif-upcoming-item span {
          display: block;
          margin-top: 4px;
          color: #7a7a7a;
          font-size: 0.78rem;
        }

        .a-root--dark .notif-root { color: #e5e2e1; }
        .a-root--dark .notif-hero,
        .a-root--dark .notif-panel,
        .a-root--dark .notif-item,
        .a-root--dark .notif-filter {
          background: #201f1f;
          border-color: rgba(255, 255, 255, .08);
          box-shadow: 0 12px 32px rgba(0, 0, 0, .22);
        }
        .a-root--dark .notif-hero,
        .a-root--dark .notif-panel--accent { background: linear-gradient(180deg, #201f1f 0%, #1c1b1b 100%); }
        .a-root--dark .notif-subtitle,
        .a-root--dark .notif-item-copy p,
        .a-root--dark .notif-panel--accent p,
        .a-root--dark .notif-upcoming-item span { color: #dbc1b5; }
        .a-root--dark .notif-title,
        .a-root--dark .notif-item-head h3,
        .a-root--dark .notif-panel-head h3,
        .a-root--dark .notif-panel--accent h3,
        .a-root--dark .notif-upcoming-item p { color: #e5e2e1; }
        .a-root--dark .notif-filter { color: #dbc1b5; }
        .a-root--dark .notif-filter span,
        .a-root--dark .notif-badge--read,
        .a-root--dark .notif-category,
        .a-root--dark .notif-empty,
        .a-root--dark .notif-upcoming-item { background: #1c1b1b; border-color: rgba(255, 255, 255, .08); color: #a38c80; }
        .a-root--dark .notif-filter--active,
        .a-root--dark .notif-badge--unread,
        .a-root--dark .notif-icon--academic { background: rgba(255, 182, 142, .14); color: #ffb68e; }
        .a-root--dark .notif-icon--financial { background: rgba(255, 180, 171, .14); color: #ffb4ab; }
        .a-root--dark .notif-icon--news { background: rgba(198, 198, 199, .14); color: #c6c6c7; }
        .a-root--dark .notif-kicker,
        .a-root--dark .notif-action-link { color: #ffb68e; }

        @media (max-width: 1100px) {
          .notif-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 640px) {
          .notif-hero,
          .notif-panel,
          .notif-item {
            padding: 18px;
            border-radius: 18px;
          }
          .notif-title {
            font-size: 2rem;
          }
        }
      `}</style>
    </AuthenticatedLayout>
  );
}
