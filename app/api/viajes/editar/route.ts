import { NextResponse } from 'next/server'

import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()

  // Verificar usuario
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(
      new URL('/login', request.url)
    )
  }

  const formData = await request.formData()

  const viajeId = String(formData.get('viaje_id') || '')
  const fechaInicio = String(formData.get('fecha_inicio') || '')
  const fechaFin = String(formData.get('fecha_fin') || '')
  const presupuestoValue = String(
    formData.get('presupuesto') || ''
  )

  // Validar campos obligatorios
  if (!viajeId || !fechaInicio || !fechaFin) {
    return NextResponse.redirect(
      new URL('/viajes?error=campos', request.url)
    )
  }

  // Validar fechas
  if (fechaFin < fechaInicio) {
    return NextResponse.redirect(
      new URL(`/viajes/${viajeId}/editar?error=fechas`, request.url)
    )
  }

  // Validar presupuesto
  let presupuesto: number | null = null

  if (presupuestoValue) {
    const numeroPresupuesto = Number(presupuestoValue)

    if (
      Number.isNaN(numeroPresupuesto) ||
      numeroPresupuesto < 0
    ) {
      return NextResponse.redirect(
        new URL(
          `/viajes/${viajeId}/editar?error=presupuesto`,
          request.url
        )
      )
    }

    presupuesto = numeroPresupuesto
  }

  // Actualizar solamente el viaje del usuario actual
  const { error } = await supabase
    .from('viajes')
    .update({
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      presupuesto: presupuesto,
    })
    .eq('id', viajeId)
    .eq('usuario_id', user.id)

  if (error) {
    console.error('ERROR AL EDITAR VIAJE:', error)

    return NextResponse.redirect(
      new URL(
        `/viajes/${viajeId}/editar?error=servidor`,
        request.url
      )
    )
  }

  // Volver a la página de viajes
  return NextResponse.redirect(
    new URL('/viajes?editado=true', request.url)
  )
}