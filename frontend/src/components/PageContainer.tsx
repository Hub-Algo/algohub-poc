import { ReactNode } from 'react'

interface PageProps {
  children: ReactNode
}

const PageContainer = ({ children }: PageProps) => {
  return <div className="flex flex-col px-10 xl:px-36 bg-gray-900 gap-10">{children}</div>
}

export default PageContainer
