import PublicLayout from '@/Layouts/PublicLayout'
import { Head, router } from '@inertiajs/react'
import { MapPinned } from 'lucide-react'
import React, { useState } from 'react'
import type { SVGProps } from 'react'

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
        <div className="border-b border-outline/40 pb-4 last:border-0">
            <button
                onClick={onToggle}
                className="group flex w-full items-center justify-between py-2 text-left focus:outline-none"
            >
                <span className="pr-4 font-display text-xl text-on-surface transition-colors group-hover:text-primary">
                    {question}
                </span>
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
                <p className="pb-4 pt-1 font-light leading-relaxed text-on-surface-variant">
                    {answer}
                </p>
            </div>
        </div>
    )
}

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
                const message = errors.contact
                    || errors.name
                    || errors.email
                    || errors.subject
                    || errors.message
                    || 'Une erreur est survenue. Veuillez reessayer.'

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
                `}</style>

                <main className="relative overflow-hidden bg-surface-container-lowest pt-24">
                    <div
                        className="pointer-events-none absolute left-12 top-24 h-24 w-24 rounded-full border border-on-surface/5"
                        style={{ animation: 'floatA 8s ease-in-out infinite' }}
                    />
                    <div
                        className="pointer-events-none absolute right-24 top-[60%] h-48 w-48 rounded-full border border-primary/10"
                        style={{ animation: 'floatB 11s ease-in-out infinite' }}
                    />
                    <div
                        className="pointer-events-none absolute left-[3%] top-[10%] select-none font-display leading-none"
                        style={{ fontSize: '22rem', color: 'rgba(194,101,42,0.04)' }}
                        aria-hidden="true"
                    >
                        C
                    </div>

                    <section className="relative px-8 pb-24">
                        <div className="relative z-10 mx-auto max-w-7xl text-center md:text-left">
                            <div className="mb-6 flex items-center justify-center gap-4 md:justify-start">
                                <span className="h-px w-12 bg-primary" />
                                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                                    Prenez contact
                                </span>
                            </div>
                            <h1 className="font-display text-7xl leading-[0.9] tracking-tighter text-on-surface md:text-9xl">
                                Contactez-<span className="font-normal italic text-primary">Nous</span>
                            </h1>
                            <p className="mt-8 max-w-2xl text-xl font-light leading-relaxed text-on-surface-variant">
                                Lancez votre parcours d'apprentissage. Notre equipe est la pour vous guider a chaque etape de votre experience au Centre Informatique.
                            </p>
                        </div>
                    </section>

                    <section className="relative mx-auto max-w-7xl px-8 pb-40">
                        <div className="absolute bottom-0 top-0 -left-4 hidden w-px bg-on-surface/5 lg:block" />

                        <div className="relative z-10 grid grid-cols-1 items-start gap-16 lg:grid-cols-12">
                            <div className="space-y-16 lg:col-span-5">
                                <div className="space-y-12">
                                    <h2 className="inline-block border-b border-outline pb-4 font-display text-4xl text-on-surface">
                                        Entrer en contact
                                    </h2>
                                    <div className="space-y-10">
                                        {CONTACT_DETAILS.map((item) => (
                                            <div key={item.title} className="flex items-start gap-8">
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

                                <div className="border-t border-outline pt-12">
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
                                            >
                                                <Icon className="h-[18px] w-[18px]" />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="relative lg:col-span-7">
                                <div
                                    className="relative overflow-hidden rounded-3xl border-2 border-outline-variant/60 p-10 shadow-sm md:p-16"
                                    style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)' }}
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
                                            <FloatingInput
                                                id="name"
                                                label="Nom complet"
                                                value={formData.name}
                                                onChange={handleChange}
                                            />
                                            <FloatingInput
                                                id="email"
                                                label="Adresse email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="relative">
                                            <label
                                                htmlFor="subject"
                                                className="absolute -top-6 left-0 text-[10px] font-bold uppercase tracking-widest text-primary"
                                            >
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
                                            <span className="material-symbols-outlined pointer-events-none absolute right-0 top-2 text-outline">
                                                expand_more
                                            </span>
                                        </div>

                                        <div className="relative">
                                            <label
                                                htmlFor="message"
                                                className="absolute -top-6 left-0 text-[10px] font-bold uppercase tracking-widest text-primary"
                                            >
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

                    <section className="mx-auto max-w-7xl px-8 pb-20">
                        <div
                            className="rounded-3xl border border-outline-variant/50 p-12"
                            style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)' }}
                        >
                            <h3 className="mb-4 font-display text-4xl text-on-surface">Horaires d'ouverture</h3>
                            <p className="max-w-lg text-lg font-light leading-relaxed text-on-surface-variant">
                                Nos bureaux administratifs sont ouverts aux horaires suivants pour les demandes sur place et le depot de documents.
                            </p>
                            <div className="mt-12 flex flex-col gap-8 sm:flex-row">
                                <div className="flex-1 border-l-2 border-primary pl-6">
                                    <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                                        Jours ouvres
                                    </span>
                                    <span className="font-display text-2xl text-on-surface">08:00 - 18:00</span>
                                </div>
                                <div className="flex-1 border-l-2 border-outline pl-6">
                                    <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/40">
                                        Samedi
                                    </span>
                                    <span className="font-display text-2xl text-on-surface-variant/40">09:00 - 13:00</span>
                                </div>
                                <div className="flex-1 border-l-2 border-outline pl-6">
                                    <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/40">
                                        Dimanche
                                    </span>
                                    <span className="font-display text-2xl text-on-surface-variant/40">Ferme</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mx-auto max-w-7xl px-8 pb-40">
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
                            <div className="space-y-5">
                                {FAQ_ITEMS.map((item, idx) => (
                                    <FaqItem
                                        key={item.question}
                                        question={item.question}
                                        answer={item.answer}
                                        open={openIndex === idx}
                                        onToggle={() => setOpenIndex(openIndex === idx ? null : idx)}
                                    />
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="px-8 pb-28">
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
                                    <span className="text-[10px] font-bold uppercase tracking-[0.25em]">
                                        Localisation
                                    </span>
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
                                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                                            directions
                                        </span>
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
