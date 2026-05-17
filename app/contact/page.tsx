// app/contact/page.tsx
"use client";

import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<{ type: "success" | "error" | null; text: string }>({ type: null, text: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: null, text: "" });

    try {
      // Direct network pipeline link mock execution
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus({ type: "success", text: "Message transmitted successfully! Our administration loop will reply shortly." });
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        throw new Error();
      }
    } catch (err) {
      setStatus({ type: "error", text: "Transmission error. Please check your data or try again later." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
        
        {/* Sidebar Context Details Block */}
        <div className="bg-blue-600 text-white p-8 md:w-80 flex flex-col justify-between">
          <div>
            <h1 className="text-xl font-black uppercase tracking-wider mb-2">Get In Touch</h1>
            <p className="text-xs text-blue-100 leading-relaxed mb-8">
              Have questions regarding vendor processing verification, dynamic listings, or system flag issues? Message our operations staff.
            </p>
            
            <div className="space-y-4 text-xs font-medium">
              <div className="flex items-center gap-3">
                <span className="text-base">📍</span>
                <span>Ikeja, Lagos, Nigeria</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-base">✉️</span>
                <span>support@servifind.com</span>
              </div>
            </div>
          </div>
          
          <div className="text-[10px] text-blue-200 mt-8 border-t border-blue-500 pt-4 font-semibold uppercase tracking-widest">
            ServiFind Support Node
          </div>
        </div>

        {/* Primary Contact Form Component Panel */}
        <form onSubmit={handleSubmit} className="p-8 flex-1 space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Send an Administration Message</h2>
          
          {status.type && (
            <div className={`p-3 rounded-lg text-xs font-semibold border ${
              status.type === "success" 
                ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                : "bg-rose-50 text-rose-800 border-rose-200"
            }`}>
              {status.text}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
                placeholder="johndoe@example.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Subject Heading</label>
            <input
              id="subject"
              name="subject"
              type="text"
              required
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
              placeholder="Account verification assistance request"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Message Body</label>
            <textarea
              id="message"
              name="message"
              required
              rows={4}
              value={formData.message}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900 placeholder-gray-400"
              placeholder="Provide clean explicit tracking parameters regarding your platform issue..."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xs font-bold uppercase tracking-wider py-3 rounded-lg transition-colors shadow-sm mt-2"
          >
            {isSubmitting ? "Transmitting..." : "Send Message"}
          </button>
        </form>

      </div>
    </div>
  );
}