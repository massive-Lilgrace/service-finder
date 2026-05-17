// components/landing/FeaturedProviders.tsx
import Image from "next/image";
import Link from "next/link";

interface VerifiedMerchant {
  id: string;
  name: string;
  industry: string;
  rating: number;
  jobsCount: number;
  basePrice: number;
  area: string;
  coverImage: string;
}

export default function FeaturedProviders() {
  const eliteMerchants: VerifiedMerchant[] = [
    {
      id: "p1",
      name: "QuickFix Plumbing Services",
      industry: "Plumbing",
      rating: 4.9,
      jobsCount: 142,
      basePrice: 5000,
      area: "Ikeja, Lagos",
      coverImage: "unsplash.com",
    },
    {
      id: "p2",
      name: "VoltMaster Electrical Hub",
      industry: "Electrical",
      rating: 4.8,
      jobsCount: 96,
      basePrice: 7000,
      area: "Lekki, Lagos",
      coverImage: "unsplash.com",
    },
    {
      id: "p3",
      name: "Breeze Air Conditioning Pro",
      industry: "AC Repair",
      rating: 4.7,
      jobsCount: 110,
      basePrice: 6500,
      area: "Yaba, Lagos",
      coverImage: "unsplash.com",
    },
  ];

  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-blue-600 font-extrabold bg-blue-50 px-3 py-1 rounded-full">
              Top Rated
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-3 tracking-tight">
              Featured Verified Specialists
            </h2>
          </div>
          <Link href="/providers" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
            Browse All Providers ➔
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {eliteMerchants.map((merchant) => (
            <div key={merchant.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col group">
              <div className="h-44 w-full relative bg-gray-100 overflow-hidden">
                <Image 
                  src={merchant.coverImage} 
                  alt={merchant.name} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded text-gray-800 shadow-sm">
                  {merchant.industry}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-bold text-base text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                    {merchant.name}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
                    <span className="text-amber-500 font-bold">★ {merchant.rating}</span>
                    <span>({merchant.jobsCount} jobs completed)</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">📍 {merchant.area}</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div>
                    <span className="block text-[9px] text-gray-400 font-bold uppercase tracking-wider">Base Callout</span>
                    <span className="text-base font-black text-gray-900">₦{merchant.basePrice.toLocaleString()}</span>
                  </div>
                  <Link 
                    href={`/providers/${merchant.id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg transition-colors shadow-sm"
                  >
                    View Studio
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}