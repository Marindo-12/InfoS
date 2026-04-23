import Footer from '@/Components/Footer'
import Navbar from '@/Components/Navbar'
import { ReactNode } from 'react'

interface Props {
    children: ReactNode
}

export default function PublicLayout({ children }: Props) {
    return (
        <div className="bg-background text-on-surface font-body selection:bg-primary/20 scroll-smooth">
            <Navbar />

            <main>{children}</main>

            <Footer />
        </div>
    )
}