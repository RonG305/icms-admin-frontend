import Permissions from "@/components/Permissions"

type SearchParams = Record<string, string | string[] | undefined>

export default function PermissionsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  return <Permissions searchParams={searchParams} />
}
