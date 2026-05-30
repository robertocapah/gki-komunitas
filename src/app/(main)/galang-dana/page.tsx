import Link from 'next/link'
import { Heart, Search, Plus } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import { CampaignCard } from '@/components/shared/CampaignCard'
import type { Campaign } from '@/types'

const categories = ['Semua', 'Bantuan Medis', 'Bantuan Pendidikan', 'Bantuan Musibah', 'Misi & Pelayanan', 'Lainnya']

interface PageProps {
  searchParams: Promise<{ kategori?: string; q?: string }>
}

export default async function GalangDanaPage({ searchParams }: PageProps) {
  const { kategori, q } = await searchParams

  let list: Campaign[] = []
  if (isSupabaseConfigured()) {
    const supabase = await createClient()
    let query = supabase
      .from('campaigns')
      .select('*, creator:profiles(id, full_name, avatar_url)')
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (kategori && kategori !== 'Semua') query = query.eq('category', kategori)
    if (q) query = query.ilike('title', `%${q}%`)

    const { data: campaigns } = await query
    list = (campaigns as Campaign[]) ?? []
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-primary font-medium text-sm mb-1">
            <Heart className="h-4 w-4" />
            Galang Dana
          </div>
          <h1 className="text-2xl font-bold">Kampanye yang Membutuhkan Dukungan</h1>
        </div>
        <Link href="/galang-dana/ajukan" className={buttonVariants()}>
          <Plus className="h-4 w-4 mr-1" />
          Ajukan Kampanye
        </Link>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <form className="flex-1 relative" method="GET">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            name="q"
            defaultValue={q}
            placeholder="Cari kampanye..."
            className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          {kategori && <input type="hidden" name="kategori" value={kategori} />}
        </form>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 flex-wrap mb-8">
        {categories.map(cat => {
          const params = new URLSearchParams()
          if (cat !== 'Semua') params.set('kategori', cat)
          if (q) params.set('q', q)
          const href = `/galang-dana${params.toString() ? '?' + params.toString() : ''}`
          const isActive = (!kategori && cat === 'Semua') || kategori === cat
          return (
            <Link
              key={cat}
              href={href}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              {cat}
            </Link>
          )
        })}
      </div>

      {/* Results */}
      {list.length > 0 ? (
        <>
          <p className="text-sm text-muted-foreground mb-4">{list.length} kampanye ditemukan</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.map(c => <CampaignCard key={c.id} campaign={c} />)}
          </div>
        </>
      ) : (
        <div className="text-center py-20 border rounded-xl bg-muted/30">
          <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="font-medium text-muted-foreground">Tidak ada kampanye ditemukan</p>
          {(q || kategori) ? (
            <Link href="/galang-dana" className={cn(buttonVariants({ variant: 'outline' }), 'mt-4')}>
              Hapus Filter
            </Link>
          ) : (
            <Link href="/galang-dana/ajukan" className={cn(buttonVariants(), 'mt-4')}>
              Ajukan Kampanye Pertama
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
