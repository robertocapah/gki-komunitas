'use client'

import { useState, useTransition } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Alert } from '@/components/ui/alert'
import { donasiKampanye } from '../actions'

const QUICK_AMOUNTS = [10000, 25000, 50000, 100000, 250000, 500000]

function formatRupiah(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)
}

interface Props {
  campaignId: string
  user: { id: string } | null
}

export function DonationForm({ campaignId, user }: Props) {
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isPending, startTransition] = useTransition()

  function selectAmount(n: number) {
    setAmount(n.toString())
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setSuccess('')
    const num = parseInt(amount.replace(/\D/g, ''))
    if (!num || num < 1000) {
      setError('Minimal donasi Rp 1.000')
      return
    }
    const formData = new FormData(e.currentTarget)
    formData.set('amount', num.toString())
    formData.set('campaign_id', campaignId)

    startTransition(async () => {
      const result = await donasiKampanye(formData)
      if (result.error) {
        setError(result.error)
      } else {
        setSuccess('Terima kasih! Donasi kamu akan diproses.')
      }
    })
  }

  if (success) {
    return (
      <div className="text-center space-y-2 py-4">
        <div className="text-4xl">🙏</div>
        <p className="font-semibold">Terima kasih atas donasimu!</p>
        <p className="text-sm text-muted-foreground">
          Semoga berkat yang kamu berikan kembali berlipat ganda.
        </p>
        <button
          onClick={() => { setSuccess(''); setAmount('') }}
          className="text-sm text-primary hover:underline"
        >
          Donasi lagi
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert className="text-sm text-destructive border-destructive/50 bg-destructive/10 py-2">
          {error}
        </Alert>
      )}

      <div className="space-y-2">
        <Label>Nominal Donasi</Label>
        <div className="grid grid-cols-3 gap-2">
          {QUICK_AMOUNTS.map(n => (
            <button
              key={n}
              type="button"
              onClick={() => selectAmount(n)}
              className={`text-xs py-1.5 px-2 rounded-lg border font-medium transition-colors ${
                amount === n.toString()
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-muted/50 hover:bg-muted border-border'
              }`}
            >
              {formatRupiah(n)}
            </button>
          ))}
        </div>
        <Input
          name="amount"
          placeholder="Atau masukkan nominal lain"
          value={amount ? `Rp ${parseInt(amount || '0').toLocaleString('id-ID')}` : ''}
          onChange={e => setAmount(e.target.value.replace(/\D/g, ''))}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="donor_name">Nama</Label>
        <Input
          id="donor_name"
          name="donor_name"
          placeholder="Nama kamu"
          defaultValue={user ? undefined : ''}
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message">Pesan / Doa (opsional)</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Tuliskan pesan atau doa untuk penerima..."
          rows={2}
          className="resize-none"
        />
      </div>

      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input type="checkbox" name="is_anonymous" className="rounded" />
        Donasi sebagai Anonim
      </label>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Memproses...' : 'Donasi Sekarang'}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        Donasi dikelola secara transparan oleh pengurus GKI Kelapa Cengkir
      </p>
    </form>
  )
}
