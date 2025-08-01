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
    const budgetIdParam = searchParams.get("budgetId");

    if (!budgetIdParam) {
      return NextResponse.json("Missing budgetId", { status: 400 });
    }

    // handle multiple budgetIds
    const budgetIds = budgetIdParam
      .split(",")
      .map((id) => id.trim())
      .filter((id) => id.length > 0);

    // Fetch items by userId and budgetId(s)
    const items = await prisma.items.findMany({
      where: {
        userId: session.user.id,
        budgetId: {
          in: budgetIds,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const budget = await prisma.budget.findFirst({
      where: {
        id: budgetIds[0],
        userId: session.user.id,
      },
    });

    return NextResponse.json({ items, budget }, { status: 200 });
  } catch (error) {
    console.error("Error fetching items:", error);
    return NextResponse.json("Failed to fetch items", { status: 500 });
  }
}
