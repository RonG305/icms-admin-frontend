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
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { showToast } from '@/components/common/ShowToast'
import { updateMemberStatus } from '@/actions/members'
import { Member } from '@/types/member'

const schema = z.object({
  status: z.enum(['active', 'inactive', 'suspended']),
})

type FormFields = z.infer<typeof schema>

interface Props {
  member: Member
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

const statusVariant = (s: string) => {
  if (s === 'active') return 'success'
  if (s === 'suspended') return 'destructive'
  return 'warning'
}

export function UpdateMemberStatusDialog({ member, open, onOpenChange, onSuccess }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: (member.status as FormFields['status']) ?? 'active',
    },
  })

  const onSubmit = async (values: FormFields) => {
    setIsSubmitting(true)
    try {
      const result = await updateMemberStatus(member.id, values.status)
      if ('error' in result) {
        showToast({ title: 'Error', message: result.error, type: 'error' })
      } else {
        showToast({ title: 'Updated', message: 'Member status updated', type: 'success' })
        onSuccess()
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const memberName = [member.profile?.first_name, member.profile?.last_name]
    .filter(Boolean)
    .join(' ') || member.member_number

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-sm'>
        <DialogHeader>
          <DialogTitle>Update Member Status</DialogTitle>
        </DialogHeader>

        <div className='flex items-center gap-2 text-sm text-muted-foreground'>
          <span>{memberName}</span>
          <Badge variant={statusVariant(member.status)} className='capitalize'>
            {member.status}
          </Badge>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-4'>
            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select status' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='active'>Active</SelectItem>
                      <SelectItem value='inactive'>Inactive</SelectItem>
                      <SelectItem value='suspended'>Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex justify-end gap-2 pt-2'>
              <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? <Spinner /> : 'Update Status'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
