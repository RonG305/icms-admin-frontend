'use client'

import { useState } from 'react'
import { TriangleAlert } from 'lucide-react'
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
import { Alert, AlertDescription } from '@/components/ui/alert'
import { showToast } from '@/components/common/ShowToast'
import { settleExitRequest } from '@/actions/exit-requests'
import { ExitRequest } from '@/types/member'
import { formatCurrency } from '@/lib/format'

const schema = z.object({
  notes: z.string().optional(),
})

type FormFields = z.infer<typeof schema>

interface Props {
  exitRequest: ExitRequest
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function SettleExitRequestDialog({ exitRequest, open, onOpenChange, onSuccess }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: { notes: '' },
  })

  const onSubmit = async (values: FormFields) => {
    setIsSubmitting(true)
    try {
      const result = await settleExitRequest(exitRequest.id, {
        notes: values.notes || undefined,
      })
      if ('error' in result) {
        showToast({ title: 'Error', message: result.error, type: 'error' })
      } else {
        showToast({ title: 'Settled', message: 'Exit request settled successfully', type: 'success' })
        form.reset()
        onSuccess()
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const memberName = exitRequest.member
    ? [exitRequest.member.profile?.first_name, exitRequest.member.profile?.last_name]
        .filter(Boolean)
        .join(' ')
    : exitRequest.member_id

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Settle Exit Request</AlertDialogTitle>
          <AlertDialogDescription>
            Settle the exit request for <strong>{memberName}</strong>.
            {exitRequest.settlement_amount && (
              <span className='block mt-1'>
                Settlement amount: <strong>{formatCurrency(exitRequest.settlement_amount)}</strong>
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Alert variant='warning'>
          <TriangleAlert />
          <AlertDescription>
            This action cannot be undone. The member will be fully exited from the organization.
          </AlertDescription>
        </Alert>

        <Form {...form}>
          <form id='settle-exit-form' onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-4'>
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
                    <Textarea placeholder='Add settlement notes...' rows={3} {...field} />
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
            Confirm Settlement
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
