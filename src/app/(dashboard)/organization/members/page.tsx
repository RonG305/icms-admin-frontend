import Members from '@/components/Organization/Members'

type SearchParams = Record<string, string | string[] | undefined>

export default function MembersPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  return <Members searchParams={searchParams} />
}
