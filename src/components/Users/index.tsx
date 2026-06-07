import { getOrgUserStats } from "@/data/user-management/auth-users"
import UserStats from "./UserStats"
import UsersTableContainer from "./UsersTableContainer"

type SearchParams = Record<string, string | string[] | undefined>

const Users = async ({ searchParams }: { searchParams: Promise<SearchParams> }) => {
  const stats = await getOrgUserStats()

  return (
    <div className="flex flex-col gap-6">
      <UserStats stats={stats} />
      <UsersTableContainer searchParams={searchParams} />
    </div>
  )
}

export default Users
