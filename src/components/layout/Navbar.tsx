'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { Menu, X, Heart, User, LogOut, ChevronDown } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { logout } from '@/app/auth/actions'

const navLinks = [
  { href: '/galang-dana', label: 'Galang Dana' },
  { href: '/umkm', label: 'Usaha Jemaat' },
  { href: '/lowongan', label: 'Lowongan Kerja' },
]

interface NavbarProps {
  user?: { id: string; email?: string | null; full_name?: string | null } | null
}

export function Navbar({ user }: NavbarProps) {
  const [open, setOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleLogout() {
    startTransition(async () => {
      await logout()
    })
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold text-primary">
          <Heart className="h-5 w-5 fill-primary" />
          <span>GKI Kelapa Cengkir</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <User className="h-4 w-4" />
                </div>
                <span className="max-w-[120px] truncate">{user.full_name ?? user.email}</span>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-white border rounded-lg shadow-lg py-1 z-10">
                  <Link
                    href="/profil"
                    className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    Profil Saya
                  </Link>
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    disabled={isPending}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    {isPending ? 'Keluar...' : 'Keluar'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/auth/login" className={buttonVariants({ variant: 'ghost' })}>
                Masuk
              </Link>
              <Link href="/auth/register" className={buttonVariants()}>
                Daftar
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden p-2 rounded-md hover:bg-muted transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t bg-white px-4 py-4 flex flex-col gap-4">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-2 border-t">
            {user ? (
              <>
                <Link href="/profil" className={cn(buttonVariants({ variant: 'outline' }))} onClick={() => setOpen(false)}>
                  Profil Saya
                </Link>
                <button
                  onClick={handleLogout}
                  disabled={isPending}
                  className={cn(buttonVariants({ variant: 'ghost' }), 'text-destructive hover:text-destructive')}
                >
                  {isPending ? 'Keluar...' : 'Keluar'}
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className={buttonVariants({ variant: 'outline' })}>
                  Masuk
                </Link>
                <Link href="/auth/register" className={buttonVariants()}>
                  Daftar Sebagai Jemaat
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
