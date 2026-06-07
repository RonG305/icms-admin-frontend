import PermissionsTableContainer from "./PermissionsTableContainer"

type SearchParams = Record<string, string | string[] | undefined>

const Permissions = ({ searchParams }: { searchParams: Promise<SearchParams> }) => {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Permissions</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage granular permissions assigned to roles</p>
      </div>
      <PermissionsTableContainer searchParams={searchParams} />
    </div>
  )
}

export default Permissions
