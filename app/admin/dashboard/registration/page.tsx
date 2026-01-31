'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function RegistrationConfigPage() {
    const [status, setStatus] = useState<string>('open')
    const [embedCode, setEmbedCode] = useState('')
    const [closedMessage, setClosedMessage] = useState('Pendaftaran saat ini sedang ditutup. Nantikan informasi selanjutnya.')
    const [configId, setConfigId] = useState<number | null>(null)

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState<string | null>(null)

    useEffect(() => {
        fetchConfig()
    }, [])

    async function fetchConfig() {
        setLoading(true)
        const { data } = await supabase.from('registration_config').select('*').limit(1).single()

        if (data) {
            setStatus(data.status || 'open')
            setEmbedCode(data.embed_code || '')
            setClosedMessage(data.closed_message || '')
            setConfigId(data.id)
        }
        setLoading(false)
    }

    async function handleSave() {
        setSaving(true)
        setMessage(null)

        const payload = {
            status,
            embed_code: status === 'embed' ? embedCode : null,
            closed_message: closedMessage
        }

        let error
        if (configId) {
            const { error: err } = await supabase.from('registration_config').update(payload).eq('id', configId)
            error = err
        } else {
            const { data, error: err } = await supabase.from('registration_config').insert(payload).select().single()
            if (data) setConfigId(data.id)
            error = err
        }

        if (error) {
            setMessage('Failed to save: ' + error.message)
        } else {
            setMessage('Configuration saved successfully!')
            setTimeout(() => setMessage(null), 3000)
        }
        setSaving(false)
    }

    if (loading) return <div className="p-8 text-center text-gray-500">Loading configuration...</div>

    return (
        <div className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-8 flex flex-col gap-6 pb-32">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-sm text-[#8a6060] font-medium mb-4">
                <span>Dashboard</span>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
                <span className="text-[#181111] font-bold">Registration Config</span>
            </div>

            <div className="flex flex-col gap-2 mb-8">
                <h1 className="text-[#181111] text-3xl md:text-4xl font-extrabold tracking-tight">Registration Settings</h1>
                <p className="text-[#8a6060] text-base font-normal">Control how users can register or join the community.</p>
            </div>

            {message && (
                <div className={`p-4 rounded-xl border font-medium flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${message.includes('Failed') ? 'bg-red-50 border-red-100 text-red-700' : 'bg-emerald-50 border-emerald-100 text-emerald-700'}`}>
                    <span className="material-symbols-outlined">{message.includes('Failed') ? 'error' : 'check_circle'}</span>
                    {message}
                </div>
            )}

            <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
                <div className="p-6 md:p-8 border-b border-slate-50 bg-slate-50/50">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">Registration Status used</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Option: Closed */}
                        <div
                            onClick={() => setStatus('closed')}
                            className={`cursor-pointer relative p-4 rounded-xl border-2 transition-all duration-200 flex flex-col gap-3 hover:shadow-md ${status === 'closed' ? 'border-red-500 bg-red-50/50 ring-1 ring-red-500' : 'border-slate-100 bg-white hover:border-red-200'}`}
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${status === 'closed' ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                <span className="material-symbols-outlined">block</span>
                            </div>
                            <div>
                                <h3 className={`font-bold ${status === 'closed' ? 'text-red-900' : 'text-slate-700'}`}>Registration Closed</h3>
                                <p className="text-xs text-slate-500 mt-1">Users will see a "Closed" message.</p>
                            </div>
                            {status === 'closed' && (
                                <div className="absolute top-4 right-4 text-red-500">
                                    <span className="material-symbols-outlined">check_circle</span>
                                </div>
                            )}
                        </div>

                        {/* Option: Open (Native) */}
                        <div
                            onClick={() => setStatus('open')}
                            className={`cursor-pointer relative p-4 rounded-xl border-2 transition-all duration-200 flex flex-col gap-3 hover:shadow-md ${status === 'open' ? 'border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500' : 'border-slate-100 bg-white hover:border-emerald-200'}`}
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${status === 'open' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                <span className="material-symbols-outlined">how_to_reg</span>
                            </div>
                            <div>
                                <h3 className={`font-bold ${status === 'open' ? 'text-emerald-900' : 'text-slate-700'}`}>Open</h3>
                                <p className="text-xs text-slate-500 mt-1">Use standard Laman Kabar form.</p>
                            </div>
                            {status === 'open' && (
                                <div className="absolute top-4 right-4 text-emerald-500">
                                    <span className="material-symbols-outlined">check_circle</span>
                                </div>
                            )}
                        </div>

                        {/* Option: Embed */}
                        <div
                            onClick={() => setStatus('embed')}
                            className={`cursor-pointer relative p-4 rounded-xl border-2 transition-all duration-200 flex flex-col gap-3 hover:shadow-md ${status === 'embed' ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500' : 'border-slate-100 bg-white hover:border-blue-200'}`}
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${status === 'embed' ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                <span className="material-symbols-outlined">code</span>
                            </div>
                            <div>
                                <h3 className={`font-bold ${status === 'embed' ? 'text-blue-900' : 'text-slate-700'}`}>Open (Embed)</h3>
                                <p className="text-xs text-slate-500 mt-1">Embed external form (e.g. Google Form).</p>
                            </div>
                            {status === 'embed' && (
                                <div className="absolute top-4 right-4 text-blue-500">
                                    <span className="material-symbols-outlined">check_circle</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-6 md:p-8 space-y-6">
                    {/* Conditional Settings based on Selection */}
                    {status === 'closed' && (
                        <div className="animate-in fade-in slide-in-from-top-2">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Closed Message</label>
                            <textarea
                                value={closedMessage}
                                onChange={(e) => setClosedMessage(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all font-medium resize-none min-h-[100px]"
                                placeholder="Write a message to display when closed..."
                            />
                            <p className="text-xs text-slate-400 mt-2">Example: "Registration is strictly closed. We will open again in June."</p>
                        </div>
                    )}

                    {status === 'open' && (
                        <div className="animate-in fade-in slide-in-from-top-2 p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-800 text-sm flex gap-3">
                            <span className="material-symbols-outlined">info</span>
                            <p>The standard Laman Kabar registration form (Name, Email, Phone, Dept) is currently active and accepting submissions into the database.</p>
                        </div>
                    )}

                    {status === 'embed' && (
                        <div className="animate-in fade-in slide-in-from-top-2">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Embed Code (iFrame or Script)</label>
                            <div className="bg-blue-50 border border-blue-100 rounded-xl overflow-hidden">
                                <div className="p-2 bg-blue-100/50 border-b border-blue-100 text-xs text-blue-700 font-mono px-4">
                                    Paste your &lt;iframe&gt; code below
                                </div>
                                <textarea
                                    value={embedCode}
                                    onChange={(e) => setEmbedCode(e.target.value)}
                                    className="w-full bg-slate-800 text-slate-100 p-4 font-mono text-sm focus:outline-none min-h-[150px] block border-none"
                                    placeholder='<iframe src="https://docs.google.com/forms/..." ...></iframe>'
                                />
                            </div>
                            <p className="text-xs text-slate-400 mt-2">Make sure to set the width to 100% and remove fixed heights if possible for responsiveness.</p>
                        </div>
                    )}
                </div>

                {/* Footer in Card */}
                <div className="px-6 md:px-8 py-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 transition-all">
                    <button
                        onClick={handleSave}
                        disabled={saving || loading}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-red to-red-600 text-white font-bold text-sm hover:shadow-lg hover:shadow-brand-red/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-70 disabled:hover:scale-100"
                    >
                        {saving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Saving...</span>
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-[18px]">save</span>
                                <span>Save Configuration</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
