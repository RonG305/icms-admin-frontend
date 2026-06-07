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
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { showToast } from '@/components/common/ShowToast'
import { distributeDividend } from '@/actions/dividends'
import { DividendDeclaration } from '@/types/dividends'
import { formatCurrency } from '@/lib/format'

const schema = z.object({
  per_share_amount_override: z.string().optional(),
})

type FormFields = z.infer<typeof schema>

interface Props {
  declaration: DividendDeclaration
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function DistributeDeclarationDialog({ declaration, open, onOpenChange, onSuccess }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: { per_share_amount_override: '' },
  })

  const onSubmit = async (values: FormFields) => {
    setIsSubmitting(true)
    try {
      const result = await distributeDividend(declaration.id, {
        per_share_amount_override: values.per_share_amount_override || undefined,
      })
      if ('error' in result) {
        showToast({ title: 'Error', message: result.error, type: 'error' })
      } else {
        showToast({ title: 'Distributed', message: 'Dividend distributed successfully', type: 'success' })
        form.reset()
        onSuccess()
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Distribute Dividend — {declaration.financial_year}</AlertDialogTitle>
          <AlertDialogDescription>
            Total pool: <strong>{formatCurrency(declaration.total_pool_amount)}</strong>.
            {declaration.per_share_amount && (
              <span> Calculated per share: <strong>{formatCurrency(declaration.per_share_amount)}</strong>.</span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Alert variant='warning'>
          <TriangleAlert />
          <AlertDescription>
            This will distribute dividends to all eligible members. This action cannot be undone.
          </AlertDescription>
        </Alert>

        <Form {...form}>
          <form id='distribute-form' onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-4'>
            <FormField
              control={form.control}
              name='per_share_amount_override'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Per Share Amount Override{' '}
                    <span className='text-muted-foreground text-xs'>(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input type='number' step='0.01' placeholder='Leave blank to use calculated amount' {...field} />
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
            Confirm Distribution
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
