
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()

  // Verificar que el usuario haya iniciado sesión
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(
      new URL('/login', request.url)
    )
  }

  // Obtener el ID del viaje enviado por el formulario
  const formData = await request.formData()
  const viajeId = String(formData.get('viaje_id') || '')

  if (!viajeId || !/^\d+$/.test(viajeId)) {
    return NextResponse.redirect(
      new URL('/viajes?error=eliminar', request.url)
    )
  }

  // Eliminar únicamente un viaje que pertenezca al usuario
  const { data, error } = await supabase
    .from('viajes')
    .delete()
    .eq('id', Number(viajeId))
    .eq('usuario_id', user.id)
    .select('id')

  if (error) {
    console.error('ERROR AL ELIMINAR VIAJE:', error)

    return NextResponse.redirect(
      new URL('/viajes?error=eliminar', request.url)
    )
  }

  // Comprobar que realmente se eliminó un viaje
  if (!data || data.length === 0) {
    return NextResponse.redirect(
      new URL('/viajes?error=eliminar', request.url)
    )
  }

  return NextResponse.redirect(
    new URL('/viajes?eliminado=true', request.url)
  )
}
