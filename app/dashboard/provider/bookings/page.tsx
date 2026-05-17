// app/dashboard/provider/bookings/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Loader2, Calendar, Clock, Phone } from "lucide-react";

interface Booking {
  id: number;
  provider_id: string;
  full_name: string;
  phone: string;
  booking_date: string;
  preferred_time: string;
  address: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
}

export default function JobBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const response = await fetch("/api/bookings/get-by-provider?providerId=1");
        const data = await response.json();
        
        if (data.success) {
          setBookings(data.bookings);
        } else {
          setError(data.message || "Failed to load bookings");
        }
      } catch (err) {
        setError("Could not connect to the booking service api.");
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (bookingId: number, newStatus: 'approved' | 'rejected') => {
    setUpdatingId(bookingId);
    try {
      const res = await fetch('/api/bookings/update-status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, newStatus })
      });
      
      const data = await res.json();
      
      if (data.success) {
        setBookings((prevBookings) =>
          prevBookings.map((b) =>
            b.id === bookingId ? { ...b, status: newStatus } : b
          )
        );
      } else {
        alert(data.message || "Failed to update status.");
      }
    } catch (err) {
      alert("An error occurred while connecting to the server.");
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="p-6 space-y-6 text-slate-900 font-medium">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Job Bookings</h1>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">
          Track dispatched work schedules and customer references
        </p>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest py-12 justify-center">
          <Loader2 className="animate-spin text-blue-600" size={18} />
          <span>Syncing Database Entries...</span>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded-xl max-w-md">
          {error}
        </div>
      ) : bookings.length === 0 ? (
        <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl max-w-md mx-auto text-slate-400 text-xs font-bold uppercase tracking-wider">
          No bookings logged in your database yet.
        </div>
      ) : (
        <div className="space-y-3 max-w-4xl">
          {bookings.map((booking) => (
            <div 
              key={booking.id} 
              className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-sm transition"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-slate-900 text-base">{booking.full_name}</h3>
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1 ${
                    booking.status === 'approved' || booking.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                    booking.status === 'rejected' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {booking.status}
                  </span>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-semibold">
                  <span className="flex items-center gap-1"><Phone size={12}/> {booking.phone}</span>
                  <span className="flex items-center gap-1 text-slate-400 font-normal">Location: {booking.address}</span>
                </div>

                <p className="text-xs text-slate-500 italic pt-0.5 font-normal max-w-md line-clamp-1">
                  "{booking.description}"
                </p>
              </div>

              <div className="text-left md:text-right border-t md:border-t-0 border-slate-100 pt-3 md:pt-0 shrink-0 space-y-3">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date & Time Scheduled</p>
                  <div className="flex md:justify-end items-center gap-3 text-xs text-slate-700 font-bold mt-1">
                    <span className="flex items-center gap-1"><Calendar size={13} className="text-blue-600"/> {formatDate(booking.booking_date)}</span>
                    <span className="flex items-center gap-1"><Clock size={13} className="text-blue-600"/> {booking.preferred_time}</span>
                  </div>
                </div>

                {booking.status === 'pending' && (
                  <div className="flex items-center md:justify-end gap-2 pt-0.5">
                    <button
                      type="button"
                      disabled={updatingId !== null}
                      onClick={() => handleUpdateStatus(booking.id, 'approved')}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-[11px] font-bold rounded-xl transition cursor-pointer shadow-sm flex items-center gap-1 min-w-[85px] justify-center"
                    >
                      {updatingId === booking.id ? (
                        <Loader2 className="animate-spin text-white" size={12} />
                      ) : (
                        <span>Approve</span>
                      )}
                    </button>
                    
                    <button
                      type="button"
                      disabled={updatingId !== null}
                      onClick={() => handleUpdateStatus(booking.id, 'rejected')}
                      className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-600 text-[11px] font-bold rounded-xl transition cursor-pointer min-w-[75px] justify-center"
                    >
                      {updatingId === booking.id ? (
                        <Loader2 className="animate-spin text-slate-400" size={12} />
                      ) : (
                        <span>Reject</span>
                      )}
                    </button>
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}