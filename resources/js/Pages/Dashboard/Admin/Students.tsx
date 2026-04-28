import { Head, usePage } from '@inertiajs/react';

type Stat = {
  label: string;
  value: string;
  sub: string;
  accent: 'orange' | 'blue' | 'green' | 'slate';
};

type RecentStudent = {
  name: string;
  email: string;
  course: string;
  joinedAt: string;
};

type StudentRow = {
  name: string;
  email: string;
  phone: string | null;
  course: string;
  progress: number;
  paymentStatus: 'paye' | 'partiel' | 'retard' | 'non defini';
  lastSeen: string;
  enrollmentsCount: number;
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
  recentStudents: RecentStudent[];
  students: StudentRow[];
};

function statusMeta(status: StudentRow['paymentStatus']) {
  if (status === 'paye') return { label: 'Paye', className: 'adm-status adm-status--green' };
  if (status === 'partiel') return { label: 'Partiel', className: 'adm-status adm-status--amber' };
  if (status === 'retard') return { label: 'Retard', className: 'adm-status adm-status--red' };
  return { label: 'Non defini', className: 'adm-status adm-status--slate' };
}

export default function Students() {
  const { props } = usePage<PageProps>();
  const { stats, recentStudents, students } = props;

  return (
    <>
      <Head title="Gestion des etudiants" />

      <main className="adm-root">
        <header className="adm-header">
          <div>
            <p className="adm-kicker">Administration</p>
            <h1 className="adm-title">Gestion des etudiants</h1>
            <p className="adm-subtitle">
              Vue d ensemble des inscriptions, paiements et progressions des etudiants du centre.
            </p>
          </div>
          <button className="adm-primary-btn" type="button">
            Nouvel etudiant
          </button>
        </header>

        <section className="adm-stats-grid">
          {stats.map((stat) => (
            <div className={`adm-stat-card adm-stat-card--${stat.accent}`} key={stat.label}>
              <p className="adm-stat-label">{stat.label}</p>
              <p className="adm-stat-value">{stat.value}</p>
              <p className="adm-stat-sub">{stat.sub}</p>
            </div>
          ))}
        </section>

        <section className="adm-recent-section">
          <div className="adm-section-head">
            <h2>Nouveaux etudiants recents</h2>
            <span>{recentStudents.length} profils affiches</span>
          </div>

          <div className="adm-recent-grid">
            {recentStudents.map((student) => (
              <article className="adm-recent-card" key={student.email}>
                <div className="adm-avatar">{student.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</div>
                <h3>{student.name}</h3>
                <p>{student.email}</p>
                <span className="adm-recent-chip">{student.course}</span>
                <small>Inscrit le {student.joinedAt}</small>
              </article>
            ))}
          </div>
        </section>

        <section className="adm-table-section">
          <div className="adm-section-head">
            <h2>Liste des etudiants</h2>
            <span>{students.length} ligne(s)</span>
          </div>

          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Etudiant</th>
                  <th>Formation</th>
                  <th>Paiement</th>
                  <th>Progression</th>
                  <th>Parcours</th>
                  <th>Derniere activite</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => {
                  const status = statusMeta(student.paymentStatus);

                  return (
                    <tr key={student.email}>
                      <td>
                        <div className="adm-student-cell">
                          <div className="adm-avatar adm-avatar--sm">
                            {student.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}
                          </div>
                          <div>
                            <strong>{student.name}</strong>
                            <span>{student.email}</span>
                            {student.phone && <small>{student.phone}</small>}
                          </div>
                        </div>
                      </td>
                      <td>{student.course}</td>
                      <td>
                        <span className={status.className}>{status.label}</span>
                      </td>
                      <td>
                        <div className="adm-progress">
                          <div className="adm-progress-track">
                            <div className="adm-progress-fill" style={{ width: `${student.progress}%` }} />
                          </div>
                          <span>{student.progress}%</span>
                        </div>
                      </td>
                      <td>{student.enrollmentsCount}</td>
                      <td>{student.lastSeen}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@600;700&family=Manrope:wght@400;500;600;700;800&display=swap');

        body {
          background: #f5f4f1;
        }
        .adm-root {
          min-height: 100vh;
          padding: 32px;
          font-family: 'Manrope', sans-serif;
          color: #18181b;
        }
        .adm-header,
        .adm-stat-card,
        .adm-recent-card,
        .adm-table-section {
          background: #fff;
          border: 1px solid rgba(15, 23, 42, 0.07);
          box-shadow: 0 8px 30px rgba(15, 23, 42, 0.04);
        }
        .adm-header {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          align-items: flex-end;
          flex-wrap: wrap;
          border-radius: 22px;
          padding: 28px;
          margin-bottom: 24px;
        }
        .adm-kicker {
          margin: 0 0 8px;
          font-size: 0.74rem;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #ff6b2b;
        }
        .adm-title {
          margin: 0;
          font-family: 'EB Garamond', serif;
          font-size: clamp(2rem, 3vw, 3rem);
          line-height: 1;
        }
        .adm-subtitle {
          margin: 14px 0 0;
          color: #6b7280;
          max-width: 720px;
          line-height: 1.7;
          font-size: 0.92rem;
        }
        .adm-primary-btn {
          border: none;
          border-radius: 12px;
          padding: 12px 18px;
          background: linear-gradient(135deg, #ff7a35, #ff5b14);
          color: #fff;
          font-size: 0.86rem;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 12px 24px rgba(255, 107, 43, 0.22);
        }

        .adm-stats-grid,
        .adm-recent-grid {
          display: grid;
          gap: 18px;
        }
        .adm-stats-grid {
          grid-template-columns: repeat(4, 1fr);
          margin-bottom: 24px;
        }
        .adm-stat-card {
          border-radius: 18px;
          padding: 22px;
        }
        .adm-stat-label {
          margin: 0 0 10px;
          color: #8b8b8b;
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.12em;
        }
        .adm-stat-value {
          margin: 0;
          color: #18181b;
          font-family: 'EB Garamond', serif;
          font-size: 2rem;
          line-height: 1;
        }
        .adm-stat-sub {
          margin: 8px 0 0;
          color: #6b7280;
          font-size: 0.8rem;
        }
        .adm-stat-card--orange { border-top: 3px solid #ff6b2b; }
        .adm-stat-card--blue { border-top: 3px solid #3b82f6; }
        .adm-stat-card--green { border-top: 3px solid #10b981; }
        .adm-stat-card--slate { border-top: 3px solid #64748b; }

        .adm-recent-section,
        .adm-table-section {
          margin-bottom: 24px;
        }
        .adm-section-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 14px;
        }
        .adm-section-head h2 {
          margin: 0;
          font-family: 'EB Garamond', serif;
          font-size: 1.8rem;
        }
        .adm-section-head span {
          color: #8b8b8b;
          font-size: 0.8rem;
          font-weight: 700;
        }
        .adm-recent-grid {
          grid-template-columns: repeat(4, 1fr);
        }
        .adm-recent-card {
          border-radius: 18px;
          padding: 22px;
          text-align: center;
        }
        .adm-avatar {
          width: 64px;
          height: 64px;
          border-radius: 18px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #ff7a35, #ff5b14);
          color: #fff;
          font-weight: 800;
          font-size: 1rem;
          margin-bottom: 14px;
        }
        .adm-avatar--sm {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          margin-bottom: 0;
          flex-shrink: 0;
          font-size: 0.78rem;
        }
        .adm-recent-card h3 {
          margin: 0;
          font-size: 1rem;
          font-weight: 800;
        }
        .adm-recent-card p {
          margin: 8px 0;
          color: #6b7280;
          font-size: 0.84rem;
        }
        .adm-recent-chip {
          display: inline-flex;
          align-items: center;
          padding: 6px 10px;
          border-radius: 999px;
          background: #fff7f1;
          color: #ff6b2b;
          font-size: 0.7rem;
          font-weight: 800;
          margin-bottom: 10px;
        }
        .adm-recent-card small {
          display: block;
          color: #9ca3af;
          font-size: 0.76rem;
        }

        .adm-table-section {
          border-radius: 22px;
          padding: 24px;
        }
        .adm-table-wrap {
          overflow-x: auto;
          border-radius: 16px;
          border: 1px solid rgba(15, 23, 42, 0.06);
        }
        .adm-table {
          width: 100%;
          min-width: 980px;
          border-collapse: collapse;
          background: #fff;
        }
        .adm-table thead tr {
          background: #faf7f4;
        }
        .adm-table th,
        .adm-table td {
          padding: 16px 18px;
          border-bottom: 1px solid rgba(15, 23, 42, 0.06);
          text-align: left;
          font-size: 0.85rem;
        }
        .adm-table th {
          color: #8b8b8b;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .adm-table tbody tr:hover {
          background: #fffaf6;
        }
        .adm-student-cell {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .adm-student-cell strong {
          display: block;
          color: #18181b;
        }
        .adm-student-cell span,
        .adm-student-cell small {
          display: block;
          color: #6b7280;
          font-size: 0.76rem;
          margin-top: 2px;
        }
        .adm-status {
          display: inline-flex;
          align-items: center;
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .adm-status--green { background: rgba(16, 185, 129, 0.12); color: #0f9d70; }
        .adm-status--amber { background: rgba(245, 158, 11, 0.14); color: #b45309; }
        .adm-status--red { background: rgba(239, 68, 68, 0.12); color: #dc2626; }
        .adm-status--slate { background: rgba(100, 116, 139, 0.12); color: #64748b; }
        .adm-progress {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .adm-progress-track {
          width: 120px;
          height: 8px;
          border-radius: 999px;
          overflow: hidden;
          background: #ece8e4;
        }
        .adm-progress-fill {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #ff9a56, #ff6b2b);
        }
        .adm-progress span {
          color: #18181b;
          font-size: 0.78rem;
          font-weight: 800;
        }

        @media (max-width: 1100px) {
          .adm-stats-grid,
          .adm-recent-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 640px) {
          .adm-root {
            padding: 20px 16px;
          }
          .adm-stats-grid,
          .adm-recent-grid {
            grid-template-columns: 1fr;
          }
          .adm-header,
          .adm-stat-card,
          .adm-recent-card,
          .adm-table-section {
            padding: 18px;
            border-radius: 18px;
          }
          .adm-title {
            font-size: 2rem;
          }
        }
      `}</style>
    </>
  );
}
