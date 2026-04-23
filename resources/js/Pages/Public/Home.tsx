import { Head, Link } from '@inertiajs/react'
import PublicLayout from '@/Layouts/PublicLayout'
import Hero from '@/Components/home/Hero'
import Formations from '@/Components/home/Formations'
import Experience from '@/Components/home/Experience'
import State from '@/Components/home/State'
import Feedbacks from '@/Components/home/Feedbacks'
import Cta from '@/Components/home/Cta'
import History from '@/Components/home/History'

export default function Home() {
    return (
        <PublicLayout>
            <Head title="Centre Informatique | Formation en Langues, Concours & Bureautique" />

            <Hero />

            <History />

            <Formations />

            <Experience />
          
            <State />
     
            <Feedbacks />

            <Cta />

        </PublicLayout>
    )
}