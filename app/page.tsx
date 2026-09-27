import Link from "next/link";

export default function Home() {
  return (
    <div className="h-full flex items-center justify-center p-6 bg-slate-50 rounded-xl border border-slate-200">
      <div className="max-w-3xl text-center">
        <h1 className="text-5xl font-bold mb-6 text-slate-900">
          HealthGuard
        </h1>

        <p className="text-lg text-slate-600 mb-8">
          Patient Management System
        </p>

        <Link
          href="/dashboard"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors"
        >
          Open Dashboard
        </Link>
      </div>
    </div>
  );
}