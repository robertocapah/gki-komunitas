import Link from 'next/link'
import { Heart } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 px-4 py-12">
      <Link href="/" className="flex items-center gap-2 font-semibold text-primary mb-8">
        <Heart className="h-5 w-5 fill-primary" />
        GKI Kelapa Cengkir
      </Link>
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  )
}
