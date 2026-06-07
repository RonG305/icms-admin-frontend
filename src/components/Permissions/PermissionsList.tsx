"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { type ColumnDef } from "@tanstack/react-table"
import { Plus } from "lucide-react"
import { Icon } from "@iconify/react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { DataTable } from "@/components/common/data-table"
import { TablePagination } from "@/components/common/TablePagination"
import { ActionDropdown } from "@/components/common/ActionDropdown"
import { CreatePermissionDialog } from "./CreatePermissionDialog"
import { UpdatePermissionDialog } from "./UpdatePermissionDialog"
import { DeletePermissionDialog } from "./DeletePermissionDialog"
import { PermissionFilters } from "./PermissionFilters"
import { Permission } from "@/types/auth"

const actionVariant: Record<string, "success" | "info" | "warning" | "destructive"> = {
  create: "success",
  read: "info",
  update: "warning",
  delete: "destructive",
}

interface Props {
  data: Permission[]
  total: number
}

const PermissionsList = ({ data, total }: Props) => {
  const router = useRouter()
  const [createOpen, setCreateOpen] = useState(false)
  const [updateTarget, setUpdateTarget] = useState<Permission | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Permission | null>(null)

  const onSuccess = () => {
    setCreateOpen(false)
    setUpdateTarget(null)
    setDeleteTarget(null)
    router.refresh()
  }

  const columns: ColumnDef<Permission>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <span className="text-sm font-mono font-medium">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{row.original.description}</span>
      ),
    },
    {
      accessorKey: "module",
      header: "Module",
      cell: ({ row }) => (
        <Badge variant="outline">{row.original.module}</Badge>
      ),
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => {
        const a = row.original.action
        return (
          <Badge variant={actionVariant[a] ?? "secondary"} className="capitalize">
            {a}
          </Badge>
        )
      },
    },
    {
      accessorKey: "created_at",
      header: "Created",
      cell: ({ row }) =>
        row.original.created_at
          ? new Date(row.original.created_at).toLocaleDateString()
          : "—",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const p = row.original
        return (
          <ActionDropdown>
            <DropdownMenuItem onClick={() => setUpdateTarget(p)}>
              <Icon icon="solar:pen-2-linear" fontSize={16} />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={() => setDeleteTarget(p)}>
              <Icon icon="solar:trash-bin-trash-linear" fontSize={16} />
              <span>Delete</span>
            </DropdownMenuItem>
          </ActionDropdown>
        )
      },
    },
  ]

  const toolbar = (
    <div className="flex items-center gap-2">
      <PermissionFilters />
      <Button size="sm" onClick={() => setCreateOpen(true)}>
        <Plus className="size-4 mr-1" />
        Add Permission
      </Button>
    </div>
  )

  return (
    <>
      <DataTable<Permission>
        columns={columns}
        data={data}
        toolbar={toolbar}
        emptyMessage="No permissions found."
        paginationComponent={<TablePagination total={total} />}
      />

      <CreatePermissionDialog open={createOpen} onOpenChange={setCreateOpen} onSuccess={onSuccess} />

      {updateTarget && (
        <UpdatePermissionDialog
          permission={updateTarget}
          open={!!updateTarget}
          onOpenChange={(open: boolean) => !open && setUpdateTarget(null)}
          onSuccess={onSuccess}
        />
      )}

      {deleteTarget && (
        <DeletePermissionDialog
          permission={deleteTarget}
          open={!!deleteTarget}
          onOpenChange={(open: boolean) => !open && setDeleteTarget(null)}
          onSuccess={onSuccess}
        />
      )}
    </>
  )
}

export default PermissionsList
