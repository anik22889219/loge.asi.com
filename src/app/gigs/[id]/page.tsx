"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SecureImage from "@/components/SecureImage";
import { useSession } from "next-auth/react";

export default function GigDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [gig, setGig] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/gigs/${id}`)
      .then((res) => res.json())
      .then(setGig);
  }, [id]);

  if (!gig) return <div className="text-center mt-20 text-gray-500">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">{gig.title}</h1>
          <div className="flex items-center space-x-4 border-b pb-6">
             <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 text-xl font-bold">
               {gig.sellerId?.name?.charAt(0) || "S"}
             </div>
             <div>
               <div className="text-lg font-semibold text-gray-900">{gig.sellerId?.name || "Seller name"}</div>
               <div className="text-sm text-gray-500">{gig.category}</div>
             </div>
          </div>
          
          <div className="h-96 rounded-2xl overflow-hidden shadow-xl border border-gray-100 bg-gray-50 flex items-center justify-center">
            <SecureImage src={gig.imageUrl || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80"} alt={gig.title} className="w-full h-full object-cover" />
          </div>
          
          <div className="prose max-w-none prose-lg">
            <h2 className="text-2xl font-bold text-gray-900">About this service</h2>
            <p className="whitespace-pre-wrap text-gray-700 leading-relaxed mt-4">{gig.description}</p>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white border-2 border-indigo-50 shadow-2xl rounded-2xl p-8 sticky top-8">
            <div className="flex justify-between items-end mb-6">
              <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Package</span>
              <span className="text-4xl font-extrabold text-gray-900">৳{gig.price}</span>
            </div>
            
            <p className="text-gray-600 mb-8 font-medium">Standard delivery time based on seller preference.</p>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-gray-700"><span className="text-green-500 mr-3">✔</span> Secure Payment</li>
              <li className="flex items-center text-gray-700"><span className="text-green-500 mr-3">✔</span> Content Protected</li>
              <li className="flex items-center text-gray-700"><span className="text-green-500 mr-3">✔</span> Dedicated Order Page</li>
            </ul>

            {session ? (
              (session.user as any).role === "buyer" ? (
                <button
                  onClick={() => router.push(`/checkout/${gig._id}`)}
                  className="w-full bg-indigo-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg flex justify-center items-center group"
                >
                  Continue to Checkout <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </button>
              ) : (
                 <div className="text-center p-4 bg-orange-50 text-orange-800 rounded-lg text-sm font-semibold border border-orange-200">
                    Sellers cannot order gigs. Please log in as a buyer.
                 </div>
              )
            ) : (
               <button
                  onClick={() => router.push('/login')}
                  className="w-full bg-gray-900 text-white font-bold py-4 px-6 rounded-xl hover:bg-black transition-colors shadow-md"
                >
                  Sign in to Order
               </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
