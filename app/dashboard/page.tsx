import { requireAuth } from "@/lib/auth";
import { signOut } from "@/app/actions/auth";

export default async function DashboardPage() {
  const user = await requireAuth();

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Dashboard</h1>
      <p>Logado como {user.email}</p>
      <form action={signOut}>
        <button type="submit">Sair</button>
      </form>
    </main>
  );
}
