'use client';

import { useSession } from "next-auth/react";
import Link from 'next/link';

export default function PendingApproval() {
  const { data: session } = useSession();
  
  return (
    <div className="max-w-xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg text-center">
      <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-yellow-600 dark:text-yellow-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      
      <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">Verification in Progress</h2>
      <p className="mb-6 text-gray-600 dark:text-gray-300 text-lg">
        Thank you, <span className="font-semibold">{session?.user?.name || 'User'}</span>! We have received your verification data.
      </p>
      
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-5 mb-8 text-left text-sm text-gray-700 dark:text-gray-300 space-y-3 shadow-inner">
        <p><strong>What happens next?</strong></p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Our verification team is reviewing your Solemn Declaration.</li>
          <li>Your Face Video is being matched securely with your submitted Government ID.</li>
          <li>This process usually completes within <strong>1-2 hours</strong>.</li>
        </ul>
      </div>

      <div className="border-t dark:border-gray-700 pt-6">
         <p className="text-sm text-gray-500 mb-4">We will notify you via email once your account is activated.</p>
         <Link href="/login" className="text-blue-600 hover:text-blue-800 font-semibold underline">
           Return to Login / Refresh Status
         </Link>
      </div>
    </div>
  );
}
