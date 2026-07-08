import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="mt-auto border-t border-[#f5f0f0] bg-white px-10 py-8 text-[#181111]">
            <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2">
                    <img
                        src="http://cdn01.lamankabar.web.id/logo/lamankabar.png"
                        alt="Laman Kabar Logo"
                        className="h-8 w-auto object-contain"
                    />
                    {/* <span className="text-lg font-bold text-[#181111] dark:text-white">Laman Kabar</span> */}
                </div>
                <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm font-medium text-gray-500 dark:text-gray-400">
                    <Link className="hover:text-primary transition-colors" href="/kebijakan-privasi">Kebijakan Privasi</Link>
                    <Link className="hover:text-primary transition-colors" href="/syarat-ketentuan">S&K Website</Link>
                    <Link className="hover:text-primary transition-colors" href="/faq">FAQ</Link>
                    <Link className="hover:text-primary transition-colors" href="/hubungi-kami">Hubungi Kami</Link>
                </div>
                <div className="flex gap-4">
                    <a className="text-gray-400 hover:text-primary transition-colors" href="https://www.instagram.com/lamankabar/">
                        <span className="material-symbols-outlined">public</span>
                    </a>
                    <a className="text-gray-400 hover:text-primary transition-colors" href="mailto:lamankabarupi@gmail.com">
                        <span className="material-symbols-outlined">mail</span>
                    </a>
                </div>
            </div>
            <div className="text-center mt-8 text-xs text-gray-400">
                © {new Date().getFullYear()} Laman Kabar UPI Purwakarta. All rights reserved.
            </div>
        </footer>
    )
}
