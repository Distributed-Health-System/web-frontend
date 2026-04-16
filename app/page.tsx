"use client";

import { useRouter } from "next/navigation";
import { createTestAppointment, doctors, patients } from "../lib/mock-data";


export default function Home() {
    const router = useRouter();

    const handlePatientTest = () => {
        const apt = createTestAppointment(doctors[0].id, patients[0].id);
        router.push(`/patient/consultations/${apt.id}`);
    };

    const handleDoctorTest = () => {
        const apt = createTestAppointment(doctors[0].id, patients[0].id);
        router.push(`/doctor/consultations/${apt.id}`);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-background">
            <h1 className="text-2xl font-semibold text-white">
                MediConnect — Dev Launcher
            </h1>
            <p className="text-white/50 text-sm">
                Creates a test appointment scheduled for now and jumps straight
                to the call
            </p>
            <div className="flex gap-4">
                <button
                    onClick={handlePatientTest}
                    className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                >
                    Join as Patient
                </button>
                <button
                    onClick={handleDoctorTest}
                    className="px-6 py-3 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors"
                >
                    Join as Doctor
                </button>
            </div>
        </div>
    );
}
