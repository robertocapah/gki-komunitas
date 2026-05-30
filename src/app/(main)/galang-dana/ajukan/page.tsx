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
import { ajukanKampanye } from '../actions'

const categories = ['Bantuan Medis', 'Bantuan Pendidikan', 'Bantuan Musibah', 'Misi & Pelayanan', 'Lainnya']

function formatRupiah(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)
}

export default function AjukanKampanyePage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [category, setCategory] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const formData = new FormData(e.currentTarget)
    formData.set('category', category)
    formData.set('target_amount', targetAmount.replace(/\D/g, ''))

    startTransition(async () => {
      const result = await ajukanKampanye(formData)
      if (result.error) setError(result.error)
      if (result.success) setSuccess(result.success)
    })
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center space-y-4">
        <div className="text-5xl">🙌</div>
        <h2 className="text-xl font-bold">Kampanye Berhasil Diajukan!</h2>
        <p className="text-muted-foreground">{success}</p>
        <p className="text-sm text-muted-foreground">
          Tim moderasi akan mereview kampanyemu dalam 1-2 hari kerja.
        </p>
        <button onClick={() => router.push('/galang-dana')} className="text-primary hover:underline text-sm">
          Kembali ke daftar kampanye
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Ajukan Kampanye Galang Dana</h1>
        <p className="text-muted-foreground mt-1">
          Isi form di bawah. Kampanye akan ditinjau oleh pengurus sebelum ditayangkan.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informasi Kampanye</CardTitle>
          <CardDescription>Jelaskan kebutuhan dengan jelas agar jemaat dapat memahami dan tergerak untuk membantu.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <Alert className="text-sm text-destructive border-destructive/50 bg-destructive/10">
                {error}
              </Alert>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="title">Judul Kampanye *</Label>
              <Input
                id="title"
                name="title"
                placeholder="Cth: Bantuan Biaya Operasi untuk Bapak Hendra"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Kategori *</Label>
                <Select value={category} onValueChange={(v) => setCategory(v ?? '')} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="target">Target Dana *</Label>
                <Input
                  id="target"
                  name="target_amount"
                  placeholder="Rp 0"
                  value={targetAmount ? `Rp ${parseInt(targetAmount || '0').toLocaleString('id-ID')}` : ''}
                  onChange={e => setTargetAmount(e.target.value.replace(/\D/g, ''))}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="end_date">Tanggal Berakhir (opsional)</Label>
              <Input id="end_date" name="end_date" type="date" min={new Date().toISOString().split('T')[0]} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Deskripsi Singkat *</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Ringkasan singkat tentang kampanye ini (1-2 kalimat)..."
                rows={2}
                required
                className="resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="story">Cerita Lengkap *</Label>
              <Textarea
                id="story"
                name="story"
                placeholder="Ceritakan latar belakang, kebutuhan, dan bagaimana dana akan digunakan secara detail..."
                rows={8}
                required
                className="resize-none"
              />
            </div>

            <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground space-y-1">
              <p className="font-medium text-foreground">Yang akan terjadi setelah submit:</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>Tim moderasi akan mereview dalam 1-2 hari kerja</li>
                <li>Kamu akan dihubungi jika ada informasi yang perlu dilengkapi</li>
                <li>Setelah disetujui, kampanye akan langsung tayang</li>
              </ul>
            </div>

            <Button type="submit" className="w-full" disabled={isPending || !category}>
              {isPending ? 'Mengajukan...' : 'Ajukan Kampanye'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
