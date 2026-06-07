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
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { showToast } from '@/components/common/ShowToast'
import { createMember } from '@/actions/members'

const schema = z.object({
  profile_id: z.string().min(1, 'Profile ID is required'),
  category: z.string().optional(),
  id_number: z.string().optional(),
  kra_pin: z.string().optional(),
})

type FormFields = z.infer<typeof schema>

interface Props {
  organizationId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function CreateMemberDialog({ organizationId, open, onOpenChange, onSuccess }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      profile_id: '',
      category: '',
      id_number: '',
      kra_pin: '',
    },
  })

  const onSubmit = async (values: FormFields) => {
    setIsSubmitting(true)
    try {
      const result = await createMember({
        organization_id: organizationId,
        profile_id: values.profile_id,
        category: values.category || undefined,
        id_number: values.id_number || undefined,
        kra_pin: values.kra_pin || undefined,
      })
      if ('error' in result) {
        showToast({ title: 'Error', message: result.error, type: 'error' })
      } else {
        showToast({ title: 'Created', message: 'Member added successfully', type: 'success' })
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
          <DialogTitle>Add Member</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-4'>
            <FormField
              control={form.control}
              name='profile_id'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile ID</FormLabel>
                  <FormControl>
                    <Input placeholder='User profile ID' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='category'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Category{' '}
                    <span className='text-muted-foreground text-xs'>(optional)</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select category' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='member_farmer'>Member Farmer</SelectItem>
                      <SelectItem value='associate'>Associate</SelectItem>
                      <SelectItem value='honorary'>Honorary</SelectItem>
                      <SelectItem value='institutional'>Institutional</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='id_number'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    ID Number{' '}
                    <span className='text-muted-foreground text-xs'>(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder='National ID number' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='kra_pin'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    KRA PIN{' '}
                    <span className='text-muted-foreground text-xs'>(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder='A001234567B' {...field} />
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
                {isSubmitting ? <Spinner /> : 'Add Member'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
