import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
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

/**
 * Intelligent local fallback when Gemini is rate-limited or API key is unconfigured
 */
function getLocalFaqResponse(userQuery: string): string {
  const query = userQuery.toLowerCase();

  if (query.includes('cara top up') || query.includes('cara beli') || query.includes('langkah')) {
    return "Cara top up di NexaPay gampang banget, Sob! 🎮\n1. Pilih game favorit kamu di katalog.\n2. Masukkan User ID & Server ID game kamu.\n3. Pilih nominal diamond / koin yang diinginkan.\n4. Pilih metode pembayaran (QRIS, Nexa Wallet, Transfer Bank, E-Wallet, atau Alfamart/Indomaret).\n5. Selesaikan pembayaran, item langsung masuk dalam hitungan detik!";
  }

  if (query.includes('promo') || query.includes('voucher') || query.includes('diskon')) {
    return "🔥 Promo Aktif NexaPay Hari Ini:\n- Gunakan kode **NEXAGAMER** untuk diskon 10% transaksi pertamamu!\n- Ada Flash Sale harian dengan potongan hingga 40% di halaman utama.\n- Setiap transaksi juga menghasilkan Poin Loyalty yang bisa ditukar saldo!";
  }

  if (query.includes('metode') || query.includes('bayar') || query.includes('payment') || query.includes('qris')) {
    return "NexaPay mendukung berbagai metode pembayaran instan:\n✨ QRIS (BCA, GoPay, OVO, DANA, ShopeePay, LinkAja)\n🏦 Virtual Account BCA, Mandiri, BNI, BRI, Permata\n💳 Saldo NexaPay Wallet (Bebas Biaya Admin + Diskon Tier)\n🏪 Gerai Retail Alfamart & Indomaret 24/7";
  }

  if (query.includes('gagal') || query.includes('pending') || query.includes('belum masuk') || query.includes('kendala')) {
    return "Jangan khawatir, Sob! Jika transaksi kamu berstatus pending atau item belum masuk:\n1. Cek No. Invoice kamu di menu Lacak Transaksi.\n2. Pastikan nominal transfer sesuai sampai 3 digit terakhir.\n3. Jika dalam 10 menit belum masuk, segera hubungi tim CS via WhatsApp resmi kami di tombol kontak admin dengan menyertakan Nomor Invoice.";
  }

  if (query.includes('wallet') || query.includes('saldo')) {
    return "NexaPay Wallet adalah dompet digital khusus gamer! Keuntungannya:\n- Checkout 1-klik tanpa scan QR\n- 0% Biaya Admin\n- Cashback poin setiap transaksi & diskon eksklusif tier VIP!";
  }

  return "Halo Gamer! Aku **Nexa**, asisten AI virtual NexaPay ⚡. Mau top-up game apa hari ini? Kamu bisa tanya tentang status transaksi, rekomendasi paket promo, atau cara bayar. Ada yang bisa kubantu?";
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    const clientIp = req.headers.get('x-forwarded-for') || 'anon';
    const isGuest = !session?.user?.id;
    const rateKey = isGuest ? `chat_guest_${clientIp}` : `chat_user_${session?.user?.id}`;

    // Rate limit: 8 messages/min for guests, 15 messages/min for logged-in users
    try {
      await limiter.check(isGuest ? 8 : 15, rateKey);
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
    const latestMessage = sanitizeInput(messages[messages.length - 1].content);

    const genAI = getGenAI();
    if (!genAI) {
      return NextResponse.json({
        role: "assistant",
        content: getLocalFaqResponse(latestMessage)
      });
    }

    // Limit history to last 16 messages
    const recentMessages = messages.slice(-16);

    const history = [
      {
        role: "user" as const,
        parts: [{
          text: "System Instruction: Kamu adalah 'Nexa', asisten virtual cerdas NexaPay — platform top-up game dan produk digital nomor 1 paling cepat & terpercaya. Karakter: Ramah, gaul ala gamer Indonesia, solutif, singkat, padat, dan jelas. Selalu bantu gamer dengan info promo, cara top up, panduan pembayaran (QRIS/Wallet), dan solusi kendala transaksi."
        }]
      },
      {
        role: "model" as const,
        parts: [{
          text: "Siap, Sob! Gue Nexa, asisten resmi NexaPay. Ada game yang mau di-topup atau ada kendala transaksi yang mau dicek bareng?"
        }]
      },
      ...recentMessages.slice(0, -1).map((m) => ({
        role: (m.role === "user" ? "user" : "model") as "user" | "model",
        parts: [{ text: sanitizeInput(m.content) }]
      }))
    ];

    const apiKey = process.env.GEMINI_API_KEY;
    let responseText: string | null = null;

    if (apiKey) {
      // 1. Try modern Gemini models via direct Google Generative Language v1beta REST API
      const modelsToTry = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];
      
      const contents = [
        ...history.map((h) => ({
          role: h.role === "user" ? "user" : "model",
          parts: h.parts,
        })),
        {
          role: "user",
          parts: [{ text: latestMessage }],
        },
      ];

      for (const modelName of modelsToTry) {
        try {
          const apiVer = modelName.includes("1.5") ? "v1beta" : "v1";
          const res = await fetch(
            `https://generativelanguage.googleapis.com/${apiVer}/models/${modelName}:generateContent?key=${apiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ contents }),
              signal: AbortSignal.timeout(10000),
            }
          );

          if (res.ok) {
            const data = await res.json();
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              responseText = text;
              break;
            }
          }
        } catch (err: any) {
          console.warn(`[AIChat] Fetch to ${modelName} encountered issue:`, err?.message || err);
        }
      }

      // 2. Fallback to SDK with standard gemini-pro if needed
      if (!responseText && genAI) {
        try {
          const model = genAI.getGenerativeModel({ model: "gemini-pro" });
          const chat = model.startChat({ history });
          const result = await chat.sendMessage(latestMessage);
          responseText = result.response.text();
        } catch (err: any) {
          console.warn("[AIChat] SDK fallback error:", err?.message || err);
        }
      }
    }

    if (!responseText) {
      responseText = getLocalFaqResponse(latestMessage);
    }

    return NextResponse.json({ role: "assistant", content: responseText });
  } catch (error: unknown) {
    console.error("[AIChat] Error handling chat message:", error);
    return NextResponse.json({
      role: "assistant",
      content: "Maaf Sob, server Nexa AI sedang sibuk memproses antrian. Tapi jangan khawatir, kamu bisa langsung pilih menu cepat di bawah atau hubungi Admin via WhatsApp ya! 🎮"
    });
  }
}
