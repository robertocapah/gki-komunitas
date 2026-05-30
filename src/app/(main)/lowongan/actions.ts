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

export async function postingLowongan(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Kamu harus login terlebih dahulu.' }

  const { data: profile } = await supabase.from('profiles').select('is_verified').eq('id', user.id).single()
  if (!profile?.is_verified) return { error: 'Akunmu belum diverifikasi oleh pengurus gereja.' }

  const title = formData.get('title') as string
  const salaryMin = formData.get('salary_min') ? parseInt(formData.get('salary_min') as string) : null
  const salaryMax = formData.get('salary_max') ? parseInt(formData.get('salary_max') as string) : null
  const expiresAt = formData.get('expires_at')
    ? new Date(formData.get('expires_at') as string).toISOString()
    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

  const { error } = await supabase.from('jobs').insert({
    poster_id: user.id,
    title,
    slug: slugify(title),
    description: formData.get('description') as string,
    requirements: formData.get('requirements') as string,
    category: formData.get('category') as string,
    job_type: formData.get('job_type') as string,
    location: formData.get('location') as string,
    salary_min: salaryMin,
    salary_max: salaryMax,
    contact_info: formData.get('contact_info') as string,
    expires_at: expiresAt,
    status: 'pending',
  })

  if (error) return { error: 'Terjadi kesalahan, coba lagi.' }

  revalidatePath('/lowongan')
  return { success: 'Lowongan berhasil diposting! Menunggu persetujuan pengurus.' }
}
