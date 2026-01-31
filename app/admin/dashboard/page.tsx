
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function DashboardHome() {
    const [stats, setStats] = useState({
        registrations: 0,
        pending: 0,
        departments: 0
    })
    const [recentRegistrations, setRecentRegistrations] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchData()
    }, [])

    async function fetchData() {
        // Fetch Stats
        const { count: regCount } = await supabase.from('registrations').select('*', { count: 'exact', head: true })
        const { count: pendingCount } = await supabase.from('registrations').select('*', { count: 'exact', head: true }).eq('status', 'pending')
        const { count: deptCount } = await supabase.from('departments').select('*', { count: 'exact', head: true })

        // Fetch Recent
        const { data: recent } = await supabase
            .from('registrations')
            .select('*')
            .order('submitted_at', { ascending: false })
            .limit(5)

        setStats({
            registrations: regCount || 0,
            pending: pendingCount || 0,
            departments: deptCount || 0
        })
        setRecentRegistrations(recent || [])
        setLoading(false)
    }

    return (
        <div className="flex-1 overflow-y-auto">
            <div className="layout-content-container flex flex-col max-w-[1200px] mx-auto p-6 md:p-8 gap-8">
                {/* Header */}
                <div className="flex flex-col gap-1">
                    <h2 className="text-gray-900 text-3xl font-bold leading-tight tracking-tight">Dashboard Overview</h2>
                    <p className="text-gray-500 text-base font-normal">Welcome back! Here's what's happening today.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                <span className="material-symbols-outlined text-2xl">group</span>
                            </div>
                            <span className="text-sm font-medium text-gray-500">Total Members</span>
                        </div>
                        <div>
                            <span className="text-3xl font-bold text-gray-900">{stats.registrations}</span>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                                <span className="material-symbols-outlined text-2xl">pending_actions</span>
                            </div>
                            <span className="text-sm font-medium text-gray-500">Pending Review</span>
                        </div>
                        <div>
                            <span className="text-3xl font-bold text-gray-900">{stats.pending}</span>
                            <span className="ml-2 text-xs text-orange-600 font-medium">Action Needed</span>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                <span className="material-symbols-outlined text-2xl">domain</span>
                            </div>
                            <span className="text-sm font-medium text-gray-500">Departments</span>
                        </div>
                        <div>
                            <span className="text-3xl font-bold text-gray-900">{stats.departments}</span>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-gray-900">Recent Registrations</h3>
                        <Link href="/admin/dashboard/submissions" className="text-sm text-primary font-medium hover:underline">View All</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr><td className="p-6 text-center text-gray-500">Loading data...</td></tr>
                                ) : recentRegistrations.length === 0 ? (
                                    <tr><td className="p-6 text-center text-gray-500">No activity yet.</td></tr>
                                ) : (
                                    recentRegistrations.map(reg => (
                                        <tr key={reg.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-4 pl-6">
                                                <div className="font-semibold text-gray-900">{reg.full_name}</div>
                                                <div className="text-xs text-gray-500">{reg.email}</div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${reg.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                                                        reg.status === 'approved' ? 'bg-green-50 text-green-700 border-green-100' :
                                                            'bg-red-50 text-red-700 border-red-100'
                                                    }`}>
                                                    {reg.status.charAt(0).toUpperCase() + reg.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right pr-6 text-sm text-gray-500">
                                                {new Date(reg.submitted_at).toLocaleDateString('id-ID')}
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
