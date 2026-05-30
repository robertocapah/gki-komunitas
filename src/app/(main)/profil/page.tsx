import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import { Separator } from '@/components/ui/separator'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CampaignCard } from '@/components/shared/CampaignCard'
import { BusinessCard } from '@/components/shared/BusinessCard'
import { JobCard } from '@/components/shared/JobCard'
import { User, Shield, Plus, Heart, ShoppingBag, Briefcase } from 'lucide-react'
import type { Campaign, Business, Job, Profile } from '@/types'

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default async function ProfilPage() {
  if (!isSupabaseConfigured()) redirect('/auth/login')
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login?redirect=/profil')

  const [{ data: profile }, { data: campaigns }, { data: businesses }, { data: jobs }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('campaigns').select('*, creator:profiles(id,full_name,avatar_url)').eq('creator_id', user.id).order('created_at', { ascending: false }),
    supabase.from('businesses').select('*, owner:profiles(id,full_name)').eq('owner_id', user.id).order('created_at', { ascending: false }),
    supabase.from('jobs').select('*, poster:profiles(id,full_name), business:businesses(id,name)').eq('poster_id', user.id).order('created_at', { ascending: false }),
  ])

  const p = profile as Profile
  const myStats = {
    campaigns: (campaigns ?? []).length,
    businesses: (businesses ?? []).length,
    jobs: (jobs ?? []).length,
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">

      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold shrink-0">
          {p?.full_name?.charAt(0)?.toUpperCase() ?? <User className="h-8 w-8" />}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{p?.full_name ?? 'Jemaat'}</h1>
            {p?.is_verified ? (
              <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 font-medium px-2 py-0.5 rounded-full">
                <Shield className="h-3 w-3" /> Terverifikasi
              </span>
            ) : (
              <span className="text-xs bg-yellow-100 text-yellow-700 font-medium px-2 py-0.5 rounded-full">
                Menunggu Verifikasi
              </span>
            )}
          </div>
          <p className="text-muted-foreground text-sm mt-0.5">{user.email}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Bergabung sejak {p?.created_at ? formatDate(p.created_at) : '-'}</p>
        </div>
        <div className="flex gap-3 text-center text-sm">
          <div>
            <p className="font-bold text-lg">{myStats.campaigns}</p>
            <p className="text-muted-foreground text-xs">Kampanye</p>
          </div>
          <div>
            <p className="font-bold text-lg">{myStats.businesses}</p>
            <p className="text-muted-foreground text-xs">Usaha</p>
          </div>
          <div>
            <p className="font-bold text-lg">{myStats.jobs}</p>
            <p className="text-muted-foreground text-xs">Lowongan</p>
          </div>
        </div>
      </div>

      {!p?.is_verified && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
          <p className="font-medium">Akun kamu sedang menunggu verifikasi pengurus gereja.</p>
          <p className="mt-1 text-yellow-700">Setelah diverifikasi, kamu bisa mengajukan kampanye, mendaftarkan usaha, dan posting lowongan.</p>
        </div>
      )}

      <Separator />

      {/* Kampanye Saya */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Kampanye Saya</h2>
            <span className="text-sm text-muted-foreground">({myStats.campaigns})</span>
          </div>
          <Link href="/galang-dana/ajukan" className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}>
            <Plus className="h-3.5 w-3.5 mr-1" /> Ajukan
          </Link>
        </div>
        {(campaigns ?? []).length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(campaigns as Campaign[]).map(c => (
              <div key={c.id} className="relative">
                <CampaignCard campaign={c} />
                {c.status !== 'active' && (
                  <div className="absolute top-2 right-2">
                    <StatusBadge status={c.status} />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Heart}
            text="Belum ada kampanye"
            cta="Ajukan Kampanye"
            href="/galang-dana/ajukan"
          />
        )}
      </section>

      <Separator />

      {/* Usaha Saya */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Usaha Saya</h2>
            <span className="text-sm text-muted-foreground">({myStats.businesses})</span>
          </div>
          <Link href="/umkm/daftarkan" className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}>
            <Plus className="h-3.5 w-3.5 mr-1" /> Daftarkan
          </Link>
        </div>
        {(businesses ?? []).length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {(businesses as Business[]).map(b => (
              <div key={b.id} className="relative">
                <BusinessCard business={b} />
                {b.status !== 'active' && (
                  <div className="absolute top-2 right-2">
                    <StatusBadge status={b.status} />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={ShoppingBag}
            text="Belum ada usaha terdaftar"
            cta="Daftarkan Usaha"
            href="/umkm/daftarkan"
          />
        )}
      </section>

      <Separator />

      {/* Lowongan Saya */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Lowongan Saya</h2>
            <span className="text-sm text-muted-foreground">({myStats.jobs})</span>
          </div>
          <Link href="/lowongan/posting" className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}>
            <Plus className="h-3.5 w-3.5 mr-1" /> Posting
          </Link>
        </div>
        {(jobs ?? []).length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(jobs as Job[]).map(j => (
              <div key={j.id} className="relative">
                <JobCard job={j} />
                {j.status !== 'active' && (
                  <div className="absolute top-2 right-2">
                    <StatusBadge status={j.status} />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Briefcase}
            text="Belum ada lowongan diposting"
            cta="Posting Lowongan"
            href="/lowongan/posting"
          />
        )}
      </section>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; class: string }> = {
    pending: { label: 'Menunggu Review', class: 'bg-yellow-100 text-yellow-800' },
    rejected: { label: 'Ditolak', class: 'bg-red-100 text-red-700' },
    completed: { label: 'Selesai', class: 'bg-gray-100 text-gray-600' },
    closed: { label: 'Ditutup', class: 'bg-gray-100 text-gray-600' },
  }
  const s = map[status]
  if (!s) return null
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.class}`}>
      {s.label}
    </span>
  )
}

function EmptyState({ icon: Icon, text, cta, href }: { icon: React.ElementType; text: string; cta: string; href: string }) {
  return (
    <div className="text-center py-10 border rounded-xl bg-muted/30">
      <Icon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
      <p className="text-sm text-muted-foreground">{text}</p>
      <Link href={href} className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'mt-3')}>
        {cta}
      </Link>
    </div>
  )
}
