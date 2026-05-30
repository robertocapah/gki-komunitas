import Link from 'next/link'
import { ShoppingBag, Search, Plus } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import { BusinessCard } from '@/components/shared/BusinessCard'
import type { Business } from '@/types'

const categories = ['Semua', 'Kuliner', 'Fashion', 'Jasa', 'Pendidikan', 'Properti', 'Lainnya']

interface PageProps {
  searchParams: Promise<{ kategori?: string; q?: string }>
}

export default async function UmkmPage({ searchParams }: PageProps) {
  const { kategori, q } = await searchParams

  let list: Business[] = []
  if (isSupabaseConfigured()) {
    const supabase = await createClient()
    let query = supabase
      .from('businesses')
      .select('*, owner:profiles(id, full_name)')
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (kategori && kategori !== 'Semua') query = query.eq('category', kategori)
    if (q) query = query.ilike('name', `%${q}%`)

    const { data } = await query
    list = (data as Business[]) ?? []
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-primary font-medium text-sm mb-1">
            <ShoppingBag className="h-4 w-4" />
            Usaha Jemaat
          </div>
          <h1 className="text-2xl font-bold">Direktori UMKM Jemaat</h1>
          <p className="text-muted-foreground text-sm mt-1">Belanja dan dukung usaha sesama jemaat GKI Kelapa Cengkir</p>
        </div>
        <Link href="/umkm/daftarkan" className={buttonVariants()}>
          <Plus className="h-4 w-4 mr-1" />
          Daftarkan Usaha
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <form className="relative max-w-md" method="GET">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            name="q"
            defaultValue={q}
            placeholder="Cari nama usaha..."
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
          const href = `/umkm${params.toString() ? '?' + params.toString() : ''}`
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
          <p className="text-sm text-muted-foreground mb-4">{list.length} usaha ditemukan</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {list.map(b => <BusinessCard key={b.id} business={b} />)}
          </div>
        </>
      ) : (
        <div className="text-center py-20 border rounded-xl bg-muted/30">
          <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="font-medium text-muted-foreground">Tidak ada usaha ditemukan</p>
          {(q || kategori) ? (
            <Link href="/umkm" className={cn(buttonVariants({ variant: 'outline' }), 'mt-4')}>
              Hapus Filter
            </Link>
          ) : (
            <Link href="/umkm/daftarkan" className={cn(buttonVariants(), 'mt-4')}>
              Daftarkan Usaha Pertama
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
