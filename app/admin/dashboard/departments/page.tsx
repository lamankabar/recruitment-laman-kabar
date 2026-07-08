'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import AdminDialog from '@/components/AdminDialog'

type Department = {
    id: string
    name: string
    description: string
    status?: string // Optional, for visual variety
}

type DivisionConfig = {
    name: string;
    desc: string;
}

type DepartmentConfig = {
    headOfDept?: string;
    desc: string;
    divisions: DivisionConfig[];
}

type LeaderConfig = {
    positionName?: string;
    personName: string;
    detail: string;
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

    // Page Text Config
    const [pageConfigId, setPageConfigId] = useState<string | null>(null)
    const [pageTitle, setPageTitle] = useState('Struktur Pengurus')
    const [pageSubtitle, setPageSubtitle] = useState('Mengenal struktur yang ada di Laman Kabar.')
    const [savingPageConfig, setSavingPageConfig] = useState(false)

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [newName, setNewName] = useState('')
    const [newHeadOfDept, setNewHeadOfDept] = useState('')
    const [newDesc, setNewDesc] = useState('')
    const [newDivisions, setNewDivisions] = useState<DivisionConfig[]>([])
    const [saving, setSaving] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)

    // Leader Modal State
    const [isLeaderModalOpen, setIsLeaderModalOpen] = useState(false)
    const [leaderRole, setLeaderRole] = useState<'Ketua' | 'Wakil Ketua'>('Ketua')
    const [leaderPositionName, setLeaderPositionName] = useState('')
    const [leaderPersonName, setLeaderPersonName] = useState('')
    const [leaderDetail, setLeaderDetail] = useState('')
    const [leaderEditingId, setLeaderEditingId] = useState<string | null>(null)

    // Menu State (for Delete)
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null)

    // Dialog State
    const [dialogConfig, setDialogConfig] = useState<{isOpen: boolean, title: string, message: string, type: 'alert'|'confirm', onConfirm?: () => void}>({isOpen: false, title: '', message: '', type: 'alert'})

    const showAlert = (title: string, message: string) => {
        setDialogConfig({ isOpen: true, title, message, type: 'alert' })
    }

    const showConfirm = (title: string, message: string, onConfirm: () => void) => {
        setDialogConfig({ isOpen: true, title, message, type: 'confirm', onConfirm })
    }

    useEffect(() => {
        fetchData()
    }, [])

    async function fetchData() {
        setLoading(true)
        const [deptResult, configResult] = await Promise.all([
            supabase.from('departments').select('*').order('created_at'),
            supabase.from('departments_config').select('*').limit(1).single()
        ])

        if (deptResult.data) {
            setDepartments(deptResult.data)
            
            const pageConf = deptResult.data.find(d => d.name === '_Page_Config')
            if (pageConf) {
                setPageConfigId(pageConf.id)
                try {
                    const parsed = JSON.parse(pageConf.description)
                    setPageTitle(parsed.title || 'Struktur Pengurus')
                    setPageSubtitle(parsed.subtitle || 'Mengenal struktur yang ada di Laman Kabar.')
                } catch {
                    // Fallback
                }
            }
        }

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

    async function handleSavePageConfig(e: React.FormEvent) {
        e.preventDefault()
        setSavingPageConfig(true)

        const payloadDesc = JSON.stringify({
            title: pageTitle,
            subtitle: pageSubtitle
        })

        if (pageConfigId) {
            const { data, error } = await supabase
                .from('departments')
                .update({ description: payloadDesc })
                .eq('id', pageConfigId)
                .select()

            if (data && !error) {
                setDepartments(departments.map(d => d.id === pageConfigId ? data[0] : d))
                showAlert('Berhasil', 'Teks halaman struktur berhasil disimpan!')
            }
        } else {
            const { data, error } = await supabase
                .from('departments')
                .insert([{ name: '_Page_Config', description: payloadDesc }])
                .select()

            if (data && !error) {
                setDepartments([...departments, data[0]])
                setPageConfigId(data[0].id)
                showAlert('Berhasil', 'Teks halaman struktur berhasil disimpan!')
            }
        }
        setSavingPageConfig(false)
    }

    function openAddModal() {
        setEditingId(null)
        setNewName('')
        setNewHeadOfDept('')
        setNewDesc('')
        setNewDivisions([])
        setIsModalOpen(true)
    }

    function openEditModal(dept: Department) {
        setEditingId(dept.id)
        setNewName(dept.name)
        
        try {
            const parsed: DepartmentConfig = JSON.parse(dept.description)
            setNewHeadOfDept(parsed.headOfDept || '')
            setNewDesc(parsed.desc || '')
            setNewDivisions(parsed.divisions || [])
        } catch (e) {
            // Fallback for old data
            setNewHeadOfDept('')
            setNewDesc(dept.description)
            setNewDivisions([])
        }
        
        setIsModalOpen(true)
        setActiveMenuId(null)
    }

    function addDivision() {
        setNewDivisions([...newDivisions, { name: '', desc: '' }])
    }

    function updateDivision(index: number, field: 'name' | 'desc', value: string) {
        const updated = [...newDivisions]
        updated[index][field] = value
        setNewDivisions(updated)
    }

    function removeDivision(index: number) {
        const updated = [...newDivisions]
        updated.splice(index, 1)
        setNewDivisions(updated)
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault()
        setSaving(true)

        const payloadDesc = JSON.stringify({
            headOfDept: newHeadOfDept,
            desc: newDesc,
            divisions: newDivisions
        })

        if (editingId) {
            const { data, error } = await supabase
                .from('departments')
                .update({ name: newName, description: payloadDesc })
                .eq('id', editingId)
                .select()

            if (data && !error) {
                setDepartments(departments.map(d => d.id === editingId ? data[0] : d))
                setIsModalOpen(false)
            }
        } else {
            const { data, error } = await supabase
                .from('departments')
                .insert([{ name: newName, description: payloadDesc }])
                .select()

            if (data && !error) {
                setDepartments([...departments, data[0]])
                setIsModalOpen(false)
            }
        }
        setSaving(false)
    }

    // LEADER FUNCTIONS
    function openLeaderModal(role: 'Ketua' | 'Wakil Ketua') {
        setLeaderRole(role)
        const existing = departments.find(d => d.name === role)
        if (existing) {
            setLeaderEditingId(existing.id)
            try {
                const parsed: LeaderConfig = JSON.parse(existing.description)
                setLeaderPositionName(parsed.positionName || role)
                setLeaderPersonName(parsed.personName || '')
                setLeaderDetail(parsed.detail || '')
            } catch (e) {
                setLeaderPositionName(role)
                setLeaderPersonName(existing.description)
                setLeaderDetail('')
            }
        } else {
            setLeaderEditingId(null)
            setLeaderPositionName(role)
            setLeaderPersonName('')
            setLeaderDetail('')
        }
        setIsLeaderModalOpen(true)
    }

    async function handleLeaderSave(e: React.FormEvent) {
        e.preventDefault()
        setSaving(true)

        const payloadDesc = JSON.stringify({
            positionName: leaderPositionName,
            personName: leaderPersonName,
            detail: leaderDetail
        })

        if (leaderEditingId) {
            const { data, error } = await supabase
                .from('departments')
                .update({ description: payloadDesc })
                .eq('id', leaderEditingId)
                .select()

            if (data && !error) {
                setDepartments(departments.map(d => d.id === leaderEditingId ? data[0] : d))
                setIsLeaderModalOpen(false)
            }
        } else {
            const { data, error } = await supabase
                .from('departments')
                .insert([{ name: leaderRole, description: payloadDesc }])
                .select()

            if (data && !error) {
                setDepartments([...departments, data[0]])
                setIsLeaderModalOpen(false)
            }
        }
        setSaving(false)
    }


    function requestDelete(id: string) {
        showConfirm('Hapus Departemen?', 'Apakah Anda yakin ingin menghapus departemen ini? Tindakan ini tidak dapat dibatalkan.', () => handleDelete(id))
    }

    async function handleDelete(id: string) {
        const { error } = await supabase.from('departments').delete().eq('id', id)
        if (!error) {
            setDepartments(departments.filter((d) => d.id !== id))
            setActiveMenuId(null)
        }
    }

    const filteredDepartments = departments.filter(d =>
        d.name !== 'Ketua' && d.name !== 'Wakil Ketua' && d.name !== '_Page_Config' &&
        (d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.description.toLowerCase().includes(search.toLowerCase()))
    )

    const ketua = departments.find(d => d.name === 'Ketua')
    const wakilKetua = departments.find(d => d.name === 'Wakil Ketua')

    // Helper to get person name safely
    const getLeaderName = (desc: string) => {
        try {
            return JSON.parse(desc).personName || 'Belum diatur'
        } catch {
            return desc || 'Belum diatur'
        }
    }

    return (
        <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 flex flex-col gap-6">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-sm">
                <span className="text-[#8a6060] font-medium">Dashboard</span>
                <span className="material-symbols-outlined text-[#8a6060] text-sm">chevron_right</span>
                <span className="text-[#181111] font-bold">Struktur Pengurus</span>
            </div>

            {/* Config Card */}
            <div className={`bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 p-6 flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-300 ${!isDepartmentsActive ? 'grayscale opacity-90' : ''}`}>
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-sm transition-colors ${isDepartmentsActive ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                        <span className="material-symbols-outlined text-[24px]">domain_disabled</span>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Departemen di Beranda & Tentang Kami</h2>
                        <p className="text-slate-500 text-sm">Tampilkan atau sembunyikan section Departemen di halaman publik.</p>
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

            {/* Page Text Config Card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40 p-6 flex flex-col gap-6">
                <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center border shadow-sm bg-blue-50 text-blue-600 border-blue-100">
                        <span className="material-symbols-outlined text-[24px]">title</span>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Teks Halaman Struktur</h2>
                        <p className="text-slate-500 text-sm">Ubah judul dan deskripsi yang tampil di halaman /struktur.</p>
                    </div>
                </div>

                <form onSubmit={handleSavePageConfig} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Judul Halaman</label>
                        <input
                            className="w-full rounded-lg border border-slate-200 bg-[#fcf9f9] px-4 py-3 text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium"
                            placeholder="Contoh: Struktur Pengurus"
                            value={pageTitle}
                            onChange={(e) => setPageTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Deskripsi Halaman</label>
                        <textarea
                            className="w-full rounded-lg border border-slate-200 bg-[#fcf9f9] px-4 py-3 text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium resize-none"
                            placeholder="Contoh: Mengenal struktur yang ada di Laman Kabar."
                            rows={2}
                            value={pageSubtitle}
                            onChange={(e) => setPageSubtitle(e.target.value)}
                            required
                        ></textarea>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={savingPageConfig}
                            className="flex items-center justify-center gap-2 rounded-lg h-10 px-6 bg-primary text-white text-sm font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20 active:scale-95 disabled:opacity-50"
                        >
                            {savingPageConfig ? 'Menyimpan...' : 'Simpan Teks'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="text-[#181111] text-3xl md:text-4xl font-extrabold tracking-tight">Struktur Pengurus</h1>
                    <p className="text-[#8a6060] text-base font-normal max-w-2xl">Kelola Pimpinan, Departemen, beserta divisinya.</p>
                </div>
            </div>

            {/* LEADER CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                {/* Ketua Card */}
                <div className="bg-white rounded-xl p-6 border border-primary/20 shadow-sm flex flex-col items-center text-center relative hover:shadow-lg transition-shadow">
                    <div className="absolute top-0 left-0 w-full h-2 bg-primary rounded-t-xl"></div>
                    <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-3 mt-2">Pimpinan</h3>
                    <h2 className="text-2xl font-black text-slate-900 mb-1">{ketua ? getLeaderName(ketua.description) : 'Belum Diatur'}</h2>
                    <button 
                        onClick={() => openLeaderModal('Ketua')}
                        className="mt-4 px-4 py-2 rounded-lg border border-primary text-primary font-bold text-sm hover:bg-primary/5 transition-colors flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-[18px]">edit</span> Edit Pimpinan
                    </button>
                </div>

                {/* Wakil Ketua Card */}
                <div className="bg-white rounded-xl p-6 border border-blue-500/20 shadow-sm flex flex-col items-center text-center relative hover:shadow-lg transition-shadow">
                    <div className="absolute top-0 left-0 w-full h-2 bg-blue-500 rounded-t-xl"></div>
                    <h3 className="text-sm font-bold text-blue-500 uppercase tracking-wider mb-3 mt-2">Wakil Pimpinan</h3>
                    <h2 className="text-2xl font-black text-slate-900 mb-1">{wakilKetua ? getLeaderName(wakilKetua.description) : 'Belum Diatur'}</h2>
                    <button 
                        onClick={() => openLeaderModal('Wakil Ketua')}
                        className="mt-4 px-4 py-2 rounded-lg border border-blue-500 text-blue-500 font-bold text-sm hover:bg-blue-500/5 transition-colors flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-[18px]">edit</span> Edit Wakil Pimpinan
                    </button>
                </div>
            </div>

            <div className="h-px w-full bg-slate-200 my-4"></div>

            {/* DEPARTMENTS SECTION */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <h2 className="text-2xl font-extrabold text-slate-900">Daftar Departemen/Bidang</h2>
                <button
                    onClick={openAddModal}
                    className="flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg h-10 px-5 bg-primary hover:bg-red-700 text-white text-sm font-bold shadow-lg shadow-red-500/20 transition-all active:scale-95"
                >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    <span>Tambah Departemen</span>
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
                        placeholder="Cari departemen..."
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Departments Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredDepartments.map((dept, index) => {
                    const variant = CARD_VARIANTS[index % CARD_VARIANTS.length]
                    let parsedDesc = dept.description;
                    let divisionCount = 0;
                    try {
                        const parsed = JSON.parse(dept.description)
                        parsedDesc = parsed.desc;
                        divisionCount = parsed.divisions?.length || 0;
                    } catch {
                        // fallback
                    }

                    return (
                        <div key={dept.id} className="group bg-white rounded-xl p-6 border border-[#e6dbdb] hover:shadow-xl hover:shadow-red-500/5 hover:border-primary/30 transition-all duration-300 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-lg ${variant.bg}`}>
                                    <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>domain</span>
                                </div>
                                <div className="relative flex gap-2">
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
                                                onClick={() => openEditModal(dept)}
                                                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">edit</span>
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => requestDelete(dept.id)}
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
                            <p className="text-[#8a6060] text-sm leading-relaxed mb-4 line-clamp-2 min-h-[40px]">{parsedDesc}</p>
                            
                            <div className="bg-slate-50 border border-slate-100 rounded-lg p-2 flex items-center justify-center gap-2 mb-2">
                                <span className="material-symbols-outlined text-gray-400 text-[18px]">account_tree</span>
                                <span className="text-sm font-bold text-slate-600">{divisionCount} Divisi</span>
                            </div>
                        </div>
                    )
                })}

                {/* Create New Placeholder Card */}
                <button
                    onClick={openAddModal}
                    className="group flex flex-col items-center justify-center min-h-[220px] rounded-xl p-6 border-2 border-dashed border-[#e6dbdb] hover:border-primary hover:bg-primary/5 transition-all duration-300 text-center gap-4"
                >
                    <div className="size-14 rounded-full bg-[#f5f0f0] group-hover:bg-white flex items-center justify-center transition-colors shadow-sm">
                        <span className="material-symbols-outlined text-[#8a6060] group-hover:text-primary text-3xl">add</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <h3 className="text-lg font-bold text-[#181111] group-hover:text-primary">Tambah Departemen</h3>
                        <p className="text-[#8a6060] text-sm">Tambahkan departemen baru ke struktur</p>
                    </div>
                </button>
            </div>

            {/* Pagination Footer (Visual) */}
            <div className="flex items-center justify-between pt-4 mt-auto border-t border-[#e6dbdb]">
                <p className="text-sm text-[#8a6060]">Menampilkan <span className="font-bold text-[#181111]">{filteredDepartments.length}</span> departemen</p>
            </div>

            {/* Leader Modal */}
            {isLeaderModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50">
                            <h3 className="text-xl font-bold text-slate-900">Edit {leaderRole}</h3>
                            <button onClick={() => setIsLeaderModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleLeaderSave} className="p-6 flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Nama Posisi</label>
                                <input
                                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium"
                                    placeholder="Contoh: Pemimpin Redaksi"
                                    value={leaderPositionName}
                                    onChange={(e) => setLeaderPositionName(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Nama Pemegang Posisi</label>
                                <input
                                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium"
                                    placeholder="Contoh: Budi Santoso"
                                    value={leaderPersonName}
                                    onChange={(e) => setLeaderPersonName(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Keterangan / NIM</label>
                                <input
                                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium"
                                    placeholder="Contoh: Ilmu Komputer - 1234567"
                                    value={leaderDetail}
                                    onChange={(e) => setLeaderDetail(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsLeaderModalOpen(false)}
                                    className="flex-1 px-4 py-3 rounded-lg border border-gray-200 text-slate-600 font-bold hover:bg-gray-50 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 px-4 py-3 rounded-lg bg-primary text-white font-bold hover:bg-red-700 transition-colors shadow-lg shadow-primary/20"
                                >
                                    {saving ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Department Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-6">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl flex flex-col max-h-[90vh] animate-scale-in">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50 shrink-0 rounded-t-2xl">
                            <h3 className="text-xl font-bold text-slate-900">{editingId ? 'Edit Departemen' : 'Tambah Departemen Baru'}</h3>
                            <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="flex flex-col flex-1 overflow-hidden">
                            <div className="p-6 flex flex-col gap-6 overflow-y-auto">
                            
                            {/* Dep Info */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-bold text-primary uppercase tracking-wider border-b pb-2">Info Departemen</h4>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Nama Departemen</label>
                                    <input
                                        className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium"
                                        placeholder="Contoh: Media & Creative"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Direktur Departemen</label>
                                    <input
                                        className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium"
                                        placeholder="Contoh: Siti Aminah (Boleh dikosongkan)"
                                        value={newHeadOfDept}
                                        onChange={(e) => setNewHeadOfDept(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Deskripsi</label>
                                    <textarea
                                        className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium resize-none"
                                        placeholder="Deskripsi singkat departemen..."
                                        rows={3}
                                        value={newDesc}
                                        onChange={(e) => setNewDesc(e.target.value)}
                                    ></textarea>
                                </div>
                            </div>

                            {/* Divisions */}
                            <div className="space-y-4">
                                <div className="border-b pb-2">
                                    <h4 className="text-sm font-bold text-primary uppercase tracking-wider">Divisi di Departemen Ini</h4>
                                </div>

                                {newDivisions.length === 0 && (
                                    <div className="text-center py-6 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                                        <p className="text-sm text-slate-500">Belum ada divisi. Silakan klik Tambah Divisi di bawah.</p>
                                    </div>
                                )}

                                {newDivisions.map((div, idx) => (
                                    <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 relative group">
                                        <button 
                                            type="button"
                                            onClick={() => removeDivision(idx)}
                                            className="absolute -top-3 -right-3 size-8 rounded-full bg-white border border-slate-200 text-red-500 flex items-center justify-center hover:bg-red-50 shadow-sm transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">close</span>
                                        </button>
                                        
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-600 mb-1">Nama Divisi</label>
                                                <input
                                                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                                    placeholder="Contoh: Divisi Desain Grafis"
                                                    value={div.name}
                                                    onChange={(e) => updateDivision(idx, 'name', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-600 mb-1">Tugas / Peran</label>
                                                <textarea
                                                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                                                    placeholder="Contoh: Mengatur visual konten..."
                                                    rows={3}
                                                    value={div.desc}
                                                    onChange={(e) => updateDivision(idx, 'desc', e.target.value)}
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <button 
                                    type="button" 
                                    onClick={addDivision}
                                    className="w-full mt-2 text-sm font-bold bg-primary/5 border border-primary/20 text-primary px-4 py-3 rounded-xl hover:bg-primary/10 transition-colors flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-[20px]">add</span> Tambah Divisi
                                </button>
                            </div>

                            </div>

                            <div className="p-5 sm:p-6 border-t border-gray-100 bg-white shrink-0 flex gap-3 rounded-b-2xl">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-3 rounded-lg border border-gray-200 text-slate-600 font-bold hover:bg-gray-50 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 px-4 py-3 rounded-lg bg-primary text-white font-bold hover:bg-red-700 transition-colors shadow-lg shadow-primary/20"
                                >
                                    {saving ? 'Menyimpan...' : (editingId ? 'Simpan Perubahan' : 'Tambah Departemen')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <AdminDialog 
                isOpen={dialogConfig.isOpen}
                title={dialogConfig.title}
                message={dialogConfig.message}
                type={dialogConfig.type}
                onClose={() => setDialogConfig(prev => ({ ...prev, isOpen: false }))}
                onConfirm={dialogConfig.onConfirm}
            />
        </div>
    )
}
