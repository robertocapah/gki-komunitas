'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Alert } from '@/components/ui/alert'
import { forgotPassword } from '../actions'

export default function LupaPasswordPage() {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setSuccess('')
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await forgotPassword(formData)
      if (result?.error) setError(result.error)
      if (result?.success) setSuccess(result.success)
    })
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Lupa Password</CardTitle>
        <CardDescription>Masukkan emailmu dan kami akan kirimkan link reset password</CardDescription>
      </CardHeader>
      <CardContent>
        {success ? (
          <div className="text-center space-y-3">
            <div className="text-4xl">📬</div>
            <p className="font-medium">Email terkirim!</p>
            <p className="text-sm text-muted-foreground">{success}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert className="text-sm text-destructive border-destructive/50 bg-destructive/10">
                {error}
              </Alert>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="email@contoh.com" required />
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Mengirim...' : 'Kirim Link Reset'}
            </Button>
          </form>
        )}
        <p className="text-center text-sm text-muted-foreground mt-6">
          <Link href="/auth/login" className="text-primary font-medium hover:underline">
            Kembali ke halaman masuk
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
