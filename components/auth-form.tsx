
'use client'

import Link from 'next/link'
import { Eye, EyeOff, LockKeyhole, Mail, UserRound } from 'lucide-react'
import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Logo } from '@/components/logo'
import { createClient } from '@/lib/supabase/client'

export type AuthMode = 'login' | 'registro'

export function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter()
  const supabase = createClient()

  const isLogin = mode === 'login'

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setError('')
    setSuccess('')
    setIsLoading(true)

    const form = new FormData(event.currentTarget)

    const name = String(form.get('name') || '').trim()
    const email = String(form.get('email') || '').trim()
    const password = String(form.get('password') || '')
    const confirmation = String(form.get('confirmPassword') || '')

    try {
      if (!email || !password) {
        setError('Por favor completa todos los campos.')
        return
      }

      if (!isLogin) {
        if (!name) {
          setError('Por favor escribe tu nombre.')
          return
        }

        if (password !== confirmation) {
          setError('Las contraseñas no coinciden.')
          return
        }

        if (password.length < 6) {
          setError('La contraseña debe tener al menos 6 caracteres.')
          return
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            },
          },
        })

        if (error) {
          setError(error.message)
          return
        }

        if (data.session) {
          router.push('/')
          router.refresh()
          return
        }

        setSuccess(
          'Cuenta creada correctamente. Revisa tu correo para confirmar tu cuenta.'
        )

        return
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError('Correo o contraseña incorrectos.')
        return
      }

      router.push('/')
      router.refresh()
    } catch {
      setError('Ocurrió un error. Inténtalo nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-secondary/45 px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-3xl border border-border/70 bg-card shadow-xl shadow-primary/5 lg:grid-cols-[0.9fr_1.1fr]">
          
          <div className="relative hidden min-h-[650px] overflow-hidden bg-primary p-10 lg:flex lg:flex-col lg:justify-between">
            <div className="absolute inset-0 bg-[url('/images/hero.png')] bg-cover bg-center opacity-35" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-accent/75" />

            <div className="relative">
              <Logo light />
            </div>

            <div className="relative max-w-sm text-white">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
                Tu próxima aventura
              </p>

              <h1 className="font-display text-4xl font-extrabold leading-tight">
                El mundo espera por ti.
              </h1>

              <p className="mt-5 leading-relaxed text-white/80">
                Explora destinos y crea planes de viaje que se sientan tan
                increíbles como el destino.
              </p>
            </div>
          </div>

          <section
            className="flex flex-col justify-center p-6 sm:p-10 lg:p-14"
            aria-labelledby="auth-title"
          >
            <div className="mb-8 lg:hidden">
              <Logo />
            </div>

            <div className="max-w-md">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-accent">
                WayTrip
              </p>

              <h2
                id="auth-title"
                className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
              >
                {isLogin ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}
              </h2>

              <p className="mt-3 leading-relaxed text-muted-foreground">
                {isLogin
                  ? 'Inicia sesión para continuar planeando tus próximas aventuras.'
                  : 'Empieza a planear viajes memorables a tu manera.'}
              </p>

              <form
                className="mt-8 flex flex-col gap-5"
                onSubmit={handleSubmit}
                noValidate
              >
                {!isLogin && (
                  <AuthInput
                    id="name"
                    name="name"
                    label="Nombre"
                    placeholder="Tu nombre"
                    icon={<UserRound aria-hidden="true" />}
                    required
                  />
                )}

                <AuthInput
                  id="email"
                  name="email"
                  type="email"
                  label="Correo electrónico"
                  placeholder="tu@email.com"
                  icon={<Mail aria-hidden="true" />}
                  required
                />

                <AuthInput
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  label="Contraseña"
                  placeholder="••••••••"
                  icon={<LockKeyhole aria-hidden="true" />}
                  required
                  minLength={6}
                  action={
                    <PasswordToggle
                      visible={showPassword}
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  }
                />

                {!isLogin && (
                  <AuthInput
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmation ? 'text' : 'password'}
                    label="Confirmar contraseña"
                    placeholder="••••••••"
                    icon={<LockKeyhole aria-hidden="true" />}
                    required
                    minLength={6}
                    action={
                      <PasswordToggle
                        visible={showConfirmation}
                        onClick={() =>
                          setShowConfirmation(!showConfirmation)
                        }
                      />
                    }
                  />
                )}

                {error && (
                  <p
                    role="alert"
                    className="rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive"
                  >
                    {error}
                  </p>
                )}

                {success && (
                  <p
                    role="status"
                    className="rounded-xl bg-primary/10 px-4 py-3 text-sm font-medium text-primary"
                  >
                    {success}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-1 inline-flex h-12 items-center justify-center rounded-xl bg-primary px-5 font-semibold text-primary-foreground shadow-lg shadow-primary/15 transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isLoading
                    ? 'Cargando…'
                    : isLogin
                      ? 'Iniciar sesión'
                      : 'Crear cuenta'}
                </button>
              </form>

              <p className="mt-7 text-center text-sm text-muted-foreground">
                {isLogin
                  ? '¿No tienes una cuenta?'
                  : '¿Ya tienes una cuenta?'}{' '}

                <Link
                  href={isLogin ? '/registro' : '/login'}
                  className="font-semibold text-primary underline-offset-4 hover:underline"
                >
                  {isLogin ? 'Regístrate' : 'Inicia sesión'}
                </Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

function AuthInput({
  id,
  name,
  label,
  icon,
  action,
  ...props
}: {
  id: string
  name: string
  label: string
  icon: React.ReactNode
  action?: React.ReactNode
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label
      htmlFor={id}
      className="flex flex-col gap-2 text-sm font-semibold text-foreground"
    >
      {label}

      <span className="relative flex items-center">
        <span className="pointer-events-none absolute left-4 text-muted-foreground [&_svg]:size-[18px]">
          {icon}
        </span>

        <input
          id={id}
          name={name}
          className="h-12 w-full rounded-xl border border-input bg-background px-11 text-base font-normal outline-none transition placeholder:text-muted-foreground/65 focus:border-primary focus:ring-4 focus:ring-primary/10"
          {...props}
        />

        {action && <span className="absolute right-3">{action}</span>}
      </span>
    </label>
  )
}

function PasswordToggle({
  visible,
  onClick,
}: {
  visible: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={
        visible ? 'Ocultar contraseña' : 'Mostrar contraseña'
      }
      className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
    >
      {visible ? (
        <EyeOff aria-hidden="true" />
      ) : (
        <Eye aria-hidden="true" />
      )}
    </button>
  )
}

