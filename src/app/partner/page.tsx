import Link from 'next/link';
import { ArrowLeft, Handshake, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Mitra & Partner — NexaPay',
  description: 'Bergabung menjadi mitra agen & reseller resmi NexaPay dengan komisi dan harga khusus.',
};

export default function PartnerPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container-app max-w-4xl mx-auto px-4">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
        </Link>
        <div className="p-8 rounded-2xl bg-card/50 border border-border backdrop-blur-md text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
            <Handshake className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Kemitraan & Reseller NexaPay</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Dapatkan margin keuntungan maksimal sebagai mitra agen top-up resmi NexaPay. Hubungi tim kemitraan kami di <span className="text-emerald-400 font-semibold">partner@nexapay.id</span>.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" /> Direct Merchant API & Reseller Panel
          </div>
        </div>
      </div>
    </div>
  );
}
