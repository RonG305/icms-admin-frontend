"use client";

import React from "react";
import { formattedCurrency } from "@/lib/utils";
import { Icon } from "@iconify/react";
import GridStatCard from "../common/GridStatCard";
import { DashboardStatsType } from "./types";

const getMonth = () =>
  new Date().toLocaleString("default", { month: "short" });
const getFullYear = () => new Date().getFullYear();

export default function DashboardStats({
  stats,
}: {
  stats?: DashboardStatsType;
}) {
  const completionRate = parseFloat(stats?.payment_completion_rate ?? "0");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4">
      <GridStatCard
        items={[
          {
            title: "Total Amount Paid",
            value: formattedCurrency(Number(stats?.total_amount_paid_raw) || 0),
            icon: <Icon icon="solar:wallet-money-linear" fontSize={20} className="text-primary" />,
            iconBg: "bg-primary/10",
            trend: completionRate,
            trendLabel: "COLLECTION RATE",
          },
          {
            title: "Total Billed",
            value: formattedCurrency(Number(stats?.expected_amount) || 0),
            icon: <Icon icon="solar:hand-money-linear" fontSize={20} className="text-destructive" />,
            iconBg: "bg-destructive/10",
          },
          {
            title: `${getMonth()} ${getFullYear()} Consumption`,
            value: `${stats?.total_consumption_current_month_units ?? 0} m³`,
            icon: <Icon icon="solar:waterdrops-linear" fontSize={20} className="text-blue-500" />,
            iconBg: "bg-blue-500/10",
          },
          {
            title: "Outstanding Balance",
            value: formattedCurrency(Number(stats?.unpaid_amount) || 0),
            icon: <Icon icon="solar:bill-list-linear" fontSize={20} className="text-destructive" />,
            iconBg: "bg-destructive/10",
          },
        ]}
      />

      <GridStatCard
        items={[
          {
            title: "Total Customers",
            value: stats?.total_customers ?? 0,
            icon: <Icon icon="solar:users-group-rounded-linear" fontSize={20} className="text-primary" />,
            iconBg: "bg-primary/10",
          },
          {
            title: "Paid Customers",
            value: stats?.total_paid_customers ?? 0,
            icon: <Icon icon="solar:check-circle-linear" fontSize={20} className="text-success" />,
            iconBg: "bg-success/10",
          },
          {
            title: "Customers with Debt",
            value: stats?.customers_with_debt ?? 0,
            icon: <Icon icon="solar:danger-circle-linear" fontSize={20} className="text-warning-foreground" />,
            iconBg: "bg-warning/10",
          },
          {
            title: "Overpayment",
            value: formattedCurrency(Number(stats?.overpayment) || 0),
            icon: <Icon icon="solar:coin-linear" fontSize={20} className="text-success" />,
            iconBg: "bg-success/10",
          },
        ]}
      />
    </div>
  );
}
