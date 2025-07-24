import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { name, description, amount } = await req.json();

    if (!name || !description || !amount) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // getting user ID from the session cookie
    const sessionId = (await cookies()).get("session_id")?.value;
    if (!sessionId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // validate session if it exists
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    });
    if (!session || session.expireAt <= new Date()) {
      return NextResponse.json({ error: "Session not found" }, { status: 401 });
    }

    const newBudget = await prisma.budget.create({
      data: {
        name,
        description,
        amount: parseFloat(amount), // Ensure amount is a number
        userId: session.userId,
      },
    });

    return NextResponse.json(newBudget, { status: 201 });
  } catch (error) {
    console.error("Error registering budget:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
