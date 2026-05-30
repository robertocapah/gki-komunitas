'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { moderateItem } from '../actions'
import type { Campaign, Business, Job } from '@/types'

type Table = 'campaigns' | 'businesses' | 'jobs'

function formatRupiah(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

interface Props {
  item: Campaign | Business | Job
  table: Table
}

export function ModerationCard({ item, table }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [rejecting, setRejecting] = useState(false)
  const [reason, setReason] = useState('')
  const [done, setDone] = useState(false)
  const [isPending, startTransition] = useTransition()

  if (done) return null

  function getTitle() {
    if ('title' in item) return item.title
    if ('name' in item) return item.name
    return '-'
  }

  function getMeta() {
    if (table === 'campaigns') {
      const c = item as Campaign
      return `${c.category} · Target ${formatRupiah(c.target_amount)}`
    }
    if (table === 'businesses') {
      const b = item as Business
      return `${b.category} · WA: ${b.whatsapp}`
    }
    if (table === 'jobs') {
      const j = item as Job
      return `${j.category} · ${j.job_type} · ${j.location}`
    }
  }

  function getSubmitter() {
    if ('creator' in item) return (item.creator as any)?.full_name
    if ('owner' in item) return (item.owner as any)?.full_name
    if ('poster' in item) return (item.poster as any)?.full_name
    return '-'
  }

  function getBody() {
    if (table === 'campaigns') return (item as Campaign).story
    if (table === 'businesses') return (item as Business).description
    if (table === 'jobs') {
      const j = item as Job
      return `Deskripsi:\n${j.description}\n\nKualifikasi:\n${j.requirements}`
    }
  }

  function handleApprove() {
    startTransition(async () => {
      await moderateItem(table, item.id, 'active')
      setDone(true)
    })
  }

  function handleReject() {
    if (!rejecting) { setRejecting(true); return }
    startTransition(async () => {
      await moderateItem(table, item.id, 'rejected', reason)
      setDone(true)
    })
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="font-semibold truncate">{getTitle()}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{getMeta()}</p>
            <p className="text-xs text-muted-foreground">
              Oleh: <span className="font-medium">{getSubmitter()}</span> · {formatDate(item.created_at)}
            </p>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-muted-foreground hover:text-foreground transition-colors shrink-0 p-1"
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>

        {expanded && (
          <div className="mt-3 pt-3 border-t">
            <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground whitespace-pre-line max-h-48 overflow-y-auto leading-relaxed">
              {getBody()}
            </div>
          </div>
        )}

        {rejecting && (
          <div className="mt-3">
            <Textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Alasan penolakan (opsional, akan dikomunikasikan ke pengaju)..."
              rows={2}
              className="text-sm resize-none"
            />
          </div>
        )}

        <div className="flex gap-2 mt-3">
          <Button
            size="sm"
            onClick={handleApprove}
            disabled={isPending}
            className="gap-1.5"
          >
            <CheckCircle className="h-3.5 w-3.5" />
            Setujui
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={handleReject}
            disabled={isPending}
            className="gap-1.5"
          >
            <XCircle className="h-3.5 w-3.5" />
            {rejecting ? 'Konfirmasi Tolak' : 'Tolak'}
          </Button>
          {rejecting && (
            <Button size="sm" variant="ghost" onClick={() => { setRejecting(false); setReason('') }}>
              Batal
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
