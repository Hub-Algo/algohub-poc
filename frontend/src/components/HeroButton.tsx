import classNames from 'classnames'

type HeroButtonProps = Omit<React.LinkHTMLAttributes<HTMLAnchorElement>, 'className' | 'children'> & {
  children: React.ReactNode
  customClassName?: string
}

function HeroButton({ children, customClassName, ...otherProps }: HeroButtonProps) {
  return (
    <a
      className={classNames(
        customClassName,
        'h-64',
        'btn',
        'no-animation',
        'p-0',
        'rounded-3xl',
        'relative',
        'border-2',
        'border-orange-500',
        'bg-gray-900',
        'hover:bg-orange-500',
        'hover:first:border',
        'hover:border-orange-500',
      )}
      {...otherProps}
    >
      <div className={'absolute bg-gray-900 top-0 left-0 right-5 bottom-5 rounded-3xl border-black'}></div>
      <div className={'z-10 text-orange-500'}>{children}</div>
    </a>
  )
}

export default HeroButton
