"use client";

import { useState, useEffect } from "react";
import { Loader2, Upload } from "lucide-react";

export default function ProviderProfilePage() {
  const [businessName, setBusinessName] = useState("");
  const [hotlinePhone, setHotlinePhone] = useState("");
  const [address, setAddress] = useState("");
  const [biography, setBiography] = useState("");
  
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState("");

  // Sync data records dynamically from database on component initialization mount
  useEffect(() => {
    async function loadProfileData() {
      try {
        const res = await fetch("/api/providers/details?id=1");
        const data = await res.json();
        if (data.success) {
          // Binding fields safely to data object properties
          setBusinessName(data.businessName || "");
          setHotlinePhone(data.hotlinePhone || "");
          setAddress(data.address || "");
          setBiography(data.biography || "");
          setPreviewUrl(data.logoUrl || "");
        }
      } catch (err) {
        console.error("Failed syncing setup fields.");
      } finally {
        setFetching(false);
      }
    }
    loadProfileData();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); 
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("providerId", "1"); 
      formData.append("businessName", businessName);
      formData.append("hotlinePhone", hotlinePhone);
      formData.append("address", address);
      formData.append("biography", biography);
      if (selectedFile) {
        formData.append("logoFile", selectedFile);
      }

      const res = await fetch("/api/providers/update-profile", {
        method: "POST",
        body: formData, 
      });

      const data = await res.json();
      if (data.success) {
        setMessage("✅ Changes saved successfully to database!");
      } else {
        setMessage(`❌ Error saving: ${data.message}`);
      }
    } catch (err) {
      setMessage("❌ Failed connecting to profile endpoint.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-400 text-xs font-bold gap-2">
        <Loader2 className="animate-spin text-blue-600" size={16} />
        <span>Loading Profile Settings Profile...</span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 text-slate-900 font-medium max-w-3xl">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Store Profile</h1>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">
          MANAGE PUBLIC BUSINESS DESCRIPTIONS AND BRAND IMAGE VISIBILITY
        </p>
      </div>

      {message && (
        <div className="p-3 text-xs font-bold rounded-xl bg-slate-100 border border-slate-200">
          {message}
        </div>
      )}

      <form onSubmit={handleProfileSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
        
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Profile Picture / Shop Logo</label>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden flex items-center justify-center shrink-0">
              {previewUrl ? (
                <img src={previewUrl} alt="Storefront Logo preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-6 h-6 rounded-full border-2 border-slate-300" />
              )}
            </div>
            
            <label className="bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-black text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm">
              <Upload size={14} />
              <span>Upload Picture</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Business Name</label>
            <input 
              type="text" 
              required
              value={businessName} 
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50/50 focus:bg-white outline-none focus:border-blue-600 transition"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Hotline Phone</label>
            <input 
              type="text" 
              value={hotlinePhone} 
              onChange={(e) => setHotlinePhone(e.target.value)}
              className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50/50 focus:bg-white outline-none focus:border-blue-600 transition"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Workshop Location Address</label>
          <input 
            type="text" 
            value={address} 
            onChange={(e) => setAddress(e.target.value)}
            className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50/50 focus:bg-white outline-none focus:border-blue-600 transition"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Public Biography Statements</label>
          <textarea 
            rows={4} 
            value={biography} 
            onChange={(e) => setBiography(e.target.value)}
            className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50/50 focus:bg-white outline-none focus:border-blue-600 transition resize-none"
            placeholder="Introduce your business..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-black text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition cursor-pointer flex items-center gap-2 shadow-sm"
        >
          {loading && <Loader2 size={12} className="animate-spin" />}
          <span>Save Profile Details</span>
        </button>

      </form>
    </div>
  );
}