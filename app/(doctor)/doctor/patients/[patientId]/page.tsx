import { notFound } from "next/navigation"
import { mockPatients } from "@/features/doctor/lib/mock-data"
import { PatientRecordsView } from "@/features/doctor/components/patients/PatientRecordsView"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { PhoneIcon, MailIcon, CalendarIcon } from "lucide-react"

interface Props {
  params: { patientId: string }
}

export default function PatientDetailPage({ params }: Props) {
  const patient = mockPatients.find((p) => p.id === params.patientId)
  if (!patient) notFound()

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-6 py-4 md:py-6 px-4 lg:px-6">
          {/* Patient profile */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-5">
                <Avatar className="size-16">
                  <AvatarFallback className="bg-secondary text-secondary-foreground h3">
                    {patient.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-1 flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <h1 className="h3">{patient.name}</h1>
                    <Badge variant="secondary" className="label-sm capitalize">{patient.gender}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <span className="helper-text flex items-center gap-1.5">
                      <CalendarIcon className="size-3" /> {patient.age} years old
                    </span>
                    <span className="helper-text flex items-center gap-1.5">
                      <PhoneIcon className="size-3" /> {patient.phone}
                    </span>
                    <span className="helper-text flex items-center gap-1.5">
                      <MailIcon className="size-3" /> {patient.email}
                    </span>
                  </div>
                  {patient.conditions.length > 0 && (
                    <div className="flex gap-2 flex-wrap mt-1">
                      {patient.conditions.map((c) => (
                        <Badge key={c} variant="outline" className="label-sm">{c}</Badge>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-6 mt-2">
                    <div>
                      <span className="h4">{patient.totalVisits}</span>
                      <p className="helper-text">Total visits</p>
                    </div>
                    <Separator orientation="vertical" className="h-8" />
                    <div>
                      <span className="h4">{patient.records.length}</span>
                      <p className="helper-text">Records uploaded</p>
                    </div>
                    <Separator orientation="vertical" className="h-8" />
                    <div>
                      <span className="h4">{patient.lastVisit}</span>
                      <p className="helper-text">Last visit</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Records */}
          <div>
            <h2 className="h4 mb-4">Uploaded Records</h2>
            <PatientRecordsView records={patient.records} />
          </div>
        </div>
      </div>
    </div>
  )
}
