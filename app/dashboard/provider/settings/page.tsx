"use client";
import { useState } from "react";

export default function SettingsPage() {
  const [companyName, setCompanyName] = useState("");
  const [category, setCategory] = useState("Plumbing");
  const [bio, setBio] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const storedUser = localStorage.getItem("user");
    const email = storedUser ? JSON.parse(storedUser).email : "";

    const res = await fetch("/api/dashboard/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, companyName, category, bio, currentPassword, newPassword })
    });
    const data = await res.json();
    alert(data.message || "Updated successfully");
  };

  return (
    <form onSubmit={handleUpdate} className="max-w-md bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
      <h2 className="text-sm font-black text-slate-900">Edit Profile Details</h2>
      <input type="text" placeholder="Business Name" value={companyName} onChange={e=>setCompanyName(e.target.value)} className="w-full text-xs p-3 bg-slate-50 border rounded-xl outline-none" required />
      <textarea placeholder="About your business" value={bio} onChange={e=>setBio(e.target.value)} className="w-full text-xs p-3 bg-slate-50 border rounded-xl outline-none h-24" />
      <h2 className="text-sm font-black text-slate-900 pt-2">Security / Change Password</h2>
      <input type="password" placeholder="Current Password" value={currentPassword} onChange={e=>setCurrentPassword(e.target.value)} className="w-full text-xs p-3 bg-slate-50 border rounded-xl outline-none" />
      <input type="password" placeholder="New Password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} className="w-full text-xs p-3 bg-slate-50 border rounded-xl outline-none" />
      <button type="submit" className="w-full bg-blue-600 text-white font-bold text-xs py-3 rounded-xl hover:bg-blue-700">Save Modifications</button>
    </form>
  );
}