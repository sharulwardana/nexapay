'use server';

import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';

export async function loginWithCredentials(credentials: { email: string; password: string }) {
  try {
    await signIn('credentials', {
      email: credentials.email,
      password: credentials.password,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { success: false, error: 'Email atau password salah. Silakan periksa kembali!' };
        default:
          return { success: false, error: 'Terjadi kesalahan saat autentikasi. Coba lagi.' };
      }
    }

    // Next.js redirect mechanism throws a special internal error on success/redirect
    if (
      error &&
      typeof error === 'object' &&
      'digest' in error &&
      String((error as { digest?: string }).digest).startsWith('NEXT_REDIRECT')
    ) {
      return { success: true };
    }

    const message = error instanceof Error ? error.message : 'Email atau password salah.';
    if (message.includes('CredentialsSignin')) {
      return { success: false, error: 'Email atau password salah. Silakan periksa kembali!' };
    }

    return { success: false, error: message };
  }
}

export async function logoutUser() {
  await signOut({ redirectTo: '/' });
}
