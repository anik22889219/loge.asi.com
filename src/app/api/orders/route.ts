import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";
import Gig from "@/models/Gig";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  
  const body = await req.json();
  const { gigId, transactionId, message } = body;

  if (!gigId || !transactionId) {
    return NextResponse.json({ message: "Missing gigId or transactionId" }, { status: 400 });
  }

  await connectToDatabase();

  // FIX: Auto-fetch sellerId from the gig
  const gig = await Gig.findById(gigId);
  if (!gig) return NextResponse.json({ message: "Gig not found" }, { status: 404 });
  
  const order = await Order.create({
    gigId,
    buyerId: (session.user as any).id,
    sellerId: gig.sellerId,  // ✅ Critical fix: auto-set sellerId
    transactionId,
    message,
  });

  return NextResponse.json(order, { status: 201 });
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  
  await connectToDatabase();
  const userId = (session.user as any).id;
  const role = (session.user as any).role;
  
  let orders;
  if (role === 'seller') {
    orders = await Order.find({ sellerId: userId })
      .populate('gigId')
      .populate('buyerId', 'name email')
      .sort({ createdAt: -1 });
  } else {
    orders = await Order.find({ buyerId: userId })
      .populate('gigId')
      .populate('sellerId', 'name email')
      .sort({ createdAt: -1 });
  }
  return NextResponse.json(orders);
}
