import React, {
    forwardRef,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
    useEffect,
} from 'react'
import { Head, router } from '@inertiajs/react'
import { loadStripe } from '@stripe/stripe-js'
import {
    CardCvcElement,
    CardExpiryElement,
    CardNumberElement,
    Elements,
    useElements,
    useStripe,
} from '@stripe/react-stripe-js'
import PublicLayout from '@/Layouts/PublicLayout'
import PaymentCertificate, { type PaymentCertificateData } from '@/Components/PaymentCertificate'
import { createStripePaymentIntent } from '@/lib/stripePayments'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ─── Types ────────────────────────────────────────────────────────────────────
type PaymentMode = '' | 'online' | 'onsite'
type LanguageKey = 'francais' | 'anglais' | 'allemand'

interface FormData {
    nom: string
    prenom: string
    age: string
    email: string
    telephone: string
    language: LanguageKey
    payment: PaymentMode
    acceptTerms: boolean
    acceptPrivacy: boolean
}

interface FormErrors {
    nom?: string
    prenom?: string
    age?: string
    email?: string
    telephone?: string
    language?: string
    payment?: string
    card?: string
    acceptTerms?: string
    acceptPrivacy?: string
}

interface StripeCardHandle {
    createPaymentMethod: (
        billingDetails: { name: string; email: string; phone: string }
    ) => Promise<{ paymentMethodId: string } | { error: string }>
}

interface StripeCardSectionProps {
    totalAmount: number
    cardError?: string
    processing: boolean
    paymentDone: boolean
    paymentReference?: string
    onCardChange: (hasError: boolean) => void
    onPayNow: () => void
}

// ─── Constants ────────────────────────────────────────────────────────────────
const LANGUAGE_OPTIONS = [
    { value: 'francais', title: 'Français', sub: '30H / Communication & DELF', flag: '🇫🇷', price: '600 DH' },
    { value: 'anglais',  title: 'Anglais Business', sub: '30H / TOEFL & Cambridge', flag: '🇬🇧', price: '600 DH' },
    { value: 'espagnol', title: 'Espagnol', sub: 'Niveaux A1 à C1', flag: '🇪🇸', price: '600 DH' },
]

const LANGUAGE_LABELS: Record<string, string> = {
    francais: 'Français (Communication & DELF)',
    anglais:  'Anglais Business (TOEFL & Cambridge)',
    espagnol: 'Espagnol (Conversation & grammaire)',
    allemand: 'Allemand (Niveaux A1 à C1)',
}

const FLAG_URLS: Record<string, string> = {
    francais: 'https://flagcdn.com/w160/fr.png',
    allemand: 'https://flagcdn.com/w160/de.png',
    anglais:  'https://flagcdn.com/w160/gb.png',
    espagnol: 'https://flagcdn.com/w160/es.png',
}

const TRAINING_PRICE = 600
const fmtAmount = (amount: number) => `${amount} DH`

const okEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
const okPhone = (v: string) => /^[+\d\s\-()]{8,}$/.test(v.trim())
const secureRef = (prefix: string) => {
    const bytes = new Uint32Array(2)
    crypto.getRandomValues(bytes)
    return `${prefix}-${Date.now().toString(36).toUpperCase()}-${bytes[0].toString(36).slice(0, 4).toUpperCase()}${bytes[1].toString(36).slice(0, 4).toUpperCase()}`
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const inputCls = (err?: string) =>
    `w-full rounded-xl border bg-white px-4 py-3.5 text-sm transition-all focus:outline-none focus:ring-2 ${
        err
            ? 'border-red-400 bg-red-50/30 focus:ring-red-200'
            : 'border-outline-variant focus:border-primary focus:ring-primary/20'
    }`

const FieldError: React.FC<{ msg?: string }> = ({ msg }) =>
    msg ? (
        <p className="ml-1 mt-1.5 flex items-center gap-1.5 text-xs text-red-500">
            <span className="material-symbols-outlined text-sm leading-none">error</span>
            {msg}
        </p>
    ) : null

// ─── SVG helpers ──────────────────────────────────────────────────────────────
const LogoVisa: React.FC<{ active: boolean }> = ({ active }) => (
    <svg viewBox="0 0 50 32" width="44" height="28" style={{ opacity: active ? 1 : 0.3, transition: 'opacity .25s' }} aria-label="Visa">
        <rect width="50" height="32" rx="5" fill="#0055A5" />
        <text x="5" y="22" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="13" fill="#FFF" letterSpacing="-0.5">VISA</text>
    </svg>
)
const LogoMastercard: React.FC<{ active: boolean }> = ({ active }) => (
    <svg viewBox="0 0 50 32" width="44" height="28" style={{ opacity: active ? 1 : 0.3, transition: 'opacity .25s' }} aria-label="Mastercard">
        <rect width="50" height="32" rx="5" fill="#fff" stroke="#e5e7eb" />
        <circle cx="19" cy="16" r="9" fill="#EB001B" />
        <circle cx="31" cy="16" r="9" fill="#F79E1B" />
        <path d="M25 9.3a9 9 0 0 1 0 13.4A9 9 0 0 1 25 9.3z" fill="#FF5F00" />
    </svg>
)
const BRAND_LOGO: Record<string, React.FC<{ active: boolean }>> = { visa: LogoVisa, mastercard: LogoMastercard }
const ALL_BRANDS = ['visa', 'mastercard'] as const
const CvcIcon: React.FC = () => (
    <svg viewBox="0 0 38 24" width="36" height="22" fill="none" aria-hidden="true">
        <rect width="38" height="24" rx="4" fill="#e5e7eb" />
        <rect x="0" y="7" width="38" height="6" fill="#9ca3af" />
        <rect x="6" y="16" width="16" height="4" rx="1" fill="#d1d5db" />
        <rect x="25" y="15.5" width="8" height="5" rx="1.5" fill="#fff" stroke="#d1d5db" strokeWidth="0.5" />
        <text x="26.5" y="19.5" fontSize="4" fill="#374151" fontFamily="monospace" fontWeight="bold">123</text>
    </svg>
)


// ─── Book Open Image ──────────────────────────────────────────────────────────
// The image is hidden behind two "cover panels" (left & right halves).
// On mount they fold open like a book: left panel rotates to -180° (hinged left),
// right panel rotates to +180° (hinged right), revealing the photo underneath.
// A spine line and paper-texture overlay sell the depth.

interface BookOpenImageProps {
    src: string
    alt: string
    delay?: number   // seconds before the book starts opening
}

const BOOK_IMG_SRC = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpb1pZr6F79ywjJsuRb1GMNTp6vIOmXQ-o6lPwVPuhbOEExLYEv5mkNGMjBue6r7kjBAEoI64JwwlBj4xhlqXHYdnpuC2ofFWNZuWvkpx9mte141KaQ3OIVnkFn44bjp-vLpFy-m4pc94bqzo48QRJLe7-OzpYhAeK81v2c0wZ60vFyNk4TpHZDz8pCtT-Wc_LkTo6BoOyXmpe10Q1TsxJ8_K2itPhL_87k9LZJ-JXNVXUNcQZy20qG_fXDMuP7jWhtMZCYBhuW0OH'

const BookOpenImage: React.FC<BookOpenImageProps> = ({ src, alt, delay = 0.5 }) => {
    const bookRef    = useRef<HTMLDivElement>(null)
    const leftRef    = useRef<HTMLDivElement>(null)
    const rightRef   = useRef<HTMLDivElement>(null)
    const spineRef        = useRef<HTMLDivElement>(null)
    const glassOverlayRef = useRef<HTMLDivElement>(null)
    const badgeRef        = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const book  = bookRef.current
        const left  = leftRef.current
        const right = rightRef.current
        const spine = spineRef.current
        const badge = badgeRef.current
        // glassOverlayRef used inline below
        if (!book || !left || !right || !spine) return

        // Initial state: panels closed flat over the image
        gsap.set(left,  { rotationY: 0,   transformOrigin: 'left center',  transformPerspective: 1200 })
        gsap.set(right, { rotationY: 0,   transformOrigin: 'right center', transformPerspective: 1200 })
        gsap.set(spine, { opacity: 1, scaleX: 1 })
        gsap.set(book,  { opacity: 1 })
        if (badge) gsap.set(badge, { opacity: 0, y: 16 })

        const tl = gsap.timeline({ delay })

        // 1. Book slides in from right (whole unit enters viewport)
        tl.fromTo(book,
            { opacity: 0, x: 60, scale: 0.94 },
            { opacity: 1, x: 0,  scale: 1, duration: 0.7, ease: 'power3.out' },
            0
        )

        // 2. Brief pause — let viewer notice the closed cover
        tl.to({}, { duration: 0.3 }, 0.7)

        // 3. Left panel opens (rotates away to the left)
        tl.to(left, {
            rotationY: -180,
            duration: 1.4,
            ease: 'power2.inOut',
        }, 1.0)

        // 4. Right panel opens simultaneously (rotates away to the right)
        tl.to(right, {
            rotationY: 180,
            duration: 1.4,
            ease: 'power2.inOut',
        }, 1.0)

        // 5. Spine fades out as panels fully open
        tl.to(spine, {
            opacity: 0,
            scaleX: 0,
            duration: 0.4,
            ease: 'power2.in',
        }, 1.6)

        // 5b. Glass frost dissolves progressively as the book opens
        const glassOverlay = glassOverlayRef.current
        if (glassOverlay) {
            tl.fromTo(glassOverlay,
                { opacity: 1, backdropFilter: 'blur(18px) saturate(0.4)' },
                {
                    opacity: 0,
                    duration: 1.0,
                    ease: 'power2.out',
                },
                1.2  // starts mid-open
            )
        }

        // 6. Badge slides up once image is revealed
        if (badge) {
            tl.to(badge, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: 'back.out(1.7)',
            }, 2.0)
        }

        return () => { tl.kill() }
    }, [delay])

    return (
        <div
            ref={bookRef}
            className="group relative"
            style={{ opacity: 0 }}
            aria-label={alt}
        >
            {/* ── Spinning decorative frame behind the image ── */}
            {/* Outer ring — spins full 360° on hover, slow & smooth */}
            {/* Outer frame — tilted 12° by default, rotates 360° on hover from that base */}
            <div
                className="book-frame-outer absolute rounded-3xl"
                style={{
                    inset: '-14px',
                    background: 'linear-gradient(135deg, #c2652a 0%, #e8a56a 35%, #fdf0dc 50%, #e8a56a 65%, #c2652a 100%)',
                    transform: 'rotate(12deg)',
                    transition: 'transform 1.6s cubic-bezier(0.4, 0, 0.2, 1)',
                    zIndex: -1,
                }}
            />
            {/* Inner frame — tilted -8° (opposite lean), counter-spins on hover */}
            <div
                className="book-frame-inner absolute rounded-2xl"
                style={{
                    inset: '-7px',
                    background: 'linear-gradient(315deg, #3a302a 0%, #6b4c30 30%, #c2652a 50%, #6b4c30 70%, #3a302a 100%)',
                    transform: 'rotate(-8deg)',
                    transition: 'transform 1.6s cubic-bezier(0.4, 0, 0.2, 1)',
                    zIndex: -1,
                }}
            />

            {/* ── Book container — perspective applied here ── */}
            <div
                className="relative h-[580px] overflow-hidden rounded-2xl shadow-2xl"
                style={{ perspective: '1200px', perspectiveOrigin: 'center center' }}
            >
                {/* ── The actual photo underneath ── */}
                <img
                    src={src}
                    alt={alt}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Dark gradient overlay on photo */}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(26,20,16,0.38) 0%, transparent 50%)' }} />

                {/* ── Glass frost overlay — covers photo when book is closed, fades as it opens ── */}
                {/* GSAP animates opacity 1→0 during the open sequence */}
                <div
                    ref={glassOverlayRef}
                    className="absolute inset-0 z-[9]"
                    style={{
                        backdropFilter: 'blur(18px) saturate(0.4)',
                        WebkitBackdropFilter: 'blur(18px) saturate(0.4)',
                        background: 'rgba(253,240,220,0.22)',
                    }}
                />

                {/* ── Left cover panel (hinged on its LEFT edge) ── */}
                <div
                    ref={leftRef}
                    className="absolute inset-y-0 left-0 w-1/2"
                    style={{
                        transformOrigin: 'left center',
                        transformStyle: 'preserve-3d',
                        zIndex: 10,
                    }}
                >
                    {/* Front face — cover with image left-half + warm overlay */}
                    <div
                        className="absolute inset-0 overflow-hidden"
                        style={{ backfaceVisibility: 'hidden' }}
                    >
                        {/* Mirror the image on the cover (left half) */}
                        <div
                            style={{
                                position: 'absolute',
                                inset: 0,
                                backgroundImage: `url(${src})`,
                                backgroundSize: '200% 100%',
                                backgroundPosition: 'left center',
                            }}
                        />
                        {/* Warm parchment tint */}
                        <div className="absolute inset-0" style={{ background: 'rgba(194,101,42,0.18)' }} />
                        {/* Subtle linen texture lines */}
                        <div className="absolute inset-0" style={{
                            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.04) 3px, rgba(255,255,255,0.04) 4px)',
                        }} />
                        {/* Edge shadow (right side of left panel = spine area) */}
                        <div className="absolute right-0 top-0 h-full w-8"
                            style={{ background: 'linear-gradient(to right, transparent, rgba(0,0,0,0.18))' }} />
                    </div>

                    {/* Back face — shows when panel is past 90° (inside of cover) */}
                    <div
                        className="absolute inset-0"
                        style={{
                            backfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)',
                            background: 'linear-gradient(135deg, #f5ede0 0%, #ede0cc 100%)',
                        }}
                    />
                </div>

                {/* ── Right cover panel (hinged on its RIGHT edge) ── */}
                <div
                    ref={rightRef}
                    className="absolute inset-y-0 right-0 w-1/2"
                    style={{
                        transformOrigin: 'right center',
                        transformStyle: 'preserve-3d',
                        zIndex: 10,
                    }}
                >
                    {/* Front face */}
                    <div
                        className="absolute inset-0 overflow-hidden"
                        style={{ backfaceVisibility: 'hidden' }}
                    >
                        <div
                            style={{
                                position: 'absolute',
                                inset: 0,
                                backgroundImage: `url(${src})`,
                                backgroundSize: '200% 100%',
                                backgroundPosition: 'right center',
                            }}
                        />
                        <div className="absolute inset-0" style={{ background: 'rgba(194,101,42,0.18)' }} />
                        <div className="absolute inset-0" style={{
                            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.04) 3px, rgba(255,255,255,0.04) 4px)',
                        }} />
                        {/* Edge shadow (left side of right panel = spine area) */}
                        <div className="absolute left-0 top-0 h-full w-8"
                            style={{ background: 'linear-gradient(to left, transparent, rgba(0,0,0,0.18))' }} />
                    </div>

                    {/* Back face */}
                    <div
                        className="absolute inset-0"
                        style={{
                            backfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)',
                            background: 'linear-gradient(135deg, #ede0cc 0%, #f5ede0 100%)',
                        }}
                    />
                </div>

                {/* ── Spine / binding line at the center ── */}
                <div
                    ref={spineRef}
                    className="absolute inset-y-0 left-1/2 z-20 w-[3px] -translate-x-1/2"
                    style={{
                        background: 'linear-gradient(to bottom, rgba(194,101,42,0.6), rgba(26,20,16,0.8), rgba(194,101,42,0.6))',
                        boxShadow: '0 0 8px rgba(0,0,0,0.3)',
                    }}
                />

                {/* ── Badge revealed after opening ── */}
                <div
                    ref={badgeRef}
                    className="absolute bottom-6 left-6 right-6 z-30 rounded-2xl border border-white/20 bg-white/10 px-5 py-4 backdrop-blur-md"
                    style={{ opacity: 0 }}
                >
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/80">Prochaine session</p>
                    <p className="mt-1 font-display text-xl font-bold text-white">Septembre 2026</p>
                </div>
            </div>
        </div>
    )
}

// ─── Stripe Card Section ───────────────────────────────────────────────────────
const StripeCardSection = forwardRef<StripeCardHandle, StripeCardSectionProps>(
    ({ totalAmount, cardError, processing, paymentDone, paymentReference, onCardChange, onPayNow }, ref) => {
        const stripe   = useStripe()
        const elements = useElements()
        const [numberComplete, setNumberComplete] = useState(false)
        const [expiryComplete, setExpiryComplete] = useState(false)
        const [cvcComplete,    setCvcComplete]    = useState(false)
        const [brand,          setBrand]          = useState('unknown')
        const allComplete = numberComplete && expiryComplete && cvcComplete

        const syncCardState = (next: { number?: boolean; expiry?: boolean; cvc?: boolean; hasOwnError: boolean }) => {
            const n = next.number ?? numberComplete
            const e = next.expiry ?? expiryComplete
            const c = next.cvc ?? cvcComplete
            onCardChange(next.hasOwnError || !n || !e || !c)
        }

        useImperativeHandle(ref, () => ({
            async createPaymentMethod(billingDetails) {
                if (!stripe || !elements) return { error: 'Stripe non initialise.' }
                const cardNumber = elements.getElement(CardNumberElement)
                if (!cardNumber) return { error: 'Element carte introuvable.' }
                const { error, paymentMethod } = await stripe.createPaymentMethod({
                    type: 'card', card: cardNumber, billing_details: billingDetails,
                })
                if (error) return { error: error.message ?? 'Erreur carte.' }
                try {
                    const intent = await createStripePaymentIntent({
                        amount: totalAmount, category: 'Langues',
                        email: billingDetails.email, name: billingDetails.name,
                    })
                    const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
                        intent.client_secret, { payment_method: paymentMethod.id }
                    )
                    if (confirmError) return { error: confirmError.message ?? 'Paiement refuse.' }
                    if (!paymentIntent || paymentIntent.status !== 'succeeded')
                        return { error: 'Paiement non confirme par Stripe.' }
                    return { paymentMethodId: paymentIntent.id }
                } catch (err) {
                    return { error: err instanceof Error ? err.message : 'Impossible de finaliser le paiement Stripe.' }
                }
            },
        }))

        const elementOptions = {
            style: {
                base: { fontSize: '15px', fontFamily: 'inherit', color: '#1c1c1e', '::placeholder': { color: '#9ca3af' } },
                invalid: { color: '#dc2626', iconColor: '#dc2626' },
            },
        }
        const fieldCls = (hasError?: boolean) =>
            `rounded-xl border bg-white transition-all focus-within:ring-2 ${
                hasError
                    ? 'border-red-400 bg-red-50/30 focus-within:ring-red-200'
                    : 'border-outline-variant focus-within:border-primary focus-within:ring-primary/20'
            }`
        const DetectedLogo = brand !== 'unknown' ? BRAND_LOGO[brand] : null

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
                                <CardNumberElement options={{ ...elementOptions, showIcon: false }}
                                    onChange={(ev) => {
                                        setNumberComplete(ev.complete)
                                        setBrand(ev.brand ?? 'unknown')
                                        syncCardState({ number: ev.complete, hasOwnError: !!ev.error })
                                    }}
                                />
                            </div>
                            <div className="payment-card-icons" aria-hidden="true">
                                {DetectedLogo ? <DetectedLogo active /> :
                                    ALL_BRANDS.map((b) => { const L = BRAND_LOGO[b]; return <L key={b} active /> })}
                            </div>
                        </div>
                    </div>
                    <div className="payment-card-subgrid payment-card-field-full">
                        <div className="payment-card-field">
                            <label className="payment-card-label">Date d'expiration</label>
                            <div className={`${fieldCls()} payment-card-input-shell`}>
                                <div className="payment-card-element">
                                    <CardExpiryElement options={elementOptions}
                                        onChange={(ev) => { setExpiryComplete(ev.complete); syncCardState({ expiry: ev.complete, hasOwnError: !!ev.error }) }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="payment-card-field">
                            <label className="payment-card-label">Code de securite</label>
                            <div className={`${fieldCls()} payment-card-input-shell payment-card-cvc-shell`}>
                                <div className="payment-card-element payment-card-element-cvc">
                                    <CardCvcElement options={elementOptions}
                                        onChange={(ev) => { setCvcComplete(ev.complete); syncCardState({ cvc: ev.complete, hasOwnError: !!ev.error }) }}
                                    />
                                </div>
                                <div className="payment-card-cvc-icon" aria-hidden="true"><CvcIcon /></div>
                            </div>
                        </div>
                    </div>
                    {cardError && <FieldError msg={cardError} />}
                    {allComplete && !cardError && (
                        <p className="ml-1 mt-1.5 flex items-center gap-1.5 text-xs text-emerald-600">
                            <span className="material-symbols-outlined text-sm leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                            Informations de carte valides
                        </p>
                    )}
                </div>
                <button type="button" onClick={onPayNow}
                    disabled={processing || paymentDone || !stripe || !allComplete}
                    className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-2xl py-4 text-sm font-bold tracking-wide text-white shadow-lg transition-all duration-300 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                    style={{ background: paymentDone ? 'linear-gradient(135deg,#059669,#047857)' : 'linear-gradient(135deg,#059669,#065f46)' }}
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
                        <span className="material-symbols-outlined mt-0.5 text-base text-emerald-600" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        <div>
                            <p className="text-sm font-semibold text-emerald-800">Paiement effectue avec succes</p>
                            <p className="mt-0.5 text-xs text-emerald-700">Reference : <span className="font-mono font-semibold">{paymentReference}</span></p>
                        </div>
                    </div>
                )}
                <div className="mt-5 flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-3">
                    <span className="material-symbols-outlined text-base text-emerald-600">security</span>
                    <p className="text-xs leading-relaxed text-emerald-800">
                        Vos donnees sont chiffrees et traitees directement par <strong>Stripe</strong> (certifie PCI-DSS niveau 1).
                    </p>
                </div>
            </div>
        )
    },
)
StripeCardSection.displayName = 'StripeCardSection'

// ─── Step Badge ───────────────────────────────────────────────────────────────
const StepBadge: React.FC<{ n: number; label: string }> = ({ n, label }) => (
    <div className="step-header mb-8 flex items-center gap-4">
        <div className="hidden h-px w-14 shrink-0 bg-primary/60 sm:block" />
        <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-bold text-white"
            style={{ background: 'var(--color-primary)' }}
        >
            {n}
        </span>
        <h3 className="font-display text-2xl text-on-surface">{label}</h3>
        <div className="h-px flex-1 bg-outline-variant/30" />
    </div>
)

// ─── Main Page ─────────────────────────────────────────────────────────────────
interface Props {
    stripePublishableKey?: string
}

const InscriptionLangues: React.FC<Props> = ({
    stripePublishableKey = (import.meta as any).env?.VITE_STRIPE_PK ?? '',
}) => {
    const stripePromise = useMemo(() => (stripePublishableKey ? loadStripe(stripePublishableKey) : null), [stripePublishableKey])
    const stripeOptions = useMemo(() => ({
        mode: 'payment' as const, amount: 100, currency: 'mad',
        appearance: { theme: 'stripe' as const, variables: { fontFamily: 'inherit', borderRadius: '12px' } },
    }), [])

    const stripeCardRef = useRef<StripeCardHandle>(null)

    // ── Refs for GSAP ──
    const heroRef     = useRef<HTMLElement>(null)
    const heroTagRef  = useRef<HTMLSpanElement>(null)
    const heroH1Ref   = useRef<HTMLHeadingElement>(null)
    const heroDescRef = useRef<HTMLParagraphElement>(null)
    const heroStatsRef = useRef<HTMLDivElement>(null)
    const heroFeatsRef = useRef<HTMLDivElement>(null)
    const heroImgRef  = useRef<HTMLDivElement>(null)
    const dividerRef  = useRef<HTMLElement>(null)
    const formSectionRef = useRef<HTMLElement>(null)
    const formCardRef = useRef<HTMLDivElement>(null)
    const step1Ref    = useRef<HTMLElement>(null)
    const step2Ref    = useRef<HTMLElement>(null)
    const step3Ref    = useRef<HTMLElement>(null)
    const submitRef   = useRef<HTMLDivElement>(null)
    // decorative count-up number refs
    const priceDisplayRef = useRef<HTMLSpanElement>(null)

    // ── Form state ──
    const [form, setForm] = useState<FormData>({
        nom: '', prenom: '', age: '', email: '', telephone: '',
        language: 'francais', payment: '', acceptTerms: false, acceptPrivacy: false,
    })
    const [errors,                  setErrors]                  = useState<FormErrors>({})
    const [cardHasError,            setCardHasError]            = useState(true)
    const [submitting,              setSubmitting]              = useState(false)
    const [onlinePaymentCompleted,  setOnlinePaymentCompleted]  = useState(false)
    const [onlinePaymentReference,  setOnlinePaymentReference]  = useState('')
    const [submitted,               setSubmitted]               = useState(false)
    const [paymentCertificate,      setPaymentCertificate]      = useState<PaymentCertificateData | null>(null)
    const [showPaymentCertificate,  setShowPaymentCertificate]  = useState(false)

    const defaultPaymentDate = useMemo(() => {
        const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().slice(0, 10)
    }, [])

    // ── GSAP orchestration ──
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to('.langues-bg-geo', {
                yPercent: 10,
                ease: 'none',
                scrollTrigger: { scrub: true },
            })

            // ── Hero master timeline ──
            const heroTl = gsap.timeline({ defaults: { ease: 'expo.out' } })

            // Tag line slides in
            heroTl.fromTo(heroTagRef.current,
                { opacity: 0, y: 20, letterSpacing: '0.6em' },
                { opacity: 1, y: 0, letterSpacing: '0.2em', duration: 0.8 },
                0.2
            )
            // H1 — clip-path wipe up
            heroTl.fromTo(heroH1Ref.current,
                { opacity: 0, clipPath: 'inset(100% 0% 0% 0%)', y: 40 },
                { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)', y: 0, duration: 1 },
                0.5
            )
            // Description fade
            heroTl.fromTo(heroDescRef.current,
                { opacity: 0, x: -30 },
                { opacity: 1, x: 0, duration: 0.7 },
                0.9
            )
            // Stats grid stagger
            if (heroStatsRef.current) {
                heroTl.fromTo(
                    heroStatsRef.current.querySelectorAll('.stat-item'),
                    { opacity: 0, y: 30, scale: 0.9 },
                    { opacity: 1, y: 0, scale: 1, stagger: 0.12, duration: 0.6 },
                    1.1
                )
            }
            // Features stagger
            if (heroFeatsRef.current) {
                heroTl.fromTo(
                    heroFeatsRef.current.querySelectorAll('.feat-item'),
                    { opacity: 0, x: -20 },
                    { opacity: 1, x: 0, stagger: 0.15, duration: 0.5 },
                    1.3
                )
            }
            // Hero image: animation handled inside BookOpenImage component

            // ── Count-up price animation ──
            if (priceDisplayRef.current) {
                const obj = { val: 0 }
                heroTl.to(obj, {
                    val: TRAINING_PRICE,
                    duration: 1.2,
                    ease: 'power2.out',
                    onUpdate() {
                        if (priceDisplayRef.current)
                            priceDisplayRef.current.textContent = `${Math.round(obj.val)} DH`
                    },
                }, 1.1)
            }

            // ── Divider section ──
            if (dividerRef.current) {
                ScrollTrigger.create({
                    trigger: dividerRef.current,
                    start: 'top 82%',
                    onEnter: () => {
                        const tl = gsap.timeline()
                        tl.fromTo(dividerRef.current,
                            { opacity: 0, y: 30 },
                            { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }
                        )
                        tl.fromTo(
                            dividerRef.current!.querySelectorAll('.dot'),
                            { scale: 0 },
                            { scale: 1, stagger: 0.12, duration: 0.4, ease: 'back.out(3)' },
                            '-=0.3'
                        )
                    },
                })
            }

            // ── Form card entrance ──
            if (formCardRef.current) {
                ScrollTrigger.create({
                    trigger: formCardRef.current,
                    start: 'top 78%',
                    onEnter: () => {
                        gsap.fromTo(formCardRef.current,
                            { opacity: 0, y: 60, clipPath: 'inset(6% 0% 0% 0% round 24px)' },
                            { opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0% round 24px)', duration: 1.1, ease: 'expo.out' }
                        )
                    },
                })
            }

            // ── Step 1: personal fields stagger ──
            if (step1Ref.current) {
                ScrollTrigger.create({
                    trigger: step1Ref.current,
                    start: 'top 80%',
                    onEnter: () => {
                        gsap.fromTo(
                            step1Ref.current!.querySelectorAll('.field-group'),
                            { opacity: 0, y: 24, x: -10 },
                            { opacity: 1, y: 0, x: 0, stagger: 0.09, duration: 0.55, ease: 'power3.out' }
                        )
                        gsap.fromTo(
                            step1Ref.current!.querySelector('.step-header'),
                            { opacity: 0, x: -30 },
                            { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' }
                        )
                    },
                })
            }

            // ── Step 2: language cards ──
            if (step2Ref.current) {
                ScrollTrigger.create({
                    trigger: step2Ref.current,
                    start: 'top 80%',
                    onEnter: () => {
                        gsap.fromTo(
                            step2Ref.current!.querySelectorAll('.lang-card'),
                            { opacity: 0, y: 40, rotationX: 12, transformPerspective: 800 },
                            { opacity: 1, y: 0, rotationX: 0, stagger: 0.13, duration: 0.75, ease: 'back.out(1.4)' }
                        )
                        gsap.fromTo(
                            step2Ref.current!.querySelector('.recap-block'),
                            { opacity: 0, y: 20 },
                            { opacity: 1, y: 0, duration: 0.6, delay: 0.5, ease: 'power3.out' }
                        )
                    },
                })
            }

            // ── Step 3: payment options ──
            if (step3Ref.current) {
                ScrollTrigger.create({
                    trigger: step3Ref.current,
                    start: 'top 82%',
                    onEnter: () => {
                        gsap.fromTo(
                            step3Ref.current!.querySelectorAll('.payment-option'),
                            { opacity: 0, scale: 0.94, x: -20 },
                            { opacity: 1, scale: 1, x: 0, stagger: 0.15, duration: 0.65, ease: 'back.out(1.6)' }
                        )
                    },
                })
            }

            // ── Submit section ──
            if (submitRef.current) {
                ScrollTrigger.create({
                    trigger: submitRef.current,
                    start: 'top 88%',
                    onEnter: () => {
                        gsap.fromTo(submitRef.current,
                            { opacity: 0, y: 30 },
                            { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }
                        )
                    },
                })
            }

            // ── Decorative blobs parallax ──
            gsap.utils.toArray<Element>('.deco-blob').forEach((el, i) => {
                gsap.to(el, {
                    yPercent: i % 2 === 0 ? -25 : 25,
                    ease: 'none',
                    scrollTrigger: { scrub: 2 },
                })
            })
        })

        return () => ctx.revert()
    }, [])

    // ── Language card select animation ──
    const animateCardSelect = (el: HTMLElement) => {
        gsap.fromTo(el,
            { scale: 0.96 },
            { scale: 1, duration: 0.35, ease: 'back.out(2.5)' }
        )
    }

    // ── Payment mode toggle animation ──
    const animatePaymentSelect = (el: HTMLElement) => {
        gsap.fromTo(el,
            { x: -6, opacity: 0.7 },
            { x: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }
        )
    }

    // ── Form helpers ──
    const clearErr  = (field: keyof FormErrors) => setErrors((p) => ({ ...p, [field]: undefined }))

    const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target
        if (type === 'checkbox') {
            setForm((p) => ({ ...p, [name]: (e.target as HTMLInputElement).checked }))
        } else {
            setForm((p) => ({ ...p, [name]: value }))
        }
        clearErr(name as keyof FormErrors)
    }

    const handleRadio = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
        clearErr(e.target.name as keyof FormErrors)
        if (e.target.name === 'payment') {
            setOnlinePaymentCompleted(false)
            setOnlinePaymentReference('')
            clearErr('card')
        }
        // animate the selected element
        const card = e.target.closest('.lang-card, .payment-option') as HTMLElement | null
        if (card) {
            if (e.target.name === 'language') animateCardSelect(card)
            else animatePaymentSelect(card)
        }
    }

    const handleOnlinePayment = async () => {
        const preErrors: FormErrors = {}
        if (!form.nom.trim())    preErrors.nom       = 'Le nom est requis.'
        if (!form.prenom.trim()) preErrors.prenom    = 'Le prenom est requis.'
        if (!okEmail(form.email)) preErrors.email    = 'Adresse email invalide.'
        if (!okPhone(form.telephone)) preErrors.telephone = 'Telephone invalide.'
        if (!form.language)       preErrors.language = 'Selectionnez une langue.'
        if (cardHasError)         preErrors.card     = 'Completez les informations de carte.'
        if (Object.keys(preErrors).length) { setErrors((p) => ({ ...p, ...preErrors })); return }

        setSubmitting(true)
        try {
            if (!stripeCardRef.current) { setErrors((p) => ({ ...p, card: 'Formulaire carte introuvable.' })); return }
            const result = await stripeCardRef.current.createPaymentMethod({
                name: `${form.prenom} ${form.nom}`, email: form.email, phone: form.telephone,
            })
            if ('error' in result) { setErrors((p) => ({ ...p, card: result.error })); return }
            setOnlinePaymentCompleted(true)
            setOnlinePaymentReference(result.paymentMethodId)
            clearErr('card')
        } finally {
            setSubmitting(false)
        }
    }

    const validateFinal = (): FormErrors => {
        const e: FormErrors = {}
        if (!form.nom.trim())    e.nom       = 'Le nom est requis.'
        if (!form.prenom.trim()) e.prenom    = 'Le prenom est requis.'
        if (!form.age || Number(form.age) < 15 || Number(form.age) > 80) e.age = 'Age valide requis (15 – 80).'
        if (!okEmail(form.email))      e.email     = 'Adresse email invalide.'
        if (!okPhone(form.telephone))  e.telephone = 'Numero invalide.'
        if (!form.language)            e.language  = 'Selectionnez une langue.'
        if (!form.payment)             e.payment   = 'Choisissez un mode de paiement.'
        if (!form.acceptTerms)         e.acceptTerms  = 'Acceptez les conditions generales.'
        if (!form.acceptPrivacy)       e.acceptPrivacy = 'Acceptez la politique de confidentialite.'
        return e
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const finalErrors = validateFinal()
        if (Object.keys(finalErrors).length) { setErrors(finalErrors); return }
        setSubmitting(true)
        const certRef    = secureRef('PAYCERT')
        const payRef     = form.payment === 'online' ? undefined : secureRef('PAY')
        const trainingLabel = LANGUAGE_LABELS[form.language] || 'Langues'

        router.post(route('applications.store'), {
            first_name: form.prenom, last_name: form.nom,
            email: form.email, phone: form.telephone,
            category: 'Langues', training_label: trainingLabel,
            course_slug: form.language === 'anglais' ? 'anglais-des-affaires-b2' : undefined,
            amount: TRAINING_PRICE,
            payment_method: form.payment,
            payment_provider: form.payment === 'online' ? 'payzone' : undefined,
            payment_reference: payRef,
            preferred_payment_date: form.payment === 'onsite' ? defaultPaymentDate : undefined,
            certificate_reference: certRef,
            form_data: { ...form },
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setPaymentCertificate({
                    studentName: `${form.prenom.trim()} ${form.nom.trim()}`,
                    reference: certRef,
                    barcodeValue: `${certRef}-${payRef}`,
                    trainingLabel, category: 'Langues',
                    amount: fmtAmount(TRAINING_PRICE),
                    paymentMode: form.payment === 'online' ? 'Paiement en ligne' : 'Paiement presentiel',
                    paymentStatus: form.payment === 'online' ? 'Paye' : 'Paiement a regler au centre',
                    issuedAt: new Date().toLocaleString('fr-MA'),
                })
                setSubmitted(true)
                setShowPaymentCertificate(true)
            },
            onFinish: () => setSubmitting(false),
        })
    }

    return (
        <>
            <Head title="Langues" />
            {showPaymentCertificate && paymentCertificate && (
                <PaymentCertificate certificate={paymentCertificate} onClose={() => setShowPaymentCertificate(false)} />
            )}

            <PublicLayout>
                <div className="langues-page-bg">
                    <svg className="langues-bg-geo" viewBox="0 0 1200 900" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <circle cx="80" cy="150" r="180" fill="none" stroke="rgba(194,101,42,0.09)" strokeWidth="1.5" />
                        <circle cx="80" cy="150" r="100" fill="none" stroke="rgba(194,101,42,0.06)" strokeWidth="1" />
                        <circle cx="1140" cy="750" r="220" fill="none" stroke="rgba(194,101,42,0.08)" strokeWidth="1.5" />
                        <circle cx="1140" cy="750" r="130" fill="none" stroke="rgba(194,101,42,0.05)" strokeWidth="1" />
                        <circle cx="620" cy="450" r="280" fill="none" stroke="rgba(194,101,42,0.045)" strokeWidth="1" />
                        <line x1="0" y1="315" x2="215" y2="105" stroke="rgba(194,101,42,0.10)" strokeWidth="1" />
                        <line x1="25" y1="340" x2="240" y2="130" stroke="rgba(194,101,42,0.06)" strokeWidth="0.8" />
                        <line x1="980" y1="590" x2="1200" y2="805" stroke="rgba(194,101,42,0.09)" strokeWidth="1" />
                        <g stroke="rgba(194,101,42,0.18)" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="1045" y1="88" x2="1115" y2="88" /><polyline points="1100,74 1115,88 1100,102" />
                        </g>
                        <g stroke="rgba(194,101,42,0.18)" strokeWidth="1.5" strokeLinecap="round">
                            <line x1="935" y1="145" x2="955" y2="165" /><line x1="955" y1="145" x2="935" y2="165" />
                        </g>
                        {[0,1,2,3,4].map((row) => [0,1,2,3,4,5].map((col) => (
                            <circle key={`${row}-${col}`} cx={500 + col * 60} cy={210 + row * 60} r="1.5" fill="rgba(194,101,42,0.12)" />
                        )))}
                        <path d="M 100 610 Q 410 390 720 610" fill="none" stroke="rgba(194,101,42,0.08)" strokeWidth="1" strokeDasharray="6 8" />
                    </svg>

                    <main className="relative z-10 flex-grow">

                    {/* ══════════════════ HERO ══════════════════ */}
                    <section ref={heroRef} className="relative overflow-hidden pt-20 pb-28">
                        {/* Decorative blobs */}
                        <div className="deco-blob pointer-events-none absolute -right-32 -top-32 h-[520px] w-[520px] rounded-full"
                            style={{ background: 'radial-gradient(circle, rgba(194,101,42,0.08) 0%, transparent 70%)' }} />
                        <div className="deco-blob pointer-events-none absolute -left-24 bottom-0 h-[380px] w-[380px] rounded-full"
                            style={{ background: 'radial-gradient(circle, rgba(194,101,42,0.05) 0%, transparent 70%)' }} />
                        {/* Grid overlay */}
                        <div className="pointer-events-none absolute inset-0"
                            style={{ backgroundImage: 'linear-gradient(rgba(194,101,42,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(194,101,42,0.03) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />

                        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-8 lg:grid-cols-2">
                            {/* Left */}
                            <div>
                                <span ref={heroTagRef}
                                    className="mb-5 block text-xs font-bold uppercase tracking-[0.2em] text-primary"
                                    style={{ opacity: 0 }}
                                >
                                    Formation d'Excellence
                                </span>
                                <h1 ref={heroH1Ref}
                                    className="font-display text-6xl leading-tight text-on-surface lg:text-7xl"
                                    style={{ opacity: 0 }}
                                >
                                    Inscriptions :<br />
                                    <span className="italic text-primary">Pole Langues</span>
                                </h1>
                                <p ref={heroDescRef}
                                    className="mb-10 mt-6 max-w-lg text-lg leading-relaxed text-on-surface-variant"
                                    style={{ opacity: 0 }}
                                >
                                    Maitrisez le Français, l'Anglais ou l'Espagnol avec une pedagogie immersive.
                                    Certifiez vos competences dans un cadre d'excellence.
                                </p>

                                {/* Stats */}
                                <div ref={heroStatsRef} className="mb-12 grid grid-cols-2 gap-8">
                                    {[
                                        { icon: 'schedule', label: 'Duree', value: '3–6 mois flexible' },
                                        { icon: 'payments', label: 'Prix', isPrice: true },
                                    ].map(({ icon, label, value, isPrice }) => (
                                        <div key={label} className="stat-item flex items-start gap-4" style={{ opacity: 0 }}>
                                            <span className="material-symbols-outlined text-3xl text-primary">{icon}</span>
                                            <div>
                                                <p className="font-bold text-on-surface">{label}</p>
                                                {isPrice ? (
                                                    <p className="text-sm text-on-surface-variant">
                                                        <span ref={priceDisplayRef}>0 DH</span> / Niveau
                                                    </p>
                                                ) : (
                                                    <p className="text-sm text-on-surface-variant">{value}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Features */}
                                <div ref={heroFeatsRef} className="flex flex-col gap-4 border-l-2 border-primary/30 pl-6">
                                    {['Native teachers & Expert Pedagogy', 'Certification internationale incluse'].map((text) => (
                                        <div key={text} className="feat-item flex items-center gap-3" style={{ opacity: 0 }}>
                                            <span className="material-symbols-outlined text-xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                                            <span className="text-sm font-medium text-on-surface-variant">{text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right — book-opening image */}
                            <BookOpenImage
                                src={BOOK_IMG_SRC}
                                alt="Etudiants en formation linguistique"
                                delay={0.6}
                            />
                        </div>
                    </section>

                    {/* ══════════════════ DIVIDER ══════════════════ */}
                    <section ref={dividerRef} className="border-y border-outline-variant/30 bg-white py-14" style={{ opacity: 0 }}>
                        <div className="mx-auto max-w-7xl px-8 text-center">
                            <h2 className="font-display text-5xl text-on-surface">Dossier d'Inscription</h2>
                            <p className="mx-auto mt-4 max-w-2xl text-lg text-on-surface-variant">
                                Completez le formulaire ci-dessous pour reserver votre place.
                                Nos conseillers vous recontacteront sous 24h.
                            </p>
                            <div className="mt-6 flex justify-center gap-3">
                                <div className="dot h-2 w-2 rounded-full bg-primary" />
                                <div className="dot h-2 w-14 rounded-full bg-primary/30" />
                                <div className="dot h-2 w-2 rounded-full bg-primary" />
                            </div>
                        </div>
                    </section>

                    {/* ══════════════════ FORM SECTION ══════════════════ */}
                    <section ref={formSectionRef} className="relative overflow-hidden py-24">
                        {/* Decorative background */}
                        <div className="pointer-events-none absolute inset-0"
                            style={{ backgroundImage: 'radial-gradient(rgba(194,101,42,0.04) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
                        <div className="deco-blob pointer-events-none absolute right-[8%] top-20 h-[380px] w-[380px] rounded-full opacity-60"
                            style={{ background: 'radial-gradient(circle, rgba(194,101,42,0.06) 0%, transparent 70%)' }} />
                        <div className="deco-blob pointer-events-none absolute -left-20 bottom-40 h-[300px] w-[300px] rounded-full opacity-60"
                            style={{ background: 'radial-gradient(circle, rgba(194,101,42,0.05) 0%, transparent 70%)' }} />

                        <div className="relative z-10 mx-auto max-w-4xl px-8">
                            <div
                                ref={formCardRef}
                                className="relative rounded-3xl border border-outline-variant/40 bg-white p-10 shadow-xl lg:p-16"
                                style={{ opacity: 0, boxShadow: '0 4px 48px rgba(58,48,42,0.09)' }}
                            >
                                <div className="pointer-events-none absolute left-8 right-8 top-0 h-1 rounded-b-full bg-gradient-to-r from-primary via-orange-400 to-amber-200" />
                                <div className="pointer-events-none absolute bottom-10 left-0 top-10 w-px bg-gradient-to-b from-transparent via-primary/35 to-transparent" />
                                <div className="pointer-events-none absolute right-10 top-10 h-20 w-20 rounded-full border border-primary/10" />

                                <form onSubmit={handleSubmit} noValidate className="relative z-10 space-y-14">

                                    {/* ── Step 1: Personal info ── */}
                                    <section ref={step1Ref} className="space-y-8">
                                        <StepBadge n={1} label="Informations Personnelles" />
                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                            {[
                                                { name: 'nom',       label: 'Nom',       placeholder: 'Votre nom',        type: 'text',   err: errors.nom },
                                                { name: 'prenom',    label: 'Prenom',    placeholder: 'Votre prenom',     type: 'text',   err: errors.prenom },
                                                { name: 'age',       label: 'Age',       placeholder: '25',               type: 'number', err: errors.age },
                                                { name: 'email',     label: 'Email',     placeholder: 'email@exemple.com', type: 'email', err: errors.email },
                                                { name: 'telephone', label: 'Telephone', placeholder: '+212 600 000 000', type: 'tel',    err: errors.telephone },
                                            ].map(({ name, label, placeholder, type, err }) => (
                                                <div key={name} className="field-group" style={{ opacity: 0 }} data-has-error={err ? 'true' : undefined}>
                                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                                                        {label}
                                                    </label>
                                                    <input
                                                        type={type}
                                                        name={name}
                                                        value={(form as any)[name]}
                                                        onChange={handleInput}
                                                        placeholder={placeholder}
                                                        className={inputCls(err)}
                                                        {...(type === 'number' ? { min: 15, max: 80 } : {})}
                                                    />
                                                    <FieldError msg={err} />
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    {/* ── Step 2: Language choice ── */}
                                    <section ref={step2Ref} className="space-y-8 border-t border-outline-variant/20 pt-6">
                                        <StepBadge n={2} label="Choix de la Formation" />
                                        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                                            {LANGUAGE_OPTIONS.map(({ value, title, sub }) => {
                                                const active = form.language === value
                                                return (
                                                    <label key={value} className="lang-card group cursor-pointer" style={{ opacity: 0 }}>
                                                        <input type="radio" name="language" value={value} checked={active}
                                                            onChange={handleRadio} className="sr-only" />
                                                        <div className={`relative flex h-full flex-col overflow-hidden rounded-2xl p-5 transition-all duration-300 ${
                                                            active
                                                                ? 'border-2 border-primary shadow-md shadow-primary/10'
                                                                : 'border-2 border-outline-variant/60 bg-white group-hover:border-primary/40 group-hover:shadow-sm'
                                                        }`}
                                                            style={{ background: active ? 'rgba(194,101,42,0.04)' : 'white' }}
                                                        >
                                                            {/* Flag bg */}
                                                            <div className="pointer-events-none absolute inset-0 bg-cover bg-left"
                                                                style={{
                                                                    backgroundImage: `url('${FLAG_URLS[value]}')`,
                                                                    WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,0.14) 0%, transparent 65%)',
                                                                    maskImage: 'linear-gradient(to right, rgba(0,0,0,0.14) 0%, transparent 65%)',
                                                                }}
                                                            />
                                                            {/* Active indicator */}
                                                            {active && (
                                                                <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                                                                    <span className="material-symbols-outlined text-xs text-white" style={{ fontSize: '13px', fontVariationSettings: "'FILL' 1" }}>check</span>
                                                                </span>
                                                            )}
                                                            <div className="relative z-10">
                                                                <p className="font-bold text-on-surface">{title}</p>
                                                                <p className="mt-1 text-xs text-on-surface-variant">{sub}</p>
                                                                <div className="mt-4 inline-block rounded-full bg-primary/10 px-4 py-1">
                                                                    <span className="text-sm font-bold text-primary">{fmtAmount(TRAINING_PRICE)}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </label>
                                                )
                                            })}
                                        </div>

                                        {/* Recap */}
                                        <div className="recap-block rounded-2xl border border-outline-variant/40 bg-[#faf7f4] p-5" style={{ opacity: 0 }}>
                                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                                <div>
                                                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Recapitulatif</p>
                                                    <p className="mt-1 text-sm text-on-surface-variant">
                                                        {LANGUAGE_LABELS[form.language] || 'Aucune langue selectionnee'}
                                                    </p>
                                                </div>
                                                <div className="sm:text-right">
                                                    <p className="text-xs uppercase tracking-[0.2em] text-on-surface-variant">Montant</p>
                                                    <p className="font-display text-3xl font-bold text-on-surface">{fmtAmount(TRAINING_PRICE)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    {/* ── Step 3: Payment mode ── */}
                                    <section ref={step3Ref} className="space-y-8 border-t border-outline-variant/20 pt-6">
                                        <StepBadge n={3} label="Mode de Paiement" />
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2" data-has-error={errors.payment ? 'true' : undefined}>
                                            {[
                                                { value: 'online' as PaymentMode, icon: 'credit_card', label: 'Paiement en ligne', sub: 'Redirection securisee Payzone' },
                                                { value: 'onsite' as PaymentMode, icon: 'storefront',  label: 'Paiement presentiel', sub: 'Reglement au centre de formation' },
                                            ].map(({ value, icon, label, sub }) => {
                                                const active = form.payment === value
                                                return (
                                                    <label key={value} className="payment-option group cursor-pointer" style={{ opacity: 0 }}>
                                                        <input type="radio" name="payment" value={value} checked={active}
                                                            onChange={handleRadio} className="sr-only" />
                                                        <div className={`flex items-center gap-4 rounded-2xl bg-white p-5 transition-all duration-200 ${
                                                            active
                                                                ? 'border-2 border-primary bg-primary/4 shadow-md shadow-primary/8'
                                                                : 'border-2 border-outline-variant/50 group-hover:border-primary/40'
                                                        }`}>
                                                            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all ${active ? 'bg-primary' : 'bg-surface-container'}`}>
                                                                <span className="material-symbols-outlined text-xl" style={{ color: active ? 'white' : '#9ca3af' }}>{icon}</span>
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="font-semibold text-on-surface">{label}</p>
                                                                <p className="text-sm text-on-surface-variant">{sub}</p>
                                                            </div>
                                                            <span className="material-symbols-outlined text-xl"
                                                                style={{ color: active ? 'var(--color-primary)' : '#d1d5db', fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}>
                                                                radio_button_checked
                                                            </span>
                                                        </div>
                                                    </label>
                                                )
                                            })}
                                        </div>
                                        <FieldError msg={errors.payment} />

                                        {/* Online info */}
                                        {form.payment === 'online' && (
                                            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-sm text-emerald-900">
                                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Paiement securise Payzone</p>
                                                <h4 className="mt-1 font-display text-xl font-bold text-on-surface">Redirection vers la page bancaire</h4>
                                                <p className="mt-2 text-emerald-800">
                                                    Apres validation, vous serez redirige vers Payzone pour payer par carte.
                                                    La banque peut demander un code 3D Secure.
                                                </p>
                                            </div>
                                        )}

                                        {/* Onsite info */}
                                        {form.payment === 'onsite' && (
                                            <div className="rounded-3xl border border-primary/20 bg-white p-6 shadow-sm">
                                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Paiement au centre</p>
                                                <h4 className="mt-1 font-display text-xl font-bold text-on-surface">Informations de rendez-vous</h4>
                                                <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                                                    <div className="rounded-2xl border border-outline-variant/30 bg-[#faf7f4] p-5">
                                                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-on-surface-variant">Adresse</p>
                                                        <p className="mt-2 text-sm font-semibold text-on-surface">14 avenue Hassan II, 1er etage, Ville Nouvelle, Meknes, Maroc</p>
                                                        <a href="https://www.google.com/maps/search/?api=1&query=33.8989909,-5.551918"
                                                            target="_blank" rel="noreferrer"
                                                            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                                                            <span className="material-symbols-outlined text-base leading-none">north_east</span>
                                                            Google Maps
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
                                        )}
                                    </section>

                                    {/* ── Terms + Submit ── */}
                                    <div ref={submitRef} className="space-y-6 border-t border-outline-variant/20 pt-8" style={{ opacity: 0 }}>
                                        <div className="space-y-4">
                                            {[
                                                {
                                                    name: 'acceptTerms',
                                                    err: errors.acceptTerms,
                                                    label: (
                                                        <>
                                                            J'accepte les{' '}
                                                            <a href="/terms" className="font-medium text-primary underline underline-offset-2">Conditions Generales</a>
                                                            , la{' '}
                                                            <a href="/privacy" className="font-medium text-primary underline underline-offset-2">Politique de Confidentialite</a>
                                                            {' '}et j'autorise le centre a traiter mon dossier.
                                                        </>
                                                    ),
                                                },
                                                {
                                                    name: 'acceptPrivacy',
                                                    err: errors.acceptPrivacy,
                                                    label: 'Je confirme que les informations fournies sont exactes et j\'accepte le traitement de mes donnees.',
                                                },
                                            ].map(({ name, err, label }) => (
                                                <div key={name} data-has-error={err ? 'true' : undefined}>
                                                    <label className="group flex cursor-pointer items-start gap-3">
                                                        <input type="checkbox" name={name}
                                                            checked={(form as any)[name]}
                                                            onChange={handleInput}
                                                            className={`mt-0.5 h-4 w-4 rounded border text-primary transition-all focus:ring-primary ${err ? 'border-red-400' : 'border-outline-variant'}`}
                                                        />
                                                        <span className="text-sm leading-relaxed text-on-surface-variant transition-colors group-hover:text-on-surface">
                                                            {label}
                                                        </span>
                                                    </label>
                                                    <FieldError msg={err} />
                                                </div>
                                            ))}
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="group relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-primary py-5 text-base font-bold tracking-wide text-on-primary shadow-lg transition-all duration-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                                            style={{ boxShadow: '0 8px 32px rgba(194,101,42,0.25)' }}
                                        >
                                            {/* Hover shimmer */}
                                            <span className="absolute inset-0 -translate-x-full bg-white/10 transition-transform duration-500 group-hover:translate-x-full" />
                                            {submitting ? (
                                                <><span className="material-symbols-outlined animate-spin text-xl leading-none">progress_activity</span>Traitement en cours...</>
                                            ) : (
                                                <>
                                                    {form.payment === 'online' ? 'Payer avec Payzone' : 'Valider ma place'}
                                                    <span className="material-symbols-outlined text-xl leading-none transition-transform duration-300 group-hover:translate-x-1">arrow_forward</span>
                                                </>
                                            )}
                                        </button>

                                        {submitted && (
                                            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center">
                                                <p className="text-sm font-semibold text-emerald-800">
                                                    Inscription enregistree pour {LANGUAGE_LABELS[form.language]}.
                                                </p>
                                                <p className="mt-1 text-xs text-emerald-700">
                                                    Reference : <span className="font-mono font-semibold">{paymentCertificate?.reference}</span>
                                                </p>
                                                {paymentCertificate && (
                                                    <button type="button" onClick={() => setShowPaymentCertificate(true)}
                                                        className="mt-3 text-sm font-bold text-emerald-700 underline underline-offset-2">
                                                        Voir le certificat de paiement
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </section>
                    </main>
                </div>

                <style>{`
                    .langues-page-bg {
                        position: relative;
                        min-height: 100vh;
                        overflow: hidden;
                        background: linear-gradient(180deg, #ffffff 0%, #fff8f0 40%, #fff3e6 100%);
                    }
                    .langues-bg-geo {
                        position: absolute;
                        inset: 0;
                        width: 100%;
                        height: 100%;
                        pointer-events: none;
                        z-index: 0;
                    }
                    .material-symbols-outlined {
                        font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
                    }
                    /* Book spinning frames — hover adds 360° to the default tilt */
                    .group:hover .book-frame-outer {
                        transform: rotate(372deg);   /* 12° base + 360° spin */
                    }
                    .group:hover .book-frame-inner {
                        transform: rotate(-368deg);  /* -8° base - 360° spin */
                    }

                    @keyframes spin { to { transform: rotate(360deg); } }
                    .animate-spin { animation: spin 0.8s linear infinite; display: inline-block; }

                    /* Book panels — hardware accelerate the 3D transforms */
                    [style*="transformStyle: preserve-3d"],
                    [style*="transform-style: preserve-3d"] {
                        will-change: transform;
                    }

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
            </PublicLayout>
        </>
    )
}

export default InscriptionLangues
