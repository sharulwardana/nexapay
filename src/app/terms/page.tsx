import Link from 'next/link';
import { ShieldCheck, FileText, CheckCircle2, Lock, AlertTriangle, HelpCircle } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import MobileNav from '@/components/layout/MobileNav';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'Syarat & Ketentuan — NexaPay',
  description: 'Ketentuan penggunaan dan aturan resmi transaksi di platform NexaPay.',
};

const termsSections = [
  {
    id: 'umum',
    title: '1. Ketentuan Umum & Cakupan Layanan',
    summary: 'Dengan menggunakan NexaPay, Anda terikat perjanjian resmi layanan top-up & voucher digital.',
    content: 'NexaPay adalah platform fintech top-up game, voucher digital, dan saldo yang dioperasikan secara sah di Indonesia. Penggunaan platform menandakan persetujuan Penuh tanpa syarat pada seluruh ketentuan legal yang berlaku.',
  },
  {
    id: 'akun',
    title: '2. Keamanan & Tanggung Jawab Akun',
    summary: 'Kerahasiaan akun & kredensial OTP/Password adalah tanggung jawab mutlak pemilik akun.',
    content: 'Pengguna wajib memberikan data yang sah dan menjaga kerahasiaan kredensial login. Segala instruksi transaksi yang tervalidasi oleh kredensial akun Anda dianggap sah dan tidak dapat ditolak.',
  },
  {
    id: 'transaksi',
    title: '3. Eksekusi Pembayaran & Pembatalan',
    summary: 'Semua transaksi yang sudah dibayar dan terinjeksi bersifat final & tidak dapat dibatalkan.',
    content: 'Harga dan ketersediaan stok dapat berubah mengikuti rate penyedia game global. Transaksi yang telah diproses secara otomatis oleh API gateway bersifat final. Pengguna wajib memeriksa User ID & Server ID sebelum membayar.',
  },
  {
    id: 'refund',
    title: '4. Kebijakan Refund & Jaminan Gagal',
    summary: 'Dana akan dikembalikan 100% jika transaksi gagal diproses dari sisi sistem NexaPay.',
    content: 'Apabila terjadi gangguan server/stok kosong dan transaksi tidak dapat dipenuhi dalam 1x24 jam, saldo akan di-refund penuh ke metode pembayaran asal atau Nexa Wallet tanpa potongan.',
  },
  {
    id: 'larangan',
    title: '5. Larangan Cyber Crime & Fraud',
    summary: 'Dilarang keras menggunakan bot, kartu kredit ilegal, atau mengeksploitasi bug sistem.',
    content: 'Penggunaan kartu kredit ilegal, transaksi pencucian uang, manipulasi promo dengan bot, atau percobaan peretasan API NexaPay akan berdampak pada penutupan akun permanen dan penindakan hukum pidana.',
  },
];

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 tablet:pt-32 pb-24 relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="container-app max-w-4xl relative z-10">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md mb-4 shadow-sm">
              <FileText className="w-3.5 h-3.5 text-primary" />
              <span className="text-[11px] font-bold tracking-widest text-primary uppercase font-heading">Official Legal Agreement</span>
            </div>
            <h1 className="heading-1 mb-3">
              Syarat & <span className="gradient-text">Ketentuan Layanan</span>
            </h1>
            <p className="body-default text-muted-foreground max-w-lg mx-auto">
              Pedoman penggunaan NexaPay yang dirancang secara transparan demi keamanan & kenyamanan transaksi Anda. Terakhir diperbarui: 25 Mei 2026.
            </p>
          </div>

          {/* Legal Sections Grid */}
          <div className="space-y-5">
            {termsSections.map((sec) => (
              <div key={sec.id} className="p-6 rounded-2xl bg-card/50 border border-border/80 hover:border-primary/40 backdrop-blur-xl transition-all duration-300 shadow-md">
                <div className="flex items-center gap-2.5 mb-2">
                  <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0" />
                  <h2 className="text-base font-bold font-heading">{sec.title}</h2>
                </div>

                {/* Quick Gamer Summary Callout */}
                <div className="mb-3 p-3 rounded-xl bg-primary/10 border border-primary/20 text-xs font-semibold text-primary flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>Ringkasan Cepat: {sec.summary}</span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed pl-1">
                  {sec.content}
                </p>
              </div>
            ))}
          </div>

          {/* Contact Legal Support */}
          <div className="mt-10 text-center p-6 rounded-2xl bg-card/30 border border-border text-xs text-muted-foreground">
            Ada pertanyaan seputar aturan hukum kami? Hubungi tim legal di{' '}
            <a href="mailto:legal@nexapay.id" className="text-primary font-bold hover:underline">legal@nexapay.id</a> atau{' '}
            <Link href="/help" className="text-primary font-bold hover:underline">Pusat Bantuan</Link>.
          </div>
        </div>
      </main>
      <Footer />
      <MobileNav />
    </>
  );
}
