
'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { supabase } from '@/lib/supabase'

export default function DaftarPage() {
    const [config, setConfig] = useState<any>(null)
    const [configLoading, setConfigLoading] = useState(true)

    // Form State
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchConfig()
    }, [])

    async function fetchConfig() {
        // Fetch config
        const { data } = await supabase.from('registration_config').select('*').limit(1).single()
        if (data) setConfig(data)
        else setConfig({ status: 'open' }) // Default Fallback

        setConfigLoading(false)
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(false)

        const formData = new FormData(e.currentTarget)
        const full_name = formData.get('full-name') as string
        const email = formData.get('email') as string
        const phone = formData.get('phone-number') as string
        const department = formData.get('department') as string
        const motivation = formData.get('motivation') as string

        // Combine department and motivation into 'reason' to fit existing schema
        const reason = `Department Interest: ${department}\nMotivation: ${motivation}`

        const data = {
            full_name,
            email,
            phone,
            reason,
        }

        try {
            const { error: dbError } = await supabase
                .from('registrations')
                .insert([data])

            if (dbError) throw dbError

            setSuccess(true)
            e.currentTarget.reset()
        } catch (err: any) {
            setError(err.message || 'Terjadi kesalahan saat mengirim data.')
        } finally {
            setLoading(false)
        }
    }

    if (configLoading) {
        return (
            <div className="flex flex-col min-h-screen bg-background-light font-display">
                <Navbar />
                <main className="flex-grow flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-8 h-8 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    // --- Render Logic Based on Status ---

    // 1. CLOSED
    if (config?.status === 'closed') {
        return (
            <div className="flex flex-col min-h-screen bg-background-light font-display text-slate-900 transition-colors duration-200">
                <Navbar />
                <main className="flex-grow flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                    <div className="w-full max-w-2xl text-center space-y-6 animate-fade-in-up">
                        <div className="mx-auto w-24 h-24 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-6 border border-red-100 shadow-sm">
                            <span className="material-symbols-outlined text-4xl">block</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#181111]">
                            Pendaftaran Tidak Tersedia
                        </h1>
                        <div className="bg-white p-6 rounded-2xl border border-dashed border-gray-300 shadow-sm">
                            <p className="text-lg text-slate-600 font-medium leading-relaxed">
                                {config.closed_message || 'Pendaftaran saat ini sedang ditutup. Nantikan informasi selanjutnya.'}
                            </p>
                        </div>
                        <div className="pt-4">
                            <a href="/" className="inline-flex items-center text-primary font-bold hover:underline">
                                <span className="material-symbols-outlined text-lg mr-1">arrow_back</span>
                                Kembali ke Beranda
                            </a>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    // 2. EMBED
    if (config?.status === 'embed') {
        return (
            <div className="flex flex-col min-h-screen bg-background-light font-display text-slate-900 transition-colors duration-200">
                <Navbar />
                <main className="flex-grow flex flex-col py-12 px-4 sm:px-6 lg:px-8 w-full">
                    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
                        {/* Header for Embed Mode (Optional, maybe keep it minimal) */}
                        <div className="text-center space-y-4 mb-8">
                            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#181111]">
                                Formulir Pendaftaran
                            </h1>
                            <p className="text-slate-500">Silahkan lengkapi formulir pendaftaran di bawah ini.</p>
                        </div>

                        {/* Embed Container */}
                        <div className="bg-white rounded-xl shadow-xl border border-gray-300 overflow-hidden min-h-[600px] flex justify-center">
                            {config.embed_code ? (
                                <div
                                    className="w-full h-full flex justify-center [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:min-h-[800px] [&>iframe]:border-0"
                                    dangerouslySetInnerHTML={{ __html: config.embed_code }}
                                />
                            ) : (
                                <div className="p-12 text-center text-gray-400 flex flex-col items-center">
                                    <span className="material-symbols-outlined text-4xl mb-2">code_off</span>
                                    <p>Tidak ada kode embed tersedia.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    // 3. OPEN (Default - Existing Form)
    return (
        <div className="flex flex-col min-h-screen bg-background-light font-display text-slate-900 transition-colors duration-200">
            <Navbar />

            <main className="flex-grow flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-4xl space-y-8 animate-fade-in-up">
                    {/* Page Heading */}
                    <div className="text-center space-y-4 mb-8">
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#181111]">
                            Pendaftaran
                        </h1>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto font-normal">
                            Isilah formulir pendaftaran di bawah ini.
                        </p>
                    </div>

                    {success && (
                        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg flex items-center justify-center gap-2 animate-in slide-in-from-top-2">
                            <span className="material-symbols-outlined">check_circle</span>
                            <span>Terima kasih! Pendaftaran Anda telah kami terima. Kami akan menghubungi Anda segera.</span>
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center justify-center gap-2 animate-in slide-in-from-top-2">
                            <span className="material-symbols-outlined">error</span>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Registration Card */}
                    <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden relative">
                        {/* Decorative Top Line */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-orange-500"></div>

                        <div className="p-8 sm:p-12">
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-2">
                                {/* Full Name */}
                                <div className="sm:col-span-1">
                                    <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="full-name">Nama Lengkap</label>
                                    <div className="relative">
                                        <input
                                            autoComplete="name"
                                            required
                                            className="block w-full rounded-lg border-slate-200 py-3 px-4 text-slate-900 shadow-sm focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm transition-all"
                                            id="full-name"
                                            name="full-name"
                                            placeholder="Jane Doe"
                                            type="text"
                                        />
                                    </div>
                                </div>
                                {/* Email */}
                                <div className="sm:col-span-1">
                                    <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="email">Email</label>
                                    <div className="relative">
                                        <input
                                            autoComplete="email"
                                            required
                                            className="block w-full rounded-lg border-slate-200 py-3 px-4 text-slate-900 shadow-sm focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm transition-all"
                                            id="email"
                                            name="email"
                                            placeholder="you@example.com"
                                            type="email"
                                        />
                                    </div>
                                </div>
                                {/* Phone Number */}
                                <div className="sm:col-span-1">
                                    <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="phone-number">Nomor Telepon</label>
                                    <div className="relative rounded-lg shadow-sm border border-slate-200 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary bg-white flex overflow-hidden">
                                        <div className="flex items-center pl-3 bg-slate-50 border-r border-slate-200 pr-3">
                                            <span className="text-slate-500 sm:text-sm material-symbols-outlined text-lg">call</span>
                                        </div>
                                        <input
                                            autoComplete="tel"
                                            required
                                            className="block w-full border-0 bg-transparent py-3 pl-3 pr-4 text-slate-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                                            id="phone-number"
                                            name="phone-number"
                                            placeholder="+1 (555) 987-6543"
                                            type="tel"
                                        />
                                    </div>
                                </div>
                                {/* Department Interest */}
                                <div className="sm:col-span-1">
                                    <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="department">Bidang Interes</label>
                                    <div className="relative">
                                        <select
                                            className="block w-full rounded-lg border-slate-200 py-3 px-4 text-slate-900 shadow-sm focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm transition-all appearance-none"
                                            id="department"
                                            name="department"
                                        >
                                            <option>Pilih Bidang Interes...</option>
                                            <option>Marketing & Communications</option>
                                            <option>Technology & Engineering</option>
                                            <option>Design & Creative</option>
                                            <option>Operations & Strategy</option>
                                            <option>Lainnya</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                            <span className="material-symbols-outlined text-sm">expand_more</span>
                                        </div>
                                    </div>
                                </div>
                                {/* Motivation */}
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="motivation">Motivasi <span className="text-gray-400 font-normal ml-1">(Optional)</span></label>
                                    <div className="relative">
                                        <textarea
                                            className="block w-full rounded-lg border-slate-200 py-3 px-4 text-slate-900 shadow-sm focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm resize-none transition-all"
                                            id="motivation"
                                            name="motivation"
                                            placeholder="Briefly tell us why you'd like to join the community..."
                                            rows={3}
                                        ></textarea>
                                    </div>
                                    <p className="mt-2 text-xs text-gray-400 text-right">Max 200 characters</p>
                                </div>
                                {/* Submit Button */}
                                <div className="sm:col-span-2 pt-4">
                                    <button
                                        disabled={loading || success}
                                        className="w-full flex justify-center items-center gap-2 rounded-lg bg-primary px-8 py-4 text-sm font-bold text-white shadow-lg shadow-red-500/30 hover:bg-red-700 hover:shadow-red-500/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                                        type="submit"
                                    >
                                        {loading ? 'Sending...' : 'Secure My Spot'}
                                        {!loading && <span className="material-symbols-outlined text-lg">arrow_forward</span>}
                                    </button>
                                </div>
                            </form>
                            {/* Social Proof */}
                            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-center gap-4">
                                <div className="flex -space-x-3 overflow-hidden p-1">
                                    {/* Placeholder avatars based on request */}
                                    <div className="inline-block h-10 w-10 rounded-full ring-2 ring-white bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">A</div>
                                    <div className="inline-block h-10 w-10 rounded-full ring-2 ring-white bg-slate-300 flex items-center justify-center text-xs font-bold text-slate-500">B</div>
                                    <div className="inline-block h-10 w-10 rounded-full ring-2 ring-white bg-slate-400 flex items-center justify-center text-xs font-bold text-slate-500">C</div>
                                    <div className="inline-block h-10 w-10 rounded-full ring-2 ring-white bg-slate-500 flex items-center justify-center text-xs font-bold text-slate-200">D</div>
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 ring-2 ring-white text-xs font-bold text-slate-600">
                                        +500
                                    </div>
                                </div>
                                <p className="text-sm font-medium text-gray-500">
                                    Join <span className="text-[#181111] font-bold">500+ others</span> waiting for access.
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* Additional Trust Signal */}
                    <div className="flex justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500 pt-8">
                        {/* Logos using simple text for representation or placeholders */}
                        <div className="text-xl font-black text-gray-400 tracking-tighter flex items-center gap-2">
                            <span className="material-symbols-outlined">verified</span> TRUSTED
                        </div>
                        <div className="text-xl font-black text-gray-400 tracking-tighter flex items-center gap-2">
                            <span className="material-symbols-outlined">lock</span> SECURE
                        </div>
                        <div className="text-xl font-black text-gray-400 tracking-tighter flex items-center gap-2">
                            <span className="material-symbols-outlined">bolt</span> FAST
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
