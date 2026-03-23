"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password. Please try again.");
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
        />
        <div className="relative">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-lg">F</span>
            </div>
            <span className="text-white font-black text-2xl">FiverrClone</span>
          </div>
          <h2 className="text-white text-4xl font-black leading-tight mb-6">
            Welcome back,<br/>
            <span className="text-yellow-300">great to see you!</span>
          </h2>
          <p className="text-white/70 text-lg leading-relaxed">
            Sign in to manage your gigs, track your orders, and grow your freelance business.
          </p>
        </div>
        <div className="relative space-y-4">
          {["Secure bKash payments", "Buyer & Seller roles", "Image-protected gigs"].map(item => (
            <div key={item} className="flex items-center gap-3 text-white/80">
              <div className="w-5 h-5 rounded-full bg-green-400/30 border border-green-400/50 flex items-center justify-center shrink-0">
                <span className="text-green-300 text-xs">✓</span>
              </div>
              <span className="text-sm font-medium">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md animate-slide-up">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-gray-900">Sign in to your account</h1>
            <p className="text-gray-500 mt-2 font-medium">Don&apos;t have an account?{" "}
              <Link href="/register" className="text-indigo-600 font-bold hover:text-indigo-700">Register free</Link>
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm font-medium px-4 py-3 rounded-xl flex items-center gap-2">
                  <span>⚠️</span> {error}
                </div>
              )}

              <div>
                <label htmlFor="login-email" className="block text-sm font-bold text-gray-700 mb-1.5">Email address</label>
                <input
                  id="login-email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none text-gray-900 font-medium transition-colors bg-gray-50 focus:bg-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="login-password" className="block text-sm font-bold text-gray-700 mb-1.5">Password</label>
                <input
                  id="login-password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none text-gray-900 font-medium transition-colors bg-gray-50 focus:bg-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-200 hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
              >
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Signing in...</>
                ) : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
