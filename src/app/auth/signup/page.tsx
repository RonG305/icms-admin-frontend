
import { RegisterFormContainer } from '@/components/Authentication/RegisterForm'
import { getOrganizations } from '@/data/organization/organization'
import React from 'react'

const page = async() => {
  const organizations = await getOrganizations({limit: 100, offset: 0})
     console.log("Fetched organizations in page component:", organizations)
 
      if ('error' in organizations) {
         console.error('Failed to fetch organizations:', organizations.error)
     } else {
         console.log('Fetched organizations:', organizations.data)
     }
  return (
    <RegisterFormContainer organizations={'data' in organizations ? organizations.data : []} />
  )
}

export default page
