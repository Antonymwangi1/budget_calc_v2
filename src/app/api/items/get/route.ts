import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    // get session cookie
    const sessionId = (await cookies()).get("session_id")?.value;
    if (!sessionId) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    // fetch user from session
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true },
    });
    if (!session || !session.user) {
      return NextResponse.json("Session not found", { status: 404 });
    }

    // get budgetId from query parameters
    const { searchParams } = new URL(request.url);
    const budgetId = searchParams.get("budgetId");

    if (!budgetId) {
      return NextResponse.json("Missing budgetId", { status: 400 });
    }

    // Fetch items by userId and budgetId
    const items = await prisma.items.findMany({
      where: {
        userId: session.user.id,
        budgetId: budgetId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const budget = await prisma.budget.findUnique({
      where: {
        id: budgetId,
        userId: session.user.id,
      },
    });

    return NextResponse.json(
      { items, budget },
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching items:", error);
    return NextResponse.json("Failed to fetch items", { status: 500 });
  }
}
