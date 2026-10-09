import Image from 'next/image'
import { CalendarCheck, Compass, Luggage, MapPinned, CheckCircle2 } from 'lucide-react'
import { SectionHeading } from '@/components/section-heading'

const steps = [
  { icon: Compass, title: 'Explora', description: 'Descubre destinos interesantes en todo el mundo.' },
  { icon: MapPinned, title: 'Elige', description: 'Consulta información sobre lugares y actividades.' },
  { icon: CalendarCheck, title: 'Organiza', description: 'Construye tu plan de viaje día a día.' },
  { icon: Luggage, title: 'Viaja', description: 'Disfruta de tu experiencia sin preocupaciones.' },
]

const itinerary = [
  { day: 'Día 1', title: 'Llegada y casco antiguo', done: true },
  { day: 'Día 2', title: 'Museos y miradores', done: true },
  { day: 'Día 3', title: 'Excursión a la costa', done: false },
]

export function PlanSection() {
  return (
    <section id="viajes" className="scroll-mt-20 bg-secondary/60 py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-5 md:px-8 lg:grid-cols-2">
        <div>
          <SectionHeading
            eyebrow="Planifica tu viaje"
            title="Del sueño al itinerario en cuatro pasos"
            description="WayTrip reúne todo lo que necesitas para pasar de la inspiración a un plan claro y organizado."
          />

          <ol className="mt-10 grid gap-4 sm:grid-cols-2">
            {steps.map((step, index) => (
              <li
                key={step.title}
                className="group relative rounded-2xl bg-card p-6 shadow-sm ring-1 ring-border/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10"
              >
                <span className="absolute right-5 top-5 font-display text-3xl font-extrabold text-secondary">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <step.icon className="size-6" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-bold text-foreground">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="relative mx-auto w-full max-w-lg">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-2xl">
            <Image
              src="/images/roma.png"
              alt="El Coliseo de Roma al atardecer"
              fill
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover"
            />
          </div>

          <div className="absolute -bottom-8 left-4 right-4 rounded-2xl bg-card p-5 shadow-xl ring-1 ring-border/70 sm:-left-8 sm:right-auto sm:w-72">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Mi viaje</p>
                <p className="font-display text-base font-bold text-foreground">Roma, Italia</p>
              </div>
              <span className="rounded-full bg-accent/15 px-2.5 py-1 text-xs font-semibold text-accent">3 días</span>
            </div>
            <ul className="mt-4 flex flex-col gap-3">
              {itinerary.map((item) => (
                <li key={item.day} className="flex items-center gap-3">
                  <CheckCircle2
                    className={item.done ? 'size-5 text-accent' : 'size-5 text-border'}
                    aria-hidden="true"
                  />
                  <span className="flex flex-col">
                    <span className="text-xs text-muted-foreground">{item.day}</span>
                    <span className="text-sm font-medium text-foreground">{item.title}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="absolute -right-3 top-8 hidden rounded-2xl bg-card px-4 py-3 shadow-xl ring-1 ring-border/70 sm:block">
            <p className="text-xs text-muted-foreground">Lugares guardados</p>
            <p className="font-display text-2xl font-extrabold text-primary">12</p>
          </div>
        </div>
      </div>
    </section>
  )
}
