import Image from 'next/image'

import { ArrowRight, MapPin, Plane, Star } from 'lucide-react'

import { DestinationSearch } from '@/components/destination-search'
import type { Destination } from '@/lib/destinations'

export function Hero({
  destinos,
}: {
  destinos: Destination[]
}) {
  return (
    <section id="inicio" className="relative isolate">
      <div className="relative min-h-[680px] overflow-hidden md:min-h-[760px]">
        <Image
          src="/images/hero.png"
          alt="Viajero contemplando un lago turquesa rodeado de montañas"
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover"
        />

        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-foreground/60 via-foreground/25 to-foreground/70" />

        <div className="mx-auto flex max-w-7xl flex-col px-5 pb-40 pt-36 md:px-8 md:pb-48 md:pt-44">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white ring-1 ring-white/30 backdrop-blur-md">
            <Plane className="size-4" aria-hidden="true" />
            Más de 600 destinos por descubrir
          </span>

          <h1 className="mt-6 max-w-3xl text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Descubre el mundo.{' '}
            <span className="text-[oklch(0.85_0.12_168)]">
              Planea tu próxima aventura.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-white/90 md:text-lg">
            Explora destinos, encuentra lugares increíbles y organiza tu viaje de manera sencilla con WayTrip.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#destinos"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-foreground shadow-lg transition-all hover:-translate-y-0.5 hover:bg-white/95"
            >
              Explorar destinos

              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </a>

            <div className="flex items-center gap-3 text-sm text-white/90">
              <div className="flex -space-x-2" aria-hidden="true">
                {[
                  '/images/santorini.png',
                  '/images/tokio.png',
                  '/images/cartagena.png',
                ].map((src) => (
                  <span
                    key={src}
                    className="relative size-9 overflow-hidden rounded-full ring-2 ring-white"
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  </span>
                ))}
              </div>

              <span>
                <span className="flex items-center gap-1 font-semibold text-white">
                  <Star
                    className="size-3.5 fill-current"
                    aria-hidden="true"
                  />
                  4.9
                </span>
                +25k viajeros felices
              </span>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-48 right-8 hidden rounded-2xl bg-white/90 p-3 pr-5 shadow-xl backdrop-blur-md lg:flex lg:items-center lg:gap-3">
          <span className="relative size-12 overflow-hidden rounded-xl">
            <Image
              src="/images/santorini.png"
              alt=""
              fill
              sizes="48px"
              className="object-cover"
            />
          </span>

          <span className="flex flex-col">
            <span className="text-xs font-medium text-muted-foreground">
              Destino popular
            </span>

            <span className="flex items-center gap-1 text-sm font-semibold text-foreground">
              <MapPin
                className="size-3.5 text-accent"
                aria-hidden="true"
              />
              Santorini, Grecia
            </span>
          </span>
        </div>
      </div>

      <div className="relative z-10 mx-auto -mt-24 max-w-5xl px-5 md:-mt-14 md:px-8">
        <DestinationSearch destinos={destinos} />
      </div>
    </section>
  )
}

