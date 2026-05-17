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
import { PaymentCertificate, PaymentCertificateData } from '@/Components/PaymentCertificate';
import { createStripePaymentIntent } from '@/lib/stripePayments';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import wordIc from '../../../../public/images/word.png';
import excelIc from '../../../../public/images/excel.png';
import powerpointIc from '../../../../public/images/powerpoint.png';
import accessIc from '../../../../public/images/acc.png';

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════ */
type ModuleKey = 'word' | 'excel' | 'powerpoint' | 'access';
type PaymentMode = '' | 'online' | 'onsite';

interface FormData {
  nom: string; prenom: string; age: string; email: string; telephone: string;
  modules: Record<ModuleKey, boolean>; level: string; payment: PaymentMode;
  acceptTerms: boolean; acceptPrivacy: boolean;
}
interface FormErrors {
  nom?: string; prenom?: string; age?: string; email?: string; telephone?: string;
  modules?: string; payment?: string; card?: string; acceptTerms?: string; acceptPrivacy?: string;
}
interface StripeCardHandle {
  createPaymentMethod: (b: { name: string; email: string; phone: string }) => Promise<{ paymentMethodId: string } | { error: string }>;
}
interface StripeCardSectionProps {
  totalAmount: number; cardError?: string; processing: boolean; paymentDone: boolean;
  paymentReference?: string; onCardChange: (hasError: boolean) => void; onPayNow: () => void;
}

/* ═══════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════ */
const MODULE_CARDS = [
  { key: 'word'        as ModuleKey, name: 'module_word',        title: 'Microsoft Word',       description: 'Edition, mise en page et documents professionnels',       price: 600, accent: '#185ABD', icon: wordIc },
  { key: 'excel'       as ModuleKey, name: 'module_excel',       title: 'Microsoft Excel',      description: 'Tableaux, calculs, formules et analyse de donnees',        price: 500, accent: '#107C41', icon: excelIc },
  { key: 'powerpoint'  as ModuleKey, name: 'module_powerpoint',  title: 'Microsoft PowerPoint', description: 'Presentations visuelles, slides et animations',            price: 300, accent: '#D24726', icon: powerpointIc },
  { key: 'access'      as ModuleKey, name: 'module_access',      title: 'Microsoft Access',     description: 'Bases de donnees, formulaires, requetes et etats',         price: 400, accent: '#A4373A', icon: accessIc },
] as const;

const LEVEL_OPTIONS = [
  { value: 'debutant',      label: 'Debutant',      sub: 'Bases et introduction' },
  { value: 'intermediaire', label: 'Intermediaire', sub: 'Fonctions avancees' },
  { value: 'avance',        label: 'Avance',        sub: 'Expertise metier' },
];

/* ═══════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════ */
const fmtAmount  = (n: number) => `${n.toLocaleString('fr-MA')} DH`;
const okEmail    = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const okPhone    = (v: string) => /^[+\d\s\-()]{8,}$/.test(v.trim());
const secureRef  = (prefix: string) => {
  const b = new Uint32Array(2); crypto.getRandomValues(b);
  return `${prefix}-${Date.now().toString(36).toUpperCase()}-${b[0].toString(36).slice(0,4).toUpperCase()}${b[1].toString(36).slice(0,4).toUpperCase()}`;
};
const inputCls = (err?: string) =>
  `w-full rounded-xl border bg-white px-4 py-3.5 text-sm transition-all focus:outline-none focus:ring-2 ${
    err ? 'border-red-400 bg-red-50/30 focus:ring-red-200'
        : 'border-outline-variant focus:border-primary focus:ring-primary/20'}`;

const FieldError: React.FC<{ msg?: string }> = ({ msg }) =>
  msg ? <p className="ml-1 mt-1.5 flex items-center gap-1.5 text-xs text-red-500">
    <span className="material-symbols-outlined text-sm leading-none">error</span>{msg}</p> : null;

/* ═══════════════════════════════════════════════════
   CARD BRAND SVG LOGOS
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
    const [expiryComplete,  setExpiryComplete]  = useState(false);
    const [cvcComplete,     setCvcComplete]     = useState(false);
    const [brand,           setBrand]           = useState('unknown');
    const allComplete = numberComplete && expiryComplete && cvcComplete;
    const syncCardState = (next: { number?: boolean; expiry?: boolean; cvc?: boolean; hasOwnError: boolean }) => {
      const n = next.number ?? numberComplete; const e = next.expiry ?? expiryComplete; const c = next.cvc ?? cvcComplete;
      onCardChange(next.hasOwnError || !n || !e || !c);
    };
    useImperativeHandle(ref, () => ({
      async createPaymentMethod(billingDetails) {
        if (!stripe || !elements) return { error: 'Stripe non initialise.' };
        const cardNumber = elements.getElement(CardNumberElement);
        if (!cardNumber) return { error: 'Element carte introuvable.' };
        const { error, paymentMethod } = await stripe.createPaymentMethod({ type: 'card', card: cardNumber, billing_details: billingDetails });
        if (error) return { error: error.message ?? 'Erreur carte.' };
        try {
          const intent = await createStripePaymentIntent({ amount: totalAmount, category: 'Bureautique', email: billingDetails.email, name: billingDetails.name });
          const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(intent.client_secret, { payment_method: paymentMethod.id });
          if (confirmError) return { error: confirmError.message ?? 'Paiement refuse.' };
          if (!paymentIntent || paymentIntent.status !== 'succeeded') return { error: 'Paiement non confirme.' };
          return { paymentMethodId: paymentIntent.id };
        } catch (err) { return { error: err instanceof Error ? err.message : 'Erreur Stripe.' }; }
      },
    }));
    const elementOptions = { style: { base: { fontSize: '15px', fontFamily: 'inherit', color: '#1c1c1e', '::placeholder': { color: '#9ca3af' } }, invalid: { color: '#dc2626' } } };
    const fieldCls = (hasError?: boolean) =>
      `rounded-xl border bg-white transition-all focus-within:ring-2 ${hasError ? 'border-red-400 focus-within:ring-red-200' : 'border-outline-variant focus-within:border-primary focus-within:ring-primary/20'}`;
    const DetectedLogo = brand !== 'unknown' ? BRAND_LOGO[brand] : null;
    return (
      <div className="mt-6 rounded-3xl border border-primary/20 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Paiement securise</p><h4 className="mt-1 font-display text-xl font-bold text-on-surface">Carte bancaire</h4></div>
          <div className="flex items-center gap-2 rounded-full border border-outline-variant/40 bg-surface-container px-4 py-2">
            <span className="material-symbols-outlined text-base text-emerald-600">lock</span><span className="text-sm font-bold text-on-surface">{fmtAmount(totalAmount)}</span>
          </div>
        </div>
        <div className="payment-card-grid">
          <div className="payment-card-field payment-card-field-full">
            <label className="payment-card-label">Numero de carte</label>
            <div className={`${fieldCls(!!cardError && !numberComplete)} payment-card-input-shell payment-card-number-shell`}>
              <div className="payment-card-element payment-card-element-number">
                <CardNumberElement options={{ ...elementOptions, showIcon: false }} onChange={(ev) => { setNumberComplete(ev.complete); setBrand(ev.brand ?? 'unknown'); syncCardState({ number: ev.complete, hasOwnError: !!ev.error }); }} />
              </div>
              <div className="payment-card-icons" aria-hidden="true">
                {DetectedLogo ? <DetectedLogo active /> : ALL_BRANDS.map((b) => { const L = BRAND_LOGO[b]; return <L key={b} active />; })}
              </div>
            </div>
          </div>
          <div className="payment-card-subgrid">
            <div className="payment-card-field">
              <label className="payment-card-label">Date d'expiration</label>
              <div className={`${fieldCls()} payment-card-input-shell`}><div className="payment-card-element"><CardExpiryElement options={elementOptions} onChange={(ev) => { setExpiryComplete(ev.complete); syncCardState({ expiry: ev.complete, hasOwnError: !!ev.error }); }} /></div></div>
            </div>
            <div className="payment-card-field">
              <label className="payment-card-label">Code de securite</label>
              <div className={`${fieldCls()} payment-card-input-shell payment-card-cvc-shell`}>
                <div className="payment-card-element payment-card-element-cvc"><CardCvcElement options={elementOptions} onChange={(ev) => { setCvcComplete(ev.complete); syncCardState({ cvc: ev.complete, hasOwnError: !!ev.error }); }} /></div>
                <div className="payment-card-cvc-icon" aria-hidden="true"><CvcIcon /></div>
              </div>
            </div>
          </div>
          {cardError && <FieldError msg={cardError} />}
          {allComplete && !cardError && <p className="ml-1 mt-1.5 flex items-center gap-1.5 text-xs text-emerald-600"><span className="material-symbols-outlined text-sm leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>Informations de carte valides</p>}
        </div>
        <button type="button" onClick={onPayNow} disabled={processing || paymentDone || !stripe || !allComplete}
          className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-2xl py-4 text-sm font-bold tracking-wide text-white shadow-lg transition-all duration-300 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
          style={{ background: paymentDone ? 'linear-gradient(135deg,#059669,#047857)' : 'linear-gradient(135deg,#059669,#065f46)' }}>
          {processing ? <><span className="material-symbols-outlined animate-spin text-xl leading-none">progress_activity</span>Paiement en cours...</>
            : paymentDone ? <><span className="material-symbols-outlined text-xl leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>task_alt</span>Paiement effectue</>
            : <><span className="material-symbols-outlined text-xl leading-none">lock</span>Payer {fmtAmount(totalAmount)}</>}
        </button>
        {paymentDone && paymentReference && (
          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <span className="material-symbols-outlined mt-0.5 text-base text-emerald-600" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            <div><p className="text-sm font-semibold text-emerald-800">Paiement effectue avec succes</p><p className="mt-0.5 text-xs text-emerald-700">Reference : <span className="font-mono font-semibold">{paymentReference}</span></p></div>
          </div>
        )}
        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-3">
          <span className="material-symbols-outlined text-base text-emerald-600">security</span>
          <p className="text-xs leading-relaxed text-emerald-800">Vos donnees sont chiffrees par <strong>Stripe</strong> (PCI-DSS niveau 1). Aucune donnee bancaire ne transite par nos serveurs.</p>
        </div>
      </div>
    );
  }
);
StripeCardSection.displayName = 'StripeCardSection';

/* ═══════════════════════════════════════════════════
   STEP BADGE
═══════════════════════════════════════════════════ */
const StepBadge: React.FC<{ n: number; label: string }> = ({ n, label }) => (
  <div className="step-badge mb-8 flex items-center gap-4">
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-on-primary">{n}</span>
    <h3 className="font-display text-2xl text-on-surface">{label}</h3>
    <div className="h-px flex-1 bg-outline-variant/30" />
  </div>
);

/* ═══════════════════════════════════════════════════
   ROCK-DROP TITLE
   Splits text into spans, then GSAP drops each
   letter from above with heavy bounce
═══════════════════════════════════════════════════ */
interface RockDropTitleProps {
  line1: string;
  line2: string;
  accentWord?: string; // highlight this word in line2
}
const RockDropTitle: React.FC<RockDropTitleProps> = ({ line1, line2, accentWord }) => {
  const wrapRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    // Collect all letter spans
    const allLetters = el.querySelectorAll<HTMLElement>('.rock-letter');

    gsap.set(allLetters, { opacity: 0 });

    const tl = gsap.timeline({ delay: 0.15 });

    allLetters.forEach((letter, i) => {
      const randomX = (Math.random() - 0.5) * 60;       // slight horizontal drift
      const randomRot = (Math.random() - 0.5) * 30;      // slight rotation
      const depth = -80 - Math.random() * 120;            // start height above viewport

      tl.fromTo(
        letter,
        {
          opacity: 0,
          y: depth,
          x: randomX,
          rotation: randomRot,
          scaleY: 1.3,
          transformOrigin: 'bottom center',
        },
        {
          opacity: 1,
          y: 0,
          x: 0,
          rotation: 0,
          scaleY: 1,
          duration: 0.55,
          ease: 'bounce.out',
        },
        i * 0.04  // stagger offset
      );
    });

    return () => { tl.kill(); };
  }, []);

  // Wrap each character in a span, preserving spaces as &nbsp;
  const letterSpans = (text: string, isAccent = false) =>
    text.split('').map((ch, i) => (
      <span
        key={i}
        className={`rock-letter inline-block ${ch === ' ' ? 'w-[0.35em]' : ''} ${isAccent ? 'text-primary' : ''}`}
        style={{ opacity: 0 }}
        aria-hidden="true"
      >
        {ch === ' ' ? '\u00A0' : ch}
      </span>
    ));

  // Build line2: highlight accentWord if given
  const renderLine2 = () => {
    if (!accentWord) return letterSpans(line2);
    const idx = line2.indexOf(accentWord);
    if (idx === -1) return letterSpans(line2);
    const before = line2.slice(0, idx);
    const after  = line2.slice(idx + accentWord.length);
    return (
      <>
        {letterSpans(before)}
        <span className="italic">{letterSpans(accentWord, true)}</span>
        {letterSpans(after)}
      </>
    );
  };

  return (
    <h1
      ref={wrapRef}
      className="mb-6 font-display text-5xl font-bold leading-tight md:text-6xl"
      aria-label={`${line1} ${line2}`}
    >
      <span className="block">{letterSpans(line1)}</span>
      <span className="block">{renderLine2()}</span>
    </h1>
  );
};

/* ═══════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════ */
interface Props { stripePublishableKey?: string; }

const InscriptionBureautique: React.FC<Props> = ({
  stripePublishableKey = (import.meta as any).env?.VITE_STRIPE_PK ?? '',
}) => {
  const stripePromise = useMemo(() => stripePublishableKey ? loadStripe(stripePublishableKey) : null, [stripePublishableKey]);
  const stripeOptions = useMemo(() => ({ mode: 'payment' as const, amount: 100, currency: 'mad', appearance: { theme: 'stripe' as const, variables: { fontFamily: 'inherit', borderRadius: '12px' } } }), []);
  const stripeCardRef = useRef<StripeCardHandle>(null);

  // ── GSAP refs ──
  const heroTagRef    = useRef<HTMLSpanElement>(null);
  const heroDescRef   = useRef<HTMLParagraphElement>(null);
  const heroBadgesRef = useRef<HTMLDivElement>(null);
  const heroListRef   = useRef<HTMLUListElement>(null);
  const heroImgRef    = useRef<HTMLDivElement>(null);
  const dividerRef    = useRef<HTMLDivElement>(null);
  const formCardRef   = useRef<HTMLDivElement>(null);
  const step1Ref      = useRef<HTMLElement>(null);
  const modulesGridRef = useRef<HTMLDivElement>(null);
  const step2RestRef  = useRef<HTMLDivElement>(null);
  const step3Ref      = useRef<HTMLElement>(null);
  const submitRef     = useRef<HTMLDivElement>(null);

  // ── Form state ──
  const [form, setForm] = useState<FormData>({
    nom: '', prenom: '', age: '', email: '', telephone: '',
    modules: { word: false, excel: false, powerpoint: false, access: false },
    level: 'debutant', payment: '', acceptTerms: false, acceptPrivacy: false,
  });
  const [errors,                 setErrors]                 = useState<FormErrors>({});
  const [cardHasError,           setCardHasError]           = useState(true);
  const [submitting,             setSubmitting]             = useState(false);
  const [onlinePaymentCompleted, setOnlinePaymentCompleted] = useState(false);
  const [onlinePaymentReference, setOnlinePaymentReference] = useState('');
  const [submitted,              setSubmitted]              = useState(false);
  const [paymentCertificate,     setPaymentCertificate]     = useState<PaymentCertificateData | null>(null);
  const [showPaymentCertificate, setShowPaymentCertificate] = useState(false);

  const defaultPaymentDate = useMemo(() => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().slice(0, 10); }, []);
  const selectedModules    = useMemo(() => MODULE_CARDS.filter((m) => form.modules[m.key]), [form.modules]);
  const totalAmount        = useMemo(() => selectedModules.reduce((s, m) => s + m.price, 0), [selectedModules]);

  /* ── GSAP orchestration ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.bureautique-bg-geo', {
        yPercent: 10,
        ease: 'none',
        scrollTrigger: { scrub: true },
      });

      // ── Hero content (non-title elements) ──
      const heroTl = gsap.timeline({ delay: 0.6 }); // slight delay so title animates first

      heroTl.fromTo(heroTagRef.current,
        { opacity: 0, y: 16, letterSpacing: '0.5em' },
        { opacity: 1, y: 0, letterSpacing: '0.08em', duration: 0.7, ease: 'power3.out' }, 0
      );
      heroTl.fromTo(heroDescRef.current,
        { opacity: 0, x: -24 },
        { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' }, 0.2
      );
      if (heroBadgesRef.current) {
        heroTl.fromTo(
          heroBadgesRef.current.querySelectorAll('.hero-badge'),
          { opacity: 0, y: 20, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, stagger: 0.12, duration: 0.5, ease: 'back.out(1.5)' }, 0.4
        );
      }
      if (heroListRef.current) {
        heroTl.fromTo(
          heroListRef.current.querySelectorAll('li'),
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, stagger: 0.13, duration: 0.5, ease: 'power2.out' }, 0.6
        );
      }
      heroTl.fromTo(heroImgRef.current,
        { opacity: 0, scale: 0.9, rotationY: 6, transformOrigin: 'right center', transformPerspective: 1000 },
        { opacity: 1, scale: 1, rotationY: 0, duration: 1.1, ease: 'power3.out' }, 0.2
      );

      // ── Divider ──
      if (dividerRef.current) {
        ScrollTrigger.create({
          trigger: dividerRef.current, start: 'top 85%',
          onEnter: () => gsap.fromTo(dividerRef.current,
            { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }
          ),
        });
      }

      // ── Form card ──
      if (formCardRef.current) {
        ScrollTrigger.create({
          trigger: formCardRef.current, start: 'top 78%',
          onEnter: () => gsap.fromTo(formCardRef.current,
            { opacity: 0, y: 50, clipPath: 'inset(5% 0% 0% 0% round 24px)' },
            { opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0% round 24px)', duration: 1.1, ease: 'expo.out' }
          ),
        });
      }

      // ── Step 1 fields ──
      if (step1Ref.current) {
        ScrollTrigger.create({
          trigger: step1Ref.current, start: 'top 80%',
          onEnter: () => {
            gsap.fromTo(step1Ref.current!.querySelector('.step-badge'),
              { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' }
            );
            gsap.fromTo(step1Ref.current!.querySelectorAll('.field-wrap'),
              { opacity: 0, y: 22, x: -8 },
              { opacity: 1, y: 0, x: 0, stagger: 0.08, duration: 0.5, ease: 'power3.out', delay: 0.2 }
            );
          },
        });
      }

      // ── Module cards: CENTER-BURST reveal ──
      // Cards animate outward from the center of the grid
      if (modulesGridRef.current) {
        ScrollTrigger.create({
          trigger: modulesGridRef.current, start: 'top 82%',
          onEnter: () => {
            const cards = Array.from(modulesGridRef.current!.querySelectorAll<HTMLElement>('.module-card'));
            // Determine center of grid
            const gridRect = modulesGridRef.current!.getBoundingClientRect();
            const gridCX = gridRect.left + gridRect.width  / 2;
            const gridCY = gridRect.top  + gridRect.height / 2;

            cards.forEach((card) => {
              const cardRect = card.getBoundingClientRect();
              const cardCX   = cardRect.left + cardRect.width  / 2;
              const cardCY   = cardRect.top  + cardRect.height / 2;
              // Vector from grid center to this card center
              const dx = cardCX - gridCX;
              const dy = cardCY - gridCY;

              gsap.fromTo(card,
                {
                  opacity: 0,
                  x: -dx * 0.7,   // cards start near grid center (inverted vector)
                  y: -dy * 0.7,
                  scale: 0.5,
                  rotation: (Math.random() - 0.5) * 18,
                },
                {
                  opacity: 1,
                  x: 0,
                  y: 0,
                  scale: 1,
                  rotation: 0,
                  duration: 0.75,
                  ease: 'back.out(1.6)',
                  // small stagger based on distance from center
                  delay: Math.sqrt(dx * dx + dy * dy) * 0.0004,
                }
              );
            });
          },
        });
      }

      // ── Step 2 rest (recap + level) ──
      if (step2RestRef.current) {
        ScrollTrigger.create({
          trigger: step2RestRef.current, start: 'top 85%',
          onEnter: () => gsap.fromTo(step2RestRef.current,
            { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }
          ),
        });
      }

      // ── Step 3 ──
      if (step3Ref.current) {
        ScrollTrigger.create({
          trigger: step3Ref.current, start: 'top 82%',
          onEnter: () => {
            gsap.fromTo(step3Ref.current!.querySelector('.step-badge'),
              { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' }
            );
            gsap.fromTo(step3Ref.current!.querySelectorAll('.payment-option'),
              { opacity: 0, scale: 0.94, x: -18 },
              { opacity: 1, scale: 1, x: 0, stagger: 0.14, duration: 0.6, ease: 'back.out(1.6)', delay: 0.15 }
            );
          },
        });
      }

      // ── Submit block ──
      if (submitRef.current) {
        ScrollTrigger.create({
          trigger: submitRef.current, start: 'top 88%',
          onEnter: () => gsap.fromTo(submitRef.current,
            { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }
          ),
        });
      }

      // ── Parallax blob ──
      gsap.to('.deco-bg-blob', {
        yPercent: -18, ease: 'none',
        scrollTrigger: { scrub: 2 },
      });
    });

    return () => ctx.revert();
  }, []);

  /* ── Module card selection micro-animation ── */
  const animateModuleSelect = (cardEl: HTMLElement, checked: boolean) => {
    if (checked) {
      gsap.fromTo(cardEl,
        { scale: 0.95 },
        { scale: 1, duration: 0.4, ease: 'back.out(3)' }
      );
    } else {
      gsap.to(cardEl, { scale: 1, duration: 0.2, ease: 'power2.out' });
    }
  };

  /* ── Form helpers ── */
  const clearErr = (field: keyof FormErrors) => setErrors((p) => ({ ...p, [field]: undefined }));

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      if (name.startsWith('module_')) {
        const key = name.replace('module_', '') as ModuleKey;
        setForm((p) => ({ ...p, modules: { ...p.modules, [key]: checked } }));
        clearErr('modules');
        setOnlinePaymentCompleted(false); setOnlinePaymentReference('');
        // trigger card select animation
        const cardEl = (e.target as HTMLElement).closest<HTMLElement>('.module-card');
        if (cardEl) animateModuleSelect(cardEl, checked);
      } else {
        setForm((p) => ({ ...p, [name]: checked }));
        clearErr(name as keyof FormErrors);
      }
      return;
    }
    setForm((p) => ({ ...p, [name]: value }));
    clearErr(name as keyof FormErrors);
  };

  const handleRadio = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    clearErr(e.target.name as keyof FormErrors);
    if (e.target.name === 'payment') {
      setOnlinePaymentCompleted(false); setOnlinePaymentReference(''); clearErr('card');
      // animate selected payment option
      const opt = (e.target as HTMLElement).closest<HTMLElement>('.payment-option');
      if (opt) gsap.fromTo(opt, { x: -6 }, { x: 0, duration: 0.3, ease: 'power2.out' });
    }
  };

  const handleOnlinePayment = async () => {
    const pre: FormErrors = {};
    if (!form.nom.trim())    pre.nom      = 'Le nom est requis.';
    if (!form.prenom.trim()) pre.prenom   = 'Le prenom est requis.';
    if (!okEmail(form.email)) pre.email   = 'Adresse email invalide.';
    if (!okPhone(form.telephone)) pre.telephone = 'Telephone invalide.';
    if (!selectedModules.length) pre.modules = 'Selectionnez au moins un module.';
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

  const validateFinal = (): FormErrors => {
    const e: FormErrors = {};
    if (!form.nom.trim())    e.nom      = 'Le nom est requis.';
    if (!form.prenom.trim()) e.prenom   = 'Le prenom est requis.';
    if (!form.age || Number(form.age) < 15 || Number(form.age) > 80) e.age = 'Age valide requis (15–80).';
    if (!okEmail(form.email))      e.email     = 'Adresse email invalide.';
    if (!okPhone(form.telephone))  e.telephone = 'Telephone invalide.';
    if (!selectedModules.length)   e.modules   = 'Selectionnez au moins un module.';
    if (!form.payment)             e.payment   = 'Choisissez un mode de paiement.';
    if (!form.acceptTerms)         e.acceptTerms  = 'Acceptez les conditions generales.';
    if (!form.acceptPrivacy)       e.acceptPrivacy = 'Acceptez la politique de confidentialite.';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fe = validateFinal();
    if (Object.keys(fe).length) { setErrors(fe); document.querySelector('[data-has-error="true"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
    setSubmitting(true);
    const processingCode = secureRef('TRT');
    const certRef        = secureRef('PAYCERT');
    const payRef         = form.payment === 'online' ? undefined : secureRef('PAY');
    router.post(route('applications.store'), {
      first_name: form.prenom, last_name: form.nom, email: form.email, phone: form.telephone,
      category: 'Bureautique', training_label: selectedModules.map((m) => m.title).join(', ') || 'Bureautique',
      course_slug: 'expertise-microsoft-office', amount: totalAmount,
      payment_method: form.payment, payment_provider: form.payment === 'online' ? 'payzone' : undefined,
      payment_reference: payRef,
      preferred_payment_date: form.payment === 'onsite' ? defaultPaymentDate : undefined,
      certificate_reference: certRef, form_data: { ...form, processingCode },
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setPaymentCertificate({
          studentName: `${form.prenom.trim()} ${form.nom.trim()}`, reference: certRef,
          barcodeValue: `${certRef}-${payRef}`,
          trainingLabel: selectedModules.map((m) => m.title).join(', ') || 'Bureautique',
          category: 'Bureautique', amount: fmtAmount(totalAmount),
          paymentMode: form.payment === 'online' ? 'Paiement en ligne' : 'Paiement presentiel',
          paymentStatus: form.payment === 'online' ? 'Paye' : 'Paiement a regler au centre',
          issuedAt: new Date().toLocaleString('fr-MA'),
        });
        setSubmitted(true); setShowPaymentCertificate(true);
      },
      onFinish: () => setSubmitting(false),
    });
  };

  /* ════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════ */
  return (
    <>
      <Head title="Bureautique" />
      {showPaymentCertificate && paymentCertificate && (
        <PaymentCertificate certificate={paymentCertificate} onClose={() => setShowPaymentCertificate(false)} />
      )}

      <PublicLayout>
        <div className="bureautique-page-bg">
          <svg className="bureautique-bg-geo" viewBox="0 0 1200 900" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <circle cx="80" cy="130" r="170" fill="none" stroke="rgba(194,101,42,0.10)" strokeWidth="1.5" />
            <circle cx="80" cy="130" r="105" fill="none" stroke="rgba(194,101,42,0.07)" strokeWidth="1" />
            <circle cx="1130" cy="750" r="210" fill="none" stroke="rgba(194,101,42,0.09)" strokeWidth="1.5" />
            <circle cx="1130" cy="750" r="125" fill="none" stroke="rgba(194,101,42,0.06)" strokeWidth="1" />
            <circle cx="610" cy="430" r="290" fill="none" stroke="rgba(194,101,42,0.045)" strokeWidth="1" />
            <line x1="0" y1="300" x2="220" y2="100" stroke="rgba(194,101,42,0.10)" strokeWidth="1" />
            <line x1="25" y1="325" x2="245" y2="125" stroke="rgba(194,101,42,0.06)" strokeWidth="0.8" />
            <line x1="990" y1="610" x2="1200" y2="810" stroke="rgba(194,101,42,0.09)" strokeWidth="1" />
            <g stroke="rgba(194,101,42,0.18)" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <line x1="1038" y1="88" x2="1110" y2="88" /><polyline points="1095,74 1110,88 1095,102" />
            </g>
            <g stroke="rgba(194,101,42,0.18)" strokeWidth="1.5" strokeLinecap="round">
              <line x1="940" y1="145" x2="960" y2="165" /><line x1="960" y1="145" x2="940" y2="165" />
            </g>
            {[0,1,2,3,4].map((row) => [0,1,2,3,4,5].map((col) => (
              <circle key={`${row}-${col}`} cx={500 + col * 60} cy={200 + row * 60} r="1.5" fill="rgba(194,101,42,0.12)" />
            )))}
            <path d="M 100 610 Q 400 405 700 610" fill="none" stroke="rgba(194,101,42,0.08)" strokeWidth="1" strokeDasharray="6 8" />
          </svg>

          <main className="relative z-10">

          {/* ── Decorative dot bg ── */}

          {/* ══════════════════ HERO ══════════════════ */}
          <section className="relative mx-auto max-w-7xl px-6 pb-16 pt-20 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">

              {/* Left */}
              <div>
                <span
                  ref={heroTagRef}
                  className="mb-5 block text-xs font-semibold uppercase tracking-[0.08em] text-primary"
                  style={{ opacity: 0 }}
                >
                  Formation Certifiante
                </span>

                {/* ── Rock-drop animated title ── */}
                <RockDropTitle
                  line1="Inscriptions :"
                  line2="Pole Bureautique"
                  accentWord="Bureautique"
                />

                <p
                  ref={heroDescRef}
                  className="mb-8 max-w-xl text-lg leading-relaxed text-on-surface-variant"
                  style={{ opacity: 0 }}
                >
                  Maitrisez les outils indispensables du monde professionnel. Une formation intensive
                  de <span className="font-bold text-on-surface">2 mois</span> couvrant Excel, Word
                  et PowerPoint pour transformer votre productivite.
                </p>

                <div ref={heroBadgesRef} className="mb-8 flex flex-wrap gap-4">
                  {[
                    { icon: 'schedule', text: 'Duree : 2 mois' },
                    { icon: 'payments', text: 'A partir de 300 DH' },
                  ].map(({ icon, text }) => (
                    <div key={text}
                      className="hero-badge flex items-center gap-3 rounded-xl border border-outline-variant/50 bg-white/80 px-5 py-3 shadow-sm"
                      style={{ opacity: 0 }}>
                      <span className="material-symbols-outlined text-primary">{icon}</span>
                      <span className="font-medium text-on-surface">{text}</span>
                    </div>
                  ))}
                </div>

                <ul ref={heroListRef} className="space-y-4">
                  {[
                    { title: 'Hands-on training', desc: 'Projets reels et exercices pratiques immediats.' },
                    { title: 'Professional tools', desc: 'Dernieres versions de la suite Microsoft Office.' },
                  ].map(({ title, desc }) => (
                    <li key={title} className="flex items-start gap-3" style={{ opacity: 0 }}>
                      <span className="material-symbols-outlined mt-0.5 text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      <div><h4 className="font-semibold text-on-surface">{title}</h4><p className="text-sm text-on-surface-variant">{desc}</p></div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right — image */}
              <div ref={heroImgRef} className="group relative" style={{ opacity: 0 }}>
                <div className="absolute -inset-4 rounded-[2rem] bg-primary/10 blur-2xl transition-all duration-500 group-hover:bg-primary/20" />
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  <img
                    alt="Espace de travail bureautique"
                    className="aspect-video w-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:filter-none"
                    style={{ filter: 'grayscale(100%)', transition: 'filter 0.6s ease, transform 0.7s ease' }}
                    onMouseEnter={(e) => { (e.target as HTMLImageElement).style.filter = 'grayscale(0%)'; }}
                    onMouseLeave={(e) => { (e.target as HTMLImageElement).style.filter = 'grayscale(100%)'; }}
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGeQTJWU5lf74rdGfm5Tnl5u6PdpyjIQt_3eZcKeqARYaDMRVtvOcZdJ3nUxsHVTJwFMeaYnc9-P1utuUeOPBxaA0Ah8FnTwTZxXUEdMUp0yOoDcSrnwLW2MCsHDymv8iWMqzcDPycAT6EpjoRqX6ATJdC33yHze1NeEDwH_UdfsmG30RfIFFRjkfiJOS3wNF3tS5szyG_7IktuBbZw5fDLha6cxRvEq4jifilpiHrm2AWjwDmw5ceF02zMOu_Bjm1CfMHLX0d9Ibc"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ══════════════════ DIVIDER ══════════════════ */}
          <div ref={dividerRef} className="relative z-10 mx-auto max-w-7xl px-6 pb-8 pt-12 text-center lg:px-8" style={{ opacity: 0 }}>
            <div className="mb-5 inline-flex items-center gap-4">
              <div className="h-px w-12 bg-primary/40" />
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              <div className="h-px w-12 bg-primary/40" />
            </div>
            <h2 className="mb-4 font-display text-4xl font-bold text-on-surface md:text-5xl">Finaliser votre Inscription</h2>
            <p className="mx-auto max-w-2xl text-lg text-on-surface-variant">
              Remplissez le formulaire ci-dessous pour reserver votre place au sein de notre promotion de Bureautique Professionnelle.
            </p>
          </div>

          {/* ══════════════════ FORM CARD ══════════════════ */}
          <section className="relative mx-auto max-w-4xl px-6 pb-28 lg:px-8">
            <div
              ref={formCardRef}
              className="rounded-3xl border border-outline-variant/30 bg-white p-8 shadow-xl md:p-12"
              style={{ opacity: 0, boxShadow: '0 4px 48px rgba(58,48,42,0.09)' }}
            >
              <form onSubmit={handleSubmit} noValidate className="space-y-14">

                {/* ── Step 1: Personal ── */}
                <section ref={step1Ref}>
                  <StepBadge n={1} label="Informations Personnelles" />
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {[
                      { name: 'nom',       label: 'Nom',       placeholder: 'Votre nom',         type: 'text',   err: errors.nom },
                      { name: 'prenom',    label: 'Prenom',    placeholder: 'Votre prenom',      type: 'text',   err: errors.prenom },
                      { name: 'age',       label: 'Age',       placeholder: 'Ex : 22',           type: 'number', err: errors.age },
                      { name: 'email',     label: 'Email',     placeholder: 'email@exemple.com', type: 'email',  err: errors.email },
                      { name: 'telephone', label: 'Telephone', placeholder: '+212 600 000 000',  type: 'tel',    err: errors.telephone },
                    ].map(({ name, label, placeholder, type, err }) => (
                      <div key={name} className="field-wrap" style={{ opacity: 0 }} data-has-error={err ? 'true' : undefined}>
                        <label className="mb-1.5 ml-1 block text-xs font-bold uppercase tracking-wider text-on-surface-variant">{label}</label>
                        <input type={type} name={name} value={(form as any)[name]} onChange={handleInput}
                          placeholder={placeholder} className={inputCls(err)}
                          {...(type === 'number' ? { min: 15, max: 80 } : {})} />
                        <FieldError msg={err} />
                      </div>
                    ))}
                  </div>
                </section>

                {/* ── Step 2: Modules + Level ── */}
                <section className="border-t border-outline-variant/20 pt-6">
                  <StepBadge n={2} label="Details de la Formation" />

                  <p className="mb-5 ml-1 text-sm font-semibold text-on-surface-variant">
                    Selectionnez vos modules <span className="font-normal text-on-surface-variant/70">(multi-choix possible)</span>
                  </p>

                  {/* Module cards grid — center-burst target */}
                  <div
                    ref={modulesGridRef}
                    className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"
                    data-has-error={errors.modules ? 'true' : undefined}
                  >
                    {MODULE_CARDS.map((module) => {
                      const checked = form.modules[module.key];
                      return (
                        <label key={module.key} className="group cursor-pointer">
                          <input type="checkbox" name={module.name} checked={checked} onChange={handleInput} className="sr-only" />
                          <div
                            className="module-card h-full rounded-2xl p-5 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md"
                            style={{
                              border: checked ? `2px solid ${module.accent}` : '1.5px solid #e5e7eb',
                              backgroundColor: checked ? `${module.accent}0D` : 'white',
                              boxShadow: checked ? `0 12px 32px -16px ${module.accent}50` : undefined,
                              opacity: 0,  // GSAP will reveal these
                            }}
                          >
                            <div className="mb-4 flex items-start justify-between gap-3">
                              <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: `${module.accent}18` }}>
                                <img src={module.icon} alt={module.title} className="h-8 w-8 object-contain" />
                              </div>
                              <span className="rounded-full px-2.5 py-0.5 text-xs font-bold" style={{ color: module.accent, backgroundColor: `${module.accent}15` }}>
                                {fmtAmount(module.price)}
                              </span>
                            </div>
                            <p className="font-bold text-on-surface">{module.title}</p>
                            <p className="mt-1.5 text-sm leading-relaxed text-on-surface-variant">{module.description}</p>
                            <div className="mt-5 flex items-center justify-between">
                              <span className="text-xs font-medium text-on-surface-variant">{checked ? 'Selectionne' : 'Cliquer pour choisir'}</span>
                              <span className="material-symbols-outlined text-xl transition-all"
                                style={{ color: checked ? module.accent : '#d1d5db', fontVariationSettings: checked ? "'FILL' 1" : "'FILL' 0" }}>
                                check_circle
                              </span>
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                  <FieldError msg={errors.modules} />

                  {/* Recap + Level */}
                  <div ref={step2RestRef} className="mt-5 space-y-8" style={{ opacity: 0 }}>
                    {/* Recap */}
                    <div className="rounded-2xl border border-outline-variant/40 bg-[#faf7f4] p-5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Recapitulatif</p>
                          <p className="mt-1.5 text-sm text-on-surface-variant">
                            {selectedModules.length ? selectedModules.map((m) => m.title).join(' · ') : 'Aucun module selectionne'}
                          </p>
                        </div>
                        <div className="sm:text-right">
                          <p className="text-xs uppercase tracking-[0.2em] text-on-surface-variant">Montant</p>
                          <p className="font-display text-3xl font-bold text-on-surface">{fmtAmount(totalAmount)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Level */}
                    <div>
                      <label className="mb-4 ml-1 block text-sm font-semibold text-on-surface-variant">Niveau souhaite</label>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        {LEVEL_OPTIONS.map(({ value, label, sub }) => {
                          const active = form.level === value;
                          return (
                            <label key={value} className="group cursor-pointer">
                              <input type="radio" name="level" value={value} checked={active} onChange={handleRadio} className="sr-only" />
                              <div className={`rounded-xl p-4 text-center transition-all duration-200 ${active ? 'border-2 border-primary bg-primary/5' : 'border-2 border-outline-variant/50 bg-white group-hover:border-primary/40'}`}>
                                <p className="font-bold text-on-surface">{label}</p>
                                <p className="text-xs text-on-surface-variant">{sub}</p>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </section>

                {/* ── Step 3: Payment ── */}
                <section ref={step3Ref} className="border-t border-outline-variant/20 pt-6">
                  <StepBadge n={3} label="Mode de Paiement" />
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2" data-has-error={errors.payment ? 'true' : undefined}>
                    {[
                      { value: 'online' as PaymentMode, icon: 'credit_card', label: 'Paiement en ligne',    sub: 'Redirection securisee Payzone' },
                      { value: 'onsite' as PaymentMode, icon: 'storefront',  label: 'Paiement presentiel',  sub: 'Reglement au centre de formation' },
                    ].map(({ value, icon, label, sub }) => {
                      const active = form.payment === value;
                      return (
                        <label key={value} className="payment-option group cursor-pointer" style={{ opacity: 0 }}>
                          <input type="radio" name="payment" value={value} checked={active} onChange={handleRadio} className="sr-only" />
                          <div className={`flex items-center gap-4 rounded-2xl bg-white p-5 transition-all duration-200 ${active ? 'border-2 border-primary bg-primary/5 shadow-md shadow-primary/8' : 'border-2 border-outline-variant/50 group-hover:border-primary/40'}`}>
                            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all ${active ? 'bg-primary' : 'bg-surface-container'}`}>
                              <span className="material-symbols-outlined text-xl" style={{ color: active ? 'white' : '#9ca3af' }}>{icon}</span>
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-on-surface">{label}</p>
                              <p className="text-sm text-on-surface-variant">{sub}</p>
                            </div>
                            <span className="material-symbols-outlined text-xl" style={{ color: active ? 'var(--color-primary)' : '#d1d5db', fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}>radio_button_checked</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                  <FieldError msg={errors.payment} />

                  {form.payment === 'online' && (
                    <div className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-sm">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Paiement securise Payzone</p>
                      <h4 className="mt-1 font-display text-xl font-bold text-on-surface">Redirection vers la page bancaire</h4>
                      <p className="mt-2 text-emerald-800">Apres validation, vous serez redirige vers Payzone. La banque peut demander un code 3D Secure.</p>
                    </div>
                  )}

                  {form.payment === 'onsite' && (
                    <div className="mt-6 rounded-3xl border border-primary/20 bg-white p-6 shadow-sm">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Paiement au centre</p>
                      <h4 className="mt-1 font-display text-xl font-bold text-on-surface">Informations de rendez-vous</h4>
                      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="rounded-2xl border border-outline-variant/30 bg-[#faf7f4] p-5">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">Adresse</p>
                          <p className="mt-2 text-sm font-semibold text-on-surface">14 avenue Hassan II, 1er etage, Ville Nouvelle, Meknes, Maroc</p>
                          <a href="https://www.google.com/maps/search/?api=1&query=33.8989909,-5.551918" target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                            <span className="material-symbols-outlined text-base leading-none">north_east</span>Google Maps
                          </a>
                        </div>
                        <div className="rounded-2xl border border-outline-variant/30 bg-[#faf7f4] p-5">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">Horaires</p>
                          <div className="mt-2 space-y-1 text-sm text-on-surface">
                            <p>Lundi – Vendredi : 08h00 – 18h00</p><p>Samedi : 09h00 – 13h00</p>
                            <p className="text-on-surface-variant">Dimanche : ferme</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 rounded-2xl border border-outline-variant/30 bg-[#faf7f4] p-5">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">Moyens acceptes</p>
                        <div className="flex flex-wrap gap-2">
                          {['Cash Plus', 'Wafacash', 'Barid Cash', 'Carte bancaire'].map((p) => (
                            <span key={p} className="rounded-full border border-outline-variant bg-white px-4 py-1.5 text-sm font-medium text-on-surface">{p}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </section>

                {/* ── Terms + Submit ── */}
                <div ref={submitRef} className="space-y-6 border-t border-outline-variant/20 pt-8" style={{ opacity: 0 }}>
                  <div className="space-y-4">
                    {[
                      { name: 'acceptTerms', err: errors.acceptTerms, label: <>En cochant cette case, j'accepte les <a href="/terms" className="font-medium text-primary underline underline-offset-2">Conditions Generales</a>, la <a href="/privacy" className="font-medium text-primary underline underline-offset-2">Politique de Confidentialite</a> et j'autorise le centre a traiter mon dossier.</> },
                      { name: 'acceptPrivacy', err: errors.acceptPrivacy, label: 'Je confirme que les informations fournies sont exactes et j\'accepte le traitement de mes donnees personnelles.' },
                    ].map(({ name, err, label }) => (
                      <div key={name} data-has-error={err ? 'true' : undefined}>
                        <label className="group flex cursor-pointer items-start gap-3">
                          <input type="checkbox" name={name} checked={(form as any)[name]} onChange={handleInput}
                            className={`mt-0.5 h-4 w-4 rounded border text-primary focus:ring-primary ${err ? 'border-red-400' : 'border-outline-variant'}`} />
                          <span className="text-sm leading-relaxed text-on-surface-variant group-hover:text-on-surface">{label}</span>
                        </label>
                        <FieldError msg={err} />
                      </div>
                    ))}
                  </div>

                  <button type="submit" disabled={submitting}
                    className="group relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-primary py-5 text-base font-bold tracking-wide text-on-primary shadow-lg transition-all duration-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                    style={{ boxShadow: '0 8px 32px rgba(194,101,42,0.25)' }}>
                    <span className="absolute inset-0 -translate-x-full bg-white/10 transition-transform duration-500 group-hover:translate-x-full" />
                    {submitting ? <><span className="material-symbols-outlined animate-spin text-xl leading-none">progress_activity</span>Traitement en cours...</>
                      : <>{form.payment === 'online' ? 'Payer avec Payzone' : 'Valider ma place'}<span className="material-symbols-outlined text-xl leading-none transition-transform duration-300 group-hover:translate-x-1">arrow_forward</span></>}
                  </button>

                  {submitted && (
                    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center sm:flex-row">
                      <span className="material-symbols-outlined text-emerald-600" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                      <p className="text-sm font-semibold text-emerald-800">Demande envoyee.</p>
                      {paymentCertificate && (
                        <button type="button" onClick={() => setShowPaymentCertificate(true)} className="text-sm font-bold text-emerald-700 underline underline-offset-2">
                          Voir le certificat
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </form>
            </div>
          </section>
          </main>
        </div>
      </PublicLayout>

      <style>{`
        .bureautique-page-bg {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          background: linear-gradient(160deg, #fffdf9 0%, #fef7ed 28%, #fdf0dc 54%, #fef5e8 76%, #fffbf5 100%);
        }
        .bureautique-bg-geo {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
        }
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 0.8s linear infinite; display: inline-block; }
        /* Stripe card layout */
        .payment-card-grid { display: grid; gap: 16px; }
        .payment-card-field { display: flex; flex-direction: column; gap: 6px; }
        .payment-card-field-full { grid-column: 1 / -1; }
        .payment-card-subgrid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
        .payment-card-label { margin-left: 4px; font-size: 0.95rem; font-weight: 600; color: rgb(var(--color-on-surface-variant)); }
        .payment-card-input-shell { position: relative; display: flex; min-height: 54px; align-items: center; padding: 0 16px; overflow: hidden; }
        .payment-card-number-shell { padding-right: 124px; }
        .payment-card-cvc-shell { padding-right: 58px; }
        .payment-card-element { width: 100%; min-width: 0; }
        .payment-card-icons { position: absolute; right: 12px; top: 50%; display: flex; align-items: center; gap: 6px; transform: translateY(-50%); pointer-events: none; }
        .payment-card-cvc-icon { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); pointer-events: none; }
        .payment-card-element .StripeElement { width: 100%; }
        .payment-card-element .StripeElement iframe { width: 100% !important; min-height: 22px; }
        @media (max-width: 767px) { .payment-card-subgrid { grid-template-columns: 1fr; } }
      `}</style>
    </>
  );
};

export default InscriptionBureautique;
