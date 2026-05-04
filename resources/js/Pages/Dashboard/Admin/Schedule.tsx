import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState, useMemo } from 'react';

/* ═══════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════ */

type CourseOption = {
  id: number;
  title: string;
  category: string;
  status: string;
  studentsCount: number;
  startDate?: string | null;
  endDate?: string | null;
  color?: string | null;
};

type SessionRow = {
  id: number;
  courseId: number;
  courseTitle: string;
  courseColor?: string | null;
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
  flash?: { success?: string };
};

/* ═══════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════ */

const DAYS_FR = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

const COURSE_COLORS = [
  '#c2652a', '#2563eb', '#059669', '#7c3aed', '#db2777', '#0891b2', '#b45309',
];

const DURATION_OPTIONS = [
  { value: 60,  label: '1h'    },
  { value: 90,  label: '1h30'  },
  { value: 120, label: '2h'    },
  { value: 150, label: '2h30'  },
  { value: 180, label: '3h'    },
];

const STATUS_META: Record<string, { label: string; bg: string; text: string }> = {
  scheduled: { label: 'Programmée',  bg: '#eff6ff', text: '#2563eb' },
  cancelled: { label: 'Annulée',     bg: '#fee2e2', text: '#dc2626' },
  completed: { label: 'Terminée',    bg: '#ecfdf5', text: '#059669' },
};

const blankForm = {
  course_id:        '',
  title:            '',
  instructor_name:  '',
  room:             '',
  group_name:       '',
  starts_at:        '',
  duration_minutes: 90,
  status:           'scheduled',
  notes:            '',
  /* Recurrence */
  recurrence:       'none',   // none | weekly
  recurrence_days:  [] as number[],  // 0=Mon…5=Sat
  recurrence_until: '',
};

/* ═══════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════ */

const getMondayOfWeek = (d = new Date()) => {
  const day = d.getDay() || 7;
  const mon = new Date(d);
  mon.setDate(d.getDate() - day + 1);
  mon.setHours(0, 0, 0, 0);
  return mon;
};

const addDays = (d: Date, n: number) => {
  const r = new Date(d); r.setDate(r.getDate() + n); return r;
};

const fmt = (d: Date) =>
  d.toLocaleDateString('fr-MA', { day: 'numeric', month: 'short' });

const isoDate = (d: Date) => d.toISOString().slice(0, 10);

const hex2rgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
};

/* ═══════════════════════════════════════════════════
   ICONS
═══════════════════════════════════════════════════ */

const Ic = {
  plus:    () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  edit:    () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  trash:   () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>,
  close:   () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  chevL:   () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  chevR:   () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  cal:     () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  repeat:  () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>,
  user:    () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  door:    () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  clock:   () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  check:   () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7"/></svg>,
};

/* ═══════════════════════════════════════════════════
   FORM PANEL
═══════════════════════════════════════════════════ */

interface FormPanelProps {
  courses: CourseOption[];
  editing: SessionRow | null;
  onClear: () => void;
  data: typeof blankForm;
  setData: (key: string, value: any) => void;
  errors: Record<string, string>;
  processing: boolean;
  onSubmit: FormEventHandler;
}

function FormPanel({ courses, editing, onClear, data, setData, errors, processing, onSubmit }: FormPanelProps) {
  const selectedCourse = courses.find(c => String(c.id) === data.course_id);

  const toggleDay = (day: number) => {
    const days = data.recurrence_days.includes(day)
      ? data.recurrence_days.filter(d => d !== day)
      : [...data.recurrence_days, day];
    setData('recurrence_days', days);
  };

  return (
    <form className="sched-form" onSubmit={onSubmit}>
      {/* Header */}
      <div className="sched-form-header">
        <div>
          <p className="sched-kicker">{editing ? 'Modification' : 'Nouvelle séance'}</p>
          <h2 className="sched-form-title">
            {editing ? `Modifier : ${editing.title}` : 'Planifier une séance'}
          </h2>
        </div>
        {editing && (
          <button type="button" className="sched-cancel-btn" onClick={onClear}>
            <Ic.close /> Annuler
          </button>
        )}
      </div>

      <div className="sched-form-body">

        {/* Formation */}
        <div className="sched-field sched-field--full">
          <label className="sched-label">
            Formation concernée <span className="sched-required">*</span>
          </label>
          <select
            className={`sched-input ${errors.course_id ? 'sched-input--err' : ''}`}
            value={data.course_id}
            onChange={e => setData('course_id', e.target.value)}
            required
          >
            <option value="">— Choisir une formation —</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>
                {c.title}  ·  {c.studentsCount} étudiant{c.studentsCount > 1 ? 's' : ''}
              </option>
            ))}
          </select>
          {selectedCourse && (
            <div className="sched-course-pill" style={{
              background: hex2rgba(selectedCourse.color ?? '#c2652a', 0.10),
              borderColor: hex2rgba(selectedCourse.color ?? '#c2652a', 0.25),
              color: selectedCourse.color ?? '#c2652a',
            }}>
              <span className="sched-course-pill-dot"
                style={{ background: selectedCourse.color ?? '#c2652a' }} />
              {selectedCourse.startDate && selectedCourse.endDate
                ? `${selectedCourse.startDate} → ${selectedCourse.endDate}`
                : 'Dates non définies'}
              · {selectedCourse.studentsCount} étudiant{selectedCourse.studentsCount > 1 ? 's' : ''}
            </div>
          )}
          {errors.course_id && <p className="sched-err">{errors.course_id}</p>}
        </div>

        {/* Titre */}
        <div className="sched-field sched-field--full">
          <label className="sched-label">
            Titre de la séance <span className="sched-required">*</span>
          </label>
          <input
            className={`sched-input ${errors.title ? 'sched-input--err' : ''}`}
            value={data.title}
            onChange={e => setData('title', e.target.value)}
            placeholder="Ex : Excel Avancé — Tableaux croisés"
            required
          />
          {errors.title && <p className="sched-err">{errors.title}</p>}
        </div>

        {/* Professeur + Salle */}
        <div className="sched-field">
          <label className="sched-label">
            <Ic.user /> Formateur <span className="sched-required">*</span>
          </label>
          <input
            className={`sched-input ${errors.instructor_name ? 'sched-input--err' : ''}`}
            value={data.instructor_name}
            onChange={e => setData('instructor_name', e.target.value)}
            placeholder="M. Rachid Alami"
            required
          />
          {errors.instructor_name && <p className="sched-err">{errors.instructor_name}</p>}
        </div>

        <div className="sched-field">
          <label className="sched-label">
            <Ic.door /> Salle <span className="sched-required">*</span>
          </label>
          <input
            className={`sched-input ${errors.room ? 'sched-input--err' : ''}`}
            value={data.room}
            onChange={e => setData('room', e.target.value)}
            placeholder="Salle 204"
            required
          />
          {errors.room && <p className="sched-err">{errors.room}</p>}
        </div>

        {/* Date + Durée */}
        <div className="sched-field">
          <label className="sched-label">
            <Ic.cal /> Date et heure de début <span className="sched-required">*</span>
          </label>
          <input
            type="datetime-local"
            className={`sched-input ${errors.starts_at ? 'sched-input--err' : ''}`}
            value={data.starts_at}
            onChange={e => setData('starts_at', e.target.value)}
            required
          />
          {errors.starts_at && <p className="sched-err">{errors.starts_at}</p>}
        </div>

        <div className="sched-field">
          <label className="sched-label">
            <Ic.clock /> Durée
          </label>
          <select
            className="sched-input"
            value={data.duration_minutes}
            onChange={e => setData('duration_minutes', Number(e.target.value))}
          >
            {DURATION_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Récurrence */}
        <div className="sched-field sched-field--full">
          <label className="sched-label">
            <Ic.repeat /> Récurrence hebdomadaire
          </label>
          <div className="sched-recurrence-wrap">
            <select
              className="sched-input sched-input--inline"
              value={data.recurrence}
              onChange={e => setData('recurrence', e.target.value)}
            >
              <option value="none">Séance unique</option>
              <option value="weekly">Chaque semaine</option>
            </select>

            {data.recurrence === 'weekly' && (
              <>
                <div className="sched-days-picker">
                  {DAYS_FR.map((d, i) => (
                    <button
                      key={i}
                      type="button"
                      className={`sched-day-btn ${data.recurrence_days.includes(i) ? 'sched-day-btn--on' : ''}`}
                      onClick={() => toggleDay(i)}
                    >
                      {d}
                    </button>
                  ))}
                </div>
                <div className="sched-until-wrap">
                  <span className="sched-label">Jusqu'au</span>
                  <input
                    type="date"
                    className="sched-input sched-input--inline"
                    value={data.recurrence_until}
                    onChange={e => setData('recurrence_until', e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
          <p className="sched-hint">
            La récurrence crée automatiquement une séance identique chaque semaine aux jours sélectionnés,
            sur toute la durée de la formation.
          </p>
        </div>

        {/* Groupe + Statut */}
        <div className="sched-field">
          <label className="sched-label">Groupe (optionnel)</label>
          <input
            className="sched-input"
            value={data.group_name}
            onChange={e => setData('group_name', e.target.value)}
            placeholder="Groupe A"
          />
        </div>

        <div className="sched-field">
          <label className="sched-label">Statut</label>
          <select
            className="sched-input"
            value={data.status}
            onChange={e => setData('status', e.target.value)}
          >
            <option value="scheduled">Programmée</option>
            <option value="completed">Terminée</option>
            <option value="cancelled">Annulée</option>
          </select>
        </div>

        {/* Notes */}
        <div className="sched-field sched-field--full">
          <label className="sched-label">Notes / Consignes</label>
          <textarea
            className="sched-input sched-textarea"
            value={data.notes}
            onChange={e => setData('notes', e.target.value)}
            placeholder="Matériel requis, objectifs pédagogiques, consignes particulières..."
          />
        </div>

        {/* Submit */}
        <div className="sched-field sched-field--full">
          <button type="submit" disabled={processing} className="sched-submit">
            {processing ? (
              <><svg className="sched-spinner" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"
                  strokeDasharray="31.4" strokeDashoffset="10" strokeLinecap="round"/>
              </svg> Enregistrement...</>
            ) : editing ? (
              <><Ic.check /> Mettre à jour la séance</>
            ) : (
              <><Ic.plus /> Ajouter au planning</>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

/* ═══════════════════════════════════════════════════
   WEEK VIEW
═══════════════════════════════════════════════════ */

interface WeekViewProps {
  sessions: SessionRow[];
  courses: CourseOption[];
  monday: Date;
  onEdit: (s: SessionRow) => void;
  onDelete: (s: SessionRow) => void;
}

function WeekView({ sessions, courses, monday, onEdit, onDelete }: WeekViewProps) {
  const courseColorMap = useMemo(() => {
    const m: Record<number, string> = {};
    courses.forEach((c, i) => {
      m[c.id] = c.color ?? COURSE_COLORS[i % COURSE_COLORS.length];
    });
    return m;
  }, [courses]);

  const weekDays = DAYS_FR.map((label, i) => ({
    label,
    date: addDays(monday, i),
    sessions: sessions.filter(s => {
      const d = new Date(s.startsAt);
      const dayDate = addDays(monday, i);
      return isoDate(d) === isoDate(dayDate);
    }),
  }));

  const today = isoDate(new Date());

  return (
    <div className="sched-week-grid">
      {weekDays.map(({ label, date, sessions: daySessions }) => {
        const isToday = isoDate(date) === today;
        return (
          <div key={label} className="sched-day-col">
            {/* Day header */}
            <div className={`sched-day-header ${isToday ? 'sched-day-header--today' : ''}`}>
              <span className="sched-day-label">{label}</span>
              <span className={`sched-day-num ${isToday ? 'sched-day-num--today' : ''}`}>
                {date.getDate()}
              </span>
              {isToday && <span className="sched-today-dot" />}
            </div>

            {/* Sessions in this day */}
            <div className="sched-day-sessions">
              {daySessions.length === 0 ? (
                <div className="sched-day-empty">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity=".3">
                    <rect x="3" y="4" width="18" height="18" rx="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </div>
              ) : (
                daySessions.map(s => {
                  const color = s.courseColor ?? courseColorMap[s.courseId] ?? '#c2652a';
                  const sm = STATUS_META[s.status];
                  return (
                    <div key={s.id} className="sched-session-card"
                      style={{
                        borderLeftColor: color,
                        background: hex2rgba(color, 0.05),
                      }}>
                      <div className="sched-session-top">
                        <span className="sched-session-time">
                          <Ic.clock /> {s.timeLabel}
                          <span className="sched-session-dur">· {s.durationMinutes}min</span>
                        </span>
                        <span className="sched-session-status"
                          style={{ background: sm.bg, color: sm.text }}>
                          {sm.label}
                        </span>
                      </div>

                      <p className="sched-session-title">{s.title}</p>
                      <p className="sched-session-course" style={{ color }}>
                        {s.courseTitle}
                      </p>

                      <div className="sched-session-meta">
                        <span><Ic.user /> {s.instructorName}</span>
                        <span><Ic.door /> {s.room}</span>
                      </div>

                      <div className="sched-session-actions">
                        <button type="button" className="sched-act-btn sched-act-btn--edit"
                          onClick={() => onEdit(s)} title="Modifier">
                          <Ic.edit />
                        </button>
                        <button type="button" className="sched-act-btn sched-act-btn--del"
                          onClick={() => onDelete(s)} title="Supprimer">
                          <Ic.trash />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   LIST VIEW
═══════════════════════════════════════════════════ */

interface ListViewProps {
  sessions: SessionRow[];
  courses: CourseOption[];
  onEdit: (s: SessionRow) => void;
  onDelete: (s: SessionRow) => void;
  filterCourseId: number | null;
}

function ListView({ sessions, courses, onEdit, onDelete, filterCourseId }: ListViewProps) {
  const courseColorMap = useMemo(() => {
    const m: Record<number, string> = {};
    courses.forEach((c, i) => {
      m[c.id] = c.color ?? COURSE_COLORS[i % COURSE_COLORS.length];
    });
    return m;
  }, [courses]);

  const filtered = filterCourseId
    ? sessions.filter(s => s.courseId === filterCourseId)
    : sessions;

  if (filtered.length === 0) return (
    <div className="sched-empty">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity=".25">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
      <p>Aucune séance planifiée.</p>
    </div>
  );

  return (
    <div className="sched-list">
      {filtered.map(s => {
        const color = s.courseColor ?? courseColorMap[s.courseId] ?? '#c2652a';
        const sm = STATUS_META[s.status];
        return (
          <article key={s.id} className="sched-list-row" style={{ borderLeftColor: color }}>
            <div className="sched-list-main">
              <div className="sched-list-top">
                <span className="sched-session-status" style={{ background: sm.bg, color: sm.text }}>
                  {sm.label}
                </span>
                {s.groupName && (
                  <span className="sched-group-badge">{s.groupName}</span>
                )}
              </div>
              <h3 className="sched-list-title">{s.title}</h3>
              <p className="sched-list-course" style={{ color }}>{s.courseTitle}</p>
            </div>

            <div className="sched-list-details">
              <div className="sched-detail-item"><Ic.cal />  <span>{s.dateLabel}</span></div>
              <div className="sched-detail-item"><Ic.clock /><span>{s.timeLabel} · {s.durationMinutes}min</span></div>
              <div className="sched-detail-item"><Ic.user /> <span>{s.instructorName}</span></div>
              <div className="sched-detail-item"><Ic.door /> <span>{s.room}</span></div>
            </div>

            <div className="sched-list-actions">
              <button type="button" className="sched-act-btn sched-act-btn--edit" onClick={() => onEdit(s)}>
                <Ic.edit /> Modifier
              </button>
              <button type="button" className="sched-act-btn sched-act-btn--del" onClick={() => onDelete(s)}>
                <Ic.trash /> Supprimer
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════ */

export default function AdminSchedule() {
  const { courses, sessions, flash } = usePage<PageProps>().props;

  const [editing,        setEditing]        = useState<SessionRow | null>(null);
  const [viewMode,       setViewMode]       = useState<'week' | 'list'>('week');
  const [filterCourseId, setFilterCourseId] = useState<number | null>(null);
  const [monday,         setMonday]         = useState(getMondayOfWeek);

  const { data, setData, post, patch, reset, errors, processing } = useForm(blankForm);

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    if (editing) {
      patch(route('admin.schedule.update', editing.id), {
        preserveScroll: true,
        onSuccess: clearForm,
      });
    } else {
      post(route('admin.schedule.store'), {
        preserveScroll: true,
        onSuccess: clearForm,
      });
    }
  };

  const clearForm = () => { setEditing(null); reset(); };

  const editSession = (s: SessionRow) => {
    setEditing(s);
    setData({
      course_id:        String(s.courseId),
      title:            s.title,
      instructor_name:  s.instructorName,
      room:             s.room,
      group_name:       s.groupName ?? '',
      starts_at:        s.startsAt,
      duration_minutes: s.durationMinutes,
      status:           s.status,
      notes:            s.notes ?? '',
      recurrence:       'none',
      recurrence_days:  [],
      recurrence_until: '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteSession = (s: SessionRow) => {
    if (!confirm(`Supprimer la séance "${s.title}" ?`)) return;
    router.delete(route('admin.schedule.destroy', s.id), { preserveScroll: true });
  };

  const weekLabel = `${fmt(monday)} – ${fmt(addDays(monday, 5))}`;
  const totalSessions = filterCourseId
    ? sessions.filter(s => s.courseId === filterCourseId).length
    : sessions.length;

  return (
    <AdminLayout header={<span style={{ fontWeight: 700 }}>Planning des formations</span>}>
      <Head title="Planning – Administration" />

      <div className="sched-root">

        {/* ── Page header ── */}
        <header className="sched-page-header">
          <div>
            <p className="sched-kicker">Administration</p>
            <h1 className="sched-page-title">Planning des séances</h1>
            <p className="sched-page-sub">
              Organisez les séances de chaque formation sur la semaine. Une formation peut avoir
              plusieurs séances par semaine à des horaires variables selon le formateur.
            </p>
          </div>

          {/* Stats chips */}
          <div className="sched-stats-chips">
            <div className="sched-chip">
              <span className="sched-chip-val">{courses.length}</span>
              <span className="sched-chip-lbl">formation{courses.length > 1 ? 's' : ''}</span>
            </div>
            <div className="sched-chip sched-chip--orange">
              <span className="sched-chip-val">{sessions.length}</span>
              <span className="sched-chip-lbl">séance{sessions.length > 1 ? 's' : ''} planifiée{sessions.length > 1 ? 's' : ''}</span>
            </div>
          </div>
        </header>

        {/* Flash */}
        {flash?.success && (
          <div className="sched-flash">
            <Ic.check /> {flash.success}
          </div>
        )}

        {/* ── Main layout ── */}
        <div className="sched-layout">

          {/* LEFT — sticky form */}
          <aside className="sched-sidebar">
            <FormPanel
              courses={courses}
              editing={editing}
              onClear={clearForm}
              data={data}
              setData={(k, v) => setData(k as any, v)}
              errors={errors as Record<string, string>}
              processing={processing}
              onSubmit={submit}
            />
          </aside>

          {/* RIGHT — calendar view */}
          <main className="sched-content">

            {/* Toolbar */}
            <div className="sched-toolbar">
              <div className="sched-toolbar-left">
                {/* Course filter */}
                <select
                  className="sched-filter-select"
                  value={filterCourseId ?? ''}
                  onChange={e => setFilterCourseId(e.target.value ? Number(e.target.value) : null)}
                >
                  <option value="">Toutes les formations ({sessions.length} séances)</option>
                  {courses.map(c => {
                    const count = sessions.filter(s => s.courseId === c.id).length;
                    return (
                      <option key={c.id} value={c.id}>
                        {c.title} ({count} séance{count > 1 ? 's' : ''})
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="sched-toolbar-right">
                {/* View toggle */}
                <div className="sched-view-toggle">
                  <button
                    className={`sched-view-btn ${viewMode === 'week' ? 'sched-view-btn--on' : ''}`}
                    onClick={() => setViewMode('week')}
                  >
                    Semaine
                  </button>
                  <button
                    className={`sched-view-btn ${viewMode === 'list' ? 'sched-view-btn--on' : ''}`}
                    onClick={() => setViewMode('list')}
                  >
                    Liste
                  </button>
                </div>

                {/* Week navigation — only in week mode */}
                {viewMode === 'week' && (
                  <div className="sched-week-nav">
                    <button className="sched-week-btn" onClick={() => setMonday(m => addDays(m, -7))}>
                      <Ic.chevL />
                    </button>
                    <span className="sched-week-label">{weekLabel}</span>
                    <button className="sched-week-btn" onClick={() => setMonday(m => addDays(m, 7))}>
                      <Ic.chevR />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Course legend */}
            {courses.length > 0 && (
              <div className="sched-legend">
                {courses.map((c, i) => {
                  const color = c.color ?? COURSE_COLORS[i % COURSE_COLORS.length];
                  const count = sessions.filter(s => s.courseId === c.id).length;
                  return (
                    <button
                      key={c.id}
                      className={`sched-legend-item ${filterCourseId === c.id ? 'sched-legend-item--on' : ''}`}
                      onClick={() => setFilterCourseId(filterCourseId === c.id ? null : c.id)}
                      style={filterCourseId === c.id
                        ? { background: hex2rgba(color, 0.1), borderColor: color }
                        : {}}
                    >
                      <span className="sched-legend-dot" style={{ background: color }} />
                      <span className="sched-legend-name">{c.title}</span>
                      <span className="sched-legend-count" style={{ background: hex2rgba(color, 0.12), color }}>
                        {count}
                      </span>
                      {c.startDate && c.endDate && (
                        <span className="sched-legend-dates">
                          {c.startDate} → {c.endDate}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Calendar or List */}
            {viewMode === 'week' ? (
              <WeekView
                sessions={filterCourseId ? sessions.filter(s => s.courseId === filterCourseId) : sessions}
                courses={courses}
                monday={monday}
                onEdit={editSession}
                onDelete={deleteSession}
              />
            ) : (
              <ListView
                sessions={sessions}
                courses={courses}
                onEdit={editSession}
                onDelete={deleteSession}
                filterCourseId={filterCourseId}
              />
            )}

            <p className="sched-count">{totalSessions} séance{totalSessions > 1 ? 's' : ''} affichée{totalSessions > 1 ? 's' : ''}</p>
          </main>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');

        /* ── Root ── */
        .sched-root {
          padding: 28px; font-family: 'Manrope', sans-serif; color: #1a1612;
          display: flex; flex-direction: column; gap: 20px;
          min-width: 0; width: 100%; box-sizing: border-box;
        }
        .sched-root *, .sched-root *::before, .sched-root *::after { box-sizing: border-box; }

        /* ── Page header ── */
        .sched-page-header {
          display: flex; align-items: flex-start; justify-content: space-between;
          gap: 20px; flex-wrap: wrap;
        }
        .sched-kicker {
          font-size: .68rem; font-weight: 800; letter-spacing: .13em;
          text-transform: uppercase; color: #c2652a; margin: 0 0 5px;
        }
        .sched-page-title {
          margin: 0 0 6px; font-size: 1.7rem; font-weight: 800;
          color: #1a1612; letter-spacing: -.02em;
        }
        .sched-page-sub {
          margin: 0; font-size: .84rem; color: #7a6f66; line-height: 1.6;
          max-width: 640px;
        }
        .sched-stats-chips { display: flex; gap: 10px; flex-shrink: 0; }
        .sched-chip {
          padding: 10px 16px; border-radius: 12px;
          background: #f6f0e8; border: 1px solid #e8e0d4;
          display: flex; flex-direction: column; align-items: center;
        }
        .sched-chip--orange { background: rgba(194,101,42,.1); border-color: rgba(194,101,42,.2); }
        .sched-chip-val { font-size: 1.3rem; font-weight: 800; color: #1a1612; line-height: 1; }
        .sched-chip--orange .sched-chip-val { color: #c2652a; }
        .sched-chip-lbl { font-size: .68rem; font-weight: 600; color: #9a9088; margin-top: 2px; }

        /* ── Flash ── */
        .sched-flash {
          display: flex; align-items: center; gap: 8px;
          padding: 12px 16px; border-radius: 10px;
          background: #f0fdf4; border: 1px solid #bbf7d0;
          color: #166534; font-weight: 700; font-size: .86rem;
        }

        /* ── Layout ── */
        .sched-layout {
          display: grid; grid-template-columns: 400px 1fr;
          gap: 20px; align-items: start;
        }
        @media (max-width: 1100px) {
          .sched-layout { grid-template-columns: 1fr; }
          .sched-sidebar { position: static !important; }
        }

        /* ── Sidebar / Form ── */
        .sched-sidebar { position: sticky; top: 16px; }
        .sched-form {
          background: #fff; border-radius: 16px;
          border: 1px solid rgba(0,0,0,0.07);
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          overflow: hidden;
        }
        .sched-form-header {
          display: flex; align-items: flex-start; justify-content: space-between;
          gap: 12px; padding: 20px 22px 18px;
          background: linear-gradient(135deg, #faf5ee, #f6f0e8);
          border-bottom: 1px solid rgba(0,0,0,0.07);
        }
        .sched-form-title { margin: 0; font-size: .96rem; font-weight: 800; color: #1a1612; }
        .sched-cancel-btn {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 6px 11px; border-radius: 8px; border: none;
          background: rgba(220,38,38,.08); color: #dc2626;
          font-family: 'Manrope',sans-serif; font-size: .76rem; font-weight: 700;
          cursor: pointer; transition: background .15s; white-space: nowrap;
        }
        .sched-cancel-btn:hover { background: rgba(220,38,38,.14); }
        .sched-form-body {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 14px; padding: 20px 22px 24px;
        }
        .sched-field { display: flex; flex-direction: column; gap: 6px; }
        .sched-field--full { grid-column: 1 / -1; }
        .sched-label {
          display: flex; align-items: center; gap: 5px;
          font-size: .74rem; font-weight: 800; color: #6b5f55;
          text-transform: uppercase; letter-spacing: .07em;
        }
        .sched-required { color: #c2652a; }
        .sched-input {
          width: 100%; border: 1.5px solid #e5ded8; border-radius: 10px;
          background: #fbfaf8; padding: 9px 12px;
          font-family: 'Manrope',sans-serif; font-size: .84rem; color: #1a1612;
          outline: none; transition: border-color .15s, box-shadow .15s, background .15s;
        }
        .sched-input:focus { border-color: #c2652a; box-shadow: 0 0 0 3px rgba(194,101,42,.12); background: #fff; }
        .sched-input--err { border-color: #dc2626 !important; }
        .sched-input--inline { width: auto; flex: 1; }
        .sched-textarea { min-height: 80px; resize: vertical; }
        .sched-err  { font-size: .72rem; color: #dc2626; font-weight: 600; margin: 0; }
        .sched-hint { font-size: .72rem; color: #9a9088; line-height: 1.5; margin: 0; }

        /* Course pill */
        .sched-course-pill {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 5px 10px; border-radius: 8px; border: 1px solid;
          font-size: .74rem; font-weight: 600;
          margin-top: 2px;
        }
        .sched-course-pill-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }

        /* Recurrence */
        .sched-recurrence-wrap { display: flex; flex-direction: column; gap: 10px; }
        .sched-days-picker { display: flex; gap: 6px; flex-wrap: wrap; }
        .sched-day-btn {
          width: 36px; height: 36px; border-radius: 99px;
          border: 1.5px solid #e5ded8; background: #fbfaf8;
          font-family: 'Manrope',sans-serif; font-size: .72rem; font-weight: 800;
          color: #6b5f55; cursor: pointer; transition: all .15s;
        }
        .sched-day-btn--on { background: #c2652a; border-color: #c2652a; color: #fff; }
        .sched-until-wrap { display: flex; align-items: center; gap: 8px; }

        /* Submit */
        .sched-submit {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          width: 100%; padding: 12px 16px; border: none; border-radius: 12px;
          background: linear-gradient(135deg, #c2652a, #e8915a);
          color: #fff; font-family: 'Manrope',sans-serif;
          font-size: .9rem; font-weight: 900; cursor: pointer;
          box-shadow: 0 4px 14px rgba(194,101,42,.28);
          transition: opacity .15s, transform .1s, box-shadow .15s;
        }
        .sched-submit:hover:not(:disabled) { opacity: .92; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(194,101,42,.36); }
        .sched-submit:disabled { opacity: .6; cursor: wait; }
        .sched-spinner { width: 16px; height: 16px; animation: sched-spin .7s linear infinite; }
        @keyframes sched-spin { to { transform: rotate(360deg); } }

        /* ── Toolbar ── */
        .sched-toolbar {
          display: flex; align-items: center; justify-content: space-between;
          gap: 12px; flex-wrap: wrap; margin-bottom: 14px;
        }
        .sched-toolbar-left, .sched-toolbar-right { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .sched-filter-select {
          border: 1.5px solid #e5ded8; border-radius: 10px;
          background: #fff; padding: 8px 12px;
          font-family: 'Manrope',sans-serif; font-size: .82rem; color: #1a1612;
          outline: none; cursor: pointer;
          transition: border-color .15s;
        }
        .sched-filter-select:focus { border-color: #c2652a; }

        .sched-view-toggle {
          display: flex; background: #f2ece4; border-radius: 8px; padding: 3px;
        }
        .sched-view-btn {
          padding: 6px 14px; border: none; border-radius: 6px;
          background: none; font-family: 'Manrope',sans-serif;
          font-size: .74rem; font-weight: 800; color: #9a9088; cursor: pointer;
          transition: all .15s;
        }
        .sched-view-btn--on { background: #fff; color: #c2652a; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }

        .sched-week-nav { display: flex; align-items: center; gap: 8px; }
        .sched-week-btn {
          width: 32px; height: 32px; border-radius: 8px; border: 1.5px solid #e5ded8;
          background: #fff; color: #6b5f55; display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all .15s;
        }
        .sched-week-btn:hover { border-color: #c2652a; color: #c2652a; }
        .sched-week-label { font-size: .82rem; font-weight: 700; color: #3a302a; white-space: nowrap; }

        /* ── Legend ── */
        .sched-legend { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }
        .sched-legend-item {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 6px 12px; border-radius: 99px;
          border: 1.5px solid #e5ded8; background: #fff;
          font-family: 'Manrope',sans-serif; font-size: .76rem; font-weight: 600;
          color: #3a302a; cursor: pointer; transition: all .15s;
        }
        .sched-legend-item:hover { border-color: rgba(0,0,0,0.2); }
        .sched-legend-item--on { font-weight: 700; }
        .sched-legend-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .sched-legend-name { max-width: 130px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .sched-legend-count { padding: 1px 6px; border-radius: 99px; font-size: .66rem; font-weight: 800; }
        .sched-legend-dates { font-size: .68rem; color: #9a9088; white-space: nowrap; }

        /* ── Week Grid ── */
        .sched-week-grid {
          display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px;
          background: #fff; border-radius: 16px;
          border: 1px solid rgba(0,0,0,0.07);
          box-shadow: 0 2px 10px rgba(0,0,0,0.04);
          padding: 14px; overflow: hidden;
        }
        @media (max-width: 900px) { .sched-week-grid { grid-template-columns: repeat(3,1fr); } }
        @media (max-width: 600px) { .sched-week-grid { grid-template-columns: repeat(2,1fr); } }

        .sched-day-col { display: flex; flex-direction: column; gap: 8px; }

        .sched-day-header {
          text-align: center; padding-bottom: 8px;
          border-bottom: 1px solid #e8e0d4;
          position: relative;
        }
        .sched-day-label { font-size: .62rem; font-weight: 800; text-transform: uppercase; letter-spacing: .15em; color: #9a9088; display: block; margin-bottom: 2px; }
        .sched-day-num  { font-size: 1.1rem; font-weight: 800; color: #3a302a; display: block; }
        .sched-day-num--today { color: #c2652a; }
        .sched-day-header--today .sched-day-label { color: #c2652a; }
        .sched-today-dot {
          width: 5px; height: 5px; border-radius: 50%; background: #c2652a;
          display: inline-block; margin-left: 4px; vertical-align: middle;
        }

        .sched-day-sessions { display: flex; flex-direction: column; gap: 6px; min-height: 80px; }
        .sched-day-empty {
          flex: 1; display: flex; align-items: center; justify-content: center;
          min-height: 80px; border-radius: 10px; border: 1.5px dashed #e8e0d4;
          color: #ccc;
        }

        .sched-session-card {
          border-left: 3px solid transparent; border-radius: 10px;
          padding: 9px 10px; cursor: default;
          transition: box-shadow .15s;
        }
        .sched-session-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); }

        .sched-session-top { display: flex; align-items: center; justify-content: space-between; gap: 4px; margin-bottom: 4px; }
        .sched-session-time { display: flex; align-items: center; gap: 3px; font-size: .64rem; font-weight: 700; color: #6b5f55; }
        .sched-session-dur  { color: #9a9088; font-weight: 500; }
        .sched-session-status {
          padding: 1px 6px; border-radius: 99px; font-size: .58rem; font-weight: 800;
          text-transform: uppercase; letter-spacing: .06em; white-space: nowrap;
        }
        .sched-session-title  { margin: 0 0 2px; font-size: .78rem; font-weight: 800; color: #1a1612; line-height: 1.3; }
        .sched-session-course { margin: 0 0 5px; font-size: .68rem; font-weight: 700; }
        .sched-session-meta {
          display: flex; flex-direction: column; gap: 2px;
          font-size: .66rem; color: #7a6f66;
        }
        .sched-session-meta span { display: flex; align-items: center; gap: 4px; }
        .sched-session-actions { display: flex; gap: 4px; margin-top: 6px; }

        .sched-act-btn {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 4px 7px; border-radius: 6px; border: none;
          font-family: 'Manrope',sans-serif; font-size: .68rem; font-weight: 700;
          cursor: pointer; transition: all .15s;
        }
        .sched-act-btn--edit { background: rgba(194,101,42,.1); color: #c2652a; }
        .sched-act-btn--edit:hover { background: rgba(194,101,42,.2); }
        .sched-act-btn--del  { background: rgba(220,38,38,.08); color: #dc2626; }
        .sched-act-btn--del:hover  { background: rgba(220,38,38,.15); }

        /* ── List view ── */
        .sched-list { display: flex; flex-direction: column; gap: 10px; }
        .sched-list-row {
          display: grid; grid-template-columns: 1.1fr 1.4fr auto;
          gap: 16px; align-items: start;
          background: #fff; border-radius: 14px;
          border: 1px solid rgba(0,0,0,0.07);
          border-left: 4px solid transparent;
          padding: 14px 16px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        }
        @media (max-width: 700px) { .sched-list-row { grid-template-columns: 1fr; } }

        .sched-list-top { display: flex; align-items: center; gap: 6px; margin-bottom: 5px; }
        .sched-list-title  { margin: 0 0 2px; font-size: .92rem; font-weight: 800; color: #1a1612; }
        .sched-list-course { margin: 0; font-size: .76rem; font-weight: 700; }
        .sched-group-badge {
          padding: 2px 7px; border-radius: 99px; background: #f2ece4;
          font-size: .65rem; font-weight: 800; color: #6b5f55;
        }

        .sched-list-details {
          display: grid; grid-template-columns: 1fr 1fr; gap: 7px 14px;
        }
        .sched-detail-item { display: flex; align-items: center; gap: 5px; font-size: .78rem; color: #6b5f55; }
        .sched-list-actions { display: flex; gap: 6px; align-items: flex-start; }

        /* ── Empty / count ── */
        .sched-empty {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 10px; padding: 48px; text-align: center; color: #9a9088;
          background: #fff; border-radius: 16px;
          border: 1px solid rgba(0,0,0,0.07);
        }
        .sched-empty p { font-size: .86rem; font-weight: 600; margin: 0; }
        .sched-count {
          font-size: .74rem; color: #9a9088; font-weight: 600;
          text-align: right; margin-top: 10px; padding-right: 4px;
        }
      `}</style>
    </AdminLayout>
  );
}