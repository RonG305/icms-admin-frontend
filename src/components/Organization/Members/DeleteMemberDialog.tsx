'use client'

import { useState } from 'react'
import { TriangleAlert } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { showToast } from '@/components/common/ShowToast'
import { deleteMember } from '@/actions/members'
import { Member } from '@/types/member'

interface Props {
  member: Member
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function DeleteMemberDialog({ member, open, onOpenChange, onSuccess }: Props) {
  const [isDeleting, setIsDeleting] = useState(false)

  const memberName = [member.profile?.first_name, member.profile?.last_name]
    .filter(Boolean)
    .join(' ') || member.member_number

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const result = await deleteMember(member.id)
      if ('error' in result) {
        showToast({ title: 'Error', message: result.error, type: 'error' })
      } else {
        showToast({ title: 'Deleted', message: 'Member removed successfully', type: 'success' })
        onSuccess()
      }
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete member?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete <strong>{memberName}</strong> ({member.member_number}).
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Alert variant='warning'>
          <TriangleAlert />
          <AlertDescription>
            This action cannot be undone. The member&apos;s share and dividend accounts will also be removed.
          </AlertDescription>
        </Alert>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction variant='destructive' onClick={handleDelete} disabled={isDeleting}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
