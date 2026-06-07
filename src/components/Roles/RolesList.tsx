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
import { CreateRoleDialog } from "./CreateRoleDialog"
import { UpdateRoleDialog } from "./UpdateRoleDialog"
import { DeleteRoleDialog } from "./DeleteRoleDialog"
import { ActivateDeactivateRoleDialog } from "./ActivateDeactivateRoleDialog"
import { RoleFilters } from "./RoleFilters"
import { Role } from "@/types/auth"

interface Props {
  data: Role[]
  total: number
}

const RolesList = ({ data, total }: Props) => {
  const router = useRouter()
  const [createOpen, setCreateOpen] = useState(false)
  const [updateTarget, setUpdateTarget] = useState<Role | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Role | null>(null)
  const [toggleTarget, setToggleTarget] = useState<Role | null>(null)

  const onSuccess = () => {
    setCreateOpen(false)
    setUpdateTarget(null)
    setDeleteTarget(null)
    setToggleTarget(null)
    router.refresh()
  }

  const columns: ColumnDef<Role>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <span className="text-sm font-medium capitalize">{row.original.name}</span>
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
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.status === "active" ? "success" : "warning"} className="capitalize">
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: "permissions",
      header: "Permissions",
      cell: ({ row }) => {
        const perms = row.original.permissions ?? []
        return (
          <div className="flex flex-wrap gap-1">
            {perms.slice(0, 3).map((p) => (
              <Badge key={p} variant="outline">{p}</Badge>
            ))}
            {perms.length > 3 && (
              <Badge variant="outline">+{perms.length - 3} more</Badge>
            )}
            {perms.length === 0 && <span className="text-xs text-muted-foreground">—</span>}
          </div>
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
        const r = row.original
        return (
          <ActionDropdown>
            <DropdownMenuItem onClick={() => setUpdateTarget(r)}>
              <Icon icon="solar:pen-2-linear" fontSize={16} />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setToggleTarget(r)}>
              <Icon
                icon={r.status === "active" ? "solar:forbidden-circle-linear" : "solar:check-circle-linear"}
                fontSize={16}
              />
              <span>{r.status === "active" ? "Deactivate" : "Activate"}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={() => setDeleteTarget(r)}>
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
      <RoleFilters />
      <Button size="sm" onClick={() => setCreateOpen(true)}>
        <Plus className="size-4 mr-1" />
        Add Role
      </Button>
    </div>
  )

  return (
    <>
      <DataTable<Role>
        columns={columns}
        data={data}
        toolbar={toolbar}
        emptyMessage="No roles found."
        paginationComponent={<TablePagination total={total} />}
      />

      <CreateRoleDialog open={createOpen} onOpenChange={setCreateOpen} onSuccess={onSuccess} />

      {updateTarget && (
        <UpdateRoleDialog
          role={updateTarget}
          open={!!updateTarget}
          onOpenChange={(open: boolean) => !open && setUpdateTarget(null)}
          onSuccess={onSuccess}
        />
      )}

      {deleteTarget && (
        <DeleteRoleDialog
          role={deleteTarget}
          open={!!deleteTarget}
          onOpenChange={(open: boolean) => !open && setDeleteTarget(null)}
          onSuccess={onSuccess}
        />
      )}

      {toggleTarget && (
        <ActivateDeactivateRoleDialog
          role={toggleTarget}
          open={!!toggleTarget}
          onOpenChange={(open: boolean) => !open && setToggleTarget(null)}
          onSuccess={onSuccess}
        />
      )}
    </>
  )
}

export default RolesList
