
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Countdown() {
    const [targetDate, setTargetDate] = useState<Date | null>(null)
    const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null)
    const [isActive, setIsActive] = useState<boolean>(true)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function fetchCountdown() {
            try {
                // Fetch the first available config, regardless of ID
                const { data } = await supabase
                    .from('countdown_config')
                    .select('*')
                    .order('id', { ascending: false })
                    .limit(1)
                    .single()

                if (data) {
                    const active = data.is_active ?? true
                    setIsActive(active)

                    if (active && data.target_date) {
                        setTargetDate(new Date(data.target_date))
                    }
                } else {
                    console.log("No countdown data found.")
                    setIsActive(false)
                }
            } catch (error) {
                console.error("Countdown fetch error:", error)
                setIsActive(false)
            } finally {
                setIsLoading(false)
            }
        }

        fetchCountdown()
    }, [])

    useEffect(() => {
        if (!targetDate || !isActive) return

        const timer = setInterval(() => {
            const now = new Date().getTime()
            const distance = targetDate.getTime() - now

            if (distance < 0) {
                clearInterval(timer)
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
                return
            }

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000),
            })
        }, 1000)

        // Initial set to avoid delay
        const now = new Date().getTime()
        const distance = targetDate.getTime() - now
        if (distance >= 0) {
            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000),
            })
        } else {
            setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        }

        return () => clearInterval(timer)
    }, [targetDate, isActive])

    if (isLoading) return <div className="text-center py-8 text-gray-500">Loading...</div>

    if (!isActive) {
        return null
    }

    if (!timeLeft) return <div className="text-center py-8 text-gray-500">Preparing Countdown...</div>

    return (
        <div className="flex flex-wrap justify-center gap-4 py-8">
            {/* Days */}
            <div className="flex flex-col items-center gap-2">
                <div className="flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-xl bg-white shadow-sm border border-gray-100">
                    <p className="text-primary text-3xl md:text-4xl font-bold">{timeLeft.days}</p>
                </div>
                <p className="text-sm font-medium text-gray-500">Hari</p>
            </div>
            {/* Hours */}
            <div className="flex flex-col items-center gap-2">
                <div className="flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-xl bg-white shadow-sm border border-gray-100">
                    <p className="text-primary text-3xl md:text-4xl font-bold">{timeLeft.hours}</p>
                </div>
                <p className="text-sm font-medium text-gray-500">Jam</p>
            </div>
            {/* Minutes */}
            <div className="flex flex-col items-center gap-2">
                <div className="flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-xl bg-white shadow-sm border border-gray-100">
                    <p className="text-primary text-3xl md:text-4xl font-bold">{timeLeft.minutes}</p>
                </div>
                <p className="text-sm font-medium text-gray-500">Menit</p>
            </div>
            {/* Seconds */}
            <div className="flex flex-col items-center gap-2">
                <div className="flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-xl bg-white shadow-sm border border-gray-100">
                    <p className="text-primary text-3xl md:text-4xl font-bold">{timeLeft.seconds}</p>
                </div>
                <p className="text-sm font-medium text-gray-500">Detik</p>
            </div>
        </div>
    )
}
