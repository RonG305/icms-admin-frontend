import { getRoles } from "@/data/user-management/roles"
import { Card } from "@/components/ui/card"
import RolesList from "./RolesList"

type SearchParams = Record<string, string | string[] | undefined>

const RolesTableContainer = async ({ searchParams }: { searchParams: Promise<SearchParams> }) => {
  const params = await searchParams
  const search = (Array.isArray(params?.search) ? params.search[0] : params?.search) || ""
  const page = parseInt(params?.page as string, 10) || 1
  const pageSize = parseInt(params?.pageSize as string, 10) || 10

  const result = await getRoles({ page, limit: pageSize, search })

  return (
    <Card>
      <RolesList data={result.data} total={result.count} />
    </Card>
  )
}

export default RolesTableContainer
