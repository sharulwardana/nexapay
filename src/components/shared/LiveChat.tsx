'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { MessageCircle, X, Send, Bot, Minus, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: Date;
}

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: 'Halo! 👋 Saya NexaBot, asisten virtual NexaPay. Ada yang bisa saya bantu hari ini?',
      time: new Date(),
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isShrunk, setIsShrunk] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 80) {
      setIsShrunk(true);
    } else if (latest < previous || latest < 40) {
      setIsShrunk(false);
    }
  });



  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userText = input.trim();
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      time: new Date(),
    };
    
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const apiMessages = newMessages.map(msg => ({
        role: msg.sender,
        content: msg.text
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = await res.json();
      
      if (data.content) {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: data.content,
          time: new Date(),
        }]);
      } else {
        throw new Error('No content returned');
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: 'Maaf, saya sedang mengalami gangguan koneksi. Silakan coba beberapa saat lagi! 🔧',
        time: new Date(),
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickActions = ['Cara top up', 'Promo terbaru', 'Transaksi gagal', 'Metode payment'];

  return (
    <>
      {/* Compact Circular FAB Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ 
              scale: 1,
              y: [0, -5, 0],
            }}
            transition={{ 
              scale: { type: 'spring', stiffness: 350, damping: 30 },
              y: { repeat: Infinity, duration: 3.5, ease: 'easeInOut' }
            }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className={cn(
              "fixed z-40 rounded-full bg-brand-500 hover:bg-brand-600 text-white shadow-[0_4px_20px_rgba(255,115,0,0.35)] hover:shadow-[0_6px_25px_rgba(255,115,0,0.5)] transition-all duration-200 flex items-center justify-center cursor-pointer",
              isShrunk 
                ? "bottom-[74px] right-2 w-9 h-9 xs:w-10 xs:h-10 opacity-85 scale-90" 
                : "bottom-[80px] right-2 xs:right-3 w-9 h-9 xs:w-11 xs:h-11 opacity-100",
              "tablet:bottom-6 tablet:right-6 tablet:w-14 tablet:h-14 tablet:opacity-100 tablet:scale-100"
            )}
            aria-label="Buka Chat CS"
          >
            <MessageCircle className="w-5 h-5 text-white" />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0B0E14] animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Expanded Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="fixed z-50 bg-[#121620] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col bottom-[88px] right-4 left-4 tablet:bottom-6 tablet:right-6 tablet:left-auto w-[calc(100vw-32px)] tablet:w-[380px] h-[500px] max-h-[calc(100vh-110px)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#181E2B]/90 backdrop-blur-md flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-brand-500/15 border border-brand-500/25 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-brand-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground font-heading leading-tight">NexaBot CS</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-[10px] text-muted-foreground">Siap Membantu 24/7</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <a
                  href="https://wa.me/6281234567890?text=Halo%20CS%20NexaPay!%20Saya%20butuh%20bantuan."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#25D366] text-white text-[10px] font-bold hover:bg-[#20BD5A] transition-colors"
                >
                  WhatsApp
                </a>
                <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors" aria-label="Minimize">
                  <Minus className="w-4 h-4" />
                </button>
                <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors" aria-label="Close">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn('flex', msg.sender === 'user' ? 'justify-end' : 'justify-start')}
                >
                  <div className={cn(
                    'max-w-[82%] px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm',
                    msg.sender === 'user'
                      ? 'bg-brand-500 text-white rounded-br-xs shadow-sm'
                      : 'bg-[#181E2B] text-foreground rounded-bl-xs border border-white/5'
                  )}>
                    {msg.sender === 'bot' && (
                      <div className="flex items-center gap-1 mb-1">
                        <Sparkles className="w-3 h-3 text-brand-400" />
                        <span className="text-[10px] font-bold text-brand-400">NexaBot</span>
                      </div>
                    )}
                    <p className="leading-relaxed text-[12.5px] sm:text-[13px]">{msg.text}</p>
                    <p className={cn(
                      'text-[9px] mt-1',
                      msg.sender === 'user' ? 'text-white/70' : 'text-muted-foreground'
                    )}>
                      {mounted ? msg.time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                    </p>
                  </div>
                </motion.div>
              ))}
          
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex gap-1.5 items-center bg-[#181E2B] border border-white/5 px-3 py-2 rounded-2xl rounded-tl-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
          
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {messages.length <= 2 && (
              <div className="px-4 pb-2 flex gap-1.5 overflow-x-auto no-scrollbar">
                {quickActions.map((action) => (
                  <button
                    key={action}
                    onClick={() => { setInput(action); setTimeout(() => { const form = document.querySelector('[data-chat-form]') as HTMLFormElement; form?.requestSubmit(); }, 50); }}
                    className="flex-shrink-0 px-2.5 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-[11px] font-medium hover:bg-brand-500/20 transition-colors"
                  >
                    {action}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-white/10 bg-[#181E2B]/60 flex-shrink-0">
              <form
                data-chat-form
                onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ketik pertanyaan kamu..."
                  className="flex-1 px-3 py-2 rounded-xl bg-[#0B0E14] border border-white/10 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 transition-all"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="p-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white disabled:opacity-40 transition-all cursor-pointer flex-shrink-0"
                  aria-label="Kirim pesan"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
