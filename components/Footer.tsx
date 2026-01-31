
export default function Footer() {
    return (
        <footer className="mt-auto border-t border-[#f5f0f0] bg-white px-10 py-8 text-[#181111]">
            <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2">
                    <img
                        src="http://cdn01.lamankabar.web.id/logo/lamankabar-logo.png"
                        alt="Laman Kabar Logo"
                        className="h-8 w-auto object-contain"
                    />
                    {/* <span className="text-lg font-bold text-[#181111] dark:text-white">Laman Kabar</span> */}
                </div>
                <div className="flex gap-6 text-sm font-medium text-gray-500 dark:text-gray-400">
                    <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
                    <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
                    <a className="hover:text-primary transition-colors" href="#">Contact Us</a>
                </div>
                <div className="flex gap-4">
                    <a className="text-gray-400 hover:text-primary transition-colors" href="#">
                        <span className="material-symbols-outlined">public</span>
                    </a>
                    <a className="text-gray-400 hover:text-primary transition-colors" href="#">
                        <span className="material-symbols-outlined">mail</span>
                    </a>
                </div>
            </div>
            <div className="text-center mt-8 text-xs text-gray-400">
                © {new Date().getFullYear()} Laman Kabar. All rights reserved.
            </div>
        </footer>
    )
}
