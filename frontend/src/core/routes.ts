const BASE = '/'

/*
 * === PROFILE ROUTES ===
 */
const PROFILE_ROUTE = 'profile/:walletAddress'
const PROFILE_FULL_PATH = `${BASE}${PROFILE_ROUTE}` as const

/*
 * === PROJECT DETAIL ROUTES ===
 */
const PROJECT_DETAIL_ROUTE = 'project/:projectId'
const PROJECT_DETAIL_FULL_PATH = `${BASE}${PROJECT_DETAIL_ROUTE}` as const

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
    ROUTE: PROJECT_DETAIL_ROUTE,
    FULL_PATH: PROJECT_DETAIL_FULL_PATH,
  },
  ABOUT: {
    ROUTE: ABOUT_ROUTE,
    FULL_PATH: ABOUT_FULL_PATH,
  },
}
