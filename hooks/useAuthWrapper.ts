import { useAuth as useOriginalAuth } from "@/components/providers/AuthProvider"

export const useAuth = () => {
  const auth = useOriginalAuth()
  return {
    ...auth,
    isAdmin: Boolean(auth.isAdmin)
  }
}
