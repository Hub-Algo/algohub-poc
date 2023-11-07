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
    <div className="form-control w-full max-w-xs">
      {labels?.inputTitle && (
        <label className="label">
          <span className="label-text">{labels.inputTitle}</span>
        </label>
      )}

      <input className={classNames('input input-bordered w-full max-w-xs', customClassName)} {...rest} />

      {labels?.bottomText && (
        <label className="label">
          <span className="label-text-alt">{labels.bottomText}</span>
        </label>
      )}
    </div>
  )
}

export default Input
