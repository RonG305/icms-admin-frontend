import Roles from "@/components/Roles"

type SearchParams = Record<string, string | string[] | undefined>

export default function RolesPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  return <Roles searchParams={searchParams} />
}
