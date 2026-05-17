// components/landing/Testimonials.tsx
import Image from "next/image";

interface TestimonialCard {
  id: string;
  clientName: string;
  location: string;
  comment: string;
  rating: number;
  avatarUrl: string;
}

export default function Testimonials() {
  const customerFeedbackList: TestimonialCard[] = [
    {
      id: "t1",
      clientName: "Amara Nwosu",
      location: "Lekki, Lagos",
      comment: "Found an emergency electrician within 15 minutes of my circuit breaker tripping. Outstanding verification processing tracking.",
      rating: 5,
      avatarUrl: "unsplash.com",
    },
    {
      id: "t2",
      clientName: "Tunde Bakare",
      location: "Surulere, Lagos",
      comment: "The base service callout rate of ₦5,000 was completely transparent. The plumber fixed our hidden under-sink leakage cleanly.",
      rating: 5,
      avatarUrl: "unsplash.com",
    },
    {
      id: "t3",
      clientName: "Funmi Adebayo",
      location: "Ikeja, Lagos",
      comment: "Excellent experience scheduling deep cleaning services for my office dashboard hub. Verified business documentation is reassuring.",
      rating: 4,
      avatarUrl: "unsplash.com",
    },
  ];

  return (
    <section className="bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-blue-600 font-extrabold bg-blue-50 px-3 py-1 rounded-full">
            Reviews
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-3 tracking-tight">
            Trusted by Thousands of Property Owners
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {customerFeedbackList.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex text-amber-400 text-sm mb-3">
                  {"★".repeat(item.rating)}{"☆".repeat(5 - item.rating)}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed italic">
                  "{item.comment}"
                </p>
              </div>

              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-100">
                <div className="w-9 h-9 relative rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image src={item.avatarUrl} alt={item.clientName} fill className="object-cover" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 leading-none">{item.clientName}</h4>
                  <span className="text-[10px] text-gray-400 font-medium block mt-1">{item.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}