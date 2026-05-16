import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { loadStripe } from '@stripe/stripe-js';
import {
  CardCvcElement, CardExpiryElement, CardNumberElement,
  Elements, useElements, useStripe,
} from '@stripe/react-stripe-js';
import PublicLayout from '@/Layouts/PublicLayout';
import PaymentCertificate, { type PaymentCertificateData } from '@/Components/PaymentCertificate';
import { createStripePaymentIntent } from '@/lib/stripePayments';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import infographielogo from '../../../../public/images/infographie.png';

gsap.registerPlugin(ScrollTrigger);
// Prevent scroll jank from ScrollTrigger recalculations
ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true });

/* ═══════════════════════════════════════════════════ TYPES */
type PaymentMode = '' | 'online' | 'onsite';
type GraphicKey  = 'photoshop' | 'illustrator' | 'indesign';

interface FormData {
  nom: string; prenom: string; age: string; email: string; telephone: string;
  graphic: GraphicKey; message: string; payment: PaymentMode;
  acceptTerms: boolean; acceptPrivacy: boolean;
}
interface FormErrors {
  nom?: string; prenom?: string; age?: string; email?: string; telephone?: string;
  payment?: string; card?: string; acceptTerms?: string; acceptPrivacy?: string;
}
interface StripeCardHandle {
  createPaymentMethod: (b: { name: string; email: string; phone: string }) => Promise<{ paymentMethodId: string } | { error: string }>;
}
interface StripeCardSectionProps {
  totalAmount: number; cardError?: string; processing: boolean; paymentDone: boolean;
  paymentReference?: string; onCardChange: (h: boolean) => void; onPayNow: () => void;
}

/* ═══════════════════════════════════════════════════ CONSTANTS */
const INFOGRAPHIE_OPTIONS: Array<{ value: GraphicKey; label: string; price: number; hours: number; color: string }> = [
  { value: 'photoshop',   label: 'Adobe Photoshop',   price: 1000, hours: 30, color: '#31A8FF' },
  { value: 'illustrator', label: 'Adobe Illustrator', price: 1000, hours: 25, color: '#FF9A00' },
  { value: 'indesign',    label: 'Adobe InDesign',    price: 900,  hours: 20, color: '#FF3366' },
];

/* ═══════════════════════════════════════════════════ HELPERS */
const fmtAmount = (n: number) => `${n.toLocaleString('fr-MA')} DH`;
const okEmail   = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const okPhone   = (v: string) => /^[+\d\s\-()]{8,}$/.test(v.trim());
const secureRef = (prefix: string) => {
  const b = new Uint32Array(2); crypto.getRandomValues(b);
  return `${prefix}-${Date.now().toString(36).toUpperCase()}-${b[0].toString(36).slice(0,4).toUpperCase()}${b[1].toString(36).slice(0,4).toUpperCase()}`;
};

const FieldError: React.FC<{ msg?: string }> = ({ msg }) =>
  msg ? <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500">
    <span className="material-symbols-outlined text-sm leading-none">error</span>{msg}</p> : null;

/* ═══════════════════════════════════════════════════ BRAND LOGOS */
const LogoVisa: React.FC<{ active: boolean }> = ({ active }) => (
  <svg viewBox="0 0 50 32" width="44" height="28" style={{ opacity: active ? 1 : 0.3, transition: 'opacity .25s' }} aria-label="Visa">
    <rect width="50" height="32" rx="5" fill="#0055A5" /><text x="5" y="22" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="13" fill="#fff" letterSpacing="-0.5">VISA</text>
  </svg>
);
const LogoMastercard: React.FC<{ active: boolean }> = ({ active }) => (
  <svg viewBox="0 0 50 32" width="44" height="28" style={{ opacity: active ? 1 : 0.3, transition: 'opacity .25s' }} aria-label="Mastercard">
    <rect width="50" height="32" rx="5" fill="#fff" stroke="#e5e7eb" strokeWidth="1" />
    <circle cx="19" cy="16" r="9" fill="#EB001B" /><circle cx="31" cy="16" r="9" fill="#F79E1B" />
    <path d="M25 9.3a9 9 0 0 1 0 13.4A9 9 0 0 1 25 9.3z" fill="#FF5F00" />
  </svg>
);
const BRAND_LOGO: Record<string, React.FC<{ active: boolean }>> = { visa: LogoVisa, mastercard: LogoMastercard };
const ALL_BRANDS = ['visa', 'mastercard'] as const;
const CvcIcon: React.FC = () => (
  <svg viewBox="0 0 38 24" width="36" height="22" fill="none" aria-hidden="true">
    <rect width="38" height="24" rx="4" fill="#e5e7eb" /><rect x="0" y="7" width="38" height="6" fill="#9ca3af" />
    <rect x="6" y="16" width="16" height="4" rx="1" fill="#d1d5db" />
    <rect x="25" y="15.5" width="8" height="5" rx="1.5" fill="#fff" stroke="#d1d5db" strokeWidth="0.5" />
    <text x="26.5" y="19.5" fontSize="4" fill="#374151" fontFamily="monospace" fontWeight="bold">123</text>
  </svg>
);

/* ═══════════════════════════════════════════════════ STRIPE */
const StripeCardSection = forwardRef<StripeCardHandle, StripeCardSectionProps>(
  ({ totalAmount, cardError, processing, paymentDone, paymentReference, onCardChange, onPayNow }, ref) => {
    const stripe = useStripe(); const elements = useElements();
    const [numberComplete, setNumberComplete] = useState(false);
    const [expiryComplete,  setExpiryComplete]  = useState(false);
    const [cvcComplete,     setCvcComplete]     = useState(false);
    const [brand,           setBrand]           = useState('unknown');
    const allComplete = numberComplete && expiryComplete && cvcComplete;
    const sync = (next: { number?: boolean; expiry?: boolean; cvc?: boolean; hasOwnError: boolean }) =>
      onCardChange(next.hasOwnError || !(next.number ?? numberComplete) || !(next.expiry ?? expiryComplete) || !(next.cvc ?? cvcComplete));
    useImperativeHandle(ref, () => ({
      async createPaymentMethod(billingDetails) {
        if (!stripe || !elements) return { error: 'Stripe non initialise.' };
        const cardEl = elements.getElement(CardNumberElement);
        if (!cardEl) return { error: 'Element carte introuvable.' };
        const { error, paymentMethod } = await stripe.createPaymentMethod({ type: 'card', card: cardEl, billing_details: billingDetails });
        if (error) return { error: error.message ?? 'Erreur carte.' };
        try {
          const intent = await createStripePaymentIntent({ amount: totalAmount, category: 'Infographie', email: billingDetails.email, name: billingDetails.name });
          const { error: ce, paymentIntent } = await stripe.confirmCardPayment(intent.client_secret, { payment_method: paymentMethod.id });
          if (ce) return { error: ce.message ?? 'Paiement refuse.' };
          if (!paymentIntent || paymentIntent.status !== 'succeeded') return { error: 'Paiement non confirme.' };
          return { paymentMethodId: paymentIntent.id };
        } catch (e) { return { error: e instanceof Error ? e.message : 'Erreur Stripe.' }; }
      },
    }));
    const elOpts = { style: { base: { fontSize: '15px', fontFamily: 'inherit', color: '#1c1c1e', '::placeholder': { color: '#9ca3af' } }, invalid: { color: '#dc2626' } } };
    const shell = (err?: boolean) => `rounded-xl border bg-white transition-all focus-within:ring-2 ${err ? 'border-red-400 focus-within:ring-red-200' : 'border-outline-variant focus-within:border-primary focus-within:ring-primary/20'}`;
    const DL = brand !== 'unknown' ? BRAND_LOGO[brand] : null;
    return (
      <div className="mt-6 overflow-hidden rounded-3xl border border-primary/20 bg-white shadow-lg">
        <div className="h-1.5 w-full bg-gradient-to-r from-primary via-orange-400 to-amber-300" />
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Paiement securise</p><h4 className="mt-1 text-xl font-bold text-on-surface">Carte bancaire</h4></div>
            <div className="flex items-center gap-2 rounded-full border border-outline-variant/40 bg-surface-container px-4 py-2"><span className="material-symbols-outlined text-base text-emerald-600">lock</span><span className="text-sm font-bold text-on-surface">{fmtAmount(totalAmount)}</span></div>
          </div>
          <div className="infog-card-grid">
            <div className="infog-card-field infog-card-full">
              <div className="flex items-center justify-between"><label className="infog-card-label">Numero de carte</label><div className="flex items-center gap-1.5">{DL ? <DL active /> : ALL_BRANDS.map((b) => { const L = BRAND_LOGO[b]; return <L key={b} active />; })}</div></div>
              <div className={`${shell(!!cardError && !numberComplete)} infog-card-shell`}><div className="infog-card-el"><CardNumberElement options={{ ...elOpts, showIcon: false }} onChange={(ev) => { setNumberComplete(ev.complete); setBrand(ev.brand ?? 'unknown'); sync({ number: ev.complete, hasOwnError: !!ev.error }); }} /></div></div>
            </div>
            <div className="infog-card-subgrid infog-card-full">
              <div className="infog-card-field"><label className="infog-card-label">Date d'expiration</label><div className={`${shell()} infog-card-shell`}><div className="infog-card-el"><CardExpiryElement options={elOpts} onChange={(ev) => { setExpiryComplete(ev.complete); sync({ expiry: ev.complete, hasOwnError: !!ev.error }); }} /></div></div></div>
              <div className="infog-card-field"><label className="infog-card-label">Code de securite</label><div className={`${shell()} infog-card-shell infog-card-cvc-shell`}><div className="infog-card-el infog-card-el-cvc"><CardCvcElement options={elOpts} onChange={(ev) => { setCvcComplete(ev.complete); sync({ cvc: ev.complete, hasOwnError: !!ev.error }); }} /></div><div className="infog-card-cvc-icon"><CvcIcon /></div></div></div>
            </div>
            {cardError && <FieldError msg={cardError} />}
            {allComplete && !cardError && <p className="mt-1 flex items-center gap-1.5 text-xs text-emerald-600"><span className="material-symbols-outlined text-sm leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>Informations de carte valides</p>}
          </div>
          <button type="button" onClick={onPayNow} disabled={processing || paymentDone || !stripe || !allComplete}
            className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-2xl py-4 text-sm font-bold tracking-wide text-white shadow-lg transition-all disabled:cursor-not-allowed disabled:opacity-60"
            style={{ background: paymentDone ? 'linear-gradient(135deg,#059669,#047857)' : 'linear-gradient(135deg,#059669,#065f46)' }}>
            {processing ? <><span className="material-symbols-outlined animate-spin text-xl leading-none">progress_activity</span>Paiement en cours...</>
              : paymentDone ? <><span className="material-symbols-outlined text-xl leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>task_alt</span>Paiement effectue</>
              : <><span className="material-symbols-outlined text-xl leading-none">lock</span>Payer {fmtAmount(totalAmount)}</>}
          </button>
          {paymentDone && paymentReference && <div className="mt-4 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4"><span className="material-symbols-outlined mt-0.5 text-base text-emerald-600" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span><div><p className="text-sm font-semibold text-emerald-800">Paiement effectue avec succes</p><p className="mt-0.5 text-xs text-emerald-700">Reference : <span className="font-mono font-semibold">{paymentReference}</span></p></div></div>}
          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-3"><span className="material-symbols-outlined text-base text-emerald-600">security</span><p className="text-xs leading-relaxed text-emerald-800">Chiffrement <strong>Stripe</strong> PCI-DSS niveau 1. Aucune donnee bancaire sur nos serveurs.</p></div>
        </div>
      </div>
    );
  }
);
StripeCardSection.displayName = 'StripeCardSection';

/* ═══════════════════════════════════════════════════
   FALLING IMAGE COMPONENT
   Falls from high above, swings left → right → settles
═══════════════════════════════════════════════════ */
const FallingImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const wrapRef  = useRef<HTMLDivElement>(null);
  const imgRef   = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const triggered = useRef(false);

  useEffect(() => {
    const wrap  = wrapRef.current;
    const img   = imgRef.current;
    const shad  = shadowRef.current;
    if (!wrap || !img || !shad) return;

    // Start: far above viewport, rotated
    // Start hidden above — use visibility to prevent layout overflow
    gsap.set(img, { y: -380, x: -60, rotation: -22, opacity: 0, visibility: 'hidden', transformOrigin: 'center top' });
    gsap.set(shad, { scaleX: 0.2, opacity: 0 });

    const st = ScrollTrigger.create({
      trigger: wrap,
      start: 'top 80%',
      onEnter: () => {
        if (triggered.current) return;
        triggered.current = true;

        const tl = gsap.timeline();

        // 1. Drop phase — reveal + fall fast with slight left lean
        tl.set(img, { visibility: 'visible' }, 0);
        tl.to(img, {
          y: 40,          // overshoot past final position
          x: -45,
          rotation: -14,
          opacity: 1,
          duration: 0.55,
          ease: 'power3.in',
        }, 0);

        // Shadow grows as image approaches
        tl.to(shad, {
          scaleX: 0.7,
          opacity: 0.35,
          duration: 0.55,
          ease: 'power2.in',
        }, 0);

        // 2. First bounce — swing right on impact
        tl.to(img, {
          y: 10,
          x: 55,
          rotation: 10,
          duration: 0.28,
          ease: 'power2.out',
        });

        // Shadow squishes on first bounce
        tl.to(shad, {
          scaleX: 1.1,
          scaleY: 0.7,
          opacity: 0.5,
          duration: 0.14,
          ease: 'power1.out',
        }, '<');
        tl.to(shad, {
          scaleY: 1,
          duration: 0.14,
          ease: 'power1.in',
        });

        // 3. Swing left — dampened
        tl.to(img, {
          y: 5,
          x: -22,
          rotation: -5,
          duration: 0.22,
          ease: 'power2.out',
        });

        // 4. Swing right again — smaller
        tl.to(img, {
          y: 2,
          x: 10,
          rotation: 2,
          duration: 0.18,
          ease: 'power2.out',
        });

        // 5. Settle to final resting position
        tl.to(img, {
          y: 0,
          x: 0,
          rotation: 0,
          duration: 0.35,
          ease: 'elastic.out(1, 0.5)',
        });

        // Shadow settles
        tl.to(shad, {
          scaleX: 1,
          scaleY: 1,
          opacity: 0.2,
          duration: 0.35,
          ease: 'power2.out',
        }, '<');
      },
    });

    return () => { st.kill(); };
  }, []);

  return (
    <div ref={wrapRef} className="group relative" style={{ perspective: '1000px' }}>
      {/* Glow halo */}
      <div className="absolute -inset-6 rounded-[2rem] bg-primary/5 blur-xl transition-all duration-700 group-hover:bg-primary/12 group-hover:blur-2xl" />

      {/* The falling image wrapper */}
      <div
        ref={imgRef}
        className="relative"
        style={{ willChange: 'transform, opacity' }}
      >
        {/* Inner image — hover zoom handled here */}
        <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-outline-variant/30 shadow-2xl"
          style={{ boxShadow: '0 32px 64px -16px rgba(26,20,16,0.35)' }}>
          <img
            alt={alt}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            src={src}
          />
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Tool badges — slide up on hover */}
          <div className="absolute bottom-8 left-8 flex flex-wrap gap-3 transition-all duration-500 ease-out"
            style={{ transform: 'translateY(0)', opacity: 1 }}>
            {INFOGRAPHIE_OPTIONS.map((item) => (
              <span key={item.value}
                className="infog-badge rounded-full px-4 py-2 text-sm font-bold uppercase tracking-widest text-white backdrop-blur-md"
                style={{ background: `${item.color}cc`, border: `1px solid ${item.color}60` }}>
                {item.label.split(' ')[1]}
              </span>
            ))}
          </div>

          {/* Hover: color scan line effect */}
          <div className="infog-scanline pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </div>

        {/* Floating stat card — top-right, swings in after image settles */}
        <div className="infog-stat-card absolute -right-10 -top-8 hidden rounded-2xl border border-outline-variant/30 bg-white/95 p-5 shadow-xl backdrop-blur-sm md:block">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Taux Emploi</p>
          <p className="mt-1 font-display text-3xl font-bold text-on-surface">88%</p>
          <p className="text-xs text-on-surface-variant">Nos diplomes placés</p>
        </div>

        {/* Floating tool card — bottom-left */}
        <div className="infog-tool-card absolute -bottom-6 -left-8 hidden rounded-2xl border border-orange-100 bg-white/95 p-4 shadow-xl backdrop-blur-sm md:block">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>palette</span>
            <div>
              <p className="text-xs font-bold text-on-surface">Creative Suite</p>
              <p className="text-xs text-on-surface-variant">4 mois • 75H+</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ground shadow — grows/shrinks during fall */}
      <div
        ref={shadowRef}
        className="mx-auto mt-4 h-4 rounded-full"
        style={{
          width: '70%',
          background: 'radial-gradient(ellipse, rgba(26,20,16,0.25) 0%, transparent 75%)',
          transformOrigin: 'center',
          willChange: 'transform, opacity',
        }}
      />
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   GEOMETRIC BACKGROUND SVG
═══════════════════════════════════════════════════ */
const GeoBg: React.FC = () => (
  <svg className="infog-geo-svg" viewBox="0 0 1200 900" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="80" cy="160" r="180" fill="none" stroke="rgba(194,101,42,0.09)" strokeWidth="1.5" />
    <circle cx="80" cy="160" r="100" fill="none" stroke="rgba(194,101,42,0.06)" strokeWidth="1" />
    <circle cx="1150" cy="740" r="220" fill="none" stroke="rgba(194,101,42,0.08)" strokeWidth="1.5" />
    <circle cx="1150" cy="740" r="130" fill="none" stroke="rgba(194,101,42,0.05)" strokeWidth="1" />
    <circle cx="600" cy="430" r="300" fill="none" stroke="rgba(194,101,42,0.04)" strokeWidth="1" />
    <circle cx="950" cy="120" r="40" fill="none" stroke="rgba(194,101,42,0.12)" strokeWidth="1" />
    <circle cx="260" cy="750" r="60" fill="none" stroke="rgba(194,101,42,0.10)" strokeWidth="1" />
    <circle cx="1050" cy="340" r="25" fill="rgba(194,101,42,0.04)" />
    <circle cx="140" cy="550" r="18" fill="rgba(194,101,42,0.06)" />
    <circle cx="700" cy="80" r="12" fill="rgba(194,101,42,0.08)" />
    <line x1="0" y1="320" x2="240" y2="80" stroke="rgba(194,101,42,0.11)" strokeWidth="1" />
    <line x1="20" y1="350" x2="260" y2="110" stroke="rgba(194,101,42,0.07)" strokeWidth="0.8" />
    <line x1="980" y1="580" x2="1200" y2="800" stroke="rgba(194,101,42,0.10)" strokeWidth="1" />
    <g stroke="rgba(194,101,42,0.18)" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <line x1="1060" y1="70" x2="1130" y2="70" /><polyline points="1115,56 1130,70 1115,84" />
    </g>
    <g stroke="rgba(194,101,42,0.20)" strokeWidth="1.5" strokeLinecap="round">
      <line x1="940" y1="130" x2="960" y2="150" /><line x1="960" y1="130" x2="940" y2="150" />
    </g>
    {[0,1,2,3,4].map((row) => [0,1,2,3,4,5].map((col) => (
      <circle key={`${row}-${col}`} cx={480+col*52} cy={180+row*52} r="1.5" fill="rgba(194,101,42,0.11)" />
    )))}
    <path d="M 80 620 Q 420 400 760 620" fill="none" stroke="rgba(194,101,42,0.07)" strokeWidth="1" strokeDasharray="6 8" />
    <polygon points="1100,440 1140,510 1060,510" fill="none" stroke="rgba(194,101,42,0.09)" strokeWidth="1" />
    <rect x="870" y="200" width="14" height="14" rx="2" fill="none" stroke="rgba(194,101,42,0.13)" strokeWidth="1" transform="rotate(20,877,207)" />
  </svg>
);

/* ═══════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════ */
interface Props { stripePublishableKey?: string; }

const InscriptionInfographie: React.FC<Props> = ({
  stripePublishableKey = (import.meta as any).env?.VITE_STRIPE_PK ?? '',
}) => {
  const stripePromise = useMemo(() => stripePublishableKey ? loadStripe(stripePublishableKey) : null, [stripePublishableKey]);
  const stripeOptions = useMemo(() => ({ mode: 'payment' as const, amount: 100, currency: 'mad', appearance: { theme: 'stripe' as const, variables: { fontFamily: 'inherit', borderRadius: '12px' } } }), []);
  const stripeCardRef = useRef<StripeCardHandle>(null);

  // ── GSAP refs ──
  const heroTagRef     = useRef<HTMLSpanElement>(null);
  const heroH1Ref      = useRef<HTMLHeadingElement>(null);
  const heroDescRef    = useRef<HTMLParagraphElement>(null);
  const heroStatsRef   = useRef<HTMLDivElement>(null);
  const formSectionRef = useRef<HTMLElement>(null);
  const formTitleRef   = useRef<HTMLDivElement>(null);
  const formCardRef    = useRef<HTMLDivElement>(null);
  const fieldsRef      = useRef<HTMLDivElement>(null);
  const toolsRef       = useRef<HTMLDivElement>(null);
  const paymentRef     = useRef<HTMLDivElement>(null);
  const submitRef      = useRef<HTMLDivElement>(null);

  // ── Form state ──
  const [form, setForm] = useState<FormData>({
    nom: '', prenom: '', age: '', email: '', telephone: '',
    graphic: 'photoshop', message: '', payment: '',
    acceptTerms: false, acceptPrivacy: false,
  });
  const [errors,                 setErrors]                 = useState<FormErrors>({});
  const [cardHasError,           setCardHasError]           = useState(true);
  const [submitting,             setSubmitting]             = useState(false);
  const [onlinePaymentCompleted, setOnlinePaymentCompleted] = useState(false);
  const [onlinePaymentReference, setOnlinePaymentReference] = useState('');
  const [submittedRef,           setSubmittedRef]           = useState('');
  const [paymentCertificate,     setPaymentCertificate]     = useState<PaymentCertificateData | null>(null);
  const [showPaymentCertificate, setShowPaymentCertificate] = useState(false);

  const selectedGraphic = useMemo(() => INFOGRAPHIE_OPTIONS.find((i) => i.value === form.graphic) ?? INFOGRAPHIE_OPTIONS[0], [form.graphic]);
  const totalAmount     = selectedGraphic.price;
  const defaultPaymentDate = useMemo(() => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().slice(0,10); }, []);
  const clearErr = (f: keyof FormErrors) => setErrors((p) => ({ ...p, [f]: undefined }));

  /* ── GSAP orchestration ── */
  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── Hero text timeline ──
      const heroTl = gsap.timeline({ defaults: { ease: 'expo.out' } });

      heroTl.fromTo(heroTagRef.current,
        { opacity: 0, y: 18, letterSpacing: '0.55em' },
        { opacity: 1, y: 0, letterSpacing: '0.02em', duration: 0.85 }, 0.1
      );
      // H1 — each line revealed by clip-path wipe
      const h1Lines = heroH1Ref.current?.querySelectorAll<HTMLElement>('.h1-line');
      if (h1Lines) {
        heroTl.fromTo(h1Lines,
          { opacity: 0, clipPath: 'inset(100% 0% 0% 0%)', y: 30 },
          { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)', y: 0, stagger: 0.16, duration: 0.9 }, 0.3
        );
      }
      heroTl.fromTo(heroDescRef.current,
        { opacity: 0, x: -28 },
        { opacity: 1, x: 0, duration: 0.7 }, 0.85
      );
      if (heroStatsRef.current) {
        heroTl.fromTo(
          heroStatsRef.current.querySelectorAll('.stat-pill'),
          { opacity: 0, y: 24, scale: 0.88 },
          { opacity: 1, y: 0, scale: 1, stagger: 0.1, duration: 0.6, ease: 'back.out(1.7)' }, 1.1
        );
      }

      // ── Floating cards pop in (delayed after image settles) ──
      gsap.fromTo('.infog-stat-card',
        { opacity: 0, scale: 0.7, y: -20, rotation: 6 },
        { opacity: 1, scale: 1, y: 0, rotation: 0, duration: 0.65, ease: 'back.out(2)', delay: 2.0 }
      );
      gsap.fromTo('.infog-tool-card',
        { opacity: 0, scale: 0.7, y: 20, rotation: -5 },
        { opacity: 1, scale: 1, y: 0, rotation: 0, duration: 0.65, ease: 'back.out(2)', delay: 2.2 }
      );

      // ── Form section title ──
      if (formTitleRef.current) {
        ScrollTrigger.create({
          trigger: formTitleRef.current, start: 'top 83%',
          onEnter: () => gsap.fromTo(formTitleRef.current,
            { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
          ),
        });
      }

      // ── Form card slide-up ──
      if (formCardRef.current) {
        ScrollTrigger.create({
          trigger: formCardRef.current, start: 'top 78%',
          onEnter: () => gsap.fromTo(formCardRef.current,
            { opacity: 0, y: 60, clipPath: 'inset(5% 0% 0% 0% round 24px)' },
            { opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0% round 24px)', duration: 1.1, ease: 'expo.out' }
          ),
        });
      }

      // ── Field groups stagger ──
      if (fieldsRef.current) {
        ScrollTrigger.create({
          trigger: fieldsRef.current, start: 'top 82%',
          onEnter: () => gsap.fromTo(
            fieldsRef.current!.querySelectorAll('.field-item'),
            { opacity: 0, y: 20, x: -8 },
            { opacity: 1, y: 0, x: 0, stagger: 0.07, duration: 0.5, ease: 'power3.out' }
          ),
        });
      }

      // ── Tool cards (formation options) ──
      if (toolsRef.current) {
        ScrollTrigger.create({
          trigger: toolsRef.current, start: 'top 85%',
          onEnter: () => gsap.fromTo(
            toolsRef.current!.querySelectorAll('.tool-card'),
            { opacity: 0, scale: 0.88, rotationY: 20, transformPerspective: 600 },
            { opacity: 1, scale: 1, rotationY: 0, stagger: 0.14, duration: 0.75, ease: 'back.out(1.5)' }
          ),
        });
      }

      // ── Payment options ──
      if (paymentRef.current) {
        ScrollTrigger.create({
          trigger: paymentRef.current, start: 'top 85%',
          onEnter: () => gsap.fromTo(
            paymentRef.current!.querySelectorAll('.pay-opt'),
            { opacity: 0, x: -24, scale: 0.95 },
            { opacity: 1, x: 0, scale: 1, stagger: 0.15, duration: 0.6, ease: 'back.out(1.6)' }
          ),
        });
      }

      // ── Submit ──
      if (submitRef.current) {
        ScrollTrigger.create({
          trigger: submitRef.current, start: 'top 90%',
          onEnter: () => gsap.fromTo(submitRef.current,
            { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
          ),
        });
      }

      // ── Slow geo SVG parallax — using scrub:true (not a number) avoids micro-jank ──
      gsap.to('.infog-geo-svg', {
        yPercent: 10, ease: 'none',
        scrollTrigger: { scrub: true },
      });

      // Refresh after all triggers registered
      ScrollTrigger.refresh();

      // ── Badge subtle CSS animation (no GSAP loop to avoid scroll interference) ──
      // Handled by CSS animation in <style>
    });

    return () => ctx.revert();
  }, []);

  /* ── Tool card selection animation ── */
  const animateToolSelect = (el: HTMLElement) => {
    gsap.fromTo(el,
      { scale: 0.94, rotationY: 8, transformPerspective: 500 },
      { scale: 1, rotationY: 0, duration: 0.45, ease: 'back.out(2)' }
    );
  };

  /* ── Handlers ── */
  const validateFinal = (): FormErrors => {
    const e: FormErrors = {};
    if (!form.nom.trim())    e.nom      = 'Le nom est requis.';
    if (!form.prenom.trim()) e.prenom   = 'Le prenom est requis.';
    if (!form.age || Number(form.age) < 15 || Number(form.age) > 60) e.age = 'Age invalide (15–60).';
    if (!okEmail(form.email))      e.email     = 'Email invalide.';
    if (!okPhone(form.telephone))  e.telephone = 'Telephone invalide.';
    if (!form.payment)             e.payment   = 'Choisissez un mode de paiement.';
    if (!form.acceptTerms)         e.acceptTerms  = 'Acceptez les conditions.';
    if (!form.acceptPrivacy)       e.acceptPrivacy = 'Acceptez la politique de confidentialite.';
    return e;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') { setForm((p) => ({ ...p, [name]: (e.target as HTMLInputElement).checked })); clearErr(name as keyof FormErrors); return; }
    setForm((p) => ({ ...p, [name]: value }));
    clearErr(name as keyof FormErrors);
    if (name === 'payment') { setOnlinePaymentCompleted(false); setOnlinePaymentReference(''); clearErr('card'); }
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'graphic') {
      setForm((p) => ({ ...p, graphic: e.target.value as GraphicKey }));
      const card = (e.target as HTMLElement).closest<HTMLElement>('.tool-card');
      if (card) animateToolSelect(card);
      return;
    }
    setForm((p) => ({ ...p, payment: e.target.value as PaymentMode }));
    clearErr('payment');
    setOnlinePaymentCompleted(false); setOnlinePaymentReference(''); clearErr('card');
    // animate selected pay option
    const opt = (e.target as HTMLElement).closest<HTMLElement>('.pay-opt');
    if (opt) gsap.fromTo(opt, { x: -8 }, { x: 0, duration: 0.3, ease: 'power2.out' });
  };

  const handleOnlinePayment = async () => {
    const pre: FormErrors = {};
    if (!form.nom.trim())    pre.nom = 'Le nom est requis.';
    if (!form.prenom.trim()) pre.prenom = 'Le prenom est requis.';
    if (!okEmail(form.email)) pre.email = 'Email invalide.';
    if (!okPhone(form.telephone)) pre.telephone = 'Telephone invalide.';
    if (cardHasError) pre.card = 'Completez les informations de carte.';
    if (Object.keys(pre).length) { setErrors((p) => ({ ...p, ...pre })); return; }
    setSubmitting(true);
    try {
      if (!stripeCardRef.current) { setErrors((p) => ({ ...p, card: 'Formulaire carte introuvable.' })); return; }
      const result = await stripeCardRef.current.createPaymentMethod({ name: `${form.prenom} ${form.nom}`, email: form.email, phone: form.telephone });
      if ('error' in result) { setErrors((p) => ({ ...p, card: result.error })); return; }
      setOnlinePaymentCompleted(true); setOnlinePaymentReference(result.paymentMethodId); clearErr('card');
    } finally { setSubmitting(false); }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateFinal();
    if (Object.keys(errs).length) { setErrors(errs); document.querySelector('[data-has-error="true"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
    setSubmitting(true);
    const certRef = secureRef('PAYCERT');
    const payRef  = form.payment === 'online' ? undefined : secureRef('PAY');
    router.post(route('applications.store'), {
      first_name: form.prenom, last_name: form.nom, email: form.email, phone: form.telephone,
      category: 'Infographie', training_label: selectedGraphic.label,
      course_slug: 'maitrise-adobe-creative-suite', amount: totalAmount,
      payment_method: form.payment, payment_provider: form.payment === 'online' ? 'payzone' : undefined,
      payment_reference: payRef, preferred_payment_date: form.payment === 'onsite' ? defaultPaymentDate : undefined,
      certificate_reference: certRef, form_data: { ...form },
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setSubmittedRef(certRef);
        setPaymentCertificate({
          studentName: `${form.prenom.trim()} ${form.nom.trim()}`, reference: certRef,
          barcodeValue: `${certRef}-${payRef}`, trainingLabel: selectedGraphic.label,
          category: 'Infographie', amount: fmtAmount(totalAmount),
          paymentMode: form.payment === 'online' ? 'Paiement en ligne' : 'Paiement presentiel',
          paymentStatus: form.payment === 'online' ? 'Paye' : 'Paiement a regler au centre',
          issuedAt: new Date().toLocaleString('fr-MA'),
        });
        setShowPaymentCertificate(true);
      },
      onFinish: () => setSubmitting(false),
    });
  };

  const fc = (err?: string) =>
    `w-full px-6 py-4 rounded-xl border bg-white focus:ring-2 focus:ring-offset-0 focus:border-transparent outline-none transition-all shadow-sm ${err ? 'border-red-300 bg-red-50/20 focus:ring-red-200' : 'border-slate-200 focus:ring-primary/20'}`;

  /* ════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════ */
  return (
    <>
      <Head title="Infographie" />
      {showPaymentCertificate && paymentCertificate && (
        <PaymentCertificate certificate={paymentCertificate} onClose={() => setShowPaymentCertificate(false)} />
      )}
      <PublicLayout>
        <div className="infog-root">
          <GeoBg />
          <main className="relative z-10 flex-grow">

            {/* ══════════ HERO ══════════ */}
            <section className="relative px-8 pb-20 pt-24">
              <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-20 lg:grid-cols-2">

                {/* Left — text */}
                <div>
                  <span
                    ref={heroTagRef}
                    className="mb-6 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.02em] text-primary"
                    style={{ opacity: 0 }}
                  >
                    Formation Creative
                  </span>

                  <h1
                    ref={heroH1Ref}
                    className="serif-headline mb-8  text-6xl leading-none tracking-tighter text-on-surface md:text-8xl"
                    aria-label="Inscriptions : Creativite & Infographie"
                  >
                    <span className="h1-line block overflow-hidden" style={{ opacity: 0 }}>Inscriptions :</span>
                    <span className="h1-line block overflow-hidden italic text-primary" style={{ opacity: 0 }}>Creativite &amp;</span>
                    <span className="h1-line block overflow-hidden italic text-primary" style={{ opacity: 0 }}>Infographie</span>
                  </h1>

                  <p
                    ref={heroDescRef}
                    className="mb-10 max-w-xl text-xl leading-relaxed text-on-surface-variant"
                    style={{ opacity: 0 }}
                  >
                    Maitrisez les outils qui definissent l'industrie visuelle moderne. Une immersion
                    de 4 mois pour transformer votre vision en realite digitale.
                  </p>

                  <div ref={heroStatsRef} className="flex flex-wrap gap-4">
                    {[
                      { icon: 'brush',    label: 'Adobe Suite',    sub: 'Ps · Ai · Id' },
                      { icon: 'schedule', label: '4 Mois',         sub: '75H de formation' },
                      { icon: 'payments', label: fmtAmount(totalAmount), sub: '/ formation' },
                    ].map(({ icon, label, sub }) => (
                      <div key={label}
                        className="stat-pill infog-stat-pill flex items-center gap-3 rounded-2xl border border-outline-variant/40 bg-white/80 px-5 py-3.5 shadow-sm backdrop-blur-sm"
                        style={{ opacity: 0 }}>
                        <span className="material-symbols-outlined text-xl text-primary">{icon}</span>
                        <div>
                          <p className="font-bold text-on-surface leading-none">{label}</p>
                          <p className="text-xs text-on-surface-variant mt-0.5">{sub}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right — falling image */}
                <FallingImage src={infographielogo} alt="Digital design process — infographie creative" />
              </div>
            </section>

            {/* ══════════ FORM SECTION ══════════ */}
            <section ref={formSectionRef} className="px-8 py-24">
              <div className="mx-auto max-w-4xl">

                {/* Section title */}
                <div ref={formTitleRef} className="mb-16 text-center" style={{ opacity: 0 }}>
                  <h2 className="serif-headline mb-4 text-4xl text-on-surface md:text-5xl">
                    Votre Candidature Creative
                  </h2>
                  <div className="mx-auto mt-4 mb-6 flex items-center justify-center gap-4">
                    <div className="h-px w-12 bg-primary/40" />
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <div className="h-px w-12 bg-primary/40" />
                  </div>
                  <p className="text-on-surface-variant">
                    Remplissez le formulaire ci-dessous pour reserver votre place dans la prochaine promotion.
                  </p>
                </div>

                {/* Form card */}
                <div
                  ref={formCardRef}
                  className="overflow-hidden rounded-3xl border border-orange-100/60 bg-white shadow-xl"
                  style={{ opacity: 0, boxShadow: '0 4px 48px rgba(58,48,42,0.09)' }}
                >
                  <div className="h-1 w-full bg-gradient-to-r from-primary via-orange-400 to-amber-200" />

                  <form onSubmit={handleSubmit} noValidate className="space-y-12 p-8 md:p-12">

                    {/* ── Personal info ── */}
                    <div>
                      <h3 className="mb-6 flex items-center gap-3 font-display text-xl font-bold text-on-surface">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">1</span>
                        Informations Personnelles
                        <div className="h-px flex-1 bg-outline-variant/30" />
                      </h3>
                      <div ref={fieldsRef} className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {[
                          { name: 'prenom',    label: 'Prenom',    type: 'text',   placeholder: 'Ex: Sarah',             err: errors.prenom },
                          { name: 'nom',       label: 'Nom',       type: 'text',   placeholder: 'Ex: Mansouri',          err: errors.nom },
                          { name: 'age',       label: 'Age',       type: 'number', placeholder: '22',                    err: errors.age },
                          { name: 'email',     label: 'E-mail',    type: 'email',  placeholder: 'sarah@exemple.com',     err: errors.email },
                          { name: 'telephone', label: 'Telephone', type: 'tel',    placeholder: '+212 6...',              err: errors.telephone },
                        ].map(({ name, label, type, placeholder, err }) => (
                          <div key={name} className="field-item" style={{ opacity: 0 }} data-has-error={err ? 'true' : undefined}>
                            <label className="mb-2 block px-1 text-sm font-semibold text-on-surface-variant">{label}</label>
                            <input type={type} name={name} value={(form as any)[name]} onChange={handleInputChange}
                              className={fc(err)} placeholder={placeholder} />
                            <FieldError msg={err} />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* ── Message ── */}
                    <div>
                      <label className="mb-2 block px-1 text-sm font-semibold text-on-surface-variant">
                        Niveau actuel &amp; aspirations <span className="font-normal opacity-60">(Optionnel)</span>
                      </label>
                      <textarea name="message" value={form.message} onChange={handleInputChange}
                        className={`${fc()} resize-none`} rows={4}
                        placeholder="Parlez-nous de vos projets ou de ce que vous souhaitez accomplir..." />
                    </div>

                    {/* ── Formation choice ── */}
                    <div>
                      <h3 className="mb-6 flex items-center gap-3 font-display text-xl font-bold text-on-surface">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">2</span>
                        Formation souhaitee
                        <div className="h-px flex-1 bg-outline-variant/30" />
                      </h3>
                      <div ref={toolsRef} className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        {INFOGRAPHIE_OPTIONS.map((item) => {
                          const active = form.graphic === item.value;
                          return (
                            <label key={item.value} className="tool-card cursor-pointer" style={{ opacity: 0 }}>
                              <input type="radio" name="graphic" value={item.value} checked={active} onChange={handleRadioChange} className="sr-only" />
                              <div
                                className="relative overflow-hidden rounded-2xl border-2 p-5 transition-all duration-300"
                                style={{
                                  border: active ? `2px solid ${item.color}` : '2px solid #e5e7eb',
                                  background: active ? `${item.color}0f` : 'white',
                                  boxShadow: active ? `0 8px 32px -12px ${item.color}60` : undefined,
                                }}
                              >
                                {/* Color accent top bar */}
                                <div className="absolute left-0 top-0 h-0.5 w-full transition-all duration-300"
                                  style={{ background: active ? item.color : 'transparent' }} />

                                {active && (
                                  <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full"
                                    style={{ background: item.color }}>
                                    <svg viewBox="0 0 12 10" width="8" height="6" fill="none">
                                      <path d="M1 5l3.5 3.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                  </span>
                                )}

                                <strong className="block text-sm font-bold text-on-surface">{item.label}</strong>
                                <span className="mt-2 block text-xs font-bold uppercase tracking-widest" style={{ color: item.color }}>
                                  {item.hours}H / {fmtAmount(item.price)}
                                </span>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    {/* ── Payment ── */}
                    <div ref={paymentRef}>
                      <h3 className="mb-6 flex items-center gap-3 font-display text-xl font-bold text-on-surface">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">3</span>
                        Mode de Paiement
                        <div className="h-px flex-1 bg-outline-variant/30" />
                      </h3>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2" data-has-error={errors.payment ? 'true' : undefined}>
                        {[
                          { value: 'online', icon: 'credit_card',    label: 'Paiement en ligne',     sub: 'Redirection securisee Payzone' },
                          { value: 'onsite', icon: 'calendar_month', label: 'Rendez-vous Presentiel', sub: 'Sur campus Elite Academy' },
                        ].map(({ value, icon, label, sub }) => {
                          const active = form.payment === value;
                          return (
                            <label key={value} className="pay-opt group cursor-pointer" style={{ opacity: 0 }}>
                              <input type="radio" name="payment" value={value} checked={active} onChange={handleRadioChange} className="sr-only" />
                              <div className={`flex items-center gap-4 rounded-2xl border-2 p-5 transition-all duration-200 ${active ? 'border-primary bg-primary/5 shadow-md shadow-primary/10' : 'border-outline-variant/50 bg-white group-hover:border-primary/40'}`}>
                                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all ${active ? 'bg-primary' : 'bg-surface-container'}`}>
                                  <span className="material-symbols-outlined text-xl" style={{ color: active ? 'white' : '#9ca3af' }}>{icon}</span>
                                </div>
                                <div className="flex-1">
                                  <p className="font-semibold text-on-surface">{label}</p>
                                  <p className="text-xs text-on-surface-variant">{sub}</p>
                                </div>
                                <span className="material-symbols-outlined text-xl"
                                  style={{ color: active ? 'var(--color-primary)' : '#d1d5db', fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}>
                                  radio_button_checked
                                </span>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                      <FieldError msg={errors.payment} />

                      {form.payment === 'online' && (
                        <div className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-sm">
                          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Paiement securise Payzone</p>
                          <h4 className="mt-1 text-xl font-bold text-on-surface">Redirection vers la page bancaire</h4>
                          <p className="mt-2 text-emerald-800">Apres validation, vous serez redirige vers Payzone. La banque peut demander un code 3D Secure.</p>
                        </div>
                      )}

                      {form.payment === 'onsite' && (
                        <div className="mt-6 overflow-hidden rounded-3xl border border-primary/20 bg-white shadow-sm">
                          <div className="h-1 w-full bg-gradient-to-r from-primary to-amber-300" />
                          <div className="p-6">
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Rendez-vous au centre</p>
                            <h4 className="mt-1 text-xl font-bold text-on-surface">Informations</h4>
                            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                              <div className="rounded-2xl border border-outline-variant/30 bg-[#faf7f4] p-5">
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">Adresse</p>
                                <p className="mt-2 text-sm font-semibold text-on-surface">14 avenue Hassan II, 1er etage, Ville Nouvelle, Meknes, Maroc</p>
                                <a href="https://www.google.com/maps/search/?api=1&query=33.8989909,-5.551918" target="_blank" rel="noreferrer"
                                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                                  <span className="material-symbols-outlined text-base leading-none">north_east</span>Google Maps
                                </a>
                              </div>
                              <div className="rounded-2xl border border-outline-variant/30 bg-[#faf7f4] p-5">
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">Horaires</p>
                                <div className="mt-2 space-y-1 text-sm text-on-surface">
                                  <p>Lundi – Vendredi : 08h00 – 18h00</p>
                                  <p>Samedi : 09h00 – 13h00</p>
                                  <p className="text-on-surface-variant">Dimanche : ferme</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* ── Legal ── */}
                    <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-5">
                      <p className="mb-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                        Conditions &amp; Confidentialite
                      </p>
                      {[
                        { name: 'acceptTerms',   err: errors.acceptTerms,   checked: form.acceptTerms,   label: <>J'accepte les <a href="/terms" className="font-semibold text-primary underline underline-offset-2">Conditions Generales</a> et le <a href="/reglement" className="font-semibold text-primary underline underline-offset-2">Reglement Interieur</a> de Elite Academy.</> },
                        { name: 'acceptPrivacy', err: errors.acceptPrivacy, checked: form.acceptPrivacy, label: "Je confirme que les informations fournies sont exactes et j'autorise Elite Academy a traiter mes donnees personnelles a des fins de gestion administrative et pedagogique." },
                      ].map(({ name, err, checked, label }) => (
                        <div key={name} data-has-error={err ? 'true' : undefined}>
                          <label className="group flex cursor-pointer items-start gap-3">
                            <div className="relative mt-0.5 shrink-0">
                              <input type="checkbox" name={name} checked={checked} onChange={handleInputChange}
                                className={`h-5 w-5 cursor-pointer appearance-none rounded border-2 bg-white transition-all checked:border-primary checked:bg-primary focus:outline-none focus:ring-2 focus:ring-primary/30 ${err ? 'border-red-400' : 'border-slate-300'}`} />
                              {checked && <span className="pointer-events-none absolute inset-0 flex items-center justify-center"><svg viewBox="0 0 12 10" width="10" height="8" fill="none"><path d="M1 5l3.5 3.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></span>}
                            </div>
                            <span className="text-sm leading-relaxed text-on-surface-variant transition-colors group-hover:text-on-surface">{label}</span>
                          </label>
                          <FieldError msg={err} />
                        </div>
                      ))}
                    </div>

                    {/* ── Submit ── */}
                    <div ref={submitRef} className="pt-8 text-center" style={{ opacity: 0 }}>
                      <button type="submit" disabled={submitting}
                        className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-primary px-12 py-5 text-lg font-bold text-on-primary shadow-xl transition-all duration-300 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                        style={{ boxShadow: '0 8px 32px rgba(194,101,42,0.3)' }}>
                        {/* Shimmer */}
                        <span className="absolute inset-0 -translate-x-full bg-white/15 transition-transform duration-600 group-hover:translate-x-full" />
                        {submitting ? <><span className="material-symbols-outlined mr-2 animate-spin">progress_activity</span>Traitement...</>
                          : <>{form.payment === 'online' ? 'Payer avec Payzone' : 'Lancer mon Parcours Creatif'}<span className="material-symbols-outlined ml-2 transition-transform duration-300 group-hover:translate-x-1">arrow_forward</span></>}
                      </button>
                      <p className="mt-4 text-xs text-on-surface-variant">Places limitees. Inscription soumise a validation du dossier.</p>
                    </div>

                    {submittedRef && (
                      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center">
                        <span className="material-symbols-outlined mb-2 text-3xl text-emerald-600" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                        <p className="font-semibold text-emerald-800">Inscription enregistree ! Un conseiller vous contactera sous 48h.</p>
                        <p className="mt-1 text-xs text-emerald-700">Reference : <span className="font-mono font-semibold">{submittedRef}</span></p>
                        {paymentCertificate && <button type="button" onClick={() => setShowPaymentCertificate(true)} className="mt-3 text-sm font-bold text-emerald-700 underline underline-offset-2">Voir le certificat de paiement</button>}
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </section>
          </main>
        </div>
      </PublicLayout>

      <style>{`
        /* ── Prevent double scrollbar ── */
        html { overflow-y: scroll; overflow-x: hidden; }
        body { overflow-x: hidden; }

        .infog-root {
          position: relative; min-height: 100vh;
          background: linear-gradient(180deg, #ffffff 0%, #fff8f0 40%, #fff3e6 100%);
        }
        .infog-geo-svg { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0; }
        .serif-headline { font-family: 'EB Garamond', serif; }
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }

        /* Badge pulse — CSS animation, no rAF loop */
        @keyframes badgePulse {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.04); }
        }
        .infog-badge {
          animation: badgePulse 2.4s ease-in-out infinite;
        }
        .infog-badge:nth-child(2) { animation-delay: 0.4s; }
        .infog-badge:nth-child(3) { animation-delay: 0.8s; }

        /* Scan line hover effect on image */
        .infog-scanline {
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 3px,
            rgba(194,101,42,0.04) 3px,
            rgba(194,101,42,0.04) 4px
          );
        }

        /* Stat pill subtle hover */
        .infog-stat-pill {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .infog-stat-pill:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(194,101,42,0.12);
        }

        /* Stripe layout */
        .infog-card-grid      { display: grid; gap: 16px; }
        .infog-card-field     { display: flex; flex-direction: column; gap: 6px; }
        .infog-card-full      { grid-column: 1 / -1; }
        .infog-card-subgrid   { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
        .infog-card-label     { margin-left: 4px; font-size: 0.875rem; font-weight: 600; }
        .infog-card-shell     { position: relative; display: flex; min-height: 54px; align-items: center; padding: 0 16px; }
        .infog-card-cvc-shell { padding-right: 58px; }
        .infog-card-el        { width: 100%; min-width: 0; }
        .infog-card-el-cvc    { padding-right: 4px; }
        .infog-card-cvc-icon  { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); pointer-events: none; }
        .infog-card-el .StripeElement { width: 100%; }
        .infog-card-el .StripeElement iframe { width: 100% !important; min-height: 22px; }

        @keyframes spin { to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 0.8s linear infinite; display: inline-block; }
        @media (max-width: 767px) { .infog-card-subgrid { grid-column: 1; } }
      `}</style>
    </>
  );
};

export default InscriptionInfographie;