
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Department = {
    id: string
    name: string
    description: string
    status?: string // Optional, for visual variety
}

// Styling constants for card variety
const CARD_VARIANTS = [
    { bg: 'bg-red-50 text-primary', border: 'border-green-200 text-green-700 bg-green-100' },
    { bg: 'bg-orange-100 text-orange-600', border: 'border-green-200 text-green-700 bg-green-100' },
    { bg: 'bg-blue-50 text-blue-600', border: 'border-yellow-200 text-yellow-700 bg-yellow-100' },
    { bg: 'bg-purple-50 text-purple-600', border: 'border-green-200 text-green-700 bg-green-100' },
]

export default function DepartmentsPage() {
    const [departments, setDepartments] = useState<Department[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    // Config State
    const [isDepartmentsActive, setIsDepartmentsActive] = useState(true)
    const [configId, setConfigId] = useState<number | null>(null)
    const [savingConfig, setSavingConfig] = useState(false)

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [newName, setNewName] = useState('')
    const [newDesc, setNewDesc] = useState('')
    const [adding, setAdding] = useState(false)

    // Menu State (for Delete)
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null)

    useEffect(() => {
        fetchData()
    }, [])

    async function fetchData() {
        setLoading(true)
        const [deptResult, configResult] = await Promise.all([
            supabase.from('departments').select('*').order('created_at'),
            supabase.from('departments_config').select('*').limit(1).single()
        ])

        if (deptResult.data) setDepartments(deptResult.data)

        if (configResult.data) {
            setIsDepartmentsActive(configResult.data.is_active ?? true)
            setConfigId(configResult.data.id)
        }

        setLoading(false)
    }

    async function toggleActive(newState: boolean) {
        setIsDepartmentsActive(newState)
        setSavingConfig(true)

        // Optimistic update
        const payload = { is_active: newState }

        try {
            if (configId) {
                await supabase.from('departments_config').update(payload).eq('id', configId)
            } else {
                const { data } = await supabase.from('departments_config').insert(payload).select().single()
                if (data) setConfigId(data.id)
            }
        } catch (error) {
            console.error('Error updating config:', error)
            // Revert on error
            setIsDepartmentsActive(!newState)
        } finally {
            setSavingConfig(false)
        }
    }

    async function handleAdd(e: React.FormEvent) {
        e.preventDefault()
        setAdding(true)

        const { data } = await supabase
            .from('departments')
            .insert([{ name: newName, description: newDesc }])
            .select()

        if (data) {
            setDepartments([...departments, data[0]])
            setNewName('')
            setNewDesc('')
            setIsModalOpen(false)
        }
        setAdding(false)
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure you want to delete this department?')) return

        const { error } = await supabase.from('departments').delete().eq('id', id)
        if (!error) {
            setDepartments(departments.filter((d) => d.id !== id))
            setActiveMenuId(null)
        }
    }

    const filteredDepartments = departments.filter(d =>
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.description.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 flex flex-col gap-6">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-sm">
                <span className="text-[#8a6060] font-medium">Dashboard</span>
                <span className="material-symbols-outlined text-[#8a6060] text-sm">chevron_right</span>
                <span className="text-[#181111] font-bold">Departments</span>
            </div>

            {/* Config Card */}
            <div className={`bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 p-6 flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-300 ${!isDepartmentsActive ? 'grayscale opacity-90' : ''}`}>
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-sm transition-colors ${isDepartmentsActive ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                        <span className="material-symbols-outlined text-[24px]">domain_disabled</span>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Departments Section</h2>
                        <p className="text-slate-500 text-sm">Tampilkan atau sembunyikan section Departments di Homepage.</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <span className={`text-sm font-bold transition-colors ${isDepartmentsActive ? 'text-emerald-600' : 'text-slate-500'}`}>
                        {isDepartmentsActive ? 'Visible' : 'Hidden'}
                    </span>
                    <button
                        onClick={() => toggleActive(!isDepartmentsActive)}
                        disabled={savingConfig}
                        className={`relative h-8 w-14 rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${isDepartmentsActive ? 'bg-emerald-500' : 'bg-slate-200'}`}
                    >
                        <span
                            className={`absolute left-0.5 top-0.5 flex h-7 w-7 transform items-center justify-center rounded-full bg-white shadow transition-transform duration-200 ease-in-out ${isDepartmentsActive ? 'translate-x-[1.5rem]' : 'translate-x-0'}`}
                        >
                            {savingConfig ? (
                                <div className="w-4 h-4 border-2 border-slate-300 border-t-emerald-500 rounded-full animate-spin" />
                            ) : (
                                <span className={`material-symbols-outlined text-[16px] font-bold ${isDepartmentsActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                                    {isDepartmentsActive ? 'visibility' : 'visibility_off'}
                                </span>
                            )}
                        </span>
                    </button>
                </div>
            </div>

            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="text-[#181111] text-3xl md:text-4xl font-extrabold tracking-tight">Manage Departments</h1>
                    <p className="text-[#8a6060] text-base font-normal max-w-2xl">Create and manage internal divisions.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg h-12 px-6 bg-primary hover:bg-red-700 text-white text-sm font-bold shadow-lg shadow-red-500/20 transition-all active:scale-95"
                >
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    <span>Add Department</span>
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
                        placeholder="Search departments..."
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Departments Grid */}
            <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 transition-opacity duration-300 ${!isDepartmentsActive ? 'opacity-50' : ''}`}>
                {filteredDepartments.map((dept, index) => {
                    const variant = CARD_VARIANTS[index % CARD_VARIANTS.length]
                    return (
                        <div key={dept.id} className="group bg-white rounded-xl p-6 border border-[#e6dbdb] hover:shadow-xl hover:shadow-red-500/5 hover:border-primary/30 transition-all duration-300 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-lg ${variant.bg}`}>
                                    <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>domain</span>
                                </div>
                                <div className="relative flex gap-2">
                                    {/* Simple Active Badge (Visual) */}
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${variant.border}`}>Active</span>

                                    <button
                                        onClick={() => setActiveMenuId(activeMenuId === dept.id ? null : dept.id)}
                                        className="text-[#8a6060] hover:text-primary transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">more_vert</span>
                                    </button>

                                    {/* Action Menu */}
                                    {activeMenuId === dept.id && (
                                        <div className="absolute right-0 top-8 w-32 bg-white rounded-lg shadow-xl border border-gray-100 z-10 py-1 animation-fade-in">
                                            <button
                                                onClick={() => handleDelete(dept.id)}
                                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">delete</span>
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-[#181111] mb-2 group-hover:text-primary transition-colors">{dept.name}</h3>
                            <p className="text-[#8a6060] text-sm leading-relaxed mb-6 line-clamp-2 min-h-[40px]">{dept.description}</p>
                            <div className="flex items-center justify-between pt-4 border-t border-[#f5f0f0]">
                                <div className="flex -space-x-2">
                                    {/* Avatar placeholders can be implemented if data exists, for now static visual as requested */}
                                    <div className="w-8 h-8 rounded-full border-2 border-white bg-[#f5f0f0] flex items-center justify-center text-xs font-medium text-[#8a6060]">M</div>
                                </div>
                                <button className="flex items-center gap-1 text-sm font-bold text-[#181111] hover:text-primary transition-colors">
                                    Manage <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                                </button>
                            </div>
                        </div>
                    )
                })}

                {/* Create New Placeholder Card */}
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="group flex flex-col items-center justify-center min-h-[220px] rounded-xl p-6 border-2 border-dashed border-[#e6dbdb] hover:border-primary hover:bg-primary/5 transition-all duration-300 text-center gap-4"
                >
                    <div className="size-14 rounded-full bg-[#f5f0f0] group-hover:bg-white flex items-center justify-center transition-colors shadow-sm">
                        <span className="material-symbols-outlined text-[#8a6060] group-hover:text-primary text-3xl">add</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <h3 className="text-lg font-bold text-[#181111] group-hover:text-primary">Create New Department</h3>
                        <p className="text-[#8a6060] text-sm">Set up a new team and assign roles</p>
                    </div>
                </button>
            </div>

            {/* Pagination Footer (Visual) */}
            <div className="flex items-center justify-between pt-4 mt-auto border-t border-[#e6dbdb]">
                <p className="text-sm text-[#8a6060]">Showing <span className="font-bold text-[#181111]">{filteredDepartments.length}</span> departments</p>
                {/* Pagination Controls could go here */}
            </div>

            {/* Add Department Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-slate-900">Add New Department</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleAdd} className="p-6 flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Department Name</label>
                                <input
                                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium"
                                    placeholder="e.g. Media & Creative"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                                <textarea
                                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium resize-none"
                                    placeholder="Brief description of the department..."
                                    rows={3}
                                    value={newDesc}
                                    onChange={(e) => setNewDesc(e.target.value)}
                                ></textarea>
                            </div>
                            <div className="flex gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-3 rounded-lg border border-gray-200 text-slate-600 font-bold hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={adding}
                                    className="flex-1 px-4 py-3 rounded-lg bg-primary text-white font-bold hover:bg-red-700 transition-colors shadow-lg shadow-primary/20"
                                >
                                    {adding ? 'Adding...' : 'Create Department'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
