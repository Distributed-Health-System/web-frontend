import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import {
  LayoutDashboardIcon,
  UsersIcon,
  CalendarIcon,
  VideoIcon,
  ClipboardPlusIcon,
  WalletIcon,
  StarIcon,
} from "lucide-react"

const doctorNavItems = [
  { title: "Dashboard", url: "/doctor/dashboard", icon: <LayoutDashboardIcon /> },
  { title: "My Patients", url: "/doctor/patients", icon: <UsersIcon /> },
  { title: "Schedule", url: "/doctor/schedule", icon: <CalendarIcon /> },
  { title: "Consultations", url: "/doctor/consultations", icon: <VideoIcon /> },
  { title: "Prescriptions", url: "/doctor/prescriptions", icon: <ClipboardPlusIcon /> },
  { title: "Earnings", url: "/doctor/earnings", icon: <WalletIcon /> },
  { title: "Reviews", url: "/doctor/reviews", icon: <StarIcon /> },
]

const doctorUser = {
  name: "Dr. John Smith",
  email: "dr.smith@example.com",
  avatar: "/avatars/doctor.jpg",
}

export default function DoctorLayout({
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
      <AppSidebar
        variant="inset"
        navItems={doctorNavItems}
        user={doctorUser}
        brandName="Distributed Health"
      />
      <SidebarInset>
        <SiteHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
