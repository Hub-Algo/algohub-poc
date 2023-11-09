import {
  CampaignApplicationCompanyRegistrationInfo,
  CampaignApplicationContactInfo,
  CampaignApplicationFormView,
  CampaignApplicationFundRaisingGoal,
  CampaignApplicationProductDocumentation,
  CampaignApplicationProductOverview,
  CampaignApplicationTeamInfo,
} from './CampaignApplicationForm.types'

const CAMPAIGN_APPLICATION_FORM_STATES = Object.values(CampaignApplicationFormView)

const INITIAL_CAMPAIGN_APPLICATION_CONTACT_INFO: NonNullable<CampaignApplicationContactInfo> = {
  name: '',
  surname: '',
  role: '',
  email: '',
}

const INITIAL_CAMPAIGN_APPLICATION_TEAM_INFO: NonNullable<CampaignApplicationTeamInfo> = {
  employeeNumber: 0,
  founder: '',
}

const INITIAL_CAMPAIGN_APPLICATION_COMPANY_REGISTRATION_INFO: NonNullable<CampaignApplicationCompanyRegistrationInfo> = {
  registeredCompanyName: '',
  dateOfRegistration: '',
  countryOfRegistration: '',
  chamberOfCommerceRegistrationNumber: 0,
}

const INITIAL_CAMPAIGN_APPLICATION_PRODUCT_OVERVIEW: CampaignApplicationProductOverview = {
  productName: '',
  marketType: 'other',
  website: '',
  github: '',
  xAccount: '',
  discordServer: '',
  elevatorPitch: '',
}

const CAMPAIGN_APPLICATION_MARKET_TYPES: CampaignApplicationProductOverview['marketType'][] = [
  'consumer',
  'defi',
  'gamefi',
  'impact',
  'infrastructure',
  'interoperability',
  'nft',
  'other',
]

const CAMPAIGN_APPLICATION_RAISED_FUNDS_RANGE = [
  'No',
  'Yes, currently ongoing',
  '0 - 500,000 USD',
  '500,000 - 1,000,000 USD',
  '1,000,000 - 1,500,000 USD',
  '1,500,000 - 2,000,000 USD',
  '2,000,000 - 3,000,000 USD',
  'More than 3,000,000 USD',
]

const INITIAL_CAMPAIGN_APPLICATION_PRODUCT_DOCUMENTATION: CampaignApplicationProductDocumentation = {
  raisedFundsRange: '',
  roadmap: '',
  whitepaper: '',
  tokenVestingSchedule: '',
  assetId: 0,
  pitchDeck: '',
  hasConsentToInDepthInterview: false,
}

const INITIAL_CAMPAIGN_APPLICATION_FUND_RAISING_GOAL: CampaignApplicationFundRaisingGoal = {
  minAmount: 0,
  hasAgreedToAlgohubTermsOfService: false,
  hasConcentToApplicationFee: false,
  hasConcentToFundraiseFee: false,
  hasConfirmedDataAccuracy: false,
  intention: '',
  financialPlan: '',
}

export {
  CAMPAIGN_APPLICATION_FORM_STATES,
  INITIAL_CAMPAIGN_APPLICATION_CONTACT_INFO,
  INITIAL_CAMPAIGN_APPLICATION_TEAM_INFO,
  INITIAL_CAMPAIGN_APPLICATION_COMPANY_REGISTRATION_INFO,
  INITIAL_CAMPAIGN_APPLICATION_PRODUCT_OVERVIEW,
  CAMPAIGN_APPLICATION_MARKET_TYPES,
  CAMPAIGN_APPLICATION_RAISED_FUNDS_RANGE,
  INITIAL_CAMPAIGN_APPLICATION_PRODUCT_DOCUMENTATION,
  INITIAL_CAMPAIGN_APPLICATION_FUND_RAISING_GOAL,
}
