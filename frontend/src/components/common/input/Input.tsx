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
        <label className="label text-gray-100">
          <span className="text-gray-100">{labels.inputTitle}</span>
        </label>
      )}

      <input
        className={classNames(
          'input input-bordered w-full text-gray-100 bg-gray-950 border-px border-gray-800 focus:border-orange-500 transition-all',
        )}
        {...rest}
      />

      {labels?.bottomText && (
        <label className="label text-gray-100">
          <span className="text-gray-100">{labels.bottomText}</span>
        </label>
      )}
    </div>
  )
}

export default Input
