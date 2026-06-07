import { AuthGuard } from "@/components/Auth/AuthGuard"
import { DashboardClientLayout } from "./_components/DashboardClientLayout"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <DashboardClientLayout>{children}</DashboardClientLayout>
    </AuthGuard>
  )
}
