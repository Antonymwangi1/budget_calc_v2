import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {

    // Get sesssion cookie
    const cookieStore = cookies();
    const sessionId = (await cookieStore).get("session_id")?.value;

    if(!sessionId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get session + user
    const session = await prisma.session.findUnique({
        where: {id: sessionId},
        include: {user: true},
    })

    if (!session?.user) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Get item id from query
    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get("itemId")

    if (!itemId) {
      return NextResponse.json({ error: "Missing budgetId" }, { status: 400 });
    }

    // check ownership
    const item = await prisma.items.findUnique({
        where: {id: itemId}
    })

    if(!item || item.userId !== session.user.id) {
        return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // delete the item
    await prisma.items.delete({
        where: {id: itemId}
    })

    return NextResponse.json(
      { message: "Item deleted successfully" },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("❌ Error deleting budget:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
