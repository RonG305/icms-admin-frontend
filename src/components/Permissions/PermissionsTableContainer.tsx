import { getPermissions } from "@/data/user-management/permissions"
import { Card } from "@/components/ui/card"
import PermissionsList from "./PermissionsList"

type SearchParams = Record<string, string | string[] | undefined>

const PermissionsTableContainer = async ({ searchParams }: { searchParams: Promise<SearchParams> }) => {
  const params = await searchParams
  const search = (Array.isArray(params?.search) ? params.search[0] : params?.search) || ""
  const page = parseInt(params?.page as string, 10) || 1
  const pageSize = parseInt(params?.pageSize as string, 10) || 10

  const result = await getPermissions({ page, limit: pageSize, search })

  return (
    <Card>
      <PermissionsList data={result.data} total={result.count} />
    </Card>
  )
}

export default PermissionsTableContainer
