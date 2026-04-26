import React from 'react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import logo from '../../../../public/infos-logo.png'

/* ─── Google icon SVG ─── */
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function Login({
  status,
  canResetPassword,
}: {
  status?: string;
  canResetPassword: boolean;
}) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    remember: false as boolean,
  });

  // Client-side validation (shown only after form submission attempt)
  const [submitted, setSubmitted] = React.useState(false);
  const clientErrors = {
    email:    submitted && !data.email    ? 'L\'adresse email est requise.' : '',
    password: submitted && !data.password ? 'Le mot de passe est requis.'   : '',
  };

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (!data.email || !data.password) return;
    post(route('login'), { onFinish: () => reset('password') });
  };

  return (
    <>
      <Head title="Connexion" />

      <div className="login-root">
        {/* Decorative blobs — inspired by Mangools */}
        <div className="blob blob-tr" aria-hidden="true" />
        <div className="blob blob-bl" aria-hidden="true" />

        {/* Card */}
        <div className="login-card">
          {/* Logo / brand */}
          <div className="login-brand">
            <Link href={route('home')} className='flex items-center gap-2'>
              <img src={logo} alt="Info Saloua Logo" className="w-8 h-8" />
              <span className="login-brand-name">Info Saloua</span>
            </Link>
          </div>

          <h1 className="login-title">Bon retour parmi nous</h1>
          <p className="login-subtitle">Connectez-vous pour acceder a votre espace</p>

          {/* Status message */}
          {status && (
            <div className="login-status">
              {status}
            </div>
          )}

          {/* Google button */}
          <a href={route('about')} className="login-google-btn">
            <GoogleIcon />
            <span>Continuer avec Google</span>
          </a>

          {/* Divider */}
          <div className="login-divider">
            <span>ou</span>
          </div>

          {/* Form */}
          <form onSubmit={submit} noValidate className="login-form">

            {/* Email */}
            <div className="login-field">
              <InputLabel htmlFor="email" value="Adresse email" className="login-label" />
              <div className="login-input-wrap">
                <span className="login-input-icon" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                  </svg>
                </span>
                <TextInput
                  id="email"
                  type="email"
                  name="email"
                  value={data.email}
                  className={`login-input${(errors.email || clientErrors.email) ? ' login-input-error' : ''}`}
                  autoComplete="username"
                  isFocused={true}
                  placeholder="ex: sarah@exemple.com"
                  onChange={(e) => setData('email', e.target.value)}
                />
              </div>
              <InputError message={errors.email || clientErrors.email} className="login-error" />
            </div>

            {/* Password */}
            <div className="login-field">
              <InputLabel htmlFor="password" value="Mot de passe" className="login-label" />
              <div className="login-input-wrap">
                <span className="login-input-icon" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <TextInput
                  id="password"
                  type="password"
                  name="password"
                  value={data.password}
                  className={`login-input${(errors.password || clientErrors.password) ? ' login-input-error' : ''}`}
                  autoComplete="current-password"
                  placeholder="Votre mot de passe"
                  onChange={(e) => setData('password', e.target.value)}
                />
              </div>
              <InputError message={errors.password || clientErrors.password} className="login-error" />
            </div>

            {/* Remember + Forgot */}
            <div className="login-row">
              <label className="login-remember">
                <Checkbox
                  name="remember"
                  checked={data.remember}
                  onChange={(e) => setData('remember', (e.target.checked || false) as false)}
                  className="login-checkbox"
                />
                <span>Se souvenir de moi</span>
              </label>

              {canResetPassword && (
                <Link href={route('password.request')} className="login-forgot">
                  Mot de passe oublie ?
                </Link>
              )}
            </div>

            {/* Submit */}
            <button type="submit" disabled={processing} className="login-submit">
              {processing ? (
                <>
                  <svg className="login-spinner" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="10" strokeLinecap="round"/>
                  </svg>
                  Connexion...
                </>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          {/* Register link */}
          <p className="login-register">
            Pas encore de compte ?{' '}
            <p className="login-register-link">
              Veuillez s'isncrire pour acceder a votre espace
            </p>
          </p>
        </div>
      </div>

      <style>{`
        /* ── Google Fonts ── */
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;1,400&family=Manrope:wght@400;500;600;700&display=swap');

        /* ── Root layout ── */
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

        /* ── Decorative blobs ── */
        .blob {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(1px);
        }
        .blob-tr {
          width: 220px;
          height: 220px;
          top: -40px;
          right: -40px;
          background: radial-gradient(circle at 40% 40%, #ff9a56, #ff6b2b, #f5a623);
          opacity: 0.75;
          animation: blob-float 7s ease-in-out infinite;
        }
        .blob-bl {
          width: 130px;
          height: 130px;
          bottom: 80px;
          left: 60px;
          background: radial-gradient(circle at 50% 50%, #ffb347, #ff7c2a);
          opacity: 0.55;
          animation: blob-float 9s ease-in-out infinite reverse;
        }
        @keyframes blob-float {
          0%, 100% { transform: translateY(0) scale(1); }
          50%       { transform: translateY(-14px) scale(1.04); }
        }

        /* ── Card ── */
        .login-card {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 440px;
          background: #ffffff;
          border-radius: 20px;
          padding: 2.5rem 2.5rem 2rem;
          box-shadow:
            0 2px 4px rgba(0,0,0,0.04),
            0 8px 24px rgba(0,0,0,0.08),
            0 20px 48px rgba(0,0,0,0.06);
          animation: card-in .45s cubic-bezier(.22,1,.36,1) both;
        }
        @keyframes card-in {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Brand ── */
        .login-brand {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 1.5rem;
        }
        .login-brand-dot {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #ffb347, #ff6b2b);
          display: block;
        }
        .login-brand-name {
          font-family: 'EB Garamond', serif;
          font-size: 1.25rem;
          font-weight: 600;
          border-bottom: 2px solid #ff6b2b;
          color: #1a1a1a;
          letter-spacing: -0.01em;
        }

        /* ── Titles ── */
        .login-title {
          font-family: "Playwrite DE SAS", cursive;
          font-size: 1.6rem;
          font-weight: 700;
          color: #111;
          text-align: center;
          margin: 0 0 .4rem;
          letter-spacing: -0.02em;
        }
        .login-subtitle {
          font-size: .875rem;
          color: #888;
          text-align: center;
          margin: 0 0 1.5rem;
        }

        /* ── Status ── */
        .login-status {
          margin-bottom: 1rem;
          padding: .75rem 1rem;
          border-radius: 10px;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          font-size: .875rem;
          color: #166534;
          font-weight: 500;
          text-align: center;
        }

        /* ── Google button ── */
        .login-google-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: .8rem 1rem;
          border: 1.5px solid #e2e2e2;
          border-radius: 12px;
          background: #fff;
          font-size: .9rem;
          font-weight: 600;
          color: #333;
          text-decoration: none;
          cursor: pointer;
          transition: background .15s, border-color .15s, box-shadow .15s, transform .1s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
        }
        .login-google-btn:hover {
          background: #fafafa;
          border-color: #ccc;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transform: translateY(-1px);
        }
        .login-google-btn:active { transform: translateY(0); }

        /* ── Divider ── */
        .login-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 1.25rem 0;
          color: #bbb;
          font-size: .8rem;
          font-weight: 500;
          letter-spacing: .05em;
        }
        .login-divider::before,
        .login-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #ebebeb;
        }

        /* ── Form ── */
        .login-form { display: flex; flex-direction: column; gap: 1rem; }

        .login-field { display: flex; flex-direction: column; gap: 6px; }

        .login-label {
          font-size: .82rem !important;
          font-weight: 600 !important;
          color: #444 !important;
          letter-spacing: .02em;
        }

        .login-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .login-input-icon {
          position: absolute;
          left: 14px;
          color: #aaa;
          display: flex;
          align-items: center;
          pointer-events: none;
          z-index: 1;
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

        .login-error {
          font-size: .78rem !important;
          color: #dc2626 !important;
          margin-top: 2px !important;
        }

        /* ── Remember + forgot row ── */
        .login-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 10px;
        }
        .login-remember {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: .82rem;
          color: #666;
          cursor: pointer;
          user-select: none;
        }
        .login-checkbox {
          width: 16px !important;
          height: 16px !important;
          border-radius: 4px !important;
          border-color: #ccc !important;
          accent-color: #ff6b2b;
          cursor: pointer;
        }
        .login-forgot {
          font-size: .82rem;
          color: #ff6b2b;
          text-decoration: underline;
          text-underline-offset: 3px;
          text-decoration-color: rgba(255,107,43,.4);
          font-weight: 500;
          transition: color .15s;
        }
        .login-forgot:hover { color: #e05a20; text-decoration-color: #e05a20; }

        /* ── Submit button ── */
        .login-submit {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: .85rem 1rem;
          margin-top: .25rem;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, #ff7a35 0%, #ff5500 100%);
          color: #fff;
          font-family: 'Manrope', sans-serif;
          font-size: .95rem;
          font-weight: 700;
          letter-spacing: .01em;
          cursor: pointer;
          transition: opacity .15s, transform .1s, box-shadow .15s;
          box-shadow: 0 4px 14px rgba(255,107,43,.35);
        }
        .login-submit:hover:not(:disabled) {
          opacity: .92;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(255,107,43,.45);
        }
        .login-submit:active:not(:disabled) { transform: translateY(0); }
        .login-submit:disabled { opacity: .6; cursor: not-allowed; }

        /* ── Spinner ── */
        .login-spinner {
          width: 18px;
          height: 18px;
          animation: spin .7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Register link ── */
        .login-register {
          margin-top: 1.5rem;
          text-align: center;
          font-size: .84rem;
          color: #888;
        }
        .login-register-link {
          color: #ff6b2b;
          font-weight: 600;
          text-underline-offset: 3px;
          text-decoration-color: rgba(255,107,43,.4);
          transition: color .15s;
        }
        .login-register-link:hover { color: #e05a20; }
      `}</style>
    </>
  );
}