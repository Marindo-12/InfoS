import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

type Formation = {
  title: string;
  category: string;
  startDate: string;
  endDate: string;
  duration: string;
  studentsCount: number;
  progress: number;
};

type ProchaineCours = {
  title: string;
  type: string;
  room: string;
  time: string;
  instructor: string;
  instructorAvatar?: string;
} | null;

type SessionColor = 'orange' | 'teal' | 'emerald' | 'red' | 'blue';

type DaySession = {
  title: string;
  time: string;
  room: string;
  color: SessionColor;
  isActive?: boolean;
};

type WeekDay = {
  label: string;
  dayNum: number;
  isToday?: boolean;
  sessions: DaySession[];
};

type AttendanceRow = {
  course: string;
  attended: number;
  total: number;
};

type PerfMonth = {
  month: string;
  exams: number;
  quiz: number;
};

type Document = {
  name: string;
  size: string;
  type: 'pdf' | 'doc' | 'zip' | 'img';
};

type PageProps = {
  auth: { user: { id: number; name: string; email: string } };
  formation?: Formation;
  prochaineCours?: ProchaineCours;
  semaine?: WeekDay[];
  presences?: AttendanceRow[];
  performances?: PerfMonth[];
  documents?: Document[];
  globalPresence?: number;
};

const COLORS: Record<SessionColor, { border: string; text: string; tint: string }> = {
  orange: { border: '#c2652a', text: '#8a4518', tint: '#fbe8d8' },
  teal: { border: '#2f8f83', text: '#1f6f67', tint: '#e2f3f1' },
  emerald: { border: '#3a8f5f', text: '#276642', tint: '#e4f4ea' },
  red: { border: '#8c3c3c', text: '#6e3030', tint: '#fce0e0' },
  blue: { border: '#3f6ea8', text: '#294d78', tint: '#e3edf8' },
};

const DOC_ICON: Record<Document['type'], string> = {
  pdf: 'description',
  doc: 'article',
  zip: 'folder_zip',
  img: 'image',
};

const fallbackFormation: Formation = {
  title: 'Aucune formation active',
  category: 'Planning',
  startDate: 'A definir',
  endDate: 'A definir',
  duration: '0h',
  studentsCount: 0,
  progress: 0,
};

function countSessions(week: WeekDay[]) {
  return week.reduce((total, day) => total + day.sessions.length, 0);
}

function estimateHours(week: WeekDay[]) {
  const minutes = week.flatMap((day) => day.sessions).reduce((total, session) => {
    const match = session.time.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
    if (!match) return total;

    const [, sh, sm, eh, em] = match.map(Number);
    const start = sh * 60 + sm;
    const end = eh * 60 + em;

    return end > start ? total + (end - start) : total;
  }, 0);

  if (minutes <= 0) return '0h';
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours}h${String(rest).padStart(2, '0')}` : `${hours}h`;
}

function clampPercent(value: number | undefined) {
  return Math.max(0, Math.min(100, Number(value ?? 0)));
}

function materialIcon(name: string, className = '') {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>;
}

export default function Schedule() {
  const { props } = usePage<PageProps>();
  const formation = props.formation ?? fallbackFormation;
  const prochaineCours = props.prochaineCours ?? null;
  const semaine = props.semaine ?? [];
  const presences = props.presences ?? [];
  const performances = props.performances ?? [];
  const documents = props.documents ?? [];
  const progress = clampPercent(formation.progress);
  const globalPresence = clampPercent(props.globalPresence);
  const weeklySessions = countSessions(semaine);
  const weeklyHours = estimateHours(semaine);

  return (
    <AuthenticatedLayout header={<h2>Planning</h2>}>
      <Head title="Planning" />

      <div className="student-schedule">
        <section className="schedule-hero">
          <div>
            <p className="schedule-kicker">L'excellence academique</p>
            <h1>Votre programme academique</h1>
            <p className="schedule-subtitle">
              {formation.title}
            </p>
          </div>

          <button type="button" className="schedule-primary" onClick={() => window.print()}>
            {materialIcon('calendar_month')}
            Telecharger le planning
          </button>
        </section>

        <section className="schedule-stats" aria-label="Resume du planning">
          <article className="schedule-stat">
            <div>
              {materialIcon('school')}
              <span>Cours de la semaine</span>
            </div>
            <strong>{weeklySessions}</strong>
            <small>Seance{weeklySessions > 1 ? 's' : ''}</small>
          </article>

          <article className="schedule-stat">
            <div>
              {materialIcon('schedule')}
              <span>Heures totales</span>
            </div>
            <strong>{weeklyHours}</strong>
            <small>Cette semaine</small>
          </article>

          <article className="schedule-stat">
            <div>
              {materialIcon('analytics')}
              <span>Progression globale</span>
            </div>
            <div className="schedule-progress-row">
              <strong>{progress}%</strong>
              <div className="schedule-track" aria-hidden>
                <span style={{ width: `${progress}%` }} />
              </div>
            </div>
          </article>
        </section>

        <section className="schedule-intro-grid">
          <article className="schedule-panel schedule-formation">
            <p className="schedule-kicker">{formation.category}</p>
            <h2>{formation.title}</h2>

            <div className="schedule-meta-grid">
              <div>
                <span>Debut</span>
                <strong>{formation.startDate}</strong>
              </div>
              <div>
                <span>Fin</span>
                <strong>{formation.endDate}</strong>
              </div>
              <div>
                <span>Duree</span>
                <strong>{formation.duration}</strong>
              </div>
            </div>

            <div className="schedule-formation-footer">
              <span>{formation.studentsCount} etudiant{formation.studentsCount > 1 ? 's' : ''} inscrit{formation.studentsCount > 1 ? 's' : ''}</span>
              <Link href={route('student.courses')}>Voir mes formations</Link>
            </div>
          </article>

          <article className="schedule-panel schedule-next">
            <p>A venir</p>
            {prochaineCours ? (
              <>
                <h2>{prochaineCours.title}</h2>
                <span>{prochaineCours.type}</span>
                <div className="schedule-next-details">
                  <strong>{prochaineCours.time}</strong>
                  <i />
                  <span>{prochaineCours.instructor || 'Formateur a confirmer'}</span>
                </div>
              </>
            ) : (
              <>
                <h2>Aucune seance prevue</h2>
                <span>Votre prochaine seance apparaitra ici des qu'elle sera planifiee.</span>
              </>
            )}
          </article>
        </section>

        <section>
          <div className="schedule-section-head">
            <h2>Planning de la semaine</h2>
            <div className="schedule-toggle" aria-label="Mode d'affichage">
              <button type="button" className="active">Semaine</button>
              <button type="button">Mois</button>
            </div>
          </div>

          <div className="schedule-week">
            {semaine.length > 0 ? semaine.map((day) => (
              <article className="schedule-day" key={`${day.label}-${day.dayNum}`}>
                <header className={day.isToday ? 'today' : ''}>
                  <span>{day.label}</span>
                  <strong>{day.dayNum}</strong>
                </header>

                <div className="schedule-day-sessions">
                  {day.sessions.length > 0 ? day.sessions.map((session, index) => {
                    const color = COLORS[session.color] ?? COLORS.orange;

                    return (
                      <div
                        className={`schedule-session ${session.isActive ? 'active' : ''}`}
                        key={`${session.title}-${session.time}-${index}`}
                        style={{ borderLeftColor: color.border }}
                      >
                        <span style={{ color: color.text }}>{session.time}</span>
                        <strong>{session.title}</strong>
                        <small>{materialIcon('location_on')}{session.room || 'Salle a confirmer'}</small>
                        {session.isActive && <em>En cours</em>}
                      </div>
                    );
                  }) : (
                    <div className="schedule-empty">Pas de seance prevue</div>
                  )}
                </div>
              </article>
            )) : (
              <div className="schedule-week-empty">Aucun planning disponible pour cette semaine.</div>
            )}
          </div>
        </section>

        <section className="schedule-bottom-grid">
          <div>
            <h2>Suivi academique</h2>
            <div className="schedule-academic">
              <article className="schedule-panel">
                <div className="schedule-card-head">
                  <h3>Presences</h3>
                  <span>Taux: {globalPresence}%</span>
                </div>
                <div className="schedule-presences">
                  {presences.length > 0 ? presences.map((row) => {
                    const pct = row.total > 0 ? Math.round((row.attended / row.total) * 100) : 0;

                    return (
                      <div className="schedule-presence" key={row.course}>
                        <div>
                          <span>{row.course}</span>
                          <strong>{row.attended}/{row.total}</strong>
                        </div>
                        <div className="schedule-track" aria-hidden>
                          <span style={{ width: `${clampPercent(pct)}%` }} />
                        </div>
                      </div>
                    );
                  }) : (
                    <p className="schedule-muted">Aucune donnee de presence pour le moment.</p>
                  )}
                </div>
              </article>

              <article className="schedule-panel">
                <div className="schedule-card-head">
                  <h3>Progression des notes</h3>
                </div>
                {performances.length > 0 ? (
                  <div className="schedule-bars">
                    {performances.map((month) => (
                      <div key={month.month}>
                        <span style={{ height: `${clampPercent(month.quiz)}%` }} />
                        <strong style={{ height: `${clampPercent(month.exams)}%` }} />
                        <small>{month.month}</small>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="schedule-muted">Aucune note disponible pour le moment.</p>
                )}
              </article>
            </div>
          </div>

          <div>
            <h2>Supports de cours</h2>
            <div className="schedule-documents">
              {documents.length > 0 ? documents.map((document, index) => (
                <article className="schedule-document" key={`${document.name}-${index}`}>
                  <div>
                    {materialIcon(DOC_ICON[document.type] ?? 'article')}
                    <span>
                      <strong>{document.name}</strong>
                      <small>{document.size}</small>
                    </span>
                  </div>
                  <button type="button" title="Telecharger">
                    {materialIcon('download')}
                  </button>
                </article>
              )) : (
                <article className="schedule-document-empty">
                  Aucun support de cours disponible.
                </article>
              )}
            </div>
          </div>
        </section>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

        .student-schedule {
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

        .student-schedule * { box-sizing: border-box; }
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 430, 'GRAD' 0, 'opsz' 24; }

        .schedule-hero {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
        }

        .schedule-kicker {
          color: var(--primary);
          font-size: .72rem;
          font-weight: 800;
          letter-spacing: .16em;
          margin: 0 0 10px;
          text-transform: uppercase;
        }

        .schedule-hero h1 {
          font-family: 'EB Garamond', serif;
          font-size: clamp(3.4rem, 8vw, 6.8rem);
          font-weight: 600;
          line-height: .9;
          margin: 0;
          max-width: 820px;
        }

        .schedule-subtitle {
          color: var(--muted);
          font-size: .95rem;
          font-weight: 700;
          margin: 18px 0 0;
        }

        .schedule-primary {
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

        .schedule-primary:hover { filter: brightness(.96); }

        .schedule-stats {
          display: grid;
          gap: 18px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .schedule-stat,
        .schedule-panel {
          background: var(--surface-high);
          border: 1px solid rgba(216, 208, 200, .75);
          border-radius: 12px;
          box-shadow: 0 2px 16px rgba(58, 48, 42, .045);
        }

        .schedule-stat {
          min-height: 154px;
          padding: 26px;
        }

        .schedule-stat div:first-child {
          align-items: flex-start;
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 18px;
        }

        .schedule-stat .material-symbols-outlined {
          background: var(--primary-soft);
          border-radius: 8px;
          color: var(--primary);
          padding: 11px;
        }

        .schedule-stat div:first-child span:last-child {
          color: var(--muted);
          font-size: .68rem;
          font-weight: 800;
          letter-spacing: .08em;
          text-align: right;
          text-transform: uppercase;
        }

        .schedule-stat strong {
          display: inline-block;
          font-family: 'EB Garamond', serif;
          font-size: 2.75rem;
          font-weight: 600;
          line-height: 1;
        }

        .schedule-stat small {
          color: var(--muted);
          font-size: .85rem;
          margin-left: 7px;
        }

        .schedule-progress-row {
          align-items: flex-end;
          display: flex;
          gap: 16px;
        }

        .schedule-track {
          background: var(--surface-mid);
          border-radius: 999px;
          height: 7px;
          overflow: hidden;
          width: 100%;
        }

        .schedule-track span {
          background: var(--primary);
          border-radius: inherit;
          display: block;
          height: 100%;
        }

        .schedule-intro-grid {
          display: grid;
          gap: 22px;
          grid-template-columns: minmax(0, 1.25fr) minmax(300px, .75fr);
        }

        .schedule-panel { padding: 28px; }

        .schedule-formation {
          background: var(--surface-low);
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .schedule-formation h2,
        .schedule-next h2,
        .schedule-section-head h2,
        .schedule-bottom-grid h2 {
          font-family: 'EB Garamond', serif;
          font-weight: 600;
          margin: 0;
        }

        .schedule-formation h2,
        .schedule-next h2 { font-size: clamp(1.75rem, 3vw, 2.45rem); line-height: 1.05; }

        .schedule-meta-grid {
          display: grid;
          gap: 14px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .schedule-meta-grid span,
        .schedule-presence span,
        .schedule-card-head span {
          color: var(--soft);
          display: block;
          font-size: .68rem;
          font-weight: 800;
          letter-spacing: .09em;
          margin-bottom: 5px;
          text-transform: uppercase;
        }

        .schedule-meta-grid strong { font-size: .92rem; }

        .schedule-formation-footer {
          align-items: center;
          border-top: 1px solid rgba(216, 208, 200, .9);
          display: flex;
          justify-content: space-between;
          gap: 16px;
          padding-top: 20px;
        }

        .schedule-formation-footer span { color: var(--muted); font-size: .82rem; font-weight: 800; }
        .schedule-formation-footer a { color: var(--primary); font-size: .82rem; font-weight: 900; text-decoration: none; }

        .schedule-next {
          background: var(--text);
          color: var(--surface);
          min-height: 100%;
        }

        .schedule-next p {
          background: var(--primary);
          border-radius: 4px;
          color: white;
          display: inline-block;
          font-size: .66rem;
          font-weight: 900;
          letter-spacing: .1em;
          margin: 0 0 14px;
          padding: 4px 9px;
          text-transform: uppercase;
        }

        .schedule-next span { color: rgba(250, 245, 238, .68); display: block; font-size: .84rem; line-height: 1.65; }

        .schedule-next-details {
          align-items: center;
          display: flex;
          gap: 16px;
          margin-top: 24px;
        }

        .schedule-next-details strong {
          background: rgba(250, 245, 238, .11);
          border-radius: 8px;
          padding: 11px 14px;
        }

        .schedule-next-details i {
          background: rgba(250, 245, 238, .18);
          display: block;
          height: 38px;
          width: 1px;
        }

        .schedule-section-head {
          align-items: center;
          display: flex;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 20px;
        }

        .schedule-section-head h2,
        .schedule-bottom-grid h2 { font-size: 2rem; }

        .schedule-toggle {
          background: var(--surface-low);
          border-radius: 8px;
          display: flex;
          padding: 4px;
        }

        .schedule-toggle button {
          background: transparent;
          border: 0;
          border-radius: 6px;
          color: var(--muted);
          cursor: pointer;
          font-family: 'Manrope', sans-serif;
          font-size: .78rem;
          font-weight: 800;
          padding: 8px 15px;
        }

        .schedule-toggle .active {
          background: white;
          box-shadow: 0 1px 5px rgba(58, 48, 42, .08);
          color: var(--primary);
        }

        .schedule-week {
          background: rgba(216, 208, 200, .45);
          border: 1px solid rgba(216, 208, 200, .8);
          border-radius: 16px;
          display: grid;
          gap: 1px;
          grid-template-columns: repeat(7, minmax(0, 1fr));
          overflow: hidden;
          box-shadow: 0 2px 16px rgba(58, 48, 42, .045);
        }

        .schedule-day {
          background: rgba(246, 240, 232, .88);
          min-height: 430px;
          padding: 22px 16px;
        }

        .schedule-day header {
          margin-bottom: 28px;
          text-align: center;
        }

        .schedule-day header span {
          color: var(--muted);
          display: block;
          font-size: .68rem;
          font-weight: 800;
          letter-spacing: .16em;
          margin-bottom: 4px;
          text-transform: uppercase;
        }

        .schedule-day header strong {
          color: var(--text);
          font-family: 'EB Garamond', serif;
          font-size: 1.8rem;
          font-weight: 600;
        }

        .schedule-day header.today span,
        .schedule-day header.today strong { color: var(--primary); }

        .schedule-day-sessions {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .schedule-session {
          background: white;
          border-left: 4px solid var(--primary);
          border-radius: 8px;
          box-shadow: 0 1px 8px rgba(58, 48, 42, .05);
          padding: 14px;
          transition: box-shadow .18s ease, transform .18s ease;
        }

        .schedule-session:hover {
          box-shadow: 0 8px 22px rgba(58, 48, 42, .1);
          transform: translateY(-1px);
        }

        .schedule-session.active { outline: 2px solid rgba(194, 101, 42, .28); }

        .schedule-session > span {
          display: block;
          font-size: .66rem;
          font-weight: 900;
          letter-spacing: .08em;
          margin-bottom: 5px;
          text-transform: uppercase;
        }

        .schedule-session strong {
          color: var(--text);
          display: block;
          font-size: .86rem;
          line-height: 1.32;
          margin-bottom: 10px;
        }

        .schedule-session small {
          align-items: center;
          color: var(--muted);
          display: flex;
          font-size: .72rem;
          font-weight: 800;
          gap: 4px;
        }

        .schedule-session small .material-symbols-outlined { font-size: 15px; }

        .schedule-session em {
          background: var(--primary);
          border-radius: 999px;
          color: white;
          display: inline-block;
          font-size: .62rem;
          font-style: normal;
          font-weight: 900;
          letter-spacing: .08em;
          margin-top: 10px;
          padding: 3px 9px;
          text-transform: uppercase;
        }

        .schedule-empty,
        .schedule-week-empty,
        .schedule-document-empty {
          align-items: center;
          border: 1.5px dashed rgba(154, 144, 136, .45);
          border-radius: 12px;
          color: var(--soft);
          display: flex;
          font-size: .78rem;
          font-style: italic;
          justify-content: center;
          min-height: 118px;
          padding: 16px;
          text-align: center;
        }

        .schedule-week-empty { grid-column: 1 / -1; background: var(--surface-low); min-height: 220px; }

        .schedule-bottom-grid {
          display: grid;
          gap: 34px;
          grid-template-columns: minmax(0, 1.35fr) minmax(300px, .65fr);
        }

        .schedule-bottom-grid h2 { margin-bottom: 18px; }

        .schedule-academic {
          display: grid;
          gap: 18px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .schedule-card-head {
          align-items: center;
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 20px;
        }

        .schedule-card-head h3 { font-size: .95rem; margin: 0; }
        .schedule-card-head span {
          background: var(--primary-soft);
          border-radius: 6px;
          color: var(--primary);
          margin: 0;
          padding: 5px 8px;
        }

        .schedule-presences {
          display: flex;
          flex-direction: column;
          gap: 17px;
        }

        .schedule-presence div:first-child {
          display: flex;
          justify-content: space-between;
          gap: 14px;
          margin-bottom: 8px;
        }

        .schedule-presence strong { color: var(--muted); font-size: .76rem; }

        .schedule-bars {
          align-items: end;
          display: flex;
          gap: 12px;
          height: 170px;
          justify-content: space-around;
          padding: 8px 6px 0;
        }

        .schedule-bars > div {
          align-items: end;
          display: grid;
          flex: 1;
          gap: 3px;
          grid-template-columns: 1fr 1fr;
          height: 100%;
          position: relative;
        }

        .schedule-bars span,
        .schedule-bars strong {
          align-self: end;
          border-radius: 5px 5px 0 0;
          display: block;
          min-height: 5px;
        }

        .schedule-bars span { background: rgba(140, 60, 60, .45); }
        .schedule-bars strong { background: rgba(194, 101, 42, .86); }

        .schedule-bars small {
          bottom: -18px;
          color: var(--soft);
          font-size: .66rem;
          font-weight: 900;
          left: 0;
          letter-spacing: .08em;
          position: absolute;
          right: 0;
          text-align: center;
          text-transform: uppercase;
        }

        .schedule-documents {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .schedule-document {
          align-items: center;
          background: var(--surface-low);
          border: 1px solid transparent;
          border-radius: 12px;
          display: flex;
          gap: 12px;
          justify-content: space-between;
          padding: 16px;
          transition: background .18s ease, border-color .18s ease;
        }

        .schedule-document:hover {
          background: white;
          border-color: rgba(194, 101, 42, .24);
        }

        .schedule-document > div {
          align-items: center;
          display: flex;
          gap: 12px;
          min-width: 0;
        }

        .schedule-document > div > .material-symbols-outlined {
          align-items: center;
          background: white;
          border-radius: 9px;
          color: var(--primary);
          display: flex;
          flex-shrink: 0;
          height: 42px;
          justify-content: center;
          width: 42px;
        }

        .schedule-document span { min-width: 0; }
        .schedule-document strong {
          color: var(--text);
          display: block;
          font-size: .84rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .schedule-document small {
          color: var(--muted);
          display: block;
          font-size: .68rem;
          font-weight: 800;
          letter-spacing: .06em;
          margin-top: 3px;
          text-transform: uppercase;
        }

        .schedule-document button {
          align-items: center;
          background: transparent;
          border: 0;
          border-radius: 8px;
          color: var(--muted);
          cursor: pointer;
          display: flex;
          flex-shrink: 0;
          height: 38px;
          justify-content: center;
          width: 38px;
        }

        .schedule-document button:hover {
          background: var(--primary-soft);
          color: var(--primary);
        }

        .schedule-muted {
          color: var(--soft);
          font-size: .82rem;
          margin: 0;
        }

        .a-root--dark .student-schedule {
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

        .a-root--dark .schedule-stat,
        .a-root--dark .schedule-panel,
        .a-root--dark .schedule-session,
        .a-root--dark .schedule-document,
        .a-root--dark .schedule-document > div > .material-symbols-outlined,
        .a-root--dark .schedule-toggle .active {
          background: var(--surface-high);
          border-color: rgba(255, 255, 255, .08);
          box-shadow: 0 12px 32px rgba(0, 0, 0, .22);
        }

        .a-root--dark .schedule-day { background: rgba(19, 19, 19, .92); }
        .a-root--dark .schedule-week { background: rgba(85, 67, 57, .45); border-color: rgba(85, 67, 57, .75); }
        .a-root--dark .schedule-next { background: #0e0e0e; }
        .a-root--dark .schedule-session:hover,
        .a-root--dark .schedule-document:hover { border-color: rgba(255, 182, 142, .34); box-shadow: 0 12px 32px rgba(194, 101, 42, .12); }
        .a-root--dark .schedule-bars span { background: rgba(255, 182, 142, .22); }

        @media (max-width: 1180px) {
          .schedule-week { grid-template-columns: repeat(4, minmax(180px, 1fr)); }
          .schedule-day { min-height: 330px; }
          .schedule-bottom-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 900px) {
          .student-schedule { margin: -18px -16px -32px; padding: 30px 16px 44px; }
          .schedule-hero { align-items: flex-start; flex-direction: column; }
          .schedule-stats,
          .schedule-intro-grid,
          .schedule-academic { grid-template-columns: 1fr; }
          .schedule-week { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }

        @media (max-width: 560px) {
          .schedule-hero h1 { font-size: 3rem; }
          .schedule-stats { gap: 12px; }
          .schedule-stat,
          .schedule-panel { padding: 20px; }
          .schedule-meta-grid { grid-template-columns: 1fr; }
          .schedule-formation-footer,
          .schedule-section-head { align-items: flex-start; flex-direction: column; }
          .schedule-week { display: flex; flex-direction: column; }
          .schedule-day { min-height: auto; }
        }
      `}</style>
    </AuthenticatedLayout>
  );
}
