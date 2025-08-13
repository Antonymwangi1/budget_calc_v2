import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
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

    // Get request body
    const { name, email } = await req.json();
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Check if another user already has the email
    const existingUser = await prisma.user.findFirst({
      where: { email, NOT: { id: session.user.id } },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 }
      );
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { name, email },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Failed to save changes:", error);
    return NextResponse.json(
      { error: "Failed to save changes" },
      { status: 500 }
    );
  }
}
