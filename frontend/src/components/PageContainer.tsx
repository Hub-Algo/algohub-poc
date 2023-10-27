import { ReactNode } from 'react'

interface PageProps {
  children: ReactNode
}

const PageContainer = ({ children }: PageProps) => {
  return <div className="mt-16">{children}</div>
}

export default PageContainer
