import Link from 'next/link';
import { ArrowLeft, Briefcase, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Karir — NexaPay',
  description: 'Bergabunglah dengan tim NexaPay untuk membangun masa depan platform top-up & hiburan digital di Indonesia.',
};

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container-app max-w-4xl mx-auto px-4">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
        </Link>
        <div className="p-8 rounded-2xl bg-card/50 border border-border backdrop-blur-md text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <Briefcase className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Karir di NexaPay</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Kami selalu mencari talenta hebat untuk berkembang bersama. Saat ini belum ada posisi terbuka, namun Anda dapat mengirimkan CV ke <span className="text-primary font-semibold">career@nexapay.id</span>.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Fast-Growing Fintech & Gaming Platform
          </div>
        </div>
      </div>
    </div>
  );
}
