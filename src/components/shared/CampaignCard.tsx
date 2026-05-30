import Link from 'next/link'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent } from '@/components/ui/card'
import type { Campaign } from '@/types'

function formatRupiah(amount: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount)
}

const categoryColors: Record<string, string> = {
  'Bantuan Medis': 'bg-red-100 text-red-700',
  'Bantuan Pendidikan': 'bg-blue-100 text-blue-700',
  'Bantuan Musibah': 'bg-orange-100 text-orange-700',
  'Misi & Pelayanan': 'bg-purple-100 text-purple-700',
}

interface Props {
  campaign: Campaign
}

export function CampaignCard({ campaign }: Props) {
  const percent = Math.min(Math.round((campaign.collected_amount / campaign.target_amount) * 100), 100)
  const colorClass = categoryColors[campaign.category] ?? 'bg-gray-100 text-gray-700'

  return (
    <Link href={`/galang-dana/${campaign.slug}`}>
      <Card className="group hover:shadow-md transition-shadow overflow-hidden h-full">
        <div className="aspect-[16/9] bg-muted overflow-hidden">
          {campaign.image_url ? (
            <img
              src={campaign.image_url}
              alt={campaign.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
              Tidak ada foto
            </div>
          )}
        </div>
        <CardContent className="p-4 flex flex-col gap-3">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full w-fit ${colorClass}`}>
            {campaign.category}
          </span>
          <h3 className="font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {campaign.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{campaign.description}</p>
          <div className="mt-auto space-y-1.5">
            <Progress value={percent} className="h-1.5" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{formatRupiah(campaign.collected_amount)}</span>
              <span>{percent}% dari {formatRupiah(campaign.target_amount)}</span>
            </div>
            <p className="text-xs text-muted-foreground">{campaign.donor_count} donatur</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
