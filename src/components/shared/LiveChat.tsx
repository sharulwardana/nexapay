'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Minus, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: Date;
}

// Removed hardcoded botResponses and getBotResponse in favor of AI API

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
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
      // Prepare history for API
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
      {/* FAB Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-24 right-4 tablet:bottom-6 tablet:right-6 z-50 w-12 h-12 rounded-full bg-primary text-white shadow-elevated hover:shadow-lg transition-all flex items-center justify-center"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={cn(
              'fixed z-50 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col',
              'bottom-24 right-4 left-4 tablet:bottom-6 tablet:right-6 tablet:left-auto',
              'tablet:w-[380px]',
              isMinimized ? 'h-14' : 'h-[500px] max-h-[80vh]'
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">NexaBot</p>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-[10px] text-muted-foreground">Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setIsMinimized(!isMinimized)} className="p-1.5 rounded-lg hover:bg-muted transition-colors" aria-label="Minimize">
                  <Minus className="w-4 h-4 text-muted-foreground" />
                </button>
                <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg hover:bg-muted transition-colors" aria-label="Close">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
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
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
