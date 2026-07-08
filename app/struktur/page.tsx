import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { supabase } from '@/lib/supabase'

export const metadata = {
    title: 'Struktur | Laman Kabar',
    description: 'Struktur Media Massa Laman Kabar',
}

export const revalidate = 60

async function getStrukturData() {
    const { data } = await supabase.from('departments').select('*').order('created_at')
    return data || []
}

// Styling colors array to give variety
const COLORS = [
    { bg: 'bg-teal-500', border: 'border-teal-500/30', hover: 'hover:border-teal-500/30' },
    { bg: 'bg-purple-500', border: 'border-purple-500/30', hover: 'hover:border-purple-500/30' },
    { bg: 'bg-amber-500', border: 'border-amber-500/30', hover: 'hover:border-amber-500/30' },
    { bg: 'bg-blue-500', border: 'border-blue-500/30', hover: 'hover:border-blue-500/30' },
    { bg: 'bg-rose-500', border: 'border-rose-500/30', hover: 'hover:border-rose-500/30' },
]

export default async function StrukturPage() {
    const departments = await getStrukturData()

    const ketuaRow = departments.find(d => d.name === 'Ketua')
    const wakilKetuaRow = departments.find(d => d.name === 'Wakil Ketua')
    const pageConfigRow = departments.find(d => d.name === '_Page_Config')
    const regularDepts = departments.filter(d => d.name !== 'Ketua' && d.name !== 'Wakil Ketua' && d.name !== '_Page_Config')

    const parseLeader = (desc: string, defaultPos: string) => {
        try {
            const parsed = JSON.parse(desc)
            return { positionName: parsed.positionName || defaultPos, name: parsed.personName || 'Belum Diatur', detail: parsed.detail || '' }
        } catch {
            return { positionName: defaultPos, name: desc || 'Belum Diatur', detail: '' }
        }
    }

    const parseDept = (desc: string) => {
        try {
            return JSON.parse(desc)
        } catch {
            return { desc: desc, divisions: [] }
        }
    }

    const parsePageConfig = (desc: string | undefined) => {
        try {
            if (!desc) throw new Error()
            const parsed = JSON.parse(desc)
            return {
                title: parsed.title || 'Struktur Pengurus',
                subtitle: parsed.subtitle || 'Mengenal struktur yang ada di Laman Kabar.'
            }
        } catch {
            return {
                title: 'Struktur Pengurus',
                subtitle: 'Mengenal struktur yang ada di Laman Kabar.'
            }
        }
    }

    const ketua = parseLeader(ketuaRow?.description || '', 'Ketua')
    const wakilKetua = parseLeader(wakilKetuaRow?.description || '', 'Wakil Ketua')
    const pageConfig = parsePageConfig(pageConfigRow?.description)

    function getLineClasses(index: number, total: number) {
        if (total <= 1) return "hidden" 
        if (index === 0) return "left-1/2 -right-4"
        if (index === total - 1) return "-left-4 right-1/2"
        return "-left-4 -right-4"
    }

    return (
        <div className="flex flex-col min-h-screen bg-background-light font-display text-slate-900">
            <Navbar />

            <main className="flex-grow container mx-auto px-6 py-12 max-w-6xl">
                {/* Header */}
                <div className="flex flex-col items-center justify-center mb-16 animate-fade-in-up">
                    <div className="size-20 flex items-center justify-center text-primary bg-primary/5 rounded-full mb-6">
                        <span className="material-symbols-outlined text-5xl">account_tree</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-center text-slate-900 tracking-tight">
                        {pageConfig.title}
                    </h1>
                    <p className="text-center text-gray-500 mt-4 max-w-2xl text-lg whitespace-pre-wrap">
                        {pageConfig.subtitle}
                    </p>
                    <div className="h-1 w-20 bg-primary mt-8 rounded-full"></div>
                </div>

                {/* Struktur Chart */}
                <div className="flex flex-col items-center w-full mb-20 animate-fade-in-up">
                    
                    {/* Level 1: Ketua */}
                    <div className="w-full max-w-md">
                        <div className="bg-white border-2 border-primary/20 rounded-2xl p-6 shadow-xl shadow-primary/5 text-center relative overflow-hidden group hover:border-primary/50 transition-colors">
                            <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
                            <h3 className="text-xl font-bold text-slate-800 mb-4 mt-3">{ketua.positionName}</h3>
                            <div className="mb-4 bg-slate-50 border border-slate-100 rounded-lg p-2.5 flex items-center justify-center gap-2 w-full max-w-[280px] mx-auto">
                                <span className="material-symbols-outlined text-slate-400 text-[18px]">person</span>
                                <div className="flex flex-col text-left justify-center">
                                    <span className="text-sm font-bold text-slate-700 leading-tight">{ketua.name}</span>
                                </div>
                            </div>
                            <p className="text-gray-500 text-sm">{ketua.detail || 'Pemimpin tertinggi di Laman Kabar.'}</p>
                        </div>
                    </div>

                    {/* Connecting Line 1 (Mobile & Desktop) */}
                    <div className="w-0.5 h-8 md:h-12 bg-gray-300"></div>

                    {/* Level 2: Wakil Ketua */}
                    <div className="w-full max-w-md">
                        <div className="bg-white border-2 border-blue-500/20 rounded-2xl p-6 shadow-xl shadow-blue-500/5 text-center relative overflow-hidden group hover:border-blue-500/50 transition-colors">
                            <div className="absolute top-0 left-0 w-full h-2 bg-blue-500"></div>
                            <h3 className="text-xl font-bold text-slate-800 mb-4 mt-3">{wakilKetua.positionName}</h3>
                            <div className="mb-4 bg-slate-50 border border-slate-100 rounded-lg p-2.5 flex items-center justify-center gap-2 w-full max-w-[280px] mx-auto">
                                <span className="material-symbols-outlined text-slate-400 text-[18px]">person</span>
                                <div className="flex flex-col text-left justify-center">
                                    <span className="text-sm font-bold text-slate-700 leading-tight">{wakilKetua.name}</span>
                                </div>
                            </div>
                            <p className="text-gray-500 text-sm">{wakilKetua.detail || 'Pemimpin tertinggi setelah ketua di Laman Kabar.'}</p>
                        </div>
                    </div>

                    {/* Connecting Line down to departments (Desktop Only) */}
                    <div className="hidden md:block w-0.5 h-12 bg-gray-300"></div>

                    {/* Level 3: Departments */}
                    {regularDepts.length === 0 ? (
                        <div className="mt-8 text-center text-gray-400 italic">Belum ada departemen yang ditambahkan.</div>
                    ) : (
                        <div className="flex flex-col md:flex-row w-full gap-6 md:gap-8 mt-8 md:mt-0 relative">
                            {regularDepts.map((dept, index) => {
                                const parsed = parseDept(dept.description)
                                const color = COLORS[index % COLORS.length]
                                const lineClass = getLineClasses(index, regularDepts.length)

                                return (
                                    <div key={dept.id} className="flex-1 flex flex-col relative md:pt-12 min-w-0">
                                        {/* Desktop lines */}
                                        <div className={`hidden md:block absolute top-0 h-0.5 bg-gray-300 ${lineClass}`}></div>
                                        <div className="hidden md:block absolute top-0 left-1/2 w-0.5 h-12 bg-gray-300 -translate-x-1/2"></div>
                                        
                                        {/* Mobile line connector to stack */}
                                        <div className="md:hidden absolute -top-8 left-1/2 w-0.5 h-8 bg-gray-300 -translate-x-1/2"></div>

                                        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow relative text-center h-full flex flex-col mt-8 md:mt-0">
                                            <div className={`absolute top-0 left-1/2 w-12 h-1.5 -translate-x-1/2 rounded-b-md ${color.bg}`}></div>
                                            <h3 className="text-xl font-bold text-slate-800 mb-2 mt-3">{dept.name}</h3>
                                            
                                            {parsed.headOfDept && (
                                                <div className="mb-4 bg-slate-50 border border-slate-100 rounded-lg p-2.5 flex items-center justify-center gap-2">
                                                    <span className="material-symbols-outlined text-slate-400 text-[18px]">person</span>
                                                    <div className="flex flex-col text-left justify-center">
                                                        <span className="text-sm font-bold text-slate-700 leading-tight">{parsed.headOfDept}</span>
                                                    </div>
                                                </div>
                                            )}

                                            <p className="text-sm text-gray-500 mb-6 whitespace-pre-wrap">{parsed.desc}</p>
                                            
                                            {parsed.divisions && parsed.divisions.length > 0 && (
                                                <div className="space-y-3 border-t border-gray-100 pt-5">
                                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider text-left mb-2">Divisi</h4>
                                                    
                                                    {parsed.divisions.map((div: any, dIdx: number) => (
                                                        <div key={dIdx} className={`bg-slate-50 border border-slate-100 rounded-lg p-3 text-left transition-colors ${color.hover}`}>
                                                            <h4 className="font-semibold text-slate-700 text-sm">{div.name}</h4>
                                                            {div.desc && <p className="text-xs text-gray-500 mt-1">{div.desc}</p>}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    )
}
