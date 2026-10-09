import { Mail, MapPin, Phone } from 'lucide-react'
import { Logo } from '@/components/logo'

const columns = [
  {
    title: 'Explorar',
    links: [
      { label: 'Inicio', href: '#inicio' },
      { label: 'Destinos', href: '#destinos' },
      { label: 'Viajes', href: '#viajes' },
      { label: 'Sobre nosotros', href: '#nosotros' },
    ],
  },
  {
    title: 'Recursos',
    links: [
      { label: 'Guías de viaje', href: '#' },
      { label: 'Preguntas frecuentes', href: '#' },
      { label: 'Términos y condiciones', href: '#' },
      { label: 'Privacidad', href: '#' },
    ],
  },
]

const socials = ['Instagram', 'TikTok', 'YouTube', 'X']

export function SiteFooter() {
  return (
    <footer id="nosotros" className="scroll-mt-20 bg-foreground text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-2 md:px-8 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
        <div>
          <Logo light />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/70">
            WayTrip es la plataforma para descubrir destinos turísticos y planificar tus viajes de forma simple,
            visual y colaborativa.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Redes sociales">
            {socials.map((social) => (
              <li key={social}>
                <a
                  href="#"
                  className="inline-flex rounded-full px-4 py-2 text-xs font-semibold text-white/85 ring-1 ring-white/20 transition-colors hover:bg-white hover:text-foreground"
                >
                  {social}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">{column.title}</h3>
            <ul className="mt-5 flex flex-col gap-3">
              {column.links.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-white/70 transition-colors hover:text-white">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Contacto</h3>
          <ul className="mt-5 flex flex-col gap-4 text-sm text-white/70">
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-[oklch(0.85_0.12_168)]" aria-hidden="true" />
              <a href="mailto:hola@waytrip.com" className="hover:text-white">
                hola@waytrip.com
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-[oklch(0.85_0.12_168)]" aria-hidden="true" />
              <a href="tel:+573001234567" className="hover:text-white">
                +57 300 123 4567
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-[oklch(0.85_0.12_168)]" aria-hidden="true" />
              <span>Bogotá, Colombia</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-6 text-xs text-white/60 md:flex-row md:px-8">
          <p>© {new Date().getFullYear()} WayTrip. Todos los derechos reservados.</p>
          <p>Hecho para viajeros curiosos.</p>
        </div>
      </div>
    </footer>
  )
}
