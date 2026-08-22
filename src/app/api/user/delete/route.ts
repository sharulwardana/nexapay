import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/../auth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const deleteAccountSchema = z.object({
  password: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const parsed = deleteAccountSchema.safeParse(body);
    const password = parsed.success ? parsed.data.password : undefined;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ message: 'Pengguna tidak ditemukan' }, { status: 404 });
    }

    // If user has password set (credential account), require password validation
    if (user.password) {
      if (!password) {
        return NextResponse.json({ message: 'Password konfirmasi wajib diisi untuk menghapus akun' }, { status: 400 });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return NextResponse.json({ message: 'Password konfirmasi salah' }, { status: 400 });
      }
    }

    // Delete user and all associated data
    await prisma.user.delete({
      where: { id: user.id },
    });

    return NextResponse.json({ message: 'Akun berhasil dihapus' }, { status: 200 });
  } catch (error) {
    console.error('Delete account error:', error);
    return NextResponse.json({ message: 'Gagal menghapus akun' }, { status: 500 });
  }
}
