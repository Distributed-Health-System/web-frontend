"use client"

import { useMemo, useState } from "react"
import { format, parseISO } from "date-fns"
import { CreditCard, Download, Receipt } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { mockPatientInvoices } from "../../lib/mock-data"
import { downloadInvoiceReceiptPdf } from "../../lib/payment-receipt-pdf"
import type { PatientInvoice, PatientInvoiceStatus } from "../../types"
import { cn } from "@/lib/utils"

function formatUsd(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100)
}

type FilterKey = "all" | "due" | "paid" | "other"

function invoiceFilter(inv: PatientInvoice, key: FilterKey): boolean {
  if (key === "all") return true
  if (key === "due") return inv.status === "due"
  if (key === "paid") return inv.status === "paid"
  return inv.status === "processing" || inv.status === "refunded"
}

function statusLabel(s: PatientInvoiceStatus): string {
  switch (s) {
    case "due":
      return "Payment due"
    case "paid":
      return "Paid"
    case "processing":
      return "Processing"
    case "refunded":
      return "Refunded"
    default:
      return s
  }
}

function statusBadgeClass(s: PatientInvoiceStatus): string {
  switch (s) {
    case "due":
      return "border-amber-500/40 bg-amber-500/10 text-amber-800 dark:text-amber-200"
    case "paid":
      return "border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200"
    case "processing":
      return "border-primary/40 bg-primary/10 text-primary"
    case "refunded":
      return "border-border bg-muted text-muted-foreground"
    default:
      return ""
  }
}

export function PatientPaymentsView() {
  const [filter, setFilter] = useState<FilterKey>("all")

  const sorted = useMemo(
    () =>
      [...mockPatientInvoices].sort(
        (a, b) => parseISO(b.issuedAt).getTime() - parseISO(a.issuedAt).getTime()
      ),
    []
  )

  const filtered = useMemo(() => sorted.filter((inv) => invoiceFilter(inv, filter)), [sorted, filter])

  const outstandingCents = useMemo(
    () => mockPatientInvoices.filter((i) => i.status === "due").reduce((s, i) => s + i.amountCents, 0),
    []
  )

  const paidCount = useMemo(() => mockPatientInvoices.filter((i) => i.status === "paid").length, [])

  const filters: { key: FilterKey; label: string }[] = [
    { key: "all", label: "All" },
    { key: "due", label: "Outstanding" },
    { key: "paid", label: "Paid" },
    { key: "other", label: "Other" },
  ]

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="shadow-sm">
          <CardContent className="flex flex-col gap-1 p-5">
            <p className="text-sm font-medium text-muted-foreground">Outstanding balance</p>
            <p className="h2 text-foreground">{formatUsd(outstandingCents)}</p>
            <p className="text-xs text-muted-foreground">Invoices awaiting payment</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="flex flex-col gap-1 p-5">
            <p className="text-sm font-medium text-muted-foreground">Paid visits</p>
            <p className="h2 text-foreground">{paidCount}</p>
            <p className="text-xs text-muted-foreground">Successfully charged</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="flex flex-col gap-1 p-5">
            <p className="text-sm font-medium text-muted-foreground">Payment methods</p>
            <p className="flex items-center gap-2 text-sm text-foreground">
              <CreditCard className="size-4 text-muted-foreground" aria-hidden />
              Manage cards after checkout is live
            </p>
            <p className="text-xs text-muted-foreground">Saved cards will appear here</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter invoices">
        {filters.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={filter === key}
            onClick={() => setFilter(key)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              filter === key
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground hover:bg-muted/50"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            No invoices in this view.
          </CardContent>
        </Card>
      ) : (
        <ul className="flex flex-col gap-4">
          {filtered.map((inv) => {
            const serviceLabel = format(parseISO(inv.serviceDate), "MMM d, yyyy")
            const issuedLabel = format(parseISO(inv.issuedAt), "MMM d, yyyy")

            return (
              <li key={inv.id}>
                <Card className="shadow-sm transition-shadow hover:shadow-md">
                  <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 flex-1 gap-4">
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Receipt className="size-5" aria-hidden />
                      </div>
                      <div className="min-w-0 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium text-foreground">{formatUsd(inv.amountCents)}</p>
                          <Badge
                            variant="outline"
                            className={cn("text-xs capitalize", statusBadgeClass(inv.status))}
                          >
                            {statusLabel(inv.status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-foreground">{inv.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {inv.providerName} · Service {serviceLabel} · Invoice {issuedLabel}
                        </p>
                        {inv.status === "paid" && inv.last4 ? (
                          <p className="text-xs text-muted-foreground">Card ···· {inv.last4}</p>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-col gap-2 sm:items-end">
                      {inv.status === "due" ? (
                        <Button
                          type="button"
                          className="w-full rounded-xl sm:w-auto"
                          onClick={() =>
                            toast.info("Online payments will be available once your billing provider is connected.")
                          }
                        >
                          Pay now
                        </Button>
                      ) : null}
                      {inv.status === "processing" ? (
                        <p className="max-w-[220px] text-right text-xs text-muted-foreground">
                          Payment is processing. This usually clears within a few minutes.
                        </p>
                      ) : null}
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full rounded-xl sm:w-auto"
                        onClick={() => downloadInvoiceReceiptPdf(inv)}
                      >
                        <Download className="mr-2 size-4" aria-hidden />
                        Download receipt (PDF)
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </li>
            )
          })}
        </ul>
      )}

      <p className="text-center text-xs text-muted-foreground">
        Charges shown are demo data. Live billing, insurance claims, and saved payment methods will
        connect to your payment processor.
      </p>
    </div>
  )
}
