// app/marketplace/page.tsx
"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  MapPin,
  MessageSquare,
  Inbox,
  Loader2,
  Compass,
  User,
  Phone,
  Send,
  X,
  CalendarDays,
} from "lucide-react";

// ==========================================
// 1. SELF-CONTAINED GUEST CHAT MODAL COMPONENT
// ==========================================
interface GuestChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  providerId: string;
  providerName: string;
}

function GuestChatModal({
  isOpen,
  onClose,
  providerId,
  providerName,
}: GuestChatModalProps) {
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [initialMessage, setInitialMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleMessageTransmission = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "/api/messages/guest-initiate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            providerId,
            guestName,
            guestPhone,
            initialMessage,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(
          data.message ||
            "Failed to transmit message payload."
        );
      }

      setSuccess(true);
      setInitialMessage("");
    } catch (err: any) {
      setError(
        err.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-2xl overflow-hidden p-6 relative z-10 text-slate-900 font-medium">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition p-1"
        >
          <X size={18} />
        </button>

        {success ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-xl">
              ✓
            </div>

            <h3 className="text-base font-black tracking-tight text-slate-900">
              Message Dispatched!
            </h3>

            <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
              Your inquiry has been piped directly onto{" "}
              <strong>{providerName}</strong>'s dashboard.
            </p>

            <button
              type="button"
              onClick={() => {
                setSuccess(false);
                onClose();
              }}
              className="mt-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider px-6 py-2.5 rounded-xl transition"
            >
              Close Window
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <MessageSquare size={18} />
              </div>

              <div>
                <h3 className="text-sm font-black text-slate-900 tracking-tight">
                  Message {providerName}
                </h3>

                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  No account required
                </p>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded-xl">
                {error}
              </div>
            )}

            <form
              onSubmit={handleMessageTransmission}
              className="space-y-4"
            >
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                  Your Full Name
                </label>

                <div className="relative flex items-center">
                  <User
                    className="absolute left-4 text-slate-400"
                    size={14}
                  />

                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={guestName}
                    onChange={(e) =>
                      setGuestName(e.target.value)
                    }
                    className="w-full text-xs border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 bg-slate-50/50 outline-none focus:border-blue-600 focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                  Contact Phone Line
                </label>

                <div className="relative flex items-center">
                  <Phone
                    className="absolute left-4 text-slate-400"
                    size={14}
                  />

                  <input
                    type="tel"
                    required
                    placeholder="e.g. +234..."
                    value={guestPhone}
                    onChange={(e) =>
                      setGuestPhone(e.target.value)
                    }
                    className="w-full text-xs border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 bg-slate-50/50 outline-none focus:border-blue-600 focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                  Describe Project / Inquiry
                </label>

                <textarea
                  required
                  placeholder="Outline your issue description clearly..."
                  value={initialMessage}
                  onChange={(e) =>
                    setInitialMessage(e.target.value)
                  }
                  className="w-full text-xs border border-slate-200 rounded-xl p-3 bg-slate-50/50 outline-none h-24 focus:border-blue-600 focus:bg-white transition resize-none leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-xs uppercase tracking-widest py-3 rounded-xl transition flex items-center justify-center gap-2"
              >
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
// 2. CORE MARKETPLACE MOVEMENT FRAME
// ==========================================
function MarketplaceDirectoryContent() {
  const searchParams = useSearchParams();

  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("query") || ""
  );

  const [locationQuery, setLocationQuery] = useState(
    searchParams.get("location") || ""
  );

  const [selectedCategory, setSelectedCategory] =
    useState(
      searchParams.get("category") ||
        "All Categories"
    );

  const [activeChatMerchant, setActiveChatMerchant] =
    useState<any>(null);

  // ==========================================
  // DEFAULT MARKETPLACE CATEGORIES
  // ==========================================
  const defaultIndustries = [
    "All Categories",

    // STORES
    "Online Vendor",
    "E-commerce Store",
    "Fashion & Apparel",
    "Gadgets & Tech",

    // SERVICES
    "Plumbing",
    "Electrical",
    "Cleaning",
    "Graphic Design",
    "Digital Marketing",
    "Photoshoot",
    "Videographer",
    "Photography",
    "Catering",
    "Makeup Artist",
    "Barbing",
    "Hair Stylist",
    "Laundry",
    "Carpentry",
    "Mechanic",
    "POP Installation",
    "Tiles Installation",
    "Painting",
    "Interior Decoration",
    "MC & Event Hosting",
  ];

  const [industries, setIndustries] =
    useState<string[]>(defaultIndustries);

  // ==========================================
  // SERVICE CATEGORIES
  // ==========================================
  const serviceCategories = [
    "Plumbing",
    "Electrical",
    "Cleaning",
    "Graphic Design",
    "Digital Marketing",
    "Photoshoot",
    "Videographer",
    "Photography",
    "Catering",
    "Makeup Artist",
    "Barbing",
    "Hair Stylist",
    "Laundry",
    "Carpentry",
    "Mechanic",
    "POP Installation",
    "Tiles Installation",
    "Painting",
    "Interior Decoration",
    "MC & Event Hosting",
  ];

  const isServiceCategory = (
    category: string
  ) => {
    return serviceCategories.includes(
      category
    );
  };

  useEffect(() => {
    fetchLiveCatalogData();
  }, [selectedCategory]);

  const fetchLiveCatalogData = async () => {
    setLoading(true);

    try {
      const queryParams = new URLSearchParams();

      if (searchQuery.trim()) {
        queryParams.append(
          "query",
          searchQuery.trim()
        );
      }

      if (locationQuery.trim()) {
        queryParams.append(
          "location",
          locationQuery.trim()
        );
      }

      if (
        selectedCategory &&
        selectedCategory !== "All Categories"
      ) {
        queryParams.append(
          "category",
          selectedCategory
        );
      }

      const response = await fetch(
        `/api/providers?${queryParams.toString()}`
      );

      if (response.ok) {
        const data = await response.json();

        setProviders(data.providers || []);

        // ==========================================
        // AUTO APPEND NEW REGISTERED CATEGORIES
        // ==========================================
        const liveCategories = (
          data.providers || []
        )
          .map(
            (item: any) => item.category
          )
          .filter(Boolean);

        const mergedCategories = [
          ...new Set([
            ...defaultIndustries,
            ...liveCategories,
          ]),
        ];

        setIndustries(mergedCategories);
      }
    } catch (error) {
      console.error(
        "Failed executing marketplace query:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const triggerCatalogSearch = (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    fetchLiveCatalogData();
  };

  return (
    <div className="min-h-screen bg-slate-50/60 p-6 md:p-12 text-slate-900 text-xs font-semibold antialiased">
      <div className="max-w-[1300px] mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-200/80 pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Global Marketplace Directory
            </h1>

            <p className="text-slate-400 text-xs font-medium">
              Browse and chat directly with verified
              service experts and online stores
            </p>
          </div>

          <Link
            href="/"
            className="text-[10px] font-bold text-slate-500 bg-white hover:bg-slate-100 border border-slate-200 px-4 py-2.5 rounded-xl transition uppercase tracking-wider shadow-sm self-start sm:self-auto"
          >
            Back to Home
          </Link>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* SIDEBAR */}
          <aside className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-5">

            <form
              onSubmit={triggerCatalogSearch}
              className="space-y-3"
            >
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                  Search Keywords
                </label>

                <div className="relative flex items-center">
                  <Search
                    className="absolute left-3.5 text-slate-400"
                    size={14}
                  />

                  <input
                    type="text"
                    placeholder="Keywords or store tags..."
                    value={searchQuery}
                    onChange={(e) =>
                      setSearchQuery(e.target.value)
                    }
                    className="w-full border border-slate-200 bg-slate-50/50 rounded-xl pl-9 pr-3 py-2.5 text-xs outline-none focus:border-blue-600 focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                  Geographic Boundary
                </label>

                <div className="relative flex items-center">
                  <MapPin
                    className="absolute left-3.5 text-slate-400"
                    size={14}
                  />

                  <input
                    type="text"
                    placeholder="City or location area..."
                    value={locationQuery}
                    onChange={(e) =>
                      setLocationQuery(e.target.value)
                    }
                    className="w-full border border-slate-200 bg-slate-50/50 rounded-xl pl-9 pr-3 py-2.5 text-xs outline-none focus:border-blue-600 focus:bg-white transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] uppercase tracking-wider py-2.5 rounded-xl transition"
              >
                Apply Filters
              </button>
            </form>

            {/* CATEGORY FILTER */}
            <div className="border-t border-slate-100 pt-4 space-y-1.5">
              <h4 className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider mb-2 px-1 flex items-center gap-1.5">
                <Compass size={12} />
                Filter Category
              </h4>

              {industries.map((ind) => (
                <button
                  key={ind}
                  type="button"
                  onClick={() =>
                    setSelectedCategory(ind)
                  }
                  className={`w-full text-left px-3 py-2 rounded-xl transition font-bold text-xs ${
                    selectedCategory === ind
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {ind}
                </button>
              ))}
            </div>
          </aside>

          {/* MAIN */}
          <main className="lg:col-span-9 w-full">

            {loading ? (
              <div className="p-16 text-center bg-white border border-slate-200 rounded-2xl shadow-sm">
                <Loader2
                  size={24}
                  className="animate-spin text-blue-600 mx-auto"
                />
              </div>
            ) : providers.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center text-slate-400 space-y-2 shadow-sm">
                <Inbox
                  size={32}
                  className="mx-auto text-slate-300"
                />

                <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider">
                  No Businesses Registered
                </h3>

                <p className="text-[11px]">
                  Be the first to list your
                  storefront parameters.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-5">

                {providers.map((merchant) => (
                  <div
                    key={merchant.id}
                    className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition duration-200 flex flex-col md:flex-row gap-5 items-start md:items-center justify-between"
                  >

                    {/* LEFT */}
                    <div className="flex flex-col sm:flex-row gap-4 items-start flex-1 w-full">

                      <div className="w-full sm:w-44 h-32 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden shrink-0 relative">

                        {merchant.avatarUrl ? (
                          <img
                            src={merchant.avatarUrl}
                            alt={merchant.storeName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] font-extrabold uppercase text-slate-300 tracking-wider bg-slate-100">
                            No Asset Logo
                          </div>
                        )}
                      </div>

                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">

                          <h2 className="text-base font-black tracking-tight text-slate-900">
                            {merchant.storeName}
                          </h2>

                          <span className="bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded">
                            Verified
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400 flex-wrap">

                          <span className="bg-blue-50 text-blue-600 text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded">
                            {merchant.category}
                          </span>

                          <span>
                            📍{" "}
                            {merchant.city ||
                              "Lagos, Nigeria"}
                          </span>

                          <span className="text-amber-500">
                            ⭐ 5.0
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 max-w-xl font-medium">
                          {merchant.description}
                        </p>
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div className="w-full md:w-auto border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 flex md:flex-col items-center md:items-end justify-between gap-3 shrink-0">

                      <div className="text-left md:text-right">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                          Service Call
                        </p>

                        <p className="text-lg font-black text-slate-900 tracking-tight">
                          ₦
                          {parseFloat(
                            merchant.price || "5000"
                          ).toLocaleString()}
                        </p>
                      </div>

                      {/* ACTION BUTTONS */}
                      <div className="flex flex-col gap-2 w-full">

                        {/* MESSAGE BUTTON */}
                        <button
                          type="button"
                          onClick={() =>
                            setActiveChatMerchant(
                              merchant
                            )
                          }
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition duration-150"
                        >
                          Message Shop
                        </button>

                        {/* BOOK SERVICE BUTTON */}
                        {isServiceCategory(
                          merchant.category
                        ) && (
                          <Link
                            href={`/book-service/${merchant.id}`}
                            className="bg-emerald-600 hover:bg-emerald-700 text-center text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition duration-150 flex items-center justify-center gap-2"
                          >
                            <CalendarDays size={14} />
                            Book Service
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* MODAL */}
            {activeChatMerchant && (
              <GuestChatModal
                isOpen={!!activeChatMerchant}
                onClose={() =>
                  setActiveChatMerchant(null)
                }
                providerId={activeChatMerchant.id}
                providerName={
                  activeChatMerchant.storeName
                }
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function GlobalMarketplacePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <Loader2
            size={24}
            className="animate-spin text-blue-600"
          />
        </div>
      }
    >
      <MarketplaceDirectoryContent />
    </Suspense>
  );
}