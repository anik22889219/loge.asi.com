"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  if (status === "loading") return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!session) return null;

  const isSeller = (session.user as any).role === "seller";

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
      <h1 className="text-3xl font-black text-gray-900 mb-8">My Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-black mb-4 shadow-xl shadow-indigo-200">
              {session.user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <h2 className="text-xl font-black text-gray-900">{session.user?.name}</h2>
            <p className="text-gray-500 text-sm mt-1 font-medium">{session.user?.email}</p>
            <div className="mt-3">
              <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold ${
                isSeller ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
              }`}>
                {isSeller ? "💼 Seller" : "🛒 Buyer"}
              </span>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-100 space-y-2">
              <Link href="/dashboard"
                className="block w-full py-2.5 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl transition-colors text-sm">
                📊 Dashboard
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="block w-full py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-xl transition-colors text-sm">
                🚪 Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h3 className="font-black text-gray-900 text-xl mb-6">Account Information</h3>
            <div className="space-y-4">
              {[
                { label: "Full Name", value: session.user?.name, icon: "👤" },
                { label: "Email Address", value: session.user?.email, icon: "📧" },
                { label: "Account Type", value: isSeller ? "Seller Account" : "Buyer Account", icon: "🏷️" },
                { label: "Account ID", value: (session.user as any).id?.slice(-12) || "N/A", icon: "🔑" },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-xl w-8 text-center">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">{item.label}</p>
                    <p className="text-sm font-bold text-gray-900 mt-0.5 truncate">{item.value || "—"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* bKash Payment Info */}
          <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-3xl border border-rose-100 p-8">
            <h3 className="font-black text-gray-900 text-xl mb-4 flex items-center gap-2">
              <div className="bg-[#E2136E] text-white text-xs font-black px-2 py-1 rounded">bKash</div>
              Payment Method
            </h3>
            <p className="text-sm font-medium text-gray-600 leading-relaxed mb-4">
              This platform uses <strong>offline bKash payment processing</strong>. When placing an order,
              you send money via bKash to the platform number and submit your Transaction ID (TrxID).
              The seller manually verifies the payment before starting work.
            </p>
            <div className="bg-white rounded-xl p-4 border border-rose-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">How it works</p>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <span>Send via bKash</span>
                <span className="text-gray-300">→</span>
                <span>Submit TrxID</span>
                <span className="text-gray-300">→</span>
                <span>Seller verifies</span>
                <span className="text-gray-300">→</span>
                <span className="text-green-600 font-bold">Work begins</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h3 className="font-black text-gray-900 text-xl mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/" className="p-4 bg-indigo-50 hover:bg-indigo-100 rounded-2xl transition-colors text-center group">
                <div className="text-2xl mb-1">🔍</div>
                <p className="text-sm font-bold text-indigo-700">Browse Gigs</p>
              </Link>
              <Link href="/dashboard" className="p-4 bg-purple-50 hover:bg-purple-100 rounded-2xl transition-colors text-center">
                <div className="text-2xl mb-1">📦</div>
                <p className="text-sm font-bold text-purple-700">My Orders</p>
              </Link>
              {isSeller && (
                <Link href="/dashboard?tab=gigs" className="p-4 bg-green-50 hover:bg-green-100 rounded-2xl transition-colors text-center">
                  <div className="text-2xl mb-1">🎯</div>
                  <p className="text-sm font-bold text-green-700">My Gigs</p>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
