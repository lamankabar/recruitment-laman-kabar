import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { supabase } from '@/lib/supabase'

export const metadata = {
    title: 'FAQ | Laman Kabar',
    description: 'Pertanyaan yang Sering Diajukan di Laman Kabar',
}

export const revalidate = 60

async function getFaqs() {
    const { data } = await supabase.from('faqs').select('*').eq('is_active', true).order('created_at', { ascending: true })
    return data || []
}

export default async function FaqPage() {
    const faqs = await getFaqs()

    return (
        <div className="flex flex-col min-h-screen bg-background-light font-display text-slate-900">
            <Navbar />

            <main className="flex-grow container mx-auto px-6 py-12 max-w-4xl">
                <div className="flex flex-col items-center justify-center mb-16 animate-fade-in-up">
                    <div className="size-20 flex items-center justify-center text-primary bg-primary/5 rounded-full mb-6">
                        <span className="material-symbols-outlined text-5xl">quiz</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-center text-slate-900 tracking-tight">
                        Pertanyaan yang Sering Diajukan
                    </h1>
                    <p className="text-center text-gray-500 mt-4 max-w-2xl text-lg">
                        Punya pertanyaan seputar Laman Kabar? Temukan jawabannya di bawah ini.
                    </p>
                    <div className="h-1 w-20 bg-primary mt-8 rounded-full"></div>
                </div>

                <div className="flex flex-col gap-4 animate-fade-in-up">
                    {faqs.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
                            <span className="material-symbols-outlined text-5xl text-gray-300 mb-4">search_off</span>
                            <h3 className="text-xl font-bold text-slate-900">Belum ada pertanyaan</h3>
                            <p className="text-gray-500 mt-2">Daftar FAQ saat ini masih kosong.</p>
                        </div>
                    ) : (
                        faqs.map((faq: any) => (
                            <details key={faq.id} className="group bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden [&_summary::-webkit-details-marker]:hidden hover:shadow-md transition-all">
                                <summary className="flex items-center justify-between p-5 md:p-6 cursor-pointer font-bold text-lg text-slate-900 hover:text-primary transition-colors">
                                    {faq.question}
                                    <span className="material-symbols-outlined text-gray-400 group-open:rotate-180 transition-transform duration-300">
                                        expand_more
                                    </span>
                                </summary>
                                <div className="px-5 md:px-6 pb-5 md:pb-6 text-gray-600 leading-relaxed border-t border-gray-50 pt-4 mt-2">
                                    <p className="whitespace-pre-line">{faq.answer}</p>
                                </div>
                            </details>
                        ))
                    )}
                </div>
            </main>

            <Footer />
        </div>
    )
}
