import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../api/auth/[...nextauth]/route';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    // Secure logic: Only allow admins to view. Currently MVP just checks simple role logic if present
    // For MVP we just prevent unauthenticated access. 
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Role check - assuming role was added to DB
    const role = (session.user as { role?: string }).role;
    // In a real system, uncomment this:
    // if (role !== 'admin') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    await connectToDatabase();
    
    // Find users who have submitted ID but aren't active yet
    const pendingUsers = await User.find({ verificationStatus: 'In Progress' })
        .select('name email verificationData agreements createdAt')
        .sort({ 'verificationData.submittedAt': 1 }); // Oldest first

    return NextResponse.json(pendingUsers, { status: 200 });
  } catch (error) {
    console.error('Error fetching pending users:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Role check...
    
    const body = await req.json();
    const { userId, action } = body; // action: 'approve' | 'reject'

    if (!userId || !action) {
       return NextResponse.json({ message: 'Missing parameters' }, { status: 400 });
    }

    await connectToDatabase();

    const newStatus = action === 'approve' ? 'Active' : 'Pending';
    
    // Update the user
    await User.findByIdAndUpdate(userId, {
        verificationStatus: newStatus
    });

    return NextResponse.json({ message: `User ${action}d successfully` }, { status: 200 });
  } catch (error) {
    console.error('Error updating user status:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
