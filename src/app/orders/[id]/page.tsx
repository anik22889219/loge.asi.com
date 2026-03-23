"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function OrderPage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const [order, setOrder] = useState<any>(null);
  const [updating, setUpdating] = useState(false);
  
  const fetchOrder = () => fetch(`/api/orders/${id}`).then(r => r.json()).then(setOrder);

  useEffect(() => { fetchOrder(); }, [id]);

  const handleUpdateStatus = async (status: string) => {
    setUpdating(true);
    await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    await fetchOrder();
    setUpdating(false);
  };

  if (!order) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 font-semibold">Loading order workspace...</p>
      </div>
    </div>
  );

  const isSeller = session && (session.user as any).role === 'seller';

  const statusColors: Record<string, string> = {
    completed: 'bg-green-600',
    accepted: 'bg-indigo-600',
    rejected: 'bg-red-600',
    pending: 'bg-amber-500',
  };

  const statusBg = statusColors[order.status] || 'bg-gray-600';

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 animate-fade-in">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-gray-500 font-medium">
        <Link href="/dashboard" className="hover:text-indigo-600 transition-colors">Dashboard</Link>
        <span>›</span>
        <span className="text-gray-900 font-bold">Order #{order._id?.slice(-8)}</span>
      </div>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        {/* Status Header */}
        <div className={`p-7 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${statusBg}`}>
          <div>
            <h1 className="text-2xl font-black">Order Workspace</h1>
            <p className="mt-0.5 opacity-80 text-sm font-medium">ID: #{order._id}</p>
          </div>
          <span className="bg-white/20 backdrop-blur-sm px-5 py-2.5 rounded-xl font-black text-base uppercase tracking-wide border border-white/20">
            {order.status}
          </span>
        </div>

        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Original Request */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">📝 Buyer&apos;s Request</h3>
              <div className="border-l-4 border-indigo-500 pl-4">
                <p className="text-gray-800 font-medium whitespace-pre-wrap leading-relaxed">
                  {order.message || "No initial message provided by the buyer."}
                </p>
                <p className="text-sm text-gray-400 mt-3 font-semibold">— {order.buyerId?.name}</p>
              </div>
            </div>

            {/* Communication placeholder */}
            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6">
              <h3 className="font-black text-gray-900 mb-4 text-lg flex items-center gap-2">
                💬 Workspace Chat
                {order.status === 'pending' && (
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full border border-amber-200">Locked</span>
                )}
              </h3>
              <div className="h-36 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-200 mb-4">
                <p className="text-gray-400 text-sm font-medium">
                  {order.status === 'pending' ? "⏳ Chat unlocks after seller accepts the order" : "Chat system (coming soon)"}
                </p>
              </div>
              <div className="flex gap-2">
                <input type="text" placeholder="Type a message..."
                  className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:border-indigo-400 focus:outline-none"
                  disabled={order.status === 'pending' || order.status === 'rejected'} />
                <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold disabled:opacity-50 hover:bg-indigo-700 transition-colors"
                  disabled={order.status === 'pending' || order.status === 'rejected'}>
                  Send
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Order Details */}
            <div className="border border-gray-100 rounded-2xl p-5 bg-gray-50">
              <h2 className="font-black text-gray-900 border-b border-gray-200 pb-3 mb-4 text-base">📦 Order Details</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Gig</span>
                  <span className="text-gray-900 font-bold text-right max-w-[60%] leading-tight">{order.gigId?.title || "Deleted"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Buyer</span>
                  <span className="text-gray-900 font-bold">{order.buyerId?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-medium">Seller</span>
                  <span className="text-gray-900 font-bold">{order.sellerId?.name}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-200">
                  <span className="text-gray-900 font-black">Total</span>
                  <span className="text-indigo-600 font-black text-xl">৳{order.gigId?.price?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* bKash Payment Info */}
            <div className="border border-[#E2136E]/20 rounded-2xl p-5 bg-rose-50">
              <h3 className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3">💳 Payment Info</h3>
              <div className="flex items-center gap-3">
                <div className="bg-[#E2136E] text-white text-xs font-black px-2.5 py-1 rounded-lg">bKash</div>
                <span className="font-mono font-bold text-gray-800 text-sm">{order.transactionId}</span>
              </div>
            </div>

            {/* Seller Actions */}
            {isSeller && order.status === 'pending' && (
              <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200">
                <h3 className="font-black text-amber-900 mb-1">⚠️ Review Order</h3>
                <p className="text-sm text-amber-700 mb-4 font-medium">
                  Verify the bKash TrxID <strong>{order.transactionId}</strong> before accepting.
                  Amount should be <strong>৳{order.gigId?.price?.toLocaleString()}</strong>.
                </p>
                <div className="flex gap-2">
                  <button onClick={() => handleUpdateStatus('accepted')} disabled={updating}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-black py-3 rounded-xl transition-colors shadow-md disabled:opacity-60">
                    {updating ? "..." : "✅ Accept"}
                  </button>
                  <button onClick={() => handleUpdateStatus('rejected')} disabled={updating}
                    className="px-4 bg-red-100 hover:bg-red-200 text-red-700 font-black rounded-xl transition-colors disabled:opacity-60">
                    {updating ? "..." : "✕"}
                  </button>
                </div>
              </div>
            )}

            {isSeller && order.status === 'accepted' && (
              <button onClick={() => handleUpdateStatus('completed')} disabled={updating}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black py-4 rounded-2xl shadow-lg transition-all disabled:opacity-60 text-base">
                {updating ? "Updating..." : "🎉 Mark as Completed"}
              </button>
            )}

            {order.status === 'rejected' && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center">
                <p className="text-red-700 font-bold text-sm">This order was rejected by the seller.</p>
              </div>
            )}

            {order.status === 'completed' && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
                <p className="text-green-800 font-black">🎉 Order Complete!</p>
              </div>
            )}

            <Link href="/dashboard"
              className="block text-center text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors py-2">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
