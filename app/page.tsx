
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Countdown from '@/components/Countdown'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import DepartmentCarousel from '@/components/DepartmentCarousel'

export const revalidate = 60

async function getAboutUs() {
  const { data } = await supabase.from('about_us').select('*').single()
  // Use 'description' from new schema, fallback to 'content' (old), then default text
  return {
    title: data?.title || "",
    description: data?.description || data?.content || ""
  }
}

async function getDepartments() {
  const { data } = await supabase.from('departments').select('*')
  if (!data) return []
  return data
    .filter(d => d.name !== 'Ketua' && d.name !== 'Wakil Ketua')
    .map(d => {
      let desc = d.description
      try {
        const parsed = JSON.parse(d.description)
        desc = parsed.desc
      } catch (e) {
        // fallback to original
      }
      return { ...d, description: desc }
    })
}

// Helper to map department names to icons (fallback to 'groups' if not found)
function getIconForDept(name: string) {
  const lower = name.toLowerCase()
  if (lower.includes('educa') || lower.includes('pendidikan')) return 'school'
  if (lower.includes('social') || lower.includes('sosial')) return 'volunteer_activism'
  if (lower.includes('tech') || lower.includes('teknologi')) return 'rocket_launch'
  if (lower.includes('art') || lower.includes('seni') || lower.includes('budaya')) return 'palette'
  if (lower.includes('health') || lower.includes('kesehatan')) return 'cardiology'
  if (lower.includes('outreach') || lower.includes('humas')) return 'campaign'
  return 'groups' // default
}

// Helper to get hero content
async function getHeroContent() {
  const { data } = await supabase.from('home_hero_content').select('*').limit(1).single()
  return {
    headline_prefix: data?.headline_prefix || "",
    headline_highlight: data?.headline_highlight || "",
    subheadline: data?.subheadline || ""
  }
}

// Helper to get FAQs
async function getFaqs() {
  const { data } = await supabase.from('faqs').select('*').eq('is_active', true).order('created_at', { ascending: true })
  return data || []
}

export default async function Home() {
  const aboutData = await getAboutUs()
  const departments = await getDepartments()
  const heroContent = await getHeroContent()
  const faqs = await getFaqs()

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light group/design-root overflow-x-clip font-display text-[#181111]">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center py-20 px-5 text-center animate-fade-in-up">
          <div className="max-w-[800px] flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight text-[#181111]">
                {heroContent.headline_prefix} <span className="text-primary">{heroContent.headline_highlight}</span>
              </h1>
              <p className="text-[#8a6060] text-lg md:text-xl font-normal leading-normal">
                {heroContent.subheadline}
              </p>
            </div>
            {/* Timer */}
            <Countdown />
          </div>
        </div>

        {/* About Section */}
        <div className="px-5 md:px-20 py-12 flex justify-center bg-white" id="about">
          <div className="max-w-[960px] w-full flex flex-col md:flex-row gap-10 items-center animate-fade-in-up">
            <div className="flex-1">
              <div className="w-full h-64 md:h-80 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/30 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-white/40 backdrop-blur-sm z-0"></div>
                <img
                  src="http://cdn01.lamankabar.web.id/logo/lamankabar.png"
                  alt="Laman Kabar Logo"
                  className="w-2/3 md:w-1/2 h-auto object-contain relative z-10 drop-shadow-md"
                />
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-4">
              <h2 className="text-3xl font-bold leading-tight tracking-tight text-[#181111]">
                {aboutData.title || "Tentang Kami"}
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed line-clamp-4 overflow-hidden text-ellipsis">
                {aboutData.description}
              </p>
              <div className="pt-2">
                <Link href="/tentang-kami" className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
                  Lihat selengkapnya <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Divisions Section */}
        <div className="px-5 md:px-20 py-16 flex flex-col items-center" id="divisions">
          <div className="max-w-[960px] w-full flex flex-col gap-10 animate-fade-in-up">
            <div className="text-center max-w-[600px] mx-auto">
              <h2 className="text-3xl font-bold mb-3">Struktur Pengurus</h2>
              <p className="text-gray-500">Berikut ini adalah struktur pengurus Laman Kabar.</p>
            </div>

            {(await supabase.from('departments_config').select('is_active').single()).data?.is_active === false ? (
              <div className="flex flex-col items-center justify-center py-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="bg-orange-50 text-orange-600 px-6 py-2 rounded-full font-bold tracking-widest uppercase text-sm mb-4 border border-orange-100">
                  Stay Tuned
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-[#181111] tracking-tight text-center">
                  Segera Hadir
                </h2>
                <p className="text-[#8a6060] mt-3 text-lg text-center max-w-md font-medium">
                  Struktur pengurus kami sedang dalam persiapan. Nantikan info selanjutnya!
                </p>
              </div>
            ) : departments.length === 0 ? (
              <p className="text-center text-gray-500">Tidak ada data struktur pengurus tersedia.</p>
            ) : (
              <div className="flex flex-col items-center w-full">
                <DepartmentCarousel departments={departments} />
                
                <div className="mt-2">
                  <Link href="/struktur" className="inline-flex items-center justify-center gap-2 rounded-lg h-12 px-8 bg-primary text-white text-base font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20 active:scale-95">
                    Lihat Selengkapnya <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        {faqs.length > 0 && (
          <div className="px-5 md:px-20 py-16 flex flex-col items-center bg-[#fcf9f9]" id="faq">
            <div className="max-w-[960px] w-full flex flex-col gap-10 animate-fade-in-up">
              <div className="text-center max-w-[600px] mx-auto">
                <h2 className="text-3xl font-bold mb-3 text-[#181111]">Pertanyaan yang Sering Diajukan</h2>
                <p className="text-gray-500">Punya pertanyaan? Temukan jawabannya di sini.</p>
              </div>

              <div className="flex flex-col gap-4">
                {faqs.map((faq: any) => (
                  <details key={faq.id} className="group bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex items-center justify-between p-5 md:p-6 cursor-pointer font-bold text-lg text-[#181111] hover:text-primary transition-colors">
                      {faq.question}
                      <span className="material-symbols-outlined text-gray-400 group-open:rotate-180 transition-transform duration-300">
                        expand_more
                      </span>
                    </summary>
                    <div className="px-5 md:px-6 pb-5 md:pb-6 text-gray-600 leading-relaxed border-t border-gray-50 pt-4 mt-2">
                      <p className="whitespace-pre-line">{faq.answer}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="px-5 md:px-20 py-12 flex justify-center">
          <div className="max-w-[960px] w-full bg-white border border-gray-100 shadow-lg rounded-2xl overflow-hidden relative animate-fade-in-up">
            {/* Decorative accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
            <div className="flex flex-col md:flex-row items-center justify-between p-10 gap-8 relative z-10">
              <div className="flex flex-col gap-2 max-w-lg">
                <h2 className="text-2xl md:text-3xl font-bold text-[#181111]">Mari Bergabung bersama Kami!</h2>
                <p className="text-gray-500">Jadilah bagian dari tim jurnalistik Laman Kabar!</p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link href="/daftar" className="flex items-center justify-center rounded-lg h-12 px-8 bg-primary text-white text-base font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20">
                  Daftar
                </Link>
                <Link href="/tentang-kami" className="flex items-center justify-center rounded-lg h-12 px-8 bg-transparent border-2 border-primary text-primary text-base font-bold hover:bg-primary/5 transition-colors">
                  Tentang Kami
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
