"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function AuthButton() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <div className="text-sm text-slate-500">Loading...</div>;
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-slate-700">
          {session.user.name}
        </span>
        <button
          onClick={() => authClient.signOut()}
          className="text-sm text-red-600 hover:text-red-700 font-medium"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
    >
      Sign In
    </Link>
  );
}
