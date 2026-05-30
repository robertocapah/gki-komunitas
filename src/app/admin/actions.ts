'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

type Table = 'campaigns' | 'businesses' | 'jobs'
type ModerationStatus = 'active' | 'rejected'

export async function moderateItem(table: Table, id: string, status: ModerationStatus, reason?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || !['admin', 'moderator'].includes(profile.role)) return { error: 'Forbidden' }

  const update: Record<string, string> = { status }
  if (status === 'rejected' && reason) update.rejection_reason = reason

  const { error } = await supabase.from(table).update(update).eq('id', id)
  if (error) return { error: 'Gagal memperbarui status.' }

  revalidatePath('/admin/moderasi')
  revalidatePath('/admin')
  return { success: true }
}

export async function verifyUser(userId: string, verified: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { error: 'Hanya admin yang bisa memverifikasi jemaat.' }

  const { error } = await supabase.from('profiles').update({ is_verified: verified }).eq('id', userId)
  if (error) return { error: 'Gagal memperbarui status verifikasi.' }

  revalidatePath('/admin/moderasi')
  return { success: true }
}
