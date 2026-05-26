export default function MarqueePromo() {
  const promos = [
    "🔥 FLASH SALE: Diskon 20% Mobile Legends Diamonds! Gunakan kode NEXAWIN",
    "⚡ Cashback 50% untuk transaksi pertama dengan GoPay",
    "💎 Promo Spesial Genshin Impact: Blessing of the Welkin Moon hanya Rp 59.000",
    "🎮 Top Up Valorant VP sekarang dapet bonus 10% Extra!",
  ];

  // We duplicate the array to ensure smooth infinite scrolling
  const duplicatedPromos = [...promos, ...promos, ...promos];

  return (
    <div className="w-full bg-primary/10 border-b border-primary/20 overflow-hidden py-1.5 relative z-40">
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {duplicatedPromos.map((promo, index) => (
          <div key={index} className="flex items-center px-4">
            <span className="text-[11px] tablet:text-xs font-semibold text-primary tracking-wide whitespace-nowrap">
              {promo}
            </span>
            {index !== duplicatedPromos.length - 1 && (
              <span className="mx-4 text-primary/30 text-xs">•</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
