"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("buyer");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });
      if (res.ok) {
        router.push("/login");
      } else {
        const data = await res.json();
        setError(data.message || "Something went wrong");
      }
    } catch {
      setError("Failed to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 relative overflow-hidden flex-col justify-between p-12">
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
            Start your journey<br/>
            <span className="text-yellow-300">as a freelancer!</span>
          </h2>
          <p className="text-white/70 text-lg leading-relaxed">
            Create your free account and start buying or selling services today with secure bKash payments.
          </p>
        </div>
        <div className="relative grid grid-cols-2 gap-4">
          {[
            { icon: "🛒", label: "Buyer", desc: "Hire top talent" },
            { icon: "💼", label: "Seller", desc: "Earn with skills" },
            { icon: "📱", label: "bKash Pay", desc: "Secure & fast" },
            { icon: "🔒", label: "Protected", desc: "Safe workspace" },
          ].map(item => (
            <div key={item.label} className="bg-white/10 rounded-xl p-4 border border-white/10">
              <div className="text-2xl mb-1">{item.icon}</div>
              <div className="text-white font-bold text-sm">{item.label}</div>
              <div className="text-white/60 text-xs">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md animate-slide-up">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-gray-900">Create your account</h1>
            <p className="text-gray-500 mt-2 font-medium">Already have an account?{" "}
              <Link href="/login" className="text-indigo-600 font-bold hover:text-indigo-700">Sign in here</Link>
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
                <label htmlFor="reg-name" className="block text-sm font-bold text-gray-700 mb-1.5">Full Name</label>
                <input id="reg-name" type="text" required placeholder="Your name"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none font-medium transition-colors bg-gray-50 focus:bg-white"
                  value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div>
                <label htmlFor="reg-email" className="block text-sm font-bold text-gray-700 mb-1.5">Email address</label>
                <input id="reg-email" type="email" required placeholder="you@example.com"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none font-medium transition-colors bg-gray-50 focus:bg-white"
                  value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>

              <div>
                <label htmlFor="reg-password" className="block text-sm font-bold text-gray-700 mb-1.5">Password</label>
                <input id="reg-password" type="password" required placeholder="Min. 8 characters"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none font-medium transition-colors bg-gray-50 focus:bg-white"
                  value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Account Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {["buyer", "seller"].map(r => (
                    <button type="button" key={r} onClick={() => setRole(r)}
                      className={`py-4 rounded-xl border-2 font-bold text-sm transition-all capitalize flex flex-col items-center gap-1 ${
                        role === r
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700 shadow-md shadow-indigo-100"
                          : "border-gray-200 text-gray-600 hover:border-indigo-300"
                      }`}>
                      <span className="text-2xl">{r === "buyer" ? "🛒" : "💼"}</span>
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-200 hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base">
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Creating account...</>
                ) : "Create Free Account 🚀"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
