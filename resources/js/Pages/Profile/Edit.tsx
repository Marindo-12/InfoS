import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({
  mustVerifyEmail,
  status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
  return (
    <AuthenticatedLayout header={<h2>Mon Profil</h2>}>
      <Head title="Profil" />

      <div className="prof-page">
        {/* Breadcrumb */}
        <div className="prof-breadcrumb">
          <span>Mon compte</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
          <span className="prof-breadcrumb-active">Modifier le profil</span>
        </div>

        {/* Main card */}
        <div className="prof-card">
          <UpdateProfileInformationForm 
                mustVerifyEmail={mustVerifyEmail}
                status={status}
          />
        </div>

        {/* Password card */}
        <div className="prof-card">
          <UpdatePasswordForm />
        </div>

        {/* Delete card */}
        <div className="prof-card prof-card--danger">
          <DeleteUserForm />
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');

        .prof-page {
          display: flex; flex-direction: column; gap: 20px;
          font-family: 'Manrope', sans-serif;
          width: 100%; min-width: 0;
          box-sizing: border-box;
        }
        .prof-page *, .prof-page *::before, .prof-page *::after { box-sizing: border-box; }

        .prof-breadcrumb {
          display: flex; align-items: center; gap: 8px;
          font-size: .82rem; color: #9ca3af;
        }
        .prof-breadcrumb-active { color: #111; font-weight: 700; }

        .prof-card {
          background: #fff;
          border-radius: 20px;
          border: 1px solid rgba(0,0,0,0.07);
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
          overflow: hidden;
        }
        .prof-card--danger { border-color: rgba(239,68,68,0.15); }
      `}</style>
    </AuthenticatedLayout>
  );
}