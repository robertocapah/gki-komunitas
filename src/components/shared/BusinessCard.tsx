import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { MessageCircle } from 'lucide-react'
import type { Business } from '@/types'

interface Props {
  business: Business
}

export function BusinessCard({ business }: Props) {
  const waUrl = `https://wa.me/${business.whatsapp.replace(/\D/g, '')}`

  return (
    <Card className="group hover:shadow-md transition-shadow overflow-hidden h-full">
      <div className="aspect-square bg-muted overflow-hidden">
        {business.image_urls[0] ? (
          <img
            src={business.image_urls[0]}
            alt={business.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold text-3xl">
            {business.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <CardContent className="p-4 flex flex-col gap-2">
        <span className="text-xs font-medium bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full w-fit">
          {business.category}
        </span>
        <Link href={`/umkm/${business.slug}`}>
          <h3 className="font-semibold leading-snug hover:text-primary transition-colors line-clamp-1">
            {business.name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2">{business.description}</p>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto flex items-center gap-1.5 text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
        >
          <MessageCircle className="h-4 w-4" />
          Hubungi via WhatsApp
        </a>
      </CardContent>
    </Card>
  )
}
