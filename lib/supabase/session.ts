import { redirect } from "next/navigation";

import { createClient } from "./server";

export async function requireAuth() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/login");
  }

  return data.user;
}
