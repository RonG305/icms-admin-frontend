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
import { activateRole, deactivateRole } from "@/actions/roles"
import { Role } from "@/types/auth"

interface Props {
  role: Role
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function ActivateDeactivateRoleDialog({ role, open, onOpenChange, onSuccess }: Props) {
  const [isPending, setIsPending] = useState(false)
  const isActive = role.status === "active"
  const action = isActive ? "Deactivate" : "Activate"

  const handleToggle = async () => {
    setIsPending(true)
    try {
      const result = isActive ? await deactivateRole(role.id) : await activateRole(role.id)
      if ("error" in result) {
        showToast({ title: "Error", message: result.error, type: "error" })
      } else {
        showToast({
          title: action,
          message: `Role ${isActive ? "deactivated" : "activated"} successfully`,
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
          <AlertDialogTitle>{action} role?</AlertDialogTitle>
          <AlertDialogDescription>
            {isActive
              ? `Deactivating "${role.name}" will prevent it from being assigned to users.`
              : `Activating "${role.name}" will make it available for assignment again.`}
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
