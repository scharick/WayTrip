
'use client'

import { Trash2 } from 'lucide-react'

export function DeleteTripButton({
  viajeId,
}: {
  viajeId: number | string
}) {
  return (
    <form
      action="/api/viajes/eliminar"
      method="POST"
      onSubmit={(event) => {
        const confirmar = window.confirm(
          '¿Estás segura de que quieres eliminar este viaje? Esta acción no se puede deshacer.'
        )

        if (!confirmar) {
          event.preventDefault()
        }
      }}
    >
      <input
        type="hidden"
        name="viaje_id"
        value={viajeId}
      />

      <button
        type="submit"
        className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-500/10"
      >
        <Trash2 className="size-4" />
        Eliminar
      </button>
    </form>
  )
}
