import React, { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Head } from '@inertiajs/react';
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

type PaymentMode = '' | 'online' | 'onsite';
type ConcoursKey = 'medecine' | 'encg' | 'ensa' | 'pack';

interface FormData {
  nom: string;
  prenom: string;
  age: string;
  niveau: string;
  email: string;
  telephone: string;
  concours: ConcoursKey;
  paymentMethod: PaymentMode;
  acceptTerms: boolean;
  acceptPrivacy: boolean;
}

interface FormErrors {
  nom?: string;
  prenom?: string;
  age?: string;
  email?: string;
  telephone?: string;
  concours?: string;
  paymentMethod?: string;
  card?: string;
  acceptTerms?: string;
  acceptPrivacy?: string;
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

const CONCOURS_OPTIONS: Array<{ value: ConcoursKey; label: string; price: number }> = [
  { value: 'medecine', label: 'Preparation Medecine (FMD/FMP)', price: 1000 },
  { value: 'encg', label: 'Preparation ENCG (Tafem)', price: 600 },
  { value: 'ensa', label: 'Preparation ENSA/ENSAM', price: 500 },
  { value: 'pack', label: 'Pack Excellence (Multi-concours)', price: 1500 },
];

const fmtAmount = (n: number) => `${n.toLocaleString('fr-MA')} DH`;
const okEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const okPhone = (v: string) => /^[+\d\s\-()]{8,}$/.test(v.trim());
const secureRef = (prefix: string) => {
  const bytes = new Uint32Array(2);
  crypto.getRandomValues(bytes);
  return `${prefix}-${Date.now().toString(36).toUpperCase()}-${bytes[0].toString(36).slice(0, 4).toUpperCase()}${bytes[1]
    .toString(36)
    .slice(0, 4)
    .toUpperCase()}`;
};

const inputCls = (err?: string) =>
  `w-full rounded-lg border bg-surface-bright/80 px-4 py-3 transition-all focus:outline-none focus:ring-2 ${
    err ? 'border-red-400 bg-red-50/30 focus:ring-red-200' : 'border-outline-variant/60 focus:border-primary focus:ring-primary/20'
  }`;

const FieldError: React.FC<{ msg?: string }> = ({ msg }) =>
  msg ? (
    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500">
      <span className="material-symbols-outlined text-sm leading-none">error</span>
      {msg}
    </p>
  ) : null;

const LogoVisa: React.FC<{ active: boolean }> = ({ active }) => (
  <svg viewBox="0 0 50 32" width="44" height="28" style={{ opacity: active ? 1 : 0.3, transition: 'opacity .25s' }} aria-label="Visa">
    <rect width="50" height="32" rx="5" fill="#0055A5" stroke="#0055A5" strokeWidth="1" />
    <text x="5" y="22" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="13" fill="#FFFFFF" letterSpacing="-0.5">
      VISA
    </text>
  </svg>
);

const LogoMastercard: React.FC<{ active: boolean }> = ({ active }) => (
  <svg viewBox="0 0 50 32" width="44" height="28" style={{ opacity: active ? 1 : 0.3, transition: 'opacity .25s' }} aria-label="Mastercard">
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
    <text x="26.5" y="19.5" fontSize="4" fill="#374151" fontFamily="monospace" fontWeight="bold">
      123
    </text>
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

    const syncCardState = (next: { number?: boolean; expiry?: boolean; cvc?: boolean; hasOwnError: boolean }) => {
      const n = next.number ?? numberComplete;
      const e = next.expiry ?? expiryComplete;
      const c = next.cvc ?? cvcComplete;
      onCardChange(next.hasOwnError || !n || !e || !c);
    };

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

    const fieldCls = (hasError?: boolean) =>
      `rounded-xl border bg-white transition-all focus-within:ring-2 ${
        hasError
          ? 'border-red-400 bg-red-50/30 focus-within:ring-red-200'
          : 'border-outline-variant focus-within:border-primary focus-within:ring-primary/20'
      }`;

    const DetectedLogo = brand !== 'unknown' ? BRAND_LOGO[brand] : null;

    return (
      <div className="mt-6 rounded-3xl border border-primary/20 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Paiement securise</p>
            <h4 className="mt-1 font-headline text-2xl font-bold text-on-surface">Carte bancaire</h4>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-outline-variant/40 bg-surface-container px-4 py-2">
            <span className="material-symbols-outlined text-base text-emerald-600">lock</span>
            <span className="text-sm font-bold text-on-surface">{fmtAmount(totalAmount)}</span>
          </div>
        </div>

        <div className="payment-card-grid">
          <div className="payment-card-field payment-card-field-full">
            <label className="payment-card-label">Numero de carte</label>
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
                  ALL_BRANDS.map((item) => {
                    const Logo = BRAND_LOGO[item];
                    return <Logo key={item} active={true} />;
                  })
                )}
              </div>
            </div>
          </div>

          <div className="payment-card-subgrid payment-card-field-full">
            <div className="payment-card-field">
              <label className="payment-card-label">Date d'expiration</label>
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

            <div className="payment-card-field">
              <label className="payment-card-label">Code de securite</label>
              <div className={`${fieldCls()} payment-card-input-shell payment-card-cvc-shell`}>
                <div className="payment-card-element payment-card-element-cvc">
                  <CardCvcElement
                    options={elementOptions}
                    onChange={(ev) => {
                      setCvcComplete(ev.complete);
                      syncCardState({ cvc: ev.complete, hasOwnError: !!ev.error });
                    }}
                  />
                </div>
                <div className="payment-card-cvc-icon" aria-hidden="true">
                  <CvcIcon />
                </div>
              </div>
            </div>
          </div>

          {cardError && <FieldError msg={cardError} />}
          {allComplete && !cardError && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-emerald-600">
              <span className="material-symbols-outlined text-sm leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
              Informations de carte valides
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onPayNow}
          disabled={processing || paymentDone || !stripe || !allComplete}
          className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-2xl py-4 text-sm font-bold tracking-wide text-white shadow-lg transition-all duration-300 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
          style={{
            background: paymentDone ? 'linear-gradient(135deg,#059669,#047857)' : 'linear-gradient(135deg,#059669,#065f46)',
            boxShadow: paymentDone ? '0 8px 24px -8px #05966970' : '0 8px 24px -8px #05966960',
          }}
        >
          {processing ? (
            <>
              <span className="material-symbols-outlined animate-spin text-xl leading-none">progress_activity</span>
              Paiement en cours...
            </>
          ) : paymentDone ? (
            <>
              <span className="material-symbols-outlined text-xl leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>
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

        {paymentDone && paymentReference && (
          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <span className="material-symbols-outlined mt-0.5 text-base text-emerald-600" style={{ fontVariationSettings: "'FILL' 1" }}>
              check_circle
            </span>
            <div>
              <p className="text-sm font-semibold text-emerald-800">Paiement effectue avec succes</p>
              <p className="mt-0.5 text-xs text-emerald-700">
                Reference : <span className="font-mono font-semibold">{paymentReference}</span>
              </p>
            </div>
          </div>
        )}

        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-3">
          <span className="material-symbols-outlined text-base text-emerald-600">security</span>
          <p className="text-xs leading-relaxed text-emerald-800">
            Vos donnees sont chiffrees et traitees directement par <strong>Stripe</strong> (certifie PCI-DSS niveau 1).
            Aucune information bancaire ne transite par nos serveurs.
          </p>
        </div>
      </div>
    );
  },
);

StripeCardSection.displayName = 'StripeCardSection';

interface Props {
  stripePublishableKey?: string;
}

const InscriptionConcours: React.FC<Props> = ({
  stripePublishableKey = (import.meta as any).env?.VITE_STRIPE_PK ?? '',
}) => {
  const stripePromise = useMemo(() => (stripePublishableKey ? loadStripe(stripePublishableKey) : null), [stripePublishableKey]);
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
  const [formData, setFormData] = useState<FormData>({
    nom: '',
    prenom: '',
    age: '',
    niveau: '2eme Annee Baccalaureat',
    email: '',
    telephone: '',
    concours: 'medecine',
    paymentMethod: '',
    acceptTerms: false,
    acceptPrivacy: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [cardHasError, setCardHasError] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [onlinePaymentCompleted, setOnlinePaymentCompleted] = useState(false);
  const [onlinePaymentReference, setOnlinePaymentReference] = useState('');
  const [submittedReference, setSubmittedReference] = useState('');

  const selectedConcours = useMemo(
    () => CONCOURS_OPTIONS.find((item) => item.value === formData.concours) ?? CONCOURS_OPTIONS[0],
    [formData.concours],
  );
  const totalAmount = selectedConcours.price;

  const clearErr = (field: keyof FormErrors) => setErrors((prev) => ({ ...prev, [field]: undefined }));

  const validateFinalConfirmation = (): FormErrors => {
    const e: FormErrors = {};
    if (!formData.nom.trim()) e.nom = 'Le nom est requis.';
    if (!formData.prenom.trim()) e.prenom = 'Le prenom est requis.';
    if (!formData.age || Number(formData.age) < 15 || Number(formData.age) > 30) e.age = 'Saisissez un age valide.';
    if (!okEmail(formData.email)) e.email = 'Adresse email invalide.';
    if (!okPhone(formData.telephone)) e.telephone = 'Numero de telephone invalide.';
    if (!formData.concours) e.concours = 'Selectionnez un concours.';
    if (!formData.paymentMethod) e.paymentMethod = 'Choisissez un mode de reglement.';
    if (formData.paymentMethod === 'online' && !onlinePaymentCompleted) e.card = 'Effectuez le paiement en ligne avant la confirmation finale.';
    if (!formData.acceptTerms) e.acceptTerms = 'Acceptez les conditions generales.';
    if (!formData.acceptPrivacy) e.acceptPrivacy = 'Acceptez la politique de confidentialite.';
    return e;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: target.checked }));
      clearErr(name as keyof FormErrors);
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
    clearErr(name as keyof FormErrors);
    if (name === 'paymentMethod' || name === 'concours') {
      setOnlinePaymentCompleted(false);
      setOnlinePaymentReference('');
      clearErr('card');
    }
  };

  const handleOnlinePayment = async () => {
    const preErrors: FormErrors = {};
    if (!formData.nom.trim()) preErrors.nom = 'Le nom est requis avant le paiement.';
    if (!formData.prenom.trim()) preErrors.prenom = 'Le prenom est requis avant le paiement.';
    if (!okEmail(formData.email)) preErrors.email = 'Adresse email invalide.';
    if (!okPhone(formData.telephone)) preErrors.telephone = 'Numero de telephone invalide.';
    if (!formData.concours) preErrors.concours = 'Selectionnez un concours avant le paiement.';
    if (cardHasError) preErrors.card = 'Completez correctement les informations de carte.';

    if (Object.keys(preErrors).length) {
      setErrors((prev) => ({ ...prev, ...preErrors }));
      document.querySelector('[data-has-error="true"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setSubmitting(true);
    try {
      if (!stripeCardRef.current) {
        setErrors((prev) => ({ ...prev, card: 'Le formulaire de carte est introuvable.' }));
        return;
      }

      const result = await stripeCardRef.current.createPaymentMethod({
        name: `${formData.prenom} ${formData.nom}`,
        email: formData.email,
        phone: formData.telephone,
      });

      if ('error' in result) {
        setErrors((prev) => ({ ...prev, card: result.error }));
        return;
      }

      console.log('[Stripe] PaymentMethod created:', result.paymentMethodId);
      setOnlinePaymentCompleted(true);
      setOnlinePaymentReference(secureRef('PAY'));
      clearErr('card');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalErrors = validateFinalConfirmation();
    if (Object.keys(finalErrors).length) {
      setErrors(finalErrors);
      document.querySelector('[data-has-error="true"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setSubmittedReference(secureRef('CON'));
  };

  return (
    <>
      <Head title="Inscription aux concours" />
      <PublicLayout>
        <main className="mx-auto max-w-7xl px-6 py-12 md:py-20">
          <section className="mb-24 grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            <div>
              <span className="mb-6 inline-block rounded-full bg-tertiary-fixed px-3 py-1 text-xs font-bold uppercase tracking-widest text-on-tertiary-fixed-variant">
                Inscriptions Ouvertes
              </span>
              <h1 className="serif-tight mb-8 font-headline text-5xl leading-[1.1] text-on-surface md:text-7xl">
                Inscriptions : <br />
                <span className="italic text-primary">Concours d'Excellence</span>
              </h1>
              <p className="mb-10 max-w-xl text-lg font-light leading-relaxed text-on-secondary-container md:text-xl">
                Preparez votre avenir avec l'elite. Nos programmes specialises pour Medecine, ENCG et ENSA sont
                concus pour transformer votre ambition en reussite concrete.
              </p>
              <div className="mb-12 flex items-center gap-6">
                <div className="flex flex-col">
                  <span className="font-headline text-4xl font-bold text-primary">94%</span>
                  <span className="font-label text-sm uppercase tracking-tighter text-outline">Taux de Reussite</span>
                </div>
                <div className="h-12 w-[1px] bg-outline-variant"></div>
                <div className="flex flex-col">
                  <span className="font-headline text-4xl font-bold tracking-tight text-on-surface">{new Date().getFullYear()}</span>
                  <span className="font-label text-sm uppercase tracking-tighter text-outline">Promotion Actuelle</span>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {CONCOURS_OPTIONS.slice(0, 3).map((item) => (
                  <div key={item.value} className="rounded-xl border border-outline-variant/30 bg-surface-container-low p-6">
                    <p className="mb-1 text-sm font-label text-outline">{item.label.split(' ')[1] ?? item.label}</p>
                    <p className="font-headline text-2xl font-semibold">{fmtAmount(item.price)}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="group relative">
              <div className="absolute -inset-4 rounded-2xl bg-primary/5 blur-3xl transition-all group-hover:bg-primary/10"></div>
              <img
                alt="Group of diverse focused students studying together"
                className="relative aspect-[4/5] w-full rounded-2xl border border-white/20 object-cover shadow-2xl"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBB3ECRI4li5jd1PtEYTRLeI3RmLizSfZEXYfkS6vVODxHskqKtBKrcXFCfLgIZpAXwuxwakur-i_dg1vhYsaKIla256OxVlS8t8qxWRK02iH3OGSrefrvHRUMzCpdIcBUYBAdngraJFtEsjtBHJnZ4gF5S7nBBuHxarOJyKq4gWt9rWnJq5JhH3ia1Uv-zpdWt1hy-Gd7YJDGVh7s-Rt0S49g9CcDbodJxd8y8nDGnjarm2zcZcFW4ZOH-N1epejrQm-F-uzlEMi16"
              />
            </div>
          </section>

          <div className="mb-16 text-center">
            <h2 className="mb-4 font-headline text-4xl text-on-surface md:text-5xl">Formulaire de Candidature</h2>
            <div className="mb-6 flex items-center justify-center gap-4">
              <div className="h-[1px] w-12 bg-primary/40"></div>
              <p className="font-label text-sm uppercase tracking-[0.2em] text-on-secondary-container">Etape decisive vers votre reussite</p>
              <div className="h-[1px] w-12 bg-primary/40"></div>
            </div>
            <p className="mx-auto max-w-2xl text-lg font-light text-on-surface-variant">
              Veuillez remplir les informations ci-dessous avec precision. Notre equipe examinera votre profil pour garantir une admission adaptee.
            </p>
          </div>

          <div className="relative flex flex-col gap-12 lg:flex-row">
            <section className="relative overflow-hidden rounded-3xl border border-outline-variant/20 bg-surface-container-lowest p-8 shadow-sm md:p-12 lg:w-2/3">
              <div className="geometric-bg pointer-events-none absolute inset-0 opacity-40"></div>
              <form onSubmit={handleSubmit} noValidate className="relative z-10 space-y-10">
                <div>
                  <h2 className="mb-8 flex items-center gap-3 font-headline text-3xl">
                    <span className="h-[1px] w-8 bg-primary"></span>
                    Informations Personnelles
                  </h2>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div data-has-error={errors.nom ? 'true' : undefined}>
                      <label className="text-sm font-label font-semibold uppercase tracking-wider text-on-surface-variant">Nom</label>
                      <input type="text" name="nom" value={formData.nom} onChange={handleChange} className={inputCls(errors.nom)} placeholder="Entrez votre nom" />
                      <FieldError msg={errors.nom} />
                    </div>
                    <div data-has-error={errors.prenom ? 'true' : undefined}>
                      <label className="text-sm font-label font-semibold uppercase tracking-wider text-on-surface-variant">Prenom</label>
                      <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} className={inputCls(errors.prenom)} placeholder="Entrez votre prenom" />
                      <FieldError msg={errors.prenom} />
                    </div>
                    <div data-has-error={errors.age ? 'true' : undefined}>
                      <label className="text-sm font-label font-semibold uppercase tracking-wider text-on-surface-variant">Age</label>
                      <input type="number" name="age" value={formData.age} onChange={handleChange} className={inputCls(errors.age)} placeholder="Ex: 18" />
                      <FieldError msg={errors.age} />
                    </div>
                    <div>
                      <label className="text-sm font-label font-semibold uppercase tracking-wider text-on-surface-variant">Niveau Academique</label>
                      <select name="niveau" value={formData.niveau} onChange={handleChange} className={inputCls()}>
                        <option>2eme Annee Baccalaureat</option>
                        <option>Baccalaureat obtenu</option>
                        <option>Bac +1 / Classes Prepas</option>
                      </select>
                    </div>
                    <div data-has-error={errors.email ? 'true' : undefined}>
                      <label className="text-sm font-label font-semibold uppercase tracking-wider text-on-surface-variant">Email</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputCls(errors.email)} placeholder="votre@email.com" />
                      <FieldError msg={errors.email} />
                    </div>
                    <div data-has-error={errors.telephone ? 'true' : undefined}>
                      <label className="text-sm font-label font-semibold uppercase tracking-wider text-on-surface-variant">Telephone</label>
                      <input type="tel" name="telephone" value={formData.telephone} onChange={handleChange} className={inputCls(errors.telephone)} placeholder="+212 6..." />
                      <FieldError msg={errors.telephone} />
                    </div>
                  </div>
                </div>

                <div data-has-error={errors.concours ? 'true' : undefined}>
                  <h2 className="mb-8 flex items-center gap-3 font-headline text-3xl">
                    <span className="h-[1px] w-8 bg-primary"></span>
                    Concours Vise
                  </h2>
                  <label className="text-sm font-label font-semibold uppercase tracking-wider text-on-surface-variant">Selectionnez votre parcours</label>
                  <select
                    name="concours"
                    value={formData.concours}
                    onChange={handleChange}
                    className={`${inputCls(errors.concours)} mt-2 text-lg font-headline`}
                  >
                    {CONCOURS_OPTIONS.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                  <FieldError msg={errors.concours} />
                </div>

                <div>
                  <h2 className="mb-8 flex items-center gap-3 font-headline text-3xl">
                    <span className="h-[1px] w-8 bg-primary"></span>
                    Mode de Reglement
                  </h2>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2" data-has-error={errors.paymentMethod ? 'true' : undefined}>
                    <label
                      className={`relative flex cursor-pointer items-center rounded-xl border-2 p-6 transition-all bg-surface-bright/50 backdrop-blur-sm ${
                        formData.paymentMethod === 'online' ? 'border-primary bg-primary/5' : 'border-outline-variant/40 hover:border-primary/40'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="online"
                        checked={formData.paymentMethod === 'online'}
                        onChange={handleChange}
                        className="hidden peer"
                      />
                      <div className="flex items-center gap-4">
                        <span className="material-symbols-outlined text-3xl text-primary">payments</span>
                        <div>
                          <p className="font-bold">Paiement en ligne</p>
                          <p className="text-xs text-outline">Visa, Mastercard</p>
                        </div>
                      </div>
                    </label>
                    <label
                      className={`relative flex cursor-pointer items-center rounded-xl border-2 p-6 transition-all bg-surface-bright/50 backdrop-blur-sm ${
                        formData.paymentMethod === 'onsite' ? 'border-primary bg-primary/5' : 'border-outline-variant/40 hover:border-primary/40'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="onsite"
                        checked={formData.paymentMethod === 'onsite'}
                        onChange={handleChange}
                        className="hidden peer"
                      />
                      <div className="flex items-center gap-4">
                        <span className="material-symbols-outlined text-3xl text-primary">meeting_room</span>
                        <div>
                          <p className="font-bold">Rendez-vous Presentiel</p>
                          <p className="text-xs text-outline">Au campus de l'academie</p>
                        </div>
                      </div>
                    </label>
                  </div>
                  <FieldError msg={errors.paymentMethod} />

                  {formData.paymentMethod === 'online' &&
                    (stripePromise ? (
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
                        Paiement en ligne indisponible - cle Stripe manquante.
                      </div>
                    ))}

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
                            <p>Lundi - Vendredi : 08h00 - 18h00</p>
                            <p>Samedi : 09h00 - 13h00</p>
                            <p className="text-on-surface-variant">Dimanche : ferme</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4 pt-6">
                  <div data-has-error={errors.acceptTerms ? 'true' : undefined}>
                    <label className="group flex cursor-pointer items-start gap-3">
                      <input
                        type="checkbox"
                        name="acceptTerms"
                        checked={formData.acceptTerms}
                        onChange={handleChange}
                        className={`mt-0.5 h-4 w-4 rounded border text-primary transition-all focus:ring-primary ${
                          errors.acceptTerms ? 'border-red-400' : 'border-outline-variant'
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
                        {' '}et j'autorise le centre a traiter mon dossier, verifier les elements administratifs et associer mon paiement a mon inscription.
                      </span>
                    </label>
                    <FieldError msg={errors.acceptTerms} />
                  </div>
                  <div data-has-error={errors.acceptPrivacy ? 'true' : undefined}>
                    <label className="group flex cursor-pointer items-start gap-3">
                      <input
                        type="checkbox"
                        name="acceptPrivacy"
                        checked={formData.acceptPrivacy}
                        onChange={handleChange}
                        className={`mt-0.5 h-4 w-4 rounded border text-primary transition-all focus:ring-primary ${
                          errors.acceptPrivacy ? 'border-red-400' : 'border-outline-variant'
                        }`}
                      />
                      <span className="text-sm leading-relaxed text-on-surface-variant transition-colors group-hover:text-on-surface">
                        Je confirme que les informations fournies sont exactes et j'accepte le traitement de mes donnees personnelles pour la gestion administrative, pedagogique et financiere de mon inscription.
                      </span>
                    </label>
                    <FieldError msg={errors.acceptPrivacy} />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting || (formData.paymentMethod === 'online' && !onlinePaymentCompleted)}
                  className="flex w-full items-center justify-center gap-4 rounded-xl bg-primary py-5 text-2xl font-bold tracking-wide text-on-primary shadow-lg transition-all hover:bg-orange-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <span className="material-symbols-outlined animate-spin">progress_activity</span>
                      Traitement en cours...
                    </>
                  ) : (
                    <>
                      {formData.paymentMethod === 'online' ? "Confirmer l'inscription" : "S'inscrire au Concours"}
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </>
                  )}
                </button>

                {formData.paymentMethod === 'online' && !onlinePaymentCompleted && (
                  <p className="text-center text-xs text-on-surface-variant">
                    Le paiement doit etre effectue dans le bloc securise ci-dessus avant la confirmation finale.
                  </p>
                )}

                {submittedReference && (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center">
                    <p className="text-sm font-semibold text-emerald-800">
                      Inscription enregistree pour {selectedConcours.label}.
                    </p>
                    <p className="mt-1 text-xs text-emerald-700">
                      Reference dossier : <span className="font-mono font-semibold">{submittedReference}</span>
                    </p>
                  </div>
                )}
              </form>
            </section>

            <aside className="space-y-8 lg:w-1/3">
              <div className="rounded-3xl border border-outline-variant/20 bg-surface-container p-8">
                <h3 className="mb-6 font-headline text-2xl">Pourquoi nous choisir ?</h3>
                <ul className="space-y-6">
                  {[
                    ['verified_user', 'Corps Professeur', 'Docteurs et ingenieurs issus des meilleures ecoles nationales.'],
                    ['menu_book', 'Supports Exclusifs', 'Polycopies mis a jour avec les annales des 10 dernieres annees.'],
                    ['timer', 'Simulations', 'Concours blancs hebdomadaires dans des conditions reelles.'],
                  ].map(([icon, title, text]) => (
                    <li key={title} className="flex gap-4">
                      <span className="material-symbols-outlined shrink-0 text-primary">{icon}</span>
                      <div>
                        <p className="font-label text-sm font-bold uppercase">{title}</p>
                        <p className="text-sm text-on-surface-variant">{text}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </main>
      </PublicLayout>
      <style>{`
        .geometric-bg {
          background-image:
            radial-gradient(circle at 10% 20%, rgba(194, 101, 42, 0.05) 0%, transparent 8%),
            radial-gradient(circle at 90% 80%, rgba(58, 48, 42, 0.03) 0%, transparent 10%),
            linear-gradient(45deg, transparent 48%, rgba(194, 101, 42, 0.05) 49%, rgba(194, 101, 42, 0.05) 51%, transparent 52%),
            linear-gradient(-45deg, transparent 48%, rgba(58, 48, 42, 0.03) 49%, rgba(58, 48, 42, 0.03) 51%, transparent 52%);
          background-size: 100% 100%, 100% 100%, 400px 400px, 600px 600px;
        }
        .serif-tight {
          letter-spacing: -0.02em;
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
        @keyframes spin { to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 0.8s linear infinite; display: inline-block; }
        @media (max-width: 767px) {
          .payment-card-subgrid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
};

export default InscriptionConcours;
