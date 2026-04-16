// SSR-safe exports only.
// VideoCallRoom and CallVideos depend on agora-rtc-react (needs window) —
// always import them via dynamic() pointing at the file directly.
export { WaitingRoom } from "./components/WaitingRoom"
export { CallControls } from "./components/CallControls"
export { useAgoraToken } from "./hooks/useAgoraToken"
export { AGORA_APP_ID, getChannelName, generateUID } from "./lib/agora"
