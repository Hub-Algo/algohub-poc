import classNames from 'classnames'

interface CardProps {
  children: React.ReactNode
  customClassName?: string
}

function Card({ children, customClassName }: CardProps) {
  return (
    <div className={classNames('card w-96 bg-card-bg shadow-xl px-6 py-5 border border-yellow-200', customClassName)}>
      <div className={'card-body'}>{children}</div>
    </div>
  )
}

export default Card
