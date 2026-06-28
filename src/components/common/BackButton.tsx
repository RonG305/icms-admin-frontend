import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/react/dist/iconify.js'

interface Props {
  href: string
}

export function BackButton({ href }: Props) {
  return (
    <Button variant='secondary' className='rounded-full' size='icon' asChild>
      <Link href={href}>
        <Icon icon='solar:arrow-left-linear' fontSize={18} />
      </Link>
    </Button>
  )
}
