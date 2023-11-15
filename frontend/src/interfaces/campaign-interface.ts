export interface CompanyRegistrationInfo {
  registeredCompanyName: string
  dateOfRegistration: string
  countryOfRegistration: string
  chamberOfCommerceRegistrationNumber: number
}

export interface TeamInfo {
  employeeNumber: number
  founder: string
}

export interface ProductOverview {
  productName: string
  marketType: string
  website: string
  github: string
  xAccount: string
  discordServer: string
  elevatorPitch: string
  telegram: string
}

export interface ProductDocumentation {
  raisedFundsRange: string
  roadmap: string
  whitepaper: string
  tokenVestingSchedule: string
  auditReport: string
  assetId: number
  pitchDeck: string
  hasConsentToInDepthInterview: boolean
}

export interface FundraisingGoal {
  minAmount: number
  hasAgreedToAlgohubTermsOfService: boolean
  hasConcentToApplicationFee: boolean
  hasConcentToFundraiseFee: boolean
  hasConfirmedDataAccuracy: boolean
  usdPricePerToken: string
  financialPlan: string
  maxAmount: number
}

export interface ContactInfo {
  name: string
  surname: string
  role: string
  email: string
}

export interface Records {
  companyRegistrationInfo: CompanyRegistrationInfo
  teamInfo: TeamInfo
  productOverview: ProductOverview
  productDocumentation: ProductDocumentation
  fundraisingGoal: FundraisingGoal
  contactInfo: ContactInfo
}

export interface Metadata {
  id: string
  private: boolean
  createdAt: string
}

export interface CampaignInterface {
  record: Records
  metadata: Metadata
}

export enum CampaignClientStatus {
  Vote = 'vote',
  Hypelist = 'hypelist',
  Whitelist = 'whitelist',
  Claim = 'claim',
  WithdrawInvestment = 'withdraw-investment',
}

export enum CampaignOwnerStatus {
  ClaimSales = 'claim-sales',
  WithdrawIdoAsa = 'withdraw-ido-asa',
}
