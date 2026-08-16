import { AUTH_COOKIE, verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }) {
  const cookieStore = await cookies();
  const user = verifyToken(cookieStore.get(AUTH_COOKIE)?.value);

  if (!user) redirect("/login");

  return children;
}
