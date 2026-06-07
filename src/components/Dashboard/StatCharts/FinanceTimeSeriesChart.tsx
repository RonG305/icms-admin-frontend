"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { TrendingUp, TrendingDown } from "lucide-react"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"

export const description = "Year-over-year monthly revenue comparison"

const chartData = [
    { month: "Jan", revenue2025: 0, revenue2026: 0 },
    { month: "Feb", revenue2025: 29600, revenue2026: 331200 },
    { month: "Mar", revenue2025: 34800, revenue2026: 37500 },
    { month: "Apr", revenue2025: 358200, revenue2026: 401800 },
    { month: "May", revenue2025: 39600, revenue2026: 427300 },
    { month: "Jun", revenue2025: 41300, revenue2026: 468900 },
    { month: "Jul", revenue2025: 46700, revenue2026: 343200 },
    { month: "Aug", revenue2025: 48200, revenue2026: 496700 },
    { month: "Sep", revenue2025: 40100, revenue2026: 444600 },
    { month: "Oct", revenue2025: 31500, revenue2026: 412300 },
    { month: "Nov", revenue2025: 34800, revenue2026: 379400 },
    { month: "Dec", revenue2025: 328600, revenue2026: 364100 },
]

const chartConfig = {
    revenue2026: {
        label: "2026 (KES)",
        color: "var(--chart-1)",
    },
    revenue2025: {
        label: "2025 (KES)",
        color: "var(--chart-2)",
    },
} satisfies ChartConfig

const formatKES = (value: number) =>
    value >= 1000 ? `${(value / 1000).toFixed(0)}k` : `${value}`

const total2025 = chartData.reduce((s, d) => s + d.revenue2025, 0)
const total2026 = chartData.reduce((s, d) => s + d.revenue2026, 0)
const yoyPct = (((total2026 - total2025) / total2025) * 100).toFixed(1)
const isUp = total2026 >= total2025

export function FinanceTimeSeriesChart() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Revenue — Year-on-Year</CardTitle>
                <CardDescription>Monthly collection: 2025 vs 2026 (KES)</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
                    <AreaChart data={chartData} height={250} width={500} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="fill2026" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-revenue2026)" stopOpacity={0.7} />
                                <stop offset="95%" stopColor="var(--color-revenue2026)" stopOpacity={0.05} />
                            </linearGradient>
                            <linearGradient id="fill2025" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-revenue2025)" stopOpacity={0.7} />
                                <stop offset="95%" stopColor="var(--color-revenue2025)" stopOpacity={0.05} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            width={46}
                            tickFormatter={formatKES}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    formatter={(value) => `KES ${Number(value).toLocaleString()}`}
                                    indicator="dot"
                                />
                            }
                        />
                        <Area dataKey="revenue2025" type="natural" fill="url(#fill2025)" stroke="var(--color-revenue2025)" strokeWidth={1.5} />
                        <Area dataKey="revenue2026" type="natural" fill="url(#fill2026)" stroke="var(--color-revenue2026)" strokeWidth={1.5} />
                        <ChartLegend content={<ChartLegendContent  payload={chartConfig} />} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 leading-none font-medium">
                    {isUp ? (
                        <>2026 revenue up {yoyPct}% vs 2025 <TrendingUp className="h-4 w-4 text-emerald-500" /></>
                    ) : (
                        <>2026 revenue down {Math.abs(Number(yoyPct))}% vs 2025 <TrendingDown className="h-4 w-4 text-rose-500" /></>
                    )}
                </div>
                <div className="leading-none text-muted-foreground">
                    Comparing monthly collected revenue across all 12 months
                </div>
            </CardFooter>
        </Card>
    )
}
