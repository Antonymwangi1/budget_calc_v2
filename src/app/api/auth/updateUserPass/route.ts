import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
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

    const { oldPass, newPass } = await req.json();
    if (!oldPass || !newPass) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // compare our password
    const passCompare = await bcrypt.compare(oldPass, session.user.password);
    if (!passCompare) {
      return NextResponse.json(
        { error: "Incorrect password" },
        { status: 401 }
      );
    }

    // hash and updat our user password
    const hashedPassword = await bcrypt.hash(newPass, 10);

    const updatePassword = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        password: hashedPassword,
      },
    });

    return NextResponse.json("Password updated successfully", { status: 200 });
  } catch (error) {
    console.log("Failed to update user password:", error);
    return NextResponse.json(
      "Internal server error",
      { status: 500 }
    );
  }
}
