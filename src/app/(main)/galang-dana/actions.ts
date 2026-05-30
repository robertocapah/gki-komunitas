'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    + '-' + Date.now()
}

export async function ajukanKampanye(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Kamu harus login terlebih dahulu.' }

  const { data: profile } = await supabase.from('profiles').select('is_verified').eq('id', user.id).single()
  if (!profile?.is_verified) return { error: 'Akunmu belum diverifikasi oleh pengurus gereja.' }

  const title = formData.get('title') as string
  const { error } = await supabase.from('campaigns').insert({
    creator_id: user.id,
    title,
    slug: slugify(title),
    description: formData.get('description') as string,
    story: formData.get('story') as string,
    category: formData.get('category') as string,
    target_amount: parseInt(formData.get('target_amount') as string),
    end_date: formData.get('end_date') || null,
    status: 'pending',
  })

  if (error) return { error: 'Terjadi kesalahan, coba lagi.' }

  revalidatePath('/galang-dana')
  return { success: 'Kampanye berhasil diajukan! Menunggu persetujuan pengurus.' }
}

export async function donasiKampanye(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const campaignId = formData.get('campaign_id') as string
  const amount = parseInt(formData.get('amount') as string)
  const donorName = formData.get('donor_name') as string
  const message = formData.get('message') as string || null
  const isAnonymous = formData.get('is_anonymous') === 'on'

  if (amount < 1000) return { error: 'Minimal donasi Rp 1.000.' }

  const orderId = `GKI-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`

  const { data: donation, error } = await supabase.from('donations').insert({
    campaign_id: campaignId,
    donor_id: user?.id ?? null,
    donor_name: isAnonymous ? 'Anonim' : donorName,
    amount,
    message,
    is_anonymous: isAnonymous,
    status: 'pending',
    midtrans_order_id: orderId,
  }).select().single()

  if (error) return { error: 'Terjadi kesalahan, coba lagi.' }

  return { orderId, donationId: donation.id, amount }
}
