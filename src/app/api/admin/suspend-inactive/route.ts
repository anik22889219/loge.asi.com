import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    // In production, ensure this is called by a verified CRON environment (like Vercel Cron Secret)
    // const authHeader = req.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) { return NextResponse.json({ message: 'Unauthorized'}, {status: 401}); }

    await connectToDatabase();

    // 6 Months in ms
    const sixMonthsAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30 * 6);

    const result = await User.updateMany(
      { 
         lastActiveAt: { $lt: sixMonthsAgo },
         verificationStatus: 'Active'
      },
      { 
         $set: { verificationStatus: 'Suspended' } 
      }
    );

    return NextResponse.json({ 
        message: 'Inactive accounts check complete', 
        suspendedCount: result.modifiedCount 
    }, { status: 200 });

  } catch (error) {
    console.error('Error in suspend cron:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
