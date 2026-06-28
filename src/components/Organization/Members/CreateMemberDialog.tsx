'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Check, ChevronsUpDown } from 'lucide-react'
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'
import { showToast } from '@/components/common/ShowToast'
import { createMember } from '@/actions/members'
import { searchUsers, type AuthUser } from '@/actions/users'

const CATEGORIES = [
  { value: 'member_farmer', label: 'Member Farmer' },
  { value: 'supplier_farmer', label: 'Supplier Farmer' },
  { value: 'milk_agent', label: 'Milk Agent' },
  { value: 'driver', label: 'Driver' },
  { value: 'employee_dairy', label: 'Employee (Dairy)' },
  { value: 'employee_hotel', label: 'Employee (Hotel)' },
  { value: 'management', label: 'Management' },
  { value: 'associate', label: 'Associate' },
  { value: 'honorary', label: 'Honorary' },
]

const schema = z.object({
  user_id: z.string().min(1, 'User is required'),
  category: z.string().min(1, 'Category is required'),
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
  const [userPopoverOpen, setUserPopoverOpen] = useState(false)
  const [users, setUsers] = useState<AuthUser[]>([])
  const [selectedUser, setSelectedUser] = useState<AuthUser | null>(null)
  const [userSearch, setUserSearch] = useState('')
  const form = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: { user_id: '', category: 'member_farmer', id_number: '', kra_pin: '' },
  })

  useEffect(() => {
    if (!open) return
    searchUsers('').then(setUsers)
  }, [open])

  useEffect(() => {
    const timer = setTimeout(() => {
      searchUsers(userSearch).then(setUsers)
    }, 300)
    return () => clearTimeout(timer)
  }, [userSearch])

  const onSubmit = async (values: FormFields) => {
    setIsSubmitting(true)
    try {
      const result = await createMember({
        organization_id: organizationId,
        user_id: values.user_id,
        category: values.category,
        id_number: values.id_number || undefined,
        kra_pin: values.kra_pin || undefined,
      })
      if (result && 'error' in result) {
        showToast({ title: 'Error', message: result.error, type: 'error' })
      } else {
        showToast({ title: 'Success', message: 'Member created successfully', type: 'success' })
        form.reset()
        setSelectedUser(null)
        setUserSearch('')
        onSuccess()
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = (o: boolean) => {
    if (!o) {
      form.reset()
      setSelectedUser(null)
      setUserSearch('')
    }
    onOpenChange(o)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='max-w-xl'>
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-4'>

            {/* User selector */}
            <FormField
              control={form.control}
              name='user_id'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>User</FormLabel>
                  <Popover open={userPopoverOpen} onOpenChange={setUserPopoverOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        type='button'
                        variant='outline'
                        role='combobox'
                        className={cn('w-full justify-between font-normal', !field.value && 'text-muted-foreground')}
                      >
                        <span className='truncate text-left flex-1'>
                          {selectedUser
                            ? [selectedUser.first_name, selectedUser.last_name].filter(Boolean).join(' ') || selectedUser.email
                            : 'Select user...'}
                        </span>
                        <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent 
                      className='w-full p-0'
                      align='start'
                      onOpenAutoFocus={e => e.preventDefault()}
                    >
                      <div className='flex flex-col'>
                        <div className='flex items-center border-b px-3'>
                          <input
                            className='flex h-10 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground'
                            placeholder='Search by name or email...'
                            value={userSearch}
                            onChange={e => setUserSearch(e.target.value)}
                          />
                        </div>
                        <div className='max-h-60 overflow-y-auto py-1'>
                          {users.length === 0 ? (
                            <div className='py-6 text-center text-sm text-muted-foreground'>
                              No users found.
                            </div>
                          ) : (
                            users.map(u => {
                              const label = [u.first_name, u.last_name].filter(Boolean).join(' ') || u.email
                              const isSelected = field.value === u.id
                              return (
                                <button
                                  type='button'
                                  key={u.id}
                                  className={cn(
                                    'w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-accent text-sm cursor-pointer',
                                    isSelected && 'bg-accent',
                                  )}
                                  onMouseDown={e => {
                                    e.preventDefault()
                                    field.onChange(u.id)
                                    setSelectedUser(u)
                                    setUserSearch('')
                                    setUserPopoverOpen(false)
                                  }}
                                >
                                  <Check className={cn('h-4 w-4 shrink-0', isSelected ? 'opacity-100' : 'opacity-0')} />
                                  <div className='flex flex-col min-w-0'>
                                    <span className='font-medium truncate'>{label}</span>
                                    <span className='text-xs text-muted-foreground truncate'>{u.email}</span>
                                  </div>
                                </button>
                              )
                            })
                          )}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category */}
            <FormField
              control={form.control}
              name='category'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select category' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ID Number */}
            <FormField
              control={form.control}
              name='id_number'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID Number <span className='text-muted-foreground text-xs font-normal'>(optional)</span></FormLabel>
                  <FormControl>
                    <Input placeholder='National ID or passport number' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* KRA PIN */}
            <FormField
              control={form.control}
              name='kra_pin'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>KRA PIN <span className='text-muted-foreground text-xs font-normal'>(optional)</span></FormLabel>
                  <FormControl>
                    <Input placeholder='A001234567B' className='font-mono' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex justify-end gap-2 pt-2'>
              <Button type='button' variant='outline' onClick={() => handleClose(false)}>
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
