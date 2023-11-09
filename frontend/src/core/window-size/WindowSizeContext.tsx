import React, { useContext } from 'react'

import useWindowSize from './useWindowSize'
import {
  isSmallScreen as isOnSmallScreen,
  isXSmallScreen as isOnXSmallScreen,
  isXXSmallScreen as isOnXXSmallScreen,
  isMidRangeScreen as isOnMidRangeScreen,
} from './util/windowSizeUtils'

const initialWindowSizeState = {
  currentWidth: window.innerWidth,
  currentHeight: window.innerHeight,
  innerHeight: window.innerHeight,
  isSmallScreen: isOnSmallScreen(window.innerWidth),
  isXSmallScreen: isOnXSmallScreen(window.innerWidth),
  isXXSmallScreen: isOnXXSmallScreen(window.innerWidth),
  isMidRangeScreen: isOnMidRangeScreen(window.innerWidth),
}

const WindowSizeContext = React.createContext(initialWindowSizeState)

WindowSizeContext.displayName = 'WindowSizeContext'

interface WindowSizeContextProviderProps {
  children: React.ReactNode
}

function WindowSizeContextProvider({ children }: WindowSizeContextProviderProps) {
  return <WindowSizeContext.Provider value={useWindowSize()}>{children}</WindowSizeContext.Provider>
}

function useWindowSizeContext() {
  return useContext(WindowSizeContext)
}

export { WindowSizeContext, useWindowSizeContext, initialWindowSizeState, WindowSizeContextProvider }
