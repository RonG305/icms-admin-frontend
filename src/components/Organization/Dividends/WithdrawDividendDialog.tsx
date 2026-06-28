'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { withdrawDividend } from '@/actions/dividends'

const schema = z.object({
  amount: z.string().min(1, 'Amount is required'),
  payment_reference: z.string().optional(),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface Props {
  memberId: string
  balance: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export const WithdrawDividendDialog = ({ memberId, balance, open, onOpenChange, onSuccess }: Props) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { amount: '', payment_reference: '', notes: '' },
  })

  const onSubmit = async (values: FormValues) => {
    setLoading(true)
    setError(null)
    const result = await withdrawDividend(memberId, {
      amount: values.amount,
      payment_reference: values.payment_reference,
      notes: values.notes,
    })
    setLoading(false)
    if (result?.error) {
      setError(result.error)
    } else {
      form.reset()
      onSuccess()
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Withdraw Dividend</AlertDialogTitle>
          <AlertDialogDescription>
            Available balance: <strong>{balance}</strong>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form id='withdraw-form' onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='amount'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type='number' step='0.01' placeholder='0.00' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='payment_reference'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Reference</FormLabel>
                  <FormControl>
                    <Input placeholder='e.g. M-Pesa transaction ID' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='notes'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder='Optional notes' rows={2} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && <p className='text-sm text-destructive'>{error}</p>}
          </form>
        </Form>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction form='withdraw-form' type='submit' disabled={loading}>
            {loading ? 'Processing...' : 'Withdraw'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
