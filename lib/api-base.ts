import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"

function createApiClient(baseURL: string): AxiosInstance {
  const client = axios.create({
    baseURL,
    headers: { "Content-Type": "application/json" },
  })

  // Attach access token from sessionStorage on every request
  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("accessToken")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  })

  // Handle 401 — clear session and redirect to login
  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401 && typeof window !== "undefined") {
        sessionStorage.removeItem("accessToken")
        sessionStorage.removeItem("refreshToken")
        window.location.href = "/login"
      }
      return Promise.reject(error)
    }
  )

  return client
}

// Default client pointing at the API gateway
export const apiClient = createApiClient(API_BASE_URL)

