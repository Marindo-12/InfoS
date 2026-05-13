import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useMemo, useState } from 'react';

type CourseOption = {
  id: number;
  title: string;
  category: string;
  status: string;
  studentsCount: number;
};

type SessionRow = {
  id: number;
  courseId: number;
  courseTitle: string;
  title: string;
  instructorName: string;
  room: string;
  groupName?: string | null;
  startsAt: string;
  dateLabel: string;
  timeLabel: string;
  durationMinutes: number;
  status: 'scheduled' | 'cancelled' | 'completed';
  notes?: string | null;
};

type PageProps = {
  auth: { user: { id: number; name: string; email: string } };
  courses: CourseOption[];
  sessions: SessionRow[];
  flash?: { success?: string; warning?: string };
};

const COLORS = ['#c2652a', '#8c3c3c', '#2563eb', '#059669', '#7c3aed', '#b45309', '#0891b2'];
const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const SHORT_DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
const ROOMS = ['Salle A02', 'Salle B04', 'Salle C10', 'Amphi Nord', 'Labo Informatique'];
const DURATIONS = [
  { value: 60, label: '1h' },
  { value: 90, label: '1h30' },
  { value: 120, label: '2h' },
  { value: 150, label: '2h30' },
  { value: 180, label: '3h' },
  { value: 240, label: '4h' },
];

const blankForm = {
  course_id: '',
  title: '',
  instructor_name: '',
  room: '',
  group_name: '',
  starts_at: '',
  duration_minutes: 120,
  status: 'scheduled',
  notes: '',
  recurrence: 'none',
  recurrence_days: [] as number[],
  recurrence_until: '',
};

const getMonday = (date = new Date()) => {
  const d = new Date(date);
  const day = d.getDay() || 7;
  d.setDate(d.getDate() - day + 1);
  d.setHours(0, 0, 0, 0);
  return d;
};

const addDays = (date: Date, days: number) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

const isoDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
const isoDateTime = (date: Date, time: string) => `${isoDate(date)}T${time}`;

const colorFor = (courseId: number, courses: CourseOption[]) => {
  const index = Math.max(0, courses.findIndex((course) => course.id === courseId));
  return COLORS[index % COLORS.length];
};

const rgba = (hex: string, alpha: number) => {
  const value = hex.replace('#', '');
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
};

const parseStartsAt = (session: SessionRow) => new Date(session.startsAt);

const overlaps = (a: SessionRow, b: SessionRow) => {
  const aStart = parseStartsAt(a).getTime();
  const bStart = parseStartsAt(b).getTime();
  const aEnd = aStart + a.durationMinutes * 60_000;
  const bEnd = bStart + b.durationMinutes * 60_000;
  return aStart < bEnd && bStart < aEnd;
};

const sameDay = (date: Date, other: Date) => isoDate(date) === isoDate(other);

const material = (name: string, className = '') => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

function buildConflicts(sessions: SessionRow[]) {
  const conflicts: Array<{ id: string; label: string; sessionIds: number[] }> = [];

  for (let i = 0; i < sessions.length; i++) {
    for (let j = i + 1; j < sessions.length; j++) {
      const a = sessions[i];
      const b = sessions[j];
      if (a.status === 'cancelled' || b.status === 'cancelled') continue;
      if (!sameDay(parseStartsAt(a), parseStartsAt(b)) || !overlaps(a, b)) continue;

      if (a.room.trim().toLowerCase() === b.room.trim().toLowerCase()) {
        conflicts.push({
          id: `room-${a.id}-${b.id}`,
          label: `Salle ${a.room} : ${a.title} / ${b.title}`,
          sessionIds: [a.id, b.id],
        });
      }

      if (a.instructorName.trim().toLowerCase() === b.instructorName.trim().toLowerCase()) {
        conflicts.push({
          id: `teacher-${a.id}-${b.id}`,
          label: `${a.instructorName} est planifie deux fois`,
          sessionIds: [a.id, b.id],
        });
      }
    }
  }

  return conflicts;
}

function sessionSlot(session: SessionRow) {
  const hour = parseStartsAt(session).getHours();
  if (hour < 13) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}

export default function AdminSchedule() {
  const { courses, sessions, flash } = usePage<PageProps>().props;
  const [editing, setEditing] = useState<SessionRow | null>(null);
  const [monday, setMonday] = useState(() => getMonday());
  const [filterCourseId, setFilterCourseId] = useState<number | null>(null);
  const [query, setQuery] = useState('');

  const { data, setData, post, patch, processing, reset, errors } = useForm({ ...blankForm });

  const weekDays = useMemo(
    () => DAYS.map((day, index) => ({ day, short: SHORT_DAYS[index], date: addDays(monday, index), index })),
    [monday],
  );

  const conflicts = useMemo(() => buildConflicts(sessions), [sessions]);
  const conflictIds = useMemo(() => new Set(conflicts.flatMap((conflict) => conflict.sessionIds)), [conflicts]);

  const filteredSessions = useMemo(() => {
    const lower = query.trim().toLowerCase();
    return sessions.filter((session) => {
      const courseOk = !filterCourseId || session.courseId === filterCourseId;
      const textOk = !lower
        || session.title.toLowerCase().includes(lower)
        || session.courseTitle.toLowerCase().includes(lower)
        || session.instructorName.toLowerCase().includes(lower)
        || session.room.toLowerCase().includes(lower);
      return courseOk && textOk;
    });
  }, [sessions, filterCourseId, query]);

  const weekSessions = useMemo(() => {
    const start = monday.getTime();
    const end = addDays(monday, 6).getTime() + 86_399_999;
    return filteredSessions.filter((session) => {
      const time = parseStartsAt(session).getTime();
      return time >= start && time <= end;
    });
  }, [filteredSessions, monday]);

  const stats = useMemo(() => {
    const scheduled = sessions.filter((session) => session.status !== 'cancelled');
    const minutes = scheduled.reduce((sum, session) => sum + session.durationMinutes, 0);
    const rooms = new Set(scheduled.map((session) => session.room.trim()).filter(Boolean));
    const teachers = new Set(scheduled.map((session) => session.instructorName.trim()).filter(Boolean));
    const occupation = Math.min(100, Math.round((scheduled.length / Math.max(1, rooms.size * 12)) * 100));

    return {
      hours: Math.round(minutes / 60),
      occupation,
      teachers: teachers.size,
      rooms: rooms.size,
    };
  }, [sessions]);

  const pendingCourses = useMemo(() => {
    const futureCourseIds = new Set(
      sessions
        .filter((session) => session.status === 'scheduled' && parseStartsAt(session) >= new Date())
        .map((session) => session.courseId),
    );
    return courses.filter((course) => !futureCourseIds.has(course.id)).slice(0, 5);
  }, [courses, sessions]);

  const weekLabel = `${weekDays[0].date.toLocaleDateString('fr-MA', { day: 'numeric', month: 'short' })} - ${weekDays[5].date.toLocaleDateString('fr-MA', { day: 'numeric', month: 'short', year: 'numeric' })}`;

  const clearForm = () => {
    setEditing(null);
    reset();
  };

  const submit: FormEventHandler = (event) => {
    event.preventDefault();
    const options = {
      preserveScroll: true,
      onSuccess: clearForm,
    };

    if (editing) {
      patch(route('admin.schedule.update', editing.id), options);
    } else {
      post(route('admin.schedule.store'), options);
    }
  };

  const editSession = (session: SessionRow) => {
    setEditing(session);
    setData({
      course_id: String(session.courseId),
      title: session.title,
      instructor_name: session.instructorName,
      room: session.room,
      group_name: session.groupName ?? '',
      starts_at: session.startsAt,
      duration_minutes: session.durationMinutes,
      status: session.status,
      notes: session.notes ?? '',
      recurrence: 'none',
      recurrence_days: [],
      recurrence_until: '',
    });
  };

  const addInSlot = (date: Date, time: string) => {
    setEditing(null);
    setData({
      ...blankForm,
      starts_at: isoDateTime(date, time),
      recurrence_days: [date.getDay() === 0 ? 5 : date.getDay() - 1],
    });
  };

  const deleteSession = (session: SessionRow) => {
    if (!window.confirm(`Supprimer la seance "${session.title}" ?`)) return;
    router.delete(route('admin.schedule.destroy', session.id), { preserveScroll: true });
  };

  const toggleRecurrenceDay = (index: number) => {
    const current = data.recurrence_days as number[];
    setData(
      'recurrence_days',
      current.includes(index) ? current.filter((day) => day !== index) : [...current, index],
    );
  };

  const renderSession = (session: SessionRow) => {
    const color = colorFor(session.courseId, courses);
    const isConflict = conflictIds.has(session.id);
    return (
      <article
        key={session.id}
        className={`adp-session ${isConflict ? 'adp-session--conflict' : ''}`}
        style={{
          borderColor: isConflict ? '#8c3c3c' : rgba(color, 0.28),
          background: isConflict ? 'rgba(140,60,60,.10)' : rgba(color, 0.10),
        }}
      >
        <div className="adp-session-head">
          <p>{session.courseTitle}</p>
          {isConflict && material('warning', 'adp-warning')}
        </div>
        <h4>{session.title}</h4>
        <span>{session.timeLabel}</span>
        <span>{session.room}{session.groupName ? ` - ${session.groupName}` : ''}</span>
        <span>{session.instructorName}</span>
        <div className="adp-session-actions">
          <button type="button" onClick={() => editSession(session)}>{material('edit')}Modifier</button>
          <button type="button" onClick={() => deleteSession(session)}>{material('delete')}Supprimer</button>
        </div>
      </article>
    );
  };

  const slotSessions = (date: Date, slot: 'morning' | 'afternoon' | 'evening') =>
    weekSessions.filter((session) => sameDay(parseStartsAt(session), date) && sessionSlot(session) === slot);

  return (
    <AdminLayout header={<span style={{ fontWeight: 700 }}>Planning des formations</span>}>
      <Head title="Planning des formations" />

      <div className="adp-root">
        <section className="adp-hero">
          <div>
            <p className="adp-kicker">Organisation academique</p>
            <h1>Gestion du Planning Academique</h1>
            <p>
              Organisez vos sessions hebdomadaires avec precision. Gereez les salles, les intervenants
              et optimisez le taux d'occupation du centre avec des donnees synchronisees.
            </p>
          </div>
          <div className="adp-search">
            {material('search')}
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher une seance..." />
          </div>
        </section>

        {flash?.success && <div className="adp-flash">{material('check_circle')}{flash.success}</div>}
        {flash?.warning && <div className="adp-flash adp-flash--warn">{material('warning')}{flash.warning}</div>}

        <section className="adp-stats">
          <article>
            <p>Total heures prevues</p>
            <strong>{stats.hours}h</strong>
            <span>/ semaine courante et sessions chargees</span>
            <div><i style={{ width: `${Math.min(100, Math.round((stats.hours / 180) * 100))}%` }} /></div>
          </article>
          <article>
            <p>Occupation des salles</p>
            <strong>{stats.occupation}%</strong>
            <span>{stats.rooms} salle{stats.rooms > 1 ? 's' : ''} utilisee{stats.rooms > 1 ? 's' : ''}</span>
            <div><i style={{ width: `${stats.occupation}%` }} /></div>
          </article>
          <article>
            <p>Intervenants actifs</p>
            <strong>{stats.teachers}</strong>
            <span>formateur{stats.teachers > 1 ? 's' : ''} planifie{stats.teachers > 1 ? 's' : ''}</span>
            <div className="adp-avatars"><b /><b /><b /><em>+{Math.max(0, stats.teachers - 3)}</em></div>
          </article>
          <article className="adp-stat-danger">
            <p>Conflits detectes</p>
            <strong>{conflicts.length.toString().padStart(2, '0')}</strong>
            {material('warning')}
            <span>{conflicts[0]?.label ?? 'Aucun conflit de salle ou intervenant.'}</span>
          </article>
        </section>

        <div className="adp-content">
          <main className="adp-board">
            <div className="adp-toolbar">
              <div>
                <button type="button" onClick={() => setMonday(addDays(monday, -7))}>{material('chevron_left')}</button>
                <strong>{weekLabel}</strong>
                <button type="button" onClick={() => setMonday(addDays(monday, 7))}>{material('chevron_right')}</button>
              </div>
              <select value={filterCourseId ?? ''} onChange={(event) => setFilterCourseId(event.target.value ? Number(event.target.value) : null)}>
                <option value="">Toutes les formations ({sessions.length})</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>{course.title}</option>
                ))}
              </select>
            </div>

            <div className="adp-grid">
              <div className="adp-grid-head adp-time-head">Horaire</div>
              {weekDays.map(({ day, date }) => (
                <div key={day} className="adp-grid-head">
                  <strong>{day}</strong>
                  <span>{date.toLocaleDateString('fr-MA', { day: 'numeric', month: 'short' })}</span>
                </div>
              ))}

              {[
                ['09:00', '13:00', 'morning'],
                ['14:00', '18:30', 'afternoon'],
                ['18:30', '21:00', 'evening'],
              ].map(([from, to, slot]) => (
                <div className="adp-row" key={slot}>
                  <div className="adp-time">
                    <strong>{from}</strong>
                    <span>{to}</span>
                  </div>
                  {weekDays.map(({ date, day }) => {
                    const items = slotSessions(date, slot as 'morning' | 'afternoon' | 'evening');
                    return (
                      <div key={`${slot}-${day}`} className="adp-cell">
                        {items.length > 0 ? items.map(renderSession) : (
                          <button type="button" className="adp-add-slot" onClick={() => addInSlot(date, from)}>
                            {material('add_circle')}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </main>

          <aside className="adp-side">
            <section className="adp-form-card">
              <div className="adp-form-title">
                {material('event_note')}
                <h2>{editing ? 'Modifier la session' : 'Nouvelle Session'}</h2>
              </div>
              <form onSubmit={submit} className="adp-form">
                <label>
                  <span>Cours</span>
                  <select value={data.course_id} onChange={(event) => setData('course_id', event.target.value)}>
                    <option value="">Choisir une formation</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>{course.title} ({course.studentsCount})</option>
                    ))}
                  </select>
                  {errors.course_id && <small>{errors.course_id}</small>}
                </label>

                <label>
                  <span>Titre de la seance</span>
                  <input value={data.title} onChange={(event) => setData('title', event.target.value)} placeholder="Ex: Business English" />
                  {errors.title && <small>{errors.title}</small>}
                </label>

                <label>
                  <span>Salle de classe</span>
                  <input list="adp-rooms" value={data.room} onChange={(event) => setData('room', event.target.value)} placeholder="Salle A02" />
                  <datalist id="adp-rooms">{ROOMS.map((room) => <option key={room} value={room} />)}</datalist>
                  {errors.room && <small>{errors.room}</small>}
                </label>

                <label>
                  <span>Intervenant</span>
                  <input value={data.instructor_name} onChange={(event) => setData('instructor_name', event.target.value)} placeholder="Nom du professeur" />
                  {errors.instructor_name && <small>{errors.instructor_name}</small>}
                </label>

                <div className="adp-form-two">
                  <label>
                    <span>Date et heure</span>
                    <input type="datetime-local" value={data.starts_at} onChange={(event) => setData('starts_at', event.target.value)} />
                    {errors.starts_at && <small>{errors.starts_at}</small>}
                  </label>
                  <label>
                    <span>Duree</span>
                    <select value={data.duration_minutes} onChange={(event) => setData('duration_minutes', Number(event.target.value))}>
                      {DURATIONS.map((duration) => <option key={duration.value} value={duration.value}>{duration.label}</option>)}
                    </select>
                  </label>
                </div>

                <div className="adp-form-two">
                  <label>
                    <span>Groupe</span>
                    <input value={data.group_name} onChange={(event) => setData('group_name', event.target.value)} placeholder="Groupe A" />
                  </label>
                  <label>
                    <span>Statut</span>
                    <select value={data.status} onChange={(event) => setData('status', event.target.value)}>
                      <option value="scheduled">Programmee</option>
                      <option value="completed">Terminee</option>
                      <option value="cancelled">Annulee</option>
                    </select>
                  </label>
                </div>

                {!editing && (
                  <div className="adp-repeat">
                    <div className="adp-switch-row">
                      <span>Session recurrente</span>
                      <button type="button" className={data.recurrence === 'weekly' ? 'on' : ''} onClick={() => setData('recurrence', data.recurrence === 'weekly' ? 'none' : 'weekly')}>
                        <i />
                      </button>
                    </div>
                    {data.recurrence === 'weekly' && (
                      <>
                        <div className="adp-days">
                          {SHORT_DAYS.map((day, index) => (
                            <button key={day} type="button" className={(data.recurrence_days as number[]).includes(index) ? 'on' : ''} onClick={() => toggleRecurrenceDay(index)}>
                              {day}
                            </button>
                          ))}
                        </div>
                        <label>
                          <span>Repetition jusqu'au</span>
                          <input type="date" value={data.recurrence_until} onChange={(event) => setData('recurrence_until', event.target.value)} />
                        </label>
                      </>
                    )}
                  </div>
                )}

                <label>
                  <span>Notes</span>
                  <textarea value={data.notes} onChange={(event) => setData('notes', event.target.value)} placeholder="Consignes, materiel, objectifs..." />
                </label>

                <div className="adp-actions">
                  {editing && <button type="button" className="adp-secondary" onClick={clearForm}>Annuler</button>}
                  <button type="submit" disabled={processing}>
                    {processing ? 'Enregistrement...' : editing ? 'Mettre a jour' : 'Valider la session'}
                    {material('arrow_forward')}
                  </button>
                </div>
              </form>
            </section>

            <section className="adp-pending">
              <h3>Sessions en attente</h3>
              {pendingCourses.length > 0 ? pendingCourses.map((course) => (
                <button
                  type="button"
                  key={course.id}
                  onClick={() => setData({ ...blankForm, course_id: String(course.id), title: course.title })}
                >
                  {material('drag_indicator')}
                  <span>
                    <strong>{course.title}</strong>
                    <small>{course.studentsCount} etudiant{course.studentsCount > 1 ? 's' : ''} actif{course.studentsCount > 1 ? 's' : ''}</small>
                  </span>
                </button>
              )) : (
                <p>Toutes les formations ont une prochaine session.</p>
              )}
            </section>

            {conflicts.length > 0 && (
              <section className="adp-conflicts">
                <h3>Conflits a traiter</h3>
                {conflicts.slice(0, 4).map((conflict) => <p key={conflict.id}>{material('warning')}{conflict.label}</p>)}
              </section>
            )}
          </aside>
        </div>
        <section className="adp-panels mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
<div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl">
<img alt="Modern Educational Environment" className="w-full h-full object-cover" data-alt="A wide, sun-drenched modern library or study lounge with high ceilings and warm wooden paneling. The architecture features clean, minimal lines and floor-to-ceiling windows letting in soft, golden hour light. The furniture consists of elegant mid-century modern chairs and large community tables, perfectly embodying the warm minimalist Sahara aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4xb1tQwr-CBBsBzAzjoyIrc4YFUs6YvDN2bSUgMIDNpwSWAMFljYdAxDTE22snPW5oFVFA6FDE3DO3YvQmv_Hq-33qrjXhWalLRCdzZjc1kru6OLTf5T5TgIvBfc18tx8IyseVy1Fg7L0qJwdJ9_gxgHeP08T00hQkB7ExDPTWRifNHBQ828LGXMJFqg6--ULFO3UyPjZf7MGMQyQRmvJzgEd2JzC9_8lehp2sSSPDq0K1EVxzccJmMyGrieNsY2sJQ-XOFEDbmJX"/>
<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-10">
<h4 className="text-white text-3xl font-headline font-bold mb-2 italic">Excellence Académique</h4>
<p className="text-white/80 font-body max-w-sm">Un environnement conçu pour inspirer l'apprentissage et la transmission du savoir.</p>
</div>
</div>
<div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl">
<img alt="Elegant Stationery and Tools" className="w-full h-full object-cover" data-alt="An artistic close-up of a premium leather planner, a brass fountain pen, and a cup of specialty coffee on a textured linen tablecloth. The color palette is dominated by burnt sienna, warm creams, and deep wood tones. The focus is soft, highlighting the craftsmanship of the tools and the peaceful, focused atmosphere of professional planning." src="https://lh3.googleusercontent.com/aida-public/AB6AXuClkLMZObY9m801bgHVRkfDNpbhnpoXEH9uaiicUQlgZPes4_M4Nn2PZUxaYm-KArig8QQLrcfLQ2a5auY1SjvmQXppPrOWVDVDD-OBlYtFnZf6HGFpw6_JD64NtsCwQ4EFny4f-bHSacK34rHXwxPi3QH5Fh2HEMI2-yP51MwNBY-2ZuNgZhiQ6z-JIb7ewyAFqPThkQ4l5kd08zLAHdTUcsf_vGOte-ruuEnC_Bt6weZe9HMO7oCfN60lK5hEo0JWUfM58ftTCrjl"/>
<div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent flex flex-col justify-end p-10">
<h4 className="text-white text-3xl font-headline font-bold mb-2 italic">Rigueur Logistique</h4>
<p className="text-white/80 font-body max-w-sm">Chaque détail du planning contribue à la fluidité de l'expérience étudiante.</p>
</div>
</div>
</section>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,700;1,400&family=Manrope:wght@400;500;600;700;800&display=swap');
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .adp-root { min-height: 100vh; background: #faf5ee; color: #3a302a; font-family: Manrope, sans-serif; padding: 36px; }
        .adp-root h1,.adp-root h2,.adp-root h3 { font-family: "EB Garamond", serif; }
        .adp-hero { display:flex; justify-content:space-between; gap:24px; align-items:flex-start; margin-bottom:28px; }
        .adp-kicker { margin:0 0 8px; color:#c2652a; font-size:.72rem; font-weight:900; text-transform:uppercase; letter-spacing:.18em; }
        .adp-hero h1 { margin:0 0 10px; font-size:clamp(2.4rem,4vw,4.3rem); line-height:1; font-style:italic; color:#3a302a; }
        .adp-hero p { margin:0; max-width:720px; color:#605850; font-size:1rem; line-height:1.7; }
        .adp-search { position:relative; min-width:280px; }
        .adp-search span { position:absolute; left:14px; top:50%; transform:translateY(-50%); color:#605850; }
        .adp-search input { width:100%; border:1px solid #d8d0c8; background:#fff; border-radius:8px; padding:12px 14px 12px 44px; outline:none; }
        .adp-flash { display:flex; align-items:center; gap:8px; margin-bottom:18px; border:1px solid #bbf7d0; background:#f0fdf4; color:#166534; border-radius:10px; padding:12px 16px; font-weight:800; }
        .adp-flash--warn { border-color:#fed7aa; background:#fff7ed; color:#9a3412; }
        .adp-stats { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:18px; margin-bottom:30px; }
        .adp-stats article { min-height:154px; background:#f6f0e8; border:1px solid rgba(216,208,200,.85); border-radius:12px; padding:24px; box-shadow:0 1px 5px rgba(58,48,42,.05); }
        .adp-stats p { margin:0 0 8px; color:#605850; text-transform:uppercase; letter-spacing:.12em; font-size:.72rem; font-weight:900; }
        .adp-stats strong { display:block; font-family:"EB Garamond"; color:#c2652a; font-size:3rem; line-height:.95; }
        .adp-stats span { color:#78706a; font-size:.78rem; }
        .adp-stats article > div:not(.adp-avatars) { height:7px; margin-top:20px; background:#ece6dc; border-radius:999px; overflow:hidden; }
        .adp-stats i { display:block; height:100%; background:#c2652a; border-radius:999px; }
        .adp-avatars { display:flex; margin-top:18px; }
        .adp-avatars b,.adp-avatars em { width:32px; height:32px; border-radius:999px; border:2px solid #f6f0e8; margin-left:-6px; background:#e08850; }
        .adp-avatars b:first-child { margin-left:0; background:#f0a878; }
        .adp-avatars b:nth-child(2) { background:#e08850; }
        .adp-avatars b:nth-child(3) { background:#c2652a; }
        .adp-avatars em { display:flex; align-items:center; justify-content:center; color:white; font-size:.68rem; font-style:normal; font-weight:900; background:#3a302a; }
        .adp-stat-danger { background:rgba(140,60,60,.06)!important; border-color:rgba(140,60,60,.25)!important; position:relative; }
        .adp-stat-danger strong,.adp-stat-danger > span.material-symbols-outlined { color:#8c3c3c; }
        .adp-stat-danger > span.material-symbols-outlined { position:absolute; top:54px; right:24px; }
        .adp-content { display:grid; grid-template-columns:minmax(0,1fr) 390px; gap:24px; align-items:start; }
        .adp-board { min-width:0; overflow-x:auto; }
        .adp-panels { margin-top:4rem; }
        .adp-toolbar { display:flex; justify-content:space-between; gap:12px; align-items:center; margin-bottom:14px; }
        .adp-toolbar div { display:flex; gap:10px; align-items:center; }
        .adp-toolbar button,.adp-toolbar select { border:1px solid #d8d0c8; background:#fff; color:#3a302a; border-radius:8px; min-height:38px; padding:0 12px; font-weight:800; }
        .adp-toolbar button { width:38px; display:flex; align-items:center; justify-content:center; cursor:pointer; }
        .adp-grid { background:#fff; border:1px solid #d8d0c8; border-radius:16px; overflow:hidden; box-shadow:0 2px 14px rgba(58,48,42,.06); min-width:960px; overflow-x:auto; }
        .adp-grid-head { min-height:64px; display:flex; flex-direction:column; justify-content:center; align-items:center; border-right:1px solid #d8d0c8; border-bottom:1px solid #d8d0c8; font-family:"EB Garamond"; font-size:1.35rem; font-weight:800; }
        .adp-grid-head span { font-family:Manrope; font-size:.68rem; color:#9a9088; text-transform:uppercase; letter-spacing:.12em; }
        .adp-time-head { font-family:Manrope; font-size:.72rem; text-transform:uppercase; letter-spacing:.14em; color:#605850; background:#f2ece4; }
        .adp-grid { display:grid; grid-template-columns:110px repeat(6,minmax(130px,1fr)); }
        .adp-row { display:contents; }
        .adp-time { min-height:184px; padding:18px; background:rgba(242,236,228,.45); border-right:1px solid #d8d0c8; border-bottom:1px solid #d8d0c8; display:flex; flex-direction:column; justify-content:center; align-items:center; color:#605850; font-style:italic; }
        .adp-time strong { font-family:"EB Garamond"; font-size:1.3rem; }
        .adp-time span { font-size:.72rem; }
        .adp-cell { min-height:184px; padding:10px; border-right:1px solid #d8d0c8; border-bottom:1px solid #d8d0c8; display:flex; flex-direction:column; gap:8px; }
        .adp-add-slot { flex:1; min-height:70px; border:1px dashed transparent; border-radius:8px; background:transparent; color:#d8d0c8; cursor:pointer; transition:.2s; }
        .adp-add-slot:hover { background:rgba(194,101,42,.05); border-color:rgba(194,101,42,.22); color:#c2652a; }
        .adp-add-slot span { font-size:2rem; }
        .adp-session { position:relative; border:1px solid; border-radius:8px; padding:12px; min-height:140px; display:flex; flex-direction:column; gap:5px; }
        .adp-session-head { display:flex; justify-content:space-between; gap:8px; }
        .adp-session-head p { margin:0; color:#c2652a; font-size:.66rem; font-weight:900; text-transform:uppercase; letter-spacing:.08em; }
        .adp-session h4 { margin:0; font-size:.88rem; line-height:1.25; color:#3a302a; }
        .adp-session span:not(.material-symbols-outlined) { color:#605850; font-size:.72rem; }
        .adp-session--conflict .adp-session-head p,.adp-warning { color:#8c3c3c!important; }
        .adp-session-actions { margin-top:auto; display:flex; gap:6px; flex-wrap:wrap; }
        .adp-session-actions button { display:inline-flex; align-items:center; gap:4px; border:0; border-radius:6px; padding:5px 7px; font-size:.68rem; font-weight:900; color:#605850; background:rgba(255,255,255,.75); cursor:pointer; }
        .adp-side { display:flex; flex-direction:column; gap:20px; }
        .adp-form-card,.adp-pending,.adp-conflicts { border:1px solid rgba(216,208,200,.8); background:#fff; border-radius:16px; padding:24px; box-shadow:0 10px 28px rgba(194,101,42,.06); }
        .adp-form-card { background:#f6f0e8; border-color:rgba(194,101,42,.24); position:sticky; top:16px; }
        .adp-form-title { display:flex; gap:10px; align-items:center; margin-bottom:18px; }
        .adp-form-title span { color:#c2652a; }
        .adp-form-title h2 { margin:0; font-size:1.8rem; }
        .adp-form { display:flex; flex-direction:column; gap:14px; }
        .adp-form label { display:flex; flex-direction:column; gap:7px; }
        .adp-form label span,.adp-repeat > span { color:#605850; font-size:.68rem; font-weight:900; text-transform:uppercase; letter-spacing:.12em; }
        .adp-form input,.adp-form select,.adp-form textarea { width:100%; border:1px solid #d8d0c8; background:#fff; border-radius:8px; padding:11px 12px; color:#3a302a; outline:none; }
        .adp-form textarea { min-height:80px; resize:vertical; }
        .adp-form small { color:#c0392b; font-weight:800; }
        .adp-form-two { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        .adp-switch-row { display:flex; justify-content:space-between; align-items:center; padding:8px 0; }
        .adp-switch-row > span { font-size:.9rem; color:#605850; }
        .adp-switch-row button { width:46px; height:26px; border:0; border-radius:999px; background:#d8d0c8; padding:3px; cursor:pointer; }
        .adp-switch-row button i { display:block; width:20px; height:20px; border-radius:999px; background:white; transition:.2s; }
        .adp-switch-row button.on { background:#c2652a; }
        .adp-switch-row button.on i { transform:translateX(20px); }
        .adp-days { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:10px; }
        .adp-days button { width:38px; height:34px; border:1px solid #d8d0c8; border-radius:999px; background:#fff; color:#605850; font-weight:900; cursor:pointer; }
        .adp-days button.on { background:#c2652a; color:white; border-color:#c2652a; }
        .adp-actions { display:flex; gap:10px; }
        .adp-actions button { flex:1; border:0; border-radius:8px; min-height:48px; background:#c2652a; color:white; font-weight:900; display:flex; align-items:center; justify-content:center; gap:8px; cursor:pointer; }
        .adp-actions button:disabled { opacity:.55; cursor:wait; }
        .adp-actions .adp-secondary { background:#eae2da; color:#605850; }
        .adp-pending h3,.adp-conflicts h3 { margin:0 0 16px; font-size:1.45rem; }
        .adp-pending button { width:100%; border:1px solid rgba(216,208,200,.8); background:#fff; border-radius:12px; padding:12px; display:flex; gap:12px; text-align:left; align-items:center; cursor:pointer; margin-bottom:10px; }
        .adp-pending button > span.material-symbols-outlined { width:38px; height:38px; display:flex; align-items:center; justify-content:center; background:#ece6dc; border-radius:8px; color:#605850; }
        .adp-pending strong { display:block; color:#3a302a; font-size:.85rem; }
        .adp-pending small,.adp-pending p { color:#78706a; font-size:.72rem; text-transform:uppercase; letter-spacing:.08em; font-weight:800; }
        .adp-conflicts p { display:flex; gap:8px; color:#8c3c3c; font-size:.82rem; font-weight:800; line-height:1.45; }
        .dark .adp-root { background:#111010; color:#efe8dd; }
        .dark .adp-root h1, .dark .adp-root h2, .dark .adp-root h3, .dark .adp-root strong, .dark .adp-root span, .dark .adp-root p, .dark .adp-root label, .dark .adp-root option { color:#efe8dd; }
        .dark .adp-hero p { color:#d1c2b4; }
        .dark .adp-search input { background:#1c1612; border-color:#3c3230; color:#efe8dd; }
        .dark .adp-search span { color:#d1c2b4; }
        .dark .adp-toolbar button, .dark .adp-toolbar select { border-color:#3c3230; background:#1c1612; color:#efe8dd; }
        .dark .adp-grid { background:#1b1613; border-color:#3c3230; box-shadow:0 2px 14px rgba(0,0,0,.35); }
        .dark .adp-grid-head { border-color:#3c3230; background:#1c1612; color:#efe8dd; }
        .dark .adp-time { background:rgba(240,168,120,.08); color:#efe8dd; border-color:#3c3230; }
        .dark .adp-cell { border-color:#3c3230; }
        .dark .adp-add-slot { background:transparent; border-color:rgba(240,168,120,.18); color:#f0a878; }
        .dark .adp-add-slot:hover { background:rgba(240,168,120,.1); }
        .dark .adp-session { background:#221b16; color:#efe8dd; }
        .dark .adp-session h4 { color:#f8efe5; }
        .dark .adp-session span:not(.material-symbols-outlined) { color:#d1c2b4; }
        .dark .adp-form-card, .dark .adp-pending, .dark .adp-conflicts { background:#1b1613; border-color:rgba(240,232,222,.12); box-shadow:0 10px 28px rgba(0,0,0,.35); }
        .dark .adp-form input, .dark .adp-form select, .dark .adp-form textarea { background:#1c1612; border-color:#3c3230; color:#efe8dd; }
        .dark .adp-form textarea { background:#1d1613; }
        .dark .adp-form-title span, .dark .adp-pending small, .dark .adp-pending p, .dark .adp-conflicts p, .dark .adp-form label span { color:#d1c2b4; }
        .dark .adp-form-title h2, .dark .adp-pending h3, .dark .adp-conflicts h3 { color:#f8efe5; }
        .dark .adp-actions button { background:#d47c45; }
        .dark .adp-actions .adp-secondary { background:#2b241f; color:#efe8dd; }
        .dark .adp-flash { background:#1f1913; border-color:#3e342e; color:#ede8dd; }
        .dark .adp-flash--warn { background:#2b1d14; border-color:#7c3c28; color:#f3c5a1; }
        @media (max-width:1200px) { .adp-content { grid-template-columns:1fr; } .adp-form-card { position:static; } }
        @media (max-width:900px) { .adp-root { padding:20px; } .adp-hero,.adp-toolbar { flex-direction:column; align-items:stretch; } .adp-stats { grid-template-columns:1fr 1fr; } .adp-grid { overflow-x:auto; display:block; } .adp-grid-head,.adp-time,.adp-cell { min-width:150px; } }
        @media (max-width:620px) { .adp-stats,.adp-form-two { grid-template-columns:1fr; } }
      `}</style>
    </AdminLayout>
  );
}
