import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  await connectToDatabase();
  const order = await Order.findById(resolvedParams.id).populate('gigId').populate('buyerId', 'name email').populate('sellerId', 'name email');
  if (!order) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json(order);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  
  const resolvedParams = await params;
  await connectToDatabase();
  const { status } = await req.json();
  const order = await Order.findByIdAndUpdate(resolvedParams.id, { status }, { new: true });
  return NextResponse.json(order);
}
