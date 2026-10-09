import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Plus,
  Wallet,
} from 'lucide-react'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

export default async function ViajesPage({
  searchParams,
}: {
  searchParams: Promise<{ creado?: string }>
}) {
  const params = await searchParams

  const supabase = await createClient()

  // Comprobar sesión
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Obtener los viajes del usuario junto con la información del destino
  const { data: viajes, error } = await supabase
    .from('viajes')
    .select(`
      id,
      fecha_inicio,
      fecha_fin,
      presupuesto,
      creado_en,
      destinos (
        id,
        ciudad,
        pais,
        imagen_url,
        categoria
      )
    `)
    .eq('usuario_id', user.id)
    .order('fecha_inicio', { ascending: true })

  if (error) {
    console.error('ERROR AL OBTENER VIAJES:', error)
  }

  return (
    <main className="min-h-screen bg-secondary/40 px-5 py-10 md:px-8 md:py-14">
      <div className="mx-auto max-w-6xl">

        {/* Encabezado */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/#destinos"
              className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft className="size-4" />
              Explorar destinos
            </Link>

            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.16em] text-accent">
              Mis viajes
            </p>

            <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              Tus próximas aventuras
            </h1>

            <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
              Aquí encontrarás todos los viajes que has planeado en WayTrip.
            </p>
          </div>

          <Link
            href="/#destinos"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 font-semibold text-primary-foreground shadow-lg shadow-primary/15 transition hover:-translate-y-0.5 hover:bg-primary/90"
          >
            <Plus className="size-5" />
            Nuevo viaje
          </Link>
        </div>

        {/* Mensaje de viaje creado */}
        {params.creado === 'true' && (
          <div
            role="status"
            className="mt-8 rounded-2xl border border-primary/20 bg-primary/10 px-5 py-4 text-sm font-semibold text-primary"
          >
            ¡Tu viaje fue creado correctamente! ✈️
          </div>
        )}

        {/* Viajes */}
        {viajes && viajes.length > 0 ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2">

            {viajes.map((viaje) => {
              const destino = Array.isArray(viaje.destinos)
                ? viaje.destinos[0]
                : viaje.destinos

              if (!destino) {
                return null
              }

              return (
                <article
                  key={viaje.id}
                  className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10"
                >
                  {/* Imagen */}
                  <div className="relative aspect-[16/8] overflow-hidden">
                    <Image
                      src={destino.imagen_url}
                      alt={`${destino.ciudad}, ${destino.pais}`}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-foreground backdrop-blur">
                      {destino.categoria}
                    </span>

                    <div className="absolute bottom-4 left-5 text-white">
                      <p className="flex items-center gap-1.5 text-sm text-white/85">
                        <MapPin className="size-4" />
                        {destino.pais}
                      </p>

                      <h2 className="mt-1 text-3xl font-extrabold">
                        {destino.ciudad}
                      </h2>
                    </div>
                  </div>

                  {/* Información */}
                  <div className="p-6">
                    <div className="grid gap-4 sm:grid-cols-2">

                      <div className="flex items-start gap-3">
                        <div className="rounded-xl bg-primary/10 p-2.5">
                          <CalendarDays className="size-5 text-primary" />
                        </div>

                        <div>
                          <p className="text-xs font-medium text-muted-foreground">
                            Fechas
                          </p>

                          <p className="mt-1 text-sm font-bold text-foreground">
                            {formatDate(viaje.fecha_inicio)}
                          </p>

                          <p className="text-sm text-muted-foreground">
                            hasta {formatDate(viaje.fecha_fin)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="rounded-xl bg-primary/10 p-2.5">
                          <Wallet className="size-5 text-primary" />
                        </div>

                        <div>
                          <p className="text-xs font-medium text-muted-foreground">
                            Presupuesto
                          </p>

                          <p className="mt-1 text-sm font-bold text-foreground">
                            {viaje.presupuesto !== null
                              ? formatCurrency(viaje.presupuesto)
                              : 'Sin definir'}
                          </p>
                        </div>
                      </div>

                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
                      <Link
                        href={`/destinos/${destino.id}`}
                        className="text-sm font-semibold text-primary transition-colors hover:text-accent"
                      >
                        Ver destino
                      </Link>

                      <span className="text-xs text-muted-foreground">
                        Viaje #{viaje.id}
                      </span>
                    </div>
                  </div>
                </article>
              )
            })}

          </div>
        ) : (
          /* Sin viajes */
          <div className="mt-10 rounded-3xl border border-dashed border-border bg-card px-6 py-20 text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10">
              <MapPin className="size-7 text-primary" />
            </div>

            <h2 className="mt-6 font-display text-2xl font-extrabold text-foreground">
              Todavía no tienes viajes
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              Explora nuestros destinos y empieza a planear tu próxima
              aventura.
            </p>

            <Link
              href="/#destinos"
              className="mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              <Plus className="size-5" />
              Explorar destinos
            </Link>
          </div>
        )}

      </div>
    </main>
  )
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${date}T12:00:00`))
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value)
}

