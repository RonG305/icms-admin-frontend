"use client"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { showToast } from "@/components/common/ShowToast"
import { activateUser, deactivateUser } from "@/actions/auth"
import { AuthUser } from "@/types/auth"

interface Props {
  user: AuthUser
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function ActivateDeactivateUserDialog({ user, open, onOpenChange, onSuccess }: Props) {
  const [isPending, setIsPending] = useState(false)
  const isActive = user.status === "active"
  const action = isActive ? "Deactivate" : "Activate"

  const handleToggle = async () => {
    setIsPending(true)
    try {
      const result = isActive ? await deactivateUser(user.id) : await activateUser(user.id)
      if ("error" in result) {
        showToast({ title: "Error", message: result.error, type: "error" })
      } else {
        showToast({
          title: action,
          message: `User ${isActive ? "deactivated" : "activated"} successfully`,
          type: "success",
        })
        onSuccess()
      }
    } finally {
      setIsPending(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{action} user?</AlertDialogTitle>
          <AlertDialogDescription>
            {isActive
              ? `This will deactivate ${user.first_name} ${user.last_name}'s account. They will no longer be able to sign in.`
              : `This will reactivate ${user.first_name} ${user.last_name}'s account and restore their access.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant={isActive ? "destructive" : "default"}
            onClick={handleToggle}
            disabled={isPending}
          >
            {action}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
