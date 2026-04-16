export const AGORA_APP_ID = process.env.NEXT_PUBLIC_AGORA_APP_ID ?? ""

export function getChannelName(appointmentId: string): string {
  return `telehealth_${appointmentId}`
}

export function generateUID(userId: string): number {
  let hash = 0
  for (let i = 0; i < userId.length; i++) {
    const char = userId.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return Math.abs(hash) % 1_000_000
}
