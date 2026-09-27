import Link from "next/link";
import { getPatients } from "@/lib/patients";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const allPatients = await getPatients();
  
  const totalPatients = allPatients.length;
  const malePatients = allPatients.filter(p => p.gender === "Male").length;
  const femalePatients = allPatients.filter(p => p.gender === "Female").length;
  const recentPatients = [...allPatients].reverse().slice(0, 5);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Patient Dashboard</h1>
          <p className="text-slate-500">Overview of patient statistics and recent records</p>
        </div>
        <Link
          href="/patients"
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-center hover:bg-blue-700 font-medium transition-colors"
        >
          Manage Patients
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 font-medium">Patients</p>
          <h2 className="text-4xl font-bold text-slate-900 mt-2">{totalPatients}</h2>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 font-medium">Male</p>
          <h2 className="text-4xl font-bold text-slate-900 mt-2">{malePatients}</h2>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 font-medium">Female</p>
          <h2 className="text-4xl font-bold text-slate-900 mt-2">{femalePatients}</h2>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">Recent Patients</h2>
        </div>
        <div className="p-0">
          <ul className="divide-y divide-slate-200">
            {recentPatients.map(patient => {
              const initials = patient.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
              return (
                <li key={patient.id} className="flex items-center justify-between p-6 hover:bg-slate-50">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                      {initials}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{patient.name}</p>
                      <p className="text-sm text-slate-500">Age: {patient.age}</p>
                    </div>
                  </div>
                  <Link href={`/patients/${patient.id}`} className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                    View
                  </Link>
                </li>
              );
            })}
            {recentPatients.length === 0 && (
              <li className="p-6 text-center text-slate-500">
                No recent patients.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}