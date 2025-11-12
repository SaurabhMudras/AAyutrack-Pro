import type { User, Medication, Streak, Doctor, Hospital } from "@/types";
import { PlaceHolderImages } from "./placeholder-images";

export const mockUser: User = {
  id: "user_01",
  name: "Alex Doe",
  email: "alex.doe@example.com",
  avatarUrl: PlaceHolderImages.find(img => img.id === 'user-avatar-1')?.imageUrl || '',
};

export const healthMetrics = {
  steps: {
    current: 8230,
    goal: 10000,
  },
  hydration: {
    current: 1.5,
    goal: 2.0,
  },
  medication: {
    taken: 2,
    total: 3,
  },
};

export const mockMedicationSchedule: Medication[] = [
  { id: "med1", name: "Metformin", dosage: "500mg", time: "08:00 AM", taken: true },
  { id: "med2", name: "Lisinopril", dosage: "10mg", time: "09:00 AM", taken: true },
  { id: "med3", name: "Atorvastatin", dosage: "20mg", time: "08:00 PM", taken: false },
];

export const mockStreaks: Streak[] = [
    {
        id: "daily_checkin",
        name: "Daily Health Log",
        currentStreak: 12,
        longestStreak: 25,
        goal: 14,
    },
    {
        id: "medication_adherence",
        name: "Medication Adherence",
        currentStreak: 34,
        longestStreak: 34,
        goal: 30,
    }
]

export const mockDoctors: Doctor[] = [
    {
        id: "doc1",
        name: "Dr. Evelyn Reed",
        specialty: "Cardiologist",
        avatarUrl: PlaceHolderImages.find(img => img.id === 'doctor-avatar-1')?.imageUrl || '',
        email: "evelyn.reed@clinic.com"
    },
    {
        id: "doc2",
        name: "Dr. Ben Carter",
        specialty: "Endocrinologist",
        avatarUrl: PlaceHolderImages.find(img => img.id === 'doctor-avatar-2')?.imageUrl || '',
        email: "ben.carter@clinic.com"
    }
]

export const mockHospitals: Hospital[] = [
    {
        id: "hosp1",
        name: "City General Hospital",
        address: "123 Health St, Metro City",
        phone: "(555) 123-4567",
        distance: "2.5 miles",
    },
    {
        id: "hosp2",
        name: "Community Wellness Center",
        address: "456 Wellness Ave, Metro City",
        phone: "(555) 765-4321",
        distance: "4.8 miles",
    }
]

export const healthTrendsData = {
    bloodPressure: [
        { date: 'Mon', systolic: 120, diastolic: 80 },
        { date: 'Tue', systolic: 122, diastolic: 81 },
        { date: 'Wed', systolic: 118, diastolic: 79 },
        { date: 'Thu', systolic: 125, diastolic: 82 },
        { date: 'Fri', systolic: 123, diastolic: 80 },
        { date: 'Sat', systolic: 120, diastolic: 78 },
        { date: 'Sun', systolic: 119, diastolic: 79 },
    ],
    bloodSugar: [
        { date: 'Mon', level: 95 },
        { date: 'Tue', level: 105 },
        { date: 'Wed', level: 98 },
        { date: 'Thu', level: 110 },
        { date: 'Fri', level: 102 },
        { date: 'Sat', level: 99 },
        { date: 'Sun', level: 96 },
    ],
    steps: [
        { date: 'Mon', steps: 8010 },
        { date: 'Tue', steps: 9500 },
        { date: 'Wed', steps: 7800 },
        { date: 'Thu', steps: 10200 },
        { date: 'Fri', steps: 8500 },
        { date: 'Sat', steps: 11000 },
        { date: 'Sun', steps: 8230 },
    ],
};
