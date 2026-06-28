"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { type ColumnDef } from "@tanstack/react-table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { DataTable } from "@/components/common/data-table"
import { TablePagination } from "@/components/common/TablePagination"
import { ActionDropdown } from "@/components/common/ActionDropdown"
import { UpdateUserDialog } from "./UpdateUserDialog"
import { DeleteUserDialog } from "./DeleteUserDialog"
import { ActivateDeactivateUserDialog } from "./ActivateDeactivateUserDialog"
import { ViewUserDrawer } from "./ViewUserDrawer"
import { UserFilters } from "./UserFilters"
import { AuthUser } from "@/types/auth"
import { Icon } from "@iconify/react"

function initials(u: AuthUser) {
  return `${u.first_name?.[0] ?? ""}${u.last_name?.[0] ?? ""}`.toUpperCase() || u.email[0].toUpperCase()
}

interface Props {
  data: AuthUser[]
  total: number
}

const UsersList = ({ data, total }: Props) => {
  const router = useRouter()
  const [viewTarget, setViewTarget] = useState<AuthUser | null>(null)
  const [updateTarget, setUpdateTarget] = useState<AuthUser | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AuthUser | null>(null)
  const [toggleTarget, setToggleTarget] = useState<AuthUser | null>(null)

  const onSuccess = () => {
    setUpdateTarget(null)
    setDeleteTarget(null)
    setToggleTarget(null)
    router.refresh()
  }

  const columns: ColumnDef<AuthUser>[] = [
    {
      id: "user",
      header: "User",
      accessorFn: (row) => `${row.first_name} ${row.last_name}`,
      cell: ({ row }) => {
        const u = row.original
        return (
          <div className="flex items-center gap-3 min-w-0">
            <Avatar className="size-8 shrink-0">
              <AvatarFallback className="bg-primary/10 border text-primary">{initials(u)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className=" font-medium truncate">{u.first_name} {u.last_name}</p>
              <p className="text-sm text-muted-foreground truncate">{u.email}</p>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "phone_number",
      header: "Phone",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.phone_number || "—"}</span>
      ),
    },
    {
      accessorKey: "account_type",
      header: "Type",
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {row.original.account_type}
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const s = row.original.status
        return (
          <Badge variant={s === "active" ? "success" : "destructive"} className="capitalize">
            {s}
          </Badge>
        )
      },
    },
    {
      accessorKey: "is_verified",
      header: "Verified",
      cell: ({ row }) => (
        <Badge variant={row.original.is_verified ? "info" : "secondary"}>
          {row.original.is_verified ? "Verified" : "Unverified"}
        </Badge>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Joined",
      cell: ({ row }) =>
        row.original.created_at
          ? new Date(row.original.created_at).toLocaleDateString()
          : "—",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const u = row.original
        return (
          <ActionDropdown>
            <DropdownMenuItem onClick={() => setViewTarget(u)}>
              <Icon icon="solar:eye-linear" fontSize={16} />
              <span>View</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setUpdateTarget(u)}>
              <Icon icon="solar:pen-2-linear" fontSize={16} />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setToggleTarget(u)}>
              <Icon
                icon={u.status === "active" ? "solar:forbidden-circle-linear" : "solar:check-circle-linear"}
                fontSize={16}
              />
              <span>{u.status === "active" ? "Deactivate" : "Activate"}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={() => setDeleteTarget(u)}>
              <Icon icon="solar:trash-bin-trash-linear" fontSize={16} />
              <span>Delete</span>
            </DropdownMenuItem>
          </ActionDropdown>
        )
      },
    },
  ]

  return (
    <>
      <DataTable<AuthUser>
        columns={columns}
        data={data}
        toolbar={<UserFilters />}
        emptyMessage="No users found."
        paginationComponent={<TablePagination total={total} />}
      />

      {viewTarget && (
        <ViewUserDrawer
          user={viewTarget}
          open={!!viewTarget}
          onOpenChange={(o) => !o && setViewTarget(null)}
        />
      )}

      {updateTarget && (
        <UpdateUserDialog
          user={updateTarget}
          open={!!updateTarget}
          onOpenChange={(o) => !o && setUpdateTarget(null)}
          onSuccess={onSuccess}
        />
      )}

      {deleteTarget && (
        <DeleteUserDialog
          user={deleteTarget}
          open={!!deleteTarget}
          onOpenChange={(o) => !o && setDeleteTarget(null)}
          onSuccess={onSuccess}
        />
      )}

      {toggleTarget && (
        <ActivateDeactivateUserDialog
          user={toggleTarget}
          open={!!toggleTarget}
          onOpenChange={(o) => !o && setToggleTarget(null)}
          onSuccess={onSuccess}
        />
      )}
    </>
  )
}

export default UsersList
