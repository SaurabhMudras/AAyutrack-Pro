
export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  rbmpId?: string;
  mobile?: string;
};

export type HealthLog = {
  id: string;
  date: string;
  type: 'blood_pressure' | 'blood_sugar' | 'symptom';
  value: string;
  notes?: string;
};

export type Medication = {
  id: string;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
};

export type Reminder = {
    id: string;
    patientId: string;
    type: 'medicine' | 'appointment' | 'exercise';
    title: string;
    details?: string;
    time: string;
    date?: string;
    isRecurring?: boolean;
    completedOn?: string[]; // Array of YYYY-MM-DD dates
    createdAt: any; // Firestore.Timestamp
}

export type Streak = {
  id: 'daily_checkin' | 'medication_adherence';
  name: string;
  currentStreak: number;
  longestStreak: number;
  goal: number;
};

export type EmergencyContact = {
  id: string;
  name: string;
  relation: string;
  phone: string;
};

export type Doctor = {
  id: string;
  name: string;
  specialty: string;
  avatarUrl: string;
  email?: string;
};

export type Hospital = {
  id: string;
  name: string;
  address: string;
  phone: string;
  distance: string;
};

export type Pharmacy = {
  id: string;
  name: string;
  address: string;
  distance: string;
};

export type PrescribedMedicine = {
  name: string;
  dosage: string;
  instructions: string;
}

export type Prescription = {
  id: string;
  patientId: string;
  doctorId: string; // Could be 'self' for manually added
  doctorName: string;
  date: string; // YYYY-MM-DD
  medicines: PrescribedMedicine[];
  createdAt: any; // Firestore.Timestamp
}

