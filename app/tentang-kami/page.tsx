
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

// Helper to get departments
async function getDepartments() {
    const { data } = await supabase.from('departments').select('*')
    return data || []
}

// Helper to map department names to icons
function getIconForDept(name: string) {
    const lower = name.toLowerCase()
    if (lower.includes('educa') || lower.includes('pendidikan')) return 'school'
    if (lower.includes('social') || lower.includes('sosial')) return 'volunteer_activism'
    if (lower.includes('tech') || lower.includes('teknologi')) return 'rocket_launch'
    if (lower.includes('art') || lower.includes('seni') || lower.includes('budaya')) return 'palette'
    if (lower.includes('health') || lower.includes('kesehatan')) return 'cardiology'
    if (lower.includes('outreach') || lower.includes('humas')) return 'campaign'
    return 'groups' // default
}

export default async function AboutPage() {
    const about = await getAboutData()
    const departments = await getDepartments()
    const isDepartmentsActive = (await supabase.from('departments_config').select('is_active').single()).data?.is_active

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

                    {/* Departments Section (Inserted) */}
                    <div className="my-12">
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Struktur Pengurus</h3>
                            <p className="text-base text-gray-500">Berikut ini adalah struktur pengurus Laman Kabar.</p>
                        </div>

                        {isDepartmentsActive === false ? (
                            <div className="flex flex-col items-center justify-center py-6 border border-dashed border-gray-200 rounded-xl bg-gray-50">
                                <div className="bg-orange-50 text-orange-600 px-4 py-1 rounded-full font-bold uppercase text-xs mb-2 border border-orange-100">
                                    Stay Tuned
                                </div>
                                <h4 className="text-xl font-bold text-slate-800">Segera Hadir</h4>
                            </div>
                        ) : departments.length === 0 ? (
                            <p className="text-center text-gray-400 italic">Belum ada data.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {departments.map((dept: any) => (
                                    <div key={dept.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4 no-underline">
                                        <div className="size-10 rounded-lg bg-primary/10 flex-shrink-0 flex items-center justify-center text-primary mt-1">
                                            <span className="material-symbols-outlined text-[20px]">{getIconForDept(dept.name)}</span>
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-slate-900 mb-1 leading-tight">{dept.name}</h4>
                                            <p className="text-sm text-gray-500 leading-snug">{dept.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900 mb-4 mt-8">Bergabunglah Bersama Kami</h3>
                    <p className="whitespace-pre-line">
                        {about.closing_text}
                    </p>
                </div>

            </main>

            {/* CTA Section */}
            <div className="px-5 md:px-20 py-12 flex justify-center bg-background-light">
                <div className="max-w-[960px] w-full bg-white border border-gray-100 shadow-lg rounded-2xl overflow-hidden relative animate-fade-in-up">
                    {/* Decorative accent */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
                    <div className="flex flex-col md:flex-row items-center justify-between p-10 gap-8 relative z-10">
                        <div className="flex flex-col gap-2 max-w-lg">
                            <h2 className="text-2xl md:text-3xl font-bold text-[#181111]">Mari Bergabung bersama Kami!</h2>
                            <p className="text-gray-500">Masih ragu atau ada yang ingin ditanyakan? Jangan sungkan untuk menghubungi kami.</p>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/daftar" className="flex items-center justify-center rounded-lg h-12 px-8 bg-primary text-white text-base font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20">
                                Daftar
                            </Link>
                            <Link href="https://www.instagram.com/lamankabar/" className="flex items-center justify-center rounded-lg h-12 px-8 bg-transparent border-2 border-primary text-primary text-base font-bold hover:bg-primary/5 transition-colors">
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
