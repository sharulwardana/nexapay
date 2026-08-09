import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { auth } from "@/../auth";
import rateLimit from "@/lib/rateLimit";
import { z } from "zod";
import { sanitizeInput } from "@/lib/sanitize";

// Lazy initialization — only create when API key is available
let _genAI: GoogleGenerativeAI | null = null;
function getGenAI() {
  if (!_genAI && process.env.GEMINI_API_KEY) {
    _genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return _genAI;
}

const limiter = rateLimit({
  interval: 60000,
  uniqueTokenPerInterval: 500,
});

// Accept "bot" from LiveChat component — it sends msg.sender which is "user" | "bot"
const chatMessageSchema = z.object({
  role: z.enum(["user", "bot", "assistant"]),
  content: z.string().min(1, "Pesan tidak boleh kosong").max(2000, "Pesan terlalu panjang"),
});

const chatRequestSchema = z.object({
  messages: z.array(chatMessageSchema).min(1, "Minimal 1 pesan").max(50, "Terlalu banyak pesan"),
});

export async function POST(req: Request) {
  try {
    // Require authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Login diperlukan untuk menggunakan chat.' }, { status: 401 });
    }

    // Rate limit: 10 messages per minute per user
    try {
      await limiter.check(10, `chat_${session.user.id}`);
    } catch {
      return NextResponse.json({
        role: "assistant",
        content: "Kamu terlalu sering mengirim pesan. Tunggu sebentar ya! ⏳"
      });
    }

    const body = await req.json();

    // Validate input with Zod
    const parsed = chatRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({
        role: "assistant",
        content: "Format pesan tidak valid. Silakan coba lagi."
      });
    }

    const { messages } = parsed.data;
    
    const genAI = getGenAI();
    if (!genAI) {
      return NextResponse.json({
        role: "assistant",
        content: "Halo! Saat ini sistem AI kami sedang dalam mode pemeliharaan (API Key belum di-setup). Silakan hubungi admin di WhatsApp untuk bantuan lebih lanjut."
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Limit history to last 20 messages to prevent unbounded payload
    const recentMessages = messages.slice(-20);

    // Map roles: "user" stays "user", "bot"/"assistant" become "model" for Gemini
    const history = [
      { role: "user" as const, parts: [{ text: "System Instruction: Kamu adalah 'Nexa', asisten virtual pintar untuk NexaPay (platform top up game termurah di Indonesia). Jawab pertanyaan pengguna dengan ramah, bergaya bahasa gamer, santai tapi profesional. NexaPay melayani top up Mobile Legends, Free Fire, Genshin Impact, dll dengan harga miring dan proses instan. Mengerti?" }] },
      { role: "model" as const, parts: [{ text: "Mengerti! Saya Nexa siap membantu para gamer top-up dengan cepat dan murah. Ada yang bisa dibantu?" }] },
      ...recentMessages.slice(0, -1).map((m) => ({
        role: (m.role === "user" ? "user" : "model") as "user" | "model",
        parts: [{ text: sanitizeInput(m.content) }]
      }))
    ];
    const latestMessage = sanitizeInput(recentMessages[recentMessages.length - 1].content);

    const chat = model.startChat({
      history,
    });

    const result = await chat.sendMessage(latestMessage);
    const text = result.response.text();

    return NextResponse.json({ role: "assistant", content: text });
  } catch (error: unknown) {
    console.error("AI Chat Error:", error);
    return NextResponse.json(
      { role: "assistant", content: "Maaf, terjadi gangguan pada sistem chat. Silakan coba lagi nanti." },
      { status: 500 }
    );
  }
}
