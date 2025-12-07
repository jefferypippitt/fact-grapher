import { headers } from "next/headers";
import { auth } from "./auth";

export async function getServerSession() {
  const headerStore = await headers();
  const session = await auth.api.getSession({
    headers: headerStore,
  });
  return session;
}

export async function requireAuth() {
  const session = await getServerSession();
  if (!session?.user) {
    return null;
  }
  return session;
}

