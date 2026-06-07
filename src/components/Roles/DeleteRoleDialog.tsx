"use client"

import { useState } from "react"
import { TriangleAlert } from "lucide-react"
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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { showToast } from "@/components/common/ShowToast"
import { deleteRole } from "@/actions/roles"
import { Role } from "@/types/auth"

interface Props {
  role: Role
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function DeleteRoleDialog({ role, open, onOpenChange, onSuccess }: Props) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const result = await deleteRole(role.id)
      if ("error" in result) {
        showToast({ title: "Error", message: result.error, type: "error" })
      } else {
        showToast({ title: "Deleted", message: "Role removed successfully", type: "success" })
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
          <AlertDialogTitle>Delete role?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the role <strong>{role.name}</strong>.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Alert variant="warning">
          <TriangleAlert />
          <AlertDescription>
            This action cannot be undone. All permissions associated with this role will also be revoked.
          </AlertDescription>
        </Alert>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
