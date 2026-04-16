"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { PillIcon } from "lucide-react"
import type { Prescription } from "../../types"

interface PrescriptionListProps {
  prescriptions: Prescription[]
}

export function PrescriptionList({ prescriptions }: PrescriptionListProps) {
  return (
    <div className="flex flex-col gap-4">
      <span className="h4">Past Prescriptions</span>
      {prescriptions.length === 0 ? (
        <p className="helper-text py-8 text-center">No prescriptions issued yet.</p>
      ) : (
        prescriptions.map((rx) => (
          <Card key={rx.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-secondary text-secondary-foreground body-sm">
                      {rx.patientName.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="label block">{rx.patientName}</span>
                    <span className="helper-text">Issued {rx.issuedAt}</span>
                  </div>
                </div>
                <Badge variant="outline" className="label-sm">
                  {rx.medications.length} medication{rx.medications.length !== 1 ? "s" : ""}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {rx.medications.map((med, idx) => (
                <div key={med.id}>
                  {idx > 0 && <Separator className="mb-3" />}
                  <div className="flex items-start gap-2">
                    <PillIcon className="size-4 text-primary mt-0.5 shrink-0" />
                    <div className="flex flex-col gap-0.5">
                      <span className="label">{med.name} <span className="helper-text font-normal">· {med.dosage}</span></span>
                      <span className="helper-text">{med.frequency} · {med.duration}</span>
                      {med.instructions && (
                        <span className="helper-text italic">{med.instructions}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {rx.notes && (
                <>
                  <Separator />
                  <p className="helper-text">{rx.notes}</p>
                </>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
