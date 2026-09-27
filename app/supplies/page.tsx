import { connectToDatabase } from '@/app/lib/mongodb';
import { MedicalSupply } from '@/app/models/MedicalSupply';
import { createSupplyAction, deleteSupplyAction } from '@/app/actions/supplyActions';

export const dynamic = 'force-dynamic';

export default async function SuppliesPage() {
  let supplies: any[] = [];
  try {
    await connectToDatabase();
    // Use .lean() to convert Mongoose documents to plain JavaScript objects for passing to Client Components
    supplies = await MedicalSupply.find({}).sort({ createdAt: -1 }).lean();
  } catch (error) {
    console.error("MongoDB error:", error);
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Medical Supplies Inventory</h1>
        <p className="text-slate-500 mt-1">Manage hospital inventory via MongoDB and Mongoose.</p>
      </div>

      {/* Form Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-slate-50/50">
          <h2 className="text-xl font-semibold text-slate-900">Add New Supply</h2>
        </div>
        <div className="p-6">
          <form action={createSupplyAction} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Item Title</label>
                <input type="text" name="title" placeholder="e.g. N95 Surgical Masks" required className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm bg-white" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Category</label>
                <select name="category" className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm bg-white">
                  <option value="PPE">PPE</option>
                  <option value="Medication">Medication</option>
                  <option value="Surgical">Surgical</option>
                  <option value="Diagnostics">Diagnostics</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Price ($)</label>
                <input type="number" step="0.01" name="price" placeholder="45.99" required className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm bg-white" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">SKU (Inventory)</label>
                <input type="text" name="sku" placeholder="MSK-N95-001" required className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm bg-white" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Stock Count</label>
                <input type="number" name="stock" placeholder="500" required className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm bg-white" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Warehouse Location</label>
                <input type="text" name="warehouseLocation" placeholder="Sector 4, Aisle B" required className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm bg-white" />
              </div>
            </div>
            <div className="flex justify-end">
              <button type="submit" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 font-medium">
                Add Supply
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* List Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">Current Inventory</h2>
        </div>
        <div className="p-0">
          <ul className="divide-y divide-slate-200">
            {supplies.length === 0 ? (
              <li className="p-6 text-center text-slate-500">No supplies found or MongoDB is offline.</li>
            ) : (
              supplies.map((item: any) => (
                <li key={item._id.toString()} className="p-6 hover:bg-slate-50 flex justify-between items-center gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{item.title} <span className="text-sm font-normal text-slate-500 ml-2">({item.category})</span></h3>
                    <p className="text-sm text-slate-600 mt-1">
                      SKU: <span className="font-mono">{item.inventory.sku}</span> | Stock: <span className="font-bold">{item.inventory.stock}</span> | Location: {item.inventory.warehouseLocation}
                    </p>
                  </div>
                  <form action={deleteSupplyAction.bind(null, item._id.toString())}>
                    <button type="submit" className="text-red-600 hover:bg-red-50 px-4 py-2 rounded-md font-medium text-sm border border-transparent hover:border-red-100">
                      Delete
                    </button>
                  </form>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
