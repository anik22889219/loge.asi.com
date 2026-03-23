"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function OrderPage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const [order, setOrder] = useState<any>(null);
  
  const fetchOrder = () => fetch(`/api/orders/${id}`).then(res => res.json()).then(setOrder);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleUpdateStatus = async (status: string) => {
    await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    fetchOrder();
  };

  if (!order) return <div className="text-center mt-20 text-xl font-medium text-gray-500 animate-pulse">Loading secure order workspace...</div>;

  const isSeller = session && (session.user as any).role === 'seller';

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {/* Header Ribbon */}
        <div className={`p-6 text-white flex items-center justify-between ${
          order.status === 'completed' ? 'bg-green-600' :
          order.status === 'accepted' ? 'bg-indigo-600' : 'bg-amber-500'
        }`}>
          <div>
             <h1 className="text-3xl font-extrabold">Order Workspace</h1>
             <p className="mt-1 opacity-90 font-medium">Order ID: #{order._id}</p>
          </div>
          <div className="text-right">
             <div className="text-sm font-bold opacity-80 uppercase tracking-widest mb-1">Status</div>
             <span className="bg-white/20 px-4 py-2 rounded-lg font-bold text-lg uppercase inline-block backdrop-blur-sm">
               {order.status}
             </span>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
             <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
               <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Original Request</h3>
               <div className="border-l-4 border-indigo-500 pl-4 py-1">
                 <p className="text-gray-800 text-lg whitespace-pre-wrap font-medium">{order.message || "No initial message provided."}</p>
                 <p className="text-sm text-gray-500 mt-4 font-semibold">— from {order.buyerId?.name}</p>
               </div>
             </div>

             <div className="border border-gray-200 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-4 text-xl">Workspace Communication</h3>
                <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center border border-dashed border-gray-300 text-gray-500 mb-4">
                  Chat system placeholder
                </div>
                <div className="flex gap-2">
                  <input type="text" placeholder="Type a message..." className="flex-1 border rounded-lg px-4 py-2" disabled={order.status === 'pending'} />
                  <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold disabled:opacity-50" disabled={order.status === 'pending'}>Send</button>
                </div>
                {order.status === 'pending' && <p className="text-xs text-red-500 mt-2 font-medium">Communication is locked until the seller accepts the order.</p>}
             </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="border rounded-xl p-6 bg-white shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 border-b pb-4 mb-4">Order Details</h2>
              <div className="space-y-4 text-sm font-medium">
                <div className="flex justify-between">
                  <span className="text-gray-500">Gig</span>
                  <span className="text-gray-900 text-right font-bold">{order.gigId?.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Buyer</span>
                  <span className="text-gray-900 font-bold">{order.buyerId?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Seller</span>
                  <span className="text-gray-900 font-bold">{order.sellerId?.name}</span>
                </div>
                <div className="flex justify-between pt-4 border-t border-gray-100">
                  <span className="text-gray-900 font-bold">Total Price</span>
                  <span className="text-indigo-600 font-extrabold text-lg">৳{order.gigId?.price}</span>
                </div>
              </div>
            </div>

            <div className="border border-[#E2136E]/20 rounded-xl p-6 bg-rose-50">
               <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Payment Info</h3>
               <div className="flex items-center gap-3">
                 <div className="bg-[#E2136E] text-white text-xs font-bold px-2 py-1 rounded">bKash</div>
                 <span className="font-mono font-bold text-gray-900">{order.transactionId}</span>
               </div>
            </div>

            {isSeller && order.status === 'pending' && (
              <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                <h3 className="font-bold text-amber-900 mb-2">Review Payment</h3>
                <p className="text-sm text-amber-800 mb-4 font-medium">Verify the bKash TrxID before accepting.</p>
                <div className="flex gap-3">
                  <button onClick={() => handleUpdateStatus('accepted')} className="flex-1 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 shadow-sm transition-colors">Accept</button>
                  <button className="px-4 bg-red-100 text-red-700 font-bold rounded-lg hover:bg-red-200 transition-colors">Reject</button>
                </div>
              </div>
            )}
            
            {isSeller && order.status === 'accepted' && (
              <button onClick={() => handleUpdateStatus('completed')} className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 shadow-md transition-colors text-lg">
                Mark as Completed
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
