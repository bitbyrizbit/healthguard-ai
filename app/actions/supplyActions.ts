'use server';

import { revalidatePath } from 'next/cache';
import { connectToDatabase } from '@/app/lib/mongodb';
import { MedicalSupply } from '@/app/models/MedicalSupply';

export async function createSupplyAction(formData: FormData) {
  await connectToDatabase();

  const title = formData.get('title') as string;
  const category = formData.get('category') as string;
  const price = parseFloat(formData.get('price') as string);
  const sku = formData.get('sku') as string;
  const stock = parseInt(formData.get('stock') as string, 10);
  const warehouseLocation = formData.get('warehouseLocation') as string;

  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  await MedicalSupply.create({
    title,
    slug,
    price,
    category,
    inventory: {
      sku,
      stock,
      warehouseLocation
    }
  });

  revalidatePath('/supplies');
}

export async function deleteSupplyAction(id: string) {
  await connectToDatabase();
  await MedicalSupply.findByIdAndDelete(id);
  revalidatePath('/supplies');
}
