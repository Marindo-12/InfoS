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
import bureautiqueimg from '../../../../public/images/bureautique.png'

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
   FIRE REVEAL IMAGE
   Phase 1 : Red-orange fire (canvas particles)
   Phase 2 : Fire transitions to blue
   Phase 3 : Blue lightning bolts shoot across screen
   Phase 4 : Image revealed tile by tile (6 tiles, 2×3)
   Phase 5 : Blue fire border around the image frame
═══════════════════════════════════════════════════ */
const IMG_SRC = bureautiqueimg
// Tile reveal order: center-out, [row, col]
const REVEAL_ORDER: [number, number][] = [[0,1],[1,1],[0,0],[1,2],[0,2],[1,0]]

const FireRevealImage: React.FC = () => {
  const wrapRef      = useRef<HTMLDivElement>(null)
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const lightningRef = useRef<HTMLCanvasElement>(null)
  const imgRef       = useRef<HTMLDivElement>(null)
  const borderRef    = useRef<HTMLDivElement>(null)
  const borderCanvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef       = useRef<number>(0)
  const phaseRef     = useRef<'fire' | 'blue' | 'lightning' | 'tiles' | 'border' | 'done'>('fire')
  const timeRef      = useRef(0)

  useEffect(() => {
    const canvas    = canvasRef.current!
    const lCanvas   = lightningRef.current!
    const bCanvas   = borderCanvasRef.current!
    const ctx       = canvas.getContext('2d')!
    const lCtx      = lCanvas.getContext('2d')!
    const bCtx      = bCanvas.getContext('2d')!
    const wrap      = wrapRef.current!
    const img       = imgRef.current!
    const border    = borderRef.current!

    // Size canvases
    const W = wrap.offsetWidth  || 600
    const H = wrap.offsetHeight || 338
    canvas.width  = W;  canvas.height  = H
    bCanvas.width = W + 40; bCanvas.height = H + 40
    lCanvas.width = window.innerWidth
    lCanvas.height = window.innerHeight

    /* ─────────────────────────────────────────────
       PARTICLE SYSTEM — Rich fire with embers
    ───────────────────────────────────────────── */
    interface Particle {
      x: number; y: number
      vx: number; vy: number
      life: number; maxLife: number
      size: number
      blue: number       // 0=red, 1=blue
      isEmber: boolean   // small fast spark
    }
    const particles: Particle[] = []

    const spawnParticle = (blue: number, count = 1) => {
      for (let k = 0; k < count; k++) {
        // Spread fire from multiple base points for volume
        const baseX = W * 0.1 + Math.random() * W * 0.8
        const isEmber = Math.random() < 0.18
        particles.push({
          x: baseX,
          y: H + (isEmber ? 0 : Math.random() * 20),
          vx: (Math.random() - 0.5) * (isEmber ? 4 : 2),
          vy: -(isEmber ? 5 + Math.random() * 6 : 1.8 + Math.random() * 3.5),
          life: 0,
          maxLife: isEmber ? 30 + Math.random() * 25 : 55 + Math.random() * 50,
          size: isEmber ? 1.5 + Math.random() * 3 : 8 + Math.random() * 18,
          blue,
          isEmber,
        })
      }
    }

    const drawFire = (t: number, blue: number) => {
      // Soft trail — don't fully clear so flames blur together
      ctx.fillStyle = 'rgba(5,4,12,0.35)'
      ctx.fillRect(0, 0, W, H)

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        // Turbulent wind
        p.x  += p.vx + Math.sin(t * 0.07 + p.y * 0.03) * 1.2
        p.y  += p.vy
        p.vy *= p.isEmber ? 0.995 : 0.982
        p.vx *= 0.99
        p.life++
        if (p.life > p.maxLife) { particles.splice(i, 1); continue }

        const ratio = p.life / p.maxLife
        const alpha = p.isEmber
          ? Math.max(0, (1 - ratio) * 1.0)
          : Math.max(0, Math.sin(ratio * Math.PI) * 0.9)

        // Color interpolation
        let r: number, g: number, b2: number
        if (p.isEmber) {
          r  = Math.round(255 * (1 - p.blue) + 200 * p.blue)
          g  = Math.round(180 * (1 - p.blue) + 220 * p.blue)
          b2 = Math.round(20  * (1 - p.blue) + 255 * p.blue)
        } else {
          const heat = 1 - ratio
          r  = Math.round((255 * (1 - p.blue) + 20  * p.blue) * heat)
          g  = Math.round((60  + heat * 120) * (1 - p.blue) + (80 + heat * 140) * p.blue)
          b2 = Math.round(15  * (1 - p.blue) + 255 * p.blue)
        }

        if (p.isEmber) {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${r},${g},${b2},${alpha})`
          ctx.fill()
        } else {
          // Radial gradient for body flames (core + halo)
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * (1 - ratio * 0.5))
          grad.addColorStop(0, `rgba(${Math.min(255,r+60)},${Math.min(255,g+60)},${Math.min(255,b2+60)},${alpha})`)
          grad.addColorStop(0.5, `rgba(${r},${g},${b2},${alpha * 0.6})`)
          grad.addColorStop(1, `rgba(${r},${g},${b2},0)`)
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * (1 - ratio * 0.5), 0, Math.PI * 2)
          ctx.fillStyle = grad
          ctx.fill()
        }
      }
    }

    /* ─────────────────────────────────────────────
       LIGHTNING — Recursive fractal bolts
    ───────────────────────────────────────────── */
    const drawBolt = (
      ctx2: CanvasRenderingContext2D,
      x1: number, y1: number, x2: number, y2: number,
      depth: number, alpha: number, width: number
    ) => {
      if (depth <= 0) {
        ctx2.beginPath()
        ctx2.moveTo(x1, y1)
        ctx2.lineTo(x2, y2)
        ctx2.strokeStyle = `rgba(140,210,255,${alpha})`
        ctx2.lineWidth   = width
        ctx2.shadowBlur  = 22
        ctx2.shadowColor = 'rgba(80,160,255,0.9)'
        ctx2.stroke()
        return
      }
      const mx = (x1 + x2) / 2 + (Math.random() - 0.5) * 90 / depth
      const my = (y1 + y2) / 2 + (Math.random() - 0.5) * 90 / depth
      // Main bolt
      drawBolt(ctx2, x1, y1, mx, my, depth - 1, alpha, width)
      drawBolt(ctx2, mx, my, x2, y2, depth - 1, alpha, width)
      // Random branch (30% chance)
      if (Math.random() < 0.30) {
        const bx = mx + (Math.random() - 0.5) * 120
        const by = my + (Math.random() - 0.5) * 120
        drawBolt(ctx2, mx, my, bx, by, depth - 2, alpha * 0.5, width * 0.5)
      }
    }

    interface Bolt {
      x1: number; y1: number; x2: number; y2: number
      age: number; maxAge: number; depth: number
    }
    const BOLTS: Bolt[] = []
    const spawnBolt = () => {
      // Bolts originate from the image center and shoot outward in all directions
      const rect  = wrap.getBoundingClientRect()
      const cx    = rect.left + rect.width  / 2
      const cy    = rect.top  + rect.height / 2
      const angle = Math.random() * Math.PI * 2
      const dist  = 0.85 * Math.max(window.innerWidth, window.innerHeight)
      BOLTS.push({ x1: cx, y1: cy, x2: cx + Math.cos(angle) * dist, y2: cy + Math.sin(angle) * dist,
        age: 0, maxAge: 22, depth: 4 })
    }

    let lightningTimer = 0

    /* ─────────────────────────────────────────────
       TILE REVEAL
    ───────────────────────────────────────────── */
    const COLS = 3; const ROWS = 2
    // Reveal order: center-out → [1,1], [0,1], [1,0], [0,0], [1,2], [0,2]
    const REVEAL_ORDER = [[0,1],[1,1],[0,0],[1,2],[0,2],[1,0]]
    interface Tile { col: number; row: number; alpha: number; started: boolean; dx: number; dy: number }
    const tiles: Tile[] = REVEAL_ORDER.map(([row, col]) => {
      // Each tile slides in from its corner
      const dx = col === 0 ? -1 : col === 2 ? 1 : 0
      const dy = row === 0 ? -1 : 1
      return { col, row, alpha: 0, started: false, dx, dy }
    })
    let tileIdx = 0
    let tileTimer = 0

    /* ─────────────────────────────────────────────
       BLUE FIRE BORDER — Canvas-drawn particles
    ───────────────────────────────────────────── */
    interface BorderParticle {
      t: number   // position along perimeter 0–1
      life: number; maxLife: number
      offset: number  // perpendicular offset (outward)
      size: number; speed: number
    }
    const borderParticles: BorderParticle[] = []
    let borderActive = false
    const perimeter = 2 * (W + H)

    const spawnBorderParticle = () => {
      borderParticles.push({
        t: Math.random(),
        life: 0,
        maxLife: 30 + Math.random() * 30,
        offset: 2 + Math.random() * 18,
        size: 2 + Math.random() * 8,
        speed: (0.003 + Math.random() * 0.006) * (Math.random() < 0.5 ? 1 : -1),
      })
    }

    const perimeterToXY = (t: number, padding: number): [number, number] => {
      // t ∈ [0,1] → walks around the rectangle perimeter
      const p = ((t % 1) + 1) % 1
      const total = 2 * (W + H)
      const d = p * total
      if (d < W)         return [d,          -padding]
      if (d < W + H)     return [W + padding, d - W]
      if (d < 2*W + H)   return [W - (d - W - H), H + padding]
      return [-padding,  H - (d - 2*W - H)]
    }

    const drawBorderParticles = () => {
      bCtx.clearRect(0, 0, bCanvas.width, bCanvas.height)
      bCtx.save()
      bCtx.translate(20, 20)  // center the border canvas over image

      for (let i = borderParticles.length - 1; i >= 0; i--) {
        const bp = borderParticles[i]
        bp.t    += bp.speed
        bp.life++
        if (bp.life > bp.maxLife) { borderParticles.splice(i, 1); continue }
        const ratio = bp.life / bp.maxLife
        const alpha = Math.sin(ratio * Math.PI) * 0.95

        const [bx, by] = perimeterToXY(bp.t, bp.offset)
        // Pulsing size
        const sz = bp.size * (0.8 + 0.2 * Math.sin(ratio * Math.PI * 3))

        const grad = bCtx.createRadialGradient(bx, by, 0, bx, by, sz * 2)
        grad.addColorStop(0,   `rgba(200,240,255,${alpha})`)
        grad.addColorStop(0.3, `rgba(80,160,255,${alpha * 0.8})`)
        grad.addColorStop(0.7, `rgba(20,80,220,${alpha * 0.4})`)
        grad.addColorStop(1,   `rgba(0,40,180,0)`)
        bCtx.beginPath()
        bCtx.arc(bx, by, sz * 2, 0, Math.PI * 2)
        bCtx.fillStyle = grad
        bCtx.fill()
      }

      // Draw the border glow line
      const BW = 2
      bCtx.strokeStyle = 'rgba(80,180,255,0.85)'
      bCtx.lineWidth   = BW
      bCtx.shadowBlur  = 24
      bCtx.shadowColor = 'rgba(50,150,255,0.9)'
      bCtx.strokeRect(0, 0, W, H)
      // Inner glow
      bCtx.strokeStyle = 'rgba(180,230,255,0.4)'
      bCtx.lineWidth   = 1
      bCtx.shadowBlur  = 10
      bCtx.strokeRect(4, 4, W-8, H-8)

      bCtx.restore()
    }

    /* ─────────────────────────────────────────────
       MAIN LOOP
    ───────────────────────────────────────────── */
    let blueRatio = 0

    const tick = () => {
      rafRef.current = requestAnimationFrame(tick)
      timeRef.current++
      const t = timeRef.current

      /* ── PHASE 1: red-orange fire ── */
      if (phaseRef.current === 'fire') {
        spawnParticle(0, 12)
        drawFire(t, 0)
        if (t > 130) { phaseRef.current = 'blue' }
      }

      /* ── PHASE 2: color transition orange → blue ── */
      else if (phaseRef.current === 'blue') {
        blueRatio = Math.min(1, blueRatio + 0.012)
        spawnParticle(blueRatio, 14)
        // Update existing particles' blue value gradually
        particles.forEach(p => { p.blue = Math.min(p.blue + 0.02, blueRatio) })
        drawFire(t, blueRatio)
        if (blueRatio >= 1 && t > 240) {
          phaseRef.current = 'lightning'
          particles.length = 0
        }
      }

      /* ── PHASE 3: blue lightning across screen ── */
      else if (phaseRef.current === 'lightning') {
        // Brief blue fire while lightning starts
        spawnParticle(1, 6)
        drawFire(t, 1)

        lightningTimer++
        // Spawn multiple bolts rapidly
        if (lightningTimer < 70 && lightningTimer % 5 === 0) spawnBolt()
        if (lightningTimer % 3 === 0 && BOLTS.length < 30)  spawnBolt()

        lCtx.clearRect(0, 0, lCanvas.width, lCanvas.height)
        for (let i = BOLTS.length - 1; i >= 0; i--) {
          const bolt = BOLTS[i]
          bolt.age++
          const alpha = Math.max(0, (1 - bolt.age / bolt.maxAge))
          if (alpha <= 0) { BOLTS.splice(i, 1); continue }
          lCtx.save()
          // Bright flash at origin
          if (bolt.age < 4) {
            lCtx.beginPath()
            lCtx.arc(bolt.x1, bolt.y1, 20 * alpha, 0, Math.PI * 2)
            const grd = lCtx.createRadialGradient(bolt.x1, bolt.y1, 0, bolt.x1, bolt.y1, 20)
            grd.addColorStop(0, `rgba(220,240,255,${alpha})`)
            grd.addColorStop(1, `rgba(30,120,255,0)`)
            lCtx.fillStyle = grd
            lCtx.fill()
          }
          drawBolt(lCtx, bolt.x1, bolt.y1, bolt.x2, bolt.y2, bolt.depth, alpha * 0.95, 1.5)
          lCtx.restore()
        }

        if (lightningTimer > 110) {
          phaseRef.current = 'tiles'
          lCtx.clearRect(0, 0, lCanvas.width, lCanvas.height)
          ctx.clearRect(0, 0, W, H)
          particles.length = 0
          gsap.to(img, { opacity: 1, duration: 0.3 })
        }
      }

      /* ── PHASE 4: tile reveal ── */
      else if (phaseRef.current === 'tiles') {
        tileTimer++
        // Reveal tiles with stagger
        if (tileTimer % 16 === 0 && tileIdx < tiles.length) {
          tiles[tileIdx].started = true
          tileIdx++
        }
        tiles.forEach((tile, idx) => {
          if (!tile.started) return
          if (tile.alpha >= 1) return
          tile.alpha = Math.min(1, tile.alpha + 0.055)
          const el = document.getElementById(`tile-${tile.row}-${tile.col}`)
          if (el) {
            el.style.opacity  = String(tile.alpha)
            // Slide in from corner direction
            const dist = (1 - tile.alpha) * 32
            el.style.transform = `translate(${tile.dx * dist}px, ${tile.dy * dist}px)`
          }
        })

        if (tileIdx >= tiles.length && tiles.every(tt => tt.alpha >= 1)) {
          phaseRef.current = 'border'
          borderActive = true
          gsap.to(border, { opacity: 1, duration: 0.6 })
        }
      }

      /* ── PHASE 5: blue fire border ── */
      else if (phaseRef.current === 'border') {
        if (borderActive) {
          // Spawn border particles generously
          for (let k = 0; k < 4; k++) spawnBorderParticle()
          drawBorderParticles()
        }
        // Run forever — living border
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(rafRef.current) }
  }, [])

  return (
    <div
      ref={wrapRef}
      className="relative mx-auto w-full"
      style={{ maxWidth: '606.4px', aspectRatio: '1 / 1' }}
    >

      {/* ── Full-screen lightning canvas ── */}
      <canvas ref={lightningRef} style={{
        position: 'fixed', inset: 0, zIndex: 9998,
        pointerEvents: 'none', mixBlendMode: 'screen',
        width: '100vw', height: '100vh',
      }} />

      {/* ── Dark base ── */}
      <div className="absolute inset-0 z-[1] rounded-2xl bg-[#050408]" />

      {/* ── Fire canvas ── */}
      <canvas ref={canvasRef} className="absolute inset-0 z-[5] h-full w-full rounded-2xl"
        style={{ mixBlendMode: 'screen' }} />

      {/* ── Image (6 tiles) ── */}
      <div ref={imgRef} className="absolute inset-0 z-[3] overflow-hidden rounded-2xl" style={{ opacity: 0 }}>
        {REVEAL_ORDER.map(([row, col]) => (
          <div key={`${row}-${col}`} id={`tile-${row}-${col}`}
            className="absolute overflow-hidden"
            style={{ width: '33.333%', height: '50%', left: `${col * 33.333}%`, top: `${row * 50}%`,
              opacity: 0, willChange: 'transform, opacity' }}>
            <div style={{
              position: 'absolute', width: '300%', height: '200%',
              left: `-${col * 100}%`, top: `-${row * 100}%`,
              backgroundImage: `url(${IMG_SRC})`,
              backgroundSize: 'cover', backgroundPosition: 'center',
            }} />
          </div>
        ))}
      </div>

      {/* ── Blue fire border container ── */}
      <div ref={borderRef} className="pointer-events-none absolute z-[15] rounded-2xl"
        style={{ inset: '-20px', opacity: 0 }}>
        {/* Canvas-drawn border fire particles */}
        <canvas ref={borderCanvasRef}
          className="absolute h-full w-full"
          style={{ top: 0, left: 0, mixBlendMode: 'screen' }} />
        {/* Corner energy orbs */}
        {(['top-[18px] left-[18px]','top-[18px] right-[18px]','bottom-[18px] left-[18px]','bottom-[18px] right-[18px]'] as const).map((pos) => (
          <div key={pos} className={`absolute ${pos} z-[16]`}
            style={{ width: 16, height: 16,
              background: 'radial-gradient(circle, rgba(220,240,255,1) 0%, rgba(80,160,255,0.8) 40%, rgba(20,80,220,0.3) 70%, transparent 100%)',
              borderRadius: '50%',
              boxShadow: '0 0 12px 4px rgba(80,160,255,0.8), 0 0 24px 8px rgba(20,80,220,0.4)',
              animation: 'cornerPulse 1.3s ease-in-out infinite',
            }} />
        ))}
      </div>
    </div>
  )
}

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
      // heroImgRef: animation handled inside FireRevealImage

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
        <main className="relative">

          {/* ── Decorative dot bg ── */}
          <div className="pointer-events-none absolute inset-0 opacity-30"
            style={{ backgroundImage: 'radial-gradient(#d8d0c8 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />
          <div className="deco-bg-blob pointer-events-none absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, rgba(194,101,42,0.18) 0%, transparent 70%)' }} />

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

              {/* Right — fire reveal image sequence */}
              <div ref={heroImgRef} style={{ opacity: 1 }}>
                <FireRevealImage />
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
      </PublicLayout>

      <style>{`
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes cornerPulse {
          0%,100% { transform: scale(1);   opacity: 0.85; }
          33%      { transform: scale(1.8); opacity: 1;    }
          66%      { transform: scale(1.3); opacity: 0.95; }
        }
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
