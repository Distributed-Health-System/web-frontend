import { NextRequest, NextResponse } from "next/server"
import { RtcTokenBuilder, RtcRole } from "agora-token"

const APP_ID = process.env.NEXT_PUBLIC_AGORA_APP_ID ?? ""
const APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE ?? ""
const TOKEN_EXPIRY_SECONDS = 86400

export async function POST(request: NextRequest) {
  if (!APP_ID) {
    return NextResponse.json({ error: "Agora App ID is not configured" }, { status: 500 })
  }
  if (!APP_CERTIFICATE) {
    return NextResponse.json({ error: "Agora App Certificate is not configured" }, { status: 500 })
  }

  const body = await request.json()
  const { channelName, uid, role = "publisher" } = body as {
    channelName: string
    uid: number
    role?: string
  }

  if (!channelName) {
    return NextResponse.json({ error: "channelName is required" }, { status: 400 })
  }

  const rtcRole = role === "subscriber" ? RtcRole.SUBSCRIBER : RtcRole.PUBLISHER
  const expireTimestamp = Math.floor(Date.now() / 1000) + TOKEN_EXPIRY_SECONDS

  const token = RtcTokenBuilder.buildTokenWithUid(
    APP_ID,
    APP_CERTIFICATE,
    channelName,
    uid ?? 0,
    rtcRole,
    expireTimestamp,
    expireTimestamp,
  )

  return NextResponse.json({ token, appId: APP_ID })
}
