import Link from "next/link";
import { getPatients } from "@/lib/patients";
import { deletePatientAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function PatientsPage() {
  const patients = await getPatients();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-slate-900">Patient Records</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 text-sm">
              <th className="pb-3 font-medium">ID</th>
              <th className="pb-3 font-medium">Name</th>
              <th className="pb-3 font-medium">Age</th>
              <th className="pb-3 font-medium">Gender</th>
              <th className="pb-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {patients.map((patient) => (
              <tr key={patient.id} className="hover:bg-slate-50">
                <td className="py-4 text-slate-500">{patient.id}</td>
                <td className="py-4 font-medium text-slate-900">{patient.name}</td>
                <td className="py-4 text-slate-600">{patient.age}</td>
                <td className="py-4 text-slate-600">{patient.gender}</td>
                <td className="py-4 text-right space-x-3">
                  <Link href={`/patients/${patient.id}`} className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                    View
                  </Link>
                  <form action={deletePatientAction.bind(null, patient.id)} className="inline">
                    <button type="submit" className="text-red-600 hover:text-red-800 font-medium text-sm">
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {patients.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500">
                  No patients found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
