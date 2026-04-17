import { format, parseISO } from "date-fns"
import { jsPDF } from "jspdf"

import type { PatientPrescription } from "../types"

export function buildPrescriptionDocument(rx: PatientPrescription): string {
  const issued = format(parseISO(rx.issuedAt), "MMMM d, yyyy")
  const lines: string[] = [
    "DISTRIBUTED HEALTH - PRESCRIPTION RECORD",
    "",
    `Prescription ID: ${rx.id}`,
    `Date issued: ${issued}`,
    `Prescriber: ${rx.prescriberName}`,
  ]
  if (rx.specialty) lines.push(`Specialty: ${rx.specialty}`)
  lines.push(`Status: ${rx.status === "active" ? "Active" : "Past"}`)
  lines.push("", "Medications:", "")
  rx.medications.forEach((m, i) => {
    lines.push(`${i + 1}. ${m.name}`)
    lines.push(`   Dosage: ${m.dosage}`)
    lines.push(`   Frequency: ${m.frequency}`)
    lines.push(`   Duration: ${m.duration}`)
    if (m.instructions) lines.push(`   Instructions: ${m.instructions}`)
    lines.push("")
  })
  if (rx.notes) {
    lines.push("Prescriber notes:", rx.notes, "")
  }
  lines.push(
    "---",
    "For your records only. Take medications exactly as prescribed.",
    "Questions? Contact your pharmacy or care team."
  )
  return lines.join("\n")
}

const MM_LINE = 5.5

export function downloadPrescriptionPdf(rx: PatientPrescription): void {
  const doc = new jsPDF({ unit: "mm", format: "a4" })
  const margin = 16
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const maxW = pageW - 2 * margin
  let y = margin

  const body = buildPrescriptionDocument(rx)
  let isFirstNonEmpty = true

  for (const raw of body.split("\n")) {
    if (raw.trim() === "") {
      y += 2.5
      if (y > pageH - margin) {
        doc.addPage()
        y = margin
      }
      continue
    }

    const isTitle = isFirstNonEmpty
    isFirstNonEmpty = false

    doc.setFontSize(isTitle ? 14 : 11)
    doc.setFont("helvetica", isTitle ? "bold" : "normal")
    const wrapped = doc.splitTextToSize(raw, maxW)

    for (const wline of wrapped) {
      if (y + MM_LINE > pageH - margin) {
        doc.addPage()
        y = margin
      }
      doc.setFontSize(isTitle ? 14 : 11)
      doc.setFont("helvetica", isTitle ? "bold" : "normal")
      doc.text(wline, margin, y)
      y += MM_LINE
    }
  }

  const safeId = rx.id.replace(/[^a-zA-Z0-9-_]/g, "_")
  doc.save(`prescription_${safeId}.pdf`)
}
