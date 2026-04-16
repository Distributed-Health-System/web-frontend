"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { PlusIcon, Trash2Icon } from "lucide-react"
import { toast } from "sonner"
import { buildCreatePrescriptionBody } from "../../lib/prescription-map"
import type { DoctorPatient, PrescriptionMedication } from "../../types"

interface PrescriptionFormProps {
  patients: DoctorPatient[]
  onSubmit?: (body: Record<string, unknown>) => void
}

const FREQUENCIES = [
  "Once daily",
  "Twice daily",
  "Three times daily",
  "Four times daily",
  "As needed",
  "Every 8 hours",
  "Every 12 hours",
]
const DURATIONS = ["3 days", "5 days", "7 days", "10 days", "14 days", "30 days", "60 days", "90 days", "Ongoing"]

function emptyMed(): PrescriptionMedication {
  return {
    id: crypto.randomUUID(),
    name: "",
    dosage: "",
    frequency: "Once daily",
    duration: "7 days",
    instructions: "",
  }
}

export function PrescriptionForm({ patients, onSubmit }: PrescriptionFormProps) {
  const [patientId, setPatientId] = useState("")
  const [appointmentId, setAppointmentId] = useState("")
  const [diagnosis, setDiagnosis] = useState("")
  const [medications, setMedications] = useState<PrescriptionMedication[]>([emptyMed()])
  const [notes, setNotes] = useState("")
  const [issuedAt, setIssuedAt] = useState("")
  const [validUntil, setValidUntil] = useState("")

  const updateMed = (id: string, field: keyof PrescriptionMedication, value: string) =>
    setMedications((prev) => prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)))

  const removeMed = (id: string) => setMedications((prev) => prev.filter((m) => m.id !== id))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!patientId) return toast.error("Please select a patient.")
    if (medications.some((m) => !m.name.trim() || !m.dosage.trim())) {
      return toast.error("Each medication needs a name and dosage.")
    }

    const body = buildCreatePrescriptionBody({
      patientId,
      appointmentId: appointmentId.trim() || undefined,
      medications,
      diagnosis: diagnosis.trim() || undefined,
      notes: notes.trim() || undefined,
      issuedAt: issuedAt.trim() || undefined,
      validUntil: validUntil.trim() || undefined,
    })

    onSubmit?.(body)
    toast.success("Prescription submitted.")

    setPatientId("")
    setAppointmentId("")
    setDiagnosis("")
    setMedications([emptyMed()])
    setNotes("")
    setIssuedAt("")
    setValidUntil("")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="h4">Write prescription</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="patient" className="label">
              Patient <span className="text-destructive">*</span>
            </Label>
            <Select value={patientId || undefined} onValueChange={setPatientId}>
              <SelectTrigger id="patient" className="w-full">
                <SelectValue placeholder="Select a patient" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {patients.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="appointmentId" className="label">
              Linked appointment <span className="helper-text font-normal">(optional)</span>
            </Label>
            <Input
              id="appointmentId"
              placeholder="Appointment reference"
              value={appointmentId}
              onChange={(e) => setAppointmentId(e.target.value)}
            />
          </div>

          <Separator />

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="label">
                Medications <span className="text-destructive">*</span>
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setMedications((prev) => [...prev, emptyMed()])}
              >
                <PlusIcon className="size-3" /> Add medication
              </Button>
            </div>

            {medications.map((med, idx) => (
              <div key={med.id} className="flex flex-col gap-3 rounded-lg border border-border p-4">
                <div className="flex items-center justify-between">
                  <span className="label-sm text-muted-foreground">Medication {idx + 1}</span>
                  {medications.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-7 text-destructive hover:text-destructive"
                      onClick={() => removeMed(med.id)}
                    >
                      <Trash2Icon className="size-3.5" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor={`name-${med.id}`} className="label-sm">
                      Name
                    </Label>
                    <Input
                      id={`name-${med.id}`}
                      placeholder="e.g. Amoxicillin"
                      value={med.name}
                      onChange={(e) => updateMed(med.id, "name", e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor={`dosage-${med.id}`} className="label-sm">
                      Dosage
                    </Label>
                    <Input
                      id={`dosage-${med.id}`}
                      placeholder="e.g. 500mg"
                      value={med.dosage}
                      onChange={(e) => updateMed(med.id, "dosage", e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="label-sm">Frequency</Label>
                    <Select value={med.frequency} onValueChange={(v) => updateMed(med.id, "frequency", v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {FREQUENCIES.map((f) => (
                            <SelectItem key={f} value={f}>
                              {f}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="label-sm">Duration</Label>
                    <Select value={med.duration} onValueChange={(v) => updateMed(med.id, "duration", v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {DURATIONS.map((d) => (
                            <SelectItem key={d} value={d}>
                              {d}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor={`instructions-${med.id}`} className="label-sm">
                    Instructions <span className="helper-text">(optional)</span>
                  </Label>
                  <Input
                    id={`instructions-${med.id}`}
                    placeholder="e.g. Take with food"
                    value={med.instructions ?? ""}
                    onChange={(e) => updateMed(med.id, "instructions", e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="diagnosis" className="label">
              Diagnosis <span className="helper-text">(optional)</span>
            </Label>
            <Input
              id="diagnosis"
              placeholder="Clinical diagnosis"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="issuedAt" className="label-sm">
                Issue date <span className="helper-text">(optional)</span>
              </Label>
              <Input id="issuedAt" type="date" value={issuedAt} onChange={(e) => setIssuedAt(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="validUntil" className="label-sm">
                Valid until <span className="helper-text">(optional)</span>
              </Label>
              <Input id="validUntil" type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} />
            </div>
          </div>

          <Separator />

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="notes" className="label">
              Notes <span className="helper-text">(optional)</span>
            </Label>
            <textarea
              id="notes"
              rows={3}
              placeholder="Follow-up instructions, lifestyle advice..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="body-base w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <Button type="submit" className="w-full">
            Issue prescription
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
