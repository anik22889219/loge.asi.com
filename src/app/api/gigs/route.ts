import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Gig from "@/models/Gig";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  await connectToDatabase();
  const gigs = await Gig.find().populate('sellerId', 'name').sort({ createdAt: -1 });
  return NextResponse.json(gigs);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'seller') {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  
  const body = await req.json();
  await connectToDatabase();
  const newGig = await Gig.create({
    sellerId: (session.user as any).id,
    ...body
  });
  return NextResponse.json(newGig, { status: 201 });
}
