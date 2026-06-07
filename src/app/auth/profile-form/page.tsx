import ProfileForm from '@/components/Auth/Profile/ProfileForm'
import React from 'react'
import { getOrganizations } from '@/data/organization/organization'

const page = async() => {
    
    const organizations = await getOrganizations({limit: 100, offset: 0})
    console.log("Fetched organizations in page component:", organizations)

     if ('error' in organizations) {
        console.error('Failed to fetch organizations:', organizations.error)
    } else {
        console.log('Fetched organizations:', organizations.data)
    }
  return (
    <div>
      <ProfileForm organizations={organizations.data} />
    </div>
  )
}

export default page
