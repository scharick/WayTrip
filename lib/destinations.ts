export type Destination = {
  slug: string
  city: string
  country: string
  description: string
  image: string
  category: string
  rating: number
}

export const destinations: Destination[] = []

export type Experience = {
  name: string
  description: string
  image: string
  count: number
}

export const experiences: Experience[] = [
  {
    name: 'Playas',
    description: 'Arena blanca y aguas turquesa',
    image: '/images/playas.png',
    count: 128,
  },
  {
    name: 'Ciudades',
    description: 'Cultura urbana y vida nocturna',
    image: '/images/ciudades.png',
    count: 214,
  },
  {
    name: 'Naturaleza',
    description: 'Selvas, cascadas y montañas',
    image: '/images/naturaleza.png',
    count: 96,
  },
  {
    name: 'Cultura',
    description: 'Historia, arte y tradiciones',
    image: '/images/cultura.png',
    count: 152,
  },
  {
    name: 'Aventura',
    description: 'Rutas, cumbres y adrenalina',
    image: '/images/aventura.png',
    count: 74,
  },
]