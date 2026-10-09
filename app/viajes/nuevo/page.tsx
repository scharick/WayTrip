import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, CalendarDays, Wallet } from 'lucide-react'
import { notFound, redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

export default async function NuevoViajePage({
  searchParams,
}: {
  searchParams: Promise<{ destino?: string }>
}) {
  const params = await searchParams
  const destinoId = params.destino

  if (!destinoId) {
    redirect('/#destinos')
  }

  const supabase = await createClient()

  // Comprobar que el usuario haya iniciado sesión
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/login?redirect=/viajes/nuevo?destino=${destinoId}`)
  }

  // Buscar el destino seleccionado
  const { data: destino, error } = await supabase
    .from('destinos')
    .select('*')
    .eq('id', destinoId)
    .single()

  if (error || !destino) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-secondary/40 px-5 py-10 md:px-8 md:py-14">
      <div className="mx-auto max-w-5xl">
        {/* Volver */}
        <Link
          href={`/destinos/${destino.id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-4" />
          Volver al destino
        </Link>

        <div className="mt-8 overflow-hidden rounded-3xl border border-border bg-card shadow-xl shadow-primary/5">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
            
            {/* Destino seleccionado */}
            <div className="relative min-h-[300px] overflow-hidden lg:min-h-[650px]">
              <Image
                src={destino.imagen_url}
                alt={`${destino.ciudad}, ${destino.pais}`}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-7 text-white sm:p-9">
                <span className="rounded-full bg-white/20 px-3 py-1.5 text-xs font-semibold backdrop-blur-md">
                  {destino.categoria}
                </span>

                <h1 className="mt-4 font-display text-4xl font-extrabold">
                  {destino.ciudad}
                </h1>

                <p className="mt-2 text-white/85">
                  {destino.pais}
                </p>
              </div>
            </div>

            {/* Formulario */}
            <section className="p-6 sm:p-10 lg:p-14">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">
                Planifica tu viaje
              </p>

              <h2 className="mt-3 font-display text-3xl font-extrabold text-foreground sm:text-4xl">
                Tu próxima aventura empieza aquí
              </h2>

              <p className="mt-4 leading-relaxed text-muted-foreground">
                Completa los datos de tu viaje a {destino.ciudad}.
              </p>

              <form
                action="/api/viajes"
                method="POST"
                className="mt-8 flex flex-col gap-5"
              >
                <input
                  type="hidden"
                  name="destino_id"
                  value={destino.id}
                />

                <div>
                  <label
                    htmlFor="fecha_inicio"
                    className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground"
                  >
                    <CalendarDays className="size-4 text-primary" />
                    Fecha de inicio
                  </label>

                  <input
                    id="fecha_inicio"
                    name="fecha_inicio"
                    type="date"
                    required
                    className="h-12 w-full rounded-xl border border-input bg-background px-4 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="fecha_fin"
                    className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground"
                  >
                    <CalendarDays className="size-4 text-primary" />
                    Fecha de regreso
                  </label>

                  <input
                    id="fecha_fin"
                    name="fecha_fin"
                    type="date"
                    required
                    className="h-12 w-full rounded-xl border border-input bg-background px-4 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="presupuesto"
                    className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground"
                  >
                    <Wallet className="size-4 text-primary" />
                    Presupuesto estimado
                  </label>

                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
                      $
                    </span>

                    <input
                      id="presupuesto"
                      name="presupuesto"
                      type="number"
                      min="0"
                      step="1000"
                      placeholder="Ej. 2500000"
                      className="h-12 w-full rounded-xl border border-input bg-background pl-9 pr-4 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                    />
                  </div>

                  <p className="mt-2 text-xs text-muted-foreground">
                    Puedes dejar este campo vacío si todavía no tienes un
                    presupuesto definido.
                  </p>
                </div>

                <button
                  type="submit"
                  className="mt-3 h-12 rounded-xl bg-primary px-5 font-semibold text-primary-foreground shadow-lg shadow-primary/15 transition hover:-translate-y-0.5 hover:bg-primary/90"
                >
                  Crear mi viaje
                </button>
              </form>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}

