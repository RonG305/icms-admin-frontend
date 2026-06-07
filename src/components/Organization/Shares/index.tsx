import SharesTableContainer from './SharesTableContainer'

type SearchParams = Record<string, string | string[] | undefined>

const Shares = ({ searchParams }: { searchParams: Promise<SearchParams> }) => {
  return (
    <div className='flex flex-col gap-6'>
      <SharesTableContainer searchParams={searchParams} />
    </div>
  )
}

export default Shares
