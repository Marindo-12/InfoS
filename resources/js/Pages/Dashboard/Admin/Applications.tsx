import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, usePage } from '@inertiajs/react';

type ApplicationRow = {
  id: number;
  reference: string;
  student: string;
  email: string;
  phone?: string;
  course: string;
  category: string;
  amount: string;
  paymentMethod: 'online' | 'onsite';
  paymentStatus: 'paid' | 'pending';
  preferredPaymentDate?: string;
  certificateReference?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
};

type PageProps = {
  auth: { user: { id: number; name: string; email: string } };
  applications: ApplicationRow[];
  stats: { pending: number; approved: number; onlinePaid: number; onsitePending: number };
  flash?: { success?: string; warning?: string };
};

function badge(label: string, tone: 'green' | 'amber' | 'slate') {
  return <span className={`appa-badge appa-badge--${tone}`}>{label}</span>;
}

export default function Applications() {
  const { applications, stats, flash } = usePage<PageProps>().props;

  const approve = (application: ApplicationRow) => {
    router.post(route('admin.applications.approve', application.id), {}, { preserveScroll: true });
  };

  const resendAccess = (application: ApplicationRow) => {
    router.post(route('admin.applications.resend-access', application.id), {}, { preserveScroll: true });
  };

  return (
    <AdminLayout header={<span style={{ fontWeight: 700 }}>Demandes d'inscription</span>}>
      <Head title="Demandes d'inscription" />
      <main className="appa-root">
        <header className="appa-header">
          <div>
            <p className="appa-kicker">Administration</p>
            <h1>Demandes d'inscription</h1>
            <p>Les formulaires envoyes depuis le site public arrivent ici avec le paiement, le certificat et la date de passage au centre.</p>
          </div>
        </header>

        {flash?.success && <div className="appa-flash">{flash.success}</div>}
        {flash?.warning && <div className="appa-flash appa-flash--warning">{flash.warning}</div>}

        <section className="appa-stats">
          <article><strong>{stats.pending}</strong><span>En attente</span></article>
          <article><strong>{stats.approved}</strong><span>Validees</span></article>
          <article><strong>{stats.onlinePaid}</strong><span>En ligne payees</span></article>
          <article><strong>{stats.onsitePending}</strong><span>Presentiel a encaisser</span></article>
        </section>

        <section className="appa-panel">
          <div className="appa-panel-head">
            <h2>Liste des demandes</h2>
            <span>{applications.length} dossier{applications.length > 1 ? 's' : ''}</span>
          </div>

          <div className="appa-table-wrap">
            <table className="appa-table">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Candidat</th>
                  <th>Formation</th>
                  <th>Paiement</th>
                  <th>Certificat</th>
                  <th>Statut</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {applications.map((application) => (
                  <tr key={application.reference}>
                    <td className="appa-ref">{application.reference}<small>{application.createdAt}</small></td>
                    <td>
                      <strong>{application.student}</strong>
                      <small>{application.email}</small>
                      {application.phone && <small>{application.phone}</small>}
                    </td>
                    <td>
                      <strong>{application.course}</strong>
                      <small>{application.category} · {application.amount}</small>
                    </td>
                    <td>
                      {application.paymentMethod === 'online'
                        ? badge('En ligne', 'green')
                        : badge('Presentiel', 'amber')}
                      <small>
                        {application.paymentStatus === 'paid' ? 'Regle' : `Date choisie: ${application.preferredPaymentDate ?? 'non precisee'}`}
                      </small>
                    </td>
                    <td><small>{application.certificateReference ?? '-'}</small></td>
                    <td>{application.status === 'approved' ? badge('Validee', 'green') : badge('En attente', 'slate')}</td>
                    <td>
                      <button
                        className={`appa-action ${application.status === 'approved' ? 'appa-action--ghost' : ''}`}
                        onClick={() => application.status === 'approved' ? resendAccess(application) : approve(application)}
                      >
                        {application.status === 'approved' ? "Renvoyer l'acces" : "Donner l'acces"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <style>{`
        .appa-root { padding: 28px; font-family: Manrope, sans-serif; color: #18181b; }
        .appa-header, .appa-panel, .appa-stats article, .appa-flash {
          background: #fff; border: 1px solid rgba(15,23,42,.08); box-shadow: 0 4px 20px rgba(15,23,42,.04); border-radius: 16px;
        }
        .appa-header { padding: 26px; margin-bottom: 18px; }
        .appa-kicker { margin: 0 0 6px; color: #c2652a; font-size: .72rem; font-weight: 800; text-transform: uppercase; letter-spacing: .14em; }
        .appa-header h1 { margin: 0; font-family: "EB Garamond", serif; font-size: 2.5rem; }
        .appa-header p { margin: 10px 0 0; max-width: 720px; color: #6b7280; line-height: 1.7; }
        .appa-flash { padding: 12px 16px; color: #047857; background: #ecfdf5; margin-bottom: 18px; font-weight: 700; }
        .appa-flash--warning { color: #92400e; background: #fffbeb; border-color: #fde68a; }
        .appa-stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; margin-bottom: 18px; }
        .appa-stats article { padding: 18px; }
        .appa-stats strong { display: block; font-size: 2rem; font-family: "EB Garamond", serif; }
        .appa-stats span { color: #6b7280; font-size: .82rem; font-weight: 700; }
        .appa-panel { padding: 22px; }
        .appa-panel-head { display: flex; justify-content: space-between; gap: 12px; align-items: center; margin-bottom: 14px; }
        .appa-panel-head h2 { margin: 0; font-family: "EB Garamond", serif; font-size: 1.6rem; }
        .appa-panel-head span { color: #8b8b8b; font-size: .8rem; font-weight: 700; }
        .appa-table-wrap { overflow-x: auto; border: 1px solid rgba(15,23,42,.06); border-radius: 14px; }
        .appa-table { width: 100%; min-width: 980px; border-collapse: collapse; }
        .appa-table th, .appa-table td { padding: 14px 16px; border-bottom: 1px solid rgba(15,23,42,.06); text-align: left; vertical-align: top; font-size: .83rem; }
        .appa-table th { background: #faf8f5; color: #8b8b8b; font-size: .68rem; letter-spacing: .1em; text-transform: uppercase; }
        .appa-table strong { display: block; font-weight: 800; }
        .appa-table small { display: block; margin-top: 4px; color: #6b7280; }
        .appa-ref { font-family: monospace; color: #8b8b8b; }
        .appa-badge { display: inline-flex; width: fit-content; border-radius: 999px; padding: 4px 10px; font-size: .68rem; font-weight: 900; text-transform: uppercase; letter-spacing: .06em; }
        .appa-badge--green { background: rgba(16,185,129,.12); color: #047857; }
        .appa-badge--amber { background: rgba(245,158,11,.14); color: #b45309; }
        .appa-badge--slate { background: rgba(100,116,139,.12); color: #475569; }
        .appa-action { border: 0; border-radius: 10px; padding: 9px 12px; background: #c2652a; color: white; font-weight: 800; cursor: pointer; white-space: nowrap; }
        .appa-action--ghost { background: #fff7ed; color: #c2652a; border: 1px solid rgba(194,101,42,.24); }
        @media (max-width: 900px) { .appa-stats { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 640px) { .appa-root { padding: 16px; } .appa-stats { grid-template-columns: 1fr; } }
      `}</style>
    </AdminLayout>
  );
}
