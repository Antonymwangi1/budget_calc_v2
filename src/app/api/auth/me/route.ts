import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const sessionId = (await cookies()).get("session_id")?.value;

  if (!sessionId) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const session = await prisma?.session.findUnique({
    where: { id: sessionId },
    include: { user: true },
  });

  return NextResponse.json({
    authenticated: true,
    user: {
        id: session?.user.id,
        email: session?.user.email,
        name: session?.user.name,
    },
  });
}
