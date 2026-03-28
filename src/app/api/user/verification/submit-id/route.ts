import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../api/auth/[...nextauth]/route';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const videoBlob = formData.get('video') as File;

    if (!videoBlob) {
      return NextResponse.json({ message: 'Missing face video file' }, { status: 400 });
    }

    // Local MVP storage logic (Save to /public/uploads/kyc)
    // IMPORTANT: For production, integrate with AWS S3 or Cloudinary
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'kyc');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const userId = (session.user as any).id;
    const videoExt = videoBlob.name.split('.').pop() || 'webm';
    
    // Create unique timestamps
    const ts = Date.now();
    const videoFileName = `${userId}_video_${ts}.${videoExt}`;
    
    const videoPath = path.join(uploadDir, videoFileName);

    // Write Files
    const videoBuffer = Buffer.from(await videoBlob.arrayBuffer());
    fs.writeFileSync(videoPath, videoBuffer);

    // Update DB record
    await connectToDatabase();
    await User.findByIdAndUpdate(userId, {
      verificationData: {
        faceVideoUrl: `/uploads/kyc/${videoFileName}`,
        idCardUrl: '', // Explicitly blank as user requested only face video
        submittedAt: new Date(),
      },
      verificationStatus: 'Active', // Update status to Active so they don't need to verify again
    });

    return NextResponse.json({ message: 'Video verification submitted' }, { status: 200 });
  } catch (error) {
    console.error('Error submitting verification data:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
