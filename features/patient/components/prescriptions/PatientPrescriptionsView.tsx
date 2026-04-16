"use client"

import { useMemo } from "react"
import { format, parseISO } from "date-fns"
import { Download, Pill } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { mockPatientPrescriptions } from "../../lib/mock-data"
import { downloadPrescriptionPdf } from "../../lib/prescription-download"
import type { PatientPrescription } from "../../types"
import { cn } from "@/lib/utils"

function statusStyles(status: PatientPrescription["status"]) {
  return status === "active"
    ? "border-primary/30 bg-primary/10 text-primary"
    : "border-border bg-muted text-muted-foreground"
}

export function PatientPrescriptionsView() {
  const sorted = useMemo(
    () =>
      [...mockPatientPrescriptions].sort(
        (a, b) => parseISO(b.issuedAt).getTime() - parseISO(a.issuedAt).getTime()
      ),
    []
  )

  return (
    <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {sorted.map((rx) => {
        const dateLabel = format(parseISO(rx.issuedAt), "MMM d, yyyy")
        const medCount = rx.medications.length

        return (
          <li key={rx.id}>
            <Card className="flex h-full flex-col overflow-hidden shadow-sm transition-shadow hover:shadow-md">
              <CardHeader className="flex flex-row items-start gap-3 space-y-0 border-b border-border pb-4">
                <div
                  className={cn(
                    "flex size-11 shrink-0 items-center justify-center rounded-xl",
                    rx.status === "active" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                  )}
                >
                  <Pill className="size-5" aria-hidden />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="font-medium leading-snug text-foreground">{rx.prescriberName}</p>
                  {rx.specialty ? (
                    <p className="text-xs text-muted-foreground">{rx.specialty}</p>
                  ) : null}
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    <Badge variant="outline" className={cn("text-xs capitalize", statusStyles(rx.status))}>
                      {rx.status}
                    </Badge>
                    <Badge variant="secondary" className="font-normal">
                      {medCount} medication{medCount === 1 ? "" : "s"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-4 pt-4">
                <p className="text-xs text-muted-foreground">Issued {dateLabel}</p>

                <ul className="space-y-3 border-l-2 border-border pl-3">
                  {rx.medications.map((m) => (
                    <li key={`${rx.id}-${m.name}`} className="space-y-0.5">
                      <p className="text-sm font-medium text-foreground">{m.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {m.dosage} · {m.frequency} · {m.duration}
                      </p>
                      {m.instructions ? (
                        <p className="text-xs italic text-muted-foreground">{m.instructions}</p>
                      ) : null}
                    </li>
                  ))}
                </ul>

                {rx.notes ? (
                  <p className="rounded-lg bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">Note: </span>
                    {rx.notes}
                  </p>
                ) : null}

                <div className="mt-auto pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full rounded-xl"
                    onClick={() => downloadPrescriptionPdf(rx)}
                  >
                    <Download className="mr-2 size-4" aria-hidden />
                    Download PDF
                  </Button>
                  <p className="mt-2 text-center text-[11px] text-muted-foreground">
                    Opens a printable PDF generated in your browser.
                  </p>
                </div>
              </CardContent>
            </Card>
          </li>
        )
      })}
    </ul>
  )
}
