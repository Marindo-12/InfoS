import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';

/* ═══════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════ */

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

type DaySession = {
  title: string;
  time: string;
  room: string;
  color: 'orange' | 'teal' | 'emerald' | 'red' | 'blue';
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
  formation: Formation;
  prochaineCours: ProchaineCours;
  semaine: WeekDay[];
  presences: AttendanceRow[];
  performances: PerfMonth[];
  documents: Document[];
  globalPresence: number;
};

/* ═══════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════ */

const COLOR_MAP: Record<DaySession['color'], { bg: string; border: string; text: string; icon: string }> = {
  orange:  { bg: '#fff8f4', border: '#ff9a56',  text: '#c2652a', icon: '#ff6b2b' },
  teal:    { bg: '#f0f8f8', border: '#4db6ac',  text: '#00796b', icon: '#26a69a' },
  emerald: { bg: '#f1f9f4', border: '#66bb6a',  text: '#2e7d32', icon: '#43a047' },
  red:     { bg: '#fdf4f4', border: '#ef9a9a',  text: '#8c3c3c', icon: '#c0392b' },
  blue:    { bg: '#f3f6fd', border: '#90caf9',  text: '#1565c0', icon: '#1976d2' },
};

const DOC_TYPE: Record<Document['type'], { bg: string; text: string; icon: string }> = {
  pdf: { bg: '#fee2e2', text: '#dc2626', icon: 'description' },
  doc: { bg: '#dbeafe', text: '#2563eb', icon: 'article'     },
  zip: { bg: '#ffedd5', text: '#ea580c', icon: 'folder'      },
  img: { bg: '#f3e8ff', text: '#7c3aed', icon: 'image'       },
};

/* ═══════════════════════════════════════════════════
   DEMO DATA — used when backend hasn't sent props
═══════════════════════════════════════════════════ */

const DEMO: Omit<PageProps, 'auth'> = {
  formation: {
    title: 'Formation Bureautique Avancée',
    category: 'Inscription active',
    startDate: '12 Jan 2025',
    endDate:   '28 Avr 2025',
    duration:  '2 mois',
    studentsCount: 24,
    progress: 62,
  },
  prochaineCours: {
    title:    'Microsoft Excel — Niveau Avancé',
    type:     'Atelier pratique · Salle 204',
    room:     'Salle 204',
    time:     '10:00',
    instructor: 'M. Rachid Alami',
  },
  semaine: [
    { label: 'Lun', dayNum: 12, sessions: [
      { title: 'Word — Mise en page',    time: '09:00 — 10:30', room: 'Salle 101', color: 'orange' },
      { title: 'PowerPoint Créatif',     time: '14:00 — 15:30', room: 'Labo B',    color: 'teal'   },
    ]},
    { label: 'Mar', dayNum: 13, isToday: true, sessions: [
      { title: 'Excel Avancé',           time: '10:00 — 11:30', room: 'Salle 204', color: 'orange', isActive: true },
    ]},
    { label: 'Mer', dayNum: 14, sessions: [
      { title: 'Word — Documents longs', time: '09:00 — 10:30', room: 'Salle 101', color: 'orange' },
      { title: 'Infographie — Figma',    time: '14:00 — 16:00', room: 'Labo Créa', color: 'red'    },
    ]},
    { label: 'Jeu', dayNum: 15, sessions: [
      { title: 'Excel — Tableaux croisés', time: '11:00 — 12:30', room: 'Labo B', color: 'emerald' },
    ]},
    { label: 'Ven', dayNum: 16, sessions: [] },
    { label: 'Sam', dayNum: 17, sessions: [] },
    { label: 'Dim', dayNum: 18, sessions: [] },
  ],
  presences: [
    { course: 'Microsoft Word',       attended: 9,  total: 10 },
    { course: 'Microsoft Excel',      attended: 8,  total: 8  },
    { course: 'Microsoft PowerPoint', attended: 6,  total: 7  },
  ],
  performances: [
    { month: 'Jan', exams: 60, quiz: 45 },
    { month: 'Fév', exams: 75, quiz: 50 },
    { month: 'Mar', exams: 80, quiz: 70 },
  ],
  documents: [
    { name: 'Cours_Word_01.pdf',  size: '3.2 Mo', type: 'pdf' },
    { name: 'Exercices_Excel.docx', size: '1.1 Mo', type: 'doc' },
    { name: 'Ressources.zip',     size: '84 Mo',  type: 'zip' },
    { name: 'Cours_PPT.pdf',      size: '2.8 Mo', type: 'pdf' },
  ],
  globalPresence: 92,
};

/* ═══════════════════════════════════════════════════
   ICONS
═══════════════════════════════════════════════════ */

const Ic = {
  arrow: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>,
  star:  () => <svg width="44" height="44" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" opacity=".18"/></svg>,
  check: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7"/></svg>,
  cal:   () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  user:  () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  sync:  () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 4v6h6"/><path d="M23 20v-6h-6"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15"/></svg>,
  dl:    () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></svg>,
  map:   () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>,
  book:  () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  moon:  () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
};

/* ═══════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════ */

export default function Schedule() {
  const { props } = usePage<PageProps>();
  const user = props.auth.user;

  const {
    formation       = { title: 'Aucune formation active', category: 'Planning', startDate: 'A definir', endDate: 'A definir', duration: '0h', studentsCount: 0, progress: 0 },
    prochaineCours  = null,
    semaine         = [],
    presences       = [],
    performances    = [],
    documents       = [],
    globalPresence  = 0,
  } = props as Partial<typeof DEMO>;

  return (
    <AuthenticatedLayout header={<h2>Planning</h2>}>
      <Head title="Planning" />

      <div className="pl-root">

        {/* ══════════════════════════════════════════
            HERO GRID — Formation overview + Prochaine séance
        ══════════════════════════════════════════ */}
        <div className="pl-hero-grid">

          {/* Formation Overview */}
          <section className="pl-card pl-overview">
            <span className="pl-kicker">{formation.category}</span>
            <h2 className="pl-overview-title">{formation.title}</h2>

            <div className="pl-overview-meta">
              <div>
                <p className="pl-meta-label">Début</p>
                <p className="pl-meta-val">{formation.startDate}</p>
              </div>
              <div>
                <p className="pl-meta-label">Fin</p>
                <p className="pl-meta-val">{formation.endDate}</p>
              </div>
              <div>
                <p className="pl-meta-label">Durée</p>
                <p className="pl-meta-val">{formation.duration}</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="pl-progress-wrap">
              <div className="pl-progress-head">
                <span className="pl-meta-label">Progression</span>
                <span className="pl-progress-pct">{formation.progress}%</span>
              </div>
              <div className="pl-progress-track">
                <div className="pl-progress-fill" style={{ width: `${formation.progress}%` }} />
              </div>
            </div>

            <div className="pl-overview-footer">
              <div className="pl-avatars">
                <div className="pl-avatar-bubble pl-avatar-count">
                  {formation.studentsCount}
                </div>
                <span className="pl-students-label">etudiant{formation.studentsCount > 1 ? 's' : ''} inscrit{formation.studentsCount > 1 ? 's' : ''}</span>
              </div>
              <button className="pl-link-btn">
                Voir le programme <Ic.arrow />
              </button>
            </div>
          </section>

          {/* Prochaine séance */}
          <section className="pl-card pl-next-session">
            {/* Decorative star */}
            <div className="pl-next-deco" aria-hidden="true"><Ic.star /></div>

            <div className="pl-next-inner">
              <div>
                <span className="pl-next-badge">À venir</span>
                {prochaineCours ? (
                  <>
                    <h3 className="pl-next-title">{prochaineCours.title}</h3>
                    <p className="pl-next-sub">{prochaineCours.type}</p>
                  </>
                ) : (
                  <h3 className="pl-next-title">Aucune séance prévue</h3>
                )}
              </div>

              {prochaineCours && (
                <div className="pl-next-details">
                  <div className="pl-next-time-block">
                    <p className="pl-next-time-label">Aujourd'hui</p>
                    <p className="pl-next-time">{prochaineCours.time}</p>
                  </div>
                  <div className="pl-next-sep" aria-hidden="true" />
                  <div className="pl-next-instructor">
                    <div className="pl-instructor-avatar"><Ic.user /></div>
                    <div>
                      <p className="pl-instructor-label">Formateur</p>
                      <p className="pl-instructor-name">{prochaineCours.instructor}</p>
                    </div>
                  </div>
                </div>
              )}

              <button className="pl-join-btn">
                <Ic.cal />
                Rejoindre la séance
              </button>
            </div>
          </section>
        </div>

        {/* ══════════════════════════════════════════
            CALENDRIER HEBDOMADAIRE
        ══════════════════════════════════════════ */}
        <section>
          <div className="pl-week-header">
            <h2 className="pl-section-title">Planning de la semaine</h2>
            <div className="pl-week-toggle">
              <button className="pl-toggle-btn pl-toggle-btn--active">Semaine</button>
              <button className="pl-toggle-btn">Mois</button>
            </div>
          </div>

          <div className="pl-week-grid">
            {semaine.map((day) => (
              <div key={day.label} className="pl-day-col">
                {/* Day header */}
                <div className={`pl-day-header ${day.isToday ? 'pl-day-header--today' : ''}`}>
                  <p className="pl-day-label">{day.label}</p>
                  <p className={`pl-day-num ${day.isToday ? 'pl-day-num--today' : ''}`}>
                    {day.dayNum}
                  </p>
                </div>

                {/* Sessions */}
                <div className="pl-sessions">
                  {day.sessions.length > 0 ? (
                    day.sessions.map((s, si) => {
                      const col = COLOR_MAP[s.color];
                      return (
                        <div key={si} className={`pl-session ${s.isActive ? 'pl-session--active' : ''}`}
                          style={{
                            background: s.isActive ? '#fff4ef' : col.bg,
                            borderLeftColor: col.border,
                            outline: s.isActive ? `2px solid ${col.border}` : 'none',
                            outlineOffset: '0px',
                          }}>
                          <p className="pl-session-title" style={{ color: s.isActive ? col.text : '#111' }}>
                            {s.title}
                          </p>
                          <p className="pl-session-time" style={{ color: s.isActive ? col.text : '#9a9088' }}>
                            {s.time}
                          </p>
                          <div className="pl-session-meta">
                            <span className="pl-session-dot" style={{ background: col.icon }} />
                            <span className="pl-session-room" style={{ color: '#605850' }}>{s.room}</span>
                          </div>
                          {s.isActive && (
                            <span className="pl-session-active-badge">En cours</span>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="pl-session-empty">
                      <div className="pl-session-empty-icon">
                        <Ic.moon />
                      </div>
                      <p>Pas de séance</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SUIVI ACADÉMIQUE
        ══════════════════════════════════════════ */}
        <section>
          <h2 className="pl-section-title" style={{ marginBottom: 20 }}>Suivi académique</h2>

          <div className="pl-academic-grid">

            {/* Présences */}
            <div className="pl-card">
              <div className="pl-card-head">
                <h3 className="pl-card-title">Présences</h3>
                <span className="pl-card-badge">Global : {globalPresence}%</span>
              </div>

              <div className="pl-presence-table">
                <div className="pl-presence-header">
                  <span style={{ gridColumn: '1 / 3' }}>Formation</span>
                  <span style={{ textAlign: 'center' }}>Séances</span>
                  <span>Taux</span>
                </div>

                {presences.map((row) => {
                  const pct = row.total > 0 ? Math.round((row.attended / row.total) * 100) : 0;
                  const color = pct >= 90 ? '#10b981' : pct >= 75 ? '#ff9a56' : '#ef4444';
                  return (
                    <div key={row.course} className="pl-presence-row">
                      <div className="pl-presence-name" style={{ gridColumn: '1 / 3' }}>{row.course}</div>
                      <div className="pl-presence-count">{row.attended} / {row.total}</div>
                      <div className="pl-presence-bar-wrap">
                        <div className="pl-presence-track">
                          <div className="pl-presence-fill" style={{ width: `${pct}%`, background: color }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
                {presences.length === 0 && (
                  <div className="pl-session-empty">
                    <p>Aucune donnee de presence pour le moment.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Performance */}
            <div className="pl-card">
              <div className="pl-card-head">
                <h3 className="pl-card-title">Progression des notes</h3>
                <div className="pl-legend">
                  <span><span className="pl-legend-dot" style={{ background: '#ff6b2b' }} />Examens</span>
                  <span><span className="pl-legend-dot" style={{ background: '#8c3c3c' }} />Contrôles</span>
                </div>
              </div>

              <div className="pl-chart">
                {performances.length > 0 ? performances.map((m) => (
                  <div key={m.month} className="pl-chart-col">
                    <div className="pl-chart-bars">
                      {/* Quiz bar (behind) */}
                      <div className="pl-bar pl-bar--quiz"
                        style={{ height: `${m.quiz}%` }} />
                      {/* Exam bar (front) */}
                      <div className="pl-bar pl-bar--exam"
                        style={{ height: `${m.exams}%` }} />
                    </div>
                    <span className="pl-chart-label">{m.month}</span>
                  </div>
                )) : (
                  <div className="pl-session-empty">
                    <p>Aucune note disponible pour le moment.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            SUPPORTS DE COURS
        ══════════════════════════════════════════ */}
        <section className="pl-card">
          <div className="pl-card-head">
            <h3 className="pl-card-title">Supports de cours</h3>
            <button className="pl-sync-btn">
              <Ic.sync /> Mettre à jour
            </button>
          </div>

          <div className="pl-docs-grid">
            {documents.map((doc, i) => {
              const dt = DOC_TYPE[doc.type];
              return (
                <div key={i} className="pl-doc-item">
                  <div className="pl-doc-left">
                    <div className="pl-doc-icon" style={{ background: dt.bg, color: dt.text }}>
                      {/* Icon by type */}
                      {doc.type === 'pdf' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
                      {doc.type === 'doc' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="12" y2="17"/></svg>}
                      {doc.type === 'zip' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>}
                      {doc.type === 'img' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>}
                    </div>
                    <div>
                      <p className="pl-doc-name">{doc.name}</p>
                      <p className="pl-doc-size">{doc.size}</p>
                    </div>
                  </div>
                  <button className="pl-dl-btn" title="Télécharger">
                    <Ic.dl />
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* ══════════════════════════════════════════
            ESPACE ÉTUDE — Image banner
        ══════════════════════════════════════════ */}
        <section className="pl-campus-banner">
          <div className="pl-campus-img-wrap">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeaTiZNs5SEstcCDjgMMdq8IEs59pBB4vEaKcQ3mzmFHeXefl7-pelgzINzozOXqsmwoFUm8vefK8wHWjBx5irtGUDbaqk0bBI6zdjXC_IZDILFubnmFKHDqdiujbt3YvsZctyfp5KyrWOFPFb7x4SToCkBJGL2--srDNXIOS9Nsh70Wgel-PUJJAQ-YFm2ED4kEjf2AzmZXkz72VvQgzd86d4zLGLqTSG2tg_-K15WEDNXnrigz5zd_GFlm0DiMc_mFp2Dt1Zo933"
              alt="Espace de travail du centre"
              className="pl-campus-img"
            />
            <div className="pl-campus-overlay" aria-hidden="true" />
          </div>
          <div className="pl-campus-content">
            <h3 className="pl-campus-title">Espace de formation</h3>
            <p className="pl-campus-text">
              Accédez à nos salles équipées, laboratoires informatiques et ressources pédagogiques.
              Nos espaces sont conçus pour favoriser l'apprentissage individuel et collectif dans les
              meilleures conditions.
            </p>
            <div className="pl-campus-actions">
              <button className="pl-campus-btn">
                <Ic.map /> Plan du centre
              </button>
              <button className="pl-campus-btn">
                <Ic.book /> Réserver une salle
              </button>
            </div>
          </div>
        </section>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,600;0,700;1,600;1,700&family=Manrope:wght@400;500;600;700;800&display=swap');

        /* ── Root ── */
        .pl-root {
          display: flex; flex-direction: column; gap: 24px;
          font-family: 'Manrope', sans-serif; color: #3a302a;
          width: 100%; min-width: 0;
        }
        .pl-root *, .pl-root *::before, .pl-root *::after { box-sizing: border-box; }

        /* ── Base card ── */
        .pl-card {
          background: #fff; border-radius: 18px;
          border: 1px solid rgba(0,0,0,0.07);
          box-shadow: 0 2px 10px rgba(0,0,0,0.04);
          padding: 28px;
        }
        .pl-card-head {
          display: flex; align-items: center; justify-content: space-between;
          gap: 12px; flex-wrap: wrap; margin-bottom: 20px;
        }
        .pl-card-title { margin: 0; font-size: 1rem; font-weight: 800; color: #111; }
        .pl-card-badge {
          font-size: .68rem; font-weight: 800; text-transform: uppercase;
          letter-spacing: .08em; padding: 4px 10px; border-radius: 99px;
          background: rgba(194,101,42,.1); color: #c2652a;
        }

        /* ── Shared label ── */
        .pl-kicker {
          display: block; font-size: .7rem; font-weight: 800;
          letter-spacing: .13em; text-transform: uppercase; color: #c2652a; margin-bottom: 8px;
        }
        .pl-section-title {
          font-family: 'EB Garamond', serif;
          font-size: 1.7rem; font-weight: 700; color: #3a302a; margin: 0;
        }

        /* ══════════ HERO GRID ══════════ */
        .pl-hero-grid {
          display: grid; grid-template-columns: 7fr 5fr; gap: 20px;
        }
        @media (max-width: 900px) { .pl-hero-grid { grid-template-columns: 1fr; } }

        /* Overview card */
        .pl-overview {
          display: flex; flex-direction: column; justify-content: space-between;
          background: #f6f0e8;
        }
        .pl-overview-title {
          font-family: 'EB Garamond', serif;
          font-size: clamp(1.4rem, 2.5vw, 1.9rem);
          font-weight: 700; color: #3a302a;
          margin: 0 0 20px; line-height: 1.2;
        }
        .pl-overview-meta {
          display: grid; grid-template-columns: repeat(3,1fr); gap: 16px;
          padding-bottom: 20px;
        }
        .pl-meta-label { font-size: .68rem; text-transform: uppercase; letter-spacing: .1em; color: #9a9088; margin: 0 0 3px; }
        .pl-meta-val   { font-size: .9rem; font-weight: 700; color: #3a302a; margin: 0; }

        .pl-progress-wrap { padding: 16px 0 20px; border-top: 1px solid rgba(0,0,0,0.08); }
        .pl-progress-head { display: flex; justify-content: space-between; margin-bottom: 8px; }
        .pl-progress-pct  { font-size: .78rem; font-weight: 800; color: #c2652a; }
        .pl-progress-track {
          width: 100%; height: 8px; border-radius: 99px;
          background: rgba(0,0,0,0.08); overflow: hidden;
        }
        .pl-progress-fill {
          height: 100%; border-radius: inherit;
          background: linear-gradient(90deg, #f0a878, #c2652a);
          transition: width .5s ease;
        }

        .pl-overview-footer {
          display: flex; align-items: center; justify-content: space-between;
          border-top: 1px solid rgba(0,0,0,0.08); padding-top: 20px;
        }
        .pl-avatars { display: flex; }
        .pl-avatar-bubble {
          width: 32px; height: 32px; border-radius: 50%;
          border: 2px solid #f6f0e8;
          display: flex; align-items: center; justify-content: center;
          font-size: .62rem; font-weight: 800; color: #fff;
          margin-left: -8px; position: relative;
        }
        .pl-avatars .pl-avatar-bubble:first-child { margin-left: 0; }
        .pl-avatar-count { background: #e08850; color: #fff; font-size: .58rem; }
        .pl-students-label { align-self: center; margin-left: 8px; color: #605850; font-size: .78rem; font-weight: 800; }
        .pl-link-btn {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: .8rem; font-weight: 700; color: #c2652a;
          background: none; border: none; cursor: pointer;
          transition: gap .15s;
        }
        .pl-link-btn:hover { gap: 8px; }

        /* Next session card */
        .pl-next-session {
          position: relative; overflow: hidden;
          background: #3a302a; color: #faf5ee;
          padding: 28px;
        }
        .pl-next-deco {
          position: absolute; top: 12px; right: 12px; opacity: .15;
          animation: pl-float 6s ease-in-out infinite;
        }
        @keyframes pl-float { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-6px) scale(1.05)} }
        .pl-next-inner {
          position: relative; z-index: 1; height: 100%;
          display: flex; flex-direction: column; justify-content: space-between; gap: 20px;
        }
        .pl-next-badge {
          display: inline-block; background: #c2652a; color: #fff;
          font-size: .62rem; font-weight: 800; letter-spacing: .1em; text-transform: uppercase;
          padding: 3px 8px; border-radius: 4px; margin-bottom: 10px;
        }
        .pl-next-title {
          font-family: 'EB Garamond', serif;
          font-size: 1.55rem; font-weight: 700; color: #faf5ee; margin: 0 0 4px;
        }
        .pl-next-sub { font-size: .8rem; color: rgba(250,245,238,.55); margin: 0; }

        .pl-next-details { display: flex; align-items: center; gap: 16px; }
        .pl-next-time-block {
          background: rgba(250,245,238,.1); border-radius: 10px;
          padding: 10px 14px; min-width: 72px; text-align: center;
        }
        .pl-next-time-label { font-size: .62rem; text-transform: uppercase; letter-spacing: .08em; opacity: .55; margin: 0 0 2px; }
        .pl-next-time { font-size: 1.1rem; font-weight: 800; color: #faf5ee; margin: 0; }
        .pl-next-sep { width: 1px; height: 40px; background: rgba(250,245,238,.15); }
        .pl-next-instructor { display: flex; align-items: center; gap: 10px; }
        .pl-instructor-avatar {
          width: 38px; height: 38px; border-radius: 50%;
          background: rgba(250,245,238,.15);
          display: flex; align-items: center; justify-content: center;
          color: rgba(250,245,238,.7);
        }
        .pl-instructor-label { font-size: .62rem; opacity: .55; text-transform: uppercase; letter-spacing: .08em; margin: 0 0 2px; }
        .pl-instructor-name  { font-size: .85rem; font-weight: 700; color: #faf5ee; margin: 0; }

        .pl-join-btn {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          width: 100%; padding: 12px;
          background: rgba(250,245,238,.1); border: 1px solid rgba(250,245,238,.18);
          border-radius: 10px; color: #faf5ee;
          font-family: 'Manrope',sans-serif; font-size: .86rem; font-weight: 700;
          cursor: pointer;
          transition: background .15s, border-color .15s;
        }
        .pl-join-btn:hover { background: #c2652a; border-color: #c2652a; }

        /* ══════════ WEEK GRID ══════════ */
        .pl-week-header {
          display: flex; align-items: center; justify-content: space-between;
          gap: 16px; margin-bottom: 20px; flex-wrap: wrap;
        }
        .pl-week-toggle {
          display: flex; align-items: center;
          background: #f2ece4; border-radius: 8px; padding: 4px;
        }
        .pl-toggle-btn {
          padding: 6px 14px; font-family: 'Manrope',sans-serif;
          font-size: .74rem; font-weight: 800; border: none; background: none;
          border-radius: 6px; cursor: pointer; color: #9a9088;
          transition: all .15s;
        }
        .pl-toggle-btn--active {
          background: #fff; color: #c2652a;
          box-shadow: 0 1px 4px rgba(0,0,0,0.08);
        }

        .pl-week-grid {
          display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px;
        }
        @media (max-width: 900px) { .pl-week-grid { grid-template-columns: repeat(4,1fr); } }
        @media (max-width: 600px) { .pl-week-grid { grid-template-columns: repeat(2,1fr); } }

        .pl-day-col { display: flex; flex-direction: column; gap: 10px; }

        .pl-day-header {
          text-align: center; padding-bottom: 10px;
          border-bottom: 1px solid #d8d0c8;
        }
        .pl-day-label { font-size: .62rem; text-transform: uppercase; letter-spacing: .18em; font-weight: 800; color: #9a9088; margin: 0 0 3px; }
        .pl-day-num   { font-family: 'EB Garamond', serif; font-size: 1.3rem; font-weight: 700; margin: 0; color: #3a302a; }
        .pl-day-num--today { color: #c2652a; }
        .pl-day-header--today .pl-day-label { color: #c2652a; }

        .pl-sessions { display: flex; flex-direction: column; gap: 8px; }

        .pl-session {
          padding: 12px; border-radius: 12px;
          border-left: 4px solid transparent;
          cursor: pointer; transition: box-shadow .15s;
        }
        .pl-session:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        .pl-session-title { font-size: .8rem; font-weight: 700; margin: 0 0 4px; }
        .pl-session-time  { font-size: .68rem; margin: 0 0 6px; }
        .pl-session-meta  { display: flex; align-items: center; gap: 5px; }
        .pl-session-dot   { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
        .pl-session-room  { font-size: .64rem; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; }
        .pl-session-active-badge {
          display: inline-block; margin-top: 6px;
          background: #c2652a; color: #fff;
          font-size: .58rem; font-weight: 800; letter-spacing: .1em; text-transform: uppercase;
          padding: 2px 7px; border-radius: 99px;
        }

        .pl-session-empty {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 32px 12px; border-radius: 12px;
          background: #f6f0e8; border: 1.5px dashed #d8d0c8;
          color: #cec6be; text-align: center;
        }
        .pl-session-empty-icon { opacity: .4; margin-bottom: 6px; }
        .pl-session-empty p { font-size: .72rem; font-weight: 700; margin: 0; }

        /* ══════════ ACADEMIC ══════════ */
        .pl-academic-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 20px;
        }
        @media (max-width: 768px) { .pl-academic-grid { grid-template-columns: 1fr; } }

        /* Presence table */
        .pl-presence-table { display: flex; flex-direction: column; gap: 14px; }
        .pl-presence-header {
          display: grid; grid-template-columns: 1fr 1fr 80px 1fr;
          font-size: .62rem; text-transform: uppercase; font-weight: 800;
          letter-spacing: .1em; color: #9a9088;
          border-bottom: 1px solid #ece6dc; padding-bottom: 8px;
        }
        .pl-presence-row {
          display: grid; grid-template-columns: 1fr 1fr 80px 1fr;
          align-items: center; gap: 10px; font-size: .84rem;
        }
        .pl-presence-name  { font-weight: 600; color: #3a302a; }
        .pl-presence-count { text-align: center; color: #9a9088; font-size: .8rem; }
        .pl-presence-bar-wrap { display: flex; align-items: center; }
        .pl-presence-track { flex: 1; height: 6px; border-radius: 99px; background: #f2ece4; overflow: hidden; }
        .pl-presence-fill  { height: 100%; border-radius: inherit; transition: width .4s ease; }

        /* Bar chart */
        .pl-legend { display: flex; gap: 14px; }
        .pl-legend span { display: flex; align-items: center; gap: 5px; font-size: .68rem; font-weight: 700; color: #605850; }
        .pl-legend-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }

        .pl-chart {
          display: flex; align-items: flex-end; justify-content: space-around;
          height: 150px; gap: 12px; margin-top: 8px;
          padding: 0 8px;
        }
        .pl-chart-col {
          flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px;
        }
        .pl-chart-bars {
          flex: 1; width: 100%; display: flex; align-items: flex-end;
          position: relative; gap: 3px;
        }
        .pl-bar {
          flex: 1; border-radius: 4px 4px 0 0; min-height: 4px;
          transition: height .4s ease;
        }
        .pl-bar--exam { background: #c2652a; opacity: .85; }
        .pl-bar--quiz { background: #8c3c3c; opacity: .5;  }
        .pl-chart-label {
          font-size: .62rem; text-transform: uppercase; letter-spacing: .12em;
          font-weight: 800; color: #9a9088;
        }

        /* ══════════ DOCUMENTS ══════════ */
        .pl-sync-btn {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: .72rem; font-weight: 800; text-transform: uppercase;
          letter-spacing: .1em; color: #c2652a;
          background: none; border: none; cursor: pointer;
          transition: opacity .15s;
        }
        .pl-sync-btn:hover { opacity: .75; }

        .pl-docs-grid {
          display: grid; grid-template-columns: repeat(4,1fr); gap: 12px;
        }
        @media (max-width: 900px) { .pl-docs-grid { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 500px) { .pl-docs-grid { grid-template-columns: 1fr; } }

        .pl-doc-item {
          display: flex; align-items: center; justify-content: space-between;
          padding: 12px; border-radius: 12px;
          background: #f6f0e8; border: 1px solid #ece6dc;
          transition: border-color .15s;
        }
        .pl-doc-item:hover { border-color: #c2652a; }
        .pl-doc-left { display: flex; align-items: center; gap: 10px; min-width: 0; }
        .pl-doc-icon {
          width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
        }
        .pl-doc-name { font-size: .78rem; font-weight: 700; color: #3a302a; margin: 0 0 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 90px; }
        .pl-doc-size { font-size: .65rem; color: #9a9088; margin: 0; }
        .pl-dl-btn {
          color: #9a9088; background: none; border: none; cursor: pointer;
          padding: 4px; border-radius: 6px; transition: color .15s;
          display: flex; align-items: center;
        }
        .pl-dl-btn:hover { color: #c2652a; }

        /* ══════════ CAMPUS BANNER ══════════ */
        .pl-campus-banner {
          display: grid; grid-template-columns: 1fr 1fr;
          border-radius: 18px; overflow: hidden;
          border: 1px solid rgba(0,0,0,0.07);
          box-shadow: 0 2px 10px rgba(0,0,0,0.04);
        }
        @media (max-width: 768px) { .pl-campus-banner { grid-template-columns: 1fr; } }

        .pl-campus-img-wrap {
          position: relative; min-height: 240px; overflow: hidden;
        }
        .pl-campus-img {
          width: 100%; height: 100%; object-fit: cover;
          display: block;
        }
        .pl-campus-overlay {
          position: absolute; inset: 0;
          background: rgba(194,101,42,.12);
          mix-blend-mode: multiply;
        }

        .pl-campus-content {
          background: #fff; padding: 36px;
          display: flex; flex-direction: column; justify-content: center; gap: 14px;
        }
        .pl-campus-title {
          font-family: 'EB Garamond', serif;
          font-size: clamp(1.5rem, 2.5vw, 2rem); font-weight: 700; font-style: italic;
          color: #3a302a; margin: 0;
        }
        .pl-campus-text { font-size: .88rem; color: #605850; line-height: 1.7; margin: 0; }
        .pl-campus-actions { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 4px; }
        .pl-campus-btn {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 10px 18px; border-radius: 10px;
          border: 1.5px solid #d8d0c8;
          background: #fff; color: #3a302a;
          font-family: 'Manrope',sans-serif; font-size: .84rem; font-weight: 700;
          cursor: pointer; transition: all .15s;
        }
        .pl-campus-btn:hover { background: #f2ece4; border-color: #c2652a; color: #c2652a; }
      `}</style>
    </AuthenticatedLayout>
  );
}
