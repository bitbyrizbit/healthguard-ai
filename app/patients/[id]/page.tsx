import { notFound } from "next/navigation";
import { getPatientById } from "@/lib/patients";
import { updatePatientAction } from "../actions";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function PatientPage({ params }: Props) {
  const { id } = await params;
  const patient = await getPatientById(id);

  if (!patient) {
    notFound();
  }

  const updateActionWithId = updatePatientAction.bind(null, id);

  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-900 mb-6">Edit Patient: {patient.name}</h2>
      
      <form action={updateActionWithId} className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-slate-700">Name</label>
            <input type="text" id="name" name="name" defaultValue={patient.name} required className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="age" className="block text-sm font-medium text-slate-700">Age</label>
            <input type="number" id="age" name="age" defaultValue={patient.age} required className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>

          <div className="space-y-2">
            <label htmlFor="gender" className="block text-sm font-medium text-slate-700">Gender</label>
            <select id="gender" name="gender" defaultValue={patient.gender} required className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white">
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-medium text-slate-700">Phone</label>
            <input type="tel" id="phone" name="phone" defaultValue={patient.phone} required className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
            <input type="email" id="email" name="email" defaultValue={patient.email} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>

          <div className="space-y-2">
            <label htmlFor="bloodPressure" className="block text-sm font-medium text-slate-700">Blood Pressure</label>
            <input type="text" id="bloodPressure" name="bloodPressure" defaultValue={patient.bloodPressure} placeholder="120/80" className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>

          <div className="space-y-2">
            <label htmlFor="cholesterol" className="block text-sm font-medium text-slate-700">Cholesterol</label>
            <input type="number" id="cholesterol" name="cholesterol" defaultValue={patient.cholesterol} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>

          <div className="space-y-2">
            <label htmlFor="heartRate" className="block text-sm font-medium text-slate-700">Heart Rate</label>
            <input type="number" id="heartRate" name="heartRate" defaultValue={patient.heartRate} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="address" className="block text-sm font-medium text-slate-700">Address</label>
          <textarea id="address" name="address" defaultValue={patient.address} rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
        </div>

        <div className="pt-4 flex justify-end">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 font-medium transition-colors">
            Update Patient
          </button>
        </div>
      </form>
    </div>
  );
}