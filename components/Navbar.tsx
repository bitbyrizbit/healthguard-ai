import Link from "next/link";

export default function Navbar() {
  return (
    <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 shrink-0">
      <Link href="/" className="text-xl font-bold text-blue-600">
        HealthGuard
      </Link>
      <div className="text-slate-600 text-sm">
        Profile / Settings
      </div>
    </header>
  );
}
