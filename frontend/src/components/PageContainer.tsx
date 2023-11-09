import classNames from 'classnames'
import { ReactNode } from 'react'

interface PageProps {
  children: ReactNode
  customClassName?: string
}

const PageContainer = ({ children, customClassName }: PageProps) => {
  return <div className={classNames('flex flex-col px-10 xl:px-36 bg-gray-900 gap-10', customClassName)}>{children}</div>
}

export default PageContainer
