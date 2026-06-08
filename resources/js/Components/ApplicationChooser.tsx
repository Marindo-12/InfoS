import { Link } from '@inertiajs/react'
import { useEffect, useRef, useState } from 'react'

type ApplicationChooserProps = {
    buttonClassName: string
    buttonLabel?: string
    dark?: boolean
}

const formations = [
    { label: 'Langues', href: route('inscriptions.langues'), icon: 'translate' },
    { label: 'Bureautique', href: route('inscriptions.bureautique'), icon: 'computer' },
    { label: 'Concours', href: route('inscriptions.concours'), icon: 'workspace_premium' },
    { label: 'Infographie', href: route('inscriptions.infographie'), icon: 'palette' },
]

export default function ApplicationChooser({
    buttonClassName,
    buttonLabel = 'Déposer ma candidature',
    dark = false,
}: ApplicationChooserProps) {
    const [open, setOpen] = useState(false)
    const rootRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const closeOnOutsideClick = (event: MouseEvent) => {
            if (!rootRef.current?.contains(event.target as Node)) {
                setOpen(false)
            }
        }

        document.addEventListener('mousedown', closeOnOutsideClick)
        return () => document.removeEventListener('mousedown', closeOnOutsideClick)
    }, [])

    return (
        <div
            ref={rootRef}
            className={`relative inline-flex justify-center ${buttonClassName.includes('w-full') ? 'w-full' : ''}`}
        >
            <button
                type="button"
                onClick={() => setOpen((current) => !current)}
                className={buttonClassName}
                aria-expanded={open}
                aria-haspopup="dialog"
            >
                {buttonLabel}
            </button>

            <div
                role="dialog"
                aria-label="Choisir une formation"
                className={`absolute bottom-full left-1/2 z-30 mb-5 w-[min(92vw,23rem)] -translate-x-1/2 transition-all duration-200 ${
                    open
                        ? 'pointer-events-auto translate-y-0 opacity-100'
                        : 'pointer-events-none translate-y-2 opacity-0'
                }`}
            >
                <div
                    className={`relative flex items-center justify-center gap-3 rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur-md ${
                        dark
                            ? 'border-white/10 bg-[#15110f]/95 text-white'
                            : 'border-stone-200 bg-white/95 text-stone-800'
                    }`}
                >
                    <span
                        className={`absolute left-1/2 top-full h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b border-r ${
                            dark ? 'border-white/10 bg-[#15110f]' : 'border-stone-200 bg-white'
                        }`}
                        aria-hidden="true"
                    />

                    {formations.map((formation) => (
                        <Link
                            key={formation.label}
                            href={formation.href}
                            aria-label={formation.label}
                            className={`group relative flex h-12 w-12 items-center justify-center rounded-full border text-primary no-underline transition-all hover:-translate-y-1 hover:border-primary hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                                dark ? 'border-white/10 bg-white/5' : 'border-stone-200 bg-stone-50'
                            }`}
                        >
                            <span className="material-symbols-outlined text-2xl">{formation.icon}</span>
                            <span
                                className={`pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-bold opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus:opacity-100 ${
                                    dark ? 'bg-white text-[#15110f]' : 'bg-stone-900 text-white'
                                }`}
                            >
                                {formation.label}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
