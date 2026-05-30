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
import { daftarkanUsaha } from '../actions'

const categories = ['Kuliner', 'Fashion', 'Jasa', 'Pendidikan', 'Properti', 'Lainnya']

export default function DaftarkanUsahaPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [category, setCategory] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const formData = new FormData(e.currentTarget)
    formData.set('category', category)
    startTransition(async () => {
      const result = await daftarkanUsaha(formData)
      if (result.error) setError(result.error)
      if (result.success) setSuccess(result.success)
    })
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center space-y-4">
        <div className="text-5xl">🎉</div>
        <h2 className="text-xl font-bold">Usaha Berhasil Didaftarkan!</h2>
        <p className="text-muted-foreground">{success}</p>
        <p className="text-sm text-muted-foreground">
          Tim moderasi akan mereview dalam 1-2 hari kerja.
        </p>
        <button onClick={() => router.push('/umkm')} className="text-primary hover:underline text-sm">
          Kembali ke direktori usaha
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Daftarkan Usaha Kamu</h1>
        <p className="text-muted-foreground mt-1">
          Kenalkan usahamu ke sesama jemaat. Gratis dan terverifikasi oleh pengurus gereja.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informasi Usaha</CardTitle>
          <CardDescription>Isi dengan lengkap agar jemaat lain mudah menemukan dan menghubungimu.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <Alert className="text-sm text-destructive border-destructive/50 bg-destructive/10">
                {error}
              </Alert>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="name">Nama Usaha *</Label>
              <Input id="name" name="name" placeholder="Cth: Dapur Bu Sari, Studio Foto Bless, dll" required />
            </div>

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
              <Label htmlFor="description">Deskripsi Usaha *</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Jelaskan produk/jasa yang kamu tawarkan, keunggulan, pengalaman, dll..."
                rows={5}
                required
                className="resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="whatsapp">Nomor WhatsApp *</Label>
              <div className="flex">
                <span className="flex items-center px-3 border border-r-0 rounded-l-lg bg-muted text-sm text-muted-foreground">
                  +62
                </span>
                <Input
                  id="whatsapp"
                  name="whatsapp"
                  placeholder="81234567890"
                  className="rounded-l-none"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">Nomor ini yang akan dihubungi calon pelanggan.</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="address">Alamat / Lokasi (opsional)</Label>
              <Input
                id="address"
                name="address"
                placeholder="Cth: Kelapa Cengkir, Jakarta Utara"
              />
            </div>

            <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground space-y-1">
              <p className="font-medium text-foreground">Catatan:</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>Pendaftaran gratis untuk jemaat GKI Kelapa Cengkir</li>
                <li>Upload foto produk bisa dilakukan setelah usaha disetujui</li>
                <li>Pengurus berhak menolak usaha yang tidak sesuai nilai komunitas</li>
              </ul>
            </div>

            <Button type="submit" className="w-full" disabled={isPending || !category}>
              {isPending ? 'Mendaftarkan...' : 'Daftarkan Usaha'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
