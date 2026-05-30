import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import { Heart, LayoutDashboard, CheckSquare, LogOut } from 'lucide-react'
import { logout } from '@/app/auth/actions'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured()) redirect('/')
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('role, full_name').eq('id', user.id).single()
  if (!profile || !['admin', 'moderator'].includes(profile.role)) redirect('/')

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/moderasi', label: 'Moderasi', icon: CheckSquare },
  ]

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-56 border-r bg-white flex flex-col shrink-0">
        <div className="h-14 flex items-center px-4 border-b">
          <Link href="/" className="flex items-center gap-2 text-primary font-semibold text-sm">
            <Heart className="h-4 w-4 fill-primary" />
            GKI KC Admin
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t">
          <div className="px-3 py-2 text-xs text-muted-foreground mb-1">
            <p className="font-medium text-foreground">{profile.full_name}</p>
            <p className="capitalize">{profile.role}</p>
          </div>
          <form action={logout}>
            <button type="submit" className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:bg-muted rounded-lg transition-colors">
              <LogOut className="h-4 w-4" />
              Keluar
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen bg-muted/30">
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
