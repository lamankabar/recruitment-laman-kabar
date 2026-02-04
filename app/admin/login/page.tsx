
'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminLogin() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            router.push('/admin/dashboard')
        }
    }

    return (
        <div className="font-display min-h-screen flex flex-col md:flex-row w-full bg-background-light text-[#181111] transition-colors duration-200">
            {/* Left Side: Branding / Visuals */}
            <div className="hidden md:flex flex-col justify-between w-full md:w-5/12 lg:w-1/2 bg-[#181111] relative overflow-hidden p-12">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    {/* Using a placeholder or the provided URL if valid. This one is from the prompt. */}
                    <img
                        alt="Team collaboration in modern office"
                        className="w-full h-full object-cover opacity-40 mix-blend-overlay"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdxJovb7dJZeIjvFdHfTAO_i1g1gaqGMIMT0mzlJc28gSaFxwZGLhQ91QGY3JccreANHxoqK6MVvsWcOwNQUFDmmS6TtBvyMhGAS_yaMDk45ugQiTIxZR-Ilc3Eu7Ges_Anf2gPk3ki7mm0EiDyFgqwdcqDZMdHDqLYuQY3dd-ZyZteA7p3Y3k-zaDi43OQ-Whh0OnVxgvEII6ObVVautQP2q2IkDrjlULabZiCcBm2vTffxigZDhL6NpwlZzWBHpItAerX1-bcJs"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-[#181111]/90 mix-blend-multiply"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full justify-between animate-fade-in-up">
                    <div>
                        <div className="mb-8">
                            <img
                                src="http://cdn01.lamankabar.web.id/logo/lamankabar-logo.png"
                                alt="Laman Kabar Logo"
                                className="h-12 w-auto object-contain bg-white/10 rounded-lg p-2 backdrop-blur-sm"
                            />
                        </div>
                        {/* <div className="size-10 bg-white rounded-lg flex items-center justify-center text-primary mb-8 shadow-lg">
                            <span className="material-symbols-outlined text-2xl">grid_view</span>
                        </div> */}
                        <h1 className="text-white text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight mb-4">
                            Laman Kabar Admin.
                        </h1>
                        <p className="text-white/80 text-lg font-medium max-w-md">
                            Masuk ke akun Anda untuk mengelola website.
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
                {/* Mobile Header (Visible only on small screens) */}
                <div className="md:hidden p-6 flex justify-between items-center bg-white border-b border-[#e6dbdb]">
                    <div className="flex items-center gap-2 text-[#181111]">
                        <img
                            src="http://cdn01.lamankabar.web.id/logo/lamankabar-logo.png"
                            alt="Laman Kabar Admin"
                            className="h-8 w-auto object-contain"
                        />
                        {/* <span className="font-bold text-lg">Laman Kabar Admin</span> */}
                    </div>
                </div>

                <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-24 overflow-y-auto">
                    <div className="w-full max-w-md flex flex-col gap-8 animate-fade-in-up">
                        {/* Top Navigation Link */}
                        <div className="absolute top-6 right-6 hidden md:block">
                            <Link href="/" className="text-sm font-semibold text-[#8a6060] hover:text-primary transition-colors flex items-center gap-2">
                                Kembali ke Beranda
                                <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </Link>
                        </div>

                        {/* Header Section */}
                        <div className="flex flex-col gap-2">
                            <h2 className="text-[#181111] text-3xl font-extrabold tracking-tight">Masuk ke Akun Anda</h2>
                            <p className="text-[#8a6060] text-base">Masukkan email dan kata sandi Anda untuk masuk ke akun Anda.</p>
                        </div>

                        {/* Display Error if any */}
                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded text-sm flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">error</span>
                                {error}
                            </div>
                        )}

                        {/* Tabs */}
                        <div className="border-b border-[#e6dbdb] flex gap-8">
                            <button className="pb-3 border-b-2 border-primary text-[#181111] font-bold text-sm tracking-wide">
                                Masuk
                            </button>
                            <Link href="/admin/register" className="pb-3 border-b-2 border-transparent text-[#8a6060] hover:text-[#181111] transition-colors font-bold text-sm tracking-wide">
                                Daftar
                            </Link>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleLogin} className="flex flex-col gap-5">
                            {/* Email Input */}
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

                            {/* Password Input */}
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-[#181111] text-sm font-semibold" htmlFor="password">Password</label>
                                </div>
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
                                    />
                                    {/* Password Toggle Visibility could go here */}
                                    <button className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8a6060] hover:text-[#181111] cursor-pointer" type="button">
                                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                                    </button>
                                </div>
                            </div>



                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-2 w-full bg-primary hover:bg-red-700 text-white font-bold py-3.5 px-6 rounded-lg shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loading ? 'Masuk ke akun...' : (
                                    <>
                                        <span>Masuk</span>
                                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Footer / Switch Context */}
                        <div className="text-center pt-4">
                            <p className="text-[#8a6060] text-sm">
                                Tidak mempunyai akun?{' '}
                                <Link href="/admin/register" className="text-primary font-bold hover:underline">Daftar</Link>
                            </p>
                        </div>

                        {/* Help Link (Mobile only mostly) */}
                        {/* <div className="md:hidden text-center mt-8">
                            <a className="text-sm font-medium text-[#181111] underline" href="#">Butuh bantuan masuk?</a>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    )
}
