"use client"

import { TrendingUp, TrendingDown } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

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
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"

export const description = "Monthly water consumption chart"
const chartData = [
    { month: "January", supplied: 1520, billed: 1240 },
    { month: "February", supplied: 1440, billed: 1185 },
    { month: "March", supplied: 1610, billed: 1320 },
    { month: "April", supplied: 1780, billed: 1480 },
    { month: "May", supplied: 1970, billed: 1650 },
    { month: "June", supplied: 2230, billed: 1890 },
    { month: "July", supplied: 2480, billed: 2100 },
    { month: "August", supplied: 2460, billed: 2080 },
    { month: "September", supplied: 2090, billed: 1760 },
    { month: "October", supplied: 1840, billed: 1530 },
    { month: "November", supplied: 1590, billed: 1310 },
    { month: "December", supplied: 1540, billed: 1270 },
]

const chartConfig = {
    supplied: {
        label: "Supplied (m³)",
        color: "var(--chart-1)",
    },
    billed: {
        label: "Billed (m³)",
        color: "var(--chart-2)",
    },
} satisfies ChartConfig


const last = chartData[chartData.length - 1]
const prev = chartData[chartData.length - 2]
const totalLast = last.billed
const totalPrev = prev.billed
const trendPct = (((totalLast - totalPrev) / totalPrev) * 100).toFixed(1)
const isTrendUp = totalLast >= totalPrev
const latestNRW = (((last.supplied - last.billed) / last.supplied) * 100).toFixed(1)

export function WaterUnitsConsumptionChart() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Water Units Consumption</CardTitle>
                <CardDescription>Supplied vs Billed — Residential Customers 2025 (m³)</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={chartData} barCategoryGap="30%">
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
                            width={42}
                        />
                        <ChartTooltip
                            cursor={{ fill: "var(--muted)", opacity: 0.4 }}
                            content={<ChartTooltipContent indicator="dashed" />}
                        />
                        <Bar dataKey="supplied" fill="var(--color-supplied)" radius={[0, 0, 0, 0]} />
                        <Bar dataKey="billed" fill="var(--color-billed)" radius={[0, 0, 0, 0]} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 leading-none font-medium">
                    {isTrendUp ? (
                        <>Billed consumption up {trendPct}% vs last month <TrendingUp className="h-4 w-4 text-emerald-500" /></>
                    ) : (
                        <>Billed consumption down {Math.abs(Number(trendPct))}% vs last month <TrendingDown className="h-4 w-4 text-rose-500" /></>
                    )}
                </div>
                <div className="leading-none text-muted-foreground">
                    Non-revenue water (NRW) this month: <span className="font-medium text-foreground">{latestNRW}%</span> — gap between supplied and billed
                </div>
            </CardFooter>
        </Card>
    )
}
