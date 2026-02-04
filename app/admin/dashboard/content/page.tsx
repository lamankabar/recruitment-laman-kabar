
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function ContentPage() {
    // Countdown State
    const [configId, setConfigId] = useState<number | null>(null) // Track the actual ID
    const [targetDate, setTargetDate] = useState('')
    const [targetTime, setTargetTime] = useState('')
    const [isCountdownActive, setIsCountdownActive] = useState(true)



    // Hero Content State
    const [heroId, setHeroId] = useState<number | null>(null)
    const [headlinePrefix, setHeadlinePrefix] = useState('')
    const [headlineHighlight, setHeadlineHighlight] = useState('')
    const [subheadline, setSubheadline] = useState('')

    // UI State
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState<string | null>(null)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)

        // Fetch Parallel
        const [countdownRes, heroRes] = await Promise.all([
            supabase.from('countdown_config').select('*').order('id', { ascending: false }).limit(1).single(),
            supabase.from('home_hero_content').select('*').limit(1).single()
        ])

        // 1. Countdown Data
        const countdownData = countdownRes.data
        if (countdownData?.target_date) {
            const dateObj = new Date(countdownData.target_date)
            const dateStr = dateObj.toISOString().split('T')[0]
            const timeStr = dateObj.toTimeString().slice(0, 5)

            setTargetDate(dateStr)
            setTargetTime(timeStr)
            setIsCountdownActive(countdownData.is_active ?? true)
            setConfigId(countdownData.id)
        }

        // 2. Hero Data
        const heroData = heroRes.data
        if (heroData) {
            setHeadlinePrefix(heroData.headline_prefix || '')
            setHeadlineHighlight(heroData.headline_highlight || '')
            setSubheadline(heroData.subheadline || '')
            setHeroId(heroData.id)
        } else {
            // Default values if empty
            setHeadlinePrefix('Something Big is')
            setHeadlineHighlight('Coming')
            setSubheadline('We are preparing an amazing experience for you. Join the movement.')
        }

        setLoading(false)
    }

    const handleSave = async () => {
        setSaving(true)
        setMessage(null)

        try {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) throw new Error("No active session.")

            // --- Save Countdown ---
            const fullDateTime = new Date(`${targetDate}T${targetTime}`)
            const countdownPayload = {
                target_date: fullDateTime.toISOString(),
                is_active: isCountdownActive
            }

            let countdownPromise
            if (configId) {
                countdownPromise = supabase.from('countdown_config').update(countdownPayload).eq('id', configId)
            } else {
                countdownPromise = supabase.from('countdown_config').insert(countdownPayload)
            }

            // --- Save Hero ---
            const heroPayload = {
                headline_prefix: headlinePrefix,
                headline_highlight: headlineHighlight,
                subheadline: subheadline
            }

            let heroPromise
            if (heroId) {
                heroPromise = supabase.from('home_hero_content').update(heroPayload).eq('id', heroId)
            } else {
                heroPromise = supabase.from('home_hero_content').insert(heroPayload)
            }

            // Execute Both
            const [countdownResult, heroResult] = await Promise.all([countdownPromise, heroPromise])

            if (countdownResult.error) throw countdownResult.error
            if (heroResult.error) throw heroResult.error

            setMessage('All changes saved successfully!')

            // Refresh IDs if they were null (inserts)
            fetchData()

            setTimeout(() => setMessage(null), 3000)
        } catch (error: any) {
            console.error('Save error:', error)
            setMessage('Failed to save: ' + (error.message || 'Unknown error'))
        } finally {
            setSaving(false)
        }
    }

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh] text-slate-400">
            <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-sm font-medium">Loading content...</p>
            </div>
        </div>
    )

    return (
        <div className="flex-1 w-full max-w-6xl mx-auto p-6 md:p-10 pb-32">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 mb-8">
                <span className="text-slate-400 text-sm font-medium">Dashboard</span>
                <span className="text-slate-300 text-sm">/</span>
                <span className="text-primary text-sm font-bold">Content Management</span>
            </div>

            {/* Page Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Manajemen Konten Beranda</h1>
                    <p className="text-slate-500 mt-2 text-lg">Atur teks highlight beranda dan timer hitung mundur.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 font-bold text-sm hover:border-primary/20 hover:text-primary transition-all shadow-sm">
                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                        <a href="/">Lihat Situs</a>
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving || loading}
                        className="px-6 py-2.5 rounded-lg bg-primary text-white font-bold text-sm hover:bg-red-700 transition-all flex items-center gap-2 shadow-lg shadow-primary/30 disabled:opacity-70 disabled:shadow-none"
                    >
                        {saving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Menyimpan...</span>
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-[18px]">save</span>
                                <span>Simpan Perubahan</span>
                            </>
                        )}
                    </button>
                </div>
            </header>

            <div className="max-w-4xl mx-auto space-y-8">
                {message && (
                    <div className={`p-4 rounded-xl border ${message.includes('Failed') ? 'bg-red-50 border-red-100 text-red-700' : 'bg-emerald-50 border-emerald-100 text-emerald-700'} font-medium flex items-center gap-3 animate-in fade-in slide-in-from-top-2`}>
                        <div className={`p-2 rounded-full ${message.includes('Failed') ? 'bg-red-100' : 'bg-emerald-100'}`}>
                            <span className="material-symbols-outlined text-[20px]">{message.includes('Failed') ? 'error' : 'check'}</span>
                        </div>
                        {message}
                    </div>
                )}

                {/* 1. HERO SECTION CARD */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden relative">
                    <div className="p-6 md:p-8 border-b border-slate-50 bg-gradient-to-r from-white to-slate-50/50 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-sm">
                            <span className="material-symbols-outlined text-[24px]">title</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Higlight Teks</h2>
                            <p className="text-slate-500 text-sm">Atur teks utama dan subjudul.</p>
                        </div>
                    </div>
                    <div className="p-6 md:p-8 grid grid-cols-1 gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-slate-700 ml-1">Headline Prefix</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-blue-500 text-slate-400">
                                        <span className="material-symbols-outlined">text_fields</span>
                                    </div>
                                    <input
                                        type="text"
                                        value={headlinePrefix}
                                        onChange={(e) => setHeadlinePrefix(e.target.value)}
                                        placeholder="e.g. Something Big is"
                                        className="block w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 hover:bg-white"
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-slate-700 ml-1">Headline Highlight (Red)</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-red-500 text-slate-400">
                                        <span className="material-symbols-outlined">format_paint</span>
                                    </div>
                                    <input
                                        type="text"
                                        value={headlineHighlight}
                                        onChange={(e) => setHeadlineHighlight(e.target.value)}
                                        placeholder="e.g. Coming"
                                        className="block w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-brand-red font-bold focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all placeholder:text-slate-400 hover:bg-white"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-700 ml-1">Subheadline</label>
                            <div className="relative group">
                                <div className="absolute top-3.5 left-0 pl-4 flex items-start pointer-events-none transition-colors group-focus-within:text-blue-500 text-slate-400">
                                    <span className="material-symbols-outlined">description</span>
                                </div>
                                <textarea
                                    value={subheadline}
                                    onChange={(e) => setSubheadline(e.target.value)}
                                    placeholder="e.g. We are preparing an amazing experience..."
                                    className="block w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 hover:bg-white min-h-[100px] resize-none"
                                />
                            </div>
                        </div>

                        {/* Preview */}
                        <div className="mt-4 rounded-2xl border border-slate-200 overflow-hidden">
                            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center gap-2">
                                <span className="material-symbols-outlined text-slate-400 text-sm">visibility</span>
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live Preview</span>
                            </div>
                            <div className="p-10 bg-white flex flex-col items-center text-center">
                                <h1 className="text-3xl md:text-5xl font-black text-[#181111] tracking-tight mb-4">
                                    {headlinePrefix || 'Ini teks highlight'} <span className="text-primary">{headlineHighlight || 'highlight merah'}</span>
                                </h1>
                                <p className="text-[#8a6060] text-lg md:text-xl font-normal leading-normal max-w-2xl">
                                    {subheadline || 'Ini subheadline'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. COUNTDOWN SETTINGS CARD */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden relative">
                    {/* Card Header with Toggle */}
                    <div className="p-6 md:p-8 border-b border-slate-50 bg-gradient-to-r from-white to-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100 shadow-sm">
                                <span className="material-symbols-outlined text-[24px]">timer</span>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Hitung Mundur</h2>
                                <p className="text-slate-500 text-sm">Atur tanggal target untuk timer hitung mundur.</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className={`text-sm font-bold transition-colors ${isCountdownActive ? 'text-emerald-600' : 'text-slate-500'}`}>
                                {isCountdownActive ? 'Active' : 'Disabled'}
                            </span>
                            <button
                                onClick={() => setIsCountdownActive(!isCountdownActive)}
                                className={`relative h-8 w-14 rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${isCountdownActive ? 'bg-emerald-500' : 'bg-slate-200'}`}
                            >
                                <span
                                    className={`absolute left-0.5 top-0.5 flex h-7 w-7 transform items-center justify-center rounded-full bg-white shadow transition-transform duration-200 ease-in-out ${isCountdownActive ? 'translate-x-[1.5rem]' : 'translate-x-0'}`}
                                >
                                    <span className={`material-symbols-outlined text-[16px] font-bold ${isCountdownActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                                        {isCountdownActive ? 'check' : 'close'}
                                    </span>
                                </span>
                            </button>
                        </div>
                    </div>

                    <div className={`p-6 md:p-8 transition-all duration-300 ${!isCountdownActive && 'opacity-50 grayscale pointer-events-none'}`}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Date Input */}
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-slate-700 ml-1">Tanggal</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-orange-500 text-slate-400">
                                        <span className="material-symbols-outlined">calendar_today</span>
                                    </div>
                                    <input
                                        type="date"
                                        value={targetDate}
                                        onChange={(e) => setTargetDate(e.target.value)}
                                        className="block w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder:text-slate-400 hover:bg-white"
                                    />
                                </div>
                            </div>

                            {/* Time Input */}
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-slate-700 ml-1">Jam</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-orange-500 text-slate-400">
                                        <span className="material-symbols-outlined">schedule</span>
                                    </div>
                                    <input
                                        type="time"
                                        value={targetTime}
                                        onChange={(e) => setTargetTime(e.target.value)}
                                        className="block w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder:text-slate-400 hover:bg-white"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100 flex gap-4 items-start">
                            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                <span className="material-symbols-outlined text-[20px]">public</span>
                            </div>
                            <div className="text-sm text-blue-800 pt-1">
                                <strong className="block mb-1 font-bold text-blue-900">Zona Waktu Lokal</strong>
                                Waktu yang Anda atur mengikuti zona waktu browser Anda. Hitung mundur akan secara otomatis menyesuaikan dengan zona waktu pengunjung.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
