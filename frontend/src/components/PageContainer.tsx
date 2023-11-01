import { ReactNode } from 'react'

interface PageProps {
  children: ReactNode
}

const PageContainer = ({ children }: PageProps) => {
  return <div className="px-10 xl:px-36 bg-gray-950">{children}</div>
}

export default PageContainer
