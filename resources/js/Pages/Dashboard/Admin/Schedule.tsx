import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

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
  flash?: { success?: string };
};

const blankForm = {
  course_id: '',
  title: '',
  instructor_name: '',
  room: '',
  group_name: '',
  starts_at: '',
  duration_minutes: 90,
  status: 'scheduled',
  notes: '',
};

export default function AdminSchedule() {
  const { courses, sessions, flash } = usePage<PageProps>().props;
  const [editing, setEditing] = useState<SessionRow | null>(null);
  const { data, setData, post, patch, reset, errors, processing } = useForm(blankForm);

  const submit: FormEventHandler = (event) => {
    event.preventDefault();

    if (editing) {
      patch(route('admin.schedule.update', editing.id), {
        preserveScroll: true,
        onSuccess: clearForm,
      });
      return;
    }

    post(route('admin.schedule.store'), {
      preserveScroll: true,
      onSuccess: clearForm,
    });
  };

  const clearForm = () => {
    setEditing(null);
    reset();
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
    });
  };

  const deleteSession = (session: SessionRow) => {
    if (!confirm(`Supprimer la seance "${session.title}" ?`)) return;

    router.delete(route('admin.schedule.destroy', session.id), { preserveScroll: true });
  };

  return (
    <AdminLayout header={<span style={{ fontWeight: 700 }}>Planning des formations</span>}>
      <Head title="Planning admin" />

      <main className="as-root">
        <header className="as-header">
          <div>
            <p className="as-kicker">Administration</p>
            <h1>Planning des seances</h1>
            <p>Planifiez les seances par formation. Les etudiants ne voient que les seances des formations auxquelles ils sont inscrits.</p>
          </div>
        </header>

        {flash?.success && <div className="as-flash">{flash.success}</div>}

        <section className="as-grid">
          <form className="as-panel as-form" onSubmit={submit}>
            <div className="as-panel-head">
              <h2>{editing ? 'Modifier une seance' : 'Ajouter une seance'}</h2>
              {editing && <button type="button" onClick={clearForm}>Annuler</button>}
            </div>

            <label>
              Formation
              <select value={data.course_id} onChange={(e) => setData('course_id', e.target.value)} required>
                <option value="">Choisir une formation</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title} ({course.studentsCount} etudiants)
                  </option>
                ))}
              </select>
              {errors.course_id && <small>{errors.course_id}</small>}
            </label>

            <label>
              Titre de la seance
              <input value={data.title} onChange={(e) => setData('title', e.target.value)} placeholder="Excel avance - Tableaux croises" required />
              {errors.title && <small>{errors.title}</small>}
            </label>

            <div className="as-row">
              <label>
                Professeur
                <input value={data.instructor_name} onChange={(e) => setData('instructor_name', e.target.value)} placeholder="M. Rachid Alami" required />
                {errors.instructor_name && <small>{errors.instructor_name}</small>}
              </label>
              <label>
                Salle
                <input value={data.room} onChange={(e) => setData('room', e.target.value)} placeholder="Salle 204" required />
                {errors.room && <small>{errors.room}</small>}
              </label>
            </div>

            <div className="as-row">
              <label>
                Date et heure
                <input type="datetime-local" value={data.starts_at} onChange={(e) => setData('starts_at', e.target.value)} required />
                {errors.starts_at && <small>{errors.starts_at}</small>}
              </label>
              <label>
                Duree
                <select value={data.duration_minutes} onChange={(e) => setData('duration_minutes', Number(e.target.value))}>
                  <option value={60}>1h</option>
                  <option value={90}>1h30</option>
                  <option value={120}>2h</option>
                  <option value={180}>3h</option>
                </select>
                {errors.duration_minutes && <small>{errors.duration_minutes}</small>}
              </label>
            </div>

            <div className="as-row">
              <label>
                Groupe optionnel
                <input value={data.group_name} onChange={(e) => setData('group_name', e.target.value)} placeholder="Groupe A" />
                {errors.group_name && <small>{errors.group_name}</small>}
              </label>
              <label>
                Statut
                <select value={data.status} onChange={(e) => setData('status', e.target.value)}>
                  <option value="scheduled">Programmee</option>
                  <option value="cancelled">Annulee</option>
                  <option value="completed">Terminee</option>
                </select>
                {errors.status && <small>{errors.status}</small>}
              </label>
            </div>

            <label>
              Notes
              <textarea value={data.notes} onChange={(e) => setData('notes', e.target.value)} placeholder="Consignes, materiel, objectifs..." />
              {errors.notes && <small>{errors.notes}</small>}
            </label>

            <button className="as-submit" disabled={processing}>
              {processing ? 'Enregistrement...' : editing ? 'Mettre a jour' : 'Ajouter au planning'}
            </button>
          </form>

          <section className="as-panel">
            <div className="as-panel-head">
              <h2>Seances planifiees</h2>
              <span>{sessions.length} seance{sessions.length > 1 ? 's' : ''}</span>
            </div>

            <div className="as-list">
              {sessions.map((session) => (
                <article key={session.id} className="as-session">
                  <div>
                    <span className={`as-status as-status--${session.status}`}>{session.status}</span>
                    <h3>{session.title}</h3>
                    <p>{session.courseTitle}</p>
                  </div>
                  <dl>
                    <div><dt>Date</dt><dd>{session.dateLabel}</dd></div>
                    <div><dt>Horaire</dt><dd>{session.timeLabel}</dd></div>
                    <div><dt>Prof</dt><dd>{session.instructorName}</dd></div>
                    <div><dt>Salle</dt><dd>{session.room}</dd></div>
                    {session.groupName && <div><dt>Groupe</dt><dd>{session.groupName}</dd></div>}
                  </dl>
                  <div className="as-actions">
                    <button type="button" onClick={() => editSession(session)}>Modifier</button>
                    <button type="button" className="as-danger" onClick={() => deleteSession(session)}>Supprimer</button>
                  </div>
                </article>
              ))}

              {sessions.length === 0 && (
                <div className="as-empty">Aucune seance n'est encore planifiee.</div>
              )}
            </div>
          </section>
        </section>
      </main>

      <style>{`
        .as-root { padding: 28px; font-family: Manrope, sans-serif; color: #1a1612; }
        .as-header { margin-bottom: 22px; }
        .as-kicker { margin: 0 0 6px; color: #c2652a; font-size: .72rem; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }
        .as-header h1 { margin: 0; font-size: 1.8rem; }
        .as-header p { max-width: 760px; margin: 8px 0 0; color: #6b5f55; line-height: 1.6; }
        .as-flash { margin-bottom: 16px; padding: 12px 14px; border-radius: 10px; background: #f0fdf4; color: #166534; font-weight: 700; }
        .as-grid { display: grid; grid-template-columns: 420px 1fr; gap: 18px; align-items: start; }
        .as-panel { background: #fff; border: 1px solid rgba(0,0,0,.08); border-radius: 14px; box-shadow: 0 8px 24px rgba(15,23,42,.06); }
        .as-form { padding: 18px; display: flex; flex-direction: column; gap: 13px; position: sticky; top: 82px; }
        .as-panel-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 18px; border-bottom: 1px solid rgba(15,23,42,.07); }
        .as-form .as-panel-head { padding: 0 0 14px; }
        .as-panel-head h2 { margin: 0; font-size: 1rem; }
        .as-panel-head button, .as-actions button { border: 0; background: #fff3ec; color: #c2652a; border-radius: 8px; padding: 8px 10px; font-weight: 800; cursor: pointer; }
        .as-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .as-form label { display: flex; flex-direction: column; gap: 6px; font-size: .76rem; font-weight: 800; color: #6b5f55; }
        .as-form input, .as-form select, .as-form textarea {
          width: 100%; border: 1px solid #e5ded8; border-radius: 10px; background: #fbfaf8;
          padding: 10px 12px; font: inherit; font-size: .84rem; color: #1a1612; outline: none;
        }
        .as-form textarea { min-height: 82px; resize: vertical; }
        .as-form input:focus, .as-form select:focus, .as-form textarea:focus { border-color: #c2652a; box-shadow: 0 0 0 3px rgba(194,101,42,.12); background: #fff; }
        .as-form small { color: #dc2626; font-weight: 600; }
        .as-submit { border: 0; border-radius: 10px; padding: 12px 16px; color: #fff; background: linear-gradient(135deg,#c2652a,#e8915a); font-weight: 900; cursor: pointer; }
        .as-submit:disabled { opacity: .65; cursor: wait; }
        .as-list { padding: 14px; display: flex; flex-direction: column; gap: 12px; }
        .as-session { border: 1px solid rgba(15,23,42,.08); border-radius: 12px; padding: 14px; display: grid; grid-template-columns: 1.1fr 1.4fr auto; gap: 14px; align-items: start; }
        .as-session h3 { margin: 8px 0 4px; font-size: .96rem; }
        .as-session p { margin: 0; color: #6b7280; font-size: .8rem; }
        .as-session dl { margin: 0; display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 8px 14px; }
        .as-session dt { color: #9ca3af; font-size: .66rem; text-transform: uppercase; font-weight: 900; letter-spacing: .08em; }
        .as-session dd { margin: 2px 0 0; font-size: .8rem; font-weight: 700; color: #1f2937; }
        .as-status { display: inline-flex; padding: 3px 8px; border-radius: 99px; font-size: .64rem; font-weight: 900; text-transform: uppercase; }
        .as-status--scheduled { background: #eff6ff; color: #2563eb; }
        .as-status--cancelled { background: #fee2e2; color: #dc2626; }
        .as-status--completed { background: #ecfdf5; color: #059669; }
        .as-actions { display: flex; gap: 8px; }
        .as-actions .as-danger { background: #fee2e2; color: #dc2626; }
        .as-empty { padding: 28px; color: #6b7280; text-align: center; background: #fafafa; border-radius: 12px; }
        @media (max-width: 1100px) { .as-grid { grid-template-columns: 1fr; } .as-form { position: static; } }
        @media (max-width: 760px) { .as-root { padding: 18px; } .as-row, .as-session, .as-session dl { grid-template-columns: 1fr; } .as-actions { flex-wrap: wrap; } }
      `}</style>
    </AdminLayout>
  );
}
