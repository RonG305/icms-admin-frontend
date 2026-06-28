'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { ShareConfig } from '@/types/shares'
import { createShareConfig, updateShareConfig } from '@/actions/shares'
import { Icon } from '@iconify/react'
import { formatCurrency } from '@/lib/format'

const schema = z.object({
  par_value: z.string().min(1, 'Par value is required'),
  max_shares_per_member: z.string().optional(),
  min_shares_required: z.string().optional(),
  allow_member_trading: z.boolean(),
  approval_required: z.boolean(),
})

type FormValues = z.infer<typeof schema>

interface Props {
  config: ShareConfig | null
  organizationId: string
}

function Row({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div className='flex items-center justify-between gap-4 py-2 border-b last:border-0'>
      <span className='text-sm text-muted-foreground'>{label}</span>
      <span className='text-sm font-medium'>{value ?? '—'}</span>
    </div>
  )
}

export const ShareConfigCard = ({ config }: Props) => {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      par_value: config?.par_value ?? '',
      max_shares_per_member: config?.max_shares_per_member?.toString() ?? '',
      min_shares_required: config?.min_shares_required?.toString() ?? '',
      allow_member_trading: config?.allow_member_trading ?? false,
      approval_required: config?.approval_required ?? true,
    },
  })

  const onSubmit = async (values: FormValues) => {
    setLoading(true)
    setError(null)
    const payload = {
      par_value: values.par_value,
      max_shares_per_member: values.max_shares_per_member ? parseInt(values.max_shares_per_member) : undefined,
      min_shares_required: values.min_shares_required ? parseInt(values.min_shares_required) : undefined,
      allow_member_trading: values.allow_member_trading,
      approval_required: values.approval_required,
    }

    console.log("Share config payload: ", payload)

    const result = config
      ? await updateShareConfig(payload)
      : await createShareConfig({ ...payload})

    setLoading(false)
    if (result?.error) {
      setError(result.error)
    } else {
      setEditing(false)
      router.refresh()
    }
  }

  if (!editing && config) {
    return (
      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <div>
            <CardTitle className='text-base'>Share Configuration</CardTitle>
            <CardDescription>Settings for share transactions in this organization.</CardDescription>
          </div>
          <Button variant='outline' size='sm' onClick={() => setEditing(true)}>
            <Icon icon='solar:pen-2-linear' fontSize={14} />
            Edit
          </Button>
        </CardHeader>
        <CardContent>
          <Row label='Par Value' value={formatCurrency(config.par_value)} />
          <Row label='Max Shares / Member' value={config.max_shares_per_member ?? 'Unlimited'} />
          <Row label='Min Shares Required' value={config.min_shares_required ?? 'None'} />
          <Row label='Member Trading' value={config.allow_member_trading ? 'Allowed' : 'Not allowed'} />
          <Row label='Approval Required' value={config.approval_required ? 'Yes' : 'No'} />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base'>
          {config ? 'Edit Share Configuration' : 'Configure Shares'}
        </CardTitle>
        {!config && (
          <CardDescription>Set up share parameters before allowing transactions.</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='par_value'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Par Value (KES)</FormLabel>
                    <FormControl>
                      <Input type='number' step='0.01' placeholder='100.00' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='max_shares_per_member'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Shares per Member</FormLabel>
                    <FormControl>
                      <Input type='number' placeholder='Unlimited' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='min_shares_required'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Min Shares Required</FormLabel>
                    <FormControl>
                      <Input type='number' placeholder='0' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='allow_member_trading'
                render={({ field }) => (
                  <FormItem className='flex items-center justify-between rounded-lg border p-3'>
                    <FormLabel className='cursor-pointer'>Allow Member Trading</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='approval_required'
                render={({ field }) => (
                  <FormItem className='flex items-center justify-between rounded-lg border p-3'>
                    <FormLabel className='cursor-pointer'>Require Approval</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {error && <p className='text-sm text-destructive'>{error}</p>}

            <div className='flex gap-2 justify-end'>
              {config && (
                <Button type='button' variant='outline' onClick={() => setEditing(false)}>
                  Cancel
                </Button>
              )}
              <Button type='submit' disabled={loading}>
                {loading ? 'Saving...' : config ? 'Save Changes' : 'Create Config'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
