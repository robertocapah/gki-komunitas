import { notFound } from 'next/navigation'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Calendar, Users, Heart } from 'lucide-react'
import { DonationForm } from './DonationForm'
import type { Campaign, Donation } from '@/types'

function formatRupiah(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function CampaignDetailPage({ params }: PageProps) {
  const { slug } = await params
  if (!isSupabaseConfigured()) notFound()
  const supabase = await createClient()

  const [{ data: campaign }, { data: { user } }] = await Promise.all([
    supabase
      .from('campaigns')
      .select('*, creator:profiles(id, full_name, avatar_url)')
      .eq('slug', slug)
      .eq('status', 'active')
      .single(),
    supabase.auth.getUser(),
  ])

  if (!campaign) notFound()

  const { data: donations } = await supabase
    .from('donations')
    .select('id, donor_name, amount, message, is_anonymous, created_at')
    .eq('campaign_id', campaign.id)
    .eq('status', 'paid')
    .order('created_at', { ascending: false })
    .limit(10)

  const c = campaign as Campaign
  const percent = Math.min(Math.round((c.collected_amount / c.target_amount) * 100), 100)
  const daysLeft = c.end_date
    ? Math.max(0, Math.ceil((new Date(c.end_date).getTime() - Date.now()) / 86400000))
    : null

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {c.image_url && (
            <div className="aspect-[16/9] rounded-xl overflow-hidden bg-muted">
              <img src={c.image_url} alt={c.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div>
            <span className="text-xs font-medium bg-primary/10 text-primary px-2.5 py-1 rounded-full">
              {c.category}
            </span>
            <h1 className="text-2xl font-bold mt-3 leading-snug">{c.title}</h1>
            <p className="text-muted-foreground mt-2">{c.description}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
              {(c.creator as any)?.full_name?.charAt(0) ?? 'J'}
            </div>
            <div>
              <p className="text-sm font-medium">{(c.creator as any)?.full_name ?? 'Jemaat'}</p>
              <p className="text-xs text-muted-foreground">Penggalang dana · {formatDate(c.created_at)}</p>
            </div>
          </div>

          <Separator />

          <div>
            <h2 className="font-semibold text-lg mb-3">Cerita</h2>
            <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-line leading-relaxed">
              {c.story}
            </div>
          </div>

          <Separator />

          {/* Donors */}
          <div>
            <h2 className="font-semibold text-lg mb-4">
              {c.donor_count} Donatur
            </h2>
            {(donations ?? []).length > 0 ? (
              <div className="space-y-3">
                {(donations as Donation[]).map(d => (
                  <div key={d.id} className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <Heart className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-medium">{d.is_anonymous ? 'Anonim' : d.donor_name}</span>
                        <span className="text-sm text-primary font-semibold">{formatRupiah(d.amount)}</span>
                      </div>
                      {d.message && <p className="text-xs text-muted-foreground mt-0.5">{d.message}</p>}
                      <p className="text-xs text-muted-foreground">{formatDate(d.created_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Belum ada donatur. Jadilah yang pertama!</p>
            )}
          </div>
        </div>

        {/* Sidebar — Progress + Donation Form */}
        <div className="space-y-4">
          <div className="border rounded-xl p-5 space-y-4 sticky top-20">
            <div>
              <p className="text-2xl font-bold">{formatRupiah(c.collected_amount)}</p>
              <p className="text-sm text-muted-foreground">terkumpul dari {formatRupiah(c.target_amount)}</p>
            </div>

            <Progress value={percent} className="h-2" />

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-muted/50 rounded-lg p-2">
                <div className="flex items-center justify-center gap-1 text-lg font-bold">
                  <Users className="h-4 w-4 text-primary" />
                  {c.donor_count}
                </div>
                <p className="text-xs text-muted-foreground">Donatur</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-2">
                <div className="flex items-center justify-center gap-1 text-lg font-bold">
                  <Calendar className="h-4 w-4 text-primary" />
                  {daysLeft !== null ? daysLeft : '∞'}
                </div>
                <p className="text-xs text-muted-foreground">Hari lagi</p>
              </div>
            </div>

            <Separator />

            <DonationForm campaignId={c.id} user={user ? { id: user.id } : null} />
          </div>
        </div>
      </div>
    </div>
  )
}
