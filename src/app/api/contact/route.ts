import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/../auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter').max(100),
  email: z.string().email('Format email tidak valid'),
  subject: z.string().min(3, 'Subjek minimal 3 karakter').max(200),
  message: z.string().min(10, 'Pesan minimal 10 karakter').max(2000),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = parsed.data;
    const session = await auth();
    const ticketId = `TKT-${Date.now().toString().slice(-6)}`;

    // Persist contact message to database
    let userId: string | undefined = undefined;
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
      });
      userId = user?.id;
    }

    await prisma.chatMessage.create({
      data: {
        userId,
        sender: `${name} (${email})`,
        message: `[${subject}] ${message}`,
        sessionId: ticketId,
        isBot: false,
      },
    });

    // If logged in, create an in-app confirmation notification for the user
    if (userId) {
      await prisma.notification.create({
        data: {
          userId,
          title: `Tiket Bantuan ${ticketId} Diterima`,
          message: `Pesan Anda perihal "${subject}" telah diterima oleh tim Nexa Support. Kami akan merespons via email dalam < 15 menit.`,
          type: 'info',
        },
      });
    }

    return NextResponse.json(
      {
        success: true,
        ticketId,
        message: `Tiket bantuan #${ticketId} berhasil dibuat dan dikirimkan ke tim support.`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { message: 'Gagal mengirim tiket bantuan. Silakan coba lagi.' },
      { status: 500 }
    );
  }
}
