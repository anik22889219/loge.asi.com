"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { gigId } = useParams();
  const router = useRouter();
  const [gig, setGig] = useState<any>(null);
  const [transactionId, setTransactionId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/gigs/${gigId}`)
      .then(r => r.json())
      .then(setGig)
      .catch(() => setError("Could not load gig details."));
  }, [gigId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId.trim()) return setError("Please enter your bKash Transaction ID");
    
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gigId, transactionId: transactionId.toUpperCase(), message })
      });
      if (res.ok) {
        const order = await res.json();
        router.push(`/orders/${order._id}`);
      } else {
        const data = await res.json();
        setError(data.message || "Failed to place order. Please try again.");
        setLoading(false);
      }
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        {/* bKash Header */}
        <div className="bg-[#E2136E] p-8 text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-white/20 rounded-xl p-2">
              <span className="text-2xl">📱</span>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">bKash Payment Checkout</h1>
              <p className="text-white/80 text-sm font-medium">Secure offline payment processing</p>
            </div>
          </div>
        </div>

        {/* Gig Summary */}
        {gig && (
          <div className="border-b border-gray-100 px-8 py-5 bg-gray-50 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">You are ordering</p>
              <p className="font-bold text-gray-900 text-base line-clamp-1">{gig.title}</p>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full mt-1 inline-block">{gig.category}</span>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Total</p>
              <p className="text-3xl font-black text-gray-900">৳{gig.price?.toLocaleString()}</p>
            </div>
          </div>
        )}
        
        <div className="p-8">
          {/* Instructions */}
          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 mb-8">
            <h3 className="font-black text-rose-900 text-base mb-4 flex items-center gap-2">
              <span className="bg-[#E2136E] text-white text-xs px-2 py-0.5 rounded font-black">Step by Step</span>
              How to pay via bKash
            </h3>
            <ol className="space-y-2.5 text-sm font-medium text-rose-800">
              {[
                "Open your bKash app or dial *247#",
                <span key="2">Select <strong>Send Money</strong></span>,
                <span key="3">Enter our number: <strong className="font-mono bg-white px-2 py-0.5 rounded shadow-sm text-gray-900">017XX-XXXXXX</strong></span>,
                gig ? <span key="4">Send exactly <strong className="text-[#E2136E]">৳{gig.price?.toLocaleString()}</strong></span> : "Send the exact gig amount",
                "Use your full name as the reference",
                <span key="6">Copy the <strong className="bg-[#E2136E] text-white px-1.5 py-0.5 rounded text-xs">TrxID</strong> from your SMS and paste it below</span>,
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 bg-rose-200 text-rose-700 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-medium px-4 py-3 rounded-xl">
                ⚠️ {error}
              </div>
            )}

            <div>
              <label htmlFor="trx-id" className="block text-sm font-black text-gray-700 mb-2">
                bKash Transaction ID (TrxID) <span className="text-red-500">*</span>
              </label>
              <input
                id="trx-id"
                type="text"
                required
                placeholder="e.g. 9F6A2B8C"
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-[#E2136E] font-mono text-xl uppercase tracking-widest transition-colors text-center"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
              />
              <p className="text-xs text-gray-400 mt-1.5 font-medium">This 8-10 character code is sent to your phone after payment</p>
            </div>
            
            <div>
              <label htmlFor="checkout-msg" className="block text-sm font-black text-gray-700 mb-2">
                Message for Seller <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                id="checkout-msg"
                rows={3}
                placeholder="Describe what you need from the seller..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-400 focus:outline-none transition-colors resize-none font-medium"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            
            <button type="submit" disabled={loading}
              className="w-full bg-[#E2136E] hover:bg-[#b50f58] text-white font-black py-5 px-6 rounded-2xl transition-all shadow-lg shadow-pink-200 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center text-lg gap-3">
              {loading ? (
                <><span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Verifying & Creating Order...</>
              ) : <>Confirm bKash Payment & Place Order →</>}
            </button>

            <p className="text-center text-xs text-gray-400 font-medium">
              By placing this order, you confirm that you have sent the payment via bKash.
              The seller will verify your TrxID before starting work.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
