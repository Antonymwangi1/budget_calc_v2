import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const isProd = process.env.NODE_ENV === "production";

export async function GET() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value;

  if (!sessionId) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const now = new Date();

  // Load session + user
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: true },
  });

  // If no session record OR expired → clear cookie + 401
  if (!session || session.expireAt <= now) {
    if (session) {
      // remove this expired session row (ignore errors)
      await prisma.session.delete({ where: { id: sessionId } }).catch(() => {});
    }

    const res = NextResponse.json({ authenticated: false }, { status: 401 });

    // Clear client cookie
    res.cookies.set({
      name: "session_id",
      value: "",
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    // Opportunistic global sweep (non-blocking)
    prisma.session
      .deleteMany({ where: { expireAt: { lt: now } } })
      .catch(() => {});

    return res;
  }

  // Session valid
  const res = NextResponse.json({
    authenticated: true,
    user: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
    },
  });

  // Prevent caching by intermediaries (optional but helpful)
  res.headers.set("Cache-Control", "no-store");

  return res;
}
