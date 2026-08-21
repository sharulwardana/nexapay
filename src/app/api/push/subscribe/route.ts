import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/../auth';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id || null;

    const body = await req.json();
    const { endpoint, keys } = body;

    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return NextResponse.json({ error: 'Invalid subscription payload' }, { status: 400 });
    }

    const subscription = await prisma.pushSubscription.upsert({
      where: { endpoint },
      update: {
        userId: userId || undefined,
        p256dh: keys.p256dh,
        auth: keys.auth,
        updatedAt: new Date(),
      },
      create: {
        userId,
        endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
      },
    });

    return NextResponse.json({ success: true, id: subscription.id });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    console.error('Push subscription error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { endpoint } = body;

    if (!endpoint) {
      return NextResponse.json({ error: 'Endpoint is required' }, { status: 400 });
    }

    await prisma.pushSubscription.deleteMany({
      where: { endpoint },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    console.error('Push unsubscribe error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
