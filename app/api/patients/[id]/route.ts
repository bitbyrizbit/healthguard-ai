import { NextRequest, NextResponse } from "next/server";
import { getPatientById, updatePatient, deletePatient } from "@/lib/patients";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const patient = await getPatientById(id);
  
  if (!patient) {
    return NextResponse.json({ error: "Patient not found" }, { status: 404 });
  }
  
  return NextResponse.json(patient);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    const updatedPatient = await updatePatient(id, data);
    
    if (!updatedPatient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }
    
    return NextResponse.json(updatedPatient);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update patient" }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const success = await deletePatient(id);
  
  if (!success) {
    return NextResponse.json({ error: "Patient not found" }, { status: 404 });
  }
  
  return NextResponse.json({ message: "Patient deleted successfully" });
}
