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
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Manrope,sans-serif' }}>
            <span style={{ fontSize: '.8rem', color: '#b0a49a' }}>Administration</span>
            <span style={{ color: '#b0a49a', fontSize: '.8rem' }}>/</span>
            <span style={{ fontSize: '.82rem', fontWeight: 700, color: '#1a1612' }}>Profil</span>
          </div>
        ) : <h2>Mon Profil</h2>
      }
    >
      <Head title="Profil" />

      <main className={`prof-page ${isAdmin ? 'prof-page--admin' : ''}`}>
        <section className="prof-hero">
          <div>
            <p className="prof-kicker">{isAdmin ? 'Profil administrateur' : 'Espace personnel'}</p>
            <h1>{user.name}</h1>
            <p>
              {isAdmin
                ? 'Gerez vos informations administrateur, votre securite et vos coordonnees depuis les donnees reelles du compte.'
                : 'Gardez vos informations personnelles a jour pour vos formations, paiements et notifications.'}
            </p>
          </div>

          <div className="prof-identity-card">
            <div className="prof-avatar">
              {user.avatar_url ? <img src={user.avatar_url} alt={user.name} /> : initials}
            </div>
            <div>
              <span>{isAdmin ? 'Administrateur' : 'Etudiant'}</span>
              <strong>{user.email}</strong>
              <small>{user.phone || user.city || 'Coordonnees a completer'}</small>
            </div>
          </div>
        </section>

        <section className="prof-summary" aria-label="Resume du profil">
          {profileSummary.map(item => (
            <article key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <small>{item.sub}</small>
            </article>
          ))}
        </section>

        <div className="prof-card">
          <UpdateProfileInformationForm 
                mustVerifyEmail={mustVerifyEmail}
                status={status}
          />
        </div>

        <div className="prof-card">
          <UpdatePasswordForm />
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');

        .prof-page {
          display: flex; flex-direction: column; gap: 20px;
          font-family: 'Manrope', sans-serif;
          width: 100%; min-width: 0;
          box-sizing: border-box;
          min-height: calc(100vh - 64px);
        }
        .prof-page *, .prof-page *::before, .prof-page *::after { box-sizing: border-box; }

        .prof-page--admin {
          --prof-bg: #faf5ee;
          --prof-surface: #ffffff;
          --prof-soft: #f6f0e8;
          --prof-line: rgba(216,208,200,.72);
          --prof-text: #3a302a;
          --prof-muted: #605850;
          --prof-primary: #c2652a;
          gap: 26px;
          padding: 42px clamp(18px, 4vw, 48px) 58px;
          background-color: var(--prof-bg);
          background-image: radial-gradient(rgba(216, 208, 200, .72) .6px, transparent .6px);
          background-size: 24px 24px;
          color: var(--prof-text);
        }

        .prof-card {
          background: #fff;
          border-radius: 20px;
          border: 1px solid rgba(0,0,0,0.07);
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
          overflow: hidden;
        }
        .prof-page--admin .prof-card {
          background: var(--prof-surface);
          border-color: var(--prof-line);
          border-radius: 14px;
          box-shadow: 0 2px 16px rgba(58,48,42,.045);
        }
        .prof-card--danger { border-color: rgba(239,68,68,0.15); }

        .prof-hero {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
        }
        .prof-kicker {
          color: var(--prof-primary, #ff6b2b);
          font-size: .72rem;
          font-weight: 900;
          letter-spacing: .16em;
          margin: 0 0 10px;
          text-transform: uppercase;
        }
        .prof-hero h1 {
          font-family: 'EB Garamond', serif;
          font-size: clamp(3rem, 6vw, 5.6rem);
          font-weight: 600;
          line-height: .92;
          margin: 0;
        }
        .prof-hero p:not(.prof-kicker) {
          color: var(--prof-muted, #605850);
          font-size: .95rem;
          font-weight: 700;
          line-height: 1.65;
          margin: 18px 0 0;
          max-width: 760px;
        }
        .prof-identity-card {
          align-items: center;
          background: var(--prof-surface, #fff);
          border: 1px solid var(--prof-line, rgba(216,208,200,.72));
          border-radius: 14px;
          box-shadow: 0 2px 16px rgba(58,48,42,.045);
          display: flex;
          flex-shrink: 0;
          gap: 14px;
          min-width: min(360px, 100%);
          padding: 18px;
        }
        .prof-avatar {
          align-items: center;
          background: linear-gradient(135deg, #c2652a, #e8915a);
          border-radius: 12px;
          color: #fff;
          display: flex;
          flex-shrink: 0;
          font-weight: 900;
          height: 58px;
          justify-content: center;
          overflow: hidden;
          width: 58px;
        }
        .prof-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .prof-identity-card span {
          color: var(--prof-primary, #c2652a);
          display: block;
          font-size: .68rem;
          font-weight: 900;
          letter-spacing: .12em;
          text-transform: uppercase;
        }
        .prof-identity-card strong {
          color: var(--prof-text, #3a302a);
          display: block;
          font-size: .9rem;
          margin-top: 4px;
          word-break: break-word;
        }
        .prof-identity-card small {
          color: var(--prof-muted, #605850);
          display: block;
          font-size: .78rem;
          margin-top: 4px;
        }
        .prof-summary {
          display: grid;
          gap: 14px;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        }
        .prof-summary article {
          background: var(--prof-surface, #fff);
          border: 1px solid var(--prof-line, rgba(216,208,200,.72));
          border-radius: 12px;
          box-shadow: 0 2px 16px rgba(58,48,42,.045);
          padding: 20px;
        }
        .prof-summary span {
          color: var(--prof-muted, #605850);
          display: block;
          font-size: .68rem;
          font-weight: 900;
          letter-spacing: .1em;
          text-transform: uppercase;
        }
        .prof-summary strong {
          display: block;
          font-family: 'EB Garamond', serif;
          font-size: 2rem;
          font-weight: 600;
          line-height: 1;
          margin-top: 12px;
        }
        .prof-summary small {
          color: var(--prof-muted, #605850);
          display: block;
          font-size: .78rem;
          margin-top: 8px;
        }

        .a-root--dark .prof-page { color: #e5e2e1; }
        .a-root--dark .prof-card {
          background: #201f1f;
          border-color: rgba(255,255,255,.08);
          box-shadow: 0 12px 32px rgba(0,0,0,.24);
        }
        .a-root--dark .prof-card--danger { border-color: rgba(255,180,171,.22); }
        .al-root.al-dark .prof-page--admin {
          --prof-bg: #14110f;
          --prof-surface: #241f1a;
          --prof-soft: #1f1a16;
          --prof-line: rgba(210,194,181,.16);
          --prof-text: #f8efe5;
          --prof-muted: #d5c8bc;
          --prof-primary: #f0a878;
          background-image: radial-gradient(rgba(210, 194, 181, .12) .6px, transparent .6px);
        }
        .al-root.al-dark .prof-card,
        .al-root.al-dark .prof-identity-card,
        .al-root.al-dark .prof-summary article {
          background: var(--prof-surface);
          border-color: var(--prof-line);
          box-shadow: 0 12px 32px rgba(0,0,0,.22);
        }

        @media (max-width: 900px) {
          .prof-page--admin { padding: 30px 16px 44px; }
          .prof-hero { align-items: flex-start; flex-direction: column; }
          .prof-identity-card { width: 100%; }
        }
      `}</style>
    </Layout>
  );
}
