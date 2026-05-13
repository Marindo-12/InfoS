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
import { PaymentCertificate,PaymentCertificateData } from '@/Components/PaymentCertificate';
import wordIc from '../../../../public/images/word.png';
import excelIc from '../../../../public/images/excel.png';
import powerpointIc from '../../../../public/images/powerpoint.png';

/* ═══════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════ */

type ModuleKey = 'word' | 'excel' | 'powerpoint' | 'access';
type PaymentMode = '' | 'online' | 'onsite';

interface FormData {
  nom: string;
  prenom: string;
  age: string;
  email: string;
  telephone: string;
  modules: Record<ModuleKey, boolean>;
  level: string;
  payment: PaymentMode;
  acceptTerms: boolean;
  acceptPrivacy: boolean;
}

interface FormErrors {
  nom?: string;
  prenom?: string;
  age?: string;
  email?: string;
  telephone?: string;
  modules?: string;
  payment?: string;
  card?: string;
  acceptTerms?: string;
  acceptPrivacy?: string;
}

interface Certificate {
  learnerName: string;
  reference: string;
  processingCode: string;
  paymentMode: string;
  amount: string;
  modules: string[];
  level: string;
  issuedAt: string;
}

interface StripeCardHandle {
  createPaymentMethod: (billingDetails: { name: string; email: string; phone: string }) => Promise<
    { paymentMethodId: string } | { error: string }
  >;
}

interface StripeCardSectionProps {
  totalAmount: number;
  cardError?: string;
  processing: boolean;
  paymentDone: boolean;
  paymentReference?: string;
  onCardChange: (hasError: boolean) => void;
  onPayNow: () => void;
}

/* ═══════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════ */

const MODULE_CARDS = [
  {
    key: 'word' as ModuleKey,
    name: 'module_word',
    title: 'Microsoft Word',
    description: 'Edition, mise en page et documents professionnels',
    price: 600,
    accent: '#185ABD',
    icon: wordIc,
  },
  {
    key: 'excel' as ModuleKey,
    name: 'module_excel',
    title: 'Microsoft Excel',
    description: 'Tableaux, calculs, formules et analyse de donnees',
    price: 500,
    accent: '#107C41',
    icon: excelIc,
  },
  {
    key: 'powerpoint' as ModuleKey,
    name: 'module_powerpoint',
    title: 'Microsoft PowerPoint',
    description: 'Presentations visuelles, slides et animations',
    price: 300,
    accent: '#D24726',
    icon: powerpointIc,
  },
  {
    key: 'access' as ModuleKey,
    name: 'module_access',
    title: 'Microsoft Access',
    description: 'Bases de donnees, formulaires, requetes et etats',
    price: 400,
    accent: '#A4373A',
    icon: excelIc,
  },
] as const;

const LEVEL_OPTIONS = [
  { value: 'debutant', label: 'Debutant', sub: 'Bases et introduction' },
  { value: 'intermediaire', label: 'Intermediaire', sub: 'Fonctions avancees' },
  { value: 'avance', label: 'Avance', sub: 'Expertise metier' },
];

/* ═══════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════ */

const fmtAmount = (n: number) => `${n.toLocaleString('fr-MA')} DH`;

const okEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const okPhone = (v: string) => /^[+\d\s\-()]{8,}$/.test(v.trim());

const secureRef = (prefix: string) => {
  const bytes = new Uint32Array(2);
  crypto.getRandomValues(bytes);
  return `${prefix}-${Date.now().toString(36).toUpperCase()}-${bytes[0]
    .toString(36).slice(0, 4).toUpperCase()}${bytes[1].toString(36).slice(0, 4).toUpperCase()}`;
};

const inputCls = (err?: string) =>
  `w-full rounded-xl border bg-surface-container-lowest px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 ${err
    ? 'border-red-400 bg-red-50/30 focus:ring-red-200'
    : 'border-outline-variant focus:border-primary focus:ring-primary/20'
  }`;

/* ═══════════════════════════════════════════════════
   FIELD ERROR
═══════════════════════════════════════════════════ */

const FieldError: React.FC<{ msg?: string }> = ({ msg }) =>
  msg ? (
    <p className="ml-1 mt-1.5 flex items-center gap-1.5 text-xs text-red-500">
      <span className="material-symbols-outlined text-sm leading-none">error</span>
      {msg}
    </p>
  ) : null;

/* ═══════════════════════════════════════════════════
   CARD BRAND SVG LOGOS
   Inline SVGs — no external deps, no CDN
═══════════════════════════════════════════════════ */

/** Visa */
const LogoVisa: React.FC<{ active: boolean }> = ({ active }) => (
  <svg
    viewBox="0 0 50 32" width="44" height="28"
    style={{ opacity: active ? 1 : 0.3, transition: 'opacity .25s' }}
    aria-label="Visa"
  >
    <rect width="50" height="32" rx="5" fill="#0055A5" stroke="#0055A5" strokeWidth="1" />
    <text x="5" y="22" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="13"
      fill="#FFFFFF" letterSpacing="-0.5">VISA</text>
  </svg>
);

/** Mastercard — two overlapping circles */
const LogoMastercard: React.FC<{ active: boolean }> = ({ active }) => (
  <svg
    viewBox="0 0 50 32" width="44" height="28"
    style={{ opacity: active ? 1 : 0.3, transition: 'opacity .25s' }}
    aria-label="Mastercard"
  >
    <rect width="50" height="32" rx="5" fill="#fff" stroke="#e5e7eb" strokeWidth="1" />
    <circle cx="19" cy="16" r="9" fill="#EB001B" />
    <circle cx="31" cy="16" r="9" fill="#F79E1B" />
    <path d="M25 9.3a9 9 0 0 1 0 13.4A9 9 0 0 1 25 9.3z" fill="#FF5F00" />
  </svg>
);

/** Discover */
const LogoDiscover: React.FC<{ active: boolean }> = ({ active }) => (
  <svg
    viewBox="0 0 50 32" width="44" height="28"
    style={{ opacity: active ? 1 : 0.3, transition: 'opacity .25s' }}
    aria-label="Discover"
  >
    <rect width="50" height="32" rx="5" fill="#fff" stroke="#e5e7eb" strokeWidth="1" />
    <circle cx="34" cy="16" r="9" fill="#F76F20" />
    <text x="5" y="20" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="7.5"
      fill="#231F20" letterSpacing="0.2">DISC</text>
    <text x="5" y="28" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="7.5"
      fill="#231F20" letterSpacing="0.2">OVER</text>
  </svg>
);

/** Amex */
const LogoAmex: React.FC<{ active: boolean }> = ({ active }) => (
  <svg
    viewBox="0 0 50 32" width="44" height="28"
    style={{ opacity: active ? 1 : 0.3, transition: 'opacity .25s' }}
    aria-label="American Express"
  >
    <rect width="50" height="32" rx="5" fill="#2E77BC" stroke="#2E77BC" strokeWidth="1" />
    <text x="5" y="14" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="6"
      fill="#fff" letterSpacing="0.5">AMERICAN</text>
    <text x="5" y="22" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="6"
      fill="#fff" letterSpacing="0.5">EXPRESS</text>
  </svg>
);

/** Map Stripe brand string → logo */
const BRAND_LOGO: Record<string, React.FC<{ active: boolean }>> = {
  visa: LogoVisa,
  mastercard: LogoMastercard,
  discover: LogoDiscover,
  amex: LogoAmex,
};

/** Shown when no brand detected */
const ALL_BRANDS = ['visa', 'mastercard'] as const;

/** CVC card icon SVG */
const CvcIcon: React.FC = () => (
  <svg viewBox="0 0 38 24" width="36" height="22" fill="none" aria-hidden="true">
    <rect width="38" height="24" rx="4" fill="#e5e7eb" />
    <rect x="0" y="7" width="38" height="6" fill="#9ca3af" />
    <rect x="6" y="16" width="16" height="4" rx="1" fill="#d1d5db" />
    <rect x="25" y="15.5" width="8" height="5" rx="1.5" fill="#fff" stroke="#d1d5db" strokeWidth="0.5" />
    <text x="26.5" y="19.5" fontSize="4" fill="#374151" fontFamily="monospace" fontWeight="bold">123</text>
  </svg>
);

const StripeCardSection = forwardRef<StripeCardHandle, StripeCardSectionProps>(
  ({ totalAmount, cardError, processing, paymentDone, paymentReference, onCardChange, onPayNow }, ref) => {
    const stripe = useStripe();
    const elements = useElements();

    const [numberComplete, setNumberComplete] = useState(false);
    const [expiryComplete, setExpiryComplete] = useState(false);
    const [cvcComplete, setCvcComplete] = useState(false);
    const [brand, setBrand] = useState<string>('unknown');

    const allComplete = numberComplete && expiryComplete && cvcComplete;

    /* Sync combined error state to parent */
    const syncCardState = (next: {
      number?: boolean; expiry?: boolean; cvc?: boolean; hasOwnError: boolean;
    }) => {
      const n = next.number ?? numberComplete;
      const e = next.expiry ?? expiryComplete;
      const c = next.cvc ?? cvcComplete;
      onCardChange(next.hasOwnError || !n || !e || !c);
    };

    /* Expose createPaymentMethod to parent via ref */
    useImperativeHandle(ref, () => ({
      async createPaymentMethod(billingDetails) {
        if (!stripe || !elements) return { error: 'Stripe non initialise.' };
        const cardNumber = elements.getElement(CardNumberElement);
        if (!cardNumber) return { error: 'Element carte introuvable.' };

        const { error, paymentMethod } = await stripe.createPaymentMethod({
          type: 'card',
          card: cardNumber,
          billing_details: billingDetails,
        });

        if (error) return { error: error.message ?? 'Erreur carte.' };
        return { paymentMethodId: paymentMethod.id };
      },
    }));

    /* Stripe element style */
    const elementOptions = {
      style: {
        base: {
          fontSize: '15px',
          fontFamily: 'inherit',
          color: '#1c1c1e',
          '::placeholder': { color: '#9ca3af' },
          iconColor: '#6b7280',
        },
        invalid: { color: '#dc2626', iconColor: '#dc2626' },
      },
    };

    /* Field wrapper class */
    const fieldCls = (hasError?: boolean) =>
      `rounded-xl border bg-white transition-all focus-within:ring-2 ${hasError
        ? 'border-red-400 bg-red-50/30 focus-within:ring-red-200'
        : 'border-outline-variant focus-within:border-primary focus-within:ring-primary/20'
      }`;

    /* Which logo to show */
    const DetectedLogo = brand !== 'unknown' ? BRAND_LOGO[brand] : null;

    /*
      Stripe Elements render inside an <iframe>.
      The iframe needs a block container with an explicit width.
      We must NOT use overflow:hidden on the wrapper or clip the iframe.
      Logos go BELOW the input row, not inside/overlapping it.
    */
    return (
      <div className="mt-6 rounded-3xl border border-primary/20 bg-white p-6 shadow-sm">

        {/* ── Header ── */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Paiement securise
            </p>
            <h4 className="mt-1 font-display text-xl font-bold text-on-surface">
              Carte bancaire
            </h4>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-outline-variant/40 bg-surface-container px-4 py-2">
            <span className="material-symbols-outlined text-base text-emerald-600">lock</span>
            <span className="text-sm font-bold text-on-surface">{fmtAmount(totalAmount)}</span>
          </div>
        </div>

        <div className="payment-card-grid">

          {/* ── Card number ── */}
          <div className="payment-card-field payment-card-field-full">
            <label className="payment-card-label">
                Numero de carte
            </label>
              {/* Logos sit in the label row — never overlap the input */}
            <div className={`${fieldCls(!!cardError && !numberComplete)} payment-card-input-shell payment-card-number-shell`}>
              <div className="payment-card-element payment-card-element-number">
                <CardNumberElement
                  options={{ ...elementOptions, showIcon: false }}
                  onChange={(ev) => {
                    setNumberComplete(ev.complete);
                    setBrand(ev.brand ?? 'unknown');
                    syncCardState({ number: ev.complete, hasOwnError: !!ev.error });
                  }}
                />
              </div>
              <div className="payment-card-icons" aria-hidden="true">
                {DetectedLogo ? (
                  <DetectedLogo active={true} />
                ) : (
                  ALL_BRANDS.map((b) => {
                    const Logo = BRAND_LOGO[b];
                    return <Logo key={b} active={true} />;
                  })
                )}
              </div>
            </div>

            {/* Input wrapper — full width, no overflow:hidden, no absolute children */}
          </div>

          {/* ── Expiry + CVC ── */}
          <div className="payment-card-subgrid">

            {/* Expiry */}
            <div className="payment-card-field">
              <label className="payment-card-label">
                Date d'expiration
              </label>
              <div className={`${fieldCls()} payment-card-input-shell`}>
                <div className="payment-card-element">
                  <CardExpiryElement
                    options={elementOptions}
                    onChange={(ev) => {
                      setExpiryComplete(ev.complete);
                      syncCardState({ expiry: ev.complete, hasOwnError: !!ev.error });
                    }}
                  />
                </div>
              </div>
            </div>

            {/* CVC */}
            <div className="payment-card-field">
              <label className="payment-card-label">
                Code de securite
              </label>
              <div className={`${fieldCls()} payment-card-input-shell payment-card-cvc-shell`}>
                <div className="payment-card-element payment-card-element-cvc">
                  <CardCvcElement
                    options={elementOptions}
                    onChange={(ev) => {
                      setCvcComplete(ev.complete);
                      syncCardState({ cvc: ev.complete, hasOwnError: !!ev.error });
                    }}
                  />
                {/* CVC icon floated right via absolute — outside iframe flow */}
                </div>
                <div className="payment-card-cvc-icon" aria-hidden="true">
                  <CvcIcon />
                </div>
              </div>

            </div>
          </div>

          {/* Inline error / success */}
          {cardError && <FieldError msg={cardError} />}
          {allComplete && !cardError && (
            <p className="ml-1 mt-1.5 flex items-center gap-1.5 text-xs text-emerald-600">
              <span
                className="material-symbols-outlined text-sm leading-none"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
              Informations de carte valides
            </p>
          )}
        </div>

        {/* ── Pay button ── */}
        <button
          type="button"
          onClick={onPayNow}
          disabled={processing || paymentDone || !stripe || !allComplete}
          className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-2xl py-4 text-sm font-bold tracking-wide text-white shadow-lg transition-all duration-300 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
          style={{
            background: paymentDone
              ? 'linear-gradient(135deg,#059669,#047857)'
              : 'linear-gradient(135deg,#059669,#065f46)',
            boxShadow: paymentDone ? '0 8px 24px -8px #05966970' : '0 8px 24px -8px #05966960',
          }}
        >
          {processing ? (
            <>
              <span className="material-symbols-outlined animate-spin text-xl leading-none">
                progress_activity
              </span>
              Paiement en cours...
            </>
          ) : paymentDone ? (
            <>
              <span
                className="material-symbols-outlined text-xl leading-none"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                task_alt
              </span>
              Paiement effectue
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-xl leading-none">lock</span>
              Payer {fmtAmount(totalAmount)}
            </>
          )}
        </button>

        {/* Payment done confirmation */}
        {paymentDone && paymentReference && (
          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <span
              className="material-symbols-outlined mt-0.5 text-base text-emerald-600"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
            <div>
              <p className="text-sm font-semibold text-emerald-800">Paiement effectue avec succes</p>
              <p className="mt-0.5 text-xs text-emerald-700">
                Reference :{' '}
                <span className="font-mono font-semibold">{paymentReference}</span>
              </p>
              <p className="mt-1 text-xs text-emerald-600">
                Cliquez sur "Confirmer l'inscription" ci-dessous pour finaliser votre dossier.
              </p>
            </div>
          </div>
        )}

        {/* Security notice */}
        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-3">
          <span className="material-symbols-outlined text-base text-emerald-600">security</span>
          <p className="text-xs leading-relaxed text-emerald-800">
            Vos donnees sont chiffrees et traitees directement par{' '}
            <strong>Stripe</strong> (certifie PCI-DSS niveau 1).
            Aucune information bancaire ne transite par nos serveurs.
          </p>
        </div>
      </div>
    );
  },
);

StripeCardSection.displayName = 'StripeCardSection';

/* ═══════════════════════════════════════════════════
   CERTIFICATE MODAL
═══════════════════════════════════════════════════ */

const CertificateModal: React.FC<{ cert: Certificate; onClose: () => void }> = ({ cert, onClose }) => {
  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', esc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', esc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] bg-white shadow-2xl"
        style={{ maxHeight: '92vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 shadow-sm text-on-surface-variant transition-colors hover:bg-surface-container"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 px-8 py-8 text-white">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
              <span
                className="material-symbols-outlined text-2xl text-white"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified
              </span>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-200">
                Pre-inscription confirmee
              </p>
              <h3 className="font-display text-2xl font-bold">Certificat genere</h3>
            </div>
          </div>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-emerald-100">
            Conservez ce document. La reference et le code de traitement sont lies a votre
            dossier pour le suivi avec le centre.
          </p>
        </div>

        <div className="space-y-4 p-8">
          <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-low p-5">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                  Apprenant
                </p>
                <p className="mt-1 text-base font-bold text-on-surface">{cert.learnerName}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                  Niveau
                </p>
                <p className="mt-1 text-base font-bold text-on-surface">{cert.level}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                  Modules inscrits
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {cert.modules.map((m) => (
                    <span
                      key={m}
                      className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-low p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                Reference unique
              </p>
              <p className="mt-2 break-all font-mono text-sm font-bold text-on-surface">
                {cert.reference}
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                Code de traitement
              </p>
              <p className="mt-2 break-all font-mono text-sm font-bold text-emerald-800">
                {cert.processingCode}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-outline-variant/30 bg-surface-container-low p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span
                className="material-symbols-outlined text-primary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {cert.paymentMode === 'Paiement en ligne' ? 'credit_card' : 'storefront'}
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                  Mode
                </p>
                <p className="text-sm font-bold text-on-surface">{cert.paymentMode}</p>
              </div>
            </div>
            <div className="sm:text-right">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                Montant
              </p>
              <p className="font-display text-2xl font-bold text-on-surface">{cert.amount}</p>
            </div>
          </div>

          <p className="text-center text-xs text-on-surface-variant">Emis le {cert.issuedAt}</p>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <button
              type="button"
              onClick={() => window.print()}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-outline-variant py-3 text-sm font-semibold text-on-surface transition-all hover:bg-surface-container active:scale-95"
            >
              <span className="material-symbols-outlined text-base leading-none">print</span>
              Imprimer
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-on-primary transition-all hover:opacity-90 active:scale-95"
            >
              <span className="material-symbols-outlined text-base leading-none">check</span>
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


interface Props {
  stripePublishableKey?: string;
}

const InscriptionBureautique: React.FC<Props> = ({
  stripePublishableKey = (import.meta as any).env?.VITE_STRIPE_PK ?? '',
}) => {
  const stripePromise = useMemo(
    () => (stripePublishableKey ? loadStripe(stripePublishableKey) : null),
    [stripePublishableKey],
  );
  const stripeOptions = useMemo(
    () => ({
      mode: 'payment' as const,
      amount: 100,
      currency: 'mad',
      appearance: {
        theme: 'stripe' as const,
        variables: { fontFamily: 'inherit', borderRadius: '12px' },
      },
    }),
    [],
  );

  const stripeCardRef = useRef<StripeCardHandle>(null);

  const [form, setForm] = useState<FormData>({
    nom: '', prenom: '', age: '',
    email: '', telephone: '',
    modules: { word: false, excel: false, powerpoint: false, access: false },
    level: 'debutant', payment: '',
    acceptTerms: false, acceptPrivacy: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [cardHasError, setCardHasError] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [onlinePaymentCompleted, setOnlinePaymentCompleted] = useState(false);
  const [onlinePaymentReference, setOnlinePaymentReference] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [paymentCertificate, setPaymentCertificate] = useState<PaymentCertificateData | null>(null);
  const [showPaymentCertificate, setShowPaymentCertificate] = useState(false);
  const defaultPaymentDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date.toISOString().slice(0, 10);
  }, []);

  const selectedModules = useMemo(
    () => MODULE_CARDS.filter((m) => form.modules[m.key]),
    [form.modules],
  );
  const totalAmount = useMemo(
    () => selectedModules.reduce((sum, m) => sum + m.price, 0),
    [selectedModules],
  );

  const clearErr = (field: keyof FormErrors) =>
    setErrors((prev) => ({ ...prev, [field]: undefined }));

  /* ── Validation for final confirmation ── */
  const validateFinalConfirmation = (): FormErrors => {
    const e: FormErrors = {};
    if (!form.nom.trim()) e.nom = 'Le nom est requis.';
    if (!form.prenom.trim()) e.prenom = 'Le prenom est requis.';
    if (!form.age || Number(form.age) < 15 || Number(form.age) > 80)
      e.age = 'Saisissez un age valide (15 - 80).';
    if (!okEmail(form.email)) e.email = 'Adresse email invalide.';
    if (!okPhone(form.telephone)) e.telephone = 'Numero de telephone invalide.';
    if (!selectedModules.length) e.modules = 'Selectionnez au moins un module.';
    if (!form.payment) e.payment = 'Choisissez un mode de paiement.';
    if (form.payment === 'online' && !onlinePaymentCompleted)
      e.card = 'Effectuez le paiement en ligne avant la confirmation finale.';
    if (!form.acceptTerms) e.acceptTerms = 'Acceptez les conditions generales.';
    if (!form.acceptPrivacy) e.acceptPrivacy = 'Acceptez la politique de confidentialite.';
    return e;
  };

  /* ── Input handlers ── */
  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      if (name.startsWith('module_')) {
        const key = name.replace('module_', '') as ModuleKey;
        setForm((prev) => ({ ...prev, modules: { ...prev.modules, [key]: checked } }));
        clearErr('modules');
        // Reset payment if amount changes
        setOnlinePaymentCompleted(false);
        setOnlinePaymentReference('');
      } else {
        setForm((prev) => ({ ...prev, [name]: checked }));
        clearErr(name as keyof FormErrors);
      }
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
    clearErr(name as keyof FormErrors);
  };

  const handleRadio = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    clearErr(e.target.name as keyof FormErrors);
    if (e.target.name === 'payment') {
      setOnlinePaymentCompleted(false);
      setOnlinePaymentReference('');
      clearErr('card');
    }
  };

  /* ── Online payment handler (called from "Payer X DH" button inside StripeCardSection) ── */
  const handleOnlinePayment = async () => {
    // Validate required fields before charging
    const preErrors: FormErrors = {};
    if (!form.nom.trim()) preErrors.nom = 'Le nom est requis avant le paiement.';
    if (!form.prenom.trim()) preErrors.prenom = 'Le prenom est requis avant le paiement.';
    if (!okEmail(form.email)) preErrors.email = 'Adresse email invalide.';
    if (!okPhone(form.telephone)) preErrors.telephone = 'Numero de telephone invalide.';
    if (!selectedModules.length) preErrors.modules = 'Selectionnez au moins un module avant le paiement.';
    if (cardHasError) preErrors.card = 'Completez correctement les informations de carte.';

    if (Object.keys(preErrors).length) {
      setErrors((prev) => ({ ...prev, ...preErrors }));
      document.querySelector('[data-has-error="true"]')
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setSubmitting(true);
    try {
      if (!stripeCardRef.current) {
        setErrors((prev) => ({ ...prev, card: 'Le formulaire de carte est introuvable.' }));
        return;
      }

      const result = await stripeCardRef.current.createPaymentMethod({
        name: `${form.prenom} ${form.nom}`,
        email: form.email,
        phone: form.telephone,
      });

      if ('error' in result) {
        setErrors((prev) => ({ ...prev, card: result.error }));
        return;
      }

      // ──────────────────────────────────────────────────────────────
      // BACKEND INTEGRATION : send result.paymentMethodId to your API
      // POST /api/payment-intent { paymentMethodId, amount: totalAmount * 100 }
      // then confirm via stripe.confirmCardPayment(clientSecret)
      // ──────────────────────────────────────────────────────────────
      console.log('[Stripe] PaymentMethod created:', result.paymentMethodId);

      setOnlinePaymentCompleted(true);
      setOnlinePaymentReference(secureRef('PAY'));
      clearErr('card');
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Final form submit (generates certificate) ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalErrors = validateFinalConfirmation();
    if (Object.keys(finalErrors).length) {
      setErrors(finalErrors);
      document.querySelector('[data-has-error="true"]')
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setSubmitting(true);
    try {
      const processingCode = secureRef('TRT');
      const certificateReference = secureRef('PAYCERT');
      const paymentReference = onlinePaymentReference || secureRef('PAY');
      router.post(route('applications.store'), {
        first_name: form.prenom,
        last_name: form.nom,
        email: form.email,
        phone: form.telephone,
        category: 'Bureautique',
        training_label: selectedModules.map((m) => m.title).join(', ') || 'Bureautique',
        course_slug: 'expertise-microsoft-office',
        amount: totalAmount,
        payment_method: form.payment,
        payment_reference: paymentReference,
        preferred_payment_date: form.payment === 'onsite' ? defaultPaymentDate : undefined,
        certificate_reference: certificateReference,
        form_data: { ...form, processingCode },
      }, {
        preserveScroll: true,
        onSuccess: () => {
          setPaymentCertificate({
            studentName: `${form.prenom.trim()} ${form.nom.trim()}`,
            reference: certificateReference,
            barcodeValue: `${certificateReference}-${paymentReference}`,
            trainingLabel: selectedModules.map((m) => m.title).join(', ') || 'Bureautique',
            category: 'Bureautique',
            amount: fmtAmount(totalAmount),
            paymentMode: form.payment === 'online' ? 'Paiement en ligne' : 'Paiement presentiel',
            paymentStatus: form.payment === 'online' ? 'Paye' : 'Paiement a regler au centre',
            issuedAt: new Date().toLocaleString('fr-MA'),
          });
          setSubmitted(true);
          setShowPaymentCertificate(true);
        },
        onFinish: () => setSubmitting(false),
      });
    } finally {
      setSubmitting(false);
    }
  };

  /* ════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════ */
  return (
    <>
      <Head title="Bureautique" />
      {showPaymentCertificate && paymentCertificate && (
        <PaymentCertificate
          certificate={paymentCertificate}
          onClose={() => setShowPaymentCertificate(false)}
        />
      )}
      <PublicLayout>
        <main className="relative">
          <div className="geometric-bg pointer-events-none absolute inset-0 opacity-30" />

          {/* ── Hero ── */}
          <section className="relative mx-auto max-w-7xl px-6 pb-12 pt-16 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
              <div>
                <span className="mb-4 block text-xs font-semibold uppercase tracking-widest text-primary">
                  Formation Certifiante
                </span>
                <h1 className="mb-6 font-display text-5xl font-bold leading-tight md:text-6xl">
                  <span className="text-primary">Inscriptions :</span>{' '}
                  <span className="text-on-surface">Pole Bureautique</span>
                </h1>
                <p className="mb-8 max-w-xl text-lg leading-relaxed text-on-surface-variant">
                  Maitrisez les outils indispensables du monde professionnel. Une formation intensive
                  de <span className="font-bold text-on-surface">2 mois</span> couvrant Excel, Word
                  et PowerPoint pour transformer votre productivite.
                </p>
                <div className="mb-8 flex flex-wrap gap-4">
                  {[
                    { icon: 'schedule', text: 'Duree : 2 mois' },
                    { icon: 'payments', text: 'A partir de 300 DH' },
                  ].map(({ icon, text }) => (
                    <div key={text} className="flex items-center gap-3 rounded-xl border border-outline-variant/50 bg-surface-container px-5 py-3">
                      <span className="material-symbols-outlined text-primary">{icon}</span>
                      <span className="font-medium">{text}</span>
                    </div>
                  ))}
                </div>
                <ul className="space-y-4">
                  {[
                    { title: 'Hands-on training', desc: 'Projets reels et exercices pratiques immediats.' },
                    { title: 'Professional tools', desc: 'Dernieres versions de la suite Microsoft Office.' },
                  ].map(({ title, desc }) => (
                    <li key={title} className="flex items-start gap-3">
                      <span
                        className="material-symbols-outlined mt-0.5 text-primary"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        check_circle
                      </span>
                      <div>
                        <h4 className="font-semibold">{title}</h4>
                        <p className="text-sm leading-tight text-on-surface-variant">{desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="group relative">
                <div className="absolute -inset-4 rounded-[2rem] bg-primary/10 blur-2xl transition-all duration-500 group-hover:bg-primary/20" />
                <img
                  alt="Espace de travail"
                  className="hover-color-transition relative aspect-video w-full rounded-2xl border border-outline-variant/30 object-cover shadow-2xl"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGeQTJWU5lf74rdGfm5Tnl5u6PdpyjIQt_3eZcKeqARYaDMRVtvOcZdJ3nUxsHVTJwFMeaYnc9-P1utuUeOPBxaA0Ah8FnTwTZxXUEdMUp0yOoDcSrnwLW2MCsHDymv8iWMqzcDPycAT6EpjoRqX6ATJdC33yHze1NeEDwH_UdfsmG30RfIFFRjkfiJOS3wNF3tS5szyG_7IktuBbZw5fDLha6cxRvEq4jifilpiHrm2AWjwDmw5ceF02zMOu_Bjm1CfMHLX0d9Ibc"
                />
              </div>
            </div>
          </section>

          {/* Section title */}
          <div className="relative z-10 mx-auto max-w-7xl px-6 pb-8 pt-12 text-center lg:px-8">
            <div className="mb-6 inline-block h-1 w-12 bg-primary" />
            <h2 className="mb-4 font-display text-4xl font-bold text-on-surface md:text-5xl">
              Finaliser votre Inscription
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-on-surface-variant">
              Remplissez le formulaire ci-dessous pour reserver votre place au sein de notre
              promotion de Bureautique Professionnelle.
            </p>
          </div>

          {/* ── Form card ── */}
          <section className="relative mx-auto max-w-4xl px-6 pb-24 lg:px-8">
            <div className="rounded-3xl border border-outline-variant/30 bg-white/80 p-8 shadow-sm md:p-12">

              {!stripePublishableKey && (
                <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  <strong>Stripe non configure</strong> — Ajoutez{' '}
                  <code className="rounded bg-amber-100 px-1">VITE_STRIPE_PK</code> dans votre{' '}
                  <code className="rounded bg-amber-100 px-1">.env</code> pour activer le paiement en ligne.
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-12">

                {/* ── Step 1: Personal info ── */}
                <section>
                  <div className="mb-8 flex items-center gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-on-primary">1</span>
                    <h3 className="font-display text-2xl font-bold">Informations Personnelles</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                    <div data-has-error={errors.nom ? 'true' : undefined}>
                      <label className="mb-1.5 ml-1 block text-sm font-semibold text-on-surface-variant">Nom</label>
                      <input type="text" name="nom" value={form.nom} onChange={handleInput}
                        placeholder="Votre nom" className={inputCls(errors.nom)} />
                      <FieldError msg={errors.nom} />
                    </div>

                    <div data-has-error={errors.prenom ? 'true' : undefined}>
                      <label className="mb-1.5 ml-1 block text-sm font-semibold text-on-surface-variant">Prenom</label>
                      <input type="text" name="prenom" value={form.prenom} onChange={handleInput}
                        placeholder="Votre prenom" className={inputCls(errors.prenom)} />
                      <FieldError msg={errors.prenom} />
                    </div>

                    <div data-has-error={errors.age ? 'true' : undefined}>
                      <label className="mb-1.5 ml-1 block text-sm font-semibold text-on-surface-variant">Age</label>
                      <input type="number" name="age" value={form.age} onChange={handleInput}
                        placeholder="Ex : 22" min={15} max={80} className={inputCls(errors.age)} />
                      <FieldError msg={errors.age} />
                    </div>

                    <div data-has-error={errors.email ? 'true' : undefined}>
                      <label className="mb-1.5 ml-1 block text-sm font-semibold text-on-surface-variant">Email</label>
                      <input type="email" name="email" value={form.email} onChange={handleInput}
                        placeholder="email@exemple.com" className={inputCls(errors.email)} />
                      <FieldError msg={errors.email} />
                    </div>

                    <div data-has-error={errors.telephone ? 'true' : undefined}>
                      <label className="mb-1.5 ml-1 block text-sm font-semibold text-on-surface-variant">Telephone</label>
                      <input type="tel" name="telephone" value={form.telephone} onChange={handleInput}
                        placeholder="+212 600 000 000" className={inputCls(errors.telephone)} />
                      <FieldError msg={errors.telephone} />
                    </div>

                  </div>
                </section>

                {/* ── Step 2: Modules + Level ── */}
                <section>
                  <div className="mb-8 flex items-center gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-on-primary">2</span>
                    <h3 className="font-display text-2xl font-bold">Details de la Formation</h3>
                  </div>

                  <p className="mb-4 ml-1 text-sm font-semibold text-on-surface-variant">
                    Selectionnez vos modules{' '}
                    <span className="font-normal text-on-surface-variant/70">(multi-choix possible)</span>
                  </p>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"
                    data-has-error={errors.modules ? 'true' : undefined}>
                    {MODULE_CARDS.map((module) => {
                      const checked = form.modules[module.key];
                      return (
                        <label key={module.key} className="group cursor-pointer">
                          <input type="checkbox" name={module.name} checked={checked}
                            onChange={handleInput} className="sr-only" />
                          <div
                            className="h-full rounded-2xl bg-white p-5 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md"
                            style={{
                              border: checked ? `2px solid ${module.accent}` : '1.5px solid #e5e7eb',
                              backgroundColor: checked ? `${module.accent}0D` : 'white',
                              boxShadow: checked ? `0 12px 32px -16px ${module.accent}50` : undefined,
                            }}
                          >
                            <div className="mb-4 flex items-start justify-between gap-3">
                              <div className="flex h-12 w-12 items-center justify-center rounded-xl"
                                style={{ backgroundColor: `${module.accent}18` }}>
                                <img src={module.icon} alt={module.title} className="h-8 w-8 object-contain" />
                              </div>
                              <span className="rounded-full px-2.5 py-0.5 text-xs font-bold"
                                style={{ color: module.accent, backgroundColor: `${module.accent}15` }}>
                                {fmtAmount(module.price)}
                              </span>
                            </div>
                            <p className="font-bold text-on-surface">{module.title}</p>
                            <p className="mt-1.5 text-sm leading-relaxed text-on-surface-variant">
                              {module.description}
                            </p>
                            <div className="mt-5 flex items-center justify-between">
                              <span className="text-xs font-medium text-on-surface-variant">
                                {checked ? 'Selectionne' : 'Cliquer pour choisir'}
                              </span>
                              <span className="material-symbols-outlined text-xl transition-all"
                                style={{
                                  color: checked ? module.accent : '#d1d5db',
                                  fontVariationSettings: checked ? "'FILL' 1" : "'FILL' 0",
                                }}>
                                check_circle
                              </span>
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                  <FieldError msg={errors.modules} />

                  {/* Recap */}
                  <div className="mt-5 rounded-2xl border border-outline-variant/40 bg-white p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Recapitulatif</p>
                        <p className="mt-1.5 text-sm text-on-surface-variant">
                          {selectedModules.length
                            ? selectedModules.map((m) => m.title).join(' · ')
                            : 'Aucun module selectionne pour le moment'}
                        </p>
                      </div>
                      <div className="sm:text-right">
                        <p className="text-xs uppercase tracking-[0.2em] text-on-surface-variant">Montant</p>
                        <p className="font-display text-3xl font-bold text-on-surface">
                          {fmtAmount(totalAmount)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Level */}
                  <div className="mt-8">
                    <label className="mb-4 ml-1 block text-sm font-semibold text-on-surface-variant">
                      Niveau souhaite
                    </label>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      {LEVEL_OPTIONS.map(({ value, label, sub }) => {
                        const active = form.level === value;
                        return (
                          <label key={value} className="group cursor-pointer">
                            <input type="radio" name="level" value={value}
                              checked={active} onChange={handleRadio} className="sr-only" />
                            <div className={`rounded-xl p-4 text-center transition-all duration-200 ${active
                                ? 'border-2 border-primary bg-primary/5'
                                : 'border-2 border-outline-variant/50 bg-white group-hover:border-primary/40'
                              }`}>
                              <p className="font-bold text-on-surface">{label}</p>
                              <p className="text-xs text-on-surface-variant">{sub}</p>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </section>

                {/* ── Step 3: Payment ── */}
                <section>
                  <div className="mb-8 flex items-center gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-on-primary">3</span>
                    <h3 className="font-display text-2xl font-bold">Mode de Paiement</h3>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2"
                    data-has-error={errors.payment ? 'true' : undefined}>
                    {[
                      { value: 'online' as PaymentMode, icon: 'credit_card', label: 'Paiement en ligne', sub: 'Carte bancaire securisee — Stripe' },
                      { value: 'onsite' as PaymentMode, icon: 'storefront', label: 'Paiement presentiel', sub: 'Reglement au centre de formation' },
                    ].map(({ value, icon, label, sub }) => {
                      const active = form.payment === value;
                      return (
                        <label key={value} className="group cursor-pointer">
                          <input type="radio" name="payment" value={value}
                            checked={active} onChange={handleRadio} className="sr-only" />
                          <div className={`flex items-center gap-4 rounded-2xl bg-white p-5 transition-all duration-200 ${active
                              ? 'border-2 border-primary bg-primary/5'
                              : 'border-2 border-outline-variant/50 group-hover:border-primary/40'
                            }`}>
                            <span className="material-symbols-outlined text-2xl transition-colors"
                              style={{ color: active ? 'var(--color-primary)' : '#9ca3af' }}>
                              {icon}
                            </span>
                            <div className="flex-1">
                              <p className="font-semibold text-on-surface">{label}</p>
                              <p className="text-sm text-on-surface-variant">{sub}</p>
                            </div>
                            <span className="material-symbols-outlined text-xl"
                              style={{
                                color: active ? 'var(--color-primary)' : '#d1d5db',
                                fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0",
                              }}>
                              radio_button_checked
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                  <FieldError msg={errors.payment} />

                  {/* Stripe card form — inside <Elements> */}
                  {form.payment === 'online' && (
                    stripePromise ? (
                      <Elements stripe={stripePromise} options={stripeOptions}>
                        <StripeCardSection
                          ref={stripeCardRef}
                          totalAmount={totalAmount}
                          cardError={errors.card}
                          processing={submitting}
                          paymentDone={onlinePaymentCompleted}
                          paymentReference={onlinePaymentReference}
                          onCardChange={(hasErr) => {
                            setCardHasError(hasErr);
                            if (!hasErr) clearErr('card');
                          }}
                          onPayNow={handleOnlinePayment}
                        />
                      </Elements>
                    ) : (
                      <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
                        Paiement en ligne indisponible — cle Stripe manquante.
                      </div>
                    )
                  )}

                  {/* Onsite info */}
                  {form.payment === 'onsite' && (
                    <div className="mt-6 rounded-3xl border border-primary/20 bg-white p-6 shadow-sm">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                        Paiement au centre
                      </p>
                      <h4 className="mt-1 font-display text-xl font-bold text-on-surface">
                        Informations de rendez-vous
                      </h4>
                      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-low p-5">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">Adresse</p>
                          <p className="mt-2 text-sm font-semibold text-on-surface">
                            14 avenue Hassan II, 1er etage, Ville Nouvelle, Meknes, Maroc
                          </p>
                          <a
                            href="https://www.google.com/maps/search/?api=1&query=33.8989909,-5.551918"
                            target="_blank" rel="noreferrer"
                            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
                          >
                            <span className="material-symbols-outlined text-base leading-none">north_east</span>
                            Google Maps
                          </a>
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
                      <div className="mt-4 rounded-2xl border border-outline-variant/30 bg-surface-container-low p-5">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                          Moyens acceptes
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {['Cash Plus', 'Wafacash', 'Barid Cash', 'Carte bancaire'].map((p) => (
                            <span key={p}
                              className="rounded-full border border-outline-variant bg-white px-4 py-1.5 text-sm font-medium text-on-surface">
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </section>

                {/* ── Terms + Submit ── */}
                <div className="space-y-6 border-t border-outline-variant/30 pt-8">
                  <div className="space-y-4">

                    <div data-has-error={errors.acceptTerms ? 'true' : undefined}>
                      <label className="group flex cursor-pointer items-start gap-3">
                        <input type="checkbox" name="acceptTerms" checked={form.acceptTerms}
                          onChange={handleInput}
                          className={`mt-0.5 h-4 w-4 rounded border text-primary transition-all focus:ring-primary ${errors.acceptTerms ? 'border-red-400' : 'border-outline-variant'
                            }`}
                        />
                        <span className="text-sm leading-relaxed text-on-surface-variant transition-colors group-hover:text-on-surface">
                          En cochant cette case, j'accepte les{' '}
                          <a href="/terms" className="font-medium text-primary underline underline-offset-2">
                            Conditions Generales d'Utilisation
                          </a>
                          , la{' '}
                          <a href="/privacy" className="font-medium text-primary underline underline-offset-2">
                            Politique de Confidentialite
                          </a>
                          {' '}et j'autorise le centre a traiter mon dossier, verifier les elements
                          administratifs et associer mon paiement a mon inscription.
                        </span>
                      </label>
                      <FieldError msg={errors.acceptTerms} />
                    </div>

                    <div data-has-error={errors.acceptPrivacy ? 'true' : undefined}>
                      <label className="group flex cursor-pointer items-start gap-3">
                        <input type="checkbox" name="acceptPrivacy" checked={form.acceptPrivacy}
                          onChange={handleInput}
                          className={`mt-0.5 h-4 w-4 rounded border text-primary transition-all focus:ring-primary ${errors.acceptPrivacy ? 'border-red-400' : 'border-outline-variant'
                            }`}
                        />
                        <span className="text-sm leading-relaxed text-on-surface-variant transition-colors group-hover:text-on-surface">
                          Je confirme que les informations fournies sont exactes et j'accepte le
                          traitement de mes donnees personnelles pour la gestion administrative,
                          pedagogique et financiere de mon inscription.
                        </span>
                      </label>
                      <FieldError msg={errors.acceptPrivacy} />
                    </div>

                  </div>

                  <button
                    type="submit"
                    disabled={submitting || (form.payment === 'online' && !onlinePaymentCompleted)}
                    className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-primary py-5 text-base font-bold tracking-wide text-on-primary shadow-lg shadow-primary/25 transition-all duration-300 hover:brightness-110 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <span className="material-symbols-outlined animate-spin text-xl leading-none">
                          progress_activity
                        </span>
                        Traitement en cours...
                      </>
                    ) : (
                      <>
                        {form.payment === 'online' ? "Confirmer l'inscription" : 'Valider ma place'}
                        <span className="material-symbols-outlined text-xl leading-none">arrow_forward</span>
                      </>
                    )}
                  </button>

                  {/* Hint when payment not yet done */}
                  {form.payment === 'online' && !onlinePaymentCompleted && (
                    <p className="text-center text-xs text-on-surface-variant">
                      Le paiement doit etre effectue dans le bloc securise ci-dessus avant la confirmation finale.
                    </p>
                  )}

                  {/* Confirmation banner after submission */}
                  {submitted && (
                    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center sm:flex-row">
                      <span
                        className="material-symbols-outlined text-emerald-600"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        verified
                      </span>
                      <p className="text-sm font-semibold text-emerald-800">
                        Demande envoyee.
                      </p>
                      {paymentCertificate && (
                        <button type="button" onClick={() => setShowPaymentCertificate(true)}
                          className="text-sm font-bold text-emerald-700 underline underline-offset-2">
                          Voir le certificat de paiement
                        </button>
                      )}
                    </div>
                  )}
                </div>

              </form>
            </div>
          </section>
        </main>
      </PublicLayout>

      <style>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
        }
        .geometric-bg {
          background-image: radial-gradient(#d8d0c8 0.5px, transparent 0.5px);
          background-size: 24px 24px;
        }
        .hover-color-transition {
          filter: grayscale(100%);
          transition: filter 0.5s ease-in-out;
        }
        .hover-color-transition:hover {
          filter: grayscale(0%);
        }
        .payment-card-grid {
          display: grid;
          gap: 16px;
        }
        .payment-card-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .payment-card-field-full {
          grid-column: 1 / -1;
        }
        .payment-card-subgrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }
        .payment-card-label {
          margin-left: 4px;
          font-size: 0.95rem;
          font-weight: 600;
          color: rgb(var(--color-on-surface-variant));
        }
        .payment-card-input-shell {
          position: relative;
          display: flex;
          min-height: 54px;
          align-items: center;
          padding: 0 16px;
          overflow: hidden;
        }
        .payment-card-number-shell {
          padding-right: 124px;
        }
        .payment-card-cvc-shell {
          padding-right: 58px;
        }
        .payment-card-element {
          width: 100%;
          min-width: 0;
        }
        .payment-card-icons {
          position: absolute;
          right: 12px;
          top: 50%;
          display: flex;
          align-items: center;
          gap: 6px;
          transform: translateY(-50%);
          pointer-events: none;
        }
        .payment-card-cvc-icon {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
        }
        .payment-card-element .StripeElement {
          width: 100%;
        }
        .payment-card-element .StripeElement iframe {
          width: 100% !important;
          min-height: 22px;
        }
        @media (max-width: 767px) {
          .payment-card-subgrid {
            grid-template-columns: 1fr;
          }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 0.8s linear infinite; display: inline-block; }
      `}</style>
    </>
  );
};

export default InscriptionBureautique;
