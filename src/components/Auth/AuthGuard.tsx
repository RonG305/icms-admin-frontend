import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { decodeToken } from "@/lib/decode-token"

interface AuthGuardProps {
  children: React.ReactNode
  redirectTo?: string
}

export async function AuthGuard({ children, redirectTo = "/sign-in" }: AuthGuardProps) {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  if (!token) {
    redirect(redirectTo)
  }

  try {
    const decoded = decodeToken(token)
    const now = Math.floor(Date.now() / 1000)
    if (decoded.exp && decoded.exp < now) {
      redirect(redirectTo)
    }
  } catch {
    redirect(redirectTo)
  }

  return <>{children}</>
}
