import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { loadStripe } from '@stripe/stripe-js';
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import PublicLayout from '@/Layouts/PublicLayout';
import PaymentCertificate, { type PaymentCertificateData } from '@/Components/PaymentCertificate';
import { createStripePaymentIntent } from '@/lib/stripePayments';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import concoursimg from '../../../../public/images/concours.png';

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════ */
type PaymentMode    = '' | 'online' | 'onsite';
type ConcoursKey    = 'medecine' | 'ensa' | 'ensam' | 'encg' | 'iscae' | 'ena';
type FiliereKey     = '' | 'SM' | 'PC' | 'SVT' | 'ST' | 'SP';
type TypeLyceeKey   = '' | 'public' | 'prive';

interface FormData {
  nom: string; prenom: string; age: string; email: string; telephone: string;
  filiere: FiliereKey; lycee: string; typeLycee: TypeLyceeKey; villeResidence: string;
  noteRegional: string; noteNational: string; concours: ConcoursKey;
  paymentMethod: PaymentMode; acceptTerms: boolean; acceptPrivacy: boolean;
}
interface FormErrors {
  nom?: string; prenom?: string; age?: string; email?: string; telephone?: string;
  filiere?: string; lycee?: string; typeLycee?: string; villeResidence?: string;
  noteRegional?: string; noteNational?: string; concours?: string;
  paymentMethod?: string; card?: string; acceptTerms?: string; acceptPrivacy?: string;
}
interface StripeCardHandle {
  createPaymentMethod: (b: { name: string; email: string; phone: string }) => Promise<{ paymentMethodId: string } | { error: string }>;
}
interface StripeCardSectionProps {
  totalAmount: number; cardError?: string; processing: boolean; paymentDone: boolean;
  paymentReference?: string; onCardChange: (h: boolean) => void; onPayNow: () => void;
}

/* ═══════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════ */
const CONCOURS_OPTIONS: Array<{ value: ConcoursKey; label: string; price: number; hours: number }> = [
  { value: 'medecine', label: 'Preparation Medecine', price: 1000, hours: 15 },
  { value: 'ensa',     label: 'Preparation ENSA',     price: 800,  hours: 12 },
  { value: 'ensam',    label: 'Preparation ENSAM',    price: 1200, hours: 14 },
  { value: 'encg',     label: 'Preparation ENCG',     price: 500,  hours: 13 },
  { value: 'iscae',    label: 'Preparation ISCAE',    price: 1200, hours: 15 },
  { value: 'ena',      label: 'Preparation ENA',      price: 600,  hours: 10 },
];
const FILIERE_OPTIONS: Array<{ value: FiliereKey; label: string }> = [
  { value: 'SM',  label: 'SM - Science math' },
  { value: 'PC',  label: 'PC' },
  { value: 'SVT', label: 'SVT' },
  { value: 'ST',  label: 'ST' },
  { value: 'SP',  label: 'SP' },
];

/* ═══════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════ */
const fmtAmount = (n: number) => `${n.toLocaleString('fr-MA')} DH`;
const okEmail   = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const okPhone   = (v: string) => /^[+\d\s\-()]{8,}$/.test(v.trim());
const okGrade   = (v: string) => { const n = Number(v.trim().replace(',', '.')); return v.trim() !== '' && Number.isFinite(n) && n >= 0 && n <= 20; };
const secureRef = (prefix: string) => { const b = new Uint32Array(2); crypto.getRandomValues(b); return `${prefix}-${Date.now().toString(36).toUpperCase()}-${b[0].toString(36).slice(0,4).toUpperCase()}${b[1].toString(36).slice(0,4).toUpperCase()}`; };
const inputCls  = (err?: string) => `w-full rounded-lg border bg-surface-bright/80 px-4 py-3 transition-all focus:outline-none focus:ring-2 ${err ? 'border-red-400 bg-red-50/30 focus:ring-red-200' : 'border-outline-variant/60 focus:border-primary focus:ring-primary/20'}`;
const FieldError: React.FC<{ msg?: string }> = ({ msg }) =>
  msg ? <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500"><span className="material-symbols-outlined text-sm leading-none">error</span>{msg}</p> : null;

/* ═══════════════════════════════════════════════════
   BRAND LOGOS
═══════════════════════════════════════════════════ */
const LogoVisa: React.FC<{ active: boolean }> = ({ active }) => (
  <svg viewBox="0 0 50 32" width="44" height="28" style={{ opacity: active ? 1 : 0.3, transition: 'opacity .25s' }} aria-label="Visa">
    <rect width="50" height="32" rx="5" fill="#0055A5" /><text x="5" y="22" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="13" fill="#FFF" letterSpacing="-0.5">VISA</text>
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

/* ═══════════════════════════════════════════════════
   STRIPE CARD SECTION
═══════════════════════════════════════════════════ */
const StripeCardSection = forwardRef<StripeCardHandle, StripeCardSectionProps>(
  ({ totalAmount, cardError, processing, paymentDone, paymentReference, onCardChange, onPayNow }, ref) => {
    const stripe = useStripe(); const elements = useElements();
    const [numberComplete, setNumberComplete] = useState(false);
    const [expiryComplete, setExpiryComplete] = useState(false);
    const [cvcComplete,    setCvcComplete]    = useState(false);
    const [brand,          setBrand]          = useState('unknown');
    const allComplete = numberComplete && expiryComplete && cvcComplete;
    const syncCardState = (next: { number?: boolean; expiry?: boolean; cvc?: boolean; hasOwnError: boolean }) => {
      onCardChange(next.hasOwnError || !(next.number ?? numberComplete) || !(next.expiry ?? expiryComplete) || !(next.cvc ?? cvcComplete));
    };
    useImperativeHandle(ref, () => ({
      async createPaymentMethod(billingDetails) {
        if (!stripe || !elements) return { error: 'Stripe non initialise.' };
        const cardNumber = elements.getElement(CardNumberElement);
        if (!cardNumber) return { error: 'Element carte introuvable.' };
        const { error, paymentMethod } = await stripe.createPaymentMethod({ type: 'card', card: cardNumber, billing_details: billingDetails });
        if (error) return { error: error.message ?? 'Erreur carte.' };
        try {
          const intent = await createStripePaymentIntent({ amount: totalAmount, category: 'Concours', email: billingDetails.email, name: billingDetails.name });
          const { error: ce, paymentIntent } = await stripe.confirmCardPayment(intent.client_secret, { payment_method: paymentMethod.id });
          if (ce) return { error: ce.message ?? 'Paiement refuse.' };
          if (!paymentIntent || paymentIntent.status !== 'succeeded') return { error: 'Paiement non confirme.' };
          return { paymentMethodId: paymentIntent.id };
        } catch (e) { return { error: e instanceof Error ? e.message : 'Erreur Stripe.' }; }
      },
    }));
    const eo = { style: { base: { fontSize: '15px', fontFamily: 'inherit', color: '#1c1c1e', '::placeholder': { color: '#9ca3af' } }, invalid: { color: '#dc2626' } } };
    const fc = (he?: boolean) => `rounded-xl border bg-white transition-all focus-within:ring-2 ${he ? 'border-red-400 focus-within:ring-red-200' : 'border-outline-variant focus-within:border-primary focus-within:ring-primary/20'}`;
    const DL = brand !== 'unknown' ? BRAND_LOGO[brand] : null;
    return (
      <div className="mt-6 rounded-3xl border border-primary/20 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Paiement securise</p><h4 className="mt-1 font-headline text-2xl font-bold text-on-surface">Carte bancaire</h4></div>
          <div className="flex items-center gap-2 rounded-full border border-outline-variant/40 bg-surface-container px-4 py-2"><span className="material-symbols-outlined text-base text-emerald-600">lock</span><span className="text-sm font-bold text-on-surface">{fmtAmount(totalAmount)}</span></div>
        </div>
        <div className="payment-card-grid">
          <div className="payment-card-field payment-card-field-full">
            <div className="flex items-center justify-between"><label className="payment-card-label">Numero de carte</label><div className="flex items-center gap-1.5">{DL ? <DL active /> : ALL_BRANDS.map((b) => { const L = BRAND_LOGO[b]; return <L key={b} active />; })}</div></div>
            <div className={`${fc(!!cardError && !numberComplete)} payment-card-input-shell`}><div className="payment-card-element"><CardNumberElement options={{ ...eo, showIcon: false }} onChange={(ev) => { setNumberComplete(ev.complete); setBrand(ev.brand ?? 'unknown'); syncCardState({ number: ev.complete, hasOwnError: !!ev.error }); }} /></div></div>
          </div>
          <div className="payment-card-subgrid payment-card-field-full">
            <div className="payment-card-field"><label className="payment-card-label">Date d'expiration</label><div className={`${fc()} payment-card-input-shell`}><div className="payment-card-element"><CardExpiryElement options={eo} onChange={(ev) => { setExpiryComplete(ev.complete); syncCardState({ expiry: ev.complete, hasOwnError: !!ev.error }); }} /></div></div></div>
            <div className="payment-card-field"><label className="payment-card-label">Code de securite</label><div className={`${fc()} payment-card-input-shell payment-card-cvc-shell`}><div className="payment-card-element payment-card-element-cvc"><CardCvcElement options={eo} onChange={(ev) => { setCvcComplete(ev.complete); syncCardState({ cvc: ev.complete, hasOwnError: !!ev.error }); }} /></div><div className="payment-card-cvc-icon"><CvcIcon /></div></div></div>
          </div>
          {cardError && <FieldError msg={cardError} />}
          {allComplete && !cardError && <p className="mt-1.5 flex items-center gap-1.5 text-xs text-emerald-600"><span className="material-symbols-outlined text-sm leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>Informations de carte valides</p>}
        </div>
        <button type="button" onClick={onPayNow} disabled={processing || paymentDone || !stripe || !allComplete}
          className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-2xl py-4 text-sm font-bold tracking-wide text-white shadow-lg transition-all disabled:cursor-not-allowed disabled:opacity-60"
          style={{ background: paymentDone ? 'linear-gradient(135deg,#059669,#047857)' : 'linear-gradient(135deg,#059669,#065f46)' }}>
          {processing ? <><span className="material-symbols-outlined animate-spin text-xl leading-none">progress_activity</span>Paiement en cours...</>
            : paymentDone ? <><span className="material-symbols-outlined text-xl leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>task_alt</span>Paiement effectue</>
            : <><span className="material-symbols-outlined text-xl leading-none">lock</span>Payer {fmtAmount(totalAmount)}</>}
        </button>
        {paymentDone && paymentReference && <div className="mt-4 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4"><span className="material-symbols-outlined mt-0.5 text-base text-emerald-600" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span><div><p className="text-sm font-semibold text-emerald-800">Paiement effectue avec succes</p><p className="mt-0.5 text-xs text-emerald-700">Reference : <span className="font-mono font-semibold">{paymentReference}</span></p></div></div>}
        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-3"><span className="material-symbols-outlined text-base text-emerald-600">security</span><p className="text-xs leading-relaxed text-emerald-800">Vos donnees sont chiffrees par <strong>Stripe</strong> (PCI-DSS niveau 1).</p></div>
      </div>
    );
  }
);
StripeCardSection.displayName = 'StripeCardSection';

/* ═══════════════════════════════════════════════════
   4-PIECE PUZZLE IMAGE
   The container clips the image into 4 quadrants.
   Each piece starts displaced from its corner, then
   slowly slides back to its exact position, the gap
   closes and the image becomes whole.
═══════════════════════════════════════════════════ */
interface PuzzleImageProps {
  src: string;
  alt: string;
  className?: string;
}

const PuzzleImage: React.FC<PuzzleImageProps> = ({ src, alt, className = '' }) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggered = useRef(false);

  // The 4 quadrants: which part of image they show + where they start
  const quadrants = [
    // [row, col] → [startX, startY]
    { row: 0, col: 0, startX: -90, startY: -90 },  // top-left  → comes from top-left
    { row: 0, col: 1, startX:  90, startY: -90 },  // top-right → comes from top-right
    { row: 1, col: 0, startX: -90, startY:  90 },  // bot-left  → comes from bot-left
    { row: 1, col: 1, startX:  90, startY:  90 },  // bot-right → comes from bot-right
  ];

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const pieces = el.querySelectorAll<HTMLElement>('.puzzle-piece');
    // Set initial positions
    pieces.forEach((piece, i) => {
      const q = quadrants[i];
      gsap.set(piece, { x: q.startX, y: q.startY, opacity: 0 });
    });

    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 75%',
      onEnter: () => {
        if (triggered.current) return;
        triggered.current = true;

        const tl = gsap.timeline();

        // All 4 pieces animate simultaneously but with very slightly different
        // durations and easings for an organic feel
        pieces.forEach((piece, i) => {
          const delays   = [0, 0.08, 0.05, 0.12];
          const durations = [1.4, 1.5, 1.45, 1.55];

          tl.to(piece, {
            x: 0,
            y: 0,
            opacity: 1,
            duration: durations[i],
            ease: 'power4.out',
            delay: delays[i],
          }, 0);
        });

        // After pieces arrive, fade the gap lines (seam overlay) to 0
        tl.to(el.querySelector('.puzzle-seam'), {
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out',
        }, 1.2);

        // Subtle "snap" scale for the whole container
        tl.fromTo(el, { scale: 0.97 }, { scale: 1, duration: 0.5, ease: 'back.out(1.5)' }, 1.0);
      },
    });

    return () => { st.kill(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={wrapRef}
      className={`relative overflow-hidden rounded-2xl shadow-2xl ${className}`}
      style={{ aspectRatio: '4/5' }}
      aria-label={alt}
      role="img"
    >
      {/* 4 quadrant pieces */}
      {quadrants.map(({ row, col }, i) => (
        <div
          key={i}
          className="puzzle-piece absolute"
          style={{
            // Each piece is exactly half of width/height
            width:  '50%',
            height: '50%',
            top:    row === 0 ? '0%' : '50%',
            left:   col === 0 ? '0%' : '50%',
            // overflow:hidden clips the background to this piece
            overflow: 'hidden',
            willChange: 'transform, opacity',
          }}
        >
          {/* The background image is positioned so each piece shows its quadrant */}
          <div
            style={{
              position: 'absolute',
              // Image must be 2x bigger than each piece, positioned so the right quadrant shows
              width:  '200%',
              height: '200%',
              top:    row === 0 ? '0%' : '-100%',
              left:   col === 0 ? '0%' : '-100%',
              backgroundImage: `url(${src})`,
              backgroundSize:  'cover',
              backgroundPosition: 'center',
            }}
          />
        </div>
      ))}

      {/* Seam overlay: visible cross lines that look like puzzle gaps, fade out when assembled */}
      <div
        className="puzzle-seam pointer-events-none absolute inset-0 z-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, transparent calc(50% - 1.5px), rgba(255,255,255,0.9) calc(50% - 1.5px), rgba(255,255,255,0.9) calc(50% + 1.5px), transparent calc(50% + 1.5px)),
            linear-gradient(to bottom, transparent calc(50% - 1.5px), rgba(255,255,255,0.9) calc(50% - 1.5px), rgba(255,255,255,0.9) calc(50% + 1.5px), transparent calc(50% + 1.5px))
          `,
        }}
      />

      {/* Subtle vignette on the assembled image */}
      <div className="pointer-events-none absolute inset-0 z-20 rounded-2xl"
        style={{ background: 'linear-gradient(to top, rgba(26,20,16,0.3) 0%, transparent 45%)' }} />
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════ */
interface Props { stripePublishableKey?: string; }

const InscriptionConcours: React.FC<Props> = ({
  stripePublishableKey = (import.meta as any).env?.VITE_STRIPE_PK ?? '',
}) => {
  const stripePromise = useMemo(() => stripePublishableKey ? loadStripe(stripePublishableKey) : null, [stripePublishableKey]);
  const stripeOptions = useMemo(() => ({ mode: 'payment' as const, amount: 100, currency: 'mad', appearance: { theme: 'stripe' as const, variables: { fontFamily: 'inherit', borderRadius: '12px' } } }), []);
  const stripeCardRef = useRef<StripeCardHandle>(null);

  // ── GSAP refs ──
  const heroLeftRef   = useRef<HTMLDivElement>(null);
  const heroTagRef    = useRef<HTMLSpanElement>(null);
  const heroH1Ref     = useRef<HTMLHeadingElement>(null);
  const heroDescRef   = useRef<HTMLParagraphElement>(null);
  const heroStatsRef  = useRef<HTMLDivElement>(null);
  const heroCardsRef  = useRef<HTMLDivElement>(null);
  const sectionTitleRef = useRef<HTMLDivElement>(null);
  const formCardRef   = useRef<HTMLElement>(null);
  const sidebarRef    = useRef<HTMLElement>(null);
  const step1Ref      = useRef<HTMLDivElement>(null);
  const step2Ref      = useRef<HTMLDivElement>(null);
  const step3Ref      = useRef<HTMLDivElement>(null);
  const submitRef     = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<FormData>({
    nom: '', prenom: '', age: '', email: '', telephone: '',
    filiere: '', lycee: '', typeLycee: '', villeResidence: '',
    noteRegional: '', noteNational: '', concours: 'medecine',
    paymentMethod: '', acceptTerms: false, acceptPrivacy: false,
  });
  const [errors,                 setErrors]                 = useState<FormErrors>({});
  const [cardHasError,           setCardHasError]           = useState(true);
  const [submitting,             setSubmitting]             = useState(false);
  const [onlinePaymentCompleted, setOnlinePaymentCompleted] = useState(false);
  const [onlinePaymentReference, setOnlinePaymentReference] = useState('');
  const [submittedReference,     setSubmittedReference]     = useState('');
  const [paymentCertificate,     setPaymentCertificate]     = useState<PaymentCertificateData | null>(null);
  const [showPaymentCertificate, setShowPaymentCertificate] = useState(false);
  const defaultPaymentDate = useMemo(() => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().slice(0, 10); }, []);
  const selectedConcours = useMemo(() => CONCOURS_OPTIONS.find((i) => i.value === formData.concours) ?? CONCOURS_OPTIONS[0], [formData.concours]);
  const totalAmount = selectedConcours.price;
  const clearErr = (f: keyof FormErrors) => setErrors((p) => ({ ...p, [f]: undefined }));

  /* ── GSAP orchestration ── */
  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── Hero left col ──
      const heroTl = gsap.timeline({ defaults: { ease: 'expo.out' } });

      heroTl.fromTo(heroTagRef.current,
        { opacity: 0, y: 16, letterSpacing: '0.5em' },
        { opacity: 1, y: 0, letterSpacing: '0.08em', duration: 0.8 }, 0.1
      );
      heroTl.fromTo(heroH1Ref.current,
        { opacity: 0, clipPath: 'inset(100% 0% 0% 0%)' },
        { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1 }, 0.4
      );
      heroTl.fromTo(heroDescRef.current,
        { opacity: 0, x: -24 },
        { opacity: 1, x: 0, duration: 0.7 }, 0.8
      );
      if (heroStatsRef.current) {
        heroTl.fromTo(
          heroStatsRef.current.querySelectorAll('.stat-col'),
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, stagger: 0.15, duration: 0.6 }, 1.0
        );
      }
      if (heroCardsRef.current) {
        heroTl.fromTo(
          heroCardsRef.current.querySelectorAll('.concours-card'),
          { opacity: 0, y: 30, scale: 0.92 },
          { opacity: 1, y: 0, scale: 1, stagger: 0.09, duration: 0.6, ease: 'back.out(1.5)' }, 1.15
        );
      }

      // ── Section title ──
      if (sectionTitleRef.current) {
        ScrollTrigger.create({
          trigger: sectionTitleRef.current, start: 'top 82%',
          onEnter: () => gsap.fromTo(sectionTitleRef.current,
            { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
          ),
        });
      }

      // ── Form card ──
      if (formCardRef.current) {
        ScrollTrigger.create({
          trigger: formCardRef.current, start: 'top 78%',
          onEnter: () => gsap.fromTo(formCardRef.current,
            { opacity: 0, y: 48, clipPath: 'inset(4% 0% 0% 0% round 24px)' },
            { opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0% round 24px)', duration: 1.1, ease: 'expo.out' }
          ),
        });
      }

      // ── Sidebar cards ──
      if (sidebarRef.current) {
        ScrollTrigger.create({
          trigger: sidebarRef.current, start: 'top 78%',
          onEnter: () => gsap.fromTo(
            sidebarRef.current!.querySelectorAll('.sidebar-card'),
            { opacity: 0, x: 40 },
            { opacity: 1, x: 0, stagger: 0.15, duration: 0.75, ease: 'power3.out' }
          ),
        });
      }

      // ── Step 1 fields ──
      if (step1Ref.current) {
        ScrollTrigger.create({
          trigger: step1Ref.current, start: 'top 82%',
          onEnter: () => gsap.fromTo(
            step1Ref.current!.querySelectorAll('.field-row'),
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, stagger: 0.08, duration: 0.5, ease: 'power3.out' }
          ),
        });
      }
      // ── Step 2 fields ──
      if (step2Ref.current) {
        ScrollTrigger.create({
          trigger: step2Ref.current, start: 'top 82%',
          onEnter: () => gsap.fromTo(
            step2Ref.current!.querySelectorAll('.field-row'),
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, stagger: 0.07, duration: 0.5, ease: 'power3.out' }
          ),
        });
      }
      // ── Step 3 ──
      if (step3Ref.current) {
        ScrollTrigger.create({
          trigger: step3Ref.current, start: 'top 85%',
          onEnter: () => gsap.fromTo(
            step3Ref.current!.querySelectorAll('.payment-opt'),
            { opacity: 0, scale: 0.94, x: -16 },
            { opacity: 1, scale: 1, x: 0, stagger: 0.14, duration: 0.6, ease: 'back.out(1.6)' }
          ),
        });
      }
      // ── Submit ──
      if (submitRef.current) {
        ScrollTrigger.create({
          trigger: submitRef.current, start: 'top 88%',
          onEnter: () => gsap.fromTo(submitRef.current,
            { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
          ),
        });
      }

      // ── SVG geo parallax ──
      gsap.to('.page-bg-geo', { yPercent: 12, ease: 'none', scrollTrigger: { scrub: 3 } });
    });
    return () => ctx.revert();
  }, []);

  /* ── Handlers ── */
  const validateFinal = (): FormErrors => {
    const e: FormErrors = {};
    if (!formData.nom.trim())   e.nom      = 'Le nom est requis.';
    if (!formData.prenom.trim()) e.prenom  = 'Le prenom est requis.';
    if (!formData.age || Number(formData.age) < 15 || Number(formData.age) > 30) e.age = 'Age valide requis (15–30).';
    if (!okEmail(formData.email))      e.email     = 'Adresse email invalide.';
    if (!okPhone(formData.telephone))  e.telephone = 'Telephone invalide.';
    if (!formData.filiere)             e.filiere   = 'Selectionnez votre filiere.';
    if (!formData.lycee.trim())        e.lycee     = 'Indiquez votre lycee.';
    if (!formData.typeLycee)           e.typeLycee = 'Selectionnez le type de lycee.';
    if (!formData.villeResidence.trim()) e.villeResidence = 'Indiquez votre ville.';
    if (!okGrade(formData.noteRegional)) e.noteRegional = 'Note regionale invalide (0–20).';
    if (!okGrade(formData.noteNational)) e.noteNational = 'Note nationale invalide (0–20).';
    if (!formData.concours)            e.concours  = 'Selectionnez un concours.';
    if (!formData.paymentMethod)       e.paymentMethod = 'Choisissez un mode de reglement.';
    if (!formData.acceptTerms)         e.acceptTerms   = 'Acceptez les conditions generales.';
    if (!formData.acceptPrivacy)       e.acceptPrivacy = 'Acceptez la politique de confidentialite.';
    return e;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') { setFormData((p) => ({ ...p, [name]: (e.target as HTMLInputElement).checked })); clearErr(name as keyof FormErrors); return; }
    setFormData((p) => ({ ...p, [name]: value }));
    clearErr(name as keyof FormErrors);
    if (name === 'paymentMethod' || name === 'concours') { setOnlinePaymentCompleted(false); setOnlinePaymentReference(''); clearErr('card'); }
  };

  const handleOnlinePayment = async () => {
    const pre: FormErrors = {};
    if (!formData.nom.trim())    pre.nom = 'Le nom est requis.';
    if (!formData.prenom.trim()) pre.prenom = 'Le prenom est requis.';
    if (!okEmail(formData.email)) pre.email = 'Email invalide.';
    if (!okPhone(formData.telephone)) pre.telephone = 'Telephone invalide.';
    if (!formData.filiere) pre.filiere = 'Selectionnez votre filiere.';
    if (!formData.lycee.trim()) pre.lycee = 'Indiquez votre lycee.';
    if (!formData.typeLycee) pre.typeLycee = 'Selectionnez le type.';
    if (!formData.villeResidence.trim()) pre.villeResidence = 'Indiquez votre ville.';
    if (!okGrade(formData.noteRegional)) pre.noteRegional = 'Note regionale invalide.';
    if (!okGrade(formData.noteNational)) pre.noteNational = 'Note nationale invalide.';
    if (!formData.concours) pre.concours = 'Selectionnez un concours.';
    if (cardHasError) pre.card = 'Completez les informations de carte.';
    if (Object.keys(pre).length) { setErrors((p) => ({ ...p, ...pre })); return; }
    setSubmitting(true);
    try {
      if (!stripeCardRef.current) { setErrors((p) => ({ ...p, card: 'Formulaire carte introuvable.' })); return; }
      const result = await stripeCardRef.current.createPaymentMethod({ name: `${formData.prenom} ${formData.nom}`, email: formData.email, phone: formData.telephone });
      if ('error' in result) { setErrors((p) => ({ ...p, card: result.error })); return; }
      setOnlinePaymentCompleted(true); setOnlinePaymentReference(result.paymentMethodId); clearErr('card');
    } finally { setSubmitting(false); }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fe = validateFinal();
    if (Object.keys(fe).length) { setErrors(fe); document.querySelector('[data-has-error="true"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
    setSubmitting(true);
    const reference    = secureRef('PAYCERT');
    const paymentRef   = formData.paymentMethod === 'online' ? undefined : secureRef('PAY');
    router.post(route('applications.store'), {
      first_name: formData.prenom, last_name: formData.nom, email: formData.email, phone: formData.telephone,
      category: 'Concours', training_label: selectedConcours.label, amount: totalAmount,
      payment_method: formData.paymentMethod, payment_provider: formData.paymentMethod === 'online' ? 'payzone' : undefined,
      payment_reference: paymentRef, preferred_payment_date: formData.paymentMethod === 'onsite' ? defaultPaymentDate : undefined,
      certificate_reference: reference, form_data: { ...formData },
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setSubmittedReference(reference);
        setPaymentCertificate({
          studentName: `${formData.prenom.trim()} ${formData.nom.trim()}`, reference,
          barcodeValue: `${reference}-${paymentRef}`, trainingLabel: selectedConcours.label,
          category: 'Concours', amount: fmtAmount(totalAmount),
          paymentMode: formData.paymentMethod === 'online' ? 'Paiement en ligne' : 'Paiement presentiel',
          paymentStatus: formData.paymentMethod === 'online' ? 'Paye' : 'Paiement a regler au centre',
          issuedAt: new Date().toLocaleString('fr-MA'),
        });
        setShowPaymentCertificate(true);
      },
      onFinish: () => setSubmitting(false),
    });
  };

  /* ════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════ */
  return (
    <>
      <Head title="Inscription aux concours" />
      {showPaymentCertificate && paymentCertificate && (
        <PaymentCertificate certificate={paymentCertificate} onClose={() => setShowPaymentCertificate(false)} />
      )}

      <PublicLayout>
        <div className="page-bg-warm">
          {/* ── Geometric SVG background ── */}
          <svg className="page-bg-geo" viewBox="0 0 1200 900" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <circle cx="80"   cy="120"  r="160" fill="none" stroke="rgba(194,101,42,0.10)" strokeWidth="1.5"/>
            <circle cx="80"   cy="120"  r="100" fill="none" stroke="rgba(194,101,42,0.08)" strokeWidth="1"/>
            <circle cx="1150" cy="780"  r="200" fill="none" stroke="rgba(194,101,42,0.09)" strokeWidth="1.5"/>
            <circle cx="1150" cy="780"  r="120" fill="none" stroke="rgba(194,101,42,0.06)" strokeWidth="1"/>
            <circle cx="620"  cy="450"  r="280" fill="none" stroke="rgba(194,101,42,0.05)" strokeWidth="1"/>
            <line x1="0"   y1="300" x2="200" y2="100" stroke="rgba(194,101,42,0.12)" strokeWidth="1"/>
            <line x1="20"  y1="320" x2="220" y2="120" stroke="rgba(194,101,42,0.07)" strokeWidth="0.8"/>
            <line x1="1000" y1="600" x2="1200" y2="800" stroke="rgba(194,101,42,0.10)" strokeWidth="1"/>
            <g stroke="rgba(194,101,42,0.18)" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <line x1="1050" y1="80" x2="1120" y2="80"/><polyline points="1105,66 1120,80 1105,94"/>
            </g>
            <g stroke="rgba(194,101,42,0.20)" strokeWidth="1.5" strokeLinecap="round">
              <line x1="940" y1="140" x2="960" y2="160"/><line x1="960" y1="140" x2="940" y2="160"/>
            </g>
            {[0,1,2,3,4].map((row) => [0,1,2,3,4,5].map((col) => (
              <circle key={`${row}-${col}`} cx={500+col*60} cy={200+row*60} r="1.5" fill="rgba(194,101,42,0.12)" />
            )))}
            <path d="M 100 600 Q 400 400 700 600" fill="none" stroke="rgba(194,101,42,0.08)" strokeWidth="1" strokeDasharray="6 8"/>
          </svg>

          <main className="relative z-10 mx-auto max-w-7xl px-6 py-12 md:py-20">

            {/* ══════════════════ HERO ══════════════════ */}
            <section className="mb-24 grid grid-cols-1 items-center gap-16 lg:grid-cols-2">

              {/* Left — text */}
              <div ref={heroLeftRef}>
                <span
                  ref={heroTagRef}
                  className="mb-6 inline-block rounded-full bg-tertiary-fixed px-3 py-1 text-xs font-bold uppercase tracking-widest text-on-tertiary-fixed-variant"
                  style={{ opacity: 0 }}
                >
                  Inscriptions Ouvertes
                </span>

                <h1
                  ref={heroH1Ref}
                  className="serif-tight mb-8 font-headline text-5xl leading-[1.1] text-on-surface md:text-7xl"
                  style={{ opacity: 0 }}
                >
                  Inscriptions :<br />
                  <span className="italic text-primary">Concours d'Excellence</span>
                </h1>

                <p
                  ref={heroDescRef}
                  className="mb-10 max-w-xl text-lg font-light leading-relaxed text-on-secondary-container md:text-xl"
                  style={{ opacity: 0 }}
                >
                  Preparez votre avenir avec l'elite. Nos programmes specialises pour Medecine, ENCG
                  et ENSA sont concus pour transformer votre ambition en reussite concrete.
                </p>

                <div ref={heroStatsRef} className="mb-12 flex items-center gap-6">
                  <div className="stat-col flex flex-col" style={{ opacity: 0 }}>
                    <span className="font-headline text-4xl font-bold text-primary">94%</span>
                    <span className="font-label text-sm uppercase tracking-tighter text-outline">Taux de Reussite</span>
                  </div>
                  <div className="h-12 w-[1px] bg-outline-variant" />
                  <div className="stat-col flex flex-col" style={{ opacity: 0 }}>
                    <span className="font-headline text-4xl font-bold tracking-tight text-on-surface">{new Date().getFullYear()}</span>
                    <span className="font-label text-sm uppercase tracking-tighter text-outline">Promotion Actuelle</span>
                  </div>
                </div>

                <div ref={heroCardsRef} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {CONCOURS_OPTIONS.map((item) => (
                    <div key={item.value}
                      className="concours-card rounded-xl border border-outline-variant/30 bg-surface-container-low p-6"
                      style={{ opacity: 0 }}>
                      <p className="mb-1 font-label text-sm text-outline">{item.label.split(' ')[1] ?? item.label}</p>
                      <p className="font-headline text-2xl font-semibold">{fmtAmount(item.price)}</p>
                      <p className="mt-1 text-xs font-bold uppercase tracking-widest text-primary">{item.hours}H</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — 4-piece puzzle image */}
              <div className="group relative">
                <div className="absolute -inset-6 rounded-3xl bg-primary/5 blur-3xl transition-all duration-700 group-hover:bg-primary/10" />

                {/* ── THE PUZZLE IMAGE ── */}
                <PuzzleImage
                  src={concoursimg}
                  alt="Etudiants concentres etudiant ensemble dans une bibliotheque moderne"
                  className="relative border border-white/20"
                />

                {/* Floating quote card — preserved from original */}
                <div className="absolute bottom-8 -left-8 hidden max-w-[200px] rounded-xl border border-outline-variant/40 bg-surface-bright p-6 shadow-xl md:block">
                  <span className="material-symbols-outlined mb-2 text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                  <p className="text-sm font-medium italic">"L'excellence est une habitude, pas un acte."</p>
                </div>
              </div>
            </section>

            {/* ══════════════════ SECTION TITLE ══════════════════ */}
            <div ref={sectionTitleRef} className="mb-16 text-center" style={{ opacity: 0 }}>
              <h2 className="mb-4 font-headline text-4xl text-on-surface md:text-5xl">Formulaire de Candidature</h2>
              <div className="mb-6 flex items-center justify-center gap-4">
                <div className="h-[1px] w-12 bg-primary/40" />
                <p className="font-label text-sm uppercase tracking-[0.2em] text-on-secondary-container">Etape decisive vers votre reussite</p>
                <div className="h-[1px] w-12 bg-primary/40" />
              </div>
              <p className="mx-auto max-w-2xl text-lg font-light text-on-surface-variant">
                Veuillez remplir les informations ci-dessous avec precision. Notre equipe examinera votre profil.
              </p>
            </div>

            {/* ══════════════════ FORM + SIDEBAR ══════════════════ */}
            <div className="relative flex flex-col gap-12 lg:flex-row">

              {/* ── FORM ── */}
              <section
                ref={formCardRef}
                className="relative overflow-hidden rounded-3xl border border-outline-variant/20 bg-surface-container-lowest p-8 shadow-sm md:p-12 lg:w-2/3"
                style={{ opacity: 0 }}
              >
                <div className="geometric-bg pointer-events-none absolute inset-0 opacity-40" />

                <form onSubmit={handleSubmit} noValidate className="relative z-10 space-y-10">

                  {/* Step 1 — Personal */}
                  <div>
                    <h2 className="mb-8 flex items-center gap-3 font-headline text-3xl">
                      <span className="h-[1px] w-8 bg-primary" />Informations Personnelles
                    </h2>
                    <div ref={step1Ref} className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      {[
                        { name: 'nom',       label: 'Nom',       type: 'text',   placeholder: 'Entrez votre nom',     err: errors.nom },
                        { name: 'prenom',    label: 'Prenom',    type: 'text',   placeholder: 'Entrez votre prenom',  err: errors.prenom },
                        { name: 'age',       label: 'Age',       type: 'number', placeholder: 'Ex: 18',               err: errors.age },
                        { name: 'email',     label: 'Email',     type: 'email',  placeholder: 'votre@email.com',      err: errors.email },
                        { name: 'telephone', label: 'Telephone', type: 'tel',    placeholder: '+212 6...',             err: errors.telephone },
                      ].map(({ name, label, type, placeholder, err }) => (
                        <div key={name} className="field-row" style={{ opacity: 0 }} data-has-error={err ? 'true' : undefined}>
                          <label className="font-label text-sm font-semibold uppercase tracking-wider text-on-surface-variant">{label}</label>
                          <input type={type} name={name} value={(formData as any)[name]} onChange={handleChange} className={inputCls(err)} placeholder={placeholder} />
                          <FieldError msg={err} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Step 2 — Scolaire */}
                  <div>
                    <h2 className="mb-8 flex items-center gap-3 font-headline text-3xl">
                      <span className="h-[1px] w-8 bg-primary" />Informations Scolaires
                    </h2>
                    <div ref={step2Ref} className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="field-row" style={{ opacity: 0 }} data-has-error={errors.filiere ? 'true' : undefined}>
                        <label className="font-label text-sm font-semibold uppercase tracking-wider text-on-surface-variant">Filiere</label>
                        <select name="filiere" value={formData.filiere} onChange={handleChange} className={inputCls(errors.filiere)}>
                          <option value="">Selectionnez votre filiere</option>
                          {FILIERE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                        <FieldError msg={errors.filiere} />
                      </div>
                      <div className="field-row" style={{ opacity: 0 }} data-has-error={errors.lycee ? 'true' : undefined}>
                        <label className="font-label text-sm font-semibold uppercase tracking-wider text-on-surface-variant">Lycee</label>
                        <input type="text" name="lycee" value={formData.lycee} onChange={handleChange} className={inputCls(errors.lycee)} placeholder="Nom de votre lycee" />
                        <FieldError msg={errors.lycee} />
                      </div>
                      <div className="field-row" style={{ opacity: 0 }} data-has-error={errors.typeLycee ? 'true' : undefined}>
                        <label className="font-label text-sm font-semibold uppercase tracking-wider text-on-surface-variant">Type de lycee</label>
                        <select name="typeLycee" value={formData.typeLycee} onChange={handleChange} className={inputCls(errors.typeLycee)}>
                          <option value="">Selectionnez le type</option>
                          <option value="public">Public</option>
                          <option value="prive">Prive</option>
                        </select>
                        <FieldError msg={errors.typeLycee} />
                      </div>
                      <div className="field-row" style={{ opacity: 0 }} data-has-error={errors.villeResidence ? 'true' : undefined}>
                        <label className="font-label text-sm font-semibold uppercase tracking-wider text-on-surface-variant">Ville de residence</label>
                        <input type="text" name="villeResidence" value={formData.villeResidence} onChange={handleChange} className={inputCls(errors.villeResidence)} placeholder="Ex: Casablanca" />
                        <FieldError msg={errors.villeResidence} />
                      </div>
                      <div className="field-row" style={{ opacity: 0 }} data-has-error={errors.noteRegional ? 'true' : undefined}>
                        <label className="font-label text-sm font-semibold uppercase tracking-wider text-on-surface-variant">Note regionale</label>
                        <input type="number" name="noteRegional" value={formData.noteRegional} onChange={handleChange} min={0} max={20} step="0.01" className={inputCls(errors.noteRegional)} placeholder="Ex: 15.50" />
                        <FieldError msg={errors.noteRegional} />
                      </div>
                      <div className="field-row" style={{ opacity: 0 }} data-has-error={errors.noteNational ? 'true' : undefined}>
                        <label className="font-label text-sm font-semibold uppercase tracking-wider text-on-surface-variant">Note nationale</label>
                        <input type="number" name="noteNational" value={formData.noteNational} onChange={handleChange} min={0} max={20} step="0.01" className={inputCls(errors.noteNational)} placeholder="Ex: 16.25" />
                        <FieldError msg={errors.noteNational} />
                      </div>
                    </div>
                  </div>

                  {/* Concours select */}
                  <div data-has-error={errors.concours ? 'true' : undefined}>
                    <h2 className="mb-8 flex items-center gap-3 font-headline text-3xl">
                      <span className="h-[1px] w-8 bg-primary" />Concours Vise
                    </h2>
                    <label className="font-label text-sm font-semibold uppercase tracking-wider text-on-surface-variant">Selectionnez votre parcours</label>
                    <select name="concours" value={formData.concours} onChange={handleChange}
                      className={`${inputCls(errors.concours)} mt-2 font-headline text-lg`}>
                      {CONCOURS_OPTIONS.map((item) => <option key={item.value} value={item.value}>{item.label} — {item.hours}H — {item.price} DH</option>)}
                    </select>
                    <FieldError msg={errors.concours} />
                  </div>

                  {/* Step 3 — Payment */}
                  <div ref={step3Ref}>
                    <h2 className="mb-8 flex items-center gap-3 font-headline text-3xl">
                      <span className="h-[1px] w-8 bg-primary" />Mode de Reglement
                    </h2>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2" data-has-error={errors.paymentMethod ? 'true' : undefined}>
                      {[
                        { value: 'online', icon: 'payments',     label: 'Paiement en ligne',     sub: 'Redirection securisee Payzone' },
                        { value: 'onsite', icon: 'meeting_room', label: 'Rendez-vous Presentiel', sub: "Au campus de l'academie" },
                      ].map(({ value, icon, label, sub }) => (
                        <label key={value} className={`payment-opt relative flex cursor-pointer items-center rounded-xl border-2 p-6 transition-all bg-surface-bright/50 backdrop-blur-sm ${formData.paymentMethod === value ? 'border-primary bg-primary/5' : 'border-outline-variant/40 hover:border-primary/40'}`} style={{ opacity: 0 }}>
                          <input type="radio" name="paymentMethod" value={value} checked={formData.paymentMethod === value} onChange={handleChange} className="hidden" />
                          <div className="flex items-center gap-4">
                            <span className="material-symbols-outlined text-3xl text-primary">{icon}</span>
                            <div><p className="font-bold">{label}</p><p className="text-xs text-outline">{sub}</p></div>
                          </div>
                        </label>
                      ))}
                    </div>
                    <FieldError msg={errors.paymentMethod} />

                    {formData.paymentMethod === 'online' && (
                      <div className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-sm text-emerald-900">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Paiement securise Payzone</p>
                        <h4 className="mt-1 font-headline text-2xl font-bold text-on-surface">Redirection vers la page bancaire</h4>
                        <p className="mt-2 text-emerald-800">Apres validation, vous serez redirige vers Payzone. Un code 3D Secure peut etre demande.</p>
                      </div>
                    )}

                    {formData.paymentMethod === 'onsite' && (
                      <div className="mt-6 rounded-3xl border border-primary/20 bg-white p-6 shadow-sm">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Paiement au centre</p>
                        <h4 className="mt-1 font-headline text-2xl font-bold text-on-surface">Informations de rendez-vous</h4>
                        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-low p-5">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">Adresse</p>
                            <p className="mt-2 text-sm font-semibold text-on-surface">14 avenue Hassan II, 1er etage, Ville Nouvelle, Meknes, Maroc</p>
                          </div>
                          <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-low p-5">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">Horaires</p>
                            <div className="mt-2 space-y-1 text-sm text-on-surface">
                              <p>Lundi – Vendredi : 08h00 – 18h00</p>
                              <p>Samedi : 09h00 – 13h00</p>
                              <p className="text-on-surface-variant">Dimanche : ferme</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Terms */}
                  <div ref={submitRef} className="space-y-4 pt-6" style={{ opacity: 0 }}>
                    {[
                      { name: 'acceptTerms',    err: errors.acceptTerms,    text: "J'accepte les Conditions Generales de Vente et le reglement interieur de l'Elite Academy." },
                      { name: 'acceptPrivacy',  err: errors.acceptPrivacy,  text: "Je consens au traitement de mes donnees personnelles conformement a la politique de confidentialite." },
                    ].map(({ name, err, text }) => (
                      <div key={name} data-has-error={err ? 'true' : undefined}>
                        <label className="group flex cursor-pointer items-start gap-3">
                          <input type="checkbox" name={name} checked={(formData as any)[name]} onChange={handleChange}
                            className={`mt-1 rounded border-outline-variant text-primary focus:ring-primary ${err ? 'border-red-400' : ''}`} />
                          <span className="font-label text-sm leading-relaxed text-on-surface-variant transition-colors group-hover:text-on-surface">{text}</span>
                        </label>
                        <FieldError msg={err} />
                      </div>
                    ))}

                    <button type="submit" disabled={submitting}
                      className="group relative flex w-full items-center justify-center gap-4 overflow-hidden rounded-xl bg-primary py-5 font-headline text-2xl font-bold tracking-wide text-on-primary shadow-lg transition-all hover:bg-orange-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                      style={{ boxShadow: '0 8px 32px rgba(194,101,42,0.28)' }}>
                      <span className="absolute inset-0 -translate-x-full bg-white/10 transition-transform duration-500 group-hover:translate-x-full" />
                      {submitting ? <><span className="material-symbols-outlined animate-spin">progress_activity</span>Traitement en cours...</>
                        : <>{formData.paymentMethod === 'online' ? 'Payer avec Payzone' : "S'inscrire au Concours"}<span className="material-symbols-outlined">arrow_forward</span></>}
                    </button>

                    {submittedReference && (
                      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center">
                        <p className="text-sm font-semibold text-emerald-800">Inscription enregistree pour {selectedConcours.label}.</p>
                        <p className="mt-1 text-xs text-emerald-700">Reference : <span className="font-mono font-semibold">{submittedReference}</span></p>
                        {paymentCertificate && <button type="button" onClick={() => setShowPaymentCertificate(true)} className="mt-3 text-sm font-bold text-emerald-700 underline underline-offset-2">Voir le certificat</button>}
                      </div>
                    )}
                  </div>
                </form>
              </section>

              {/* ── SIDEBAR ── */}
              <aside ref={sidebarRef} className="space-y-8 lg:w-1/3">
                <div className="sidebar-card rounded-3xl border border-outline-variant/20 bg-surface-container p-8" style={{ opacity: 0 }}>
                  <h3 className="mb-6 font-headline text-2xl">Pourquoi nous choisir ?</h3>
                  <ul className="space-y-6">
                    {[
                      ['verified_user', 'Corps Professeur',   'Docteurs et ingenieurs issus des meilleures ecoles nationales.'],
                      ['menu_book',     'Supports Exclusifs', 'Polycopies mis a jour avec les annales des 10 dernieres annees.'],
                      ['timer',         'Simulations',        'Concours blancs hebdomadaires dans des conditions reelles.'],
                    ].map(([icon, title, text]) => (
                      <li key={title as string} className="flex gap-4">
                        <span className="material-symbols-outlined shrink-0 text-primary">{icon}</span>
                        <div><p className="font-label text-sm font-bold uppercase">{title}</p><p className="text-sm text-on-surface-variant">{text}</p></div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="sidebar-card group relative flex h-64 items-end overflow-hidden rounded-3xl p-8" style={{ opacity: 0 }}>
                  <img alt="Batiment universitaire" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfj7oUGmcnBKrBnK3FTnb-QbGPhRQ0kA7iokXHxb5DJN6b8eavmdDNJrL1NEVZXfy-7fMhM2yT-TSGYVz1eashS_mSPB5yxv7QXey2QquggBWbhWOG-lGn2ZPP5zpgaPCiLVVxu-VyiDuOrxn-RogGyQfA14qo3ehQhu1MYEBz5Y3GAuoJxswpE8Q5Q_ddG0huSR3r21I7mWl_uGByeOJ6NHOLpbLQCXHn3uXYfNbKWu5wUc2MKfKh2Op0PI-H389yQeWziDhq2_Du" />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent opacity-80" />
                  <div className="relative text-white"><p className="font-headline text-2xl">Rejoignez nos alumni</p><p className="text-sm text-stone-300">Plus de 5000 etudiants formes.</p></div>
                </div>

                <div className="sidebar-card flex flex-col items-center rounded-3xl border-2 border-dashed border-outline-variant/60 p-8 text-center" style={{ opacity: 0 }}>
                  <span className="material-symbols-outlined mb-4 text-4xl text-outline">support_agent</span>
                  <h4 className="font-label mb-2 text-xs font-bold uppercase tracking-widest">Besoin d'aide ?</h4>
                  <p className="mb-6 text-sm text-on-surface-variant">Nos conseillers sont disponibles de 9h a 18h.</p>
                  <a className="text-lg font-bold text-primary" href="tel:+212500000000">+212 522 00 00 00</a>
                </div>
              </aside>
            </div>
          </main>
        </div>
      </PublicLayout>

      <style>{`
        .page-bg-warm {
          position: relative; min-height: 100vh; overflow: hidden;
          background: linear-gradient(160deg, #fffdf9 0%, #fef7ed 25%, #fdf0dc 50%, #fef5e8 75%, #fffbf5 100%);
        }
        .page-bg-geo { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0; }
        .geometric-bg {
          background-image:
            radial-gradient(circle at 10% 20%, rgba(194,101,42,0.05) 0%, transparent 8%),
            radial-gradient(circle at 90% 80%, rgba(58,48,42,0.03) 0%, transparent 10%),
            linear-gradient(45deg, transparent 48%, rgba(194,101,42,0.05) 49%, rgba(194,101,42,0.05) 51%, transparent 52%),
            linear-gradient(-45deg, transparent 48%, rgba(58,48,42,0.03) 49%, rgba(58,48,42,0.03) 51%, transparent 52%);
          background-size: 100% 100%, 100% 100%, 400px 400px, 600px 600px;
        }
        .serif-tight { letter-spacing: -0.02em; }
        .payment-card-grid      { display: grid; gap: 16px; }
        .payment-card-field     { display: flex; flex-direction: column; gap: 6px; }
        .payment-card-field-full { grid-column: 1 / -1; }
        .payment-card-subgrid   { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
        .payment-card-label     { margin-left: 4px; font-size: 0.875rem; font-weight: 600; }
        .payment-card-input-shell { position: relative; display: flex; min-height: 54px; align-items: center; padding: 0 16px; }
        .payment-card-cvc-shell { padding-right: 58px; }
        .payment-card-element   { width: 100%; min-width: 0; }
        .payment-card-element-cvc { padding-right: 4px; }
        .payment-card-cvc-icon  { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); pointer-events: none; }
        .payment-card-element .StripeElement { width: 100%; }
        .payment-card-element .StripeElement iframe { width: 100% !important; min-height: 22px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 0.8s linear infinite; display: inline-block; }
        @media (max-width: 767px) { .payment-card-subgrid { grid-template-columns: 1fr; } }
      `}</style>
    </>
  );
};

export default InscriptionConcours;