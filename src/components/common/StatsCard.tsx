import React from "react"
import { Card } from "../ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

interface StatsCardProps {
    title: string
    value: string | number
    icon: React.ReactNode
    iconBg: string
    trend?: number
    trendLabel?: string
}

const StatsCard = ({
    title,
    value,
    icon,
    iconBg,
    trend,
    trendLabel = "VS PREV. PERIOD",
}: StatsCardProps) => {
    const isPositive = trend !== undefined && trend >= 0

    return (
        <Card className="p-5 flex flex-col gap-3">
            <div className="flex items-start justify-between">
                <p className="text-base font-medium text-muted-foreground">{title}</p>
                <div className={`rounded-full p-2.5 shrink-0 ${iconBg}`}>
                    {icon}
                </div>
            </div>

            <p className="text-3xl lg:text-4xl font-semibold tracking-tight">{value}</p>

            {trend !== undefined && (
                <div className="flex items-center gap-1.5">
                    {isPositive ? (
                        <TrendingUp className="h-3.5 w-3.5 text-success shrink-0" />
                    ) : (
                        <TrendingDown className="h-3.5 w-3.5 text-destructive shrink-0" />
                    )}
                    <span
                        className={`text-xs font-bold ${isPositive ? "text-success" : "text-destructive"}`}
                    >
                        {Math.abs(trend)}%
                    </span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                        {trendLabel}
                    </span>
                </div>
            )}
        </Card>
    )
}

export default StatsCard
