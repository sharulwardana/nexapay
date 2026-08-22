import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/../auth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const settingsSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  image: z.string().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8, 'Password baru minimal 8 karakter').max(100).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    // Validate input
    const parsed = settingsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ message: parsed.error.errors[0].message }, { status: 400 });
    }

    const { name, image, currentPassword, newPassword } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Prepare update data
    const updateData: Record<string, string> = {};

    if (name && name !== user.name) {
      updateData.name = name;
    }

    if (image && image !== user.image) {
      updateData.image = image;
    }

    // If attempting to change password
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ message: 'Password saat ini wajib diisi' }, { status: 400 });
      }

      if (!user.password) {
        return NextResponse.json({ message: 'Akun ini menggunakan login sosial, tidak bisa ubah password' }, { status: 400 });
      }

      // Compare with bcrypt
      const isCurrentValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentValid) {
        return NextResponse.json({ message: 'Password saat ini salah' }, { status: 400 });
      }

      // Hash new password
      updateData.password = await bcrypt.hash(newPassword, 12);
    }

    // Only update if there are changes
    if (Object.keys(updateData).length > 0) {
      await prisma.user.update({
        where: { id: user.id },
        data: updateData,
      });
    }

    return NextResponse.json({ message: 'Profil berhasil diperbarui' }, { status: 200 });
  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan internal' }, { status: 500 });
  }
}
