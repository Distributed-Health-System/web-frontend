"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import AgoraRTC, { AgoraRTCProvider, useJoin } from "agora-rtc-react"
import { AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CallVideos } from "./CallVideos"
import { CallControls } from "./CallControls"
import { useAgoraToken } from "../hooks/useAgoraToken"
import { AGORA_APP_ID, getChannelName, generateUID } from "../lib/agora"
import type { Appointment, Doctor, Patient, UserRole } from "@/lib/types"

// Singleton client — created outside component to avoid re-creation on re-render
const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" })

interface VideoCallRoomProps {
  appointment: Appointment
  doctor?: Doctor
  patient?: Patient
  currentUserId: string
  userRole: UserRole
}

function CallInner({
  appointment,
  doctor,
  patient,
  currentUserId,
  userRole,
  token,
}: VideoCallRoomProps & { token: string }) {
  const router = useRouter()
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)

  const channelName = getChannelName(appointment.id)
  const uid = generateUID(currentUserId)

  const { isLoading, isConnected, error } = useJoin({
    appid: AGORA_APP_ID,
    channel: channelName,
    token,
    uid,
  })

  const handleEndCall = useCallback(() => {
    router.push(userRole === "patient" ? "/patient/appointments" : "/doctor/appointments")
  }, [router, userRole])

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
        <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="text-xl font-semibold">Connection Error</h2>
        <p className="text-sm text-white/60 max-w-md">{error.message}</p>
        <Button variant="secondary" onClick={handleEndCall}>Go Back</Button>
      </div>
    )
  }

  if (isLoading || !isConnected) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
        <p className="text-white/60">Connecting to video call…</p>
      </div>
    )
  }

  const localUserName = userRole === "patient"
    ? (patient?.name ?? "Patient")
    : (doctor?.name ?? "Doctor")
  const remoteUserName = userRole === "patient" ? doctor?.name : patient?.name

  return (
    <div className="relative w-full h-full">
      <CallVideos
        isVideoOff={isVideoOff}
        isMuted={isMuted}
        localUserName={localUserName}
        remoteUserName={remoteUserName}
      />
      <CallControls
        isMuted={isMuted}
        isVideoOff={isVideoOff}
        onToggleMute={() => setIsMuted((v) => !v)}
        onToggleVideo={() => setIsVideoOff((v) => !v)}
        onEndCall={handleEndCall}
      />
    </div>
  )
}

export function VideoCallRoom(props: VideoCallRoomProps) {
  const channelName = getChannelName(props.appointment.id)
  const uid = generateUID(props.currentUserId)

  const { token, isLoading, error } = useAgoraToken(channelName, uid)
  const router = useRouter()

  const handleGoBack = () => {
    router.push(
      props.userRole === "patient" ? "/patient/appointments" : "/doctor/appointments"
    )
  }

  if (!AGORA_APP_ID) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <h2 className="text-xl font-semibold">Configuration Missing</h2>
        <p className="text-sm text-white/60">NEXT_PUBLIC_AGORA_APP_ID is not set.</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
        <p className="text-white/60">Preparing video call…</p>
      </div>
    )
  }

  if (error || !token) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <h2 className="text-xl font-semibold">Authentication Error</h2>
        <p className="text-sm text-white/60">{error ?? "Could not obtain a call token."}</p>
        <Button variant="secondary" onClick={handleGoBack}>Go Back</Button>
      </div>
    )
  }

  return (
    <AgoraRTCProvider client={client}>
      <CallInner {...props} token={token} />
    </AgoraRTCProvider>
  )
}
