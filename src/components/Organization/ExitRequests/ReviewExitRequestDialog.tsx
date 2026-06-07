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
import { showToast } from '@/components/common/ShowToast'
import { reviewExitRequest } from '@/actions/exit-requests'
import { ExitRequest } from '@/types/member'

const schema = z.object({
  decision: z.enum(['under_review', 'approved', 'rejected']),
  notes: z.string().optional(),
})

type FormFields = z.infer<typeof schema>

interface Props {
  exitRequest: ExitRequest
  reviewedBy: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function ReviewExitRequestDialog({
  exitRequest,
  reviewedBy,
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: { decision: 'under_review', notes: '' },
  })

  const onSubmit = async (values: FormFields) => {
    setIsSubmitting(true)
    try {
      const result = await reviewExitRequest(exitRequest.id, {
        decision: values.decision,
        reviewed_by: reviewedBy,
        notes: values.notes || undefined,
      })
      if ('error' in result) {
        showToast({ title: 'Error', message: result.error, type: 'error' })
      } else {
        showToast({ title: 'Reviewed', message: 'Exit request reviewed successfully', type: 'success' })
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
          <AlertDialogTitle>Review Exit Request</AlertDialogTitle>
          <AlertDialogDescription>
            Review the exit request from <strong>{memberName}</strong>.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form id='review-exit-form' onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-4'>
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
                      <SelectItem value='under_review'>Move to Under Review</SelectItem>
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
                    <Textarea
                      placeholder='Add review notes...'
                      rows={3}
                      {...field}
                    />
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
            form='review-exit-form'
            type='submit'
            disabled={isSubmitting}
            onClick={(e) => {
              e.preventDefault()
              form.handleSubmit(onSubmit)()
            }}
          >
            Submit Review
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
