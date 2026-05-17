// app/providers/page.tsx
"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, MapPin, Wrench, ShieldCheck, MessageSquare, Inbox, Loader2, User, Phone, Send, X } from "lucide-react";

// ==========================================
// 1. SELF-CONTAINED GUEST CHAT MODAL COMPONENT
// ==========================================
interface GuestChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  providerId: string;
  providerName: string;
}

function GuestChatModal({ isOpen, onClose, providerId, providerName }: GuestChatModalProps) {
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [initialMessage, setInitialMessage] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleMessageTransmission = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/messages/guest-initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          providerId,
          guestName,
          guestPhone,
          initialMessage
        })
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.message || "Failed to transmit message payload.");
      }

      setSuccess(true);
      setInitialMessage("");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-2xl overflow-hidden p-6 relative z-10 animate-in fade-in-50 zoom-in-95 duration-150 text-slate-900 font-medium">
        <button type="button" onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition p-1">
          <X size={18} />
        </button>

        {success ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-xl">✓</div>
            <h3 className="text-base font-black tracking-tight text-slate-900">Message Dispatched!</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
              Your inquiry has been piped directly onto <strong>{providerName}</strong>'s workshop dashboard.
            </p>
            <button type="button" onClick={() => { setSuccess(false); onClose(); }} className="mt-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider px-6 py-2.5 rounded-xl transition">
              Close Window
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><MessageSquare size={18} /></div>
              <div>
                <h3 className="text-sm font-black text-slate-900 tracking-tight">Message {providerName}</h3>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">No account required</p>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded-xl">
                {error}
              </div>
            )}

            <form onSubmit={handleMessageTransmission} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Your Full Name</label>
                <div className="relative flex items-center">
                  <User className="absolute left-4 text-slate-400" size={14} />
                  <input type="text" required placeholder="e.g. John Doe" value={guestName} onChange={e=>setGuestName(e.target.value)} className="w-full text-xs border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 bg-slate-50/50 outline-none focus:border-blue-600 focus:bg-white transition" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Contact Phone Line</label>
                <div className="relative flex items-center">
                  <Phone className="absolute left-4 text-slate-400" size={14} />
                  <input type="tel" required placeholder="e.g. +234..." value={guestPhone} onChange={e=>setGuestPhone(e.target.value)} className="w-full text-xs border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 bg-slate-50/50 outline-none focus:border-blue-600 focus:bg-white transition" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Describe Project / Inquiry</label>
                <textarea required placeholder="Outline your issue description clearly..." value={initialMessage} onChange={e=>setInitialMessage(e.target.value)} className="w-full text-xs border border-slate-200 rounded-xl p-3 bg-slate-50/50 outline-none h-24 focus:border-blue-600 focus:bg-white transition resize-none leading-relaxed" />
              </div>

              <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-xs uppercase tracking-widest py-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-100">
                {loading ? (
                  <span>Transmitting...</span>
                ) : (
                  <>
                    <span>Send Inquiry</span>
                    <Send size={12} />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 2. CORE MARKETPLACE CONTENT SECTION
// ==========================================
function MarketplaceContent() {
  const searchParams = useSearchParams();
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "");
  const [locationQuery, setLocationQuery] = useState(searchParams.get("location") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All Categories");

  const [activeChatMerchant, setActiveChatMerchant] = useState<any>(null);

  // Overwrite the categories array inside app/providers/page.tsx to include online vendors
const categories = [
  "All Categories",
  "Online Vendor",
  "Digital Services",
  "E-commerce",
  "Gadget Store",
  "Plumbing",
  "Electrical",
  "Cleaning"
];

  useEffect(() => {
    fetchMarketplaceCatalog();
  }, [searchParams, selectedCategory]);

  const fetchMarketplaceCatalog = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("query", searchQuery);
      if (locationQuery) params.append("location", locationQuery);
      if (selectedCategory && selectedCategory !== "All Categories") params.append("category", selectedCategory);

      const res = await fetch(`/api/providers?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProviders(data.providers || []);
      }
    } catch (err) {
      console.error("Failed loading marketplace feed loop:", err);
    } finally {
      setLoading(false);
    }
  };

  const executeCatalogSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMarketplaceCatalog();
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10 text-slate-900 text-xs font-semibold antialiased">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <form onSubmit={executeCatalogSearch} className="bg-white border border-slate-200 p-3 rounded-2xl shadow-sm flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full flex items-center">
            <Search className="absolute left-4 text-slate-400" size={16} />
            <input type="text" placeholder="Search trade specialists..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} className="w-full text-xs border border-slate-200 bg-slate-50/50 pl-11 pr-4 py-3 rounded-xl outline-none focus:border-blue-600 focus:bg-white transition" />
          </div>
          <div className="relative flex-1 w-full flex items-center">
            <MapPin className="absolute left-4 text-slate-400" size={16} />
            <input type="text" placeholder="Area or City (e.g. Ikeja)..." value={locationQuery} onChange={e=>setLocationQuery(e.target.value)} className="w-full text-xs border border-slate-200 bg-slate-50/50 pl-11 pr-4 py-3 rounded-xl outline-none focus:border-blue-600 focus:bg-white transition" />
          </div>
          <button type="submit" className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-black px-8 py-3.5 rounded-xl transition cursor-pointer text-[10px] uppercase tracking-wider">
            Search
          </button>
        </form>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          <aside className="w-full md:w-52 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-2 flex-shrink-0">
            <h3 className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider mb-2 px-1">Categories</h3>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`w-full text-left px-3 py-2 rounded-xl transition font-bold ${
                  selectedCategory === cat 
                    ? "bg-blue-50 text-blue-600 shadow-sm" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </aside>

          <main className="flex-1 w-full space-y-4">
            {loading ? (
              <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl">
                <Loader2 size={24} className="animate-spin text-blue-600 mx-auto" />
              </div>
            ) : providers.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center text-slate-400 space-y-2">
                <Inbox size={32} className="mx-auto text-slate-300" />
                <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider">No Stores Located</h3>
                <p className="text-[11px]">No local specialists found matching your search parameters inside XAMPP.</p>
              </div>
            ) : (
              providers.map((shop) => (
                <div key={shop.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-slate-300 transition group">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-200 relative overflow-hidden flex-shrink-0 shadow-inner">
                      {shop.avatarUrl ? (
                        <img src={shop.avatarUrl} alt="Store Mark" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300"><Wrench size={22} /></div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition tracking-tight leading-none">{shop.businessName}</h3>
                        {shop.isVerified === 1 && (
                          <ShieldCheck size={14} className="text-blue-600 flex-shrink-0" />
                        )}
                      </div>
                      <span className="text-[10px] font-extrabold text-blue-600 uppercase bg-blue-50/60 border border-blue-100/50 px-2 py-0.5 rounded-md inline-block">{shop.category}</span>
                      <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-1"><MapPin size={12} className="text-slate-400" /> {shop.address}, {shop.city}</p>
                    </div>
                  </div>

                  <button 
                    type="button"
                    onClick={() => setActiveChatMerchant(shop)}
                    className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] uppercase tracking-wider px-5 py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    <MessageSquare size={13} />
                    <span>Message Shop</span>
                  </button>
                </div>
              ))
            )}
          </main>
        </div>

        {activeChatMerchant && (
          <GuestChatModal 
            isOpen={!!activeChatMerchant} 
            onClose={() => setActiveChatMerchant(null)} 
            providerId={activeChatMerchant.id} 
            providerName={activeChatMerchant.businessName} 
          />
        )}

      </div>
    </div>
  );
}

// ==========================================
// 3. MASTER RE-EXPORT DEFINITION
// ==========================================
export default function ProvidersMarketplacePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 size={24} className="animate-spin text-blue-600" />
      </div>
    }>
      <MarketplaceContent />
    </Suspense>
  );
}