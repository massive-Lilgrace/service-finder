"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  ShieldCheck,
  Star,
} from "lucide-react";

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  // 1. CHANGE YOUR CATEGORIES HERE ANYTIME:
  const categories = [
    { name: "Plumbing", icon: "🔧", count: "1200+ Providers", slug: "plumbing" },
    { name: "Electrical", icon: "💡", count: "1500+ Providers", slug: "electrical" },
    { name: "Cleaning", icon: "🧹", count: "1000+ Providers", slug: "cleaning" },
    { name: "AC Repair", icon: "❄️", count: "800+ Providers", slug: "ac-repair" },
    { name: "Carpentry", icon: "🪚", count: "900+ Providers", slug: "carpentry" },
    { name: "Painting", icon: "🎨", count: "700+ Providers", slug: "painting" },
  ];

  // 2. CHANGE YOUR FLOATING CARDS HERE ANYTIME:
  const floatingProviders = [
    {
      role: "Digital Creator",
      rating: "5.0",
      reviews: "240",
      image: "/avatar-creator.jpg",
      positionStyles: "absolute top-8 right-0 z-20",
      hasGreenDot: true,
    },
    {
      role: "Plumber",
      rating: "4.9",
      reviews: "98",
      image: "/avatar-plumber.jpg",
      positionStyles: "absolute top-1/2 -right-6 -translate-y-1/2 z-20",
      hasGreenDot: false,
    },
    {
      role: "Cleaner",
      rating: "4.7",
      reviews: "85",
      image: "/avatar-cleaner.jpg",
      positionStyles: "absolute bottom-8 right-0 z-20",
      hasGreenDot: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 overflow-hidden font-sans">

      {/* ================= HEADER ================= */}
      <header className="w-full bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="text-blue-600">
              <MapPin size={26} fill="currentColor" className="text-blue-600 group-hover:scale-110 transition" />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900">
              ServiFind
            </span>
          </Link>

          {/* NAVIGATION */}
          <nav className="hidden md:flex items-center gap-10">
            <a href="#home" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition">
              Home
            </a>
            <a href="#categories" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition">
              Categories
            </a>
            <Link href="/marketplace" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition">
              Marketplace
            </Link>
            <a href="#about" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition">
              About
            </a>
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition">
              Login
            </Link>
            <Link href="/provider-register" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition shadow-sm">
              List Your Service
            </Link>
          </div>
        </div>
      </header>

      {/* ================= HERO SECTION ================= */}
      <section id="home" className="relative bg-white pt-12 pb-20 lg:pt-16 lg:pb-24">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center">

          {/* LEFT CONTENT */}
          <div className="lg:col-span-6 space-y-6">
            <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-[1.15]">
              Find Trusted <br />
              Services Near You
            </h1>
            
            <p className="text-base text-slate-500 leading-relaxed max-w-xl">
              Connect with verified and reliable service providers in your area. Fast, easy, and trusted.
            </p>

            {/* SEARCH BAR */}
            <div className="bg-white border border-slate-200/80 rounded-full shadow-md p-2 flex flex-col md:flex-row items-center gap-2 max-w-2xl">
              <div className="flex-1 w-full relative flex items-center pl-4 border-r border-slate-100 md:h-10">
                <Search size={18} className="text-slate-400 mr-3 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="What service do you need?"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400 text-slate-800"
                />
              </div>

              <div className="flex-1 w-full relative flex items-center pl-4 md:h-10">
                <MapPin size={18} className="text-slate-400 mr-3 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Enter your address or location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400 text-slate-800"
                />
              </div>

              <Link
                href={`/marketplace?query=${encodeURIComponent(search)}&location=${encodeURIComponent(location)}`}
                className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition flex-shrink-0 shadow-sm"
              >
                <Search size={18} />
              </Link>
            </div>

            {/* POPULAR SEARCHES */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-2 text-xs">
              <span className="text-slate-400 font-medium">Popular Searches:</span>
              {["Plumber", "Electrician", "Cleaner", "AC Repair", "Carpenter"].map((item) => (
                <Link 
                  key={item} 
                  href={`/marketplace?query=${encodeURIComponent(item.toLowerCase())}`}
                  className="text-slate-600 hover:text-blue-600 font-medium transition"
                >
                  {item}{item !== "Carpenter" && ","}
                </Link>
              ))}
            </div>

            {/* STATS COUNTER */}
            <div className="grid grid-cols-4 gap-4 pt-6 border-t border-slate-100/80 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="text-blue-600 font-semibold text-lg">👤</span>
                <div>
                  <div className="text-base font-black text-slate-900 leading-none">100K+</div>
                  <div className="text-[10px] text-slate-400 font-medium mt-1">Service Providers</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-600 font-semibold text-lg">❤️</span>
                <div>
                  <div className="text-base font-black text-slate-900 line-none">250K+</div>
                  <div className="text-[10px] text-slate-400 font-medium mt-1">Happy Customers</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-600 font-semibold text-lg">💼</span>
                <div>
                  <div className="text-base font-black text-slate-900 leading-none">500+</div>
                  <div className="text-[10px] text-slate-400 font-medium mt-1">Service Categories</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-600 font-semibold text-lg">🕒</span>
                <div>
                  <div className="text-base font-black text-slate-900 leading-none">24/7</div>
                  <div className="text-[10px] text-slate-400 font-medium mt-1">Live Support</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT VISUAL CONTENT */}
          <div className="lg:col-span-6 relative flex justify-center items-center h-[480px]">
            {/* SOLID BACKDROP CIRCLE */}
            <div className="absolute w-[420px] h-[420px] bg-blue-600 rounded-full z-0 translate-x-6" />

            {/* CUTOUT TECHNICIAN ASSET */}
            <div className="relative w-[440px] h-[440px] z-10 overflow-hidden flex items-end justify-center">
              <img
                src="/worker-hero.png"
                alt="Verified Contractor"
                className="w-full h-[95%] object-contain object-bottom select-none pointer-events-none"
              />
            </div>

            {/* AUTOMATIC FLOATING CARDS LOOPER */}
            {floatingProviders.map((provider, index) => (
              <div key={index} className={`${provider.positionStyles} bg-white border border-slate-100 rounded-xl shadow-lg p-2.5 flex items-center gap-3 w-[190px]`}>
                <div className="w-9 h-9 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                  <img src={provider.image} alt={provider.role} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-bold text-slate-900 truncate">{provider.role}</p>
                    {provider.hasGreenDot && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-500 mt-0.5">
                    <Star size={10} fill="currentColor" className="text-amber-500" />
                    <span className="text-[10px] font-bold text-slate-700">{provider.rating}</span>
                    <span className="text-[9px] text-slate-400 font-medium">({provider.reviews})</span>
                  </div>
                </div>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* ================= POPULAR CATEGORIES ================= */}
      <section id="categories" className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Popular Categories
          </h2>
          <Link href="/marketplace" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
            View all categories &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link 
              key={cat.name} 
              href={`/marketplace?query=${encodeURIComponent(cat.slug)}`}
              className="bg-white border border-slate-100 rounded-xl p-5 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition group cursor-pointer"
            >
              <div className="text-2xl mb-3 group-hover:scale-110 transition duration-200">
                {cat.icon}
              </div>
              <h3 className="text-xs font-bold text-slate-800 mb-1">
                {cat.name}
              </h3>
              <p className="text-[10px] font-medium text-slate-400">
                {cat.count}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer id="about" className="w-full bg-white border-t border-slate-100 py-10 mt-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-6">
            
            {/* FOOTER LINKS */}
            <div className="flex items-center gap-8 text-xs font-bold text-slate-600">
              <a href="#home" className="hover:text-blue-600 transition">Home</a>
              <a href="#categories" className="hover:text-blue-600 transition">Categories</a>
              <Link href="/marketplace" className="hover:text-blue-600 transition">Marketplace</Link>
              <a href="#about" className="hover:text-blue-600 transition">About</a>
            </div>

            {/* SOCIAL SHARES */}
            <div className="flex items-center gap-4 text-slate-600">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition" aria-label="Facebook">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition" aria-label="Twitter">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition" aria-label="Instagram">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01"/>
                </svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition" aria-label="LinkedIn">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition" aria-label="YouTube">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
                  <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
                </svg>
              </a>
            </div>
          </div>

          {/* COMPLIANCE FOOTNOTE */}
          <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] font-medium text-slate-400 gap-2">
            <p>&copy; 2024 ServiFind. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
              <Link href="/terms" className="hover:underline">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}