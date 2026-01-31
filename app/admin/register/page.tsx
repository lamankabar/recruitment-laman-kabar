
'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminRegister() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [message, setMessage] = useState<string | null>(null)
    const router = useRouter()

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setMessage(null)

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${location.origin}/admin/dashboard`,
            }
        })

        if (error) {
            setError(error.message)
        } else {
            if (data.session) {
                // Auto logged in
                router.push('/admin/dashboard')
            } else {
                setMessage('Registrasi berhasil! Silakan login untuk masuk ke akun.')
            }
        }
        setLoading(false)
    }

    return (
        <div className="font-display min-h-screen flex flex-col md:flex-row w-full bg-background-light text-[#181111] transition-colors duration-200">
            {/* Left Side: Branding / Visuals */}
            <div className="hidden md:flex flex-col justify-between w-full md:w-5/12 lg:w-1/2 bg-[#181111] relative overflow-hidden p-12">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        alt="Team collaboration"
                        className="w-full h-full object-cover opacity-40 mix-blend-overlay"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdxJovb7dJZeIjvFdHfTAO_i1g1gaqGMIMT0mzlJc28gSaFxwZGLhQ91QGY3JccreANHxoqK6MVvsWcOwNQUFDmmS6TtBvyMhGAS_yaMDk45ugQiTIxZR-Ilc3Eu7Ges_Anf2gPk3ki7mm0EiDyFgqwdcqDZMdHDqLYuQY3dd-ZyZteA7p3Y3k-zaDi43OQ-Whh0OnVxgvEII6ObVVautQP2q2IkDrjlULabZiCcBm2vTffxigZDhL6NpwlZzWBHpItAerX1-bcJs"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-[#181111]/90 mix-blend-multiply"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                        <div className="mb-8">
                            <img
                                src="http://cdn01.lamankabar.web.id/logo/lamankabar-logo.png"
                                alt="Laman Kabar Logo"
                                className="h-12 w-auto object-contain bg-white/10 rounded-lg p-2 backdrop-blur-sm"
                            />
                        </div>
                        <h1 className="text-white text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight mb-4">
                            Laman Kabar Admin.
                        </h1>
                        <p className="text-white/80 text-lg font-medium max-w-md">
                            Buat akun admin Anda dan mulailah mengelola website hari ini.
                        </p>
                    </div>
                    <div className="flex items-center gap-4 text-white/60 text-sm">
                        <p>© {new Date().getFullYear()} Laman Kabar.</p>
                        <span className="w-1 h-1 bg-white/40 rounded-full"></span>
                        <p>Privacy Policy</p>
                        <span className="w-1 h-1 bg-white/40 rounded-full"></span>
                        <p>Terms of Service</p>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl z-0"></div>
                <div className="absolute top-1/4 -left-12 w-48 h-48 bg-white/10 rounded-full blur-2xl z-0"></div>
            </div>

            {/* Right Side: Auth Form */}
            <div className="w-full md:w-7/12 lg:w-1/2 flex flex-col relative bg-background-light">
                {/* Mobile Header */}
                <div className="md:hidden p-6 flex justify-between items-center bg-white border-b border-[#e6dbdb]">
                    <div className="flex items-center gap-2 text-[#181111]">
                        <img
                            src="http://cdn01.lamankabar.web.id/logo/lamankabar-logo.png"
                            alt="Laman Kabar Admin"
                            className="h-8 w-auto object-contain"
                        />
                        <span className="font-bold text-lg">Laman Kabar Admin</span>
                    </div>
                </div>

                <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-24 overflow-y-auto">
                    <div className="w-full max-w-md flex flex-col gap-8">
                        {/* Top Navigation Link */}
                        <div className="absolute top-6 right-6 hidden md:block">
                            <Link href="/" className="text-sm font-semibold text-[#8a6060] hover:text-primary transition-colors flex items-center gap-2">
                                Kembali ke Beranda
                                <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </Link>
                        </div>

                        {/* Header Section */}
                        <div className="flex flex-col gap-2">
                            <h2 className="text-[#181111] text-3xl font-extrabold tracking-tight">Buat Akun</h2>
                            <p className="text-[#8a6060] text-base">Daftar untuk menjadi administrator.</p>
                        </div>

                        {/* Alerts */}
                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded text-sm flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">error</span>
                                {error}
                            </div>
                        )}
                        {message && (
                            <div className="bg-green-50 text-green-600 p-3 rounded text-sm flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">check_circle</span>
                                {message}
                            </div>
                        )}

                        {/* Tabs */}
                        <div className="border-b border-[#e6dbdb] flex gap-8">
                            <Link href="/admin/login" className="pb-3 border-b-2 border-transparent text-[#8a6060] hover:text-[#181111] transition-colors font-bold text-sm tracking-wide">
                                Masuk
                            </Link>
                            <button className="pb-3 border-b-2 border-primary text-[#181111] font-bold text-sm tracking-wide">
                                Daftar
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleRegister} className="flex flex-col gap-5">
                            <div className="flex flex-col gap-2">
                                <label className="text-[#181111] text-sm font-semibold" htmlFor="email">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="material-symbols-outlined text-[#8a6060] group-focus-within:text-primary transition-colors">mail</span>
                                    </div>
                                    <input
                                        className="w-full bg-white text-[#181111] border border-[#e6dbdb] rounded-lg pl-10 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-[#8a6060]/50"
                                        id="email"
                                        type="email"
                                        placeholder="nama@emailkamu.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-[#181111] text-sm font-semibold" htmlFor="password">Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="material-symbols-outlined text-[#8a6060] group-focus-within:text-primary transition-colors">lock</span>
                                    </div>
                                    <input
                                        className="w-full bg-white text-[#181111] border border-[#e6dbdb] rounded-lg pl-10 pr-10 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-[#8a6060]/50"
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength={6}
                                    />
                                </div>
                                <p className="text-xs text-[#8a6060]">Minimal 6 karakter.</p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-2 w-full bg-primary hover:bg-red-700 text-white font-bold py-3.5 px-6 rounded-lg shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loading ? 'Membuat Akun...' : (
                                    <>
                                        <span>Daftar</span>
                                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="text-center pt-4">
                            <p className="text-[#8a6060] text-sm">
                                Sudah punya akun admin?{' '}
                                <Link href="/admin/login" className="text-primary font-bold hover:underline">Masuk</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
