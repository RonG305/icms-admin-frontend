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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { submitExitRequest } from '@/actions/exit-requests'

const schema = z.object({
  member_id: z.string().min(1, 'Member ID is required'),
  reason: z.enum(['voluntary', 'death', 'expulsion', 'incapacitation', 'other']),
  reason_details: z.string().optional(),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export const CreateExitRequestDialog = ({ open, onOpenChange, onSuccess }: Props) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      member_id: '',
      reason_details: '',
      notes: '',
    },
  })

  const onSubmit = async (values: FormValues) => {
    setLoading(true)
    setError(null)
    const result = await submitExitRequest(values)
    setLoading(false)
    if (result?.error) {
      setError(result.error)
    } else {
      form.reset()
      onSuccess()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>Submit Exit Request</DialogTitle>
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
              name='reason'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select reason' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='voluntary'>Voluntary</SelectItem>
                      <SelectItem value='death'>Death</SelectItem>
                      <SelectItem value='expulsion'>Expulsion</SelectItem>
                      <SelectItem value='incapacitation'>Incapacitation</SelectItem>
                      <SelectItem value='other'>Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='reason_details'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason Details <span className='text-muted-foreground text-xs'>(optional)</span></FormLabel>
                  <FormControl>
                    <Textarea placeholder='Additional details about the reason...' rows={2} {...field} />
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
                  <FormLabel>Notes <span className='text-muted-foreground text-xs'>(optional)</span></FormLabel>
                  <FormControl>
                    <Textarea placeholder='Internal notes...' rows={2} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && <p className='text-sm text-destructive'>{error}</p>}

            <div className='flex justify-end gap-2 pt-2'>
              <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type='submit' disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Request'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
