import Link from "next/link"
import {
  Activity,
  CalendarDays,
  FlaskConical,
  Heart,
  Pill,
  ShieldPlus,
  Thermometer,
  Video,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

type QuickAction = {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

type VitalCard = {
  label: string
  value: string
  unit: string
  status: string
  statusClassName: string
  icon: React.ComponentType<{ className?: string }>
  borderClassName: string
}

type Consultation = {
  doctor: string
  specialty: string
  time: string
}

const quickActions: QuickAction[] = [
  { label: "Book Appointment", href: "/patient/find-doctors", icon: CalendarDays },
  { label: "Upload Report", href: "/patient/lab-reports", icon: FlaskConical },
  { label: "Check Prescriptions", href: "/patient/prescriptions", icon: Pill },

]

const vitals: VitalCard[] = [
  {
    label: "Upcoming Appointments",
    value: "3",
    unit: "this week",
    status: "2 today",
    statusClassName: "bg-green-100 text-green-700",
    icon: CalendarDays,
    borderClassName: "",
  },
  {
    label: "Prescriptions",
    value: "5",
    unit: "",
    status: "This week",
    statusClassName: "bg-slate-100 text-slate-500",
    icon: Pill,
    borderClassName: "",
  },
  {
    label: "Reports Uploaded",
    value: "12",
    unit: "total",
    status: "2 this week",
    statusClassName: "bg-slate-100 text-slate-500",
    icon: FlaskConical,
    borderClassName: "",
  },
]

const upcoming: Consultation[] = [
  {
    doctor: "Dr. Sarah Jenkins",
    specialty: "Senior Cardiologist • General Hospital",
    time: "Today, 11:30 AM",
  },
]

export default function Page() {
  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6 lg:px-6">
      <div>
        <h1 className="h1 text-foreground">Overview</h1>
      </div>

      <Card className="relative overflow-hidden rounded-[28px] border-0 bg-[#005789] text-white">
        <CardContent className="relative z-10 flex flex-col gap-4 p-7 md:p-8">
          <Badge className="w-fit rounded-full bg-white/20 px-4 py-1 label text-white hover:bg-white/20">
            MONDAY, OCTOBER 24
          </Badge>
          <div className="space-y-1">
            <h2 className="h2 text-[#48a7da]">Good Morning, Alex</h2>
            <p className="body-lg text-white/90">
              You have a consultation with Dr. Sarah Jenkins in 2 hours.
            </p>
            <p className="body-lg text-white/90">
              Your vitals from this morning look stable.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 pt-1">
            <Button className="rounded-full bg-white px-7 text-[#0065a1] hover:bg-white/90">
              Join Consultation
            </Button>
            <Button
              variant="secondary"
              className="rounded-full border border-white/15 bg-white/15 px-7 text-white hover:bg-white/25"
            >
              View Details
            </Button>
          </div>
        </CardContent>
        <div className="pointer-events-none absolute right-[-42px] top-[-20px] hidden size-56 rounded-[40px] border-[20px] border-[#66abd4]/40 md:block" />
      </Card>

      <div className="flex justify-end">
        <Button className="rounded-2xl bg-green-800 px-6 py-5 text-sm hover:bg-green-900">
          <ShieldPlus className="size-4" />
          AI Symptom Checker
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
        <section className="space-y-4">
          <h3 className="h2 text-foreground">Quick Actions</h3>
          <div className="flex flex-col gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Link
                  key={action.label}
                  href={action.href}
                  className="block w-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl"
                >
                  <Card className="rounded-xl border border-border/40 bg-secondary shadow-sm transition-colors hover:bg-secondary/80">
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="rounded-xl bg-muted p-3">
                        <Icon className="size-4 text-primary" />
                      </div>
                      <p className="body-lg text-foreground">{action.label}</p>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="h2 text-foreground">Patient Overview</h3>
          <div className="grid gap-4 md:grid-cols-3">
            {vitals.map((vital) => {
              const Icon = vital.icon
              return (
                <Card
                  key={vital.label}
                  className={`@container/card rounded-2xl bg-card ${vital.borderClassName}`}
                >
                  <CardContent className="space-y-5 p-5">
                    <div className="flex items-center justify-between">
                      <div className="rounded-xl bg-muted p-2.5">
                        <Icon className="size-4 text-primary" />
                      </div>
                      <Badge className={`rounded-full px-2.5 py-1 label-sm ${vital.statusClassName}`}>
                        {vital.status}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="body-lg text-card-foreground">{vital.label}</p>
                      <div className="flex items-end gap-1">
                        <span className="h2 text-foreground">{vital.value}</span>
                        <span className="label-sm pb-1 text-muted-foreground">{vital.unit}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="pt-2">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="h2 text-foreground">Upcoming Consultations</h3>
              <Button variant="link" className="text-primary">
                View All
              </Button>
            </div>
            {upcoming.map((consultation) => (
              <Card key={consultation.doctor} className="rounded-3xl border-0 bg-secondary shadow-none">
                <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start gap-4">
                    <Avatar className="size-14 rounded-2xl">
                      <AvatarFallback className="rounded-2xl bg-primary/15 text-primary">
                        SJ
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="h4 text-foreground">{consultation.doctor}</p>
                      <p className="body-base text-muted-foreground">{consultation.specialty}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge variant="secondary" className="rounded-full px-3 py-1 label-sm">
                          {consultation.time}
                        </Badge>
                        <Badge variant="secondary" className="rounded-full px-3 py-1 label-sm">
                          <Video className="mr-1 size-3" />
                          Video Call
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button className="rounded-full bg-[#005b9a] px-7 hover:bg-[#004f87]">
                    <Video className="size-4" />
                    Join Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
