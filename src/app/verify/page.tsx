'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import SolemnDeclaration from '@/components/verification/SolemnDeclaration';
import IdentityCapture from '@/components/verification/IdentityCapture';
import PendingApproval from '@/components/verification/PendingApproval';

export default function VerifyPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  
  // Steps: 1 = Solemn Declaration, 2 = Identity Capture, 3 = Pending Approval
  const [step, setStep] = useState(1);

  // Use (session?.user as any) to bypass NextAuth strict typing if not fully configured
  const verificationStatus = (session?.user as any)?.verificationStatus;

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
    
    // Auto-route based on backend status
    if (verificationStatus === 'Active') {
      router.push('/dashboard');
    } else if (verificationStatus === 'In Progress') {
      setStep(3);
    }
  }, [status, verificationStatus, router]);

  const handleDeclarationComplete = async () => {
    // Optionally update the session to reflect partial progress
    // await update(); 
    setStep(2);
  };

  const handleIdentityComplete = async () => {
    // Force a session refresh from the server to get the new 'In Progress' status
    await update();
    setStep(3);
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
       
      {/* Progress Indicator */}
      {step < 3 && (
        <div className="w-full max-w-3xl mb-12">
           <div className="flex items-center justify-between relative">
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 dark:bg-gray-700 z-0"></div>
              
              {/* Step 1 Node */}
              <div className={`relative z-10 flex flex-col items-center flex-1 ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 border-white dark:border-gray-900 ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                   1
                </div>
                <span className="mt-2 text-sm font-semibold hidden sm:block">Legal Agreement</span>
              </div>
              
              {/* Step 2 Node */}
              <div className={`relative z-10 flex flex-col items-center flex-1 ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 border-white dark:border-gray-900 ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                   2
                </div>
                <span className="mt-2 text-sm font-semibold hidden sm:block">Identity Check</span>
              </div>

               {/* Step 3 Node */}
               <div className={`relative z-10 flex flex-col items-center flex-1 text-gray-400`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 border-white dark:border-gray-900 bg-gray-200 dark:bg-gray-700`}>
                   3
                </div>
                <span className="mt-2 text-sm font-semibold hidden sm:block">Approval</span>
              </div>

           </div>
        </div>
      )}

      {/* Funnel Steps */}
      <div className="w-full">
         {step === 1 && <SolemnDeclaration onComplete={handleDeclarationComplete} />}
         {step === 2 && <IdentityCapture onComplete={handleIdentityComplete} />}
         {step === 3 && <PendingApproval />}
      </div>
      
    </div>
  );
}
