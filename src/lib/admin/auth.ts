import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/admin/session";

export async function getCurrentSeller(): Promise<string | null> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

export async function requireSeller(): Promise<string> {
  const seller = await getCurrentSeller();
  if (!seller) redirect("/admin/login");
  return seller;
}