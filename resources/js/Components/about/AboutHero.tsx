import { useEffect, useState } from 'react'

const TYPING_TEXT = "Votre avenir"

export default function AboutHero() {
    const [displayed, setDisplayed] = useState(TYPING_TEXT)
    const [phase, setPhase]         = useState<'idle' | 'erasing' | 'typing'>('idle')
    const [broken, setBroken]       = useState(false)

    /* ── Typewriter cycle ── */
    useEffect(() => {
        const t = setTimeout(() => setPhase('erasing'), 2000)
        return () => clearTimeout(t)
    }, [])

    useEffect(() => {
        let t: ReturnType<typeof setTimeout>
        if (phase === 'erasing') {
            if (displayed.length === 0) t = setTimeout(() => setPhase('typing'), 500)
            else t = setTimeout(() => setDisplayed(p => p.slice(0, -1)), 120)
        }
        if (phase === 'typing') {
            if (displayed.length === TYPING_TEXT.length) t = setTimeout(() => setPhase('erasing'), 2800)
            else t = setTimeout(() => setDisplayed(TYPING_TEXT.slice(0, displayed.length + 1)), 90)
        }
        return () => clearTimeout(t)
    }, [phase, displayed])

    const handleMouseLeave = () => {
        setTimeout(() => setBroken(false), 800)
    }

    return (
        <section className="relative h-[700px] flex items-center justify-center overflow-hidden bg-surface-bright">

            <style>{`
                @keyframes gridDrift {
                    0%,100% { transform: translate(0,0); }
                    50%     { transform: translate(6px,8px); }
                }
                @keyframes arcRotateCW  { to { transform: rotate(360deg);  } }
                @keyframes arcRotateCCW { to { transform: rotate(-360deg); } }
                @keyframes arcPulse {
                    0%,100% { opacity: .13; }
                    50%     { opacity: .22; }
                }
                @keyframes lineFade {
                    0%,100% { opacity:.55; transform:scaleX(1); }
                    50%     { opacity:.20; transform:scaleX(.92); }
                }
                @keyframes floatDot1 {
                    0%,100% { transform:translate(0,0)       scale(1);    opacity:.25; }
                    33%     { transform:translate(8px,-12px)  scale(1.4);  opacity:.40; }
                    66%     { transform:translate(-6px,6px)   scale(.8);   opacity:.15; }
                }
                @keyframes floatDot2 {
                    0%,100% { transform:translate(0,0)       scale(1);    opacity:.20; }
                    40%     { transform:translate(-10px,8px)  scale(1.3);  opacity:.35; }
                    80%     { transform:translate(5px,-5px)   scale(.7);   opacity:.10; }
                }
                @keyframes floatDot3 {
                    0%,100% { transform:translate(0,0)       scale(1);    opacity:.15; }
                    50%     { transform:translate(6px,10px)   scale(1.5);  opacity:.28; }
                }
                @keyframes heroFadeUp {
                    from { opacity:0; transform:translateY(20px); }
                    to   { opacity:1; transform:translateY(0); }
                }
                @keyframes cursorBlink { 50% { opacity:0; } }

                /* Blob rotation */
                @keyframes blobSpin {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }

                /* Fragments break */
                @keyframes frag0 { to { transform:translate(-70px,-60px) rotate(-45deg) scale(.4); opacity:0; } }
                @keyframes frag1 { to { transform:translate( 72px,-56px) rotate( 38deg) scale(.35); opacity:0; } }
                @keyframes frag2 { to { transform:translate(-58px, 74px) rotate(-62deg) scale(.42); opacity:0; } }
                @keyframes frag3 { to { transform:translate( 62px, 68px) rotate( 52deg) scale(.45); opacity:0; } }
                @keyframes frag4 { to { transform:translate(  4px,-85px) rotate( 18deg) scale(.3);  opacity:0; } }

                /* Gold sun */
                @keyframes sunAppear {
                    0%   { transform:translate(-50%,-50%) scale(0);   opacity:0; }
                    60%  { transform:translate(-50%,-50%) scale(1.25); opacity:1; }
                    100% { transform:translate(-50%,-50%) scale(1);    opacity:1; }
                }
                @keyframes sunGlow {
                    0%,100% { box-shadow: 0 0 16px 6px #c9a84c, 0 0 34px 14px rgba(201,168,76,.45); }
                    50%     { box-shadow: 0 0 30px 14px #e8c97e, 0 0 60px 28px rgba(232,201,126,.7); }
                }
                @keyframes raysSpin {
                    from { transform: rotate(0deg);   }
                    to   { transform: rotate(360deg); }
                }
            `}</style>

            {/* ══ Grille ══ */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ animation:'gridDrift 14s ease-in-out infinite' }}>
                <defs>
                    <pattern id="grid-about" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
                        <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#c2652a" strokeWidth="0.6"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid-about)" opacity="0.22"/>
            </svg>

            {/* ══ Arcs CW ══ */}
            <svg className="absolute pointer-events-none"
                style={{ bottom:'0', right:'0', width:'420px', height:'420px',
                         transformOrigin:'bottom right',
                         animation:'arcRotateCW 60s linear infinite' }}
                viewBox="0 0 520 520" xmlns="http://www.w3.org/2000/svg">
                {[80,200,320,440].map(r=>(
                    <circle key={r} cx="520" cy="520" r={r} fill="none"
                        stroke="#c2652a" strokeWidth="2" opacity="0.5" strokeDasharray="6 10"/>
                ))}
            </svg>

            {/* ══ Arcs CCW ══ */}
            <svg className="absolute pointer-events-none"
                style={{ bottom:'0', right:'0', width:'420px', height:'420px',
                         transformOrigin:'bottom right',
                         animation:'arcRotateCCW 80s linear infinite, arcPulse 8s ease-in-out infinite' }}
                viewBox="0 0 520 520" xmlns="http://www.w3.org/2000/svg">
                {[140,260,380,500].map(r=>(
                    <circle key={r} cx="520" cy="520" r={r} fill="none"
                        stroke="#c2652a" strokeWidth="3" opacity="0.5"/>
                ))}
            </svg>

            {/* ══ Ligne horizontale ══ */}
            <div className="absolute pointer-events-none" style={{
                top:'36%', left:0, right:0, height:'1px',
                background:'linear-gradient(to right, transparent, #d8d0c8 25%, #d8d0c8 75%, transparent)',
                animation:'lineFade 10s ease-in-out infinite',
            }}/>

            {/* ══ Dots flottants ══ */}
            <div className="absolute top-[22%] right-[11%] w-2 h-2 rounded-full bg-primary pointer-events-none"
                style={{animation:'floatDot1 9s ease-in-out infinite'}}/>
            <div className="absolute bottom-[26%] right-[20%] w-4 h-4 rounded-full bg-primary pointer-events-none"
                style={{animation:'floatDot2 12s ease-in-out infinite'}}/>
            <div className="absolute top-[60%] left-[6%] w-1.5 h-1.5 rounded-full bg-primary pointer-events-none"
                style={{animation:'floatDot3 7s ease-in-out infinite'}}/>

            {/* ══════════════════════════════════════
                BLOB OBJET — haut-gauche
                Forme organique en noir, rotation infinie
                Au hover : explose en fragments + soleil gold
            ══════════════════════════════════════ */}
            <div
                style={{
                    position: 'absolute',
                    top:      '44px',
                    left:     '52px',
                    width:    '170px',
                    height:   '170px',
                    cursor:   'pointer',
                    zIndex:   10,
                }}
                onMouseEnter={() => setBroken(true)}
                onMouseLeave={handleMouseLeave}
            >
                {/* Rotation wrapper — s'arrête quand broken */}
                <div style={{
                    width:'100%', height:'100%', position:'relative',
                    animation: broken ? 'none' : 'blobSpin 18s linear infinite',
                }}>

                    {/* ── Blob intact ── */}
                    <svg
                        viewBox="0 0 160 160"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{
                            position:'absolute', inset:0,
                            width:'100%', height:'100%',
                            transition:'opacity .2s ease',
                            opacity: broken ? 0 : 1,
                        }}
                    >
                        {/*
                            Forme organique 4 lobes d'après le sketch :
                            - Lobe haut-gauche (grand arrondi)
                            - Lobe haut-droit (moyen)
                            - Lobe bas-gauche (petit)
                            - Zone bas-droit (medium)
                        */}
                        <path
                            d="
                              M 78 82
                              C 60 72, 26 68, 20 48
                              C 14 28, 32 12, 50 16
                              C 60 19, 64 32, 62 42
                              C 68 26, 74 12, 90 11
                              C 108  9, 118 26, 110 40
                              C 122 32, 140 38, 140 54
                              C 140 68, 126 76, 114 74
                              C 120 86, 118 100, 106 106
                              C 96 111, 88 103, 88 94
                              C 90 108, 82 126, 68 128
                              C 54 130, 44 116, 50 104
                              C 38 112, 24 108, 20 96
                              C 15 82, 28 72, 44 74
                              C 56 76, 64 84, 78 82
                              Z
                            "
                            fill="#1a1a1a"
                            stroke="#0d0d0d"
                            strokeWidth="1.5"
                            strokeLinejoin="round"
                        />
                    </svg>

                    {/* ── 5 fragments (visibles uniquement quand broken) ── */}
                    {broken && ([
                        {
                            d: "M78 82 C60 72,26 68,20 48 C14 28,32 12,50 16 C60 19,64 32,62 42 C66 34,72 26,78 82 Z",
                            anim: 'frag0 .65s cubic-bezier(.4,0,.6,1) forwards',
                        },
                        {
                            d: "M78 82 C68 26,74 12,90 11 C108 9,118 26,110 40 C122 32,140 38,140 54 C140 68,126 76,114 74 C104 72,84 70,78 82 Z",
                            anim: 'frag1 .65s cubic-bezier(.4,0,.6,1) forwards',
                        },
                        {
                            d: "M78 82 C44 74,15 82,20 96 C24 108,38 112,50 104 C44 116,54 130,68 128 C82 126,90 108,88 94 C86 84,80 82,78 82 Z",
                            anim: 'frag2 .65s cubic-bezier(.4,0,.6,1) forwards',
                        },
                        {
                            d: "M78 82 C88 94,96 111,106 106 C118 100,120 86,114 74 C126 76,140 68,140 54 C140 38,120 34,110 40 C100 56,90 76,78 82 Z",
                            anim: 'frag3 .65s cubic-bezier(.4,0,.6,1) forwards',
                        },
                        {
                            d: "M78 82 C70 60,66 44,62 42 C64 32,60 19,50 16 C46 24,44 36,78 82 Z",
                            anim: 'frag4 .65s cubic-bezier(.4,0,.6,1) .05s forwards',
                        },
                    ].map((frag, i) => (
                        <svg key={i} viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg"
                            style={{ position:'absolute', inset:0, width:'100%', height:'100%',
                                     animation: frag.anim }}>
                            <path d={frag.d} fill="#1a1a1a"/>
                        </svg>
                    )))}
                </div>

                {/* ── Soleil gold (apparaît au hover) ── */}
                {broken && (
                    <div style={{
                        position:     'absolute',
                        top:          '50%',
                        left:         '50%',
                        width:        '54px',
                        height:       '54px',
                        borderRadius: '50%',
                        background:   'radial-gradient(circle at 32% 32%, #f7e8a0, #c9a84c 55%, #7a5f24 100%)',
                        animation:    'sunAppear .5s cubic-bezier(.34,1.56,.64,1) both, sunGlow 2s ease-in-out infinite .5s',
                        zIndex:       20,
                    }}>
                        {/* Rayons qui tournent */}
                        <svg
                            viewBox="0 0 130 130"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{
                                position:  'absolute',
                                top:       '-38px',
                                left:      '-38px',
                                width:     '130px',
                                height:    '130px',
                                animation: 'raysSpin 3.5s linear infinite',
                            }}
                        >
                            {Array.from({ length: 12 }, (_, i) => {
                                const angle = (i * 30) * Math.PI / 180
                                const x1 = 65 + 34 * Math.cos(angle)
                                const y1 = 65 + 34 * Math.sin(angle)
                                const x2 = 65 + 56 * Math.cos(angle)
                                const y2 = 65 + 56 * Math.sin(angle)
                                return (
                                    <line key={i}
                                        x1={x1} y1={y1} x2={x2} y2={y2}
                                        stroke="#e8c97e"
                                        strokeWidth={i % 3 === 0 ? '3' : '1.5'}
                                        strokeLinecap="round"
                                        opacity={i % 3 === 0 ? 1 : 0.7}
                                    />
                                )
                            })}
                        </svg>
                    </div>
                )}
            </div>

            {/* ══ Texte ══ */}
            <div className="relative z-10 text-center px-4 max-w-4xl"
                style={{ animation: 'heroFadeUp 0.8s ease both' }}>
                <span className="font-body text-primary uppercase tracking-[0.3em] text-sm mb-6 block">
                    Depuis 2010
                </span>
                <h1 className="text-7xl md:text-8xl font-serif text-on-surface leading-[1.1] mb-8">
                    Notre héritage,<br/>
                    <i className="font-serif italic text-primary">
                        {displayed}
                        <span style={{
                            display:       'inline-block',
                            width:         '3px',
                            height:        '0.85em',
                            background:    '#c2652a',
                            marginLeft:    '4px',
                            verticalAlign: 'middle',
                            borderRadius:  '1px',
                            animation:     'cursorBlink .8s step-start infinite',
                        }}/>
                    </i>
                </h1>
                <div className="w-24 h-px bg-primary mx-auto"/>
            </div>

        </section>
    )
}