"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createPatient, updatePatient, deletePatient } from "@/lib/patients";

export async function createPatientAction(formData: FormData) {
  const data = {
    name: formData.get("name") as string,
    age: parseInt(formData.get("age") as string, 10),
    gender: formData.get("gender") as string,
    phone: formData.get("phone") as string,
    email: formData.get("email") as string,
    bloodPressure: formData.get("bloodPressure") as string,
    cholesterol: parseInt(formData.get("cholesterol") as string, 10),
    heartRate: parseInt(formData.get("heartRate") as string, 10),
    address: formData.get("address") as string,
  };

  await createPatient(data);
  revalidatePath("/patients");
  revalidatePath("/dashboard");
  redirect("/patients");
}

export async function updatePatientAction(id: string, formData: FormData) {
  const data = {
    name: formData.get("name") as string,
    age: parseInt(formData.get("age") as string, 10),
    gender: formData.get("gender") as string,
    phone: formData.get("phone") as string,
    email: formData.get("email") as string,
    bloodPressure: formData.get("bloodPressure") as string,
    cholesterol: parseInt(formData.get("cholesterol") as string, 10),
    heartRate: parseInt(formData.get("heartRate") as string, 10),
    address: formData.get("address") as string,
  };

  await updatePatient(id, data);
  revalidatePath("/patients");
  revalidatePath(`/patients/${id}`);
  revalidatePath("/dashboard");
  redirect("/patients");
}

export async function deletePatientAction(id: string) {
  await deletePatient(id);
  revalidatePath("/patients");
  revalidatePath("/dashboard");
}
