import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'Hubungi Kami | Laman Kabar',
  description: 'Hubungi Laman Kabar untuk pertanyaan atau informasi lebih lanjut.',
}

export default function ContactPage() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light group/design-root overflow-x-clip font-display text-[#181111]">
      <Navbar />

      <main className="flex-grow container mx-auto px-6 py-16 max-w-4xl animate-fade-in-up">
        {/* <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center size-20 rounded-full bg-primary/10 text-primary mb-6">
            <span className="material-symbols-outlined text-4xl">contact_support</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Hubungi Kami
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Punya pertanyaan, masukan, atau ingin berkolaborasi? Jangan ragu untuk menghubungi kami melalui platform di bawah ini.
          </p>
        </div> */}

        <div className="w-full max-w-4xl mx-auto bg-white p-4 md:p-8 rounded-2xl border border-gray-100 shadow-sm">
          <div className="relative w-full h-[800px] md:h-[1000px] rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
            {/* Ganti URL src di bawah ini dengan link form (misal Google Form) Anda */}
            <iframe 
              src="https://tally.so/r/7Rp20R" 
              width="100%" 
              height="100%" 
              frameBorder="0" 
              marginHeight={0} 
              marginWidth={0}
              className="absolute top-0 left-0 w-full h-full"
            >
              Memuat Form…
            </iframe>
          </div>
        </div>

        {/* FAQ CTA */}
        {/* <div className="mt-16 bg-primary/5 rounded-2xl p-8 md:p-12 text-center border border-primary/10">
          <h3 className="text-2xl font-bold text-slate-900 mb-3">Mungkin pertanyaan Anda sudah terjawab?</h3>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Sebelum menghubungi kami, Anda bisa melihat halaman utama kami, mungkin jawaban dari pertanyaan Anda ada di bagian FAQ.
          </p>
          <Link href="/#faq" className="inline-flex items-center justify-center rounded-lg h-12 px-8 bg-white border border-gray-200 text-slate-700 font-bold hover:bg-gray-50 transition-colors shadow-sm">
            Lihat FAQ
          </Link>
        </div> */}
      </main>

      <Footer />
    </div>
  )
}
