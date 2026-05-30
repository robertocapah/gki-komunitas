import { notFound } from 'next/navigation'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import { Separator } from '@/components/ui/separator'
import { MapPin, MessageCircle, Phone, User, ChevronLeft } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import type { Business } from '@/types'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function BusinessDetailPage({ params }: PageProps) {
  const { slug } = await params
  if (!isSupabaseConfigured()) notFound()
  const supabase = await createClient()

  const { data: business } = await supabase
    .from('businesses')
    .select('*, owner:profiles(id, full_name)')
    .eq('slug', slug)
    .eq('status', 'active')
    .single()

  if (!business) notFound()

  const b = business as Business
  const waNumber = b.whatsapp.replace(/\D/g, '')
  const waUrl = `https://wa.me/${waNumber}`

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Link
        href="/umkm"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ChevronLeft className="h-4 w-4" />
        Kembali ke direktori
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Photo Gallery */}
          {b.image_urls.length > 0 ? (
            <div className={`grid gap-2 ${b.image_urls.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
              {b.image_urls.slice(0, 4).map((url, i) => (
                <div key={i} className={`rounded-xl overflow-hidden bg-muted ${i === 0 && b.image_urls.length > 1 ? 'col-span-2' : ''}`}>
                  <img
                    src={url}
                    alt={`${b.name} foto ${i + 1}`}
                    className="w-full h-48 object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="aspect-video rounded-xl bg-primary/10 flex items-center justify-center">
              <span className="text-6xl font-bold text-primary">{b.name.charAt(0).toUpperCase()}</span>
            </div>
          )}

          <div>
            <span className="text-xs font-medium bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full">
              {b.category}
            </span>
            <h1 className="text-2xl font-bold mt-3">{b.name}</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
              <User className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium">{(b.owner as any)?.full_name ?? 'Jemaat'}</p>
              <p className="text-xs text-muted-foreground">Pemilik Usaha · Jemaat Terverifikasi ✓</p>
            </div>
          </div>

          <Separator />

          <div>
            <h2 className="font-semibold text-lg mb-3">Tentang Usaha</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{b.description}</p>
          </div>

          {b.address && (
            <>
              <Separator />
              <div>
                <h2 className="font-semibold text-lg mb-3">Lokasi</h2>
                <div className="flex items-start gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                  <p>{b.address}</p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Sidebar — Contact */}
        <div>
          <div className="border rounded-xl p-5 space-y-4 sticky top-20">
            <h2 className="font-semibold">Hubungi Pemilik</h2>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants(), 'w-full justify-center gap-2')}
            >
              <MessageCircle className="h-4 w-4" />
              Chat via WhatsApp
            </a>

            <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 shrink-0" />
                <span>{b.whatsapp}</span>
              </div>
            </div>

            <Separator />

            <div className="text-xs text-muted-foreground space-y-1">
              <p className="font-medium text-foreground">Catatan</p>
              <p>Usaha ini dimiliki oleh jemaat GKI Kelapa Cengkir yang telah diverifikasi pengurus gereja.</p>
              <p className="mt-1">Transaksi dilakukan langsung dengan pemilik usaha.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
