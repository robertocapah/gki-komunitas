import Link from 'next/link'
import { ArrowRight, Heart, ShoppingBag, Briefcase, Users, TrendingUp, CheckCircle } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'
import { CampaignCard } from '@/components/shared/CampaignCard'
import { BusinessCard } from '@/components/shared/BusinessCard'
import { JobCard } from '@/components/shared/JobCard'
import type { Campaign, Business, Job } from '@/types'

async function getStats() {
  try {
    const supabase = await createClient()
    const [campaigns, donations, businesses, jobs] = await Promise.all([
      supabase.from('campaigns').select('collected_amount').eq('status', 'active'),
      supabase.from('donations').select('id').eq('status', 'paid'),
      supabase.from('businesses').select('id').eq('status', 'active'),
      supabase.from('jobs').select('id').eq('status', 'active'),
    ])
    const totalRaised = (campaigns.data ?? []).reduce((sum, c) => sum + (c.collected_amount ?? 0), 0)
    return {
      totalRaised,
      totalDonations: donations.data?.length ?? 0,
      totalBusinesses: businesses.data?.length ?? 0,
      totalJobs: jobs.data?.length ?? 0,
    }
  } catch {
    return { totalRaised: 0, totalDonations: 0, totalBusinesses: 0, totalJobs: 0 }
  }
}

async function getFeaturedCampaigns(): Promise<Campaign[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('campaigns')
      .select('*, creator:profiles(id, full_name, avatar_url)')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(3)
    return (data as Campaign[]) ?? []
  } catch {
    return []
  }
}

async function getFeaturedBusinesses(): Promise<Business[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('businesses')
      .select('*, owner:profiles(id, full_name)')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(4)
    return (data as Business[]) ?? []
  } catch {
    return []
  }
}

async function getLatestJobs(): Promise<Job[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('jobs')
      .select('*, poster:profiles(id, full_name), business:businesses(id, name)')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(3)
    return (data as Job[]) ?? []
  } catch {
    return []
  }
}

function formatRupiah(amount: number) {
  if (amount >= 1_000_000_000) return `Rp ${(amount / 1_000_000_000).toFixed(1)}M`
  if (amount >= 1_000_000) return `Rp ${(amount / 1_000_000).toFixed(0)}jt`
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount)
}

async function getUser() {
  try {
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) return null
    const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', authUser.id).single()
    return { id: authUser.id, email: authUser.email, full_name: profile?.full_name ?? null }
  } catch {
    return null
  }
}

export default async function HomePage() {
  const [stats, campaigns, businesses, jobs, user] = await Promise.all([
    getStats(),
    getFeaturedCampaigns(),
    getFeaturedBusinesses(),
    getLatestJobs(),
    getUser(),
  ])

  return (
    <div className="flex flex-col min-h-full">
      <Navbar user={user} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-accent/20 py-20 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full">
            <Heart className="h-4 w-4 fill-primary" />
            Komunitas GKI Kelapa Cengkir
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
            Jemaat tolong-menolong<br />
            <span className="text-primary">dalam kasih</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Platform komunitas untuk saling mendukung — galang dana bagi yang membutuhkan,
            kenalkan usaha jemaat, dan buka peluang kerja bersama.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link href="/galang-dana" className={cn(buttonVariants({ size: 'lg' }))}>
              Lihat Kampanye Aktif
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link href="/auth/register" className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}>
              Daftar Sebagai Jemaat
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y bg-muted/30 py-10 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-3xl font-bold text-primary">{formatRupiah(stats.totalRaised)}</p>
            <p className="text-sm text-muted-foreground mt-1">Total Dana Terkumpul</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary">{stats.totalDonations}</p>
            <p className="text-sm text-muted-foreground mt-1">Donatur</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary">{stats.totalBusinesses}</p>
            <p className="text-sm text-muted-foreground mt-1">Usaha Jemaat</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary">{stats.totalJobs}</p>
            <p className="text-sm text-muted-foreground mt-1">Lowongan Aktif</p>
          </div>
        </div>
      </section>

      {/* Campaigns */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-primary font-medium text-sm mb-1">
                <Heart className="h-4 w-4" />
                Galang Dana
              </div>
              <h2 className="text-2xl font-bold">Kampanye yang Membutuhkan Dukungan</h2>
            </div>
            <Link href="/galang-dana" className={cn(buttonVariants({ variant: 'ghost' }), 'hidden sm:flex')}>
              Lihat semua <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {campaigns.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map(c => <CampaignCard key={c.id} campaign={c} />)}
            </div>
          ) : (
            <div className="text-center py-16 border rounded-xl bg-muted/30">
              <Heart className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Belum ada kampanye aktif.</p>
              <Link href="/galang-dana/ajukan" className={cn(buttonVariants({ variant: 'outline' }), 'mt-4')}>
                Ajukan Kampanye Pertama
              </Link>
            </div>
          )}

          <div className="sm:hidden mt-6 text-center">
            <Link href="/galang-dana" className={buttonVariants({ variant: 'outline' })}>
              Lihat Semua Kampanye
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-2">Cara Kerjanya Sederhana</h2>
            <p className="text-muted-foreground">Tiga langkah untuk mulai saling membantu</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: 'Daftar sebagai Jemaat',
                desc: 'Buat akun dan tunggu verifikasi dari pengurus gereja. Proses cepat dan mudah.',
              },
              {
                icon: CheckCircle,
                title: 'Ajukan atau Dukung',
                desc: 'Ajukan kampanye galang dana, daftarkan usahamu, atau posting lowongan kerja.',
              },
              {
                icon: TrendingUp,
                title: 'Komunitas Berkembang',
                desc: 'Donasikan, beli dari sesama jemaat, atau rekrut tenaga kerja dari komunitas.',
              },
            ].map((step, i) => (
              <Card key={i} className="text-center">
                <CardContent className="pt-8 pb-6 px-6 flex flex-col items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-primary">LANGKAH {i + 1}</div>
                    <h3 className="font-semibold">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Businesses */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-primary font-medium text-sm mb-1">
                <ShoppingBag className="h-4 w-4" />
                Usaha Jemaat
              </div>
              <h2 className="text-2xl font-bold">Belanja dari Sesama Jemaat</h2>
            </div>
            <Link href="/umkm" className={cn(buttonVariants({ variant: 'ghost' }), 'hidden sm:flex')}>
              Lihat semua <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {businesses.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {businesses.map(b => <BusinessCard key={b.id} business={b} />)}
            </div>
          ) : (
            <div className="text-center py-16 border rounded-xl bg-muted/30">
              <ShoppingBag className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Belum ada usaha terdaftar.</p>
              <Link href="/umkm/daftarkan" className={cn(buttonVariants({ variant: 'outline' }), 'mt-4')}>
                Daftarkan Usahamu
              </Link>
            </div>
          )}

          <div className="sm:hidden mt-6 text-center">
            <Link href="/umkm" className={buttonVariants({ variant: 'outline' })}>
              Lihat Semua Usaha
            </Link>
          </div>
        </div>
      </section>

      {/* Jobs */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-primary font-medium text-sm mb-1">
                <Briefcase className="h-4 w-4" />
                Lowongan Kerja
              </div>
              <h2 className="text-2xl font-bold">Peluang Kerja dari Jemaat</h2>
            </div>
            <Link href="/lowongan" className={cn(buttonVariants({ variant: 'ghost' }), 'hidden sm:flex')}>
              Lihat semua <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {jobs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {jobs.map(j => <JobCard key={j.id} job={j} />)}
            </div>
          ) : (
            <div className="text-center py-16 border rounded-xl bg-white">
              <Briefcase className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Belum ada lowongan aktif.</p>
              <Link href="/lowongan/posting" className={cn(buttonVariants({ variant: 'outline' }), 'mt-4')}>
                Posting Lowongan
              </Link>
            </div>
          )}

          <div className="sm:hidden mt-6 text-center">
            <Link href="/lowongan" className={buttonVariants({ variant: 'outline' })}>
              Lihat Semua Lowongan
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h2 className="text-2xl font-bold">Bergabunglah dengan Komunitas</h2>
          <p className="opacity-90 leading-relaxed">
            Daftarkan diri sebagai jemaat GKI Kelapa Cengkir dan mulai saling membantu
            satu sama lain dalam kasih dan kepercayaan.
          </p>
          <Link href="/auth/register" className={cn(buttonVariants({ variant: 'secondary', size: 'lg' }))}>
            Daftar Sekarang
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
