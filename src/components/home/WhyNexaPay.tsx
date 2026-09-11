'use client';

import { Zap, ShieldCheck, Clock, Headphones } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Proses Kilat',
    description: 'Item masuk dalam hitungan detik',
    iconColor: 'text-[#FF7300]',
    iconBg: 'bg-[#FF7300]/10 border-[#FF7300]/25',
  },
  {
    icon: ShieldCheck,
    title: '100% Resmi',
    description: 'Terenkripsi SSL & bersumber resmi',
    iconColor: 'text-emerald-400',
    iconBg: 'bg-emerald-500/10 border-emerald-500/25',
  },
  {
    icon: Clock,
    title: 'Otomatis 24/7',
    description: 'Transaksi instan kapan pun',
    iconColor: 'text-blue-400',
    iconBg: 'bg-blue-500/10 border-blue-500/25',
  },
  {
    icon: Headphones,
    title: 'Support Responsif',
    description: 'Live Chat & WhatsApp setiap hari',
    iconColor: 'text-amber-400',
    iconBg: 'bg-amber-500/10 border-amber-500/25',
  },
];

export default function WhyNexaPay() {
  return (
    <section className="py-6 tablet:py-10">
      <div className="container-app">
        {/* Responsive feature strip: 2 cols on mobile/tablet for comfortable reading, 4 cols on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 tablet:gap-4">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="group flex items-start gap-3 sm:gap-3.5 p-3.5 sm:p-4 tablet:p-5 rounded-2xl bg-[#121620] hover:bg-[#161D2C] border border-white/10 hover:border-[#FF7300]/30 transition-all duration-200 shadow-sm"
              >
                <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl ${feature.iconBg} flex items-center justify-center flex-shrink-0 ${feature.iconColor} border`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-heading font-bold text-xs sm:text-sm text-white leading-tight">
                    {feature.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed mt-0.5 line-clamp-none">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
