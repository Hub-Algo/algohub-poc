const BASE = '/'

/*
 * === PROFILE ROUTES ===
 */
const PROFILE_ROUTE = 'profile/:walletAddress'
const PROFILE_FULL_PATH = `${BASE}${PROFILE_ROUTE}` as const

/*
 * === PROJECT DETAIL ROUTES ===
 */
const CAMPAIGN_DETAIL_ROUTE = 'campaign/:campaignId'
const CAMPAIGN_DETAIL_FULL_PATH = `${BASE}${CAMPAIGN_DETAIL_ROUTE}` as const

/*
 * === ABOUT ROUTES ===
 */
const ABOUT_ROUTE = 'about'
const ABOUT_FULL_PATH = `${BASE}${ABOUT_ROUTE}` as const

export default {
  BASE,
  PROFILE: {
    ROUTE: PROFILE_ROUTE,
    FULL_PATH: PROFILE_FULL_PATH,
  },
  PROJECT_DETAIL: {
    ROUTE: CAMPAIGN_DETAIL_ROUTE,
    FULL_PATH: CAMPAIGN_DETAIL_FULL_PATH,
  },
  ABOUT: {
    ROUTE: ABOUT_ROUTE,
    FULL_PATH: ABOUT_FULL_PATH,
  },
}
