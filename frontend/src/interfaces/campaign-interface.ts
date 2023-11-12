export interface CampaignInterface {
  campaign_id: string
  campaign_title: string
  campaign_subtitle: string
  creator_address: string
  campaign_status: 'new' | 'pending' | 'completed'
  campaign_category: string
  ido_token: number
  start_date: string
  end_date: string
  hard_goal: number
  invested_amount: number
  soft_goal: null | number
  max_allocation: number
  campaign_media: string[]
}
