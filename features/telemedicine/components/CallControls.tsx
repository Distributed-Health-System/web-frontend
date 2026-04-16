"use client"

import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CallControlsProps {
  isMuted: boolean
  isVideoOff: boolean
  onToggleMute: () => void
  onToggleVideo: () => void
  onEndCall: () => void
}

export function CallControls({
  isMuted,
  isVideoOff,
  onToggleMute,
  onToggleVideo,
  onEndCall,
}: CallControlsProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
      <div className="flex items-center justify-center gap-4">
        <Button
          variant={isMuted ? "destructive" : "secondary"}
          size="lg"
          className="h-14 w-14 rounded-full"
          title={isMuted ? "Unmute" : "Mute"}
          onClick={onToggleMute}
        >
          {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
        </Button>

        <Button
          variant={isVideoOff ? "destructive" : "secondary"}
          size="lg"
          className="h-14 w-14 rounded-full"
          title={isVideoOff ? "Turn on camera" : "Turn off camera"}
          onClick={onToggleVideo}
        >
          {isVideoOff ? <VideoOff className="h-6 w-6" /> : <Video className="h-6 w-6" />}
        </Button>

        <Button
          variant="destructive"
          size="lg"
          className="h-14 w-14 rounded-full"
          title="End call"
          onClick={onEndCall}
        >
          <PhoneOff className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}
