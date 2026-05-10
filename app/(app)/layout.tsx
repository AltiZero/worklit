import { requireAuth } from "@/lib/supabase/session";
import { Sidebar } from "@/components/dashboard/sidebar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAuth();
  const initials = (user.email ?? "?").split("@")[0].slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-bg flex">
      <Sidebar initials={initials} email={user.email ?? ""} />
      <div className="flex-1 min-w-0 flex flex-col">
        <main className="flex-1 p-[22px] flex flex-col gap-[18px]">
          {children}
        </main>
      </div>
    </div>
  );
}
