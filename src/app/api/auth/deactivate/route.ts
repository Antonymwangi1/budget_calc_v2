import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(req: Request) {
  try {
    const cookieStore = cookies();
    const sessionId = (await cookieStore).get("session_id")?.value;

    if (!sessionId) {
      return NextResponse.json({ error: "No active session" }, { status: 401 });
    }

    // Get session + user
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true },
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 401 });
    }

    const userId = session.user.id;

    await prisma.items.deleteMany({ where: { userId } });
    await prisma.budget.deleteMany({ where: { userId } });
    await prisma.session.deleteMany({ where: { userId } });

    await prisma.user.delete({ where: { id: userId } });

    (await cookieStore).delete("session_id");

    return NextResponse.json({ message: "User account deactivated" });
  } catch (error) {
    console.error("Deactivate error:", error);
    return NextResponse.json(
      { error: "Failed to deactivate" },
      { status: 500 }
    );
  }
}
