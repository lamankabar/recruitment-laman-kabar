
'use client'

import Link from 'next/link'
import React from 'react'

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

    return (
        <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-[#f5f0f0] bg-white/80 backdrop-blur-md px-5 md:px-10 py-4">
            <div className="flex items-center gap-3">
                <img
                    src="http://cdn01.lamankabar.web.id/logo/lamankabar.png"
                    alt="Laman Kabar Logo"
                    className="h-10 w-auto object-contain"
                />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex flex-1 justify-end gap-8 items-center">
                <div className="flex items-center gap-9">
                    <Link className="text-sm font-medium leading-normal hover:text-primary transition-colors text-slate-900" href="/">Beranda</Link>
                    <Link className="text-sm font-medium leading-normal hover:text-primary transition-colors text-slate-900" href="/tentang-kami">Tentang</Link>
                    <Link className="text-sm font-medium leading-normal hover:text-primary transition-colors text-slate-900" href="/struktur">Struktur</Link>
                    <Link className="text-sm font-medium leading-normal hover:text-primary transition-colors text-slate-900" href="/faq">FAQ</Link>
                    <Link className="text-sm font-medium leading-normal hover:text-primary transition-colors text-slate-900" href="/hubungi-kami">Hubungi Kami</Link>
                </div>
                <Link href="/daftar" className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-6 bg-primary text-white text-sm font-bold hover:bg-red-700 transition-colors">
                    <span className="truncate">Daftar</span>
                </Link>
            </div>

            {/* Mobile Menu Icon */}
            <div className="flex md:hidden text-primary cursor-pointer" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                <span className="material-symbols-outlined">{isMobileMenuOpen ? 'close' : 'menu'}</span>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-lg p-5 flex flex-col gap-4 animate-in slide-in-from-top-2 md:hidden">
                    <Link onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium py-2 hover:text-primary transition-colors text-slate-900 border-b border-gray-50" href="/">Beranda</Link>
                    <Link onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium py-2 hover:text-primary transition-colors text-slate-900 border-b border-gray-50" href="/tentang-kami">Tentang</Link>
                    <Link onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium py-2 hover:text-primary transition-colors text-slate-900 border-b border-gray-50" href="/struktur">Struktur</Link>
                    <Link onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium py-2 hover:text-primary transition-colors text-slate-900 border-b border-gray-50" href="/faq">FAQ</Link>
                    <Link onClick={() => setIsMobileMenuOpen(false)} className="text-base font-medium py-2 hover:text-primary transition-colors text-slate-900 border-b border-gray-50" href="/hubungi-kami">Hubungi Kami</Link>
                    <Link onClick={() => setIsMobileMenuOpen(false)} href="/daftar" className="flex items-center justify-center rounded-lg h-10 px-6 bg-primary text-white text-sm font-bold hover:bg-red-700 transition-colors mt-2">
                        Daftar
                    </Link>
                </div>
            )}
        </header>
    )
}
