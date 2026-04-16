"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { PillIcon } from "lucide-react"
import type { DoctorPatient, DoctorPrescription, PrescriptionStatus } from "../../types"

interface PrescriptionListProps {
  prescriptions: DoctorPrescription[]
  patients: DoctorPatient[]
}

function statusBadgeVariant(status: PrescriptionStatus): "default" | "secondary" | "destructive" | "outline" {
  if (status === "REVOKED") return "destructive"
  if (status === "AMENDED") return "secondary"
  return "outline"
}

function formatWhen(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })
}

export function PrescriptionList({ prescriptions, patients }: PrescriptionListProps) {
  const nameFor = (patientId: string) => patients.find((p) => p.id === patientId)?.name ?? patientId

  return (
    <div className="flex flex-col gap-4">
      <span className="h4">Prescriptions</span>
      {prescriptions.length === 0 ? (
        <p className="helper-text py-8 text-center">No prescriptions match this filter.</p>
      ) : (
        prescriptions.map((rx) => {
          const patientName = nameFor(rx.patientId)
          const initials = patientName
            .split(/\s+/)
            .filter(Boolean)
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()

          return (
            <Card key={rx.id}>
              <CardHeader className="pb-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8">
                      <AvatarFallback className="bg-secondary text-secondary-foreground body-sm">
                        {initials || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="label block">{patientName}</span>
                      <span className="helper-text">
                        Issued {formatWhen(rx.issuedAt)}
                        {rx.validUntil ? ` · Valid through ${formatWhen(rx.validUntil)}` : ""}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={statusBadgeVariant(rx.status)} className="label-sm uppercase">
                      {rx.status}
                    </Badge>
                    <Badge variant="outline" className="label-sm">
                      v{rx.version}
                    </Badge>
                    <Badge variant="outline" className="label-sm">
                      {rx.items.length} line{rx.items.length !== 1 ? "s" : ""}
                    </Badge>
                  </div>
                </div>
                {rx.diagnosis ? (
                  <p className="body-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Diagnosis:</span> {rx.diagnosis}
                  </p>
                ) : null}
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {rx.items.map((med, idx) => (
                  <div key={`${rx.id}-${idx}-${med.name}`}>
                    {idx > 0 && <Separator className="mb-3" />}
                    <div className="flex items-start gap-2">
                      <PillIcon className="mt-0.5 size-4 shrink-0 text-primary" />
                      <div className="flex flex-col gap-0.5">
                        <span className="label">
                          {med.name}{" "}
                          <span className="helper-text font-normal">· {med.dosage}</span>
                        </span>
                        <span className="helper-text">
                          {med.frequency} · {med.duration}
                        </span>
                        {med.instructions ? (
                          <span className="helper-text italic">{med.instructions}</span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
                {rx.notes ? (
                  <>
                    <Separator />
                    <p className="helper-text">{rx.notes}</p>
                  </>
                ) : null}
                {rx.status === "REVOKED" && (rx.revocationReason || rx.revokedAt) ? (
                  <>
                    <Separator />
                    <p className="helper-text text-destructive">
                      Revoked{rx.revokedAt ? ` ${formatWhen(rx.revokedAt)}` : ""}
                      {rx.revocationReason ? `: ${rx.revocationReason}` : ""}
                    </p>
                  </>
                ) : null}
              </CardContent>
            </Card>
          )
        })
      )}
    </div>
  )
}
