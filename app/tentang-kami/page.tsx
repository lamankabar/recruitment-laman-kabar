
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export const revalidate = 60

async function getAboutData() {
    const { data } = await supabase.from('about_us').select('*').single()

    // Default fallback if DB is empty
    return data || {
        logo_url: null,
        title: "Tentang Laman Kabar",
        description: "",
        vision: "",
        mission: "",
        closing_text: ""
    }
}



export default async function AboutPage() {
    const about = await getAboutData()

    // Helper to parse mission if it's stored as plain text or newlines
    // Ensure mission is a string before splitting
    const missionText = about.mission || ""
    const missionPoints = missionText.split('\n').filter((line: string) => line.trim() !== '')

    return (
        <div className="flex flex-col min-h-screen bg-background-light font-display text-slate-900">
            <Navbar />

            <main className="flex-grow container mx-auto px-6 py-12 max-w-4xl">
                {/* Logo/Icon Section */}
                <div className="flex flex-col items-center justify-center mb-10 animate-fade-in-up">
                    <div className="size-24 flex items-center justify-center text-primary bg-primary/5 rounded-full mb-6 overflow-hidden">
                        {about.logo_url ? (
                            <img src={about.logo_url} alt="Logo" className="w-full h-full object-cover" />
                        ) : (
                            <span className="material-symbols-outlined text-6xl">diversity_2</span>
                        )}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-center text-slate-900 tracking-tight">
                        {about.title}
                    </h1>
                    <div className="h-1 w-20 bg-primary mt-6 rounded-full"></div>
                </div>

                {/* Content Section */}
                <div className="prose prose-lg prose-slate mx-auto text-gray-600 leading-relaxed text-justify animate-fade-in-up">
                    <p className="mb-6 whitespace-pre-line">
                        {about.description}
                    </p>

                    <h3 className="text-2xl font-bold text-slate-900 mb-4 mt-8">Visi</h3>
                    <p className="mb-6 whitespace-pre-line">
                        {about.vision}
                    </p>

                    <h3 className="text-2xl font-bold text-slate-900 mb-4 mt-8">Misi</h3>
                    <ul className="list-disc pl-6 mb-6 space-y-2">
                        {missionPoints.map((point: string, idx: number) => (
                            <li key={idx}>
                                {point.includes(':') ? (
                                    <>
                                        <strong>{point.split(':')[0]}:</strong> {point.split(':')[1]}
                                    </>
                                ) : (
                                    point
                                )}
                            </li>
                        ))}
                    </ul>



                    <h3 className="text-2xl font-bold text-slate-900 mb-4 mt-8">Bergabunglah Bersama Kami</h3>
                    <p className="whitespace-pre-line">
                        {about.closing_text}
                    </p>
                </div>

            </main>

            {/* CTA Section */}
            <div className="px-5 md:px-20 py-12 flex justify-center bg-background-light">
                <div className="max-w-4xl w-full bg-white border border-gray-100 shadow-lg rounded-2xl overflow-hidden relative animate-fade-in-up">
                    {/* Decorative accent */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
                    <div className="flex flex-col md:flex-row items-center justify-between p-8 md:p-10 gap-6 relative z-10">
                        <div className="flex flex-col gap-2 max-w-md">
                            <h2 className="text-xl md:text-2xl font-bold text-[#181111]">Mari Bergabung bersama Kami!</h2>
                            <p className="text-sm md:text-base text-gray-500">Masih ragu atau ada yang ingin ditanyakan? Jangan sungkan untuk menghubungi kami.</p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Link href="/daftar" className="flex items-center justify-center rounded-lg h-10 px-6 bg-primary text-white text-sm font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20">
                                Daftar
                            </Link>
                            <Link href="/hubungi-kami" className="flex items-center justify-center rounded-lg h-10 px-6 bg-transparent border-2 border-primary text-primary text-sm font-bold hover:bg-primary/5 transition-colors">
                                Hubungi Kami
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
