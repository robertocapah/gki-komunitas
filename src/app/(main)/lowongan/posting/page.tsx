'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Alert } from '@/components/ui/alert'
import { postingLowongan } from '../actions'

const jobTypes = [
  { value: 'full-time', label: 'Full Time' },
  { value: 'part-time', label: 'Part Time' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'internship', label: 'Magang' },
]

const categories = ['Teknologi', 'Kuliner', 'Pendidikan', 'Kesehatan', 'Kreatif', 'Keuangan', 'Lainnya']

function formatRupiahInput(val: string) {
  const num = parseInt(val.replace(/\D/g, '') || '0')
  return num ? `Rp ${num.toLocaleString('id-ID')}` : ''
}

export default function PostingLowonganPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [jobType, setJobType] = useState('')
  const [category, setCategory] = useState('')
  const [salaryMin, setSalaryMin] = useState('')
  const [salaryMax, setSalaryMax] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const formData = new FormData(e.currentTarget)
    formData.set('job_type', jobType)
    formData.set('category', category)
    formData.set('salary_min', salaryMin.replace(/\D/g, ''))
    formData.set('salary_max', salaryMax.replace(/\D/g, ''))
    startTransition(async () => {
      const result = await postingLowongan(formData)
      if (result.error) setError(result.error)
      if (result.success) setSuccess(result.success)
    })
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center space-y-4">
        <div className="text-5xl">📋</div>
        <h2 className="text-xl font-bold">Lowongan Berhasil Diposting!</h2>
        <p className="text-muted-foreground">{success}</p>
        <p className="text-sm text-muted-foreground">
          Lowongan akan otomatis non-aktif setelah 30 hari jika tidak diperpanjang.
        </p>
        <button onClick={() => router.push('/lowongan')} className="text-primary hover:underline text-sm">
          Kembali ke daftar lowongan
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Posting Lowongan Kerja</h1>
        <p className="text-muted-foreground mt-1">
          Buka peluang kerja untuk sesama jemaat. Gratis dan terverifikasi.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Detail Lowongan</CardTitle>
          <CardDescription>Isi dengan jelas agar pencari kerja bisa menilai kecocokan.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <Alert className="text-sm text-destructive border-destructive/50 bg-destructive/10">
                {error}
              </Alert>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="title">Judul Posisi *</Label>
              <Input id="title" name="title" placeholder="Cth: Staff Keuangan, Barista, Guru Les Matematika" required />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Tipe Pekerjaan *</Label>
                <Select value={jobType} onValueChange={(v) => setJobType(v ?? '')} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tipe" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobTypes.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Bidang *</Label>
                <Select value={category} onValueChange={(v) => setCategory(v ?? '')} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih bidang" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="location">Lokasi *</Label>
              <Input id="location" name="location" placeholder="Cth: Jakarta Utara, Remote, dll" required />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Gaji Min (opsional)</Label>
                <Input
                  placeholder="Rp 0"
                  value={salaryMin}
                  onChange={e => setSalaryMin(formatRupiahInput(e.target.value))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Gaji Maks (opsional)</Label>
                <Input
                  placeholder="Rp 0"
                  value={salaryMax}
                  onChange={e => setSalaryMax(formatRupiahInput(e.target.value))}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Deskripsi Pekerjaan *</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Jelaskan tanggung jawab dan tugas posisi ini..."
                rows={4}
                required
                className="resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="requirements">Kualifikasi & Persyaratan *</Label>
              <Textarea
                id="requirements"
                name="requirements"
                placeholder="Cth: Pendidikan minimal D3, pengalaman 1 tahun, bisa Ms Office, dll..."
                rows={4}
                required
                className="resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="contact_info">Kontak Lamaran *</Label>
              <Input
                id="contact_info"
                name="contact_info"
                placeholder="Nomor WA (cth: 08123...) atau email"
                required
              />
              <p className="text-xs text-muted-foreground">Pelamar akan menghubungi langsung ke kontak ini.</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="expires_at">Tanggal Berakhir (opsional)</Label>
              <Input
                id="expires_at"
                name="expires_at"
                type="date"
                min={new Date().toISOString().split('T')[0]}
              />
              <p className="text-xs text-muted-foreground">Jika dikosongkan, lowongan otomatis berakhir 30 hari.</p>
            </div>

            <Button type="submit" className="w-full" disabled={isPending || !jobType || !category}>
              {isPending ? 'Memposting...' : 'Posting Lowongan'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
