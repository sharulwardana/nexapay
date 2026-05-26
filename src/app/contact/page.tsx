'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, Globe } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import MobileNav from '@/components/layout/MobileNav';
import Footer from '@/components/layout/Footer';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      toast.success('Pesan berhasil dikirim! Kami akan merespons dalam 1x24 jam.');
      setForm({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 tablet:pt-24 pb-24">
        <div className="container-app max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8 tablet:mb-12">
            <h1 className="heading-2 mb-2">Hubungi Kami</h1>
            <p className="body-default">Ada pertanyaan? Tim kami siap membantu kamu 24/7</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Contact Info */}
            <div className="space-y-4">
              {[
                { icon: Mail, title: 'Email', info: 'support@nexapay.id', subtitle: 'Respon dalam 1x24 jam', color: 'from-violet-500 to-purple-600' },
                { icon: Phone, title: 'Telepon', info: '0800-123-4567', subtitle: 'Senin-Minggu, 24 jam', color: 'from-cyan-500 to-blue-600' },
                { icon: MessageCircle, title: 'Live Chat', info: 'Chat langsung dengan CS', subtitle: 'Rata-rata respon < 2 menit', color: 'from-green-500 to-emerald-600' },
                { icon: MapPin, title: 'Kantor', info: 'Jakarta, Indonesia', subtitle: 'Jl. Sudirman No. 123', color: 'from-amber-500 to-orange-600' },
              ].map((contact, i) => (
                <motion.div
                  key={contact.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-4 flex items-center gap-4"
                >
                  <div className={cn('w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center flex-shrink-0', contact.color)}>
                    <contact.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{contact.title}</p>
                    <p className="text-xs text-foreground">{contact.info}</p>
                    <p className="text-[10px] text-muted-foreground">{contact.subtitle}</p>
                  </div>
                </motion.div>
              ))}

              {/* Operating hours */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="glass-card p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-semibold">Jam Operasional</h3>
                </div>
                <div className="space-y-1.5 text-xs text-muted-foreground">
                  <div className="flex justify-between"><span>Live Chat</span><span className="text-green-500 font-medium">24/7</span></div>
                  <div className="flex justify-between"><span>Email Support</span><span>24/7 (respon 1x24 jam)</span></div>
                  <div className="flex justify-between"><span>Telepon</span><span>24/7</span></div>
                  <div className="flex justify-between"><span>Kantor</span><span>Senin-Jumat 09:00-18:00</span></div>
                </div>
              </motion.div>
            </div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <form onSubmit={handleSubmit} className="glass-card p-5 tablet:p-6 space-y-4">
                <h2 className="text-base font-semibold mb-1">Kirim Pesan</h2>
                <p className="text-xs text-muted-foreground mb-4">Isi formulir di bawah ini dan kami akan segera merespons</p>

                <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Nama</label>
                    <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nama lengkap" className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Email</label>
                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@contoh.com" className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Subjek</label>
                  <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Tentang apa?" className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Pesan</label>
                  <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tulis pesan kamu di sini..." rows={5} className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none" required />
                </div>
                <button type="submit" disabled={isSending} className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl gradient-primary text-white font-semibold hover:shadow-neon-violet transition-all disabled:opacity-70">
                  {isSending ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Mengirim...</>
                  ) : (
                    <><Send className="w-4 h-4" /> Kirim Pesan</>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
      <MobileNav />
    </>
  );
}
