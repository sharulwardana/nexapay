import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/../auth';
import { sendPushToUser, sendDirectPush } from '@/lib/push';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json().catch(() => ({}));

    // If subscription object is passed directly
    if (body.subscription && body.subscription.endpoint) {
      const result = await sendDirectPush(body.subscription, {
        title: 'NexaPay — Notifikasi Aktif! ⚡',
        body: 'Selamat! Notifikasi real-time transaksi berhasil terhubung ke perangkat ini.',
        icon: '/favicon.ico',
        url: '/dashboard',
        tag: 'test-push',
      });

      if (!result.success) {
        return NextResponse.json({ error: result.error || 'Gagal mengirim notifikasi langsung' }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: 'Test notification sent directly' });
    }

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Harap login untuk mengirim tes notifikasi' }, { status: 401 });
    }

    const result = await sendPushToUser(session.user.id, {
      title: 'NexaPay — Notifikasi Aktif! ⚡',
      body: 'Selamat! Notifikasi real-time transaksi berhasil terhubung ke perangkat ini.',
      icon: '/favicon.ico',
      url: '/dashboard',
      tag: 'test-push',
    });

    if (result.sentCount === 0) {
      return NextResponse.json({
        success: false,
        message: 'Tidak ada perangkat terdaftar untuk akun ini. Silakan aktifkan izin notifikasi di browser terlebih dahulu.',
      });
    }

    return NextResponse.json({
      success: true,
      message: `Notifikasi terkirim ke ${result.sentCount} perangkat.`,
    });
  } catch (error: any) {
    console.error('Test push error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
