// app/dashboard/provider/gallery/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Upload, Image as ImageIcon, Trash2, Loader2, Sparkles } from "lucide-react";

export default function ProviderGalleryDashboard() {
  const [gallery, setGallery] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", text: "" });

  // Mock active user profile database index parameter reference key
  const activeProviderId = "mock_provider_id_101";

  useEffect(() => {
    loadExistingPortfolioImages();
  }, []);

  const loadExistingPortfolioImages = async () => {
    try {
      const res = await fetch(`/api/providers/${activeProviderId}`);
      if (res.ok) {
        const data = await res.json();
        // Parse JSON string data representation safely if needed
        const imageList = typeof data.galleryImages === "string" 
          ? JSON.parse(data.galleryImages) 
          : data.galleryImages || [];
        setGallery(imageList);
      }
    } catch (err) {
      console.error("Failed to load existing portfolio images:", err);
    }
  };

  const handlePortfolioFileSelection = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setStatus({ type: "", text: "" });

    const fileArray = Array.from(files);
    const uploadedUrls: string[] = [];

    try {
      for (const file of fileArray) {
        const payload = new FormData();
        payload.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: payload,
        });

        const data = await response.json();

        if (response.ok && data.success) {
          uploadedUrls.push(data.url);
        } else {
          throw new Error(data.error || "File processing stream rejected.");
        }
      }

      setGallery((prev) => [...prev, ...uploadedUrls]);
      setStatus({ type: "success", text: `Successfully processed ${uploadedUrls.length} file layout structures.` });
    } catch (err: any) {
      setStatus({ type: "error", text: err.message || "Failed uploading asset bundle to cloud." });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveGalleryImage = (indexToRemove: number) => {
    setGallery((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSaveGalleryToDatabase = async () => {
    setSaving(true);
    setStatus({ type: "", text: "" });

    try {
      const response = await fetch(`/api/providers/${activeProviderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          galleryImages: JSON.stringify(gallery) // Serialize array object structure down into raw SQL text standard string
        })
      });

      if (response.ok) {
        setStatus({ type: "success", text: "Portfolio gallery changes synced to XAMPP database successfully!" });
      } else {
        throw new Error("Server database update execution rejected.");
      }
    } catch (err: any) {
      setStatus({ type: "error", text: err.message || "Failed saving changes." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-900 text-xs font-semibold antialiased">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-black tracking-tight text-slate-900">Project Portfolio Gallery</h1>
          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
            Upload visual proof-of-work images to attract digital marketplace search traffic
          </p>
        </div>
        <button
          onClick={handleSaveGalleryToDatabase}
          disabled={saving || uploading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-[10px] uppercase tracking-wider px-6 py-3 rounded-xl transition shadow-md shadow-blue-100 flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          {saving ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
          <span>{saving ? "Syncing Database..." : "Save Gallery Layout"}</span>
        </button>
      </div>

      {status.text && (
        <div className={`p-4 rounded-xl font-semibold border text-xs max-w-2xl ${
          status.type === "success" 
            ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
            : "bg-rose-50 text-rose-800 border-rose-200"
        }`}>
          {status.text}
        </div>
      )}

      {/* Upload Zone Input Board Card Component */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center max-w-2xl shadow-sm space-y-4">
        <div className="w-12 h-12 bg-slate-50 border border-slate-200 text-slate-400 flex items-center justify-center rounded-xl mx-auto shadow-inner">
          {uploading ? <Loader2 size={20} className="animate-spin text-blue-600" /> : <Upload size={20} />}
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-black text-slate-900 tracking-tight">
            {uploading ? "Uploading media file streams..." : "Upload Portfolio Project Evidence"}
          </h3>
          <p className="text-[11px] text-slate-400 font-medium">Select single or multiple snapshot records at once</p>
        </div>
        
        <label className="inline-flex bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] uppercase tracking-wider px-5 py-2.5 rounded-xl transition cursor-pointer select-none">
          <span>Choose Project Files</span>
          <input 
            type="file" 
            multiple 
            accept="image/*" 
            onChange={handlePortfolioFileSelection} 
            disabled={uploading} 
            className="hidden" 
          />
        </label>
      </div>

      {/* Grid Canvas Showcase Presentation Section */}
      <div className="space-y-3">
        <h3 className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Active Gallery Thumbnails ({gallery.length})</h3>
        
        {gallery.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400 max-w-2xl flex flex-col items-center justify-center gap-2">
            <ImageIcon size={28} className="text-slate-200" />
            <p className="text-xs font-semibold">Your public workshop stream profile contains zero images right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {gallery.map((url, index) => (
              <div key={index} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm aspect-video relative group border border-slate-200/80">
                <img src={url} alt="Portfolio Work Element" className="w-full h-full object-cover" />
                
                {/* Dynamic Hover Action Overlay Layer Trigger Mask */}
                <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-0.5 opacity-0 group-hover:opacity-100 transition flex items-center justify-center z-10">
                  <button
                    onClick={() => handleRemoveGalleryImage(index)}
                    className="p-2 bg-white text-rose-600 rounded-lg shadow hover:bg-rose-50 transition transform scale-90 group-hover:scale-100 duration-150"
                    title="Remove asset line"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}