import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Gig from "@/models/Gig";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  
  await connectToDatabase();
  const gigs = await Gig.find({ sellerId: (session.user as any).id }).sort({ createdAt: -1 });
  return NextResponse.json(gigs);
}
