import { cn } from '@/lib/utils'

interface MeshedBackgroundProps {
  className?: string
  /** Hex stroke color */
  stroke?: string
  /** Size of each hexagon (flat-to-flat radius) */
  hexSize?: number
  /** Gap between hexagons */
  gap?: number
  /** Fade direction: where the mesh fades out */
  fadeDirection?: 'right' | 'left' | 'bottom' | 'top' | 'none'
  /** 0–1: how much of the width/height the fade covers */
  fadeStart?: number
}

function buildHexPath(cx: number, cy: number, r: number): string {
  const points: string[] = []
  for (let i = 0; i < 6; i++) {
    // flat-top orientation: start at 0°
    const angle = (Math.PI / 180) * (60 * i)
    const x = cx + r * Math.cos(angle)
    const y = cy + r * Math.sin(angle)
    points.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(3)},${y.toFixed(3)}`)
  }
  return points.join(' ') + ' Z'
}

export default function MeshedBackground({
  className,
  stroke = 'currentColor',
  hexSize = 18,
  gap = 2,
  fadeDirection = 'right',
  fadeStart = 0.45,
}: MeshedBackgroundProps) {
  const r = hexSize
  // flat-top hex geometry
  const w = r * 2           // width of one hex (point-to-point)
  const h = Math.sqrt(3) * r // height of one hex (flat-to-flat)
  const colStep = w * 0.75 + gap
  const rowStep = h + gap

  // Build enough hexagons to tile a 1200×700 area (SVG viewBox)
  const vw = 1200
  const vh = 700
  const cols = Math.ceil(vw / colStep) + 2
  const rows = Math.ceil(vh / rowStep) + 2

  const paths: string[] = []
  for (let col = -1; col < cols; col++) {
    const cx = col * colStep + r
    const offset = col % 2 === 0 ? 0 : h / 2
    for (let row = -1; row < rows; row++) {
      const cy = row * rowStep + r + offset
      paths.push(buildHexPath(cx, cy, r - gap / 2))
    }
  }

  const gradientId = 'mesh-fade'
  const gradientCoords: Record<string, { x1: string; y1: string; x2: string; y2: string }> = {
    right:  { x1: '0%', y1: '0%', x2: '100%', y2: '0%' },
    left:   { x1: '100%', y1: '0%', x2: '0%', y2: '0%' },
    bottom: { x1: '0%', y1: '0%', x2: '0%', y2: '100%' },
    top:    { x1: '0%', y1: '100%', x2: '0%', y2: '0%' },
    none:   { x1: '0%', y1: '0%', x2: '100%', y2: '0%' },
  }
  const gc = gradientCoords[fadeDirection]

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${vw} ${vh}`}
      preserveAspectRatio="xMidYMid slice"
      className={cn('w-full h-full', className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} {...gc}>
          {fadeDirection === 'none' ? (
            <stop offset="0%" stopColor="white" stopOpacity="1" />
          ) : (
            <>
              <stop offset="0%" stopColor="white" stopOpacity="1" />
              <stop offset={`${Math.round(fadeStart * 100)}%`} stopColor="white" stopOpacity="0.6" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </>
          )}
        </linearGradient>
        <mask id="mesh-mask">
          <rect width={vw} height={vh} fill={`url(#${gradientId})`} />
        </mask>
      </defs>

      <g
        fill="none"
        stroke={stroke}
        strokeWidth="0.8"
        strokeOpacity="0.25"
        mask="url(#mesh-mask)"
      >
        {paths.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
    </svg>
  )
}
