
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Registration = {
    id: string
    full_name: string
    email: string
    phone: string
    reason: string
    status: string
    submitted_at: string
}

export default function SubmissionsPage() {
    const [registrations, setRegistrations] = useState<Registration[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState('') // '' = all

    useEffect(() => {
        fetchRegistrations()
    }, [])

    async function fetchRegistrations() {
        const { data } = await supabase.from('registrations').select('*').order('submitted_at', { ascending: false })
        if (data) setRegistrations(data)
        setLoading(false)
    }

    // Stats Calculations
    const totalSubmissions = registrations.length
    const pendingReview = registrations.filter(r => r.status === 'pending').length
    const today = new Date().toISOString().split('T')[0]
    const newToday = registrations.filter(r => r.submitted_at.startsWith(today)).length

    // Filtering
    const filteredRegistrations = registrations.filter(reg => {
        const matchesSearch = reg.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reg.email.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = filterStatus ? reg.status === filterStatus : true
        return matchesSearch && matchesStatus
    })

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        const { error } = await supabase.from('registrations').update({ status: newStatus }).eq('id', id)
        if (!error) {
            setRegistrations(registrations.map(r => r.id === id ? { ...r, status: newStatus } : r))
        }
    }

    return (
        <div className="flex-1 overflow-y-auto">
            <div className="layout-content-container flex flex-col max-w-[1200px] mx-auto p-6 md:p-8 gap-8">
                {/* Page Header */}
                <div className="flex flex-wrap justify-between items-end gap-4">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-gray-900 text-3xl font-bold leading-tight tracking-tight">Registration Submissions</h2>
                        <p className="text-gray-500 text-base font-normal">Manage and view all incoming user registration data from the portal.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={fetchRegistrations}
                            className="flex items-center gap-2 h-10 px-4 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors shadow-sm"
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>refresh</span>
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1 rounded-xl p-5 bg-white border border-gray-100 shadow-sm">
                        <p className="text-gray-500 text-sm font-medium">Total Submissions</p>
                        <div className="flex items-end gap-2">
                            <p className="text-gray-900 text-3xl font-bold leading-none">{totalSubmissions}</p>
                            <span className="flex items-center text-emerald-600 text-xs font-bold bg-emerald-50 px-1.5 py-0.5 rounded mb-1">
                                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_upward</span>
                                All Time
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 rounded-xl p-5 bg-white border border-gray-100 shadow-sm">
                        <p className="text-gray-500 text-sm font-medium">New Today</p>
                        <div className="flex items-end gap-2">
                            <p className="text-gray-900 text-3xl font-bold leading-none">{newToday}</p>
                            <span className="flex items-center text-emerald-600 text-xs font-bold bg-emerald-50 px-1.5 py-0.5 rounded mb-1">
                                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>calendar_today</span>
                                Today
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 rounded-xl p-5 bg-white border border-gray-100 shadow-sm">
                        <p className="text-gray-500 text-sm font-medium">Pending Review</p>
                        <div className="flex items-end gap-2">
                            <p className="text-gray-900 text-3xl font-bold leading-none">{pendingReview}</p>
                            <span className="flex items-center text-orange-600 text-xs font-bold bg-orange-50 px-1.5 py-0.5 rounded mb-1">
                                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>pending</span>
                                Action Needed
                            </span>
                        </div>
                    </div>
                </div>

                {/* Filters & Search Toolbar */}
                <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none material-symbols-outlined" style={{ fontSize: '20px' }}>search</span>
                        <input
                            className="w-full h-11 pl-10 pr-4 rounded-lg bg-gray-50 border-transparent focus:bg-white focus:border-primary focus:ring-0 text-sm text-gray-900 placeholder-gray-500 transition-all outline-none"
                            placeholder="Search by name or email..."
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {/* Filters */}
                    <div className="flex gap-3">
                        <div className="relative min-w-[180px]">
                            <select
                                className="w-full h-11 pl-4 pr-10 rounded-lg bg-white border border-gray-200 text-gray-700 text-sm focus:border-primary focus:ring-0 appearance-none cursor-pointer outline-none"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="">All Statuses</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none material-symbols-outlined" style={{ fontSize: '20px' }}>expand_more</span>
                        </div>
                    </div>
                </div>

                {/* Data Table */}
                <div className="flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-gray-500">Name</th>
                                    <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-gray-500">Email Address</th>
                                    <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-gray-500">WhatsApp</th>
                                    <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                                    <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-gray-500">Date Submitted</th>
                                    <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-gray-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr><td colSpan={6} className="p-8 text-center text-gray-500">Loading data...</td></tr>
                                ) : filteredRegistrations.length === 0 ? (
                                    <tr><td colSpan={6} className="p-8 text-center text-gray-500">No submissions found.</td></tr>
                                ) : (
                                    filteredRegistrations.map((reg) => (
                                        <tr key={reg.id} className="hover:bg-gray-50 transition-colors group">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-bold text-sm">
                                                        {reg.full_name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-900">{reg.full_name}</p>
                                                        <p className="text-xs text-gray-500 truncate max-w-[150px]" title={reg.reason}>{reg.reason}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <a className="text-sm text-gray-600 group-hover:text-primary font-medium transition-colors" href={`mailto:${reg.email}`}>
                                                    {reg.email}
                                                </a>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="text-sm text-gray-600">{reg.phone}</span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${reg.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                                                        reg.status === 'approved' ? 'bg-green-50 text-green-700 border-green-100' :
                                                            'bg-red-50 text-red-700 border-red-100'
                                                    }`}>
                                                    {reg.status.charAt(0).toUpperCase() + reg.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="text-sm text-gray-600">
                                                    {new Date(reg.submitted_at).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                                <p className="text-xs text-gray-400">
                                                    {new Date(reg.submitted_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleStatusUpdate(reg.id, 'approved')}
                                                        title="Approve"
                                                        className="text-gray-400 hover:text-green-600 p-1 rounded-md hover:bg-green-50 transition-colors"
                                                    >
                                                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>check_circle</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(reg.id, 'rejected')}
                                                        title="Reject"
                                                        className="text-gray-400 hover:text-red-600 p-1 rounded-md hover:bg-red-50 transition-colors"
                                                    >
                                                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>cancel</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
