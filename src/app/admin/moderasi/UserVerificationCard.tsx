'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, User } from 'lucide-react'
import { verifyUser } from '../actions'
import type { Profile } from '@/types'

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function UserVerificationCard({ user }: { user: Profile }) {
  const [done, setDone] = useState(false)
  const [isPending, startTransition] = useTransition()

  if (done) return null

  function handleVerify() {
    startTransition(async () => {
      await verifyUser(user.id, true)
      setDone(true)
    })
  }

  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
          {user.full_name?.charAt(0)?.toUpperCase() ?? <User className="h-4 w-4" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{user.full_name}</p>
          <p className="text-xs text-muted-foreground">Daftar {formatDate(user.created_at)}</p>
        </div>
        <Button size="sm" onClick={handleVerify} disabled={isPending} className="gap-1.5 shrink-0">
          <CheckCircle className="h-3.5 w-3.5" />
          Verifikasi
        </Button>
      </CardContent>
    </Card>
  )
}
