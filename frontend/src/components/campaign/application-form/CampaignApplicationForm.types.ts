export enum CampaignApplicationFormView {
  ContactInfo = 'contact-info',
  TeamInfo = 'team-info',
  CompanyRegistrationInfo = 'company-registration-info',
  ProductOverview = 'product-overview',
  ProductDocumentation = 'product-documentation',
  FundraisingGoal = 'fundraising-goal',
}

export type CampaignApplicationContactInfo = {
  name: string
  surname: string
  role: string
  email: string
  discord?: string
  twitter?: string
  telegram?: string
}

export type CampaignApplicationTeamInfo = {
  employeeNumber: number
  founder: string
  cofounder?: string
}

export type CampaignApplicationCompanyRegistrationInfo = {
  registeredCompanyName: string
  dateOfRegistration: string
  countryOfRegistration: string
  chamberOfCommerceRegistrationNumber: number
}

export type CampaignApplicationProductOverview = {
  productName: string
  marketType: 'consumer' | 'defi' | 'gamefi' | 'impact' | 'infrastructure' | 'interoperability' | 'nft' | 'other'
  website: string
  github: string
  xAccount: string
  discordServer: string
  elevatorPitch: string
  telegram?: string
}

export type CampaignApplicationProductDocumentation = {
  raisedFundsRange: string
  roadmap: string
  whitepaper: string
  tokenVestingSchedule: string
  assetId: number
  pitchDeck: string
  hasConsentToInDepthInterview: boolean
  appId?: string
  auditReport?: string
}

export type CampaignApplicationFundRaisingGoal = {
  minAmount: number
  intention: string
  financialPlan: string
  hasConcentToApplicationFee: boolean
  hasConcentToFundraiseFee: boolean
  hasAgreedToAlgohubTermsOfService: boolean
  hasConfirmedDataAccuracy: boolean
  maxAmount?: number
}

export type CampaignApplicationFormData =
  | ({
      type: CampaignApplicationFormView.ContactInfo
    } & CampaignApplicationContactInfo)
  | ({
      type: CampaignApplicationFormView.TeamInfo
    } & CampaignApplicationTeamInfo)
  | ({
      type: CampaignApplicationFormView.CompanyRegistrationInfo
    } & CampaignApplicationCompanyRegistrationInfo)
  | ({ type: CampaignApplicationFormView.ProductOverview } & CampaignApplicationProductOverview)
  | ({ type: CampaignApplicationFormView.ProductDocumentation } & CampaignApplicationProductDocumentation)
  | ({ type: CampaignApplicationFormView.FundraisingGoal } & CampaignApplicationFundRaisingGoal)
