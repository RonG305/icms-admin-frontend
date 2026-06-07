import StatsCard from "@/components/common/StatsCard"
import { Icon } from "@iconify/react"
import { OrgUserStats } from "@/types/auth"

const UserStats = ({ stats }: { stats: OrgUserStats | null }) => {
  const u = stats?.users

  const cards = [
    {
      title: "Total Users",
      value: u?.total ?? 0,
      icon: <Icon icon="solar:users-group-rounded-linear" fontSize={20} className="text-primary" />,
      iconBg: "bg-primary/10",
    },
    {
      title: "Active Users",
      value: u?.by_status.active ?? 0,
      icon: <Icon icon="solar:check-circle-linear" fontSize={20} className="text-success" />,
      iconBg: "bg-success/10",
    },
    // {
    //   title: "Verified",
    //   value: u?.verification.verified ?? 0,
    //   icon: <Icon icon="solar:shield-check-linear" fontSize={20} className="text-info" />,
    //   iconBg: "bg-info/10",
    // },
    // {
    //   title: "2FA Enabled",
    //   value: u?.security.two_factor_enabled ?? 0,
    //   icon: <Icon icon="solar:lock-password-linear" fontSize={20} className="text-warning-foreground" />,
    //   iconBg: "bg-warning/10",
    // },
    {
      title: "Joined Today",
      value: u?.registrations.today ?? 0,
      icon: <Icon icon="solar:calendar-add-linear" fontSize={20} className="text-primary" />,
      iconBg: "bg-primary/10",
    },
    {
      title: "Joined This Month",
      value: u?.registrations.this_month ?? 0,
      icon: <Icon icon="solar:calendar-mark-linear" fontSize={20} className="text-success" />,
      iconBg: "bg-success/10",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {cards.map((s) => (
        <StatsCard key={s.title} title={s.title} value={s.value} icon={s.icon} iconBg={s.iconBg} />
      ))}
    </div>
  )
}

export default UserStats
