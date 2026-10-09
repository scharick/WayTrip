import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

export function CtaSection() {
  return (
    <section className="px-5 pb-24 md:px-8 md:pb-32">
      <div className="relative isolate mx-auto max-w-7xl overflow-hidden rounded-[2rem] px-6 py-20 text-center md:px-16 md:py-28">
        <Image
          src="/images/cta.png"
          alt=""
          fill
          sizes="(min-width: 1280px) 1280px, 100vw"
          className="-z-10 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/90 via-primary/70 to-accent/80" />

        <h2 className="mx-auto max-w-3xl text-balance text-3xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl">
          Tu próxima aventura comienza aquí.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-white/90 md:text-lg">
          Crea tu cuenta gratis, guarda tus lugares favoritos y arma el itinerario perfecto en minutos.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#destinos"
            className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold text-primary shadow-xl transition-all hover:-translate-y-0.5"
          >
            Comenzar a explorar
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </a>
          <a
            href="#"
            className="rounded-full px-6 py-4 text-sm font-semibold text-white ring-1 ring-white/50 transition-colors hover:bg-white/15"
          >
            Crear cuenta
          </a>
        </div>
      </div>
    </section>
  )
}
