import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"
const ACCESS_TOKEN_KEY = "dh_access_token"
const REFRESH_TOKEN_KEY = "dh_refresh_token"

export function setAuthTokens(accessToken: string, refreshToken: string) {
  if (typeof window === "undefined") return
  sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null
  return sessionStorage.getItem(REFRESH_TOKEN_KEY)
}

export function clearAuthTokens() {
  if (typeof window === "undefined") return
  sessionStorage.removeItem(ACCESS_TOKEN_KEY)
  sessionStorage.removeItem(REFRESH_TOKEN_KEY)
}

function createApiClient(baseURL: string): AxiosInstance {
  const client = axios.create({
    baseURL,
    headers: { "Content-Type": "application/json" },
  })

  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem(ACCESS_TOKEN_KEY)
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  })

  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const isAuthRoute =
        error.config?.url?.includes("/auth/login") ||
        error.config?.url?.includes("/auth/logout")
      if (error.response?.status === 401 && !isAuthRoute) {
        clearAuthTokens()
        if (typeof window !== "undefined") window.location.href = "/login"
      }
      return Promise.reject(error)
    }
  )

  return client
}

export const apiClient = createApiClient(API_BASE_URL)
