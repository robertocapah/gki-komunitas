import { notFound } from 'next/navigation'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import { Separator } from '@/components/ui/separator'
import { MapPin, Clock, ChevronLeft, Briefcase, Building2, Send } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import type { Job } from '@/types'

const jobTypeLabel: Record<string, string> = {
  'full-time': 'Full Time',
  'part-time': 'Part Time',
  'freelance': 'Freelance',
  'internship': 'Magang',
}

function formatRupiah(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function JobDetailPage({ params }: PageProps) {
  const { slug } = await params
  if (!isSupabaseConfigured()) notFound()
  const supabase = await createClient()

  const { data: job } = await supabase
    .from('jobs')
    .select('*, poster:profiles(id, full_name), business:businesses(id, name, slug, category)')
    .eq('slug', slug)
    .eq('status', 'active')
    .single()

  if (!job) notFound()

  const j = job as Job
  const salaryText = j.salary_min && j.salary_max
    ? `${formatRupiah(j.salary_min)} – ${formatRupiah(j.salary_max)}`
    : j.salary_min
      ? `Mulai ${formatRupiah(j.salary_min)}`
      : 'Negosiasi'

  const isWa = j.contact_info.replace(/\D/g, '').length >= 10
  const contactUrl = isWa
    ? `https://wa.me/${j.contact_info.replace(/\D/g, '')}`
    : `mailto:${j.contact_info}`

  const daysLeft = j.expires_at
    ? Math.max(0, Math.ceil((new Date(j.expires_at).getTime() - Date.now()) / 86400000))
    : null

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Link
        href="/lowongan"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ChevronLeft className="h-4 w-4" />
        Kembali ke lowongan
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="text-xs font-medium bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                {jobTypeLabel[j.job_type]}
              </span>
              <span className="text-xs font-medium bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full">
                {j.category}
              </span>
              {daysLeft !== null && (
                <span className={cn(
                  'text-xs font-medium px-2.5 py-1 rounded-full',
                  daysLeft <= 3 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                )}>
                  {daysLeft === 0 ? 'Berakhir hari ini' : `${daysLeft} hari lagi`}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold leading-snug">{j.title}</h1>
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
            {j.business && (
              <div className="flex items-center gap-1.5">
                <Building2 className="h-4 w-4 shrink-0" />
                <Link href={`/umkm/${(j.business as any).slug}`} className="hover:text-primary transition-colors">
                  {(j.business as any).name}
                </Link>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 shrink-0" />
              {j.location}
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 shrink-0" />
              Diposting {formatDate(j.created_at)}
            </div>
          </div>

          <Separator />

          <div>
            <h2 className="font-semibold text-lg mb-3">Deskripsi Pekerjaan</h2>
            <div className="text-muted-foreground leading-relaxed whitespace-pre-line">{j.description}</div>
          </div>

          <Separator />

          <div>
            <h2 className="font-semibold text-lg mb-3">Kualifikasi & Persyaratan</h2>
            <div className="text-muted-foreground leading-relaxed whitespace-pre-line">{j.requirements}</div>
          </div>

          {j.expires_at && (
            <>
              <Separator />
              <p className="text-sm text-muted-foreground">
                Lowongan ini berakhir pada <span className="font-medium text-foreground">{formatDate(j.expires_at)}</span>
              </p>
            </>
          )}
        </div>

        {/* Sidebar */}
        <div>
          <div className="border rounded-xl p-5 space-y-5 sticky top-20">
            {/* Salary */}
            <div>
              <p className="text-xs text-muted-foreground mb-1">Gaji / Honorarium</p>
              <p className="text-xl font-bold text-primary">{salaryText}</p>
              <p className="text-xs text-muted-foreground mt-0.5">per bulan</p>
            </div>

            <Separator />

            {/* Info Grid */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tipe</span>
                <span className="font-medium">{jobTypeLabel[j.job_type]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bidang</span>
                <span className="font-medium">{j.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Lokasi</span>
                <span className="font-medium">{j.location}</span>
              </div>
              {j.business && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Perusahaan</span>
                  <span className="font-medium">{(j.business as any).name}</span>
                </div>
              )}
            </div>

            <Separator />

            {/* Apply Button */}
            <div className="space-y-2">
              <a
                href={contactUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants(), 'w-full justify-center gap-2')}
              >
                <Send className="h-4 w-4" />
                {isWa ? 'Lamar via WhatsApp' : 'Lamar via Email'}
              </a>
              <p className="text-xs text-center text-muted-foreground">
                Hubungi langsung: {j.contact_info}
              </p>
            </div>

            <Separator />

            <div className="text-xs text-muted-foreground">
              <p>Lowongan ini diposting oleh jemaat terverifikasi GKI Kelapa Cengkir.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
