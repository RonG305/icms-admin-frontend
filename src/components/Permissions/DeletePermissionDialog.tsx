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
import { deletePermission } from "@/actions/permissions"
import { Permission } from "@/types/auth"

interface Props {
  permission: Permission
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function DeletePermissionDialog({ permission, open, onOpenChange, onSuccess }: Props) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const result = await deletePermission(permission.id)
      if ("error" in result) {
        showToast({ title: "Error", message: result.error, type: "error" })
      } else {
        showToast({ title: "Deleted", message: "Permission removed successfully", type: "success" })
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
          <AlertDialogTitle>Delete permission?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete <strong>{permission.name}</strong>.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction variant={"destructive"} onClick={handleDelete} disabled={isDeleting}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
