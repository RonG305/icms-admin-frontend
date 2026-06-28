'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { type ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
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
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { DataTable } from '@/components/common/data-table'
import { ActionDropdown } from '@/components/common/ActionDropdown'
import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { Icon } from '@iconify/react'
import { TriangleAlert } from 'lucide-react'
import { formatDate } from '@/lib/format'

export interface ReferenceItem {
  id: string
  name: string
  created_at?: string
}

interface Props {
  items: ReferenceItem[]
  label: string
  fieldLabel: string
  onCreate: (name: string) => Promise<{ error?: string } | unknown>
  onUpdate: (id: string, name: string) => Promise<{ error?: string } | unknown>
  onDelete: (id: string) => Promise<{ error?: string } | unknown>
}

const schema = z.object({ name: z.string().min(1, 'Name is required') })
type FormValues = z.infer<typeof schema>

export const ReferenceTable = ({ items, label, fieldLabel, onCreate, onUpdate, onDelete }: Props) => {
  const router = useRouter()
  const [createOpen, setCreateOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<ReferenceItem | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ReferenceItem | null>(null)
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '' },
  })

  const openCreate = () => {
    form.reset({ name: '' })
    setFormError(null)
    setCreateOpen(true)
  }

  const openEdit = (item: ReferenceItem) => {
    form.reset({ name: item.name })
    setFormError(null)
    setEditTarget(item)
  }

  const handleCreate = async (values: FormValues) => {
    setLoading(true)
    setFormError(null)
    const result = await onCreate(values.name) as { error?: string }
    setLoading(false)
    if (result?.error) {
      setFormError(result.error)
    } else {
      setCreateOpen(false)
      form.reset()
      router.refresh()
    }
  }

  const handleUpdate = async (values: FormValues) => {
    if (!editTarget) return
    setLoading(true)
    setFormError(null)
    const result = await onUpdate(editTarget.id, values.name) as { error?: string }
    setLoading(false)
    if (result?.error) {
      setFormError(result.error)
    } else {
      setEditTarget(null)
      form.reset()
      router.refresh()
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setLoading(true)
    const result = await onDelete(deleteTarget.id) as { error?: string }
    setLoading(false)
    if (!result?.error) {
      setDeleteTarget(null)
      router.refresh()
    }
  }

  const columns: ColumnDef<ReferenceItem>[] = [
    {
      accessorKey: 'name',
      header: fieldLabel,
      cell: ({ row }) => <span className='text-sm font-medium'>{row.getValue('name')}</span>,
    },
    {
      accessorKey: 'created_at',
      header: 'Created',
      cell: ({ row }) => (
        <span className='text-sm text-muted-foreground'>{formatDate(row.getValue('created_at'))}</span>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const item = row.original
        return (
          <ActionDropdown>
            <DropdownMenuItem onClick={() => openEdit(item)}>
              <Icon icon='solar:pen-2-linear' fontSize={16} />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant='destructive' onClick={() => setDeleteTarget(item)}>
              <Icon icon='solar:trash-bin-trash-linear' fontSize={16} />
              <span>Delete</span>
            </DropdownMenuItem>
          </ActionDropdown>
        )
      },
    },
  ]

  const toolbar = (
    <Button size='sm' onClick={openCreate}>
      <Icon icon='solar:add-circle-linear' fontSize={16} />
      Add {label}
    </Button>
  )

  return (
    <>
      <DataTable<ReferenceItem>
        columns={columns}
        data={items}
        toolbar={toolbar}
        emptyMessage={`No ${label.toLowerCase()} found.`}
      />

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className='max-w-sm'>
          <DialogHeader>
            <DialogTitle>Add {label}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreate)} id='ref-create-form' className='space-y-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{fieldLabel}</FormLabel>
                    <FormControl>
                      <Input placeholder={`Enter ${fieldLabel.toLowerCase()}`} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {formError && <p className='text-sm text-destructive'>{formError}</p>}
            </form>
          </Form>
          <DialogFooter>
            <Button variant='outline' onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button form='ref-create-form' type='submit' disabled={loading}>
              {loading ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editTarget} onOpenChange={(o) => !o && setEditTarget(null)}>
        <DialogContent className='max-w-sm'>
          <DialogHeader>
            <DialogTitle>Edit {label}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdate)} id='ref-edit-form' className='space-y-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{fieldLabel}</FormLabel>
                    <FormControl>
                      <Input placeholder={`Enter ${fieldLabel.toLowerCase()}`} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {formError && <p className='text-sm text-destructive'>{formError}</p>}
            </form>
          </Form>
          <DialogFooter>
            <Button variant='outline' onClick={() => setEditTarget(null)}>Cancel</Button>
            <Button form='ref-edit-form' type='submit' disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {label}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deleteTarget?.name}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Alert variant='warning'>
            <TriangleAlert />
            <AlertDescription>This action cannot be undone.</AlertDescription>
          </Alert>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant='destructive' onClick={handleDelete} disabled={loading}>
              {loading ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
