import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import {
  LayoutDashboardIcon,
  SparklesIcon,
  StethoscopeIcon,
  CalendarIcon,
  FlaskConicalIcon,
  PillIcon,
  ShieldPlusIcon,
} from "lucide-react"

const patientNavItems = [
  { title: "Dashboard", url: "/patient/dashboard", icon: <LayoutDashboardIcon /> },
  { title: "Check Symptoms", url: "/patient/symptom-checker", icon: <ShieldPlusIcon /> },
  { title: "Find Doctors", url: "/patient/find-doctors", icon: <StethoscopeIcon /> },
  { title: "My Appointments", url: "/patient/appointments", icon: <CalendarIcon /> },
  { title: "Upload Lab Reports", url: "/patient/lab-reports", icon: <FlaskConicalIcon /> },
  { title: "My Prescriptions", url: "/patient/prescriptions", icon: <PillIcon /> },
]

const patientUser = {
  name: "John Patient",
  email: "john@example.com",
  avatar: "/avatars/patient.jpg",
}

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" navItems={patientNavItems} user={patientUser} brandName="Distributed Health" />
      <SidebarInset>
        <SiteHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
