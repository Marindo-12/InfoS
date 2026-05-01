import React, { useRef, useState, useEffect, FormEventHandler } from 'react';
import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import logo from '../../../../public/infos-logo.png';

export default function LoginCode({ email, status }: { email: string; status?: string }) {
  const { data, setData, post, processing, errors } = useForm({ code: '' });

  /* ── 6 individual digit inputs ── */
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [filled, setFilled] = useState(false);
  const [shake, setShake] = useState(false);

  /* Sync digits array → form data */
  useEffect(() => {
    const code = digits.join('');
    setData('code', code);
    setFilled(code.length === 6);
  }, [digits]);

  /* Trigger shake on server error */
  useEffect(() => {
    if (errors.code) {
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  }, [errors.code]);

  const handleDigit = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    if (digit && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (digits[index]) {
        const next = [...digits]; next[index] = ''; setDigits(next);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  /* Paste handler */
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const next = [...digits];
    pasted.split('').forEach((d, i) => { next[i] = d; });
    setDigits(next);
    const lastFilled = Math.min(pasted.length, 5);
    inputRefs.current[lastFilled]?.focus();
  };

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    if (data.code.length < 6) return;
    post(route('login-code.store'));
  };

  /* Resend timer */
  const [resendSeconds, setResendSeconds] = useState(59);
  const [canResend, setCanResend] = useState(false);
  useEffect(() => {
    if (resendSeconds <= 0) { setCanResend(true); return; }
    const t = setTimeout(() => setResendSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendSeconds]);

  const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, (_, a, b, c) => a + '*'.repeat(b.length) + c);

  return (
    <>
      <Head title="Vérification de connexion" />

      <div className="lc-root">
        {/* ── Animated background particles ── */}
        <div className="lc-bg" aria-hidden="true">
          {/* Orbiting rings */}
          <div className="lc-ring lc-ring-1" />
          <div className="lc-ring lc-ring-2" />
          <div className="lc-ring lc-ring-3" />

          {/* Blobs */}
          <div className="lc-blob lc-blob-1" />
          <div className="lc-blob lc-blob-2" />
          <div className="lc-blob lc-blob-3" />

          {/* Floating dots */}
          {[...Array(12)].map((_, i) => (
            <div key={i} className="lc-dot" style={{
              '--i': i,
              left: `${8 + (i * 7.5) % 84}%`,
              top:  `${12 + (i * 11.3) % 76}%`,
            } as React.CSSProperties} />
          ))}

          {/* Grid lines */}
          <svg className="lc-grid-svg" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
            {[0,1,2,3,4,5,6,7].map(i => (
              <line key={`v${i}`} x1={i*120} y1="0" x2={i*120} y2="600"
                stroke="rgba(255,107,43,0.06)" strokeWidth="1"/>
            ))}
            {[0,1,2,3,4,5].map(i => (
              <line key={`h${i}`} x1="0" y1={i*120} x2="800" y2={i*120}
                stroke="rgba(255,107,43,0.06)" strokeWidth="1"/>
            ))}
            {/* Diagonal accent */}
            <line x1="0" y1="600" x2="800" y2="0" stroke="rgba(255,107,43,0.04)" strokeWidth="1.5"/>
            <circle cx="400" cy="300" r="200" fill="none" stroke="rgba(255,107,43,0.05)" strokeWidth="1"/>
            <circle cx="400" cy="300" r="120" fill="none" stroke="rgba(255,107,43,0.04)" strokeWidth="1"/>
          </svg>
        </div>

        {/* ── Card ── */}
        <div className="lc-card">
          {/* Orange top stripe */}
          <div className="lc-stripe" />

          {/* Brand */}
          <div className="lc-brand">
            <Link href={route('home')}>
              <img src={logo} alt="Info Saloua" className="lc-logo" />
            </Link>
            <span className="lc-brand-name">Info Saloua</span>
          </div>

          {/* Icon */}
          <div className="lc-icon-wrap">
            <div className="lc-icon-ring" />
            <div className="lc-icon-inner">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"/>
              </svg>
            </div>
          </div>

          <h1 className="lc-title">Code de vérification</h1>

          <p className="lc-subtitle">
            Nous avons envoyé un code à 6 chiffres à<br />
            <span className="lc-email">{maskedEmail}</span>
          </p>

          {/* Status */}
          {status && (
            <div className="lc-status">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
              {status}
            </div>
          )}

          {/* Form */}
          <form onSubmit={submit} noValidate>
            {/* Digit inputs */}
            <div className={`lc-digits ${shake ? 'lc-digits--shake' : ''}`} onPaste={handlePaste}>
              {digits.map((d, i) => (
                <React.Fragment key={i}>
                  <input
                    ref={(el) => { inputRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    className={`lc-digit ${d ? 'lc-digit--filled' : ''} ${errors.code ? 'lc-digit--error' : ''}`}
                    autoFocus={i === 0}
                    onChange={(e) => handleDigit(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    aria-label={`Chiffre ${i + 1}`}
                  />
                  {i === 2 && <span className="lc-digit-sep" aria-hidden="true">—</span>}
                </React.Fragment>
              ))}
            </div>

            {errors.code && (
              <p className="lc-error">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {errors.code}
              </p>
            )}

            {/* Progress bar when all digits filled */}
            {filled && !errors.code && (
              <div className="lc-ready">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                Code complet — prêt à vérifier
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={processing || !filled}
              className={`lc-submit ${filled ? 'lc-submit--ready' : ''}`}
            >
              {processing ? (
                <>
                  <svg className="lc-spinner" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"
                      strokeDasharray="31.4" strokeDashoffset="10" strokeLinecap="round"/>
                  </svg>
                  Vérification…
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
                  </svg>
                  Confirmer l'accès
                </>
              )}
            </button>
          </form>

          {/* Resend + cancel */}
          <div className="lc-footer">
            <div className="lc-resend">
              {canResend ? (
                <button
                  type="button"
                  className="lc-resend-btn"
                  onClick={() => {
                    setResendSeconds(59);
                    setCanResend(false);
                    setDigits(['','','','','','']);
                    inputRefs.current[0]?.focus();
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 .49-4.46"/>
                  </svg>
                  Renvoyer le code
                </button>
              ) : (
                <span className="lc-resend-timer">
                  Renvoyer dans <strong>0:{String(resendSeconds).padStart(2, '0')}</strong>
                </span>
              )}
            </div>

            <Link
              href={route('logout')}
              method="post"
              as="button"
              className="lc-cancel"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Annuler et se déconnecter
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;1,400&family=Manrope:wght@400;500;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        /* ══ Root ══ */
        .lc-root {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          font-family: 'Manrope', sans-serif;
          background: linear-gradient(145deg, #fff9f4 0%, #fff3e8 35%, #fff7f0 65%, #fffbf7 100%);
          overflow: hidden;
        }

        /* ══ Animated background ══ */
        .lc-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        /* Orbiting rings */
        .lc-ring {
          position: absolute;
          border-radius: 50%;
          border: 1.5px solid rgba(255,107,43,0.10);
          animation: ring-spin linear infinite;
        }
        .lc-ring-1 {
          width: 500px; height: 500px;
          top: 50%; left: 50%;
          transform: translate(-50%,-50%);
          animation-duration: 40s;
          border-style: dashed;
        }
        .lc-ring-2 {
          width: 340px; height: 340px;
          top: 50%; left: 50%;
          transform: translate(-50%,-50%);
          animation-duration: 28s;
          animation-direction: reverse;
          border-color: rgba(255,154,86,0.12);
        }
        .lc-ring-3 {
          width: 200px; height: 200px;
          top: 50%; left: 50%;
          transform: translate(-50%,-50%);
          animation-duration: 18s;
          border-color: rgba(255,107,43,0.08);
          border-style: dashed;
        }
        @keyframes ring-spin {
          from { transform: translate(-50%,-50%) rotate(0deg); }
          to   { transform: translate(-50%,-50%) rotate(360deg); }
        }

        /* Blobs */
        .lc-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(2px);
        }
        .lc-blob-1 {
          width: 240px; height: 240px;
          top: -60px; right: -60px;
          background: radial-gradient(circle at 40% 40%, #ff9a56, #ff6b2b, #f5a623);
          opacity: 0.70;
          animation: blob-float1 8s ease-in-out infinite;
        }
        .lc-blob-2 {
          width: 140px; height: 140px;
          bottom: 60px; left: 40px;
          background: radial-gradient(circle at 50% 50%, #ffb347, #ff7c2a);
          opacity: 0.50;
          animation: blob-float2 11s ease-in-out infinite;
        }
        .lc-blob-3 {
          width: 80px; height: 80px;
          top: 30%; right: 8%;
          background: radial-gradient(circle at 50% 50%, #ffd0a8, #ffaa6b);
          opacity: 0.45;
          animation: blob-float1 6s ease-in-out infinite reverse;
        }
        @keyframes blob-float1 {
          0%,100% { transform: translateY(0) scale(1); }
          50%      { transform: translateY(-18px) scale(1.05); }
        }
        @keyframes blob-float2 {
          0%,100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(12px,-10px) scale(1.04); }
          66%      { transform: translate(-8px,8px) scale(0.97); }
        }

        /* Floating dots */
        .lc-dot {
          position: absolute;
          width: 5px; height: 5px;
          border-radius: 50%;
          background: rgba(255,107,43,0.22);
          animation: dot-float calc(5s + var(--i, 0) * 0.6s) ease-in-out infinite;
          animation-delay: calc(var(--i, 0) * 0.4s);
        }
        @keyframes dot-float {
          0%,100% { transform: translateY(0); opacity: 0.22; }
          50%      { transform: translateY(-12px); opacity: 0.55; }
        }

        /* Grid SVG */
        .lc-grid-svg {
          position: absolute;
          width: 100%; height: 100%;
          top: 0; left: 0;
        }

        /* ══ Card ══ */
        .lc-card {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 420px;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 0 0 2rem;
          overflow: hidden;
          box-shadow:
            0 0 0 1px rgba(255,107,43,0.10),
            0 4px 8px rgba(0,0,0,0.04),
            0 16px 40px rgba(0,0,0,0.08),
            0 32px 64px rgba(255,107,43,0.06);
          animation: card-in .5s cubic-bezier(.22,1,.36,1) both;
        }
        @keyframes card-in {
          from { opacity: 0; transform: translateY(28px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .lc-stripe {
          height: 4px;
          background: linear-gradient(90deg, #ff5500, #ff7a35, #ffb347, #ff9a56, #ff5500);
          background-size: 200% 100%;
          animation: stripe-move 3s linear infinite;
        }
        @keyframes stripe-move {
          from { background-position: 0% 0%; }
          to   { background-position: 200% 0%; }
        }

        /* Brand */
        .lc-brand {
          display: flex; align-items: center; justify-content: center;
          gap: 9px;
          padding: 1.5rem 2rem .5rem;
        }
        .lc-logo { width: 28px; height: 28px; border-radius: 7px; object-fit: contain; }
        .lc-brand-name {
          font-family: 'EB Garamond', serif;
          font-size: 1.2rem; font-weight: 600; color: #1a1a1a;
          border-bottom: 1.5px solid rgba(255,107,43,0.45);
          padding-bottom: 1px;
        }

        /* Icon */
        .lc-icon-wrap {
          position: relative;
          width: 72px; height: 72px;
          margin: 1rem auto .5rem;
          display: flex; align-items: center; justify-content: center;
        }
        .lc-icon-ring {
          position: absolute; inset: 0; border-radius: 50%;
          background: conic-gradient(from 0deg, #ff6b2b, #ffb347, #ff9a56, #ff6b2b);
          animation: icon-spin 6s linear infinite;
          opacity: 0.25;
        }
        @keyframes icon-spin { to { transform: rotate(360deg); } }
        .lc-icon-inner {
          width: 56px; height: 56px; border-radius: 50%;
          background: linear-gradient(135deg, #fff3eb, #ffe0c8);
          border: 1.5px solid rgba(255,107,43,0.2);
          display: flex; align-items: center; justify-content: center;
          color: #ff6b2b;
          position: relative; z-index: 1;
        }

        .lc-title {
          font-family: 'Manrope', sans-serif;
          font-size: 1.45rem; font-weight: 800; color: #111;
          text-align: center; margin: 0 0 .4rem;
          letter-spacing: -.025em;
          padding: 0 2rem;
        }
        .lc-subtitle {
          font-size: .82rem; color: #999; text-align: center;
          line-height: 1.65; margin: 0 0 1.5rem;
          padding: 0 2rem;
        }
        .lc-email {
          display: inline-block;
          color: #555; font-weight: 600;
          background: rgba(255,107,43,0.08);
          border-radius: 4px; padding: 1px 6px;
        }

        /* Status */
        .lc-status {
          display: flex; align-items: center; gap: 8px;
          margin: 0 2rem 1rem;
          padding: .65rem .9rem;
          border-radius: 10px;
          background: #f0fdf4; border: 1px solid #bbf7d0;
          font-size: .8rem; color: #166534; font-weight: 500;
        }

        /* ── Digit inputs ── */
        .lc-digits {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 0 2rem;
          margin-bottom: .75rem;
        }
        .lc-digits--shake {
          animation: shake .55s cubic-bezier(.36,.07,.19,.97) both;
        }
        @keyframes shake {
          10%,90%  { transform: translateX(-2px); }
          20%,80%  { transform: translateX(3px); }
          30%,50%,70% { transform: translateX(-4px); }
          40%,60%  { transform: translateX(4px); }
        }

        .lc-digit {
          width: 46px; height: 56px;
          border: 2px solid #e5e5e5;
          border-radius: 12px;
          background: #fafafa;
          text-align: center;
          font-family: 'Manrope', sans-serif;
          font-size: 1.4rem; font-weight: 800; color: #111;
          caret-color: #ff6b2b;
          outline: none;
          transition: border-color .15s, background .15s, box-shadow .15s, transform .1s;
        }
        .lc-digit:focus {
          border-color: #ff6b2b;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(255,107,43,0.14);
          transform: translateY(-2px) scale(1.04);
        }
        .lc-digit--filled {
          border-color: #ff9a56;
          background: #fff8f4;
          color: #ff5500;
        }
        .lc-digit--error {
          border-color: #ef4444 !important;
          background: #fff5f5 !important;
          box-shadow: 0 0 0 3px rgba(239,68,68,.12) !important;
        }
        .lc-digit-sep {
          font-size: .9rem; color: #ccc; font-weight: 300;
          margin: 0 2px;
          user-select: none;
        }

        .lc-error {
          display: flex; align-items: center; gap: 5px;
          font-size: .78rem; color: #ef4444; font-weight: 500;
          text-align: center; justify-content: center;
          margin: 0 2rem .5rem;
        }
        .lc-ready {
          display: flex; align-items: center; gap: 5px;
          font-size: .78rem; color: #059669; font-weight: 600;
          text-align: center; justify-content: center;
          margin: 0 2rem .5rem;
          animation: fade-in .25s ease both;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Submit */
        .lc-submit {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          width: calc(100% - 4rem); margin: .5rem 2rem 0;
          padding: .9rem 1rem;
          border: none; border-radius: 14px;
          background: #e5e5e5; color: #aaa;
          font-family: 'Manrope', sans-serif;
          font-size: .92rem; font-weight: 700; letter-spacing: .01em;
          cursor: not-allowed;
          transition: background .2s, color .2s, box-shadow .2s, transform .1s;
        }
        .lc-submit--ready {
          background: linear-gradient(135deg, #ff7a35, #ff5500);
          color: #fff;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(255,107,43,.35);
        }
        .lc-submit--ready:hover:not(:disabled) {
          opacity: .92; transform: translateY(-1px);
          box-shadow: 0 6px 22px rgba(255,107,43,.45);
        }
        .lc-submit--ready:active:not(:disabled) { transform: translateY(0); }
        .lc-submit:disabled { opacity: .6; }

        .lc-spinner {
          width: 18px; height: 18px;
          animation: lc-spin .7s linear infinite;
        }
        @keyframes lc-spin { to { transform: rotate(360deg); } }

        /* Footer */
        .lc-footer {
          display: flex; flex-direction: column; align-items: center; gap: 12px;
          margin-top: 1.5rem;
          padding: 0 2rem;
        }
        .lc-resend-timer {
          font-size: .8rem; color: #bbb;
        }
        .lc-resend-timer strong { color: #ff6b2b; font-weight: 700; }
        .lc-resend-btn {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: .82rem; font-weight: 600; color: #ff6b2b;
          background: none; border: none; cursor: pointer;
          text-decoration: underline; text-underline-offset: 3px;
          text-decoration-color: rgba(255,107,43,.4);
          font-family: 'Manrope', sans-serif;
          transition: color .15s;
        }
        .lc-resend-btn:hover { color: #e05a20; }

        .lc-cancel {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: .78rem; font-weight: 500; color: #bbb;
          text-decoration: none;
          transition: color .15s;
          background: none; border: none; cursor: pointer;
          font-family: 'Manrope', sans-serif;
        }
        .lc-cancel:hover { color: #ef4444; }
      `}</style>
    </>
  );
}