"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, MapPin, Star, Wrench, Flashlight, Trash2, Snowflake, Hammer, Paintbrush, Phone, MessageSquare, ShieldCheck } from "lucide-react";

export default function LandingPage() {
  const [providers, setProviders] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const categoryQuery = selectedCategory ? `&query=${encodeURIComponent(selectedCategory)}` : `&query=${encodeURIComponent(query)}`;
    fetch(`/api/search?location=${encodeURIComponent(location)}${categoryQuery}`)
      .then((res) => res.json())
      .then((data) => setProviders(data.success ? data.data : data || []))
      .catch((err) => console.error("Search fetch error:", err));
  }, [query, location, selectedCategory]);

  const categories = [
    { name: "Plumbing", icon: <Wrench size={18} />, color: "text-blue-600 bg-blue-50 border-blue-100", count: "150+ Providers" },
    { name: "Electrical", icon: <Flashlight size={18} />, color: "text-amber-600 bg-amber-50 border-amber-100", count: "120+ Providers" },
    { name: "Cleaning", icon: <Trash2 size={18} />, color: "text-emerald-600 bg-emerald-50 border-emerald-100", count: "200+ Providers" },
    { name: "AC Repair", icon: <Snowflake size={18} />, color: "text-cyan-600 bg-cyan-50 border-cyan-100", count: "80+ Providers" },
    { name: "Carpentry", icon: <Hammer size={18} />, color: "text-orange-600 bg-orange-50 border-orange-100", count: "100+ Providers" },
    { name: "Painting", icon: <Paintbrush size={18} />, color: "text-purple-600 bg-purple-50 border-purple-100", count: "90+ Providers" }
  ];

  return (
    <div className="bg-white min-h-screen text-slate-900 antialiased font-medium selection:bg-blue-600/10 scroll-smooth">
      
      {/* 1. Header Navigation Bar */}
      <header className="border-b border-slate-100 bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setQuery(""); setLocation(""); setSelectedCategory(""); }}>
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm">S</div>
            <span className="font-black text-xl text-slate-900 tracking-tight">ServiFind</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-500">
            <Link href="/" className="text-blue-600 font-extrabold hover:text-blue-700 transition">Home</Link>
            <a href="#categories-section" className="hover:text-slate-900 transition">Categories</a>
            {/* Replaced 'How It Works' with 'Shops' targeting directory anchor below */}
            <a href="#shops-section" className="hover:text-slate-900 transition font-extrabold text-slate-900 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">Shops</a>
            <Link href="/about" className="hover:text-slate-900 transition">About Us</Link>
          </nav>

          <div className="flex items-center gap-4 text-xs font-bold">
            <Link href="/login" className="text-slate-600 hover:text-slate-900 transition">Login</Link>
            <Link href="/provider-register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl transition shadow-sm shadow-blue-100">
              List Your Service
            </Link>
          </div>

        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-12 pb-20 space-y-20">
        
        {/* 2. Hero Component */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Find Trusted <br />
              <span className="text-blue-600">Services</span> Near <br />
              You
            </h1>
            <p className="text-sm text-slate-400 font-semibold max-w-md leading-relaxed">
              Connect with verified and reliable service providers in your area. Fast, easy, and trusted.
            </p>

            <div className="bg-slate-100/80 border border-slate-200/60 p-2 rounded-2xl flex flex-col sm:flex-row gap-2 max-w-xl shadow-inner">
              <div className="flex flex-1 items-center gap-2 px-3">
                <Search className="text-slate-400 flex-shrink-0" size={16} />
                <input 
                  type="text" 
                  placeholder="What service do you need?" 
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setSelectedCategory(""); }}
                  className="w-full text-xs bg-transparent outline-none py-2 text-slate-800 font-semibold" 
                />
              </div>
              <div className="w-px h-6 bg-slate-200 hidden sm:block self-center" />
              <div className="flex flex-1 items-center gap-2 px-3">
                <MapPin className="text-slate-400 flex-shrink-0" size={16} />
                <input 
                  type="text" 
                  placeholder="Enter your location" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full text-xs bg-transparent outline-none py-2 text-slate-800 font-semibold" 
                />
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition shadow-md shadow-blue-100 cursor-pointer">
                Search
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-72 h-72 md:w-80 md:h-80 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-400 text-xs font-bold uppercase tracking-wider shadow-inner select-none">
              Provider Image
            </div>
          </div>
        </div>

        {/* 3. Stats section */}
        <div className="grid grid-cols-3 gap-4 max-w-xl pt-6 border-t border-slate-100">
          <div>
            <h3 className="text-xl font-black text-slate-900">10K+</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Happy Days Ahead</p>
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">25K+</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Jobs Completed</p>
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">50+</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Service Types</p>
          </div>
        </div>

        {/* 4. Popular Categories Card Grid Layout Section */}
        <div id="categories-section" className="space-y-6 pt-10 border-t border-slate-100 scroll-mt-24">
          <div className="flex items-end justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Popular Categories</h2>
              <p className="text-xs font-semibold text-slate-400">Explore the best services by category</p>
            </div>
            {selectedCategory && (
              <button onClick={() => setSelectedCategory("")} className="text-xs font-bold text-blue-600 hover:underline">
                Clear Category Filter &times;
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, idx) => (
              <div 
                key={idx} 
                onClick={() => { setSelectedCategory(cat.name); setQuery(""); }}
                className={`p-5 rounded-2xl border text-center space-y-4 cursor-pointer transition flex flex-col items-center justify-center ${selectedCategory === cat.name ? "border-blue-600 bg-blue-50/50 shadow-sm" : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${cat.color}`}>
                  {cat.icon}
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-black text-slate-900">{cat.name}</h4>
                  <p className="text-[10px] text-slate-400 font-semibold">{cat.count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Shops Directory Layout (Matches your layout picture exactly) */}
        <div id="shops-section" className="space-y-6 pt-10 border-t border-slate-100 scroll-mt-24">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Active Shops & Stores</h2>
            <p className="text-xs font-semibold text-slate-400">Browse different registered providers card stores live</p>
          </div>
          
          {providers.length > 0 ? (
            <div className="space-y-4">
              {providers.map((p, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-5 transition hover:shadow-md">
                  
                  {/* Left Side Logo Placeholder Box */}
                  <div className="w-24 h-24 bg-slate-100 border border-slate-200 text-slate-400 rounded-2xl font-bold text-xs flex flex-col items-center justify-center text-center p-2 flex-shrink-0 select-none">
                    <span>[Store</span>
                    <span>Logo]</span>
                  </div>

                  {/* Center Content Metadata Box */}
                  <div className="flex-1 space-y-3 min-w-0 w-full">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-black text-lg text-slate-900 tracking-tight truncate">{p.companyName}</h3>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-black bg-emerald-50 text-emerald-600 border border-emerald-100 flex-shrink-0">
                        <ShieldCheck size={10} /> Verified Provider
                      </span>
                    </div>

                    {/* Ratings & Real Database Location Address Text Line */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-400 text-xs font-semibold">
                      <div className="flex items-center gap-0.5 text-amber-500 font-bold">
                        <Star size={12} fill="currentColor" /> 4.9 <span className="text-slate-400 font-semibold text-[10px] ml-0.5">(122 reviews)</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] truncate max-w-xs md:max-w-md">
                        <MapPin size={12} className="text-slate-300" /> {p.address || "78 Allen Avenue, Ikeja, Lagos, Nigeria"}
                      </div>
                    </div>

                    {/* Functional Operational Buttons Area Block */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button onClick={() => alert("Dialing store service representative...")} className="border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer">
                        <Phone size={13} className="text-slate-400" /> Call
                      </button>
                      <Link href={`/dashboard/provider/messages`} className="border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5">
                        <MessageSquare size={13} className="text-slate-400" /> Message
                      </Link>
                      <Link href={`/providers/${p.id}`} className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-sm shadow-blue-100 ml-auto md:ml-2">
                        Request Service
                      </Link>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-slate-400 border border-dashed rounded-2xl bg-slate-50/50 font-semibold">
              No matching business shops found in this setup registry context.
            </div>
          )}
        </div>

      </main>
    </div>
  );
}