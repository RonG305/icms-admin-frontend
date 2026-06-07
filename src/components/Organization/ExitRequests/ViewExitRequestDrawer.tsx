'use client'

import React from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ExitRequest } from '@/types/member'
import { formatDate, formatDateTime, formatCurrency } from '@/lib/format'

interface Props {
  exitRequest: ExitRequest
  open: boolean
  onOpenChange: (open: boolean) => void
}

function Row({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div className='flex items-start justify-between gap-4 py-2.5'>
      <span className='text-sm text-muted-foreground shrink-0'>{label}</span>
      <span className='text-sm text-right font-medium break-all'>
        {value ?? <span className='text-muted-foreground font-normal'>—</span>}
      </span>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className='flex flex-col border p-3 rounded-lg'>
      <p className='text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1'>
        {title}
      </p>
      <div className='divide-y'>{children}</div>
    </div>
  )
}

const statusVariant = (s: string) => {
  const map: Record<string, 'warning' | 'info' | 'success' | 'destructive' | 'secondary'> = {
    pending: 'warning',
    under_review: 'info',
    approved: 'success',
    rejected: 'destructive',
    completed: 'secondary',
  }
  return map[s] ?? 'secondary'
}

export function ViewExitRequestDrawer({ exitRequest, open, onOpenChange }: Props) {
  const m = exitRequest.member
  const memberName = m
    ? [m.profile?.first_name, m.profile?.last_name].filter(Boolean).join(' ')
    : exitRequest.member_id

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side='right' className='w-full sm:max-w-2xl overflow-y-auto thin-scrollbar'>
        <SheetHeader className='pb-4'>
          <div>
            <SheetTitle>Exit Request</SheetTitle>
            <SheetDescription>{memberName}</SheetDescription>
          </div>
          <div className='flex items-center gap-2 mt-2 flex-wrap'>
            <Badge variant={statusVariant(exitRequest.status)} className='capitalize'>
              {exitRequest.status.replace(/_/g, ' ')}
            </Badge>
            <Badge variant='outline' className='capitalize'>
              {exitRequest.reason.replace(/_/g, ' ')}
            </Badge>
          </div>
        </SheetHeader>

        <Separator />

        <div className='flex flex-col gap-4 p-4'>
          {m && (
            <Section title='Member Info'>
              <Row label='Name' value={memberName} />
              <Row label='Member Number' value={<span className='font-mono text-xs'>{m.member_number}</span>} />
              <Row label='Category' value={<span className='capitalize'>{m.category?.replace(/_/g, ' ')}</span>} />
              <Row label='Email' value={m.profile?.user?.email} />
            </Section>
          )}

          <Section title='Exit Details'>
            <Row label='Reason' value={<span className='capitalize'>{exitRequest.reason.replace(/_/g, ' ')}</span>} />
            <Row label='Reason Details' value={exitRequest.reason_details} />
            <Row label='Status' value={
              <Badge variant={statusVariant(exitRequest.status)} className='capitalize'>
                {exitRequest.status.replace(/_/g, ' ')}
              </Badge>
            } />
            <Row label='Notes' value={exitRequest.notes} />
          </Section>

          <Section title='Snapshot'>
            <Row label='Shares at Exit' value={exitRequest.snapshot_shares ?? '—'} />
            <Row label='Dividend Balance' value={
              exitRequest.snapshot_dividend_balance
                ? formatCurrency(exitRequest.snapshot_dividend_balance)
                : undefined
            } />
            <Row label='Settlement Amount' value={
              exitRequest.settlement_amount
                ? formatCurrency(exitRequest.settlement_amount)
                : undefined
            } />
          </Section>

          <Section title='Timeline'>
            <Row label='Submitted' value={formatDateTime(exitRequest.created_at)} />
            <Row label='Last Updated' value={formatDateTime(exitRequest.updated_at)} />
            <Row label='Reviewed By' value={exitRequest.reviewed_by} />
          </Section>
        </div>
      </SheetContent>
    </Sheet>
  )
}
