"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { WEEKDAYS, mockAvailability } from "../../lib/mock-data"
import type { Weekday, WeeklyAvailability } from "../../types"

const SESSION_LABELS: Record<string, string> = {
  "08:00": "Morning",
  "12:00": "Afternoon",
  "17:00": "Evening",
}

function getSessionLabel(time: string): string {
  const hour = parseInt(time.split(":")[0])
  if (hour < 12) return "Morning"
  if (hour < 17) return "Afternoon"
  return "Evening"
}

interface TimeSlotButtonProps {
  time: string
  available: boolean
  onToggle: () => void
}

function TimeSlotButton({ time, available, onToggle }: TimeSlotButtonProps) {
  const hour = parseInt(time.split(":")[0])
  const suffix = hour < 12 ? "AM" : "PM"
  const display = `${hour > 12 ? hour - 12 : hour}:00 ${suffix}`

  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "rounded-lg border px-3 py-2 label-sm transition-colors",
        available
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-background text-foreground border-border hover:bg-accent/50"
      )}
    >
      {display}
    </button>
  )
}

export function AvailabilityScheduler() {
  const [availability, setAvailability] = useState<WeeklyAvailability>(mockAvailability)

  const toggleSlot = (day: Weekday, index: number) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: prev[day].map((slot, i) =>
        i === index ? { ...slot, available: !slot.available } : slot
      ),
    }))
  }

  const handleSave = () => {
    toast.success("Availability saved successfully.")
  }

  const groupBySession = (slots: { time: string; available: boolean }[]) => {
    return {
      Morning: slots.filter((s) => getSessionLabel(s.time) === "Morning"),
      Afternoon: slots.filter((s) => getSessionLabel(s.time) === "Afternoon"),
      Evening: slots.filter((s) => getSessionLabel(s.time) === "Evening"),
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="h4">Set Availability</CardTitle>
        <Button onClick={handleSave}>Save availability</Button>
      </CardHeader>
      <CardContent>
        <p className="helper-text mb-4">
          Select the time slots you are available for consultations. Highlighted slots are available.
        </p>
        <Tabs defaultValue="Monday">
          <TabsList className="flex flex-wrap h-auto gap-1 mb-6">
            {WEEKDAYS.map((day) => {
              const count = availability[day].filter((s) => s.available).length
              return (
                <TabsTrigger key={day} value={day} className="gap-1.5">
                  {day.slice(0, 3)}
                  {count > 0 && (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground" style={{ fontSize: "10px" }}>
                      {count}
                    </span>
                  )}
                </TabsTrigger>
              )
            })}
          </TabsList>

          {WEEKDAYS.map((day) => {
            const sessions = groupBySession(availability[day])
            return (
              <TabsContent key={day} value={day} className="flex flex-col gap-6">
                {(Object.entries(sessions) as [string, { time: string; available: boolean }[]][]).map(([session, slots]) => (
                  <div key={session} className="flex flex-col gap-3">
                    <span className="label text-muted-foreground">{session}</span>
                    <div className="flex flex-wrap gap-2">
                      {slots.map((slot) => {
                        const globalIdx = availability[day].findIndex((s) => s.time === slot.time)
                        return (
                          <TimeSlotButton
                            key={slot.time}
                            time={slot.time}
                            available={slot.available}
                            onToggle={() => toggleSlot(day, globalIdx)}
                          />
                        )
                      })}
                    </div>
                  </div>
                ))}
                <div className="mt-2 flex items-center gap-4 pt-3 border-t border-border">
                  <span className="helper-text">
                    {availability[day].filter((s) => s.available).length} slots selected
                  </span>
                  <button
                    type="button"
                    className="helper-text text-primary hover:underline"
                    onClick={() =>
                      setAvailability((prev) => ({
                        ...prev,
                        [day]: prev[day].map((s) => ({ ...s, available: false })),
                      }))
                    }
                  >
                    Clear all
                  </button>
                </div>
              </TabsContent>
            )
          })}
        </Tabs>
      </CardContent>
    </Card>
  )
}
