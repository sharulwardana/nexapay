import { redirect } from 'next/navigation';
import { auth } from '@/../auth';
import prisma from '@/lib/prisma';
import ReferralClient from './ReferralClient';

export const metadata = {
  title: 'Referral Program',
};

export default async function ReferralPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  // Fetch user data for referral code
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { referralCode: true }
  });

  // Fetch referrals given by this user
  const referrals = await prisma.referral.findMany({
    where: { referrerId: session.user.id },
    include: {
      referee: {
        select: { name: true, email: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const totalReferrals = referrals.length;
  const totalEarned = referrals.reduce((sum, ref) => sum + ref.bonus, 0);

  const history = referrals.map(r => ({
    id: r.id,
    name: r.referee.name || r.referee.email || 'Teman',
    date: r.createdAt.toISOString(),
    bonus: r.bonus,
    status: r.status,
  }));

  return (
    <ReferralClient 
      code={user?.referralCode || null}
      totalEarned={totalEarned}
      totalReferrals={totalReferrals}
      history={history}
    />
  );
}
