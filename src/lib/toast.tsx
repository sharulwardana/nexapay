import { toast } from 'sonner';
import { AlertCircle, Clock, Info, CheckCircle2 } from 'lucide-react';

export const showToast = {
  success: (title: string, message?: string) => {
    toast.custom(
      (t) => (
        <div className="flex items-center gap-3.5 px-4.5 py-3.5 rounded-2xl bg-card/95 backdrop-blur-2xl border border-emerald-500/35 shadow-[0_12px_40px_rgba(0,0,0,0.6),0_0_25px_rgba(16,185,129,0.22)] min-w-[300px] max-w-[440px] transition-all animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-auto">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0 shadow-[0_0_16px_rgba(16,185,129,0.35)]">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground tracking-tight leading-snug">{title}</p>
            {message && <p className="text-xs font-medium text-emerald-400/90 mt-0.5">{message}</p>}
          </div>
        </div>
      ),
      { duration: 4000 }
    );
  },

  warning: (title: string, message?: string) => {
    toast.custom(
      (t) => (
        <div className="flex items-center gap-3.5 px-4.5 py-3.5 rounded-2xl bg-card/95 backdrop-blur-2xl border border-amber-500/35 shadow-[0_12px_40px_rgba(0,0,0,0.6),0_0_25px_rgba(245,158,11,0.25)] min-w-[300px] max-w-[440px] transition-all animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-auto">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 shadow-[0_0_16px_rgba(245,158,11,0.35)]">
            <Clock className="w-5 h-5 text-amber-400 animate-pulse" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground tracking-tight leading-snug">{title}</p>
            {message && <p className="text-xs font-medium text-amber-400/90 mt-0.5">{message}</p>}
          </div>
        </div>
      ),
      { duration: 4000 }
    );
  },

  error: (title: string, message?: string) => {
    toast.custom(
      (t) => (
        <div className="flex items-center gap-3.5 px-4.5 py-3.5 rounded-2xl bg-card/95 backdrop-blur-2xl border border-rose-500/35 shadow-[0_12px_40px_rgba(0,0,0,0.6),0_0_25px_rgba(244,63,94,0.25)] min-w-[300px] max-w-[440px] transition-all animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-auto">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shrink-0 shadow-[0_0_16px_rgba(244,63,94,0.35)]">
            <AlertCircle className="w-5 h-5 text-rose-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground tracking-tight leading-snug">{title}</p>
            {message && <p className="text-xs font-medium text-rose-400/90 mt-0.5">{message}</p>}
          </div>
        </div>
      ),
      { duration: 4000 }
    );
  },

  info: (title: string, message?: string) => {
    toast.custom(
      (t) => (
        <div className="flex items-center gap-3.5 px-4.5 py-3.5 rounded-2xl bg-card/95 backdrop-blur-2xl border border-cyan-500/35 shadow-[0_12px_40px_rgba(0,0,0,0.6),0_0_25px_rgba(6,182,212,0.25)] min-w-[300px] max-w-[440px] transition-all animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-auto">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shrink-0 shadow-[0_0_16px_rgba(6,182,212,0.35)]">
            <Info className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground tracking-tight leading-snug">{title}</p>
            {message && <p className="text-xs font-medium text-cyan-400/90 mt-0.5">{message}</p>}
          </div>
        </div>
      ),
      { duration: 4000 }
    );
  },
};
