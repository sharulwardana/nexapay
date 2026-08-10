import { redirect } from 'next/navigation';
import { auth } from '@/../auth';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white overflow-hidden selection:bg-violet-500/30">
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/10 blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-600/10 blur-[150px]" />
      </div>

      {/* Shared Sidebar — only rendered ONCE, persists across all admin pages */}
      <AdminSidebar adminUser={session.user} />

      {/* Main Content Area — only this part changes per page */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {children}
      </div>
    </div>
  );
}
