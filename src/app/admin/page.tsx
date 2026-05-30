import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Heart, ShoppingBag, Briefcase, Users, Clock, ArrowRight } from 'lucide-react'

function formatRupiah(n: number) {
  if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(1)}M`
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(0)}jt`
  return `Rp ${n.toLocaleString('id-ID')}`
}

export default async function AdminPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <p className="font-medium">Supabase belum dikonfigurasi.</p>
        <p className="text-sm mt-1">Isi kredensial di file <code>.env.local</code> untuk mulai.</p>
      </div>
    )
  }
  const supabase = await createClient()

  const [
    { count: totalUsers },
    { count: pendingCampaigns },
    { count: pendingBusinesses },
    { count: pendingJobs },
    { count: activeCampaigns },
    { data: donationData },
    { count: activeBusinesses },
    { count: activeJobs },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('campaigns').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('businesses').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('campaigns').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('donations').select('amount').eq('status', 'paid'),
    supabase.from('businesses').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'active'),
  ])

  const totalDonasi = (donationData ?? []).reduce((sum, d) => sum + (d.amount ?? 0), 0)
  const pendingTotal = (pendingCampaigns ?? 0) + (pendingBusinesses ?? 0) + (pendingJobs ?? 0)

  const stats = [
    { label: 'Total Jemaat', value: totalUsers ?? 0, icon: Users, color: 'text-blue-600 bg-blue-50' },
    { label: 'Dana Terkumpul', value: formatRupiah(totalDonasi), icon: Heart, color: 'text-red-600 bg-red-50' },
    { label: 'Usaha Aktif', value: activeBusinesses ?? 0, icon: ShoppingBag, color: 'text-green-600 bg-green-50' },
    { label: 'Lowongan Aktif', value: activeJobs ?? 0, icon: Briefcase, color: 'text-purple-600 bg-purple-50' },
  ]

  const pending = [
    { label: 'Kampanye', count: pendingCampaigns ?? 0, icon: Heart },
    { label: 'Usaha UMKM', count: pendingBusinesses ?? 0, icon: ShoppingBag },
    { label: 'Lowongan', count: pendingJobs ?? 0, icon: Briefcase },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard Admin</h1>
        <p className="text-muted-foreground text-sm mt-1">Selamat datang di panel moderasi GKI Kelapa Cengkir</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pending Review */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4 text-yellow-500" />
            Menunggu Review
            {pendingTotal > 0 && (
              <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded-full">
                {pendingTotal} item
              </span>
            )}
          </CardTitle>
          <Link href="/admin/moderasi" className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}>
            Lihat Semua <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Link>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-3 gap-4">
            {pending.map(p => (
              <div key={p.label} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <p.icon className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-lg font-bold">{p.count}</p>
                  <p className="text-xs text-muted-foreground">{p.label}</p>
                </div>
              </div>
            ))}
          </div>
          {pendingTotal === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Tidak ada item yang menunggu review. ✓
            </p>
          )}
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/galang-dana" className="block p-4 border rounded-xl bg-white hover:shadow-sm transition-shadow">
          <Heart className="h-5 w-5 text-primary mb-2" />
          <p className="font-medium text-sm">Kampanye Aktif</p>
          <p className="text-2xl font-bold mt-1">{activeCampaigns ?? 0}</p>
        </Link>
        <Link href="/umkm" className="block p-4 border rounded-xl bg-white hover:shadow-sm transition-shadow">
          <ShoppingBag className="h-5 w-5 text-primary mb-2" />
          <p className="font-medium text-sm">Usaha Aktif</p>
          <p className="text-2xl font-bold mt-1">{activeBusinesses ?? 0}</p>
        </Link>
        <Link href="/lowongan" className="block p-4 border rounded-xl bg-white hover:shadow-sm transition-shadow">
          <Briefcase className="h-5 w-5 text-primary mb-2" />
          <p className="font-medium text-sm">Lowongan Aktif</p>
          <p className="text-2xl font-bold mt-1">{activeJobs ?? 0}</p>
        </Link>
      </div>
    </div>
  )
}
