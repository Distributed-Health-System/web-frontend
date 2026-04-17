"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { format, parseISO } from "date-fns"
import {
  FileText,
  FileUp,
  ImageIcon,
  Loader2,
  Trash2,
  Download,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { PatientLabReport } from "../../types"
import {
  loadLabReports,
  MAX_PREVIEW_BYTES,
  readFileAsDataUrl,
  saveLabReports,
} from "../../lib/lab-reports-storage"
import {
  createReportUploadIntent,
  deleteReport,
  finalizeReportUpload,
  getMyPatientId,
  getMyReports,
  getReportDownloadUrl,
  type PatientReport,
} from "../../lib/patient-reports.api"

const ACCEPT = "image/jpeg,image/png,application/pdf"
const MAX_FILE_BYTES = 10 * 1024 * 1024
const USE_LOCAL_REPORTS_DEV_MODE = true

function inferCategory(mime: string): PatientLabReport["category"] {
  if (mime.startsWith("image/")) return "scan"
  if (mime === "application/pdf") return "lab"
  return "other"
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / (1024 * 1024)).toFixed(1)} MB`
}

export function PatientLabReportsView() {
  const [reports, setReports] = useState<PatientLabReport[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [title, setTitle] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDownloading, setIsDownloading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [patientId, setPatientId] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const mapReport = useCallback((report: PatientReport): PatientLabReport => {
    const rawFileName = report.fileUrl.split("/").pop() ?? `${report.id}.pdf`
    const fileName = decodeURIComponent(rawFileName)
    return {
      id: report.id,
      title: report.title,
      uploadedAt: report.uploadedAt,
      category: report.category ?? "other",
      status: "pending",
      fileName,
      mimeType: report.mimeType,
      fileSizeBytes: 0,
    }
  }, [])

  const refreshReports = useCallback(async (id: string) => {
    if (USE_LOCAL_REPORTS_DEV_MODE) {
      setReports(loadLabReports())
      setError(null)
      return
    }
    try {
      const data = await getMyReports(id)
      setReports(data.map(mapReport))
      setError(null)
    } catch {
      setError("Could not load your reports. Please refresh and try again.")
    }
  }, [mapReport])

  useEffect(() => {
    const init = async () => {
      if (USE_LOCAL_REPORTS_DEV_MODE) {
        setReports(loadLabReports())
        setError(null)
        setIsLoading(false)
        return
      }
      try {
        const id = await getMyPatientId()
        setPatientId(id)
        await refreshReports(id)
      } catch {
        setError("Could not load patient profile. Please log in again.")
      } finally {
        setIsLoading(false)
      }
    }

    void init()
  }, [refreshReports])

  const processFile = async (file: File) => {
    setError(null)
    const allowed =
      file.type === "image/jpeg" || file.type === "image/png" || file.type === "application/pdf"
    if (!allowed) {
      setError("Please upload a PDF or an image (PNG, JPG, etc.).")
      return
    }
    if (file.size > MAX_FILE_BYTES) {
      setError(`File is too large. Maximum size is ${formatBytes(MAX_FILE_BYTES)}.`)
      return
    }

    setIsUploading(true)
    try {
      const safeTitle = title.trim() || file.name.replace(/\.[^.]+$/, "") || "Untitled report"
      const uploadedAt = new Date().toISOString()
      const category = inferCategory(file.type)
      if (USE_LOCAL_REPORTS_DEV_MODE) {
        let previewDataUrl: string | undefined
        const canEmbed =
          (file.type.startsWith("image/") || file.type === "application/pdf") &&
          file.size <= MAX_PREVIEW_BYTES
        if (canEmbed) {
          previewDataUrl = await readFileAsDataUrl(file)
        }
        const localReport: PatientLabReport = {
          id: crypto.randomUUID(),
          title: safeTitle,
          uploadedAt,
          category,
          status: "pending",
          fileName: file.name,
          mimeType: file.type,
          fileSizeBytes: file.size,
          previewDataUrl,
        }
        const next = [localReport, ...loadLabReports()]
        saveLabReports(next)
        setReports(next)
        setTitle("")
        setError(null)
        return
      }
      if (!patientId) {
        setError("Please sign in again.")
        return
      }

      const intent = await createReportUploadIntent(patientId, {
        title: safeTitle,
        filename: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
        category,
      })

      const uploadResponse = await fetch(intent.uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": intent.requiredHeaders["Content-Type"],
        },
        body: file,
      })
      if (!uploadResponse.ok) {
        throw new Error("UPLOAD_FAILED")
      }

      await finalizeReportUpload(patientId, {
        reportId: intent.reportId,
        title: safeTitle,
        blobKey: intent.blobKey,
        mimeType: file.type,
        uploadedAt,
        category,
      })

      await refreshReports(patientId)
      setTitle("")
    } catch {
      setError("Upload failed. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (file) void processFile(file)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) void processFile(file)
  }

  const removeReport = async (id: string) => {
    if (!window.confirm("Delete this report? This cannot be undone.")) return
    if (USE_LOCAL_REPORTS_DEV_MODE) {
      const next = loadLabReports().filter((r) => r.id !== id)
      saveLabReports(next)
      setReports(next)
      return
    }
    if (!patientId) return
    setIsDeleting(true)
    try {
      await deleteReport(patientId, id)
      await refreshReports(patientId)
    } catch {
      setError("Could not delete the report. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  const downloadReport = async (reportId: string) => {
    if (USE_LOCAL_REPORTS_DEV_MODE) {
      const report = reports.find((r) => r.id === reportId)
      if (!report) return
      if (report.previewDataUrl) {
        const anchor = document.createElement("a")
        anchor.href = report.previewDataUrl
        anchor.download = report.fileName
        anchor.click()
      } else {
        setError("This file preview is not available in local mode.")
      }
      return
    }
    if (!patientId) return
    setIsDownloading(reportId)
    try {
      const { downloadUrl } = await getReportDownloadUrl(patientId, reportId)
      window.open(downloadUrl, "_blank", "noopener,noreferrer")
    } catch {
      setError("Could not generate download link. Please try again.")
    } finally {
      setIsDownloading(null)
    }
  }

  const sorted = [...reports].sort(
    (a, b) => parseISO(b.uploadedAt).getTime() - parseISO(a.uploadedAt).getTime()
  )

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="size-8 animate-spin text-muted-foreground" aria-hidden />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-10">
      <section className="space-y-4">
        <h2 className="h4 text-foreground">Upload a report</h2>
        <p className="body-sm text-muted-foreground">
          PDF or image files up to {formatBytes(MAX_FILE_BYTES)}. Files up to{" "}
          {formatBytes(MAX_FILE_BYTES)} are uploaded securely and saved to your report history.
        </p>

        <div className="space-y-3">
          <label className="block space-y-1.5">
            <span className="label text-foreground">Title (optional)</span>
            <Input
              placeholder="e.g. Annual blood work"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isUploading}
              className="max-w-md"
            />
          </label>

          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT}
            className="sr-only"
            onChange={onInputChange}
            disabled={isUploading}
          />

          <div
            aria-label="Upload area: drop a PDF or image, or use Choose file"
            onDragEnter={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            onClick={() => {
              inputRef.current?.click()
            }}
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-12 transition-colors",
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border bg-muted/20 hover:bg-muted/40",
              isUploading && "pointer-events-none opacity-60"
            )}
          >
            {isUploading ? (
              <Loader2 className="size-10 animate-spin text-primary" aria-hidden />
            ) : (
              <FileUp className="size-10 text-muted-foreground" aria-hidden />
            )}
            <div className="text-center">
              <p className="font-medium text-foreground">
                {isUploading ? "Uploading…" : "Drop a file here or click to browse"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                PDF, PNG, JPG - max {formatBytes(MAX_FILE_BYTES)}
              </p>
            </div>
            <Button
              type="button"
              variant="secondary"
              className="rounded-xl"
              disabled={isUploading}
              onClick={(e) => {
                e.stopPropagation()
                inputRef.current?.click()
              }}
            >
              Choose file
            </Button>
          </div>
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="h4 text-foreground">My reports</h2>
            <p className="body-sm text-muted-foreground">
              {sorted.length} report{sorted.length === 1 ? "" : "s"} saved on this device
            </p>
          </div>
        </div>

        {sorted.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center text-sm text-muted-foreground">
              No reports yet. Upload a PDF or image above.
            </CardContent>
          </Card>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {sorted.map((r) => {
              const isPdf = r.mimeType === "application/pdf"
              const dateLabel = format(parseISO(r.uploadedAt), "MMM d, yyyy · h:mm a")

              return (
                <li key={r.id}>
                  <Card className="h-full overflow-hidden shadow-sm">
                    <div className="relative aspect-[4/3] bg-muted">
                      {(
                        <div className="flex size-full flex-col items-center justify-center gap-2 text-muted-foreground">
                          {isPdf ? (
                            <FileText className="size-14 opacity-60" aria-hidden />
                          ) : (
                            <ImageIcon className="size-14 opacity-60" aria-hidden />
                          )}
                          <span className="px-2 text-center text-xs">{r.fileName}</span>
                        </div>
                      )}
                    </div>
                    <CardContent className="space-y-3 p-4">
                      <div className="space-y-1">
                        <p className="line-clamp-2 font-medium leading-snug text-foreground">{r.title}</p>
                        <p className="text-xs text-muted-foreground">{dateLabel}</p>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        <Badge variant="secondary" className="capitalize">
                          {r.category}
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          {r.status}
                        </Badge>
                        <Badge variant="outline" className="font-normal">
                          {r.fileSizeBytes > 0 ? formatBytes(r.fileSizeBytes) : "Uploaded"}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-2 pt-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-lg"
                          onClick={() => void downloadReport(r.id)}
                          disabled={isDownloading === r.id}
                        >
                          <Download className="mr-1.5 size-3.5" aria-hidden />
                          {isDownloading === r.id ? "Preparing..." : "Download"}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => void removeReport(r.id)}
                          disabled={isDeleting}
                        >
                          <Trash2 className="mr-1.5 size-3.5" aria-hidden />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}
