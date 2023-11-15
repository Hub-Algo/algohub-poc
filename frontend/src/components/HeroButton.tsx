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
        'group',
        'btn',
        'transition-all',
        'p-0',
        'rounded-xl',
        'relative',
        'border-2',
        'border-orange-500',
        'bg-gray-900',
        'hover:border-4',
        'hover:bg-gray-950',
        'hover:border-orange-500',
      )}
      {...otherProps}
    >
      <div className={'z-10 text-orange-500 border-b-2 border-t-2 border-transparent p-2 group-hover:border-orange-500 transition-all'}>
        {children}
      </div>
    </a>
  )
}

export default HeroButton
