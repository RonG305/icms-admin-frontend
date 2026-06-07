import { getUsers } from "@/data/user-management/auth-users"
import { Card } from "@/components/ui/card"
import UsersList from "./UsersList"

type SearchParams = Record<string, string | string[] | undefined>

const UsersTableContainer = async ({ searchParams }: { searchParams: Promise<SearchParams> }) => {
  const params = await searchParams
  const search = (Array.isArray(params?.search) ? params.search[0] : params?.search) || ""
  const page = parseInt(params?.page as string, 10) || 1
  const pageSize = parseInt(params?.pageSize as string, 10) || 10

  const result = await getUsers({ page, limit: pageSize, search })

  return (
    <Card>
      <UsersList data={result.data} total={result.count} />
    </Card>
  )
}

export default UsersTableContainer
