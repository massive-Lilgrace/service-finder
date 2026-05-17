// components/forms/ServiceForm.tsx
"use client";

import { useState } from "react";

interface ServiceFormProps {
  onServiceCreated?: () => void;
}

export default function ServiceForm({ onServiceCreated }: ServiceFormProps) {
  const [formData, setFormData] = useState({ serviceTitle: "", customPrice: "", description: "" });
  const [statusMessage, setStatusMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setStatusMessage("");

    try {
      const response = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.serviceTitle,
          price: Number(formData.customPrice),
          description: formData.description,
        }),
      });

      if (response.ok) {
        setStatusMessage("Custom service line item added to public marketplace listings.");
        setFormData({ serviceTitle: "", customPrice: "", description: "" });
        if (onServiceCreated) onServiceCreated();
      } else {
        setStatusMessage("Failed saving service. Verify active profile parameters.");
      }
    } catch (err) {
      console.error("Failed executing structural node creation logic:", err);
      setStatusMessage("Error writing dataset parameters to the directory ledger.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 text-gray-900 shadow-sm max-w-xl">
      <div>
        <h3 className="text-sm font-black uppercase tracking-wider text-gray-800">Add Premium Service Option</h3>
        <p className="text-[11px] text-gray-400 font-medium">Extend your storefront business capabilities menu index</p>
      </div>

      {statusMessage && (
        <div className="p-3 bg-slate-50 border border-gray-200 text-gray-700 font-semibold text-xs rounded-xl">
          💡 {statusMessage}
        </div>
      )}

      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Specific Service Option Title</label>
        <input
          type="text"
          name="serviceTitle"
          required
          placeholder="e.g. Copper Pipe Welding Fix"
          value={formData.serviceTitle}
          onChange={handleInputChange}
          className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Flat Pricing Estimate (₦)</label>
        <input
          type="number"
          name="customPrice"
          required
          placeholder="15000"
          value={formData.customPrice}
          onChange={handleInputChange}
          className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Operational Scope Description</label>
        <textarea
          name="description"
          required
          rows={3}
          placeholder="Outline materials provided, timeline parameters, spatial metrics inclusions..."
          value={formData.description}
          onChange={handleInputChange}
          className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-gray-400"
        />
      </div>

      <button
        type="submit"
        disabled={isProcessing}
        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-colors shadow-sm"
      >
        {isProcessing ? "Appending Database Row..." : "Append Service Option"}
      </button>
    </form>
  );
}