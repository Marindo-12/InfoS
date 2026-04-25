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
type LanguageKey = 'francais' | 'anglais' | 'allemand';

interface FormData {
  nom: string;
  prenom: string;
  age: string;
  niveau: string;
  email: string;
  telephone: string;
  language: LanguageKey;
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
  language?: string;
  payment?: string;
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

const NIVEAU_OPTIONS = ['Baccalaureat', 'Licence', 'Master', 'Doctorat / Autre'];
const LANGUAGE_OPTIONS: Array<{ value: LanguageKey; title: string; sub: string }> = [
  { value: 'francais', title: 'Francais', sub: 'Communication & DELF' },
  { value: 'anglais', title: 'Anglais Business', sub: 'TOEFL & Cambridge' },
  { value: 'allemand', title: 'Allemand', sub: 'Niveaux A1 a C1' },
];

const LANGUAGE_LABELS: Record<LanguageKey, string> = {
  francais: 'Francais',
  anglais: 'Anglais Business',
  allemand: 'Allemand',
};

const TRAINING_PRICE = 1500;

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
  `w-full rounded-xl border bg-surface-bright px-4 py-3 text-sm transition-all focus:outline-none focus:ring-2 ${
    err ? 'border-red-400 bg-red-50/30 focus:ring-red-200' : 'border-outline-variant focus:border-primary focus:ring-primary/20'
  }`;

const FieldError: React.FC<{ msg?: string }> = ({ msg }) =>
  msg ? (
    <p className="ml-1 mt-1.5 flex items-center gap-1.5 text-xs text-red-500">
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
            <h4 className="mt-1 font-display text-xl font-bold text-on-surface">Carte bancaire</h4>
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
            <p className="ml-1 mt-1.5 flex items-center gap-1.5 text-xs text-emerald-600">
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
              <p className="mt-1 text-xs text-emerald-600">
                Cliquez sur "Confirmer l'inscription" ci-dessous pour finaliser votre dossier.
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

const InscriptionLangues: React.FC<Props> = ({
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

  const [form, setForm] = useState<FormData>({
    nom: '',
    prenom: '',
    age: '',
    niveau: 'Baccalaureat',
    email: '',
    telephone: '',
    language: 'francais',
    payment: '',
    acceptTerms: false,
    acceptPrivacy: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [cardHasError, setCardHasError] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [onlinePaymentCompleted, setOnlinePaymentCompleted] = useState(false);
  const [onlinePaymentReference, setOnlinePaymentReference] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const clearErr = (field: keyof FormErrors) => setErrors((prev) => ({ ...prev, [field]: undefined }));

  const validateFinalConfirmation = (): FormErrors => {
    const e: FormErrors = {};
    if (!form.nom.trim()) e.nom = 'Le nom est requis.';
    if (!form.prenom.trim()) e.prenom = 'Le prenom est requis.';
    if (!form.age || Number(form.age) < 15 || Number(form.age) > 80) e.age = 'Saisissez un age valide (15 - 80).';
    if (!okEmail(form.email)) e.email = 'Adresse email invalide.';
    if (!okPhone(form.telephone)) e.telephone = 'Numero de telephone invalide.';
    if (!form.language) e.language = 'Selectionnez une langue.';
    if (!form.payment) e.payment = 'Choisissez un mode de paiement.';
    if (form.payment === 'online' && !onlinePaymentCompleted) e.card = 'Effectuez le paiement en ligne avant la confirmation finale.';
    if (!form.acceptTerms) e.acceptTerms = 'Acceptez les conditions generales.';
    if (!form.acceptPrivacy) e.acceptPrivacy = 'Acceptez la politique de confidentialite.';
    return e;
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, [name]: checked }));
      clearErr(name as keyof FormErrors);
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

  const handleOnlinePayment = async () => {
    const preErrors: FormErrors = {};
    if (!form.nom.trim()) preErrors.nom = 'Le nom est requis avant le paiement.';
    if (!form.prenom.trim()) preErrors.prenom = 'Le prenom est requis avant le paiement.';
    if (!okEmail(form.email)) preErrors.email = 'Adresse email invalide.';
    if (!okPhone(form.telephone)) preErrors.telephone = 'Numero de telephone invalide.';
    if (!form.language) preErrors.language = 'Selectionnez une langue avant le paiement.';
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
        name: `${form.prenom} ${form.nom}`,
        email: form.email,
        phone: form.telephone,
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
    setSubmitted(true);
  };

  return (
    <>
      <Head title="Langues" />
      <PublicLayout>
        <main className="flex-grow">
          <section className="relative overflow-hidden pt-16 pb-24">
            <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-8 lg:grid-cols-2">
              <div className="z-10">
                <span className="mb-4 block text-sm font-bold uppercase tracking-[0.2em] text-primary">Formation d'Excellence</span>
                <h1 className="font-display text-6xl leading-tight text-on-surface lg:text-7xl">
                  Inscriptions : <br />
                  <span className="italic text-primary">Pole Langues</span>
                </h1>
                <p className="mb-10 mt-6 max-w-lg text-lg leading-relaxed text-secondary">
                  Maitrisez le Francais, l'Anglais ou l'Allemand avec une pedagogie immersive. Une opportunite unique
                  de certifier vos competences dans un cadre prestigieux.
                </p>
                <div className="mb-12 grid grid-cols-2 gap-8">
                  <div className="flex items-start gap-4">
                    <span className="material-symbols-outlined text-3xl text-primary">schedule</span>
                    <div>
                      <p className="font-bold text-on-surface">Duree</p>
                      <p className="text-sm text-secondary">3-6 mois flexible</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="material-symbols-outlined text-3xl text-primary">payments</span>
                    <div>
                      <p className="font-bold text-on-surface">Prix</p>
                      <p className="text-sm text-secondary">{fmtAmount(TRAINING_PRICE)} / Niveau</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-4 border-l-2 border-primary-container pl-6">
                  {['Native teachers & Expert Pedagogy', 'Certification internationale incluse'].map((text) => (
                    <div key={text} className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-xl text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>
                        verified
                      </span>
                      <span className="font-medium text-on-surface-variant">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="group relative">
                <div className="absolute -inset-4 rotate-3 rounded-xl bg-primary-container/20 transition-transform group-hover:rotate-1"></div>
                <div className="relative h-[600px] w-full overflow-hidden rounded-xl">
                  <img
                    alt="Student studying in a luxury library"
                    className="h-full w-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpb1pZr6F79ywjJsuRb1GMNTp6vIOmXQ-o6lPwVPuhbOEExLYEv5mkNGMjBue6r7kjBAEoI64JwwlBj4xhlqXHYdnpuC2ofFWNZuWvkpx9mte141KaQ3OIVnkFn44bjp-vLpFy-m4pc94bqzo48QRJLe7-OzpYhAeK81v2c0wZ60vFyNk4TpHZDz8pCtT-Wc_LkTo6BoOyXmpe10Q1TsxJ8_K2itPhL_87k9LZJ-JXNVXUNcQZy20qG_fXDMuP7jWhtMZCYBhuW0OH"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="border-y border-outline-variant/30 bg-white py-12">
            <div className="mx-auto max-w-7xl px-8 text-center">
              <h2 className="font-display text-5xl text-on-surface">Dossier d'Inscription</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-secondary">
                Veuillez completer le formulaire ci-dessous pour reserver votre place. Nos conseillers pedagogiques vous
                recontacteront sous 24h pour valider votre dossier.
              </p>
              <div className="mt-6 flex justify-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
                <div className="h-2 w-12 rounded-full bg-primary-container"></div>
                <div className="h-2 w-2 rounded-full bg-primary"></div>
              </div>
            </div>
          </section>

          <section className="relative overflow-hidden bg-surface-container-low py-24">
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
              <div className="bg-pattern absolute top-0 left-0 h-full w-full opacity-50"></div>
              <div className="absolute top-20 right-[10%] h-[400px] w-[400px] rounded-full border border-stone-300 opacity-20"></div>
              <div className="absolute bottom-40 left-[5%] h-[300px] w-[300px] rounded-full border-2 border-[rgba(194,101,42,0.2)] opacity-30"></div>
            </div>

            <div className="relative z-10 mx-auto max-w-4xl px-8">
              <div className="form-shadow rounded-2xl border border-outline-variant/40 bg-white p-10 lg:p-16">
                <form onSubmit={handleSubmit} noValidate className="space-y-12">
                  <section className="space-y-8">
                    <div className="mb-6 flex items-center gap-4">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary font-bold text-on-primary">1</span>
                      <h3 className="font-display text-2xl">Informations Personnelles</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div data-has-error={errors.nom ? 'true' : undefined}>
                        <label className="mb-2 block text-sm font-semibold uppercase tracking-wider text-on-surface-variant">Nom</label>
                        <input type="text" name="nom" value={form.nom} onChange={handleInput} placeholder="Votre nom" className={inputCls(errors.nom)} />
                        <FieldError msg={errors.nom} />
                      </div>
                      <div data-has-error={errors.prenom ? 'true' : undefined}>
                        <label className="mb-2 block text-sm font-semibold uppercase tracking-wider text-on-surface-variant">Prenom</label>
                        <input type="text" name="prenom" value={form.prenom} onChange={handleInput} placeholder="Votre prenom" className={inputCls(errors.prenom)} />
                        <FieldError msg={errors.prenom} />
                      </div>
                      <div data-has-error={errors.age ? 'true' : undefined}>
                        <label className="mb-2 block text-sm font-semibold uppercase tracking-wider text-on-surface-variant">Age</label>
                        <input type="number" name="age" value={form.age} onChange={handleInput} placeholder="25" min={15} max={80} className={inputCls(errors.age)} />
                        <FieldError msg={errors.age} />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-semibold uppercase tracking-wider text-on-surface-variant">Niveau Academique</label>
                        <select name="niveau" value={form.niveau} onChange={handleInput} className={inputCls()}>
                          {NIVEAU_OPTIONS.map((option) => (
                            <option key={option}>{option}</option>
                          ))}
                        </select>
                      </div>
                      <div data-has-error={errors.email ? 'true' : undefined}>
                        <label className="mb-2 block text-sm font-semibold uppercase tracking-wider text-on-surface-variant">Email</label>
                        <input type="email" name="email" value={form.email} onChange={handleInput} placeholder="email@exemple.com" className={inputCls(errors.email)} />
                        <FieldError msg={errors.email} />
                      </div>
                      <div data-has-error={errors.telephone ? 'true' : undefined}>
                        <label className="mb-2 block text-sm font-semibold uppercase tracking-wider text-on-surface-variant">Telephone</label>
                        <input type="tel" name="telephone" value={form.telephone} onChange={handleInput} placeholder="+212 600 000 000" className={inputCls(errors.telephone)} />
                        <FieldError msg={errors.telephone} />
                      </div>
                    </div>
                  </section>

                  <section className="space-y-8 pt-4">
                    <div className="mb-6 flex items-center gap-4">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary font-bold text-on-primary">2</span>
                      <h3 className="font-display text-2xl">Choix de la Formation</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3" data-has-error={errors.language ? 'true' : undefined}>
                      {LANGUAGE_OPTIONS.map(({ value, title, sub }) => {
                        const active = form.language === value;
                        return (
                          <label key={value} className="group cursor-pointer">
                            <input type="radio" name="language" value={value} checked={active} onChange={handleRadio} className="sr-only" />
                            <div
                              className={`flex h-full flex-col justify-center rounded-xl p-6 text-center transition-all ${
                                active ? 'border-2 border-primary bg-primary/5' : 'border-2 border-outline-variant group-hover:border-primary/50'
                              }`}
                            >
                              <p className="font-bold">{title}</p>
                              <p className="mt-1 text-xs text-secondary-fixed-dim">{sub}</p>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                    <FieldError msg={errors.language} />
                    <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-low p-5">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Recapitulatif</p>
                          <p className="mt-1 text-sm text-on-surface-variant">{LANGUAGE_LABELS[form.language]}</p>
                        </div>
                        <div className="sm:text-right">
                          <p className="text-xs uppercase tracking-[0.2em] text-on-surface-variant">Montant</p>
                          <p className="font-display text-3xl font-bold text-on-surface">{fmtAmount(TRAINING_PRICE)}</p>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section className="space-y-8 pt-4">
                    <div className="mb-6 flex items-center gap-4">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary font-bold text-on-primary">3</span>
                      <h3 className="font-display text-2xl">Mode de Paiement</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2" data-has-error={errors.payment ? 'true' : undefined}>
                      {[
                        { value: 'online' as PaymentMode, icon: 'credit_card', label: 'Paiement en ligne', sub: 'Carte bancaire securisee — Stripe' },
                        { value: 'onsite' as PaymentMode, icon: 'storefront', label: 'Paiement presentiel', sub: 'Reglement au centre de formation' },
                      ].map(({ value, icon, label, sub }) => {
                        const active = form.payment === value;
                        return (
                          <label key={value} className="group cursor-pointer">
                            <input type="radio" name="payment" value={value} checked={active} onChange={handleRadio} className="sr-only" />
                            <div
                              className={`flex items-center gap-4 rounded-2xl bg-white p-5 transition-all duration-200 ${
                                active ? 'border-2 border-primary bg-primary/5' : 'border-2 border-outline-variant/50 group-hover:border-primary/40'
                              }`}
                            >
                              <span className="material-symbols-outlined text-2xl transition-colors" style={{ color: active ? 'var(--color-primary)' : '#9ca3af' }}>
                                {icon}
                              </span>
                              <div className="flex-1">
                                <p className="font-semibold text-on-surface">{label}</p>
                                <p className="text-sm text-on-surface-variant">{sub}</p>
                              </div>
                              <span
                                className="material-symbols-outlined text-xl"
                                style={{ color: active ? 'var(--color-primary)' : '#d1d5db', fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}
                              >
                                radio_button_checked
                              </span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                    <FieldError msg={errors.payment} />

                    {form.payment === 'online' &&
                      (stripePromise ? (
                        <Elements stripe={stripePromise} options={stripeOptions}>
                          <StripeCardSection
                            ref={stripeCardRef}
                            totalAmount={TRAINING_PRICE}
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
                      ))}

                    {form.payment === 'onsite' && (
                      <div className="mt-6 rounded-3xl border border-primary/20 bg-white p-6 shadow-sm">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Paiement au centre</p>
                        <h4 className="mt-1 font-display text-xl font-bold text-on-surface">Informations de rendez-vous</h4>
                        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-low p-5">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">Adresse</p>
                            <p className="mt-2 text-sm font-semibold text-on-surface">14 avenue Hassan II, 1er etage, Ville Nouvelle, Meknes, Maroc</p>
                            <a
                              href="https://www.google.com/maps/search/?api=1&query=33.8989909,-5.551918"
                              target="_blank"
                              rel="noreferrer"
                              className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
                            >
                              <span className="material-symbols-outlined text-base leading-none">north_east</span>
                              Google Maps
                            </a>
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
                  </section>

                  <div className="space-y-6 border-t border-outline-variant/30 pt-8">
                    <div className="space-y-4">
                      <div data-has-error={errors.acceptTerms ? 'true' : undefined}>
                        <label className="group flex cursor-pointer items-start gap-3">
                          <input
                            type="checkbox"
                            name="acceptTerms"
                            checked={form.acceptTerms}
                            onChange={handleInput}
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
                            {' '}et j'autorise le centre a traiter mon dossier et associer mon paiement a mon inscription.
                          </span>
                        </label>
                        <FieldError msg={errors.acceptTerms} />
                      </div>

                      <div data-has-error={errors.acceptPrivacy ? 'true' : undefined}>
                        <label className="group flex cursor-pointer items-start gap-3">
                          <input
                            type="checkbox"
                            name="acceptPrivacy"
                            checked={form.acceptPrivacy}
                            onChange={handleInput}
                            className={`mt-0.5 h-4 w-4 rounded border text-primary transition-all focus:ring-primary ${
                              errors.acceptPrivacy ? 'border-red-400' : 'border-outline-variant'
                            }`}
                          />
                          <span className="text-sm leading-relaxed text-on-surface-variant transition-colors group-hover:text-on-surface">
                            Je confirme que les informations fournies sont exactes et j'accepte le traitement de mes donnees personnelles.
                          </span>
                        </label>
                        <FieldError msg={errors.acceptPrivacy} />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting || (form.payment === 'online' && !onlinePaymentCompleted)}
                      className="glow-hover flex w-full items-center justify-center gap-2.5 rounded-2xl bg-primary py-5 text-base font-bold tracking-wide text-on-primary shadow-lg transition-all duration-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {submitting ? (
                        <>
                          <span className="material-symbols-outlined animate-spin text-xl leading-none">progress_activity</span>
                          Traitement en cours...
                        </>
                      ) : (
                        <>
                          {form.payment === 'online' ? "Confirmer l'inscription" : 'Valider ma place'}
                          <span className="material-symbols-outlined text-xl leading-none">arrow_forward</span>
                        </>
                      )}
                    </button>

                    {form.payment === 'online' && !onlinePaymentCompleted && (
                      <p className="text-center text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                        Le paiement doit etre effectue avant la confirmation finale.
                      </p>
                    )}

                    {submitted && (
                      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center">
                        <p className="text-sm font-semibold text-emerald-800">
                          Inscription en langues enregistree pour {LANGUAGE_LABELS[form.language]}.
                        </p>
                        <p className="mt-1 text-xs text-emerald-700">
                          Reference dossier : <span className="font-mono font-semibold">{secureRef('LAN')}</span>
                        </p>
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </section>
        </main>

        <style>{`
          .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          }
          .form-shadow {
            box-shadow: 0 2px 24px rgba(58, 48, 42, 0.08);
          }
          .glow-hover:hover {
            box-shadow: 0 0 20px rgba(194, 101, 42, 0.3);
          }
          .bg-pattern {
            background-image: radial-gradient(circle at 2px 2px, rgba(194, 101, 42, 0.05) 1px, transparent 0);
            background-size: 40px 40px;
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
      </PublicLayout>
    </>
  );
};

export default InscriptionLangues;
