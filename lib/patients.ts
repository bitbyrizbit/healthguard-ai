import fs from 'fs';
import path from 'path';

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  bloodPressure: string;
  cholesterol: number;
  heartRate: number;
  address: string;
}

const dataFilePath = path.join(process.cwd(), 'data', 'patients.json');

export async function getPatients(): Promise<Patient[]> {
  try {
    const fileData = await fs.promises.readFile(dataFilePath, 'utf8');
    return JSON.parse(fileData) as Patient[];
  } catch (error) {
    return [];
  }
}

export async function getPatientById(id: string): Promise<Patient | undefined> {
  const patients = await getPatients();
  return patients.find(p => p.id === id);
}

export async function createPatient(patientData: Omit<Patient, 'id'>): Promise<Patient> {
  const patients = await getPatients();
  const newPatient: Patient = {
    ...patientData,
    id: Date.now().toString(),
  };
  
  patients.push(newPatient);
  await fs.promises.writeFile(dataFilePath, JSON.stringify(patients, null, 2));
  return newPatient;
}

export async function updatePatient(id: string, updateData: Partial<Patient>): Promise<Patient | null> {
  const patients = await getPatients();
  const index = patients.findIndex(p => p.id === id);
  
  if (index === -1) return null;
  
  const updatedPatient = { ...patients[index], ...updateData };
  patients[index] = updatedPatient;
  
  await fs.promises.writeFile(dataFilePath, JSON.stringify(patients, null, 2));
  return updatedPatient;
}

export async function deletePatient(id: string): Promise<boolean> {
  const patients = await getPatients();
  const filteredPatients = patients.filter(p => p.id !== id);
  
  if (patients.length === filteredPatients.length) return false;
  
  await fs.promises.writeFile(dataFilePath, JSON.stringify(filteredPatients, null, 2));
  return true;
}
