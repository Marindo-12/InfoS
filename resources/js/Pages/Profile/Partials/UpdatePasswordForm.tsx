import InputError from '@/Components/InputError';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';

export default function UpdatePasswordForm({ className = '' }: { className?: string }) {
  const passwordInput         = useRef<HTMLInputElement>(null);
  const currentPasswordInput  = useRef<HTMLInputElement>(null);

  const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  /* Show/hide toggles */
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew,     setShowNew]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  /* Password strength */
  const strength = (() => {
    const p = data.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();
  const strengthLabel = ['', 'Faible', 'Moyen', 'Bon', 'Fort'][strength];
  const strengthColor = ['', '#ef4444', '#f59e0b', '#3b82f6', '#10b981'][strength];

  const updatePassword: FormEventHandler = (e) => {
    e.preventDefault();
    put(route('password.update'), {
      preserveScroll: true,
      onSuccess: () => reset(),
      onError: (errs) => {
        if (errs.password) { reset('password', 'password_confirmation'); passwordInput.current?.focus(); }
        if (errs.current_password) { reset('current_password'); currentPasswordInput.current?.focus(); }
      },
    });
  };

  const EyeIcon = ({ show }: { show: boolean }) => show ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );

  return (
    <div className={`pw-wrap ${className}`}>
      {/* Header */}
      <div className="pw-header">
        <div>
          <p className="pw-kicker">Sécurité</p>
          <h2 className="pw-title">Modifier le mot de passe</h2>
          <p className="pw-sub">Utilisez un mot de passe long et aléatoire pour protéger votre compte.</p>
        </div>
        <Transition
          show={recentlySuccessful}
          enter="transition ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100"
          leave="transition ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0"
        >
          <span className="pw-saved-badge">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m5 12 5 5L20 7"/>
            </svg>
            Enregistré
          </span>
        </Transition>
      </div>

      {/* Form */}
      <form onSubmit={updatePassword} className="pw-body">
        <div className="pw-grid">

          {/* Current password */}
          <div className="pw-field">
            <label className="pw-label">Mot de passe actuel</label>
            <div className="pw-input-wrap">
              <span className="pw-input-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input
                ref={currentPasswordInput}
                type={showCurrent ? 'text' : 'password'}
                value={data.current_password}
                onChange={(e) => setData('current_password', e.target.value)}
                className={`pw-input ${errors.current_password ? 'pw-input--err' : ''}`}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button type="button" className="pw-eye" onClick={() => setShowCurrent(!showCurrent)}>
                <EyeIcon show={showCurrent} />
              </button>
            </div>
            {errors.current_password && <p className="pw-error">{errors.current_password}</p>}
          </div>

          {/* New password */}
          <div className="pw-field">
            <label className="pw-label">Nouveau mot de passe</label>
            <div className="pw-input-wrap">
              <span className="pw-input-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </span>
              <input
                ref={passwordInput}
                type={showNew ? 'text' : 'password'}
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                className={`pw-input ${errors.password ? 'pw-input--err' : ''}`}
                placeholder="Minimum 8 caractères"
                autoComplete="new-password"
              />
              <button type="button" className="pw-eye" onClick={() => setShowNew(!showNew)}>
                <EyeIcon show={showNew} />
              </button>
            </div>
            {errors.password && <p className="pw-error">{errors.password}</p>}

            {/* Strength meter */}
            {data.password && (
              <div className="pw-strength">
                <div className="pw-strength-bars">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="pw-bar"
                      style={{ background: i <= strength ? strengthColor : '#e5e5e5' }}/>
                  ))}
                </div>
                <span className="pw-strength-label" style={{ color: strengthColor }}>
                  {strengthLabel}
                </span>
              </div>
            )}
          </div>

          {/* Confirm */}
          <div className="pw-field">
            <label className="pw-label">Confirmer le nouveau mot de passe</label>
            <div className="pw-input-wrap">
              <span className="pw-input-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
                </svg>
              </span>
              <input
                type={showConfirm ? 'text' : 'password'}
                value={data.password_confirmation}
                onChange={(e) => setData('password_confirmation', e.target.value)}
                className={`pw-input ${
                  errors.password_confirmation ||
                  (data.password_confirmation && data.password !== data.password_confirmation)
                    ? 'pw-input--err' : ''
                }`}
                placeholder="Répétez le mot de passe"
                autoComplete="new-password"
              />
              <button type="button" className="pw-eye" onClick={() => setShowConfirm(!showConfirm)}>
                <EyeIcon show={showConfirm} />
              </button>
            </div>
            {errors.password_confirmation && <p className="pw-error">{errors.password_confirmation}</p>}
            {!errors.password_confirmation &&
              data.password_confirmation &&
              data.password !== data.password_confirmation && (
              <p className="pw-error">Les mots de passe ne correspondent pas.</p>
            )}
            {data.password_confirmation && data.password === data.password_confirmation && data.password && (
              <p className="pw-match">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m5 12 5 5L20 7"/>
                </svg>
                Les mots de passe correspondent
              </p>
            )}
          </div>
        </div>

        <div className="pw-footer">
          <button type="submit" disabled={processing} className="pw-submit-btn">
            {processing ? (
              <svg className="pw-spinner" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"
                  strokeDasharray="31.4" strokeDashoffset="10" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            )}
            Mettre à jour le mot de passe
          </button>
        </div>
      </form>

      <style>{`
        .pw-wrap { font-family: 'Manrope', sans-serif; }
        .pw-header {
          display: flex; align-items: flex-start; justify-content: space-between;
          gap: 16px; flex-wrap: wrap; padding: 28px 32px 0;
        }
        .pw-kicker { font-size: .72rem; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; color: #ff6b2b; margin: 0 0 4px; }
        .pw-title  { margin: 0 0 4px; font-size: 1.1rem; font-weight: 800; color: #111; letter-spacing: -.015em; }
        .pw-sub    { margin: 0; font-size: .82rem; color: #888; }
        .pw-saved-badge {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: .78rem; font-weight: 700; color: #059669;
          background: #f0fdf4; border: 1px solid #bbf7d0;
          border-radius: 99px; padding: 5px 12px; white-space: nowrap;
        }
        .pw-body { padding: 24px 32px 28px; }
        .pw-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 18px; }
        .pw-field { display: flex; flex-direction: column; gap: 6px; }
        .pw-label { font-size: .78rem; font-weight: 700; color: #555; }
        .pw-input-wrap { position: relative; display: flex; align-items: center; }
        .pw-input-icon {
          position: absolute; left: 12px; color: #bbb;
          display: flex; align-items: center; pointer-events: none; z-index: 1;
        }
        .pw-input {
          width: 100%; padding: 10px 40px 10px 36px;
          border: 1.5px solid #e2e2e2; border-radius: 10px;
          background: #fafafa; font-family: 'Manrope',sans-serif;
          font-size: .88rem; color: #111; outline: none;
          transition: border-color .15s, box-shadow .15s, background .15s;
        }
        .pw-input:focus { border-color: #ff6b2b; background: #fff; box-shadow: 0 0 0 3px rgba(255,107,43,.11); }
        .pw-input--err { border-color: #ef4444 !important; background: #fff8f8 !important; }
        .pw-eye {
          position: absolute; right: 11px; color: #bbb; background: none; border: none;
          cursor: pointer; display: flex; align-items: center; padding: 4px;
          transition: color .15s; border-radius: 6px;
        }
        .pw-eye:hover { color: #555; }
        .pw-error { font-size: .74rem; color: #ef4444; font-weight: 500; margin: 0; }
        .pw-match { font-size: .74rem; color: #059669; font-weight: 600; margin: 0; display: flex; align-items: center; gap: 4px; }
        .pw-strength { display: flex; align-items: center; gap: 8px; margin-top: 4px; }
        .pw-strength-bars { display: flex; gap: 4px; flex: 1; }
        .pw-bar { height: 4px; flex: 1; border-radius: 99px; transition: background .3s; }
        .pw-strength-label { font-size: .72rem; font-weight: 700; white-space: nowrap; min-width: 40px; }
        .pw-footer { display: flex; align-items: center; gap: 14px; margin-top: 24px; }
        .pw-submit-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 11px 22px; background: linear-gradient(135deg,#ff7a35,#ff5500);
          color: #fff; border: none; border-radius: 12px;
          font-family: 'Manrope',sans-serif; font-size: .88rem; font-weight: 800;
          cursor: pointer; box-shadow: 0 4px 14px rgba(255,107,43,.28);
          transition: opacity .15s, transform .1s, box-shadow .15s;
        }
        .pw-submit-btn:hover:not(:disabled) { opacity: .92; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(255,107,43,.38); }
        .pw-submit-btn:disabled { opacity: .6; cursor: not-allowed; }
        .pw-spinner { width: 15px; height: 15px; animation: pw-spin .7s linear infinite; }
        @keyframes pw-spin { to { transform: rotate(360deg); } }
        .a-root--dark .pw-kicker { color: #ffb68e; }
        .a-root--dark .pw-title { color: #e5e2e1; }
        .a-root--dark .pw-sub,
        .a-root--dark .pw-label { color: #dbc1b5; }
        .a-root--dark .pw-input {
          background: #1c1b1b;
          border-color: #554339;
          color: #e5e2e1;
        }
        .a-root--dark .pw-input::placeholder { color: #a38c80; }
        .a-root--dark .pw-input:focus {
          background: #201f1f;
          border-color: #ffb68e;
          box-shadow: 0 0 0 3px rgba(255,182,142,.12);
        }
        .a-root--dark .pw-input-icon,
        .a-root--dark .pw-eye { color: #a38c80; }
        .a-root--dark .pw-eye:hover { color: #ffb68e; }
        .a-root--dark .pw-saved-badge {
          background: rgba(58,143,95,.16);
          border-color: rgba(125,211,162,.28);
          color: #7dd3a2;
        }
        .a-root--dark .pw-bar { background: #353534; }
        .a-root--dark .pw-match { color: #7dd3a2; }
        .al-root.al-dark .pw-kicker { color: #f0a878; }
        .al-root.al-dark .pw-title { color: #f8efe5; }
        .al-root.al-dark .pw-sub,
        .al-root.al-dark .pw-label { color: #d5c8bc; }
        .al-root.al-dark .pw-input {
          background: #1f1a16;
          border-color: #3b3028;
          color: #f8efe5;
        }
        .al-root.al-dark .pw-input::placeholder { color: #a09080; }
        .al-root.al-dark .pw-input:focus {
          background: #241f1a;
          border-color: #f0a878;
          box-shadow: 0 0 0 3px rgba(240,168,120,.12);
        }
        .al-root.al-dark .pw-input-icon,
        .al-root.al-dark .pw-eye { color: #a09080; }
        .al-root.al-dark .pw-eye:hover { color: #f0a878; }
        .al-root.al-dark .pw-saved-badge {
          background: rgba(58,143,95,.16);
          border-color: rgba(125,211,162,.28);
          color: #7dd3a2;
        }
        .al-root.al-dark .pw-bar { background: #3b3028; }
        .al-root.al-dark .pw-match { color: #7dd3a2; }
        @media (max-width: 900px) { .pw-grid { grid-template-columns: 1fr; } }
        @media (max-width: 500px) { .pw-header, .pw-body { padding-left: 20px; padding-right: 20px; } }
      `}</style>
    </div>
  );
}
