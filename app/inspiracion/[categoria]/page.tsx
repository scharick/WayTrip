
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight, MapPin, Star } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

const categorias: Record<string, { nombre: string; descripcion: string; valores: string[] }> = {
  playas: {
    nombre: 'Playas',
    descripcion: 'Descubre playas paradisíacas y disfruta del mar.',
    valores: ['playa', 'playas'],
  },
  ciudades: {
    nombre: 'Ciudades',
    descripcion: 'Explora grandes ciudades, su cultura y su vida urbana.',
    valores: ['ciudad', 'ciudades'],
  },
  naturaleza: {
    nombre: 'Naturaleza',
    descripcion: 'Encuentra selvas, cascadas, montañas y paisajes increíbles.',
    valores: ['naturaleza'],
  },
  cultura: {
    nombre: 'Cultura',
    descripcion: 'Descubre la historia, el arte y las tradiciones de cada lugar.',
    valores: ['cultura'],
  },
  aventura: {
    nombre: 'Aventura',
    descripcion: 'Encuentra destinos para vivir experiencias llenas de adrenalina.',
    valores: ['aventura'],
  },
}

function normalizar(valor: string) {
  return valor
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
}

export default async function CategoriaPage({
  params,
}: {
  params: Promise<{ categoria: string }>
}) {
  const { categoria } = await params
  const seleccionada = categorias[categoria.toLowerCase()]

  if (!seleccionada) {
    notFound()
  }

  const supabase = await createClient()

  const { data: destinos, error } = await supabase
    .from('destinos')
    .select('id, nombre, descripcion, ciudad, pais, imagen_url, categoria, calificacion')

  if (error) {
    console.error('Error al consultar destinos:', error)

    return (
      <main className="mx-auto min-h-screen max-w-6xl px-5 py-20">
        <p className="text-lg font-semibold">
          No pudimos cargar los destinos.
        </p>
        <Link href="/#destinos" className="mt-4 inline-block text-primary">
          Volver a explorar
        </Link>
      </main>
    )
  }

  const resultados = (destinos ?? []).filter((destino) =>
    seleccionada.valores.includes(normalizar(destino.categoria ?? ''))
  )

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-20">
        <Link
          href="/#destinos"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-primary"
        >
          <ArrowLeft className="size-4" />
          Volver a WayTrip
        </Link>

        <div className="mt-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Inspiración
          </p>

          <h1 className="mt-3 font-display text-4xl font-extrabold text-foreground md:text-5xl">
            Destinos de {seleccionada.nombre.toLowerCase()}
          </h1>

          <p className="mt-4 max-w-2xl text-muted-foreground">
            {seleccionada.descripcion}
          </p>

          <p className="mt-5 text-sm text-muted-foreground">
            {resultados.length}{' '}
            {resultados.length === 1 ? 'destino encontrado' : 'destinos encontrados'}
          </p>
        </div>

        {resultados.length > 0 ? (
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {resultados.map((destino) => (
              <li key={destino.id}>
                <article className="group flex h-full flex-col overflow-hidden rounded-3xl bg-card shadow-sm ring-1 ring-border/70 transition hover:-translate-y-1 hover:shadow-xl">
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    {destino.imagen_url ? (
                      <Image
                        src={destino.imagen_url}
                        alt={`${destino.ciudad}, ${destino.pais}`}
                        fill
                        unoptimized
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <MapPin className="size-10 text-muted-foreground" />
                      </div>
                    )}

                    {destino.categoria && (
                      <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-foreground">
                        {destino.categoria}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="size-4 text-primary" />
                      {destino.pais}
                    </p>

                    <h2 className="mt-2 font-display text-2xl font-bold text-foreground">
                      {destino.ciudad || destino.nombre}
                    </h2>

                    {destino.calificacion != null && (
                      <p className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="size-4 fill-amber-400 text-amber-400" />
                        {destino.calificacion}
                      </p>
                    )}

                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {destino.descripcion}
                    </p>

                    <Link
                      href={`/destinos/${destino.id}`}
                      className="mt-5 inline-flex w-fit items-center gap-2 text-sm font-semibold text-primary hover:text-accent"
                    >
                      Ver destino
                      <ArrowUpRight className="size-4" />
                    </Link>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-10 rounded-3xl border border-dashed border-border bg-muted/40 px-6 py-16 text-center">
            <MapPin className="mx-auto size-10 text-muted-foreground" />

            <h2 className="mt-4 text-xl font-bold text-foreground">
              Todavía no hay destinos de esta categoría
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Cuando agregues destinos con esta categoría en Supabase, aparecerán aquí.
            </p>

            <Link
              href="/#destinos"
              className="mt-6 inline-flex rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground"
            >
              Explorar todos los destinos
            </Link>
          </div>
        )}
      </section>
    </main>
  )
}
