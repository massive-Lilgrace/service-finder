"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MapPin, Phone, Mail, MessageSquare, ArrowLeft, Star, ShieldCheck, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function ProviderPublicProfile() {
  const params = useParams();
  const router = useRouter();
  const providerId = params.id;

  const [provider, setProvider] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!providerId) return;

    fetch(`/api/providers/${providerId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProvider(data.provider);
        } else {
          setError(data.message || "Failed to load provider profile.");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Network connection error.");
        setLoading(false);
      });
  }, [providerId]);

  const handleInitiateChat = async () => {
    // This connects the customer directly to the client chat workspace 
    alert("Opening secure chat connection terminal with provider...");
    router.push("/dashboard/provider/messages");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-400 text-xs font-semibold antialiased">
        Loading provider profile structure...
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4 text-slate-800 p-4 antialiased">
        <p className="text-xs font-bold text-red-500">{error || "Profile not found"}</p>
        <Link href="/" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
          <ArrowLeft size={14} /> Back to marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen p-4 md:p-8 text-slate-800 antialiased font-medium">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Navigation Breadcrumb Line Row */}
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-bold hover:text-slate-900 transition mb-2">
          <ArrowLeft size={14} /> Back to results
        </Link>

        {/* Master Profile Layout Grid Grid Structure */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Left Column Component Card (Business Cards and Credentials Details) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Header Identity Core Block Card */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl font-black flex items-center justify-center text-lg uppercase shadow-md shadow-blue-100">
                    {provider.companyName?.substring(0, 2)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h1 className="text-xl font-black text-slate-900 tracking-tight">{provider.companyName}</h1>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-black bg-emerald-50 text-emerald-600 border border-emerald-100">
                        <ShieldCheck size={10} /> Verified Provider
                      </span>
                    </div>
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">{provider.category}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="text-center sm:text-right">
                    <div className="flex items-center gap-1 justify-center sm:justify-end text-amber-500 font-black text-sm">
                      <Star size={16} fill="currentColor" /> 4.9
                    </div>
                    <p className="text-[10px] text-slate-400 font-semibold">(122 reviews)</p>
                  </div>
                </div>
              </div>

              {/* Location Address Mapping Group Line */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 pt-4 border-t border-slate-100 text-xs font-bold text-slate-500">
                <div className="flex items-center gap-1.5">
                  <MapPin size={16} className="text-slate-400" />
                  <span>{provider.address || "Lagos, Nigeria"}</span>
                </div>
                <div className="text-blue-600 hover:underline cursor-pointer text-[11px]">View on map</div>
              </div>
            </div>

            {/* Business Bio Descriptive Text Context Block Card */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-sm font-black text-slate-900 tracking-tight uppercase tracking-wider text-slate-400">About Us</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {provider.bio || "This registered service provider hasn't updated their business profile description yet."}
              </p>
            </div>

          </div>

          {/* Right Column Component Block Card (Action Operations and Pricing) */}
          <div className="space-y-6">
            
            {/* Quick Pricing Call Fee Actions Container Panel Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Service Call Fee</span>
                <div className="text-2xl font-black text-slate-900">
                  ₦5,000 <span className="text-xs font-semibold text-slate-400">base fee</span>
                </div>
                <p className="text-[9px] text-slate-400 font-semibold leading-tight pt-0.5">Price may vary depending on exact job details.</p>
              </div>

              {/* Functional CTA Interactive Control Buttons Block */}
              <div className="space-y-2">
                <button 
                  onClick={handleInitiateChat}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-md shadow-blue-100 cursor-pointer"
                >
                  <MessageSquare size={14} /> Message Provider
                </button>
                <button 
                  onClick={() => alert("Booking request submitted downstream to local server workflow system container instances.")}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3.5 rounded-xl transition cursor-pointer"
                >
                  Request Booking Service
                </button>
              </div>

              {/* Dynamic Offerings List Group List Element Node mapping block array */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h4 className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Our Services Include</h4>
                <div className="space-y-2">
                  {provider.services && provider.services.length > 0 ? (
                    provider.services.map((s: any, idx: number) => (
                      <div key={idx} className="flex items-start gap-2 text-xs font-semibold text-slate-700">
                        <CheckCircle size={14} className="text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                          <span className="truncate">{s.title}</span>
                          <span className="text-slate-900 font-black flex-shrink-0">₦{parseFloat(s.price).toLocaleString()}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                        <CheckCircle size={14} className="text-slate-300" /> Standard Troubleshooting Fixes
                      </div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                        <CheckCircle size={14} className="text-slate-300" /> Emergency Diagnostic Calls
                      </div>
                    </>
                  )}
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}