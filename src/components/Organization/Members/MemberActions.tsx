'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/react'
import { ReviewMembershipDialog } from './ReviewMembershipDialog'
import { UpdateMemberDialog } from './UpdateMemberDialog'
import { UpdateMemberStatusDialog } from './UpdateMemberStatusDialog'
import { Member } from '@/types/member'

type ReviewAction = 'approve' | 'reject' | 'cancel'

interface Props {
  member: Member
}

export function MemberActions({ member }: Props) {
  const router = useRouter()
  const [reviewAction, setReviewAction] = useState<ReviewAction | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [statusOpen, setStatusOpen] = useState(false)

  const onSuccess = () => {
    setReviewAction(null)
    setEditOpen(false)
    setStatusOpen(false)
    router.refresh()
  }

  const isPending = member.membership_status === 'pending_approval'

  return (
    <>
      <div className='flex items-center gap-2 flex-wrap'>
        {isPending && (
          <>
            <Button size='sm' onClick={() => setReviewAction('approve')}>
              <Icon icon='solar:check-circle-linear' fontSize={16} />
              Approve
            </Button>
            <Button size='sm' variant='destructive' onClick={() => setReviewAction('reject')}>
              <Icon icon='solar:close-circle-linear' fontSize={16} />
              Reject
            </Button>
          </>
        )}
        <Button size='sm' variant='outline' onClick={() => setEditOpen(true)}>
          <Icon icon='solar:pen-2-linear' fontSize={16} />
          Edit
        </Button>
        <Button size='sm' variant='outline' onClick={() => setStatusOpen(true)}>
          <Icon icon='solar:shield-check-linear' fontSize={16} />
          Status
        </Button>
        <Button size='sm' variant='outline' className='text-destructive' onClick={() => setReviewAction('cancel')}>
          <Icon icon='solar:forbidden-circle-linear' fontSize={16} />
          Cancel
        </Button>
      </div>

      {reviewAction && (
        <ReviewMembershipDialog
          member={member}
          action={reviewAction}
          open={!!reviewAction}
          onOpenChange={(o) => !o && setReviewAction(null)}
          onSuccess={onSuccess}
        />
      )}

      <UpdateMemberDialog
        member={member}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSuccess={onSuccess}
      />

      <UpdateMemberStatusDialog
        member={member}
        open={statusOpen}
        onOpenChange={setStatusOpen}
        onSuccess={onSuccess}
      />
    </>
  )
}
