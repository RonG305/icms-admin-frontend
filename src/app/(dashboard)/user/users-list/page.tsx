import Users from "@/components/Users"

type SearchParams = Record<string, string | string[] | undefined>

export default function UsersListPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  return <Users searchParams={searchParams} />
}
