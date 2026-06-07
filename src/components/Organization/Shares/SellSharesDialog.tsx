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
import { sellShares } from '@/actions/shares'

const schema = z.object({
  member_id: z.string().min(1, 'Member ID is required'),
  number_of_shares: z.string().min(1, 'Required').refine((v) => Number.isInteger(Number(v)) && Number(v) > 0, 'Must be a positive integer'),
  notes: z.string().optional(),
})

type FormFields = z.infer<typeof schema>

interface Props {
  defaultMemberId?: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function SellSharesDialog({ defaultMemberId, open, onOpenChange, onSuccess }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      member_id: defaultMemberId ?? '',
      number_of_shares: '1',
      notes: '',
    },
  })

  const onSubmit = async (values: FormFields) => {
    setIsSubmitting(true)
    try {
      const result = await sellShares({
        member_id: values.member_id,
        number_of_shares: parseInt(values.number_of_shares, 10),
        notes: values.notes || undefined,
      })
      if ('error' in result) {
        showToast({ title: 'Error', message: result.error, type: 'error' })
      } else {
        showToast({ title: 'Success', message: 'Share sale initiated', type: 'success' })
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
          <DialogTitle>Sell Shares</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-4'>
            <FormField
              control={form.control}
              name='member_id'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Member ID</FormLabel>
                  <FormControl>
                    <Input placeholder='Member ID' {...field} />
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
                {isSubmitting ? <Spinner /> : 'Sell Shares'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
