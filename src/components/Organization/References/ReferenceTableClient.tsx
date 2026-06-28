'use client'

import { ReferenceTable, type ReferenceItem } from './ReferenceTable'
import {
  createEconomicActivity, updateEconomicActivity, deleteEconomicActivity,
  createTypology, updateTypology, deleteTypology,
  createStructure, updateStructure, deleteStructure,
  createMembershipType, updateMembershipType, deleteMembershipType,
} from '@/actions/reference'

type ReferenceType = 'economic-activity' | 'typology' | 'structure' | 'membership-type'

interface Props {
  type: ReferenceType
  items: ReferenceItem[]
  label: string
  fieldLabel: string
}

const actionMap: Record<
  ReferenceType,
  {
    create: (name: string) => Promise<unknown>
    update: (id: string, name: string) => Promise<unknown>
    delete: (id: string) => Promise<unknown>
  }
> = {
  'economic-activity': {
    create: (name) => createEconomicActivity({ activity_name: name }),
    update: (id, name) => updateEconomicActivity(id, { activity_name: name }),
    delete: deleteEconomicActivity,
  },
  'typology': {
    create: (name) => createTypology({ typology_name: name }),
    update: (id, name) => updateTypology(id, { typology_name: name }),
    delete: deleteTypology,
  },
  'structure': {
    create: (name) => createStructure({ structure_name: name }),
    update: (id, name) => updateStructure(id, { structure_name: name }),
    delete: deleteStructure,
  },
  'membership-type': {
    create: (name) => createMembershipType({ type_name: name }),
    update: (id, name) => updateMembershipType(id, { type_name: name }),
    delete: deleteMembershipType,
  },
}

export const ReferenceTableClient = ({ type, items, label, fieldLabel }: Props) => {
  const actions = actionMap[type]
  return (
    <ReferenceTable
      items={items}
      label={label}
      fieldLabel={fieldLabel}
      onCreate={actions.create}
      onUpdate={actions.update}
      onDelete={actions.delete}
    />
  )
}
