import classNames from 'classnames'

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'> & {
  labels?: {
    inputTitle?: string
    bottomText?: string
  }
  isDisabled?: boolean
  customClassName?: string
}

function Input({ labels, isDisabled, customClassName, ...rest }: InputProps) {
  return (
    <div className={classNames('form-control w-full', customClassName)}>
      {labels?.inputTitle && (
        <label className="label">
          <span className="label-text">{labels.inputTitle}</span>
        </label>
      )}

      <input className={classNames('input input-bordered w-full')} {...rest} />

      {labels?.bottomText && (
        <label className="label">
          <span className="label-text-alt">{labels.bottomText}</span>
        </label>
      )}
    </div>
  )
}

export default Input
