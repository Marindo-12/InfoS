import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import AdminLayout from '@/Layouts/AdminLayout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({
  auth,
  mustVerifyEmail,
  status,
  profileSummary = [],
}: PageProps<{
  mustVerifyEmail: boolean;
  status?: string;
  profileSummary?: { label: string; value: string; sub: string }[];
}>) {
  const user = auth.user;
  const isAdmin = user.role === 'admin';
  const Layout = isAdmin ? AdminLayout : AuthenticatedLayout;
  const initials = user.name
    .split(' ')
    .filter(Boolean)
    .map(part => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <Layout
      header={
        isAdmin ? (
          <div className="flex items-center gap-2 font-['Manrope',sans-serif]">
            <span className="text-[.8rem] text-[#b0a49a]">Administration</span>
            <span className="text-[#b0a49a] text-[.8rem]">/</span>
            <span className="text-[.82rem] font-bold text-[#1a1612]">Profil</span>
          </div>
        ) : (
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">Mon Profil</h2>
        )
      }
    >
      <Head title="Profil" />

      <main
        className={`
          flex flex-col gap-5 font-['Manrope',sans-serif] w-full min-w-0 box-border min-h-[calc(100vh-64px)]
          ${isAdmin
            ? `
              gap-[26px] px-[clamp(18px,4vw,48px)] py-[42px_0_58px] 
              bg-[#faf5ee] bg-[radial-gradient(rgba(216,208,200,.72)_0.6px,transparent_0.6px)] bg-[length:24px_24px] 
              text-[#3a302a]
              [.al-dark_&]:bg-[#14110f] [.al-dark_&]:text-[#f8efe5] 
              [.al-dark_&]:bg-[radial-gradient(rgba(210,194,181,.12)_0.6px,transparent_0.6px)]
            `
            : `
              [.a-root--dark_&]:text-[#e5e2e1]
            `
          }
        `}
      >
        {/* Hero Section */}
        <section className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div>
            <p className="text-[#c2652a] dark:text-[#ff6b2b] text-[.72rem] font-black uppercase tracking-[.16em] mb-2.5
              [.al-dark_&]:text-[#f0a878]">
              {isAdmin ? 'Profil administrateur' : 'Espace personnel'}
            </p>
            <h1 className="font-['EB_Garamond',serif] text-[clamp(3rem,6vw,5.6rem)] font-semibold leading-[.92] m-0">
              {user.name}
            </h1>
            <p className="text-[#605850] text-[.95rem] font-bold leading-relaxed mt-4 max-w-3xl
              [.al-dark_&]:text-[#d5c8bc]">
              {isAdmin
                ? 'Gérez vos informations administrateur, votre sécurité et vos coordonnées depuis les données réelles du compte.'
                : 'Gardez vos informations personnelles à jour pour vos formations, paiements et notifications.'}
            </p>
          </div>

          {/* Identity Card */}
          <div className="flex items-center gap-3.5 bg-white border border-[rgba(216,208,200,.72)] rounded-2xl shadow-[0_2px_16px_rgba(58,48,42,.045)] p-4 md:p-5 flex-shrink-0 min-w-[min(360px,100%)] w-full md:w-auto
            [.al-dark_&]:bg-[#241f1a] [.al-dark_&]:border-white/10 [.al-dark_&]:shadow-black/20
            [.a-root--dark_&]:bg-[#201f1f] [.a-root--dark_&]:border-white/10 [.a-root--dark_&]:shadow-black/20">
            <div className="w-[58px] h-[58px] rounded-xl bg-gradient-to-br from-[#c2652a] to-[#e8915a] flex items-center justify-center text-white font-black flex-shrink-0 overflow-hidden">
              {user.avatar_url ? <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" /> : initials}
            </div>
            <div>
              <span className="block text-[#c2652a] text-[.68rem] font-black uppercase tracking-[.12em]
                [.al-dark_&]:text-[#f0a878] [.a-root--dark_&]:text-[#ffb68e]">
                {isAdmin ? 'Administrateur' : 'Étudiant'}
              </span>
              <strong className="block text-[#3a302a] text-[.9rem] mt-1 break-words
                [.al-dark_&]:text-[#f8efe5] [.a-root--dark_&]:text-[#e5e2e1]">{user.email}</strong>
              <small className="block text-[#605850] text-[.78rem] mt-1 [.a-root--dark_&]:text-[#dbc1b5]
                [.al-dark_&]:text-[#d5c8bc]">{user.phone || user.city || 'Coordonnées à compléter'}</small>
            </div>
          </div>
        </section>

        {/* Summary */}
        <section className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3.5" aria-label="Résumé du profil">
          {profileSummary.map(item => (
            <article
              key={item.label}
              className="bg-white border border-[rgba(216,208,200,.72)] rounded-xl shadow-[0_2px_16px_rgba(58,48,42,.045)] p-5
                [.al-dark_&]:bg-[#241f1a] [.al-dark_&]:border-white/10 [.al-dark_&]:shadow-black/20
                [.a-root--dark_&]:bg-[#201f1f] [.a-root--dark_&]:border-white/10 [.a-root--dark_&]:shadow-black/20"
            >
              <span className="block text-[#605850] text-[.68rem] font-black uppercase tracking-[.1em]
                [.al-dark_&]:text-[#d5c8bc] [.a-root--dark_&]:text-[#dbc1b5]">{item.label}</span>
              <strong className="block font-['EB_Garamond',serif] text-4xl font-semibold leading-none mt-3">{item.value}</strong>
              <small className="block text-[#605850] text-[.78rem] mt-2
                [.al-dark_&]:text-[#d5c8bc] [.a-root--dark_&]:text-[#dbc1b5]">{item.sub}</small>
            </article>
          ))}
        </section>

        {/* Profile Form Card */}
        <div className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden
          [.al-dark_&]:bg-[#241f1a] [.al-dark_&]:border-white/10 [.al-dark_&]:shadow-black/20
          [.a-root--dark_&]:bg-[#201f1f] [.a-root--dark_&]:border-white/10 [.a-root--dark_&]:shadow-black/20">
          <UpdateProfileInformationForm 
            mustVerifyEmail={mustVerifyEmail}
            status={status}
          />
        </div>

        {/* Password Form Card */}
        <div className="bg-white rounded-2xl border border-black/5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden
          [.al-dark_&]:bg-[#241f1a] [.al-dark_&]:border-white/10 [.al-dark_&]:shadow-black/20
          [.a-root--dark_&]:bg-[#201f1f] [.a-root--dark_&]:border-white/10 [.a-root--dark_&]:shadow-black/20">
          <UpdatePasswordForm />
        </div>
      </main>

      {/* Minimal CSS for fonts only */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');
      `}</style>
    </Layout>
  );
}
