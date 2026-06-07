'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { showToast } from '@/components/common/ShowToast'
import { processShareDecision } from '@/actions/shares'
import { ShareTransaction } from '@/types/shares'
import { formatDate } from '@/lib/format'

const schema = z.object({
  decision: z.enum(['approved', 'rejected']),
  notes: z.string().optional(),
})

type FormFields = z.infer<typeof schema>

interface Props {
  transaction: ShareTransaction
  approvedBy: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

const typeVariant = (t: string) => {
  const map: Record<string, 'success' | 'info' | 'secondary' | 'warning' | 'destructive'> = {
    coop_purchase: 'success',
    member_purchase: 'info',
    transfer: 'secondary',
    coop_sale: 'warning',
    member_sale: 'destructive',
  }
  return map[t] ?? 'secondary'
}

export function ShareDecisionDialog({
  transaction,
  approvedBy,
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: { decision: 'approved', notes: '' },
  })

  const onSubmit = async (values: FormFields) => {
    setIsSubmitting(true)
    try {
      const result = await processShareDecision(transaction.id, {
        decision: values.decision,
        approved_by: approvedBy,
        notes: values.notes || undefined,
      })
      if ('error' in result) {
        showToast({ title: 'Error', message: result.error, type: 'error' })
      } else {
        showToast({
          title: values.decision === 'approved' ? 'Approved' : 'Rejected',
          message: `Transaction ${values.decision}`,
          type: 'success',
        })
        form.reset()
        onSuccess()
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const memberName = transaction.member
    ? [transaction.member.profile?.first_name, transaction.member.profile?.last_name]
        .filter(Boolean)
        .join(' ')
    : transaction.member_id

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Process Share Transaction</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className='flex flex-col gap-2'>
              <span>Review and process the share transaction for <strong>{memberName}</strong>.</span>
              <div className='flex items-center gap-2 flex-wrap'>
                <Badge variant={typeVariant(transaction.transaction_type)} className='capitalize text-xs'>
                  {transaction.transaction_type.replace(/_/g, ' ')}
                </Badge>
                <span className='text-sm'>{transaction.number_of_shares} shares</span>
                <span className='text-xs text-muted-foreground'>{formatDate(transaction.created_at)}</span>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form id='share-decision-form' onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-4'>
            <FormField
              control={form.control}
              name='decision'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Decision</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select decision' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='approved'>Approve</SelectItem>
                      <SelectItem value='rejected'>Reject</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='notes'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Notes{' '}
                    <span className='text-muted-foreground text-xs'>(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea placeholder='Add decision notes...' rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isSubmitting}
            onClick={(e) => {
              e.preventDefault()
              form.handleSubmit(onSubmit)()
            }}
          >
            Submit
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
