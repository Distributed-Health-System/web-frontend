import { format, parseISO } from "date-fns"
import { jsPDF } from "jspdf"

import type { PatientInvoice } from "../types"

function formatUsd(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100)
}

export function buildReceiptText(inv: PatientInvoice): string {
  const service = format(parseISO(inv.serviceDate), "MMMM d, yyyy")
  const issued = format(parseISO(inv.issuedAt), "MMMM d, yyyy h:mm a")
  const lines: string[] = [
    "DISTRIBUTED HEALTH - PAYMENT RECEIPT",
    "",
    `Invoice ID: ${inv.id}`,
    `Service date: ${service}`,
    `Description: ${inv.description}`,
    `Provider: ${inv.providerName}`,
    `Amount: ${formatUsd(inv.amountCents)}`,
    `Status: ${inv.status.toUpperCase()}`,
    `Issued: ${issued}`,
  ]
  if (inv.status === "paid" && inv.paidAt) {
    lines.push(`Paid: ${format(parseISO(inv.paidAt), "MMMM d, yyyy h:mm a")}`)
    if (inv.last4) lines.push(`Payment method: Card ending ${inv.last4}`)
  }
  if (inv.status === "refunded") {
    lines.push("This charge was refunded to your original payment method.")
  }
  lines.push(
    "",
    "---",
    "Thank you for choosing Distributed Health.",
    "Questions about billing? Contact support through your patient portal."
  )
  return lines.join("\n")
}

const MM_LINE = 5.5

export function downloadInvoiceReceiptPdf(inv: PatientInvoice): void {
  const doc = new jsPDF({ unit: "mm", format: "a4" })
  const margin = 16
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const maxW = pageW - 2 * margin
  let y = margin

  const body = buildReceiptText(inv)
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

  const safeId = inv.id.replace(/[^a-zA-Z0-9-_]/g, "_")
  doc.save(`receipt_${safeId}.pdf`)
}
