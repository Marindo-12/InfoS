import PublicLayout from '@/Layouts/PublicLayout'
import { Head, router } from '@inertiajs/react'
import { MapPinned } from 'lucide-react'
import React, { useState, useEffect, useRef } from 'react'
import type { SVGProps } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ContactFormData {
    [key: string]: string
    name: string
    email: string
    subject: string
    message: string
}

const FAQ_ITEMS = [
    {
        question: "Comment puis-je m'inscrire a une formation ?",
        answer: "Vous pouvez vous inscrire en ligne via notre formulaire ou nous rendre visite directement au centre pour etre accompagne.",
    },
    {
        question: 'Quels sont les prerequis pour les formations ?',
        answer: "Les prerequis dependent du programme choisi. Pour les langues, nous proposons plusieurs niveaux. Pour les preparations aux concours, un niveau scolaire adapte est recommande.",
    },
    {
        question: 'Les formations sont-elles certifiantes ?',
        answer: "Oui, selon le programme suivi, une attestation ou une certification peut etre delivree a la fin du parcours.",
    },
    {
        question: 'Quels moyens de paiement acceptez-vous ?',
        answer: 'Nous acceptons les paiements sur place et pouvons vous orienter selon la formule choisie.',
    },
]

const CONTACT_DETAILS = [
    {
        icon: 'location_on',
        title: 'Notre centre',
        lines: ['14 avenue Hassan II, 1er etage', 'Ville Nouvelle, Meknes, Maroc'],
        sub: null,
    },
    {
        icon: 'call',
        title: 'Telephone',
        lines: ['+212 5 35 40 29 32'],
        sub: 'Lun-Ven / 8h - 18h',
    },
    {
        icon: 'mail',
        title: 'Email',
        lines: ['contact@centreinformatique.ma'],
        sub: 'Inscriptions : inscription@centreinformatique.ma',
    },
]

function FacebookIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
            <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.019 4.388 11.008 10.125 11.927v-8.437H7.078v-3.49h3.047V9.41c0-3.017 1.792-4.683 4.533-4.683 1.313 0 2.686.235 2.686.235v2.963H15.83c-1.49 0-1.955.927-1.955 1.877v2.271h3.328l-.532 3.49h-2.796V24C19.612 23.081 24 18.092 24 12.073Z" />
        </svg>
    )
}

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
            <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.8A3.95 3.95 0 0 0 3.8 7.75v8.5a3.95 3.95 0 0 0 3.95 3.95h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5a3.95 3.95 0 0 0-3.95-3.95h-8.5Zm8.95 1.35a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2ZM12 6.85A5.15 5.15 0 1 1 6.85 12 5.16 5.16 0 0 1 12 6.85Zm0 1.8A3.35 3.35 0 1 0 15.35 12 3.35 3.35 0 0 0 12 8.65Z" />
        </svg>
    )
}

function XIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
            <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.847h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.153h7.594l5.243 6.932 6.064-6.932Zm-1.29 19.494h2.039L6.486 3.24H4.298l13.313 17.407Z" />
        </svg>
    )
}

function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
            <path d="M12.04 2C6.51 2 2.03 6.48 2.03 12c0 1.77.46 3.49 1.34 5.01L2 22l5.13-1.35A9.94 9.94 0 0 0 12.04 22c5.53 0 10.01-4.48 10.01-10S17.57 2 12.04 2Zm0 18.2a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.05.8.81-2.97-.2-.31A8.16 8.16 0 1 1 12.04 20.2Zm4.49-6.1c-.25-.12-1.47-.72-1.7-.8-.23-.09-.4-.12-.57.12-.16.25-.65.8-.79.97-.15.16-.29.19-.54.06-.25-.12-1.03-.38-1.97-1.2-.73-.65-1.22-1.45-1.36-1.7-.14-.24-.02-.37.1-.49.11-.1.25-.27.37-.4.12-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.07-.12-.57-1.37-.78-1.88-.21-.49-.42-.42-.57-.43l-.49-.01c-.16 0-.43.06-.66.31-.23.25-.87.85-.87 2.06 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.68 4.24 3.75.59.25 1.05.4 1.4.52.59.19 1.12.16 1.54.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.22-.16-.47-.28Z" />
        </svg>
    )
}

const SOCIAL_LINKS = [
    {
        name: 'Facebook',
        href: 'https://www.facebook.com/',
        icon: FacebookIcon,
        hoverClass: 'hover:border-[#1877F2] hover:text-[#1877F2]',
    },
    {
        name: 'Instagram',
        href: 'https://www.instagram.com/',
        icon: InstagramIcon,
        hoverClass: 'hover:border-[#E4405F] hover:text-[#E4405F]',
    },
    {
        name: 'Twitter',
        href: 'https://x.com/',
        icon: XIcon,
        hoverClass: 'hover:border-black hover:text-black',
    },
    {
        name: 'WhatsApp',
        href: 'https://wa.me/212535402932',
        icon: WhatsAppIcon,
        hoverClass: 'hover:border-[#25D366] hover:text-[#25D366]',
    },
]

// ─── Lightning Letter Cycler ──────────────────────────────────────────────────
const CYCLER_LETTERS = ['M', 'C', 'D', 'J', 'L', 'K']

function LightningLetterCycler() {
    const containerRef = useRef<HTMLDivElement>(null)
    const letterRef = useRef<HTMLSpanElement>(null)
    const svgRef = useRef<SVGSVGElement>(null)
    const tlRef = useRef<gsap.core.Timeline | null>(null)
    const idxRef = useRef(0)

    useEffect(() => {
        const container = containerRef.current
        const letterEl = letterRef.current
        const svgEl = svgRef.current
        if (!container || !letterEl || !svgEl) return

        // Build repeating lightning timeline
        const buildCycle = () => {
            const tl = gsap.timeline({
                repeat: -1,
                onRepeat: () => {
                    idxRef.current = (idxRef.current + 1) % CYCLER_LETTERS.length
                    letterEl.textContent = CYCLER_LETTERS[idxRef.current]
                },
            })

            // 1. Letter rests visible
            tl.to(letterEl, { duration: 1.6, opacity: 1 }, 0)

            // 2. Pre-flash: rapid flicker of the letter
            tl.to(letterEl, { opacity: 0.2, duration: 0.06 }, 1.6)
            tl.to(letterEl, { opacity: 1,   duration: 0.06 }, 1.66)
            tl.to(letterEl, { opacity: 0.1, duration: 0.04 }, 1.72)
            tl.to(letterEl, { opacity: 1,   duration: 0.04 }, 1.76)

            // 3. Lightning SVG bolt flash-in
            tl.fromTo(
                svgEl,
                { opacity: 0, scaleY: 0, transformOrigin: 'top center' },
                { opacity: 1, scaleY: 1, duration: 0.08, ease: 'power4.in' },
                1.8
            )
            // bolt stays briefly then disappears
            tl.to(svgEl, { opacity: 0, duration: 0.14, ease: 'power2.out' }, 1.92)

            // 4. White flash wipe
            tl.fromTo(
                container,
                { '--flash': '0' } as any,
                { '--flash': '1', duration: 0.05, ease: 'none' },
                1.82
            )
            tl.to(container, { '--flash': '0', duration: 0.25, ease: 'power2.out' }, 1.9)

            // 5. Letter exit (scale + blur)
            tl.to(letterEl, {
                scale: 1.25,
                opacity: 0,
                filter: 'blur(18px)',
                duration: 0.12,
                ease: 'power3.in',
            }, 1.82)

            // 6. New letter enters
            tl.fromTo(
                letterEl,
                { scale: 0.6, opacity: 0, filter: 'blur(30px)' },
                { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.55, ease: 'back.out(1.7)' },
                2.0
            )

            return tl
        }

        letterEl.textContent = CYCLER_LETTERS[0]
        gsap.set(letterEl, { opacity: 0 })
        gsap.set(svgEl, { opacity: 0 })

        // Delay first cycle start slightly
        const timeout = setTimeout(() => {
            gsap.to(letterEl, { opacity: 1, duration: 0.6 })
            tlRef.current = buildCycle()
        }, 1200)

        return () => {
            clearTimeout(timeout)
            tlRef.current?.kill()
        }
    }, [])

    return (
        <div
            ref={containerRef}
            className="pointer-events-none absolute right-[2%] top-[-8%] z-0 select-none overflow-hidden"
            style={{
                // CSS custom property trick for flash overlay
                ['--flash' as string]: '0',
            }}
        >
            {/* The giant letter */}
            <span
                ref={letterRef}
                className="font-display leading-none"
                style={{
                    fontSize: 'clamp(10rem, 16vw, 20rem)',
                    color: 'transparent',
                    WebkitTextStroke: '2px rgba(194,101,42,0.18)',
                    display: 'block',
                    lineHeight: 0.85,
                    letterSpacing: '-0.05em',
                    willChange: 'transform, opacity, filter',
                }}
                aria-hidden="true"
            />

            {/* Lightning bolt SVG */}
            <svg
                ref={svgRef}
                viewBox="0 0 80 220"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                    position: 'absolute',
                    top: '10%',
                    left: '30%',
                    width: '80px',
                    height: '220px',
                    filter: 'drop-shadow(0 0 18px #c2652a) drop-shadow(0 0 40px #fff8)',
                    willChange: 'transform, opacity',
                }}
                aria-hidden="true"
            >
                {/* Main bolt */}
                <polyline
                    points="52,4 24,92 48,92 18,216"
                    stroke="white"
                    strokeWidth="4"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                />
                {/* Glow copy */}
                <polyline
                    points="52,4 24,92 48,92 18,216"
                    stroke="#c2652a"
                    strokeWidth="9"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeOpacity="0.55"
                />
                {/* Secondary bolt branch */}
                <polyline
                    points="38,80 18,120 36,118"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeOpacity="0.7"
                />
                {/* Flash white fill overlay */}
                <rect
                    x="-20" y="-20" width="120" height="260"
                    fill="white"
                    opacity="0"
                    id="flashRect"
                    style={{ mixBlendMode: 'screen' }}
                />
            </svg>
        </div>
    )
}

// ─── Page-load curtain intro ──────────────────────────────────────────────────
function PageIntro({ onDone }: { onDone: () => void }) {
    const curtainRef = useRef<HTMLDivElement>(null)
    const lineRef = useRef<HTMLDivElement>(null)
    const textRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const tl = gsap.timeline({
            onComplete: onDone,
        })

        // Reveal the label text
        tl.fromTo(
            textRef.current,
            { opacity: 0, y: 30, letterSpacing: '2em' },
            { opacity: 1, y: 0, letterSpacing: '0.3em', duration: 0.9, ease: 'power3.out' },
            0.3
        )
        // Expand horizontal line
        tl.fromTo(
            lineRef.current,
            { scaleX: 0 },
            { scaleX: 1, duration: 0.6, ease: 'power2.inOut' },
            0.8
        )
        // Curtain slides up to reveal page
        tl.to(
            curtainRef.current,
            { yPercent: -100, duration: 0.9, ease: 'expo.inOut' },
            1.5
        )
    }, [onDone])

    return (
        <div
            ref={curtainRef}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                background: '#1a1410',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1.5rem',
                willChange: 'transform',
            }}
        >
            <div
                ref={textRef}
                style={{
                    fontFamily: 'var(--font-display, serif)',
                    fontSize: '0.7rem',
                    color: 'rgba(194,101,42,0.9)',
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                    opacity: 0,
                }}
            >
                Info Saloua
            </div>
            <div
                ref={lineRef}
                style={{
                    width: '120px',
                    height: '1px',
                    background: 'rgba(194,101,42,0.5)',
                    transformOrigin: 'center',
                    transform: 'scaleX(0)',
                }}
            />
        </div>
    )
}

// ─── Floating Input ───────────────────────────────────────────────────────────
function FloatingInput({
    id,
    label,
    type = 'text',
    value,
    onChange,
}: {
    id: string
    label: string
    type?: string
    value: string
    onChange: React.ChangeEventHandler<HTMLInputElement>
}) {
    const [focused, setFocused] = useState(false)
    const lifted = focused || value.length > 0

    return (
        <div className="relative">
            <input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder=" "
                className="block w-full border-0 border-b border-outline bg-transparent px-0 py-2 font-body text-lg text-on-surface transition-colors focus:border-primary focus:ring-0"
            />
            <label
                htmlFor={id}
                className="absolute left-0 font-display transition-all duration-300 pointer-events-none"
                style={{
                    top: lifted ? '-1.4rem' : '0.5rem',
                    fontSize: lifted ? '0.72rem' : '1.1rem',
                    color: lifted ? '#c2652a' : 'rgba(96,88,80,0.55)',
                    fontWeight: lifted ? 700 : 400,
                    letterSpacing: lifted ? '0.08em' : '0',
                    textTransform: lifted ? 'uppercase' : 'none',
                }}
            >
                {label}
            </label>
        </div>
    )
}

// ─── FAQ Item ─────────────────────────────────────────────────────────────────
function FaqItem({
    question,
    answer,
    open,
    onToggle,
}: {
    question: string
    answer: string
    open: boolean
    onToggle: () => void
}) {
    return (
        <div
            style={{
                borderTop: '1px solid rgba(194,101,42,0.15)',
                borderBottom: open ? '1px solid rgba(194,101,42,0.25)' : '1px solid transparent',
                transition: 'border-color 0.3s ease, background 0.3s ease',
                borderRadius: open ? '12px' : '0',
                background: open ? 'rgba(194,101,42,0.03)' : 'transparent',
                padding: '0 8px',
                marginBottom: '2px',
            }}
        >
            <button
                onClick={onToggle}
                className="group flex w-full items-center justify-between py-4 text-left focus:outline-none"
            >
                <div className="flex items-center gap-4 pr-4">
                    <span
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            border: open ? '1px solid rgba(194,101,42,0.6)' : '1px solid rgba(194,101,42,0.2)',
                            background: open ? 'rgba(194,101,42,0.08)' : 'transparent',
                            flexShrink: 0,
                            transition: 'all 0.3s ease',
                        }}
                    >
                        <span
                            style={{
                                width: '7px',
                                height: '7px',
                                borderRadius: '50%',
                                background: open ? '#c2652a' : 'rgba(194,101,42,0.3)',
                                transition: 'background 0.3s ease',
                            }}
                        />
                    </span>
                    <span className="font-display text-xl text-on-surface transition-colors group-hover:text-primary">
                        {question}
                    </span>
                </div>
                <span
                    className="material-symbols-outlined shrink-0 text-primary transition-transform duration-300"
                    style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
                >
                    expand_more
                </span>
            </button>
            <div
                style={{
                    maxHeight: open ? '280px' : '0',
                    overflow: 'hidden',
                    transition: 'max-height .35s ease, opacity .3s ease',
                    opacity: open ? 1 : 0,
                }}
            >
                <p className="pb-5 pl-10 pt-0 font-light leading-relaxed text-on-surface-variant">
                    {answer}
                </p>
            </div>
        </div>
    )
}

// ─── Main Contact Page ────────────────────────────────────────────────────────
const Contact: React.FC = () => {
    const [formData, setFormData] = useState<ContactFormData>({
        name: '',
        email: '',
        subject: 'inscription',
        message: '',
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
    const [openIndex, setOpenIndex] = useState<number | null>(0)
    const [showIntro, setShowIntro] = useState(true)

    // ── Refs for GSAP targets ──
    const heroTaglineRef = useRef<HTMLDivElement>(null)
    const heroH1Ref = useRef<HTMLHeadingElement>(null)
    const heroParaRef = useRef<HTMLParagraphElement>(null)
    const contactCardsRef = useRef<HTMLDivElement>(null)
    const formCardRef = useRef<HTMLDivElement>(null)
    const hoursRef = useRef<HTMLElement>(null)
    const faqRef = useRef<HTMLElement>(null)
    const mapRef = useRef<HTMLElement>(null)
    const socialRef = useRef<HTMLDivElement>(null)

    // ── Post-intro: fire page animations ──
    useEffect(() => {
        if (showIntro) return

        const ctx = gsap.context(() => {
            // ── Hero section stagger ──
            const heroTl = gsap.timeline({ delay: 0.1 })

            heroTl.fromTo(
                heroTaglineRef.current,
                { opacity: 0, x: -40 },
                { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' }
            )
            heroTl.fromTo(
                heroH1Ref.current,
                { opacity: 0, y: 60, skewY: 4 },
                { opacity: 1, y: 0, skewY: 0, duration: 1, ease: 'expo.out' },
                '-=0.4'
            )
            heroTl.fromTo(
                heroParaRef.current,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
                '-=0.5'
            )

            // ── Contact cards: stagger from left ──
            const cards = contactCardsRef.current?.querySelectorAll('.contact-detail-item')
            if (cards) {
                ScrollTrigger.create({
                    trigger: contactCardsRef.current,
                    start: 'top 80%',
                    onEnter: () => {
                        gsap.fromTo(
                            cards,
                            { opacity: 0, x: -50 },
                            { opacity: 1, x: 0, stagger: 0.18, duration: 0.7, ease: 'power3.out' }
                        )
                    },
                })
            }

            // ── Social icons: pop in ──
            const icons = socialRef.current?.querySelectorAll('a')
            if (icons) {
                ScrollTrigger.create({
                    trigger: socialRef.current,
                    start: 'top 85%',
                    onEnter: () => {
                        gsap.fromTo(
                            icons,
                            { opacity: 0, scale: 0, rotation: -30 },
                            { opacity: 1, scale: 1, rotation: 0, stagger: 0.09, duration: 0.5, ease: 'back.out(2)' }
                        )
                    },
                })
            }

            // ── Form card: slide up with clip-path ──
            ScrollTrigger.create({
                trigger: formCardRef.current,
                start: 'top 75%',
                onEnter: () => {
                    gsap.fromTo(
                        formCardRef.current,
                        { opacity: 0, y: 80, clipPath: 'inset(100% 0% 0% 0%)' },
                        { opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'expo.out' }
                    )
                },
            })

            // ── Hours: draw border-left lines ──
            if (hoursRef.current) {
                const lines = hoursRef.current.querySelectorAll('.hours-line')
                ScrollTrigger.create({
                    trigger: hoursRef.current,
                    start: 'top 80%',
                    onEnter: () => {
                        gsap.fromTo(
                            hoursRef.current,
                            { opacity: 0, y: 40 },
                            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
                        )
                        gsap.fromTo(
                            lines,
                            { scaleY: 0, transformOrigin: 'top center' },
                            { scaleY: 1, stagger: 0.12, duration: 0.6, ease: 'power2.out', delay: 0.3 }
                        )
                    },
                })
            }

            // ── FAQ: cascade in ──
            if (faqRef.current) {
                const faqItems = faqRef.current.querySelectorAll('.faq-item')
                ScrollTrigger.create({
                    trigger: faqRef.current,
                    start: 'top 80%',
                    onEnter: () => {
                        gsap.fromTo(
                            faqItems,
                            { opacity: 0, y: 30, x: 20 },
                            { opacity: 1, y: 0, x: 0, stagger: 0.1, duration: 0.6, ease: 'power2.out' }
                        )
                    },
                })
            }

            // ── Map: scale from center ──
            if (mapRef.current) {
                ScrollTrigger.create({
                    trigger: mapRef.current,
                    start: 'top 80%',
                    onEnter: () => {
                        gsap.fromTo(
                            mapRef.current,
                            { opacity: 0, scale: 0.88, borderRadius: '4rem' },
                            { opacity: 1, scale: 1, borderRadius: '2rem', duration: 1.2, ease: 'expo.out' }
                        )
                    },
                })
            }

            // ── Parallax on decorative blobs ──
            gsap.utils.toArray<Element>('.contact-blob').forEach((blob, i) => {
                gsap.to(blob, {
                    yPercent: i % 2 === 0 ? -20 : 20,
                    ease: 'none',
                    scrollTrigger: {
                        scrub: 1.5,
                    },
                })
            })
        })

        return () => ctx.revert()
    }, [showIntro])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value } = e.target
        setFormData((prev) => ({ ...prev, [id]: value }))
    }

    const validateForm = (): string | null => {
        if (!formData.name.trim()) return 'Veuillez entrer votre nom complet.'
        if (!formData.email.trim()) return 'Veuillez entrer votre adresse email.'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Adresse email invalide.'
        if (!formData.message.trim()) return 'Veuillez ecrire votre message.'
        return null
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const error = validateForm()

        if (error) {
            setSubmitStatus({ type: 'error', message: error })
            setTimeout(() => setSubmitStatus(null), 4000)
            return
        }

        setIsSubmitting(true)
        router.post(route('contact.send'), formData, {
            preserveScroll: true,
            onSuccess: () => {
                setSubmitStatus({
                    type: 'success',
                    message: 'Message envoye avec succes. Nous vous repondrons rapidement.',
                })
                setFormData({ name: '', email: '', subject: 'inscription', message: '' })
                setTimeout(() => setSubmitStatus(null), 5000)
            },
            onError: (errors) => {
                const message =
                    errors.contact || errors.name || errors.email || errors.subject || errors.message ||
                    'Une erreur est survenue. Veuillez reessayer.'
                setSubmitStatus({ type: 'error', message })
                setTimeout(() => setSubmitStatus(null), 5000)
            },
            onFinish: () => setIsSubmitting(false),
        })
    }

    return (
        <>
            <Head title="Contact | Centre Informatique" />
            <PublicLayout>
                <style>{`
                    @keyframes floatA {
                        0%,100% { transform: translateY(0) rotate(0deg); }
                        50% { transform: translateY(-14px) rotate(8deg); }
                    }
                    @keyframes floatB {
                        0%,100% { transform: translateY(0) rotate(0deg); }
                        50% { transform: translateY(-10px) rotate(-6deg); }
                    }
                    .contact-subtle-pattern {
                        background-color: #faf5ee;
                        background-image: radial-gradient(#d8d0c8 0.5px, transparent 0.5px);
                        background-size: 32px 32px;
                    }
                    .contact-blob {
                        position: absolute;
                        filter: blur(60px);
                        opacity: 0.08;
                        pointer-events: none;
                        will-change: transform;
                    }
                    .contact-geometric-line {
                        position: absolute;
                        background: #c2652a;
                        opacity: 0.15;
                        pointer-events: none;
                    }
                `}</style>

                {showIntro && <PageIntro onDone={() => setShowIntro(false)} />}

                <main className="relative isolate overflow-hidden bg-background pt-24">
                    <div className="contact-subtle-pattern pointer-events-none absolute inset-0 z-[-2]" />
                    <div className="contact-blob right-[-200px] top-[-100px] z-[-1] h-[600px] w-[600px] rounded-full bg-primary" />
                    <div className="contact-blob right-[-100px] top-[40%] z-[-1] h-[400px] w-[400px] rounded-full bg-on-surface-variant" />
                    <div className="contact-geometric-line left-0 top-1/4 h-px w-full z-[-1]" />
                    <div className="contact-geometric-line left-[60%] top-0 h-full w-px z-[-1]" />
                    <div className="contact-geometric-line right-0 top-40 h-px w-1/3 z-[-1]" />
                    <div className="contact-geometric-line right-[10%] top-20 h-64 w-px z-[-1]" />
                    <div className="contact-geometric-line bottom-[20%] left-0 h-px w-64 z-[-1]" />
                    <div className="pointer-events-none absolute right-[5%] top-[10%] z-[-1] h-96 w-96 rounded-full border border-primary/10" />
                    <div className="pointer-events-none absolute right-[2%] top-[15%] z-[-1] h-[500px] w-[500px] rounded-full border border-on-surface/5" />
                    <div
                        className="pointer-events-none absolute left-12 top-24 z-[-1] h-24 w-24 rounded-full border border-on-surface/5"
                        style={{ animation: 'floatA 8s ease-in-out infinite' }}
                    />
                    <div
                        className="pointer-events-none absolute right-24 top-[60%] z-[-1] h-48 w-48 rounded-full border border-primary/10"
                        style={{ animation: 'floatB 11s ease-in-out infinite' }}
                    />

                    {/* ── HERO SECTION ── */}
                    <section className="relative px-8 pb-24 overflow-hidden">
                        {/* Lightning letter cycler — right side of hero */}
                        <LightningLetterCycler />

                        <div className="relative z-10 mx-auto max-w-7xl text-center md:text-left">
                            <div ref={heroTaglineRef} className="mb-6 flex items-center justify-center gap-4 md:justify-start" style={{ opacity: 0 }}>
                                <span className="h-px w-12 bg-primary" />
                                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                                    Prenez contact
                                </span>
                            </div>
                            <h1
                                ref={heroH1Ref}
                                className="font-display text-7xl leading-[0.9] tracking-tighter text-on-surface md:text-9xl"
                                style={{ opacity: 0 }}
                            >
                                Contactez-<span className="font-normal italic text-primary">Nous</span>
                            </h1>
                            <p
                                ref={heroParaRef}
                                className="mt-8 max-w-2xl text-xl font-light leading-relaxed text-on-surface-variant"
                                style={{ opacity: 0 }}
                            >
                                Lancez votre parcours d'apprentissage. Notre equipe est la pour vous guider a chaque etape de votre experience au Centre Informatique.
                            </p>
                        </div>
                    </section>

                    {/* ── CONTACT INFO + FORM ── */}
                    <section className="relative mx-auto max-w-7xl px-8 pb-40">
                        <div className="absolute bottom-0 top-0 -left-4 hidden w-px bg-on-surface/5 lg:block" />

                        <div className="relative z-10 grid grid-cols-1 items-start gap-16 lg:grid-cols-12">
                            {/* Left col */}
                            <div className="space-y-16 lg:col-span-5">
                                <div className="space-y-12">
                                    <h2 className="inline-block border-b border-outline pb-4 font-display text-4xl text-on-surface">
                                        Entrer en contact
                                    </h2>
                                    <div ref={contactCardsRef} className="space-y-10">
                                        {CONTACT_DETAILS.map((item) => (
                                            <div key={item.title} className="contact-detail-item flex items-start gap-8" style={{ opacity: 0 }}>
                                                <div className="mt-1 shrink-0 text-primary">
                                                    <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>
                                                        {item.icon}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h4 className="mb-2 font-display text-xl text-on-surface">{item.title}</h4>
                                                    {item.lines.map((line) => (
                                                        <p key={line} className="font-light leading-relaxed text-on-surface-variant">
                                                            {line}
                                                        </p>
                                                    ))}
                                                    {item.sub && (
                                                        <p className="mt-1 text-xs uppercase tracking-widest text-primary/60">
                                                            {item.sub}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div ref={socialRef} className="border-t border-outline pt-12">
                                    <h4 className="mb-6 font-label text-xs font-bold uppercase tracking-[0.2em] text-on-surface">
                                        Presence numerique
                                    </h4>
                                    <div className="flex gap-6">
                                        {SOCIAL_LINKS.map(({ name, href, icon: Icon, hoverClass }) => (
                                            <a
                                                key={name}
                                                href={href}
                                                target="_blank"
                                                rel="noreferrer"
                                                aria-label={name}
                                                className={`flex h-10 w-10 items-center justify-center rounded-full border border-outline/50 text-on-surface-variant transition-colors duration-300 ${hoverClass}`}
                                                style={{ opacity: 0 }}
                                            >
                                                <Icon className="h-[18px] w-[18px]" />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right col — form */}
                            <div className="relative lg:col-span-7">
                                <div
                                    ref={formCardRef}
                                    className="relative overflow-hidden rounded-3xl border-2 border-outline-variant/60 p-10 shadow-sm md:p-16"
                                    style={{
                                        background: 'rgba(255,255,255,0.85)',
                                        backdropFilter: 'blur(12px)',
                                        opacity: 0,
                                        clipPath: 'inset(100% 0% 0% 0%)',
                                    }}
                                >
                                    <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-primary/5" />

                                    {submitStatus && (
                                        <div
                                            className={`mb-10 rounded-xl border p-4 text-sm font-medium ${
                                                submitStatus.type === 'success'
                                                    ? 'border-green-200 bg-green-50 text-green-800'
                                                    : 'border-red-200 bg-red-50 text-red-800'
                                            }`}
                                        >
                                            {submitStatus.message}
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit} className="relative z-10 space-y-12">
                                        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
                                            <FloatingInput id="name" label="Nom complet" value={formData.name} onChange={handleChange} />
                                            <FloatingInput id="email" label="Adresse email" type="email" value={formData.email} onChange={handleChange} />
                                        </div>

                                        <div className="relative">
                                            <label htmlFor="subject" className="absolute -top-6 left-0 text-[10px] font-bold uppercase tracking-widest text-primary">
                                                Sujet de la demande
                                            </label>
                                            <select
                                                id="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                className="block w-full appearance-none cursor-pointer border-0 border-b border-outline bg-transparent px-0 py-2 font-display text-lg text-on-surface transition-colors focus:border-primary focus:ring-0"
                                            >
                                                <option value="inscription">Demande d'inscription</option>
                                                <option value="information">Demande d'information</option>
                                                <option value="partnership">Partenariat</option>
                                                <option value="other">Autre</option>
                                            </select>
                                            <span className="material-symbols-outlined pointer-events-none absolute right-0 top-2 text-outline">expand_more</span>
                                        </div>

                                        <div className="relative">
                                            <label htmlFor="message" className="absolute -top-6 left-0 text-[10px] font-bold uppercase tracking-widest text-primary">
                                                Message
                                            </label>
                                            <textarea
                                                id="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                rows={4}
                                                placeholder="Votre message pour notre equipe..."
                                                className="block w-full resize-none border-0 border-b border-outline bg-transparent px-0 py-4 font-body text-base text-on-surface transition-colors placeholder:text-on-surface-variant/30 focus:border-primary focus:ring-0"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="group flex w-full items-center justify-center gap-3 rounded-xl bg-on-surface py-5 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-sm transition-all duration-500 hover:bg-primary hover:shadow-lg hover:shadow-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            <span>{isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}</span>
                                            <span className="material-symbols-outlined transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1">
                                                north_east
                                            </span>
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── HOURS ── */}
                    <section ref={hoursRef} className="mx-auto max-w-7xl px-8 pb-20" style={{ opacity: 0 }}>
                        <div
                            className="rounded-3xl border border-outline-variant/50 p-12"
                            style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)' }}
                        >
                            <h3 className="mb-4 font-display text-4xl text-on-surface">Horaires d'ouverture</h3>
                            <p className="max-w-lg text-lg font-light leading-relaxed text-on-surface-variant">
                                Nos bureaux administratifs sont ouverts aux horaires suivants pour les demandes sur place et le depot de documents.
                            </p>
                            <div className="mt-12 flex flex-col gap-8 sm:flex-row">
                                <div className="hours-line flex-1 border-l-2 border-primary pl-6">
                                    <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Jours ouvres</span>
                                    <span className="font-display text-2xl text-on-surface">08:00 - 18:00</span>
                                </div>
                                <div className="hours-line flex-1 border-l-2 border-outline pl-6">
                                    <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/40">Samedi</span>
                                    <span className="font-display text-2xl text-on-surface-variant/40">09:00 - 13:00</span>
                                </div>
                                <div className="hours-line flex-1 border-l-2 border-outline pl-6">
                                    <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/40">Dimanche</span>
                                    <span className="font-display text-2xl text-on-surface-variant/40">Ferme</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── FAQ ── */}
                    <section ref={faqRef} className="mx-auto max-w-7xl px-8 pb-40">
                        <div className="mb-8 flex flex-col items-start gap-2">
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <span className="material-symbols-outlined">help_center</span>
                                </div>
                                <h2 className="font-display text-3xl text-on-surface">Foire aux questions</h2>
                            </div>
                            <p className="max-w-2xl font-light text-on-surface-variant">
                                Retrouvez les reponses aux questions les plus frequemment posees par nos etudiants.
                            </p>
                        </div>

                        <div
                            className="rounded-3xl border border-outline-variant/50 p-6 md:p-10"
                            style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)' }}
                        >
                            <div className="space-y-0" style={{ borderBottom: "1px solid rgba(194,101,42,0.15)" }}>
                                {FAQ_ITEMS.map((item, idx) => (
                                    <div key={item.question} className="faq-item" style={{ opacity: 0 }}>
                                        <FaqItem
                                            question={item.question}
                                            answer={item.answer}
                                            open={openIndex === idx}
                                            onToggle={() => setOpenIndex(openIndex === idx ? null : idx)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ── MAP ── */}
                    <section ref={mapRef} className="px-8 pb-28" style={{ opacity: 0 }}>
                        <div className="relative mx-auto min-h-[650px] max-w-7xl overflow-hidden rounded-[2rem] border border-outline-variant/50 shadow-xl">
                            <iframe
                                title="Google Maps - Centre Info Saloua"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3363.3817475211786!2d-5.551918!3d33.8989909!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda044d7681c614f%3A0xadc5091a2390fd77!2scentre%20info%20saloua!5e1!3m2!1sfr!2sma!4v1777009081285!5m2!1sfr!2sma"
                                className="absolute inset-0 h-full w-full border-0"
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                allowFullScreen
                            />
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-surface-container-lowest/70 via-transparent to-on-surface/15" />

                            <div
                                className="absolute left-6 right-6 top-6 rounded-3xl border border-outline p-8 shadow-xl md:left-10 md:right-auto md:max-w-md md:p-10"
                                style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)' }}
                            >
                                <div className="mb-4 flex items-center gap-3 text-primary">
                                    <MapPinned size={22} strokeWidth={1.9} />
                                    <span className="text-[10px] font-bold uppercase tracking-[0.25em]">Localisation</span>
                                </div>
                                <h4 className="mb-4 font-display text-3xl text-on-surface">Centre Info Saloua</h4>
                                <p className="mb-6 text-sm font-light leading-relaxed text-on-surface-variant">
                                    Retrouvez le centre directement sur Google Maps et ouvrez l'itineraire en un clic pour un acces rapide.
                                </p>
                                <p className="mb-8 text-sm leading-relaxed text-on-surface">
                                    14 avenue Hassan II, 1er etage, Ville Nouvelle, Meknes, Maroc
                                </p>
                                <a
                                    href="https://www.google.com/maps/search/?api=1&query=33.8989909,-5.551918"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="group inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-on-surface"
                                >
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white transition-colors group-hover:bg-on-surface">
                                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>directions</span>
                                    </span>
                                    Obtenir l'itineraire
                                </a>
                            </div>
                        </div>
                    </section>
                </main>
            </PublicLayout>
        </>
    )
}

export default Contact