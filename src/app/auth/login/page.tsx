import { LoginFormContainer } from '@/components/Auth2/LoginForm'
import { getOrganizations } from '@/data/organization/organization'

export default async function LoginPage() {
  const organizations = await getOrganizations({ limit: 100, offset: 0 })

  return (
    <LoginFormContainer
      organizations={'data' in organizations ? organizations.data : []}
    />
  )
}
