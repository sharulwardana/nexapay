'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Info, X } from 'lucide-react';

interface TopUpHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameName: string;
}

export default function TopUpHelpModal({ isOpen, onClose, gameName }: TopUpHelpModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            className="relative w-full max-w-sm rounded-3xl bg-[#121620] border border-white/12 p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#FF7300]/10 text-[#FF7300] border border-[#FF7300]/25 flex items-center justify-center font-bold">
                  <Info className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold font-heading text-white">Petunjuk ID &amp; Server</h3>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer"
                aria-label="Tutup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <p>
                Untuk menemukan <strong className="text-white">User ID &amp; Server ID</strong> game <strong className="text-[#FF7300]">{gameName}</strong>:
              </p>
              <ol className="list-decimal list-inside space-y-2 bg-[#0B0E14] p-3.5 rounded-2xl border border-white/8 text-slate-300">
                <li>Buka aplikasi game <strong className="text-white">{gameName}</strong> di perangkat kamu.</li>
                <li>Masuk ke menu <strong className="text-white">Profil / Avatar</strong> di pojok kiri atas layar.</li>
                <li>User ID dan Server ID tertera di bawah nickname akun kamu (Contoh: ID <span className="font-mono font-bold text-[#FF7300]">12345678</span> Zone <span className="font-mono font-bold text-[#FF7300]">1234</span>).</li>
              </ol>
              <p className="text-[11px] text-slate-400 italic">
                Salin angka tersebut dan masukkan ke dalam kolom Data Akun dengan teliti.
              </p>
            </div>

            <button
              onClick={onClose}
              className="btn-primary w-full py-3 text-xs font-bold"
            >
              Saya Mengerti
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
