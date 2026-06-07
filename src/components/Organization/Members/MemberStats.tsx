import StatsCard from '@/components/common/StatsCard'
import { Icon } from '@iconify/react'
import React from 'react'



const MemberStats = ({ stats }: { stats: any }) => {
  const memberStats = [
    {
      title: "Total Members",
      value: stats?.total_members ?? 0,
      icon: <Icon icon="solar:users-group-rounded-linear" fontSize={20} className="text-primary" />,
      iconBg: "bg-primary/10",
    },
    {
      title: "Active Members",
      value: stats?.total_active_members ?? 0,
      icon: <Icon icon="solar:check-circle-linear" fontSize={20} className="text-success" />,
      iconBg: "bg-success/10",
    },
    {
      title: "Total Sacco Members",
      value: stats?.total_sacco_members ?? 0,
      icon: <Icon icon="solar:danger-circle-linear" fontSize={20} className="text-warning-foreground" />,
      iconBg: "bg-warning/10",
    },
    {
      title: "Total Shares",
      value: (Number(stats?.total_shares) || 0),
      icon: <Icon icon="solar:wad-of-money-linear" fontSize={20} className="text-success" />,
      iconBg: "bg-success/10",
    },
  ]

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
      {memberStats.map((stat) => (
        <StatsCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          iconBg={stat.iconBg}
        />
      ))}
    </div>
  )
}

export default MemberStats
