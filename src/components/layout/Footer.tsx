import Link from 'next/link'
import { Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-muted/40 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 font-semibold text-primary mb-3">
              <Heart className="h-5 w-5 fill-primary" />
              <span>GKI Kelapa Cengkir</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Platform komunitas jemaat untuk saling tolong-menolong dalam iman, usaha, dan pekerjaan.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/galang-dana" className="hover:text-foreground transition-colors">Galang Dana</Link></li>
              <li><Link href="/umkm" className="hover:text-foreground transition-colors">Usaha Jemaat</Link></li>
              <li><Link href="/lowongan" className="hover:text-foreground transition-colors">Lowongan Kerja</Link></li>
              <li><Link href="/cara-kerja" className="hover:text-foreground transition-colors">Cara Kerja</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">Akun</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/auth/register" className="hover:text-foreground transition-colors">Daftar Jemaat</Link></li>
              <li><Link href="/auth/login" className="hover:text-foreground transition-colors">Masuk</Link></li>
              <li>
                <a
                  href="https://gkikelapacengkir.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  Website Gereja ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} GKI Kelapa Cengkir. Dibuat dengan kasih.</p>
          <p>Platform komunitas internal jemaat</p>
        </div>
      </div>
    </footer>
  )
}
