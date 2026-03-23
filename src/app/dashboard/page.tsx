"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  
  // Gig creation state
  const [showGigForm, setShowGigForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Web Development");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetch("/api/orders").then(res => res.json()).then(setOrders);
    }
  }, [status, router]);

  const handleCreateGig = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/gigs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, category, price: Number(price), imageUrl })
    });
    if (res.ok) {
      alert("Gig created successfully!");
      setShowGigForm(false);
      setTitle(""); setDescription(""); setPrice(""); setImageUrl("");
    } else {
      alert("Failed to create gig");
    }
  };

  if (status === "loading") return <div className="p-8 text-center text-gray-500 font-medium animate-pulse">Loading dashboard...</div>;
  if (!session) return null;

  const isSeller = (session.user as any).role === "seller";

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">Welcome, {session.user?.name}</h1>
          <p className="mt-2 text-lg text-gray-600 font-medium">Your personal {isSeller ? "seller" : "buyer"} dashboard</p>
        </div>
        {isSeller && (
          <button 
            onClick={() => setShowGigForm(!showGigForm)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <span>{showGigForm ? "Cancel" : "Create New Gig"}</span>
            {!showGigForm && <span className="text-xl leading-none mb-1">+</span>}
          </button>
        )}
      </div>

      {showGigForm && (
        <div className="bg-white p-8 rounded-2xl shadow-xl mb-12 border-2 border-indigo-50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500 rounded-l-2xl"></div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Create a new service Gig</h2>
          <form onSubmit={handleCreateGig} className="space-y-6 max-w-2xl">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Gig Title</label>
              <input required type="text" className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2 border text-gray-900" value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
              <textarea required rows={4} className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2 border text-gray-900" value={description} onChange={e => setDescription(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                <select className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2 border bg-white" value={category} onChange={e => setCategory(e.target.value)}>
                  <option>Web Development</option>
                  <option>Graphic Design</option>
                  <option>Digital Marketing</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Price (৳)</label>
                <input required type="number" className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2 border text-gray-900" value={price} onChange={e => setPrice(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Image URL (for secure display demo)</label>
              <input required type="url" placeholder="https://..." className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2 border text-gray-900" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
            </div>
            <button type="submit" className="bg-indigo-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-indigo-700 transition shadow-md">Publish Gig</button>
          </form>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span className="bg-indigo-100 text-indigo-800 w-8 h-8 rounded-full flex items-center justify-center text-sm">{orders.length}</span>
          Your Orders
        </h2>
        {orders.length === 0 ? (
          <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center">
             <p className="text-gray-500 text-lg font-medium">No orders found yet.</p>
          </div>
        ) : (
          <div className="bg-white shadow-sm border border-gray-100 rounded-2xl overflow-hidden overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Gig Details</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{isSeller ? "Buyer" : "Seller"}</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {orders.map((order: any) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                       <div className="font-bold text-gray-900 text-base">{order.gigId?.title || "Deleted Gig"}</div>
                       <div className="text-sm font-medium text-indigo-600 mt-1">৳{order.gigId?.price}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <div className="text-sm font-semibold text-gray-900">{isSeller ? order.buyerId?.name : order.sellerId?.name}</div>
                       <div className="text-xs text-gray-500">{isSeller ? "Buyer" : "Seller"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${order.status === 'completed' ? 'bg-green-100 text-green-800' : order.status === 'accepted' ? 'bg-indigo-100 text-indigo-800' : 'bg-amber-100 text-amber-800'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link href={`/orders/${order._id}`} className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg transition-colors font-bold">
                        Open Workspace
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
