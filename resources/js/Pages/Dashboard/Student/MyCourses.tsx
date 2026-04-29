import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type CourseCard = {
  category: string;
  title: string;
  description: string;
  price: string;
  duration: string;
  group: string | null;
  progress: number;
  payment: string;
  nextSession: string | null;
  nextTime: string | null;
  room: string | null;
  status: string;
  accent: string;
};

type WeeklyMetric = {
  week: string;
  hours: number;
  projects: number;
};

type ScheduleItem = {
  day: string;
  month: string;
  course: string;
  time: string;
  room: string | null;
  active: boolean;
};

type Stat = {
  label: string;
  value: string;
  sub: string;
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
  featuredCourse: CourseCard | null;
  sideCourses: CourseCard[];
  weeklyMetrics: WeeklyMetric[];
  schedule: ScheduleItem[];
};

function formatMetric(value: number | string | undefined) {
  return Number(value ?? 0).toLocaleString('fr-FR');
}

export default function MyCourses() {
  const { props } = usePage<PageProps>();
  const { stats, featuredCourse, sideCourses, weeklyMetrics, schedule } = props;
  const user = props.auth.user;
  const firstName = user.name.split(' ')[0];

  return (
    <AuthenticatedLayout header={<h2>Mes formations</h2>}>
      <Head title="Mes formations" />

      <div className="courses-root">
        <section className="courses-hero">
          <div className="courses-hero-copy">
            <p className="courses-kicker">Parcours etudiant</p>
            <h1 className="courses-hero-title">
              Vos formations en cours, <span>{firstName}</span>
            </h1>
            <p className="courses-hero-text">
              Suivez votre progression, vos prochaines seances et votre rythme d apprentissage sur
              l ensemble de vos modules actifs.
            </p>
          </div>

          <div className="courses-hero-badges">
            <div className="courses-chip">
              <span className="courses-chip-dot" />
              {stats[0]?.value ?? '0'} parcours actifs
            </div>
            <div className="courses-chip courses-chip--soft">Planning mis a jour en temps reel</div>
          </div>
        </section>

        <section className="courses-stats-grid">
          {stats.map((stat) => (
            <div className="courses-stat-card" key={stat.label}>
              <p className="courses-kicker">{stat.label}</p>
              <p className="courses-stat-value">{stat.value}</p>
              <p className="courses-muted">{stat.sub}</p>
            </div>
          ))}
        </section>

        {featuredCourse && (
          <section className="courses-main-grid">
            <article className="courses-featured-card">
              <div className="courses-featured-top">
                <div>
                  <span className="courses-badge">{featuredCourse.category}</span>
                  <h2 className="courses-featured-title">{featuredCourse.title}</h2>
                </div>
                <div className="courses-price-block">
                  <strong>{featuredCourse.price}</strong>
                  <span>{featuredCourse.payment}</span>
                </div>
              </div>

              <p className="courses-featured-text">{featuredCourse.description}</p>

              <div className="courses-meta-grid">
                <div className="courses-meta-card">
                  <span className="courses-meta-label">Duree</span>
                  <strong>{featuredCourse.duration}</strong>
                </div>
                <div className="courses-meta-card">
                  <span className="courses-meta-label">Groupe</span>
                  <strong>{featuredCourse.group ?? 'Non defini'}</strong>
                </div>
                <div className="courses-meta-card">
                  <span className="courses-meta-label">Prochaine seance</span>
                  <strong>{featuredCourse.nextSession ?? 'A programmer'}</strong>
                </div>
                <div className="courses-meta-card">
                  <span className="courses-meta-label">Horaire</span>
                  <strong>{featuredCourse.nextTime ?? 'Non defini'}</strong>
                </div>
              </div>

              <div className="courses-session-card">
                <div>
                  <p className="courses-kicker">Salle et suivi</p>
                  <h3 className="courses-session-title">{featuredCourse.room ?? 'A confirmer'}</h3>
                </div>
                <div className="courses-progress-side">
                  <span className="courses-progress-percent">{featuredCourse.progress}%</span>
                  <span className="courses-muted">module valide</span>
                </div>
              </div>

              <div className="courses-progress-block">
                <div className="courses-progress-head">
                  <span>Progression generale</span>
                  <strong>{featuredCourse.progress}%</strong>
                </div>
                <div className="courses-progress-track">
                  <div className="courses-progress-fill" style={{ width: `${featuredCourse.progress}%` }} />
                </div>
              </div>
            </article>

            <div className="courses-side-stack">
              {sideCourses.map((course) => (
                <article className="courses-side-card" key={course.title}>
                  <div className="courses-side-head">
                    <span className="courses-side-category" style={{ color: course.accent }}>
                      {course.category}
                    </span>
                    <span className="courses-side-status">{course.status}</span>
                  </div>

                  <h3 className="courses-side-title">{course.title}</h3>
                  <p className="courses-muted">{course.description}</p>

                  <div className="courses-side-details">
                    <span>{course.price}</span>
                    <span>{course.duration}</span>
                    <span>{course.room ?? 'Salle a definir'}</span>
                  </div>

                  <div className="courses-progress-head">
                    <span>Progression</span>
                    <strong>{course.progress}%</strong>
                  </div>
                  <div className="courses-progress-track courses-progress-track--sm">
                    <div
                      className="courses-progress-fill"
                      style={{ width: `${course.progress}%`, background: course.accent }}
                    />
                  </div>

                  <div className="courses-next-row">
                    <div>
                      <span className="courses-meta-label">Seance</span>
                      <strong>{course.nextSession ?? 'A programmer'}</strong>
                    </div>
                    <div>
                      <span className="courses-meta-label">Horaire</span>
                      <strong>{course.nextTime ?? 'Non defini'}</strong>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="courses-bottom-grid">
          <div className="courses-panel">
            <div className="courses-panel-head">
              <div>
                <h3 className="courses-panel-title">Rythme hebdomadaire</h3>
                <p className="courses-muted">
                  Visualisation de votre charge de travail et des projets finalises au fil des semaines.
                </p>
              </div>
            </div>

            <div className="courses-chart-block">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyMetrics}>
                  <defs>
                    <linearGradient id="hoursGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff6b2b" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#ff6b2b" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="projectsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.22} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="rgba(15,23,42,0.08)" />
                  <XAxis dataKey="week" tickLine={false} axisLine={false} tick={{ fill: '#8b8b8b', fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: '#8b8b8b', fontSize: 12 }} />
                  <Tooltip formatter={(value) => formatMetric(value as number | string | undefined)} />
                  <Area
                    type="monotone"
                    dataKey="hours"
                    stroke="#ff6b2b"
                    strokeWidth={3}
                    fill="url(#hoursGradient)"
                    name="Heures"
                  />
                  <Area
                    type="monotone"
                    dataKey="projects"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fill="url(#projectsGradient)"
                    name="Projets"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="courses-aside-stack">
            <div className="courses-panel courses-panel--dark">
              <div className="courses-panel-head">
                <div>
                  <h3 className="courses-panel-title courses-panel-title--light">Resume de la semaine</h3>
                  <p className="courses-muted courses-muted--light">
                    Un apercu rapide pour garder votre organisation sous controle.
                  </p>
                </div>
              </div>

              <div className="courses-summary-list">
                {stats.slice(0, 3).map((stat) => (
                  <div className="courses-summary-row" key={stat.label}>
                    <span>{stat.label}</span>
                    <strong>{stat.value}</strong>
                  </div>
                ))}
              </div>

              <button type="button" className="courses-dark-btn">
                Telecharger l emploi du temps
              </button>
            </div>

            <div className="courses-panel">
              <div className="courses-panel-head">
                <div>
                  <h3 className="courses-panel-title">Agenda immediat</h3>
                  <p className="courses-muted">Vos prochaines seances a ne pas manquer.</p>
                </div>
              </div>

              <div className="courses-agenda-list">
                {schedule.map((item) => (
                  <div className={`courses-agenda-item ${item.active ? 'courses-agenda-item--active' : ''}`} key={`${item.day}-${item.course}`}>
                    <div className="courses-date-box">
                      <span>{item.month}</span>
                      <strong>{item.day}</strong>
                    </div>
                    <div className="courses-agenda-copy">
                      <p>{item.course}</p>
                      <span>
                        {item.time} · {item.room ?? 'Salle a definir'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@600;700&family=Manrope:wght@400;500;600;700;800&display=swap');

        .courses-root {
          display: flex;
          flex-direction: column;
          gap: 24px;
          font-family: 'Manrope', sans-serif;
          color: #18181b;
        }
        .courses-hero,
        .courses-stat-card,
        .courses-featured-card,
        .courses-side-card,
        .courses-panel {
          background: #fff;
          border: 1px solid rgba(15, 23, 42, 0.07);
          box-shadow: 0 8px 30px rgba(15, 23, 42, 0.04);
        }
        .courses-hero {
          position: relative;
          display: flex;
          justify-content: space-between;
          gap: 22px;
          flex-wrap: wrap;
          padding: 28px;
          border-radius: 22px;
          overflow: hidden;
          background:
            radial-gradient(circle at top right, rgba(255, 154, 86, 0.16), transparent 28%),
            linear-gradient(180deg, #fffaf6 0%, #ffffff 100%);
        }
        .courses-hero::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, #ff6b2b, #ff9a56, #ffbf7a);
        }
        .courses-hero-copy { max-width: 760px; position: relative; z-index: 1; }
        .courses-kicker, .courses-meta-label {
          margin: 0; font-size: 0.73rem; font-weight: 800; letter-spacing: 0.13em;
          text-transform: uppercase; color: #ff6b2b;
        }
        .courses-hero-title {
          margin: 6px 0 0; font-family: 'EB Garamond', serif;
          font-size: clamp(2rem, 3vw, 3rem); line-height: 1; letter-spacing: -0.03em;
        }
        .courses-hero-title span { color: #ff6b2b; }
        .courses-hero-text, .courses-muted {
          margin: 0; color: #717171; line-height: 1.7; font-size: 0.88rem;
        }
        .courses-hero-text { max-width: 620px; margin-top: 14px; }
        .courses-hero-badges {
          display: flex; flex-direction: column; gap: 12px; position: relative; z-index: 1;
        }
        .courses-chip {
          display: inline-flex; align-items: center; gap: 10px; padding: 12px 14px;
          border-radius: 999px; background: rgba(255, 255, 255, 0.84);
          border: 1px solid rgba(255, 107, 43, 0.12); color: #6b4b3e;
          font-size: 0.82rem; font-weight: 700; width: fit-content; max-width: 100%;
        }
        .courses-chip--soft { border-radius: 16px; color: #757575; border-color: rgba(15, 23, 42, 0.08); }
        .courses-chip-dot {
          width: 10px; height: 10px; border-radius: 50%; background: #10b981;
          box-shadow: 0 0 0 6px rgba(16, 185, 129, 0.14);
        }
        .courses-stats-grid, .courses-main-grid, .courses-bottom-grid { display: grid; gap: 18px; }
        .courses-stats-grid { grid-template-columns: repeat(3, 1fr); }
        .courses-main-grid { grid-template-columns: 1.6fr 1fr; align-items: start; }
        .courses-bottom-grid { grid-template-columns: 1.4fr 1fr; align-items: start; }
        .courses-stat-card, .courses-featured-card, .courses-side-card, .courses-panel {
          border-radius: 20px; padding: 24px;
        }
        .courses-stat-value, .courses-price-block strong, .courses-progress-percent {
          color: #18181b; font-weight: 800;
        }
        .courses-stat-value { font-size: 1.65rem; margin: 10px 0 4px; }
        .courses-featured-card {
          background: radial-gradient(circle at bottom right, rgba(255, 107, 43, 0.12), transparent 30%), #fff;
        }
        .courses-featured-top, .courses-panel-head, .courses-side-head, .courses-progress-head, .courses-next-row {
          display: flex; justify-content: space-between; align-items: flex-start; gap: 14px; flex-wrap: wrap;
        }
        .courses-badge, .courses-side-status {
          display: inline-flex; align-items: center; padding: 7px 12px; border-radius: 999px;
          background: rgba(255, 107, 43, 0.1); color: #ff6b2b; font-size: 0.68rem;
          font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase;
        }
        .courses-side-status { background: #f6f6f6; color: #707070; }
        .courses-featured-title, .courses-side-title, .courses-panel-title, .courses-session-title {
          margin: 0; color: #18181b;
        }
        .courses-featured-title {
          margin-top: 12px; font-family: 'EB Garamond', serif;
          font-size: clamp(2rem, 3vw, 2.7rem); line-height: 1.05;
        }
        .courses-side-title, .courses-panel-title { font-size: 1rem; font-weight: 800; }
        .courses-session-title { margin-top: 4px; font-size: 1.35rem; font-weight: 800; }
        .courses-featured-text { margin: 16px 0 0; max-width: 760px; color: #666; line-height: 1.7; font-size: 0.9rem; }
        .courses-price-block { text-align: right; }
        .courses-price-block strong { display: block; font-size: 1.2rem; color: #ff6b2b; }
        .courses-price-block span {
          font-size: 0.72rem; color: #888; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;
        }
        .courses-meta-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-top: 22px; }
        .courses-meta-card, .courses-session-card, .courses-agenda-item {
          border-radius: 16px; border: 1px solid rgba(15, 23, 42, 0.06); background: #fafafa;
        }
        .courses-meta-card { padding: 14px; }
        .courses-meta-card strong, .courses-next-row strong, .courses-agenda-copy p {
          display: block; margin-top: 6px; color: #18181b; font-size: 0.9rem;
        }
        .courses-session-card {
          margin-top: 18px; padding: 18px; display: flex; justify-content: space-between; gap: 16px; align-items: center;
          background: linear-gradient(135deg, #fff7f1, #ffffff);
        }
        .courses-progress-side { text-align: right; }
        .courses-progress-percent { display: block; font-size: 1.5rem; color: #ff6b2b; }
        .courses-progress-block { margin-top: 18px; }
        .courses-progress-head { margin-bottom: 8px; color: #666; font-size: 0.82rem; font-weight: 700; }
        .courses-progress-head strong { color: #18181b; }
        .courses-progress-track {
          width: 100%; height: 11px; border-radius: 999px; overflow: hidden; background: #ece8e4;
        }
        .courses-progress-track--sm { height: 9px; }
        .courses-progress-fill {
          height: 100%; border-radius: inherit; background: linear-gradient(90deg, #ff9a56, #ff6b2b);
        }
        .courses-side-stack, .courses-aside-stack, .courses-summary-list, .courses-agenda-list {
          display: flex; flex-direction: column; gap: 16px;
        }
        .courses-side-card { display: flex; flex-direction: column; gap: 14px; }
        .courses-side-category {
          font-size: 0.74rem; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase;
        }
        .courses-side-details { display: flex; flex-wrap: wrap; gap: 10px; color: #7a7a7a; font-size: 0.8rem; font-weight: 700; }
        .courses-next-row > div { flex: 1; min-width: 120px; }
        .courses-chart-block {
          width: 100%; height: 290px; margin-top: 18px; padding: 10px 6px 0; border-radius: 18px;
          background: linear-gradient(180deg, #fffaf6 0%, #ffffff 100%);
          border: 1px solid rgba(15, 23, 42, 0.06);
        }
        .courses-panel--dark { background: #111111; border-color: rgba(255, 255, 255, 0.06); box-shadow: none; }
        .courses-panel-title--light, .courses-muted--light, .courses-summary-row, .courses-dark-btn { color: #fff; }
        .courses-muted--light { opacity: 0.66; }
        .courses-summary-row {
          display: flex; justify-content: space-between; gap: 12px; padding-bottom: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08); font-size: 0.88rem;
        }
        .courses-summary-row span { opacity: 0.7; }
        .courses-dark-btn {
          margin-top: 6px; width: 100%; border: 1px solid rgba(255, 255, 255, 0.14);
          background: rgba(255, 255, 255, 0.04); border-radius: 14px; padding: 13px 16px;
          font-family: 'Manrope', sans-serif; font-size: 0.86rem; font-weight: 800; cursor: pointer;
          transition: background 0.18s ease;
        }
        .courses-dark-btn:hover { background: rgba(255, 255, 255, 0.08); }
        .courses-agenda-item { display: flex; align-items: center; gap: 14px; padding: 14px; }
        .courses-agenda-item--active { background: #fff7f1; border-color: rgba(255, 107, 43, 0.16); }
        .courses-date-box {
          width: 56px; height: 56px; border-radius: 16px; background: #ff6b2b; color: #fff;
          display: flex; flex-direction: column; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .courses-date-box span { font-size: 0.62rem; font-weight: 800; letter-spacing: 0.08em; }
        .courses-date-box strong { font-size: 1.15rem; line-height: 1; }
        .courses-agenda-copy p { margin: 0; }
        .courses-agenda-copy span { display: block; margin-top: 4px; color: #7a7a7a; font-size: 0.78rem; }
        @media (max-width: 1150px) {
          .courses-main-grid, .courses-bottom-grid, .courses-stats-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 780px) {
          .courses-meta-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .courses-hero, .courses-stat-card, .courses-featured-card, .courses-side-card, .courses-panel {
            padding: 18px; border-radius: 18px;
          }
          .courses-hero-title, .courses-featured-title { font-size: 2rem; }
          .courses-meta-grid { grid-template-columns: 1fr; }
          .courses-session-card { flex-direction: column; align-items: flex-start; }
          .courses-progress-side { text-align: left; }
        }
      `}</style>
    </AuthenticatedLayout>
  );
}
