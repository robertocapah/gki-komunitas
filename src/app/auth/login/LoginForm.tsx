'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Alert } from '@/components/ui/alert'
import { login } from '../actions'

export function LoginForm() {
  const searchParams = useSearchParams()
  const [error, setError] = useState(searchParams.get('error') ?? '')
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await login(formData)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Masuk</CardTitle>
        <CardDescription>Masuk ke akun jemaat kamu</CardDescription>
      </CardHeader>
      <CardContent>
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
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="/auth/lupa-password" className="text-xs text-primary hover:underline">
                Lupa password?
              </Link>
            </div>
            <Input id="password" name="password" type="password" placeholder="••••••••" required />
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Memproses...' : 'Masuk'}
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground mt-6">
          Belum punya akun?{' '}
          <Link href="/auth/register" className="text-primary font-medium hover:underline">
            Daftar di sini
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
