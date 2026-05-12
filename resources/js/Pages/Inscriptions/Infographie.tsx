import React, { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
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

/* ═══════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════ */

type PaymentMode = '' | 'online' | 'onsite';
type GraphicKey = 'photoshop' | 'illustrator' | 'indesign';

interface FormData {
  nom: string;
  prenom: string;
  age: string;
  niveau: string;
  email: string;
  telephone: string;
  graphic: GraphicKey;
  message: string;
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
  payment?: string;
  card?: string;
  acceptTerms?: string;
  acceptPrivacy?: string;
}

interface StripeCardHandle {
  createPaymentMethod: (billingDetails: {
    name: string;
    email: string;
    phone: string;
  }) => Promise<{ paymentMethodId: string } | { error: string }>;
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

const INFOGRAPHIE_OPTIONS: Array<{ value: GraphicKey; label: string; price: number; hours: number }> = [
  { value: 'photoshop', label: 'Adobe Photoshop', price: 1000, hours: 30 },
  { value: 'illustrator', label: 'Adobe Illustrator', price: 1000, hours: 25 },
  { value: 'indesign', label: 'Adobe InDesign', price: 900, hours: 20 },
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

/* ═══════════════════════════════════════════════════
   FIELD ERROR
═══════════════════════════════════════════════════ */

const FieldError: React.FC<{ msg?: string }> = ({ msg }) =>
  msg ? (
    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500">
      <span className="material-symbols-outlined text-sm leading-none">error</span>
      {msg}
    </p>
  ) : null;

/* ═══════════════════════════════════════════════════
   CARD LOGOS
═══════════════════════════════════════════════════ */

const LogoVisa: React.FC<{ active: boolean }> = ({ active }) => (
  <svg viewBox="0 0 50 32" width="44" height="28"
    style={{ opacity: active ? 1 : 0.3, transition: 'opacity .25s' }} aria-label="Visa">
    <rect width="50" height="32" rx="5" fill="#0055A5" />
    <text x="5" y="22" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="13"
      fill="#fff" letterSpacing="-0.5">VISA</text>
  </svg>
);

const LogoMastercard: React.FC<{ active: boolean }> = ({ active }) => (
  <svg viewBox="0 0 50 32" width="44" height="28"
    style={{ opacity: active ? 1 : 0.3, transition: 'opacity .25s' }} aria-label="Mastercard">
    <rect width="50" height="32" rx="5" fill="#fff" stroke="#e5e7eb" strokeWidth="1" />
    <circle cx="19" cy="16" r="9" fill="#EB001B" />
    <circle cx="31" cy="16" r="9" fill="#F79E1B" />
    <path d="M25 9.3a9 9 0 0 1 0 13.4A9 9 0 0 1 25 9.3z" fill="#FF5F00" />
  </svg>
);

const BRAND_LOGO: Record<string, React.FC<{ active: boolean }>> = {
  visa: LogoVisa,
  mastercard: LogoMastercard,
};
const ALL_BRANDS = ['visa', 'mastercard'] as const;

const CvcIcon: React.FC = () => (
  <svg viewBox="0 0 38 24" width="36" height="22" fill="none" aria-hidden="true">
    <rect width="38" height="24" rx="4" fill="#e5e7eb" />
    <rect x="0" y="7" width="38" height="6" fill="#9ca3af" />
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
    const stripe = useStripe();
    const elements = useElements();

    const [numberComplete, setNumberComplete] = useState(false);
    const [expiryComplete, setExpiryComplete] = useState(false);
    const [cvcComplete, setCvcComplete] = useState(false);
    const [brand, setBrand] = useState<string>('unknown');

    const allComplete = numberComplete && expiryComplete && cvcComplete;

    const sync = (next: { number?: boolean; expiry?: boolean; cvc?: boolean; hasOwnError: boolean }) => {
      const n = next.number ?? numberComplete;
      const e = next.expiry ?? expiryComplete;
      const c = next.cvc ?? cvcComplete;
      onCardChange(next.hasOwnError || !n || !e || !c);
    };

    useImperativeHandle(ref, () => ({
      async createPaymentMethod(billingDetails) {
        if (!stripe || !elements) return { error: 'Stripe non initialise.' };
        const cardEl = elements.getElement(CardNumberElement);
        if (!cardEl) return { error: 'Element carte introuvable.' };
        const { error, paymentMethod } = await stripe.createPaymentMethod({
          type: 'card', card: cardEl, billing_details: billingDetails,
        });
        if (error) return { error: error.message ?? 'Erreur carte.' };
        return { paymentMethodId: paymentMethod.id };
      },
    }));

    const elOpts = {
      style: {
        base: {
          fontSize: '15px', fontFamily: 'Manrope, inherit', color: '#1c1c1e',
          '::placeholder': { color: '#9ca3af' }, iconColor: '#6b7280',
        },
        invalid: { color: '#dc2626', iconColor: '#dc2626' },
      },
    };

    const shell = (err?: boolean) =>
      `rounded-xl border bg-white transition-all focus-within:ring-2 ${err
        ? 'border-red-400 bg-red-50/30 focus-within:ring-red-200'
        : 'border-outline-variant focus-within:border-primary focus-within:ring-primary/20'
      }`;

    const DetectedLogo = brand !== 'unknown' ? BRAND_LOGO[brand] : null;

    return (
      <div className="mt-6 overflow-hidden rounded-3xl border border-primary/20 bg-white shadow-lg">
        {/* Coloured top stripe */}
        <div className="h-1.5 w-full bg-gradient-to-r from-primary via-orange-400 to-amber-300" />

        <div className="p-6">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="sans-body text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Paiement securise
              </p>
              <h4 className="sans-body mt-1 text-xl font-bold text-on-surface">Carte bancaire</h4>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-outline-variant/40 bg-surface-container px-4 py-2">
              <span className="material-symbols-outlined text-base text-emerald-600">lock</span>
              <span className="sans-body text-sm font-bold text-on-surface">{fmtAmount(totalAmount)}</span>
            </div>
          </div>

          {/* Fields */}
          <div className="infog-card-grid">

            {/* Card number */}
            <div className="infog-card-field infog-card-full">
              <div className="flex items-center justify-between">
                <label className="infog-card-label">Numero de carte</label>
                <div className="flex items-center gap-1.5" aria-hidden="true">
                  {DetectedLogo
                    ? <DetectedLogo active={true} />
                    : ALL_BRANDS.map((b) => { const L = BRAND_LOGO[b]; return <L key={b} active={true} />; })}
                </div>
              </div>
              <div className={`${shell(!!cardError && !numberComplete)} infog-card-shell`}>
                <div className="infog-card-el">
                  <CardNumberElement
                    options={{ ...elOpts, showIcon: false }}
                    onChange={(ev) => {
                      setNumberComplete(ev.complete);
                      setBrand(ev.brand ?? 'unknown');
                      sync({ number: ev.complete, hasOwnError: !!ev.error });
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Expiry + CVC */}
            <div className="infog-card-subgrid infog-card-full">
              <div className="infog-card-field">
                <label className="infog-card-label">Date d'expiration</label>
                <div className={`${shell()} infog-card-shell`}>
                  <div className="infog-card-el">
                    <CardExpiryElement options={elOpts}
                      onChange={(ev) => { setExpiryComplete(ev.complete); sync({ expiry: ev.complete, hasOwnError: !!ev.error }); }} />
                  </div>
                </div>
              </div>
              <div className="infog-card-field">
                <label className="infog-card-label">Code de securite</label>
                <div className={`${shell()} infog-card-shell infog-card-cvc-shell`}>
                  <div className="infog-card-el infog-card-el-cvc">
                    <CardCvcElement options={elOpts}
                      onChange={(ev) => { setCvcComplete(ev.complete); sync({ cvc: ev.complete, hasOwnError: !!ev.error }); }} />
                  </div>
                  <div className="infog-card-cvc-icon" aria-hidden="true"><CvcIcon /></div>
                </div>
              </div>
            </div>

            {cardError && <FieldError msg={cardError} />}
            {allComplete && !cardError && (
              <p className="sans-body mt-1 flex items-center gap-1.5 text-xs text-emerald-600">
                <span className="material-symbols-outlined text-sm leading-none"
                  style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                Informations de carte valides
              </p>
            )}
          </div>

          {/* Pay button */}
          <button
            type="button"
            onClick={onPayNow}
            disabled={processing || paymentDone || !stripe || !allComplete}
            className="sans-body mt-6 flex w-full items-center justify-center gap-2.5 rounded-2xl py-4 text-sm font-bold tracking-wide text-white shadow-lg transition-all duration-300 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              background: paymentDone ? 'linear-gradient(135deg,#059669,#047857)' : 'linear-gradient(135deg,#059669,#065f46)',
              boxShadow: paymentDone ? '0 8px 24px -8px #05966970' : '0 8px 24px -8px #05966960',
            }}
          >
            {processing ? (
              <><span className="material-symbols-outlined animate-spin text-xl leading-none">progress_activity</span>Paiement en cours...</>
            ) : paymentDone ? (
              <><span className="material-symbols-outlined text-xl leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>task_alt</span>Paiement effectue</>
            ) : (
              <><span className="material-symbols-outlined text-xl leading-none">lock</span>Payer {fmtAmount(totalAmount)}</>
            )}
          </button>

          {paymentDone && paymentReference && (
            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <span className="material-symbols-outlined mt-0.5 text-base text-emerald-600"
                style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <div>
                <p className="sans-body text-sm font-semibold text-emerald-800">Paiement effectue avec succes</p>
                <p className="sans-body mt-0.5 text-xs text-emerald-700">
                  Reference : <span className="font-mono font-semibold">{paymentReference}</span>
                </p>
                <p className="sans-body mt-1 text-xs text-emerald-600">
                  Cliquez sur "Lancer mon Parcours" ci-dessous pour finaliser.
                </p>
              </div>
            </div>
          )}

          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-3">
            <span className="material-symbols-outlined text-base text-emerald-600">security</span>
            <p className="sans-body text-xs leading-relaxed text-emerald-800">
              Vos donnees sont chiffrees et traitees directement par{' '}
              <strong>Stripe</strong> (certifie PCI-DSS niveau 1). Aucune information bancaire
              ne transite par nos serveurs.
            </p>
          </div>
        </div>
      </div>
    );
  },
);
StripeCardSection.displayName = 'StripeCardSection';

/* ═══════════════════════════════════════════════════
   GEOMETRIC BACKGROUND SVG
═══════════════════════════════════════════════════ */

const GeoBg: React.FC = () => (
  <svg
    className="infog-geo-svg"
    viewBox="0 0 1200 900"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Large circles — primary accent */}
    <circle cx="80" cy="160" r="180" fill="none" stroke="rgba(194,101,42,0.09)" strokeWidth="1.5" />
    <circle cx="80" cy="160" r="100" fill="none" stroke="rgba(194,101,42,0.06)" strokeWidth="1" />
    <circle cx="1150" cy="740" r="220" fill="none" stroke="rgba(194,101,42,0.08)" strokeWidth="1.5" />
    <circle cx="1150" cy="740" r="130" fill="none" stroke="rgba(194,101,42,0.05)" strokeWidth="1" />
    <circle cx="600" cy="430" r="300" fill="none" stroke="rgba(194,101,42,0.04)" strokeWidth="1" />
    {/* Small accent circles */}
    <circle cx="950" cy="120" r="40" fill="none" stroke="rgba(194,101,42,0.12)" strokeWidth="1" />
    <circle cx="260" cy="750" r="60" fill="none" stroke="rgba(194,101,42,0.10)" strokeWidth="1" />
    <circle cx="1050" cy="340" r="25" fill="rgba(194,101,42,0.04)" />
    <circle cx="140" cy="550" r="18" fill="rgba(194,101,42,0.06)" />
    <circle cx="700" cy="80" r="12" fill="rgba(194,101,42,0.08)" />

    {/* Diagonal lines — top-left */}
    <line x1="0" y1="320" x2="240" y2="80" stroke="rgba(194,101,42,0.11)" strokeWidth="1" />
    <line x1="20" y1="350" x2="260" y2="110" stroke="rgba(194,101,42,0.07)" strokeWidth="0.8" />
    <line x1="40" y1="380" x2="280" y2="140" stroke="rgba(194,101,42,0.05)" strokeWidth="0.6" />
    {/* Diagonal lines — bottom-right */}
    <line x1="980" y1="580" x2="1200" y2="800" stroke="rgba(194,101,42,0.10)" strokeWidth="1" />
    <line x1="1000" y1="600" x2="1200" y2="820" stroke="rgba(194,101,42,0.06)" strokeWidth="0.7" />
    {/* Horizontal rules */}
    <line x1="320" y1="60" x2="620" y2="60" stroke="rgba(194,101,42,0.08)" strokeWidth="0.8" />
    <line x1="680" y1="840" x2="980" y2="840" stroke="rgba(194,101,42,0.08)" strokeWidth="0.8" />
    {/* Vertical accent */}
    <line x1="1180" y1="200" x2="1180" y2="420" stroke="rgba(194,101,42,0.07)" strokeWidth="0.8" strokeDasharray="4 6" />

    {/* Arrows */}
    <g stroke="rgba(194,101,42,0.18)" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <line x1="1060" y1="70" x2="1130" y2="70" />
      <polyline points="1115,56 1130,70 1115,84" />
    </g>
    <g stroke="rgba(194,101,42,0.14)" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <line x1="35" y1="520" x2="35" y2="590" />
      <polyline points="21,575 35,590 49,575" />
    </g>
    {/* Diagonal arrow */}
    <g stroke="rgba(194,101,42,0.12)" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <line x1="840" y1="800" x2="900" y2="740" />
      <polyline points="883,738 900,740 898,757" />
    </g>

    {/* Cross marks */}
    <g stroke="rgba(194,101,42,0.20)" strokeWidth="1.5" strokeLinecap="round">
      <line x1="940" y1="130" x2="960" y2="150" />
      <line x1="960" y1="130" x2="940" y2="150" />
    </g>
    <g stroke="rgba(194,101,42,0.14)" strokeWidth="1.2" strokeLinecap="round">
      <line x1="210" y1="710" x2="226" y2="726" />
      <line x1="226" y1="710" x2="210" y2="726" />
    </g>
    <g stroke="rgba(194,101,42,0.10)" strokeWidth="1" strokeLinecap="round">
      <line x1="580" y1="850" x2="592" y2="862" />
      <line x1="592" y1="850" x2="580" y2="862" />
    </g>

    {/* Triangle outline */}
    <polygon
      points="1100,440 1140,510 1060,510"
      fill="none"
      stroke="rgba(194,101,42,0.09)"
      strokeWidth="1"
    />

    {/* Dot grid */}
    {[0, 1, 2, 3, 4].map((row) =>
      [0, 1, 2, 3, 4, 5].map((col) => (
        <circle
          key={`${row}-${col}`}
          cx={480 + col * 52}
          cy={180 + row * 52}
          r="1.5"
          fill="rgba(194,101,42,0.11)"
        />
      ))
    )}

    {/* Dashed arc */}
    <path d="M 80 620 Q 420 400 760 620"
      fill="none" stroke="rgba(194,101,42,0.07)" strokeWidth="1" strokeDasharray="6 8" />

    {/* Small decorative squares */}
    <rect x="870" y="200" width="14" height="14" rx="2"
      fill="none" stroke="rgba(194,101,42,0.13)" strokeWidth="1" transform="rotate(20,877,207)" />
    <rect x="300" y="820" width="10" height="10" rx="1.5"
      fill="none" stroke="rgba(194,101,42,0.11)" strokeWidth="1" transform="rotate(-15,305,825)" />

    {/* Wavy path */}
    <path d="M 0 700 Q 150 660 300 700 Q 450 740 600 700"
      fill="none" stroke="rgba(194,101,42,0.06)" strokeWidth="1" strokeDasharray="3 9" />
  </svg>
);

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════ */

interface Props {
  stripePublishableKey?: string;
}

const InscriptionInfographie: React.FC<Props> = ({
  stripePublishableKey = (import.meta as any).env?.VITE_STRIPE_PK ?? '',
}) => {
  const stripePromise = useMemo(
    () => (stripePublishableKey ? loadStripe(stripePublishableKey) : null),
    [stripePublishableKey],
  );
  const stripeOptions = useMemo(() => ({
    mode: 'payment' as const,
    amount: 100,
    currency: 'mad',
    appearance: {
      theme: 'stripe' as const,
      variables: { fontFamily: 'Manrope, inherit', borderRadius: '12px' },
    },
  }), []);

  const stripeCardRef = useRef<StripeCardHandle>(null);

  const [form, setForm] = useState<FormData>({
    nom: '', prenom: '', age: '', niveau: 'Baccalaureat',
    email: '', telephone: '', graphic: 'photoshop', message: '',
    payment: '', acceptTerms: false, acceptPrivacy: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [cardHasError, setCardHasError] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [onlinePaymentCompleted, setOnlinePaymentCompleted] = useState(false);
  const [onlinePaymentReference, setOnlinePaymentReference] = useState('');
  const [submittedRef, setSubmittedRef] = useState('');
  const [paymentCertificate, setPaymentCertificate] = useState<PaymentCertificateData | null>(null);
  const [showPaymentCertificate, setShowPaymentCertificate] = useState(false);
  const selectedGraphic = useMemo(
    () => INFOGRAPHIE_OPTIONS.find((item) => item.value === form.graphic) ?? INFOGRAPHIE_OPTIONS[0],
    [form.graphic],
  );
  const totalAmount = selectedGraphic.price;
  const defaultPaymentDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date.toISOString().slice(0, 10);
  }, []);

  const clearErr = (f: keyof FormErrors) => setErrors((p) => ({ ...p, [f]: undefined }));

  /* Input */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((p) => ({ ...p, [name]: checked }));
      clearErr(name as keyof FormErrors);
      return;
    }
    setForm((p) => ({ ...p, [name]: value }));
    clearErr(name as keyof FormErrors);
    if (name === 'payment') {
      setOnlinePaymentCompleted(false);
      setOnlinePaymentReference('');
      clearErr('card');
    }
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'graphic') {
      setForm((p) => ({ ...p, graphic: e.target.value as GraphicKey }));
      return;
    }

    setForm((p) => ({ ...p, payment: e.target.value as PaymentMode }));
    clearErr('payment');
    setOnlinePaymentCompleted(false);
    setOnlinePaymentReference('');
    clearErr('card');
  };

  /* Validate final */
  const validateFinal = (): FormErrors => {
    const e: FormErrors = {};
    if (!form.nom.trim()) e.nom = 'Le nom est requis.';
    if (!form.prenom.trim()) e.prenom = 'Le prenom est requis.';
    if (!form.age || Number(form.age) < 15 || Number(form.age) > 60)
      e.age = 'Age invalide (15 - 60).';
    if (!okEmail(form.email)) e.email = 'Email invalide.';
    if (!okPhone(form.telephone)) e.telephone = 'Telephone invalide.';
    if (!form.payment) e.payment = 'Choisissez un mode de paiement.';
    if (form.payment === 'online' && !onlinePaymentCompleted)
      e.card = 'Effectuez le paiement avant de confirmer.';
    if (!form.acceptTerms) e.acceptTerms = 'Acceptez les conditions.';
    if (!form.acceptPrivacy) e.acceptPrivacy = 'Acceptez la politique de confidentialite.';
    return e;
  };

  /* Online payment */
  const handleOnlinePayment = async () => {
    const pre: FormErrors = {};
    if (!form.nom.trim()) pre.nom = 'Le nom est requis.';
    if (!form.prenom.trim()) pre.prenom = 'Le prenom est requis.';
    if (!okEmail(form.email)) pre.email = 'Email invalide.';
    if (!okPhone(form.telephone)) pre.telephone = 'Telephone invalide.';
    if (cardHasError) pre.card = 'Completez les informations de carte.';

    if (Object.keys(pre).length) {
      setErrors((p) => ({ ...p, ...pre }));
      document.querySelector('[data-has-error="true"]')
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setSubmitting(true);
    try {
      if (!stripeCardRef.current) {
        setErrors((p) => ({ ...p, card: 'Formulaire de carte introuvable.' }));
        return;
      }
      const result = await stripeCardRef.current.createPaymentMethod({
        name: `${form.prenom} ${form.nom}`,
        email: form.email,
        phone: form.telephone,
      });
      if ('error' in result) { setErrors((p) => ({ ...p, card: result.error })); return; }
      console.log('[Stripe] PaymentMethod:', result.paymentMethodId);
      setOnlinePaymentCompleted(true);
      setOnlinePaymentReference(secureRef('PAY'));
      clearErr('card');
    } finally {
      setSubmitting(false);
    }
  };

  /* Submit */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateFinal();
    if (Object.keys(errs).length) {
      setErrors(errs);
      document.querySelector('[data-has-error="true"]')
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setSubmitting(true);
    const certificateReference = secureRef('PAYCERT');
    const paymentReference = onlinePaymentReference || secureRef('PAY');
    router.post(route('applications.store'), {
      first_name: form.prenom,
      last_name: form.nom,
      email: form.email,
      phone: form.telephone,
      category: 'Infographie',
      training_label: selectedGraphic.label,
      course_slug: 'maitrise-adobe-creative-suite',
      amount: totalAmount,
      payment_method: form.payment,
      payment_reference: paymentReference,
      preferred_payment_date: form.payment === 'onsite' ? defaultPaymentDate : undefined,
      certificate_reference: certificateReference,
      form_data: { ...form },
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setSubmittedRef(certificateReference);
        setPaymentCertificate({
          studentName: `${form.prenom.trim()} ${form.nom.trim()}`,
          reference: certificateReference,
          barcodeValue: `${certificateReference}-${paymentReference}`,
          trainingLabel: selectedGraphic.label,
          category: 'Infographie',
          amount: fmtAmount(totalAmount),
          paymentMode: form.payment === 'online' ? 'Paiement en ligne' : 'Paiement presentiel',
          paymentStatus: form.payment === 'online' ? 'Paye' : 'Paiement a regler au centre',
          issuedAt: new Date().toLocaleString('fr-MA'),
        });
        setShowPaymentCertificate(true);
      },
      onFinish: () => setSubmitting(false),
    });
  };

  /* Field class */
  const fc = (err?: string) =>
    `w-full px-6 py-4 rounded-xl border-1 bg-white focus:ring-2 focus:ring-offset-0 focus:border-transparent outline-none transition-all sans-body shadow-sm ${err
      ? 'border-red-300 bg-red-50/20 focus:ring-red-200'
      : 'border-slate-500 focus:border-primary focus:ring-primary/20'
    }`;

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
          {/* Geometric background */}
          <GeoBg />

          <main className="relative z-10 flex-grow">

            {/* ── Hero ── */}
            <section className="relative overflow-hidden px-8 pb-16 pt-24">
              <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-2">
                <div>
                  <h1 className="serif-headline mb-8 text-6xl leading-none tracking-tighter text-on-surface md:text-8xl">
                    Inscriptions : <br />
                    <span className="italic text-primary">Creativite &amp; Infographie</span>
                  </h1>
                  <p className="sans-body mb-10 max-w-xl text-xl leading-relaxed text-on-surface-variant">
                    Maitrisez les outils qui definissent l'industrie visuelle moderne. Une immersion
                    de 4 mois pour transformer votre vision en realite digitale.
                  </p>
                  <div className="mb-12 grid grid-cols-3 gap-4">
                    {[
                      { icon: 'brush', label: 'Adobe Suite' },
                      { icon: 'schedule', label: '4 Mois' },
                      { icon: 'payments', label: fmtAmount(totalAmount) },
                    ].map(({ icon, label }) => (
                      <div key={label}
                        className="flex flex-col items-center rounded-xl border border-outline-variant/40 bg-surface-container-low p-6 text-center">
                        <span className="material-symbols-outlined mb-2 text-primary">{icon}</span>
                        <span className="sans-body text-lg font-bold">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hero image */}
                <div className="group relative">
                  <div className="absolute -inset-4 rounded-[2rem] bg-primary/5 blur-xl transition group-hover:bg-primary/10" />
                  <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-outline-variant/30 shadow-2xl">
                    <img
                      alt="Digital design process"
                      className="h-full w-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8G-jYVZmeS7NmPiHCEYldkLEhhZuUsjoObCw39FofSQAcqmWYcQJsM_5QKvfqkjd3iyIcI9pkiej_Fi-mftZm-8_nnYl4bSUulAkuhSmmBGrZyIGXTEoyp-Bu1mJIkUeOC04wPHW7Q7LUc6r2Q3F-6n6RO6bEL7uD0IPMdzduX4nS_akg_WgLvy9V4ulWZeBP58eaaUjpL0A3ItoEbn-mfwviEas3YqRedKycgRKuVp0Jg7-fvnfhJowwYeE4nVt9f7zsouBplVKG"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-8 left-8">
                      <div className="flex flex-wrap gap-3">
                        {['Photoshop', 'Illustrator', 'Figma'].map((tool) => (
                          <span key={tool}
                            className="sans-body rounded-full bg-surface-bright/90 px-4 py-2 text-sm font-bold uppercase tracking-widest text-primary backdrop-blur-md">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ── Form Section ── */}
            <section className="px-8 py-20">
              <div className="mx-auto max-w-4xl">
                <div className="mb-16 text-center">
                  <h2 className="serif-headline mb-4 text-4xl text-on-surface">
                    Votre Candidature Creative
                  </h2>
                  <p className="sans-body text-on-surface-variant">
                    Remplissez le formulaire ci-dessous pour reserver votre place dans la prochaine promotion.
                  </p>
                </div>

                {/* Form card */}
                <div className="overflow-hidden rounded-3xl border border-orange-100/60 bg-white shadow-sm">
                  {/* Orange top accent line */}
                  <div className="h-1 w-full bg-gradient-to-r from-primary via-orange-400 to-amber-200" />

                  <form onSubmit={handleSubmit} noValidate className="space-y-12 p-8 md:p-12">

                    {/* Personal info */}
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                      <div data-has-error={errors.prenom ? 'true' : undefined}>
                        <label className="sans-body mb-2 block px-1 text-sm font-semibold text-on-surface-variant">Prenom</label>
                        <input type="text" name="prenom" value={form.prenom} onChange={handleInputChange}
                          className={fc(errors.prenom)} placeholder="Ex: Sarah" />
                        <FieldError msg={errors.prenom} />
                      </div>
                      <div data-has-error={errors.nom ? 'true' : undefined}>
                        <label className="sans-body mb-2 block px-1 text-sm font-semibold text-on-surface-variant">Nom</label>
                        <input type="text" name="nom" value={form.nom} onChange={handleInputChange}
                          className={fc(errors.nom)} placeholder="Ex: Mansouri" />
                        <FieldError msg={errors.nom} />
                      </div>
                      <div data-has-error={errors.age ? 'true' : undefined}>
                        <label className="sans-body mb-2 block px-1 text-sm font-semibold text-on-surface-variant">Age</label>
                        <input type="number" name="age" value={form.age} onChange={handleInputChange}
                          className={fc(errors.age)} placeholder="22" />
                        <FieldError msg={errors.age} />
                      </div>
                      <div>
                        <label className="sans-body mb-2 block px-1 text-sm font-semibold text-on-surface-variant">Niveau Academique</label>
                        <select name="niveau" value={form.niveau} onChange={handleInputChange}
                          className={`${fc()} appearance-none`}>
                          <option>Baccalaureat</option>
                          <option>Bac +2 / DTS</option>
                          <option>Licence</option>
                          <option>Master</option>
                        </select>
                      </div>
                      <div data-has-error={errors.email ? 'true' : undefined}>
                        <label className="sans-body mb-2 block px-1 text-sm font-semibold text-on-surface-variant">E-mail</label>
                        <input type="email" name="email" value={form.email} onChange={handleInputChange}
                          className={fc(errors.email)} placeholder="sarah@exemple.com" />
                        <FieldError msg={errors.email} />
                      </div>
                      <div data-has-error={errors.telephone ? 'true' : undefined}>
                        <label className="sans-body mb-2 block px-1 text-sm font-semibold text-on-surface-variant">Telephone</label>
                        <input type="tel" name="telephone" value={form.telephone} onChange={handleInputChange}
                          className={fc(errors.telephone)} placeholder="+212 6..." />
                        <FieldError msg={errors.telephone} />
                      </div>
                    </div>

                    {/* Portfolio */}
                    <div>
                      <label className="sans-body mb-2 block px-1 text-sm font-semibold text-on-surface-variant">
                        Niveau actuel en design &amp; aspirations <span className="font-normal opacity-60">(Optionnel)</span>
                      </label>
                      <textarea name="message" value={form.message} onChange={handleInputChange}
                        className={`${fc()} resize-none`} rows={4}
                        placeholder="Parlez-nous de vos projets ou de ce que vous souhaitez accomplir..." />
                    </div>

                    <div>
                      <h3 className="sans-body mb-4 px-1 font-bold text-on-surface">
                        Formation souhaitee
                      </h3>
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                        {INFOGRAPHIE_OPTIONS.map((item) => (
                          <label key={item.value} className="cursor-pointer">
                            <input
                              type="radio"
                              name="graphic"
                              value={item.value}
                              checked={form.graphic === item.value}
                              onChange={handleRadioChange}
                              className="peer sr-only"
                            />
                            <div className="rounded-xl border border-outline-variant bg-white p-4 transition-all peer-checked:border-primary peer-checked:bg-primary/5">
                              <strong className="block text-sm text-on-surface">{item.label}</strong>
                              <span className="mt-1 block text-xs font-bold uppercase tracking-widest text-primary">
                                {item.hours}H / {fmtAmount(item.price)}
                              </span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Payment selection */}
                    <div>
                      <h3 className="sans-body mb-4 px-1 font-bold text-on-surface">
                        Mode de Paiement
                      </h3>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                        data-has-error={errors.payment ? 'true' : undefined}>
                        {[
                          { value: 'online', icon: 'credit_card', label: 'Paiement en ligne', sub: 'Securise & Instantane' },
                          { value: 'onsite', icon: 'calendar_month', label: 'Rendez-vous Presentiel', sub: 'Sur campus Elite Academy' },
                        ].map(({ value, icon, label, sub }) => (
                          <label key={value} className="group relative cursor-pointer">
                            <input type="radio" name="payment" value={value}
                              checked={form.payment === value}
                              onChange={handleRadioChange} className="peer sr-only" />
                            <div className={`flex items-center gap-4 rounded-xl border p-6 transition-all peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-surface-container ${errors.payment ? 'border-red-300' : 'border-outline-variant'
                              }`}>
                              <span className="material-symbols-outlined text-secondary peer-checked:text-primary"
                                style={{ color: form.payment === value ? 'var(--color-primary)' : undefined }}>
                                {icon}
                              </span>
                              <div>
                                <div className="sans-body font-bold">{label}</div>
                                <div className="sans-body text-xs text-on-surface-variant">{sub}</div>
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                      <FieldError msg={errors.payment} />

                      {/* Stripe section */}
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
                            <strong>Stripe non configure</strong> — Ajoutez{' '}
                            <code className="rounded bg-amber-100 px-1">VITE_STRIPE_PK</code> dans votre .env.
                          </div>
                        )
                      )}

                      {/* Onsite info */}
                      {form.payment === 'onsite' && (
                        <div className="mt-6 overflow-hidden rounded-3xl border border-primary/20 bg-white shadow-sm">
                          <div className="h-1 w-full bg-gradient-to-r from-primary to-amber-300" />
                          <div className="p-6">
                            <p className="sans-body text-xs font-bold uppercase tracking-[0.2em] text-primary">
                              Rendez-vous au centre
                            </p>
                            <h4 className="sans-body mt-1 text-xl font-bold text-on-surface">
                              Informations
                            </h4>
                            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                              <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-low p-5">
                                <p className="sans-body text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                                  Adresse
                                </p>
                                <p className="sans-body mt-2 text-sm font-semibold text-on-surface">
                                  14 avenue Hassan II, 1er etage, Ville Nouvelle, Meknes, Maroc
                                </p>
                                <a href="https://www.google.com/maps/search/?api=1&query=33.8989909,-5.551918"
                                  target="_blank" rel="noreferrer"
                                  className="sans-body mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                                  <span className="material-symbols-outlined text-base leading-none">north_east</span>
                                  Google Maps
                                </a>
                              </div>
                              <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-low p-5">
                                <p className="sans-body text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
                                  Horaires
                                </p>
                                <div className="sans-body mt-2 space-y-1 text-sm text-on-surface">
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

                    {/* Legal */}
                    <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-5 pt-5">
                      <p className="sans-body mb-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                        Conditions &amp; Confidentialite
                      </p>

                      <div data-has-error={errors.acceptTerms ? 'true' : undefined}>
                        <label className="group flex cursor-pointer items-start gap-3">
                          <div className="relative mt-0.5 shrink-0">
                            <input type="checkbox" name="acceptTerms" checked={form.acceptTerms}
                              onChange={handleInputChange}
                              className={`h-5 w-5 cursor-pointer appearance-none rounded border-2 bg-white transition-all checked:border-primary checked:bg-primary focus:outline-none focus:ring-2 focus:ring-primary/30 ${errors.acceptTerms ? 'border-red-400' : 'border-slate-300'}`} />
                            {form.acceptTerms && (
                              <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                <svg viewBox="0 0 12 10" width="10" height="8" fill="none">
                                  <path d="M1 5l3.5 3.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </span>
                            )}
                          </div>
                          <span className="sans-body text-sm leading-relaxed text-on-surface-variant transition-colors group-hover:text-on-surface">
                            En cochant cette case, j'accepte les{' '}
                            <a href="/terms" className="font-semibold text-primary underline underline-offset-2 decoration-primary/40 hover:decoration-primary transition-all">
                              Conditions Generales d'Utilisation
                            </a>{' '}
                            et le{' '}
                            <a href="/reglement" className="font-semibold text-primary underline underline-offset-2 decoration-primary/40 hover:decoration-primary transition-all">
                              Reglement Interieur
                            </a>{' '}
                            de Elite Academy.
                          </span>
                        </label>
                        <FieldError msg={errors.acceptTerms} />
                      </div>

                      <div className="my-2 border-t border-slate-100" />

                      <div data-has-error={errors.acceptPrivacy ? 'true' : undefined}>
                        <label className="group flex cursor-pointer items-start gap-3">
                          <div className="relative mt-0.5 shrink-0">
                            <input type="checkbox" name="acceptPrivacy" checked={form.acceptPrivacy}
                              onChange={handleInputChange}
                              className={`h-5 w-5 cursor-pointer appearance-none rounded border-2 bg-white transition-all checked:border-primary checked:bg-primary focus:outline-none focus:ring-2 focus:ring-primary/30 ${errors.acceptPrivacy ? 'border-red-400' : 'border-slate-300'}`} />
                            {form.acceptPrivacy && (
                              <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                <svg viewBox="0 0 12 10" width="10" height="8" fill="none">
                                  <path d="M1 5l3.5 3.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </span>
                            )}
                          </div>
                          <span className="sans-body text-sm leading-relaxed text-on-surface-variant transition-colors group-hover:text-on-surface">
                            Je confirme que les informations fournies sont exactes et j'autorise Elite Academy
                            a traiter mes donnees personnelles a des fins de{' '}
                            <span className="font-medium text-on-surface">
                              gestion administrative et pedagogique
                            </span>{' '}
                            de mon inscription, conformement a la politique de confidentialite.
                          </span>
                        </label>
                        <FieldError msg={errors.acceptPrivacy} />
                      </div>
                    </div>

                    {/* Submit */}
                    <div className="pt-8 text-center">
                      <button type="submit"
                        disabled={submitting || (form.payment === 'online' && !onlinePaymentCompleted)}
                        className="sans-body inline-flex items-center justify-center rounded-xl bg-primary px-12 py-5 text-lg font-bold text-on-primary shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] hover:bg-orange-800 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60">
                        {submitting ? (
                          <>
                            <span className="material-symbols-outlined mr-2 animate-spin">progress_activity</span>
                            Traitement...
                          </>
                        ) : (
                          <>
                            {form.payment === 'online' ? "Confirmer l'inscription" : 'Lancer mon Parcours Creatif'}
                            <span className="material-symbols-outlined ml-2">arrow_forward</span>
                          </>
                        )}
                      </button>

                      {form.payment === 'online' && !onlinePaymentCompleted && (
                        <p className="sans-body mt-3 text-xs text-on-surface-variant">
                          Effectuez d'abord le paiement dans le bloc securise ci-dessus.
                        </p>
                      )}

                      <p className="sans-body mt-4 text-xs text-on-surface-variant">
                        Places limitees. Inscription soumise a validation du dossier.
                      </p>
                    </div>

                    {/* Success */}
                    {submittedRef && (
                      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center">
                        <span className="material-symbols-outlined mb-2 text-3xl text-emerald-600"
                          style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                        <p className="sans-body font-semibold text-emerald-800">
                          Inscription enregistree ! Un conseiller vous contactera sous 48h.
                        </p>
                        <p className="sans-body mt-1 text-xs text-emerald-700">
                          Reference : <span className="font-mono font-semibold">{submittedRef}</span>
                        </p>
                        {paymentCertificate && (
                          <button
                            type="button"
                            onClick={() => setShowPaymentCertificate(true)}
                            className="sans-body mt-3 text-sm font-bold text-emerald-700 underline underline-offset-2"
                          >
                            Voir le certificat de paiement
                          </button>
                        )}
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
        /* ── Warm page background ── */
        .infog-root {
          position: relative;
          min-height: 100vh;
          background: linear-gradient(
            180deg,
            #ffffff  0%,
            #fff8f0  40%,
            #fff3e6  60%,
            #fff3e6  80%,
            #fff3e6  100%
          );
          overflow: hidden;
        }

        /* ── Full-page geometric SVG ── */
        .infog-geo-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
        }

        /* ── Fonts ── */
        .serif-headline { font-family: 'EB Garamond', serif; }
        .sans-body      { font-family: 'Manrope', sans-serif; }

        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }

        /* ── Stripe card layout ── */
        .infog-card-grid       { display: grid; gap: 16px; }
        .infog-card-field      { display: flex; flex-direction: column; gap: 6px; }
        .infog-card-full       { grid-column: 1 / -1; }
        .infog-card-subgrid    {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }
        .infog-card-label      { margin-left: 4px; font-size: 0.875rem; font-weight: 600; font-family: 'Manrope', sans-serif; }
        .infog-card-shell      {
          position: relative;
          display: flex;
          min-height: 54px;
          align-items: center;
          padding: 0 16px;
        }
        .infog-card-cvc-shell  { padding-right: 58px; }
        .infog-card-el         { width: 100%; min-width: 0; }
        .infog-card-el-cvc     { padding-right: 4px; }
        .infog-card-cvc-icon   {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
        }
        .infog-card-el .StripeElement        { width: 100%; }
        .infog-card-el .StripeElement iframe { width: 100% !important; min-height: 22px; }

        @keyframes spin { to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 0.8s linear infinite; display: inline-block; }

        @media (max-width: 767px) {
          .infog-card-subgrid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
};

export default InscriptionInfographie;
