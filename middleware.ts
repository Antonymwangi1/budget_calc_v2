
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";


export async function middleware(req: NextRequest) {
  const sessionId = req.cookies.get("session_id")?.value;

  if(!sessionId) return NextResponse.redirect(new URL("/login", req.url));

  // check if session in DB
  const session = await prisma.session.findUnique({
    where: {id: sessionId},
  });

  if(!session || session.expireAt < new Date()) {
    // session expired or not found
    return NextResponse.redirect(new URL("/login", req.url)); 
  }

  // allow request
  return NextResponse.next();
}


export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/settings/:path*"],
};