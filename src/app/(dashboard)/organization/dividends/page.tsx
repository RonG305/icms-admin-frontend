import Dividends from '@/components/Organization/Dividends'

type SearchParams = Record<string, string | string[] | undefined>

export default function DividendsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  return <Dividends searchParams={searchParams} />
}
