'use client';

import { useState } from 'react';

export default function SolemnDeclaration({ onComplete }: { onComplete: () => void }) {
  const [agreements, setAgreements] = useState({
    ageConfirmed: false,
    legalRightsConfirmed: false,
    recordKeepingConsent: false,
    licenseConsent: false,
  });
  const [signature, setSignature] = useState('');
  const [loading, setLoading] = useState(false);

  const allAgreed = Object.values(agreements).every(Boolean) && signature.trim().length > 2;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allAgreed) return;

    setLoading(true);
    try {
      const res = await fetch('/api/user/verification/agree', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...agreements, signature }),
      });

      if (res.ok) {
        onComplete();
      } else {
        alert('Failed to save agreement. Please try again.');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Solemn Declaration Agreement</h2>
      <p className="mb-6 text-gray-600 dark:text-gray-300">
        Before you can start buying or selling on our platform, you must legally agree to the following terms:
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="flex items-start gap-3 cursor-pointer p-4 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
          <input
            type="checkbox"
            className="mt-1 w-5 h-5"
            checked={agreements.ageConfirmed}
            onChange={(e) => setAgreements({ ...agreements, ageConfirmed: e.target.checked })}
            required
          />
          <span className="text-gray-700 dark:text-gray-200">
            <strong>Age Limit:</strong> I confirm that I am at least 18 years of age or considered a legal adult in my jurisdiction.
          </span>
        </label>

        <label className="flex items-start gap-3 cursor-pointer p-4 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
          <input
            type="checkbox"
            className="mt-1 w-5 h-5"
            checked={agreements.legalRightsConfirmed}
            onChange={(e) => setAgreements({ ...agreements, legalRightsConfirmed: e.target.checked })}
            required
          />
          <span className="text-gray-700 dark:text-gray-200">
            <strong>Legal Rights:</strong> I acknowledge that I have the full capacity and right to enter into this contract.
          </span>
        </label>

        <label className="flex items-start gap-3 cursor-pointer p-4 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
          <input
            type="checkbox"
            className="mt-1 w-5 h-5"
            checked={agreements.recordKeepingConsent}
            onChange={(e) => setAgreements({ ...agreements, recordKeepingConsent: e.target.checked })}
            required
          />
          <span className="text-gray-700 dark:text-gray-200">
            <strong>Record Keeping:</strong> I consent to the platform keeping a record of my identity and verification data for security and legal compliance.
          </span>
        </label>

        <label className="flex items-start gap-3 cursor-pointer p-4 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
          <input
            type="checkbox"
            className="mt-1 w-5 h-5"
            checked={agreements.licenseConsent}
            onChange={(e) => setAgreements({ ...agreements, licenseConsent: e.target.checked })}
            required
          />
          <span className="text-gray-700 dark:text-gray-200">
            <strong>Platform License:</strong> I grant the platform the necessary licenses to use the content I upload.
          </span>
        </label>

        <div className="mt-8">
          <label className="block text-gray-700 dark:text-gray-200 font-bold mb-2">
            Digital Signature
          </label>
          <p className="text-sm text-gray-500 mb-2">Type your full legal name to electronically sign this agreement.</p>
          <input
            type="text"
            className="w-full p-3 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500"
            placeholder="John Doe"
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={!allAgreed || loading}
          className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-md transition-colors"
        >
          {loading ? 'Submitting...' : 'I Agree & Continue'}
        </button>
      </form>
    </div>
  );
}
