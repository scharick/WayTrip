'use client'

import { useId, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CalendarDays, MapPin, Minus, Plus, Search, Users } from 'lucide-react'
import type { Destination } from '@/lib/destinations'

export function DestinationSearch({
  destinos,
}: {
  destinos: Destination[]
}) {
  const router = useRouter()
  const id = useId()
  const [destination, setDestination] = useState('')
  const [date, setDate] = useState('')
  const [travelers, setTravelers] = useState(2)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const params = new URLSearchParams()
    if (destination.trim()) params.set('destino', destination.trim())
    const query = params.toString()
    router.push(`${query ? `/?${query}` : '/'}#destinos`, { scroll: false })
    document.getElementById('destinos')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      aria-label="Buscar destinos"
      className="grid w-full gap-2 rounded-3xl bg-white p-3 shadow-2xl shadow-foreground/15 ring-1 ring-black/5 md:grid-cols-[1.4fr_1fr_1fr_auto] md:items-center md:gap-0 md:rounded-full md:p-2"
    >
      <label
        htmlFor={`${id}-destino`}
        className="flex cursor-text items-center gap-3 rounded-2xl px-4 py-3 transition-colors hover:bg-muted md:rounded-full md:py-2.5"
      >
        <MapPin className="size-5 shrink-0 text-primary" aria-hidden="true" />
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Destino</span>
          <input
            id={`${id}-destino`}
            list={`${id}-sugerencias`}
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="¿A dónde quieres viajar?"
            className="w-full bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-foreground/50"
            autoComplete="off"
          />
          <datalist id={`${id}-sugerencias`}>
            {destinos.map((d) => (
              <option key={d.slug} value={d.city}>
                {d.country}
              </option>
            ))}
          </datalist>
        </span>
      </label>

      <label
        htmlFor={`${id}-fecha`}
        className="flex cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 transition-colors hover:bg-muted md:rounded-full md:border-l md:border-border md:py-2.5"
      >
        <CalendarDays className="size-5 shrink-0 text-primary" aria-hidden="true" />
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Fecha de viaje</span>
          <input
            id={`${id}-fecha`}
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-transparent text-sm font-medium text-foreground outline-none"
          />
        </span>
      </label>

      <div className="flex items-center gap-3 rounded-2xl px-4 py-3 transition-colors hover:bg-muted md:rounded-full md:border-l md:border-border md:py-2.5">
        <Users className="size-5 shrink-0 text-primary" aria-hidden="true" />
        <div className="flex flex-1 flex-col">
          <span id={`${id}-viajeros`} className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Viajeros
          </span>
          <div className="flex items-center justify-between gap-2" role="group" aria-labelledby={`${id}-viajeros`}>
            <span className="text-sm font-medium text-foreground" aria-live="polite">
              {travelers} {travelers === 1 ? 'viajero' : 'viajeros'}
            </span>
            <span className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setTravelers((t) => Math.max(1, t - 1))}
                disabled={travelers <= 1}
                className="flex size-6 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-40"
                aria-label="Quitar viajero"
              >
                <Minus className="size-3" />
              </button>
              <button
                type="button"
                onClick={() => setTravelers((t) => Math.min(20, t + 1))}
                disabled={travelers >= 20}
                className="flex size-6 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-40"
                aria-label="Añadir viajero"
              >
                <Plus className="size-3" />
              </button>
            </span>
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-7 py-4 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 hover:bg-primary/90 md:ml-2 md:rounded-full"
      >
        <Search className="size-4" aria-hidden="true" />
        Buscar
      </button>
    </form>
  )
}
