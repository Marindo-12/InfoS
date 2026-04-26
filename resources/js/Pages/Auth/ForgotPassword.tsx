import React from 'react';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import logo from '../../../../public/infos-logo.png'

export default function ForgotPassword({ status }: { status?: string }) {
  const { data, setData, post, processing, errors } = useForm({ email: '' });

  const [touched, setTouched] = React.useState(false);
  const clientEmailError = touched && !data.email ? 'L\'adresse email est requise.' : '';

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    setTouched(true);
    if (!data.email) return;
    post(route('password.email'));
  };

  return (
    <>
      <Head title="Mot de passe oublie" />

      <div className="login-root">
        <div className="blob blob-tr" aria-hidden="true" />
        <div className="blob blob-bl" aria-hidden="true" />

        <div className="login-card">
          {/* Brand */}
          <div className="login-brand">
            <Link href={route('home')}>
              <img src={logo} alt="Info Saloua Logo" className="w-8 h-8" />
            </Link>
            <span className="login-brand-name">Info Saloua</span>
          </div>

          {/* Icon */}
          <div className="fp-icon-wrap" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>

          <h1 className="login-title">Mot de passe oublie ?</h1>
          <p className="login-subtitle">
            Pas de panique. Entrez votre adresse email et nous vous enverrons
            un lien pour reinitialiser votre mot de passe.
          </p>

          {/* Status */}
          {status && (
            <div className="login-status">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ flexShrink: 0 }}>
                <path d="M20 6L9 17l-5-5"/>
              </svg>
              {status}
            </div>
          )}

          <form onSubmit={submit} noValidate className="login-form" style={{ marginTop: '1.25rem' }}>
            {/* Email */}
            <div className="login-field">
              <label htmlFor="email" className="login-label">
                Adresse email
              </label>
              <div className="login-input-wrap">
                <span className="login-input-icon" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <path d="m2 7 10 7 10-7"/>
                  </svg>
                </span>
                <TextInput
                  id="email"
                  type="email"
                  name="email"
                  value={data.email}
                  className={`login-input${(errors.email || clientEmailError) ? ' login-input-error' : ''}`}
                  isFocused={true}
                  placeholder="votre@email.com"
                  onChange={(e) => setData('email', e.target.value)}
                  onBlur={() => setTouched(true)}
                />
              </div>
              <InputError message={errors.email || clientEmailError} className="login-error" />
            </div>

            {/* Submit */}
            <button type="submit" disabled={processing} className="login-submit">
              {processing ? (
                <>
                  <svg className="login-spinner" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"
                      strokeDasharray="31.4" strokeDashoffset="10" strokeLinecap="round"/>
                  </svg>
                  Envoi en cours...
                </>
              ) : (
                <>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4 20-7z"/>
                  </svg>
                  Envoyer le lien de reinitialisation
                </>
              )}
            </button>
          </form>

          {/* Back to login */}
          <div className="fp-back">
            <Link href={route('login')} className="fp-back-link">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
              </svg>
              Retour a la connexion
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;1,400&family=Manrope:wght@400;500;600;700&display=swap');

        .login-root {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          font-family: 'Manrope', sans-serif;
          background: linear-gradient(160deg, #fff9f4 0%, #fff4eb 40%, #fff8f2 70%, #ffffff 100%);
          overflow: hidden;
        }

        .blob {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(1px);
        }
        .blob-tr {
          width: 220px; height: 220px;
          top: -40px; right: -40px;
          background: radial-gradient(circle at 40% 40%, #ff9a56, #ff6b2b, #f5a623);
          opacity: 0.75;
          animation: blob-float 7s ease-in-out infinite;
        }
        .blob-bl {
          width: 130px; height: 130px;
          bottom: 80px; left: 60px;
          background: radial-gradient(circle at 50% 50%, #ffb347, #ff7c2a);
          opacity: 0.55;
          animation: blob-float 9s ease-in-out infinite reverse;
        }
        @keyframes blob-float {
          0%, 100% { transform: translateY(0) scale(1); }
          50%       { transform: translateY(-14px) scale(1.04); }
        }

        .login-card {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 440px;
          background: #ffffff;
          border-radius: 20px;
          padding: 2.5rem 2.5rem 2rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.08), 0 20px 48px rgba(0,0,0,0.06);
          animation: card-in .45s cubic-bezier(.22,1,.36,1) both;
        }
        @keyframes card-in {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .login-brand {
          display: flex; align-items: center; justify-content: center;
          gap: 8px; margin-bottom: 1.5rem;
        }
        .login-brand-dot {
          width: 18px; height: 18px; border-radius: 50%; display: block;
          background: radial-gradient(circle at 35% 35%, #ffb347, #ff6b2b);
        }
        .login-brand-name {
          font-family: 'EB Garamond', serif;
          border-bottom: 2px solid rgba(255,107,43,.2);
          font-size: 1.25rem; font-weight: 600; color: #1a1a1a; letter-spacing: -0.01em;
        }

        /* Lock icon circle */
        .fp-icon-wrap {
          width: 60px; height: 60px; border-radius: 50%;
          background: linear-gradient(135deg, #fff3eb, #ffe5d0);
          border: 1.5px solid rgba(255,107,43,.2);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 1.2rem;
          color: #ff6b2b;
        }

        .login-title {
          font-family: 'Manrope', sans-serif;
          font-size: 1.55rem; font-weight: 700; color: #111;
          text-align: center; margin: 0 0 .4rem; letter-spacing: -0.02em;
        }
        .login-subtitle {
          font-size: .85rem; color: #888; text-align: center;
          margin: 0; line-height: 1.6; max-width: 320px; margin-inline: auto;
        }

        .login-status {
          display: flex; align-items: center; gap: 8px;
          margin-top: 1rem;
          padding: .75rem 1rem;
          border-radius: 10px;
          background: #f0fdf4; border: 1px solid #bbf7d0;
          font-size: .875rem; color: #166534; font-weight: 500;
        }

        .login-form { display: flex; flex-direction: column; gap: 1rem; }
        .login-field { display: flex; flex-direction: column; gap: 6px; }

        .login-label {
          font-size: .82rem; font-weight: 600; color: #444; letter-spacing: .02em;
        }
        .login-input-wrap { position: relative; display: flex; align-items: center; }
        .login-input-icon {
          position: absolute; left: 14px; color: #aaa;
          display: flex; align-items: center; pointer-events: none; z-index: 1;
        }
        .login-input {
          width: 100% !important;
          padding: .75rem 1rem .75rem 2.6rem !important;
          border: 1.5px solid #ddd !important;
          border-radius: 10px !important;
          font-size: .9rem !important;
          font-family: 'Manrope', sans-serif !important;
          color: #111 !important;
          background: #fafafa !important;
          outline: none !important;
          transition: border-color .15s, box-shadow .15s, background .15s !important;
        }
        .login-input:focus {
          border-color: #ff6b2b !important;
          background: #fff !important;
          box-shadow: 0 0 0 3px rgba(255,107,43,.12) !important;
        }
        .login-input-error {
          border-color: #ef4444 !important;
          background: #fff8f8 !important;
        }
        .login-input-error:focus {
          border-color: #ef4444 !important;
          box-shadow: 0 0 0 3px rgba(239,68,68,.12) !important;
        }
        .login-input::placeholder { color: #bbb !important; }
        .login-error { font-size: .78rem !important; color: #dc2626 !important; margin-top: 4px !important; display: block !important; }
        .login-error p { font-size: .78rem !important; color: #dc2626 !important; margin: 0 !important; }

        .login-submit {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          width: 100%; padding: .85rem 1rem;
          border: none; border-radius: 12px;
          background: linear-gradient(135deg, #ff7a35 0%, #ff5500 100%);
          color: #fff;
          font-family: 'Manrope', sans-serif;
          font-size: .95rem; font-weight: 700; letter-spacing: .01em;
          cursor: pointer;
          transition: opacity .15s, transform .1s, box-shadow .15s;
          box-shadow: 0 4px 14px rgba(255,107,43,.35);
        }
        .login-submit:hover:not(:disabled) {
          opacity: .92; transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(255,107,43,.45);
        }
        .login-submit:active:not(:disabled) { transform: translateY(0); }
        .login-submit:disabled { opacity: .6; cursor: not-allowed; }

        .login-spinner {
          width: 18px; height: 18px;
          animation: spin .7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Back link */
        .fp-back { margin-top: 1.5rem; text-align: center; }
        .fp-back-link {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: .84rem; font-weight: 500; color: #888;
          text-decoration: none;
          transition: color .15s;
        }
        .fp-back-link:hover { color: #ff6b2b; }
      `}</style>
    </>
  );
}