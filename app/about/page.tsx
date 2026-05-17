// app/about/page.tsx
import Link from "next/link";

export const metadata = {
  title: "About Us | ServiFind",
  description: "Learn about ServiFind and how we connect trusted local service providers with customers.",
};

export default function AboutPage() {
  const coreValues = [
    { title: "Trust & Safety", desc: "Every service merchant undergoes background verification check steps.", icon: "🛡️" },
    { title: "Upfront Pricing", desc: "Clear base service callout rates before booking a provider.", icon: "💰" },
    { title: "Local Impact", desc: "Empowering professional tradespeople inside local communities.", icon: "🇳🇬" },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero Header Section */}
      <section className="bg-slate-50 border-b border-gray-100 py-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-blue-600 font-extrabold bg-blue-50 px-3 py-1 rounded-full">
            Our Mission
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900 mt-4 mb-6">
            Connecting Communities with Trusted Local Expertise
          </h1>
          <p className="text-base text-gray-600 leading-relaxed">
            ServiFind is a digital marketplace bridging the gap between skilled service professionals and local clients. We remove the guesswork from hiring plumbers, electricians, cleaners, and technical experts.
          </p>
        </div>
      </section>

      {/* Core Platform Performance Metrics Block */}
      <section className="max-w-5xl mx-auto py-12 px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {[
          { label: "Service Providers", value: "10K+" },
          { label: "Happy Customers", value: "25K+" },
          { label: "Service Categories", value: "50+" },
          { label: "Support Available", value: "24/7" },
        ].map((stat, i) => (
          <div key={i} className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl">
            <p className="text-2xl sm:text-3xl font-black text-blue-600">{stat.value}</p>
            <p className="text-xs font-semibold text-gray-500 mt-1 uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Corporate Values Section Grid Layout */}
      <section className="bg-slate-50 py-16 px-6 border-y border-gray-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">Why Choose ServiFind</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {coreValues.map((value, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-transform hover:-translate-y-1">
                <span className="text-3xl mb-4 block">{value.icon}</span>
                <h3 className="font-bold text-base text-gray-900 mb-2">{value.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action CTA Block */}
      <section className="max-w-4xl mx-auto py-16 px-6 text-center">
        <h2 className="text-2xl font-extrabold mb-4 text-gray-900">Ready to expand your local reach?</h2>
        <p className="text-sm text-gray-500 max-w-md mx-auto mb-8">
          Join thousands of certified tradespeople growing their business network on our marketplace matrix.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/(auth)/provider-register" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-lg transition-colors shadow-sm">
            List Your Service
          </Link>
          <Link href="/providers" className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-lg transition-colors">
            Browse Directory
          </Link>
        </div>
      </section>
    </div>
  );
}