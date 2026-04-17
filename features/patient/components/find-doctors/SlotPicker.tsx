"use client"

import { useEffect, useMemo, useState } from "react"
import { Loader2 } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

interface SlotPickerProps {
  freeSlots: string[]
  isLoading: boolean
}

function toLocalDate(iso: string): string {
  // Returns "YYYY-MM-DD" in the user's local timezone
  return new Date(iso).toLocaleDateString("en-CA")
}

function toLocalTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
}

export function SlotPicker({ freeSlots, isLoading }: SlotPickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

  // Set of "YYYY-MM-DD" strings that have at least one slot
  const availableDateStrings = useMemo(
    () => new Set(freeSlots.map(toLocalDate)),
    [freeSlots],
  )

  // Date objects for react-day-picker modifiers (noon to avoid DST edge cases)
  const availableDates = useMemo(
    () =>
      Array.from(availableDateStrings).map((d) => {
        const [y, mo, day] = d.split("-").map(Number)
        return new Date(y, mo - 1, day, 12)
      }),
    [availableDateStrings],
  )

  // Auto-select the first available day when slots load
  useEffect(() => {
    if (availableDates.length > 0) {
      setSelectedDate(availableDates[0])
    }
  }, [availableDates.length]) // eslint-disable-line react-hooks/exhaustive-deps

  const selectedDateStr = selectedDate
    ? selectedDate.toLocaleDateString("en-CA")
    : ""

  const daySlots = useMemo(
    () => freeSlots.filter((s) => toLocalDate(s) === selectedDateStr),
    [freeSlots, selectedDateStr],
  )

  const isDateAvailable = (date: Date) => {
    const str = date.toLocaleDateString("en-CA")
    return availableDateStrings.has(str)
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-4 text-muted-foreground body-sm">
        <Loader2 className="size-4 animate-spin" />
        Loading available slots…
      </div>
    )
  }

  if (freeSlots.length === 0) {
    return (
      <p className="body-sm text-muted-foreground">
        No available slots in the next 7 days.
      </p>
    )
  }

  return (
    <div className="flex gap-4">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(date) => date && isDateAvailable(date) && setSelectedDate(date)}
        disabled={(date) => !isDateAvailable(date)}
        fromDate={new Date()}
        className="shrink-0 rounded-xl border border-border p-0"
        components={{
          DayButton: ({ day, modifiers, className, ...props }) => {
            const dateStr = day.date.toLocaleDateString("en-CA")
            const hasSlots = availableDateStrings.has(dateStr)
            return (
              <button
                {...props}
                className={cn(
                  "relative isolate z-10 flex aspect-square size-auto w-full min-w-[var(--cell-size)] flex-col items-center justify-center gap-0.5 rounded-[var(--cell-radius)] border-0 p-0 font-normal leading-none",
                  "hover:bg-accent hover:text-accent-foreground",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                  modifiers.selected && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                  modifiers.today && !modifiers.selected && "bg-muted font-semibold",
                  modifiers.disabled && "pointer-events-none opacity-30",
                  className,
                )}
              >
                <span>{day.date.getDate()}</span>
                {hasSlots && !modifiers.disabled && (
                  <span
                    className={cn(
                      "h-1 w-1 rounded-full",
                      modifiers.selected ? "bg-primary-foreground" : "bg-primary",
                    )}
                  />
                )}
              </button>
            )
          },
        }}
      />

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        {selectedDate ? (
          <>
            <p className="label-sm text-muted-foreground">
              {selectedDate.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}
              <span className="ml-1 text-foreground">· {daySlots.length} slots</span>
            </p>
            {daySlots.length === 0 ? (
              <p className="body-sm text-muted-foreground">No slots on this day.</p>
            ) : (
              <ul className="flex flex-wrap content-start gap-2 overflow-y-auto">
                {daySlots.map((slot) => (
                  <li key={slot}>
                    <span className="inline-flex rounded-lg border border-border bg-muted/50 px-2.5 py-1 font-mono text-xs text-foreground">
                      {toLocalTime(slot)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <p className="body-sm text-muted-foreground">Select a day to see available times.</p>
        )}
      </div>
    </div>
  )
}
