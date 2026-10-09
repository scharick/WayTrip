import { Suspense } from 'react'
import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import { DestinationsSection } from '@/components/destinations-section'
import { PlanSection } from '@/components/plan-section'
import { InspirationSection } from '@/components/inspiration-section'
import { CtaSection } from '@/components/cta-section'
import { SiteFooter } from '@/components/site-footer'
import { createClient } from '@/lib/supabase/server'
import type { Destination } from '@/lib/destinations'

export default async function Home() {
  const supabase = await createClient()

  const { data: destinos, error } = await supabase
    .from('destinos')
    .select('*')

  if (error) {
    console.error('ERROR SUPABASE:', error.message)
    console.error('CODIGO:', error.code)
    console.error('DETALLES:', error.details)
    console.error('HINT:', error.hint)
  }

const destinations: Destination[] = (destinos ?? []).map((destino) => ({
  slug: String(destino.id),
  city: destino.ciudad,
  country: destino.pais,
  description: destino.descripcion,
  image: destino.imagen_url,
  category: destino.categoria,
  rating: destino.calificacion ?? 5, 
}))

  return (
    <>
      <SiteHeader />

      <main>
        <Hero destinos={destinations} />

        <Suspense>
          <DestinationsSection destinos={destinations} />
        </Suspense>

        <PlanSection />
        <InspirationSection />
        <CtaSection />
      </main>

      <SiteFooter />
    </>
  )
}