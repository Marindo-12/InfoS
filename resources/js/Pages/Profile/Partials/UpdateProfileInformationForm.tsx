import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';

export default function UpdateProfileInformationForm({
  mustVerifyEmail,
  status,
}: {
  mustVerifyEmail: boolean;
  status?: string;
  className?: string;
}) {
  const user = usePage().props.auth.user as {
    name: string;
    email: string;
    email_verified_at: string | null;
    phone?: string;
    address?: string;
    city?: string;
    avatar?: string;
    avatar_url?: string | null;
  };

  const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<{
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
  }>({
    name:    user.name,
    email:   user.email,
    phone:   user.phone   ?? '',
    address: user.address ?? '',
    city:    user.city    ?? '',
  });

  const avatarRef  = useRef<HTMLInputElement>(null);
  const [avatarProcessing, setAvatarProcessing] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarError(null);
    setAvatarProcessing(true);

    router.post(route('profile.avatar.update'), { avatar: file }, {
      forceFormData: true,
      preserveScroll: true,
      onError: (uploadErrors) => {
        setAvatarError(String(uploadErrors.avatar ?? "Impossible d'enregistrer cet avatar."));
      },
      onFinish: () => {
        setAvatarProcessing(false);
        if (avatarRef.current) {
          avatarRef.current.value = '';
        }
      },
    });
  };

  const removeAvatar = () => {
    setAvatarError(null);
    setAvatarProcessing(true);

    router.delete(route('profile.avatar.destroy'), {
      preserveScroll: true,
      onError: () => setAvatarError("Impossible de supprimer l'avatar."),
      onFinish: () => setAvatarProcessing(false),
    });
  };

  const [firstName, ...rest] = data.name.split(' ');
  const lastName = rest.join(' ');

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    patch(route('profile.update'), {
      preserveScroll: true,
    });
  };

  /* Initials for avatar fallback */
  const initials = user.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="pf-wrap">
      {/* ── Header ── */}
      <div className="pf-header">
        <div>
          <p className="pf-kicker">Informations personnelles</p>
          <h2 className="pf-title">Modifier le profil</h2>
        </div>
        <div className="pf-header-actions">
          <Transition
            show={recentlySuccessful}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <span className="pf-saved-badge">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m5 12 5 5L20 7"/>
              </svg>
              Enregistré
            </span>
          </Transition>
          <button
            type="submit"
            form="profile-form"
            disabled={processing}
            className="pf-save-btn"
          >
            {processing ? (
              <svg className="pf-spinner" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"
                  strokeDasharray="31.4" strokeDashoffset="10" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
              </svg>
            )}
            Enregistrer
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      <form id="profile-form" onSubmit={submit}>
        <div className="pf-body">

          {/* LEFT — avatar + basic fields */}
          <div className="pf-left">
            {/* Avatar */}
            <div className="pf-avatar-wrap">
              <button
                type="button"
                className="pf-avatar"
                onClick={() => avatarRef.current?.click()}
                disabled={avatarProcessing}
                title="Changer la photo"
              >
                {user.avatar_url
                  ? <img src={user.avatar_url} alt="Avatar" className="pf-avatar-img" />
                  : <span className="pf-avatar-initials">{initials}</span>
                }
                <span className={`pf-avatar-overlay ${avatarProcessing ? 'pf-avatar-overlay--show' : ''}`}>
                  {avatarProcessing ? (
                    <svg className="pf-spinner" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"
                        strokeDasharray="31.4" strokeDashoffset="10" strokeLinecap="round"/>
                    </svg>
                  ) : 'Changer'}
                </span>
              </button>
              <button
                type="button"
                className="pf-avatar-btn"
                onClick={() => avatarRef.current?.click()}
                disabled={avatarProcessing}
                title="Changer la photo"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
              {user.avatar_url && (
                <button
                  type="button"
                  className="pf-avatar-delete"
                  onClick={removeAvatar}
                  disabled={avatarProcessing}
                  title="Supprimer l'avatar"
                  aria-label="Supprimer l'avatar"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18"/>
                    <path d="M8 6V4h8v2"/>
                    <path d="M19 6l-1 14H6L5 6"/>
                    <path d="M10 11v5"/>
                    <path d="M14 11v5"/>
                  </svg>
                </button>
              )}
              <input
                ref={avatarRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleAvatarChange}
              />
              {avatarError && <p className="pf-error pf-avatar-error">{avatarError}</p>}
            </div>

            {/* Name row */}
            <div className="pf-row-2">
              <div className="pf-field">
                <label className="pf-label">Prénom</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setData('name', `${e.target.value} ${lastName}`.trim())}
                  className={`pf-input ${errors.name ? 'pf-input--err' : ''}`}
                  placeholder="Prénom"
                  autoComplete="given-name"
                />
              </div>
              <div className="pf-field">
                <label className="pf-label">Nom</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setData('name', `${firstName} ${e.target.value}`.trim())}
                  className={`pf-input ${errors.name ? 'pf-input--err' : ''}`}
                  placeholder="Nom de famille"
                  autoComplete="family-name"
                />
              </div>
            </div>
            {errors.name && <p className="pf-error">{errors.name}</p>}

            {/* Email */}
            <div className="pf-field">
              <label className="pf-label">Email</label>
              <div className="pf-input-icon-wrap">
                <span className="pf-input-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <path d="m2 7 10 7 10-7"/>
                  </svg>
                </span>
                <TextInput
                  type="email"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  className={`pf-input pf-input--icon ${errors.email ? 'pf-input--err' : ''}`}
                  placeholder="votre@email.com"
                  autoComplete="username"
                />
              </div>
              {errors.email && <p className="pf-error">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div className="pf-field">
              <label className="pf-label">Téléphone</label>
              <div className="pf-input-icon-wrap">
                <span className="pf-input-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.6 19a19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 3.12 4.18 2 2 0 0 1 5.09 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L9.91 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </span>
                <input
                  type="tel"
                  value={data.phone}
                  onChange={(e) => setData('phone', e.target.value)}
                  className="pf-input pf-input--icon"
                  placeholder="+212 6..."
                  autoComplete="tel"
                />
              </div>
            </div>

            {/* Address */}
            <div className="pf-field">
              <label className="pf-label">Adresse</label>
              <input
                type="text"
                value={data.address}
                onChange={(e) => setData('address', e.target.value)}
                className="pf-input"
                placeholder="Rue, numéro, quartier..."
              />
            </div>

            {/* City */}
            <div className="pf-field">
              <label className="pf-label">Ville</label>
              <input
                type="text"
                value={data.city}
                onChange={(e) => setData('city', e.target.value)}
                className="pf-input"
                placeholder="Meknès, Rabat..."
              />
            </div>
          </div>

          {/* DIVIDER */}
          <div className="pf-divider" aria-hidden="true" />

          {/* RIGHT — extra fields */}
          <div className="pf-right">

            {/* Email verification notice */}
            {mustVerifyEmail && !user.email_verified_at && (
              <div className="pf-verify-notice">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <div>
                  <p className="pf-verify-text">Adresse email non vérifiée.</p>
                  <Link
                    href={route('verification.send')}
                    method="post"
                    as="button"
                    className="pf-verify-link"
                  >
                    Renvoyer l'email de vérification →
                  </Link>
                </div>
              </div>
            )}

            {status === 'verification-link-sent' && (
              <div className="pf-success-notice">
                Un nouveau lien de vérification a été envoyé à votre adresse email.
              </div>
            )}

            {/* Account info card */}
            <div className="pf-info-card">
              <p className="pf-info-title">Informations du compte</p>
              <div className="pf-info-row">
                <span className="pf-info-label">Identifiant</span>
                <span className="pf-info-val">{user.name}</span>
              </div>
              <div className="pf-info-row">
                <span className="pf-info-label">Email</span>
                <span className="pf-info-val">{user.email}</span>
              </div>
              <div className="pf-info-row">
                <span className="pf-info-label">Statut</span>
                <span className={`pf-status-badge ${user.email_verified_at ? 'pf-status-badge--ok' : 'pf-status-badge--warn'}`}>
                  {user.email_verified_at ? 'Vérifié' : 'Non vérifié'}
                </span>
              </div>
            </div>

            {/* Tips */}
            <div className="pf-tip-card">
              <div className="pf-tip-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 16v-4"/><path d="M12 8h.01"/>
                </svg>
              </div>
              <div>
                <p className="pf-tip-title">Conseils</p>
                <ul className="pf-tip-list">
                  <li>Utilisez un email valide pour recevoir vos notifications.</li>
                  <li>Renseignez votre téléphone pour être contacté par le centre.</li>
                  <li>Votre adresse permet de générer vos documents officiels.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </form>

      <style>{`
        .pf-wrap { font-family: 'Manrope', sans-serif; }

        /* ── Header ── */
        .pf-header {
          display: flex; align-items: flex-start; justify-content: space-between;
          gap: 16px; flex-wrap: wrap;
          padding: 28px 32px 24px;
          border-bottom: 1px solid rgba(0,0,0,0.06);
        }
        .pf-kicker {
          font-size: .72rem; font-weight: 800; letter-spacing: .12em;
          text-transform: uppercase; color: #ff6b2b; margin: 0 0 4px;
        }
        .pf-title {
          margin: 0; font-size: 1.25rem; font-weight: 800; color: #111;
          letter-spacing: -.02em;
        }
        .pf-header-actions { display: flex; align-items: center; gap: 12px; }
        .pf-saved-badge {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: .78rem; font-weight: 700; color: #059669;
          background: #f0fdf4; border: 1px solid #bbf7d0;
          border-radius: 99px; padding: 5px 12px;
        }
        .pf-save-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 10px 20px;
          background: linear-gradient(135deg,#ff7a35,#ff5500);
          color: #fff; border: none; border-radius: 12px;
          font-family: 'Manrope',sans-serif; font-size: .88rem; font-weight: 800;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(255,107,43,.3);
          transition: opacity .15s, transform .1s, box-shadow .15s;
        }
        .pf-save-btn:hover:not(:disabled) {
          opacity: .92; transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(255,107,43,.4);
        }
        .pf-save-btn:disabled { opacity: .6; cursor: not-allowed; }
        .pf-spinner { width: 16px; height: 16px; animation: pf-spin .7s linear infinite; }
        @keyframes pf-spin { to { transform: rotate(360deg); } }

        /* ── Body layout ── */
        .pf-body {
          display: grid;
          grid-template-columns: 1fr 1px 1fr;
          gap: 0;
        }
        .pf-left, .pf-right {
          padding: 28px 32px;
          display: flex; flex-direction: column; gap: 18px;
        }
        .pf-divider { background: rgba(0,0,0,0.06); width: 1px; }

        /* ── Avatar ── */
        .pf-avatar-wrap {
          position: relative; width: 104px; margin: 0 auto 12px;
        }
        .pf-avatar {
          position: relative;
          width: 104px; height: 104px; border-radius: 50%;
          background: linear-gradient(135deg,#ff7a35,#ff9a56);
          display: flex; align-items: center; justify-content: center;
          overflow: hidden;
          border: 4px solid #fff;
          box-shadow: 0 10px 28px rgba(255,107,43,.22), 0 0 0 1px rgba(255,107,43,.18);
          cursor: pointer;
          padding: 0;
          transition: transform .15s, box-shadow .15s;
        }
        .pf-avatar:hover {
          transform: translateY(-1px);
          box-shadow: 0 14px 32px rgba(255,107,43,.28), 0 0 0 1px rgba(255,107,43,.22);
        }
        .pf-avatar:disabled,
        .pf-avatar-btn:disabled,
        .pf-avatar-delete:disabled {
          cursor: wait;
        }
        .pf-avatar-img { width: 100%; height: 100%; object-fit: cover; }
        .pf-avatar-initials {
          font-size: 1.55rem; font-weight: 800; color: #fff; letter-spacing: .03em;
        }
        .pf-avatar-overlay {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          background: rgba(17,17,17,.56);
          color: #fff;
          font-size: .72rem; font-weight: 800;
          opacity: 0;
          transition: opacity .15s;
        }
        .pf-avatar:hover .pf-avatar-overlay,
        .pf-avatar-overlay--show { opacity: 1; }
        .pf-avatar-error {
          width: 220px;
          margin: 8px 0 0;
          transform: translateX(-58px);
          text-align: center;
        }
        .pf-avatar-btn {
          position: absolute; bottom: 2px; right: 2px;
          width: 26px; height: 26px; border-radius: 50%;
          background: #ff6b2b; color: #fff;
          border: 2px solid #fff;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(255,107,43,.4);
          transition: background .15s, transform .1s;
        }
        .pf-avatar-btn:hover { background: #e05a20; transform: scale(1.1); }
        .pf-avatar-delete {
          position: absolute; top: 2px; right: 2px;
          width: 28px; height: 28px; border-radius: 50%;
          background: #111; color: #fff;
          border: 2px solid #fff;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          opacity: 0; transform: scale(.92);
          box-shadow: 0 4px 10px rgba(17,17,17,.28);
          transition: opacity .15s, transform .15s, background .15s;
        }
        .pf-avatar-wrap:hover .pf-avatar-delete,
        .pf-avatar-delete:focus-visible {
          opacity: 1; transform: scale(1);
        }
        .pf-avatar-delete:hover { background: #dc2626; }

        /* ── Fields ── */
        .pf-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .pf-field { display: flex; flex-direction: column; gap: 6px; }
        .pf-label { font-size: .78rem; font-weight: 700; color: #555; letter-spacing: .02em; }

        .pf-input {
          width: 100%; padding: 10px 14px;
          border: 1.5px solid #e2e2e2; border-radius: 10px;
          background: #fafafa;
          font-family: 'Manrope',sans-serif; font-size: .88rem; color: #111;
          outline: none;
          transition: border-color .15s, box-shadow .15s, background .15s;
        }
        .pf-input:focus {
          border-color: #ff6b2b; background: #fff;
          box-shadow: 0 0 0 3px rgba(255,107,43,.11);
        }
        .pf-input--err { border-color: #ef4444 !important; background: #fff8f8 !important; }
        .pf-input--icon { padding-left: 2.6rem !important; }

        .pf-input-icon-wrap { position: relative; }
        .pf-input-icon {
          position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
          color: #bbb; display: flex; align-items: center; pointer-events: none;
        }

        .pf-error {
          font-size: .75rem; color: #ef4444; font-weight: 500; margin: 0;
        }

        /* ── Right side cards ── */
        .pf-verify-notice {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 12px 14px; border-radius: 12px;
          background: #fffbeb; border: 1px solid #fde68a; color: #92400e;
        }
        .pf-verify-text { margin: 0 0 4px; font-size: .82rem; font-weight: 600; }
        .pf-verify-link {
          font-size: .78rem; font-weight: 700; color: #d97706;
          text-decoration: underline; cursor: pointer;
          background: none; border: none; padding: 0;
        }
        .pf-success-notice {
          padding: 12px 14px; border-radius: 12px;
          background: #f0fdf4; border: 1px solid #bbf7d0;
          font-size: .82rem; color: #166534; font-weight: 500;
        }

        .pf-info-card {
          border-radius: 14px; border: 1px solid rgba(0,0,0,0.07);
          background: #fafafa; padding: 16px; display: flex; flex-direction: column; gap: 10px;
        }
        .pf-info-title {
          font-size: .72rem; font-weight: 800; text-transform: uppercase;
          letter-spacing: .1em; color: #ff6b2b; margin: 0;
        }
        .pf-info-row {
          display: flex; align-items: center; justify-content: space-between;
          font-size: .82rem; gap: 8px;
        }
        .pf-info-label { color: #9ca3af; font-weight: 500; }
        .pf-info-val   { color: #111; font-weight: 600; word-break: break-all; text-align: right; }
        .pf-status-badge {
          display: inline-flex; align-items: center;
          padding: 3px 9px; border-radius: 99px;
          font-size: .68rem; font-weight: 800; text-transform: uppercase; letter-spacing: .06em;
        }
        .pf-status-badge--ok   { background: rgba(16,185,129,.12); color: #059669; }
        .pf-status-badge--warn { background: rgba(234,179,8,.12);  color: #b45309; }

        .pf-tip-card {
          display: flex; gap: 12px; padding: 16px;
          border-radius: 14px; border: 1px solid rgba(255,107,43,.15);
          background: #fff9f5;
        }
        .pf-tip-icon {
          width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
          background: rgba(255,107,43,.1); color: #ff6b2b;
          display: flex; align-items: center; justify-content: center;
        }
        .pf-tip-title {
          font-size: .78rem; font-weight: 800; color: #ff6b2b;
          text-transform: uppercase; letter-spacing: .08em; margin: 0 0 6px;
        }
        .pf-tip-list {
          margin: 0; padding-left: 16px;
          display: flex; flex-direction: column; gap: 4px;
        }
        .pf-tip-list li { font-size: .78rem; color: #777; line-height: 1.5; }

        .a-root--dark .pf-header { border-bottom-color: rgba(255,255,255,.08); }
        .a-root--dark .pf-kicker,
        .a-root--dark .pf-info-title,
        .a-root--dark .pf-tip-title { color: #ffb68e; }
        .a-root--dark .pf-title,
        .a-root--dark .pf-info-val { color: #e5e2e1; }
        .a-root--dark .pf-label,
        .a-root--dark .pf-info-label { color: #dbc1b5; }
        .a-root--dark .pf-divider { background: rgba(255,255,255,.08); }
        .a-root--dark .pf-input {
          background: #1c1b1b;
          border-color: #554339;
          color: #e5e2e1;
        }
        .a-root--dark .pf-input::placeholder { color: #a38c80; }
        .a-root--dark .pf-input:focus {
          background: #201f1f;
          border-color: #ffb68e;
          box-shadow: 0 0 0 3px rgba(255,182,142,.12);
        }
        .a-root--dark .pf-input-icon { color: #a38c80; }
        .a-root--dark .pf-avatar { border-color: #201f1f; }
        .a-root--dark .pf-avatar-btn,
        .a-root--dark .pf-avatar-delete { border-color: #201f1f; }
        .a-root--dark .pf-info-card {
          background: #1c1b1b;
          border-color: rgba(255,255,255,.08);
        }
        .a-root--dark .pf-tip-card {
          background: rgba(255,182,142,.08);
          border-color: rgba(255,182,142,.18);
        }
        .a-root--dark .pf-tip-icon { background: rgba(255,182,142,.14); color: #ffb68e; }
        .a-root--dark .pf-tip-list li { color: #dbc1b5; }
        .a-root--dark .pf-saved-badge {
          background: rgba(58,143,95,.16);
          border-color: rgba(125,211,162,.28);
          color: #7dd3a2;
        }
        .a-root--dark .pf-verify-notice {
          background: rgba(217,119,6,.12);
          border-color: rgba(251,191,36,.24);
          color: #facc15;
        }
        .a-root--dark .pf-verify-link { color: #ffb68e; }
        .a-root--dark .pf-success-notice {
          background: rgba(58,143,95,.16);
          border-color: rgba(125,211,162,.28);
          color: #7dd3a2;
        }
        .a-root--dark .pf-status-badge--ok { background: rgba(58,143,95,.16); color: #7dd3a2; }
        .a-root--dark .pf-status-badge--warn { background: rgba(217,119,6,.16); color: #facc15; }

        .al-root.al-dark .pf-header { border-bottom-color: rgba(210,194,181,.12); }
        .al-root.al-dark .pf-kicker,
        .al-root.al-dark .pf-info-title,
        .al-root.al-dark .pf-tip-title { color: #f0a878; }
        .al-root.al-dark .pf-title,
        .al-root.al-dark .pf-info-val { color: #f8efe5; }
        .al-root.al-dark .pf-label,
        .al-root.al-dark .pf-info-label { color: #d5c8bc; }
        .al-root.al-dark .pf-divider { background: rgba(210,194,181,.12); }
        .al-root.al-dark .pf-input {
          background: #1f1a16;
          border-color: #3b3028;
          color: #f8efe5;
        }
        .al-root.al-dark .pf-input::placeholder { color: #a09080; }
        .al-root.al-dark .pf-input:focus {
          background: #241f1a;
          border-color: #f0a878;
          box-shadow: 0 0 0 3px rgba(240,168,120,.12);
        }
        .al-root.al-dark .pf-input-icon { color: #a09080; }
        .al-root.al-dark .pf-avatar { border-color: #241f1a; }
        .al-root.al-dark .pf-avatar-btn,
        .al-root.al-dark .pf-avatar-delete { border-color: #241f1a; }
        .al-root.al-dark .pf-info-card {
          background: #1f1a16;
          border-color: rgba(210,194,181,.12);
        }
        .al-root.al-dark .pf-tip-card {
          background: rgba(240,168,120,.08);
          border-color: rgba(240,168,120,.18);
        }
        .al-root.al-dark .pf-tip-icon { background: rgba(240,168,120,.14); color: #f0a878; }
        .al-root.al-dark .pf-tip-list li { color: #d5c8bc; }
        .al-root.al-dark .pf-saved-badge {
          background: rgba(58,143,95,.16);
          border-color: rgba(125,211,162,.28);
          color: #7dd3a2;
        }
        .al-root.al-dark .pf-verify-notice {
          background: rgba(217,119,6,.12);
          border-color: rgba(251,191,36,.24);
          color: #facc15;
        }
        .al-root.al-dark .pf-verify-link { color: #f0a878; }
        .al-root.al-dark .pf-success-notice {
          background: rgba(58,143,95,.16);
          border-color: rgba(125,211,162,.28);
          color: #7dd3a2;
        }
        .al-root.al-dark .pf-status-badge--ok { background: rgba(58,143,95,.16); color: #7dd3a2; }
        .al-root.al-dark .pf-status-badge--warn { background: rgba(217,119,6,.16); color: #facc15; }

        /* Responsive */
        @media (max-width: 900px) {
          .pf-body { grid-template-columns: 1fr; }
          .pf-divider { width: 100%; height: 1px; }
          .pf-left, .pf-right { padding: 24px 20px; }
        }
        @media (max-width: 500px) {
          .pf-header { padding: 20px 20px 18px; }
          .pf-row-2  { grid-template-columns: 1fr; }
          .pf-save-btn span:last-child { display: none; }
        }
      `}</style>
    </div>
  );
}
