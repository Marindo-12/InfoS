import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';

export default function DeleteUserForm({ className = '' }: { className?: string }) {
  const [confirming, setConfirming] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const passwordInput = useRef<HTMLInputElement>(null);

  const { data, setData, delete: destroy, processing, reset, errors, clearErrors } = useForm({
    password: '',
  });

  const confirmDeletion = () => {
    setConfirming(true);
    setTimeout(() => passwordInput.current?.focus(), 100);
  };

  const deleteUser: FormEventHandler = (e) => {
    e.preventDefault();
    destroy(route('profile.destroy'), {
      preserveScroll: true,
      onSuccess: () => closeModal(),
      onError: () => passwordInput.current?.focus(),
      onFinish: () => reset(),
    });
  };

  const closeModal = () => {
    setConfirming(false);
    clearErrors();
    reset();
    setShowPassword(false);
  };

  return (
    <div className={`del-wrap ${className}`}>

      {/* Header */}
      <div className="del-header">
        <div className="del-header-left">
          <div className="del-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6"/><path d="M14 11v6"/>
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          </div>
          <div>
            <p className="del-kicker">Zone dangereuse</p>
            <h2 className="del-title">Supprimer le compte</h2>
            <p className="del-sub">
              Une fois votre compte supprimé, toutes vos données seront définitivement effacées.
              Téléchargez toute information utile avant de procéder.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={confirmDeletion}
          className="del-trigger-btn"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M10 11v6"/><path d="M14 11v6"/>
          </svg>
          Supprimer le compte
        </button>
      </div>

      {/* Confirmation modal */}
      {confirming && (
        <div className="del-modal-overlay" onClick={closeModal}>
          <div className="del-modal" onClick={(e) => e.stopPropagation()}>

            {/* Modal header */}
            <div className="del-modal-header">
              <div className="del-modal-icon-wrap">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <button type="button" onClick={closeModal} className="del-modal-close">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <h3 className="del-modal-title">Confirmer la suppression</h3>
            <p className="del-modal-text">
              Cette action est <strong>irréversible</strong>. Toutes vos formations, paiements,
              certificats et données personnelles seront définitivement supprimés.
            </p>
            <p className="del-modal-text">
              Entrez votre mot de passe pour confirmer que vous souhaitez supprimer votre compte.
            </p>

            <form onSubmit={deleteUser}>
              <div className="del-field">
                <label className="del-label">Mot de passe de confirmation</label>
                <div className="del-input-wrap">
                  <span className="del-input-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </span>
                  <input
                    ref={passwordInput}
                    type={showPassword ? 'text' : 'password'}
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    className={`del-input ${errors.password ? 'del-input--err' : ''}`}
                    placeholder="Votre mot de passe actuel"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="del-eye"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && <p className="del-error">{errors.password}</p>}
              </div>

              {/* Actions */}
              <div className="del-modal-actions">
                <button type="button" onClick={closeModal} className="del-cancel-btn">
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={processing || !data.password}
                  className="del-confirm-btn"
                >
                  {processing ? (
                    <svg className="del-spinner" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"
                        strokeDasharray="31.4" strokeDashoffset="10" strokeLinecap="round"/>
                    </svg>
                  ) : (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                    </svg>
                  )}
                  Supprimer définitivement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .del-wrap { font-family: 'Manrope', sans-serif; }

        /* ── Header ── */
        .del-header {
          display: flex; align-items: flex-start; justify-content: space-between;
          gap: 20px; flex-wrap: wrap; padding: 24px 32px;
        }
        .del-header-left { display: flex; align-items: flex-start; gap: 16px; flex: 1; }
        .del-icon {
          width: 42px; height: 42px; border-radius: 12px; flex-shrink: 0;
          background: rgba(239,68,68,.1); color: #ef4444;
          display: flex; align-items: center; justify-content: center;
        }
        .del-kicker {
          font-size: .7rem; font-weight: 800; letter-spacing: .12em;
          text-transform: uppercase; color: #ef4444; margin: 0 0 3px;
        }
        .del-title { margin: 0 0 6px; font-size: 1rem; font-weight: 800; color: #111; }
        .del-sub   { margin: 0; font-size: .82rem; color: #888; line-height: 1.6; max-width: 480px; }

        .del-trigger-btn {
          display: inline-flex; align-items: center; gap: 8px; flex-shrink: 0;
          padding: 10px 18px; border-radius: 12px;
          border: 1.5px solid rgba(239,68,68,.35);
          background: rgba(239,68,68,.06); color: #ef4444;
          font-family: 'Manrope',sans-serif; font-size: .86rem; font-weight: 700;
          cursor: pointer; transition: all .15s; white-space: nowrap;
        }
        .del-trigger-btn:hover {
          background: rgba(239,68,68,.12);
          border-color: rgba(239,68,68,.6);
          box-shadow: 0 4px 12px rgba(239,68,68,.15);
        }

        /* ── Modal overlay ── */
        .del-modal-overlay {
          position: fixed; inset: 0; z-index: 60;
          background: rgba(0,0,0,0.5); backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center; padding: 1rem;
          animation: del-fade-in .2s ease both;
        }
        @keyframes del-fade-in { from { opacity: 0; } to { opacity: 1; } }

        .del-modal {
          position: relative; width: 100%; max-width: 480px;
          background: #fff; border-radius: 22px;
          box-shadow: 0 8px 40px rgba(0,0,0,0.16), 0 0 0 1px rgba(239,68,68,.12);
          padding: 28px;
          animation: del-slide-in .25s cubic-bezier(.22,1,.36,1) both;
        }
        @keyframes del-slide-in {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Top strip */
        .del-modal::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg,#ef4444,#f87171);
          border-radius: 22px 22px 0 0;
        }

        .del-modal-header {
          display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;
        }
        .del-modal-icon-wrap {
          width: 48px; height: 48px; border-radius: 14px;
          background: rgba(239,68,68,.1); color: #ef4444;
          display: flex; align-items: center; justify-content: center;
        }
        .del-modal-close {
          width: 32px; height: 32px; border-radius: 8px;
          background: #f5f5f5; color: #666; border: none;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: background .15s;
        }
        .del-modal-close:hover { background: #ebebeb; color: #111; }

        .del-modal-title {
          margin: 0 0 10px; font-size: 1.1rem; font-weight: 800; color: #111;
        }
        .del-modal-text {
          margin: 0 0 10px; font-size: .84rem; color: #666; line-height: 1.65;
        }
        .del-modal-text strong { color: #ef4444; }

        /* Field */
        .del-field { margin-top: 20px; display: flex; flex-direction: column; gap: 6px; }
        .del-label { font-size: .78rem; font-weight: 700; color: #555; }
        .del-input-wrap { position: relative; display: flex; align-items: center; }
        .del-input-icon {
          position: absolute; left: 12px; color: #bbb;
          display: flex; align-items: center; pointer-events: none;
        }
        .del-input {
          width: 100%; padding: 10px 40px 10px 36px;
          border: 1.5px solid #e2e2e2; border-radius: 10px;
          background: #fafafa; font-family: 'Manrope',sans-serif;
          font-size: .88rem; color: #111; outline: none;
          transition: border-color .15s, box-shadow .15s;
        }
        .del-input:focus { border-color: #ef4444; box-shadow: 0 0 0 3px rgba(239,68,68,.1); }
        .del-input--err { border-color: #ef4444 !important; background: #fff8f8 !important; }
        .del-eye {
          position: absolute; right: 11px; color: #bbb; background: none; border: none;
          cursor: pointer; display: flex; align-items: center; padding: 4px;
          transition: color .15s; border-radius: 6px;
        }
        .del-eye:hover { color: #555; }
        .del-error { font-size: .74rem; color: #ef4444; font-weight: 500; margin: 0; }

        /* Actions */
        .del-modal-actions {
          display: flex; gap: 10px; margin-top: 22px; justify-content: flex-end;
        }
        .del-cancel-btn {
          padding: 10px 18px; border-radius: 10px;
          border: 1.5px solid #e2e2e2; background: #fafafa;
          color: #555; font-family: 'Manrope',sans-serif;
          font-size: .86rem; font-weight: 700; cursor: pointer;
          transition: all .15s;
        }
        .del-cancel-btn:hover { background: #f0f0f0; border-color: #ccc; }

        .del-confirm-btn {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 10px 18px; border-radius: 10px; border: none;
          background: linear-gradient(135deg,#ef4444,#dc2626);
          color: #fff; font-family: 'Manrope',sans-serif;
          font-size: .86rem; font-weight: 800; cursor: pointer;
          box-shadow: 0 4px 12px rgba(239,68,68,.3);
          transition: opacity .15s, transform .1s, box-shadow .15s;
        }
        .del-confirm-btn:hover:not(:disabled) {
          opacity: .92; transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(239,68,68,.4);
        }
        .del-confirm-btn:disabled { opacity: .5; cursor: not-allowed; }

        .del-spinner { width: 15px; height: 15px; animation: del-spin .7s linear infinite; }
        @keyframes del-spin { to { transform: rotate(360deg); } }

        .a-root--dark .del-title,
        .a-root--dark .del-modal-title { color: #e5e2e1; }
        .a-root--dark .del-sub,
        .a-root--dark .del-modal-text,
        .a-root--dark .del-label { color: #dbc1b5; }
        .a-root--dark .del-modal {
          background: #201f1f;
          box-shadow: 0 22px 70px rgba(0,0,0,.48), 0 0 0 1px rgba(255,180,171,.14);
        }
        .a-root--dark .del-modal-close,
        .a-root--dark .del-cancel-btn {
          background: #1c1b1b;
          border-color: rgba(255,255,255,.08);
          color: #dbc1b5;
        }
        .a-root--dark .del-modal-close:hover,
        .a-root--dark .del-cancel-btn:hover {
          background: #353534;
          color: #e5e2e1;
        }
        .a-root--dark .del-input {
          background: #1c1b1b;
          border-color: #554339;
          color: #e5e2e1;
        }
        .a-root--dark .del-input::placeholder { color: #a38c80; }
        .a-root--dark .del-input-icon,
        .a-root--dark .del-eye { color: #a38c80; }
        .a-root--dark .del-eye:hover { color: #ffb4ab; }

        @media (max-width: 600px) {
          .del-header { padding: 20px; flex-direction: column; }
          .del-trigger-btn { width: 100%; justify-content: center; }
          .del-modal { padding: 22px 20px; }
          .del-modal-actions { flex-direction: column-reverse; }
          .del-cancel-btn, .del-confirm-btn { width: 100%; justify-content: center; }
        }
      `}</style>
    </div>
  );
}
