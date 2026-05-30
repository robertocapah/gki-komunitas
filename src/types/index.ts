export type UserRole = 'jemaat' | 'moderator' | 'admin'
export type CampaignStatus = 'pending' | 'active' | 'completed' | 'rejected'
export type BusinessStatus = 'pending' | 'active' | 'rejected'
export type JobStatus = 'pending' | 'active' | 'closed' | 'rejected'
export type JobType = 'full-time' | 'part-time' | 'freelance' | 'internship'
export type DonationStatus = 'pending' | 'paid' | 'failed' | 'cancelled'

export interface Profile {
  id: string
  full_name: string
  phone: string | null
  avatar_url: string | null
  role: UserRole
  is_verified: boolean
  created_at: string
}

export interface Campaign {
  id: string
  creator_id: string
  title: string
  slug: string
  description: string
  story: string
  category: string
  target_amount: number
  collected_amount: number
  donor_count: number
  image_url: string | null
  status: CampaignStatus
  end_date: string | null
  created_at: string
  updated_at: string
  creator?: Profile
}

export interface Donation {
  id: string
  campaign_id: string
  donor_id: string | null
  donor_name: string
  amount: number
  message: string | null
  is_anonymous: boolean
  status: DonationStatus
  payment_token: string | null
  created_at: string
  campaign?: Campaign
}

export interface Business {
  id: string
  owner_id: string
  name: string
  slug: string
  description: string
  category: string
  whatsapp: string
  address: string | null
  image_urls: string[]
  status: BusinessStatus
  created_at: string
  updated_at: string
  owner?: Profile
}

export interface Job {
  id: string
  poster_id: string
  business_id: string | null
  title: string
  slug: string
  description: string
  requirements: string
  category: string
  job_type: JobType
  location: string
  salary_min: number | null
  salary_max: number | null
  contact_info: string
  status: JobStatus
  expires_at: string | null
  created_at: string
  updated_at: string
  poster?: Profile
  business?: Business
}
