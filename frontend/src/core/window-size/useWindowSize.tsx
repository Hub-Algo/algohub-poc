import { useEffect, useState } from 'react'

import { initialWindowSizeState } from './WindowSizeContext'
import useOnWindowResize from './useOnWindowResize'
import { isMidRangeScreen, isSmallScreen, isXSmallScreen, isXXSmallScreen } from './util/windowSizeUtils'

function useWindowSize() {
  const [windowSize, setWindowSize] = useState(initialWindowSizeState)

  useOnWindowResize(() => {
    const { innerHeight } = window
    const { clientWidth, clientHeight } = document.documentElement

    setWindowSize({
      currentWidth: clientWidth,
      currentHeight: clientHeight,
      innerHeight,
      isSmallScreen: isSmallScreen(clientWidth),
      isXSmallScreen: isXSmallScreen(clientWidth),
      isXXSmallScreen: isXXSmallScreen(clientWidth),
      isMidRangeScreen: isMidRangeScreen(clientWidth),
    })
  })

  // Mobile vh unit hack: See https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
  useEffect(() => {
    // a vh unit is equal to 1% of the screen height
    const vh = windowSize.innerHeight * 0.01

    document.documentElement.style.setProperty('--vh', `${vh}px`)
  }, [windowSize.innerHeight])

  return windowSize
}

export default useWindowSize

/* eslint
    no-magic-numbers: "off"
*/
