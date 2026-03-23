import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Gig from "@/models/Gig";
import User from "@/models/User";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  await connectToDatabase();
  const gig = await Gig.findById(resolvedParams.id).populate('sellerId', 'name email');
  if (!gig) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(gig);
}
