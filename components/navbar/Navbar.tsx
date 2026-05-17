import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-10 py-5 bg-white border-b">
      <div className="text-2xl font-bold text-blue-600 flex items-center gap-2">
        <span className="p-2 bg-blue-600 text-white rounded-full text-xs">📍</span> ServiFind
      </div>
      <div className="hidden md:flex gap-8 text-gray-600 font-medium">
        <Link href="/">Home</Link>
        <Link href="/categories">Categories</Link>
        <Link href="/how-it-works">How It Works</Link>
        <Link href="/about">About Us</Link>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/login" className="text-gray-700 font-semibold">Login</Link>
        <Link href="/register" className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700">
          List Your Service
        </Link>
      </div>
    </nav>
  );
}