"use client";

import { useEffect, useState } from "react";
import SecureImage from "@/components/SecureImage";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Home() {
  const [gigs, setGigs] = useState([]);
  const { data: session } = useSession();

  useEffect(() => {
    fetch("/api/gigs")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setGigs(data as never[]);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900">Popular Services</h1>
          <p className="mt-2 text-lg text-gray-600">Find the perfect freelance services for your business</p>
        </div>
        <div className="flex gap-4">
          {session ? (
            <>
              <Link href="/dashboard" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                Dashboard
              </Link>
              <button onClick={() => signOut()} className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Logout
              </button>
            </>
          ) : (
             <Link href="/login" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                Sign In
             </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {gigs.map((gig: any) => (
          <Link href={`/gigs/${gig._id}`} key={gig._id} className="group block">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1">
              <div className="h-56 bg-gray-200 relative">
                <SecureImage src={gig.imageUrl || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800"} alt={gig.title} className="w-full h-full" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-700">
                  {gig.category}
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                    {gig.sellerId?.name?.charAt(0) || "S"}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{gig.sellerId?.name || "Seller"}</span>
                </div>
                <h3 className="font-bold text-lg text-gray-900 line-clamp-2 min-h-[56px] group-hover:text-indigo-600 transition-colors">{gig.title}</h3>
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Starting at</span>
                  <span className="font-extrabold text-xl text-gray-900">৳{gig.price}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {gigs.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <h3 className="text-xl font-medium text-gray-900">No gigs available</h3>
          <p className="mt-2 text-gray-500">Check back later or sign in as a seller to create one!</p>
        </div>
      )}
    </div>
  );
}
