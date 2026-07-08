'use client'

import { useRef, useState } from 'react'

export default function DepartmentCarousel({ departments }: { departments: any[] }) {
    const scrollRef = useRef<HTMLDivElement>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [startX, setStartX] = useState(0)
    const [scrollLeft, setScrollLeft] = useState(0)

    function getIconForDept(name: string) {
        const lower = name.toLowerCase()
        if (lower.includes('educa') || lower.includes('pendidikan')) return 'school'
        if (lower.includes('social') || lower.includes('sosial')) return 'volunteer_activism'
        if (lower.includes('tech') || lower.includes('teknologi')) return 'rocket_launch'
        if (lower.includes('art') || lower.includes('seni') || lower.includes('budaya')) return 'palette'
        if (lower.includes('health') || lower.includes('kesehatan')) return 'cardiology'
        if (lower.includes('outreach') || lower.includes('humas')) return 'campaign'
        return 'groups'
    }

    const startDrag = (e: React.MouseEvent) => {
        setIsDragging(true)
        if (!scrollRef.current) return
        setStartX(e.pageX - scrollRef.current.offsetLeft)
        setScrollLeft(scrollRef.current.scrollLeft)
    }

    const stopDrag = () => {
        setIsDragging(false)
    }

    const onDrag = (e: React.MouseEvent) => {
        if (!isDragging) return
        e.preventDefault()
        if (!scrollRef.current) return
        const x = e.pageX - scrollRef.current.offsetLeft
        const walk = (x - startX) * 1.5 // Scroll speed multiplier
        scrollRef.current.scrollLeft = scrollLeft - walk
    }

    return (
        <div className="relative w-full max-w-full group">
            <div 
                ref={scrollRef}
                onMouseDown={startDrag}
                onMouseLeave={stopDrag}
                onMouseUp={stopDrag}
                onMouseMove={onDrag}
                className={`w-full flex overflow-x-auto gap-6 pb-8 pt-2 px-2 ${isDragging ? 'cursor-grabbing snap-none' : 'cursor-grab snap-x snap-mandatory scroll-smooth'}`} 
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {departments.map((dept: any) => (
                    <div 
                        key={dept.id} 
                        className="min-w-[85vw] md:min-w-[320px] max-w-[400px] snap-center shrink-0 bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col"
                        style={{ pointerEvents: isDragging ? 'none' : 'auto' }}
                    >
                        <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4 transition-colors">
                            <span className="material-symbols-outlined">{getIconForDept(dept.name)}</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">{dept.name}</h3>
                        <p className="text-gray-500 text-sm flex-grow whitespace-pre-wrap">{dept.description}</p>
                    </div>
                ))}
            </div>
            
            {/* Desktop Navigation Arrows (Visible on hover) */}
            <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 w-[calc(100%+3rem)] -left-6 justify-between pointer-events-none px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center pointer-events-auto cursor-pointer hover:bg-primary hover:text-white transition-colors"
                     onClick={() => scrollRef.current?.scrollBy({ left: -340, behavior: 'smooth' })}>
                    <span className="material-symbols-outlined text-sm">arrow_back_ios_new</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center pointer-events-auto cursor-pointer hover:bg-primary hover:text-white transition-colors"
                     onClick={() => scrollRef.current?.scrollBy({ left: 340, behavior: 'smooth' })}>
                    <span className="material-symbols-outlined text-sm">arrow_forward_ios</span>
                </div>
            </div>
        </div>
    )
}
