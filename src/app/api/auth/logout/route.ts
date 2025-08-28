import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("session_id")?.value;

    if (sessionId) {
      await prisma?.session.deleteMany({ where: { id: sessionId } });
    }

    cookieStore.delete("session_id");

    return NextResponse.json({ message: "Logged out" });
  } catch (error) {
    console.error("Failed to logout", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
