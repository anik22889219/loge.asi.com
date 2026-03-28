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
    const idCardBlob = formData.get('idCard') as File;

    if (!videoBlob || !idCardBlob) {
      return NextResponse.json({ message: 'Missing files' }, { status: 400 });
    }

    // Local MVP storage logic (Save to /public/uploads/kyc)
    // IMPORTANT: For production, integrate with AWS S3 or Cloudinary
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'kyc');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const userId = (session.user as any).id;
    const videoExt = videoBlob.name.split('.').pop() || 'webm';
    const idCardExt = idCardBlob.name.split('.').pop() || 'jpg';
    
    // Create unique timestamps
    const ts = Date.now();
    const videoFileName = `${userId}_video_${ts}.${videoExt}`;
    const idCardFileName = `${userId}_idcard_${ts}.${idCardExt}`;
    
    const videoPath = path.join(uploadDir, videoFileName);
    const idCardPath = path.join(uploadDir, idCardFileName);

    // Write Files
    const videoBuffer = Buffer.from(await videoBlob.arrayBuffer());
    fs.writeFileSync(videoPath, videoBuffer);
    
    const idCardBuffer = Buffer.from(await idCardBlob.arrayBuffer());
    fs.writeFileSync(idCardPath, idCardBuffer);

    // Update DB record
    await connectToDatabase();
    await User.findByIdAndUpdate(userId, {
      verificationData: {
        faceVideoUrl: `/uploads/kyc/${videoFileName}`,
        idCardUrl: `/uploads/kyc/${idCardFileName}`,
        submittedAt: new Date(),
      },
      verificationStatus: 'In Progress', // Update status
    });

    return NextResponse.json({ message: 'Verification data submitted' }, { status: 200 });
  } catch (error) {
    console.error('Error submitting verification data:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
