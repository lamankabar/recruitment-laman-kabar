
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Loader2, Save, AlertCircle, CheckCircle } from 'lucide-react'

export default function AdminAboutPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const [form, setForm] = useState({
        id: 0,
        title: '',
        description: '',
        vision: '',
        mission: '',
        closing_text: '',
        logo_url: '' // Future use, or text input for now
    })

    useEffect(() => {
        fetchData()
    }, [])

    async function fetchData() {
        setLoading(true)
        const { data, error } = await supabase
            .from('about_us')
            .select('*')
            .single() // Assuming one row

        if (error) {
            console.error('Error fetching about us:', error)
            // If no row exists, we might just start blank or insert one. 
            // For now, let's assume the SQL script inserted a default row.
        }

        if (data) {
            setForm({
                id: data.id,
                title: data.title || '',
                description: data.description || '',
                vision: data.vision || '',
                mission: data.mission || '',
                closing_text: data.closing_text || '',
                logo_url: data.logo_url || ''
            })
        }
        setLoading(false)
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault()
        setSaving(true)
        setMessage(null)

        const updates = {
            title: form.title,
            description: form.description,
            vision: form.vision,
            mission: form.mission,
            closing_text: form.closing_text,
            logo_url: form.logo_url,
            updated_at: new Date().toISOString(),
        }

        let error;

        if (form.id) {
            // Update existing
            const { error: updateError } = await supabase
                .from('about_us')
                .update(updates)
                .eq('id', form.id)
            error = updateError
        } else {
            // Insert new (should rarely happen if seeded correctly)
            const { error: insertError } = await supabase
                .from('about_us')
                .insert([updates])
            error = insertError
        }

        if (error) {
            setMessage({ type: 'error', text: 'Gagal menyimpan perubahan: ' + error.message })
        } else {
            setMessage({ type: 'success', text: 'Perubahan berhasil disimpan!' })
            fetchData() // Refresh
        }
        setSaving(false)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    if (loading) return <div className="p-8 text-center">Loading editor...</div>

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <header className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Edit Tentang Kami</h1>
                    <p className="text-slate-500 mt-2">Ubah konten halaman Tentang Kami secara real-time.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-brand-red text-white px-6 py-2.5 rounded-lg font-bold hover:bg-red-700 transition disabled:opacity-50"
                >
                    {saving ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
                    Simpan Perubahan
                </button>
            </header>

            {message && (
                <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSave} className="space-y-8 bg-white p-8 rounded-xl border border-gray-100 shadow-sm">

                {/* Logo URL */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Logo URL (Optional)</label>
                    <input
                        name="logo_url"
                        value={form.logo_url}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-red outline-none"
                        placeholder="https://example.com/logo.png"
                    />
                    <p className="text-xs text-gray-400 mt-1">Biarkan kosong untuk menggunakan icon default.</p>
                </div>

                {/* Title */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Judul Halaman</label>
                    <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-red outline-none"
                        placeholder="Contoh: Tentang Laman Kabar"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Deskripsi Utama</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-red outline-none"
                        placeholder="Paragraf pembuka..."
                    />
                </div>

                {/* Vision */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Visi</label>
                    <textarea
                        name="vision"
                        value={form.vision}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-red outline-none"
                        placeholder="Visi komunitas..."
                    />
                </div>

                {/* Mission */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Misi (Gunakan koma untuk pemisah poin)</label>
                    <textarea
                        name="mission"
                        value={form.mission}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-red outline-none"
                        placeholder="Misi 1, Misi 2, Misi 3..."
                    />
                    <p className="text-xs text-gray-400 mt-1">Kami akan mengubah format ini menjadi list secara otomatis di tampilan publik.</p>
                </div>

                {/* Closing Text */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Teks Penutup</label>
                    <textarea
                        name="closing_text"
                        value={form.closing_text}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-red outline-none"
                        placeholder="Kata-kata ajakan di bawah..."
                    />
                </div>

            </form>
        </div>
    )
}
