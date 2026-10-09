'use client'

import { useEffect, useState } from 'react'
import { Menu, X, LogOut, UserRound } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { cn } from '@/lib/utils'
import { Logo } from '@/components/logo'
import { createClient } from '@/lib/supabase/client'

const links = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Destinos', href: '#destinos' },
  { label: 'Viajes', href: '/viajes' },
  { label: 'Sobre nosotros', href: '#nosotros' },
]

export function SiteHeader() {
  const router = useRouter()
  const supabase = createClient()

  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)

    onScroll()

    window.addEventListener('scroll', onScroll, { passive: true })

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      setUserEmail(user?.email ?? null)
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  async function handleLogout() {
    await supabase.auth.signOut()

    setUserEmail(null)
    setOpen(false)

    router.push('/')
    router.refresh()
  }

  const solid = scrolled || open

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        solid
          ? 'border-b border-border/60 bg-background/90 shadow-sm backdrop-blur-md'
          : 'bg-transparent',
      )}
    >
      <nav
        className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 md:px-8"
        aria-label="Principal"
      >
        <Logo light={!solid} />

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  solid
                    ? 'text-foreground/80 hover:bg-secondary hover:text-primary'
                    : 'text-white/90 hover:bg-white/15 hover:text-white',
                )}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 lg:flex">
          {userEmail ? (
            <>
              <span
                className={cn(
                  'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold',
                  solid
                    ? 'text-foreground'
                    : 'text-white',
                )}
              >
                <UserRound className="size-4" />
                {userEmail}
              </span>

              <button
                type="button"
                onClick={handleLogout}
                className={cn(
                  'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                  solid
                    ? 'text-foreground hover:bg-secondary hover:text-primary'
                    : 'text-white hover:bg-white/15',
                )}
              >
                <LogOut className="size-4" />
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <a
                href="/login"
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                  solid
                    ? 'text-foreground hover:text-primary'
                    : 'text-white hover:bg-white/15',
                )}
              >
                Iniciar sesión
              </a>

              <a
                href="/registro"
                className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/25 transition-all hover:-translate-y-0.5 hover:bg-primary/90"
              >
                Crear cuenta
              </a>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={cn(
            'flex size-10 items-center justify-center rounded-full transition-colors lg:hidden',
            solid
              ? 'text-foreground hover:bg-secondary'
              : 'text-white hover:bg-white/15',
          )}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
        >
          {open ? (
            <X className="size-5" />
          ) : (
            <Menu className="size-5" />
          )}
        </button>
      </nav>

      {open && (
        <div
          id="mobile-menu"
          className="border-t border-border/60 bg-background px-5 pb-6 pt-2 lg:hidden"
        >
          <ul className="flex flex-col">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-3 text-base font-medium text-foreground hover:bg-secondary hover:text-primary"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-4">
            {userEmail ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 rounded-full border border-border px-4 py-3 text-sm font-semibold text-foreground">
                  <UserRound className="size-4" />
                  <span className="truncate">{userEmail}</span>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 rounded-full border border-border px-4 py-3 text-sm font-semibold text-foreground hover:bg-secondary"
                >
                  <LogOut className="size-4" />
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <a
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-full border border-border px-4 py-3 text-center text-sm font-semibold text-foreground hover:bg-secondary"
                >
                  Iniciar sesión
                </a>

                <a
                  href="/registro"
                  onClick={() => setOpen(false)}
                  className="rounded-full bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  Crear cuenta
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

