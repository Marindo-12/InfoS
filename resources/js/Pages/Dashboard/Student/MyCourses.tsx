import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
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
  sessions: number;
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

function statNumber(value: string) {
  const match = value.match(/^([\d\s,.]+)/);

  return {
    number: match?.[1]?.trim() ?? value,
    suffix: value.replace(match?.[1] ?? '', ''),
  };
}

export default function MyCourses() {
  const { props } = usePage<PageProps>();
  const { stats, featuredCourse, sideCourses, weeklyMetrics, schedule } = props;
  const firstName = props.auth.user.name.split(' ')[0];
  const totalHours = weeklyMetrics.reduce((sum, item) => sum + Number(item.hours ?? 0), 0);
  const totalSessions = weeklyMetrics.reduce((sum, item) => sum + Number(item.sessions ?? 0), 0);

  return (
    <AuthenticatedLayout header={<h2>Mes formations</h2>}>
      <Head title="Mes formations" />

      <main className="student-courses-page">
        <header className="student-courses-hero">
          <div>
            <span className="sc-kicker">Parcours etudiant</span>
            <h1>
              Vos formations en cours, <em>{firstName}</em>
            </h1>
            <p>
              Suivez votre progression, vos prochaines seances et votre rythme d'apprentissage sur
              l'ensemble de vos modules actifs.
            </p>
          </div>

          <div className="sc-live-chip">
            <span />
            {stats[0]?.value ?? '0'} parcours actif
          </div>
        </header>

        <section className="sc-metrics-grid">
          {stats.map((stat) => {
            const value = statNumber(stat.value);

            return (
              <article className="sc-metric-card" key={stat.label}>
                <span className="sc-kicker">{stat.label}</span>
                <strong>
                  {value.number}
                  {value.suffix && <small>{value.suffix}</small>}
                </strong>
                <p>{stat.sub}</p>
              </article>
            );
          })}
        </section>

        {featuredCourse ? (
          <section className="sc-main-grid">
            <div className="sc-left-stack">
              <article className="sc-feature-card">
                <div className="sc-feature-content">
                  <div className="sc-feature-head">
                    <div>
                      <span className="sc-category-pill">{featuredCourse.category}</span>
                      <h2>{featuredCourse.title}</h2>
                      <p>{featuredCourse.description}</p>
                    </div>

                    <div className="sc-price-block">
                      <strong>{featuredCourse.price}</strong>
                      <span>{featuredCourse.payment}</span>
                    </div>
                  </div>

                  <div className="sc-meta-grid">
                    <div>
                      <span>Duree</span>
                      <strong>{featuredCourse.duration}</strong>
                    </div>
                    <div>
                      <span>Groupe</span>
                      <strong>{featuredCourse.group ?? 'Non defini'}</strong>
                    </div>
                    <div>
                      <span>Prochaine seance</span>
                      <strong>{featuredCourse.nextSession ?? 'A programmer'}</strong>
                    </div>
                    <div>
                      <span>Horaire</span>
                      <strong>{featuredCourse.nextTime ?? 'Non defini'}</strong>
                    </div>
                  </div>

                  <div className="sc-progress-block">
                    <div>
                      <span>Progression generale</span>
                      <strong>{featuredCourse.progress}%</strong>
                    </div>
                    <div className="sc-progress-track">
                      <span style={{ width: `${featuredCourse.progress}%` }} />
                    </div>
                  </div>
                </div>
              </article>

              {sideCourses.length > 0 && (
                <section className="sc-secondary-grid">
                  {sideCourses.map((course) => (
                    <article className="sc-side-course" key={course.title}>
                      <div className="sc-side-course-top">
                        <span style={{ color: course.accent }}>{course.category}</span>
                        <strong>{course.status}</strong>
                      </div>
                      <h3>{course.title}</h3>
                      <p>{course.description}</p>
                      <div className="sc-side-meta">
                        <span>{course.duration}</span>
                        <span>{course.price}</span>
                        <span>{course.room ?? 'Salle a definir'}</span>
                      </div>
                      <div className="sc-side-progress">
                        <span>Progression</span>
                        <strong>{course.progress}%</strong>
                      </div>
                      <div className="sc-progress-track sc-progress-track-small">
                        <span style={{ width: `${course.progress}%`, background: course.accent }} />
                      </div>
                    </article>
                  ))}
                </section>
              )}

              <article className="sc-chart-card">
                <div className="sc-section-head">
                  <h3>Rythme hebdomadaire</h3>
                  <p>
                    Heures et seances calculees depuis les sessions planifiees ou terminees de vos
                    formations.
                  </p>
                </div>

                <div className="sc-chart">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weeklyMetrics}>
                      <defs>
                        <linearGradient id="hoursGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#c2652a" stopOpacity={0.28} />
                          <stop offset="95%" stopColor="#c2652a" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="sessionsGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8c3c3c" stopOpacity={0.18} />
                          <stop offset="95%" stopColor="#8c3c3c" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} stroke="#d8d0c8" strokeDasharray="4 4" />
                      <XAxis dataKey="week" tickLine={false} axisLine={false} tick={{ fill: '#605850', fontSize: 12 }} />
                      <YAxis tickLine={false} axisLine={false} tick={{ fill: '#605850', fontSize: 12 }} />
                      <Tooltip
                        formatter={(value, name) => [
                          formatMetric(value as number | string | undefined),
                          name === 'hours' ? 'Heures' : 'Seances',
                        ]}
                        contentStyle={{
                          borderRadius: 14,
                          border: '1px solid #d8d0c8',
                          boxShadow: '0 16px 40px rgba(58, 48, 42, 0.12)',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="hours"
                        stroke="#c2652a"
                        strokeWidth={3}
                        fill="url(#hoursGradient)"
                      />
                      <Area
                        type="monotone"
                        dataKey="sessions"
                        stroke="#8c3c3c"
                        strokeWidth={2}
                        strokeDasharray="6 4"
                        fill="url(#sessionsGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </article>
            </div>

            <aside className="sc-right-stack">
              <article className="sc-dark-card">
                <div>
                  <h3>Resume de la semaine</h3>
                  <p>Un apercu rapide pour garder votre organisation sous controle.</p>
                </div>

                <div className="sc-summary-list">
                  {stats.slice(0, 3).map((stat) => (
                    <div key={stat.label}>
                      <span>{stat.label}</span>
                      <strong>{stat.value}</strong>
                    </div>
                  ))}
                  <div>
                    <span>Seances sur 4 semaines</span>
                    <strong>{totalSessions}</strong>
                  </div>
                  <div>
                    <span>Heures planifiees</span>
                    <strong>{formatMetric(totalHours)}h</strong>
                  </div>
                </div>

                <Link className="sc-dark-button" href={route('student.schedule')}>
                  Voir l'emploi du temps
                </Link>
              </article>

              <section className="sc-agenda-card">
                <div className="sc-section-head sc-section-head-row">
                  <h3>Agenda immediat</h3>
                  <Link href={route('student.schedule')}>Calendrier</Link>
                </div>

                <div className="sc-agenda-list">
                  {schedule.length > 0 ? (
                    schedule.map((item) => (
                      <article className={item.active ? 'is-active' : ''} key={`${item.day}-${item.course}`}>
                        <div className="sc-date-box">
                          <span>{item.month}</span>
                          <strong>{item.day}</strong>
                        </div>
                        <div>
                          <h4>{item.course}</h4>
                          <p>
                            {item.time} / {item.room ?? 'Salle a definir'}
                          </p>
                        </div>
                      </article>
                    ))
                  ) : (
                    <div className="sc-empty-agenda">
                      Aucune seance programmee pour le moment.
                    </div>
                  )}
                </div>
              </section>

              <article className="sc-advice-card">
                <img
                  alt="Etudiant travaillant dans une bibliotheque lumineuse"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbo5T8PHs_Hle9mRd3so-jrkXZTQgaVpyH8j1iKfDyjE5VDkl-xufjc-65rY4TwYtK6WGzIMpw3gtsUOHA3BCHONgn74292aj5OkQDh1mslycY7r-YhCPgI3aSZG4YJYnYpttKNKqxaPdEvc09RKpOWl-4oSD6cFeV6cgNDYZqdcHe9xAw4tx9_Pw0YuAUz1vEd96f5E4B5SELQ8lHYSjSQZrzf-1ZupjWzpUpDTjkbERXgjX62Qo0x3CC0KQNDVyvqZXvVNUxYcnR"
                />
                <div />
                <section>
                  <span>Conseil de reussite</span>
                  <h4>Maintenez un rythme regulier pour avancer sans accumuler de retard.</h4>
                </section>
              </article>
            </aside>
          </section>
        ) : (
          <section className="sc-empty-state">
            <span className="sc-kicker">Aucune formation</span>
            <h2>Vous n'avez pas encore de formation active.</h2>
            <p>Des que votre inscription est validee, vos modules, seances et statistiques apparaitront ici.</p>
          </section>
        )}
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap');

        .student-courses-page {
          --sc-bg: #faf5ee;
          --sc-card: #ffffff;
          --sc-low: #f6f0e8;
          --sc-high: #ece6dc;
          --sc-text: #3a302a;
          --sc-muted: #605850;
          --sc-border: #d8d0c8;
          --sc-primary: #c2652a;
          --sc-primary-soft: #fbe8d8;
          --sc-dark: #3a302a;
          display: flex;
          flex-direction: column;
          gap: 32px;
          padding: 4px 0 36px;
          color: var(--sc-text);
          font-family: 'Manrope', sans-serif;
        }

        .student-courses-page * {
          box-sizing: border-box;
        }

        .a-root--dark .student-courses-page {
          --sc-bg: #131313;
          --sc-card: #201f1f;
          --sc-low: #1c1b1b;
          --sc-high: #353534;
          --sc-text: #e5e2e1;
          --sc-muted: #dbc1b5;
          --sc-border: #554339;
          --sc-primary: #ffb68e;
          --sc-primary-soft: rgba(255, 182, 142, .14);
          --sc-dark: #0e0e0e;
        }

        .a-root--dark .student-courses-page {
          background: #131313;
        }

        .a-root--dark .sc-metric-card,
        .a-root--dark .sc-feature-card,
        .a-root--dark .sc-chart-card,
        .a-root--dark .sc-agenda-card,
        .a-root--dark .sc-side-course,
        .a-root--dark .sc-empty-state {
          border-color: rgba(255, 255, 255, .08);
          box-shadow: 0 12px 32px rgba(0, 0, 0, .22);
        }

        .a-root--dark .sc-live-chip,
        .a-root--dark .sc-agenda-list article,
        .a-root--dark .sc-empty-agenda {
          background: #1c1b1b;
          border-color: rgba(255, 255, 255, .08);
        }

        .a-root--dark .sc-dark-card {
          background: #0e0e0e;
          border-color: rgba(255, 255, 255, .08);
        }

        .student-courses-hero {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 24px;
          flex-wrap: wrap;
        }

        .student-courses-hero h1,
        .sc-feature-card h2,
        .sc-chart-card h3,
        .sc-dark-card h3,
        .sc-agenda-card h3,
        .sc-empty-state h2 {
          margin: 0;
          font-family: 'EB Garamond', serif;
          font-weight: 600;
          letter-spacing: 0;
          color: var(--sc-text);
        }

        .student-courses-hero h1 {
          margin-top: 8px;
          max-width: 900px;
          font-size: clamp(2.7rem, 6vw, 4.8rem);
          line-height: 0.95;
        }

        .student-courses-hero h1 em {
          color: var(--sc-primary);
          font-style: italic;
        }

        .student-courses-hero p,
        .sc-feature-card p,
        .sc-chart-card p,
        .sc-dark-card p,
        .sc-side-course p,
        .sc-empty-state p {
          margin: 12px 0 0;
          max-width: 720px;
          color: var(--sc-muted);
          line-height: 1.75;
        }

        .sc-kicker {
          display: inline-flex;
          color: var(--sc-primary);
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }

        .sc-live-chip {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          width: fit-content;
          border-radius: 999px;
          background: var(--sc-high);
          padding: 10px 16px;
          color: var(--sc-text);
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .sc-live-chip span {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: var(--sc-primary);
          box-shadow: 0 0 0 6px rgba(194, 101, 42, 0.16);
        }

        .sc-metrics-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 24px;
        }

        .sc-metric-card,
        .sc-feature-card,
        .sc-chart-card,
        .sc-agenda-card,
        .sc-side-course,
        .sc-empty-state {
          border: 1px solid rgba(216, 208, 200, 0.7);
          background: var(--sc-card);
          box-shadow: 0 2px 16px rgba(58, 48, 42, 0.04);
        }

        .sc-metric-card {
          display: flex;
          flex-direction: column;
          gap: 6px;
          border-radius: 12px;
          padding: 28px;
          transition: border-color 0.2s ease, transform 0.2s ease;
        }

        .sc-metric-card:hover {
          border-color: rgba(194, 101, 42, 0.35);
          transform: translateY(-2px);
        }

        .sc-metric-card strong {
          color: var(--sc-text);
          font-family: 'EB Garamond', serif;
          font-size: 2.45rem;
          font-weight: 500;
          line-height: 1;
        }

        .sc-metric-card small {
          margin-left: 4px;
          color: var(--sc-muted);
          font-size: 1.15rem;
          font-style: italic;
        }

        .sc-metric-card p {
          margin: 0;
          color: var(--sc-muted);
          font-size: 0.78rem;
        }

        .sc-main-grid {
          display: grid;
          grid-template-columns: minmax(0, 8fr) minmax(320px, 4fr);
          gap: 32px;
          align-items: start;
        }

        .sc-left-stack,
        .sc-right-stack {
          display: flex;
          flex-direction: column;
          gap: 32px;
          min-width: 0;
        }

        .sc-feature-card,
        .sc-chart-card,
        .sc-dark-card,
        .sc-agenda-card,
        .sc-advice-card,
        .sc-empty-state {
          border-radius: 24px;
          overflow: hidden;
        }

        .sc-feature-card {
          transition: border-color 0.2s ease;
        }

        .sc-feature-card:hover {
          border-color: rgba(194, 101, 42, 0.28);
        }

        .sc-feature-content {
          padding: clamp(24px, 4vw, 40px);
        }

        .sc-feature-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 24px;
        }

        .sc-category-pill {
          display: inline-flex;
          border-radius: 999px;
          background: var(--sc-primary-soft);
          padding: 6px 12px;
          color: #401a08;
          font-size: 0.64rem;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .sc-feature-card h2 {
          margin-top: 12px;
          font-size: clamp(2rem, 4vw, 3rem);
          line-height: 1.05;
          transition: color 0.2s ease;
        }

        .sc-feature-card:hover h2 {
          color: var(--sc-primary);
        }

        .sc-price-block {
          min-width: 140px;
          text-align: right;
        }

        .sc-price-block strong {
          display: block;
          color: var(--sc-text);
          font-family: 'EB Garamond', serif;
          font-size: 1.65rem;
          font-weight: 600;
          line-height: 1;
        }

        .sc-price-block span {
          display: block;
          margin-top: 8px;
          color: var(--sc-muted);
          font-size: 0.64rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .sc-meta-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
          margin-top: 32px;
        }

        .sc-meta-grid div {
          min-width: 0;
          border: 1px solid rgba(216, 208, 200, 0.55);
          border-radius: 8px;
          background: var(--sc-low);
          padding: 18px;
        }

        .sc-meta-grid span {
          display: block;
          margin-bottom: 8px;
          color: var(--sc-primary);
          font-size: 0.64rem;
          font-weight: 800;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .sc-meta-grid strong {
          display: block;
          overflow-wrap: anywhere;
          color: var(--sc-text);
          font-size: 0.9rem;
          line-height: 1.35;
        }

        .sc-progress-block {
          margin-top: 32px;
          padding-top: 16px;
        }

        .sc-progress-block > div:first-child,
        .sc-side-progress {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 16px;
          margin-bottom: 14px;
        }

        .sc-progress-block span,
        .sc-side-progress span {
          color: var(--sc-text);
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .sc-progress-block strong {
          color: var(--sc-primary);
          font-family: 'EB Garamond', serif;
          font-size: 2.1rem;
          font-weight: 500;
          line-height: 1;
        }

        .sc-progress-track {
          height: 8px;
          border-radius: 999px;
          overflow: hidden;
          background: var(--sc-high);
        }

        .sc-progress-track span {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: var(--sc-primary);
          transition: width 0.7s ease;
        }

        .sc-progress-track-small {
          height: 7px;
        }

        .sc-secondary-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .sc-side-course {
          border-radius: 18px;
          padding: 22px;
        }

        .sc-side-course-top {
          display: flex;
          justify-content: space-between;
          gap: 14px;
          align-items: center;
        }

        .sc-side-course-top span,
        .sc-side-course-top strong {
          font-size: 0.66rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .sc-side-course-top strong {
          border-radius: 999px;
          background: var(--sc-low);
          padding: 6px 10px;
          color: var(--sc-muted);
        }

        .sc-side-course h3 {
          margin: 16px 0 0;
          color: var(--sc-text);
          font-size: 1rem;
          font-weight: 800;
        }

        .sc-side-course p {
          font-size: 0.84rem;
        }

        .sc-side-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin: 16px 0;
          color: var(--sc-muted);
          font-size: 0.78rem;
          font-weight: 700;
        }

        .sc-side-progress strong {
          color: var(--sc-text);
        }

        .sc-chart-card,
        .sc-agenda-card,
        .sc-empty-state {
          padding: 32px;
        }

        .sc-chart-card h3,
        .sc-dark-card h3,
        .sc-agenda-card h3 {
          font-size: 1.75rem;
        }

        .sc-chart-card p {
          margin-top: 6px;
          font-size: 0.88rem;
        }

        .sc-chart {
          width: 100%;
          height: 300px;
          margin-top: 26px;
        }

        .sc-dark-card {
          display: flex;
          min-height: 400px;
          flex-direction: column;
          justify-content: space-between;
          gap: 26px;
          background: var(--sc-dark);
          padding: 32px;
          color: #faf5ee;
          box-shadow: 0 24px 60px rgba(58, 48, 42, 0.2);
        }

        .sc-dark-card h3 {
          color: #faf5ee;
        }

        .sc-dark-card p {
          color: #dcd6cc;
          font-size: 0.82rem;
        }

        .sc-summary-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          border-top: 1px solid rgba(250, 245, 238, 0.1);
          padding-top: 20px;
        }

        .sc-summary-list div {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
        }

        .sc-summary-list span {
          color: rgba(250, 245, 238, 0.72);
          font-size: 0.86rem;
        }

        .sc-summary-list strong {
          color: #ffffff;
          font-family: 'EB Garamond', serif;
          font-size: 1.15rem;
          font-weight: 600;
        }

        .sc-dark-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          background: var(--sc-primary);
          padding: 15px 18px;
          color: #ffffff;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-decoration: none;
          text-transform: uppercase;
          transition: background 0.2s ease;
        }

        .sc-dark-button:hover {
          background: #e08850;
        }

        .sc-section-head-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
        }

        .sc-section-head-row a {
          color: var(--sc-muted);
          font-size: 0.76rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-decoration: none;
          text-transform: uppercase;
        }

        .sc-section-head-row a:hover {
          color: var(--sc-primary);
        }

        .sc-agenda-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: 22px;
        }

        .sc-agenda-list article {
          display: flex;
          align-items: center;
          gap: 18px;
          border: 1px solid rgba(216, 208, 200, 0.65);
          border-radius: 12px;
          background: var(--sc-card);
          padding: 16px;
          opacity: 0.72;
          transition: background 0.2s ease, opacity 0.2s ease;
        }

        .sc-agenda-list article.is-active {
          border-color: var(--sc-primary-soft);
          background: rgba(251, 232, 216, 0.55);
          opacity: 1;
        }

        .sc-date-box {
          display: flex;
          width: 56px;
          min-width: 56px;
          height: 56px;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          background: var(--sc-primary);
          color: #ffffff;
        }

        .sc-agenda-list article:not(.is-active) .sc-date-box {
          background: var(--sc-high);
          color: var(--sc-muted);
        }

        .sc-date-box span {
          font-size: 0.62rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .sc-date-box strong {
          font-family: 'EB Garamond', serif;
          font-size: 1.3rem;
          line-height: 1;
        }

        .sc-agenda-list h4 {
          margin: 0;
          color: var(--sc-text);
          font-family: 'EB Garamond', serif;
          font-size: 1.04rem;
          font-weight: 600;
        }

        .sc-agenda-list p,
        .sc-empty-agenda {
          margin: 4px 0 0;
          color: var(--sc-muted);
          font-size: 0.78rem;
        }

        .sc-empty-agenda {
          border: 1px dashed var(--sc-border);
          border-radius: 12px;
          padding: 18px;
          text-align: center;
        }

        .sc-advice-card {
          position: relative;
          min-height: 280px;
          box-shadow: 0 18px 42px rgba(58, 48, 42, 0.14);
          isolation: isolate;
        }

        .sc-advice-card img,
        .sc-advice-card > div {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }

        .sc-advice-card img {
          object-fit: cover;
          transition: transform 0.7s ease;
          z-index: -2;
        }

        .sc-advice-card:hover img {
          transform: scale(1.05);
        }

        .sc-advice-card > div {
          background: linear-gradient(to top, rgba(58, 48, 42, 0.82), rgba(58, 48, 42, 0.18), transparent);
          z-index: -1;
        }

        .sc-advice-card section {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          padding: 26px;
          color: #ffffff;
        }

        .sc-advice-card span {
          display: block;
          margin-bottom: 8px;
          color: var(--sc-primary-soft);
          font-size: 0.64rem;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .sc-advice-card h4 {
          margin: 0;
          font-family: 'EB Garamond', serif;
          font-size: 1.45rem;
          font-weight: 600;
          line-height: 1.18;
        }

        .sc-empty-state {
          padding: 42px;
        }

        .sc-empty-state h2 {
          margin-top: 10px;
          font-size: 2.4rem;
        }

        @media (max-width: 1180px) {
          .sc-main-grid,
          .sc-metrics-grid {
            grid-template-columns: 1fr;
          }

          .sc-dark-card {
            min-height: auto;
          }
        }

        @media (max-width: 860px) {
          .sc-feature-head {
            flex-direction: column;
          }

          .sc-price-block {
            min-width: 0;
            text-align: left;
          }

          .sc-meta-grid,
          .sc-secondary-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 640px) {
          .student-courses-page {
            gap: 22px;
          }

          .student-courses-hero {
            align-items: flex-start;
          }

          .student-courses-hero h1 {
            font-size: 2.8rem;
          }

          .sc-metric-card,
          .sc-chart-card,
          .sc-agenda-card,
          .sc-dark-card,
          .sc-empty-state {
            padding: 22px;
          }

          .sc-feature-content {
            padding: 22px;
          }

          .sc-meta-grid,
          .sc-secondary-grid {
            grid-template-columns: 1fr;
          }

          .sc-chart {
            height: 260px;
          }

          .sc-agenda-list article {
            align-items: flex-start;
          }
        }
      `}</style>
    </AuthenticatedLayout>
  );
}
