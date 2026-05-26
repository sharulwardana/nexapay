import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// We'll use a placeholder key if not provided, though it will error on use without a real key.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy_key");

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        role: "assistant",
        content: "Halo! Saat ini sistem AI kami sedang dalam mode pemeliharaan (API Key belum di-setup). Silakan hubungi admin di WhatsApp untuk bantuan lebih lanjut."
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Prepare history for the model (injecting system instructions as first context)
    const history = [
      { role: "user", parts: [{ text: "System Instruction: Kamu adalah 'Nexa', asisten virtual pintar untuk NexaPay (platform top up game termurah di Indonesia). Jawab pertanyaan pengguna dengan ramah, bergaya bahasa gamer, santai tapi profesional. NexaPay melayani top up Mobile Legends, Free Fire, Genshin Impact, dll dengan harga miring dan proses instan. Mengerti?" }] },
      { role: "model", parts: [{ text: "Mengerti! Saya Nexa siap membantu para gamer top-up dengan cepat dan murah. Ada yang bisa dibantu?" }] },
      ...messages.slice(0, -1).map((m: any) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }]
      }))
    ];
    const latestMessage = messages[messages.length - 1].content;

    const chat = model.startChat({
      history,
    });

    const result = await chat.sendMessage(latestMessage);
    const text = result.response.text();

    return NextResponse.json({ role: "assistant", content: text });
  } catch (error) {
    console.error("AI Chat Error:", error);
    return NextResponse.json(
      { error: "Gagal menghubungkan ke layanan AI." },
      { status: 500 }
    );
  }
}
