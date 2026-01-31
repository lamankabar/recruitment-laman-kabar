
'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const [loading, setLoading] = useState(true)
    const [isSidebarOpen, setSidebarOpen] = useState(false)

    // Logout States
    const [showLogoutDialog, setShowLogoutDialog] = useState(false)
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                router.push('/admin/login')
            } else {
                setLoading(false)
            }
        }
        checkAuth()
    }, [router])

    const handleLogout = () => {
        setShowLogoutDialog(true)
    }

    const confirmLogout = async () => {
        setShowLogoutDialog(false)
        setIsLoggingOut(true)

        // Add a small delay so the user sees the loading animation
        await new Promise(resolve => setTimeout(resolve, 800))

        await supabase.auth.signOut()
        router.push('/admin/login')
    }

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-background-light font-display text-primary">Loading Laman Kabar...</div>
    }

    const navItems = [
        { href: '/admin/dashboard', icon: 'dashboard', label: 'Dashboard' },
        { href: '/admin/dashboard/content', icon: 'edit_document', label: 'Konten Beranda' },
        { href: '/admin/dashboard/about', icon: 'info', label: 'Tentang Kami' },
        { href: '/admin/dashboard/departments', icon: 'domain', label: 'Department' },
        { href: '/admin/dashboard/submissions', icon: 'group', label: 'Pendaftaran' },
        { href: '/admin/dashboard/registration', icon: 'settings_applications', label: 'Pengaturan Pendaftaran' },
    ]

    return (
        <div className="flex h-screen w-full overflow-hidden bg-background-light text-slate-900 font-display relative">

            {/* Logout Loading Overlay */}
            {isLoggingOut && (
                <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
                    <p className="text-lg font-bold text-slate-700 animate-pulse">Logging out...</p>
                </div>
            )}

            {/* Logout Confirmation Dialog */}
            {showLogoutDialog && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
                        onClick={() => setShowLogoutDialog(false)}
                    ></div>

                    {/* Modal */}
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm relative z-10 animate-in zoom-in-95 duration-200 border border-slate-100">
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-2">
                                <span className="material-symbols-outlined text-2xl">logout</span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">Konfirmasi Logout</h3>
                            <p className="text-slate-500 text-sm">Apakah Anda yakin ingin keluar dari dashboard admin?</p>

                            <div className="flex gap-3 w-full mt-2">
                                <button
                                    onClick={() => setShowLogoutDialog(false)}
                                    className="flex-1 py-2.5 rounded-lg border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={confirmLogout}
                                    className="flex-1 py-2.5 rounded-lg bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20"
                                >
                                    Ya, Keluar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar Navigation */}
            <aside
                className={`flex flex-col justify-between border-r border-slate-200 bg-white p-4 z-40
                fixed lg:relative top-0 left-0 h-full w-64 transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                <div className="flex flex-col gap-6">
                    {/* Logo Area */}
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-3">
                            <img
                                src="http://cdn01.lamankabar.web.id/logo/lamankabar-logo.png"
                                alt="Laman Kabar Logo"
                                className="h-10 w-auto object-contain"
                            />
                        </div>
                        {/* Close button for mobile */}
                        <button
                            className="lg:hidden text-slate-500 hover:text-primary"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex flex-col gap-2">
                        {navItems.map((item) => {
                            const isActive = item.href === '/admin/dashboard'
                                ? pathname === item.href
                                : pathname.startsWith(item.href)
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)} // Close on navigate (mobile)
                                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${isActive
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                >
                                    <span className={`material-symbols-outlined text-[20px] ${isActive ? 'fill-1' : ''}`}>
                                        {item.icon}
                                    </span>
                                    <span className={`text-sm ${isActive ? 'font-bold' : 'font-medium'}`}>
                                        {item.label}
                                    </span>
                                </Link>
                            )
                        })}
                        <div className="my-2 border-t border-slate-100"></div>
                        <button onClick={handleLogout} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors w-full text-left">
                            <span className="material-symbols-outlined text-[20px]">logout</span>
                            <span className="text-sm font-medium">Log Out</span>
                        </button>
                    </nav>
                </div>

                {/* User Profile */}
                <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-200 flex items-center justify-center text-slate-400">
                        <span className="material-symbols-outlined">person</span>
                    </div>
                    <div className="flex flex-col">
                        <p className="text-sm font-bold text-slate-900">Admin User</p>
                        <p className="text-xs text-slate-500">Administrator</p>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex-col overflow-y-auto relative w-full">
                {/* Mobile Header for Sidebar Toggle */}
                <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 sticky top-0 z-20">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="text-slate-500 hover:text-primary"
                        >
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                        <span className="font-bold text-slate-900">Dashboard</span>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-sm">person</span>
                    </div>
                </div>

                {children}
            </main>
        </div>
    )
}
