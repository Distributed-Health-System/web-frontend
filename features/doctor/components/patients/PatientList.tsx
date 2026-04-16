"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { SearchIcon, FileTextIcon, ChevronRightIcon } from "lucide-react"
import type { DoctorPatient } from "../../types"

interface PatientListProps {
  patients: DoctorPatient[]
}

export function PatientList({ patients }: PatientListProps) {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const filtered = patients.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.email.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search patients by name or email..."
          className="pl-9"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2">
        {filtered.length === 0 ? (
          <p className="helper-text py-8 text-center">No patients found.</p>
        ) : (
          filtered.map((patient) => (
            <button
              key={patient.id}
              onClick={() => router.push(`/doctor/patients/${patient.id}`)}
              className="flex items-center justify-between rounded-xl border border-border bg-card p-4 text-left hover:bg-accent/40 transition-colors"
            >
              <div className="flex items-center gap-4">
                <Avatar className="size-10">
                  <AvatarFallback className="bg-secondary text-secondary-foreground body-base font-medium">
                    {patient.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-0.5">
                  <span className="label">{patient.name}</span>
                  <span className="helper-text">
                    {patient.age} yrs · {patient.gender} · Last visit {patient.lastVisit}
                  </span>
                  {patient.conditions.length > 0 && (
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {patient.conditions.map((c) => (
                        <Badge key={c} variant="secondary" className="label-sm">
                          {c}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="helper-text flex items-center gap-1">
                  <FileTextIcon className="size-3" />
                  {patient.records.length} records
                </span>
                <ChevronRightIcon className="size-4 text-muted-foreground" />
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )
}
