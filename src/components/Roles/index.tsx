import RolesTableContainer from "./RolesTableContainer"

type SearchParams = Record<string, string | string[] | undefined>

const Roles = ({ searchParams }: { searchParams: Promise<SearchParams> }) => {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Roles</h1>
        <p className="text-base text-muted-foreground mt-1">Manage system roles and their permissions</p>
      </div>
      <RolesTableContainer searchParams={searchParams} />
    </div>
  )
}

export default Roles
