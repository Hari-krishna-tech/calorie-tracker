import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session";

const publicPaths = ["/login", "/api/auth"];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isPublic = publicPaths.some((p) => path.startsWith(p));

  const cookie = req.cookies.get("session")?.value;
  const session = await decrypt(cookie);

  if (!session?.userId && !isPublic) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (session?.userId && path === "/login") {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js).*)"],
};
