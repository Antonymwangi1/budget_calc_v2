import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { name, amount, quantity, budgetId } = await request.json();

    // Validate required fields
    if (!name || !amount || !quantity) {
      return NextResponse.json("Missing required fields", { status: 400 });
    }

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

    const userId = session.user.id;

    const budget = await prisma.budget.findFirst({
      where: {
        id: budgetId,
        userId: userId,
      },
    });

    if (!budget) {
      return NextResponse.json("Budget not found", { status: 404 });
    }

    const newItem = await prisma.items.create({
      data: {
        name,
        amount: parseFloat(amount),
        quantity: parseInt(quantity, 10),
        budgetId,
        userId,
      },
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Error in POST request:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
