import {
  MID_RANGE_SCREEN_BREAKPOINT,
  SMALL_SCREEN_BREAKPOINT,
  XSMALL_SCREEN_BREAKPOINT,
  XXSMALL_SCREEN_BREAKPOINT,
} from './windowSizeConstants'

function isSmallScreen(width: number) {
  return width < SMALL_SCREEN_BREAKPOINT
}

function isXSmallScreen(width: number) {
  return width < XSMALL_SCREEN_BREAKPOINT
}

function isXXSmallScreen(width: number) {
  return width < XXSMALL_SCREEN_BREAKPOINT
}

function isMidRangeScreen(width: number) {
  return width < MID_RANGE_SCREEN_BREAKPOINT
}

export { isSmallScreen, isXXSmallScreen, isXSmallScreen, isMidRangeScreen }
