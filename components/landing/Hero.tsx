"use client";

import { useRouter } from "next/navigation";
import { Search, MapPin } from "lucide-react";

export default function Hero() {
  const router = useRouter();

  const handleSearch = () => {
    // Navigates directly to your new search page route
    router.push("/search");
  };

  return (
    <section className="bg-slate-50 py-12 md:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Side Content */}
        <div className="lg:col-span-7 space-y-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight">
            Find Trusted <br />
            <span className="text-blue-600">Services Near You</span>
          </h1>
          
          <p className="text-base sm:text-lg text-slate-600 max-w-xl">
            Connect with verified and reliable service providers in your area. Fast, easy, and trusted.
          </p>

          {/* Search Inputs */}
          <div className="bg-white p-3 rounded-2xl shadow-xl border border-slate-100 flex flex-col md:flex-row items-center gap-3 max-w-2xl">
            <div className="w-full flex items-center px-2 gap-2 md:border-r border-slate-200 py-1">
              <Search className="text-blue-600 shrink-0" size={20} />
              <input 
                type="text" 
                placeholder="What service do you need?" 
                className="w-full bg-transparent focus:outline-none text-sm text-slate-800"
              />
            </div>
            
            <div className="w-full flex items-center px-2 gap-2 py-1">
              <MapPin className="text-blue-600 shrink-0" size={20} />
              <input 
                type="text" 
                placeholder="Enter your location" 
                className="w-full bg-transparent focus:outline-none text-sm text-slate-800"
              />
            </div>
            
            <button 
              onClick={handleSearch}
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-xl text-sm transition-all shadow-md shrink-0"
            >
              Search
            </button>
          </div>

          {/* Impact Metrics */}
          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-200">
            <div>
              <p className="text-2xl font-extrabold text-slate-900">10K+</p>
              <p className="text-xs text-slate-500 font-medium">Service Providers</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900">25K+</p>
              <p className="text-xs text-slate-500 font-medium">Happy Customers</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900">50+</p>
              <p className="text-xs text-slate-500 font-medium">Categories</p>
            </div>
          </div>
        </div>

        {/* Right Side Image Graphics Placeholder */}
        <div className="lg:col-span-5 hidden lg:flex items-center justify-center">
          <div className="w-80 h-80 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-400 font-medium text-sm">
            Provider Image
          </div>
        </div>

      </div>
    </section>
  );
}