"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { showToast } from "@/components/common/ShowToast"
import { updateRole } from "@/actions/roles"
import { Role } from "@/types/auth"

const schema = z.object({
  name: z.string().min(1, "Role name is required").max(50),
  description: z.string().min(1, "Description is required").max(50),
  status: z.enum(["active", "inactive"]),
  permissions: z.string(),
})

type FormFields = z.infer<typeof schema>

interface Props {
  role: Role
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function UpdateRoleDialog({ role, open, onOpenChange, onSuccess }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: role.name,
      description: role.description,
      status: role.status,
      permissions: role.permissions?.join(", ") ?? "",
    },
  })

  const onSubmit = async (values: FormFields) => {
    setIsSubmitting(true)
    const permissions = values.permissions.split(",").map((p) => p.trim()).filter(Boolean)
    try {
      const result = await updateRole(role.id, { ...values, permissions })
      if ("error" in result) {
        showToast({ title: "Error", message: result.error, type: "error" })
      } else {
        showToast({ title: "Updated", message: "Role updated successfully", type: "success" })
        onSuccess()
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Role</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Role Name</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="status" render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="permissions" render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Permissions{" "}
                  <span className="text-muted-foreground text-xs font-normal">(comma-separated)</span>
                </FormLabel>
                <FormControl>
                  <Textarea rows={3} className="resize-none" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Spinner /> : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
