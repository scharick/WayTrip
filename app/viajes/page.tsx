
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Pencil,
  Plus,
  Wallet,
} from 'lucide-react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DeleteTripButton } from '@/components/delete-trip-button'

type ViajesPageProps = {
  searchParams: Promise<{
    creado?: string
    editado?: string
    eliminado?: string
    error?: string
  }>
}

export default async function ViajesPage({
  searchParams,
}: ViajesPageProps) {
  const params = await searchParams
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

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
    console.error('Error al cargar los viajes:', error)
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Volver al inicio
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Tu próxima aventura
            </p>

            <h1 className="mt-2 font-display text-3xl font-extrabold text-foreground sm:text-4xl">
              Mis viajes
            </h1>

            <p className="mt-2 text-muted-foreground">
              Organiza y consulta todos tus viajes en un solo lugar.
            </p>
          </div>

          <Link
            href="/viajes/nuevo"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            <Plus className="size-5" />
            Nuevo viaje
          </Link>
        </div>

        {/* Mensajes de resultado */}
        <div className="mt-6 space-y-3">
          {params.creado === 'true' && (
            <p
              role="status"
              className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-700"
            >
              ¡Tu viaje se creó correctamente!
            </p>
          )}

          {params.editado === 'true' && (
            <p
              role="status"
              className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-700"
            >
              ¡Tu viaje se actualizó correctamente!
            </p>
          )}

          {params.eliminado === 'true' && (
            <p
              role="status"
              className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-700"
            >
              El viaje se eliminó correctamente.
            </p>
          )}

          {params.error === 'eliminar' && (
            <p
              role="alert"
              className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-700"
            >
              No se pudo eliminar el viaje. Inténtalo nuevamente.
            </p>
          )}
        </div>

        {error ? (
          <div className="mt-10 rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-700">
            No se pudieron cargar tus viajes. Recarga la página para intentarlo de nuevo.
          </div>
        ) : viajes && viajes.length > 0 ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {viajes.map((viaje) => {
              const destino = Array.isArray(viaje.destinos)
                ? viaje.destinos[0]
                : viaje.destinos

              return (
                <article
                  key={viaje.id}
                  className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm"
                >
                  <div className="relative h-52 w-full bg-muted">
                    {destino?.imagen_url ? (
                      <Image
                        src={destino.imagen_url}
                        alt={
                          destino.ciudad
                            ? `Destino ${destino.ciudad}`
                            : 'Imagen del destino'
                        }
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <MapPin className="size-10 text-muted-foreground" />
                      </div>
                    )}

                    {destino?.categoria && (
                      <span className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-foreground backdrop-blur">
                        {destino.categoria}
                      </span>
                    )}
                  </div>

                  <div className="p-5 sm:p-6">
                    <h2 className="font-display text-2xl font-bold text-foreground">
                      {destino?.ciudad || 'Destino sin nombre'}
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {destino?.pais || 'País no disponible'}
                    </p>

                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <div className="flex items-start gap-3">
                        <CalendarDays className="mt-0.5 size-5 shrink-0 text-primary" />

                        <div>
                          <p className="text-xs text-muted-foreground">
                            Fecha de inicio
                          </p>

                          <p className="mt-1 text-sm font-semibold text-foreground">
                            {formatDate(viaje.fecha_inicio)}
                          </p>

                          <p className="mt-2 text-xs text-muted-foreground">
                            Fecha de regreso
                          </p>

                          <p className="mt-1 text-sm font-semibold text-foreground">
                            {formatDate(viaje.fecha_fin)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Wallet className="mt-0.5 size-5 shrink-0 text-primary" />

                        <div>
                          <p className="text-xs text-muted-foreground">
                            Presupuesto estimado
                          </p>

                          <p className="mt-1 text-lg font-bold text-foreground">
                            {formatCurrency(viaje.presupuesto)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-border pt-5">
                      {destino?.id && (
                        <Link
                          href={`/destinos/${destino.id}`}
                          className="inline-flex items-center justify-center rounded-lg bg-primary/10 px-3 py-2 text-sm font-semibold text-primary transition hover:bg-primary/20"
                        >
                          Ver destino
                        </Link>
                      )}

                      <Link
                        href={`/viajes/${viaje.id}/editar`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-foreground transition hover:bg-muted"
                      >
                        <Pencil className="size-4" />
                        Editar
                      </Link>

                      <DeleteTripButton viajeId={viaje.id} />

                      <span className="ml-auto text-xs text-muted-foreground">
                        Viaje #{viaje.id}
                      </span>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="mt-10 rounded-3xl border border-dashed border-border bg-card px-6 py-20 text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10">
              <MapPin className="size-7 text-primary" />
            </div>

            <h2 className="mt-6 font-display text-2xl font-extrabold text-foreground">
              Todavía no tienes viajes
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              Explora nuestros destinos y empieza a planear tu próxima aventura.
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
  if (!date) return 'Sin fecha'

  return new Intl.DateTimeFormat('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T12:00:00Z`))
}

function formatCurrency(amount: number | null) {
  if (amount === null || amount === undefined) {
    return 'No definido'
  }

  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(amount)
}
