"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, ArrowRight, ShieldCheck, MapPin, Wrench, DollarSign, Camera, Loader2 } from "lucide-react";

export default function ProviderRegisterPage() {
  const router = useRouter();
  
  // Interactive Onboarding Input States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [category, setCategory] = useState("Plumbing");
  const [address, setAddress] = useState("");
  const [bio, setBio] = useState("");
  const [price, setPrice] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(""); // Holds the cloud image string
  
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");

  // Handler to stream raw binary image toward your api/upload endpoint
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError("");

    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadData,
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.error || "Image transmission rejected.");
      }

      setAvatarUrl(data.url); // Saves your secure Cloudinary asset pointer URL string
    } catch (err: any) {
      setError(err.message || "Failed to upload store thumbnail.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCompleteRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/provider-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          companyName,
          category,
          address,
          bio,
          price,
          avatarurl: avatarUrl // Sent dynamically with your form payload array properties
        })
      });

      const data = await res.json();
      
      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Registration rejected.");
      }

      alert("Merchant profile registered successfully! Your shop is now live.");
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Failed to complete onboarding.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center p-4 text-slate-900 antialiased font-medium">
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm w-full max-w-xl space-y-6">
        
        {/* Identity Branding Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 mb-2">
            <ShieldCheck size={28} />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Open a Provider Store</h1>
          <p className="text-xs text-slate-400 font-semibold">
            Onboard your service business to be discovered on our Shops Directory
          </p>
        </div>

        {/* Error Notification Alert */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Master Onboarding Form Container */}
        <form onSubmit={handleCompleteRegistration} className="space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">Email Address</label>
              <div className="relative flex items-center">
                <Mail className="absolute left-4 text-slate-400" size={16} />
                <input type="email" placeholder="owner@store.com" value={email} onChange={e=>setEmail(e.target.value)} className="w-full text-xs border border-slate-200 rounded-xl pl-11 pr-4 py-3 bg-slate-50/50 outline-none focus:border-blue-600 focus:bg-white transition" required />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">Secure Password</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-4 text-slate-400" size={16} />
                <input type="password" placeholder="Minimum 6 characters" value={password} onChange={e=>setPassword(e.target.value)} className="w-full text-xs border border-slate-200 rounded-xl pl-11 pr-4 py-3 bg-slate-50/50 outline-none focus:border-blue-600 focus:bg-white transition" required />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">Business / Store Name</label>
              <div className="relative flex items-center">
                <User className="absolute left-4 text-slate-400" size={16} />
                <input type="text" placeholder="e.g. QuickFix Plumbing" value={companyName} onChange={e=>setCompanyName(e.target.value)} className="w-full text-xs border border-slate-200 rounded-xl pl-11 pr-4 py-3 bg-slate-50/50 outline-none focus:border-blue-600 focus:bg-white transition" required />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">Business Category</label>
              <div className="relative flex items-center">
                <Wrench className="absolute left-4 text-slate-400" size={16} />
                <select 
                  value={category} 
                  onChange={e => setCategory(e.target.value)} 
                  className="w-full text-xs border border-slate-200 rounded-xl pl-11 pr-4 py-3 bg-slate-50/50 outline-none focus:border-blue-600 focus:bg-white transition appearance-none"
                >
                  <option value="Online Vendor">Online Vendor / Products</option>
                  <option value="E-commerce Store">E-commerce Store</option>
                  <option value="Digital Marketing">Digital Marketing / Social Media</option>
                  <option value="Graphic Design">Graphic Design / Tech Services</option>
                  <option value="Gadgets & Tech">Gadget Store / Electronics</option>
                  <option value="Fashion & Apparel">Fashion & Apparel Vendor</option>
                  <option value="Plumbing">Plumbing Specialist</option>
                  <option value="Electrical">Electrical Trades</option>
                  <option value="Cleaning">Cleaning Services</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">Business Location Address</label>
              <div className="relative flex items-center">
                <MapPin className="absolute left-4 text-slate-400" size={16} />
                <input type="text" placeholder="e.g. Ikeja, Lagos, Nigeria" value={address} onChange={e=>setAddress(e.target.value)} className="w-full text-xs border border-slate-200 rounded-xl pl-11 pr-4 py-3 bg-slate-50/50 outline-none focus:border-blue-600 focus:bg-white transition" required />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">Base Price / Service Rate</label>
              <div className="relative flex items-center">
                <DollarSign className="absolute left-4 text-slate-400" size={16} />
                <input type="number" placeholder="Starting rate in ₦" value={price} onChange={e=>setPrice(e.target.value)} className="w-full text-xs border border-slate-200 rounded-xl pl-11 pr-4 py-3 bg-slate-50/50 outline-none focus:border-blue-600 focus:bg-white transition" required />
              </div>
            </div>
          </div>

          {/* Store Logo Thumbnail Image Streamer */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">Store Profile Picture</label>
            <div className="flex items-center gap-4">
              <div className="relative flex items-center justify-center w-14 h-14 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 text-slate-400 overflow-hidden shrink-0">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Store Thumbnail Preview" className="w-full h-full object-cover" />
                ) : uploadingImage ? (
                  <Loader2 className="animate-spin text-blue-600" size={18} />
                ) : (
                  <Camera size={18} />
                )}
              </div>
              <div className="flex-1 space-y-1">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="avatar-upload" disabled={uploadingImage} />
                <label htmlFor="avatar-upload" className="inline-block text-xs bg-white border border-slate-200 hover:border-slate-300 rounded-xl px-4 py-2 font-bold cursor-pointer transition">
                  {uploadingImage ? "Processing..." : "Select Logo Asset"}
                </label>
                <p className="text-[10px] text-slate-400">Square layout formatting is recommended.</p>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">Describe your background specialties</label>
            <textarea 
              placeholder="Outline your issue description clearly..." 
              value={bio} 
              onChange={e => setBio(e.target.value)} 
              className="w-full text-xs border border-slate-200 rounded-xl p-3 bg-slate-50/50 outline-none h-24 focus:border-blue-600 focus:bg-white transition resize-noneDoc leading-relaxed" 
              required 
            />
          </div>

          {/* Interactive CTA Submission Handler */}
          <button 
            type="submit" 
            disabled={loading || uploadingImage} 
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-xs uppercase tracking-widest py-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-100"
          >
            {loading ? "Registering Storefront..." : "Complete Registration"}
            <ArrowRight size={14} />
          </button>
        </form>
      </div>
    </div>
  );
}