import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // make sure you're importing prisma

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const sessionId = (await cookieStore).get("session_id")?.value;

    if (sessionId) {
      await prisma.session.deleteMany({ where: { id: sessionId } });
    }

    // Remove cookie by setting it to expire
    const res = NextResponse.json({ message: "Logged out" });
    res.cookies.set("session_id", "", {
      expires: new Date(0), // expire immediately
      path: "/", // clear across the site
    });

    return res;
  } catch (error) {
    console.error("Failed to logout", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
