import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
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

  // get all budgets for the user
  const budgets = await prisma.budget.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  if (!budgets) {
    return NextResponse.json("No budgets found", { status: 404 });
  }

  // get all items for the user and their budgets
  const items = await prisma.items.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
        budget: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  if (!items) {
    return NextResponse.json("No items found", { status: 404 });
  }

  return NextResponse.json({items: items ?? [], budgets: budgets ?? []}, { status: 200 });
}
