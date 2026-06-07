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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Member } from '@/types/member'
import { formatDate, formatCurrency } from '@/lib/format'

interface Props {
  member: Member
  open: boolean
  onOpenChange: (open: boolean) => void
}

function getInitials(first?: string, last?: string) {
  return [first?.[0], last?.[0]].filter(Boolean).join('').toUpperCase() || '?'
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
  if (s === 'active') return 'success' as const
  if (s === 'suspended') return 'destructive' as const
  return 'warning' as const
}

export function ViewMemberDrawer({ member, open, onOpenChange }: Props) {
  const p = member.profile
  const name = [p?.first_name, p?.last_name].filter(Boolean).join(' ') || 'Unknown'

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side='right' className='w-full sm:max-w-2xl overflow-y-auto thin-scrollbar'>
        <SheetHeader className='pb-4'>
          <div className='flex items-center gap-3'>
            <Avatar className='size-12 shrink-0'>
              <AvatarImage src={p?.avatar_url || undefined} />
              <AvatarFallback className='bg-primary/10 text-primary text-base font-semibold'>
                {getInitials(p?.first_name, p?.last_name)}
              </AvatarFallback>
            </Avatar>
            <div className='min-w-0'>
              <SheetTitle className='truncate'>{name}</SheetTitle>
              <SheetDescription className='truncate font-mono text-xs'>
                {member.member_number}
              </SheetDescription>
            </div>
          </div>
          <div className='flex items-center gap-2 mt-2 flex-wrap'>
            <Badge variant={statusVariant(member.status)} className='capitalize'>
              {member.status}
            </Badge>
            <Badge variant='outline' className='capitalize'>
              {member.category?.replace(/_/g, ' ')}
            </Badge>
          </div>
        </SheetHeader>

        <Separator />

        <div className='flex flex-col gap-4 p-4'>
          <Section title='Member Info'>
            <Row label='Member Number' value={<span className='font-mono text-xs'>{member.member_number}</span>} />
            <Row label='Category' value={<span className='capitalize'>{member.category?.replace(/_/g, ' ')}</span>} />
            <Row label='Status' value={<Badge variant={statusVariant(member.status)} className='capitalize'>{member.status}</Badge>} />
            <Row label='ID Number' value={member.id_number} />
            <Row label='KRA PIN' value={member.kra_pin} />
            <Row label='Joined Date' value={formatDate(member.joined_date)} />
          </Section>

          <Section title='Share Account'>
            <Row label='Account Number' value={<span className='font-mono text-xs'>{member.share_account?.account_number}</span>} />
            <Row label='Total Shares' value={member.share_account?.total_shares ?? 0} />
            <Row label='Total Value' value={formatCurrency(member.share_account?.total_value ?? '0')} />
          </Section>

          <Section title='Dividend Account'>
            <Row label='Account Number' value={<span className='font-mono text-xs'>{member.dividend_account?.account_number}</span>} />
            <Row label='Balance' value={formatCurrency(member.dividend_account?.balance ?? '0')} />
          </Section>

          <Section title='Profile'>
            <Row label='Full Name' value={name} />
            <Row label='Email' value={p?.user?.email} />
            <Row label='Phone' value={p?.phone_number} />
            <Row label='Gender' value={p?.gender ? <span className='capitalize'>{p.gender}</span> : undefined} />
            <Row label='City' value={p?.city} />
            <Row label='Country' value={p?.country} />
          </Section>
        </div>
      </SheetContent>
    </Sheet>
  )
}
