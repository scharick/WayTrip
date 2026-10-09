'use client'

import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowUpRight, MapPin, SearchX, Star } from 'lucide-react'

import type { Destination } from '@/lib/destinations'
import { SectionHeading } from '@/components/section-heading'

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

export function DestinationsSection({
  destinos,
}: {
  destinos: Destination[]
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const query = searchParams.get('destino')?.trim() ?? ''

  const results = query
    ? destinos.filter((d) =>
        normalize(`${d.city} ${d.country} ${d.category}`).includes(
          normalize(query)
        )
      )
    : destinos

  return (
    <section
      id="destinos"
      className="mx-auto max-w-7xl scroll-mt-24 px-5 py-24 md:px-8 md:py-32"
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          eyebrow="Explora destinos"
          title="Lugares que te harán soñar"
          description="Una selección de destinos favoritos de nuestra comunidad. Descubre qué ver, qué hacer y cómo vivir cada uno."
        />

        {query ? (
          <button
            type="button"
            onClick={() => router.push('/#destinos', { scroll: false })}
            className="w-fit shrink-0 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            Ver todos los destinos
          </button>
        ) : (
          <a
            href="#viajes"
            className="w-fit shrink-0 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            Ver más destinos
          </a>
        )}
      </div>

      {query && (
        <p className="mt-6 text-sm text-muted-foreground" aria-live="polite">
          {results.length}{' '}
          {results.length === 1 ? 'resultado' : 'resultados'} para{' '}
          <span className="font-semibold text-foreground">
            "{query}"
          </span>
        </p>
      )}

      {results.length > 0 ? (
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((destination) => (
            <li key={destination.slug}>
              <DestinationCard destination={destination} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-10 flex flex-col items-center rounded-3xl border border-dashed border-border bg-muted/50 px-6 py-16 text-center">
          <SearchX
            className="size-10 text-muted-foreground"
            aria-hidden="true"
          />

          <p className="mt-4 font-display text-lg font-bold text-foreground">
            Aún no tenemos ese destino
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Prueba con otra ciudad o país.
          </p>
        </div>
      )}
    </section>
  )
}

function DestinationCard({
  destination,
}: {
  destination: Destination
}) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl bg-card shadow-sm ring-1 ring-border/70 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/10">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={destination.image}
          alt={`${destination.city}, ${destination.country}`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-foreground backdrop-blur">
          {destination.category}
        </span>

        <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-foreground/70 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
          <Star
            className="size-3 fill-current text-amber-300"
            aria-hidden="true"
          />
          {destination.rating}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
          <MapPin
            className="size-4 text-accent"
            aria-hidden="true"
          />
          {destination.country}
        </p>

        <h3 className="mt-1.5 text-2xl font-bold text-foreground">
          {destination.city}
        </h3>

        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
          {destination.description}
        </p>

<a
  href={`/destinos/${destination.slug}`}
  className="mt-5 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-accent"
  aria-label={`Ver destino ${destination.city}`}
>
  Ver destino
  <ArrowUpRight
    className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
    aria-hidden="true"
  />
</a>
      </div>
    </article>
  )
}