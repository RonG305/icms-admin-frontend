import { BASE_URLS } from "@/api/base"
import { makeApiRequest } from "@/api/main"

export interface AnalyticsSeriesData {
    time: string
    total: number
}

export interface AnalyticsStats {
    total_transactions: number
    total_volume: number
    success_rate: number
    average_transaction_value: number
}

export const getDailySeries = async () => {
    const response = await makeApiRequest(BASE_URLS.GPX_AUTH_URL, `/analytics/today_series/`, {
        method: 'GET',
        withToken: true,
        tag: 'DailyAnalytics',
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        return {
            error: errorData?.detail || 'Failed to fetch daily analytics'
        }
    }

    const data: AnalyticsSeriesData[] = await response.json()
    return {
        series: data
    }
}

export const getWeeklySeries = async () => {
    const response = await makeApiRequest(BASE_URLS.GPX_AUTH_URL, `/analytics/weekly_series/`, {
        method: 'GET',
        withToken: true,
        tag: 'WeeklyAnalytics',
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        return {
            error: errorData?.detail || 'Failed to fetch weekly analytics'
        }
    }

    const data: AnalyticsSeriesData[] = await response.json()
    return {
        series: data
    }
}

export const getMonthlySeries = async () => {
    const response = await makeApiRequest(BASE_URLS.GPX_AUTH_URL, `/analytics/monthly_series/`, {
        method: 'GET',
        withToken: true,
        tag: 'MonthlyAnalytics',
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        return {
            error: errorData?.detail || 'Failed to fetch monthly analytics'
        }
    }

    const data: AnalyticsSeriesData[] = await response.json()
    return {
        series: data
    }
}

export const getQuarterlySeries = async () => {
    const response = await makeApiRequest(BASE_URLS.GPX_AUTH_URL, `/analytics/quarterly_series/`, {
        method: 'GET',
        withToken: true,
        tag: 'QuarterlyAnalytics',
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        return {
            error: errorData?.detail || 'Failed to fetch quarterly analytics'
        }
    }

    const data: AnalyticsSeriesData[] = await response.json()
    return {
        series: data
    }
}

export const getAnnuallySeries = async () => {
    const response = await makeApiRequest(BASE_URLS.GPX_AUTH_URL, `/analytics/annually_series/`, {
        method: 'GET',
        withToken: true,
        tag: 'AnnuallyAnalytics',
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        return {
            error: errorData?.detail || 'Failed to fetch annually analytics'
        }
    }

    const data: AnalyticsSeriesData[] = await response.json()
    return {
        series: data
    }
}

export const getTransactionStats = async () => {
    const response = await makeApiRequest(BASE_URLS.GPX_AUTH_URL, `/analytics/transaction_stats/`, {
        method: 'GET',
        withToken: true,
        tag: 'TransactionStats',
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        return {
            error: errorData?.detail || 'Failed to fetch transaction stats'
        }
    }

    const data: AnalyticsStats = await response.json()
    return data
}
