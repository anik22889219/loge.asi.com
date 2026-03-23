import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  
  const body = await req.json();
  await connectToDatabase();
  
  const order = await Order.create({
    buyerId: (session.user as any).id,
    ...body
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
    orders = await Order.find({ sellerId: userId }).populate('gigId').populate('buyerId', 'name email').sort({ createdAt: -1 });
  } else {
    orders = await Order.find({ buyerId: userId }).populate('gigId').populate('sellerId', 'name email').sort({ createdAt: -1 });
  }
  return NextResponse.json(orders);
}
