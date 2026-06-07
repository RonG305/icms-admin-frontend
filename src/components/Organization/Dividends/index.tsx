import DividendsTableContainer from './DividendsTableContainer'

type SearchParams = Record<string, string | string[] | undefined>

const Dividends = ({ searchParams }: { searchParams: Promise<SearchParams> }) => {
  return (
    <div className='flex flex-col gap-6'>
      <DividendsTableContainer searchParams={searchParams} />
    </div>
  )
}

export default Dividends
