import { Link } from '@inertiajs/react'
import { BadgeCheck, MapPin } from 'lucide-react'
import type { SVGProps } from 'react'

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

const socialLinks = [
    { name: 'Facebook', href: 'https://www.facebook.com/', icon: FacebookIcon, color: '#1877F2', hoverClass: 'hover:border-[#1877F2] hover:text-[#1877F2]' },
    { name: 'Instagram', href: 'https://www.instagram.com/', icon: InstagramIcon, color: '#E4405F', hoverClass: 'hover:border-[#E4405F] hover:text-[#E4405F]' },
    { name: 'Twitter', href: 'https://x.com/', icon: XIcon, color: '#000000', hoverClass: 'hover:border-black hover:text-black' },
    { name: 'WhatsApp', href: 'https://wa.me/212535402932', icon: WhatsAppIcon, color: '#25D366', hoverClass: 'hover:border-[#25D366] hover:text-[#25D366]' },
]

const formationLinks = [
    { label: 'Langues etrangeres', href: route('inscriptions.langues') },
    { label: 'Preparation concours', href: route('inscriptions.concours') },
    { label: 'Bureautique', href: route('inscriptions.bureautique') },
    { label: 'Infographie', href: route('inscriptions.infographie') },
]

const usefulLinks = [
    { label: 'Accueil', href: route('home') },
    { label: 'Formations', href: route('formations') },
    { label: 'A propos', href: route('about') },
    { label: 'Contact', href: route('contact') },
]

const Footer = () => {
    return (
        <footer className="border-t border-stone-200 bg-stone-50">
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-8 py-16 md:grid-cols-4">
                <div className="space-y-6">
                    <div className="text-xl font-serif text-orange-900">Info Saloua</div>
                    <p className="text-sm font-light leading-relaxed text-stone-600">
                        Votre succes commence ici. Formations en langues, bureautique, infographie et preparation aux concours a Meknes.
                    </p>
                    <div className="flex gap-4">
                        {socialLinks.map(({ name, href, icon: Icon, hoverClass }) => (
                            <a
                                key={name}
                                href={href}
                                target="_blank"
                                rel="noreferrer"
                                aria-label={name}
                                className={`flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-stone-200 text-stone-600 transition-colors ${hoverClass}`}
                            >
                                <Icon className="h-4 w-4" />
                            </a>
                        ))}
                    </div>
                </div>

                <div>
                    <h4 className="mb-6 text-lg font-serif text-on-surface">Formations</h4>
                    <ul className="space-y-4 text-sm font-light text-stone-600">
                        {formationLinks.map((item) => (
                            <li key={item.label}>
                                <Link href={item.href} className="no-underline transition-colors hover:text-orange-600">
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h4 className="mb-6 text-lg font-serif text-on-surface">Liens utiles</h4>
                    <ul className="space-y-4 text-sm font-light text-stone-600">
                        {usefulLinks.map((item) => (
                            <li key={item.label}>
                                <Link href={item.href} className="no-underline transition-colors hover:text-orange-600">
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h4 className="mb-6 text-lg font-serif text-on-surface">Accreditation</h4>
                    <p className="mb-6 text-xs font-light leading-relaxed text-stone-500">
                        © {new Date().getFullYear()} Info Saloua. Meknes, Maroc.
                    </p>
                </div>
            </div>

            <div className="border-t border-stone-200 py-6">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-8 text-center md:flex-row md:text-left">
                    <p className="text-xs font-light tracking-[0.25em] text-stone-400">
                        CENTRE INFORMATIQUE • MEKNES • MAROC
                    </p>
                    <a
                        href="https://www.google.com/maps/search/?api=1&query=33.8989909,-5.551918"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.18em] text-stone-500 no-underline transition-colors hover:text-primary"
                    >
                        <MapPin size={14} />
                        Ouvrir la localisation
                    </a>
                </div>
            </div>
        </footer>
    )
}

export default Footer
