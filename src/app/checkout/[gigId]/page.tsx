"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { gigId } = useParams();
  const router = useRouter();
  const [transactionId, setTransactionId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId) return alert("Please enter your bKash Transaction ID");
    
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gigId, transactionId, message })
      });
      if (res.ok) {
        const order = await res.json();
        router.push(`/orders/${order._id}`);
      } else {
        alert("Failed to place order.");
        setLoading(false);
      }
    } catch {
      alert("Error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-[#E2136E] p-8 text-white text-center"> {/* bKash Brand Color */}
          <h1 className="text-3xl font-extrabold tracking-tight">bKash Payment Checkout</h1>
          <p className="mt-2 text-[#FPF5F9] font-medium opacity-90">Secure offline manual processing</p>
        </div>
        
        <div className="p-8">
          <div className="bg-rose-50 border border-rose-100 rounded-xl p-6 mb-8 text-rose-900">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <span className="text-2xl">📱</span> Offline Payment Instructions
            </h3>
            <ol className="list-decimal pl-5 mt-4 space-y-2 font-medium">
              <li>Open your bKash app or dial *247#</li>
              <li>Select <strong>Send Money</strong></li>
              <li>Enter our secure number: <strong className="text-2xl ml-2 font-mono bg-white px-3 py-1 rounded inline-block shadow-sm">017XX-XXXXXX</strong></li>
              <li>Enter the exact amount of the gig</li>
              <li>Use your name as the reference</li>
              <li>Once successful, copy the <strong className="bg-[#E2136E] text-white px-2 py-0.5 rounded">Transaction ID (TrxID)</strong> and paste it below</li>
            </ol>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="trx" className="block text-sm font-bold text-gray-700 mb-2">Transaction ID</label>
              <input
                id="trx"
                type="text"
                required
                placeholder="e.g. 9F6A2B8C"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-[#E2136E] focus:border-[#E2136E] font-mono text-lg uppercase transition-colors"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="msg" className="block text-sm font-bold text-gray-700 mb-2">Message for the Seller (Optional)</label>
              <textarea
                id="msg"
                rows={4}
                placeholder="Describe what you need..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E2136E] text-white font-bold py-4 px-6 rounded-xl hover:bg-[#b50f58] transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center text-lg"
            >
              {loading ? "Verifying..." : "Confirm Payment & Place Order"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
