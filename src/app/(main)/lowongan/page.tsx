import Link from 'next/link'
import { Briefcase, Search, Plus } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import { JobCard } from '@/components/shared/JobCard'
import type { Job } from '@/types'

const jobTypes = [
  { value: '', label: 'Semua' },
  { value: 'full-time', label: 'Full Time' },
  { value: 'part-time', label: 'Part Time' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'internship', label: 'Magang' },
]

const categories = ['Semua', 'Teknologi', 'Kuliner', 'Pendidikan', 'Kesehatan', 'Kreatif', 'Keuangan', 'Lainnya']

interface PageProps {
  searchParams: Promise<{ tipe?: string; kategori?: string; q?: string }>
}

export default async function LowonganPage({ searchParams }: PageProps) {
  const { tipe, kategori, q } = await searchParams

  let list: Job[] = []
  if (isSupabaseConfigured()) {
    const supabase = await createClient()
    let query = supabase
      .from('jobs')
      .select('*, poster:profiles(id, full_name), business:businesses(id, name)')
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (tipe) query = query.eq('job_type', tipe)
    if (kategori && kategori !== 'Semua') query = query.eq('category', kategori)
    if (q) query = query.ilike('title', `%${q}%`)

    const { data } = await query
    list = (data as Job[]) ?? []
  }

  function buildHref(overrides: Record<string, string>) {
    const params = new URLSearchParams()
    const merged = { tipe: tipe ?? '', kategori: kategori ?? '', q: q ?? '', ...overrides }
    Object.entries(merged).forEach(([k, v]) => { if (v && v !== 'Semua') params.set(k, v) })
    return `/lowongan${params.toString() ? '?' + params.toString() : ''}`
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-primary font-medium text-sm mb-1">
            <Briefcase className="h-4 w-4" />
            Lowongan Kerja
          </div>
          <h1 className="text-2xl font-bold">Peluang Kerja dari Jemaat</h1>
          <p className="text-muted-foreground text-sm mt-1">Lowongan dari usaha milik jemaat GKI Kelapa Cengkir</p>
        </div>
        <Link href="/lowongan/posting" className={buttonVariants()}>
          <Plus className="h-4 w-4 mr-1" />
          Posting Lowongan
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <form className="relative max-w-md" method="GET">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            name="q"
            defaultValue={q}
            placeholder="Cari posisi atau bidang..."
            className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          {tipe && <input type="hidden" name="tipe" value={tipe} />}
          {kategori && kategori !== 'Semua' && <input type="hidden" name="kategori" value={kategori} />}
        </form>
      </div>

      {/* Job Type Tabs */}
      <div className="flex gap-2 flex-wrap mb-4">
        {jobTypes.map(jt => {
          const isActive = (!tipe && !jt.value) || tipe === jt.value
          return (
            <Link
              key={jt.value}
              href={buildHref({ tipe: jt.value, kategori: kategori ?? '' })}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              {jt.label}
            </Link>
          )
        })}
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 flex-wrap mb-8">
        {categories.map(cat => {
          const isActive = (!kategori && cat === 'Semua') || kategori === cat
          return (
            <Link
              key={cat}
              href={buildHref({ kategori: cat })}
              className={cn(
                'px-3 py-1 rounded-lg text-xs font-medium transition-colors border',
                isActive
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-border text-muted-foreground hover:bg-muted/50'
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
          <p className="text-sm text-muted-foreground mb-4">{list.length} lowongan ditemukan</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {list.map(j => <JobCard key={j.id} job={j} />)}
          </div>
        </>
      ) : (
        <div className="text-center py-20 border rounded-xl bg-muted/30">
          <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="font-medium text-muted-foreground">Tidak ada lowongan ditemukan</p>
          {(q || tipe || (kategori && kategori !== 'Semua')) ? (
            <Link href="/lowongan" className={cn(buttonVariants({ variant: 'outline' }), 'mt-4')}>
              Hapus Filter
            </Link>
          ) : (
            <Link href="/lowongan/posting" className={cn(buttonVariants(), 'mt-4')}>
              Posting Lowongan Pertama
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
