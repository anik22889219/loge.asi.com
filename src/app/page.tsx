"use client";

import React, { useEffect, useState } from "react";
import SecureImage from "@/components/SecureImage";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const CATEGORIES = ["All", "Web Development", "Graphic Design", "Digital Marketing"];

const HERO_STATS = [
  { label: "Active Sellers", value: "500+" },
  { label: "Gigs Available", value: "1,200+" },
  { label: "Happy Clients", value: "3,000+" },
];

function HomeContent() {
  const [gigs, setGigs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";

  useEffect(() => {
    setLoading(true);
    fetch("/api/gigs")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setGigs(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = gigs.filter((gig: any) => {
    const matchCat = activeCategory === "All" || gig.category === activeCategory;
    const matchQ = !q || gig.title?.toLowerCase().includes(q.toLowerCase()) || gig.description?.toLowerCase().includes(q.toLowerCase());
    return matchCat && matchQ;
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 text-white">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
        />
        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-28">
          <div className="max-w-3xl animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-semibold px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Bangladesh&apos;s Freelance Marketplace
            </div>
            <h1 className="text-5xl sm:text-6xl font-black leading-tight tracking-tight mb-6">
              Find the Perfect
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                Freelance Service
              </span>
            </h1>
            <p className="text-xl text-white/80 font-medium leading-relaxed mb-10 max-w-2xl">
              Connect with skilled freelancers. Pay securely with bKash. Get your project done on time, every time.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/register?role=seller"
                className="bg-white text-indigo-900 font-bold px-8 py-4 rounded-2xl hover:bg-indigo-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 text-base">
                Start Selling
              </Link>
              <Link href="#gigs"
                className="bg-white/10 border border-white/30 text-white font-bold px-8 py-4 rounded-2xl hover:bg-white/20 transition-all text-base backdrop-blur-sm">
                Browse Gigs ↓
              </Link>
            </div>
            <div className="mt-14 flex gap-10 flex-wrap">
              {HERO_STATS.map(s => (
                <div key={s.label}>
                  <div className="text-3xl font-black text-white">{s.value}</div>
                  <div className="text-sm text-white/60 font-medium mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 28C840 36 960 40 1080 38C1200 36 1320 28 1380 24L1440 20V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0Z" fill="#f8fafc"/>
          </svg>
        </div>
      </section>

      {/* How bKash Works */}
      <section className="bg-gradient-to-r from-rose-50 to-pink-50 border-b border-rose-100 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start">
            <div className="bg-[#E2136E] text-white text-xs font-black px-3 py-1.5 rounded-lg tracking-wide">bKash</div>
            <span className="text-sm font-semibold text-gray-700">Pay securely offline —</span>
            <span className="text-sm text-gray-600">Send money via bKash · Share TrxID · Seller verifies · Order starts</span>
            <span className="ml-auto text-xs text-gray-400 hidden sm:block">Secure · Transparent · Trusted</span>
          </div>
        </div>
      </section>

      {/* Gig Listings */}
      <section id="gigs" className="max-w-7xl mx-auto px-4 py-16">
        {/* Heading + filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">
              {q ? `Results for "${q}"` : "Popular Services"}
            </h2>
            <p className="text-gray-500 mt-1 font-medium">
              {filtered.length} service{filtered.length !== 1 ? "s" : ""} available
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeCategory === cat
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-52 bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-900">No gigs found</h3>
            <p className="mt-2 text-gray-500 font-medium">
              {q ? `No results for "${q}". Try a different search.` : "No gigs yet. Be the first to post one!"}
            </p>
            <Link href="/register" className="mt-6 inline-block bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors">
              Post a Gig
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((gig: any) => (
              <Link href={`/gigs/${gig._id}`} key={gig._id} className="group block card-hover">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="h-52 bg-gray-100 relative overflow-hidden">
                    <SecureImage
                      src={gig.imageUrl || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800"}
                      alt={gig.title}
                      className="w-full h-full"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-indigo-700 shadow-sm border border-indigo-100">
                        {gig.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {gig.sellerId?.name?.charAt(0)?.toUpperCase() || "S"}
                      </div>
                      <span className="text-sm font-semibold text-gray-600 truncate">
                        {gig.sellerId?.name || "Seller"}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 line-clamp-2 min-h-[48px] group-hover:text-indigo-600 transition-colors leading-snug">
                      {gig.title}
                    </h3>
                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                      <span className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Starting at</span>
                      <span className="font-black text-xl text-gray-900">৳{gig.price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* CTA Banner */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-700 py-16 mt-8">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-extrabold mb-4">Ready to start selling?</h2>
          <p className="text-indigo-200 text-lg font-medium mb-8">Join thousands of sellers earning with their skills</p>
          <Link href="/register"
            className="inline-block bg-white text-indigo-700 font-black px-10 py-4 rounded-2xl hover:bg-indigo-50 transition-all shadow-2xl hover:-translate-y-1 text-lg">
            Create Free Account
          </Link>
        </div>
      </section>
    </div>
  );
}

export default function Home() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <HomeContent />
    </React.Suspense>
  );
}
