import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import { Separator } from '@/components/ui/separator'
import { Heart, ShoppingBag, Briefcase, Users } from 'lucide-react'
import { ModerationCard } from './ModerationCard'
import { UserVerificationCard } from './UserVerificationCard'
import type { Campaign, Business, Job, Profile } from '@/types'

export default async function ModerasiPage() {
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
    { data: campaigns },
    { data: businesses },
    { data: jobs },
    { data: unverifiedUsers },
  ] = await Promise.all([
    supabase.from('campaigns').select('*, creator:profiles(id,full_name)').eq('status', 'pending').order('created_at'),
    supabase.from('businesses').select('*, owner:profiles(id,full_name)').eq('status', 'pending').order('created_at'),
    supabase.from('jobs').select('*, poster:profiles(id,full_name), business:businesses(id,name)').eq('status', 'pending').order('created_at'),
    supabase.from('profiles').select('*').eq('is_verified', false).order('created_at'),
  ])

  const sections = [
    { title: 'Kampanye Galang Dana', icon: Heart, items: campaigns ?? [], table: 'campaigns' as const },
    { title: 'Usaha UMKM', icon: ShoppingBag, items: businesses ?? [], table: 'businesses' as const },
    { title: 'Lowongan Kerja', icon: Briefcase, items: jobs ?? [], table: 'jobs' as const },
  ]

  const totalPending = sections.reduce((sum, s) => sum + s.items.length, 0) + (unverifiedUsers ?? []).length

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Moderasi Konten</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {totalPending > 0 ? `${totalPending} item menunggu review` : 'Semua item sudah diproses ✓'}
        </p>
      </div>

      {/* Unverified Users */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Verifikasi Jemaat</h2>
          {(unverifiedUsers ?? []).length > 0 && (
            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded-full">
              {unverifiedUsers!.length} pending
            </span>
          )}
        </div>
        {(unverifiedUsers ?? []).length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {(unverifiedUsers as Profile[]).map(u => (
              <UserVerificationCard key={u.id} user={u} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground py-4">Tidak ada jemaat yang menunggu verifikasi.</p>
        )}
      </section>

      {sections.map(section => (
        <section key={section.table}>
          <Separator className="mb-8" />
          <div className="flex items-center gap-2 mb-4">
            <section.icon className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">{section.title}</h2>
            {section.items.length > 0 && (
              <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded-full">
                {section.items.length} pending
              </span>
            )}
          </div>
          {section.items.length > 0 ? (
            <div className="space-y-3">
              {section.items.map((item: Campaign | Business | Job) => (
                <ModerationCard key={item.id} item={item} table={section.table} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-4">Tidak ada {section.title.toLowerCase()} yang menunggu review.</p>
          )}
        </section>
      ))}
    </div>
  )
}
