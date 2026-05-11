import { AppLayoutClient } from "./layout-client";
import { requireAuth } from "@/lib/supabase/session";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAuth();
  const initials = (user.email ?? "?").split("@")[0].slice(0, 2).toUpperCase();

  return (
    <AppLayoutClient initials={initials} email={user.email ?? ""}>
      {children}
    </AppLayoutClient>
  );
}
