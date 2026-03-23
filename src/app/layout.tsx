import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "FiverrClone — Find Freelance Services | Bangladesh",
  description: "Hire talented freelancers for web development, graphic design, digital marketing, and more. Pay securely with bKash.",
  keywords: "freelance, fiverr, bangladesh, bkash, gigs, web development, graphic design",
  openGraph: {
    title: "FiverrClone — Find Freelance Services",
    description: "Hire talented freelancers and pay securely with bKash.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen bg-slate-50">
            {children}
          </main>
          <footer className="border-t border-gray-200 bg-white mt-16">
            <div className="max-w-7xl mx-auto px-4 py-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                      <span className="text-white font-black text-sm">F</span>
                    </div>
                    <span className="text-lg font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">FiverrClone</span>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">A marketplace for freelance services with secure bKash payment processing.</p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-3">Quick Links</h4>
                  <ul className="space-y-2 text-sm text-gray-500">
                    <li><a href="/" className="hover:text-indigo-600 transition-colors">Browse Gigs</a></li>
                    <li><a href="/register" className="hover:text-indigo-600 transition-colors">Become a Seller</a></li>
                    <li><a href="/login" className="hover:text-indigo-600 transition-colors">Sign In</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-3">Payment</h4>
                  <div className="flex items-center gap-2">
                    <div className="bg-[#E2136E] text-white text-xs font-bold px-3 py-1.5 rounded-lg">bKash</div>
                    <span className="text-sm text-gray-500">Secure offline payments</span>
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-gray-100 text-center text-xs text-gray-400">
                © 2026 FiverrClone · Built by Anik · Powered by Next.js & MongoDB
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
