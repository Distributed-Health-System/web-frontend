"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileTextIcon, FlaskConicalIcon, ScanIcon, FolderIcon } from "lucide-react"
import type { PatientRecord } from "../../types"

const fileTypeConfig: Record<PatientRecord["fileType"], { icon: React.ReactNode; label: string; color: string }> = {
  lab: { icon: <FlaskConicalIcon className="size-4" />, label: "Lab Report", color: "bg-primary/10 text-primary" },
  scan: { icon: <ScanIcon className="size-4" />, label: "Scan", color: "bg-accent text-accent-foreground" },
  report: { icon: <FileTextIcon className="size-4" />, label: "Report", color: "bg-muted text-foreground" },
  other: { icon: <FolderIcon className="size-4" />, label: "Other", color: "bg-secondary text-secondary-foreground" },
}

interface PatientRecordsViewProps {
  records: PatientRecord[]
}

export function PatientRecordsView({ records }: PatientRecordsViewProps) {
  if (records.length === 0) {
    return (
      <p className="helper-text py-6 text-center">No records uploaded by this patient.</p>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {records.map((record) => {
        const config = fileTypeConfig[record.fileType]
        return (
          <div
            key={record.id}
            className="flex items-start justify-between rounded-lg border border-border p-3 bg-card"
          >
            <div className="flex items-start gap-3">
              <div className={`flex size-8 items-center justify-center rounded-lg ${config.color}`}>
                {config.icon}
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="label">{record.fileName}</span>
                {record.notes && (
                  <span className="helper-text">{record.notes}</span>
                )}
                <span className="helper-text">Uploaded {record.uploadedAt}</span>
              </div>
            </div>
            <Badge variant="outline" className="label-sm shrink-0">
              {config.label}
            </Badge>
          </div>
        )
      })}
    </div>
  )
}
