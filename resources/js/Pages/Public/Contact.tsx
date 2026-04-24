import PublicLayout from '@/Layouts/PublicLayout'
import { Head } from '@inertiajs/react'
import React, { useState } from 'react'

/* ─────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────── */
interface FormData {
    name:    string
    email:   string
    subject: string
    message: string
}

const FAQ_ITEMS = [
    {
        question: "Comment puis-je m'inscrire à une formation ?",
        answer:   "Vous pouvez vous inscrire directement en ligne via notre formulaire d'inscription, ou nous rendre visite au centre pour un entretien d'orientation gratuit. Nos conseillers vous guideront pas à pas.",
    },
    {
        question: "Quels sont les prérequis pour intégrer la préparation aux concours ?",
        answer:   "Pour les concours nationaux (médecine, ENCG, ENSA…), un niveau baccalauréat est requis. Pour les formations linguistiques, aucun prérequis spécifique — nous proposons des niveaux débutant à avancé.",
    },
    {
        question: "Les formations sont-elles certifiantes ?",
        answer:   "Oui, chaque formation donne lieu à une attestation de compétences ou à une certification reconnue par nos partenaires, selon le programme choisi.",
    },
    {
        question: "Proposez-vous des cours en ligne ?",
        answer:   "Nous privilégions l'enseignement en présentiel pour une meilleure immersion, mais certains programmes (bureautique, design) sont accessibles en format hybride sur demande.",
    },
    {
        question: "Quels sont les modes de paiement acceptés ?",
        answer:   "Nous acceptons les paiements par carte bancaire, virement, chèque ou espèces. Des facilités de paiement sont possibles pour les packs privilèges.",
    },
]

/* ─────────────────────────────────────────────────────────
   Composant FloatingInput
   Label qui monte quand le champ est focus ou rempli
───────────────────────────────────────────────────────── */
function FloatingInput({
    id, label, type = 'text', value, onChange,
}: {
    id: string; label: string; type?: string
    value: string; onChange: React.ChangeEventHandler<HTMLInputElement>
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
                className="block w-full px-0 py-2 bg-transparent border-0 border-b border-outline
                           focus:ring-0 focus:border-primary transition-colors
                           font-body text-on-surface text-lg"
            />
            <label
                htmlFor={id}
                className="absolute left-0 pointer-events-none transition-all duration-300 font-display"
                style={{
                    top:       lifted ? '-1.4rem' : '0.5rem',
                    fontSize:  lifted ? '0.72rem' : '1.1rem',
                    color:     lifted ? '#c2652a' : 'rgba(96,88,80,0.55)',
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

/* ─────────────────────────────────────────────────────────
   Composant FaqItem
───────────────────────────────────────────────────────── */
function FaqItem({ question, answer, open, onToggle }: {
    question: string; answer: string; open: boolean; onToggle: () => void
}) {
    return (
        <div className="border-b border-outline/40 pb-4 last:border-0">
            <button
                onClick={onToggle}
                className="w-full flex justify-between items-center text-left group focus:outline-none py-2"
            >
                <span className="font-display text-lg text-on-surface group-hover:text-primary transition-colors pr-4">
                    {question}
                </span>
                <span
                    className="material-symbols-outlined text-primary shrink-0 transition-transform duration-300"
                    style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
                >
                    expand_more
                </span>
            </button>
            {/* Hauteur max animée — évite le problème de hidden/block avec CSS */}
            <div
                style={{
                    maxHeight:  open ? '300px' : '0',
                    overflow:   'hidden',
                    transition: 'max-height .35s ease, opacity .3s ease',
                    opacity:    open ? 1 : 0,
                }}
            >
                <p className="pb-4 pt-1 text-on-surface-variant text-base leading-relaxed font-light">
                    {answer}
                </p>
            </div>
        </div>
    )
}

/* ─────────────────────────────────────────────────────────
   Page Contact
───────────────────────────────────────────────────────── */
const Contact: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        name: '', email: '', subject: 'inscription', message: '',
    })
    const [isSubmitting, setIsSubmitting]   = useState(false)
    const [submitStatus, setSubmitStatus]   = useState<{ type: 'success' | 'error'; message: string } | null>(null)
    const [openIndex, setOpenIndex]         = useState<number | null>(0)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value } = e.target
        setFormData(prev => ({ ...prev, [id]: value }))
    }

    const validateForm = (): string | null => {
        if (!formData.name.trim())    return 'Veuillez entrer votre nom complet.'
        if (!formData.email.trim())   return 'Veuillez entrer votre adresse email.'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Adresse email invalide.'
        if (!formData.message.trim()) return 'Veuillez écrire votre message.'
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
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))
            setSubmitStatus({ type: 'success', message: 'Message envoyé avec succès ! Nous vous répondrons rapidement.' })
            setFormData({ name: '', email: '', subject: 'inscription', message: '' })
            setTimeout(() => setSubmitStatus(null), 5000)
        } catch {
            setSubmitStatus({ type: 'error', message: 'Une erreur est survenue. Veuillez réessayer.' })
            setTimeout(() => setSubmitStatus(null), 4000)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <Head title="Contact — Centre Informatique" />
            <PublicLayout>

                <style>{`
                    @keyframes floatA {
                        0%,100% { transform: translateY(0) rotate(0deg); }
                        50%     { transform: translateY(-14px) rotate(8deg); }
                    }
                    @keyframes floatB {
                        0%,100% { transform: translateY(0) rotate(0deg); }
                        50%     { transform: translateY(-10px) rotate(-6deg); }
                    }
                    @keyframes pingCustom {
                        0%   { transform: scale(1);   opacity: .6; }
                        70%  { transform: scale(1.8); opacity: 0;  }
                        100% { transform: scale(1.8); opacity: 0;  }
                    }
                `}</style>

                <main className="relative bg-surface-container-lowest pt-24 overflow-hidden">

                    {/* ── Décorations de fond ── */}
                    <div
                        className="absolute top-24 left-12 w-24 h-24 border border-on-surface/5 rounded-full pointer-events-none"
                        style={{ animation: 'floatA 8s ease-in-out infinite' }}
                    />
                    <div
                        className="absolute top-[60%] right-24 w-48 h-48 border border-primary/10 rounded-full pointer-events-none"
                        style={{ animation: 'floatB 11s ease-in-out infinite' }}
                    />
                    {/* Grand C watermark */}
                    <div
                        className="absolute top-[10%] left-[3%] font-display leading-none pointer-events-none select-none"
                        style={{ fontSize: '22rem', color: 'rgba(194,101,42,0.04)' }}
                        aria-hidden="true"
                    >
                        C
                    </div>

                    {/* ════════════════════════════════════════
                        HERO
                    ════════════════════════════════════════ */}
                    <section className="relative pb-24 px-8">
                        <div className="max-w-7xl mx-auto relative z-10 text-center md:text-left">
                            <div className="flex items-center gap-4 mb-6 justify-center md:justify-start">
                                <span className="h-px w-12 bg-primary" />
                                <span className="text-primary font-semibold tracking-[0.3em] uppercase text-xs">
                                    Prenez contact
                                </span>
                            </div>
                            <h1 className="font-display text-7xl md:text-9xl text-on-surface tracking-tighter leading-[0.9]">
                                Contactez-<span className="italic text-primary font-normal">Nous</span>
                            </h1>
                            <p className="mt-8 text-xl text-on-surface-variant max-w-2xl font-light leading-relaxed">
                                Lancez-vous dans votre parcours d'apprentissage. Notre équipe est là pour vous guider à chaque étape de votre expérience au Centre Informatique.
                            </p>
                        </div>
                    </section>

                    {/* ════════════════════════════════════════
                        GRILLE CONTACT
                    ════════════════════════════════════════ */}
                    <section className="max-w-7xl mx-auto px-8 pb-40 relative">
                        <div className="absolute -left-4 top-0 bottom-0 w-px bg-on-surface/5 hidden lg:block" />

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start relative z-10">

                            {/* ── Infos contact ── */}
                            <div className="lg:col-span-5 space-y-16">
                                <div className="space-y-12">
                                    <h2 className="font-display text-4xl text-on-surface border-b border-outline pb-4 inline-block">
                                        Entrer en contact
                                    </h2>
                                    <div className="space-y-10">
                                        {[
                                            {
                                                icon:  'location_on',
                                                title: 'Notre centre',
                                                lines: ['Centre-ville,', 'Tanger, Maroc'],
                                                sub:   null,
                                            },
                                            {
                                                icon:  'call',
                                                title: 'Téléphone',
                                                lines: ['+212 5XX XX XX XX'],
                                                sub:   'Lun–Ven / 8h – 18h',
                                            },
                                            {
                                                icon:  'mail',
                                                title: 'Email',
                                                lines: ['contact@centreinformatique.ma'],
                                                sub:   'Inscriptions : inscription@centreinformatique.ma',
                                            },
                                        ].map(item => (
                                            <div key={item.title} className="flex items-start gap-8 group">
                                                <div className="text-primary mt-1 flex-shrink-0">
                                                    <span className="material-symbols-outlined"
                                                        style={{ fontSize: '28px' }}>
                                                        {item.icon}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h4 className="font-display text-xl text-on-surface mb-2">{item.title}</h4>
                                                    {item.lines.map(l => (
                                                        <p key={l} className="text-on-surface-variant font-light leading-relaxed">{l}</p>
                                                    ))}
                                                    {item.sub && (
                                                        <p className="text-primary/60 text-xs uppercase tracking-widest mt-1">{item.sub}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Réseaux */}
                                <div className="pt-12 border-t border-outline">
                                    <h4 className="font-label font-bold text-on-surface text-xs uppercase tracking-[0.2em] mb-6">
                                        Présence numérique
                                    </h4>
                                    <div className="flex gap-6">
                                        {['public', 'share', 'groups'].map(icon => (
                                            <a key={icon}
                                                href="#"
                                                className="text-on-surface-variant hover:text-primary transition-colors duration-300">
                                                <span className="material-symbols-outlined">{icon}</span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* ── Formulaire ── */}
                            <div className="lg:col-span-7 relative">
                                {/* Card avec fond blanc/translucide */}
                                <div
                                    className="p-10 md:p-16 rounded-3xl shadow-sm relative overflow-hidden border border-outline-variant/40"
                                    style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)' }}
                                >
                                    {/* Accent coin */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none" />

                                    {/* Status message */}
                                    {submitStatus && (
                                        <div className={`mb-10 p-4 rounded-xl text-sm font-medium
                                            ${submitStatus.type === 'success'
                                                ? 'bg-green-50 text-green-800 border border-green-200'
                                                : 'bg-red-50 text-red-800 border border-red-200'}`}>
                                            {submitStatus.message}
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit} className="space-y-12 relative z-10">

                                        {/* Nom + Email */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                            <FloatingInput
                                                id="name" label="Nom complet"
                                                value={formData.name}
                                                onChange={handleChange}
                                            />
                                            <FloatingInput
                                                id="email" label="Adresse email" type="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        {/* Sujet */}
                                        <div className="relative">
                                            <label
                                                htmlFor="subject"
                                                className="absolute -top-6 left-0 text-primary font-bold text-[10px] uppercase tracking-widest"
                                            >
                                                Sujet de la demande
                                            </label>
                                            <select
                                                id="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                className="block w-full px-0 py-2 bg-transparent border-0 border-b border-outline
                                                           focus:ring-0 focus:border-primary transition-colors
                                                           font-display text-lg text-on-surface appearance-none cursor-pointer"
                                            >
                                                <option value="inscription">Demande d'inscription</option>
                                                <option value="information">Demande d'information</option>
                                                <option value="partnership">Partenariat</option>
                                                <option value="other">Autre</option>
                                            </select>
                                            <span className="material-symbols-outlined absolute right-0 top-2 pointer-events-none text-outline">
                                                expand_more
                                            </span>
                                        </div>

                                        {/* Message */}
                                        <div className="relative">
                                            <label
                                                htmlFor="message"
                                                className="absolute -top-6 left-0 text-primary font-bold text-[10px] uppercase tracking-widest"
                                            >
                                                Message
                                            </label>
                                            <textarea
                                                id="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                className="block w-full px-0 py-4 bg-transparent border-0 border-b border-outline
                                                           focus:ring-0 focus:border-primary transition-colors
                                                           font-body text-on-surface text-base resize-none
                                                           placeholder:text-on-surface-variant/30"
                                                placeholder="Votre message pour notre équipe..."
                                                rows={4}
                                            />
                                        </div>

                                        {/* Bouton submit */}
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full bg-on-surface text-white py-5 rounded-xl
                                                       font-bold uppercase tracking-[0.2em] text-xs
                                                       hover:bg-primary transition-all duration-500
                                                       flex items-center justify-center gap-3 group
                                                       disabled:opacity-60 disabled:cursor-not-allowed
                                                       shadow-sm hover:shadow-lg hover:shadow-primary/20"
                                        >
                                            <span>
                                                {isSubmitting ? 'Envoi en cours…' : 'Envoyer le message'}
                                            </span>
                                            <span className="material-symbols-outlined transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1">
                                                north_east
                                            </span>
                                        </button>

                                    </form>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ════════════════════════════════════════
                        HORAIRES
                    ════════════════════════════════════════ */}
                    <section className="max-w-7xl mx-auto px-8 pb-20">
                        <div
                            className="p-12 rounded-3xl border border-outline-variant/50"
                            style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)' }}
                        >
                            <h3 className="font-display text-4xl mb-4 text-on-surface">
                                Horaires d'ouverture
                            </h3>
                            <p className="text-on-surface-variant font-light max-w-lg leading-relaxed text-lg">
                                Nos bureaux administratifs sont ouverts aux horaires suivants pour les demandes sur place et les dépôts de documents.
                            </p>
                            <div className="mt-12 flex flex-col sm:flex-row gap-8">
                                <div className="flex-1 border-l-2 border-primary pl-6">
                                    <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-2">
                                        Jours ouvrés
                                    </span>
                                    <span className="text-2xl font-display text-on-surface">08:00 — 18:00</span>
                                </div>
                                <div className="flex-1 border-l-2 border-outline pl-6">
                                    <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/40 mb-2">
                                        Samedi
                                    </span>
                                    <span className="text-2xl font-display text-on-surface-variant/40">09:00 — 13:00</span>
                                </div>
                                <div className="flex-1 border-l-2 border-outline pl-6">
                                    <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/40 mb-2">
                                        Dimanche
                                    </span>
                                    <span className="text-2xl font-display text-on-surface-variant/40">Fermé</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ════════════════════════════════════════
                        FAQ
                    ════════════════════════════════════════ */}
                    <section className="max-w-7xl mx-auto px-8 pb-40">
                        <div className="flex flex-col items-start gap-2 mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined">help_center</span>
                                </div>
                                <h2 className="font-display text-3xl text-on-surface">
                                    Foire aux questions
                                </h2>
                            </div>
                            <p className="text-on-surface-variant font-light max-w-2xl">
                                Retrouvez les réponses aux questions les plus fréquemment posées par nos étudiants.
                            </p>
                        </div>

                        <div
                            className="p-6 md:p-10 rounded-3xl border border-outline-variant/50"
                            style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)' }}
                        >
                            <div className="space-y-5">
                                {FAQ_ITEMS.map((item, idx) => (
                                    <FaqItem
                                        key={idx}
                                        question={item.question}
                                        answer={item.answer}
                                        open={openIndex === idx}
                                        onToggle={() => setOpenIndex(openIndex === idx ? null : idx)}
                                    />
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ════════════════════════════════════════
                        CARTE / LOCALISATION
                    ════════════════════════════════════════ */}
                    <section className="w-full h-[650px] relative">
                        {/* Image carte en fond */}
                        <div className="absolute inset-0 bg-surface-container-low overflow-hidden">
                            <img
                                alt="Vue cartographique de Tanger"
                                className="w-full h-full object-cover grayscale contrast-125 opacity-30 mix-blend-multiply"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlRI1gVugMprLYzUvcKJ4LsiHHcRMCy7wBqCpnvVuGRV2PC6LyLYAKm6qsA8OsuKTBENlOBfhBJK7PxzdiXGRa8r6axwNmR4oOtLfk3nve1b-q2dxU61Mrcy7w0-bLvdk8gwz7TF4I6zBUR0HACNg3AH5-INaFmuwAE9SBPtbO90G29-1uT9vpfmFxJvOMUQFt_7fy8X1YdCVV24LHT61Qd6RpqNlha8bHuizbeZBuLz9Hda6wveYSaGl43uK7jMSfgnfNmPhVz5ah"
                            />
                        </div>

                        {/* Dégradé overlay */}
                        <div className="absolute inset-0 bg-gradient-to-b from-surface-container-lowest via-transparent to-on-surface/10 pointer-events-none" />

                        {/* Lignes d'encadrement */}
                        <div className="absolute top-10 left-10 right-10 bottom-10 border border-on-surface/5 pointer-events-none rounded-sm" />

                        {/* Point de localisation */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <div className="relative group cursor-pointer">
                                {/* Halo */}
                                <div className="absolute -inset-16 bg-primary/10 rounded-full blur-2xl"
                                    style={{ animation: 'floatA 4s ease-in-out infinite' }}
                                />
                                {/* Ring ping */}
                                <div
                                    className="absolute -inset-8 border border-primary/20 rounded-full pointer-events-none"
                                    style={{ animation: 'pingCustom 3s ease-in-out infinite' }}
                                />
                                {/* Icône centre */}
                                <div className="relative w-20 h-20 bg-on-surface rounded-full flex items-center justify-center
                                               text-white shadow-2xl border-2 border-primary
                                               scale-100 group-hover:scale-110 transition-transform duration-500">
                                    <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>school</span>
                                </div>
                                {/* Tooltip */}
                                <div className="absolute top-full mt-6 left-1/2 -translate-x-1/2
                                               px-6 py-4 rounded-2xl shadow-xl border border-primary/10
                                               whitespace-nowrap pointer-events-none
                                               opacity-0 group-hover:opacity-100
                                               translate-y-4 group-hover:translate-y-0
                                               transition-all duration-500"
                                    style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)' }}
                                >
                                    <p className="font-display text-xl text-on-surface">Centre Informatique</p>
                                    <p className="text-xs text-primary font-bold uppercase tracking-widest mt-1">Tanger — Maroc</p>
                                </div>
                            </div>
                        </div>

                        {/* Carte info flottante */}
                        <div
                            className="absolute bottom-20 left-20 p-10 rounded-3xl border border-outline
                                       max-w-md hidden lg:block shadow-xl"
                            style={{ background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(12px)' }}
                        >
                            <h4 className="font-display text-3xl mb-4 text-on-surface">Identité du lieu</h4>
                            <p className="text-sm text-on-surface-variant leading-relaxed font-light mb-8">
                                Idéalement situé au cœur de Tanger, notre centre offre des infrastructures modernes pour un apprentissage de qualité.
                            </p>
                            <a
                                href="#"
                                className="inline-flex items-center gap-3 text-on-surface font-bold text-xs uppercase tracking-[0.2em] group"
                            >
                                <span className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white group-hover:bg-on-surface transition-colors">
                                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>directions</span>
                                </span>
                                Obtenir l'itinéraire
                            </a>
                        </div>
                    </section>

                </main>
            </PublicLayout>
        </>
    )
}

export default Contact