"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
    Activity, Shield, ShieldCheck, CheckCircle2, Lock, FileCheck, 
    Quote, Heart, Star, Globe, MessageSquare 
} from "lucide-react";

export default function Home() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-white text-[#0b1c30] font-sans selection:bg-primary/20">
            {/* Header */}
            <header className="w-full flex items-center justify-between py-6 px-10 bg-white">
                <div className="flex items-center gap-2">
                    <Image src="/assets/logo/logo.svg" alt="Distributed Health Logo" width={28} height={28} />
                    <span className="text-xl font-bold tracking-tight text-[#0b1c30]">
                        Distributed Health
                    </span>
                </div>
                
                <nav className="hidden md:flex items-center gap-8 text-[13px] font-medium text-slate-500">
                    <a href="#" className="hover:text-[#0b1c30] transition-colors">Features</a>
                    <a href="#" className="hover:text-[#0b1c30] transition-colors">Services</a>
                    <a href="#" className="hover:text-[#0b1c30] transition-colors">Research</a>
                </nav>

                <div className="flex items-center gap-4">
                    <Button variant="ghost" className="text-[13px] font-semibold text-[#0b1c30] hover:bg-transparent cursor-pointer" onClick={() => router.push('/login')}>
                        Log In
                    </Button>
                    <Button className="rounded-full px-6 bg-[#004a74] hover:bg-[#003655] text-white text-[13px] font-bold h-9 cursor-pointer" onClick={() => router.push('/sign-up')}>
                        Sign Up
                    </Button>
                </div>
            </header>

            {/* Hero Section */}
            <section className="container mx-auto px-10 pt-16 pb-20 grid lg:grid-cols-2 gap-12 items-center">
                <div className="flex flex-col gap-6 max-w-lg">
                    <div className="inline-flex items-center gap-2 bg-[#e8f3fb] text-[#0065a1] px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wide w-fit">
                        <Shield className="w-3.5 h-3.5" />
                        HIPAA Compliant Digital Healthcare
                    </div>
                    
                    <h1 className="text-[3.5rem] leading-[1.05] font-light tracking-tight text-[#0b1c30]">
                        A digital <br/>
                        sanctuary for <br/>
                        your <span className="text-[#0065a1]">health.</span>
                    </h1>
                    
                    <p className="text-[#4b5563] text-[15px] leading-relaxed pr-6">
                        Experience clinical excellence without the clinical stress. A refined, editorial platform connecting patients with top-tier providers in a serene environment.
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-4 pt-2">
                        <Button className="rounded-md px-6 h-11 bg-[#004a74] hover:bg-[#003655] text-white font-bold text-[13px] cursor-pointer">
                            Start Your Journey
                        </Button>
                        <Button variant="outline" className="rounded-md px-6 h-11 border-slate-200 text-[#0b1c30] hover:bg-slate-50 font-bold text-[13px] shadow-sm cursor-pointer">
                            Learn Our Process
                        </Button>
                    </div>
                </div>

                <div className="relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl bg-slate-100 flex items-center justify-center">
                    <Image 
                        src="/assets/images/Live Health Tracking.svg" 
                        alt="Hero Image"
                        fill
                        className="object-cover"
                    />
                    {/* Blurred Card Overlay */}
                    <div className="absolute bottom-6 left-6 max-w-sm backdrop-blur-xl bg-white/70 border border-white/40 p-4 rounded-xl flex items-center gap-4 shadow-lg">
                        <div className="flex-shrink-0 w-10 h-10 bg-[#0D5B2C] rounded-lg flex items-center justify-center">
                            <Activity className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-[13px] font-extrabold text-[#0b1c30] leading-tight">Live Health Tracking</p>
                            <p className="text-[11px] text-[#0b1c30]/70 mt-0.5 font-medium">Real-time vitals monitoring enabled.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Banner */}
            <div className="w-full bg-[#f8fbff] py-6 border-y border-blue-50">
                <div className="container mx-auto px-10 flex flex-wrap items-center justify-center gap-y-4 gap-x-12 md:justify-around">
                    <div className="flex items-center gap-2 text-[#94a3b8] font-bold text-[11px] tracking-widest">
                        <ShieldCheck className="w-4 h-4 text-[#0065a1]" />
                        HIPAA COMPLIANT
                    </div>
                    <div className="flex items-center gap-2 text-[#94a3b8] font-bold text-[11px] tracking-widest">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        VERIFIED DOCTORS
                    </div>
                    <div className="flex items-center gap-2 text-[#94a3b8] font-bold text-[11px] tracking-widest">
                        <Lock className="w-4 h-4 text-[#0065a1]" />
                        256-BIT ENCRYPTION
                    </div>
                    <div className="flex items-center gap-2 text-[#94a3b8] font-bold text-[11px] tracking-widest">
                        <FileCheck className="w-4 h-4 text-[#0065a1]" />
                        GDPR READY
                    </div>
                </div>
            </div>

            {/* Features Intro */}
            <section className="pt-24 pb-16 px-6 text-center max-w-2xl mx-auto">
                <h2 className="text-[28px] font-bold text-[#0b1c30] mb-3 tracking-tight">Sophisticated Care, Simplified.</h2>
                <p className="text-[13px] text-[#4b5563] leading-relaxed font-medium">
                    We&apos;ve bridged the gap between complex medical precision and human-centric design for both patients and clinicians.
                </p>
            </section>

            {/* Features Grid */}
            <section className="container mx-auto px-6 max-w-6xl pb-24">
                <div className="grid md:grid-cols-3 gap-6">
                    
                    {/* Patients Wide Card */}
                    <Card className="md:col-span-2 rounded-[24px] bg-[#e6f4fe] border-none overflow-hidden relative shadow-none min-h-[320px]">
                        <div className="relative z-10 p-10 max-w-[50%]">
                            <p className="text-[10px] font-extrabold tracking-widest text-[#0065a1] mb-2 uppercase">For Patients</p>
                            <h3 className="text-[28px] font-light text-[#0b1c30] mb-8 leading-tight">Your Wellness, Curated.</h3>
                            
                            <ul className="space-y-4">
                                {[
                                    "Schedule consultations with top specialists in seconds.",
                                    "Access your entire medical history in a secure dashboard.",
                                    "Receive personalized wellness insights powered by data."
                                ].map((text, i) => (
                                    <li key={i} className="flex items-start gap-3 text-[13px] text-[#0b1c30] font-medium leading-relaxed">
                                        <div className="mt-0.5 rounded-full bg-green-100 p-0.5">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                                        </div>
                                        {text}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="absolute right-0 top-0 bottom-0 w-[50%] h-full overflow-hidden">
                            <Image src="/assets/images/For Patients.svg" alt="For Patients Dashboard" fill className="object-cover object-left" />
                        </div>
                    </Card>

                    {/* Clinicians Narrow Card */}
                    <Card className="md:col-span-1 rounded-[24px] bg-[#004a74] border-none text-white p-10 flex flex-col relative overflow-hidden shadow-none min-h-[320px]">
                        <p className="text-[10px] font-extrabold tracking-widest text-white/50 mb-2 uppercase">For Clinicians</p>
                        <h3 className="text-[24px] font-light mb-3 leading-tight">Practice with Precision.</h3>
                        <p className="text-[13px] text-white/80 mb-8 leading-relaxed font-medium">
                            Reduce administrative fatigue with an interface built for focus and clinical accuracy.
                        </p>
                        <div className="mt-auto relative z-10">
                            <Button 
                                className="bg-white text-[#0b1c30] hover:bg-slate-100 rounded-md text-[12px] font-bold px-5 h-9 cursor-pointer"
                                onClick={() => router.push('/sign-up?role=doctor')}
                            >
                                Join the Network
                            </Button>
                        </div>
                        {/* Medical Bag Graphic */}
                        <div className="absolute bottom-6 right-6 opacity-30 transform rotate-12 scale-150 origin-bottom-right">
                            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                                <path d="M4 6h16v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6z" />
                                <path d="M8 6V4c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v2" />
                                <path d="M12 10v6M9 13h6" />
                            </svg>
                        </div>

                    </Card>

                    {/* Green Quote Card */}
                    <Card className="md:col-span-1 rounded-[24px] bg-[#0D5B2C] border-none text-white p-10 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-none min-h-[260px]">
                        <Quote className="w-6 h-6 text-white/60 mb-5 fill-white" />
                        <p className="text-[14px] font-bold italic mb-6 leading-relaxed text-white">
                            &quot;Finally, a healthcare platform that doesn&apos;t feel like a hospital waiting room. It&apos;s truly a digital sanctuary.&quot;
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0">
                                <Image src="/assets/images/Sarah.svg" alt="Sarah" fill className="object-cover" />
                            </div>
                            <span className="text-[11px] font-bold tracking-wide">Sarah Jenkins, Patient</span>
                        </div>
                    </Card>

                    {/* Holistic Integration Card */}
                    <Card className="md:col-span-2 rounded-[24px] bg-white border border-slate-100 p-10 flex flex-col sm:flex-row items-center justify-between shadow-none relative overflow-hidden min-h-[260px]">
                        <div className="max-w-xs z-10 relative">
                            <h3 className="text-[20px] font-normal text-[#0b1c30] mb-3">Holistic Integration</h3>
                            <p className="text-[13px] text-[#64748b] mb-6 leading-relaxed font-medium">
                                We integrate your wearable data with clinical insights to provide a 360° view of your wellness journey.
                            </p>
                            <div className="flex gap-2">
                                <Badge variant="secondary" className="rounded-full bg-[#f1f5f9] text-[#0b1c30] font-bold px-3 py-1 text-[10px] hover:bg-[#e2e8f0]">Apple Health</Badge>
                                <Badge variant="secondary" className="rounded-full bg-[#f1f5f9] text-[#0b1c30] font-bold px-3 py-1 text-[10px] hover:bg-[#e2e8f0]">Fitbit</Badge>
                            </div>
                        </div>
                        {/* Graphic */}
                        <div className="relative mt-8 sm:mt-0 right-4 sm:right-12">
                            <div className="w-28 h-28 rounded-full bg-[#86efac] border-4 border-white shadow-sm z-0"></div>
                            <div className="absolute top-1 right-20 bg-white rounded-full p-2.5 shadow-xl border border-slate-100 z-10 rotate-[-10deg]">
                                <Heart className="w-5 h-5 text-[#0b1c30] fill-[#0b1c30]" />
                            </div>
                        </div>
                    </Card>
                </div>
            </section>

            {/* Testimonials */}
            <section className="bg-[#f8f9fc] py-20">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                p: '"The interface is so intuitive. As a doctor, I spend less time fighting with software and more time with my patients."',
                                initials: "DR",
                                name: "Dr. Robert Chen",
                                role: "Cardiologist",
                                bg: "bg-[#e6f4fe] text-[#0065a1]"
                            },
                            {
                                p: '"Security was my main concern, but knowing they are HIPAA compliant and encrypted made me feel completely safe."',
                                initials: "MK",
                                name: "Maria Kostas",
                                role: "Patient",
                                bg: "bg-[#e6f4fe] text-[#0065a1]"
                            },
                            {
                                p: '"The transition from my old portal to Distributed Health was seamless. The design is beautiful and functional."',
                                initials: "JA",
                                name: "James Avo",
                                role: "Patient",
                                bg: "bg-green-100 text-green-700"
                            }
                        ].map((t, i) => (
                            <Card key={i} className="bg-white rounded-[20px] p-8 shadow-sm border-none">
                                <div className="flex gap-1 mb-5 text-[#0065a1]">
                                    <Star fill="currentColor" stroke="none" className="w-[14px] h-[14px]" />
                                    <Star fill="currentColor" stroke="none" className="w-[14px] h-[14px]" />
                                    <Star fill="currentColor" stroke="none" className="w-[14px] h-[14px]" />
                                    <Star fill="currentColor" stroke="none" className="w-[14px] h-[14px]" />
                                    <Star fill="currentColor" stroke="none" className="w-[14px] h-[14px]" />
                                </div>
                                <p className="text-[13px] text-[#4b5563] mb-8 leading-relaxed font-medium min-h-[60px]">
                                    {t.p}
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-[11px] ${t.bg}`}>
                                        {t.initials}
                                    </div>
                                    <div>
                                        <p className="text-[12px] font-extrabold text-[#0b1c30] leading-none mb-1.5">{t.name}</p>
                                        <p className="text-[9px] text-[#94a3b8] font-bold uppercase tracking-widest">{t.role}</p>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="bg-[#f8f9fc] pb-20 pt-6">
                <div className="container mx-auto px-6 max-w-5xl">
                    <Card className="bg-[#004a74] rounded-[36px] border-none text-white text-center py-20 px-8 relative overflow-hidden shadow-2xl">
                        {/* Faint graphic background */}
                        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none flex justify-center items-center">
                            <div className="w-[600px] h-[600px] rounded-full border-[80px] border-white/20 -translate-y-20 scale-150"></div>
                        </div>
                        <div className="relative z-10">
                            <h2 className="text-[32px] font-bold mb-4 tracking-tight">Ready to find your sanctuary?</h2>
                            <p className="text-[14px] text-white/80 max-w-[400px] mx-auto mb-10 leading-relaxed font-medium">
                                Join thousands of patients and doctors who have already redefined their healthcare experience.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <Button className="bg-white text-[#004a74] hover:bg-slate-100 rounded-md font-bold px-8 h-12 text-[13px] shadow-sm cursor-pointer" onClick={() => router.push('/sign-up')}>
                                    Create Your Account
                                </Button>
                                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-md font-bold px-8 h-12 bg-transparent text-[13px] cursor-pointer" onClick={() => router.push('/login')}>
                                    Book a Demo
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white py-8 border-t border-slate-100">
                <div className="container mx-auto px-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex flex-col items-center md:items-start">
                        <div className="flex items-center gap-2 mb-1">
                            <Image src="/assets/logo/logo.svg" alt="Distributed Health Logo" width={20} height={20} className="grayscale opacity-70" />
                            <span className="font-extrabold text-[#004a74] text-[15px]">Distributed Health</span>
                        </div>
                        <span className="text-[9px] text-[#94a3b8] font-bold uppercase tracking-widest">© 2024 Distributed Health. All rights reserved.</span>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[11px] text-[#64748b] font-bold">
                        <a href="#" className="hover:text-[#0b1c30]">Privacy Policy</a>
                        <a href="#" className="hover:text-[#0b1c30]">Terms of Service</a>
                        <a href="#" className="hover:text-[#0b1c30]">HIPAA Compliance</a>
                        <a href="#" className="hover:text-[#0b1c30]">Contact</a>
                    </div>
                    <div className="flex gap-4">
                        <Globe className="w-4 h-4 text-[#94a3b8] hover:text-[#0b1c30] cursor-pointer" />
                        <MessageSquare className="w-4 h-4 text-[#94a3b8] hover:text-[#0b1c30] cursor-pointer" />
                    </div>
                </div>
            </footer>
        </div>
    );
}
