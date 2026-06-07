import ExitRequests from '@/components/Organization/ExitRequests'

type SearchParams = Record<string, string | string[] | undefined>

export default function ExitRequestsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  return <ExitRequests searchParams={searchParams} />
}
