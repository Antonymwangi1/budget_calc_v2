import prisma from "@/lib/prisma";
import { url } from "inspector";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    // Get sesssion cookie
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

    const { itemId, name, amount, quantity } = await req.json();
    if (!itemId || !name || !amount || !quantity) {
      return NextResponse.json(
        { message: "All fields are required!" },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(req.url);
    const budgetId = searchParams.get("budgetId");

    if (!budgetId) {
      return NextResponse.json({ error: "Missing budgetId" }, { status: 400 });
    }

    const budget = await prisma.budget.findFirst({
      where: {
        id: budgetId,
        userId: session.user.id,
      },
    });

    if (!budget) {
      return NextResponse.json("Budget not found", { status: 404 });
    }

    // confirm if item exists and ownership
    const item = await prisma.items.findFirst({
      where: { id: itemId, budgetId: budgetId },
    });

    if (!item || item.userId !== session.user.id) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // update the item
    const updatedItem = await prisma.items.update({
      where: { id: itemId },
      data: {
        name,
        amount: parseFloat(amount),
        quantity: parseInt(quantity),
      },
    });

    return NextResponse.json(updatedItem, { status: 200 });
  } catch (error: any) {
    console.error("Error editng item:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
