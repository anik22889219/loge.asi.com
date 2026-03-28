import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../api/auth/[...nextauth]/route'; // Relative path to authOptions
import connectToDatabase from '@/lib/db';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { ageConfirmed, legalRightsConfirmed, recordKeepingConsent, licenseConsent, signature } = body;

    if (!ageConfirmed || !legalRightsConfirmed || !recordKeepingConsent || !licenseConsent || !signature) {
      return NextResponse.json({ message: 'Missing required agreements' }, { status: 400 });
    }

    const userId = (session.user as any).id;
    await connectToDatabase();

    await User.findByIdAndUpdate(userId, {
      agreements: {
        ageConfirmed,
        legalRightsConfirmed,
        recordKeepingConsent,
        licenseConsent,
        digitalSignature: signature,
        agreedAt: new Date(),
      }
    });

    return NextResponse.json({ message: 'Agreements saved successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error saving agreements:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
