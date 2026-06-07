
import { BASE_URLS } from '@/api/base'
import { apiCall, buildQuery } from '@/utils/apiErrors'

const baseUrl = () => BASE_URLS.GPX_BASE_URL

type ListParams = {
  limit?: number
  offset?: number
  search?: string
  status?: string
  ordering?: string
}

const listEmpty = { count: 0, next: null, previous: null, results: [] as any[] }

const normalizeRow = (row: any): any => {
  if (!row || typeof row !== 'object') return row

  const number = row.number ?? row.reference_no ?? ''
  const merchantName = row.merchant_name ?? (typeof row.merchant === 'string' ? row.merchant : row.merchant?.name ?? '')
  const customerName = row.payer?.name ?? (typeof row.customer === 'string' ? row.customer : row.customer?.name ?? '')
  const customerEmail = row.payer?.email ?? row.customer?.email ?? null
  const customerPhone = row.payer?.phone_number ?? row.customer?.phone_number ?? null

  return {
    ...row,
    number,
    merchant_name: merchantName,
    merchant_reference: row.merchant_reference ?? '',
    channel_name: row.channel_name ?? '',
    channel_number: row.channel_number ?? '',
    amount_due: row.amount_due ?? '0.00',
    amount_paid: row.amount_paid ?? '0.00',
    status: row.status ?? '',
    created_at: row.created_at ?? row.issue_date ?? null,
    voided_at: row.voided_at ?? row.voided_date ?? null,
    archived_at: row.archived_at ?? row.archived_date ?? null,
    void_reason: row.void_reason ?? '',
    invoice_description: row.invoice_description ?? row.description ?? row.notes ?? row.item_name ?? '',
    payer: {
      name: customerName,
      email: customerEmail,
      phone_number: customerPhone,
    },
  }
}

const normalizeListPayload = (payload: any) => {
  if (!payload || typeof payload !== 'object') return payload
  return {
    count: typeof payload.count === 'number' ? payload.count : 0,
    next: payload.next ?? null,
    previous: payload.previous ?? null,
    results: Array.isArray(payload.results) ? payload.results.map(normalizeRow) : [],
  }
}

const fetchInvoiceList = async (
  params: ListParams,
  tag: string,
  label: string,
  entityId: string,
) => {
  if (!baseUrl()) {
    return { error: 'Invoice dashboard service is not configured.', ...listEmpty }
  }

  const query: Record<string, unknown> = {
    limit: params.limit ?? 10,
    offset: params.offset ?? 0,
  }
  if (params.search) query.search = params.search
  if (params.status) query.status = params.status
  if (params.ordering) query.ordering = params.ordering
  if (entityId) query.entity = entityId

  const path = `/invoicing/invoices/?${buildQuery(query)}`
  const res = await apiCall<any>(baseUrl(), path, { tag, label })
  console.log(`${baseUrl()}${path}`)
  if (!res.ok) {
    return { error: (res.error as { detail: string }).detail, ...listEmpty }
  }
  return normalizeListPayload(res.data)
}

export async function getInvoiceLive(params: ListParams = {}, entityId: string) {
  return fetchInvoiceList( params, 'InvoiceLive', 'invoice:live', entityId)
}

export async function getInvoiceList(params: ListParams = {}, entityId: string) {
  return fetchInvoiceList( params, 'InvoiceList', 'invoice:list', entityId)
}

export async function getInvoiceVoided(params: ListParams = {}, entityId: string) {
  return fetchInvoiceList( params, 'InvoiceVoided', 'invoice:voided', entityId)
}

export async function getInvoiceArchived(params: ListParams = {}, entityId: string) {
  return fetchInvoiceList( params, 'InvoiceArchived', 'invoice:archived', entityId)
}

const fetchInvoiceMetrics = async (
  endpoint: 'live' | 'voided',
  tag: string,
  label: string,
  entityId?: string,
) => {
  if (!baseUrl()) return { error: 'Invoice dashboard service is not configured.' }
  const query = entityId ? `?${buildQuery({ entity: entityId })}` : ''
  const res = await apiCall<any>(baseUrl(), `/invoicing/invoices//metrics/${endpoint}/${query}`, {
    tag,
    label,
  })
  if (!res.ok) return { error: (res.error as { detail: string }).detail }
  return res.data
}

export const getInvoiceLiveMetrics = async (entityId?: string) =>
  fetchInvoiceMetrics('live', 'InvoiceMetricsLive', 'invoice:metrics-live', entityId)

export const getInvoiceVoidedMetrics = async (entityId?: string) =>
  fetchInvoiceMetrics('voided', 'InvoiceMetricsVoided', 'invoice:metrics-voided', entityId)

const num = (v: unknown): number => {
  const n = typeof v === 'number' ? v : parseFloat(v as string)
  return Number.isFinite(n) ? n : 0
}

// Returns true when the metrics payload is missing, errored, or every numeric slot is zero.
// Used to decide whether to fall back to client-side computation from the list itself.
export const isLiveMetricsEmpty = (m: any): boolean => {
  if (!m || typeof m !== 'object' || 'error' in m) return true
  const total = num(m.total_invoices?.count)
  const paid = num(m.paid_invoices?.count)
  const pending = num(m.pending_invoices?.count)
  const amount = num(m.total_amount_invoiced?.amount)
  return total === 0 && paid === 0 && pending === 0 && amount === 0
}

export const computeLiveMetricsFromList = (rows: any[]): any => {
  const safe = Array.isArray(rows) ? rows : []
  const matches = (status: string) =>
    safe.filter(r => (r?.status ?? '').toString().toLowerCase() === status.toLowerCase()).length
  const totalAmount = safe.reduce((sum, r) => sum + num(r?.amount_due), 0)
  return {
    total_invoices: { count: safe.length },
    paid_invoices: { count: matches('Paid') },
    pending_invoices: { count: matches('Pending') },
    total_amount_invoiced: { amount: totalAmount },
  }
}

export const isVoidedMetricsEmpty = (m: any): boolean => {
  if (!m || typeof m !== 'object' || 'error' in m) return true
  return (
    num(m.total_voided?.count) === 0 &&
    num(m.paid_invoices?.count) === 0 &&
    num(m.cancelled_invoices?.count) === 0 &&
    num(m.total_amount_voided?.amount) === 0 &&
    num(m.total_amount_not_recovered?.amount) === 0
  )
}

export const computeVoidedMetricsFromList = (rows: any[]): any => {
  const safe = Array.isArray(rows) ? rows : []
  const matches = (status: string) =>
    safe.filter(r => (r?.status ?? '').toString().toLowerCase() === status.toLowerCase()).length
  const totalVoided = safe.reduce((sum, r) => sum + num(r?.amount_due), 0)
  const notRecovered = safe.reduce(
    (sum, r) => sum + Math.max(num(r?.amount_due) - num(r?.amount_paid), 0),
    0,
  )
  return {
    total_voided: { count: safe.length },
    paid_invoices: { count: matches('Paid') },
    cancelled_invoices: { count: matches('Cancelled') },
    total_amount_voided: { amount: totalVoided },
    total_amount_not_recovered: { amount: notRecovered },
  }
}
