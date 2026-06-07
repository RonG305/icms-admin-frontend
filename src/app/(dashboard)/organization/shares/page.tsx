import Shares from '@/components/Organization/Shares'

type SearchParams = Record<string, string | string[] | undefined>

export default function SharesPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  return <Shares searchParams={searchParams} />
}
