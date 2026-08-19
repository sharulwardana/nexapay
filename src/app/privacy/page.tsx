import Link from 'next/link';
import { Lock, ShieldAlert, Eye, KeyRound, Database, UserCheck } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'Kebijakan Privasi — NexaPay',
  description: 'Perlindungan data pribadi, enkripsi 256-bit, dan jaminan keamanan pengguna di NexaPay.',
};

const privacySections = [
  {
    icon: Database,
    title: '1. Pengumpulan Data Terenkripsi',
    summary: 'Hanya data yang esensial (Email, User ID, Rekam Transaksi) yang disimpan dengan enkripsi SSL 256-bit.',
    content: 'NexaPay mengumpulkan informasi yang Anda berikan langsung untuk pemrosesan top-up instan. Kredensial sensitif seperti nomor kartu atau kata sandi bank TIDAK PERNAH disimpan di peladen kami.',
  },
  {
    icon: Lock,
    title: '2. Protokol Keamanan & Tokenisasi',
    summary: 'Setiap pembayaran menggunakan tokenisasi PCI-DSS tingkat perbankan.',
    content: 'Transaksi diproses menggunakan sistem tokenisasi berstandar internasional. Sistem kami dilengkapi firewall berlapis dan pemantauan ancaman siber 24/7.',
  },
  {
    icon: ShieldAlert,
    title: '3. Larangan Penjualan Data',
    summary: 'Data Anda 100% milik Anda. NexaPay tidak pernah menjual data ke pihak ketiga.',
    content: 'Informasi pengguna hanya dibagikan kepada gateway pembayaran resmi (seperti Midtrans/Xendit) atau publisher game resmi untuk tujuan pengiriman diamond/voucher.',
  },
  {
    icon: UserCheck,
    title: '4. Hak Kontrol & Penghapusan Data',
    summary: 'Anda memiliki hak penuh untuk meminta ekspor atau penghapusan permanen akun Anda.',
    content: 'Pengguna dapat mengajukan penutupan akun dan penghapusan riwayat data kapan saja dengan menghubungi Tim Data Protection Officer kami.',
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 tablet:pt-32 pb-24 relative overflow-hidden">
        {/* Ambient background */}
        <div className="absolute top-1/4 right-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="container-app max-w-4xl relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-md mb-4 shadow-sm">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] font-bold tracking-widest text-emerald-400 uppercase font-heading">Data Protection Standard 2026</span>
            </div>
            <h1 className="heading-1 mb-3">
              Kebijakan <span className="gradient-text">Privasi & Keamanan</span>
            </h1>
            <p className="body-default text-muted-foreground max-w-lg mx-auto">
              Komitmen penuh NexaPay dalam menjaga kerahasiaan dan keamanan data pribadi Anda.
            </p>
          </div>

          <div className="space-y-5">
            {privacySections.map((sec) => (
              <div key={sec.title} className="p-6 rounded-2xl bg-card/50 border border-border/80 hover:border-emerald-500/40 backdrop-blur-xl transition-all duration-300 shadow-md">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <sec.icon className="w-4 h-4" />
                  </div>
                  <h2 className="text-base font-bold font-heading">{sec.title}</h2>
                </div>

                <div className="mb-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 flex items-center gap-2">
                  <KeyRound className="w-4 h-4 flex-shrink-0" />
                  <span>Jaminan Privasi: {sec.summary}</span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed pl-1">
                  {sec.content}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center p-6 rounded-2xl bg-card/30 border border-border text-xs text-muted-foreground">
            Konsultasi Privasi & Data Protection Officer:{' '}
            <a href="mailto:privacy@nexapay.id" className="text-emerald-400 font-bold hover:underline">privacy@nexapay.id</a>.
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
