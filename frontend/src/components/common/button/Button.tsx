import classNames from 'classnames'

type ButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'disabled' | 'className'> & {
  size?: 'sm' | 'md' | 'lg'
  isDisabled?: boolean
  shouldDisplaySpinner?: boolean
  customClassName?: string
  buttonColor?: 'primary' | 'secondary' | 'accent' | 'neutral' | 'orange' | 'white' | 'ghost' | 'transparent'
  buttonType?: 'outline' | 'default'
}

const Button = ({
  children,
  size = 'sm',
  shouldDisplaySpinner,
  isDisabled,
  customClassName,
  buttonColor = 'primary',
  buttonType = 'default',
  ...rest
}: ButtonProps) => {
  const buttonColorClassName = getButtonColorClassName(buttonColor)
  const buttonTypeClassName = getButtonTypeClassName(buttonType)

  return (
    <button
      className={classNames(
        'btn',
        `btn-${size}`,
        buttonColorClassName,
        buttonTypeClassName,
        { 'btn-disabled': isDisabled },
        customClassName,
      )}
      aria-disabled={isDisabled || shouldDisplaySpinner}
      {...rest}
    >
      {shouldDisplaySpinner ? <div className={'invisible'}>{children}</div> : children}

      {shouldDisplaySpinner && <span className={'loading loading-spinner absolute mx-auto'} />}
    </button>
  )

  function getButtonTypeClassName(buttonType: NonNullable<ButtonProps['buttonType']>) {
    switch (buttonType) {
      case 'outline':
        return 'btn-outline'

      case 'default':
      default:
        return 'border-0'
    }
  }

  function getButtonColorClassName(buttonColor: NonNullable<ButtonProps['buttonColor']>) {
    switch (buttonColor) {
      case 'accent':
        return 'btn-accent'

      case 'secondary':
        return 'btn-secondary'

      case 'neutral':
        return 'btn-neutral'

      case 'orange':
        return 'bg-orange-500 text-gray-100 hover:bg-orange-600 hover:text-gray-100 active:bg-orange-600'

      case 'white':
        return 'bg-base-100 text-black'

      case 'ghost':
        return 'btn-ghost'

      case 'primary':
      default:
        return 'btn-primary'

      case 'transparent':
        return 'bg-transparent text-white'
    }
  }
}

export default Button
