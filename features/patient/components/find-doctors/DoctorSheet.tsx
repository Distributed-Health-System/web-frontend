"use client"

import { Stethoscope, Clock } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import type { Doctor } from "@/features/doctor/lib/doctor.api"
import type { FreeSlot } from "@/features/doctor/lib/availability.api"
import { doctorFullName } from "./DoctorCard"
import { SlotPicker } from "./SlotPicker"

function doctorInitials(d: Doctor) {
  return `${d.firstName[0]}${d.lastName[0]}`.toUpperCase()
}

interface DoctorSheetProps {
  doctor: Doctor | null
  freeSlots: FreeSlot[]
  slotsLoading: boolean
  onClose: () => void
}

export function DoctorSheet({ doctor, freeSlots, slotsLoading, onClose }: DoctorSheetProps) {
  return (
    <Sheet open={doctor !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="flex w-full flex-col max-w-[50vw]! border-none rounded-l-[20px]">
        {doctor && (
          <>
            <SheetHeader className="space-y-4 border-b border-border pb-6 text-left">
              <div className="flex items-start gap-4">
                <Avatar className="size-20">
                  <AvatarFallback className="bg-secondary text-xl text-secondary-foreground">
                    {doctorInitials(doctor)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1 space-y-2">
                  <SheetTitle className="text-xl leading-tight">{doctorFullName(doctor)}</SheetTitle>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="font-normal">
                      {doctor.specialization}
                    </Badge>
                    {doctor.isAvailable && (
                      <Badge className="bg-success/10 text-success font-normal border-0">
                        Available
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <SheetDescription asChild>
                <p className="body-base leading-relaxed text-muted-foreground">{doctor.bio}</p>
              </SheetDescription>
            </SheetHeader>

            <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-6">
              <section className="space-y-2">
                <h3 className="label flex items-center gap-2 text-foreground">
                  <Stethoscope className="size-4" />
                  Details
                </h3>
                <dl className="space-y-1 body-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <dt>Experience</dt>
                    <dd className="text-foreground">{doctor.yearsOfExperience} years</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>License</dt>
                    <dd className="font-mono text-xs text-foreground">{doctor.licenseNumber}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Contact</dt>
                    <dd className="text-foreground">{doctor.phone || doctor.email}</dd>
                  </div>
                </dl>
              </section>

              <section className="space-y-3">
                <h3 className="label flex items-center gap-2 text-foreground">
                  <Clock className="size-4" aria-hidden />
                  Available slots
                </h3>
                <SlotPicker freeSlots={freeSlots} isLoading={slotsLoading} />
              </section>
            </div>

            <SheetFooter className="border-t border-border sm:flex-col sm:space-x-0">
              <Button type="button" className="w-full" disabled={!doctor.isAvailable}>
                {doctor.isAvailable ? "Request appointment" : "Not available"}
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
