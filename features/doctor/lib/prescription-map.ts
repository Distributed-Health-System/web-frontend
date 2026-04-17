import type { DoctorPrescription, MedicationLine, PrescriptionMedication } from "../types"

export function medicationLinesFromForm(medications: PrescriptionMedication[]): MedicationLine[] {
  return medications.map(({ name, dosage, frequency, duration, instructions }) => {
    const line: MedicationLine = {
      name: name.trim(),
      dosage: dosage.trim(),
      frequency: frequency.trim(),
      duration: duration.trim(),
    }
    const ins = instructions?.trim()
    if (ins) line.instructions = ins
    return line
  })
}

export function buildCreatePrescriptionBody(input: {
  patientId: string
  appointmentId?: string
  medications: PrescriptionMedication[]
  diagnosis?: string
  notes?: string
  issuedAt?: string
  validUntil?: string
}): Record<string, unknown> {
  const body: Record<string, unknown> = {
    patientId: input.patientId.trim(),
    items: medicationLinesFromForm(input.medications),
  }
  const apt = input.appointmentId?.trim()
  if (apt) body.appointmentId = apt
  const dx = input.diagnosis?.trim()
  if (dx) body.diagnosis = dx
  const notes = input.notes?.trim()
  if (notes) body.notes = notes
  if (input.issuedAt?.trim()) body.issuedAt = input.issuedAt.trim()
  if (input.validUntil?.trim()) body.validUntil = input.validUntil.trim()
  return body
}

export function activePrescriptionCount(rows: DoctorPrescription[]): number {
  return rows.filter((p) => p.status === "ACTIVE").length
}
