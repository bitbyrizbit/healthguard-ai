"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PatientsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300";
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Patients</h1>
        
        <div className="border-b border-slate-200">
          <nav className="-mb-px flex space-x-8">
            <Link
              href="/patients"
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${isActive("/patients")}`}
            >
              All Patients
            </Link>
            <Link
              href="/patients/add"
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${isActive("/patients/add")}`}
            >
              Add Patient
            </Link>
          </nav>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        {children}
      </div>
    </div>
  );
}
