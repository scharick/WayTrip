
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { experiences } from '@/lib/destinations'
import { SectionHeading } from '@/components/section-heading'
import { cn } from '@/lib/utils'

const layout = [
  'md:col-span-2 md:row-span-2',
  'md:col-span-2',
  'md:col-span-1',
  'md:col-span-1',
  'sm:col-span-2 md:col-span-4',
]

const categorySlugs: Record<string, string> = {
  Playas: 'playas',
  Ciudades: 'ciudades',
  Naturaleza: 'naturaleza',
  Cultura: 'cultura',
  Aventura: 'aventura',
}

export function InspirationSection() {
  return (
    <section
      className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32"
      aria-labelledby="inspiracion"
    >
      <SectionHeading
        eyebrow="Inspiración"
        title="¿Qué tipo de viajero eres hoy?"
        description="Encuentra experiencias según tu estilo: relájate frente al mar, piérdete en una gran ciudad o sal en busca de adrenalina."
        align="center"
      />

      <ul className="mt-14 grid auto-rows-[220px] grid-cols-1 gap-4 sm:grid-cols-2 md:auto-rows-[240px] md:grid-cols-4">
        {experiences.map((experience, index) => {
          const slug = categorySlugs[experience.name]

          return (
            <li
              key={experience.name}
              className={cn(
                'sm:col-span-1',
                layout[index],
                index === 0 && 'sm:col-span-2'
              )}
            >
              <Link
                href={`/inspiracion/${slug}`}
                className="group relative flex h-full overflow-hidden rounded-3xl"
                aria-label={`Explorar destinos de ${experience.name}`}
              >
                <Image
                  src={experience.image}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />

                <span className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />

                <span className="relative mt-auto flex w-full items-end justify-between gap-4 p-6">
                  <span>
                    <span className="block text-xs font-medium uppercase tracking-wider text-white/80">
                      {experience.count} destinos
                    </span>

                    <span className="mt-1 block font-display text-2xl font-bold text-white md:text-3xl">
                      {experience.name}
                    </span>

                    <span className="mt-1 block text-sm text-white/85">
                      {experience.description}
                    </span>
                  </span>

                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/20 text-white ring-1 ring-white/40 backdrop-blur-md transition-all group-hover:bg-white group-hover:text-foreground">
                    <ArrowUpRight className="size-5" aria-hidden="true" />
                  </span>
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
