"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const CATEGORIES = ['Web Development', 'Graphic Design', 'Digital Marketing', 'Video & Animation', 'Writing & Translation', 'Data & Analytics'];

type Toast = { id: number; msg: string; type: 'success' | 'error' };

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [myGigs, setMyGigs] = useState<any[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'gigs'>('orders');

  // Gig form state
  const [showGigForm, setShowGigForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Web Development");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [gigLoading, setGigLoading] = useState(false);

  const addToast = (msg: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000);
  };

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    else if (status === "authenticated") {
      fetch("/api/orders").then(r => r.json()).then(setOrders);
      if ((session?.user as any)?.role === 'seller') {
        fetch("/api/gigs/my").then(r => r.json()).then(setMyGigs);
      }
    }
  }, [status, router, session]);

  const handleCreateGig = async (e: React.FormEvent) => {
    e.preventDefault();
    setGigLoading(true);
    const res = await fetch("/api/gigs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, category, price: Number(price), imageUrl })
    });
    setGigLoading(false);
    if (res.ok) {
      const newGig = await res.json();
      setMyGigs(g => [newGig, ...g]);
      addToast("✅ Gig published successfully!");
      setShowGigForm(false);
      setTitle(""); setDescription(""); setPrice(""); setImageUrl(""); setCategory("Web Development");
    } else {
      addToast("Failed to create gig. Check you are a seller.", "error");
    }
  };

  if (status === "loading") return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 font-semibold">Loading dashboard...</p>
      </div>
    </div>
  );
  if (!session) return null;

  const isSeller = (session.user as any).role === "seller";

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Toast notifications */}
      <div className="fixed top-20 right-4 z-50 space-y-2">
        {toasts.map(t => (
          <div key={t.id} className={`px-4 py-3 rounded-xl shadow-lg text-sm font-bold animate-slide-up ${
            t.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
          }`}>
            {t.msg}
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-gray-900">
            Hello, {session.user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-500 mt-1 font-medium flex items-center gap-2">
            <span className={`inline-block w-2 h-2 rounded-full ${isSeller ? 'bg-purple-500' : 'bg-blue-500'}`} />
            {isSeller ? "Seller Dashboard" : "Buyer Dashboard"}
          </p>
        </div>
        {isSeller && (
          <button onClick={() => setShowGigForm(!showGigForm)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center gap-2">
            {showGigForm ? "✕ Cancel" : "+ Create New Gig"}
          </button>
        )}
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[
          { label: "Total Orders", value: orders.length, icon: "📦", color: "indigo" },
          { label: "Completed", value: orders.filter((o:any) => o.status === 'completed').length, icon: "✅", color: "green" },
          { label: isSeller ? "My Gigs" : "Pending Orders", value: isSeller ? myGigs.length : orders.filter((o:any) => o.status === 'pending').length, icon: isSeller ? "🎯" : "⏳", color: "amber" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-2xl shrink-0">{s.icon}</div>
            <div>
              <div className="text-2xl font-black text-gray-900">{s.value}</div>
              <div className="text-sm font-medium text-gray-500">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Gig creation form */}
      {showGigForm && (
        <div className="bg-white rounded-3xl shadow-xl border border-indigo-50 p-8 mb-10 animate-slide-up">
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-lg flex items-center justify-center text-lg">+</span>
            Create New Gig
          </h2>
          <form onSubmit={handleCreateGig} className="space-y-6 max-w-2xl">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Gig Title</label>
              <input required type="text" placeholder="I will build your professional website..." 
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none font-medium transition-colors bg-gray-50 focus:bg-white"
                value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Description</label>
              <textarea required rows={4} placeholder="Describe your service in detail..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none font-medium transition-colors bg-gray-50 focus:bg-white resize-none"
                value={description} onChange={e => setDescription(e.target.value)} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Category</label>
                <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none bg-gray-50 font-medium"
                  value={category} onChange={e => setCategory(e.target.value)}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Starting Price (৳)</label>
                <input required type="number" min="50" placeholder="e.g. 500"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none font-medium transition-colors bg-gray-50 focus:bg-white"
                  value={price} onChange={e => setPrice(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Gig Image URL</label>
              <input required type="url" placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none font-medium transition-colors bg-gray-50 focus:bg-white"
                value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
              <p className="text-xs text-gray-400 mt-1">Use a direct image URL (Unsplash, Cloudinary, etc.)</p>
            </div>
            <button type="submit" disabled={gigLoading}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-lg disabled:opacity-60 flex items-center gap-2">
              {gigLoading ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Publishing...</> : "🚀 Publish Gig"}
            </button>
          </form>
        </div>
      )}

      {/* Tab Navigation for sellers */}
      {isSeller && (
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit">
          {(['orders', 'gigs'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
                activeTab === tab ? 'bg-white shadow-sm text-indigo-700' : 'text-gray-600 hover:text-gray-900'
              }`}>
              {tab === 'orders' ? `📦 Orders (${orders.length})` : `🎯 My Gigs (${myGigs.length})`}
            </button>
          ))}
        </div>
      )}

      {/* Orders Table */}
      {(!isSeller || activeTab === 'orders') && (
        <div>
          <h2 className="text-2xl font-black text-gray-900 mb-6">Your Orders</h2>
          {orders.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-16 text-center">
              <div className="text-5xl mb-4">📭</div>
              <p className="text-gray-500 text-lg font-semibold">No orders yet.</p>
              <p className="text-gray-400 text-sm mt-1">
                {isSeller ? "Orders from buyers will appear here." : "Browse gigs and place your first order!"}
              </p>
              {!isSeller && <Link href="/" className="mt-6 inline-block bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors">Browse Gigs</Link>}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {["Gig", isSeller ? "Buyer" : "Seller", "TrxID", "Status", "Action"].map(h => (
                      <th key={h} className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.map((order: any) => (
                    <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{order.gigId?.title || "Deleted Gig"}</div>
                        <div className="text-sm font-semibold text-indigo-600">৳{order.gigId?.price}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900">{isSeller ? order.buyerId?.name : order.sellerId?.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">{order.transactionId}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1.5 inline-flex text-xs font-bold rounded-full ${
                          order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'accepted' ? 'bg-indigo-100 text-indigo-800' :
                          order.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Link href={`/orders/${order._id}`}
                          className="text-indigo-600 hover:text-white bg-indigo-50 hover:bg-indigo-600 px-4 py-2 rounded-xl transition-all font-bold text-sm">
                          Open →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Seller: My Gigs */}
      {isSeller && activeTab === 'gigs' && (
        <div>
          <h2 className="text-2xl font-black text-gray-900 mb-6">My Published Gigs</h2>
          {myGigs.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-16 text-center">
              <div className="text-5xl mb-4">🎯</div>
              <p className="text-gray-500 text-lg font-semibold">No gigs yet!</p>
              <button onClick={() => { setShowGigForm(true); setActiveTab('orders'); }}
                className="mt-6 bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors">
                Create Your First Gig
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {myGigs.map((gig: any) => (
                <Link href={`/gigs/${gig._id}`} key={gig._id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all overflow-hidden group">
                  <div className="h-40 bg-gray-100 overflow-hidden">
                    <img src={gig.imageUrl} alt={gig.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-4">
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">{gig.category}</span>
                    <h3 className="font-bold text-gray-900 mt-2 line-clamp-2">{gig.title}</h3>
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-400 font-medium">Starting at</span>
                      <span className="font-black text-indigo-600 text-lg">৳{gig.price}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
