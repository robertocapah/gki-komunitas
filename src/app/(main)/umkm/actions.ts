'use server'

import { revalidatePath } from 'next/cache'
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

export async function daftarkanUsaha(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Kamu harus login terlebih dahulu.' }

  const { data: profile } = await supabase.from('profiles').select('is_verified').eq('id', user.id).single()
  if (!profile?.is_verified) return { error: 'Akunmu belum diverifikasi oleh pengurus gereja.' }

  const name = formData.get('name') as string
  const { error } = await supabase.from('businesses').insert({
    owner_id: user.id,
    name,
    slug: slugify(name),
    description: formData.get('description') as string,
    category: formData.get('category') as string,
    whatsapp: formData.get('whatsapp') as string,
    address: formData.get('address') as string || null,
    image_urls: [],
    status: 'pending',
  })

  if (error) return { error: 'Terjadi kesalahan, coba lagi.' }

  revalidatePath('/umkm')
  return { success: 'Usaha berhasil didaftarkan! Menunggu persetujuan pengurus.' }
}
