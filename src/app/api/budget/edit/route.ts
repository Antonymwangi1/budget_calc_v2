import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  try {
    // get session cookie
    const sessionId = (await cookies()).get("session_id")?.value;
    if (!sessionId) {
      return new Response("Unauthorized", { status: 401 });
    }

    // fetch user from session
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true },
    });
    if (!session || !session.user) {
      return new Response("Session not found", { status: 404 });
    }

    const { id, name, amount, description } = await request.json();
    if (!id || !name || !amount) {
      return new Response("Missing required fields", { status: 400 });
    }

    // Fetch budget and check ownership
    const budget = await prisma.budget.findUnique({ where: { id } });
    if (!budget || budget.userId !== session.user.id) {
      return NextResponse.json({ error: "Budget not found" }, { status: 404 });
    }

    const updatedBudget = await prisma.budget.update({
      where: { id },
      data: {
        name,
        amount: parseFloat(amount), // Ensure amount is a number
        description,
      },
    });

    return NextResponse.json(updatedBudget, { status: 200 });
  } catch (error) {
    console.error("Error editing budget:", error);
    return new Response("Failed to edit budget", { status: 500 });
  }
}
