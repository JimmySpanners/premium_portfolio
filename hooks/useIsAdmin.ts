import { useAuth } from "@/components/providers/AuthProvider"

export function useIsAdmin(): boolean {
  const { isAdmin } = useAuth()
  // Ensure we always return a boolean
  return Boolean(isAdmin)
}
