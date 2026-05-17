import { Droplets, Zap, Brush, Snowflake, Hammer, PaintBucket } from "lucide-react";

// The "export default" part is what makes it visible to your main page
export default function Categories() {
  const categories = [
    { name: "Plumbing", icon: <Droplets className="text-blue-600" />, count: "150+ Providers" },
    { name: "Electrical", icon: <Zap className="text-yellow-500" />, count: "120+ Providers" },
    { name: "Cleaning", icon: <Brush className="text-green-500" />, count: "200+ Providers" },
    { name: "AC Repair", icon: <Snowflake className="text-cyan-500" />, count: "80+ Providers" },
    { name: "Carpentry", icon: <Hammer className="text-orange-500" />, count: "100+ Providers" },
    { name: "Painting", icon: <PaintBucket className="text-red-500" />, count: "90+ Providers" },
  ];

  return (
    <section className="py-20 max-w-7xl mx-auto px-10">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Popular Categories</h2>
          <p className="text-gray-500">Explore the best services by category</p>
        </div>
        <button className="text-blue-600 font-semibold hover:underline">View all categories →</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {categories.map((cat) => (
          <div key={cat.name} className="bg-white border border-gray-100 p-8 rounded-2xl text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              {cat.icon}
            </div>
            <h3 className="font-bold text-gray-800">{cat.name}</h3>
            <p className="text-xs text-gray-400 mt-1">{cat.count}</p>
          </div>
        ))}
      </div>
    </section>
  );
}