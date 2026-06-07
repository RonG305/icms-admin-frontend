import { ChartAreaInteractive } from "./components/chart-area-interactive"
import { DataTable } from "./components/data-table"
import { SectionCards } from "./components/section-cards"

import data from "./data/data.json"
import pastPerformanceData from "./data/past-performance-data.json"
import keyPersonnelData from "./data/key-personnel-data.json"
import focusDocumentsData from "./data/focus-documents-data.json"
import DashboardStats from "@/components/Dashboard/Statistics"
import { Suspense } from "react"
import { CustomLoader } from "@/components/common/CustomerLoader"
import { WaterUnitsConsumptionChart } from "@/components/Dashboard/StatCharts/WaterUnitsConsumptionChart"
import { FinanceTimeSeriesChart } from "@/components/Dashboard/StatCharts/FinanceTimeSeriesChart"
import { Card } from "@/components/ui/card"

export default function Page() {
  return (
    <>
      <div className="px-4 lg:px-6">
        <div className="flex flex-col gap-0">
          <h1 className="text-2xl font-semibold text-primary tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your admin dashboard</p>
        </div>
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Suspense fallback={<CustomLoader name="Loading Water Consumption Chart ..." />}>
          <WaterUnitsConsumptionChart />
        </Suspense>
        <Suspense fallback={<CustomLoader name="Loading Finance Time Series Chart ..." />}>
          <FinanceTimeSeriesChart />
        </Suspense>
      </div>

      <div className=" ">
        <SectionCards />
      </div>
      <Card className="">
        <DataTable
          data={data}
          pastPerformanceData={pastPerformanceData}
          keyPersonnelData={keyPersonnelData}
          focusDocumentsData={focusDocumentsData}
        />
      </Card>
    </>
  )
}
