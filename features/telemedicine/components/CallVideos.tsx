"use client"

import { useRef, useEffect } from "react"
import {
  useRemoteUsers,
  useRemoteAudioTracks,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  RemoteUser,
} from "agora-rtc-react"
import { User, VideoOff } from "lucide-react"

interface CallVideosProps {
  isVideoOff: boolean
  isMuted: boolean
  localUserName: string
  remoteUserName?: string
}

export function CallVideos({
  isVideoOff,
  isMuted,
  localUserName,
  remoteUserName = "Participant",
}: CallVideosProps) {
  const localVideoRef = useRef<HTMLDivElement>(null)

  const { localCameraTrack, isLoading: isCameraLoading } = useLocalCameraTrack(!isVideoOff)
  const { localMicrophoneTrack, isLoading: isMicLoading } = useLocalMicrophoneTrack(!isMuted)

  usePublish([localCameraTrack, localMicrophoneTrack])

  const remoteUsers = useRemoteUsers()
  const { audioTracks } = useRemoteAudioTracks(remoteUsers)

  useEffect(() => {
    audioTracks.forEach((track) => track.play())
  }, [audioTracks])

  useEffect(() => {
    if (localCameraTrack && localVideoRef.current && !isVideoOff) {
      localCameraTrack.play(localVideoRef.current)
    }
    return () => { localCameraTrack?.stop() }
  }, [localCameraTrack, isVideoOff])

  const hasRemoteUser = remoteUsers.length > 0

  return (
    <div className="relative w-full h-full bg-gray-900">
      {/* Main video area */}
      <div className="absolute inset-0">
        {hasRemoteUser ? (
          <div className="w-full h-full">
            <RemoteUser
              user={remoteUsers[0]}
              playVideo
              playAudio={false}
              className="w-full h-full"
            />
            <div className="absolute bottom-20 left-4 bg-black/50 px-3 py-1.5 rounded-lg">
              <span className="text-white text-sm font-medium">{remoteUserName}</span>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center">
            {!isVideoOff && !isCameraLoading ? (
              <div ref={localVideoRef} className="w-full h-full" />
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="h-24 w-24 rounded-full bg-white/10 flex items-center justify-center">
                  <User className="h-12 w-12 text-white/60" />
                </div>
                <p className="text-white/60 text-lg">
                  {isVideoOff ? "Camera is off" : "Starting camera..."}
                </p>
              </div>
            )}
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-2 rounded-lg">
              <span className="text-white text-sm">Waiting for participant to join…</span>
            </div>
          </div>
        )}
      </div>

      {/* Picture-in-picture */}
      {hasRemoteUser && (
        <div className="absolute top-4 right-4 w-48 h-36 rounded-lg overflow-hidden shadow-lg border-2 border-white/20">
          {!isVideoOff ? (
            <div ref={localVideoRef} className="w-full h-full bg-gray-800" />
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <VideoOff className="h-8 w-8 text-white/40" />
            </div>
          )}
          <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-xs text-white">
            You
          </div>
        </div>
      )}

      {(isCameraLoading || isMicLoading) && (
        <div className="absolute top-4 left-4 bg-black/50 px-3 py-1.5 rounded-lg">
          <span className="text-white text-sm">Connecting media…</span>
        </div>
      )}
    </div>
  )
}
