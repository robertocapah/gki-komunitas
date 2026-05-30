'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Alert } from '@/components/ui/alert'
import { register } from '../actions'

export default function RegisterPage() {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setSuccess('')
    const formData = new FormData(e.currentTarget)

    if (formData.get('password') !== formData.get('confirm_password')) {
      setError('Password tidak cocok.')
      return
    }

    startTransition(async () => {
      const result = await register(formData)
      if (result?.error) setError(result.error)
      if (result?.success) setSuccess(result.success)
    })
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Daftar Sebagai Jemaat</CardTitle>
        <CardDescription>Buat akun untuk mengakses fitur komunitas</CardDescription>
      </CardHeader>
      <CardContent>
        {success ? (
          <div className="text-center space-y-4">
            <div className="text-4xl">📧</div>
            <p className="font-medium">Cek inbox email kamu!</p>
            <p className="text-sm text-muted-foreground">{success}</p>
            <p className="text-xs text-muted-foreground">
              Setelah konfirmasi email, pengurus gereja akan memverifikasi akunmu sebelum bisa mengajukan kampanye atau mendaftarkan usaha.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert className="text-sm text-destructive border-destructive/50 bg-destructive/10">
                {error}
              </Alert>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="full_name">Nama Lengkap</Label>
              <Input id="full_name" name="full_name" placeholder="Nama sesuai KTP" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="email@contoh.com" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" placeholder="Minimal 8 karakter" minLength={8} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirm_password">Konfirmasi Password</Label>
              <Input id="confirm_password" name="confirm_password" type="password" placeholder="Ulangi password" required />
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Mendaftar...' : 'Daftar Sekarang'}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Dengan mendaftar, kamu setuju untuk menggunakan platform ini sesuai nilai-nilai komunitas GKI Kelapa Cengkir.
            </p>
          </form>
        )}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Sudah punya akun?{' '}
          <Link href="/auth/login" className="text-primary font-medium hover:underline">
            Masuk di sini
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
