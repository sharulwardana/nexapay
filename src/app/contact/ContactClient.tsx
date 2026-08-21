'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, ShieldCheck, Cpu, Signal, CheckCircle2, Sparkles } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function ContactClient() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      toast.success('Dispatched to Nexa Support Team! Tiket respon telah dibuat.');
      setForm({ name: '', email: '', subject: '', message: '' });
    }, 1200);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 tablet:pt-32 pb-24 relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="container-app max-w-5xl relative z-10">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10 tablet:mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 backdrop-blur-md mb-4 shadow-sm">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[11px] font-bold tracking-widest text-cyan-400 uppercase font-heading">Nexa Command Center 24/7</span>
            </div>
            <h1 className="heading-1 mb-3">
              Koneksi Langsung ke <br className="hidden sm:block" />
              <span className="gradient-text">Tim Support Nexa</span>
            </h1>
            <p className="body-default max-w-xl mx-auto text-muted-foreground">
              Infrastruktur bantuan dengan latensi terendah. Kendala transaksi, kemitraan API, atau pertanyaan diproses secara instan oleh teknisi kami.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Direct Telemetry Badges */}
            <div className="space-y-4">
              {/* Telemetry Status Card */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="p-5 rounded-2xl bg-card/60 border border-border backdrop-blur-xl shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-border/50">
                  <div className="flex items-center gap-2">
                    <Signal className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold font-heading uppercase tracking-wider">System Telemetry</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold border border-emerald-500/30">ONLINE</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-left">
                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <p className="text-[10px] text-muted-foreground">Avg. Response Time</p>
                    <p className="text-sm font-bold text-emerald-400 font-heading">⚡ 48 Detik</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <p className="text-[10px] text-muted-foreground">CS Resolution Rate</p>
                    <p className="text-sm font-bold text-cyan-400 font-heading">🎯 99.8%</p>
                  </div>
                </div>
              </motion.div>

              {[
                { icon: MessageCircle, title: 'Live Priority Chat', info: 'Respon Kilat CS', subtitle: 'Rata-rata balasan < 1 menit', color: 'from-emerald-500 to-teal-600', badge: 'Tercepat' },
                { icon: Mail, title: 'Official Email', info: 'support@nexapay.id', subtitle: 'Penyelesaian masalah teknis & refund', color: 'from-cyan-500 to-blue-600' },
                { icon: Phone, title: 'Call Center Hotline', info: '0800-123-4567', subtitle: 'Bebas pulsa 24 jam nonstop', color: 'from-violet-500 to-purple-600' },
                { icon: MapPin, title: 'Headquarter', info: 'Nexa Tower Cyber Hub', subtitle: 'Jakarta Selatan, Indonesia', color: 'from-amber-500 to-orange-600' },
              ].map((contact, i) => (
                <motion.div
                  key={contact.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="p-4 rounded-2xl bg-card/40 border border-border/80 hover:border-primary/50 backdrop-blur-md transition-all duration-300 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className={cn('w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-md flex-shrink-0 group-hover:scale-105 transition-transform', contact.color)}>
                      <contact.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold font-heading">{contact.title}</p>
                        {contact.badge && (
                          <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-bold uppercase">{contact.badge}</span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-foreground mt-0.5">{contact.info}</p>
                      <p className="text-[10px] text-muted-foreground">{contact.subtitle}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Cyber Terminal Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <form onSubmit={handleSubmit} className="p-6 tablet:p-8 rounded-3xl bg-card/60 border border-border/80 backdrop-blur-2xl shadow-2xl relative space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <h2 className="text-base tablet:text-lg font-bold font-heading">Kirim Dispatch Support</h2>
                    <p className="text-xs text-muted-foreground">Isi parameter data di bawah ini untuk memulai enkripsi tiket</p>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] sm:text-xs font-bold font-heading self-start sm:self-auto">
                    <Sparkles className="w-3.5 h-3.5" /> High Priority Ticket
                  </div>
                </div>

                <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 font-heading">Nama Lengkap</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Masukkan nama kamu"
                      className="w-full px-4 py-3 rounded-xl bg-muted/40 border border-border/80 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 font-heading">Alamat Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="email@domain.com"
                      className="w-full px-4 py-3 rounded-xl bg-muted/40 border border-border/80 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 font-heading">Subjek Kendala / Nomor Invoice</label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="Contoh: Kendala Top-Up MLBB #INV-92811"
                    className="w-full px-4 py-3 rounded-xl bg-muted/40 border border-border/80 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 font-heading">Detail Pesan / Rincian Kendala</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Jelaskan kendala atau pertanyaan kamu secara rinci..."
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl bg-muted/40 border border-border/80 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl gradient-primary text-white font-bold font-heading hover:shadow-neon-orange hover:opacity-95 transition-all disabled:opacity-70 cursor-pointer"
                >
                  {isSending ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Mengenkripsi & Mengirim Dispatch...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Dispatch Ticket Now
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
