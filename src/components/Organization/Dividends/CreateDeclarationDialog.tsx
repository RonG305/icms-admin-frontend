'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { showToast } from '@/components/common/ShowToast'
import { createDividendDeclaration } from '@/actions/dividends'

const schema = z.object({
  financial_year: z.string().min(1, 'Financial year is required'),
  total_pool_amount: z.string().min(1, 'Total pool amount is required'),
  payment_deadline: z.string().optional(),
  notes: z.string().optional(),
})

type FormFields = z.infer<typeof schema>

interface Props {
  organizationId: string
  declaredBy: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function CreateDeclarationDialog({
  organizationId,
  declaredBy,
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      financial_year: '',
      total_pool_amount: '',
      payment_deadline: '',
      notes: '',
    },
  })

  const onSubmit = async (values: FormFields) => {
    setIsSubmitting(true)
    try {
      const result = await createDividendDeclaration({
        financial_year: values.financial_year,
        total_pool_amount: values.total_pool_amount,
        payment_deadline: values.payment_deadline || undefined,
        notes: values.notes || undefined,
        organization_id: organizationId,
        declared_by: declaredBy || undefined,
      })
      if ('error' in result) {
        showToast({ title: 'Error', message: result.error, type: 'error' })
      } else {
        showToast({ title: 'Created', message: 'Dividend declaration created', type: 'success' })
        form.reset()
        onSuccess()
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>Declare Dividend</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-4'>
            <FormField
              control={form.control}
              name='financial_year'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Financial Year</FormLabel>
                  <FormControl>
                    <Input placeholder='e.g. 2025' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='total_pool_amount'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Pool Amount (KES)</FormLabel>
                  <FormControl>
                    <Input type='number' step='0.01' placeholder='0.00' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='payment_deadline'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Payment Deadline{' '}
                    <span className='text-muted-foreground text-xs'>(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input type='date' {...field} />
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
                  <FormLabel>
                    Notes{' '}
                    <span className='text-muted-foreground text-xs'>(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea placeholder='Add notes...' rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex justify-end gap-2 pt-2'>
              <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? <Spinner /> : 'Declare Dividend'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
