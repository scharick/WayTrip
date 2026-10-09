import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, MapPin, Star, CalendarDays } from 'lucide-react'
import { notFound } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const supabase = await createClient()

  const { data: destino, error } = await supabase
    .from('destinos')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !destino) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Barra superior */}
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex h-20 max-w-7xl items-center px-5 md:px-8">
          <Link
            href="/#destinos"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="size-4" />
            Volver a destinos
          </Link>
        </div>
      </header>

      {/* Imagen principal */}
      <section className="mx-auto max-w-7xl px-5 pt-8 md:px-8 md:pt-10">
        <div className="relative aspect-[16/7] overflow-hidden rounded-3xl">
          <Image
            src={destino.imagen_url}
            alt={`${destino.ciudad}, ${destino.pais}`}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

          <div className="absolute bottom-0 left-0 p-6 text-white sm:p-10">
            <span className="rounded-full bg-white/20 px-3 py-1.5 text-sm font-semibold backdrop-blur-md">
              {destino.categoria}
            </span>

            <h1 className="mt-4 font-display text-4xl font-extrabold sm:text-5xl md:text-6xl">
              {destino.ciudad}
            </h1>

            <p className="mt-2 flex items-center gap-2 text-white/90">
              <MapPin className="size-5" />
              {destino.pais}
            </p>
          </div>
        </div>
      </section>

      {/* Información */}
      <section className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
          
          {/* Contenido principal */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">
              Descubre el destino
            </p>

            <h2 className="mt-3 font-display text-3xl font-extrabold text-foreground sm:text-4xl">
              Todo lo que necesitas saber
            </h2>

            <p className="mt-6 max-w-3xl text-base leading-8 text-muted-foreground">
              {destino.descripcion}
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-border bg-card p-5">
                <MapPin className="size-6 text-primary" />

                <p className="mt-4 text-sm text-muted-foreground">
                  Ubicación
                </p>

                <p className="mt-1 font-bold text-foreground">
                  {destino.ciudad}, {destino.pais}
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5">
                <Star className="size-6 fill-current text-amber-400" />

                <p className="mt-4 text-sm text-muted-foreground">
                  Calificación
                </p>

                <p className="mt-1 font-bold text-foreground">
                  {destino.calificacion ?? 'Sin calificación'} / 5
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5">
                <CalendarDays className="size-6 text-primary" />

                <p className="mt-4 text-sm text-muted-foreground">
                  Categoría
                </p>

                <p className="mt-1 font-bold text-foreground">
                  {destino.categoria}
                </p>
              </div>
            </div>
          </div>

          {/* Panel de planificación */}
          <aside className="h-fit rounded-3xl border border-border bg-card p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent">
              ¿Te gusta este destino?
            </p>

            <h3 className="mt-3 font-display text-2xl font-extrabold text-foreground">
              Empieza a planear tu viaje
            </h3>

            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Organiza las fechas, presupuesto y detalles de tu próxima
              aventura en {destino.ciudad}.
            </p>

            <Link
              href={`/viajes/nuevo?destino=${destino.id}`}
              className="mt-6 flex h-12 items-center justify-center rounded-xl bg-primary px-5 font-semibold text-primary-foreground shadow-lg shadow-primary/15 transition hover:-translate-y-0.5 hover:bg-primary/90"
            >
              Planear viaje
            </Link>
          </aside>
        </div>
      </section>
    </main>
  )
}

