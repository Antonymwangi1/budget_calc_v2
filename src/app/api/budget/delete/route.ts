import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(req: Request) {
  try {
    // Get session cookie
    const cookieStore = cookies();
    const sessionId = (await cookieStore).get("session_id")?.value;

    if (!sessionId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get session + user
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true },
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Get budgetId from query
    const { searchParams } = new URL(req.url);
    const budgetId = searchParams.get("budgetId");

    if (!budgetId) {
      return NextResponse.json({ error: "Missing budgetId" }, { status: 400 });
    }

    // Check ownership
    const budget = await prisma.budget.findUnique({
      where: { id: budgetId },
    });

    if (!budget || budget.userId !== session.user.id) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
    }

    // Delete
    await prisma.budget.delete({
      where: { id: budgetId },
    });

    return NextResponse.json(
      { message: "Budget deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Error deleting budget:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
