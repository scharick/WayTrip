import { Compass } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Logo({ className, light = false }: { className?: string; light?: boolean }) {
  return (
    <a href="#inicio" className={cn('flex items-center gap-2', className)} aria-label="WayTrip, ir al inicio">
      <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
        <Compass className="size-5" aria-hidden="true" />
      </span>
      <span
        className={cn(
          'font-display text-xl font-extrabold tracking-tight',
          light ? 'text-white' : 'text-foreground',
        )}
      >
        Way<span className="text-accent">Trip</span>
      </span>
    </a>
  )
}
