import { cn } from '@/lib/utils'

interface RigLinesProps {
  className?: string
  bg?: string
  shadowDark?: string
  shadowLight?: string
  maxSize?: number
  count?: number
}

const RigLines = ({
  className,
  bg = 'card',
  shadowDark = 'rgba(0,0,0,0.16)',
  shadowLight = 'rgba(255,255,255,0.88)',
  maxSize = 130,
  count = 8,
}: RigLinesProps) => {
  const rings = Array.from({ length: count }, (_, i) => {
    const t = i / (count - 1)                      
    const size = maxSize * Math.pow(1 - t, 0.65)
    const offset = size * 0.038 
    const blur   = size * 0.072 
    return { size, offset, blur }
  })

  return (
    <div
      className={cn(
        'relative flex items-center justify-center w-full h-full z-0 min-h-full',
        className
      )}
      style={{ background: bg }}
    >
      {rings.map(({ size, offset, blur }, i) => (
        <div
          key={i}
          className='absolute rounded-full pointer-events-none'
          style={{
            width:  `${size}vmin`,
            height: `${size}vmin`,
            background: bg,
            boxShadow: [
              `${offset}vmin ${offset}vmin ${blur}vmin ${shadowDark}`,
              `-${offset}vmin -${offset}vmin ${blur}vmin ${shadowLight}`,
              `inset 0.15vmin 0.15vmin 0.35vmin ${shadowLight}`,
              `inset -0.1vmin -0.1vmin 0.2vmin rgba(0,0,0,0.06)`,
            ].join(', '),
          }}
        />
      ))}
    </div>
  )
}

export default RigLines
