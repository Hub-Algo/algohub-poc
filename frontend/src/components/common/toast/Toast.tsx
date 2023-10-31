import { BiX } from 'react-icons/bi'
import { Fragment, useEffect, useLayoutEffect, useState } from 'react'

import Button from '../button/Button'
import classNames from 'classnames'

interface ToastProps {
  children: React.ReactNode
  id?: string
  type?: 'success' | 'warning' | 'error'
}

function Toast({ children, type, id }: ToastProps) {
  const [shouldDisplay, setShouldDisplay] = useState(Boolean(children))

  useEffect(() => {
    setShouldDisplay(Boolean(children))
  }, [children])

  useLayoutEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null

    if (children) {
      timeoutId = setTimeout(() => {
        setShouldDisplay(false)
      }, 10000)
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [children])

  return shouldDisplay ? (
    <div className="toast gap-0" id={id}>
      <Button
        onClick={handleCloseToast}
        buttonType={'outline'}
        buttonColor={'white'}
        customClassName={'btn-square btn-xs absolute right-2 top-0'}
      >
        {<BiX />}
      </Button>

      <div
        className={classNames('alert', 'max-w-prose', 'flex', 'flex-wrap', 'border-1', 'border-black', {
          'border-green-500': type === 'success',
          'border-yellow-500': type === 'warning',
          'border-rose-500': type === 'error',
        })}
      >
        <span>{children}</span>
      </div>
    </div>
  ) : (
    <Fragment />
  )

  function handleCloseToast() {
    setShouldDisplay(false)
  }
}

export default Toast
