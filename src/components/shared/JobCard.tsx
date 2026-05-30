import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Clock } from 'lucide-react'
import type { Job } from '@/types'

const jobTypeLabel: Record<string, string> = {
  'full-time': 'Full Time',
  'part-time': 'Part Time',
  'freelance': 'Freelance',
  'internship': 'Magang',
}

function formatRupiah(amount: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount)
}

interface Props {
  job: Job
}

export function JobCard({ job }: Props) {
  const salaryText = job.salary_min && job.salary_max
    ? `${formatRupiah(job.salary_min)} – ${formatRupiah(job.salary_max)}`
    : job.salary_min
      ? `Mulai ${formatRupiah(job.salary_min)}`
      : 'Gaji negotiable'

  return (
    <Link href={`/lowongan/${job.slug}`}>
      <Card className="group hover:shadow-md transition-shadow h-full">
        <CardContent className="p-5 flex flex-col gap-3 h-full">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h3 className="font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                {job.title}
              </h3>
              {job.business && (
                <p className="text-sm text-muted-foreground mt-0.5">{job.business.name}</p>
              )}
            </div>
            <Badge variant="outline" className="shrink-0 text-xs">
              {jobTypeLabel[job.job_type]}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {job.location}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {job.category}
            </span>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>

          <p className="text-sm font-medium text-primary mt-auto">{salaryText}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
