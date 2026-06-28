
import { RegisterFormContainer } from '@/components/Auth2/RegisterForm'
import { getOrganizations } from '@/data/organization/organization'

const page = async() => {
  const organizations = await getOrganizations({limit: 100, offset: 0})
 
      if ('error' in organizations) {
         console.error('Failed to fetch organizations:', organizations.error)
     } 
  return (
    <RegisterFormContainer organizations={'data' in organizations ? organizations.data : []} />
  )
}

export default page
