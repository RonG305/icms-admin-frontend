import ExitRequestsTableContainer from './ExitRequestsTableContainer'

type SearchParams = Record<string, string | string[] | undefined>

const ExitRequests = ({ searchParams }: { searchParams: Promise<SearchParams> }) => {
  return (
    <div className='flex flex-col gap-6'>
      <ExitRequestsTableContainer searchParams={searchParams} />
    </div>
  )
}

export default ExitRequests
