import { getEconomicActivities, getTypologies, getStructures, getMembershipTypes } from '@/data/organization/reference'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ReferenceTableClient } from './ReferenceTableClient'

const ReferencesContainer = async () => {
  const [economicActivities, typologies, structures, membershipTypes] = await Promise.all([
    getEconomicActivities(),
    getTypologies(),
    getStructures(),
    getMembershipTypes(),
  ])

  return (
    <Tabs defaultValue='economic-activities' className='w-full'>
      <TabsList className='mb-4'>
        <TabsTrigger value='economic-activities'>Economic Activities</TabsTrigger>
        <TabsTrigger value='typologies'>Typologies</TabsTrigger>
        <TabsTrigger value='structures'>Structures</TabsTrigger>
        <TabsTrigger value='membership-types'>Membership Types</TabsTrigger>
      </TabsList>

      <TabsContent value='economic-activities'>
        <Card>
          <ReferenceTableClient
            type='economic-activity'
            items={(economicActivities.data ?? []).map((i) => ({ id: i.id, name: i.activity_name, created_at: i.created_at }))}
            label='Economic Activity'
            fieldLabel='Activity Name'
          />
        </Card>
      </TabsContent>

      <TabsContent value='typologies'>
        <Card>
          <ReferenceTableClient
            type='typology'
            items={(typologies.data ?? []).map((i) => ({ id: i.id, name: i.typology_name, created_at: i.created_at }))}
            label='Typology'
            fieldLabel='Typology Name'
          />
        </Card>
      </TabsContent>

      <TabsContent value='structures'>
        <Card>
          <ReferenceTableClient
            type='structure'
            items={(structures.data ?? []).map((i) => ({ id: i.id, name: i.structure_name, created_at: i.created_at }))}
            label='Structure'
            fieldLabel='Structure Name'
          />
        </Card>
      </TabsContent>

      <TabsContent value='membership-types'>
        <Card>
          <ReferenceTableClient
            type='membership-type'
            items={(membershipTypes.data ?? []).map((i) => ({ id: i.id, name: i.type_name, created_at: i.created_at }))}
            label='Membership Type'
            fieldLabel='Type Name'
          />
        </Card>
      </TabsContent>
    </Tabs>
  )
}

export default ReferencesContainer
