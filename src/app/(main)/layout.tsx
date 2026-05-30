import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { createClient } from '@/lib/supabase/server'

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  let user = null

  try {
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (authUser) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', authUser.id)
        .single()
      user = { id: authUser.id, email: authUser.email, full_name: profile?.full_name ?? null }
    }
  } catch {}

  return (
    <div className="flex flex-col min-h-full">
      <Navbar user={user} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
