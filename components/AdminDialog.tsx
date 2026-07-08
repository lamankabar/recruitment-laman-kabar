import React from 'react'

export type AdminDialogProps = {
    isOpen: boolean;
    title: string;
    message: string;
    type?: 'alert' | 'confirm';
    onClose: () => void;
    onConfirm?: () => void;
}

export default function AdminDialog({ isOpen, title, message, type = 'alert', onClose, onConfirm }: AdminDialogProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 text-center">
                    <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full mb-4 ${type === 'alert' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                        <span className="material-symbols-outlined text-[24px]">
                            {type === 'alert' ? 'check_circle' : 'warning'}
                        </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
                    <p className="text-sm text-slate-500">{message}</p>
                </div>
                <div className="p-4 bg-slate-50 flex gap-3 justify-center border-t border-slate-100">
                    {type === 'confirm' && (
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-bold text-sm hover:bg-white transition-colors flex-1"
                        >
                            Batal
                        </button>
                    )}
                    <button
                        onClick={() => {
                            if (onConfirm) onConfirm();
                            onClose();
                        }}
                        className={`px-4 py-2 rounded-lg text-white font-bold text-sm transition-colors flex-1 shadow-md ${type === 'alert' ? 'bg-primary hover:bg-red-700 shadow-primary/20' : 'bg-red-600 hover:bg-red-700 shadow-red-500/20'}`}
                    >
                        {type === 'alert' ? 'Tutup' : 'Hapus'}
                    </button>
                </div>
            </div>
        </div>
    )
}
