import { NextRequest, NextResponse } from 'next/server';
import { checkGameNickname } from '@/lib/vip-reseller';
import rateLimit from '@/lib/rateLimit';

const limiter = rateLimit({
  interval: 60000, // 1 minute
  uniqueTokenPerInterval: 300,
});

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'anon';
    try {
      await limiter.check(30, ip);
    } catch {
      return NextResponse.json({ error: 'Terlalu banyak permintaan. Silakan tunggu sebentar.' }, { status: 429 });
    }

    const body = await req.json().catch(() => ({}));
    const { slug, gameSlug, userId, zoneId } = body;

    const targetSlug = slug || gameSlug;

    if (!targetSlug || !userId) {
      return NextResponse.json({ error: 'Parameter game dan User ID wajib diisi.' }, { status: 400 });
    }

    const result = await checkGameNickname({
      gameSlug: targetSlug,
      userId: String(userId),
      zoneId: zoneId ? String(zoneId) : undefined,
    });

    if (!result.success) {
      return NextResponse.json({
        success: false,
        message: result.message || 'Akun game tidak ditemukan atau format belum lengkap.',
      }, { status: 200 });
    }

    return NextResponse.json({
      success: true,
      nickname: result.nickname,
      region: result.region,
      game: result.game,
      source: result.source,
    });
  } catch (error: any) {
    console.error('Check nickname error:', error);
    return NextResponse.json({
      success: false,
      message: 'Gagal memverifikasi akun game. Silakan periksa kembali ID Anda.',
    }, { status: 500 });
  }
}
