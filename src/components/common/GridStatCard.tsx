import React from "react"
import { Card } from "../ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

interface GridStatItem {
    title: string
    value: string | number
    icon: React.ReactNode
    iconBg: string
    trend?: number
    trendLabel?: string
}

interface GridStatCardProps {
    items: [GridStatItem, GridStatItem, GridStatItem, GridStatItem]
}

function StatCell({ item }: { item: GridStatItem }) {
    const isPositive = item.trend !== undefined && item.trend >= 0
    return (
        <div className="flex-1 p-5 flex flex-col gap-2.5 min-w-0">
            <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-muted-foreground leading-snug">
                    {item.title}
                </p>
                <div className={`rounded-full p-2 shrink-0 ${item.iconBg}`}>
                    {item.icon}
                </div>
            </div>

            <p className="md:text-3xl text-lg font-bold tracking-tight">{item.value}</p>

            {item.trend !== undefined && (
                <div className="flex items-center gap-1.5">
                    {isPositive ? (
                        <TrendingUp className="h-3.5 w-3.5 text-success shrink-0" />
                    ) : (
                        <TrendingDown className="h-3.5 w-3.5 text-destructive shrink-0" />
                    )}
                    <span
                        className={`text-xs font-bold ${isPositive ? "text-success" : "text-destructive"}`}
                    >
                        {Math.abs(item.trend)}%
                    </span>
                    {item.trendLabel && (
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                            {item.trendLabel}
                        </span>
                    )}
                </div>
            )}
        </div>
    )
}

const GridStatCard = ({ items }: GridStatCardProps) => {
    return (
        <Card className="overflow-hidden p-0">
            <div className="flex divide-x divide-border">
                <StatCell item={items[0]} />
                <StatCell item={items[1]} />
            </div>
            <div className="border-t border-border" />
            <div className="flex divide-x divide-border">
                <StatCell item={items[2]} />
                <StatCell item={items[3]} />
            </div>
        </Card>
    )
}

export default GridStatCard
