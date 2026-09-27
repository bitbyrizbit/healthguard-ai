import { NextRequest, NextResponse } from "next/server";
import { getPatients, createPatient } from "@/lib/patients";

export async function GET() {
  const patients = await getPatients();
  return NextResponse.json(patients);
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const newPatient = await createPatient(data);
    return NextResponse.json(newPatient, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create patient" }, { status: 400 });
  }
}
