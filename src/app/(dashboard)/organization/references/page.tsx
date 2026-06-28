import ReferencesContainer from '@/components/Organization/References/ReferencesContainer'

type SearchParams = Record<string, string | string[] | undefined>

export default function ReferencesPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  void searchParams
  return (
    <div className='flex flex-col gap-6'>
      <div>
        <h1 className='text-xl font-semibold'>Reference Data</h1>
        <p className='text-sm text-muted-foreground'>
          Manage lookup values used across members, organizations and onboarding.
        </p>
      </div>
      <ReferencesContainer />
    </div>
  )
}
