import { NextResponse } from 'next/server'

import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()

  // Comprobar que haya un usuario autenticado
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(
      new URL('/login', request.url)
    )
  }

  // Obtener los datos del formulario
  const formData = await request.formData()

  const destinoId = String(formData.get('destino_id') || '')
  const fechaInicio = String(formData.get('fecha_inicio') || '')
  const fechaFin = String(formData.get('fecha_fin') || '')
  const presupuestoValue = String(
    formData.get('presupuesto') || ''
  )

  // Validar campos obligatorios
  if (!destinoId || !fechaInicio || !fechaFin) {
    return NextResponse.redirect(
      new URL('/viajes/nuevo?error=campos', request.url)
    )
  }

  // Validar fechas
  if (fechaFin < fechaInicio) {
    return NextResponse.redirect(
      new URL(
        `/viajes/nuevo?destino=${destinoId}&error=fechas`,
        request.url
      )
    )
  }

  // Convertir presupuesto
  let presupuesto: number | null = null

  if (presupuestoValue) {
    const numeroPresupuesto = Number(presupuestoValue)

    if (
      Number.isNaN(numeroPresupuesto) ||
      numeroPresupuesto < 0
    ) {
      return NextResponse.redirect(
        new URL(
          `/viajes/nuevo?destino=${destinoId}&error=presupuesto`,
          request.url
        )
      )
    }

    presupuesto = numeroPresupuesto
  }

  // Convertir el ID del destino
  const destinoIdNumero = Number(destinoId)

  if (Number.isNaN(destinoIdNumero)) {
    return NextResponse.redirect(
      new URL('/#destinos', request.url)
    )
  }

  // Guardar el viaje en Supabase
  const { error } = await supabase
    .from('viajes')
    .insert({
      usuario_id: user.id,
      destino_id: destinoIdNumero,
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      presupuesto: presupuesto,
    })

  if (error) {
    console.error('ERROR AL CREAR VIAJE:', error)

    return NextResponse.redirect(
      new URL(
        `/viajes/nuevo?destino=${destinoId}&error=servidor`,
        request.url
      )
    )
  }

  // Viaje creado correctamente
  return NextResponse.redirect(
    new URL('/viajes?creado=true', request.url)
  )
}

