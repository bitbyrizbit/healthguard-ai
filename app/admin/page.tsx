import { prisma } from '@/app/lib/prisma';
import { toggleUserRoleAction } from '@/app/actions/adminActions';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  let users: any[] = [];
  try {
    users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { posts: true }
        }
      }
    });
  } catch (error) {
    console.error('Failed to fetch users:', error);
  }

  const adminCount = users.filter(u => u.role === 'admin').length;
  const guestCount = users.filter(u => u.role !== 'admin').length;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 mb-2">
          Admin Restricted Zone
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Administration & Access Control</h1>
        <p className="text-slate-500 mt-1">
          Manage staff accounts, inspect database connectivity, and configure Role-Based Access Control (RBAC).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">Total Registered Staff</p>
          <h2 className="text-4xl font-bold text-slate-900 mt-2">{users.length}</h2>
          <p className="text-xs text-slate-400 mt-1">Stored in PostgreSQL via Prisma</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">Active Administrators</p>
          <h2 className="text-4xl font-bold text-blue-600 mt-2">{adminCount}</h2>
          <p className="text-xs text-slate-400 mt-1">Full privileged access to /admin</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">Guest / Staff Users</p>
          <h2 className="text-4xl font-bold text-slate-600 mt-2">{guestCount}</h2>
          <p className="text-xs text-slate-400 mt-1">Standard clinical read/write access</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Staff Accounts & Roles</h2>
            <p className="text-sm text-slate-500">Toggle roles to test Next.js proxy route protection live</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Current Role</th>
                <th className="px-6 py-4">Announcements Posted</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {user.name || 'Unnamed User'}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        user.role === 'admin'
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {user._count?.posts ?? 0}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <form
                      action={async () => {
                        'use server';
                        await toggleUserRoleAction(user.id, user.role);
                      }}
                    >
                      <button
                        type="submit"
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          user.role === 'admin'
                            ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {user.role === 'admin' ? 'Demote to Guest' : 'Promote to Admin'}
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                    No staff accounts found in the database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
