import Image from 'next/image'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

export default async function EditarViajePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const supabase = await createClient()

  // Verificar usuario
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Buscar el viaje del usuario
  const { data: viaje, error } = await supabase
    .from('viajes')
    .select(`
      id,
      destino_id,
      fecha_inicio,
      fecha_fin,
      presupuesto,
      destinos (
        id,
        ciudad,
        pais,
        imagen_url
      )
    `)
    .eq('id', id)
    .eq('usuario_id', user.id)
    .single()

  if (error || !viaje) {
    notFound()
  }

  const destino = Array.isArray(viaje.destinos)
    ? viaje.destinos[0]
    : viaje.destinos

  if (!destino) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex h-20 max-w-4xl items-center px-5 md:px-8">
          <Link
            href="/viajes"
            className="text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
          >
            ← Volver a mis viajes
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-5 py-10 md:px-8 md:py-16">
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="relative h-64">
            <Image
              src={destino.imagen_url}
              alt={`${destino.ciudad}, ${destino.pais}`}
              fill
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

            <div className="absolute bottom-0 left-0 p-6 text-white">
              <p className="text-sm font-medium text-white/80">
                Editando viaje
              </p>

              <h1 className="mt-1 text-3xl font-extrabold">
                {destino.ciudad}
              </h1>

              <p className="mt-1 text-sm text-white/80">
                {destino.pais}
              </p>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <h2 className="text-2xl font-extrabold text-foreground">
              Editar información del viaje
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Modifica las fechas o el presupuesto de tu viaje.
            </p>

            <form
              action="/api/viajes/editar"
              method="POST"
              className="mt-8 space-y-6"
            >
              <input
                type="hidden"
                name="viaje_id"
                value={viaje.id}
              />

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="fecha_inicio"
                    className="mb-2 block text-sm font-semibold text-foreground"
                  >
                    Fecha de inicio
                  </label>

                  <input
                    id="fecha_inicio"
                    name="fecha_inicio"
                    type="date"
                    defaultValue={viaje.fecha_inicio}
                    required
                    className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor="fecha_fin"
                    className="mb-2 block text-sm font-semibold text-foreground"
                  >
                    Fecha de finalización
                  </label>

                  <input
                    id="fecha_fin"
                    name="fecha_fin"
                    type="date"
                    defaultValue={viaje.fecha_fin}
                    required
                    className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="presupuesto"
                  className="mb-2 block text-sm font-semibold text-foreground"
                >
                  Presupuesto estimado
                </label>

                <input
                  id="presupuesto"
                  name="presupuesto"
                  type="number"
                  min="0"
                  step="0.01"
                  defaultValue={viaje.presupuesto ?? ''}
                  placeholder="Ej. 1500000"
                  className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <button
                  type="submit"
                  className="flex h-12 flex-1 items-center justify-center rounded-xl bg-primary px-5 font-semibold text-primary-foreground shadow-lg shadow-primary/15 transition hover:-translate-y-0.5 hover:bg-primary/90"
                >
                  Guardar cambios
                </button>

                <Link
                  href="/viajes"
                  className="flex h-12 items-center justify-center rounded-xl border border-border px-5 font-semibold text-foreground transition hover:bg-secondary"
                >
                  Cancelar
                </Link>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}