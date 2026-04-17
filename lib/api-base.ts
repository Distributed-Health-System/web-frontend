import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"

let silentRefreshTimer: ReturnType<typeof setTimeout> | null = null
let isRefreshing = false
let refreshSubscribers: Array<(success: boolean) => void> = []

function onRefreshResult(success: boolean) {
  refreshSubscribers.forEach((cb) => cb(success))
  refreshSubscribers = []
}

export function scheduleTokenRefresh(expiresIn: number) {
  if (silentRefreshTimer) clearTimeout(silentRefreshTimer)
  // Refresh 60 seconds before expiry
  const delay = Math.max((expiresIn - 60) * 1000, 0)
  silentRefreshTimer = setTimeout(async () => {
    try {
      const { data } = await apiClient.post<{ expiresIn: number }>("/auth/refresh")
      scheduleTokenRefresh(data.expiresIn)
    } catch {
      // Refresh failed — let the 401 interceptor handle it on next request
    }
  }, delay)
}

export function cancelTokenRefresh() {
  if (silentRefreshTimer) {
    clearTimeout(silentRefreshTimer)
    silentRefreshTimer = null
  }
}

function createApiClient(baseURL: string): AxiosInstance {
  const client = axios.create({
    baseURL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true, // send cookies on every request
  })

  client.interceptors.request.use((config: InternalAxiosRequestConfig) => config)

  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined

      if (
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry &&
        !originalRequest.url?.includes("/auth/refresh") &&
        !originalRequest.url?.includes("/auth/login")
      ) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            refreshSubscribers.push((success) => {
              if (success) resolve(client(originalRequest))
              else reject(error)
            })
          })
        }

        originalRequest._retry = true
        isRefreshing = true

        try {
          const { data } = await client.post<{ expiresIn: number }>("/auth/refresh")
          scheduleTokenRefresh(data.expiresIn)
          onRefreshResult(true)
          return client(originalRequest)
        } catch {
          onRefreshResult(false)
          if (typeof window !== "undefined") window.location.href = "/login"
          return Promise.reject(error)
        } finally {
          isRefreshing = false
        }
      }

      return Promise.reject(error)
    }
  )

  return client
}

export const apiClient = createApiClient(API_BASE_URL)
