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
import { transferShares } from '@/actions/shares'

const schema = z.object({
  from_member_id: z.string().min(1, 'From member ID is required'),
  to_member_id: z.string().min(1, 'To member ID is required'),
  number_of_shares: z.string().min(1, 'Required').refine((v) => Number.isInteger(Number(v)) && Number(v) > 0, 'Must be a positive integer'),
  payment_reference: z.string().optional(),
  notes: z.string().optional(),
})

type FormFields = z.infer<typeof schema>

interface Props {
  defaultFromMemberId?: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function TransferSharesDialog({ defaultFromMemberId, open, onOpenChange, onSuccess }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      from_member_id: defaultFromMemberId ?? '',
      to_member_id: '',
      number_of_shares: '1',
      payment_reference: '',
      notes: '',
    },
  })

  const onSubmit = async (values: FormFields) => {
    setIsSubmitting(true)
    try {
      const result = await transferShares({
        from_member_id: values.from_member_id,
        to_member_id: values.to_member_id,
        number_of_shares: parseInt(values.number_of_shares, 10),
        payment_reference: values.payment_reference || undefined,
        notes: values.notes || undefined,
      })
      if ('error' in result) {
        showToast({ title: 'Error', message: result.error, type: 'error' })
      } else {
        showToast({ title: 'Success', message: 'Share transfer initiated', type: 'success' })
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
          <DialogTitle>Transfer Shares</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-4'>
            <FormField
              control={form.control}
              name='from_member_id'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>From Member ID</FormLabel>
                  <FormControl>
                    <Input placeholder='From member ID' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='to_member_id'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To Member ID</FormLabel>
                  <FormControl>
                    <Input placeholder='To member ID' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='number_of_shares'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Shares</FormLabel>
                  <FormControl>
                    <Input type='number' min={1} {...field} />
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
                  <FormLabel>
                    Payment Reference{' '}
                    <span className='text-muted-foreground text-xs'>(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder='Transaction ref...' {...field} />
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
                {isSubmitting ? <Spinner /> : 'Transfer Shares'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
