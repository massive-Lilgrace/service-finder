// components/landing/Footer.tsx
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const marketplaceLinks = [
    { label: "Find Plumbing Experts", path: "/providers?query=plumber" },
    { label: "Find Electrical Experts", path: "/providers?query=electrician" },
    { label: "Find Cleaning Crews", path: "/providers?query=cleaning" },
    { label: "Air Conditioning Care", path: "/providers?query=ac" },
  ];

  const corporateLinks = [
    { label: "About Our Platform", path: "/about" },
    { label: "Contact Operations", path: "/contact" },
    { label: "Merchant Onboarding", path: "/(auth)/provider-register" },
  ];

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 pt-12 pb-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
        
        {/* Brand Core Capsule Column */}
        <div className="space-y-3">
          <span className="font-black text-lg text-white tracking-tight">
            Servi<span className="text-blue-500">Find</span>
          </span>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            Connecting verified trade technicians with commercial and residential property management operations seamlessly across Nigeria.
          </p>
        </div>

        {/* Dynamic Service Queries Links Column */}
        <div>
          <h4 className="font-bold text-white text-[11px] uppercase tracking-widest mb-4">Popular Trades</h4>
          <ul className="space-y-2.5 font-medium">
            {marketplaceLinks.map((link, index) => (
              <li key={index}>
                <Link href={link.path} className="hover:text-blue-400 transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company Links Column */}
        <div>
          <h4 className="font-bold text-white text-[11px] uppercase tracking-widest mb-4">Company</h4>
          <ul className="space-y-2.5 font-medium">
            {corporateLinks.map((link, index) => (
              <li key={index}>
                <Link href={link.path} className="hover:text-blue-400 transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Security / System Support Column */}
        <div>
          <h4 className="font-bold text-white text-[11px] uppercase tracking-widest mb-4">System Support</h4>
          <p className="text-[11px] leading-relaxed mb-3">
            Encountered registration friction or database synchronization bugs? File records directly to operations.
          </p>
          <Link href="/contact" className="inline-block bg-slate-800 text-white font-bold px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors text-center w-full">
            Open Support Ticket
          </Link>
        </div>

      </div>

      {/* Trademark Attribution Base bar */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800 text-center sm:flex sm:justify-between text-[11px] font-medium text-slate-500">
        <p>© {currentYear} ServiFind Technologies. All rights reserved.</p>
        <div className="flex justify-center gap-4 mt-2 sm:mt-0">
          <span className="hover:text-slate-400 cursor-pointer">Privacy Protocol</span>
          <span>•</span>
          <span className="hover:text-slate-400 cursor-pointer">Platform Terms</span>
        </div>
      </div>
    </footer>
  );
}