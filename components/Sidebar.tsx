"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname.startsWith(path) ? "bg-slate-100 font-medium text-blue-600" : "text-slate-700 hover:bg-slate-50";
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 p-4 flex flex-col gap-2 shrink-0 overflow-y-auto">
      <Link href="/dashboard" className={`px-4 py-2 rounded-md ${isActive("/dashboard")}`}>
        Dashboard
      </Link>
      <Link href="/patients" className={`px-4 py-2 rounded-md ${isActive("/patients")}`}>
        Patients
      </Link>
      <Link href="/blog-db" className={`px-4 py-2 rounded-md ${isActive("/blog-db")}`}>
        Announcements
      </Link>
      <Link href="/supplies" className={`px-4 py-2 rounded-md ${isActive("/supplies")}`}>
        Inventory
      </Link>
      <Link href="/about" className={`px-4 py-2 rounded-md ${isActive("/about")}`}>
        About
      </Link>
    </aside>
  );
}
