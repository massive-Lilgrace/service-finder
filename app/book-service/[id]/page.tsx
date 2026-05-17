"use client";

import { useState, use, useEffect } from "react";
import { Loader2, CalendarCheck } from "lucide-react";

interface BookingPageProps {
  params: Promise<{ id: string }> | { id: string };
}

export default function BookingPage({ params }: BookingPageProps) {
  const resolvedParams = params instanceof Promise ? use(params) : params;
  const providerId = resolvedParams?.id || "";

  const [businessName, setBusinessName] = useState("Loading business name...");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState(""); 
  const [phone, setPhone] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!providerId) return;

    async function fetchBusinessDetails() {
      try {
        const response = await fetch(`/api/providers/details?id=${providerId}`);
        const data = await response.json();
        if (data.success && data.businessName) {
          setBusinessName(data.businessName);
        } else {
          setBusinessName(`Provider #${providerId}`);
        }
      } catch (err) {
        setBusinessName(`Provider #${providerId}`);
      }
    }

    fetchBusinessDetails();
  }, [providerId]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/bookings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          providerId,
          fullName,
          email, 
          phone,
          bookingDate,
          preferredTime,
          address,
          description,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.message || "Failed to process booking execution pipeline.");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please check connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 text-slate-900 font-medium flex items-center justify-center">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-sm p-5 md:p-6 space-y-4">
        
        {success ? (
          <div className="text-center py-6 space-y-3 max-w-sm mx-auto">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CalendarCheck size={24} />
            </div>
            <h3 className="text-xl font-black tracking-tight text-slate-900">
              Booking Received!
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your service request has been sent to <strong>{businessName}</strong>. They will verify your request and reach out shortly.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setSuccess(false)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl transition cursor-pointer"
              >
                Book Another Service
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight">
                  Book Service
                </h1>
                <p className="text-slate-400 text-[11px] mt-0.5 font-semibold">
                  Storefront: <span className="text-emerald-600 font-bold">{businessName}</span>
                </p>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-[11px] font-bold rounded-xl">
                {error}
              </div>
            )}

            <form onSubmit={handleBookingSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-emerald-600 bg-slate-50/50 focus:bg-white transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. client@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-emerald-600 bg-slate-50/50 focus:bg-white transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +234..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-emerald-600 bg-slate-50/50 focus:bg-white transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Booking Date
                  </label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-emerald-600 bg-slate-50/50 focus:bg-white transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Preferred Time
                  </label>
                  <input
                    type="time"
                    required
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-emerald-600 bg-slate-50/50 focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Service Address
                </label>
                <input
                  type="text"
                  placeholder="Where should the service take place?"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-emerald-600 bg-slate-50/50 focus:bg-white transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Additional Details / Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe your job issue in detail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-emerald-600 bg-slate-50/50 focus:bg-white transition resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-black text-xs uppercase tracking-wider py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-2 mt-4"
              >
                {loading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Processing Order Request...
                  </>
                ) : (
                  "Confirm & Secure Booking"
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}