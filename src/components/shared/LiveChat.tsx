'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
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
  const pathname = usePathname();
  const isTopUpDetailPage = pathname?.startsWith('/topup/') && pathname.split('/').length > 2;

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
    setMounted(true);
  }, []);

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
              y: isMobile ? (isShrunk ? 16 : 0) : 0
            }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-[96px] right-4 tablet:bottom-6 tablet:right-6 z-40 w-12 h-12 tablet:w-14 tablet:h-14 rounded-full bg-primary text-white shadow-elevated hover:shadow-lg hover:scale-105 transition-shadow duration-200 flex items-center justify-center"
            aria-label="Open Chat"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Expanded Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed z-50 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col bottom-[84px] right-4 left-4 tablet:bottom-6 tablet:right-6 tablet:left-auto w-[calc(100vw-32px)] tablet:w-[380px] h-[500px] max-h-[calc(100vh-120px)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">NexaBot AI</p>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-[10px] text-muted-foreground">Online 24/7</span>
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
                  WhatsApp CS
                </a>
                <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg hover:bg-muted transition-colors" aria-label="Minimize">
                  <Minus className="w-4 h-4 text-muted-foreground" />
                </button>
                <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg hover:bg-muted transition-colors" aria-label="Close">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn('flex', msg.sender === 'user' ? 'justify-end' : 'justify-start')}
                >
                  <div className={cn(
                    'max-w-[80%] px-3 py-2 rounded-2xl text-sm',
                    msg.sender === 'user'
                      ? 'bg-primary text-white rounded-br-md'
                      : 'bg-muted text-foreground rounded-bl-md'
                  )}>
                    {msg.sender === 'bot' && (
                      <div className="flex items-center gap-1 mb-0.5">
                        <Sparkles className="w-3 h-3 text-primary" />
                        <span className="text-[10px] font-medium text-primary">NexaBot</span>
                      </div>
                    )}
                    <p className="leading-relaxed text-[13px]">{msg.text}</p>
                    <p className={cn(
                      'text-[9px] mt-1',
                      msg.sender === 'user' ? 'text-white/60' : 'text-muted-foreground'
                    )}>
                      {mounted ? msg.time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                    </p>
                  </div>
                </motion.div>
              ))}
          
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex gap-2 items-center bg-card border border-border p-3 rounded-2xl rounded-tl-none shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
          
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {messages.length <= 2 && (
              <div className="px-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
                {quickActions.map((action) => (
                  <button
                    key={action}
                    onClick={() => { setInput(action); }}
                    className="flex-shrink-0 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-[11px] font-medium hover:bg-primary/20 transition-colors"
                  >
                    {action}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-border flex-shrink-0">
              <form
                onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ketik pesan..."
                  className="flex-1 px-3 py-2.5 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="p-2.5 rounded-xl bg-primary text-white disabled:opacity-50 transition-all hover:bg-primary/90"
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
