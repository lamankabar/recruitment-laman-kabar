'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type FAQ = {
    id: string
    question: string
    answer: string
    is_active: boolean
    created_at?: string
}

export default function FAQPage() {
    const [faqs, setFaqs] = useState<FAQ[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    // Config State (whether FAQ section is globally visible)
    // We'll store it in departments_config or a similar settings table, but for now we can just rely on the table data.
    // Or we could create an faq_config table, but let's just make the section appear if there are any active FAQs.

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [newQuestion, setNewQuestion] = useState('')
    const [newAnswer, setNewAnswer] = useState('')
    const [newIsActive, setNewIsActive] = useState(true)
    const [saving, setSaving] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)

    // Menu State (for Delete)
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null)

    useEffect(() => {
        fetchData()
    }, [])

    async function fetchData() {
        setLoading(true)
        const { data, error } = await supabase.from('faqs').select('*').order('created_at', { ascending: true })

        if (data) setFaqs(data)
        setLoading(false)
    }

    function openAddModal() {
        setEditingId(null)
        setNewQuestion('')
        setNewAnswer('')
        setNewIsActive(true)
        setIsModalOpen(true)
    }

    function openEditModal(faq: FAQ) {
        setEditingId(faq.id)
        setNewQuestion(faq.question)
        setNewAnswer(faq.answer)
        setNewIsActive(faq.is_active)
        setIsModalOpen(true)
        setActiveMenuId(null)
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault()
        setSaving(true)

        if (editingId) {
            const { data, error } = await supabase
                .from('faqs')
                .update({ question: newQuestion, answer: newAnswer, is_active: newIsActive })
                .eq('id', editingId)
                .select()

            if (data && !error) {
                setFaqs(faqs.map(f => f.id === editingId ? data[0] : f))
                setIsModalOpen(false)
            } else if (error) {
                console.error("Error updating FAQ:", error)
                alert("Gagal mengupdate FAQ: " + error.message)
            }
        } else {
            const { data, error } = await supabase
                .from('faqs')
                .insert([{ question: newQuestion, answer: newAnswer, is_active: newIsActive }])
                .select()

            if (data && !error) {
                setFaqs([...faqs, data[0]])
                setIsModalOpen(false)
            } else if (error) {
                console.error("Error creating FAQ:", error)
                alert("Gagal menyimpan FAQ: " + error.message)
            }
        }
        setSaving(false)
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this FAQ?')) return

        const { error } = await supabase.from('faqs').delete().eq('id', id)
        if (!error) {
            setFaqs(faqs.filter((f) => f.id !== id))
            setActiveMenuId(null)
        }
    }

    async function toggleActiveStatus(id: string, currentStatus: boolean) {
        const { data, error } = await supabase
            .from('faqs')
            .update({ is_active: !currentStatus })
            .eq('id', id)
            .select()
            
        if (data && !error) {
            setFaqs(faqs.map(f => f.id === id ? data[0] : f))
        }
    }

    const filteredFaqs = faqs.filter(f =>
        f.question.toLowerCase().includes(search.toLowerCase()) ||
        f.answer.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 flex flex-col gap-6">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-sm">
                <span className="text-[#8a6060] font-medium">Dashboard</span>
                <span className="material-symbols-outlined text-[#8a6060] text-sm">chevron_right</span>
                <span className="text-[#181111] font-bold">FAQ</span>
            </div>

            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="text-[#181111] text-3xl md:text-4xl font-extrabold tracking-tight">Manage FAQ</h1>
                    <p className="text-[#8a6060] text-base font-normal max-w-2xl">Create and manage Frequently Asked Questions.</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg h-12 px-6 bg-primary hover:bg-red-700 text-white text-sm font-bold shadow-lg shadow-red-500/20 transition-all active:scale-95"
                >
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    <span>Add FAQ</span>
                </button>
            </div>

            {/* Filters & Search Toolbar */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-white p-4 rounded-xl shadow-sm border border-[#e6dbdb]">
                {/* Search */}
                <div className="md:col-span-12 lg:col-span-6 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-[#8a6060]">search</span>
                    </div>
                    <input
                        className="block w-full pl-10 pr-3 py-2.5 border-none rounded-lg bg-[#f5f0f0] text-[#181111] placeholder-[#8a6060] focus:ring-2 focus:ring-primary/50 text-sm font-medium transition-all outline-none"
                        placeholder="Search FAQs..."
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* FAQs List */}
            <div className="flex flex-col gap-4">
                {filteredFaqs.map((faq) => (
                    <div key={faq.id} className={`group bg-white rounded-xl p-6 border transition-all duration-300 relative overflow-hidden flex flex-col md:flex-row gap-4 items-start md:items-center justify-between ${faq.is_active ? 'border-[#e6dbdb] hover:shadow-xl hover:shadow-red-500/5 hover:border-primary/30' : 'border-slate-200 bg-slate-50 opacity-80'}`}>
                        <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className={`text-lg font-bold ${faq.is_active ? 'text-[#181111] group-hover:text-primary' : 'text-slate-600'} transition-colors`}>{faq.question}</h3>
                                <button
                                    onClick={() => toggleActiveStatus(faq.id, faq.is_active)}
                                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold border transition-colors ${faq.is_active ? 'border-green-200 text-green-700 bg-green-50 hover:bg-green-100' : 'border-slate-200 text-slate-500 bg-slate-100 hover:bg-slate-200'}`}
                                >
                                    {faq.is_active ? 'Active' : 'Hidden'}
                                </button>
                            </div>
                            <p className="text-[#8a6060] text-sm leading-relaxed whitespace-pre-wrap">{faq.answer}</p>
                        </div>

                        <div className="relative flex gap-2 self-end md:self-auto shrink-0">
                            <button
                                onClick={() => openEditModal(faq)}
                                className="flex items-center justify-center h-10 w-10 rounded-lg text-[#8a6060] hover:bg-slate-100 hover:text-primary transition-colors"
                            >
                                <span className="material-symbols-outlined text-[20px]">edit</span>
                            </button>
                            <div className="relative">
                                <button
                                    onClick={() => setActiveMenuId(activeMenuId === faq.id ? null : faq.id)}
                                    className="flex items-center justify-center h-10 w-10 rounded-lg text-[#8a6060] hover:bg-slate-100 hover:text-primary transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[20px]">more_vert</span>
                                </button>
                                {/* Action Menu */}
                                {activeMenuId === faq.id && (
                                    <div className="absolute right-0 top-12 w-32 bg-white rounded-lg shadow-xl border border-gray-100 z-10 py-1 animation-fade-in">
                                        <button
                                            onClick={() => handleDelete(faq.id)}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">delete</span>
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                
                {filteredFaqs.length === 0 && !loading && (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed border-[#e6dbdb]">
                        <span className="material-symbols-outlined text-4xl text-[#8a6060] mb-2">quiz</span>
                        <h3 className="text-lg font-bold text-[#181111]">No FAQs found</h3>
                        <p className="text-[#8a6060] text-sm mt-1">Get started by creating a new frequently asked question.</p>
                        <button
                            onClick={openAddModal}
                            className="mt-4 px-4 py-2 bg-primary/10 text-primary font-bold rounded-lg hover:bg-primary/20 transition-colors"
                        >
                            Add FAQ
                        </button>
                    </div>
                )}
            </div>

            {/* Pagination Footer */}
            <div className="flex items-center justify-between pt-4 mt-auto border-t border-[#e6dbdb]">
                <p className="text-sm text-[#8a6060]">Showing <span className="font-bold text-[#181111]">{filteredFaqs.length}</span> FAQs</p>
            </div>

            {/* FAQ Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center shrink-0">
                            <h3 className="text-xl font-bold text-slate-900">{editingId ? 'Edit FAQ' : 'Add New FAQ'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="overflow-y-auto p-6">
                            <form id="faq-form" onSubmit={handleSave} className="flex flex-col gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Question</label>
                                    <input
                                        className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium"
                                        placeholder="e.g. Kapan pendaftaran ditutup?"
                                        value={newQuestion}
                                        onChange={(e) => setNewQuestion(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Answer</label>
                                    <textarea
                                        className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium resize-none min-h-[120px]"
                                        placeholder="Detailed answer..."
                                        rows={5}
                                        value={newAnswer}
                                        onChange={(e) => setNewAnswer(e.target.value)}
                                        required
                                    ></textarea>
                                </div>
                                <div className="flex items-center gap-3 mt-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="flex-1">
                                        <h4 className="text-sm font-bold text-slate-900">Active Status</h4>
                                        <p className="text-xs text-slate-500">Show this FAQ on the public homepage</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setNewIsActive(!newIsActive)}
                                        className={`relative h-6 w-11 rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${newIsActive ? 'bg-emerald-500' : 'bg-slate-300'}`}
                                    >
                                        <span
                                            className={`absolute left-0.5 top-0.5 flex h-5 w-5 transform items-center justify-center rounded-full bg-white shadow transition-transform duration-200 ease-in-out ${newIsActive ? 'translate-x-[1.25rem]' : 'translate-x-0'}`}
                                        ></span>
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className="p-6 border-t border-gray-100 flex gap-3 shrink-0">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 px-4 py-3 rounded-lg border border-gray-200 text-slate-600 font-bold hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                form="faq-form"
                                disabled={saving}
                                className="flex-1 px-4 py-3 rounded-lg bg-primary text-white font-bold hover:bg-red-700 transition-colors shadow-lg shadow-primary/20"
                            >
                                {saving ? 'Saving...' : (editingId ? 'Save Changes' : 'Create FAQ')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
