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

const ACCEPT = "image/*,application/pdf"
const MAX_FILE_BYTES = 12 * 1024 * 1024

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
  const [hydrated, setHydrated] = useState(false)
  const [title, setTitle] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const refresh = useCallback(() => {
    setReports(loadLabReports())
  }, [])

  useEffect(() => {
    refresh()
    setHydrated(true)
  }, [refresh])

  const persist = useCallback((next: PatientLabReport[]) => {
    try {
      saveLabReports(next)
      setReports(next)
      setError(null)
    } catch (e) {
      if (e instanceof Error && e.message === "STORAGE_FULL") {
        setError("Browser storage is full. Remove a report or use a smaller file.")
      } else {
        setError("Could not save. Try a smaller file.")
      }
    }
  }, [])

  const processFile = async (file: File) => {
    setError(null)
    const allowed =
      file.type.startsWith("image/") || file.type === "application/pdf"
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
      let previewDataUrl: string | undefined
      const canEmbed =
        (file.type.startsWith("image/") || file.type === "application/pdf") &&
        file.size <= MAX_PREVIEW_BYTES
      if (canEmbed) {
        previewDataUrl = await readFileAsDataUrl(file)
      }

      const report: PatientLabReport = {
        id: crypto.randomUUID(),
        title: title.trim() || file.name.replace(/\.[^.]+$/, "") || "Untitled report",
        uploadedAt: new Date().toISOString(),
        category: inferCategory(file.type),
        status: "pending",
        fileName: file.name,
        mimeType: file.type || "application/octet-stream",
        fileSizeBytes: file.size,
        previewDataUrl,
      }

      const next = [report, ...loadLabReports()]
      persist(next)
      setTitle("")
    } catch {
      setError("Could not read this file. Try another one.")
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

  const removeReport = (id: string) => {
    if (!window.confirm("Delete this report? This cannot be undone.")) return
    const next = loadLabReports().filter((r) => r.id !== id)
    persist(next)
  }

  const sorted = [...reports].sort(
    (a, b) => parseISO(b.uploadedAt).getTime() - parseISO(a.uploadedAt).getTime()
  )

  if (!hydrated) {
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
          {formatBytes(MAX_PREVIEW_BYTES)} can include an in-browser preview and download; larger
          uploads are stored as metadata only until cloud storage is wired.
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
            onClick={() => inputRef.current?.click()}
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
              <p className="mt-1 text-sm text-muted-foreground">PDF, PNG, JPG, WebP — max {formatBytes(MAX_FILE_BYTES)}</p>
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
              const isImage = r.mimeType.startsWith("image/")
              const dateLabel = format(parseISO(r.uploadedAt), "MMM d, yyyy · h:mm a")

              return (
                <li key={r.id}>
                  <Card className="h-full overflow-hidden shadow-sm">
                    <div className="relative aspect-[4/3] bg-muted">
                      {r.previewDataUrl && isImage ? (
                        <img
                          src={r.previewDataUrl}
                          alt=""
                          className="size-full object-cover"
                        />
                      ) : r.previewDataUrl && isPdf ? (
                        <object
                          data={r.previewDataUrl}
                          type="application/pdf"
                          className="size-full"
                          aria-label={r.title}
                        />
                      ) : (
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
                          {formatBytes(r.fileSizeBytes)}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {r.previewDataUrl ? (
                          <Button variant="outline" size="sm" className="rounded-lg" asChild>
                            <a href={r.previewDataUrl} download={r.fileName}>
                              <Download className="mr-1.5 size-3.5" aria-hidden />
                              Download
                            </a>
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            Full file is not stored in the browser for this item. Cloud storage will
                            keep originals when the API is connected.
                          </span>
                        )}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => removeReport(r.id)}
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
